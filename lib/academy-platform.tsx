import { Fragment } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import content from "@/content/site.json";
import LearnerCurriculum, {
  type AcademyCurriculumModule,
  type AcademyLesson,
} from "@/app/components/learner-curriculum";
import { module1Overview, reviewedLessonDetails } from "@/lib/module1-pedagogy";
import {
  module2ChapterPractica,
  module2LessonDetails,
  module2Overview,
  module2PracticumDetails,
  publishedModule2Lessons,
} from "@/lib/module2-pedagogy";
import {
  module3LessonDetails,
  module3Overview,
  publishedModule3Lessons,
} from "@/lib/module3-pedagogy";
import { extractFirstPythonCode } from "@/lib/lesson-code-workspace";
import { academyHref } from "@/lib/site-paths";

type CurriculumModule = {
  id: string;
  visible: boolean;
  week: string;
  title: string;
  description: string;
  tools: string[];
  lessonContent: string;
  lessonImages: Array<{ src: string; alt: string; caption: string }>;
  lessonResources: Array<{ href: string; title: string }>;
  task: {
    title: string;
    instructions: string;
    referenceImages: Array<{ src: string; alt: string; caption: string }>;
    referenceMaps: Array<{ src: string; title: string; caption: string }>;
  };
};

function publicAssetPath(path: string) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) {
    return path;
  }

  const basePath = process.env.PAGES_BASE_PATH ?? "";
  return `${basePath}/${path.replace(/^\//, "")}`;
}

function readReviewedLesson(path: string) {
  const source = readFileSync(
    join(/* turbopackIgnore: true */ process.cwd(), path),
    "utf8",
  );
  return source.replace(/^---\n[\s\S]*?\n---\n+/, "");
}

const visibleNavigation = content.navigation.items.filter((item) => item.visible);
const visiblePaths = content.pathsSection.items.filter((path) => path.visible);
const visibleModules = (content.curriculum.modules as CurriculumModule[]).filter(
  (module) => module.visible,
);
const learnerLessons: AcademyLesson[] = visibleModules.map((module, index) => {
  const lessonContent = reviewedLessonDetails[module.id]?.content
    ?? (reviewedLessonDetails[module.id]
      ? readReviewedLesson(reviewedLessonDetails[module.id].markdownFile)
      : module.lessonContent);
  return {
    id: module.id || `lesson-${String(index + 1).padStart(2, "0")}`,
    numberLabel: `1.${index + 1}`,
    week: module.week,
    title: module.title,
    description: module.description,
    tools: module.tools,
    content: lessonContent,
    starterCode: extractFirstPythonCode(lessonContent) ?? undefined,
    images: module.lessonImages.map((image) => ({
      ...image,
      src: publicAssetPath(image.src),
    })),
    resources: [
      ...module.lessonResources,
      ...(reviewedLessonDetails[module.id]?.additionalResources ?? []),
    ].map((resource) => ({
      ...resource,
      href: publicAssetPath(resource.href),
    })),
    pedagogy: reviewedLessonDetails[module.id] ?? null,
    task: {
      title: module.task.title,
      instructions: module.task.instructions,
      referenceImages: module.task.referenceImages.map((image) => ({
        ...image,
        src: publicAssetPath(image.src),
      })),
      referenceMaps: module.task.referenceMaps.map((map) => ({
        ...map,
        src: publicAssetPath(map.src),
      })),
    },
  };
});

const module2LessonResources: Record<string, Array<{ href: string; title: string }>> = {
  "lesson-2-01": [{
    href: "lesson-resources/module-2/UAV_Satellite_Analysis_Pipeline_Starter.ipynb",
    title: "Download the Module 2 pipeline starter notebook",
  }],
  "lesson-2-05": [
    {
      href: "lesson-resources/module-2/vector-foundations/training_data_manifest.json",
      title: "Download the vector training-data manifest",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/README.md",
      title: "Read the synthetic vector training-data guide",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/training_field_plots.geojson",
      title: "Download synthetic training field plots",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/training_study_area.geojson",
      title: "Download the synthetic training study area",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/training_management_zones.geojson",
      title: "Download synthetic training management zones",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/training_vegetation_zones.geojson",
      title: "Download synthetic training vegetation zones",
    },
  ],
  "lesson-2-09": [
    {
      href: "lesson-resources/module-2/vector-foundations/README.md",
      title: "Read the synthetic vector training-data guide",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/training_topology_corrupted.geojson",
      title: "Download the explicitly corrupted topology training derivative",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/training_study_area.geojson",
      title: "Download the synthetic training study area",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/training_data_manifest.json",
      title: "Download the vector training-data manifest",
    },
  ],
  "lesson-2-10": [
    {
      href: "lesson-resources/module-2/vector-foundations/QGIS_Vector_QA_Checklist.md",
      title: "Download the QGIS vector QA checklist",
    },
    {
      href: "lesson-resources/module-2/vector-foundations/qgis_qa_observations.csv",
      title: "Download the structured QGIS observation log",
    },
  ],
  "lesson-2-11": [
    { href: "lesson-resources/module-2/raster-foundations/README.md", title: "Read the synthetic raster training-pack guide" },
    { href: "lesson-resources/module-2/raster-foundations/manifest.json", title: "Download the raster metadata and checksum manifest" },
  ],
  "lesson-2-12": [
    { href: "lesson-resources/module-2/raster-foundations/aligned_continuous.tif", title: "Download the aligned continuous GeoTIFF" },
    { href: "lesson-resources/module-2/raster-foundations/aligned_categorical.tif", title: "Download the aligned categorical GeoTIFF" },
    { href: "lesson-resources/module-2/raster-foundations/conflicting_nodata.tif", title: "Download the conflicting-NoData training raster" },
  ],
  "lesson-2-13": [
    { href: "lesson-resources/module-2/raster-foundations/training_site_boundary.geojson", title: "Download the synthetic site boundary" },
    { href: "lesson-resources/module-2/raster-foundations/different_crs.tif", title: "Download the different-CRS training raster" },
    { href: "lesson-resources/module-2/raster-foundations/different_resolution.tif", title: "Download the different-resolution training raster" },
  ],
  "lesson-2-14": [
    { href: "lesson-resources/module-2/raster-foundations/shifted_origin.tif", title: "Download the shifted-origin raster" },
    { href: "lesson-resources/module-2/raster-foundations/cropped_extent.tif", title: "Download the cropped-extent raster" },
    { href: "lesson-resources/module-2/raster-foundations/missing_crs.tif", title: "Download the deliberately missing-CRS raster" },
  ],
  "lesson-2-15": [
    { href: "lesson-resources/module-2/raster-foundations/training_plot_polygons.geojson", title: "Download the synthetic plot polygons" },
    { href: "lesson-resources/module-2/raster-foundations/aligned_continuous.tif", title: "Download the extraction training raster" },
  ],
  "lesson-2-16": [
    { href: "lesson-resources/module-2/raster-foundations/large_tiled_continuous.tif", title: "Download the tiled window-processing raster" },
  ],
  "lesson-2-17": [
    { href: "lesson-resources/module-2/raster-foundations/training_dem.tif", title: "Download the synthetic DEM" },
    { href: "lesson-resources/module-2/raster-foundations/training_dsm.tif", title: "Download the synthetic DSM" },
  ],
  "lesson-2-18": [
    { href: "lesson-resources/module-2/uav-foundations/README.md", title: "Read the synthetic UAV training-pack guide" },
    { href: "lesson-resources/module-2/uav-foundations/manifest.json", title: "Download the UAV data and checksum manifest" },
    { href: "lesson-resources/module-2/uav-foundations/mission_metadata.csv", title: "Download the synthetic mission metadata" },
  ],
  "lesson-2-19": [
    { href: "lesson-resources/module-2/uav-foundations/mission_metadata.csv", title: "Download the mission-design parameters" },
    { href: "lesson-resources/module-2/uav-foundations/image_metadata.csv", title: "Download the achieved image-metadata record" },
    { href: "lesson-resources/module-2/uav-foundations/study_area.geojson", title: "Download the synthetic UAV study boundary" },
  ],
  "lesson-2-20": [
    { href: "lesson-resources/module-2/uav-foundations/image_metadata.csv", title: "Download the radiometric image audit table" },
    { href: "lesson-resources/module-2/uav-foundations/uav_radiometric_gradient_demo.tif", title: "Download the variable-illumination training raster" },
    { href: "lesson-resources/module-2/uav-foundations/uav_rededge.tif", title: "Download the ambiguous-scale Red Edge raster" },
  ],
  "lesson-2-21": [
    { href: "lesson-resources/module-2/uav-foundations/gcp_residuals.csv", title: "Download the fitted control-point residuals" },
    { href: "lesson-resources/module-2/uav-foundations/checkpoint_residuals.csv", title: "Download the withheld check-point residuals" },
    { href: "lesson-resources/module-2/uav-foundations/photogrammetry_report.json", title: "Download the synthetic processing report" },
  ],
  "lesson-2-22": [
    { href: "lesson-resources/module-2/uav-foundations/photogrammetry_report.json", title: "Download the software-neutral reconstruction report" },
    { href: "lesson-resources/module-2/uav-foundations/image_metadata.csv", title: "Download the source-image QA evidence" },
  ],
  "lesson-2-23": [
    { href: "lesson-resources/module-2/uav-foundations/uav_rgb_preview.tif", title: "Download the seam-and-ghost orthomosaic preview" },
    { href: "lesson-resources/module-2/uav-foundations/uav_dsm.tif", title: "Download the synthetic clean DSM" },
    { href: "lesson-resources/module-2/uav-foundations/uav_dsm_spike_demo.tif", title: "Download the DSM spike-and-pit fixture" },
  ],
  "lesson-2-24": [
    { href: "lesson-resources/module-2/uav-foundations/README.md", title: "Read the UAV QA fixture guide" },
    { href: "lesson-resources/module-2/uav-foundations/manifest.json", title: "Download the complete UAV manifest" },
    { href: "lesson-resources/module-2/uav-foundations/field_plots.geojson", title: "Download the synthetic field polygons" },
  ],
  "lesson-2-25": [
    { href: "lesson-resources/module-2/uav-foundations/uav_red.tif", title: "Download the accepted Red band" },
    { href: "lesson-resources/module-2/uav-foundations/uav_green.tif", title: "Download the accepted Green band" },
    { href: "lesson-resources/module-2/uav-foundations/uav_nir.tif", title: "Download the aligned NIR band" },
    { href: "lesson-resources/module-2/uav-foundations/uav_nir_shifted.tif", title: "Download the shifted NIR QA fixture" },
    { href: "lesson-resources/module-2/uav-foundations/uav_dsm.tif", title: "Download the aligned DSM" },
  ],
  "lesson-2-26": [
    { href: "lesson-resources/module-2/satellite-eo/README.md", title: "Read the synthetic satellite EO training-pack guide" },
    { href: "lesson-resources/module-2/satellite-eo/manifest.json", title: "Download the satellite EO checksum manifest" },
    { href: "lesson-resources/module-2/satellite-eo/optical_observation_inventory.csv", title: "Download the optical observation inventory" },
  ],
  "lesson-2-27": [
    { href: "lesson-resources/module-2/satellite-eo/optical_reflectance_samples.csv", title: "Download the synthetic optical reflectance samples" },
    { href: "lesson-resources/module-2/satellite-eo/SATELLITE_EO_QA_TEMPLATE.md", title: "Download the satellite EO QA template" },
  ],
  "lesson-2-28": [
    { href: "lesson-resources/module-2/satellite-eo/sentinel1_backscatter_samples.csv", title: "Download the synthetic Sentinel-1 backscatter samples" },
    { href: "lesson-resources/module-2/satellite-eo/SATELLITE_EO_QA_TEMPLATE.md", title: "Download the satellite EO QA template" },
  ],
  "lesson-2-29": [
    { href: "lesson-resources/module-2/satellite-eo/hyperspectral_signatures.csv", title: "Download the synthetic imaging-spectroscopy signatures" },
    { href: "lesson-resources/module-2/satellite-eo/SATELLITE_EO_QA_TEMPLATE.md", title: "Download the satellite EO QA template" },
  ],
  "lesson-2-30": [
    { href: "lesson-resources/module-2/satellite-eo/lidar_point_samples.csv", title: "Download the synthetic LiDAR point samples" },
    { href: "lesson-resources/module-2/satellite-eo/SATELLITE_EO_QA_TEMPLATE.md", title: "Download the satellite EO QA template" },
  ],
  "lesson-2-31": [
    { href: "lesson-resources/module-2/spatial-statistics/README.md", title: "Read the synthetic spatial-statistics training-pack guide" },
    { href: "lesson-resources/module-2/spatial-statistics/manifest.json", title: "Download the spatial-statistics checksum manifest" },
    { href: "lesson-resources/module-2/spatial-statistics/meadow_plot_observations.csv", title: "Download the synthetic meadow plot observations" },
  ],
  "lesson-2-32": [
    { href: "lesson-resources/module-2/spatial-statistics/sampling_frame.csv", title: "Download the synthetic spatial sampling frame" },
    { href: "lesson-resources/module-2/spatial-statistics/spatial_validation_blocks.csv", title: "Download the predeclared spatial validation blocks" },
    { href: "lesson-resources/module-2/spatial-statistics/SPATIAL_INFERENCE_QA_TEMPLATE.md", title: "Download the spatial inference QA template" },
  ],
  "lesson-2-33": [
    { href: "lesson-resources/module-2/spatial-statistics/meadow_plot_observations.csv", title: "Download the interpolation plot observations" },
    { href: "lesson-resources/module-2/spatial-statistics/spatial_validation_blocks.csv", title: "Download the separated interpolation holdout blocks" },
    { href: "lesson-resources/module-2/spatial-statistics/SPATIAL_INFERENCE_QA_TEMPLATE.md", title: "Download the spatial inference QA template" },
  ],
  "lesson-2-34": [
    { href: "lesson-resources/module-2/spatial-statistics/meadow_plot_observations.csv", title: "Download the spatial-regression plot observations" },
    { href: "lesson-resources/module-2/spatial-statistics/spatial_validation_blocks.csv", title: "Download the separated model-validation blocks" },
    { href: "lesson-resources/module-2/spatial-statistics/SPATIAL_INFERENCE_QA_TEMPLATE.md", title: "Download the spatial inference QA template" },
  ],
  "lesson-2-35": [
    { href: "lesson-resources/module-2/spatial-databases/README.md", title: "Read the synthetic spatial-database training-pack guide" },
    { href: "lesson-resources/module-2/spatial-databases/manifest.json", title: "Download the spatial-database checksum manifest" },
    { href: "lesson-resources/module-2/spatial-databases/schema.sql", title: "Download the reviewed PostgreSQL and PostGIS teaching schema" },
    { href: "lesson-resources/module-2/spatial-databases/plot_observations.csv", title: "Download the synthetic repeated plot observations" },
  ],
  "lesson-2-36": [
    { href: "lesson-resources/module-2/spatial-databases/schema.sql", title: "Download the PostGIS teaching schema and indexes" },
    { href: "lesson-resources/module-2/spatial-databases/field_plots.csv", title: "Download the synthetic plot WKT records" },
    { href: "lesson-resources/module-2/spatial-databases/management_zones.csv", title: "Download the synthetic management-zone WKT records" },
    { href: "lesson-resources/module-2/spatial-databases/SPATIAL_DATABASE_QA_TEMPLATE.md", title: "Download the spatial database QA template" },
  ],
  "lesson-2-37": [
    { href: "lesson-resources/module-2/spatial-databases/database_handover_inventory.csv", title: "Download the deliberately imperfect database handover inventory" },
    { href: "lesson-resources/module-2/spatial-databases/manifest.json", title: "Download the storage-governance checksum manifest" },
    { href: "lesson-resources/module-2/spatial-databases/SPATIAL_DATABASE_QA_TEMPLATE.md", title: "Download the spatial database governance QA template" },
  ],
  "lesson-2-38": [
    { href: "lesson-resources/module-2/cloud-native-eo/README.md", title: "Read the cloud-native EO training-pack guide" },
    { href: "lesson-resources/module-2/cloud-native-eo/manifest.json", title: "Download the cloud-native EO checksum manifest" },
    { href: "lesson-resources/module-2/cloud-native-eo/meadow_cube_structure.json", title: "Download the labelled cube structure contract" },
  ],
  "lesson-2-39": [
    { href: "lesson-resources/module-2/cloud-native-eo/observation_inventory.csv", title: "Download the synthetic observation inventory" },
    { href: "lesson-resources/module-2/cloud-native-eo/cube_pixel_samples.csv", title: "Download the labelled cube pixel samples" },
    { href: "lesson-resources/module-2/cloud-native-eo/CLOUD_NATIVE_EO_QA_TEMPLATE.md", title: "Download the cloud-native EO QA template" },
  ],
  "lesson-2-40": [
    { href: "lesson-resources/module-2/cloud-native-eo/chunk_scenarios.csv", title: "Download the Dask chunk-planning scenarios" },
    { href: "lesson-resources/module-2/cloud-native-eo/meadow_cube_structure.json", title: "Download the proposed cube dimensions and chunks" },
    { href: "lesson-resources/module-2/cloud-native-eo/CLOUD_NATIVE_EO_QA_TEMPLATE.md", title: "Download the cloud-native EO QA template" },
  ],
  "lesson-2-41": [
    { href: "lesson-resources/module-2/cloud-native-eo/cloud_format_inventory.csv", title: "Download the deliberately imperfect cloud-format inventory" },
    { href: "lesson-resources/module-2/cloud-native-eo/CLOUD_NATIVE_EO_QA_TEMPLATE.md", title: "Download the cloud-format QA template" },
  ],
  "lesson-2-42": [
    { href: "lesson-resources/module-2/cloud-native-eo/stac_items_fixture.json", title: "Download the deterministic synthetic STAC ItemCollection" },
    { href: "lesson-resources/module-2/cloud-native-eo/observation_inventory.csv", title: "Download the observation inventory for catalogue reconciliation" },
    { href: "lesson-resources/module-2/cloud-native-eo/CLOUD_NATIVE_EO_QA_TEMPLATE.md", title: "Download the cloud-native EO QA template" },
  ],
  "lesson-2-43": [
    { href: "lesson-resources/module-2/web-gis-delivery/README.md", title: "Read the Web GIS delivery training-pack guide" },
    { href: "lesson-resources/module-2/web-gis-delivery/manifest.json", title: "Download the Web GIS checksum manifest" },
    { href: "lesson-resources/module-2/web-gis-delivery/service_capability_inventory.csv", title: "Download the deliberately mixed service capability inventory" },
    { href: "lesson-resources/module-2/web-gis-delivery/tile_request_scenarios.csv", title: "Download the web-delivery request scenarios" },
  ],
  "lesson-2-44": [
    { href: "lesson-resources/module-2/web-gis-delivery/monitoring_sites.geojson", title: "Download the generalized synthetic monitoring sites" },
    { href: "lesson-resources/module-2/web-gis-delivery/monitoring_summary.csv", title: "Download the accessible monitoring summary table" },
    { href: "lesson-resources/module-2/web-gis-delivery/map_content_contract.json", title: "Download the public map content contract" },
    { href: "lesson-resources/module-2/web-gis-delivery/WEB_GIS_DELIVERY_QA_TEMPLATE.md", title: "Download the Web GIS delivery QA template" },
  ],
  "lesson-2-45": [
    { href: "lesson-resources/module-2/web-gis-delivery/interoperability_fixture.json", title: "Download the deterministic interoperability fixture" },
    { href: "lesson-resources/module-2/web-gis-delivery/service_capability_inventory.csv", title: "Download the service capability inventory" },
    { href: "lesson-resources/module-2/web-gis-delivery/WEB_GIS_DELIVERY_QA_TEMPLATE.md", title: "Download the interoperability QA template" },
  ],
  "lesson-2-46": [
    { href: "lesson-resources/module-2/professional-gis-ecosystems/README.md", title: "Read the Professional GIS Ecosystems training-pack guide" },
    { href: "lesson-resources/module-2/professional-gis-ecosystems/manifest.json", title: "Download the professional ecosystem checksum manifest" },
    { href: "lesson-resources/module-2/professional-gis-ecosystems/ecosystem_component_inventory.csv", title: "Download the deliberately incomplete component inventory" },
    { href: "lesson-resources/module-2/professional-gis-ecosystems/workflow_translation.csv", title: "Download the ArcGIS and open workflow translation" },
    { href: "lesson-resources/module-2/professional-gis-ecosystems/PROFESSIONAL_ECOSYSTEM_QA_TEMPLATE.md", title: "Download the Professional GIS Ecosystem QA template" },
  ],
  "lesson-2-47": [
    { href: "lesson-resources/module-2/advanced-image-analysis/README.md", title: "Read the Advanced Image Analysis training-pack guide" },
    { href: "lesson-resources/module-2/advanced-image-analysis/manifest.json", title: "Download the checksum manifest" },
    { href: "lesson-resources/module-2/advanced-image-analysis/segmentation_tile.csv", title: "Download the synthetic segmentation tile" },
    { href: "lesson-resources/module-2/advanced-image-analysis/reference_labels.csv", title: "Download the synthetic reference labels" },
  ],
  "lesson-2-48": [
    { href: "lesson-resources/module-2/advanced-image-analysis/patch_partition_inventory.csv", title: "Download the patch and partition inventory" },
    { href: "lesson-resources/module-2/advanced-image-analysis/GEOSPATIAL_IMAGE_ANALYSIS_QA_TEMPLATE.md", title: "Download the image-analysis QA template" },
  ],
  "lesson-2-49": [
    { href: "lesson-resources/module-2/advanced-image-analysis/manifest.json", title: "Download the checksum manifest" },
    { href: "lesson-resources/module-2/advanced-image-analysis/patch_partition_inventory.csv", title: "Audit the deliberate spatial-overlap condition" },
    { href: "lesson-resources/module-2/advanced-image-analysis/GEOSPATIAL_IMAGE_ANALYSIS_QA_TEMPLATE.md", title: "Download the model-assurance template" },
  ],
  "lesson-2-50": [
    { href: "lesson-resources/module-2/production-geospatial-computing/README.md", title: "Read the Production Geospatial Computing training-pack guide" },
    { href: "lesson-resources/module-2/production-geospatial-computing/manifest.json", title: "Download the checksum manifest" },
    { href: "lesson-resources/module-2/production-geospatial-computing/api_page_1.json", title: "Download deterministic API page 1" },
    { href: "lesson-resources/module-2/production-geospatial-computing/api_page_2.json", title: "Download deterministic API page 2" },
  ],
  "lesson-2-51": [
    { href: "lesson-resources/module-2/production-geospatial-computing/source_contract.json", title: "Download the source acceptance contract" },
    { href: "lesson-resources/module-2/production-geospatial-computing/PRODUCTION_WORKFLOW_QA_TEMPLATE.md", title: "Download the production workflow QA template" },
  ],
  "lesson-2-52": [
    { href: "lesson-resources/module-2/production-geospatial-computing/manifest.json", title: "Download the checksum manifest" },
    { href: "lesson-resources/module-2/production-geospatial-computing/PRODUCTION_WORKFLOW_QA_TEMPLATE.md", title: "Download the container acceptance template" },
  ],
  "lesson-2-53": [
    { href: "lesson-resources/module-2/production-geospatial-computing/source_contract.json", title: "Download the deterministic fixture contract" },
    { href: "lesson-resources/module-2/production-geospatial-computing/PRODUCTION_WORKFLOW_QA_TEMPLATE.md", title: "Download the CI and release QA template" },
  ],
  "lesson-2-capstone": [
    { href: "lesson-resources/module-2/UAV_Satellite_Analysis_Pipeline_Starter.ipynb", title: "Download the capstone starter notebook" },
    { href: "lesson-resources/module-2/advanced-image-analysis/GEOSPATIAL_IMAGE_ANALYSIS_QA_TEMPLATE.md", title: "Download the advanced image-analysis QA template" },
    { href: "lesson-resources/module-2/production-geospatial-computing/PRODUCTION_WORKFLOW_QA_TEMPLATE.md", title: "Download the production release QA template" },
  ],
};

const module2NumberedAcademyLessons: AcademyLesson[] = publishedModule2Lessons.map((source) => {
  const pedagogy = module2LessonDetails[source.id];
  return {
    id: source.id,
    numberLabel: source.number,
    scheduleLabel: source.chapter === 13 ? "CAPSTONE" : `CHAPTER ${source.chapter}`,
    week: `CHAPTER ${source.chapter}`,
    title: source.title,
    description: source.description,
    tools: source.tools,
    content: pedagogy.content ?? readReviewedLesson(pedagogy.markdownFile),
    starterCode: source.code,
    images: [],
    resources: (module2LessonResources[source.id] ?? []).map((resource) => ({
      ...resource,
      href: publicAssetPath(resource.href),
    })),
    pedagogy,
    task: {
      title: `Submit ${source.artifact}`,
      instructions: `Upload ${source.artifact}, one QA image or map, and your scientific interpretation. Keep source data, processing decisions and limitations traceable.`,
      referenceImages: [],
      referenceMaps: [],
    },
  };
});

const module2PracticumAcademyLessons: AcademyLesson[] = module2ChapterPractica.map((source) => {
  const pedagogy = module2PracticumDetails[source.id];
  const resources = source.chapter === 12
    ? [
        { href: "lesson-resources/module-2/production-geospatial-computing/README.md", title: "Read the Chapter 12 practicum and training-pack guide" },
        { href: "lesson-resources/module-2/production-geospatial-computing/manifest.json", title: "Download the production checksum manifest" },
        { href: "lesson-resources/module-2/production-geospatial-computing/source_contract.json", title: "Download the production source contract" },
        { href: "lesson-resources/module-2/production-geospatial-computing/PRODUCTION_WORKFLOW_QA_TEMPLATE.md", title: "Download the Production Workflow QA template" },
      ]
    : source.chapter === 11
    ? [
        { href: "lesson-resources/module-2/advanced-image-analysis/README.md", title: "Read the Chapter 11 practicum and training-pack guide" },
        { href: "lesson-resources/module-2/advanced-image-analysis/manifest.json", title: "Download the image-analysis checksum manifest" },
        { href: "lesson-resources/module-2/advanced-image-analysis/patch_partition_inventory.csv", title: "Download the spatial partition inventory" },
        { href: "lesson-resources/module-2/advanced-image-analysis/GEOSPATIAL_IMAGE_ANALYSIS_QA_TEMPLATE.md", title: "Download the Image Analysis QA template" },
      ]
    : source.chapter === 10
    ? [
        { href: "lesson-resources/module-2/professional-gis-ecosystems/README.md", title: "Read the Chapter 10 practicum and training-pack guide" },
        { href: "lesson-resources/module-2/professional-gis-ecosystems/manifest.json", title: "Download the professional ecosystem checksum manifest" },
        { href: "lesson-resources/module-2/professional-gis-ecosystems/environment_constraints.json", title: "Download the synthetic environment constraints" },
        { href: "lesson-resources/module-2/professional-gis-ecosystems/sharing_risk_register.csv", title: "Download the sharing risk register" },
        { href: "lesson-resources/module-2/professional-gis-ecosystems/PROFESSIONAL_ECOSYSTEM_QA_TEMPLATE.md", title: "Download the Professional GIS Ecosystem QA template" },
      ]
    : source.chapter === 9
    ? [
        { href: "lesson-resources/module-2/web-gis-delivery/README.md", title: "Read the Chapter 9 practicum and training-pack guide" },
        { href: "lesson-resources/module-2/web-gis-delivery/manifest.json", title: "Download the Web GIS checksum manifest" },
        { href: "lesson-resources/module-2/web-gis-delivery/map_content_contract.json", title: "Download the public map content contract" },
        { href: "lesson-resources/module-2/web-gis-delivery/WEB_GIS_DELIVERY_QA_TEMPLATE.md", title: "Download the Web GIS delivery QA template" },
      ]
    : source.chapter === 8
    ? [
        { href: "lesson-resources/module-2/cloud-native-eo/README.md", title: "Read the Chapter 8 practicum and training-pack guide" },
        { href: "lesson-resources/module-2/cloud-native-eo/manifest.json", title: "Download the cloud-native EO checksum manifest" },
        { href: "lesson-resources/module-2/cloud-native-eo/CLOUD_NATIVE_EO_QA_TEMPLATE.md", title: "Download the cloud-native EO QA template" },
        { href: "lesson-resources/module-2/cloud-native-eo/stac_items_fixture.json", title: "Download the deterministic STAC ItemCollection" },
      ]
    : source.chapter === 7
    ? [
        { href: "lesson-resources/module-2/spatial-databases/README.md", title: "Read the spatial-database practicum and training-pack guide" },
        { href: "lesson-resources/module-2/spatial-databases/manifest.json", title: "Download the spatial-database checksum manifest" },
        { href: "lesson-resources/module-2/spatial-databases/schema.sql", title: "Download the reviewed teaching schema" },
        { href: "lesson-resources/module-2/spatial-databases/SPATIAL_DATABASE_QA_TEMPLATE.md", title: "Download the spatial database QA template" },
      ]
    : source.chapter === 6
    ? [
        { href: "lesson-resources/module-2/spatial-statistics/README.md", title: "Read the spatial-statistics practicum and training-pack guide" },
        { href: "lesson-resources/module-2/spatial-statistics/manifest.json", title: "Download the spatial-statistics checksum manifest" },
        { href: "lesson-resources/module-2/spatial-statistics/SPATIAL_INFERENCE_QA_TEMPLATE.md", title: "Download the spatial inference QA template" },
      ]
    : source.chapter === 5
    ? [
        { href: "lesson-resources/module-2/satellite-eo/README.md", title: "Read the satellite EO practicum and training-pack guide" },
        { href: "lesson-resources/module-2/satellite-eo/manifest.json", title: "Download the satellite EO checksum manifest" },
        { href: "lesson-resources/module-2/satellite-eo/SATELLITE_EO_QA_TEMPLATE.md", title: "Download the satellite EO QA template" },
      ]
    : source.chapter === 4
    ? [
        { href: "lesson-resources/module-2/uav-foundations/README.md", title: "Read the UAV practicum and training-pack guide" },
        { href: "lesson-resources/module-2/uav-foundations/manifest.json", title: "Download the UAV practicum manifest" },
      ]
    : source.chapter === 3
      ? [
        { href: "lesson-resources/module-2/raster-foundations/README.md", title: "Read the raster practicum and training-pack guide" },
        { href: "lesson-resources/module-2/raster-foundations/manifest.json", title: "Download the raster training-data manifest" },
      ]
      : [{
        href: "lesson-resources/module-2/vector-foundations/training_data_manifest.json",
        title: "Download the vector training-data manifest",
      }];
  return {
    id: source.id,
    kind: "practicum",
    numberLabel: "PRACTICUM",
    scheduleLabel: `CHAPTER ${source.chapter}`,
    week: `CHAPTER ${source.chapter}`,
    title: source.title,
    description: source.description,
    tools: [...source.tools],
    content: readReviewedLesson(pedagogy.markdownFile),
    starterCode: extractFirstPythonCode(readReviewedLesson(pedagogy.markdownFile)) ?? undefined,
    images: [],
    resources: resources.map((resource) => ({
      ...resource,
      href: publicAssetPath(resource.href),
    })),
    pedagogy,
    task: {
      title: `Submit ${source.artifact}`,
      instructions: `Upload the practicum decision record, supporting QA evidence and your scientific interpretation. Keep every decision linked to evidence, risk and a next action.`,
      referenceImages: [],
      referenceMaps: [],
    },
  };
});

const module2AcademyLessons: AcademyLesson[] = module2NumberedAcademyLessons.flatMap((lesson) => {
  if (lesson.id === "lesson-2-04") {
    return [lesson, module2PracticumAcademyLessons[0]];
  }
  if (lesson.id === "lesson-2-10") {
    return [lesson, module2PracticumAcademyLessons[1]];
  }
  if (lesson.id === "lesson-2-17") {
    return [lesson, module2PracticumAcademyLessons[2]];
  }
  if (lesson.id === "lesson-2-25") {
    return [lesson, module2PracticumAcademyLessons[3]];
  }
  if (lesson.id === "lesson-2-30") {
    return [lesson, module2PracticumAcademyLessons[4]];
  }
  if (lesson.id === "lesson-2-34") {
    return [lesson, module2PracticumAcademyLessons[5]];
  }
  if (lesson.id === "lesson-2-37") {
    return [lesson, module2PracticumAcademyLessons[6]];
  }
  if (lesson.id === "lesson-2-42") {
    return [lesson, module2PracticumAcademyLessons[7]];
  }
  if (lesson.id === "lesson-2-45") {
    return [lesson, module2PracticumAcademyLessons[8]];
  }
  if (lesson.id === "lesson-2-46") {
    return [lesson, module2PracticumAcademyLessons[9]];
  }
  if (lesson.id === "lesson-2-49") {
    return [lesson, module2PracticumAcademyLessons[10]];
  }
  if (lesson.id === "lesson-2-53") {
    return [lesson, module2PracticumAcademyLessons[11]];
  }
  return [lesson];
});

const module3LessonResources: Record<string, Array<{ href: string; title: string }>> = {
  "lesson-3-01": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Download the Environmental Monitoring Project starter notebook" },
    { href: "lesson-resources/module-3/modelling-foundations/README.md", title: "Read the modelling-foundations training-pack guide" },
    { href: "lesson-resources/module-3/modelling-foundations/scientific_statement_cards.csv", title: "Download the scientific claim classification cards" },
  ],
  "lesson-3-02": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/modelling-foundations/target_candidate_register.csv", title: "Download the target candidate register" },
    { href: "lesson-resources/module-3/modelling-foundations/TARGET_SPECIFICATION_TEMPLATE.md", title: "Download the target specification template" },
  ],
  "lesson-3-03": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/modelling-foundations/predictor_candidate_register.csv", title: "Download the predictor candidate register" },
    { href: "lesson-resources/module-3/modelling-foundations/predictor_hypotheses_template.csv", title: "Download the predictor hypotheses template" },
  ],
  "lesson-3-04": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/modelling-foundations/modelling_observation_fixture.csv", title: "Download the deliberately imperfect modelling-table fixture" },
    { href: "lesson-resources/module-3/modelling-foundations/data_dictionary_template.csv", title: "Download the modelling data-dictionary template" },
    { href: "lesson-resources/module-3/modelling-foundations/MODEL_EXPERIMENT_PLAN_TEMPLATE.md", title: "Download the model experiment plan template" },
    { href: "lesson-resources/module-3/modelling-foundations/manifest.json", title: "Download the training-pack checksum manifest" },
  ],
  "lesson-3-05": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/README.md", title: "Read the Chapter 2 synthetic training-pack guide" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/baseline_modelling_data.csv", title: "Download the saved-split baseline modelling fixture" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/BASELINE_REPORT_TEMPLATE.md", title: "Download the baseline evidence report template" },
  ],
  "lesson-3-06": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/baseline_modelling_data.csv", title: "Use the same saved-split ensemble comparison fixture" },
  ],
  "lesson-3-07": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/parameter_decision_record.csv", title: "Download the XGBoost parameter decision record" },
  ],
  "lesson-3-08": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/baseline_modelling_data.csv", title: "Download the first-model training fixture" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/MODEL_METADATA_TEMPLATE.json", title: "Download the model metadata template" },
    { href: "lesson-resources/module-3/baseline-and-xgboost/manifest.json", title: "Download the Chapter 2 checksum manifest" },
  ],
  "lesson-3-09": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/structured-validation/README.md", title: "Read the structured-validation training-pack guide" },
    { href: "lesson-resources/module-3/structured-validation/structured_validation_data.csv", title: "Download the structured validation fixture" },
    { href: "lesson-resources/module-3/structured-validation/VALIDATION_DESIGN_TEMPLATE.md", title: "Download the validation design template" },
  ],
  "lesson-3-10": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/structured-validation/structured_validation_data.csv", title: "Use the site and spatial-block validation fixture" },
    { href: "lesson-resources/module-3/structured-validation/fold_registry_template.csv", title: "Download the auditable fold registry template" },
  ],
  "lesson-3-11": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/structured-validation/structured_validation_data.csv", title: "Use the three-season temporal validation fixture" },
    { href: "lesson-resources/module-3/structured-validation/VALIDATION_DESIGN_TEMPLATE.md", title: "Extend the structured validation design" },
  ],
  "lesson-3-12": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Complete the Chapter 3 portfolio checkpoint" },
    { href: "lesson-resources/module-3/structured-validation/fold_registry_template.csv", title: "Download the nested fold registry template" },
    { href: "lesson-resources/module-3/structured-validation/LEAKAGE_CHECKLIST.md", title: "Download the structured validation leakage checklist" },
    { href: "lesson-resources/module-3/structured-validation/manifest.json", title: "Download the Chapter 3 checksum manifest" },
  ],
  "lesson-3-13": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/controlled-optimisation/README.md", title: "Read the controlled-optimisation training-pack guide" },
    { href: "lesson-resources/module-3/controlled-optimisation/TUNING_PROTOCOL_TEMPLATE.md", title: "Download the controlled tuning protocol template" },
    { href: "lesson-resources/module-3/controlled-optimisation/search_results_fixture.csv", title: "Download the synthetic bounded-search result fixture" },
  ],
  "lesson-3-14": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/controlled-optimisation/learning_dynamics_fixture.csv", title: "Download the synthetic learning-dynamics fixture" },
    { href: "lesson-resources/module-3/controlled-optimisation/LEARNING_DYNAMICS_TEMPLATE.md", title: "Download the learning dynamics report template" },
  ],
  "lesson-3-15": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/controlled-optimisation/feature_stability_fixture.csv", title: "Download the synthetic feature-stability fixture" },
    { href: "lesson-resources/module-3/controlled-optimisation/FEATURE_STABILITY_TEMPLATE.csv", title: "Download the feature stability report template" },
  ],
  "lesson-3-16": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Complete the Chapter 4 portfolio checkpoint" },
    { href: "lesson-resources/module-3/controlled-optimisation/rare_habitat_probabilities.csv", title: "Download the synthetic rare-habitat probability fixture" },
    { href: "lesson-resources/module-3/controlled-optimisation/THRESHOLD_DECISION_TEMPLATE.md", title: "Download the rare-habitat threshold decision template" },
    { href: "lesson-resources/module-3/controlled-optimisation/manifest.json", title: "Download the Chapter 4 checksum manifest" },
  ],
  "lesson-3-17": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/README.md", title: "Read the evaluation and applicability training-pack guide" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/regression_outer_predictions.csv", title: "Download the protected synthetic regression predictions" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/REGRESSION_EVALUATION_TEMPLATE.md", title: "Download the regression evaluation template" },
  ],
  "lesson-3-18": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/classification_outer_probabilities.csv", title: "Download the protected synthetic class probabilities" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/CLASSIFICATION_EVALUATION_TEMPLATE.md", title: "Download the classification and calibration template" },
  ],
  "lesson-3-19": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/diagnostic_context.csv", title: "Download the synthetic structured-failure context" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/MODEL_DIAGNOSTIC_TEMPLATE.md", title: "Download the Model Diagnostic Report template" },
  ],
  "lesson-3-20": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/INTERPRETATION_CLAIMS_TEMPLATE.md", title: "Download the interpretation claims and stability template" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/regression_outer_predictions.csv", title: "Reuse the protected diagnostic predictions" },
  ],
  "lesson-3-21": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Complete the Chapter 5 portfolio checkpoint" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/applicability_training_and_grid.csv", title: "Download the synthetic applicability vectors" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/DOMAIN_OF_APPLICABILITY_TEMPLATE.md", title: "Download the Domain of Applicability template" },
    { href: "lesson-resources/module-3/evaluation-and-applicability/manifest.json", title: "Download the Chapter 5 checksum manifest" },
  ],
  "lesson-3-22": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/prediction-uncertainty/README.md", title: "Read the prediction-uncertainty training-pack guide" },
    { href: "lesson-resources/module-3/prediction-uncertainty/UNCERTAINTY_INVENTORY_TEMPLATE.md", title: "Download the uncertainty inventory template" },
    { href: "lesson-resources/module-3/prediction-uncertainty/protected_interval_predictions.csv", title: "Download the protected synthetic interval predictions" },
  ],
  "lesson-3-23": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/prediction-uncertainty/protected_interval_predictions.csv", title: "Download the protected synthetic quantile predictions" },
    { href: "lesson-resources/module-3/prediction-uncertainty/QUANTILE_INTERVAL_REPORT_TEMPLATE.md", title: "Download the quantile interval report template" },
  ],
  "lesson-3-24": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/prediction-uncertainty/calibration_scores.csv", title: "Download the synthetic conformal calibration scores" },
    { href: "lesson-resources/module-3/prediction-uncertainty/CONFORMAL_COVERAGE_TEMPLATE.md", title: "Download the conformal coverage report template" },
  ],
  "lesson-3-25": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Complete the Chapter 6 portfolio checkpoint" },
    { href: "lesson-resources/module-3/prediction-uncertainty/prediction_evidence_grid.csv", title: "Download the synthetic prediction-evidence grid" },
    { href: "lesson-resources/module-3/prediction-uncertainty/PREDICTION_EVIDENCE_PACKAGE_TEMPLATE.md", title: "Download the Prediction Evidence Package template" },
    { href: "lesson-resources/module-3/prediction-uncertainty/manifest.json", title: "Download the Chapter 6 checksum manifest" },
  ],
  "lesson-3-26": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/operational-workflow/PREDICTION_SCHEMA_TEMPLATE.json", title: "Download the operational prediction-schema template" },
    { href: "lesson-resources/module-3/operational-workflow/INFERENCE_RUN_TEMPLATE.json", title: "Download the raster inference run template" },
  ],
  "lesson-3-27": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/operational-workflow/EARTH_ENGINE_COMPONENT_TEMPLATE.md", title: "Download the Earth Engine component template" },
    { href: "lesson-resources/module-3/operational-workflow/README.md", title: "Read the operational-workflow training-pack guide" },
  ],
  "lesson-3-28": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/operational-workflow/ARCHITECTURE_DECISION_TEMPLATE.md", title: "Download the modelling architecture decision template" },
  ],
  "lesson-3-29": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Continue the Environmental Monitoring Project notebook" },
    { href: "lesson-resources/module-3/operational-workflow/MONITORING_RUNBOOK_TEMPLATE.md", title: "Download the repeated-prediction monitoring runbook" },
    { href: "lesson-resources/module-3/operational-workflow/monitoring_runs_fixture.csv", title: "Download the synthetic monitoring-runs fixture" },
  ],
  "lesson-3-30": [
    { href: "lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb", title: "Download the complete Module 3 portfolio notebook" },
    { href: "lesson-resources/module-3/operational-workflow/MODEL_CARD_TEMPLATE.md", title: "Download the operational model-card template" },
    { href: "lesson-resources/module-3/operational-workflow/TRAINING_DATA_SUMMARY_TEMPLATE.json", title: "Download the training-data summary template" },
    { href: "lesson-resources/module-3/operational-workflow/manifest.json", title: "Download the Chapter 7 checksum manifest" },
  ],
  "lesson-3-capstone": [
    { href: "lesson-resources/module-3/environmental-monitoring-project/README.md", title: "Read the Environmental Monitoring Project capstone guide" },
    { href: "lesson-resources/module-3/environmental-monitoring-project/PROJECT_BRIEF_TEMPLATE.md", title: "Download the project brief and preregistration template" },
    { href: "lesson-resources/module-3/environmental-monitoring-project/CAPSTONE_RELEASE_GATE.md", title: "Download the capstone release gate" },
    { href: "lesson-resources/module-3/environmental-monitoring-project/GRADUATE_PROFILE_EVIDENCE_MATRIX.md", title: "Download the graduate-profile evidence matrix" },
    { href: "lesson-resources/module-3/environmental-monitoring-project/submission_manifest_template.json", title: "Download the submission manifest template" },
    { href: "lesson-resources/module-3/environmental-monitoring-project/manifest.json", title: "Download the capstone resource checksum manifest" },
  ],
};

const module3AcademyLessons: AcademyLesson[] = publishedModule3Lessons.map((source) => {
  const pedagogy = module3LessonDetails[source.id];
  const lessonContent = pedagogy.content ?? readReviewedLesson(pedagogy.markdownFile);
  return {
    id: source.id,
    numberLabel: source.number,
    scheduleLabel: source.id === "lesson-3-capstone" ? "CAPSTONE" : `CHAPTER ${source.chapter}`,
    week: `CHAPTER ${source.chapter}`,
    title: source.title,
    description: source.description,
    tools: source.tools,
    content: lessonContent,
    starterCode: source.code || extractFirstPythonCode(lessonContent) || undefined,
    images: [],
    resources: (module3LessonResources[source.id] ?? []).map((resource) => ({
      ...resource,
      href: publicAssetPath(resource.href),
    })),
    pedagogy,
    task: {
      title: `Submit ${source.artifact}`,
      instructions: source.id === "lesson-3-capstone"
        ? "Upload the complete clean-run repository, prediction evidence package, model card, scientific summary, management brief and graduate-profile evidence matrix. State the supported transfer claim, withheld areas, unresolved limitations and release decision explicitly."
        : `Upload ${source.artifact}, the relevant notebook checkpoint and a concise scientific justification. Make the supported prediction claim, evidence boundary and unresolved limitations explicit.`,
      referenceImages: [],
      referenceMaps: [],
    },
  };
});

export const academyCurriculumModules: AcademyCurriculumModule[] = [
  { overview: module1Overview, lessons: learnerLessons },
  { overview: module2Overview, lessons: module2AcademyLessons },
  { overview: module3Overview, lessons: module3AcademyLessons },
];

const homepageCurriculumModules: AcademyCurriculumModule[] = academyCurriculumModules.map((module) => ({
  overview: module.overview,
  lessons: module.lessons.map((lesson) => ({
    ...lesson,
    content: "",
    starterCode: undefined,
    images: [],
    resources: [],
    task: { ...lesson.task, referenceImages: [], referenceMaps: [] },
  })),
}));

function homeNavigationHref(label: string, href: string) {
  if (label === "Curriculum") return academyHref("/curriculum/");
  if (label === "About") return academyHref("/about/");
  return href;
}

export function AcademyHome({ routeByLessonId }: { routeByLessonId: Record<string, string> }) {
  const applicationTarget = content.application.openInNewTab ? "_blank" : undefined;
  const applicationRel = content.application.openInNewTab ? "noreferrer" : undefined;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <a className="brand" href={academyHref("/")} aria-label={`${content.metadata.title} home`}>
          <span className="brand-mark" aria-hidden="true">
            <span>{content.brand.mark}</span>
          </span>
          <span className="brand-name">
            {content.brand.lineOne}
            <strong>{content.brand.lineTwo}</strong>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {visibleNavigation.map((item) => (
            <a href={homeNavigationHref(item.label, item.href)} key={`${item.label}-${item.href}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {visibleNavigation.map((item) => (
              <a href={homeNavigationHref(item.label, item.href)} key={`${item.label}-${item.href}`}>
                {item.label}
              </a>
            ))}
            {content.navigation.showApplyButton && (
              <a className="mobile-apply" href={content.navigation.applyHref}>
                {content.navigation.applyLabel} ↗
              </a>
            )}
          </nav>
        </details>

        {content.navigation.showApplyButton && (
          <a className="header-cta" href={content.navigation.applyHref}>
            {content.navigation.applyLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="eyebrow">
              <span
                className={`status-dot${content.hero.admissionsOpen ? "" : " status-dot-closed"}`}
              />
              {content.hero.eyebrow}
            </div>
            <h1>
              {content.hero.title}
              <br />
              <em>{content.hero.accentTitle}</em>
            </h1>
            <p className="hero-intro">{content.hero.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={content.hero.primaryButtonHref}>
                {content.hero.primaryButtonLabel} <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href={content.hero.secondaryButtonHref}>
                {content.hero.secondaryButtonLabel} <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="note-line" aria-hidden="true" />
              {content.hero.notes.map((note, index) => (
                <Fragment key={note}>
                  {index > 0 && <span aria-hidden="true">·</span>}
                  <span>{note}</span>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label={content.hero.visualAriaLabel}>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="satellite">
              <span className="satellite-wing wing-left" />
              <span className="satellite-body" />
              <span className="satellite-wing wing-right" />
            </div>
            <div className="earth">
              <div className="earth-grid" />
              <div className="land land-one" />
              <div className="land land-two" />
              <div className="scan-line" />
            </div>
            <div className="telemetry telemetry-top">
              <span>{content.hero.telemetryTopLabel}</span>
              <strong>{content.hero.telemetryTopValue}</strong>
            </div>
            <div className="telemetry telemetry-bottom">
              <span>{content.hero.telemetryBottomLabel}</span>
              <strong>{content.hero.telemetryBottomValue}</strong>
            </div>
            <div className="crosshair crosshair-one">+</div>
            <div className="crosshair crosshair-two">+</div>
            <div className="visual-caption">
              <span>{content.hero.visualCaptionLeft}</span>
              <span>{content.hero.visualCaptionRight}</span>
            </div>
          </div>
        </section>

        <section className="signal-strip" aria-label="Curriculum scope">
          {content.signalStrip.map((signal, index) => (
            <Fragment key={signal}>
              <span>{signal}</span>
              {index < content.signalStrip.length - 1 && <i />}
            </Fragment>
          ))}
        </section>

        {content.pathsSection.visible && (
          <section className="section paths-section" id="paths">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{content.pathsSection.kicker}</p>
                <h2>
                  {content.pathsSection.titleLineOne}{" "}
                  <br />
                  {content.pathsSection.titleLineTwo}
                </h2>
              </div>
              <p className="section-summary">{content.pathsSection.summary}</p>
            </div>

            <ol className="path-progression" aria-label="One Academy journey through three stages">
              {visiblePaths.map((path) => (
                <li key={`progress-${path.number}`} aria-label={`${path.number} ${path.label}`}>
                  <span>{path.number}</span>
                </li>
              ))}
            </ol>

            <div className="path-grid" aria-label="Academy curriculum stages">
              {visiblePaths.map((path) => (
                <article className={`path-card path-${path.accent}`} key={path.number}>
                  <div className="path-topline">
                    <span>{path.label}</span>
                    <span>{path.number}</span>
                  </div>
                  <h3>{path.title}</h3>
                  <p className="path-description">{path.description}</p>

                  <div className="path-details">
                    <section className="path-detail path-learn" aria-labelledby={`learn-${path.number}`}>
                      <h4 id={`learn-${path.number}`}>Learn</h4>
                      <ul>
                        {path.skills.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="path-detail" aria-labelledby={`build-${path.number}`}>
                      <h4 id={`build-${path.number}`}>Build</h4>
                      <p>{path.build}</p>
                    </section>

                    <section className="path-detail" aria-labelledby={`outcome-${path.number}`}>
                      <h4 id={`outcome-${path.number}`}>Outcome</h4>
                      <p>{path.outcome}</p>
                    </section>
                  </div>

                  <div className="path-footer">
                    <a href={academyHref(`/module-${Number(path.number)}/`)} aria-label={`${path.ctaLabel}: ${path.title}`}>
                      {path.ctaLabel} <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {content.fieldLab.visible && (
          <section className="field-lab section" id="field-lab">
            <div className="lab-map" aria-label={content.fieldLab.mapAriaLabel}>
              <div className="contour contour-one" />
              <div className="contour contour-two" />
              <div className="contour contour-three" />
              <div className="burn-zone zone-one" />
              <div className="burn-zone zone-two" />
              <div className="burn-zone zone-three" />
              <div className="map-grid" />
              <div className="map-pin pin-one">A</div>
              <div className="map-pin pin-two">B</div>
              <div className="map-coordinates">{content.fieldLab.coordinates}</div>
              <div className="map-legend">
                <span>
                  <i className="legend-before" /> {content.fieldLab.legendBefore}
                </span>
                <span>
                  <i className="legend-after" /> {content.fieldLab.legendAfter}
                </span>
              </div>
            </div>

            <div className="lab-content">
              <p className="section-kicker">{content.fieldLab.kicker}</p>
              <h2>{content.fieldLab.title}</h2>
              <p className="lab-lead">{content.fieldLab.lead}</p>
              <ol className="lab-steps">
                {content.fieldLab.steps.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <a className="button button-dark" href={academyHref("/curriculum/")}>
                {content.fieldLab.buttonLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>
        )}

        {content.curriculum.visible && (
          <section className="section curriculum-section" id="curriculum">
            <div className="section-heading curriculum-heading">
              <div>
                <p className="section-kicker">{content.curriculum.kicker}</p>
                <h2>
                  {content.curriculum.titleLineOne}
                  <br />
                  {content.curriculum.titleLineTwo}
                </h2>
              </div>
              <div className="cohort-card">
                <span>{content.curriculum.cohortLabel}</span>
                <strong>{content.curriculum.cohortDate}</strong>
                <p>{content.curriculum.cohortMeta}</p>
              </div>
            </div>

            <LearnerCurriculum
              modules={homepageCurriculumModules}
              routeByLessonId={routeByLessonId}
              showLessonPanels={false}
            />
          </section>
        )}

        {content.outcomes.visible && (
          <section className="outcomes">
            <div className="outcomes-copy">
              <p className="section-kicker">{content.outcomes.kicker}</p>
              <h2>{content.outcomes.title}</h2>
              <p>{content.outcomes.description}</p>
            </div>
            <div className="outcomes-grid">
              {content.outcomes.items.map((outcome) => (
                <div className="outcome" key={outcome.label}>
                  <strong>{outcome.value}</strong>
                  <span>{outcome.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.application.visible && (
          <section className="apply-section" id="apply">
            <div className="apply-orbit" aria-hidden="true" />
            <div className="apply-copy">
              <p className="section-kicker light">{content.application.kicker}</p>
              <h2>{content.application.title}</h2>
              <p>{content.application.description}</p>
              <a
                className="button button-primary button-large"
                href={content.application.buttonHref}
                target={applicationTarget}
                rel={applicationRel}
              >
                {content.application.buttonLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="apply-meta">
              <span>{content.application.cohortMeta}</span>
              <span>{content.application.deadlineMeta}</span>
            </div>
          </section>
        )}

        <footer>
          <a className="brand footer-brand" href={academyHref("/")}>
            <span className="brand-mark">
              <span>{content.brand.mark}</span>
            </span>
            <span className="brand-name">
              {content.brand.lineOne}
              <strong>{content.brand.lineTwo}</strong>
            </span>
          </a>
          <p>{content.footer.description}</p>
          <div className="footer-links">
            {visibleNavigation.map((item) => (
              <a href={homeNavigationHref(item.label, item.href)} key={`${item.label}-${item.href}`}>
                {item.label}
              </a>
            ))}
            <a href={content.footer.contactHref}>{content.footer.contactLabel}</a>
          </div>
          <div className="footer-bottom">
            <span>{content.footer.copyright}</span>
            <span>{content.footer.manifesto}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
