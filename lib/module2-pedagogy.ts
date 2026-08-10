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
  lesson(9, 2, "Topology, Geometry Cleaning and Data Integrity", "Clean multipart, invalid and duplicated geometries while retaining an explicit topology decision log.", ["Dissolve", "Explode", "Topology QA"], "Prepare a polygon layer for analysis without silently changing its intended boundaries.", "Which defects prevent computation, and which apparent defects reflect valid real-world topology?", ["Dissolve, explode and clip", "Validity and geometry repair", "Slivers and duplicate geometry", "Topology QA with provenance"], "Audit and prepare a study-area polygon dataset for zonal analysis.", "Track feature counts and total area before and after every repair or aggregation.", "vector_topology_report.ipynb", `import geopandas as gpd

zones = gpd.read_file("data/study_zones.gpkg")
before_area = zones.to_crs("EPSG:3301").area.sum()
invalid = ~zones.geometry.is_valid
clean = zones.copy()
clean.loc[invalid, "geometry"] = clean.loc[invalid].geometry.make_valid()
after_area = clean.to_crs("EPSG:3301").area.sum()
print("invalid", invalid.sum(), "area change", after_area - before_area)`, "Should make_valid() be applied to every geometry automatically?", "Geometry repair is a documented intervention. Stable area and feature counts are useful QA signals, but domain review must confirm the repaired topology.", "Using buffer(0) as an unexplained universal repair. It can alter polygon structure and conceal the reason a geometry was invalid.", { title: "GeoPandas geometry validity", href: "https://geopandas.org/en/stable/docs/user_guide/geometric_manipulations.html" }),
  lesson(10, 2, "QGIS for Professional Spatial QA", "Use QGIS as a visual verification companion to reproducible Python processing.", ["QGIS", "Visual QA", "Map export"], "Inspect CRS, attributes, geometry, raster behaviour and styled outputs in a repeatable QA protocol.", "What spatial defect can visual inspection reveal that a summary table may miss?", ["Layer and CRS inspection", "Geometry validation and processing tools", "Attribute joins and field calculations", "Professional map export"], "Load Python-produced vectors and rasters into QGIS, inspect them against source layers and export one QA map.", "Record QGIS version, project CRS, layer sources, symbology rules and every observed anomaly.", "qgis_visual_qa_report.pdf", `qa_checks = [
    "CRS and extent agree",
    "features overlay expected basemap locations",
    "attributes and IDs match source",
    "NoData and class symbology are explicit",
    "export includes legend, scale and provenance",
]
for check in qa_checks:
    print("□", check)`, "Which checks remain necessary even when the map looks visually correct?", "QGIS accelerates visual diagnosis, but the reproducible processing record remains in code. A polished map is evidence of communication, not proof of analytical validity.", "Editing the only source layer to fix a visual problem. Preserve raw inputs and export any corrected layer as a documented derivative.", { title: "QGIS training manual", href: "https://docs.qgis.org/latest/en/docs/training_manual/" }),
  lesson(11, 3, "What Is a Raster Really?", "Build a rigorous mental model of values, grids, spatial reference, valid support and measurement semantics before processing.", ["Raster model", "Affine transform", "NoData"], "Explain how an array becomes a geospatial raster and locate one cell's footprint.", "What physical quantity, footprint and validity state does each cell represent?", ["Rows, columns, cells and bands", "Origin, transform, resolution and bounds", "Data type, NoData and masks", "Continuous versus categorical semantics"], "Create a raster anatomy and metadata record for a synthetic grid.", "Confirm dimensions, transform, CRS, bounds, semantics, support and valid-data convention.", "01_raster_inventory.ipynb", `width, height = 4, 3
x_origin, y_origin = 500000, 6500000
pixel_size = 10
col, row = 2, 1
x = x_origin + (col + 0.5) * pixel_size
y = y_origin - (row + 0.5) * pixel_size
print("cell centre", x, y)`, "Why is one pixel-centre coordinate offset by half a pixel from the grid origin?", "A raster is not just a matrix. Its transform and CRS connect array positions to Earth locations; band metadata connects values to measured variables.", "Treating NoData as zero. Zero may be a valid measurement or category, while NoData marks unavailable or excluded support.", { title: "Rasterio georeferencing", href: "https://rasterio.readthedocs.io/en/stable/topics/georeferencing.html" }),
  lesson(12, 3, "Rasterio: Read, Inspect and Write Spatial Grids", "Inspect a GeoTIFF spatial contract, read masked values and verify a written derivative through a complete round trip.", ["Rasterio", "NumPy", "Round-trip QA"], "Read, audit and write spatial grids without losing critical metadata or validity information.", "What must remain invariant, and what is intentionally changed, when this raster is written?", ["Dataset context manager", "Metadata-first audit", "Masked and windowed reads", "Profile copy and reopened validation"], "Create a structured audit for three synthetic rasters and two verified derivatives.", "Verify checksum, grid, band meaning, valid cells, representative values and output round trip.", "02_rasterio_audit.ipynb", `import rasterio

with rasterio.open("data/imagery.tif") as src:
    audit = {
        "crs": str(src.crs), "resolution": src.res,
        "bounds": tuple(src.bounds), "shape": src.shape,
        "bands": src.count, "dtype": src.dtypes,
        "nodata": src.nodata,
    }
print(audit)`, "Which properties can be inspected without loading the full raster band?", "Metadata-first inspection prevents expensive or invalid processing. The array becomes meaningful only when read with its profile and mask.", "Calling read() before checking shape and dtype. A large multiband raster may exceed memory even though opening its metadata is inexpensive.", { title: "Rasterio reading datasets", href: "https://rasterio.readthedocs.io/en/stable/topics/reading.html" }),
  lesson(13, 3, "Crop, Mask, Reproject and Resample", "Separate four transformations and choose their sequence and resampling logic from scientific meaning.", ["Rasterio", "Resampling", "Masking"], "Apply crop, mask, reprojection and resampling for separate, scientifically justified purposes.", "Which spatial property must change, and which information cannot be recovered?", ["Crop changes rectangular extent", "Mask defines valid support", "Reproject creates a destination grid", "Resampling follows variable semantics"], "Prepare continuous and categorical rasters for one study grid and record each operation.", "Reopen outputs and report CRS, transform, extent, shape, NoData, classes, range and method.", "03_reprojection_resampling.ipynb", `from rasterio.enums import Resampling

resampling_by_data = {
    "land_cover": Resampling.nearest,
    "surface_temperature": Resampling.bilinear,
}
for layer, method in resampling_by_data.items():
    print(layer, method.name)`, "What false classes could bilinear interpolation create between categorical class codes 1 and 5?", "Nearest-neighbour usually preserves categorical labels; interpolation can suit continuous fields. Upsampling produces more cells, not new sensor information.", "Using the word clip for every operation. Distinguish rectangular crop from geometry mask and record whether pixels outside the polygon remain as NoData.", { title: "Rasterio reprojection", href: "https://rasterio.readthedocs.io/en/stable/topics/reproject.html" }),
  lesson(14, 3, "Raster Alignment and Grid Integrity", "Detect grid mismatch, design a common lattice and prove cell-by-cell compatibility explicitly.", ["Grid alignment", "Target grid", "QA function"], "Diagnose raster alignment and create an explicit target-grid specification.", "Do corresponding row and column positions describe the same ground footprint?", ["Complete grid contract", "Origin shifts and cell centres", "Intersection versus union extent", "Snapping, tolerance and NoData"], "Create check_raster_alignment() and test all deliberate training mismatches.", "Return property-level diagnostics and fail for shifted origin, CRS, resolution and extent cases.", "04_alignment_validation.ipynb", `def check_raster_alignment(a, b):
    checks = {
        "crs": a.crs == b.crs,
        "transform": a.transform.almost_equals(b.transform),
        "shape": a.shape == b.shape,
        "bounds": a.bounds == b.bounds,
    }
    return checks

print(check_raster_alignment(raster_a, raster_b))`, "Could two rasters share CRS, resolution and shape while using different cell origins?", "Cell-by-cell arithmetic assumes identical footprints at every index. An unnoticed half-pixel shift can turn spectral combinations into spatial mixtures.", "Checking only CRS and shape. Neither guarantees a shared origin, transform, extent or band convention.", { title: "Rasterio transforms", href: "https://rasterio.readthedocs.io/en/stable/topics/transforms.html" }),
  lesson(15, 3, "Raster–Vector Integration", "Extract raster evidence to vector sampling units through a spatial-support decision rather than a default pixel lookup.", ["Sampling", "Zonal statistics", "Spatial support"], "Choose point, polygon, buffer or zonal extraction and justify the represented footprint.", "Does the raster extraction describe support comparable to the field measurement?", ["Point and polygon sampling", "Justified buffers", "Valid coverage and NoData", "Positional uncertainty and edge effects"], "Compare point, footprint, median and buffered extraction for synthetic plot polygons.", "Report method, valid cell count, valid fraction, value, source and support rationale.", "05_raster_vector_integration.ipynb", `import numpy as np
from rasterio.features import geometry_mask

inside = geometry_mask([plot_geometry], out_shape=src.shape,
                       transform=src.transform, invert=True)
band = src.read(1, masked=True)
valid_inside = inside & ~np.ma.getmaskarray(band)
values = band.data[valid_inside]
print("count", values.size)
print("mean", values.mean() if values.size else None)`, "How should you interpret a mean derived from incomplete or edge-sensitive support?", "Extraction creates plot-level evidence only under its declared support, validity and temporal rules.", "Taking one containing cell by default. Field footprint and positional uncertainty may require a polygon or sensitivity analysis.", { title: "Rasterio vector features", href: "https://rasterio.readthedocs.io/en/stable/topics/features.html" }),
  lesson(16, 3, "Large Raster Processing", "Estimate memory, process stored blocks and use virtual transformed views without changing numerical meaning.", ["Windows", "Blocks", "WarpedVRT"], "Design and validate a windowed raster workflow within a declared memory budget.", "What is the smallest spatial block and neighbourhood required for a correct output?", ["Memory estimation", "Windowed and tiled processing", "Halos and multi-pass operations", "WarpedVRT and equivalence checks"], "Compare full-read and block-wise transformations on the tiled training raster.", "Preserve grid and masks, process edge windows and prove output equivalence.", "06_large_raster_processing.ipynb", `import rasterio

with rasterio.open("data/ndvi.tif") as src:
    profile = src.profile.copy()
    with rasterio.open("outputs/ndvi_scaled.tif", "w", **profile) as dst:
        for _, window in src.block_windows(1):
            block = src.read(1, window=window, masked=True)
            dst.write((block * 100).filled(src.nodata), 1, window=window)`, "Why should processing follow source block windows rather than arbitrary single-row reads?", "Windowing controls memory and can align I/O with internal tiling. It does not remove the need to preserve masks, halos and global-operation assumptions.", "Assuming every algorithm is independently tileable. Filters and terrain derivatives may need neighbouring pixels or global statistics.", { title: "Rasterio windowed reading", href: "https://rasterio.readthedocs.io/en/stable/topics/windowed-rw.html" }),
  lesson(17, 3, "Terrain Analysis with DEM and DSM", "Interpret elevation surfaces and derive slope, aspect and hillshade without losing vertical-reference and surface meaning.", ["DEM / DSM / DTM", "Slope and aspect", "Terrain QA"], "Distinguish elevation surfaces and derive labelled, validated terrain products.", "Which surface, grid, units and vertical reference support the intended interpretation?", ["DEM, DSM and DTM meanings", "Vertical reference and units", "Slope, circular aspect and hillshade", "Aligned surface differencing"], "Create a terrain derivative and interpretation report from synthetic DEM and DSM fixtures.", "Confirm surface type, horizontal and vertical metadata, resolution, edge treatment and plausible ranges.", "07_terrain_analysis.ipynb", `import numpy as np

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
  "lesson-2-05",
  "lesson-2-06",
  "lesson-2-07",
  "lesson-2-08",
  "lesson-2-09",
  "lesson-2-10",
  "lesson-2-11",
  "lesson-2-12",
  "lesson-2-13",
  "lesson-2-14",
  "lesson-2-15",
  "lesson-2-16",
  "lesson-2-17",
] as const;

const publishedModule2LessonIdSet = new Set<string>(publishedModule2LessonIds);

export const publishedModule2Lessons = module2Lessons.filter((source) =>
  publishedModule2LessonIdSet.has(source.id),
);

export const module2ChapterPractica = [
  {
    id: "module-2-chapter-1-practicum",
    chapter: 1,
    title: "Accept, Review or Reject?",
    description: "Make a documented data-acceptance decision from incomplete spatial evidence before analysis begins.",
    tools: ["Evidence review", "Risk classification", "Decision record"],
    artifact: "Artifact 2.A — Geospatial data acceptance decision",
  },
  {
    id: "module-2-chapter-2-practicum",
    chapter: 2,
    title: "Vector Handover Review",
    description: "Audit a vector delivery as if you were accepting responsibility for the next professional analysis stage.",
    tools: ["Vector QA", "Reconciliation", "Handover decision"],
    artifact: "Artifact 2.B — Analysis-ready vector handover",
  },
  {
    id: "module-2-chapter-3-practicum",
    chapter: 3,
    title: "Build an Analysis-Ready Raster Stack",
    description: "Harmonise five deliberately different raster inputs into one validated grid with extraction and QA evidence.",
    tools: ["Raster harmonisation", "Alignment QA", "Professional handover"],
    artifact: "Artifact 2.C — Analysis-ready raster stack and QA report",
  },
] as const;

export const module2Overview: AcademyModuleOverview = {
  moduleNumber: 2,
  accent: "blue",
  overviewLabel: "Module 2 overview",
  navigationTitle: "Available Module 2 lessons",
  navigationMeta: "17 lessons · 3 practica available",
  syllabusAriaLabel: "Complete forty-nine-lesson Module 2 map",
  planningNote:
    "Lessons 2.1–2.17 and three chapter practica are available now, completing Spatial Foundations, Vector GIS and Raster Science. The remaining lessons and capstone stay visible as the planned professional pathway and will be released only after full educational review.",
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
  chapters: chapterTitles.map((title, index) => {
    const practicum = module2ChapterPractica.find((item) => item.chapter === index + 1);
    return {
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
      practicum: practicum ? {
        title: practicum.title,
        status: "available" as const,
        lessonId: practicum.id,
      } : undefined,
    };
  }),
  capstone: {
    number: 50,
    title: "UAV and Satellite Analysis Pipeline",
    status: "planned",
  },
};

type PublishedLessonConfiguration = {
  estimatedTime: string;
  lessonType: string;
  markdownFile: string;
  formativeChecks: FormativeCheck[];
  submissionChecklist: string[];
  rubric: ReviewedLessonDetails["rubric"];
  coreReferences: Array<{ title: string; href: string }>;
  furtherReading: Array<{ title: string; href: string }>;
};

const publishedLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-01": {
    estimatedTime: "60–80 minutes",
    lessonType: "Concept",
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
      {
        id: "m2-l1-resolution-accuracy",
        question: "Which statement confuses resolution with accuracy?",
        options: [
          "A 5 cm pixel proves that every mapped boundary is accurate to 5 cm",
          "A 5 cm pixel describes the nominal grid-cell size",
          "Positional accuracy requires independent reference evidence",
        ],
        correctOption: 0,
        explanation: "Resolution describes the detail or sampling interval represented. Accuracy describes closeness to a reference or truth and must be evaluated separately.",
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
    estimatedTime: "90–120 minutes",
    lessonType: "Concept + Lab",
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
    estimatedTime: "90–120 minutes",
    lessonType: "Concept + Design Lab",
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
    estimatedTime: "90–120 minutes",
    lessonType: "Professional Decision Lab",
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
  "lesson-2-05": {
    estimatedTime: "90–120 minutes",
    lessonType: "Technical Lab",
    markdownFile: "content/lessons/module-2/lesson-05.md",
    formativeChecks: [
      {
        id: "m2-l5-geodataframe",
        question: "What makes a GeoDataFrame spatial rather than an ordinary pandas DataFrame?",
        options: [
          "An active geometry column and CRS connect tabular records to a spatial representation",
          "Every column must contain coordinates",
          "Its index automatically becomes a scientifically stable feature identifier",
        ],
        correctOption: 0,
        explanation: "A GeoDataFrame retains pandas rows and attributes while adding geometry-aware behaviour. Stable identifiers, CRS truth and scientific fitness still require validation.",
      },
      {
        id: "m2-l5-audit",
        question: "Which evidence should be recorded before using a newly opened point layer?",
        options: [
          "Row and ID checks, geometry types, missing and empty geometry, CRS and bounds",
          "Only a screenshot showing that the points draw",
          "Only the file extension and modification date",
        ],
        correctOption: 0,
        explanation: "A plot can hide duplicated identity, empty geometry and incorrect reference metadata. A structured numerical audit makes those conditions testable and reproducible.",
      },
      {
        id: "m2-l5-roundtrip",
        question: "When is the new GeoPackage derivative ready for analytical use?",
        options: [
          "After it is reopened and row count, IDs, geometry, CRS and bounds are compared with the intended source transformation",
          "When to_file() returns without raising an exception",
          "When its file size is smaller than the GeoJSON input",
        ],
        correctOption: 0,
        explanation: "Writing bytes is not preservation evidence. Reopening and comparing the derivative detects schema, geometry and metadata loss while the immutable source remains available.",
      },
    ],
    submissionChecklist: [
      "All four synthetic training layers are identified as instructional rather than published field evidence",
      "Row count, stable IDs, geometry types, missing, empty, validity, CRS and bounds are audited",
      "Filtering decisions preserve excluded IDs and an explicit scientific rule",
      "GeoPackage layers are written as derivatives and reopened for round-trip verification",
      "The stop/go audit detects at least one deliberately introduced defect",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Reads, audits, filters, plots and writes GeoDataFrames without losing their spatial contract" },
      { dimension: "Conceptual understanding", expectation: "Explains active geometry, CRS, stable identity, per-feature bounds and total bounds" },
      { dimension: "Reproducibility", expectation: "Uses portable paths, preserves raw inputs and verifies every written GeoPackage layer" },
      { dimension: "Scientific communication", expectation: "Separates structural fitness from positional accuracy and ecological validity" },
    ],
    coreReferences: [
      { title: "GeoPandas GeoDataFrame reference", href: "https://geopandas.org/en/stable/docs/reference/geodataframe.html" },
      { title: "GeoPandas reading and writing files", href: "https://geopandas.org/en/stable/docs/user_guide/io.html" },
      { title: "RFC 7946: The GeoJSON Format", href: "https://www.rfc-editor.org/rfc/rfc7946" },
    ],
    furtherReading: [
      { title: "GeoPandas read_file reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.read_file.html" },
      { title: "OGC GeoPackage standard", href: "https://www.ogc.org/standards/geopackage/" },
    ],
  },
  "lesson-2-06": {
    estimatedTime: "90–120 minutes",
    lessonType: "Technical Lab",
    markdownFile: "content/lessons/module-2/lesson-06.md",
    formativeChecks: [
      {
        id: "m2-l6-predicate",
        question: "A point lies exactly on a polygon boundary. Which statement is correct?",
        options: [
          "It intersects the polygon but is not within its interior under the usual topological definition",
          "It is always within and never touches the polygon",
          "The result depends only on the point's attribute table",
        ],
        correctOption: 0,
        explanation: "Predicates encode distinct topological relationships. Boundary behaviour must be matched to the scientific assignment rule rather than chosen for convenience.",
      },
      {
        id: "m2-l6-validity",
        question: "What does a valid polygon establish?",
        options: [
          "Its topology is well formed; scientific meaning, positional accuracy and appropriate support still need evidence",
          "Its boundary is ecologically correct and current",
          "Its centroid must lie inside and represent a sampled location",
        ],
        correctOption: 0,
        explanation: "Validity is a computational topology property. It cannot certify field provenance, ecological interpretation or suitability for a remote-sensing analysis.",
      },
      {
        id: "m2-l6-support",
        question: "When can buffer(5) be interpreted as a five-metre ecological neighbourhood?",
        options: [
          "When the CRS uses suitable metre units and independent scientific evidence justifies that support",
          "Whenever the layer appears on a web map",
          "Whenever every output polygon is valid",
        ],
        correctOption: 0,
        explanation: "Projected units make the numerical distance interpretable. Field protocol, positional uncertainty and process knowledge are still required to give the buffer ecological meaning.",
      },
    ],
    submissionChecklist: [
      "Point, LineString, Polygon and multipart geometry are interpreted as models rather than accuracy claims",
      "Predicates, constructive operations and set operations are distinguished",
      "Every distance, buffer and area operation uses an inspected projected CRS and explicit units",
      "Geometry-changing steps preserve IDs and compare type, count, validity and area before and after",
      "The selected neighbourhood support is justified and tested across plausible alternatives",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Creates, inspects and audits predicates, buffers and set-operation derivatives in appropriate units" },
      { dimension: "Conceptual understanding", expectation: "Separates topology, geometry type and mathematical validity from scientific support" },
      { dimension: "Reproducibility", expectation: "Records parameters and before-and-after geometry evidence without overwriting sources" },
      { dimension: "Scientific communication", expectation: "Defends or rejects a support rule without presenting derived geometry as observed evidence" },
    ],
    coreReferences: [
      { title: "Shapely predicates", href: "https://shapely.readthedocs.io/en/stable/predicates.html" },
      { title: "Shapely buffer reference", href: "https://shapely.readthedocs.io/en/stable/reference/shapely.buffer.html" },
      { title: "Shapely make_valid reference", href: "https://shapely.readthedocs.io/en/stable/reference/shapely.make_valid.html" },
    ],
    furtherReading: [
      { title: "Shapely user manual", href: "https://shapely.readthedocs.io/en/stable/manual.html" },
      { title: "Shapely intersection reference", href: "https://shapely.readthedocs.io/en/stable/reference/shapely.intersection.html" },
    ],
  },
  "lesson-2-07": {
    estimatedTime: "120–150 minutes",
    lessonType: "Professional Practicum",
    markdownFile: "content/lessons/module-2/lesson-07.md",
    formativeChecks: [
      {
        id: "m2-l7-join-type",
        question: "A validated site_id exists in both the plot table and site metadata table. What relationship should be considered first?",
        options: [
          "A validated attribute join, because the shared key already defines the relationship",
          "A nearest spatial join with no distance limit",
          "An overlay that splits every plot geometry",
        ],
        correctOption: 0,
        explanation: "Join evidence should match the data contract. Geometry is not automatically stronger than a governed identifier, and key integrity must still be audited.",
      },
      {
        id: "m2-l7-cardinality",
        question: "A left spatial join produces more rows than the input plot layer. What should you do first?",
        options: [
          "Identify repeated plot IDs and diagnose legitimate one-to-many matches, overlaps or topology problems",
          "Drop duplicated plot IDs and keep the first row",
          "Switch to an inner join so the table looks cleaner",
        ],
        correctOption: 0,
        explanation: "Row expansion is evidence about cardinality. Deleting repetitions before diagnosis can erase boundary ambiguity or valid multi-membership.",
      },
      {
        id: "m2-l7-nearest",
        question: "What makes a nearest-neighbour spatial join scientifically reviewable?",
        options: [
          "Projected units, a justified maximum distance, an output distance column and explicit tie/unmatched checks",
          "Assigning a nearest feature to every point regardless of distance",
          "Removing the distance column after the join",
        ],
        correctOption: 0,
        explanation: "Nearest is a proximity hypothesis, not a neutral missing-value repair. Thresholds, distances, ties and unmatched cases expose whether the proposed relationship is defensible.",
      },
    ],
    submissionChecklist: [
      "Attribute and spatial joins are selected from the actual relationship evidence",
      "Predicate direction, boundary rule, join type and expected cardinality are stated before execution",
      "Every join reports input/output counts, unmatched IDs, repeated IDs and unused right-side IDs",
      "Nearest-neighbour analysis uses projected metres, justified thresholds and a distance column",
      "Overlay is audited as a geometry-changing operation with count, type and area checks",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Produces traceable site, management and vegetation assignments while preserving ambiguous cases" },
      { dimension: "Conceptual understanding", expectation: "Explains predicate direction, boundary behaviour, cardinality, nearest distance and overlay" },
      { dimension: "Reproducibility", expectation: "Records complete join and overlay audits with stable left and right identifiers" },
      { dimension: "Scientific communication", expectation: "States assignment policy, unresolved evidence and downstream consequences without forcing completeness" },
    ],
    coreReferences: [
      { title: "GeoPandas spatial join reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.sjoin.html" },
      { title: "GeoPandas nearest spatial join reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.sjoin_nearest.html" },
      { title: "GeoPandas overlay reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.overlay.html" },
    ],
    furtherReading: [
      { title: "GeoPandas merging data guide", href: "https://geopandas.org/en/stable/docs/user_guide/mergingdata.html" },
      { title: "GeoPandas spatial joins gallery", href: "https://geopandas.org/en/stable/gallery/spatial_joins.html" },
    ],
  },
  "lesson-2-08": {
    estimatedTime: "90–120 minutes",
    lessonType: "Technical Lab",
    markdownFile: "content/lessons/module-2/lesson-08.md",
    formativeChecks: [
      {
        id: "m2-l8-growth",
        question: "A layer with 1,200 points is checked naively against 80 polygons. How many possible geometry pairs are visited?",
        options: [
          "96,000 pairs",
          "1,280 pairs",
          "15 pairs",
        ],
        correctOption: 0,
        explanation: "A nested all-pairs comparison performs n × m checks: 1,200 × 80 = 96,000. Most pairs may be spatially impossible, which motivates an index.",
      },
      {
        id: "m2-l8-bbox",
        question: "What does an overlapping spatial-index bounding box establish?",
        options: [
          "Only that the pair is a candidate requiring the declared exact predicate",
          "That the two geometries definitely intersect",
          "That both geometries have the same CRS",
        ],
        correctOption: 0,
        explanation: "Bounding boxes provide a cheap broad-phase filter. Complex geometries can have overlapping boxes while the geometries themselves remain disjoint.",
      },
      {
        id: "m2-l8-profile",
        question: "Which result must be checked before interpreting indexed and naive runtimes?",
        options: [
          "The stable identifier-pair sets are equal under the same predicate",
          "The indexed result appears first in the notebook",
          "The two methods return rows in exactly the same order",
        ],
        correctOption: 0,
        explanation: "Optimisation is acceptable only after correctness equivalence. Index traversal order can vary, so compare stable scientific identifiers rather than display order.",
      },
    ],
    submissionChecklist: [
      "The naive pair count is calculated before execution for every scene",
      "Bounding-box candidates and exact predicate matches are reported separately",
      "Naive and indexed results are compared as stable identifier-pair sets",
      "Timing boundaries, repetitions, versions, CRS and input geometry counts are recorded",
      "Performance conclusions remain conditional on scale, geometry complexity and spatial arrangement",
      "Every generated geometry is labelled as synthetic rather than published field evidence",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Implements naive and indexed searches with the same exact predicate and equivalent match sets" },
      { dimension: "Conceptual understanding", expectation: "Explains all-pairs growth, bounding-box filtering, exact refinement and index limitations" },
      { dimension: "Reproducibility", expectation: "Records controlled inputs, candidate counts, repeated timings, versions and equivalence evidence" },
      { dimension: "Scientific communication", expectation: "Reports performance as conditional evidence without implying that indexing improves spatial validity" },
    ],
    coreReferences: [
      { title: "GeoPandas spatial indexing guide", href: "https://geopandas.org/en/stable/docs/user_guide/spatial_indexing.html" },
      { title: "Shapely STRtree reference", href: "https://shapely.readthedocs.io/en/stable/strtree.html" },
    ],
    furtherReading: [
      { title: "GeoPandas spatial index query reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.sindex.SpatialIndex.query.html" },
      { title: "Python perf_counter reference", href: "https://docs.python.org/3/library/time.html#time.perf_counter" },
    ],
  },
  "lesson-2-09": {
    estimatedTime: "120–150 minutes",
    lessonType: "Professional Practicum",
    markdownFile: "content/lessons/module-2/lesson-09.md",
    formativeChecks: [
      {
        id: "m2-l9-condition",
        question: "A MultiPolygon contains two separated patches with one shared habitat record. What should you conclude first?",
        options: [
          "Multipart geometry may be correct; confirm whether one record genuinely applies to both patches",
          "One part must be deleted because every feature should be a Polygon",
          "The geometry is invalid because its parts are separated",
        ],
        correctOption: 0,
        explanation: "Multipart geometry can faithfully represent one discontinuous unit. Whether it should be exploded depends on observation identity and the intended analysis.",
      },
      {
        id: "m2-l9-repair",
        question: "What does a successful make_valid() result prove?",
        options: [
          "It provides a computational repair candidate that still requires type, area, provenance and domain review",
          "The repaired boundary is ecologically true",
          "The result should replace the source file immediately",
        ],
        correctOption: 0,
        explanation: "Validity repair resolves topology rules, but it can split, collapse or change geometry. Scientific acceptance requires explicit before-and-after evidence.",
      },
      {
        id: "m2-l9-operations",
        question: "Why must dissolve include an explicit attribute aggregation policy?",
        options: [
          "Unioned geometry combines rows, so dates, observations and other attributes need scientifically defensible handling",
          "Dissolve changes only map colour and never changes rows",
          "Every non-group attribute should automatically use its first value",
        ],
        correctOption: 0,
        explanation: "Dissolve is both a geometry union and a group aggregation. An arbitrary first value can attach misleading metadata to the combined feature.",
      },
    ],
    submissionChecklist: [
      "Raw source geometry remains immutable and every derivative has a named stage",
      "Missing, empty, invalid, multipart, duplicate and coverage conditions are diagnosed separately",
      "Validity reasons and before-and-after type, count and area evidence accompany repair candidates",
      "Explode, dissolve and clip are used only with declared identity and attribute rules",
      "Duplicate and sliver decisions use provenance and spatial scale rather than appearance alone",
      "The final GeoPackage is reopened and passes the complete snapshot audit",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Produces a valid, traceable analysis derivative while preserving identity and unresolved cases" },
      { dimension: "Conceptual understanding", expectation: "Distinguishes feature validity, multipart structure, coverage topology, duplicates and slivers" },
      { dimension: "Reproducibility", expectation: "Maintains immutable sources, staged derivatives and a complete topology decision log" },
      { dimension: "Scientific communication", expectation: "Explains every geometry intervention and clearly escalates decisions unsupported by evidence" },
    ],
    coreReferences: [
      { title: "GeoPandas make_valid reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.make_valid.html" },
      { title: "GeoPandas dissolve reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoDataFrame.dissolve.html" },
      { title: "GeoPandas explode reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoDataFrame.explode.html" },
      { title: "GeoPandas clip reference", href: "https://geopandas.org/en/stable/docs/reference/api/geopandas.clip.html" },
    ],
    furtherReading: [
      { title: "Shapely make_valid reference", href: "https://shapely.readthedocs.io/en/stable/reference/shapely.make_valid.html" },
      { title: "GeoPandas geometric manipulations guide", href: "https://geopandas.org/en/stable/docs/user_guide/geometric_manipulations.html" },
    ],
  },
  "lesson-2-10": {
    estimatedTime: "120–150 minutes",
    lessonType: "Professional Practicum",
    markdownFile: "content/lessons/module-2/lesson-10.md",
    formativeChecks: [
      {
        id: "m2-l10-crs-display",
        question: "Two layers appear aligned in the QGIS canvas. What has this established?",
        options: [
          "Only visual agreement under the current project display; layer CRS provenance still requires verification",
          "Both source files definitely contain correctly assigned CRS metadata",
          "QGIS has permanently reprojected both source files",
        ],
        correctOption: 0,
        explanation: "QGIS can transform layers on the fly for display. Inspect each layer's source CRS, extent and provenance before treating alignment as analytical evidence.",
      },
      {
        id: "m2-l10-role",
        question: "QGIS reveals a suspicious repaired boundary. What is the professional next step?",
        options: [
          "Record the affected ID and evidence, correct the governed Python rule if justified, regenerate and inspect again",
          "Move the boundary in the only raw file until it looks right",
          "Hide the source layer and keep the displayed derivative",
        ],
        correctOption: 0,
        explanation: "Visual QA should feed structured evidence back into the reproducible workflow. A canvas-only edit creates an unreviewable result and risks source loss.",
      },
      {
        id: "m2-l10-export",
        question: "Which statement best describes a professional QA map export?",
        options: [
          "It communicates source, purpose, CRS, classes and limitations and is reopened after export for verification",
          "Its attractive styling proves the analysis is correct",
          "It needs every decorative map element regardless of purpose",
        ],
        correctOption: 0,
        explanation: "A QA map is a communication artifact. Clear provenance and post-export inspection make it reviewable, but it does not replace analytical validation.",
      },
    ],
    submissionChecklist: [
      "The QGIS version, project CRS and every layer source path are recorded",
      "Layer metadata, row counts and stable IDs reconcile with the Python audit",
      "Diagnostic styling exposes null, changed and unresolved cases instead of hiding them",
      "Validity and join checks are compared with the reproducible Python results",
      "Every anomaly is linked to affected IDs, evidence, severity, owner and resolution state",
      "PDF and PNG map exports are reopened and verified for legibility and completeness",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Builds a controlled QGIS project and completes metadata, geometry, join and export checks accurately" },
      { dimension: "Conceptual understanding", expectation: "Separates layer/project CRS, display transformation, visual evidence and reproducible processing" },
      { dimension: "Reproducibility", expectation: "Links structured QGIS observations back to files, stable IDs, pipeline decisions and tests" },
      { dimension: "Scientific communication", expectation: "Produces a legible QA package that states sources, purpose and unresolved limitations" },
    ],
    coreReferences: [
      { title: "QGIS 3.44 User Guide: vector properties", href: "https://docs.qgis.org/3.44/en/docs/user_manual/working_with_vector/vector_properties.html" },
      { title: "QGIS 3.44 User Guide: vector geometry algorithms", href: "https://docs.qgis.org/3.44/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html" },
      { title: "QGIS 3.44 User Guide: creating an output", href: "https://docs.qgis.org/3.44/en/docs/user_manual/print_composer/create_output.html" },
    ],
    furtherReading: [
      { title: "QGIS 3.44 Training Manual", href: "https://docs.qgis.org/3.44/en/docs/training_manual/" },
      { title: "QGIS 3.44 Gentle Introduction to GIS", href: "https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/" },
    ],
  },
  "lesson-2-11": {
    estimatedTime: "75–90 minutes",
    lessonType: "Concept + Visual Lab",
    markdownFile: "content/lessons/module-2/lesson-11.md",
    formativeChecks: [
      {
        id: "m2-l11-array",
        question: "A 2 × 3 NumPy array contains six values. Which question can it not answer by itself?",
        options: [
          "Where cell [0, 0] lies on Earth and what physical quantity it represents",
          "How many rows and columns it has",
          "Which value is stored at [0, 0]",
        ],
        correctOption: 0,
        explanation: "Array indices locate values in memory. A transform, CRS and measurement metadata are required to connect those positions to Earth and scientific meaning.",
      },
      {
        id: "m2-l11-transform",
        question: "Why is the centre of the first 10 m cell offset from the raster origin?",
        options: [
          "The origin usually identifies the upper-left grid edge, so the centre is half a cell east and south",
          "The CRS automatically adds five metres to every coordinate",
          "Raster rows begin at one rather than zero",
        ],
        correctOption: 0,
        explanation: "For a north-up area grid, the transform commonly locates outer cell edges. Centre coordinates require an explicit half-pixel offset in both axes.",
      },
      {
        id: "m2-l11-nodata",
        question: "A cell contains zero and the raster declares -9999 as NoData. What is the defensible interpretation?",
        options: [
          "Zero remains a potentially valid value unless measurement semantics say otherwise",
          "Zero and -9999 are always equivalent missing values",
          "All non-positive values should be removed",
        ],
        correctOption: 0,
        explanation: "Missingness follows the declared mask and variable contract. Zero can represent a valid continuous measurement or category and must not be discarded by convention.",
      },
    ],
    submissionChecklist: [
      "The 4 × 5 array and every metadata field are labelled synthetic",
      "Rows, columns, bands, transform, CRS, bounds and resolution are explained correctly",
      "Cell edge, centre and footprint are distinguished",
      "NoData, mask, NaN and valid zero are not conflated",
      "Continuous and categorical semantics are recorded separately from data type",
      "The artifact states what structural metadata cannot validate scientifically",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Reconstructs cell location and raster extent correctly from a complete metadata record" },
      { dimension: "Conceptual understanding", expectation: "Explains raster as values, grid, spatial reference, validity and measurement semantics" },
      { dimension: "Reproducibility", expectation: "Records origin, transform, CRS, units, support and synthetic provenance explicitly" },
      { dimension: "Scientific communication", expectation: "Separates pixel size, accuracy, cell footprint and observed quantity without overclaiming" },
    ],
    coreReferences: [
      { title: "Rasterio georeferencing", href: "https://rasterio.readthedocs.io/en/stable/topics/georeferencing.html" },
      { title: "GDAL raster data model", href: "https://gdal.org/en/stable/user/raster_data_model.html" },
    ],
    furtherReading: [
      { title: "GDAL geotransform tutorial", href: "https://gdal.org/en/stable/tutorials/geotransforms_tut.html" },
      { title: "NumPy array indexing", href: "https://numpy.org/doc/stable/user/basics.indexing.html" },
    ],
  },
  "lesson-2-12": {
    estimatedTime: "100–120 minutes",
    lessonType: "Technical Lab",
    markdownFile: "content/lessons/module-2/lesson-12.md",
    formativeChecks: [
      {
        id: "m2-l12-context",
        question: "What does Rasterio's with-block provide?",
        options: [
          "A dataset that is closed reliably after the indented operations",
          "Proof that the raster metadata are scientifically correct",
          "Automatic loading of every band into memory",
        ],
        correctOption: 0,
        explanation: "The context manager manages file resources and closes the dataset. Metadata and scientific validity still require explicit inspection and evidence.",
      },
      {
        id: "m2-l12-audit",
        question: "Why should minimum and maximum be calculated from a masked read?",
        options: [
          "It prevents declared invalid cells such as -9999 from entering the statistic",
          "It proves the remaining values are calibrated observations",
          "It changes categorical data into continuous data",
        ],
        correctOption: 0,
        explanation: "A masked array keeps validity attached to the values. Valid-only statistics remain structural QA and do not establish calibration or ecological truth.",
      },
      {
        id: "m2-l12-window",
        question: "A window is written as a standalone crop. Which metadata must be recalculated?",
        options: [
          "Its transform and dimensions, with bounds derived from the window",
          "Only its filename",
          "The source CRS must always be replaced",
        ],
        correctOption: 0,
        explanation: "The cropped array starts at another grid position, so it needs the window transform and output shape while retaining a compatible source CRS.",
      },
      {
        id: "m2-l12-roundtrip",
        question: "What does a successful GeoTIFF write prove?",
        options: [
          "Only that the write operation completed; the output must be reopened and compared",
          "That every source tag and scientific meaning were preserved",
          "That the derivative is byte-for-byte identical",
        ],
        correctOption: 0,
        explanation: "Drivers can create readable files with changed metadata, masks or values. Operation-specific round-trip checks are required before acceptance.",
      },
    ],
    submissionChecklist: [
      "Checksums, file sizes and exact source paths identify all audited inputs",
      "Spatial metadata are inspected before unnecessary band reads",
      "Valid and masked counts accompany valid-only statistics",
      "The small window uses its own correctly derived transform",
      "Raw inputs remain immutable and outputs use new paths",
      "Both derivatives are reopened and checked against predeclared expectations",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Reads, audits, writes and reopens the training rasters with correct mask and grid handling" },
      { dimension: "Conceptual understanding", expectation: "Distinguishes file access, array values, validity and scientific interpretation" },
      { dimension: "Reproducibility", expectation: "Preserves input identity and records complete operation-specific round-trip evidence" },
      { dimension: "Scientific communication", expectation: "States exactly what file integrity checks prove and what they leave unresolved" },
    ],
    coreReferences: [
      { title: "Rasterio reading datasets", href: "https://rasterio.readthedocs.io/en/stable/topics/reading.html" },
      { title: "Rasterio masks", href: "https://rasterio.readthedocs.io/en/stable/topics/masks.html" },
      { title: "Rasterio writing datasets", href: "https://rasterio.readthedocs.io/en/stable/topics/writing.html" },
    ],
    furtherReading: [
      { title: "Rasterio windows API", href: "https://rasterio.readthedocs.io/en/stable/api/rasterio.windows.html" },
      { title: "GDAL GeoTIFF driver", href: "https://gdal.org/en/stable/drivers/raster/gtiff.html" },
    ],
  },
  "lesson-2-13": {
    estimatedTime: "120–140 minutes",
    lessonType: "Concept + Technical Lab",
    markdownFile: "content/lessons/module-2/lesson-13.md",
    formativeChecks: [
      {
        id: "m2-l13-crop",
        question: "What does a rectangular crop guarantee?",
        options: [
          "A changed rectangular extent, not that every retained cell lies inside an irregular study area",
          "All cells outside a polygon are invalid",
          "The raster has been reprojected",
        ],
        correctOption: 0,
        explanation: "Cropping selects a rectangular window. An irregular geometry mask is a separate decision about valid support inside that rectangle.",
      },
      {
        id: "m2-l13-reproject",
        question: "Why is assigning a new CRS label not raster reprojection?",
        options: [
          "Reprojection transforms coordinates and creates values on a destination grid",
          "A label always changes the stored pixel values correctly",
          "Raster CRS metadata have no relationship to the transform",
        ],
        correctOption: 0,
        explanation: "A valid reprojection requires a known source CRS, coordinate operation, destination transform, dimensions and resampling method.",
      },
      {
        id: "m2-l13-resampling",
        question: "Which starting rule is defensible for habitat class codes?",
        options: [
          "Use nearest neighbour and verify valid output labels against the legend",
          "Use bilinear because smoother boundaries are more accurate",
          "Use cubic because it always preserves source range",
        ],
        correctOption: 0,
        explanation: "Nearest neighbour preserves existing discrete labels. Interpolation can invent fractional or undefined categories with no thematic meaning.",
      },
      {
        id: "m2-l13-mask",
        question: "What must be true before a polygon mask is applied to a raster?",
        options: [
          "The geometry must be valid and transformed into a compatible raster CRS",
          "The polygon and raster need only share a filename prefix",
          "Every outside cell must be replaced by numeric zero",
        ],
        correctOption: 0,
        explanation: "Masking uses the geometry in raster coordinates and a declared inside, boundary and NoData rule. Zero is not a universal missing value.",
      },
    ],
    submissionChecklist: [
      "Crop, mask, reproject and resample are documented as separate effects",
      "The target grid is explicit rather than left to independent defaults",
      "Categorical and continuous resampling decisions follow variable semantics",
      "Source and destination NoData are passed and checked",
      "Upsampling is not presented as new information or improved accuracy",
      "Every accepted output is reopened and compared with expected changes and invariants",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Performs all four operations with correct CRS, transforms, masks and variable-specific methods" },
      { dimension: "Conceptual understanding", expectation: "Explains how the operations differ and what information each can or cannot preserve" },
      { dimension: "Reproducibility", expectation: "Maintains an explicit transformation decision log and immutable sources" },
      { dimension: "Scientific communication", expectation: "Justifies resampling and states the native-resolution and support limitations" },
    ],
    coreReferences: [
      { title: "Rasterio reprojection", href: "https://rasterio.readthedocs.io/en/stable/topics/reproject.html" },
      { title: "Rasterio resampling", href: "https://rasterio.readthedocs.io/en/stable/topics/resampling.html" },
      { title: "Rasterio mask API", href: "https://rasterio.readthedocs.io/en/stable/api/rasterio.mask.html" },
    ],
    furtherReading: [
      { title: "GDAL warp program", href: "https://gdal.org/en/stable/programs/gdalwarp.html" },
      { title: "QGIS raster analysis guide", href: "https://docs.qgis.org/3.44/en/docs/user_manual/working_with_raster/raster_analysis.html" },
    ],
  },
  "lesson-2-14": {
    estimatedTime: "130–150 minutes",
    lessonType: "Professional Practicum",
    markdownFile: "content/lessons/module-2/lesson-14.md",
    formativeChecks: [
      {
        id: "m2-l14-contract",
        question: "Two rasters share EPSG:3301 and 10 m pixels. What else is required for cell-wise alignment?",
        options: [
          "Matching transform/origin, dimensions, bounds and pixel orientation under a declared tolerance",
          "Only similar colours in QGIS",
          "Only the same number of bands",
        ],
        correctOption: 0,
        explanation: "CRS and resolution do not define the lattice. Corresponding indices require the same spatial transform, extent and dimensions.",
      },
      {
        id: "m2-l14-function",
        question: "Why should an alignment function return individual checks?",
        options: [
          "Property-level results expose the cause and required correction",
          "A single False value proves the source data are scientifically invalid",
          "It allows failed checks to be ignored silently",
        ],
        correctOption: 0,
        explanation: "CRS, origin, resolution, shape and bounds mismatches require different decisions. Explicit diagnostics make the workflow reviewable.",
      },
      {
        id: "m2-l14-target",
        question: "Which rationale can justify a reference grid?",
        options: [
          "Its CRS, support, resolution, extent and governed origin fit the stated analysis",
          "It has the smallest cells, so it must be most accurate",
          "It is the first file alphabetically",
        ],
        correctOption: 0,
        explanation: "Target-grid selection is a scientific design decision. Finer cells can multiply storage without adding information or accuracy.",
      },
      {
        id: "m2-l14-nodata",
        question: "Two aligned rasters use different NoData sentinels. What is the next step?",
        options: [
          "Audit each mask and define a documented joint-validity policy",
          "Treat all zeros as missing in both files",
          "Declare the grids misaligned solely because the sentinels differ",
        ],
        correctOption: 0,
        explanation: "Stored NoData can differ on the same geometry. Analytical compatibility depends on actual masks, valid support and variable semantics.",
      },
    ],
    submissionChecklist: [
      "Expected pass/fail results are declared before inspecting the training cases",
      "CRS, transform, resolution, origin, shape, bounds and NoData are reported separately",
      "A cell-centre diagnostic quantifies the shifted-origin case",
      "Tolerance is justified from grid construction and coordinate units",
      "The target grid states CRS, resolution, origin, extent, shape and resampling policy",
      "All deliberate mismatches fail for their expected reasons",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Diagnoses every deliberate mismatch and proves aligned cases with a complete grid contract" },
      { dimension: "Conceptual understanding", expectation: "Explains lattice origin, target-grid choice, snapping, extent and joint validity" },
      { dimension: "Reproducibility", expectation: "Provides reusable diagnostics, explicit tolerance and a recreatable target specification" },
      { dimension: "Scientific communication", expectation: "Separates geometric alignment from semantic and scientific comparability" },
    ],
    coreReferences: [
      { title: "Rasterio transforms", href: "https://rasterio.readthedocs.io/en/stable/topics/transforms.html" },
      { title: "Rasterio warp API", href: "https://rasterio.readthedocs.io/en/stable/api/rasterio.warp.html" },
    ],
    furtherReading: [
      { title: "GDAL geotransform tutorial", href: "https://gdal.org/en/stable/tutorials/geotransforms_tut.html" },
      { title: "QGIS raster properties", href: "https://docs.qgis.org/3.44/en/docs/user_manual/working_with_raster/raster_properties.html" },
    ],
  },
  "lesson-2-15": {
    estimatedTime: "120–150 minutes",
    lessonType: "Scientific Practicum",
    markdownFile: "content/lessons/module-2/lesson-15.md",
    formativeChecks: [
      {
        id: "m2-l15-point",
        question: "When is a containing-cell point sample most defensible?",
        options: [
          "When the observation and question are point-like at the analysis scale and positional uncertainty is acceptable",
          "Whenever it gives the strongest relationship",
          "Whenever the raster has smaller pixels than the field plot",
        ],
        correctOption: 0,
        explanation: "Point sampling is a support choice. It requires a question and positional evidence consistent with the containing cell rather than convenience.",
      },
      {
        id: "m2-l15-statistic",
        question: "Which summary is appropriate for categorical habitat codes?",
        options: [
          "Class counts or proportions with a documented legend and tie rule",
          "The arithmetic mean of class identifiers",
          "A bilinear value at the polygon centroid",
        ],
        correctOption: 0,
        explanation: "Class codes label categories and do not form a continuous numeric scale. Counts, proportions or mode preserve categorical meaning.",
      },
      {
        id: "m2-l15-uncertainty",
        question: "Why must valid fraction accompany a plot mean?",
        options: [
          "The statistic may describe only a small valid part of the intended footprint",
          "It proves the raster is positionally accurate",
          "It converts missing cells to zero",
        ],
        correctOption: 0,
        explanation: "Coverage evidence reveals whether the calculated value represents enough of the declared support. The acceptance threshold still needs scientific justification.",
      },
    ],
    submissionChecklist: [
      "Vector geometry is validated and transformed into the raster CRS",
      "Point, polygon, median and buffer methods are compared under explicit support rules",
      "Candidate count, valid count and valid fraction accompany every polygon statistic",
      "Categorical classes are summarised without averaging codes",
      "No valid support remains missing rather than becoming zero",
      "The extraction table preserves source identity, method, temporal and uncertainty notes",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Extracts values under correct CRS, mask, rasterisation and valid-coverage rules" },
      { dimension: "Conceptual understanding", expectation: "Selects a method from field support, positional uncertainty and variable semantics" },
      { dimension: "Reproducibility", expectation: "Creates a traceable extraction table with source, grid, method and coverage evidence" },
      { dimension: "Scientific communication", expectation: "Explains why alternative supports differ and which uncertainty remains" },
    ],
    coreReferences: [
      { title: "Rasterio vector features", href: "https://rasterio.readthedocs.io/en/stable/topics/features.html" },
      { title: "Rasterio sampling API", href: "https://rasterio.readthedocs.io/en/stable/api/rasterio.sample.html" },
    ],
    furtherReading: [
      { title: "GeoPandas projections guide", href: "https://geopandas.org/en/stable/docs/user_guide/projections.html" },
      { title: "QGIS zonal statistics", href: "https://docs.qgis.org/3.44/en/docs/user_manual/processing_algs/qgis/rasteranalysis.html" },
    ],
  },
  "lesson-2-16": {
    estimatedTime: "100–120 minutes",
    lessonType: "Technical Performance Lab",
    markdownFile: "content/lessons/module-2/lesson-16.md",
    formativeChecks: [
      {
        id: "m2-l16-memory",
        question: "Why can a compressed GeoTIFF require much more RAM than its file size?",
        options: [
          "Pixel arrays are decompressed and may coexist with masks, outputs and temporary arrays",
          "Compression changes every value to float64 permanently",
          "Raster dimensions do not affect memory",
        ],
        correctOption: 0,
        explanation: "Dense in-memory values follow dimensions, bands and data type. Masks, type promotion and intermediates increase the working set beyond the file size.",
      },
      {
        id: "m2-l16-blocks",
        question: "Why process source block windows rather than arbitrary one-row reads?",
        options: [
          "Block-aligned reads follow the file's efficient storage chunks and avoid repeated decoding",
          "A storage block is always the correct ecological support",
          "Blocks eliminate the need for masks",
        ],
        correctOption: 0,
        explanation: "Blocks are an I/O organisation. They can improve access efficiency while the scientific operation and support remain independently defined.",
      },
      {
        id: "m2-l16-halo",
        question: "Why does a three-by-three filter need a halo around each write window?",
        options: [
          "Cells at the window edge require neighbouring source values outside that window",
          "A halo changes the source CRS",
          "Every cell-independent multiplication requires one",
        ],
        correctOption: 0,
        explanation: "Neighbourhood operations need surrounding cells. Read overlap and write only the central result to avoid artificial seams at block edges.",
      },
      {
        id: "m2-l16-equivalence",
        question: "What must happen before comparing full and windowed runtime?",
        options: [
          "Grid, mask and numerical results must pass declared equivalence checks",
          "The faster method should be accepted automatically",
          "Only output file sizes should be equal",
        ],
        correctOption: 0,
        explanation: "Performance is meaningful only for equivalent work. A faster result that changes valid cells or values is not an optimisation of the same method.",
      },
    ],
    submissionChecklist: [
      "Memory estimates include dimensions, bands, data type and likely intermediates",
      "The source block layout and all edge windows are recorded",
      "The windowed loop writes directly rather than accumulating every block",
      "Mask and NoData behaviour are preserved",
      "Full and windowed outputs are reopened and pass grid and numerical equivalence",
      "Timing claims include environment, repeats and limitations",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Processes all blocks correctly, preserves masks and handles local versus neighbourhood operations" },
      { dimension: "Conceptual understanding", expectation: "Explains memory, blocks, halos, virtual views and persistence tradeoffs" },
      { dimension: "Reproducibility", expectation: "Records environment, window layout, outputs and operation-specific equivalence evidence" },
      { dimension: "Scientific communication", expectation: "Reports conditional performance without presenting one timing as universal" },
    ],
    coreReferences: [
      { title: "Rasterio windowed reading and writing", href: "https://rasterio.readthedocs.io/en/stable/topics/windowed-rw.html" },
      { title: "Rasterio WarpedVRT API", href: "https://rasterio.readthedocs.io/en/stable/api/rasterio.vrt.html" },
    ],
    furtherReading: [
      { title: "GDAL raster data model: blocks", href: "https://gdal.org/en/stable/user/raster_data_model.html" },
      { title: "NumPy data types", href: "https://numpy.org/doc/stable/user/basics.types.html" },
    ],
  },
  "lesson-2-17": {
    estimatedTime: "110–140 minutes",
    lessonType: "Scientific Application Lab",
    markdownFile: "content/lessons/module-2/lesson-17.md",
    formativeChecks: [
      {
        id: "m2-l17-surfaces",
        question: "What does a DSM usually attempt to represent?",
        options: [
          "An upper visible or returned surface influenced by terrain, vegetation, structures and processing",
          "Guaranteed bare terrain",
          "Vegetation height independent of a terrain reference",
        ],
        correctOption: 0,
        explanation: "DSM meaning depends on sensing and processing. It can include canopy, buildings, ground and artefacts and must not be relabelled as terrain automatically.",
      },
      {
        id: "m2-l17-vertical",
        question: "A raster tag says elevation units are metres, but no vertical datum is documented. What can be claimed?",
        options: [
          "Stored vertical values use a metre scale, but their reference surface remains undocumented",
          "Every value is metres above sea level",
          "The raster can be subtracted from any other metre-valued elevation product",
        ],
        correctOption: 0,
        explanation: "Units and vertical reference are distinct. Differences require compatible datums, grids, timing and surface definitions.",
      },
      {
        id: "m2-l17-aspect",
        question: "Why should ordinary arithmetic not average aspects 1° and 359°?",
        options: [
          "Aspect is circular, so the two directions are only two degrees apart",
          "Aspect has no units",
          "One of the two values must be NoData",
        ],
        correctOption: 0,
        explanation: "Compass direction wraps at 360 degrees. Circular statistics or sine/cosine components preserve that neighbourhood relationship.",
      },
      {
        id: "m2-l17-resolution",
        question: "What can happen when slope is derived from a finer but noisy DSM?",
        options: [
          "Canopy texture and reconstruction noise can create steep local gradients",
          "Finer cells guarantee more accurate terrain slope",
          "Resolution removes the need for vertical-reference metadata",
        ],
        correctOption: 0,
        explanation: "Terrain derivatives inherit the input surface and processing scale. Smaller cells expose both real variation and noise without guaranteeing accuracy.",
      },
    ],
    submissionChecklist: [
      "DEM, DSM and DTM meanings are distinguished from product acronyms alone",
      "Horizontal CRS, vertical units and vertical reference status are recorded separately",
      "Slope units, aspect convention and hillshade parameters are explicit",
      "NoData, flat aspect and edge treatment are preserved",
      "Any surface difference passes alignment checks and remains conservatively named",
      "Terrain outputs are reopened and checked for metadata and plausible ranges",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Derives and writes slope, aspect and hillshade with correct spacing, masks and units" },
      { dimension: "Conceptual understanding", expectation: "Interprets surface type, vertical reference, circular aspect, resolution and differencing conditions" },
      { dimension: "Reproducibility", expectation: "Records source surfaces, formulas, parameters, software and reopened derivative QA" },
      { dimension: "Scientific communication", expectation: "Avoids unsupported terrain and vegetation-height claims and states remaining uncertainty" },
    ],
    coreReferences: [
      { title: "USGS publication: Digital elevation models—terminology and definitions", href: "https://pubs.usgs.gov/publication/70223828" },
      { title: "GDAL DEM processing", href: "https://gdal.org/en/stable/programs/gdaldem.html" },
    ],
    furtherReading: [
      { title: "QGIS raster terrain analysis", href: "https://docs.qgis.org/3.44/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html" },
      { title: "NumPy gradient", href: "https://numpy.org/doc/stable/reference/generated/numpy.gradient.html" },
    ],
  },
};

export const MODULE2_SOFTWARE_VERSIONS = {
  python: "3.12.13",
  numpy: "2.4.2",
  rasterio: "1.4.4",
  geopandas: "1.1.4",
  shapely: "2.1.2",
  pyproj: "3.7.2",
  qgis: "3.44 LTR",
} as const;

function module2TestedVersions(includeQgis: boolean, includeRaster = false) {
  return [
    { label: "GeoPandas", value: MODULE2_SOFTWARE_VERSIONS.geopandas },
    { label: "Shapely", value: MODULE2_SOFTWARE_VERSIONS.shapely },
    { label: "PyProj", value: MODULE2_SOFTWARE_VERSIONS.pyproj },
    ...(includeRaster ? [
      { label: "NumPy", value: MODULE2_SOFTWARE_VERSIONS.numpy },
      { label: "Rasterio", value: MODULE2_SOFTWARE_VERSIONS.rasterio },
    ] : []),
    ...(includeQgis ? [{ label: "QGIS", value: MODULE2_SOFTWARE_VERSIONS.qgis }] : []),
  ];
}

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
        lessonType: configuration.lessonType,
        position: index + 1,
        totalPositions: module2Lessons.length - 1,
        markdownFile: configuration.markdownFile,
        formativeChecks: configuration.formativeChecks,
        submissionChecklist: configuration.submissionChecklist,
        rubric: configuration.rubric,
        technicalMetadata: {
          pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
          jupyterEnvironment: "JupyterLab 4 / Notebook 7",
          testedVersions: module2TestedVersions(
            source.id === "lesson-2-10" || source.chapter === 3,
            source.chapter === 3,
          ),
          reviewDate: "11 August 2026",
          datasetCitation: "Baltic coastal plant traits 2024, Zenodo record 20083250, https://doi.org/10.5281/zenodo.20083250",
          coreReferences: configuration.coreReferences,
          furtherReading: configuration.furtherReading,
        },
      } satisfies ReviewedLessonDetails,
    ];
  }),
);

export const module2PracticumDetails: Record<string, ReviewedLessonDetails> = {
  "module-2-chapter-1-practicum": {
    estimatedTime: "120–150 minutes",
    lessonType: "Chapter Practicum",
    position: 1,
    totalPositions: 3,
    markdownFile: "content/lessons/module-2/practicum-01.md",
    formativeChecks: [
      {
        id: "m2-p1-evidence",
        question: "A raster has a CRS and opens correctly, but its acquisition date and band meaning are absent. What is the defensible decision?",
        options: ["Review before scientific use", "Accept without conditions", "Reject and delete the source"],
        correctOption: 0,
        explanation: "The spatial structure may be usable, but missing measurement metadata blocks interpretation. Review preserves the asset while escalating the missing evidence.",
      },
      {
        id: "m2-p1-risk",
        question: "What should an acceptance decision connect?",
        options: ["Evidence, intended use, risk and next action", "Filename and visual appearance", "File size and creation date only"],
        correctOption: 0,
        explanation: "Fitness is conditional on purpose. A reviewable decision links what is known to a specific use, consequence and owner.",
      },
      {
        id: "m2-p1-reject",
        question: "When is rejection appropriate?",
        options: ["When a blocking risk cannot be resolved for the intended use", "Whenever metadata need review", "Whenever the format is unfamiliar"],
        correctOption: 0,
        explanation: "Rejecting data is a governed decision, not a reaction to uncertainty. State the blocking condition and what new evidence could change the decision.",
      },
    ],
    submissionChecklist: [
      "All supplied evidence is separated from assumptions",
      "Every asset receives an accept, review or reject decision for a stated use",
      "Blocking risks, owners and next actions are explicit",
      "The decision record stays within 250–350 words",
      "DATA_ACCEPTANCE_DECISION.md is included in the portfolio pipeline",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Classifies spatial evidence and blockers accurately" },
      { dimension: "Conceptual understanding", expectation: "Distinguishes readiness, fitness for purpose and unresolved uncertainty" },
      { dimension: "Reproducibility", expectation: "Links every decision to evidence, risk, owner and next action" },
      { dimension: "Scientific communication", expectation: "Produces a concise decision another analyst can act on" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(false),
      reviewDate: "11 August 2026",
      datasetCitation: "Baltic coastal plant traits 2024, Zenodo record 20083250, https://doi.org/10.5281/zenodo.20083250",
      coreReferences: [
        { title: "OGC Simple Feature Access standard", href: "https://www.ogc.org/standards/sfa/" },
        { title: "RFC 7946: The GeoJSON Format", href: "https://www.rfc-editor.org/rfc/rfc7946" },
      ],
      furtherReading: [
        { title: "EPSG Dataset", href: "https://epsg.org/home.html" },
      ],
    },
  },
  "module-2-chapter-2-practicum": {
    estimatedTime: "120–150 minutes",
    lessonType: "Chapter Practicum",
    position: 2,
    totalPositions: 3,
    markdownFile: "content/lessons/module-2/practicum-02.md",
    formativeChecks: [
      {
        id: "m2-p2-validity",
        question: "Every feature is individually valid. What still requires review?",
        options: ["Dataset-level overlaps, gaps, duplicates and coverage rules", "Nothing; feature validity proves the handover", "Only map colours"],
        correctOption: 0,
        explanation: "Individual validity does not prove that features form the intended coverage or relationships as a collection.",
      },
      {
        id: "m2-p2-reconcile",
        question: "Python and QGIS show different assignment counts. What comes first?",
        options: ["Reconcile inputs, CRS, predicate, filters and versions", "Keep whichever output has fewer nulls", "Manually edit the QGIS table"],
        correctOption: 0,
        explanation: "A discrepancy is evidence to investigate. Choosing the more convenient output hides the cause and breaks reproducibility.",
      },
      {
        id: "m2-p2-handover",
        question: "What makes a vector derivative ready for handover?",
        options: ["Traceable inputs, passed QA, declared limitations and reproducible outputs", "A visually attractive map", "A successful file write"],
        correctOption: 0,
        explanation: "Professional handover includes evidence that the derivative can be inspected, reproduced and used within stated limits.",
      },
    ],
    submissionChecklist: [
      "All fifteen handover-review steps are completed",
      "Clean sources and corrupted topology training data remain separate",
      "Python and QGIS evidence is reconciled by stable feature ID",
      "The integrity report and repaired derivative remain distinct outputs",
      "Artifact 2.B contains a decision, limitations and follow-up actions",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Audits CRS, geometry, joins, topology and exported derivatives accurately" },
      { dimension: "Conceptual understanding", expectation: "Connects local feature checks to dataset-level integrity and scientific use" },
      { dimension: "Reproducibility", expectation: "Preserves immutable inputs, explicit decisions and reconciled evidence" },
      { dimension: "Scientific communication", expectation: "Delivers a clear accept, conditional accept or reject handover decision" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(true),
      reviewDate: "11 August 2026",
      datasetCitation: "Baltic coastal plant traits 2024, Zenodo record 20083250, https://doi.org/10.5281/zenodo.20083250",
      coreReferences: [
        { title: "GeoPandas testing reference", href: "https://geopandas.org/en/stable/docs/reference/testing.html" },
        { title: "QGIS 3.44 vector data guide", href: "https://docs.qgis.org/3.44/en/docs/user_manual/working_with_vector/" },
      ],
      furtherReading: [
        { title: "QGIS topology introduction", href: "https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/topology.html" },
      ],
    },
  },
  "module-2-chapter-3-practicum": {
    estimatedTime: "240–300 minutes",
    lessonType: "Chapter Practicum",
    position: 3,
    totalPositions: 3,
    markdownFile: "content/lessons/module-2/practicum-03.md",
    formativeChecks: [
      {
        id: "m2-p3-target-grid",
        question: "What should define the destination grid for a multi-raster stack?",
        options: [
          "A documented scientific and operational decision about CRS, resolution, origin, extent and support",
          "Whichever file happens to be opened first",
          "The finest available pixel size in every case",
        ],
        correctOption: 0,
        explanation: "A reference raster may implement the decision, but target-grid design must follow intended use, source support, categorical constraints and computational cost rather than file order.",
      },
      {
        id: "m2-p3-resampling",
        question: "Why does the habitat layer require a different resampling rule from continuous reflectance?",
        options: [
          "Class codes are labels, so interpolation can invent labels with no defined meaning",
          "Categorical rasters never require reprojection",
          "Continuous reflectance cannot be resampled",
        ],
        correctOption: 0,
        explanation: "Nearest-neighbour resampling is the defensible starting rule for discrete labels, while continuous variables may justify interpolation after considering their support and intended analysis.",
      },
      {
        id: "m2-p3-alignment",
        question: "When is the output stack ready for cell-wise analysis?",
        options: [
          "When every accepted layer passes the declared CRS, transform, dimensions, bounds, orientation and NoData checks",
          "When the layers overlap visually in QGIS",
          "When every output has the same filename suffix",
        ],
        correctOption: 0,
        explanation: "Cell-wise computation assumes a shared grid contract. Visual overlap is useful QA evidence but cannot prove identical origins, transforms, masks or dimensions.",
      },
    ],
    submissionChecklist: [
      "All five supplied rasters are inventoried before transformation",
      "One explicit target-grid contract records CRS, resolution, origin, dimensions and bounds",
      "Continuous and categorical resampling decisions are justified separately",
      "All aligned derivatives are reopened and pass the automated grid assertions",
      "Point and polygon extraction outputs preserve identifiers, units and valid-cell evidence",
      "The final QA report includes decision, limitations, checksums and reproducible environment details",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Builds an aligned five-layer raster stack and correct extraction outputs with valid masks and metadata" },
      { dimension: "Conceptual understanding", expectation: "Justifies target-grid, support, resampling and terrain-surface decisions scientifically" },
      { dimension: "Reproducibility", expectation: "Preserves immutable inputs, explicit parameters, automated assertions, checksums and reopened-output QA" },
      { dimension: "Scientific communication", expectation: "Delivers a concise handover report that distinguishes passed checks from unresolved scientific uncertainty" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(true, true),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic Baltic coastal meadow raster training pack, created for instruction; ecological context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250",
      coreReferences: [
        { title: "Rasterio reprojection", href: "https://rasterio.readthedocs.io/en/stable/topics/reproject.html" },
        { title: "Rasterio resampling", href: "https://rasterio.readthedocs.io/en/stable/topics/resampling.html" },
        { title: "GDAL raster data model", href: "https://gdal.org/en/stable/user/raster_data_model.html" },
      ],
      furtherReading: [
        { title: "QGIS raster analysis", href: "https://docs.qgis.org/3.44/en/docs/user_manual/working_with_raster/raster_analysis.html" },
        { title: "USGS digital elevation terminology", href: "https://pubs.usgs.gov/publication/70223828" },
      ],
    },
  },
};
