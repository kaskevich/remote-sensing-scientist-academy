export const advancedThermalLessonPath = "/lessons/advanced-thermal-remote-sensing/";

export const advancedThermalSources = {
  landsatSurfaceTemperature: "https://www.usgs.gov/landsat-missions/landsat-collection-2-surface-temperature",
  landsatScale: "https://www.usgs.gov/faqs/how-do-i-use-a-scale-factor-landsat-level-2-science-products",
  landsatLevelTwo: "https://pubs.usgs.gov/fs/2021/3055/fs20213055.pdf",
  ecostressProducts: "https://ecostress.jpl.nasa.gov/data/atbds-summary-table",
  ecostressMission: "https://ecostress.jpl.nasa.gov/mission",
} as const;

export type ThermalWorkflowStep = {
  n: string;
  phase: string;
  title: string;
  action: string[];
  check: string[];
  output: string;
  fail: string;
};

export const thermalWorkflowSteps: ThermalWorkflowStep[] = [
  {
    n: "01",
    phase: "QUESTION",
    title: "Define the temperature claim before selecting a product",
    action: ["Name the surface, time window, spatial support and comparison of interest.", "Write what would count as independent validation.", "State non-claims such as air temperature, soil moisture, evapotranspiration or plant stress."],
    check: ["The target is surface temperature or thermal radiance—not a colour on a map.", "The expected temperature contrast can exist at the sensor's time and scale."],
    output: "A bounded thermal question and validation plan.",
    fail: "Reframe the question or add the field and meteorological evidence needed for the intended inference.",
  },
  {
    n: "02",
    phase: "PRODUCT",
    title: "Choose a product level that matches the question",
    action: ["Distinguish raw counts, calibrated radiance, brightness temperature and land-surface-temperature products.", "Select Landsat, ECOSTRESS, UAV or another source from coverage, acquisition time, resolution and product maturity."],
    check: ["The variable, units, scale/offset, valid range and QA layers are documented.", "Product version and processing level are recorded."],
    output: "A product decision with one intended use and explicit limitations.",
    fail: "Do not infer temperature from an unverified band or rendered palette; retrieve the product documentation first.",
  },
  {
    n: "03",
    phase: "PROVENANCE",
    title: "Inventory acquisition and processing metadata",
    action: ["Record product ID, acquisition and processing time, sensor, view geometry, CRS, grid and native resolution.", "Keep source QA, emissivity and uncertainty layers with the temperature data."],
    check: ["UTC/local time conversion is explicit.", "No layer has been separated from the product version that defines it."],
    output: "A traceable source inventory.",
    fail: "Quarantine the asset until its identity, time, processing level and scale are known.",
  },
  {
    n: "04",
    phase: "DECODE",
    title: "Apply scale, offset, fill and valid-range rules",
    action: ["Mask fill and invalid values before arithmetic.", "Decode stored integers using the exact metadata for that product and collection.", "Convert Kelvin to Celsius only after the physical temperature value exists."],
    check: ["Sample pixels reproduce a documented example or metadata calculation.", "Units survive export and plotting."],
    output: "A physically labelled temperature layer plus a decode audit.",
    fail: "Stop if the result is implausible; recheck product, band, scale, offset, fill and operation order.",
  },
  {
    n: "05",
    phase: "QUALITY",
    title: "Build a joint validity mask",
    action: ["Decode cloud, cloud-shadow, fill, saturation and product-specific quality bits.", "Exclude or stratify low-quality emissivity and uncertainty evidence where the product provides it."],
    check: ["The mask uses the same grid and shape as temperature.", "Valid fraction and exclusion reasons are reported—not hidden."],
    output: "A reproducible valid-pixel mask and exclusion summary.",
    fail: "Resolve bit definitions and alignment before calculating summaries or trends.",
  },
  {
    n: "06",
    phase: "PHYSICS",
    title: "Audit emissivity and atmospheric assumptions",
    action: ["Identify how emissivity and atmospheric transmittance/radiance enter the supplied retrieval.", "Inspect known gaps, blockiness or uncertainty relevant to the product.", "For custom retrievals, document the radiative-transfer method and every auxiliary input."],
    check: ["Brightness temperature is not relabelled as surface temperature.", "Emissivity is treated as wavelength-, material- and condition-dependent."],
    output: "A retrieval-assumption record tied to the selected product.",
    fail: "Restrict the analysis to radiance/brightness temperature or obtain a validated surface-temperature product.",
  },
  {
    n: "07",
    phase: "SUPPORT",
    title: "Align space, time and measurement support",
    action: ["Keep native grids until a justified target grid is defined.", "Pair field observations within a defensible time window and footprint.", "Aggregate raster values to the field support rather than treating neighbouring pixels as independent plots."],
    check: ["CRS, transform, resolution, extent and NoData match after alignment.", "Reprojection and resampling methods suit continuous temperature data."],
    output: "A support-compatible temperature and reference table.",
    fail: "Report the mismatch; resampling cannot manufacture simultaneous or equivalent observations.",
  },
  {
    n: "08",
    phase: "CONTEXT",
    title: "Control acquisition context before comparison",
    action: ["Record local solar time, season, weather, cloud history, wind and surface wetness where available.", "Compare like observation contexts or model those differences explicitly."],
    check: ["A warmer value is not explained from temperature alone.", "Day/night and pre-event conditions are visible in the analysis table."],
    output: "A comparable observation set or a documented reason it is not comparable.",
    fail: "Do not convert a context difference into an ecological trend.",
  },
  {
    n: "09",
    phase: "VALIDATE",
    title: "Validate against independent, support-aware observations",
    action: ["Use calibrated reference measurements with timestamp, footprint and uncertainty.", "Predeclare matching and exclusion rules.", "Report bias, MAE/RMSE, sample count and error by surface/context when justified."],
    check: ["Validation data did not tune the final correction or threshold.", "Reference and raster support are compatible enough for the claim."],
    output: "A validation table, error summary and unresolved limitations.",
    fail: "Downgrade the claim to unvalidated thermal pattern or collect fit-for-purpose reference data.",
  },
  {
    n: "10",
    phase: "ANALYSE",
    title: "Test a hypothesis without turning association into cause",
    action: ["Calculate contrasts, anomalies or models only inside valid support.", "Carry acquisition context and uncertainty into grouping or modelling.", "Use spatial or grouped validation when estimating predictive performance."],
    check: ["The result distinguishes observed temperature, derived contrast and modelled quantity.", "Alternative causes remain visible."],
    output: "A qualified thermal result with uncertainty and applicability domain.",
    fail: "Simplify the claim, redesign the comparison or obtain missing explanatory evidence.",
  },
  {
    n: "11",
    phase: "RELEASE",
    title: "Export an analysis-ready thermal evidence package",
    action: ["Write temperature, QA mask, context table, validation results and methods together.", "Preserve native and analysis grids separately.", "Publish a human-readable limitations and non-claims statement."],
    check: ["Files reopen with correct units, CRS, scale and NoData.", "Every map legend states the variable, units and time."],
    output: "A reviewable thermal package—not only a coloured image.",
    fail: "Block release until provenance, validity, units, support and interpretation can be traced.",
  },
];
