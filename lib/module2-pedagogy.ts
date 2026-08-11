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

  lesson(18, 4, "UAV Remote Sensing Fundamentals", "Treat a UAV as a complete observing system and distinguish direct sensor records from derived geospatial products.", ["UAV systems", "Sensor types", "Product provenance"], "Explain platform, payload, navigation and processing roles without treating an orthomosaic as a raw photograph.", "What did the sensor directly record, and which later models created the product?", ["Platform and payload", "RGB, multispectral, thermal and LiDAR", "Raw versus derived products", "GSD and temporal support"], "Create a UAV sensor and product inventory for the synthetic meadow handover.", "Keep direct/derived status, measurement quantity, GSD, timing and required QA explicit.", "01_mission_design.ipynb", `products = {
    "raw RGB frame": "direct image record",
    "image geotag": "navigation metadata",
    "dense point cloud": "derived reconstruction",
    "orthomosaic": "derived raster product",
    "NDVI": "derived spectral index",
}
for product, evidence_type in products.items():
    print(product, evidence_type, sep=": ")`, "Which records come directly from a sensor, and which require reconstruction or spectral arithmetic?", "UAV value comes from a traceable observation chain. Fine detail does not remove the need for product semantics, positional evidence and temporal compatibility.", "Calling an orthomosaic raw imagery. It inherits camera geometry, surface, resampling, seamline and blending decisions.", { title: "USGS National Uncrewed Systems Office", href: "https://www.usgs.gov/centers/national-uncrewed-systems-office" }),
  lesson(19, 4, "Mission Design: Altitude, GSD and Overlap", "Calculate nominal sampling geometry and evaluate how altitude, footprint, overlap, speed, shutter and terrain interact.", ["Mission geometry", "GSD", "Overlap"], "Design repeated, sharp views at a support appropriate to the environmental question.", "Does the planned geometry create enough defensible views without confusing finer pixels with better science?", ["Height and image footprint", "GSD calculation", "Forward and side overlap", "Terrain, speed and shutter"], "Compare two synthetic meadow mission designs and document all geometric assumptions.", "Verify units, footprint axes, spacing, trigger interval, terrain sensitivity and achieved-coverage evidence.", "02_mission_geometry.ipynb", `pixel_mm = 13.2 / 5472
height_m = 80
focal_mm = 8.8
gsd_m = pixel_mm * height_m / focal_mm
width_m = height_m * 13.2 / focal_mm
length_m = height_m * 8.8 / focal_mm
forward_spacing = length_m * (1 - 0.80)
side_spacing = width_m * (1 - 0.70)
print(gsd_m, width_m, length_m)
print(forward_spacing, side_spacing)`, "If height decreases by one quarter, how do GSD and footprint change under the simplified model?", "Overlap creates opportunities for feature matching; it does not guarantee sharpness, texture, radiometric consistency or positional accuracy.", "Using planned overlap as achieved overlap. Missing frames, terrain, attitude and timing alter actual coverage.", { title: "Pix4D image acquisition plan", href: "https://support.pix4d.com/hc/en-us/articles/202557459" }),
  lesson(20, 4, "Sensors, Illumination and Radiometric Quality", "Trace digital values through exposure, illumination and calibration evidence before calling them comparable reflectance.", ["Radiometry", "Calibration", "Band registration"], "Design a radiometric QA protocol for multispectral and thermal UAV products.", "Which part of the observed brightness belongs to the surface, illumination, exposure or sensor response?", ["Digital number, radiance and reflectance", "Panels and irradiance sensors", "Exposure, saturation and vignetting", "Illumination and co-registration"], "Audit the synthetic image sequence, gradient raster and ambiguous Red Edge scale.", "Keep scale, range, calibration, saturation, timing and registration as separate gates.", "03_radiometric_quality.ipynb", `import csv

with open("data/raw/image_metadata.csv", newline="") as file:
    rows = list(csv.DictReader(file))
for row in rows:
    saturated = float(row["saturation_fraction"]) > 0.02
    blurred = float(row["blur_score_px"]) > 1.0
    changed = float(row["exposure_s"]) != 0.0016
    status = "review" if any([saturated, blurred, changed]) else "pass"
    print(row["image_id"], status)`, "Does a panel image prove that all flight pixels are comparable reflectance?", "Radiometric calibration supplies evidence, not immunity from saturation, changing illumination, directional response, vignetting or misregistration.", "Assuming values from a band name or familiar range. Authoritative product metadata must define scale and units.", { title: "MicaSense image processing knowledge base", href: "https://support.micasense.com/hc/en-us/categories/115000274848-Image-Processing" }),
  lesson(21, 4, "Georeferencing: GNSS, GCP, RTK and PPK", "Separate positioning constraints from independent validation and diagnose horizontal, vertical and local error.", ["GNSS", "Control points", "Accuracy QA"], "Calculate residual statistics and map error without treating fitted control as external proof.", "Is the reconstruction internally consistent and correctly positioned where the analysis occurs?", ["Image geotags and direct georeferencing", "GCP versus check point", "RTK and PPK", "Bias, RMSE and local warping"], "Create a georeferencing report from separate synthetic control and check-point records.", "Preserve roles, sign, units, distribution, horizontal/vertical results and the south-east weak region.", "04_georeferencing_qa.ipynb", `import numpy as np

east = checks["east_residual_m"].to_numpy()
north = checks["north_residual_m"].to_numpy()
vertical = checks["vertical_residual_m"].to_numpy()
rmse_e = np.sqrt(np.mean(east ** 2))
rmse_n = np.sqrt(np.mean(north ** 2))
rmse_xy = np.sqrt(rmse_e ** 2 + rmse_n ** 2)
rmse_z = np.sqrt(np.mean(vertical ** 2))
print(east.mean(), north.mean(), vertical.mean())
print(rmse_xy, rmse_z)`, "Why can fitted GCP residuals be smaller than withheld check-point residuals?", "Control constrains the solution; withheld points assess external performance. RTK or PPK strengthens positioning but does not remove independent validation.", "Using every surveyed point as control. This leaves no independent evidence of final product accuracy.", { title: "ASPRS Positional Accuracy Standards", href: "https://www.asprs.org/divisions-committees/standards" }),
  lesson(22, 4, "Structure from Motion and Photogrammetric Reconstruction", "Trace overlapping perspective images through a software-independent three-dimensional reconstruction workflow.", ["Structure from Motion", "Bundle adjustment", "Dense reconstruction"], "Explain feature matching, tie points, camera estimation and reconstruction diagnostics without confusing internal residuals with map accuracy.", "How do repeated image observations become a fitted camera-and-surface model?", ["Perspective and feature matching", "Tie points and camera parameters", "Bundle adjustment and reprojection error", "Sparse and dense point clouds"], "Audit a synthetic processing report and identify strong, warning and missing evidence.", "Connect image alignment, calibration stability and weak geometry to downstream surfaces and mosaics.", "05_photogrammetry_concepts.ipynb", `import json

with open("data/raw/photogrammetry_report.json") as file:
    report = json.load(file)
internal = {
    "aligned_fraction": report["imagesAligned"] / report["imagesTotal"],
    "reprojection_px": report["reprojectionErrorPixels"],
    "focal_change_pct": report["cameraFocalLengthChangePct"],
}
for metric, value in internal.items():
    print(metric, value)
print("external accuracy requires withheld checks")`, "Which report fields diagnose the fitted image model, and which prove external position?", "Bundle adjustment jointly refines cameras and tie points. Its reprojection residual is valuable internal evidence, not absolute geospatial validation.", "Increasing quality settings until the mosaic looks good. Missing texture, motion and weak geometry require evidence, not cosmetic iteration.", { title: "OpenDroneMap documentation", href: "https://docs.opendronemap.org/" }),
  lesson(23, 4, "Point Clouds, DSM, DTM and Orthomosaics", "Interpret common UAV products from the observations and models that created them.", ["Point clouds", "Surface models", "Orthomosaics"], "Distinguish discrete clouds, upper surfaces, inferred terrain, orthorectification and mosaicking.", "What surface or image contribution does each product represent, and what remains unobserved?", ["Sparse versus dense cloud", "DSM, DTM and conditional CHM", "Orthorectification and resampling", "Seamlines, occlusion and edge effects"], "Diagnose a synthetic mosaic seam and DSM spike/pit and build a product interpretation table.", "Keep vertical reference, interpolation, source contribution and prohibited interpretations visible.", "06_uav_products.ipynb", `import rasterio
import numpy as np

with rasterio.open("data/raw/uav_dsm_spike_demo.tif") as src:
    dsm = src.read(1, masked=True)
median = np.ma.median(dsm)
deviation = np.ma.abs(dsm - median)
suspect = (~np.ma.getmaskarray(dsm)) & (deviation.data > 5)
print(float(dsm.min()), float(dsm.max()))
print(np.argwhere(suspect))`, "Can a smooth DSM or a fine orthomosaic prove the represented surface is correct?", "A DSM is a reconstructed upper surface and an orthomosaic is a multi-image derived raster. Product names require provenance and validation.", "Calling DSM minus an unverified terrain raster vegetation height. Both surfaces, grids, dates and vertical references must be compatible.", { title: "USGS digital elevation model terminology", href: "https://pubs.usgs.gov/publication/70223828" }),
  lesson(24, 4, "UAV Product QA and Error Diagnosis", "Integrate mission, image, photogrammetry, georeferencing, mosaic, surface, multispectral and temporal evidence.", ["UAV QA", "Error diagnosis", "Decision matrix"], "Perform a product- and use-specific professional audit before ecological extraction.", "Which defect can change this analysis, where, and what evidence or action follows?", ["Eight-category QA chain", "Status, severity and consequence", "Spatial error map", "Accept, review or unsuitable"], "Build the complete UAV QA matrix and a map of weak or excluded support.", "Require expected/observed evidence, consequence, action and owner for every finding.", "07_uav_product_validation.ipynb", `finding = {
    "category": "multispectral",
    "test": "NIR grid matches Red grid",
    "observed": "origin shifted 0.1 m",
    "status": "fail",
    "severity": "blocking",
    "consequence": "index mixes footprints",
    "action": "register and validate before calculation",
}
for field, value in finding.items():
    print(field, value, sep=": ")`, "Can one product pass geometric QA and still be unsuitable for spectral or temporal analysis?", "Quality is multidimensional and conditional. A global pass hides which product, region, variable and use the evidence supports.", "Using visual appearance as the only QA. Pair QGIS diagnosis with reproducible numeric checks and provenance.", { title: "ASPRS Positional Accuracy Standards", href: "https://www.asprs.org/divisions-committees/standards" }),
  lesson(25, 4, "UAV Multispectral Processing Pipeline", "Build an accepted multispectral subset with explicit radiometric, geometric, mask and provenance gates.", ["Multispectral stack", "Safe indices", "Raster extraction"], "Create NDVI and GNDVI only from compatible bands and document blocked derivatives honestly.", "Are band identity, scale, radiometry, grid, masks and timing compatible cell by cell?", ["Band inventory and scale", "Co-registration and masks", "Numerically safe indices", "DSM, extraction and manifest"], "Produce an analysis-ready UAV stack subset, QA mask, plot extraction and manifest.", "Block Red Edge until scale evidence exists and reopen every accepted derivative.", "08_multispectral_pipeline.ipynb", `import numpy as np

def safe_ndvi(nir, red, valid, epsilon=1e-8):
    nir = nir.astype("float32")
    red = red.astype("float32")
    denominator = nir + red
    use = valid & np.isfinite(denominator) & (np.abs(denominator) > epsilon)
    result = np.full(nir.shape, np.nan, dtype="float32")
    result[use] = (nir[use] - red[use]) / denominator[use]
    return result

ndvi = safe_ndvi(nir, red, joint_valid_mask)
print(np.nanmin(ndvi), np.nanmax(ndvi))`, "What should the pipeline do when Red Edge scale or NIR registration is unresolved?", "An analysis-ready stack is a set of compatible measurement layers plus proof of how compatibility was established.", "Calculating an index because the arrays share shape. Scale, transform, content registration and masks must pass first.", { title: "Rasterio georeferencing", href: "https://rasterio.readthedocs.io/en/stable/topics/georeferencing.html" }),

  lesson(26, 5, "Optical Remote Sensing", "Connect electromagnetic interactions, sensor bands and product levels to interpretable surface reflectance.", ["Sentinel-2", "Landsat", "Reflectance"], "Select optical products and bands from spectral, spatial, radiometric and temporal requirements.", "Which measured radiance or reflectance signal can respond to the target vegetation property?", ["Electromagnetic spectrum and bands", "Four kinds of sensor resolution", "Atmosphere, clouds and shadows", "Level-1 and Level-2 products"], "Compare Sentinel-2 and Landsat products for a coastal meadow monitoring question.", "Record product level, acquisition time, band resolution, scaling, cloud method and surface conditions.", "optical_product_decision.ipynb", `sensors = {
    "Sentinel-2": {"red_m": 10, "nir_m": 10, "revisit_days": 5},
    "Landsat": {"red_m": 30, "nir_m": 30, "revisit_days": 16},
}
for name, properties in sensors.items():
    print(name, properties)`, "Why does a nominal revisit interval not equal the number of cloud-free observations?", "Sensor selection balances spectral response, support, acquisition opportunity and product quality. Nominal specifications do not guarantee usable observations.", "Comparing raw digital numbers across products. Confirm scaling, processing level and calibration before interpretation.", { title: "Sentinel-2 user guide", href: "https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-2-msi" }),
  lesson(27, 5, "Vegetation and Spectral Indices", "Use vegetation indices as sensor- and context-dependent proxies rather than direct ecological measurements.", ["NDVI", "Red edge", "SAVI"], "Choose, calculate and interpret an index with its limitations and reference evidence.", "What physical contrast does this index emphasise, and which confounders remain?", ["NDVI, GNDVI, SAVI and MSAVI", "Red-edge indices", "Saturation, soil and atmosphere", "Sensor and seasonal dependence"], "Compare two indices across meadow plots and explain where they agree or diverge.", "Verify reflectance scale, band identity, masks, formula, valid range and acquisition context.", "spectral_index_comparison.ipynb", `import numpy as np

green = np.array([0.09, 0.12, 0.16], dtype="float32")
red = np.array([0.07, 0.13, 0.20], dtype="float32")
nir = np.array([0.42, 0.38, 0.31], dtype="float32")
valid_mask = np.array([True, True, False])

def safe_ratio(numerator, denominator, valid):
    result = np.full(numerator.shape, np.nan, dtype="float32")
    use = valid & np.isfinite(denominator) & (np.abs(denominator) > 1e-6)
    result[use] = numerator[use] / denominator[use]
    return result

ndvi = safe_ratio(nir - red, nir + red, valid_mask)
gndvi = safe_ratio(nir - green, nir + green, valid_mask)
print("NDVI", ndvi)
print("GNDVI", gndvi)`, "Which index may saturate in dense vegetation, and why does another index not automatically solve that limitation?", "Indices compress spectral contrast into a proxy. Their ecological relationship must be calibrated or validated for sensor, season, canopy and target variable.", "Writing 'NDVI measures biomass'. NDVI responds to red and near-infrared reflectance and may correlate with biomass under specific conditions.", { title: "USGS Landsat spectral indices", href: "https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index" }),
  lesson(28, 5, "SAR Fundamentals", "Interpret Sentinel-1 backscatter through acquisition geometry, surface properties and preprocessing choices.", ["Sentinel-1", "VV/VH", "Backscatter"], "Explain SAR signal formation and design a defensible search-to-interpretation workflow.", "Which combination of moisture, roughness, structure and geometry could produce this backscatter pattern?", ["Active microwave sensing", "Polarisation and incidence angle", "Speckle, roughness and moisture", "Calibration and terrain correction"], "Search, filter, calibrate, terrain-correct and QA a Sentinel-1 observation conceptually or in an available platform.", "Keep orbit direction, relative orbit, polarisation, angle, preprocessing and terrain effects comparable.", "sentinel1_workflow_report.ipynb", `sar_query = {
    "collection": "Sentinel-1 GRD",
    "polarisations": ["VV", "VH"],
    "orbit_direction": "consistent across dates",
    "steps": ["calibrate", "terrain-correct", "QA", "interpret"],
}
for key, value in sar_query.items():
    print(key, value)`, "Why can a brighter pixel not be interpreted simply as more vegetation?", "SAR backscatter is a compound response to geometry and dielectric and structural properties. Interpretation must control acquisition and terrain context.", "Averaging incompatible orbit geometries. Incidence angle and viewing direction can produce changes unrelated to the ecological target.", { title: "Sentinel-1 user guide", href: "https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar" }),
  lesson(29, 5, "Hyperspectral Remote Sensing", "Recognise when dense narrow-band measurements provide useful spectral evidence and additional preprocessing burden.", ["Hyperspectral", "Spectral curves", "SNR"], "Evaluate hyperspectral value from absorption features, signal quality and dimensionality.", "Does the target have a resolvable spectral feature at the sensor's scale and signal-to-noise ratio?", ["Narrow bands and spectral curves", "Absorption features and red edge", "Spectral libraries and SNR", "Preprocessing and feature selection"], "Inspect representative spectra, identify noisy regions and propose justified features for vegetation traits.", "Record wavelength units, band centres, bandwidths, masks, calibration and preprocessing.", "hyperspectral_feature_note.ipynb", `import numpy as np

wavelength_nm = np.array([450, 550, 680, 710, 750, 940])
spectra = np.array([
    [0.04, 0.10, 0.06, 0.25, 0.43, 0.18],
    [0.05, 0.12, 0.09, 0.22, 0.36, 0.16],
])
snr = np.array([80, 110, 95, 90, 85, 12])
valid_bands = (wavelength_nm >= 450) & (wavelength_nm <= 900) & (snr >= 30)
spectra_clean = spectra[:, valid_bands]
wavelength_clean = wavelength_nm[valid_bands]
red_edge = (wavelength_clean >= 680) & (wavelength_clean <= 750)
print("usable bands", spectra_clean.shape[1])
print("red-edge bands", red_edge.sum())`, "Why can hundreds of bands reduce model reliability when samples are limited?", "Hyperspectral data can resolve diagnostic spectral shape, but correlated noisy bands amplify preprocessing and validation demands.", "Selecting bands after viewing test performance. Feature design must remain inside the training workflow to avoid optimistic validation.", { title: "NASA imaging spectroscopy", href: "https://earth.jpl.nasa.gov/emit/" }),
  lesson(30, 5, "LiDAR and Point Clouds", "Turn discrete three-dimensional returns into terrain and vegetation-structure products.", ["LiDAR", "Point clouds", "Canopy height"], "Explain point-cloud attributes and derive a simple structural surface with documented assumptions.", "Which returns represent ground, canopy and uncertainty in this landscape?", ["Coordinates, returns and intensity", "Point density and classification", "DSM, DTM and canopy height", "Rasterisation and structural metrics"], "Create or inspect a canopy-height product from classified point-cloud or supplied surface data.", "Check coordinate and vertical reference, units, density, classes, interpolation gaps and negative heights.", "lidar_structure_report.ipynb", `import numpy as np

dsm = np.array([[2.8, 2.4, 2.1], [2.2, 1.9, 2.5]])
dtm = np.array([[1.7, 1.8, 1.9], [1.8, 2.0, 1.9]])
canopy_height = dsm.astype("float32") - dtm.astype("float32")
canopy_height[(canopy_height < 0) | (canopy_height > 60)] = np.nan
print("median height", np.nanmedian(canopy_height))
print("valid fraction", np.isfinite(canopy_height).mean())`, "What could create negative canopy heights after subtracting the DTM from the DSM?", "Canopy height combines two estimated surfaces. Misalignment, classification errors and interpolation can propagate into structural metrics.", "Treating intensity as directly comparable across flights. Range, angle, sensor settings and calibration influence intensity.", { title: "PDAL documentation", href: "https://pdal.io/en/stable/" }),
  lesson(31, 6, "Spatial Autocorrelation", "Recognise spatial dependence and its consequences for inference and validation.", ["Moran's I", "Weights", "Spatial dependence"], "Explain spatial autocorrelation, construct a neighbourhood concept and interpret Moran's I cautiously.", "Are nearby values more similar than expected under the chosen spatial null model?", ["Tobler's first law", "Spatial weights and neighbours", "Global Moran's I", "Consequences for inference and validation"], "Compare alternative neighbourhood definitions and calculate or interpret Moran's I for a meadow variable.", "Report weights construction, islands, permutations, spatial extent and the analysed variable.", "spatial_autocorrelation_report.ipynb", `from libpysal.weights import KNN
from esda.moran import Moran

w = KNN.from_dataframe(plots, k=4)
w.transform = "R"
values = plots["ndvi_mean"].to_numpy()
moran = Moran(values, w, permutations=999)
print(moran.I, moran.p_sim)`, "Would changing from four nearest neighbours to polygon contiguity necessarily preserve Moran's I?", "Moran's I describes pattern relative to a specified weights matrix. It is evidence of spatial structure, not its ecological cause.", "Reporting a p-value without the neighbourhood definition. The test changes when the spatial relationship changes.", { title: "PySAL exploratory spatial data analysis", href: "https://pysal.org/esda/" }),
  lesson(32, 6, "Spatial Sampling and Bias", "Design and diagnose sampling that represents spatial heterogeneity without hidden clustering.", ["Sampling design", "Bias", "Stratification"], "Compare random, systematic and stratified spatial designs and recognise representativeness limits.", "Which parts of the landscape and environmental gradients can this sample represent?", ["Random and systematic sampling", "Stratification and clustering", "Edge effects", "Accessibility and spatial bias"], "Evaluate the existing plot distribution and propose a defensible supplementary design.", "Map inclusion probability, nearest-neighbour distance, stratum coverage and inaccessible regions.", "spatial_sampling_design.ipynb", `import pandas as pd

coverage = (
    plots.groupby("habitat", observed=True)
    .size()
    .rename("n_plots")
    .to_frame()
)
coverage["share"] = coverage["n_plots"] / coverage["n_plots"].sum()
print(coverage)`, "Can a large sample remove bias if all plots are close to roads?", "Sample size does not repair a biased inclusion process. Spatial design determines what population and gradients the evidence can support.", "Using random points without checking feasibility. Rejected inaccessible locations can convert a nominally random design into undocumented convenience sampling.", { title: "US EPA spatial sampling guidance", href: "https://www.epa.gov/quality/guidance-systematic-planning-using-data-quality-objectives-process" }),
  lesson(33, 6, "Interpolation and Geostatistics", "Treat interpolation as a model of spatial continuity with assumptions and prediction uncertainty.", ["IDW", "Variogram", "Kriging"], "Compare deterministic interpolation with variogram-based kriging and interpret uncertainty.", "What spatial process justifies predicting between observations?", ["IDW and trend surfaces", "Variogram, nugget, sill and range", "Ordinary kriging assumptions", "Prediction uncertainty"], "Explore an empirical variogram and compare IDW with ordinary kriging predictions at held-out locations.", "Use spatial holdouts, inspect residuals, map uncertainty and avoid extrapolation beyond support.", "geostatistical_interpolation.ipynb", `from sklearn.model_selection import GroupKFold

groups = plots["spatial_block"]
splitter = GroupKFold(n_splits=5)
for train, test in splitter.split(plots, groups=groups):
    print("train", len(train), "test", len(test))`, "Why should nearby observations not be split randomly between training and validation?", "Interpolation performance must be tested at genuinely separated locations. A smooth map is not evidence of accurate unsampled values.", "Fitting a variogram by visual preference alone. Document estimator, model, lag choices and sensitivity, then validate predictions.", { title: "PyKrige documentation", href: "https://geostat-framework.readthedocs.io/projects/pykrige/en/stable/" }),
  lesson(34, 6, "Spatial Regression Concepts", "Recognise when ordinary regression residuals violate independence and what spatial models attempt to address.", ["Spatial lag", "Spatial error", "GWR"], "Diagnose spatial residual structure and distinguish major spatial regression ideas.", "Does location retain explanatory structure after the measured predictors are considered?", ["Ordinary-model independence", "Spatial lag and spatial error concepts", "Geographically weighted approaches", "Interpretation and model comparison"], "Fit or inspect a baseline model, map residuals and test their spatial autocorrelation.", "Keep the outcome, predictors, weights and validation geography explicit; compare out-of-sample performance.", "spatial_regression_diagnostic.ipynb", `from sklearn.linear_model import LinearRegression

X = plots[["ndvi_mean", "elevation_m"]]
y = plots["biomass_g_m2"]
model = LinearRegression().fit(X, y)
plots["residual"] = y - model.predict(X)
print(plots["residual"].describe())`, "If residuals cluster spatially, which ordinary regression assumption is questionable?", "Spatial residual pattern signals unresolved dependence or missing spatial processes. A spatial model is not automatically a causal explanation.", "Choosing GWR because its coefficient map looks interesting. Local estimates can be unstable and require bandwidth, collinearity and multiple-testing scrutiny.", { title: "PySAL spatial regression", href: "https://pysal.org/spreg/" }),

  lesson(35, 7, "SQL for Geospatial Scientists", "Query environmental tables with explicit filtering, grouping and relational joins.", ["SQL", "JOIN", "GROUP BY"], "Write readable SQL that produces an auditable environmental analysis table.", "Which rows and variables constitute the analysis population?", ["SELECT and FROM", "WHERE filters", "GROUP BY summaries", "JOIN keys and cardinality"], "Query vegetation measurements and join them to site metadata.", "Count source and result rows, test key uniqueness, preserve NULLs deliberately and qualify field names.", "environmental_queries.sql", `SELECT
  p.site_id,
  COUNT(*) AS n_plots,
  AVG(p.ndvi_mean) AS mean_ndvi
FROM plot_observations AS p
WHERE p.qa_status = 'valid'
GROUP BY p.site_id
ORDER BY p.site_id;`, "Will sites with no valid plots appear in this query, and why?", "SQL makes the analysis population and aggregation explicit. Join direction and NULL handling determine which evidence remains visible.", "Using SELECT * in a published pipeline. Schema changes can silently alter outputs; name required columns and aliases.", { title: "PostgreSQL SELECT documentation", href: "https://www.postgresql.org/docs/current/sql-select.html" }),
  lesson(36, 7, "PostGIS Fundamentals", "Move vector relationships from in-memory Python to indexed database queries.", ["PostGIS", "SRID", "Spatial SQL"], "Use geometry, geography, SRIDs and core PostGIS predicates with appropriate indexes.", "Should this relationship be evaluated on a projected plane, spheroid or stored geometry?", ["Geometry, geography and SRID", "Spatial indexes", "ST_Intersects, ST_Within and ST_Buffer", "ST_Distance and ST_Transform"], "Translate a GeoPandas plot-to-zone workflow into PostGIS SQL and compare results.", "Check SRIDs, index use, row counts, unmatched records and one-to-many cardinality.", "postgis_plot_assignment.sql", `SELECT
  p.plot_id,
  z.zone_id
FROM field_plots AS p
LEFT JOIN management_zones AS z
  ON ST_Within(
    ST_Transform(p.geom, 3301),
    ST_Transform(z.geom, 3301)
  );`, "Why might a boundary point remain unmatched by ST_Within but match ST_Intersects?", "PostGIS expresses the same spatial questions as desktop and Python tools while centralising data and scaling indexed queries.", "Wrapping every indexed geometry in ST_Transform during a large join. It can prevent index use; store or materialise an analysis CRS when justified.", { title: "PostGIS reference", href: "https://postgis.net/docs/" }),
  lesson(37, 7, "Managing Large Spatial Data", "Choose when files, columnar objects or a spatial database best support scale and collaboration.", ["GeoParquet", "PostGIS", "Object storage"], "Design a storage architecture with indexing, provenance and lifecycle rules.", "Where should the authoritative data live, and how will each operation access it?", ["Files versus datasets and services", "Spatial and attribute indexing", "Partitioning concepts", "Naming, provenance and derived products"], "Create a decision record for moving an expanding meadow archive from many files to managed storage.", "Define source-of-truth, schema, identifiers, CRS, update frequency, backups and lineage.", "spatial_storage_architecture.md", `storage_plan = {
    "raw_imagery": "versioned object storage",
    "analysis_vectors": "GeoParquet",
    "shared_operational_data": "PostGIS",
    "portable_delivery": "GeoPackage or COG",
}
for dataset, location in storage_plan.items():
    print(dataset, "→", location)`, "Which option best supports many simultaneous editors and spatial queries?", "Storage choice is part of reproducibility. It determines consistency, query cost, collaboration and the ability to trace derivatives.", "Moving data into a database without a data model. A database does not repair inconsistent IDs, CRS or provenance.", { title: "GeoParquet specification", href: "https://geoparquet.org/" }),

  lesson(38, 8, "Xarray and Rioxarray", "Work with labelled multidimensional arrays that preserve coordinates, dimensions and attributes.", ["Xarray", "Rioxarray", "Labelled arrays"], "Contrast positional and labelled indexing and retain geospatial metadata through analysis.", "Which named dimensions and coordinates locate this variable in space and time?", ["DataArray and Dataset", "Dimensions, coordinates and attributes", "Labelled selection", "CRS and spatial dimensions with rioxarray"], "Open a georeferenced raster, inspect named dimensions and select an area by coordinate labels.", "Check dimension order, coordinate direction, CRS, transform, attributes and mask after each operation.", "xarray_spatial_audit.ipynb", `import rioxarray

data = rioxarray.open_rasterio("data/sentinel_stack.tif", masked=True)
print(data.dims, data.sizes)
print(data.rio.crs, data.rio.bounds())
subset = data.sel(x=slice(500000, 501000), y=slice(6501000, 6500000))
print(subset.sizes)`, "Why might the y-coordinate slice run from a larger value to a smaller value?", "Labels make array intent explicit, but coordinate order still follows the stored grid. Inspect it rather than assuming ascending axes.", "Calling .values immediately. This discards labelled context and may trigger a large eager load.", { title: "Xarray user guide", href: "https://docs.xarray.dev/en/stable/user-guide/index.html" }),
  lesson(39, 8, "EO Data Cubes", "Extend one spatial band into band and time dimensions while preserving comparable observations.", ["Data cube", "Time series", "Masking"], "Select, mask and aggregate a time × band × y × x Earth Observation cube.", "Are values comparable across every time, band and grid cell in this cube?", ["Band × y × x", "Time × band × y × x", "Selection and aggregation", "Masks and metadata preservation"], "Build or inspect a small multi-date cube and derive a cloud-aware seasonal summary.", "Verify common grid, band definitions, time zones, scaling, masks and observation counts.", "eo_data_cube.ipynb", `clear = cube.where(cube["cloud_mask"] == 0)
season = clear.sel(time=slice("2025-05-01", "2025-08-31"))
median = season["ndvi"].median("time", skipna=True)
observations = season["ndvi"].count("time")
print(median.dims, observations.min().item())`, "Can two pixels in the seasonal median be based on different numbers of dates?", "A temporal composite contains an implicit sampling pattern. Observation count and mask provenance must accompany the summary.", "Averaging before masking clouds. Contaminated values can bias the composite while remaining numerically plausible.", { title: "Xarray indexing and selecting", href: "https://docs.xarray.dev/en/stable/user-guide/indexing.html" }),
  lesson(40, 8, "Dask and Lazy Computation", "Plan chunked computations that fit memory without turning the lesson into distributed-systems engineering.", ["Dask", "Chunks", "Lazy execution"], "Explain lazy graphs, inspect chunks and trigger computation deliberately.", "How can this calculation be divided without breaking its spatial or temporal meaning?", ["Chunks and task graphs", "Lazy versus eager execution", "compute and persistence", "Memory and chunk tradeoffs"], "Compare lazy metadata operations with one bounded compute and record the chunk plan.", "Inspect chunk sizes, estimated memory, graph scope and final array dimensions.", "lazy_cube_processing.ipynb", `import xarray as xr

cube = xr.open_zarr("data/meadow_cube.zarr", chunks={"time": 4, "y": 1024, "x": 1024})
seasonal_mean = cube["ndvi"].mean("time")
print(seasonal_mean.data)
sample = seasonal_mean.isel(y=slice(0, 256), x=slice(0, 256)).compute()
print(sample.shape)`, "Which line constructs work, and which line actually executes it?", "Lazy computation separates an analytical request from execution. Chunk design should follow operation shape and memory, not arbitrary defaults.", "Calling compute() on the entire cube for inspection. Select a bounded diagnostic subset first.", { title: "Dask array best practices", href: "https://docs.dask.org/en/stable/array-best-practices.html" }),
  lesson(41, 8, "COG, Zarr and Cloud-Native Formats", "Match tiled range-readable rasters and chunked arrays to remote access patterns.", ["COG", "Zarr", "Range requests"], "Explain why internal layout—not only file extension—makes data cloud-friendly.", "Can the client retrieve only the spatial or multidimensional pieces it needs?", ["Tiling and overviews", "HTTP range requests", "Chunked multidimensional arrays", "COG versus ordinary TIFF"], "Inspect a COG and a Zarr dataset, then recommend one for a map layer and one for a time cube.", "Check tiling, overviews, compression, chunk layout, metadata consolidation and access latency.", "cloud_format_audit.ipynb", `format_fit = {
    "single analysis-ready map layer": "COG",
    "time-band spatial cube": "Zarr",
}
for use_case, choice in format_fit.items():
    print(use_case, choice, sep=" → ")`, "Why does uploading an untiled GeoTIFF to object storage not automatically make it a COG?", "Cloud-native layout minimises unnecessary transfer. It must still preserve scientific metadata, stable identifiers and versioned provenance.", "Choosing Zarr for every raster. A simple immutable map layer may be more interoperable and efficient as a validated COG.", { title: "Cloud Optimized GeoTIFF", href: "https://www.cogeo.org/" }),
  lesson(42, 8, "STAC", "Discover cloud-hosted Earth Observation assets through consistent catalog metadata.", ["STAC", "Catalog", "Search"], "Search STAC by space, time, collection and cloud cover and inspect returned assets.", "Which catalog evidence proves this asset fits the study area, period and product requirement?", ["Catalog, Collection, Item and Asset", "Spatial and temporal search", "Collection and quality properties", "Connecting metadata to COG assets"], "Query a public STAC API for coastal-meadow imagery and build a reproducible item inventory.", "Record endpoint, query geometry, date range, collection, filters, item IDs, licences and asset roles.", "stac_search_inventory.ipynb", `from pystac_client import Client

catalog = Client.open("https://earth-search.aws.element84.com/v1")
search = catalog.search(
    collections=["sentinel-2-l2a"],
    bbox=[23.3, 58.1, 24.8, 59.2],
    datetime="2025-05-01/2025-08-31",
    query={"eo:cloud_cover": {"lt": 20}},
)
items = list(search.items())
print("items", len(items))`, "Does scene-level cloud cover guarantee a clear study area?", "STAC makes search reproducible, but asset suitability still requires local QA, band-role inspection and licence review.", "Saving only temporary signed asset URLs. Preserve stable item IDs and catalog metadata so assets can be resolved again.", { title: "STAC specification", href: "https://stacspec.org/en" }),

  lesson(43, 9, "Web Maps and Spatial Services", "Understand how browsers request tiles, features and coverages from spatial services.", ["XYZ", "WMS/WFS", "Vector tiles"], "Choose a delivery pattern from data volume, interaction and analytical need.", "Should the client receive a rendered picture, vector features or measured coverage values?", ["Client and server roles", "XYZ and vector tiles", "WMS, WFS and WMTS", "GeoJSON and APIs"], "Design a delivery architecture for an interactive environmental monitoring map.", "Record CRS, scale limits, styling responsibility, cache behaviour, payload size and data sensitivity.", "web_delivery_architecture.md", `delivery = {
    "context_basemap": "XYZ tiles",
    "styled monitoring layer": "WMS or vector tiles",
    "small queryable results": "GeoJSON API",
    "analysis raster access": "COG or WCS",
}
for layer, service in delivery.items():
    print(layer, service)`, "Which option sends styled pixels rather than source features?", "Web delivery separates authoritative data, service representation and browser interaction. The correct service depends on whether users view, query or analyse.", "Sending a huge GeoJSON because it is easy to inspect. Generalisation, tiling or server-side queries may provide a faster and safer product.", { title: "OGC web services", href: "https://www.ogc.org/standards/" }),
  lesson(44, 9, "Interactive Mapping", "Communicate spatial results through a focused interactive map without teaching full frontend engineering.", ["Folium", "MapLibre", "Accessibility"], "Build a lightweight map that reveals evidence, uncertainty and provenance.", "Which interactions help the audience answer the scientific question?", ["Map purpose and audience", "Layers, popups and legends", "Performance and simplification", "Accessible alternatives and provenance"], "Create a map of monitoring results with restrained styling, meaningful popups and a static data summary.", "Test missing values, legend semantics, keyboard access, mobile layout, payload size and source attribution.", "environmental_monitoring_map.html", `import folium

map_view = folium.Map(location=[58.6, 24.5], zoom_start=9, tiles="CartoDB positron")
folium.GeoJson(
    results.to_crs(4326).__geo_interface__,
    tooltip=folium.GeoJsonTooltip(fields=["site_id", "status"]),
).add_to(map_view)
map_view.save("outputs/monitoring_map.html")`, "Which information should remain available outside the visual map?", "Interaction should clarify spatial evidence, not decorate it. A table or text summary supports accessibility and precise interpretation.", "Mapping raw sensitive locations. Generalise, aggregate or restrict delivery when ecological or personal data require protection.", { title: "Folium documentation", href: "https://python-visualization.github.io/folium/latest/" }),
  lesson(45, 9, "OGC Standards and Interoperability", "Relate established web services, OGC APIs, COG and STAC across professional systems.", ["OGC API", "Interoperability", "Services"], "Explain which standards support maps, features, coverages and catalog discovery.", "How can different tools request the same data with shared semantics?", ["WMS, WFS and WCS", "OGC API families", "COG as data access", "STAC as catalog metadata"], "Map a cross-organisation data flow from catalog discovery to analysis and map delivery.", "Verify standard version, endpoint capabilities, CRS support, paging, licence and stable identifiers.", "interoperability_map.md", `standards = {
    "rendered map": "WMS / OGC API Maps",
    "vector features": "WFS / OGC API Features",
    "raster coverage": "WCS / OGC API Coverages / COG",
    "EO discovery": "STAC",
}
for need, standard in standards.items():
    print(need, standard, sep=" → ")`, "Why are STAC and COG complementary rather than competing standards?", "STAC describes and locates assets; COG structures a raster for efficient reads. Interoperability emerges from clear roles and metadata.", "Assuming standard-compliant means identical behaviour. Clients must inspect advertised capabilities, versions and conformance classes.", { title: "OGC API standards", href: "https://ogcapi.ogc.org/" }),
  lesson(46, 10, "ArcGIS Professional Ecosystem", "Position ArcGIS components within a broader interoperable geospatial architecture.", ["ArcGIS Pro", "Enterprise", "Interoperability"], "Compare proprietary and open components by workflow role without making the Academy dependent on one vendor.", "Which component owns data, processing, automation, service delivery and governance?", ["ArcGIS Pro and geodatabases", "ModelBuilder and ArcPy", "ArcGIS Online and Enterprise", "Comparison with QGIS, GeoPandas, PostGIS and MapLibre"], "Translate one Academy workflow between ArcGIS and open-source components and identify portable standards.", "Separate data formats, analytical methods, licences, service interfaces and organisation-specific governance.", "enterprise_gis_comparison.md", `roles = {
    "desktop QA": ["ArcGIS Pro", "QGIS"],
    "Python processing": ["ArcPy", "GeoPandas/Rasterio"],
    "spatial database": ["Enterprise geodatabase", "PostGIS"],
    "web delivery": ["ArcGIS Online", "MapLibre plus services"],
}
for role, options in roles.items():
    print(role, options)`, "Which parts of a workflow are easiest to preserve across ecosystems?", "Professional practice often spans ecosystems. Open formats, explicit methods and standard services reduce lock-in while respecting organisational needs.", "Comparing products only by feature count. Governance, skills, licences, scale, integration and reproducibility determine fit.", { title: "ArcGIS Pro documentation", href: "https://pro.arcgis.com/en/pro-app/latest/help/main/welcome-to-the-arcgis-pro-app-help.htm" }),

  lesson(47, 11, "Image Segmentation Fundamentals", "Separate pixels into meaningful regions before classification or measurement.", ["Segmentation", "Texture", "Objects"], "Compare threshold, connected-region and object-based segmentation concepts.", "What constitutes one spatial object for this scientific question?", ["Thresholding", "Connected components", "Texture and object-based image analysis", "Segmentation versus classification"], "Segment a supplied vegetation image and evaluate boundary quality against reference objects.", "Report threshold or scale parameters, minimum object size, edge effects and over/under-segmentation.", "segmentation_experiment.ipynb", `from skimage.measure import label

vegetation = ndvi > 0.45
regions = label(vegetation, connectivity=2)
region_sizes = np.bincount(regions.ravel())[1:]
print("regions", len(region_sizes))
print("median pixels", np.median(region_sizes))`, "Will changing a threshold alter only class labels, or can it alter the number and shapes of objects?", "Segmentation defines candidate objects; classification assigns meaning. Boundary quality should be evaluated at the scale of the ecological target.", "Selecting parameters from the final evaluation scene. Reserve independent locations to test whether objects generalise.", { title: "scikit-image segmentation", href: "https://scikit-image.org/docs/stable/api/skimage.segmentation.html" }),
  lesson(48, 11, "Deep Learning for Geospatial Images", "Understand the image-to-patch-to-probability-to-mask workflow before using model APIs.", ["CNN", "U-Net", "Semantic segmentation"], "Design a geospatial semantic-segmentation experiment with defensible labels and spatial splits.", "What labelled spatial evidence can teach the model the target class without leakage?", ["Convolutions and receptive fields", "Semantic segmentation and U-Net", "Patches, labels and augmentation", "Train, validation and test geography"], "Specify a patch dataset and trace shapes through a conceptual segmentation pipeline.", "Check label provenance, class balance, patch overlap, spatial split, resolution and probability calibration.", "geospatial_segmentation_design.ipynb", `patch_size = 256
bands = ["blue", "green", "red", "nir"]
batch_shape = (8, len(bands), patch_size, patch_size)
mask_shape = (8, 1, patch_size, patch_size)
print("image batch", batch_shape)
print("target masks", mask_shape)`, "Why can randomly splitting overlapping patches produce unrealistically high validation accuracy?", "A segmentation model learns spatial and spectral patterns encoded by labels. Validation must test new geography rather than neighbouring fragments of training scenes.", "Starting with a complex architecture before establishing a baseline and label audit. Model capacity cannot repair ambiguous classes or leakage.", { title: "PyTorch semantic segmentation", href: "https://pytorch.org/vision/stable/models.html#semantic-segmentation" }),
  lesson(49, 11, "Geospatial Deep Learning QA", "Audit leakage, domain shift, annotation uncertainty and false confidence in mapped predictions.", ["Spatial leakage", "Domain shift", "Calibration"], "Evaluate a geospatial model beyond aggregate accuracy and communicate where it may fail.", "Does the evaluation represent the places, seasons, sensors and resolutions where the model will be used?", ["Spatial leakage and overlapping patches", "Domain shift", "Annotation uncertainty and imbalance", "Probability calibration and false confidence"], "Review a prediction map, spatial confusion patterns and uncertainty across independent regions.", "Report per-class metrics, spatial holdouts, calibration, error geography, threshold choice and unsupported domains.", "deep_learning_qa_report.pdf", `from sklearn.metrics import confusion_matrix

predicted = probability >= 0.6
matrix = confusion_matrix(reference.ravel(), predicted.ravel())
print(matrix)

for region in np.unique(region_ids):
    use = region_ids == region
    print(region, (predicted[use] == reference[use]).mean())`, "Can a high overall accuracy coexist with failure on a rare ecologically important class?", "Model quality is geographically and class conditional. A responsible product maps limitations and decision thresholds alongside predictions.", "Treating softmax probability as calibrated certainty. Confidence requires empirical calibration and may fail under domain shift.", { title: "scikit-learn probability calibration", href: "https://scikit-learn.org/stable/modules/calibration.html" }),

  lesson(50, 12, "APIs and Automated Data Acquisition", "Retrieve versioned environmental data robustly while respecting authentication, pagination and rate limits.", ["HTTP", "JSON", "Retries"], "Design a polite, recoverable and provenance-rich API acquisition step.", "Can this exact request and response inventory be reproduced later?", ["HTTP requests and JSON", "Authentication and secrets", "Pagination, retries and rate limits", "Checksums and provenance"], "Build a bounded API request workflow that records query parameters and response metadata.", "Validate status, schema, pagination completeness, content length, timestamps and stable identifiers.", "api_acquisition_log.ipynb", `import requests

url = "https://api.gbif.org/v1/occurrence/search"
params = {"country": "EE", "scientific_name": "Salicornia europaea", "limit": 100}
response = requests.get(url, params=params, timeout=30)
response.raise_for_status()
payload = response.json()
print("records", len(payload["results"]))
print("request", response.url)`, "Which failure should be retried, and which should stop for corrected authentication or query parameters?", "Automation should make acquisition repeatable without hiding service constraints. Store query, item IDs, retrieval time and licence—not secret tokens.", "Hard-coding API keys in notebooks. Read secrets from protected environment variables and exclude them from version control.", { title: "Requests documentation", href: "https://requests.readthedocs.io/en/latest/" }),
  lesson(51, 12, "Command-Line Geospatial Tools", "Use inspection, conversion and warping commands as composable professional operations.", ["GDAL", "ogr2ogr", "rio"], "Select a CLI tool by operation category and preserve commands in an audit log.", "What inspection or transformation must happen before a larger workflow proceeds?", ["gdalinfo and ogrinfo inspection", "gdal_translate and ogr2ogr conversion", "gdalwarp reprojection and resampling", "rio as the Rasterio command interface"], "Inspect source data, convert a vector layer and create a validated analysis raster using explicit commands.", "Capture tool version, input/output paths, CRS, creation options, command exit status and post-run inspection.", "geospatial_cli_workflow.sh", `gdalinfo data/source.tif
ogrinfo -so data/plots.gpkg plots
ogr2ogr -f GPKG outputs/valid_plots.gpkg data/plots.gpkg \
  -where "qa_status = 'valid'"
gdalwarp -t_srs EPSG:3301 -r bilinear \
  data/source.tif outputs/analysis_grid.tif
gdalinfo outputs/analysis_grid.tif`, "Which command only inspects data, and which creates a transformed derivative?", "CLI commands expose precise, scriptable operations. They remain scientific steps that require method justification and output verification.", "Copying a command without checking shell quoting or overwrite behaviour. Test on a small derivative and inspect the result.", { title: "GDAL programs", href: "https://gdal.org/en/stable/programs/index.html" }),
  lesson(52, 12, "Docker for Geospatial Reproducibility", "Package difficult native dependencies and project commands into a repeatable execution environment.", ["Docker", "GDAL", "Environment"], "Explain images and containers and create a minimal geospatial environment specification.", "Can another researcher rebuild the analytical environment and run the same command?", ["Image versus container", "Dependency and GDAL compatibility", "Pinned environments and data mounts", "Limits of containers"], "Create a Dockerfile and runbook for the pipeline without copying private data into the image.", "Pin base image and key dependencies, run as non-root, mount inputs read-only and record image digest.", "geospatial_pipeline_container", `FROM ghcr.io/osgeo/gdal:ubuntu-small-3.11.4
WORKDIR /academy
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt
COPY src/ src/
ENTRYPOINT ["python3", "src/run_pipeline.py"]`, "Which files belong in the immutable image, and which should be mounted at runtime?", "A container captures software and system dependencies. It does not capture data provenance, hardware equivalence or scientific decisions by itself.", "Using a floating latest tag in a published workflow. Record a version or digest so the environment can be reconstructed.", { title: "Docker build best practices", href: "https://docs.docker.com/build/building/best-practices/" }),
  lesson(53, 12, "Workflow Automation and CI", "Turn the complete pipeline into validated stages that run consistently on every change.", ["GitHub Actions", "Tests", "Artifacts"], "Design continuous integration for input validation, processing tests and reviewable outputs.", "Which automated evidence should block publication when the workflow changes?", ["Input validation and contracts", "Unit and integration tests", "Deterministic outputs and artifacts", "Continuous integration with GitHub Actions"], "Add a CI workflow that installs a pinned environment, validates a small fixture, runs tests and publishes a QA artifact.", "Use tiny licensed fixtures, cache safely, fail on warnings that affect validity and retain logs and checksums.", "geospatial_pipeline_ci.yml", `name: validate-geospatial-pipeline
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
  "lesson-2-18",
  "lesson-2-19",
  "lesson-2-20",
  "lesson-2-21",
  "lesson-2-22",
  "lesson-2-23",
  "lesson-2-24",
  "lesson-2-25",
  "lesson-2-26",
  "lesson-2-27",
  "lesson-2-28",
  "lesson-2-29",
  "lesson-2-30",
  "lesson-2-31",
  "lesson-2-32",
  "lesson-2-33",
  "lesson-2-34",
  "lesson-2-35",
  "lesson-2-36",
  "lesson-2-37",
  "lesson-2-38",
  "lesson-2-39",
  "lesson-2-40",
  "lesson-2-41",
  "lesson-2-42",
  "lesson-2-43",
  "lesson-2-44",
  "lesson-2-45",
  "lesson-2-46",
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
  {
    id: "module-2-chapter-4-practicum",
    chapter: 4,
    title: "Evaluate a UAV Survey Before Scientific Analysis",
    description: "Audit a deliberately imperfect UAV handover and decide which products and regions are defensible for ecological use.",
    tools: ["UAV product QA", "Photogrammetry evidence", "Professional handover"],
    artifact: "Artifact 2.D — Professional UAV Survey Assessment",
  },
  {
    id: "module-2-chapter-5-practicum",
    chapter: 5,
    title: "Build a Defensible Satellite Evidence Package",
    description: "Integrate optical, spectral-index, SAR, imaging-spectroscopy and LiDAR evidence without forcing incompatible measurements into one claim.",
    tools: ["Cross-sensor QA", "Evidence integration", "Scientific decision"],
    artifact: "Artifact 2.E — Satellite EO Evidence Package",
  },
  {
    id: "module-2-chapter-6-practicum",
    chapter: 6,
    title: "Design and Defend a Spatial Inference Plan",
    description: "Audit sampling, spatial dependence, interpolation and regression as one geographically validated evidence system.",
    tools: ["Spatial inference", "Geographic validation", "Release decision"],
    artifact: "Artifact 2.F — Spatial Inference and Validation Package",
  },
  {
    id: "module-2-chapter-7-practicum",
    chapter: 7,
    title: "Build a Governed Spatial Database Handover",
    description: "Convert an imperfect spatial-data handover into a controlled relational, spatial and storage architecture with traceable release evidence.",
    tools: ["Relational integrity", "Spatial SQL", "Data governance"],
    artifact: "Artifact 2.G — Spatial Database and Governance Package",
  },
  {
    id: "module-2-chapter-8-practicum",
    chapter: 8,
    title: "Build a Reproducible Cloud-Native EO Evidence Cube",
    description: "Connect STAC discovery, labelled cube eligibility, bounded Dask execution and validated COG/Zarr publication in one traceable scientific package.",
    tools: ["Xarray and Dask", "COG and Zarr", "STAC provenance"],
    artifact: "Artifact 2.H — Cloud-Native EO Discovery and Cube Package",
  },
  {
    id: "module-2-chapter-9-practicum",
    chapter: 9,
    title: "Deliver an Accessible Environmental Monitoring Map",
    description: "Turn reviewed EO evidence into a purpose-led public map, equivalent table and tested interoperable handover without exposing restricted information.",
    tools: ["Web delivery architecture", "Accessible interactive mapping", "OGC interoperability"],
    artifact: "Artifact 2.I — Accessible Web GIS Evidence Delivery",
  },
  {
    id: "module-2-chapter-10-practicum",
    chapter: 10,
    title: "Design a Portable Coastal-Meadow GIS Architecture",
    description: "Allocate ArcGIS and open components by role, prove cross-ecosystem equivalence, and defend a governed architecture with an exit path.",
    tools: ["Enterprise architecture", "Workflow translation", "Migration evidence"],
    artifact: "Artifact 2.J — Portable Professional GIS Architecture",
  },
] as const;

export const module2Overview: AcademyModuleOverview = {
  moduleNumber: 2,
  accent: "blue",
  overviewLabel: "Module 2 overview",
  navigationTitle: "Available Module 2 lessons",
  navigationMeta: "46 lessons · 10 practica available",
  syllabusAriaLabel: "Complete fifty-three-lesson Module 2 map",
  planningNote:
    "Lessons 2.1–2.46 and ten chapter practica are available now, completing Spatial Foundations, Vector GIS, Raster Science, UAV and Photogrammetry, Satellite Earth Observation, Spatial Statistics and Geostatistics, Spatial Databases, Multidimensional and Cloud-Native Data, Web GIS and Delivery, and Enterprise GIS. The remaining lessons and capstone stay visible as the planned professional pathway and will be released only after full educational review.",
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
    number: 54,
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

function uavRubric(technical: string, conceptual: string): ReviewedLessonDetails["rubric"] {
  return [
    { dimension: "Technical correctness", expectation: technical },
    { dimension: "Conceptual understanding", expectation: conceptual },
    { dimension: "Reproducibility", expectation: "Preserves immutable inputs, identifiers, parameters, versions, checksums and reviewable outputs" },
    { dimension: "Scientific communication", expectation: "Connects each finding to evidence, intended use, uncertainty, consequence and next action" },
  ];
}

const commonUavChecklist = [
  "Synthetic training data are never presented as real UAV imagery or published field locations",
  "Observed metadata, derived calculations, assumptions and decisions remain separate",
  "Spatial and temporal support are explicit",
  "Raw inputs remain immutable and every derivative is reopened and checked",
  "Limitations and blocking evidence are visible in the portfolio artifact",
];

const uavLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-18": {
    estimatedTime: "70–90 minutes",
    lessonType: "Concept Lesson",
    markdownFile: "content/lessons/module-2/lesson-18.md",
    formativeChecks: [
      { id: "m2-l18-system", question: "Which item is normally a derived UAV product rather than a direct sensor record?", options: ["Orthomosaic", "Individual raw camera frame", "Image capture timestamp"], correctOption: 0, explanation: "An orthomosaic is produced through camera modelling, orthorectification, surface use, resampling and mosaicking; it is not one direct exposure." },
      { id: "m2-l18-sensors", question: "What does a thermal UAV camera most directly respond to?", options: ["Thermal infrared radiation reaching the detector", "Air temperature at the weather station", "Plant water stress as a direct measurement"], correctOption: 0, explanation: "A thermal detector records infrared signal. Apparent surface temperature and ecological stress require calibration, emissivity assumptions, environmental context and validation." },
      { id: "m2-l18-time", question: "Why can one orthomosaic contain temporal inconsistency?", options: ["Its source images can be acquired across changing light, wind, tide or surface state", "All mosaic pixels are captured simultaneously", "A CRS transformation adds time differences"], correctOption: 0, explanation: "Mosaicking places observations from an acquisition interval into one spatial raster but cannot make their illumination or surface conditions simultaneous." },
    ],
    submissionChecklist: [...commonUavChecklist, "Direct records, navigation metadata and every derived product are classified", "GSD is distinguished from accuracy and effective resolution"],
    rubric: uavRubric("Classifies UAV system components, sensor measurements and product provenance accurately", "Explains why platform, acquisition and processing jointly determine the evidence"),
    coreReferences: [
      { title: "USGS National Uncrewed Systems Office", href: "https://www.usgs.gov/centers/national-uncrewed-systems-office" },
      { title: "OpenDroneMap documentation", href: "https://docs.opendronemap.org/" },
    ],
    furtherReading: [
      { title: "NASA Earthdata remote sensing", href: "https://www.earthdata.nasa.gov/learn/backgrounders/remote-sensing" },
      { title: "OGC SensorThings standard", href: "https://www.ogc.org/standards/sensorthings/" },
    ],
  },
  "lesson-2-19": {
    estimatedTime: "90–110 minutes",
    lessonType: "Concept + Calculation Lab",
    markdownFile: "content/lessons/module-2/lesson-19.md",
    formativeChecks: [
      { id: "m2-l19-height", question: "With one camera and a level surface, what usually happens when height above ground increases?", options: ["GSD and footprint increase", "GSD becomes finer while footprint increases", "Absolute accuracy is guaranteed to improve"], correctOption: 0, explanation: "In the simplified pinhole relationship, GSD and linear footprint scale with camera-to-surface height; accuracy still requires separate evidence." },
      { id: "m2-l19-overlap", question: "What does image overlap principally provide?", options: ["Repeated views that can support matching and geometric redundancy", "Guaranteed sharpness and positional accuracy", "Automatic reflectance calibration"], correctOption: 0, explanation: "Overlap supplies common scene content between images. Blur, texture, view distribution, illumination and georeferencing still control product quality." },
      { id: "m2-l19-shutter", question: "Why can a rolling shutter distort a moving-platform image?", options: ["Different rows are recorded at slightly different times and camera poses", "It always uses a longer focal length", "It changes the output CRS during exposure"], correctOption: 0, explanation: "Sequential row readout means motion can produce row-dependent geometry; effect depends on readout, motion, exposure, stabilisation and modelling." },
    ],
    submissionChecklist: [...commonUavChecklist, "GSD, footprint and spacing use consistent units and stated assumptions", "Terrain, speed, trigger, shutter and achieved overlap are evaluated"],
    rubric: uavRubric("Calculates mission geometry and sensitivity correctly", "Explains overlap as an opportunity for reconstruction rather than a universal guarantee"),
    coreReferences: [
      { title: "Pix4D image acquisition plan", href: "https://support.pix4d.com/hc/en-us/articles/202557459" },
      { title: "OpenDroneMap flying guidance", href: "https://docs.opendronemap.org/flying/" },
    ],
    furtherReading: [
      { title: "USGS National Uncrewed Systems Office", href: "https://www.usgs.gov/centers/national-uncrewed-systems-office" },
      { title: "Agisoft Metashape user manual", href: "https://www.agisoft.com/downloads/user-manuals/" },
    ],
  },
  "lesson-2-20": {
    estimatedTime: "100–120 minutes",
    lessonType: "Scientific Measurement Lab",
    markdownFile: "content/lessons/module-2/lesson-20.md",
    formativeChecks: [
      { id: "m2-l20-dn", question: "Why is a camera digital number not automatically surface reflectance?", options: ["It also depends on illumination, exposure, sensor response and processing", "Digital numbers never contain spectral information", "Reflectance is defined only by the filename"], correctOption: 0, explanation: "A stored DN is produced by the sensor and acquisition chain. Reflectance requires a documented calibration and illumination-relative product definition." },
      { id: "m2-l20-panel", question: "What does a calibrated reference panel provide?", options: ["Known-target evidence within a protocol, not a guarantee of perfect flight-wide reflectance", "Automatic correction of saturation", "Proof that every band is geometrically aligned"], correctOption: 0, explanation: "Panel condition, exposure, timing, illumination, directional response and sensor processing must all be reviewed, and several uncertainties remain." },
      { id: "m2-l20-registration", question: "Why is band co-registration part of multispectral QA?", options: ["Misregistration makes spectral arithmetic combine different ground footprints", "It converts radiance into reflectance", "It guarantees temporal compatibility"], correctOption: 0, explanation: "A spectral index assumes corresponding cells describe the same spatial support; shifted lenses, timing or grids can create false edge patterns." },
    ],
    submissionChecklist: [...commonUavChecklist, "DN, radiance and reflectance product claims remain distinct", "Exposure, saturation, panels, irradiance, gradient and registration are audited"],
    rubric: uavRubric("Diagnoses radiometric metadata, scale, exposure, illumination and registration correctly", "Explains calibration evidence and remaining directional, saturation and timing limits"),
    coreReferences: [
      { title: "MicaSense image processing knowledge base", href: "https://support.micasense.com/hc/en-us/categories/115000274848-Image-Processing" },
      { title: "Pix4D radiometric correction", href: "https://support.pix4d.com/hc/en-us/articles/115001846106" },
    ],
    furtherReading: [
      { title: "NASA Earth Observatory: measuring vegetation", href: "https://earthobservatory.nasa.gov/features/MeasuringVegetation" },
      { title: "Rasterio masks", href: "https://rasterio.readthedocs.io/en/stable/topics/masks.html" },
    ],
  },
  "lesson-2-21": {
    estimatedTime: "100–120 minutes",
    lessonType: "Concept + QA Lab",
    markdownFile: "content/lessons/module-2/lesson-21.md",
    formativeChecks: [
      { id: "m2-l21-geotag", question: "What does an image geotag establish by itself?", options: ["A recorded position estimate whose accuracy and reference still require evidence", "The final orthomosaic accuracy", "The vertical datum of every surface product"], correctOption: 0, explanation: "Geotags depend on GNSS, timing, offsets and reference systems and can initialise or constrain cameras without independently validating final products." },
      { id: "m2-l21-control", question: "Why keep surveyed check points out of bundle adjustment?", options: ["To provide independent evidence of external product error", "To make fitted GCP residuals smaller", "Because check points cannot have vertical coordinates"], correctOption: 0, explanation: "A point used to fit the solution no longer provides independent validation. Withheld, distributed points test performance beyond fitting evidence." },
      { id: "m2-l21-rmse", question: "What important behaviour can one planimetric RMSE conceal?", options: ["Directional bias, outliers and local spatial warping", "The number of raster bands", "The image exposure time"], correctOption: 0, explanation: "RMSE summarises magnitude but not sign or location. Component bias, maximum residual and a spatial vector map are required for diagnosis." },
    ],
    submissionChecklist: [...commonUavChecklist, "GCP and check-point roles remain separate throughout", "Component bias, RMSE, maximum and spatial residuals include horizontal and vertical evidence"],
    rubric: uavRubric("Calculates and maps residual evidence correctly without deleting difficult points", "Distinguishes direct georeferencing, fitted constraints, relative accuracy and independent absolute assessment"),
    coreReferences: [
      { title: "ASPRS Positional Accuracy Standards", href: "https://www.asprs.org/divisions-committees/standards" },
      { title: "Pix4D ground control point guidance", href: "https://support.pix4d.com/hc/en-us/articles/202557489" },
    ],
    furtherReading: [
      { title: "OpenDroneMap ground control points", href: "https://docs.opendronemap.org/gcp/" },
      { title: "EPSG Dataset", href: "https://epsg.org/home.html" },
    ],
  },
  "lesson-2-22": {
    estimatedTime: "110–130 minutes",
    lessonType: "Concept + Workflow Lab",
    markdownFile: "content/lessons/module-2/lesson-22.md",
    formativeChecks: [
      { id: "m2-l22-perspective", question: "Why is assigning a CRS not equivalent to orthorectifying a raw image?", options: ["Orthorectification models camera perspective and surface geometry before mapping pixels", "CRS labels automatically estimate camera pose", "Raw images have no perspective"], correctOption: 0, explanation: "A raw image is a perspective projection. Orthorectification uses camera and surface models; a CRS label alone cannot remove relief and viewpoint displacement." },
      { id: "m2-l22-tiepoints", question: "What is a tie point in Structure from Motion?", options: ["Matched image observations believed to represent one scene point", "A surveyed point that must always be a GCP", "A final orthomosaic cell"], correctOption: 0, explanation: "Tie points connect images and support camera/3-D estimation. Their ground coordinates are estimated and they are not independent surveyed control." },
      { id: "m2-l22-reprojection", question: "What does low reprojection error most directly describe?", options: ["Agreement of fitted image observations with the fitted camera-and-point model", "Independent absolute accuracy everywhere", "Radiometric reflectance quality"], correctOption: 0, explanation: "Reprojection residuals are internal image-geometry diagnostics. External check points and other QA are required for map accuracy and scientific fitness." },
    ],
    submissionChecklist: [...commonUavChecklist, "Every reconstruction stage identifies input, estimate, assumption and diagnostic", "Internal reprojection evidence is never presented as external accuracy"],
    rubric: uavRubric("Audits alignment, camera, tie-point and reconstruction evidence accurately", "Explains the complete software-independent SfM chain and its causal failure modes"),
    coreReferences: [
      { title: "OpenDroneMap documentation", href: "https://docs.opendronemap.org/" },
      { title: "Agisoft Metashape user manual", href: "https://www.agisoft.com/downloads/user-manuals/" },
    ],
    furtherReading: [
      { title: "Pix4D processing steps", href: "https://support.pix4d.com/hc/en-us/articles/202557599" },
      { title: "COLMAP structure-from-motion documentation", href: "https://colmap.github.io/tutorial.html" },
    ],
  },
  "lesson-2-23": {
    estimatedTime: "110–130 minutes",
    lessonType: "Scientific Product Lab",
    markdownFile: "content/lessons/module-2/lesson-23.md",
    formativeChecks: [
      { id: "m2-l23-clouds", question: "What primarily distinguishes a sparse SfM cloud from a dense reconstruction?", options: ["Sparse points come from tie-point geometry; dense processing estimates many more surface points", "Sparse clouds are always LiDAR", "Dense clouds are continuous terrain truth"], correctOption: 0, explanation: "Sparse points support camera alignment and block diagnosis; dense methods estimate more surface samples, still with uneven support and uncertainty." },
      { id: "m2-l23-dtm", question: "What evidence is required before calling a product a DTM?", options: ["A documented ground-identification, interpolation and validation process", "A smooth elevation surface", "The filename contains terrain"], correctOption: 0, explanation: "A DTM is an interpreted bare-earth approximation. Dense vegetation may hide ground, so classification and independent evidence determine credibility." },
      { id: "m2-l23-mosaic", question: "Why can one orthomosaic contain a visible seam?", options: ["Different orthorectified source images can differ in illumination, geometry, time or sharpness", "Every source pixel is one simultaneous exposure", "The DSM is necessarily bare earth"], correctOption: 0, explanation: "Mosaicking selects and blends contributions from multiple views; source and processing differences can create radiometric or geometric boundaries." },
    ],
    submissionChecklist: [...commonUavChecklist, "Point cloud, DSM, DTM, orthorectified image and orthomosaic meanings are distinct", "Seam, ghosting, DSM artefacts, occlusion, interpolation and vertical limits are mapped"],
    rubric: uavRubric("Diagnoses the synthetic mosaic and DSM fixtures correctly", "Explains how each product is derived and refuses unsupported terrain or canopy-height claims"),
    coreReferences: [
      { title: "USGS digital elevation terminology", href: "https://pubs.usgs.gov/publication/70223828" },
      { title: "OpenDroneMap outputs", href: "https://docs.opendronemap.org/outputs/" },
    ],
    furtherReading: [
      { title: "GDAL DEM processing", href: "https://gdal.org/en/stable/programs/gdaldem.html" },
      { title: "Rasterio georeferencing", href: "https://rasterio.readthedocs.io/en/stable/topics/georeferencing.html" },
    ],
  },
  "lesson-2-24": {
    estimatedTime: "130–150 minutes",
    lessonType: "Professional Practicum",
    markdownFile: "content/lessons/module-2/lesson-24.md",
    formativeChecks: [
      { id: "m2-l24-mission", question: "Which evidence distinguishes the achieved mission from its plan?", options: ["Captured positions/times, image quality, aligned frames and actual coverage", "The planned overlap percentage alone", "The output colour palette"], correctOption: 0, explanation: "Actual frames, timing, terrain and alignment show what was observed. A planned route cannot reveal missing or unusable coverage by itself." },
      { id: "m2-l24-georef", question: "Most check points pass but one weak edge has a large residual. What is defensible?", options: ["Record a regional warning and evaluate intended support there", "Delete the point to improve global RMSE", "Declare the entire survey perfect"], correctOption: 0, explanation: "Local deformation can affect a bounded area. Preserve the evidence, investigate cause and make product/region-specific decisions." },
      { id: "m2-l24-multispectral", question: "Red Edge scale is undocumented. What is its status for a quantitative index?", options: ["Blocking review until authoritative scale metadata are supplied", "Pass because values resemble reflectance times 10000", "Divide by the largest value"], correctOption: 0, explanation: "A familiar value range is not authoritative metadata. The derivative must stop rather than introduce an assumed measurement scale." },
    ],
    submissionChecklist: [...commonUavChecklist, "All eight QA categories contain expected, observed, status, severity, consequence and action", "Product- and region-specific decisions include at least one accept, review and unsuitable case"],
    rubric: uavRubric("Builds a complete reproducible QA matrix and spatial error map", "Integrates independent QA dimensions without allowing one pass to cancel another failure"),
    coreReferences: [
      { title: "ASPRS Positional Accuracy Standards", href: "https://www.asprs.org/divisions-committees/standards" },
      { title: "QGIS raster properties", href: "https://docs.qgis.org/3.44/en/docs/user_manual/working_with_raster/raster_properties.html" },
    ],
    furtherReading: [
      { title: "OpenDroneMap documentation", href: "https://docs.opendronemap.org/" },
      { title: "Rasterio masks", href: "https://rasterio.readthedocs.io/en/stable/topics/masks.html" },
    ],
  },
  "lesson-2-25": {
    estimatedTime: "140–170 minutes",
    lessonType: "Integrated Technical Practicum",
    markdownFile: "content/lessons/module-2/lesson-25.md",
    formativeChecks: [
      { id: "m2-l25-inventory", question: "Red Edge values look like reflectance multiplied by 10000, but scale metadata are missing. What should happen?", options: ["Block quantitative use until the scale is verified", "Divide by 10000 automatically", "Clip all values to one"], correctOption: 0, explanation: "Value appearance is not product definition. Recording a blocked derivative is more reproducible than inventing a scale factor." },
      { id: "m2-l25-alignment", question: "Two bands share CRS, resolution and shape but their origins differ by half a cell. Can they be combined directly?", options: ["No; their corresponding indices represent different ground footprints", "Yes; shape is sufficient", "Yes; NDVI corrects alignment"], correctOption: 0, explanation: "Cell-wise arithmetic requires identical transforms/origins and validated content registration, not merely matching array dimensions." },
      { id: "m2-l25-index", question: "What should safe normalised-difference code do where the denominator is near zero?", options: ["Leave the result invalid under a declared epsilon rule", "Return positive infinity", "Replace the denominator with one silently"], correctOption: 0, explanation: "Near-zero denominators make ratios unstable. The joint mask and epsilon rule should propagate invalidity and remain documented." },
    ],
    submissionChecklist: [...commonUavChecklist, "Every band passes identity, scale, radiometry, grid and mask gates before arithmetic", "Accepted and blocked layers both appear in the stack manifest with reasons"],
    rubric: uavRubric("Builds correct masks, safe indices, aligned outputs, extraction and round-trip QA", "Explains why numerical index validity does not establish ecological validity"),
    coreReferences: [
      { title: "Rasterio georeferencing", href: "https://rasterio.readthedocs.io/en/stable/topics/georeferencing.html" },
      { title: "Rasterio masks", href: "https://rasterio.readthedocs.io/en/stable/topics/masks.html" },
    ],
    furtherReading: [
      { title: "USGS Landsat NDVI", href: "https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index" },
      { title: "NumPy floating-point error handling", href: "https://numpy.org/doc/stable/reference/generated/numpy.errstate.html" },
    ],
  },
};

function satelliteRubric(technical: string, conceptual: string): ReviewedLessonDetails["rubric"] {
  return [
    { dimension: "Technical correctness", expectation: technical },
    { dimension: "Conceptual understanding", expectation: conceptual },
    { dimension: "Reproducibility", expectation: "Records product identity, acquisition context, preprocessing, masks, parameters, versions and reviewable outputs" },
    { dimension: "Scientific communication", expectation: "Separates observed signal, derived evidence, ecological interpretation, limitations and next action" },
  ];
}

const commonSatelliteChecklist = [
  "Synthetic training observations are identified as instructional rather than real satellite or field measurements",
  "Sensor, product level, acquisition context, units, scale and masks are recorded before analysis",
  "Code is rerunnable from immutable inputs and preserves invalid observations rather than silently filling them",
  "Every ecological statement distinguishes the measured signal from the proposed environmental explanation",
];

const satelliteLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-26": {
    estimatedTime: "150–180 minutes",
    lessonType: "Concept and Product-Selection Lab",
    markdownFile: "content/lessons/module-2/lesson-26.md",
    formativeChecks: [
      { id: "m2-l26-level", question: "You need comparable land-surface reflectance through time. Which evidence is essential before selecting a product?", options: ["Processing level, scale and quality-mask definition", "The brightest thumbnail", "The shortest filename"], correctOption: 0, explanation: "A surface-reflectance analysis depends on a defined processing level, numeric conversion and valid-observation mask. A display image cannot establish any of these conditions." },
      { id: "m2-l26-resolution", question: "A Sentinel-2 red-edge band is supplied at 20 m. Does resampling it to 10 m create 10 m red-edge observations?", options: ["No; it creates a 10 m grid from measurements whose native support remains 20 m", "Yes; pixel size and information content are identical", "Yes, if bilinear interpolation is used"], correctOption: 0, explanation: "Resampling changes the grid used to represent values, not the sensor's native measurement support or its ability to resolve finer spatial detail." },
      { id: "m2-l26-revisit", question: "Why is nominal revisit not the same as usable ecological observation frequency?", options: ["Cloud, shadow, haze, geometry and phenological timing remove or weaken acquisitions", "Satellites collect data only in winter", "Every revisit contains identical surface conditions"], correctOption: 0, explanation: "Acquisition opportunity is only the first gate. Quality masks, atmosphere, view geometry and timing relative to the ecological process determine whether an observation is usable." },
    ],
    submissionChecklist: [...commonSatelliteChecklist, "The product decision compares Sentinel-2 and Landsat against a stated meadow question", "Native band support, cloud/shadow policy and rejected observations are explicit"],
    rubric: satelliteRubric("Selects and scales optical products correctly and applies a defensible quality gate", "Connects electromagnetic interaction, band response, resolution and product level to the scientific question"),
    coreReferences: [
      { title: "Sentinel-2 mission and MSI bands", href: "https://sentiwiki.copernicus.eu/web/s2-mission" },
      { title: "USGS Landsat Collection 2 Level-2 products", href: "https://www.usgs.gov/landsat-missions/landsat-collection-2-level-2-science-products" },
    ],
    furtherReading: [
      { title: "Sentinel-2 products", href: "https://sentiwiki.copernicus.eu/web/s2-products" },
      { title: "USGS Landsat scale-factor guidance", href: "https://www.usgs.gov/faqs/how-do-i-use-a-scale-factor-landsat-level-2-science-products" },
    ],
  },
  "lesson-2-27": {
    estimatedTime: "160–190 minutes",
    lessonType: "Spectral-Index Interpretation Lab",
    markdownFile: "content/lessons/module-2/lesson-27.md",
    formativeChecks: [
      { id: "m2-l27-proxy", question: "A meadow plot has high NDVI. What is the strongest defensible statement from NDVI alone?", options: ["Its valid red and NIR reflectances produce a strong normalised spectral contrast", "Its biomass is known exactly", "Its species richness must be high"], correctOption: 0, explanation: "NDVI is a transformation of two reflectance measurements. Biomass or diversity interpretation requires field evidence, context and validation rather than a universal conversion." },
      { id: "m2-l27-mask", question: "Cloudy red and clear NIR values occur at one pixel. Should the index be calculated?", options: ["No; the joint valid mask must require both contributing bands to be valid", "Yes; the NIR value is enough", "Yes; the ratio removes cloud effects"], correctOption: 0, explanation: "An index inherits the validity of every input. Combining measurements with different or invalid support creates a number without a defensible observation." },
      { id: "m2-l27-saturation", question: "NDVI values flatten across dense canopies. What should the analyst do?", options: ["Treat saturation as a limitation and test alternative evidence against field observations", "Assume all dense plots have identical biomass", "Multiply NDVI until differences appear"], correctOption: 0, explanation: "Saturation is a response limitation, not a formatting problem. Alternative indices or sensors remain hypotheses until their relationship to the target is independently evaluated." },
    ],
    submissionChecklist: [...commonSatelliteChecklist, "NDVI, GNDVI, SAVI and MSAVI formulas and parameters are documented", "The comparison discusses saturation, soil, atmosphere, season, sensor and native support"],
    rubric: satelliteRubric("Calculates masked indices safely from correctly scaled and aligned reflectance", "Interprets each index as a context-dependent spectral proxy rather than a direct ecological measurement"),
    coreReferences: [
      { title: "USGS Landsat NDVI", href: "https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index" },
      { title: "Huete: Soil-Adjusted Vegetation Index", href: "https://doi.org/10.1016/0034-4257(88)90106-X" },
    ],
    furtherReading: [
      { title: "Qi et al.: Modified Soil-Adjusted Vegetation Index", href: "https://doi.org/10.1016/0034-4257(94)90134-1" },
      { title: "Sentinel-2 products specification", href: "https://sentiwiki.copernicus.eu/web/s2-products" },
    ],
  },
  "lesson-2-28": {
    estimatedTime: "170–210 minutes",
    lessonType: "SAR Reasoning and Comparability Lab",
    markdownFile: "content/lessons/module-2/lesson-28.md",
    formativeChecks: [
      { id: "m2-l28-brightness", question: "A meadow becomes brighter in a Sentinel-1 image. What can be concluded immediately?", options: ["Backscatter increased under that acquisition and processing context", "Vegetation biomass increased", "Soil moisture is the only possible cause"], correctOption: 0, explanation: "Backscatter combines dielectric properties, roughness, structure, geometry and processing. Ecological attribution requires controlled comparisons and independent evidence." },
      { id: "m2-l28-db", question: "Can decibel values be averaged and treated as though they were linear power?", options: ["No; convert to linear power when the operation requires linear averaging", "Yes; decibels are ordinary reflectance", "Yes, whenever values are negative"], correctOption: 0, explanation: "Decibels are logarithmic. Statistical operations must match the represented quantity, and the chosen conversion and aggregation must be documented." },
      { id: "m2-l28-comparability", question: "Which time-series comparison is strongest?", options: ["Same mode, polarisation, relative orbit and similar incidence geometry after consistent preprocessing", "Any two cloud-free SAR scenes", "Ascending and descending scenes mixed without metadata"], correctOption: 0, explanation: "SAR is not blocked by cloud in the optical sense, but viewing geometry strongly affects the measurement. Consistent acquisition and preprocessing reduce non-ecological differences." },
    ],
    submissionChecklist: [...commonSatelliteChecklist, "Orbit, relative orbit, mode, polarisation, incidence angle and RTC status are compared", "Linear and decibel quantities are never mixed without an explicit conversion"],
    rubric: satelliteRubric("Builds a comparable Sentinel-1 observation set and performs correct backscatter conversions", "Explains backscatter as a joint response to dielectric, structural, roughness and geometric controls"),
    coreReferences: [
      { title: "Sentinel-1 mission", href: "https://sentiwiki.copernicus.eu/web/s1-mission" },
      { title: "Sentinel-1 processing", href: "https://sentiwiki.copernicus.eu/web/s1-processing" },
    ],
    furtherReading: [
      { title: "ASF HyP3 radiometric terrain correction guide", href: "https://hyp3-docs.asf.alaska.edu/guides/rtc_product_guide/" },
      { title: "NASA SAR Handbook", href: "https://earthdata.nasa.gov/learn/earth-observation-data-basics/sar" },
    ],
  },
  "lesson-2-29": {
    estimatedTime: "170–210 minutes",
    lessonType: "Imaging-Spectroscopy Evidence Lab",
    markdownFile: "content/lessons/module-2/lesson-29.md",
    formativeChecks: [
      { id: "m2-l29-bands", question: "Why do hundreds of narrow bands not automatically improve a model?", options: ["They add correlated predictors, noise and validation burden relative to the available samples", "Every wavelength measures the same property perfectly", "Models cannot read more than ten columns"], correctOption: 0, explanation: "Dense spectra can resolve shape, but they also increase dimensionality and sensitivity to noise, preprocessing and leakage. Useful information must be demonstrated under valid evaluation." },
      { id: "m2-l29-feature", question: "When is an apparent absorption feature defensible?", options: ["When its wavelength position, bandwidth, signal quality, preprocessing and physical interpretation are supported", "Whenever one plotted point is lower", "After removing every inconvenient band"], correctOption: 0, explanation: "A feature must exceed noise and remain meaningful under the instrument's spectral response and atmospheric correction. Visual shape alone is insufficient evidence." },
      { id: "m2-l29-leakage", question: "You select wavelengths using the full dataset, then split into train and test. What is the risk?", options: ["Test information has influenced feature selection, creating optimistic performance", "The wavelength units will change", "The spectra will become multispectral"], correctOption: 0, explanation: "Any outcome-informed feature choice must occur inside the training resampling process. Otherwise the held-out data are no longer independent evidence." },
    ],
    submissionChecklist: [...commonSatelliteChecklist, "Band centres, bandwidths, wavelength units, SNR and bad-band decisions are explicit", "Feature selection is justified physically and designed to remain inside future training validation"],
    rubric: satelliteRubric("Screens spectral bands correctly and derives a transparent, reproducible feature", "Balances absorption evidence, spectral response, SNR, mixed pixels and dimensionality"),
    coreReferences: [
      { title: "NASA EMIT data tutorial series", href: "https://earth.jpl.nasa.gov/emit/events/4/emit-data-tutorial-series/" },
      { title: "NASA EMIT imaging spectroscopy", href: "https://earth.jpl.nasa.gov/emit/" },
    ],
    furtherReading: [
      { title: "USGS Spectral Library", href: "https://www.usgs.gov/labs/spec-lab/capabilities/spectral-library" },
      { title: "scikit-learn cross-validation", href: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    ],
  },
  "lesson-2-30": {
    estimatedTime: "170–210 minutes",
    lessonType: "Point-Cloud and Structural-Metric Lab",
    markdownFile: "content/lessons/module-2/lesson-30.md",
    formativeChecks: [
      { id: "m2-l30-return", question: "Does a first return always represent the top of vegetation?", options: ["No; return meaning depends on the intercepted surface, geometry, pulse and classification", "Yes, without exception", "Only when intensity is zero"], correctOption: 0, explanation: "Return order records detections within a pulse, not a guaranteed ecological class. Buildings, birds, water, noise and low vegetation can complicate interpretation." },
      { id: "m2-l30-chm", question: "What must be true before subtracting DTM from DSM?", options: ["The surfaces must share grid, units, horizontal support and compatible vertical reference", "Their filenames must both contain DEM", "The DSM must have more colours"], correctOption: 0, explanation: "A canopy-height difference is meaningful only when corresponding cells and vertical quantities are compatible. Misalignment or datum differences become false height." },
      { id: "m2-l30-negative", question: "A canopy-height raster contains negative values. What is the professional response?", options: ["Flag and investigate alignment, classification, interpolation and water/edge effects", "Silently set every negative value to zero", "Report negative vegetation"], correctOption: 0, explanation: "Negative differences are diagnostic evidence. Masking may be appropriate after cause and rule are recorded, but silent clipping hides product limitations." },
    ],
    submissionChecklist: [...commonSatelliteChecklist, "Return order, classification, point density, intensity status and vertical reference are audited", "DSM, DTM and canopy-height products use a shared grid and preserve negative-height QA evidence"],
    rubric: satelliteRubric("Audits point attributes and derives aligned, quality-controlled structural metrics", "Distinguishes direct returns, classified points, interpolated surfaces and ecological structure claims"),
    coreReferences: [
      { title: "ASPRS LAS specification", href: "https://www.asprs.org/wp-content/uploads/2021/04/LAS_latest.pdf" },
      { title: "USGS 3D Elevation Program products", href: "https://www.usgs.gov/3d-elevation-program/about-3dep-products-services" },
    ],
    furtherReading: [
      { title: "PDAL documentation", href: "https://pdal.io/en/stable/" },
      { title: "NASA GEDI mission", href: "https://gedi.umd.edu/" },
    ],
  },
};

function spatialStatisticsRubric(technical: string, conceptual: string): ReviewedLessonDetails["rubric"] {
  return [
    { dimension: "Technical correctness", expectation: technical },
    { dimension: "Conceptual understanding", expectation: conceptual },
    { dimension: "Reproducibility", expectation: "Preserves the sampling set, spatial domain, weights, seeds, parameters, validation geography, excluded evidence and reviewable outputs" },
    { dimension: "Scientific communication", expectation: "Separates observed pattern, model prediction, uncertainty, sampling limitation, association and unsupported causal explanation" },
  ];
}

const commonSpatialStatisticsChecklist = [
  "Synthetic local coordinates are identified as instructional metric coordinates rather than a real CRS or field location",
  "The target population, observation support, analysis rows and QA exclusions are stated before the method",
  "Neighbour, sampling, validation and random-seed decisions are explicit and reproducible",
  "Maps and written interpretations distinguish observation, statistical pattern, prediction, uncertainty and causal limitation",
];

const spatialStatisticsLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-31": {
    estimatedTime: "170–210 minutes",
    lessonType: "Spatial-Dependence Reasoning Lab",
    markdownFile: "content/lessons/module-2/lesson-31.md",
    formativeChecks: [
      { id: "m2-l31-weights", question: "Which statement about a spatial-weights matrix is correct?", options: ["It encodes a declared hypothesis about which observations are spatially related", "It is uniquely determined by the coordinate columns", "It proves the environmental mechanism connecting neighbours"], correctOption: 0, explanation: "Contiguity, distance, k-nearest and process-based weights represent different relationship hypotheses. Their scientific rationale and consequences must be reported." },
      { id: "m2-l31-permutation", question: "What does permutation inference for global Moran's I do?", options: ["It shuffles values among fixed locations and weights to build a reference distribution", "It moves plots until the map looks random", "It proves the ecological cause of clustering"], correctOption: 0, explanation: "The observed geometry and weights remain fixed while values are rearranged. The result is conditional on exchangeability, the analysed sample and the chosen relationship model." },
      { id: "m2-l31-cause", question: "A positive Moran's I has a small permutation probability. What is established?", options: ["Similar values are spatially arranged unusually under the stated weights and permutation model", "Elevation caused NDVI", "Every nearby plot measures the same process"], correctOption: 0, explanation: "The statistic supports a pattern statement, not a causal mechanism. Environmental gradients, sampling and alternative weights remain competing explanations to examine." },
    ],
    submissionChecklist: [...commonSpatialStatisticsChecklist, "At least three plausible weights definitions are compared without selecting by significance", "Islands, edges, link distances, transformation, expected I and permutations are reported"],
    rubric: spatialStatisticsRubric("Constructs and audits weights correctly and reproduces global Moran permutation evidence", "Explains spatial autocorrelation as value structure conditional on W rather than an ecological cause"),
    coreReferences: [
      { title: "PySAL: Global spatial autocorrelation with Moran's I", href: "https://pysal.org/esda/stable/user-guide/global_morans_i.html" },
      { title: "PySAL esda user guide", href: "https://pysal.org/esda/stable/user-guide/index.html" },
    ],
    furtherReading: [
      { title: "libpysal spatial weights", href: "https://pysal.org/libpysal/" },
      { title: "GeoDa workbook: spatial autocorrelation", href: "https://geodacenter.github.io/workbook/5a_global_auto/lab5a.html" },
    ],
  },
  "lesson-2-32": {
    estimatedTime: "170–210 minutes",
    lessonType: "Spatial Sampling-Design Studio",
    markdownFile: "content/lessons/module-2/lesson-32.md",
    formativeChecks: [
      { id: "m2-l32-design", question: "Why might stratified random sampling be preferred for the meadow frame?", options: ["It can guarantee randomised evidence within predeclared rare or important habitat strata", "It makes every unweighted mean correct", "It removes all field-access restrictions"], correctOption: 0, explanation: "Stratification protects planned representation of important groups, but selection within strata, unequal sampling fractions, frame coverage and non-response still affect inference." },
      { id: "m2-l32-access", question: "What should happen to inaccessible sampling-frame units?", options: ["Retain them with restriction reasons and state how their absence limits the target domain", "Delete them before documenting the frame", "Move them to the nearest road without a rule"], correctOption: 0, explanation: "Accessibility can be environmentally structured. Preserving excluded units allows reviewers to see where the operational frame differs from the ecological target population." },
      { id: "m2-l32-large", question: "Can many roadside convenience plots remove spatial selection bias?", options: ["No; more observations do not repair an unknown or biased inclusion mechanism", "Yes, once the sample exceeds twenty", "Yes, if all plots have valid coordinates"], correctOption: 0, explanation: "A larger convenience sample may estimate accessible roadside conditions precisely while remaining unrepresentative of wet, distant or restricted meadow conditions." },
    ],
    submissionChecklist: [...commonSpatialStatisticsChecklist, "Target population, frame, design, realised sample and QA analysis set are reconciled", "Supplementary selection preserves the complete frame, fixed seed, inclusion evidence and replacement rule"],
    rubric: spatialStatisticsRubric("Builds a reproducible probability-based supplementary design and audits frame coverage and inclusion evidence", "Connects random, systematic, stratified and clustered designs to estimands, field constraints and representativeness"),
    coreReferences: [
      { title: "US EPA: Selecting a sampling design", href: "https://www.epa.gov/quality/selecting-sampling-design" },
      { title: "US EPA: Systematic planning using data quality objectives", href: "https://www.epa.gov/quality/guidance-systematic-planning-using-data-quality-objectives-process" },
    ],
    furtherReading: [
      { title: "spcosa: spatial coverage sampling and random sampling", href: "https://cran.r-project.org/package=spcosa" },
      { title: "Spatial sampling with unequal inclusion probabilities", href: "https://doi.org/10.1002/9781118445112.stat03369.pub2" },
    ],
  },
  "lesson-2-33": {
    estimatedTime: "190–240 minutes",
    lessonType: "Geostatistical Reasoning and Validation Lab",
    markdownFile: "content/lessons/module-2/lesson-33.md",
    formativeChecks: [
      { id: "m2-l33-variogram", question: "What can contribute to a variogram nugget?", options: ["Measurement error, microscale variation and unresolved spatial support", "Only an incorrect map colour", "The number of output pixels"], correctOption: 0, explanation: "Near-origin semivariance can combine several unresolved processes. Replication and support evidence are needed before assigning it entirely to measurement error." },
      { id: "m2-l33-uncertainty", question: "What does ordinary-kriging variance represent?", options: ["Uncertainty conditional on the fitted spatial model and observation geometry", "Observed error at every unsampled pixel", "A guarantee that the variogram is correct"], correctOption: 0, explanation: "Kriging variance is model based. It can omit parameter uncertainty, trend misspecification, sampling bias and measurement-process uncertainty, so empirical spatial validation remains necessary." },
      { id: "m2-l33-validation", question: "Why use spatial blocks instead of random neighbouring holdouts?", options: ["Blocks better represent prediction into separated unsampled geography and reduce spatial leakage", "Blocks guarantee zero error", "Random splits cannot calculate RMSE"], correctOption: 0, explanation: "Nearby training observations can make random holdouts artificially easy. Separated blocks test the geographic transfer the final surface is expected to perform." },
    ],
    submissionChecklist: [...commonSpatialStatisticsChecklist, "Empirical variogram bins include pair counts and sensitivity to lag choices", "IDW and ordinary kriging use identical spatial holdouts, residual maps, uncertainty and extrapolation evidence"],
    rubric: spatialStatisticsRubric("Builds and validates deterministic and variogram-based predictions with correct units, folds and support masks", "Explains nugget, sill, range, trend, anisotropy and kriging variance as conditional model concepts"),
    coreReferences: [
      { title: "PyKrige OrdinaryKriging reference", href: "https://geostat-framework.readthedocs.io/projects/pykrige/en/stable/generated/pykrige.ok.OrdinaryKriging.html" },
      { title: "PyKrige ordinary-kriging example", href: "https://geostat-framework.readthedocs.io/projects/pykrige/en/stable/examples/00_ordinary.html" },
    ],
    furtherReading: [
      { title: "SciKit-GStat documentation", href: "https://scikit-gstat.readthedocs.io/en/latest/" },
      { title: "scikit-learn GroupKFold", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html" },
    ],
  },
  "lesson-2-34": {
    estimatedTime: "190–240 minutes",
    lessonType: "Spatial-Model Diagnosis Studio",
    markdownFile: "content/lessons/module-2/lesson-34.md",
    formativeChecks: [
      { id: "m2-l34-residual", question: "What does spatial autocorrelation in ordinary-model residuals indicate?", options: ["Unresolved spatial structure remains after the stated predictors and mean form", "The response has no relationship with any predictor", "A GWR model is automatically correct"], correctOption: 0, explanation: "Residual structure can arise from omitted variables, dependence, support mismatch, non-linearity or design. It motivates diagnosis, not one predetermined model." },
      { id: "m2-l34-families", question: "How should a spatial-lag, spatial-error, SLX or GWR family be chosen?", options: ["From a plausible hypothesis about where and how spatial structure enters the process", "From whichever coefficient has the smallest p-value", "From the model with the most colourful map"], correctOption: 0, explanation: "The families represent response interaction, correlated disturbance, neighbouring predictors or local variation. Their meaning and interpretation differ even when fit statistics are similar." },
      { id: "m2-l34-cause", question: "A spatial model finds an NDVI–biomass association. What causal claim is justified by this observational exercise?", options: ["No causal claim without additional design and assumptions; report the conditional association", "NDVI causes biomass", "Biomass causes the satellite measurement"], correctOption: 0, explanation: "Spatial adjustment can represent dependence but cannot create randomisation, temporal ordering or control all confounding. Causal language requires a separate defensible design." },
    ],
    submissionChecklist: [...commonSpatialStatisticsChecklist, "The ordinary baseline and non-spatial diagnostics precede any spatial alternative", "Model comparison uses identical separated folds and reports residual geography, stability and causal limitations"],
    rubric: spatialStatisticsRubric("Builds a correct ordinary benchmark, residual-spatial diagnostic and geographically validated alternative comparison", "Distinguishes lag, error, surrounding-predictor and local-coefficient hypotheses and their interpretations"),
    coreReferences: [
      { title: "PySAL spreg documentation", href: "https://pysal.org/spreg/" },
      { title: "PySAL spatial error model guide", href: "https://pysal.org/spreg/notebooks/16_GMM_estimation_spatial_error.html" },
    ],
    furtherReading: [
      { title: "mgwr documentation", href: "https://mgwr.readthedocs.io/en/latest/" },
      { title: "scikit-learn linear models", href: "https://scikit-learn.org/stable/modules/linear_model.html" },
    ],
  },
};

function spatialDatabaseRubric(technical: string, conceptual: string): ReviewedLessonDetails["rubric"] {
  return [
    { dimension: "Technical correctness", expectation: technical },
    { dimension: "Conceptual understanding", expectation: conceptual },
    { dimension: "Reproducibility", expectation: "Preserves immutable sources, stable identifiers, explicit query populations, schema/query versions, checksums, reconciliation evidence and safe execution context" },
    { dimension: "Scientific communication", expectation: "Explains the observation grain, spatial relationship, authority, missingness, supported use, limitations and responsible next action without overstating database integrity" },
  ];
}

const commonSpatialDatabaseChecklist = [
  "Every supplied table and geometry is identified as synthetic training evidence rather than a published Baltic field record",
  "Source, staging, authoritative, access-copy and derived-product roles remain explicit",
  "Stable keys, table grain, join cardinality, NULL policy, geometry type and SRID are declared before interpretation",
  "Source, intermediate, matched, unmatched, review and result counts are reconciled",
  "Queries are safe for a disposable authorised environment and contain no credentials or destructive production assumptions",
];

const spatialDatabaseLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-35": {
    estimatedTime: "170–210 minutes",
    lessonType: "Relational Evidence Lab",
    markdownFile: "content/lessons/module-2/lesson-35.md",
    formativeChecks: [
      { id: "m2-l35-population", question: "What does the left or starting relation contribute to a SQL analysis?", options: ["It helps declare the population available for later joins and filters", "It guarantees every row has a spatial geometry", "It chooses the scientifically correct average automatically"], correctOption: 0, explanation: "FROM and join direction establish which subjects can remain visible. The query still needs explicit filters, cardinality checks and a scientific population statement." },
      { id: "m2-l35-join", question: "Why can filtering a right-hand table in WHERE change a LEFT JOIN result?", options: ["Unmatched right-hand values are NULL and can fail the WHERE condition", "WHERE always duplicates the left table", "LEFT JOIN ignores its ON condition"], correctOption: 0, explanation: "A filter on the right-hand fields can remove the NULL rows that represented unmatched left subjects. Decide whether the condition defines eligible matches or the final population." },
      { id: "m2-l35-null", question: "What is the correct first treatment of an unrecorded biomass value?", options: ["Preserve it as NULL and report the non-missing denominator", "Convert it to zero before aggregation", "Delete the entire plot from every query"], correctOption: 0, explanation: "Missing is not measured zero. SQL aggregates may ignore NULL, so paired row and non-missing counts are required and any imputation needs a separate documented scientific rule." },
    ],
    submissionChecklist: [...commonSpatialDatabaseChecklist, "The query pack includes population, join, aggregation, unmatched-key and count-reconciliation evidence", "Every published result names its input/output grain and non-missing denominator"],
    rubric: spatialDatabaseRubric("Writes correct, explicit and reconciled SELECT, FROM, WHERE, GROUP BY and JOIN queries", "Explains how keys, cardinality, join direction and NULL semantics determine the environmental analysis population"),
    coreReferences: [
      { title: "PostgreSQL SELECT", href: "https://www.postgresql.org/docs/current/sql-select.html" },
      { title: "PostgreSQL table expressions", href: "https://www.postgresql.org/docs/current/queries-table-expressions.html" },
    ],
    furtherReading: [
      { title: "PostgreSQL joins tutorial", href: "https://www.postgresql.org/docs/current/tutorial-join.html" },
      { title: "PostgreSQL aggregate functions", href: "https://www.postgresql.org/docs/current/functions-aggregate.html" },
    ],
  },
  "lesson-2-36": {
    estimatedTime: "190–240 minutes",
    lessonType: "Spatial SQL Reasoning Lab",
    markdownFile: "content/lessons/module-2/lesson-36.md",
    formativeChecks: [
      { id: "m2-l36-srid", question: "Which statement correctly distinguishes ST_SetSRID and ST_Transform?", options: ["ST_SetSRID labels verified coordinates; ST_Transform calculates coordinates in another CRS", "Both always calculate the same reprojection", "ST_Transform only changes metadata"], correctOption: 0, explanation: "Setting an SRID changes interpretation metadata without moving coordinates. Transformation requires a known source reference and computes a new coordinate representation." },
      { id: "m2-l36-predicate", question: "A point lies exactly on a polygon boundary. What difference should you expect?", options: ["It can intersect the polygon without being within its interior", "It must be within every touching polygon", "No topological predicate can detect it"], correctOption: 0, explanation: "ST_Intersects includes shared boundary points, while ST_Within for a point requires the polygon interior under the standard topological definition. Boundary policy remains a scientific decision." },
      { id: "m2-l36-index", question: "What does a PostGIS spatial index principally provide for many predicates?", options: ["An efficient bounding-box candidate stage before exact geometry testing", "Automatic CRS correction", "Proof that the selected predicate is scientifically appropriate"], correctOption: 0, explanation: "A GiST spatial index reduces candidate comparisons for supported predicates. Exact evaluation, valid geometry, compatible reference systems and scientific semantics are still required." },
    ],
    submissionChecklist: [...commonSpatialDatabaseChecklist, "Within, intersects, distance, buffer and transformation operations state their units and boundary semantics", "GeoPandas and PostGIS results are reconciled using stable relationship pairs rather than totals alone"],
    rubric: spatialDatabaseRubric("Builds correct geometry/geography, SRID, predicate, distance, transformation and index-aware spatial SQL", "Connects each PostGIS operation to spatial support, boundary meaning, CRS units and relational cardinality"),
    coreReferences: [
      { title: "PostGIS geometry workshop", href: "https://postgis.net/workshops/postgis-intro/geometries.html" },
      { title: "PostGIS spatial indexing", href: "https://postgis.net/workshops/postgis-intro/indexing.html" },
      { title: "PostGIS projecting data", href: "https://postgis.net/workshops/postgis-intro/projection.html" },
    ],
    furtherReading: [
      { title: "PostGIS geography workshop", href: "https://postgis.net/workshops/postgis-intro/geography.html" },
      { title: "PostGIS ST_Intersects", href: "https://postgis.net/docs/ST_Intersects.html" },
    ],
  },
  "lesson-2-37": {
    estimatedTime: "180–220 minutes",
    lessonType: "Data-Architecture Decision Studio",
    markdownFile: "content/lessons/module-2/lesson-37.md",
    formativeChecks: [
      { id: "m2-l37-authority", question: "What makes an analysis snapshot different from an authoritative source?", options: ["It is a versioned access representation whose updates flow from the declared authority", "It must always use a proprietary format", "It can be edited independently and silently promoted"], correctOption: 0, explanation: "An access copy may optimise analytical reads while remaining traceable to one governed write authority. Allowing two silent masters creates unresolved conflicts and lineage loss." },
      { id: "m2-l37-partition", question: "When is partitioning scientifically and operationally defensible?", options: ["When a stable key, measured workload or lifecycle need justifies the physical split", "Whenever a table contains geometry", "When every plot can receive its own small partition"], correctOption: 0, explanation: "Partitioning should support pruning, retention or operations at justified scale. Premature or high-cardinality partitioning can increase complexity without improving representative queries." },
      { id: "m2-l37-provenance", question: "Which record best identifies a released derived spatial product?", options: ["Immutable inputs and checksums, code/environment, parameters, QA, version and responsible release", "A filename ending in final", "The time it was copied into a cloud folder"], correctOption: 0, explanation: "Provenance links the derivative to identifiable evidence and decisions. A filename or location cannot by itself reconstruct inputs, methods, quality status or responsibility." },
    ],
    submissionChecklist: [...commonSpatialDatabaseChecklist, "GeoPackage, GeoParquet, PostGIS and object-storage decisions follow declared users, writes, queries, scale and portability", "The architecture includes authority, access, migrations, least privilege, backups, restore tests, lifecycle and exit strategy"],
    rubric: spatialDatabaseRubric("Produces a coherent hybrid storage, index, partition, access, migration and recovery architecture", "Justifies technology choices from authority and scientific access patterns rather than format fashion or file size alone"),
    coreReferences: [
      { title: "GeoParquet specification", href: "https://geoparquet.org/releases/v1.1.0/" },
      { title: "PostgreSQL table partitioning", href: "https://www.postgresql.org/docs/current/ddl-partitioning.html" },
      { title: "PostgreSQL backup and restore", href: "https://www.postgresql.org/docs/current/backup.html" },
    ],
    furtherReading: [
      { title: "OGC GeoPackage standard", href: "https://www.ogc.org/standards/geopackage/" },
      { title: "GeoParquet project", href: "https://geoparquet.org/" },
    ],
  },
};

function cloudNativeRubric(technical: string, conceptual: string): ReviewedLessonDetails["rubric"] {
  return [
    { dimension: "Technical correctness", expectation: technical },
    { dimension: "Conceptual understanding", expectation: conceptual },
    { dimension: "Reproducibility", expectation: "Preserves synthetic inputs, checksums, environment, exact coordinates, stable Item–asset lineage, bounded computation, reconciled populations and versioned output evidence" },
    { dimension: "Scientific communication", expectation: "Separates catalogue, measurement, grid, mask, computation and delivery evidence from unsupported ecological inference and states a responsible next action" },
  ];
}

const commonCloudNativeChecklist = [
  "Every supplied coordinate, value, Item and asset URL is identified as synthetic training evidence rather than a published Baltic observation",
  "Dimension order, coordinates, CRS, transform, units, scale, nodata and validity meanings are recorded explicitly",
  "Candidate, accepted, review and excluded evidence is reconciled with stable IDs and reasons",
  "No credential, signed URL, private endpoint or machine-specific absolute path appears in the submission",
  "Outputs preserve source lineage, environment, checksum, limitation and responsible next-action evidence",
];

const cloudNativeLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-38": {
    estimatedTime: "150–190 minutes",
    lessonType: "Labelled-Array Reasoning Lab",
    markdownFile: "content/lessons/module-2/lesson-38.md",
    formativeChecks: [
      { id: "m2-l38-labels", question: "What does a coordinate contribute beyond a dimension name?", options: ["Labels that locate or identify positions along that dimension", "Proof that every value is scientifically valid", "Automatic reprojection into any requested CRS"], correctOption: 0, explanation: "A dimension names an axis and a coordinate labels positions on it. Accuracy, CRS provenance, units and measurement validity still require separate evidence." },
      { id: "m2-l38-crs", question: "What does rio.write_crs() do for an in-memory array with verified coordinates?", options: ["Records CRS/grid-mapping metadata without transforming coordinate values", "Reprojects all values into the CRS", "Proves the coordinates came from a surveyed location"], correctOption: 0, explanation: "Writing CRS metadata states how existing coordinates should be interpreted. Reprojection is a separate calculation and provenance is a separate evidential claim." },
      { id: "m2-l38-selection", question: "Two arrays have equal shapes but x coordinates differ by five metres. What should direct cell-wise analysis do?", options: ["Fail exact alignment and require a documented spatial decision", "Add values by position because shapes match", "Delete the x coordinates before adding"], correctOption: 0, explanation: "Equal shapes do not establish shared cell footprints. Exact coordinate checks expose the displacement so any resampling or exclusion remains deliberate and traceable." },
    ],
    submissionChecklist: [...commonCloudNativeChecklist, "Positional isel and labelled sel selections are compared and descending y order is interpreted", "The accepted, shifted and reversed-label arrays are diagnosed without silent metadata repair"],
    rubric: cloudNativeRubric("Builds and audits DataArray/Dataset structures with correct dimensions, coordinate selection, exact alignment and Rioxarray spatial metadata", "Explains why labels support scientific meaning without guaranteeing coordinate or attribute truth"),
    coreReferences: [
      { title: "Xarray data structures", href: "https://docs.xarray.dev/en/stable/user-guide/data-structures.html" },
      { title: "Xarray indexing and selecting", href: "https://docs.xarray.dev/en/stable/user-guide/indexing.html" },
      { title: "Rioxarray CRS management", href: "https://corteva.github.io/rioxarray/stable/getting_started/crs_management.html" },
    ],
    furtherReading: [
      { title: "Xarray combining data", href: "https://docs.xarray.dev/en/stable/user-guide/combining.html" },
      { title: "CF conventions", href: "https://cfconventions.org/cf-conventions/cf-conventions.html" },
    ],
  },
  "lesson-2-39": {
    estimatedTime: "170–220 minutes",
    lessonType: "EO Cube Construction Lab",
    markdownFile: "content/lessons/module-2/lesson-39.md",
    formativeChecks: [
      { id: "m2-l39-contract", question: "When do time × band × y × x dimensions form a defensible comparison cube?", options: ["When measurement, grid, time, mask and provenance contracts are satisfied", "Whenever array shapes are equal", "Whenever Xarray concatenation completes"], correctOption: 0, explanation: "Dimensional structure enables operations, but comparability depends on shared measurement semantics, exact spatial support, valid timing, masks and traceable sources." },
      { id: "m2-l39-mask", question: "A scene has five percent catalogue cloud but no local quality asset. What is the correct cube decision under the current contract?", options: ["Keep it in review because scene cloud cannot replace the required local mask", "Accept every pixel as clear", "Convert cloud percentage to a pixel mask"], correctOption: 0, explanation: "Scene-level cloud helps discovery but says where nothing about cloud occurs locally. A required pixel-quality rule needs local evidence or a separately validated replacement." },
      { id: "m2-l39-composite", question: "Why must a seasonal median be accompanied by valid-observation count?", options: ["Neighbouring cells can summarize different numbers and dates of valid observations", "Median always removes the time dimension incorrectly", "Count makes reflectance equal to biomass"], correctOption: 0, explanation: "Masking produces uneven temporal support. Count reveals part of the sampling evidence behind each composite value and supports a predeclared minimum-observation rule." },
    ],
    submissionChecklist: [...commonCloudNativeChecklist, "Grid, processing baseline, time, scaling and local-mask eligibility are checked before stacking", "The seasonal summary, valid count and contributing source IDs are delivered together"],
    rubric: cloudNativeRubric("Builds an aligned labelled cube, applies scaling and local masks before aggregation, and produces correct seasonal summaries and counts", "Explains a data cube as a comparability contract and a composite as a multi-date statistic with uneven support"),
    coreReferences: [
      { title: "Xarray indexing and selecting", href: "https://docs.xarray.dev/en/stable/user-guide/indexing.html" },
      { title: "Xarray computation", href: "https://docs.xarray.dev/en/stable/user-guide/computation.html" },
      { title: "Xarray weather and climate guide", href: "https://docs.xarray.dev/en/stable/user-guide/weather-climate.html" },
    ],
    furtherReading: [
      { title: "Open Data Cube documentation", href: "https://opendatacube.readthedocs.io/en/latest/" },
      { title: "OGC API Coverages", href: "https://ogcapi.ogc.org/coverages/" },
    ],
  },
  "lesson-2-40": {
    estimatedTime: "160–210 minutes",
    lessonType: "Bounded-Computation Planning Lab",
    markdownFile: "content/lessons/module-2/lesson-40.md",
    formativeChecks: [
      { id: "m2-l40-lazy", question: "Which action normally crosses from a lazy Xarray/Dask plan to in-memory values?", options: ["Calling compute() on the selected result", "Inspecting dimension names", "Reading the declared overall shape"], correctOption: 0, explanation: "Lazy metadata and graphs describe work. Compute executes the graph and materialises the requested result, so it should follow deliberate spatial, temporal and variable bounds." },
      { id: "m2-l40-chunks", question: "What is the strongest starting principle for chunk design?", options: ["Fit memory while aligning with storage and the dominant access pattern, then benchmark", "Use the smallest possible chunk", "Store the entire cube as one chunk"], correctOption: 0, explanation: "Chunk design balances task overhead, working memory, request amplification and calculation shape. No single chunk size is optimal for every workload or system." },
      { id: "m2-l40-memory", question: "Why is compressed object size insufficient for a memory plan?", options: ["Chunks are decoded in memory and calculations may hold masks, outputs and intermediates", "Compression always increases every value", "Dask cannot read compressed storage"], correctOption: 0, explanation: "Working memory follows decoded dtype, chunk concurrency and temporary arrays. Stored compression affects transfer and disk size but does not cap the execution footprint." },
    ],
    submissionChecklist: [...commonCloudNativeChecklist, "Full-array, chunk and conservative concurrent working-set estimates include formulas and units", "A bounded lazy result is compared with a trusted eager calculation before performance acceptance"],
    rubric: cloudNativeRubric("Calculates memory and chunk evidence correctly, keeps selection lazy and computes a bounded validated result", "Explains task graphs, storage/Dask chunks, eager boundaries, rechunking costs and workload-dependent tradeoffs"),
    coreReferences: [
      { title: "Dask array best practices", href: "https://docs.dask.org/en/stable/array-best-practices.html" },
      { title: "Dask array chunks", href: "https://docs.dask.org/en/stable/array-chunks.html" },
      { title: "Xarray with Dask", href: "https://docs.xarray.dev/en/stable/user-guide/dask.html" },
    ],
    furtherReading: [
      { title: "Dask diagnostics", href: "https://docs.dask.org/en/stable/diagnostics-local.html" },
      { title: "Xarray scaling with Dask", href: "https://docs.xarray.dev/en/stable/user-guide/dask.html#optimization-tips" },
    ],
  },
  "lesson-2-41": {
    estimatedTime: "170–220 minutes",
    lessonType: "Cloud-Format Decision Studio",
    markdownFile: "content/lessons/module-2/lesson-41.md",
    formativeChecks: [
      { id: "m2-l41-selective", question: "What makes a cloud-native format useful for a bounded query?", options: ["Layout, service and client together retrieve only relevant ranges or chunks", "The filename contains cloud", "The complete file is copied to every client first"], correctOption: 0, explanation: "Selective access needs organised independent pieces, locatable metadata, a capable delivery service and a compatible client. The extension alone proves none of these." },
      { id: "m2-l41-formats", question: "Which is the stronger starting match for a labelled time × band × y × x analysis cube?", options: ["A versioned and compatible Zarr layout designed for the access pattern", "A screenshot embedded in a PDF", "An ordinary striped TIFF renamed as COG"], correctOption: 0, explanation: "Zarr represents chunked n-dimensional arrays directly, but its version, chunks, codecs, metadata and intended readers still require explicit validation." },
      { id: "m2-l41-validation", question: "A GeoTIFF is tiled and served over HTTPS. Can it be accepted as a COG?", options: ["Not yet; validate the complete COG organisation and actual range-serving path", "Yes; HTTPS alone proves conformance", "Yes; every tiled TIFF has suitable overviews and directory order"], correctOption: 0, explanation: "Tiling and HTTPS are partial evidence. COG acceptance also requires conformant georeferenced file structure, overview/layout checks and a serving route capable of bounded byte ranges." },
    ],
    submissionChecklist: [...commonCloudNativeChecklist, "Every COG claim separates internal conformance, byte-range service, client and result evidence", "Every Zarr decision records version, chunks, codecs, metadata strategy, request pattern, compatibility and immutable publication"],
    rubric: cloudNativeRubric("Audits COG and Zarr structure, delivery and compatibility evidence and matches validated outputs to declared access patterns", "Explains tiles, overviews, ranges, chunks, codecs and versioning without treating operational units as ecological support"),
    coreReferences: [
      { title: "OGC Cloud Optimized GeoTIFF standard", href: "https://docs.ogc.org/is/21-026/21-026.html" },
      { title: "Zarr v3 core specification", href: "https://zarr-specs.readthedocs.io/en/latest/v3/core/v3.0.html" },
      { title: "GDAL COG driver", href: "https://gdal.org/en/stable/drivers/raster/cog.html" },
    ],
    furtherReading: [
      { title: "Zarr specifications", href: "https://zarr-specs.readthedocs.io/en/latest/" },
      { title: "OGC COG and Zarr evaluation", href: "https://docs.ogc.org/per/21-032.html" },
    ],
  },
  "lesson-2-42": {
    estimatedTime: "170–220 minutes",
    lessonType: "Reproducible EO Discovery Lab",
    markdownFile: "content/lessons/module-2/lesson-42.md",
    formativeChecks: [
      { id: "m2-l42-model", question: "What is a STAC Item?", options: ["A GeoJSON Feature describing one spatiotemporal entity and linking its assets", "A complete cloud storage service", "A guarantee that every linked pixel is valid"], correctOption: 0, explanation: "The Item is STAC's atomic spatiotemporal metadata unit. Its Assets link resources, while scientific fitness still depends on product, coverage, quality and grid review." },
      { id: "m2-l42-assets", question: "An Item's visual asset and reflectance asset both show the scene. Which should enter quantitative analysis?", options: ["The measurement asset whose role, bands, scaling and processing are verified", "Whichever downloads first", "The visual asset because its colours look natural"], correctOption: 0, explanation: "Rendered visual assets may be stretched or encoded for display. Quantitative use requires the product asset with documented measurement semantics, scaling and quality evidence." },
      { id: "m2-l42-reproducibility", question: "What should be preserved instead of an expiring signed asset URL?", options: ["Endpoint, Item ID, asset key, exact query, retrieval time and approved resolution process", "The secret signature in a public notebook", "Only a screenshot of the search results"], correctOption: 0, explanation: "Stable identifiers and the discovery contract support future URL resolution without leaking temporary access material. A metadata snapshot also records what the service returned." },
    ],
    submissionChecklist: [...commonCloudNativeChecklist, "The query records endpoint or fixture, conformance, Collection, bbox/intersects, UTC interval, filters, pagination and result count", "The Item–asset inventory separates scene discovery properties from local quality, grid and format validation"],
    rubric: cloudNativeRubric("Builds and reconciles a bounded STAC Item–asset inventory with correct spatial, temporal, pagination and role handling", "Distinguishes Catalog, Collection, Item, Asset, static catalogue and API search and explains why discovery is not scientific acceptance"),
    coreReferences: [
      { title: "STAC specification overview", href: "https://stacspec.org/en/about/stac-spec/" },
      { title: "STAC API Item Search specification", href: "https://api.stacspec.org/v1.0.0/item-search/" },
      { title: "STAC API Core specification", href: "https://api.stacspec.org/v1.0.0/core/" },
    ],
    furtherReading: [
      { title: "STAC tutorials", href: "https://stacspec.org/en/tutorials/" },
      { title: "PySTAC Client usage", href: "https://pystac-client.readthedocs.io/en/stable/usage.html" },
    ],
  },
};

function webDeliveryRubric(technical: string, conceptual: string): ReviewedLessonDetails["rubric"] {
  return [
    { dimension: "Technical correctness", expectation: technical },
    { dimension: "Conceptual understanding", expectation: conceptual },
    { dimension: "Reproducibility", expectation: "Preserves synthetic inputs, checksums, environment, public schema, stable IDs, versions/conformance, bounded requests, map–table reconciliation and release evidence" },
    { dimension: "Scientific communication", expectation: "Answers one audience question accessibly while distinguishing evidence status, portrayal, measured values, synthetic location and unsupported ecological conclusions" },
  ];
}

const commonWebDeliveryChecklist = [
  "Every site, coordinate, value and endpoint is identified as synthetic training evidence rather than real monitoring",
  "Audience, question, permitted public fields, forbidden content, data date and limitations are explicit",
  "Map, table and service records reconcile through stable IDs and preserve missing values",
  "No credential, token, cookie, signed URL, private endpoint or machine-specific path reaches the deliverable",
  "Required source, licence, attribution, version/conformance, CRS and responsible next action are recorded",
];

const webDeliveryLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-43": {
    estimatedTime: "170–220 minutes",
    lessonType: "Web-Delivery Architecture Lab",
    markdownFile: "content/lessons/module-2/lesson-43.md",
    formativeChecks: [
      { id: "m2-l43-representation", question: "A manager needs consistent cartography while an analyst needs reflectance values. What is the correct delivery distinction?", options: ["Use a rendered map for portrayal and a validated coverage/COG route for measured values", "Let both sample WMS pixel colours", "Send the full analysis cube to every browser"], correctOption: 0, explanation: "Portrayal and measurement support different operations. A WMS or raster tile can communicate style, while quantitative work needs the governed raster values and metadata." },
      { id: "m2-l43-bounded", question: "When is one GeoJSON response a defensible delivery for this chapter?", options: ["For the six allow-listed generalized sites after count, schema, CRS and payload checks", "For every national polygon regardless of size", "Whenever fields are hidden from the popup"], correctOption: 0, explanation: "A compact, reviewed FeatureCollection can be simple and transparent. Larger or sensitive layers need server-side bounds, pagination, simplification or tiles and the same public-schema controls." },
      { id: "m2-l43-governance", question: "Does omitting an internal field from the map popup prevent public disclosure?", options: ["No; remove it from the delivered payload through an explicit allow-list", "Yes; users can access only visible popups", "Yes; vector tiles and GeoJSON cannot be inspected"], correctOption: 0, explanation: "Browser-delivered data can be inspected independently of the interface. Privacy and governance controls must act before serialization or service response." },
    ],
    submissionChecklist: [...commonWebDeliveryChecklist, "WMS, WFS, WMTS, XYZ, vector tile, GeoJSON, COG/coverage and STAC roles are compared by user need", "Response, paging/zoom, cache/freshness, privacy, failure and migration thresholds are documented"],
    rubric: webDeliveryRubric("Designs a bounded delivery architecture with correct service/representation, CRS, payload, caching, public-schema and fallback decisions", "Distinguishes authority, service and client and explains portrayal, feature, tile, coverage and discovery roles"),
    coreReferences: [
      { title: "OGC Web Map Service standard", href: "https://www.ogc.org/standards/wms/" },
      { title: "OGC Web Feature Service standard", href: "https://www.ogc.org/standards/wfs/" },
      { title: "OGC Web Map Tile Service standard", href: "https://www.ogc.org/standards/wmts/" },
      { title: "OGC Web Coverage Service standard", href: "https://www.ogc.org/standards/wcs/" },
    ],
    furtherReading: [
      { title: "OGC API Features standard", href: "https://www.ogc.org/standards/ogcapi-features/" },
      { title: "RFC 7946 GeoJSON", href: "https://www.rfc-editor.org/rfc/rfc7946" },
    ],
  },
  "lesson-2-44": {
    estimatedTime: "190–240 minutes",
    lessonType: "Accessible Interactive-Map Studio",
    markdownFile: "content/lessons/module-2/lesson-44.md",
    formativeChecks: [
      { id: "m2-l44-purpose", question: "Which interaction is essential for the programme-manager question?", options: ["Select a site to read text status, valid count, date and limitation", "Automatic 3-D rotation", "A long list of decorative basemaps"], correctOption: 0, explanation: "Selection discloses the evidence needed to judge a site's status. Interaction is justified by the audience question, not by the number of available library plugins." },
      { id: "m2-l44-accessibility", question: "What makes the six-site result available when a user cannot operate or perceive the map?", options: ["An equivalent labelled table and concise text summary", "A tooltip that appears only on hover", "A colour legend without words"], correctOption: 0, explanation: "The table and summary preserve key records and conclusions outside spatial interaction. Keyboard routes, text status and map instructions still improve the map itself." },
      { id: "m2-l44-handover", question: "PUB_D has no eligible observations. How should the public delivery represent median NIR?", options: ["Not available, with the no-eligible-observation reason", "0.00", "Remove PUB_D from both map and table"], correctOption: 0, explanation: "Missing evidence is not a measured zero. Keeping the site and its reason preserves the complete public population and prevents false interpretation." },
    ],
    submissionChecklist: [...commonWebDeliveryChecklist, "The final map includes a question, method, complete text legend, selection evidence, provenance, fallback and equivalent table", "Keyboard, touch, 320, 375, tablet, desktop, payload, privacy and failed-service behaviour are manually recorded"],
    rubric: webDeliveryRubric("Builds a reconciled, responsive and resilient interactive map with correct GeoJSON, missingness, status styling, public fields and alternative content", "Explains interaction as evidence disclosure and distinguishes evidence sufficiency from NIR magnitude and ecological condition"),
    coreReferences: [
      { title: "Folium GeoJSON guide", href: "https://python-visualization.github.io/folium/latest/user_guide/geojson.html" },
      { title: "Folium layer controls", href: "https://python-visualization.github.io/folium/latest/user_guide/ui_elements/layer_control.html" },
      { title: "Web Content Accessibility Guidelines 2.2", href: "https://www.w3.org/TR/WCAG22/" },
    ],
    furtherReading: [
      { title: "MapLibre GL JS documentation", href: "https://maplibre.org/maplibre-gl-js/docs/" },
      { title: "MapLibre keyboard handler", href: "https://maplibre.org/maplibre-gl-js/docs/API/classes/KeyboardHandler/" },
    ],
  },
  "lesson-2-45": {
    estimatedTime: "180–230 minutes",
    lessonType: "Interoperability Verification Lab",
    markdownFile: "content/lessons/module-2/lesson-45.md",
    formativeChecks: [
      { id: "m2-l45-contract", question: "What is the strongest evidence that two systems interoperate for one task?", options: ["A bounded versioned request produces a validated response preserving required meaning", "Both products display an OGC logo", "One client opened one layer once"], correctOption: 0, explanation: "Interoperability is behaviour at a declared boundary. The test must cover operation, version/class, CRS, representation, identifiers, counts and meaning required by the client." },
      { id: "m2-l45-conformance", question: "The fixture declares OGC API Features Core and GeoJSON. Does that prove advanced attribute filtering?", options: ["No; filtering needs its own declared conformance and queryable evidence", "Yes; Core includes every future part", "Yes; every JSON API supports the same filter syntax"], correctOption: 0, explanation: "OGC API standards are modular. Clients must inspect exact conformance classes and Collection/queryable resources rather than infer optional capabilities from Core." },
      { id: "m2-l45-acceptance", question: "A page reports six matched features, three returned and a next link. What is the correct acceptance action?", options: ["Follow the declared paging relation within the bounded query and reconcile all six IDs", "Treat the first three as the full population", "Invent an offset URL without reading the link"], correctOption: 0, explanation: "Partial pages are normal service behaviour. Reproducible clients follow advertised links and verify final counts and stable identifiers." },
    ],
    submissionChecklist: [...commonWebDeliveryChecklist, "WMS/WFS/WCS/WMTS and relevant OGC API roles are tested with exact versions, operations/classes and expected representations", "CRS/axis, media type, pagination, stable IDs, client matrix, auth, errors and STAC/COG relationships have positive and negative acceptance tests"],
    rubric: webDeliveryRubric("Produces correct capability/conformance, paging, CRS, format, identifier and client acceptance evidence across the required standards", "Explains interoperability as verified behaviour and relates portrayal, feature, coverage, tile, catalogue and asset responsibilities"),
    coreReferences: [
      { title: "OGC API Features Part 1 Core", href: "https://docs.ogc.org/is/17-069r4/17-069r4.html" },
      { title: "OGC API standards overview", href: "https://ogcapi.ogc.org/" },
      { title: "OGC standards catalogue", href: "https://www.ogc.org/standards/" },
    ],
    furtherReading: [
      { title: "OGC API Common user guide", href: "https://docs.ogc.org/guides/20-071.html" },
      { title: "STAC API community standard", href: "https://docs.ogc.org/cs/25-005/25-005.html" },
    ],
  },
};

function professionalEcosystemRubric(technical: string, conceptual: string): ReviewedLessonDetails["rubric"] {
  return [
    { dimension: "Technical correctness", expectation: technical },
    { dimension: "Conceptual understanding", expectation: conceptual },
    { dimension: "Reproducibility", expectation: "Preserves synthetic source evidence, checksums, versions, privileges, parameters, scientific invariants, exact/tolerant comparison tests, authority and migration evidence" },
    { dimension: "Scientific communication", expectation: "Issues a bounded conditional architecture decision without product advocacy, invented capability, unsupported cost or claims that visual agreement proves scientific equivalence" },
  ];
}

const commonProfessionalEcosystemChecklist = [
  "Every organisation, environment, licence, service, requirement and result is identified as synthetic training evidence unless separately verified",
  "Scientific invariants are defined before products and include IDs, CRS, grid, scaling, nodata, spatial support, eligibility, missingness, provenance and acceptance thresholds",
  "Desktop, automation, authority, service, identity, public delivery, operations, recovery and migration roles have explicit owners",
  "Product version, service review date, user type, extension, privilege and runtime evidence are recorded or honestly marked unverified",
  "No licence key, credential, private endpoint, confidential architecture detail, personal information or sensitive coordinate enters the deliverable",
  "ArcGIS and open implementations are compared by scientific contract and bounded tests rather than feature count or visual similarity",
];

const professionalEcosystemLessonConfigurations: Record<string, PublishedLessonConfiguration> = {
  "lesson-2-46": {
    estimatedTime: "210–270 minutes",
    lessonType: "Professional GIS Architecture Studio",
    markdownFile: "content/lessons/module-2/lesson-46.md",
    formativeChecks: [
      { id: "m2-l46-contract", question: "An ArcPy workflow and a GeoPandas/Rasterio workflow use different functions. What must remain the same?", options: ["The declared scientific inputs, method parameters, invariants and acceptance evidence", "The source-code text and file extension", "The colour of the final map only"], correctOption: 0, explanation: "Implementations may differ while the scientific contract remains stable. Equivalence is established through IDs, grids, values, missingness, provenance and predeclared comparison rules." },
      { id: "m2-l46-roles", question: "Which statement correctly distinguishes ArcGIS Online and ArcGIS Enterprise?", options: ["Online is provider-operated cloud GIS; Enterprise is organisation-operated software whose infrastructure and recovery responsibilities must be allocated", "Online is always public and Enterprise is always private", "They are interchangeable names for ArcGIS Pro"], correctOption: 0, explanation: "Both can support governed organisational content, but their operating responsibilities differ. Security still depends on identity, sharing, services, data and configuration rather than the product label." },
      { id: "m2-l46-decision", question: "Two maps look identical after a GeoPackage exchange. What is the next acceptance action?", options: ["Compare stable IDs, types, nulls, categories, CRS, geometry, relationships, values and provenance under a round-trip contract", "Accept because the colours match", "Assume every open format preserves all geodatabase behaviour"], correctOption: 0, explanation: "Rendering is only one representation. A receiving client can silently alter types, domains, dates, missingness, geometry or relationships while still drawing a plausible map." },
    ],
    submissionChecklist: [...commonProfessionalEcosystemChecklist, "ArcGIS Pro, geodatabase, ModelBuilder, ArcPy, ArcGIS Online and ArcGIS Enterprise roles are accurate and bounded", "Authority, sharing, anonymous permissions, offline conflict, monitoring, backup/restore, licence review and exit tests produce one conditional decision"],
    rubric: professionalEcosystemRubric("Designs and verifies a coherent role-based ArcGIS, open or hybrid architecture with correct authorities, sharing controls, equivalence gates, operations and migration tests", "Explains implementation versus scientific contract, Online versus Enterprise, visual versus executable orchestration and data versus semantic/method/operational portability"),
    coreReferences: [
      { title: "ArcGIS Pro documentation", href: "https://pro.arcgis.com/en/pro-app/latest/help/main/welcome-to-the-arcgis-pro-app-help.htm" },
      { title: "Introduction to ArcPy", href: "https://pro.arcgis.com/en/pro-app/latest/arcpy/get-started/what-is-arcpy-.htm" },
      { title: "What is ModelBuilder?", href: "https://pro.arcgis.com/en/pro-app/latest/help/analysis/geoprocessing/modelbuilder/what-is-modelbuilder-.htm" },
      { title: "Types of geodatabases", href: "https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/overview/types-of-geodatabases.htm" },
    ],
    furtherReading: [
      { title: "Introduction to ArcGIS Online", href: "https://doc.arcgis.com/en/arcgis-online/get-started/what-is-agol.htm" },
      { title: "Introduction to ArcGIS Enterprise", href: "https://enterprise.arcgis.com/en/get-started/latest/windows/what-is-arcgis-enterprise-.htm" },
      { title: "ArcGIS Pro OGC API service support", href: "https://pro.arcgis.com/en/pro-app/latest/help/data/services/use-ogc-api-services.htm" },
    ],
  },
};

export const MODULE2_SOFTWARE_VERSIONS = {
  python: "3.12.13",
  numpy: "2.4.2",
  rasterio: "1.4.4",
  pandas: "2.2.3",
  geopandas: "1.1.4",
  shapely: "2.1.2",
  pyproj: "3.7.2",
  qgis: "3.44 LTR",
} as const;

function module2TestedVersions(includeQgis: boolean, includeRaster = false) {
  return [
    { label: "pandas", value: MODULE2_SOFTWARE_VERSIONS.pandas },
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
    const configuration = publishedLessonConfigurations[source.id]
      ?? uavLessonConfigurations[source.id]
      ?? satelliteLessonConfigurations[source.id]
      ?? spatialStatisticsLessonConfigurations[source.id]
      ?? spatialDatabaseLessonConfigurations[source.id]
      ?? cloudNativeLessonConfigurations[source.id]
      ?? webDeliveryLessonConfigurations[source.id]
      ?? professionalEcosystemLessonConfigurations[source.id];
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
            source.id === "lesson-2-10" || source.chapter === 3 || source.chapter === 4 || source.chapter === 5 || source.chapter === 10,
            source.chapter === 3 || source.chapter === 4 || source.chapter === 5 || source.chapter === 8,
          ),
          reviewDate: "11 August 2026",
          datasetCitation: source.chapter === 4
            ? "Synthetic UAV and Photogrammetry training pack, CC0-1.0; ecological context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250"
            : source.chapter === 5
              ? "Synthetic Satellite Earth Observation training pack, CC0-1.0; ecological context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250"
              : source.chapter === 6
                ? "Synthetic Spatial Statistics and Geostatistics training pack, CC0-1.0; ecological context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250"
                : source.chapter === 7
                  ? "Synthetic Spatial Databases training pack, CC0-1.0; ecological context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250"
                  : source.chapter === 8
                    ? "Synthetic Multidimensional and Cloud-Native EO training pack, CC0-1.0; ecological context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250"
                    : source.chapter === 9
                      ? "Synthetic Web GIS and Delivery training pack, CC0-1.0; ecological context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250"
                      : source.chapter === 10
                        ? "Synthetic Professional GIS Ecosystems training pack, CC0-1.0; no real organisations, licences, services or sensitive locations"
                : "Baltic coastal plant traits 2024, Zenodo record 20083250, https://doi.org/10.5281/zenodo.20083250",
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
    totalPositions: 10,
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
    totalPositions: 10,
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
    totalPositions: 10,
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
  "module-2-chapter-4-practicum": {
    estimatedTime: "420–600 minutes",
    lessonType: "Chapter Practicum",
    position: 4,
    totalPositions: 10,
    markdownFile: "content/lessons/module-2/practicum-04.md",
    formativeChecks: [
      {
        id: "m2-p4-gsd",
        question: "The calculated nominal GSD is 2.19 cm. What can the final report claim from that value alone?",
        options: [
          "Only the approximate image sampling distance under the stated geometry and assumptions",
          "The orthomosaic is horizontally accurate to 2.19 cm",
          "Every 2.19 cm object can be detected",
        ],
        correctOption: 0,
        explanation: "GSD is a nominal sampling description. Effective resolution, feature detection and absolute position require optical, processing and independent validation evidence.",
      },
      {
        id: "m2-p4-radiometry",
        question: "The Red Edge values resemble reflectance multiplied by 10000, but no authoritative scale is supplied. What is required?",
        options: [
          "Keep quantitative Red Edge derivatives blocked and request verified product metadata",
          "Divide by 10000 because the pattern is familiar",
          "Normalise each image independently to make it look similar",
        ],
        correctOption: 0,
        explanation: "A familiar numeric range is not measurement metadata. Blocking the derivative preserves scientific integrity and makes the missing evidence actionable.",
      },
      {
        id: "m2-p4-checkpoints",
        question: "Why must the large south-east check-point residual remain in the assessment?",
        options: [
          "It may reveal local block deformation that directly affects analysis in that region",
          "It should be removed because it increases RMSE",
          "Control-point residuals already prove the edge is correct",
        ],
        correctOption: 0,
        explanation: "Independent check points are intended to reveal external error. A difficult regional residual is evidence to investigate, map and connect to intended support.",
      },
    ],
    submissionChecklist: [
      "All seventeen practicum requirements and ten delivery files are complete",
      "Mission geometry and radiometric evidence are calculated from transparent inputs",
      "Control, internal reprojection and withheld check-point evidence remain distinct",
      "Orthomosaic, DSM, band alignment, NoData and scale defects are all located and classified",
      "Only accepted bands enter safe indices and spatial extraction",
      "The report gives product- and region-specific acceptable, review or unsuitable decisions",
      "All twenty professional mistakes are considered against the handover",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Completes mission, residual, raster, radiometric, index and extraction calculations accurately" },
      { dimension: "Conceptual understanding", expectation: "Explains the full acquisition-to-product chain and keeps every evidence type within its limits" },
      { dimension: "Reproducibility", expectation: "Delivers immutable inputs, checksums, versions, manifests, reopen checks and traceable decisions" },
      { dimension: "Scientific communication", expectation: "Produces an actionable UAV report with spatial/temporal support, consequences, limitations and next actions" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(true, true),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic UAV and Photogrammetry training pack, CC0-1.0; no real imagery or field locations",
      coreReferences: [
        { title: "ASPRS Positional Accuracy Standards", href: "https://www.asprs.org/divisions-committees/standards" },
        { title: "OpenDroneMap documentation", href: "https://docs.opendronemap.org/" },
        { title: "Rasterio georeferencing", href: "https://rasterio.readthedocs.io/en/stable/topics/georeferencing.html" },
      ],
      furtherReading: [
        { title: "Agisoft Metashape user manual", href: "https://www.agisoft.com/downloads/user-manuals/" },
        { title: "QGIS raster properties", href: "https://docs.qgis.org/3.44/en/docs/user_manual/working_with_raster/raster_properties.html" },
      ],
    },
  },
  "module-2-chapter-5-practicum": {
    estimatedTime: "420–540 minutes",
    lessonType: "Chapter Practicum",
    position: 5,
    totalPositions: 10,
    markdownFile: "content/lessons/module-2/practicum-05.md",
    formativeChecks: [
      {
        id: "m2-p5-convergence",
        question: "Optical greenness and SAR backscatter both increase. Is the ecological cause established?",
        options: [
          "No; record convergence in signals, then test competing explanations with field and acquisition evidence",
          "Yes; two sensors always prove biomass",
          "Yes, because optical and SAR measure the same quantity",
        ],
        correctOption: 0,
        explanation: "Independent signals can strengthen a hypothesis, but their different physical responses and confounders remain. Convergence is evidence to interpret, not automatic causal proof.",
      },
      {
        id: "m2-p5-support",
        question: "Can a 10 m optical pixel, a 20 m red-edge pixel and a LiDAR footprint be compared as identical observations?",
        options: [
          "No; comparison needs an explicit common support or a model that preserves their different supports",
          "Yes; every row in a table has equal support",
          "Yes, after renaming all columns",
        ],
        correctOption: 0,
        explanation: "Cross-sensor evidence represents different ground footprints and sampling designs. A common table does not remove spatial-support differences or create missing coverage.",
      },
      {
        id: "m2-p5-release",
        question: "One sensor fails its QA gate. What belongs in the final evidence package?",
        options: [
          "The blocked layer, reason, consequence and action—excluded from unsupported analysis",
          "A silently corrected value",
          "Only the sensors that produced attractive maps",
        ],
        correctOption: 0,
        explanation: "A professional package preserves failures as decision evidence. Exclusion must be traceable so another analyst can understand, reproduce and revisit the decision.",
      },
    ],
    submissionChecklist: [
      "All nine practicum deliverables are present and open successfully",
      "Every sensor has a documented measurement meaning, spatial support and QA gate",
      "Scaling, masks, SAR geometry, spectral screening and vertical-reference decisions are traceable",
      "Blocked observations remain in the manifest with reasons rather than being silently removed",
      "Cross-sensor agreement and disagreement are both interpreted without claiming causal proof",
      "The final report separates observation, derivative, interpretation, uncertainty and next action",
      "All professional satellite-Earth-Observation mistakes are considered before release",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Builds valid optical, index, SAR, spectral and structural evidence with appropriate masks and transformations" },
      { dimension: "Conceptual understanding", expectation: "Explains sensor-specific measurement physics and preserves different spatial and temporal supports" },
      { dimension: "Reproducibility", expectation: "Delivers immutable inputs, manifest, checksums, code, QA tables, versions and traceable decisions" },
      { dimension: "Scientific communication", expectation: "Produces a concise evidence package that distinguishes convergence, disagreement, limitations and next work" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(true, true),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic Satellite Earth Observation training pack, CC0-1.0; no real satellite observations or field locations",
      coreReferences: [
        { title: "Sentinel-2 products", href: "https://sentiwiki.copernicus.eu/web/s2-products" },
        { title: "Sentinel-1 processing", href: "https://sentiwiki.copernicus.eu/web/s1-processing" },
        { title: "ASPRS LAS specification", href: "https://www.asprs.org/wp-content/uploads/2021/04/LAS_latest.pdf" },
      ],
      furtherReading: [
        { title: "NASA EMIT data tutorials", href: "https://earth.jpl.nasa.gov/emit/events/4/emit-data-tutorial-series/" },
        { title: "USGS Landsat Collection 2 Level-2 products", href: "https://www.usgs.gov/landsat-missions/landsat-collection-2-level-2-science-products" },
      ],
    },
  },
  "module-2-chapter-6-practicum": {
    estimatedTime: "420–540 minutes",
    lessonType: "Chapter Practicum",
    position: 6,
    totalPositions: 10,
    markdownFile: "content/lessons/module-2/practicum-06.md",
    formativeChecks: [
      {
        id: "m2-p6-target",
        question: "What must be declared before building a spatial prediction surface?",
        options: [
          "The target population, observation support, prediction use and accepted analysis evidence",
          "Only the preferred colour palette",
          "A requirement that every grid cell receive a value",
        ],
        correctOption: 0,
        explanation: "Interpolation is meaningful only for a defined variable, domain, support and use. A complete grid is not evidence that every location is supported by observations.",
      },
      {
        id: "m2-p6-weights",
        question: "Three scientifically plausible weights definitions produce different Moran results. What should be released?",
        options: [
          "The complete sensitivity result and an evidence-based primary definition",
          "Only the definition with the smallest permutation probability",
          "The average p-value without the weights",
        ],
        correctOption: 0,
        explanation: "The disagreement is evidence that inference depends on the relationship model. Reporting all predeclared definitions prevents outcome-driven weights selection.",
      },
      {
        id: "m2-p6-release",
        question: "A smooth interpolation has low random-split error but poor separated-block validation. What is the correct decision?",
        options: [
          "Restrict or block release because intended geographic transfer is not validated",
          "Publish because the map is smooth",
          "Report only random-split error",
        ],
        correctOption: 0,
        explanation: "Random neighbouring holdouts can leak spatial similarity. Separated blocks better represent prediction into unsampled geography, so their failure must govern the release decision.",
      },
    ],
    submissionChecklist: [
      "All nine practicum deliverables are present and open successfully",
      "Population, frame, realised sample, QA analysis set and inclusion evidence are reconciled",
      "Weights definitions, transformations, islands, edges, permutations and sensitivity results are traceable",
      "IDW and kriging use the same separated validation geography and expose uncertainty and extrapolation",
      "The regression baseline precedes a process-justified spatial alternative and retains causal limitations",
      "The map distinguishes observations, model predictions, empirical errors, model uncertainty and unsupported areas",
      "All professional spatial-statistics and geostatistics mistakes are considered before release",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Calculates and validates sampling, weights, autocorrelation, interpolation and residual diagnostics with compatible units and rows" },
      { dimension: "Conceptual understanding", expectation: "Connects spatial design, dependence, continuity and regression alternatives to distinct scientific assumptions" },
      { dimension: "Reproducibility", expectation: "Delivers immutable inputs, checksums, seeds, frame, parameters, folds, code and traceable exclusions" },
      { dimension: "Scientific communication", expectation: "Issues a bounded release decision that separates pattern, prediction, uncertainty, extrapolation and unsupported causation" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(false, false),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic Spatial Statistics and Geostatistics training pack, CC0-1.0; no real field observations or locations",
      coreReferences: [
        { title: "PySAL esda user guide", href: "https://pysal.org/esda/stable/user-guide/index.html" },
        { title: "US EPA sampling-design guidance", href: "https://www.epa.gov/quality/selecting-sampling-design" },
        { title: "PyKrige OrdinaryKriging reference", href: "https://geostat-framework.readthedocs.io/projects/pykrige/en/stable/generated/pykrige.ok.OrdinaryKriging.html" },
      ],
      furtherReading: [
        { title: "PySAL spreg documentation", href: "https://pysal.org/spreg/" },
        { title: "scikit-learn grouped cross-validation", href: "https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-iterators-for-grouped-data" },
      ],
    },
  },
  "module-2-chapter-7-practicum": {
    estimatedTime: "360–480 minutes",
    lessonType: "Chapter Practicum",
    position: 7,
    totalPositions: 10,
    markdownFile: "content/lessons/module-2/practicum-07.md",
    formativeChecks: [
      {
        id: "m2-p7-integrity",
        question: "A CSV imports without an error. What must happen before it becomes a curated database table?",
        options: [
          "Reconcile counts and validate keys, references, types, ranges, missingness and geometry",
          "Rename the table final and grant all analysts write access",
          "Assume the database converted every field correctly",
        ],
        correctOption: 0,
        explanation: "Execution proves only that the import mechanism accepted something. Promotion needs traceable source identity, validation, rejected-row evidence and an atomic decision.",
      },
      {
        id: "m2-p7-predicate",
        question: "P012 intersects two zones and is within neither interior. What is the defensible database result?",
        options: [
          "Retain both candidate relationships and mark the final assignment for boundary review",
          "Choose the first zone returned by the database",
          "Increase a buffer until only one zone remains",
        ],
        correctOption: 0,
        explanation: "Database order and outcome-tuned tolerance are not management evidence. Preserving candidates and review status keeps the spatial fact separate from the assignment policy.",
      },
      {
        id: "m2-p7-architecture",
        question: "What is the strongest basis for a hybrid spatial-data architecture?",
        options: [
          "One authority per data class with storage chosen for updates, queries, scale, portability and governance",
          "Store every object in the technology with the most features",
          "Allow every exported copy to become an independent master",
        ],
        correctOption: 0,
        explanation: "Hybrid designs are effective when transactional records, immutable objects, analytical snapshots and deliveries have explicit roles and one controlled update path.",
      },
    ],
    submissionChecklist: [
      "All fifteen deliverables are present, open successfully and contain no credentials",
      "Every source checksum, row count, table grain, key, status, geometry type and SRID is reconciled",
      "Relational query results retain unmatched records, NULL policy and distinct observational denominators",
      "Spatial query results expose within/intersects boundary semantics and reconcile with GeoPandas by stable ID pair",
      "Index and partition recommendations follow representative workloads and execution evidence",
      "The architecture gives every data class one update authority plus documented access and delivery copies",
      "Migrations, least-privilege roles, backups, restore tests, retention, lineage and responsible next actions are defined",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Builds valid relational and spatial query packs, integrity checks, predicate audits and performance evidence" },
      { dimension: "Conceptual understanding", expectation: "Connects table grain, SQL population, spatial semantics and storage roles to scientific use and governance" },
      { dimension: "Reproducibility", expectation: "Delivers immutable inputs, checksums, migrations, versions, reconciled counts, lineage, access controls and recovery evidence" },
      { dimension: "Scientific communication", expectation: "Issues an actionable database handover decision that separates structural integrity from measurement validity and unsupported ecological claims" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(false, false),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic Spatial Databases training pack, CC0-1.0; no real field observations or locations",
      coreReferences: [
        { title: "PostgreSQL tutorial", href: "https://www.postgresql.org/docs/current/tutorial.html" },
        { title: "PostGIS introduction", href: "https://postgis.net/workshops/postgis-intro/" },
        { title: "GeoParquet specification", href: "https://geoparquet.org/releases/v1.1.0/" },
      ],
      furtherReading: [
        { title: "OGC GeoPackage standard", href: "https://www.ogc.org/standards/geopackage/" },
        { title: "PostgreSQL backup and restore", href: "https://www.postgresql.org/docs/current/backup.html" },
      ],
    },
  },
  "module-2-chapter-8-practicum": {
    estimatedTime: "420–540 minutes",
    lessonType: "Chapter Practicum",
    position: 8,
    totalPositions: 10,
    markdownFile: "content/lessons/module-2/practicum-08.md",
    formativeChecks: [
      {
        id: "m2-p8-contract",
        question: "What must govern whether an observation enters the EO cube?",
        options: [
          "A predeclared measurement, grid, time, mask and provenance contract",
          "Whether its thumbnail looks clear",
          "Whether concatenation completes without an exception",
        ],
        correctOption: 0,
        explanation: "A cube is a comparison system. Structural success does not establish common measurements, cell footprints, temporal meaning, local validity or source lineage.",
      },
      {
        id: "m2-p8-reconcile",
        question: "The fixture contains five STAC Items but the observation plan has six records. What should the package do?",
        options: [
          "Preserve the discrepancy, identify the inventory-only Item and state what evidence is needed",
          "Invent a sixth catalogue Item",
          "Delete the sixth observation so totals match",
        ],
        correctOption: 0,
        explanation: "Reconciliation makes selection boundaries visible. Fabricating or deleting evidence would hide the relationship between discovery snapshot, planned population and eligible inputs.",
      },
      {
        id: "m2-p8-release",
        question: "When is the cloud-native package ready for release?",
        options: [
          "When catalogue, cube, mask, compute, format, compatibility and lineage gates pass for the stated use",
          "When one attractive composite image exists",
          "When every source is forced into the same array",
        ],
        correctOption: 0,
        explanation: "Release depends on the connected evidence chain and bounded intended use. Exclusions and unresolved limitations remain part of a professional package.",
      },
    ],
    submissionChecklist: [
      "All Chapter 8 deliverables are present, open successfully and contain no credentials or signed URLs",
      "The deterministic STAC query, Item–asset inventory and candidate decisions reconcile by stable ID",
      "The labelled diagnostic cube preserves coordinates, scale, mask, source lineage and valid-observation counts",
      "Chunk, memory, bounded-compute and eager-equivalence evidence is complete and accurately qualified",
      "COG and Zarr decisions separate layout, serving, client, compatibility and result evidence",
      "Pipeline reconciliation retains accepted, review and excluded observations at every gate",
      "The final release decision preserves synthetic status and separates operational success from ecological inference",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Builds and validates a correct STAC inventory, labelled diagnostic cube, mask/count output, chunk plan and cloud-format decision" },
      { dimension: "Conceptual understanding", expectation: "Connects catalogue discovery, comparability contracts, lazy execution and selective-access storage to one scientific evidence chain" },
      { dimension: "Reproducibility", expectation: "Delivers immutable inputs, checksums, environment, query contract, stable lineage, reconciliations, bounded tests and controlled publication" },
      { dimension: "Scientific communication", expectation: "Issues an actionable release decision that exposes observation support, exclusions, compatibility limits and unsupported ecological claims" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(true, true),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic Multidimensional and Cloud-Native EO training pack, CC0-1.0; no real acquisitions, asset URLs or field locations",
      coreReferences: [
        { title: "Xarray with Dask", href: "https://docs.xarray.dev/en/stable/user-guide/dask.html" },
        { title: "OGC Cloud Optimized GeoTIFF standard", href: "https://docs.ogc.org/is/21-026/21-026.html" },
        { title: "STAC specification overview", href: "https://stacspec.org/en/about/stac-spec/" },
      ],
      furtherReading: [
        { title: "Zarr v3 core specification", href: "https://zarr-specs.readthedocs.io/en/latest/v3/core/v3.0.html" },
        { title: "Dask array best practices", href: "https://docs.dask.org/en/stable/array-best-practices.html" },
      ],
    },
  },
  "module-2-chapter-9-practicum": {
    estimatedTime: "420–540 minutes",
    lessonType: "Chapter Practicum",
    position: 9,
    totalPositions: 10,
    markdownFile: "content/lessons/module-2/practicum-09.md",
    formativeChecks: [
      {
        id: "m2-p9-public",
        question: "When is the public data contract safe to pass into the map builder?",
        options: [
          "After map and table fields match an explicit allow-list and locations are generalized",
          "After internal fields are hidden with popup styling",
          "After precise coordinates are rounded only in the visible label",
        ],
        correctOption: 0,
        explanation: "The browser can inspect its full payload. Public-schema filtering and spatial generalization must happen before serialization, with stable-ID reconciliation and a recorded decision.",
      },
      {
        id: "m2-p9-accessibility",
        question: "A keyboard user skips the map. What must still communicate the core result?",
        options: [
          "A labelled table and text summary containing the same six public records and status meanings",
          "A hover-only tooltip",
          "The basemap attribution by itself",
        ],
        correctOption: 0,
        explanation: "The alternative preserves key evidence and conclusions without requiring spatial interaction. It complements, rather than excuses, keyboard and responsive map testing.",
      },
      {
        id: "m2-p9-interoperability",
        question: "The API reports six matched and three returned features. What blocks release?",
        options: [
          "Failure to follow the next-page relation and reconcile all six stable IDs",
          "The response uses GeoJSON",
          "The collection has a declared CRS",
        ],
        correctOption: 0,
        explanation: "A valid partial page is not the full public population. The client must follow advertised pagination within the bounded request and prove complete ID reconciliation.",
      },
    ],
    submissionChecklist: [
      "All Chapter 9 deliverables open successfully and contain no forbidden field, precise real location or credential",
      "Public GeoJSON, table, status counts and map selection reconcile exactly through six stable IDs",
      "The delivery architecture distinguishes portrayal, bounded features, measured coverage and catalogue discovery",
      "Keyboard, touch, 320, 375, tablet, desktop, payload, privacy and failed-service evidence is complete",
      "Capability/conformance, CRS/axis, media type, paging, client and authentication tests include negative cases",
      "The map retains an equivalent table, text result, source, licence, attribution, date and limitations",
      "The final decision distinguishes evidence sufficiency, seasonal NIR, ecological condition and synthetic status",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Builds a reconciled responsive map and table, correct public GeoJSON, bounded service design and complete interoperability acceptance evidence" },
      { dimension: "Conceptual understanding", expectation: "Connects user task to portrayal, feature, tile, coverage and discovery roles and treats accessibility as part of scientific delivery" },
      { dimension: "Reproducibility", expectation: "Delivers immutable inputs, checksums, environment, source code, stable IDs, public contract, test records, release inventory and controlled promotion" },
      { dimension: "Scientific communication", expectation: "Answers one public question accessibly without overstating NIR, missing evidence, generalized locations or real-world monitoring" },
    ],
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(true, false),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic Web GIS and Delivery training pack, CC0-1.0; invented generalized sites and non-fetchable service endpoints",
      coreReferences: [
        { title: "OGC standards catalogue", href: "https://www.ogc.org/standards/" },
        { title: "OGC API Features Part 1 Core", href: "https://docs.ogc.org/is/17-069r4/17-069r4.html" },
        { title: "Web Content Accessibility Guidelines 2.2", href: "https://www.w3.org/TR/WCAG22/" },
      ],
      furtherReading: [
        { title: "Folium documentation", href: "https://python-visualization.github.io/folium/latest/" },
        { title: "MapLibre GL JS documentation", href: "https://maplibre.org/maplibre-gl-js/docs/" },
      ],
    },
  },
  "module-2-chapter-10-practicum": {
    estimatedTime: "480–600 minutes",
    lessonType: "Chapter Practicum",
    position: 10,
    totalPositions: 10,
    markdownFile: "content/lessons/module-2/practicum-10.md",
    formativeChecks: [
      {
        id: "m2-p10-requirements",
        question: "When should candidate products enter the architecture decision?",
        options: [
          "After users, operations, scientific invariants, governance and failure consequences are declared",
          "Before requirements, because the existing product defines them",
          "Only after selecting the product with the longest feature list",
        ],
        correctOption: 0,
        explanation: "Requirements establish which roles are necessary and what evidence must pass. Products are evaluated against that bounded need rather than allowed to redefine it.",
      },
      {
        id: "m2-p10-authority",
        question: "A field partner edits an offline snapshot after the authoritative zones change. What is required?",
        options: [
          "A declared contribution and conflict-review process with one continuing authority",
          "Use whichever copy has the later file timestamp",
          "Make both copies authoritative",
        ],
        correctOption: 0,
        explanation: "Synchronization does not decide scientific conflicts. Stable IDs, audit evidence, comparison and a named authority are needed to accept or reject each contribution.",
      },
      {
        id: "m2-p10-decision",
        question: "An ArcGIS capability cannot be run because the learner has no authorised licence. How should the decision record treat it?",
        options: [
          "Use authoritative documentation as context and label runtime capability unverified with an owner and test",
          "Invent a successful result",
          "Conclude that the capability does not exist",
        ],
        correctOption: 0,
        explanation: "Absence of access is neither product failure nor execution evidence. A professional record separates documented capability from versioned, licensed and tested organisational behaviour.",
      },
    ],
    submissionChecklist: [
      ...commonProfessionalEcosystemChecklist,
      "Two credible candidate architectures allocate desktop, automation, authority, services, identity, operations, recovery and migration",
      "The scientific equivalence suite compares actual IDs, schema, nulls, categories, values, geometry, grid and provenance under predeclared rules",
      "Anonymous, least-privilege, offline-conflict, failed-service, restore, upgrade and licence-unavailable cases have safe responses",
      "The migration drill records round-trip loss, effort, scientific consequence, trigger and responsible owner",
      "The final accept, conditional or reject decision has evidence, expiry, residual risk and measurable closure conditions",
    ],
    rubric: professionalEcosystemRubric("Produces a coherent governed architecture, role matrix, scientific equivalence gate, sharing tests, operations plan and tested migration path", "Distinguishes product capability, organisational verification, scientific equivalence and total operating responsibility across ArcGIS, open and hybrid patterns"),
    technicalMetadata: {
      pythonVersion: MODULE2_SOFTWARE_VERSIONS.python,
      jupyterEnvironment: "JupyterLab 4 / Notebook 7",
      testedVersions: module2TestedVersions(true, true),
      reviewDate: "11 August 2026",
      datasetCitation: "Synthetic Professional GIS Ecosystems training pack, CC0-1.0; invented organisations, requirements and decisions with no accounts, licences, endpoints or sensitive locations",
      coreReferences: [
        { title: "Introduction to ArcGIS Online", href: "https://doc.arcgis.com/en/arcgis-online/get-started/what-is-agol.htm" },
        { title: "Introduction to ArcGIS Enterprise", href: "https://enterprise.arcgis.com/en/get-started/latest/windows/what-is-arcgis-enterprise-.htm" },
        { title: "Types of geodatabases", href: "https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/overview/types-of-geodatabases.htm" },
      ],
      furtherReading: [
        { title: "ArcGIS Online data access and editing", href: "https://doc.arcgis.com/en/arcgis-online/manage-data/data-access-and-editing.htm" },
        { title: "ArcGIS Online sharing best practices", href: "https://doc.arcgis.com/en/arcgis-online/reference/best-practices-share.htm" },
        { title: "OGC standards catalogue", href: "https://www.ogc.org/standards/" },
      ],
    },
  },
};
