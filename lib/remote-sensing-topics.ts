export type RemoteSensingTopicId =
  | "optical"
  | "sar"
  | "lidar"
  | "thermal"
  | "hyperspectral"
  | "spatial-analysis";

export type AcademyTopicLink = {
  title: string;
  href: string;
  context?: string;
};

export type RemoteSensingTopic = {
  id: RemoteSensingTopicId;
  label: string;
  shortLabel: string;
  definition: string;
  measurement: string;
  commonData: string[];
  applications: string[];
  limitations: string[];
  distinctions?: string[];
  status: string[];
  links: {
    start: AcademyTopicLink[];
    deeper: AcademyTopicLink[];
    practice: AcademyTopicLink[];
  };
  practiceGap?: string;
};

export const remoteSensingTopics: RemoteSensingTopic[] = [
  {
    id: "optical",
    label: "Optical",
    shortLabel: "OPTICAL",
    definition:
      "Optical remote sensing records reflected solar radiation in visible, near-infrared and shortwave-infrared regions. RGB, multispectral imagery and calibrated reflectance products are related, but they are not interchangeable.",
    measurement: "Reflected electromagnetic radiation received within defined spectral bands.",
    commonData: ["RGB imagery", "Multispectral bands", "Surface reflectance", "NDVI and other indices", "Land-cover maps"],
    applications: ["Vegetation condition", "Land cover and habitat mapping", "Water and agriculture", "Change detection"],
    limitations: [
      "Cloud, illumination and shadow can remove or alter usable observations.",
      "Similar spectra can have different causes: a spectral index is not a direct ecological trait.",
    ],
    distinctions: ["Optical is one remote-sensing family, not all remote sensing.", "Band ≠ index; index ≠ trait."],
    status: ["FOUNDATION AVAILABLE", "ADVANCED AVAILABLE", "FIELD LAB AVAILABLE"],
    links: {
      start: [
        { title: "Optical Remote Sensing", href: "/module-2/optical-remote-sensing/", context: "Module 2 · Lesson 2.26" },
        { title: "Sensors, Illumination and Radiometric Quality", href: "/module-2/sensors-illumination-and-radiometric-quality/", context: "Module 2 · Lesson 2.20" },
      ],
      deeper: [
        { title: "Vegetation and Spectral Indices", href: "/module-2/vegetation-and-spectral-indices/", context: "Module 2 · Lesson 2.27" },
        { title: "Design Predictors and Modelling Hypotheses", href: "/module-3/design-predictors-and-modelling-hypotheses/", context: "Module 3 · Lesson 3.3" },
      ],
      practice: [
        { title: "Field Lab 06 · Track Recovery After a Fire", href: "/projects/track-recovery-after-fire/", context: "Sentinel-2 change detection" },
        { title: "Field Lab 07 · UAV Coastal Wetlands", href: "/field-labs/uav-coastal-wetlands/", context: "RGB and multispectral workflow" },
      ],
    },
  },
  {
    id: "sar",
    label: "Synthetic Aperture Radar",
    shortLabel: "SAR",
    definition:
      "Synthetic Aperture Radar is an active microwave system: it illuminates the surface and records the returned signal. Unlike an optical image, its brightness depends on microwave interaction, acquisition geometry and processing.",
    measurement: "Returned microwave energy as backscatter; phase can also support coherence and interferometric products.",
    commonData: ["VV/VH or HH/HV backscatter", "SAR intensity", "Coherence", "Interferometric products"],
    applications: ["Flood mapping", "Wetland and forest monitoring", "Surface-deformation analysis", "Moisture-sensitive investigations"],
    limitations: [
      "Speckle and geometric distortion require explicit processing and interpretation.",
      "Backscatter combines moisture-sensitive dielectric effects, roughness, structure and geometry; it is not direct soil moisture.",
    ],
    distinctions: ["SAR is not an optical image shown with different colours.", "Backscatter ≠ one physical property."],
    status: ["FOUNDATION AVAILABLE", "ADVANCED PRACTICE AVAILABLE", "FIELD LAB AVAILABLE"],
    links: {
      start: [
        { title: "SAR Fundamentals", href: "/module-2/sar-fundamentals/", context: "Module 2 · Lesson 2.28" },
      ],
      deeper: [
        { title: "Build a Defensible Satellite Evidence Package", href: "/module-2/build-a-defensible-satellite-evidence-package/", context: "Module 2 · Chapter 5 practicum" },
      ],
      practice: [
        { title: "Field Lab 08 · Sentinel-1 Wetland Inundation", href: "/field-labs/sar-wetland-inundation/", context: "Scene comparability, classification and validation" },
      ],
    },
  },
  {
    id: "lidar",
    label: "LiDAR",
    shortLabel: "LIDAR",
    definition:
      "LiDAR is active laser ranging. Timed returns form three-dimensional samples of intercepted surfaces, which may then be classified and interpolated into structural products.",
    measurement: "Distance inferred from the travel time of emitted laser pulses and detected returns.",
    commonData: ["x/y/z point clouds", "Multiple returns", "DSM and DTM", "Canopy-height models", "Structural metrics"],
    applications: ["Vegetation and forest structure", "Terrain and topography", "Coastal morphology", "Biomass-related structural analysis"],
    limitations: [
      "Point density, coverage and classification errors constrain the products that can be derived.",
      "DSM is not DTM, and surface height is not automatically vegetation height.",
    ],
    distinctions: ["Photogrammetric point cloud ≠ LiDAR point cloud."],
    status: ["FOUNDATION AVAILABLE", "ADVANCED PRACTICE AVAILABLE", "FIELD LAB AVAILABLE"],
    links: {
      start: [
        { title: "LiDAR and Point Clouds", href: "/module-2/lidar-and-point-clouds/", context: "Module 2 · Lesson 2.30" },
        { title: "Terrain Analysis with DEM and DSM", href: "/module-2/terrain-analysis-with-dem-and-dsm/", context: "Module 2 · Lesson 2.17" },
      ],
      deeper: [
        { title: "Build a Defensible Satellite Evidence Package", href: "/module-2/build-a-defensible-satellite-evidence-package/", context: "Module 2 · Chapter 5 practicum" },
      ],
      practice: [
        { title: "Field Lab 09 · LiDAR Canopy Structure", href: "/field-labs/lidar-canopy-structure/", context: "Point QA, terrain, height and validation" },
        { title: "Field Lab 07 · Photogrammetric Structure", href: "/field-labs/uav-coastal-wetlands/", context: "Comparison context—not a LiDAR survey" },
      ],
    },
  },
  {
    id: "thermal",
    label: "Thermal",
    shortLabel: "THERMAL",
    definition:
      "Thermal remote sensing records emitted thermal-infrared energy rather than reflected sunlight. Calibrated workflows may estimate apparent or surface temperature, subject to their stated assumptions.",
    measurement: "Thermal emission reaching the detector as a radiometric temperature-related signal.",
    commonData: ["Thermal imagery", "Apparent-temperature products", "Surface-temperature products", "Thermal-anomaly maps"],
    applications: ["Surface-temperature patterns", "Water and vegetation contrast", "Urban heat and fire", "Validated evapotranspiration or plant-water-stress research"],
    limitations: [
      "Emissivity, atmosphere, viewing conditions and time of day affect interpretation.",
      "Surface temperature is not air temperature; warm or cool does not automatically mean dry, healthy or stressed.",
    ],
    distinctions: ["Thermal ≠ reflectance.", "Colour palette ≠ thermal measurement."],
    status: ["PARTIAL FOUNDATION", "FIELD LAB AVAILABLE", "STANDALONE ADVANCED LESSON COMING LATER"],
    links: {
      start: [
        { title: "UAV Remote Sensing Fundamentals", href: "/module-2/uav-remote-sensing-fundamentals/", context: "Module 2 · Lesson 2.18" },
        { title: "Sensors, Illumination and Radiometric Quality", href: "/module-2/sensors-illumination-and-radiometric-quality/", context: "Module 2 · Lesson 2.20" },
      ],
      deeper: [],
      practice: [
        { title: "Field Lab 07 · UAV Coastal Wetlands", href: "/field-labs/uav-coastal-wetlands/", context: "Thermal science and project context" },
        { title: "Drone Lab · eBee Post-flight and Pix4D Processing", href: "/field-labs/uav-coastal-wetlands/drone-lab/", context: "Duet T operational workflow" },
      ],
    },
    practiceGap: "Thermal has a project workflow but no standalone advanced Academy lesson yet.",
  },
  {
    id: "hyperspectral",
    label: "Hyperspectral",
    shortLabel: "HYPERSPECTRAL",
    definition:
      "Hyperspectral sensors measure tens to hundreds of narrow, contiguous bands. RGB has roughly three broad visible bands; multispectral systems use several selected bands; hyperspectral data sample spectral shape much more densely.",
    measurement: "Spectral radiance or reflectance across finely sampled wavelengths.",
    commonData: ["Hyperspectral data cubes", "Spectral signatures", "Narrow-band indices", "Endmember and classification products"],
    applications: ["Pigment and material discrimination", "Mineralogy and water quality", "Plant-stress research", "Validated functional or species-difference studies"],
    limitations: [
      "Large data volume, dimensionality, calibration and atmospheric sensitivity raise the evidence burden.",
      "Mixed spectra remain ambiguous: a spectral signature is not automatic species identification.",
    ],
    distinctions: ["Multispectral ≠ hyperspectral.", "Spectral signature ≠ automatic species ID."],
    status: ["FOUNDATION AVAILABLE", "ADVANCED PRACTICE AVAILABLE", "FIELD LAB AVAILABLE"],
    links: {
      start: [
        { title: "Optical Remote Sensing", href: "/module-2/optical-remote-sensing/", context: "Module 2 · Lesson 2.26" },
      ],
      deeper: [
        { title: "Hyperspectral Remote Sensing", href: "/module-2/hyperspectral-remote-sensing/", context: "Module 2 · Lesson 2.29" },
        { title: "Build a Defensible Satellite Evidence Package", href: "/module-2/build-a-defensible-satellite-evidence-package/", context: "Module 2 · Chapter 5 practicum" },
      ],
      practice: [
        { title: "Field Lab 10 · Hyperspectral Signatures", href: "/field-labs/hyperspectral-signatures/", context: "Cube QA, mixed spectra, modelling and validation" },
      ],
    },
  },
  {
    id: "spatial-analysis",
    label: "Spatial Analysis",
    shortLabel: "SPATIAL ANALYSIS",
    definition:
      "Spatial analysis is not a sensor family. It is the analytical layer used to examine locations, relationships, neighborhoods, gradients and scale after field or Earth Observation data have been acquired.",
    measurement: "No single sensor measurement: it operates on spatial coordinates, topology, distance, neighborhoods and aligned support.",
    commonData: ["Rasters and vectors", "Point clouds", "Field plots", "EO products", "Derived terrain and zonal summaries"],
    applications: ["Field-to-pixel extraction", "Habitat and elevation gradients", "Distance-to-shore analysis", "Landscape pattern and spatial modelling"],
    limitations: [
      "Spatial dependence and scale effects can create pseudo-replication or unstable conclusions.",
      "CRS and alignment errors invalidate relationships; spatial correlation is not causality.",
    ],
    distinctions: ["Spatial analysis ≠ sensor."],
    status: ["FOUNDATION AVAILABLE", "ADVANCED AVAILABLE", "FIELD LAB AVAILABLE"],
    links: {
      start: [
        { title: "Raster–Vector Integration", href: "/module-2/raster-vector-integration/", context: "Module 2 · Lesson 2.15" },
        { title: "Raster Alignment and Grid Integrity", href: "/module-2/raster-alignment-and-grid-integrity/", context: "Module 2 · Lesson 2.14" },
      ],
      deeper: [
        { title: "Spatial Autocorrelation", href: "/module-2/spatial-autocorrelation/", context: "Module 2 · Lesson 2.31" },
        { title: "Spatial Regression Concepts", href: "/module-2/spatial-regression-concepts/", context: "Module 2 · Lesson 2.34" },
        { title: "Spatial, Grouped and Leave-Location-Out Validation", href: "/module-3/spatial-grouped-and-leave-location-out-validation/", context: "Module 3 · Lesson 3.10" },
      ],
      practice: [
        { title: "From Plant Species to Earth Observation", href: "/species/from-field-to-earth-observation/", context: "Field plots, spatial support and UAV predictors" },
        { title: "Field Lab 07 · UAV Coastal Wetlands", href: "/field-labs/uav-coastal-wetlands/", context: "Field-to-pixel workflow" },
      ],
    },
  },
];

export const sensorChoiceScenarios: Array<{
  prompt: string;
  best: RemoteSensingTopicId;
  why: string;
  alternatives: string;
  limitation: string;
}> = [
  {
    prompt: "Map vegetation greenness over a large region with freely available data.",
    best: "optical",
    why: "Multispectral missions such as Sentinel-2 and Landsat provide repeated red and near-infrared observations for vegetation-index evidence.",
    alternatives: "SAR can add cloud-independent structural and moisture-sensitive context; spatial analysis is needed to summarise the result.",
    limitation: "Cloud, illumination and spectral ambiguity remain; greenness is not biomass, biodiversity or a measured plant trait.",
  },
  {
    prompt: "Monitor flooding when persistent cloud blocks optical observations.",
    best: "sar",
    why: "Microwave SAR observations are not blocked by cloud in the same way as visible and infrared optical measurements.",
    alternatives: "Optical data can support interpretation during clear periods, and spatial analysis can compare mapped water extent through time.",
    limitation: "Wind, vegetation, roughness and geometry can also alter backscatter, so dark or bright pixels are not automatically flood water.",
  },
  {
    prompt: "Measure three-dimensional canopy structure.",
    best: "lidar",
    why: "Laser ranges and returns directly provide three-dimensional samples from which structural metrics can be derived.",
    alternatives: "Photogrammetry can reconstruct visible surfaces from overlapping images, but it is a different measurement system.",
    limitation: "Density, occlusion, classification and terrain-model quality constrain canopy-height estimates.",
  },
  {
    prompt: "Investigate patterns in land-surface temperature.",
    best: "thermal",
    why: "Thermal sensors respond to emitted thermal-infrared energy and calibrated products can represent apparent or surface temperature.",
    alternatives: "Optical and spatial context can help explain surface materials and landscape patterns but do not replace thermal measurement.",
    limitation: "Emissivity, atmosphere and acquisition time matter; surface temperature is not air temperature or automatic plant stress.",
  },
  {
    prompt: "Differentiate materials using fine spectral features.",
    best: "hyperspectral",
    why: "Many narrow contiguous bands can resolve spectral shape and absorption features hidden inside broader multispectral bands.",
    alternatives: "Multispectral optical data may be sufficient for broader classes and is often easier to acquire and validate.",
    limitation: "Fine spectral sampling adds calibration, noise, dimensionality and mixed-pixel challenges; identification still requires validation.",
  },
  {
    prompt: "Relate field plots to distance from shore and raster values.",
    best: "spatial-analysis",
    why: "This is a spatial-support and relationship problem involving plot geometry, distance calculation, raster alignment and extraction.",
    alternatives: "Optical, SAR, LiDAR or thermal sensors can supply raster evidence, depending on the ecological question.",
    limitation: "A correct join does not remove scale mismatch, spatial dependence or the need to justify causal claims.",
  },
];

export const remoteSensingTopicById = new Map(
  remoteSensingTopics.map((topic) => [topic.id, topic]),
);

export const remoteSensingLessonDomains: Record<string, RemoteSensingTopicId> = {
  "optical-remote-sensing": "optical",
  "sar-fundamentals": "sar",
  "lidar-and-point-clouds": "lidar",
  "sensors-illumination-and-radiometric-quality": "thermal",
  "hyperspectral-remote-sensing": "hyperspectral",
  "spatial-autocorrelation": "spatial-analysis",
};
