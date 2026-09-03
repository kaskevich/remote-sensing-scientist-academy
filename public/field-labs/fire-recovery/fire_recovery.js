// Northern Evia fire recovery — Sentinel-2 change detection
// Academy field lab. Replace the asset ID after uploading the bundled
// Copernicus EMSR527 observed-event GeoJSON to your Earth Engine project.

var config = {
  perimeterAsset: 'projects/your-project/assets/EMSR527_AOI01_DEL_MONIT03_observedEventA_r1_v1',
  collection: 'COPERNICUS/S2_SR_HARMONIZED',
  baselineYears: [2019, 2020],
  postFireYear: 2021,
  recoveryYears: [2022, 2023, 2024, 2025],
  trajectoryYears: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
  seasonStart: '-09-01',
  seasonEnd: '-10-16', // filterDate end is exclusive: includes 15 October.
  analysisScale: 20,   // NBR uses B12, whose native resolution is 20 m.
  maxSceneCloud: 80,
  minimumNbrChange: 0.05,
  exportFolder: 'northern_evia_fire_recovery'
};

var emsEvents = ee.FeatureCollection(config.perimeterAsset);
var firePerimeter = emsEvents.filter(ee.Filter.eq('notation', 'Burnt area'));
var aoi = firePerimeter.geometry();

function scaleReflectance(image) {
  var reflectance = image.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'])
    .multiply(0.0001);
  return image.addBands(reflectance, null, true);
}

function maskS2(image) {
  var scl = image.select('SCL');
  // Remove SCL 3 cloud shadow, 6 water for this terrestrial analysis,
  // 8/9 cloud, 10 cirrus and 11 snow/ice. Keep unclassified pixels visible
  // for QA rather than silently treating them as cloud-free evidence.
  var valid = scl.neq(3)
    .and(scl.neq(6))
    .and(scl.neq(8))
    .and(scl.neq(9))
    .and(scl.neq(10))
    .and(scl.neq(11));
  return scaleReflectance(image).updateMask(valid)
    .copyProperties(image, ['system:time_start', 'CLOUDY_PIXEL_PERCENTAGE']);
}

function addIndices(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var nbr = image.normalizedDifference(['B8', 'B12']).rename('NBR');
  return image.addBands([ndvi, nbr]);
}

function seasonalComposite(year) {
  var start = ee.Date(String(year) + config.seasonStart);
  var end = ee.Date(String(year) + config.seasonEnd);
  var collection = ee.ImageCollection(config.collection)
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', config.maxSceneCloud))
    .map(maskS2);
  var composite = addIndices(collection.median().clip(aoi));
  var validCount = collection.select('B8').count().rename('valid_count').clip(aoi);
  return composite.addBands(validCount).set({
    year: year,
    period: String(year) + '-09-01/' + String(year) + '-10-15',
    source_scene_count: collection.size()
  });
}

var pre2019 = seasonalComposite(2019);
var pre2020 = seasonalComposite(2020);
var pre = addIndices(ee.ImageCollection.fromImages([pre2019, pre2020])
  .select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'])
  .median()
  .clip(aoi)).set({period: '2019–2020 matched-season baseline'});
var post = seasonalComposite(config.postFireYear);

var dnbr = pre.select('NBR').subtract(post.select('NBR')).rename('dNBR');
var nbrDenominator = pre.select('NBR').subtract(post.select('NBR'));
var stableDenominator = nbrDenominator.abs().gte(config.minimumNbrChange);

function recoveryFraction(current) {
  return current.select('NBR')
    .subtract(post.select('NBR'))
    .divide(nbrDenominator)
    .updateMask(stableDenominator)
    .rename('NBR_recovery_fraction')
    .copyProperties(current, ['year', 'period', 'source_scene_count']);
}

var quantiles = dnbr.reduceRegion({
  reducer: ee.Reducer.percentile([33, 67]),
  geometry: aoi,
  scale: config.analysisScale,
  maxPixels: 1e9,
  tileScale: 4
});
var q33 = ee.Number(quantiles.get('dNBR_p33'));
var q67 = ee.Number(quantiles.get('dNBR_p67'));
var disturbanceStrata = dnbr.expression(
  'd <= low ? 1 : (d <= high ? 2 : 3)',
  {d: dnbr, low: q33, high: q67}
).rename('initial_change_stratum');

function summarisePeriod(image) {
  var year = ee.Number(image.get('year'));
  var recovery = recoveryFraction(image);
  var analysis = image.select(['NDVI', 'NBR']).addBands(recovery);
  var stats = analysis.reduceRegion({
    reducer: ee.Reducer.median()
      .combine(ee.Reducer.percentile([25, 75]), '', true),
    geometry: aoi,
    scale: config.analysisScale,
    maxPixels: 1e9,
    tileScale: 4
  });
  var validArea = ee.Image.pixelArea().updateMask(image.select('valid_count').gt(0))
    .reduceRegion({reducer: ee.Reducer.sum(), geometry: aoi,
      scale: config.analysisScale, maxPixels: 1e9, tileScale: 4})
    .getNumber('area');
  return ee.Feature(null, stats).set({
    year: year,
    period: image.get('period'),
    source_scene_count: image.get('source_scene_count'),
    valid_area_fraction: validArea.divide(aoi.area(1)),
    stratum: 'all burned-area pixels'
  });
}

function summariseStratum(image, stratumNumber, stratumLabel) {
  var recovery = recoveryFraction(image).updateMask(disturbanceStrata.eq(stratumNumber));
  var stats = recovery.reduceRegion({
    reducer: ee.Reducer.median()
      .combine(ee.Reducer.percentile([25, 75]), '', true),
    geometry: aoi,
    scale: config.analysisScale,
    maxPixels: 1e9,
    tileScale: 4
  });
  return ee.Feature(null, stats).set({
    year: image.get('year'),
    period: image.get('period'),
    stratum: stratumLabel
  });
}

// ImageCollection.map must return images. Build the table from the explicit
// year list because summarisePeriod returns a Feature.
var annualSummary = ee.FeatureCollection(config.trajectoryYears.map(function(year) {
  return summarisePeriod(seasonalComposite(year));
}));
var stratumSummary = ee.FeatureCollection(config.recoveryYears.map(function(year) {
  var image = seasonalComposite(year);
  return ee.FeatureCollection([
    summariseStratum(image, 1, 'lower initial spectral change'),
    summariseStratum(image, 2, 'medium initial spectral change'),
    summariseStratum(image, 3, 'higher initial spectral change')
  ]);
})).flatten();

var latest = seasonalComposite(2025);
var latestRecovery = recoveryFraction(latest);
var candidateLag = dnbr.gte(q67)
  .and(latestRecovery.lt(0.6))
  .and(latest.select('valid_count').gte(2))
  .selfMask()
  .rename('candidate_persistent_spectral_departure');

var rgb = {bands: ['B4', 'B3', 'B2'], min: 0.02, max: 0.30, gamma: 1.15};
var nbrVis = {min: -0.4, max: 0.8, palette: ['#6f3b2d', '#d9b27c', '#f4f0d0', '#5d9f66', '#174f3b']};
var dnbrVis = {min: -0.2, max: 0.8, palette: ['#2166ac', '#d1e5f0', '#f7f7f7', '#f4a582', '#b2182b']};
var recoveryVis = {min: 0, max: 1.2, palette: ['#762a83', '#af8dc3', '#f7f7f7', '#7fbf7b', '#1b7837']};

Map.centerObject(firePerimeter, 10);
Map.addLayer(firePerimeter, {color: '#f7f7f7'}, 'Copernicus EMSR527 perimeter');
Map.addLayer(pre, rgb, '2019–2020 baseline median');
Map.addLayer(post, rgb, '2021 immediate post-fire median');
Map.addLayer(pre.select('NBR'), nbrVis, 'Baseline NBR', false);
Map.addLayer(post.select('NBR'), nbrVis, 'Post-fire NBR', false);
Map.addLayer(dnbr, dnbrVis, 'Continuous dNBR');
Map.addLayer(latestRecovery, recoveryVis, '2025 relative spectral recovery');
Map.addLayer(candidateLag, {palette: ['#fdae61']}, 'Candidate persistent spectral departure');

print('Analysis configuration', config);
print('EMSR527 burned-area feature', firePerimeter);
print('dNBR AOI quantiles', quantiles);
print('Annual summary — inspect before export', annualSummary);
print('Recovery by initial-change stratum', stratumSummary);
print('NBR trajectory', ui.Chart.feature.byFeature(annualSummary, 'year', 'NBR_median'));
print('NDVI trajectory', ui.Chart.feature.byFeature(annualSummary, 'year', 'NDVI_median'));
print('Relative recovery by stratum', ui.Chart.feature.groups(
  stratumSummary, 'year', 'NBR_recovery_fraction_median', 'stratum'));

Export.table.toDrive({
  collection: annualSummary.merge(stratumSummary),
  description: 'northern_evia_recovery_summary',
  folder: config.exportFolder,
  fileFormat: 'CSV'
});

Export.image.toDrive({
  image: dnbr.addBands(latestRecovery).addBands(candidateLag),
  description: 'northern_evia_fire_recovery_indices_2025',
  folder: config.exportFolder,
  region: aoi,
  scale: config.analysisScale,
  maxPixels: 1e9,
  fileFormat: 'GeoTIFF'
});
