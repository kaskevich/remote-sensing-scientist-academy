export const sarFieldLabPath = "/field-labs/sar-wetland-inundation/";

export const sarFieldLabSources = {
  mission: "https://sentiwiki.copernicus.eu/web/s1-mission",
  processing: "https://sentiwiki.copernicus.eu/web/s1-processing",
  products: "https://sentiwiki.copernicus.eu/web/s1-products",
  dataSpace: "https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel1.html",
  browser: "https://documentation.dataspace.copernicus.eu/Applications/Browser.html",
  nasaTraining: "https://appliedsciences.nasa.gov/get-involved/training/english/arset-radar-remote-sensing-land-water-disaster-applications",
  nasaHandbook: "https://earthdata.nasa.gov/s3fs-public/2025-04/SARHB_FullRes_2019.pdf",
} as const;

export type SarWorkflowStep = {
  number: string;
  phase: string;
  title: string;
  what: string;
  action: string[];
  where: string;
  why: string;
  input: string[];
  output: string[];
  check: string[];
  failure: string;
  next: string;
};

export const sarWorkflowSteps: SarWorkflowStep[] = [
  {
    number: "01", phase: "QUESTION", title: "Write the claim before choosing scenes",
    what: "Define the surface-water or inundation change that the map is allowed to represent.",
    action: ["Draw the area of interest.", "Choose reference and event time windows.", "Name the map unit, minimum mapping unit and validation source.", "List permanent water, radar shadow, built surfaces and emergent vegetation as possible confounders."],
    where: "Project brief and GIS study-area layer.",
    why: "A dark-backscatter map is not automatically a flood map. The claim determines the observations, exclusions and validation evidence needed.",
    input: ["Ecological or hazard question", "AOI", "Event chronology", "Independent reference plan"],
    output: ["One-sentence claim", "AOI", "Reference/event windows", "Predeclared non-claims"],
    check: ["The event window follows the event trigger.", "The reference represents a defensible non-event condition.", "The proposed validation is independent of the threshold-tuning samples."],
    failure: "The event timing, target class or independent validation source is unknown.",
    next: "Search for comparable Sentinel-1 observations.",
  },
  {
    number: "02", phase: "SEARCH", title: "Build a comparable Sentinel-1 scene stack",
    what: "Select GRD observations whose acquisition geometry and polarization support comparison.",
    action: ["Search Sentinel-1 GRD over the AOI and both time windows.", "Record platform, sensing time, mode, product type, polarization, orbit direction, relative orbit and incidence-angle range.", "Prefer the same mode, polarization, orbit direction and relative orbit for a simple change comparison."],
    where: "Copernicus Data Space Browser or catalogue.",
    why: "Backscatter changes with look geometry as well as surface conditions. A date match alone is not a comparability test.",
    input: ["AOI", "Time windows", "Sentinel-1 catalogue metadata"],
    output: ["Scene inventory", "Candidate reference/event stack", "Rejection log"],
    check: ["AOI coverage is complete.", "Required polarization exists on every selected date.", "Orbit direction and relative orbit are consistent or the difference is explicitly modelled."],
    failure: "Coverage, mode, polarization or geometry differs in a way the analysis cannot defend.",
    next: "Freeze the raw products and metadata.",
  },
  {
    number: "03", phase: "PROVENANCE", title: "Preserve the source products",
    what: "Create an immutable input inventory before processing.",
    action: ["Download or reference the exact catalogue items.", "Record product identifiers, checksums when available, retrieval date and processing baseline.", "Keep inputs, processing intermediates and outputs separate."],
    where: "Project data register and read-only inputs folder.",
    why: "A defensible map must be traceable to exact source observations and processing assumptions.",
    input: ["Selected GRD products", "Catalogue records"],
    output: ["Input manifest", "Unchanged source products", "Processing workspace"],
    check: ["Every raster has an exact product identifier.", "No processing is performed inside the source archive."],
    failure: "A scene cannot be traced to a stable identifier and acquisition record.",
    next: "Convert source measurements into a consistent analysis representation.",
  },
  {
    number: "04", phase: "PREPROCESS", title: "Calibrate and terrain-correct consistently",
    what: "Apply one documented GRD preprocessing chain to every accepted scene.",
    action: ["Inspect the product and chosen service before applying operators already included upstream.", "Apply orbit information and border/thermal-noise handling where required.", "Calibrate every scene to the same backscatter coefficient.", "Apply the chosen speckle strategy before resampling when used.", "Orthorectify or use an analysis-ready RTC product, record the DEM and coefficient, then clip only after geometry is stable."],
    where: "SNAP graph, Copernicus Data Space processing service or another reproducible SAR processor.",
    why: "Calibration addresses measurement scale; terrain correction addresses location and geometry. They solve different problems.",
    input: ["GRD products", "Orbit data when required", "DEM", "Processing graph and parameters"],
    output: ["Co-registered calibrated backscatter rasters", "Processing log", "QA quicklooks"],
    check: ["Coefficient and units match across dates.", "Projection, grid, pixel spacing, extent and NoData are explicit.", "No operator was duplicated merely because it appears in a generic recipe."],
    failure: "Dates have different coefficients, grids or unrecorded processing histories.",
    next: "Audit values in linear power and decibels.",
  },
  {
    number: "05", phase: "SCALE", title: "Keep linear power and dB mathematically distinct",
    what: "Use the value scale required by the operation and label it correctly.",
    action: ["Confirm whether the raster stores linear power or decibels.", "For positive linear power, calculate dB = 10 × log10(power).", "Average power in linear space unless the method explicitly defines another statistic.", "Never relabel a linear raster as dB."],
    where: "Raster calculator or analysis notebook.",
    why: "The logarithmic transform changes arithmetic and visual contrast. Ratios, means and thresholds are not interchangeable across scales.",
    input: ["Calibrated backscatter", "Scale metadata"],
    output: ["Explicit linear or dB analysis layers", "Scale check table"],
    check: ["Linear values are non-negative.", "Typical low-return areas become more negative in dB.", "No zero or negative linear value enters the logarithm."],
    failure: "The stored scale or coefficient cannot be established from metadata.",
    next: "Align reference, event and ancillary masks.",
  },
  {
    number: "06", phase: "ALIGN", title: "Create one comparison grid",
    what: "Align the reference and event evidence without inventing spatial detail.",
    action: ["Choose a target CRS, grid origin, extent and pixel spacing.", "Resample once using a method appropriate to continuous backscatter.", "Create a common valid-data mask.", "Record whether spatial averaging or filtering changes effective support."],
    where: "GIS or scripted raster pipeline.",
    why: "Pixel-wise change is meaningful only when pixels refer to compatible ground support.",
    input: ["Preprocessed dates", "AOI", "Terrain and permanent-water masks"],
    output: ["Aligned stack", "Common mask", "Grid specification"],
    check: ["Exact shape, transform, CRS and NoData match.", "No visible half-pixel shift occurs at stable boundaries."],
    failure: "Rasters overlap visually but fail an exact grid comparison.",
    next: "Explore class distributions with labelled reference samples.",
  },
  {
    number: "07", phase: "MODEL", title: "Estimate a candidate-water rule",
    what: "Use labelled evidence to estimate a rule; do not select a threshold from map appearance alone.",
    action: ["Separate tuning samples from validation samples.", "Inspect VV, VH and change distributions by class and land-cover context.", "Choose a transparent threshold or classifier.", "Record the feature, scale, operator direction and threshold."],
    where: "Notebook plus GIS sample layer.",
    why: "Smooth open water often returns little energy to the sensor, but wind roughening, emergent vegetation, soil moisture, radar shadow and double-bounce can violate a simple dark-water rule.",
    input: ["Aligned backscatter stack", "Training labels", "Context masks"],
    output: ["Candidate classification rule", "Tuning diagnostics", "Model record"],
    check: ["Threshold units match the source scale.", "Reference and event data were processed identically.", "Permanent water and terrain shadow are handled explicitly."],
    failure: "The rule depends on the validation labels or collapses under plausible threshold changes.",
    next: "Convert candidate water to the stated inundation class.",
  },
  {
    number: "08", phase: "INTERPRET", title: "Separate water evidence from flood interpretation",
    what: "Apply chronology and exclusions to distinguish candidate event inundation from permanent water or radar artefacts.",
    action: ["Compare event candidates with the reference water state.", "Exclude or label permanent water separately.", "Flag radar shadow, layover, edge artefacts and low-confidence vegetation contexts.", "Apply the minimum mapping unit only after documenting its effect."],
    where: "Raster logic and GIS review.",
    why: "Flooding is a temporal interpretation, not merely a low-backscatter state.",
    input: ["Candidate-water layers", "Reference state", "Permanent-water/context masks", "Event chronology"],
    output: ["Candidate event-inundation layer", "Exclusion mask", "Confidence layer"],
    check: ["Persistent water is not counted as newly inundated.", "Masked pixels remain distinguishable from classified dry pixels."],
    failure: "The map cannot distinguish new water, permanent water and no-data/uncertain areas.",
    next: "Validate with evidence not used to tune the rule.",
  },
  {
    number: "09", phase: "VALIDATE", title: "Measure omission and commission separately",
    what: "Validate the candidate map against independent reference observations.",
    action: ["Use a spatially and temporally relevant reference sample.", "Build a confusion matrix.", "Report class precision, recall and intersection-over-union or F1 alongside sample counts.", "Stratify errors by open terrain, vegetation, settlement and radar geometry when sample size allows."],
    where: "Validation notebook and map review.",
    why: "High overall accuracy can hide failure on a rare inundated class.",
    input: ["Held-out validation labels", "Candidate map", "Stratum/context attributes"],
    output: ["Confusion matrix", "Class metrics", "Mapped error samples"],
    check: ["Validation samples were not used for threshold selection.", "Reference timing supports the event claim.", "Sample counts accompany every metric."],
    failure: "Validation is circular, temporally mismatched or too sparse for the published claim.",
    next: "Test how decisions change across defensible alternatives.",
  },
  {
    number: "10", phase: "UNCERTAINTY", title: "Run sensitivity and uncertainty checks",
    what: "Expose the decisions that control mapped area and error.",
    action: ["Sweep a defensible threshold interval.", "Compare with and without the selected speckle or spatial filter.", "Test alternative context masks and minimum mapping units.", "Map stable classifications separately from decision-sensitive pixels."],
    where: "Reproducible analysis script.",
    why: "A single crisp boundary can conceal sensitivity to threshold, filtering, reference timing and mixed pixels.",
    input: ["Candidate workflow", "Alternative parameter set", "Validation data"],
    output: ["Sensitivity table", "Agreement/confidence raster", "Qualified interpretation"],
    check: ["The reported inundated area includes an uncertainty or sensitivity statement.", "Parameter alternatives are scientifically plausible, not arbitrary."],
    failure: "Small defensible changes reverse the main conclusion without being reported.",
    next: "Package analysis-ready evidence and its limits.",
  },
  {
    number: "11", phase: "HANDOFF", title: "Export an auditable evidence package",
    what: "Deliver the map together with enough context to reproduce and challenge it.",
    action: ["Export calibrated reference/event layers, final class, confidence and masks as GeoTIFF or COG.", "Save scene inventory, processing graph, threshold record, confusion matrix and sensitivity table.", "Write a short interpretation with supported claims and explicit non-claims."],
    where: "outputs, qa and documentation folders.",
    why: "A flood-coloured raster without provenance, validation and uncertainty is not analysis-ready evidence.",
    input: ["Accepted processing outputs", "QA records", "Validation and sensitivity results"],
    output: ["Analysis-ready raster package", "Machine-readable manifest", "Decision log", "Portfolio brief"],
    check: ["Every output states coefficient, scale, CRS, grid, time, polarization and NoData.", "The final map opens correctly outside the processing project."],
    failure: "A reviewer cannot reconstruct which scenes, coefficient, threshold and exclusions created the result.",
    next: "Publish only the claim supported by the validation evidence.",
  },
];

export const sarComparabilityRows = [
  { id: "SAL01", date: "04 Jun", orbit: "ASC · 131", angle: "38.2°", vv: "−8.4", vh: "−15.7", condition: "reference geometry", decision: "accept", reason: "Comparable reference geometry with completed terrain correction." },
  { id: "SAL03", date: "16 Jun", orbit: "ASC · 131", angle: "38.3°", vv: "−7.7", vh: "−14.8", condition: "wetter synthetic condition", decision: "accept", reason: "Same relative orbit and comparable incidence angle; retain for the instructional comparison." },
  { id: "SAL05", date: "28 Jun", orbit: "DESC · 36", angle: "33.1°", vv: "−10.2", vh: "−17.0", condition: "incompatible orbit geometry", decision: "review", reason: "Different orbit direction and relative orbit confound a simple date-to-date comparison." },
  { id: "SAL06", date: "10 Jul", orbit: "ASC · 131", angle: "45.9°", vv: "−8.0", vh: "−14.5", condition: "incidence-angle edge", decision: "review", reason: "Same orbit identifier but a substantially different incidence angle requires investigation." },
  { id: "SAL07", date: "22 Jul", orbit: "ASC · 131", angle: "38.5°", vv: "−6.9", vh: "−13.9", condition: "terrain correction failed", decision: "reject", reason: "A failed terrain-correction gate blocks spatial comparison regardless of plausible values." },
] as const;

export const sarThresholdCases = [
  { id: "A", context: "Open low-relief surface", reference: -14.1, event: -20.0, expected: "candidate", explanation: "A marked event-time decrease supports a candidate-water flag, subject to independent validation." },
  { id: "B", context: "Permanent open water", reference: -21.2, event: -21.5, expected: "exclude", explanation: "Low return on both dates indicates persistent water, not newly inundated area." },
  { id: "C", context: "Emergent vegetation", reference: -15.0, event: -10.4, expected: "review", explanation: "A brighter event return may reflect vegetation–water double bounce; a dark-pixel rule alone would miss it." },
  { id: "D", context: "Radar-shadow mask", reference: -23.1, event: -23.0, expected: "exclude", explanation: "Geometric shadow can be dark without water and must be masked or qualified." },
] as const;
