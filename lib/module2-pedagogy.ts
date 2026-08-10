import type {
  AcademyModuleOverview,
  FormativeCheck,
  ReviewedLessonDetails,
} from "@/lib/module1-pedagogy";

export type Module2LessonSource = {
  id: string;
  number: string;
  chapter: number;
  title: string;
  description: string;
  tools: string[];
  outcome: string;
  spatialQuestion: string;
  concepts: string[];
  practical: string;
  qa: string;
  artifact: string;
  code: string;
  prediction: string;
  interpretation: string;
  commonMistake: string;
  reference: { title: string; href: string };
};

const lesson = (
  number: number,
  chapter: number,
  title: string,
  description: string,
  tools: string[],
  outcome: string,
  spatialQuestion: string,
  concepts: string[],
  practical: string,
  qa: string,
  artifact: string,
  code: string,
  prediction: string,
  interpretation: string,
  commonMistake: string,
  reference: { title: string; href: string },
): Module2LessonSource => ({
  id: `lesson-2-${String(number).padStart(2, "0")}`,
  number: `2.${number}`,
  chapter,
  title,
  description,
  tools,
  outcome,
  spatialQuestion,
  concepts,
  practical,
  qa,
  artifact,
  code,
  prediction,
  interpretation,
  commonMistake,
  reference,
});

export const module2Lessons: Module2LessonSource[] = [
  lesson(1, 1, "What Makes Data Geospatial?", "Distinguish ordinary tables, vector features, raster grids and spatial data with incomplete reference metadata.", ["Spatial reasoning", "Vector", "Raster"], "Explain what makes a dataset spatial and identify its geometry, coordinates and spatial reference.", "What evidence connects each observation to a location on Earth?", ["Location, coordinates and geometry", "Points, lines and polygons", "Vector and raster representations", "Why coordinates without a CRS remain ambiguous"], "Inspect four small datasets and classify each as tabular, vector, raster or spatial with missing CRS metadata.", "Record geometry type, extent, coordinate fields and CRS evidence before analysis.", "spatial_data_inventory.ipynb", `datasets = {
    "field_measurements.csv": "tabular",
    "plot_locations.gpkg": "vector",
    "uav_orthomosaic.tif": "raster",
    "unknown_points.geojson": "spatial; CRS unverified",
}
for name, classification in datasets.items():
    print(f"{name}: {classification}")`, "Which item can be mapped most confidently, and what metadata supports that decision?", "A file becomes analytically geospatial when location, representation and reference system can be interpreted together. A coordinate pair alone is not enough.", "Treating columns named x and y as trustworthy locations. Confirm their CRS, axis order, units and provenance before mapping them.", { title: "OGC Simple Features standard", href: "https://www.ogc.org/standards/sfa/" }),
  lesson(2, 1, "Coordinate Reference Systems", "Choose, inspect, assign and transform coordinate reference systems without confusing metadata repair with reprojection.", ["pyproj", "GeoPandas", "EPSG"], "Explain geographic and projected CRSs, inspect distortion and transform coordinates deliberately.", "Which reference system makes distance, area and overlay meaningful for this study?", ["Curved Earth and planar maps", "Geographic versus projected coordinates", "Datums and EPSG identifiers", "set_crs() assigns metadata; to_crs() transforms coordinates"], "Inspect field plots and a study boundary in different CRSs, then transform them into one justified analysis CRS.", "Document CRS, units, bounds and sample coordinates before and after transformation.", "crs_transformation_audit.ipynb", `import geopandas as gpd

plots = gpd.read_file("data/field_plots.gpkg")
print(plots.crs, plots.total_bounds)

if plots.crs is None:
    raise ValueError("CRS must be verified from metadata")

plots_analysis = plots.to_crs("EPSG:3301")
print(plots_analysis.crs, plots_analysis.total_bounds)`, "Will the feature locations move on Earth, or only their numerical coordinate representation?", "A correct transformation preserves Earth locations while changing coordinate values and units. Projection choice should follow analysis purpose and study extent.", "Using set_crs() to make layers overlap. This relabels existing numbers and can move features to false locations; use it only when the original CRS is known but missing.", { title: "pyproj CRS documentation", href: "https://pyproj4.github.io/pyproj/stable/api/crs/crs.html" }),
  lesson(3, 1, "Scale, Resolution and Spatial Support", "Relate field quadrats, UAV pixels and satellite pixels to the ecological processes they can validly represent.", ["Scale", "Resolution", "Spatial support"], "Evaluate grain, extent and support before combining field and Earth Observation measurements.", "Does each measurement describe the same physical area and ecological process?", ["Grain, extent and resolution", "Sampling unit and spatial support", "Mixed pixels and scale mismatch", "Introductory MAUP"], "Compare a 1 m² quadrat, a 5 cm UAV pixel and a 10 m Sentinel-2 pixel, then state what variation each can and cannot observe.", "Write the physical footprint, temporal support and aggregation rule for every variable.", "spatial_support_decision.ipynb", `supports_m2 = {
    "field_quadrat": 1.0,
    "uav_pixel": 0.05 ** 2,
    "sentinel_pixel": 10.0 ** 2,
}
for source, area in supports_m2.items():
    print(source, area, "m²")`, "How many 5 cm UAV pixels and 10 m satellite pixels correspond to a 1 m² quadrat in area?", "Fine pixels reveal texture but do not automatically represent a field observation. Support alignment is a scientific design decision, not only a resampling task.", "Calling a smaller pixel more accurate. Spatial resolution describes sampling grain; accuracy depends on sensor, calibration, georegistration and the target process.", { title: "USGS Landsat spatial resolution", href: "https://www.usgs.gov/landsat-missions/landsat-satellite-missions" }),
  lesson(4, 1, "Geospatial Formats and Metadata", "Select formats that preserve geometry, grids, metadata and efficient access across local and cloud workflows.", ["GeoPackage", "GeoParquet", "COG", "Zarr"], "Choose a defensible geospatial format from data structure, scale, interoperability and access pattern.", "Which format preserves the information and access pattern this workflow actually needs?", ["Vector and raster format families", "Sidecar files and metadata", "Legacy Shapefile constraints", "Local versus cloud-native access"], "Choose formats for field points, a large vector archive, an analysis-ready raster and an EO data cube, with one reason and one limitation each.", "Verify CRS, schema, NoData, compression, chunking and provenance after every conversion.", "format_selection_matrix.ipynb", `format_choices = {
    "field_points": "GeoPackage",
    "large_vectors": "GeoParquet",
    "analysis_raster": "Cloud Optimized GeoTIFF",
    "eo_cube": "Zarr",
}
for purpose, format_name in format_choices.items():
    print(f"{purpose}: {format_name}")`, "Which choice supports partial remote reads, and which supports multidimensional chunked arrays?", "Formats encode both scientific structure and operational assumptions. A conversion is complete only when content and metadata survive verification.", "Choosing Shapefile by habit. Its multi-file structure, field-name limits and weak typing create avoidable risk for new analytical work.", { title: "GDAL vector formats", href: "https://gdal.org/en/stable/drivers/vector/index.html" }),

  lesson(5, 2, "GeoPandas and Spatial Tables", "Extend pandas reasoning to geometry, CRS, spatial bounds and geospatial file exchange.", ["GeoPandas", "GeoPackage", "GeoJSON"], "Load, inspect, filter, plot and write a GeoDataFrame while preserving its spatial contract.", "What does each row represent, and how does its geometry relate to the attributes?", ["GeoDataFrame as a pandas extension", "Active geometry and CRS", "Bounds and total bounds", "Reproducible reading and writing"], "Load field plots and study boundaries, then produce a concise spatial audit.", "Confirm row count, geometry types, empty geometries, CRS, bounds and unique identifiers.", "vector_spatial_audit.ipynb", `import geopandas as gpd

plots = gpd.read_file("data/field_plots.gpkg")
audit = {
    "rows": len(plots),
    "crs": str(plots.crs),
    "geometry_types": plots.geom_type.value_counts().to_dict(),
    "empty": int(plots.geometry.is_empty.sum()),
    "bounds": plots.total_bounds.tolist(),
}
print(audit)`, "Which audit result would make you stop before plotting or joining the data?", "A GeoDataFrame joins attributes to a geometry per row. Its CRS and geometry integrity determine whether later spatial operations have meaning.", "Trusting a successful read as proof of correctness. Drivers can load technically valid data with the wrong CRS, duplicated IDs or unexpected geometry types.", { title: "GeoPandas user guide", href: "https://geopandas.org/en/stable/docs/user_guide.html" }),
  lesson(6, 2, "Geometry with Shapely", "Construct and evaluate geometry operations while separating computational validity from ecological justification.", ["Shapely", "Geometry", "Predicates"], "Use geometry, predicates and constructive operations with explicit units and scientific support.", "Does this geometric relationship represent the ecological relationship we intend to study?", ["Point, LineString and Polygon", "Predicates versus new geometries", "Buffer, intersection and union", "Validity and multipart geometry"], "Create plot-neighbourhood buffers and justify the selected radius as an analysis support.", "Use a projected CRS, check validity, compare feature count and inspect buffer area.", "plot_neighbourhoods.ipynb", `import geopandas as gpd

plots = gpd.read_file("data/field_plots.gpkg").to_crs("EPSG:3301")
radius_m = 5
neighbourhoods = plots.copy()
neighbourhoods["geometry"] = plots.geometry.buffer(radius_m)
neighbourhoods["area_m2"] = neighbourhoods.area
print(neighbourhoods[["plot_id", "area_m2"]].head())`, "What area should a five-metre circular buffer have, and why might the observed area differ slightly?", "A buffer defines a spatial support around each plot. Its radius must reflect field protocol, positional error and ecological process—not visual convenience.", "Buffering longitude and latitude directly. Degrees are angular units and do not provide a consistent metre-based radius.", { title: "Shapely user manual", href: "https://shapely.readthedocs.io/en/stable/manual.html" }),
  lesson(7, 2, "Spatial Joins, Overlay and Nearest Neighbours", "Match features through spatial relationships while auditing duplicates, unmatched records and one-to-many results.", ["sjoin", "overlay", "nearest"], "Select the correct spatial predicate and validate the resulting table cardinality.", "Which spatial relationship should connect these observations, and can one input match several features?", ["Attribute versus spatial joins", "within, contains and intersects", "Nearest-neighbour matching", "Overlay and row multiplication"], "Assign every field plot to its study site, management zone and vegetation zone.", "Compare row count before and after every join; report unmatched and multiply matched plot IDs.", "spatial_join_audit.ipynb", `import geopandas as gpd

plots = gpd.read_file("data/field_plots.gpkg")
zones = gpd.read_file("data/management_zones.gpkg").to_crs(plots.crs)
joined = plots.sjoin(zones, predicate="within", how="left")
print("before", len(plots), "after", len(joined))
print("unmatched", joined["index_right"].isna().sum())
print(joined.index.value_counts().head())`, "Under what boundary condition could within and intersects produce different assignments?", "A spatial join creates an evidence table about a chosen relationship. Cardinality checks reveal ambiguous boundaries and overlapping zones that a map alone can hide.", "Dropping duplicated rows immediately. Repetition may be legitimate one-to-many evidence or a topology problem; diagnose it before deciding.", { title: "GeoPandas merging data", href: "https://geopandas.org/en/stable/docs/user_guide/mergingdata.html" }),
  lesson(8, 2, "Spatial Indexing and Performance", "Understand how bounding-box indexes reduce candidate comparisons without changing spatial predicates.", ["Spatial index", "STRtree", "Profiling"], "Explain and observe why indexed spatial operations scale better than naive pairwise checks.", "How can we avoid testing every feature against every other feature?", ["Pairwise comparison cost", "Bounding-box filtering", "STRtree and R-tree concepts", "Measure before optimising"], "Time a small pairwise relationship test and an indexed candidate query, then explain the two-stage logic.", "Confirm both methods return equivalent matches before comparing runtime.", "spatial_index_profile.ipynb", `from time import perf_counter
from shapely import STRtree

tree = STRtree(zones.geometry)
started = perf_counter()
candidates = tree.query(plots.geometry, predicate="intersects")
elapsed = perf_counter() - started
print("candidate pairs", candidates.shape[1])
print("seconds", round(elapsed, 4))`, "Does a bounding-box hit prove two geometries intersect?", "An index narrows the candidate set; the exact predicate still determines the result. Performance improvements must preserve analytical equivalence.", "Reporting one timing as a universal benchmark. Runtime depends on geometry complexity, hardware, caching and data distribution.", { title: "GeoPandas spatial indexing", href: "https://geopandas.org/en/stable/docs/user_guide/spatial_indexing.html" }),
  lesson(9, 2, "Advanced Vector Workflows", "Clean multipart, invalid and duplicated geometries while retaining an explicit topology decision log.", ["Dissolve", "Explode", "Topology QA"], "Prepare a polygon layer for analysis without silently changing its intended boundaries.", "Which defects prevent computation, and which apparent defects reflect valid real-world topology?", ["Dissolve, explode and clip", "Validity and geometry repair", "Slivers and duplicate geometry", "Topology QA with provenance"], "Audit and prepare a study-area polygon dataset for zonal analysis.", "Track feature counts and total area before and after every repair or aggregation.", "vector_topology_report.ipynb", `import geopandas as gpd

zones = gpd.read_file("data/study_zones.gpkg")
before_area = zones.to_crs("EPSG:3301").area.sum()
invalid = ~zones.geometry.is_valid
clean = zones.copy()
clean.loc[invalid, "geometry"] = clean.loc[invalid].geometry.make_valid()
after_area = clean.to_crs("EPSG:3301").area.sum()
print("invalid", invalid.sum(), "area change", after_area - before_area)`, "Should make_valid() be applied to every geometry automatically?", "Geometry repair is a documented intervention. Stable area and feature counts are useful QA signals, but domain review must confirm the repaired topology.", "Using buffer(0) as an unexplained universal repair. It can alter polygon structure and conceal the reason a geometry was invalid.", { title: "GeoPandas geometry validity", href: "https://geopandas.org/en/stable/docs/user_guide/geometric_manipulations.html" }),
  lesson(10, 2, "QGIS for Professional QA", "Use QGIS as a visual verification companion to reproducible Python processing.", ["QGIS", "Visual QA", "Map export"], "Inspect CRS, attributes, geometry, raster behaviour and styled outputs in a repeatable QA protocol.", "What spatial defect can visual inspection reveal that a summary table may miss?", ["Layer and CRS inspection", "Geometry validation and processing tools", "Attribute joins and field calculations", "Professional map export"], "Load Python-produced vectors and rasters into QGIS, inspect them against source layers and export one QA map.", "Record QGIS version, project CRS, layer sources, symbology rules and every observed anomaly.", "qgis_visual_qa_report.pdf", `qa_checks = [
    "CRS and extent agree",
    "features overlay expected basemap locations",
    "attributes and IDs match source",
    "NoData and class symbology are explicit",
    "export includes legend, scale and provenance",
]
for check in qa_checks:
    print("□", check)`, "Which checks remain necessary even when the map looks visually correct?", "QGIS accelerates visual diagnosis, but the reproducible processing record remains in code. A polished map is evidence of communication, not proof of analytical validity.", "Editing the only source layer to fix a visual problem. Preserve raw inputs and export any corrected layer as a documented derivative.", { title: "QGIS training manual", href: "https://docs.qgis.org/latest/en/docs/training_manual/" }),
  lesson(11, 3, "Raster Fundamentals", "Reason about grids, bands, transforms and NoData before opening a raster-processing library.", ["Grid", "Affine transform", "NoData"], "Explain how a raster locates and represents measurements across a regular grid.", "What physical area and variable does each cell represent?", ["Rows, columns, pixels and bands", "Origin, resolution, extent and affine transform", "Pixel values, data type and NoData", "Continuous versus categorical rasters"], "Read a raster metadata card and reconstruct the spatial meaning of one cell.", "Confirm dimensions, resolution, bounds, CRS, band meaning, data type and NoData.", "raster_spatial_model.ipynb", `width, height = 4, 3
x_origin, y_origin = 500000, 6500000
pixel_size = 10
col, row = 2, 1
x = x_origin + (col + 0.5) * pixel_size
y = y_origin - (row + 0.5) * pixel_size
print("cell centre", x, y)`, "Why is one pixel-centre coordinate offset by half a pixel from the grid origin?", "A raster is not just a matrix. Its transform and CRS connect array positions to Earth locations; band metadata connects values to measured variables.", "Treating NoData as zero. Zero may be a valid measurement or category, while NoData marks unavailable or excluded support.", { title: "Rasterio georeferencing", href: "https://rasterio.readthedocs.io/en/stable/topics/georeferencing.html" }),
  lesson(12, 3, "Rasterio Fundamentals", "Open rasters safely and connect their spatial profile to NumPy band arrays.", ["Rasterio", "NumPy", "Raster profile"], "Produce a reproducible raster audit before reading values into memory.", "What metadata must be true before this band can support the planned analysis?", ["Dataset context manager", "CRS, bounds, transform and resolution", "Band count, dtype and NoData", "Rasterio datasets and NumPy arrays"], "Generate a structured audit report for a UAV or satellite raster.", "Verify file identity, dimensions, band descriptions, profile and masked-value count.", "raster_audit_report.ipynb", `import rasterio

with rasterio.open("data/imagery.tif") as src:
    audit = {
        "crs": str(src.crs), "resolution": src.res,
        "bounds": tuple(src.bounds), "shape": src.shape,
        "bands": src.count, "dtype": src.dtypes,
        "nodata": src.nodata,
    }
print(audit)`, "Which properties can be inspected without loading the full raster band?", "Metadata-first inspection prevents expensive or invalid processing. The array becomes meaningful only when read with its profile and mask.", "Calling read() before checking shape and dtype. A large multiband raster may exceed memory even though opening its metadata is inexpensive.", { title: "Rasterio reading datasets", href: "https://rasterio.readthedocs.io/en/stable/topics/reading.html" }),
  lesson(13, 3, "Crop, Mask, Reproject and Resample", "Separate four operations that change extent, valid support, reference system or grid sampling.", ["Rasterio", "Resampling", "Masking"], "Choose and document crop, mask, reprojection and resampling operations correctly.", "Which spatial property must change, and which information must remain unchanged?", ["Crop changes rectangular extent", "Mask defines valid support", "Reproject changes CRS and grid", "Resampling estimates a new grid"], "Prepare a raster for one study polygon using a scientifically justified resampling method.", "Report input and output CRS, grid, extent, shape, NoData and resampling method.", "raster_preparation_log.ipynb", `from rasterio.enums import Resampling

resampling_by_data = {
    "land_cover": Resampling.nearest,
    "surface_temperature": Resampling.bilinear,
}
for layer, method in resampling_by_data.items():
    print(layer, method.name)`, "What false classes could bilinear interpolation create between categorical class codes 1 and 5?", "Nearest-neighbour usually preserves categorical labels; interpolation can suit continuous fields. Upsampling produces more cells, not new sensor information.", "Using the word clip for every operation. Distinguish rectangular crop from geometry mask and record whether pixels outside the polygon remain as NoData.", { title: "Rasterio reprojection", href: "https://rasterio.readthedocs.io/en/stable/topics/reproject.html" }),
  lesson(14, 3, "Raster Alignment and Grid Integrity", "Detect sub-pixel misalignment even when rasters share a CRS and array dimensions.", ["Grid alignment", "Transforms", "QA function"], "Implement a reusable grid-integrity check for rasters used in cell-by-cell analysis.", "Do corresponding array positions describe exactly the same Earth footprint?", ["CRS and pixel transform", "Resolution, origin and bounds", "Dimensions, NoData and band order", "Tolerance and explicit diagnostics"], "Create check_raster_alignment() and test it against one deliberately shifted grid.", "Fail clearly on every mismatched property rather than returning a single vague False.", "raster_alignment_checker.py", `def check_raster_alignment(a, b):
    checks = {
        "crs": a.crs == b.crs,
        "transform": a.transform.almost_equals(b.transform),
        "shape": a.shape == b.shape,
        "bounds": a.bounds == b.bounds,
    }
    return checks

print(check_raster_alignment(raster_a, raster_b))`, "Could two rasters have the same bounds and shape but different cell origins?", "Cell-by-cell arithmetic assumes identical footprints at every index. An unnoticed half-pixel shift can turn spectral combinations into spatial mixtures.", "Checking only CRS and shape. Neither guarantees a shared origin, transform, extent or band convention.", { title: "Rasterio transforms", href: "https://rasterio.readthedocs.io/en/stable/topics/transforms.html" }),
  lesson(15, 3, "Raster–Vector Integration", "Extract raster evidence to field geometries while matching spatial support and handling edge effects.", ["Sampling", "Zonal statistics", "Support"], "Choose point, buffered or polygon extraction and justify its footprint.", "Why does this extraction footprint represent the field measurement?", ["Point and buffered sampling", "Polygon summaries", "Edge effects and missing samples", "Field–raster support mismatch"], "Extract EO predictor values to vegetation plots and compare point with neighbourhood summaries.", "Report valid pixel count, overlap fraction, support size and plots with no valid samples.", "field_raster_extraction.ipynb", `from rasterstats import zonal_stats

stats = zonal_stats(
    plot_supports,
    "data/ndvi.tif",
    stats=["count", "mean", "std"],
    nodata=-9999,
)
plot_supports[["n", "ndvi_mean", "ndvi_sd"]] = [
    (s["count"], s["mean"], s["std"]) for s in stats
]`, "How should you interpret a mean derived from only one valid edge pixel?", "Extraction turns a continuous grid into plot-level evidence. Sample count and footprint must accompany the statistic to expose weak overlap and mixed support.", "Taking the nearest pixel by default. Geolocation error, plot size and pixel grain may make a buffered or area-weighted support more defensible.", { title: "Rasterio vector features", href: "https://rasterio.readthedocs.io/en/stable/topics/features.html" }),
  lesson(16, 3, "Large Raster Processing", "Process tiled windows within memory limits and separate transient views from persisted outputs.", ["Windows", "Tiling", "WarpedVRT"], "Design a windowed raster operation that avoids unnecessary full-band loads.", "What is the smallest spatial block required to compute this output correctly?", ["Windowed reads and writes", "Block shapes and memory budgets", "WarpedVRT as a virtual view", "Temporary versus persisted outputs"], "Compute a simple raster transformation block by block.", "Preserve profile, process edge windows, propagate masks and compare sample pixels with a full-array reference.", "windowed_raster_processor.py", `import rasterio

with rasterio.open("data/ndvi.tif") as src:
    profile = src.profile.copy()
    with rasterio.open("outputs/ndvi_scaled.tif", "w", **profile) as dst:
        for _, window in src.block_windows(1):
            block = src.read(1, window=window, masked=True)
            dst.write((block * 100).filled(src.nodata), 1, window=window)`, "Why should processing follow source block windows rather than arbitrary single-row reads?", "Windowing controls memory and can align I/O with internal tiling. It does not remove the need to preserve masks, halos and global-operation assumptions.", "Assuming every algorithm is independently tileable. Filters and terrain derivatives may need neighbouring pixels or global statistics.", { title: "Rasterio windowed reading", href: "https://rasterio.readthedocs.io/en/stable/topics/windowed-rw.html" }),
  lesson(17, 3, "Terrain Analysis", "Derive terrain predictors with correct elevation units, grid spacing and ecological interpretation.", ["DEM", "Slope", "Aspect"], "Distinguish DEM, DSM and DTM and interpret terrain derivatives responsibly.", "Which surface and vertical reference represent the ecological mechanism of interest?", ["Elevation models and surface models", "Slope and aspect", "Horizontal and vertical units", "Terrain as an ecological predictor"], "Calculate terrain predictors and relate them to moisture, exposure or vegetation structure.", "Confirm vertical units, horizontal resolution, sinks, edge behaviour and plausible value ranges.", "terrain_predictor_report.ipynb", `import numpy as np

dz_dy, dz_dx = np.gradient(dem, y_resolution, x_resolution)
slope_degrees = np.degrees(np.arctan(np.hypot(dz_dx, dz_dy)))
aspect_degrees = (np.degrees(np.arctan2(-dz_dx, dz_dy)) + 360) % 360
print(np.nanmin(slope_degrees), np.nanmax(slope_degrees))`, "What happens to slope if elevation is in centimetres but horizontal resolution is in metres?", "Terrain derivatives express local surface geometry. Ecological interpretation depends on whether the input is ground elevation, canopy surface or another height model.", "Calling a DSM a DTM. Vegetation and structures remain in a DSM, so its slope may describe canopy texture rather than terrain.", { title: "GDAL DEM processing", href: "https://gdal.org/en/stable/programs/gdaldem.html" }),

  lesson(18, 4, "UAV Remote Sensing Fundamentals", "Design UAV acquisition around sensor, ground sampling distance, overlap, illumination and georeferencing requirements.", ["UAV", "GSD", "Acquisition design"], "Connect flight decisions to the spatial and radiometric quality of downstream products.", "Can this flight observe the target process at the required support and uncertainty?", ["RGB, multispectral, thermal and LiDAR", "Altitude, GSD and overlap", "Illumination and calibration panels", "GNSS georeferencing and field design"], "Write a flight-design rationale for Baltic meadow vegetation mapping.", "Document platform, sensor, altitude, overlap, time, illumination, control and expected GSD.", "uav_acquisition_plan.md", `flight = {
    "target_gsd_cm": 5,
    "forward_overlap_pct": 80,
    "side_overlap_pct": 70,
    "illumination": "stable diffuse or calibrated",
    "positioning": "RTK plus independent checkpoints",
}
for key, value in flight.items():
    print(key, value)`, "Which flight property mainly supports image matching, and which supports reflectance comparability?", "Acquisition is the first analytical step. A processing workflow cannot fully recover missing overlap, motion blur or undocumented illumination.", "Selecting the lowest safe altitude only for finer GSD. Coverage, flight time, motion, data volume and spatial support also change.", { title: "USGS UAS data collection", href: "https://www.usgs.gov/centers/national-uncrewed-systems-office" }),
  lesson(19, 4, "Photogrammetry Fundamentals", "Trace overlapping photographs through camera geometry to point clouds, surfaces and orthomosaics.", ["SfM", "GCP", "Orthomosaic"], "Explain the photogrammetric chain and identify independent evidence of geometric accuracy.", "How are repeated image observations converted into a three-dimensional spatial model?", ["Feature matching and Structure from Motion", "Bundle adjustment concept", "GCP, RTK and PPK roles", "Point cloud, DSM, DTM and orthomosaic"], "Annotate a photogrammetry processing report and locate evidence for control, tie points and checkpoint error.", "Keep control points separate from independent checkpoints and report horizontal and vertical residuals.", "photogrammetry_process_audit.pdf", `stages = [
    "image quality and metadata",
    "feature matching",
    "camera alignment",
    "sparse and dense point clouds",
    "surface model",
    "orthorectification and mosaic",
    "independent checkpoint QA",
]
print(" → ".join(stages))`, "Why can low GCP residuals coexist with poor independent checkpoint accuracy?", "Photogrammetry estimates a coherent model from overlapping views. Independent checkpoints test whether that model is positioned correctly beyond the observations used to fit it.", "Reporting only mean GCP error. Training/control residuals are not an independent validation of product accuracy.", { title: "OpenDroneMap documentation", href: "https://docs.opendronemap.org/" }),
  lesson(20, 4, "UAV Product QA", "Diagnose geometric, radiometric and temporal defects before extracting ecological predictors.", ["UAV QA", "Seamlines", "Positional error"], "Apply a repeatable product QA checklist and decide whether a UAV output is fit for purpose.", "Which product defect could change the ecological conclusion?", ["Blur, shadows and seamlines", "Radiometric inconsistency and vegetation movement", "Positional and temporal mismatch", "Resolution and support mismatch"], "Inspect an orthomosaic and surface model, record defects, severity, spatial pattern and mitigation.", "Use independent checkpoints, histograms, hillshade, edge overlays and no-data inspection.", "uav_product_qa_report.pdf", `qa_findings = []
qa_findings.append({
    "issue": "shadow seam",
    "location": "north-west block",
    "risk": "biased vegetation index",
    "decision": "mask before plot extraction",
})
print(qa_findings)`, "Which artefact is most likely to be hidden by an attractive colour stretch?", "QA translates visual anomalies into analytical risk and a documented decision. Fitness depends on the target variable and extraction support.", "Calling every visible seam a failure. Some seams are cosmetic; evaluate whether values, geometry or interpretation are affected.", { title: "ASPRS positional accuracy standards", href: "https://www.asprs.org/divisions-committees/standards" }),
  lesson(21, 4, "UAV Multispectral Pipeline", "Assemble aligned reflectance, index, surface and thermal layers into plot-ready predictors.", ["Multispectral", "Vegetation indices", "Plot extraction"], "Build and validate a reproducible UAV multispectral processing chain.", "Are all bands and derived layers comparable in space, radiometry and time?", ["Reflectance stack construction", "Vegetation indices as proxies", "DSM and thermal integration", "Alignment, metadata and spatial QA"], "Build a reflectance stack, compute indices, integrate DSM and thermal layers, and extract plot summaries.", "Run band-order, calibration, alignment, mask, range and footprint checks at every stage.", "uav_multispectral_pipeline.ipynb", `import numpy as np

red = stack["red"].astype("float32")
nir = stack["nir"].astype("float32")
valid = masks["red"] & masks["nir"] & ((nir + red) != 0)
ndvi = np.full(red.shape, np.nan, dtype="float32")
ndvi[valid] = (nir[valid] - red[valid]) / (nir[valid] + red[valid])
print(np.nanmin(ndvi), np.nanmax(ndvi))`, "What output pattern would suggest the red and near-infrared bands were reversed?", "A multispectral stack is a registered measurement system. Indices become interpretable only after calibration, band identity, alignment and mask integrity are established.", "Computing an index before intersecting valid masks. Denominator zeros, shadows and unmatched NoData can create apparently plausible artefacts.", { title: "MicaSense image processing", href: "https://support.micasense.com/hc/en-us/categories/115000274848-Image-Processing" }),

  lesson(22, 5, "Optical Remote Sensing", "Connect electromagnetic interactions, sensor bands and product levels to interpretable surface reflectance.", ["Sentinel-2", "Landsat", "Reflectance"], "Select optical products and bands from spectral, spatial, radiometric and temporal requirements.", "Which measured radiance or reflectance signal can respond to the target vegetation property?", ["Electromagnetic spectrum and bands", "Four kinds of sensor resolution", "Atmosphere, clouds and shadows", "Level-1 and Level-2 products"], "Compare Sentinel-2 and Landsat products for a coastal meadow monitoring question.", "Record product level, acquisition time, band resolution, scaling, cloud method and surface conditions.", "optical_product_decision.ipynb", `sensors = {
    "Sentinel-2": {"red_m": 10, "nir_m": 10, "revisit_days": 5},
    "Landsat": {"red_m": 30, "nir_m": 30, "revisit_days": 16},
}
for name, properties in sensors.items():
    print(name, properties)`, "Why does a nominal revisit interval not equal the number of cloud-free observations?", "Sensor selection balances spectral response, support, acquisition opportunity and product quality. Nominal specifications do not guarantee usable observations.", "Comparing raw digital numbers across products. Confirm scaling, processing level and calibration before interpretation.", { title: "Sentinel-2 user guide", href: "https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-2-msi" }),
  lesson(23, 5, "Vegetation and Spectral Indices", "Use vegetation indices as sensor- and context-dependent proxies rather than direct ecological measurements.", ["NDVI", "Red edge", "SAVI"], "Choose, calculate and interpret an index with its limitations and reference evidence.", "What physical contrast does this index emphasise, and which confounders remain?", ["NDVI, GNDVI, SAVI and MSAVI", "Red-edge indices", "Saturation, soil and atmosphere", "Sensor and seasonal dependence"], "Compare two indices across meadow plots and explain where they agree or diverge.", "Verify reflectance scale, band identity, masks, formula, valid range and acquisition context.", "spectral_index_comparison.ipynb", `import numpy as np

def safe_ratio(numerator, denominator, valid):
    result = np.full(numerator.shape, np.nan, dtype="float32")
    use = valid & (denominator != 0)
    result[use] = numerator[use] / denominator[use]
    return result

ndvi = safe_ratio(nir - red, nir + red, valid_mask)
gndvi = safe_ratio(nir - green, nir + green, valid_mask)`, "Which index may saturate in dense vegetation, and why does another index not automatically solve that limitation?", "Indices compress spectral contrast into a proxy. Their ecological relationship must be calibrated or validated for sensor, season, canopy and target variable.", "Writing 'NDVI measures biomass'. NDVI responds to red and near-infrared reflectance and may correlate with biomass under specific conditions.", { title: "USGS Landsat spectral indices", href: "https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index" }),
  lesson(24, 5, "SAR Fundamentals", "Interpret Sentinel-1 backscatter through acquisition geometry, surface properties and preprocessing choices.", ["Sentinel-1", "VV/VH", "Backscatter"], "Explain SAR signal formation and design a defensible search-to-interpretation workflow.", "Which combination of moisture, roughness, structure and geometry could produce this backscatter pattern?", ["Active microwave sensing", "Polarisation and incidence angle", "Speckle, roughness and moisture", "Calibration and terrain correction"], "Search, filter, calibrate, terrain-correct and QA a Sentinel-1 observation conceptually or in an available platform.", "Keep orbit direction, relative orbit, polarisation, angle, preprocessing and terrain effects comparable.", "sentinel1_workflow_report.ipynb", `sar_query = {
    "collection": "Sentinel-1 GRD",
    "polarisations": ["VV", "VH"],
    "orbit_direction": "consistent across dates",
    "steps": ["calibrate", "terrain-correct", "QA", "interpret"],
}
for key, value in sar_query.items():
    print(key, value)`, "Why can a brighter pixel not be interpreted simply as more vegetation?", "SAR backscatter is a compound response to geometry and dielectric and structural properties. Interpretation must control acquisition and terrain context.", "Averaging incompatible orbit geometries. Incidence angle and viewing direction can produce changes unrelated to the ecological target.", { title: "Sentinel-1 user guide", href: "https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar" }),
  lesson(25, 5, "Hyperspectral Remote Sensing", "Recognise when dense narrow-band measurements provide useful spectral evidence and additional preprocessing burden.", ["Hyperspectral", "Spectral curves", "SNR"], "Evaluate hyperspectral value from absorption features, signal quality and dimensionality.", "Does the target have a resolvable spectral feature at the sensor's scale and signal-to-noise ratio?", ["Narrow bands and spectral curves", "Absorption features and red edge", "Spectral libraries and SNR", "Preprocessing and feature selection"], "Inspect representative spectra, identify noisy regions and propose justified features for vegetation traits.", "Record wavelength units, band centres, bandwidths, masks, calibration and preprocessing.", "hyperspectral_feature_note.ipynb", `import numpy as np

valid_bands = (wavelength_nm >= 450) & (wavelength_nm <= 900)
spectra_clean = spectra[:, valid_bands]
wavelength_clean = wavelength_nm[valid_bands]
red_edge = (wavelength_clean >= 680) & (wavelength_clean <= 750)
print("usable bands", spectra_clean.shape[1])
print("red-edge bands", red_edge.sum())`, "Why can hundreds of bands reduce model reliability when samples are limited?", "Hyperspectral data can resolve diagnostic spectral shape, but correlated noisy bands amplify preprocessing and validation demands.", "Selecting bands after viewing test performance. Feature design must remain inside the training workflow to avoid optimistic validation.", { title: "NASA imaging spectroscopy", href: "https://earth.jpl.nasa.gov/emit/" }),
  lesson(26, 5, "LiDAR and Point Clouds", "Turn discrete three-dimensional returns into terrain and vegetation-structure products.", ["LiDAR", "Point clouds", "Canopy height"], "Explain point-cloud attributes and derive a simple structural surface with documented assumptions.", "Which returns represent ground, canopy and uncertainty in this landscape?", ["Coordinates, returns and intensity", "Point density and classification", "DSM, DTM and canopy height", "Rasterisation and structural metrics"], "Create or inspect a canopy-height product from classified point-cloud or supplied surface data.", "Check coordinate and vertical reference, units, density, classes, interpolation gaps and negative heights.", "lidar_structure_report.ipynb", `import numpy as np

canopy_height = dsm.astype("float32") - dtm.astype("float32")
canopy_height[(canopy_height < 0) | (canopy_height > 60)] = np.nan
print("median height", np.nanmedian(canopy_height))
print("valid fraction", np.isfinite(canopy_height).mean())`, "What could create negative canopy heights after subtracting the DTM from the DSM?", "Canopy height combines two estimated surfaces. Misalignment, classification errors and interpolation can propagate into structural metrics.", "Treating intensity as directly comparable across flights. Range, angle, sensor settings and calibration influence intensity.", { title: "PDAL documentation", href: "https://pdal.io/en/stable/" }),
  lesson(27, 6, "Spatial Autocorrelation", "Recognise spatial dependence and its consequences for inference and validation.", ["Moran's I", "Weights", "Spatial dependence"], "Explain spatial autocorrelation, construct a neighbourhood concept and interpret Moran's I cautiously.", "Are nearby values more similar than expected under the chosen spatial null model?", ["Tobler's first law", "Spatial weights and neighbours", "Global Moran's I", "Consequences for inference and validation"], "Compare alternative neighbourhood definitions and calculate or interpret Moran's I for a meadow variable.", "Report weights construction, islands, permutations, spatial extent and the analysed variable.", "spatial_autocorrelation_report.ipynb", `from libpysal.weights import KNN
from esda.moran import Moran

w = KNN.from_dataframe(plots, k=4)
w.transform = "R"
values = plots["ndvi_mean"].to_numpy()
moran = Moran(values, w, permutations=999)
print(moran.I, moran.p_sim)`, "Would changing from four nearest neighbours to polygon contiguity necessarily preserve Moran's I?", "Moran's I describes pattern relative to a specified weights matrix. It is evidence of spatial structure, not its ecological cause.", "Reporting a p-value without the neighbourhood definition. The test changes when the spatial relationship changes.", { title: "PySAL exploratory spatial data analysis", href: "https://pysal.org/esda/" }),
  lesson(28, 6, "Spatial Sampling and Bias", "Design and diagnose sampling that represents spatial heterogeneity without hidden clustering.", ["Sampling design", "Bias", "Stratification"], "Compare random, systematic and stratified spatial designs and recognise representativeness limits.", "Which parts of the landscape and environmental gradients can this sample represent?", ["Random and systematic sampling", "Stratification and clustering", "Edge effects", "Accessibility and spatial bias"], "Evaluate the existing plot distribution and propose a defensible supplementary design.", "Map inclusion probability, nearest-neighbour distance, stratum coverage and inaccessible regions.", "spatial_sampling_design.ipynb", `import pandas as pd

coverage = (
    plots.groupby("habitat", observed=True)
    .size()
    .rename("n_plots")
    .to_frame()
)
coverage["share"] = coverage["n_plots"] / coverage["n_plots"].sum()
print(coverage)`, "Can a large sample remove bias if all plots are close to roads?", "Sample size does not repair a biased inclusion process. Spatial design determines what population and gradients the evidence can support.", "Using random points without checking feasibility. Rejected inaccessible locations can convert a nominally random design into undocumented convenience sampling.", { title: "US EPA spatial sampling guidance", href: "https://www.epa.gov/quality/guidance-systematic-planning-using-data-quality-objectives-process" }),
  lesson(29, 6, "Interpolation and Geostatistics", "Treat interpolation as a model of spatial continuity with assumptions and prediction uncertainty.", ["IDW", "Variogram", "Kriging"], "Compare deterministic interpolation with variogram-based kriging and interpret uncertainty.", "What spatial process justifies predicting between observations?", ["IDW and trend surfaces", "Variogram, nugget, sill and range", "Ordinary kriging assumptions", "Prediction uncertainty"], "Explore an empirical variogram and compare IDW with ordinary kriging predictions at held-out locations.", "Use spatial holdouts, inspect residuals, map uncertainty and avoid extrapolation beyond support.", "geostatistical_interpolation.ipynb", `from sklearn.model_selection import GroupKFold

groups = plots["spatial_block"]
splitter = GroupKFold(n_splits=5)
for train, test in splitter.split(plots, groups=groups):
    print("train", len(train), "test", len(test))`, "Why should nearby observations not be split randomly between training and validation?", "Interpolation performance must be tested at genuinely separated locations. A smooth map is not evidence of accurate unsampled values.", "Fitting a variogram by visual preference alone. Document estimator, model, lag choices and sensitivity, then validate predictions.", { title: "PyKrige documentation", href: "https://geostat-framework.readthedocs.io/projects/pykrige/en/stable/" }),
  lesson(30, 6, "Spatial Regression Concepts", "Recognise when ordinary regression residuals violate independence and what spatial models attempt to address.", ["Spatial lag", "Spatial error", "GWR"], "Diagnose spatial residual structure and distinguish major spatial regression ideas.", "Does location retain explanatory structure after the measured predictors are considered?", ["Ordinary-model independence", "Spatial lag and spatial error concepts", "Geographically weighted approaches", "Interpretation and model comparison"], "Fit or inspect a baseline model, map residuals and test their spatial autocorrelation.", "Keep the outcome, predictors, weights and validation geography explicit; compare out-of-sample performance.", "spatial_regression_diagnostic.ipynb", `from sklearn.linear_model import LinearRegression

X = plots[["ndvi_mean", "elevation_m"]]
y = plots["biomass_g_m2"]
model = LinearRegression().fit(X, y)
plots["residual"] = y - model.predict(X)
print(plots["residual"].describe())`, "If residuals cluster spatially, which ordinary regression assumption is questionable?", "Spatial residual pattern signals unresolved dependence or missing spatial processes. A spatial model is not automatically a causal explanation.", "Choosing GWR because its coefficient map looks interesting. Local estimates can be unstable and require bandwidth, collinearity and multiple-testing scrutiny.", { title: "PySAL spatial regression", href: "https://pysal.org/spreg/" }),

  lesson(31, 7, "SQL for Geospatial Scientists", "Query environmental tables with explicit filtering, grouping and relational joins.", ["SQL", "JOIN", "GROUP BY"], "Write readable SQL that produces an auditable environmental analysis table.", "Which rows and variables constitute the analysis population?", ["SELECT and FROM", "WHERE filters", "GROUP BY summaries", "JOIN keys and cardinality"], "Query vegetation measurements and join them to site metadata.", "Count source and result rows, test key uniqueness, preserve NULLs deliberately and qualify field names.", "environmental_queries.sql", `SELECT
  p.site_id,
  COUNT(*) AS n_plots,
  AVG(p.ndvi_mean) AS mean_ndvi
FROM plot_observations AS p
WHERE p.qa_status = 'valid'
GROUP BY p.site_id
ORDER BY p.site_id;`, "Will sites with no valid plots appear in this query, and why?", "SQL makes the analysis population and aggregation explicit. Join direction and NULL handling determine which evidence remains visible.", "Using SELECT * in a published pipeline. Schema changes can silently alter outputs; name required columns and aliases.", { title: "PostgreSQL SELECT documentation", href: "https://www.postgresql.org/docs/current/sql-select.html" }),
  lesson(32, 7, "PostGIS Fundamentals", "Move vector relationships from in-memory Python to indexed database queries.", ["PostGIS", "SRID", "Spatial SQL"], "Use geometry, geography, SRIDs and core PostGIS predicates with appropriate indexes.", "Should this relationship be evaluated on a projected plane, spheroid or stored geometry?", ["Geometry, geography and SRID", "Spatial indexes", "ST_Intersects, ST_Within and ST_Buffer", "ST_Distance and ST_Transform"], "Translate a GeoPandas plot-to-zone workflow into PostGIS SQL and compare results.", "Check SRIDs, index use, row counts, unmatched records and one-to-many cardinality.", "postgis_plot_assignment.sql", `SELECT
  p.plot_id,
  z.zone_id
FROM field_plots AS p
LEFT JOIN management_zones AS z
  ON ST_Within(
    ST_Transform(p.geom, 3301),
    ST_Transform(z.geom, 3301)
  );`, "Why might a boundary point remain unmatched by ST_Within but match ST_Intersects?", "PostGIS expresses the same spatial questions as desktop and Python tools while centralising data and scaling indexed queries.", "Wrapping every indexed geometry in ST_Transform during a large join. It can prevent index use; store or materialise an analysis CRS when justified.", { title: "PostGIS reference", href: "https://postgis.net/docs/" }),
  lesson(33, 7, "Managing Large Spatial Data", "Choose when files, columnar objects or a spatial database best support scale and collaboration.", ["GeoParquet", "PostGIS", "Object storage"], "Design a storage architecture with indexing, provenance and lifecycle rules.", "Where should the authoritative data live, and how will each operation access it?", ["Files versus datasets and services", "Spatial and attribute indexing", "Partitioning concepts", "Naming, provenance and derived products"], "Create a decision record for moving an expanding meadow archive from many files to managed storage.", "Define source-of-truth, schema, identifiers, CRS, update frequency, backups and lineage.", "spatial_storage_architecture.md", `storage_plan = {
    "raw_imagery": "versioned object storage",
    "analysis_vectors": "GeoParquet",
    "shared_operational_data": "PostGIS",
    "portable_delivery": "GeoPackage or COG",
}
for dataset, location in storage_plan.items():
    print(dataset, "→", location)`, "Which option best supports many simultaneous editors and spatial queries?", "Storage choice is part of reproducibility. It determines consistency, query cost, collaboration and the ability to trace derivatives.", "Moving data into a database without a data model. A database does not repair inconsistent IDs, CRS or provenance.", { title: "GeoParquet specification", href: "https://geoparquet.org/" }),

  lesson(34, 8, "Xarray and Rioxarray", "Work with labelled multidimensional arrays that preserve coordinates, dimensions and attributes.", ["Xarray", "Rioxarray", "Labelled arrays"], "Contrast positional and labelled indexing and retain geospatial metadata through analysis.", "Which named dimensions and coordinates locate this variable in space and time?", ["DataArray and Dataset", "Dimensions, coordinates and attributes", "Labelled selection", "CRS and spatial dimensions with rioxarray"], "Open a georeferenced raster, inspect named dimensions and select an area by coordinate labels.", "Check dimension order, coordinate direction, CRS, transform, attributes and mask after each operation.", "xarray_spatial_audit.ipynb", `import rioxarray

data = rioxarray.open_rasterio("data/sentinel_stack.tif", masked=True)
print(data.dims, data.sizes)
print(data.rio.crs, data.rio.bounds())
subset = data.sel(x=slice(500000, 501000), y=slice(6501000, 6500000))
print(subset.sizes)`, "Why might the y-coordinate slice run from a larger value to a smaller value?", "Labels make array intent explicit, but coordinate order still follows the stored grid. Inspect it rather than assuming ascending axes.", "Calling .values immediately. This discards labelled context and may trigger a large eager load.", { title: "Xarray user guide", href: "https://docs.xarray.dev/en/stable/user-guide/index.html" }),
  lesson(35, 8, "EO Data Cubes", "Extend one spatial band into band and time dimensions while preserving comparable observations.", ["Data cube", "Time series", "Masking"], "Select, mask and aggregate a time × band × y × x Earth Observation cube.", "Are values comparable across every time, band and grid cell in this cube?", ["Band × y × x", "Time × band × y × x", "Selection and aggregation", "Masks and metadata preservation"], "Build or inspect a small multi-date cube and derive a cloud-aware seasonal summary.", "Verify common grid, band definitions, time zones, scaling, masks and observation counts.", "eo_data_cube.ipynb", `clear = cube.where(cube["cloud_mask"] == 0)
season = clear.sel(time=slice("2025-05-01", "2025-08-31"))
median = season["ndvi"].median("time", skipna=True)
observations = season["ndvi"].count("time")
print(median.dims, observations.min().item())`, "Can two pixels in the seasonal median be based on different numbers of dates?", "A temporal composite contains an implicit sampling pattern. Observation count and mask provenance must accompany the summary.", "Averaging before masking clouds. Contaminated values can bias the composite while remaining numerically plausible.", { title: "Xarray indexing and selecting", href: "https://docs.xarray.dev/en/stable/user-guide/indexing.html" }),
  lesson(36, 8, "Dask and Lazy Computation", "Plan chunked computations that fit memory without turning the lesson into distributed-systems engineering.", ["Dask", "Chunks", "Lazy execution"], "Explain lazy graphs, inspect chunks and trigger computation deliberately.", "How can this calculation be divided without breaking its spatial or temporal meaning?", ["Chunks and task graphs", "Lazy versus eager execution", "compute and persistence", "Memory and chunk tradeoffs"], "Compare lazy metadata operations with one bounded compute and record the chunk plan.", "Inspect chunk sizes, estimated memory, graph scope and final array dimensions.", "lazy_cube_processing.ipynb", `import xarray as xr

cube = xr.open_zarr("data/meadow_cube.zarr", chunks={"time": 4, "y": 1024, "x": 1024})
seasonal_mean = cube["ndvi"].mean("time")
print(seasonal_mean.data)
sample = seasonal_mean.isel(y=slice(0, 256), x=slice(0, 256)).compute()
print(sample.shape)`, "Which line constructs work, and which line actually executes it?", "Lazy computation separates an analytical request from execution. Chunk design should follow operation shape and memory, not arbitrary defaults.", "Calling compute() on the entire cube for inspection. Select a bounded diagnostic subset first.", { title: "Dask array best practices", href: "https://docs.dask.org/en/stable/array-best-practices.html" }),
  lesson(37, 8, "COG, Zarr and Cloud-Native Formats", "Match tiled range-readable rasters and chunked arrays to remote access patterns.", ["COG", "Zarr", "Range requests"], "Explain why internal layout—not only file extension—makes data cloud-friendly.", "Can the client retrieve only the spatial or multidimensional pieces it needs?", ["Tiling and overviews", "HTTP range requests", "Chunked multidimensional arrays", "COG versus ordinary TIFF"], "Inspect a COG and a Zarr dataset, then recommend one for a map layer and one for a time cube.", "Check tiling, overviews, compression, chunk layout, metadata consolidation and access latency.", "cloud_format_audit.ipynb", `format_fit = {
    "single analysis-ready map layer": "COG",
    "time-band spatial cube": "Zarr",
}
for use_case, choice in format_fit.items():
    print(use_case, choice, sep=" → ")`, "Why does uploading an untiled GeoTIFF to object storage not automatically make it a COG?", "Cloud-native layout minimises unnecessary transfer. It must still preserve scientific metadata, stable identifiers and versioned provenance.", "Choosing Zarr for every raster. A simple immutable map layer may be more interoperable and efficient as a validated COG.", { title: "Cloud Optimized GeoTIFF", href: "https://www.cogeo.org/" }),
  lesson(38, 8, "STAC", "Discover cloud-hosted Earth Observation assets through consistent catalog metadata.", ["STAC", "Catalog", "Search"], "Search STAC by space, time, collection and cloud cover and inspect returned assets.", "Which catalog evidence proves this asset fits the study area, period and product requirement?", ["Catalog, Collection, Item and Asset", "Spatial and temporal search", "Collection and quality properties", "Connecting metadata to COG assets"], "Query a public STAC API for coastal-meadow imagery and build a reproducible item inventory.", "Record endpoint, query geometry, date range, collection, filters, item IDs, licences and asset roles.", "stac_search_inventory.ipynb", `from pystac_client import Client

catalog = Client.open("https://earth-search.aws.element84.com/v1")
search = catalog.search(
    collections=["sentinel-2-l2a"],
    bbox=[23.3, 58.1, 24.8, 59.2],
    datetime="2025-05-01/2025-08-31",
    query={"eo:cloud_cover": {"lt": 20}},
)
items = list(search.items())
print("items", len(items))`, "Does scene-level cloud cover guarantee a clear study area?", "STAC makes search reproducible, but asset suitability still requires local QA, band-role inspection and licence review.", "Saving only temporary signed asset URLs. Preserve stable item IDs and catalog metadata so assets can be resolved again.", { title: "STAC specification", href: "https://stacspec.org/en" }),

  lesson(39, 9, "Web Maps and Spatial Services", "Understand how browsers request tiles, features and coverages from spatial services.", ["XYZ", "WMS/WFS", "Vector tiles"], "Choose a delivery pattern from data volume, interaction and analytical need.", "Should the client receive a rendered picture, vector features or measured coverage values?", ["Client and server roles", "XYZ and vector tiles", "WMS, WFS and WMTS", "GeoJSON and APIs"], "Design a delivery architecture for an interactive environmental monitoring map.", "Record CRS, scale limits, styling responsibility, cache behaviour, payload size and data sensitivity.", "web_delivery_architecture.md", `delivery = {
    "context_basemap": "XYZ tiles",
    "styled monitoring layer": "WMS or vector tiles",
    "small queryable results": "GeoJSON API",
    "analysis raster access": "COG or WCS",
}
for layer, service in delivery.items():
    print(layer, service)`, "Which option sends styled pixels rather than source features?", "Web delivery separates authoritative data, service representation and browser interaction. The correct service depends on whether users view, query or analyse.", "Sending a huge GeoJSON because it is easy to inspect. Generalisation, tiling or server-side queries may provide a faster and safer product.", { title: "OGC web services", href: "https://www.ogc.org/standards/" }),
  lesson(40, 9, "Interactive Mapping", "Communicate spatial results through a focused interactive map without teaching full frontend engineering.", ["Folium", "MapLibre", "Accessibility"], "Build a lightweight map that reveals evidence, uncertainty and provenance.", "Which interactions help the audience answer the scientific question?", ["Map purpose and audience", "Layers, popups and legends", "Performance and simplification", "Accessible alternatives and provenance"], "Create a map of monitoring results with restrained styling, meaningful popups and a static data summary.", "Test missing values, legend semantics, keyboard access, mobile layout, payload size and source attribution.", "environmental_monitoring_map.html", `import folium

map_view = folium.Map(location=[58.6, 24.5], zoom_start=9, tiles="CartoDB positron")
folium.GeoJson(
    results.to_crs(4326).__geo_interface__,
    tooltip=folium.GeoJsonTooltip(fields=["site_id", "status"]),
).add_to(map_view)
map_view.save("outputs/monitoring_map.html")`, "Which information should remain available outside the visual map?", "Interaction should clarify spatial evidence, not decorate it. A table or text summary supports accessibility and precise interpretation.", "Mapping raw sensitive locations. Generalise, aggregate or restrict delivery when ecological or personal data require protection.", { title: "Folium documentation", href: "https://python-visualization.github.io/folium/latest/" }),
  lesson(41, 9, "OGC Standards and Interoperability", "Relate established web services, OGC APIs, COG and STAC across professional systems.", ["OGC API", "Interoperability", "Services"], "Explain which standards support maps, features, coverages and catalog discovery.", "How can different tools request the same data with shared semantics?", ["WMS, WFS and WCS", "OGC API families", "COG as data access", "STAC as catalog metadata"], "Map a cross-organisation data flow from catalog discovery to analysis and map delivery.", "Verify standard version, endpoint capabilities, CRS support, paging, licence and stable identifiers.", "interoperability_map.md", `standards = {
    "rendered map": "WMS / OGC API Maps",
    "vector features": "WFS / OGC API Features",
    "raster coverage": "WCS / OGC API Coverages / COG",
    "EO discovery": "STAC",
}
for need, standard in standards.items():
    print(need, standard, sep=" → ")`, "Why are STAC and COG complementary rather than competing standards?", "STAC describes and locates assets; COG structures a raster for efficient reads. Interoperability emerges from clear roles and metadata.", "Assuming standard-compliant means identical behaviour. Clients must inspect advertised capabilities, versions and conformance classes.", { title: "OGC API standards", href: "https://ogcapi.ogc.org/" }),
  lesson(42, 10, "ArcGIS Professional Ecosystem", "Position ArcGIS components within a broader interoperable geospatial architecture.", ["ArcGIS Pro", "Enterprise", "Interoperability"], "Compare proprietary and open components by workflow role without making the Academy dependent on one vendor.", "Which component owns data, processing, automation, service delivery and governance?", ["ArcGIS Pro and geodatabases", "ModelBuilder and ArcPy", "ArcGIS Online and Enterprise", "Comparison with QGIS, GeoPandas, PostGIS and MapLibre"], "Translate one Academy workflow between ArcGIS and open-source components and identify portable standards.", "Separate data formats, analytical methods, licences, service interfaces and organisation-specific governance.", "enterprise_gis_comparison.md", `roles = {
    "desktop QA": ["ArcGIS Pro", "QGIS"],
    "Python processing": ["ArcPy", "GeoPandas/Rasterio"],
    "spatial database": ["Enterprise geodatabase", "PostGIS"],
    "web delivery": ["ArcGIS Online", "MapLibre plus services"],
}
for role, options in roles.items():
    print(role, options)`, "Which parts of a workflow are easiest to preserve across ecosystems?", "Professional practice often spans ecosystems. Open formats, explicit methods and standard services reduce lock-in while respecting organisational needs.", "Comparing products only by feature count. Governance, skills, licences, scale, integration and reproducibility determine fit.", { title: "ArcGIS Pro documentation", href: "https://pro.arcgis.com/en/pro-app/latest/help/main/welcome-to-the-arcgis-pro-app-help.htm" }),

  lesson(43, 11, "Image Segmentation Fundamentals", "Separate pixels into meaningful regions before classification or measurement.", ["Segmentation", "Texture", "Objects"], "Compare threshold, connected-region and object-based segmentation concepts.", "What constitutes one spatial object for this scientific question?", ["Thresholding", "Connected components", "Texture and object-based image analysis", "Segmentation versus classification"], "Segment a supplied vegetation image and evaluate boundary quality against reference objects.", "Report threshold or scale parameters, minimum object size, edge effects and over/under-segmentation.", "segmentation_experiment.ipynb", `from skimage.measure import label

vegetation = ndvi > 0.45
regions = label(vegetation, connectivity=2)
region_sizes = np.bincount(regions.ravel())[1:]
print("regions", len(region_sizes))
print("median pixels", np.median(region_sizes))`, "Will changing a threshold alter only class labels, or can it alter the number and shapes of objects?", "Segmentation defines candidate objects; classification assigns meaning. Boundary quality should be evaluated at the scale of the ecological target.", "Selecting parameters from the final evaluation scene. Reserve independent locations to test whether objects generalise.", { title: "scikit-image segmentation", href: "https://scikit-image.org/docs/stable/api/skimage.segmentation.html" }),
  lesson(44, 11, "Deep Learning for Geospatial Images", "Understand the image-to-patch-to-probability-to-mask workflow before using model APIs.", ["CNN", "U-Net", "Semantic segmentation"], "Design a geospatial semantic-segmentation experiment with defensible labels and spatial splits.", "What labelled spatial evidence can teach the model the target class without leakage?", ["Convolutions and receptive fields", "Semantic segmentation and U-Net", "Patches, labels and augmentation", "Train, validation and test geography"], "Specify a patch dataset and trace shapes through a conceptual segmentation pipeline.", "Check label provenance, class balance, patch overlap, spatial split, resolution and probability calibration.", "geospatial_segmentation_design.ipynb", `patch_size = 256
bands = ["blue", "green", "red", "nir"]
batch_shape = (8, len(bands), patch_size, patch_size)
mask_shape = (8, 1, patch_size, patch_size)
print("image batch", batch_shape)
print("target masks", mask_shape)`, "Why can randomly splitting overlapping patches produce unrealistically high validation accuracy?", "A segmentation model learns spatial and spectral patterns encoded by labels. Validation must test new geography rather than neighbouring fragments of training scenes.", "Starting with a complex architecture before establishing a baseline and label audit. Model capacity cannot repair ambiguous classes or leakage.", { title: "PyTorch semantic segmentation", href: "https://pytorch.org/vision/stable/models.html#semantic-segmentation" }),
  lesson(45, 11, "Geospatial Deep Learning QA", "Audit leakage, domain shift, annotation uncertainty and false confidence in mapped predictions.", ["Spatial leakage", "Domain shift", "Calibration"], "Evaluate a geospatial model beyond aggregate accuracy and communicate where it may fail.", "Does the evaluation represent the places, seasons, sensors and resolutions where the model will be used?", ["Spatial leakage and overlapping patches", "Domain shift", "Annotation uncertainty and imbalance", "Probability calibration and false confidence"], "Review a prediction map, spatial confusion patterns and uncertainty across independent regions.", "Report per-class metrics, spatial holdouts, calibration, error geography, threshold choice and unsupported domains.", "deep_learning_qa_report.pdf", `from sklearn.metrics import confusion_matrix

predicted = probability >= 0.6
matrix = confusion_matrix(reference.ravel(), predicted.ravel())
print(matrix)

for region in np.unique(region_ids):
    use = region_ids == region
    print(region, (predicted[use] == reference[use]).mean())`, "Can a high overall accuracy coexist with failure on a rare ecologically important class?", "Model quality is geographically and class conditional. A responsible product maps limitations and decision thresholds alongside predictions.", "Treating softmax probability as calibrated certainty. Confidence requires empirical calibration and may fail under domain shift.", { title: "scikit-learn probability calibration", href: "https://scikit-learn.org/stable/modules/calibration.html" }),

  lesson(46, 12, "APIs and Automated Data Acquisition", "Retrieve versioned environmental data robustly while respecting authentication, pagination and rate limits.", ["HTTP", "JSON", "Retries"], "Design a polite, recoverable and provenance-rich API acquisition step.", "Can this exact request and response inventory be reproduced later?", ["HTTP requests and JSON", "Authentication and secrets", "Pagination, retries and rate limits", "Checksums and provenance"], "Build a bounded API request workflow that records query parameters and response metadata.", "Validate status, schema, pagination completeness, content length, timestamps and stable identifiers.", "api_acquisition_log.ipynb", `import requests

url = "https://api.gbif.org/v1/occurrence/search"
params = {"country": "EE", "scientific_name": "Salicornia europaea", "limit": 100}
response = requests.get(url, params=params, timeout=30)
response.raise_for_status()
payload = response.json()
print("records", len(payload["results"]))
print("request", response.url)`, "Which failure should be retried, and which should stop for corrected authentication or query parameters?", "Automation should make acquisition repeatable without hiding service constraints. Store query, item IDs, retrieval time and licence—not secret tokens.", "Hard-coding API keys in notebooks. Read secrets from protected environment variables and exclude them from version control.", { title: "Requests documentation", href: "https://requests.readthedocs.io/en/latest/" }),
  lesson(47, 12, "Command-Line Geospatial Tools", "Use inspection, conversion and warping commands as composable professional operations.", ["GDAL", "ogr2ogr", "rio"], "Select a CLI tool by operation category and preserve commands in an audit log.", "What inspection or transformation must happen before a larger workflow proceeds?", ["gdalinfo and ogrinfo inspection", "gdal_translate and ogr2ogr conversion", "gdalwarp reprojection and resampling", "rio as the Rasterio command interface"], "Inspect source data, convert a vector layer and create a validated analysis raster using explicit commands.", "Capture tool version, input/output paths, CRS, creation options, command exit status and post-run inspection.", "geospatial_cli_workflow.sh", `gdalinfo data/source.tif
ogrinfo -so data/plots.gpkg plots
ogr2ogr -f GPKG outputs/valid_plots.gpkg data/plots.gpkg \
  -where "qa_status = 'valid'"
gdalwarp -t_srs EPSG:3301 -r bilinear \
  data/source.tif outputs/analysis_grid.tif
gdalinfo outputs/analysis_grid.tif`, "Which command only inspects data, and which creates a transformed derivative?", "CLI commands expose precise, scriptable operations. They remain scientific steps that require method justification and output verification.", "Copying a command without checking shell quoting or overwrite behaviour. Test on a small derivative and inspect the result.", { title: "GDAL programs", href: "https://gdal.org/en/stable/programs/index.html" }),
  lesson(48, 12, "Docker for Geospatial Reproducibility", "Package difficult native dependencies and project commands into a repeatable execution environment.", ["Docker", "GDAL", "Environment"], "Explain images and containers and create a minimal geospatial environment specification.", "Can another researcher rebuild the analytical environment and run the same command?", ["Image versus container", "Dependency and GDAL compatibility", "Pinned environments and data mounts", "Limits of containers"], "Create a Dockerfile and runbook for the pipeline without copying private data into the image.", "Pin base image and key dependencies, run as non-root, mount inputs read-only and record image digest.", "geospatial_pipeline_container", `FROM ghcr.io/osgeo/gdal:ubuntu-small-3.11.4
WORKDIR /academy
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt
COPY src/ src/
ENTRYPOINT ["python3", "src/run_pipeline.py"]`, "Which files belong in the immutable image, and which should be mounted at runtime?", "A container captures software and system dependencies. It does not capture data provenance, hardware equivalence or scientific decisions by itself.", "Using a floating latest tag in a published workflow. Record a version or digest so the environment can be reconstructed.", { title: "Docker build best practices", href: "https://docs.docker.com/build/building/best-practices/" }),
  lesson(49, 12, "Workflow Automation and CI", "Turn the complete pipeline into validated stages that run consistently on every change.", ["GitHub Actions", "Tests", "Artifacts"], "Design continuous integration for input validation, processing tests and reviewable outputs.", "Which automated evidence should block publication when the workflow changes?", ["Input validation and contracts", "Unit and integration tests", "Deterministic outputs and artifacts", "Continuous integration with GitHub Actions"], "Add a CI workflow that installs a pinned environment, validates a small fixture, runs tests and publishes a QA artifact.", "Use tiny licensed fixtures, cache safely, fail on warnings that affect validity and retain logs and checksums.", "geospatial_pipeline_ci.yml", `name: validate-geospatial-pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest -q
      - run: python src/run_pipeline.py --config tests/fixture.yml`, "Which stage should fail first when a source raster has the wrong CRS?", "CI turns pipeline expectations into visible evidence. Small deterministic fixtures test logic; scientific validation still requires representative real data and expert review.", "Running the complete confidential or terabyte-scale dataset in CI. Test contracts and core methods with compact fixtures, then execute full production work in the governed environment.", { title: "GitHub Actions documentation", href: "https://docs.github.com/en/actions" }),
];

module2Lessons.push({
  id: "lesson-2-capstone",
  number: "Capstone",
  chapter: 13,
  title: "UAV and Satellite Analysis Pipeline",
  description: "Integrate field plots, vector zones, UAV products, satellite observations and production QA into one defensible professional delivery.",
  tools: ["Pipeline design", "Spatial validation", "Professional delivery"],
  outcome: "Design, implement, validate and communicate a complete geospatial Earth Observation workflow",
  spatialQuestion: "Does every output preserve a traceable chain from observation support to validated environmental interpretation?",
  concepts: ["End-to-end spatial evidence", "Cross-sensor alignment", "Validation and uncertainty", "Reproducible delivery"],
  practical: "Assemble field observations, a study boundary, UAV products and satellite observations into one versioned pipeline with maps, tables and QA evidence.",
  qa: "Run provenance, CRS, grid, support, missingness, leakage, uncertainty and reproducibility checks before release.",
  artifact: "UAV_and_Satellite_Analysis_Pipeline",
  code: `pipeline_stages = [
    "validate inputs and provenance",
    "standardise vector and raster reference systems",
    "align grids and spatial support",
    "derive UAV and satellite predictors",
    "extract and validate plot evidence",
    "publish maps, tables and uncertainty",
]
for stage in pipeline_stages:
    print("✓", stage)`,
  prediction: "Which earlier QA failure would invalidate the largest number of downstream outputs?",
  interpretation: "A professional pipeline is a connected claim–evidence system. Its value comes from transparent spatial decisions, validation, limitations and reproducible delivery—not from the number of tools used.",
  commonMistake: "Presenting only the final map. Reviewers need to trace source data, support, transformations, exclusions, validation and uncertainty.",
  reference: { title: "The Turing Way: reproducible research", href: "https://book.the-turing-way.org/reproducible-research/reproducible-research" },
});

const chapterTitles = [
  "Spatial Foundations",
  "Vector GIS and Spatial Computation",
  "Raster Science",
  "UAV and Photogrammetry",
  "Satellite Earth Observation",
  "Spatial Statistics and Geostatistics",
  "Spatial Databases",
  "Multidimensional and Cloud-Native Data",
  "Web GIS and Delivery",
  "Enterprise GIS",
  "Advanced Image Analysis",
  "Production Geospatial Computing",
];

export const publishedModule2LessonIds = [
  "lesson-2-01",
  "lesson-2-02",
  "lesson-2-03",
  "lesson-2-04",
] as const;

const publishedModule2LessonIdSet = new Set<string>(publishedModule2LessonIds);

export const publishedModule2Lessons = module2Lessons.filter((source) =>
  publishedModule2LessonIdSet.has(source.id),
);

export const module2Overview: AcademyModuleOverview = {
  moduleNumber: 2,
  accent: "blue",
  overviewLabel: "Module 2 overview",
  navigationTitle: "Available Module 2 lessons",
  navigationMeta: "4 lessons available",
  syllabusAriaLabel: "Complete forty-nine-lesson Module 2 map",
  planningNote:
    "Chapter 1 is available now. The remaining lessons and capstone stay visible as the planned professional pathway and will be released only after full educational review.",
  title: "Geospatial Data Science",
  purpose:
    "Turn vector, raster, UAV and satellite data into reproducible spatial analyses by learning spatial reasoning before software operations.",
  finalProject: "UAV and Satellite Analysis Pipeline",
  prerequisites:
    "Module 1 or equivalent Python, Jupyter, pandas, NumPy, data-quality and scientific-plotting competence",
  outcomes: [
    "Reason explicitly about CRS, scale, spatial support and uncertainty",
    "Validate vector geometry, joins, topology and database operations",
    "Process aligned raster, UAV, optical, SAR, hyperspectral and LiDAR data",
    "Apply spatial sampling, autocorrelation and geostatistical reasoning",
    "Work with PostGIS, Xarray, Dask, COG, Zarr and STAC",
    "Deliver interoperable web maps and production-ready automated pipelines",
  ],
  progression: [
    "Spatial thinking",
    "Reference and scale",
    "Vector relationships",
    "Raster grids",
    "UAV and satellite EO",
    "Spatial inference",
    "Cloud and databases",
    "Delivery and production",
  ],
  chapters: chapterTitles.map((title, index) => ({
    number: index + 1,
    title,
    lessons: module2Lessons
      .filter((item) => item.chapter === index + 1)
      .map((item) => ({
        number: Number(item.number.split(".")[1]),
        title: item.title,
        status: publishedModule2LessonIdSet.has(item.id) ? "available" as const : "planned" as const,
        lessonId: publishedModule2LessonIdSet.has(item.id) ? item.id : undefined,
      })),
  })),
  capstone: {
    number: 50,
    title: "UAV and Satellite Analysis Pipeline",
    status: "planned",
  },
};

type PublishedLessonConfiguration = {
  estimatedTime: string;
  markdownFile: string;
  formativeChecks: FormativeCheck[];
  submissionChecklist: string[];
  rubric: ReviewedLessonDetails["rubric"];
  coreReferences: Array<{ title: string; href: string }>;
  furtherReading: Array<{ title: string; href: string }>;
};

const publishedLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-01": {
    estimatedTime: "90–110 minutes",
    markdownFile: "content/lessons/module-2/lesson-01.md",
    formativeChecks: [
      {
        id: "m2-l1-spatial-evidence",
        question: "The Baltic field table contains site names and sample identifiers but no coordinates or geometry. What can you conclude?",
        options: [
          "It is tabular data with location-related attributes, but it cannot yet be mapped as features",
          "Every row is automatically a point feature",
          "The site name proves an EPSG code",
        ],
        correctOption: 0,
        explanation: "Names can support a later documented join, but they do not supply geometry, coordinates or a spatial reference by themselves.",
      },
      {
        id: "m2-l1-vector-raster",
        question: "Which distinction best separates vector and raster representations?",
        options: [
          "Vector stores discrete geometries; raster stores values on a referenced grid",
          "Vector is always accurate; raster is always approximate",
          "Vector contains attributes; raster never does",
        ],
        correctOption: 0,
        explanation: "Both are spatial models. Their suitability depends on the phenomenon, observation process, resolution and intended operation.",
      },
      {
        id: "m2-l1-crs-missing",
        question: "A table contains x = 650000 and y = 6430000 but no CRS. What is the defensible next action?",
        options: [
          "Quarantine it as spatial data with unverified CRS metadata and investigate provenance",
          "Assume longitude and latitude because there are two numbers",
          "Plot it and keep whichever map looks plausible",
        ],
        correctOption: 0,
        explanation: "Coordinate values are ambiguous without axis definitions, units, datum and reference system. Visual plausibility is not provenance.",
      },
    ],
    submissionChecklist: [
      "All four data cards are classified with evidence rather than filename alone",
      "Geometry, coordinate, grid and CRS evidence are recorded separately",
      "The published field table is not presented as mapped plot data",
      "Unknown CRS metadata is reported as unresolved rather than guessed",
      "The inventory includes a next action and scientific risk for every asset",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Classifies tabular, vector, raster and incomplete spatial data accurately" },
      { dimension: "Conceptual understanding", expectation: "Explains how location, representation and spatial reference work together" },
      { dimension: "Reproducibility", expectation: "Records evidence, provenance and next actions in a reusable inventory" },
      { dimension: "Scientific communication", expectation: "Separates known spatial facts from unsupported assumptions" },
    ],
    coreReferences: [
      { title: "OGC Simple Feature Access standard", href: "https://www.ogc.org/standards/sfa/" },
      { title: "RFC 7946: The GeoJSON Format", href: "https://www.rfc-editor.org/rfc/rfc7946" },
    ],
    furtherReading: [
      { title: "Baltic coastal plant traits dataset", href: "https://zenodo.org/records/20083250" },
      { title: "The Turing Way: data provenance", href: "https://book.the-turing-way.org/reproducible-research/rdm/rdm-provenance" },
    ],
  },
  "lesson-2-02": {
    estimatedTime: "110–130 minutes",
    markdownFile: "content/lessons/module-2/lesson-02.md",
    formativeChecks: [
      {
        id: "m2-l2-assign-transform",
        question: "What is the difference between set_crs() and to_crs()?",
        options: [
          "set_crs() labels existing coordinates; to_crs() calculates new coordinates for the same Earth locations",
          "Both functions transform coordinate values in the same way",
          "set_crs() is for rasters and to_crs() is for vectors",
        ],
        correctOption: 0,
        explanation: "Assign a CRS only when the original reference system is known. Transform only after trustworthy source CRS metadata exists.",
      },
      {
        id: "m2-l2-units",
        question: "Why are longitude–latitude degrees unsuitable for a five-metre buffer?",
        options: [
          "Degrees are angular units whose ground distance varies by location and direction",
          "Degrees cannot store decimal values",
          "Projected CRSs remove all distortion everywhere",
        ],
        correctOption: 0,
        explanation: "A suitable projected CRS provides linear units and controlled distortion for a defined area of use; it does not make the curved Earth distortion-free.",
      },
      {
        id: "m2-l2-qa",
        question: "Which evidence best verifies a coordinate transformation?",
        options: [
          "Source and target CRS, units, bounds, sample coordinates and an independent location check",
          "The layer draws without an error",
          "The target EPSG number is larger than the source number",
        ],
        correctOption: 0,
        explanation: "Transformation QA combines metadata, numerical plausibility and an independent spatial reference; display alone can hide a wrong assignment.",
      },
    ],
    submissionChecklist: [
      "Source CRS and its evidence are recorded before any operation",
      "Target CRS is justified from purpose, area of use and units",
      "set_crs() and to_crs() are used only for their distinct purposes",
      "Bounds and sample coordinates are documented before and after transformation",
      "An independent spatial check confirms that Earth locations were preserved",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Transforms both instructional datasets into one justified analysis CRS without relabelling errors" },
      { dimension: "Conceptual understanding", expectation: "Explains datum, geographic/projected CRS, distortion, axis order and units at an applied level" },
      { dimension: "Reproducibility", expectation: "Preserves a complete before-and-after CRS audit" },
      { dimension: "Scientific communication", expectation: "States why the selected projection is suitable and where it remains limited" },
    ],
    coreReferences: [
      { title: "GeoPandas set_crs documentation", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoDataFrame.set_crs.html" },
      { title: "GeoPandas to_crs documentation", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoDataFrame.to_crs.html" },
    ],
    furtherReading: [
      { title: "pyproj CRS documentation", href: "https://pyproj4.github.io/pyproj/stable/api/crs/crs.html" },
      { title: "EPSG Dataset", href: "https://epsg.org/home.html" },
    ],
  },
  "lesson-2-03": {
    estimatedTime: "95–115 minutes",
    markdownFile: "content/lessons/module-2/lesson-03.md",
    formativeChecks: [
      {
        id: "m2-l3-support",
        question: "What does spatial support describe?",
        options: [
          "The physical area and geometry over which one value is observed or aggregated",
          "Only the pixel width written in a filename",
          "The total number of rows in a table",
        ],
        correctOption: 0,
        explanation: "Support belongs to the observation itself. A quadrat measurement and a raster pixel can have different support even when their centres coincide.",
      },
      {
        id: "m2-l3-resolution",
        question: "A 5 cm UAV pixel is smaller than a 10 m Sentinel-2 pixel. What follows?",
        options: [
          "It samples a finer grid, but accuracy and ecological relevance still require separate evidence",
          "It is automatically more accurate for every variable",
          "It can be compared directly with one square-metre biomass without aggregation",
        ],
        correctOption: 0,
        explanation: "Pixel size is one part of resolution. Calibration, point-spread response, registration, timing and process scale also matter.",
      },
      {
        id: "m2-l3-maup",
        question: "Why should an aggregation boundary be chosen before inspecting preferred results?",
        options: [
          "Changing zones can change the statistic, so the choice needs an independent scientific rationale",
          "All boundaries produce identical summaries",
          "Aggregation removes mixed pixels",
        ],
        correctOption: 0,
        explanation: "This is the practical warning behind MAUP: summaries can depend on the size and arrangement of reporting units.",
      },
    ],
    submissionChecklist: [
      "Grain, extent, support geometry and observation time are distinguished",
      "Area ratios for quadrat, UAV and Sentinel-2 supports are calculated correctly",
      "Mixed-pixel and registration risks are identified",
      "Aggregation is justified from the ecological question rather than convenience",
      "Remaining scale mismatch is reported explicitly",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Computes and compares physical support without confusing linear and area units" },
      { dimension: "Conceptual understanding", expectation: "Distinguishes scale, grain, extent, resolution, support, mixed pixels and introductory MAUP" },
      { dimension: "Reproducibility", expectation: "Records a support-matching decision table with units and aggregation rules" },
      { dimension: "Scientific communication", expectation: "Explains what each observation scale can and cannot support" },
    ],
    coreReferences: [
      { title: "ESA Sentinel-2 facts and figures", href: "https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Facts_and_figures" },
    ],
    furtherReading: [
      { title: "NASA Earthdata: spatial resolution", href: "https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/spatial-resolution" },
      { title: "The Turing Way: documenting data", href: "https://book.the-turing-way.org/reproducible-research/rdm/rdm-metadata" },
    ],
  },
  "lesson-2-04": {
    estimatedTime: "105–125 minutes",
    markdownFile: "content/lessons/module-2/lesson-04.md",
    formativeChecks: [
      {
        id: "m2-l4-format",
        question: "Which format is the strongest default for an editable multi-layer local vector project?",
        options: ["GeoPackage", "A loose Shapefile component", "A screenshot of the map"],
        correctOption: 0,
        explanation: "GeoPackage is a single SQLite container with modern schema and CRS support. The final decision still depends on the receiving systems and governance requirements.",
      },
      {
        id: "m2-l4-cog",
        question: "What makes a Cloud Optimized GeoTIFF useful for remote access?",
        options: [
          "Internal tiling, overviews and file organisation that support HTTP range requests",
          "It removes the need for CRS and NoData metadata",
          "It converts every raster into a multidimensional data cube",
        ],
        correctOption: 0,
        explanation: "COG changes how a GeoTIFF is organised for efficient partial reads; it does not change the scientific meaning of the raster values.",
      },
      {
        id: "m2-l4-conversion",
        question: "When is a format conversion complete?",
        options: [
          "After reopening the derivative and verifying schema, CRS, counts, NoData and provenance",
          "As soon as the output path exists",
          "When the file extension looks modern",
        ],
        correctOption: 0,
        explanation: "A successful write proves only that bytes were produced. Scientific and operational properties must survive the conversion.",
      },
    ],
    submissionChecklist: [
      "Each format choice follows structure, scale, access and interoperability requirements",
      "Shapefile limitations are explained without claiming that every legacy dataset is unusable",
      "GeoTIFF and COG, and NetCDF and Zarr, are distinguished accurately",
      "Conversion QA covers schema, CRS, geometry/grid, NoData and provenance",
      "The decision matrix records one limitation and rejected alternative for each product",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Matches field points, large vectors, analysis rasters and EO cubes to defensible formats" },
      { dimension: "Conceptual understanding", expectation: "Explains how format structure and access pattern affect scientific workflows" },
      { dimension: "Reproducibility", expectation: "Defines post-conversion checks and preserves source provenance" },
      { dimension: "Scientific communication", expectation: "Communicates choices as conditional decisions rather than universal rankings" },
    ],
    coreReferences: [
      { title: "GDAL ESRI Shapefile driver", href: "https://gdal.org/en/stable/drivers/vector/shapefile.html" },
      { title: "OGC GeoPackage standard", href: "https://www.ogc.org/standards/geopackage/" },
      { title: "Cloud Optimized GeoTIFF", href: "https://cogeo.org/" },
    ],
    furtherReading: [
      { title: "GeoParquet specification", href: "https://geoparquet.org/" },
      { title: "Zarr specifications", href: "https://zarr-specs.readthedocs.io/" },
      { title: "Unidata netCDF documentation", href: "https://docs.unidata.ucar.edu/netcdf-c/current/" },
    ],
  },
};

export const module2LessonDetails: Record<string, ReviewedLessonDetails> = Object.fromEntries(
  publishedModule2Lessons.map((source, index) => {
    const configuration = publishedLessonConfigurations[source.id];
    if (!configuration) {
      throw new Error(`Missing reviewed Module 2 configuration for ${source.id}`);
    }
    return [
      source.id,
      {
        estimatedTime: configuration.estimatedTime,
        position: index + 1,
        totalPositions: publishedModule2Lessons.length,
        markdownFile: configuration.markdownFile,
        formativeChecks: configuration.formativeChecks,
        submissionChecklist: configuration.submissionChecklist,
        rubric: configuration.rubric,
        technicalMetadata: {
          pythonVersion: "Python 3.12",
          jupyterEnvironment: "JupyterLab 4 / Notebook 7; GeoPandas and pyproj versions recorded by the learner",
          reviewDate: "10 August 2026",
          datasetCitation: "Baltic coastal plant traits 2024, Zenodo record 20083250, https://doi.org/10.5281/zenodo.20083250",
          coreReferences: configuration.coreReferences,
          furtherReading: configuration.furtherReading,
        },
      } satisfies ReviewedLessonDetails,
    ];
  }),
);
