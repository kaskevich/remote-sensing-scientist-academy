export const uavFieldLabPath = "/field-labs/uav-coastal-wetlands/";
export const droneLabPath = "/field-labs/uav-coastal-wetlands/drone-lab/";

export const uavSources = {
  ebee: "https://www.sensefly.com/drones/ebee-x/",
  sequoia: "https://www.parrot.com/assets/s3fs-public/2021-09/sequoia-userguide-en-fr-es-de-it-pt-ar-zn-zh-jp-ko_1.pdf",
  duetT: "https://ageagle.com/wp-content/uploads/2022/08/Camera-Collection-AgEagle-2022-DIGITAL-1.pdf",
  pix4dSteps: "https://support.pix4d.com/hc/en-us/articles/115002472186",
  pix4dProcess: "https://support.pix4d.com/hc/en-us/articles/202557519",
  pix4dThermal: "https://support.pix4d.com/hc/en-us/articles/360000173463",
  trimbleExport: "https://help.fieldsystems.trimble.com/trimble-access/2023.00/en/Job-export-data.htm",
  epsg3301: "https://epsg.org/crs_3301/Estonian-Coordinate-System-of-1997.html",
} as const;

export const scientificPipeline = [
  "Ecological question",
  "Sensor choice",
  "Flight design",
  "Raw imagery",
  "Positioning",
  "PPK / GCP",
  "Photogrammetry",
  "Radiometry",
  "RGB / multispectral / thermal",
  "Reflectance bands",
  "Vegetation indices",
  "DSM",
  "Quality control",
  "Ecological interpretation",
  "Analysis-ready data",
] as const;

export const sequoiaBands = [
  { name: "Green", centre: "550 nm", bandwidth: "40 nm", className: "green", meaning: "Visible green reflectance; useful context for vegetation colour and green–NIR contrasts. Pigments, illumination, canopy and background all contribute." },
  { name: "Red", centre: "660 nm", bandwidth: "40 nm", className: "red", meaning: "A region of strong chlorophyll absorption in green vegetation and the visible term used in NDVI. It is not a direct chlorophyll reading." },
  { name: "Red Edge", centre: "735 nm", bandwidth: "10 nm", className: "rededge", meaning: "Samples the rapid transition from red absorption toward NIR reflectance. It can be sensitive to canopy and chlorophyll differences, without mapping either one-to-one." },
  { name: "NIR", centre: "790 nm", bandwidth: "40 nm", className: "nir", meaning: "Strongly influenced by leaf and canopy scattering and vegetation amount. Structure, shadows, water and background can change the signal." },
] as const;

export const flightConfiguration = [
  { system: "Multispectral", payload: "Parrot Sequoia", altitude: "106–109 m AGL", overlap: "80% forward · 75% side", gsd: "≈10 cm/pixel", role: "Green, Red, Red Edge and NIR reflectance products" },
  { system: "RGB", payload: "senseFly Duet T · S.O.D.A. RGB", altitude: "119–125 m AGL", overlap: "85–88% forward · 80–86% side", gsd: "≈2.7 cm/pixel", role: "Visible context, texture, boundaries and photogrammetric geometry" },
  { system: "Thermal", payload: "senseFly Duet T · 640 × 512 thermal", altitude: "Project mission record", overlap: "Paired Duet T acquisition", gsd: "≈15.6 cm/pixel", role: "Thermal infrared product; not reflectance" },
] as const;

export const vegetationIndices = [
  { id: "NDVI", name: "Normalized Difference Vegetation Index", formula: "(NIR − Red) / (NIR + Red)", why: "Red absorption contrasted with NIR scattering", use: "General vegetation-condition contrast", limits: "Can saturate; soil, canopy, atmosphere and shadows matter." },
  { id: "GNDVI", name: "Green Normalized Difference Vegetation Index", formula: "(NIR − Green) / (NIR + Green)", why: "Green-to-NIR contrast", use: "Complementary canopy and pigment-sensitive predictor", limits: "Does not directly measure chlorophyll or photosynthesis." },
  { id: "SAVI", name: "Soil Adjusted Vegetation Index", formula: "((NIR − Red) / (NIR + Red + 0.5)) × 1.5", why: "Adds a documented soil-adjustment term", use: "Sparse vegetation and exposed-background conditions", limits: "L = 0.5 is a parameter choice, not universal correction." },
  { id: "MSAVI", name: "Modified Soil Adjusted Vegetation Index", formula: "(2NIR + 1 − √((2NIR + 1)² − 8(NIR − Red))) / 2", why: "Adaptive red–NIR soil adjustment", use: "Complementary predictor where soil background is visible", limits: "Requires valid reflectance, masks and a non-negative radicand." },
  { id: "RNDVI", name: "Renormalized Difference Vegetation Index", formula: "(NIR − Red) / √(NIR + Red)", why: "Renormalizes the red–NIR contrast", use: "Vegetation-density sensitivity in the project predictor set", limits: "Not NDVIRe; denominator and reflectance scale must be valid." },
  { id: "RTVIcore", name: "Red-edge Triangular Vegetation Index Core", formula: "100(NIR − Red Edge) − 10(NIR − Green)", why: "Combines NIR, Red Edge and Green contrasts", use: "Red-edge-sensitive canopy/pigment predictor", limits: "Empirical relationship must be validated for this campaign." },
  { id: "SRe", name: "Red-edge Simple Ratio", formula: "NIR / Red Edge", why: "NIR-to-Red Edge ratio", use: "Canopy-condition and red-edge predictor", limits: "Unstable when the denominator is invalid or near zero." },
  { id: "CIre", name: "Red-edge Chlorophyll Index", formula: "(NIR / Red Edge) − 1", why: "Shifted red-edge simple ratio", use: "Chlorophyll-associated project predictor", limits: "An index, not a direct CCI or chlorophyll measurement." },
] as const;

export const uavOutputs = [
  ["RGB orthomosaic", "processed", "Orthorectified visible-colour mosaic", "≈2.7 cm/pixel", "Context, boundaries, texture", "Colour and texture are not species or trait measurements"],
  ["Green reflectance", "processed", "Calibrated Green-band reflectance", "≈10 cm/pixel", "Visible vegetation/background information", "Illumination and calibration quality remain consequential"],
  ["Red reflectance", "processed", "Calibrated Red-band reflectance", "≈10 cm/pixel", "Pigment-sensitive contrast; NDVI input", "Not a direct chlorophyll reading"],
  ["Red Edge reflectance", "processed", "Calibrated Red Edge reflectance", "≈10 cm/pixel", "Red-edge indices and modelling", "Sensitive to registration and calibration"],
  ["NIR reflectance", "processed", "Calibrated NIR reflectance", "≈10 cm/pixel", "Canopy/leaf scattering and indices", "Water, shadows and background can dominate"],
  ["DSM", "derived", "Elevation of the visible upper surface", "output-grid dependent", "Surface structure and height-related predictors", "DSM is not a bare-earth DEM"],
  ["Point cloud", "derived", "3-D reconstructed surface samples", "irregular 3-D support", "Geometry QA and DSM production", "Density is not accuracy"],
  ["Thermal product", "processed", "Thermal infrared signal / apparent surface temperature where calibrated", "≈15.6 cm/pixel", "Surface-temperature pattern inspection", "Not reflectance, soil moisture or plant stress directly"],
  ["Vegetation indices", "derived", "Formula applied to compatible reflectance bands", "aligned output grid", "Compact spectral predictors", "Band ≠ index; index ≠ trait"],
] as const;

export type DroneStep = {
  number: string;
  title: string;
  action: string;
  why: string;
  expected: string;
  check: string;
  stop: string;
};

export const droneSteps: DroneStep[] = [
  { number: "00", title: "Retrieve aircraft logs and camera storage", action: "Use the approved eBee X procedure. Images and basic flight data are on the camera SD card. For internal drone logs: remove the camera, power the aircraft on, wait about 20 seconds, then attach mini-USB to the computer. Keep the two retrieval paths distinct.", why: "The camera media and aircraft internal log store contain different evidence.", expected: "Readable camera media plus the required mission log files.", check: "Confirm aircraft generation, payload, supported cable and storage before access.", stop: "The hardware procedure, power state or media identity is uncertain." },
  { number: "01", title: "Copy first, process second", action: "Copy logs, RGB, multispectral, thermal and GNSS files into the project raw-data folders. Preserve the source media unchanged.", why: "A write-protected raw copy makes the workflow recoverable and auditable.", expected: "A complete raw inventory on the project drive.", check: "Compare file counts and sizes with the source media; record the copy date.", stop: "Files are missing, unreadable or being processed directly from the SD card." },
  { number: "02", title: "Start eMotion Postflight", action: "Open eMotion and choose Postflight / Flight Data Manager for the mission.", why: "Postflight associates mission logs, images, geotags and GNSS correction evidence.", expected: "A new processing project with no source files moved or renamed.", check: "Confirm the project location has sufficient space and is not the raw folder.", stop: "The selected workspace is temporary, full or inside the raw archive." },
  { number: "03", title: "Verify mission, date and time", action: "Select the flight log and record site, date, start/end and time basis. For this 2024 summer campaign, Estonia local time was UTC+3; convert deliberately before requesting base-station data.", why: "RINEX observations must overlap the complete flight interval.", expected: "One uniquely identified mission and a base-data interval with margin.", check: "Cross-check filename, log timeline, site and local/UTC conversion.", stop: "The time zone or mission identity is ambiguous." },
  { number: "04", title: "Match logs to the image folder", action: "Load the correct flight log and select the matching camera-image folder; let eMotion associate image capture times with the mission record.", why: "This creates image-to-log geotag associations; it is not photogrammetric feature matching.", expected: "The expected image count is associated with one mission.", check: "The 2024 manual normally expected 100% matching; investigate every exception.", stop: "Site/date disagree, image count is unexpected or matching is not unique." },
  { number: "05", title: "Load RINEX and process PPK", action: "Obtain observation/navigation data from the relevant approved reference station for an interval covering the flight, load the required files and run PPK.", why: "PPK combines rover and reference observations after flight to improve camera-position estimates.", expected: "Corrected camera geotags and a documented quality summary.", check: "Inspect fix status, base position, time overlap and improvement; the manual example changed from about 0.806 m standalone to 0.049 m post-processed uncertainty.", stop: "Reference station, antenna metadata, time overlap or solution quality is wrong or unknown." },
  { number: "06", title: "Export corrected mission evidence", action: "Write corrected geotags where required and retain the geoinfo, trajectory, text/KML and action log produced by the project workflow.", why: "Pix4D must ingest the corrected coordinates with traceable processing evidence.", expected: "A processed image folder and supporting metadata distinct from raw data.", check: "Confirm image count, coordinate columns, units and timestamps.", stop: "Corrected and standalone positions cannot be distinguished." },
  { number: "07", title: "Create the Pix4D project", action: "Open PIX4Dmapper and add all required corrected images. For Duet T work, include both S.O.D.A. RGB and thermal images and verify their image groups/camera models.", why: "The paired rig supplies RGB geometry and thermal observations with synchronized acquisition.", expected: "All intended images are grouped under recognized camera models.", check: "Inspect Image Properties, resolution, focal/pixel metadata and image-group counts.", stop: "Camera model, group, image count or coordinate source is wrong." },
  { number: "08", title: "Set the output and GCP CRS", action: "Set the project/GCP coordinate system to Estonian Coordinate System of 1997 (EPSG:3301) when using this study’s control and analysis data.", why: "The project’s surveyed and downstream analysis coordinates use the Estonian national grid in metres.", expected: "Images, control points and output coordinates occupy the same defensible spatial reference.", check: "Read the full CRS name, EPSG code, axis/column order, horizontal units and vertical reference.", stop: "The interface only says ‘Estonian’, an auto-detected UTM CRS remains selected, or the vertical reference is unknown." },
  { number: "09", title: "Run Initial Processing only", action: "In Processing Options, keep Initial Processing checked; uncheck Point Cloud and Mesh and DSM, Orthomosaic and Index. Start step 1 only.", why: "Initial feature matching, camera orientation and bundle adjustment establish geometry before control is marked and dense products are generated.", expected: "Calibrated images, automatic tie points, sparse reconstruction and an initial Quality Report.", check: "Inspect calibration, blocks, matching, initial positions and warnings.", stop: "Images split into unexplained blocks or calibration/matching is weak." },
  { number: "10", title: "Export approved GCPs from Trimble Access", action: "Open the relevant approved Trimble Access project/job, choose Export, select a comma-delimited CSV/TXT format, choose the required control points and write the export to controlled transfer storage.", why: "Surveyed control must enter Pix4D with identifiers, coordinates and units intact.", expected: "A documented GCP CSV from the correct job.", check: "Verify point names, coordinate fields/order, elevation, delimiter, units and CRS. Internal 2024 example job names are intentionally not published.", stop: "The job, export schema or coordinate reference is unverified." },
  { number: "11", title: "Import GCP CSV", action: "Open Project → GCP/MTP Manager, confirm EPSG:3301, choose Import GCPs, select the CSV and map the actual coordinate columns deliberately.", why: "Import declares surveyed constraints; it does not prove they are correctly identified in images.", expected: "Control points plot in plausible positions inside/around the mission.", check: "Validate X/Y/Z order, axis convention, metres, elevations and point spread.", stop: "Points plot far away, coordinate order is unclear or heights are implausible." },
  { number: "12", title: "Manually mark every GCP", action: "For each GCP, find the exact target in multiple suitable images and mark the same physical point precisely in GCP/MTP Manager or rayCloud.", why: "One surveyed point appears in several overlapping camera views; accurate image measurements constrain reprojection and bundle geometry.", expected: "Every accepted GCP has consistent marks across enough well-distributed images.", check: "Zoom, target identity, mark consistency, image geometry and residual feedback.", stop: "The target is obscured, ambiguous or repeatedly produces inconsistent reprojection." },
  { number: "13", title: "Reoptimize", action: "Choose Process → Reoptimize after GCP marking.", why: "Reoptimization updates camera and reconstruction parameters using the newly marked control constraints.", expected: "An updated solution with control integrated into the bundle adjustment.", check: "Compare residuals, camera geometry, calibration and block structure with the initial solution.", stop: "Residuals worsen, a point becomes an outlier or the model deforms." },
  { number: "14", title: "Audit GCPs and MTPs", action: "Review every control residual, suspicious mark, image observation and the spatial distribution of control; correct and reoptimize again when necessary.", why: "A low average can conceal one wrong point or a weakly controlled edge.", expected: "No unexplained outlier and defensible control coverage.", check: "Horizontal/vertical residuals, point count, mark count and spatial pattern; retain independent check points where available.", stop: "A fitted GCP is being presented as independent accuracy evidence." },
  { number: "15", title: "Enable final processing stages", action: "Uncheck Initial Processing; check Point Cloud and Mesh and DSM, Orthomosaic and Index after accepting geometry.", why: "Dense reconstruction and final rasters should build from accepted camera geometry instead of hiding an unresolved initial failure.", expected: "Only steps 2 and 3 are queued.", check: "Record the accepted step-1 report before starting.", stop: "Initial processing or control QA is still unresolved." },
  { number: "16", title: "Choose point-cloud settings", action: "Select Low/Fast for rapid diagnostic output or Optimal when the purpose and resources justify denser reconstruction.", why: "Point density trades time and detail; it does not independently set positional accuracy.", expected: "A documented setting matched to the processing purpose.", check: "Available storage/RAM, expected surface detail, noise and QA objective.", stop: "A historical setting is being copied without considering the dataset and output use." },
  { number: "17", title: "Request orthomosaic and reflectance maps", action: "Under DSM, Orthomosaic and Index, request the needed DSM/orthomosaic outputs and Reflectance Map GeoTIFFs for multispectral bands.", why: "An orthomosaic is a geometrically corrected mosaic; a reflectance map is the radiometrically meaningful band product needed for quantitative multispectral analysis.", expected: "Green, Red, Red Edge and NIR reflectance layers plus selected geometric outputs.", check: "Radiometric calibration, band labels, GeoTIFF, resolution, CRS and NoData.", stop: "A display mosaic or raw digital number is being called reflectance." },
  { number: "18", title: "Run steps 2 and 3", action: "Start Point Cloud and Mesh followed by DSM, Orthomosaic and Index from the accepted step-1/GCP state.", why: "Dense surface reconstruction supplies geometry used by the DSM and orthorectification.", expected: "Point cloud, DSM, orthomosaic and requested reflectance products.", check: "Processing completes without unresolved warnings and outputs open independently.", stop: "The project silently reruns/overwrites an unarchived earlier stage or a stage fails." },
  { number: "19", title: "Read the Quality Report", action: "Review calibration, image matching, geolocation, overlap, GCP residuals, camera model changes, reconstruction warnings and output previews.", why: "‘Completed’ reports software execution, not scientific validity.", expected: "A signed-off QA record with limitations and follow-up actions.", check: "All images/blocks, overlap holes, residual distributions, output CRS and warnings.", stop: "A warning is unexplained or the report is missing." },
  { number: "20", title: "Inventory and archive outputs", action: "Open every requested product, record metadata/checksums and archive the raw, processing, output and QA folders separately.", why: "A reproducible handoff needs readable products plus provenance, not a Pix4D project alone.", expected: "RGB, multispectral, structural and thermal outputs are labelled by measurement type and use.", check: "CRS, grid, resolution, band identity, units, masks, NoData, extent, timestamps and QA linkage.", stop: "A product cannot be traced to its sensor, mission and processing settings." },
];

export const qaStopGates = [
  "Wrong mission or unexplained image count",
  "Wrong UTC/local-time conversion or incomplete RINEX interval",
  "Weak or undocumented PPK solution",
  "Image/log association failure",
  "Wrong camera model or image group",
  "Wrong or ambiguous CRS/vertical reference",
  "Unverified radiometric calibration",
  "Insufficient achieved overlap or motion blur",
  "Seamlines, ghosting or water matching failure",
  "Band misregistration or mismatched raster grids",
  "NoData or scaling ambiguity",
  "Field plots outside accepted coverage",
] as const;

export const operationalChecklist = [
  "Copy logs and all sensor imagery",
  "Preserve raw data",
  "Start eMotion Postflight",
  "Verify mission, date, UTC/local-time conversion and image count",
  "Load the correct logs and image folder",
  "Load PPK/RINEX and verify the solution",
  "Export corrected imagery and processing evidence",
  "Start Pix4D and add the required camera groups",
  "Verify camera model and EPSG:3301 where applicable",
  "Run Initial Processing only",
  "Export/import GCP CSV if control is used",
  "Mark every GCP and reoptimize",
  "Inspect residuals, distribution and Quality Report",
  "Run Point Cloud and Mesh",
  "Run DSM, Orthomosaic and Index",
  "Generate and verify reflectance maps",
  "Archive products, metadata and QA",
] as const;
