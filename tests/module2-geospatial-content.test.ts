import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  MODULE2_SOFTWARE_VERSIONS,
  module2ChapterPractica,
  module2LessonDetails,
  module2Lessons,
  module2Overview,
  module2PracticumDetails,
  publishedModule2LessonIds,
  publishedModule2Lessons,
} from "../lib/module2-pedagogy";

function lessonMarkdown(lessonId: string) {
  const details = module2LessonDetails[lessonId];
  return readFileSync(join(process.cwd(), details.markdownFile), "utf8")
    .replace(/^---\n[\s\S]*?\n---\n+/, "");
}

function practicumMarkdown(practicumId: string) {
  const details = module2PracticumDetails[practicumId];
  return readFileSync(join(process.cwd(), details.markdownFile), "utf8")
    .replace(/^---\n[\s\S]*?\n---\n+/, "");
}

function fencedPythonBlocks(markdown: string) {
  return [...markdown.matchAll(/```python\n([\s\S]*?)```/g)].map((match) => match[1].trimEnd());
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

describe("Module 2 Geospatial Data Science", () => {
  it("keeps the complete pathway visible while publishing only reviewed lessons", () => {
    expect(module2Overview.title).toBe("Geospatial Data Science");
    expect(module2Overview.accent).toBe("blue");
    expect(module2Overview.chapters).toHaveLength(12);

    const chapterLessons = module2Overview.chapters.flatMap((chapter) => chapter.lessons);
    expect(chapterLessons).toHaveLength(53);
    expect(chapterLessons.map((item) => item.number)).toEqual(
      Array.from({ length: 53 }, (_, index) => index + 1),
    );
    expect(chapterLessons.filter((item) => item.status === "available")).toHaveLength(53);
    expect(chapterLessons.filter((item) => item.status === "planned")).toHaveLength(0);
    expect(chapterLessons.every((item) => item.lessonId)).toBe(true);
    expect(module2Overview.capstone?.status).toBe("available");
    expect(module2Overview.capstone?.lessonId).toBe("lesson-2-capstone");
    expect(module2Overview.navigationMeta).toBe("53 lessons · 12 practica · capstone available");
    expect(module2Overview.chapters[0].practicum?.lessonId).toBe("module-2-chapter-1-practicum");
    expect(module2Overview.chapters[1].practicum?.lessonId).toBe("module-2-chapter-2-practicum");
    expect(module2Overview.chapters[2].practicum?.lessonId).toBe("module-2-chapter-3-practicum");
    expect(module2Overview.chapters[3].practicum?.lessonId).toBe("module-2-chapter-4-practicum");
    expect(module2Overview.chapters[4].practicum?.lessonId).toBe("module-2-chapter-5-practicum");
    expect(module2Overview.chapters[5].practicum?.lessonId).toBe("module-2-chapter-6-practicum");
    expect(module2Overview.chapters[6].practicum?.lessonId).toBe("module-2-chapter-7-practicum");
    expect(module2Overview.chapters[7].practicum?.lessonId).toBe("module-2-chapter-8-practicum");
    expect(module2Overview.chapters[8].practicum?.lessonId).toBe("module-2-chapter-9-practicum");
    expect(module2Overview.chapters[9].practicum?.lessonId).toBe("module-2-chapter-10-practicum");
    expect(module2Overview.chapters[10].practicum?.lessonId).toBe("module-2-chapter-11-practicum");
    expect(module2Overview.chapters[11].practicum?.lessonId).toBe("module-2-chapter-12-practicum");
  });

  it("uses unique stable IDs for the 53-lesson syllabus and capstone", () => {
    const ids = module2Lessons.map((item) => item.id);
    expect(module2Lessons).toHaveLength(54);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.slice(0, 53)).toEqual(
      Array.from({ length: 53 }, (_, index) => `lesson-2-${String(index + 1).padStart(2, "0")}`),
    );
    expect(ids.at(-1)).toBe("lesson-2-capstone");
  });

  it("publishes all twelve reviewed chapters and the capstone", () => {
    expect(publishedModule2LessonIds).toEqual([
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
      "lesson-2-47",
      "lesson-2-48",
      "lesson-2-49",
      "lesson-2-50",
      "lesson-2-51",
      "lesson-2-52",
      "lesson-2-53",
      "lesson-2-capstone",
    ]);
    expect(publishedModule2Lessons.map((item) => item.id)).toEqual(publishedModule2LessonIds);
    expect(Object.keys(module2LessonDetails)).toEqual(publishedModule2LessonIds);
    expect(module2Lessons.every((item) => module2LessonDetails[item.id])).toBe(true);
  });

  it.each(publishedModule2Lessons)("$number $title is a complete reviewed lesson", (source) => {
    const details = module2LessonDetails[source.id];
    const content = lessonMarkdown(source.id);

    expect(existsSync(join(process.cwd(), details.markdownFile))).toBe(true);
    expect(content).toContain("### Learning outcome");
    expect(content).toContain("### Why this matters");
    expect(content).toContain("### Scientific context");
    expect(content).toContain("Worked example");
    expect(content).toContain("### Code walkthrough");
    expect(content).toContain("Common mistakes and recovery");
    expect(content).toContain("Guided practice");
    expect(content).toContain("Independent challenge");
    expect(content).toContain("### Scientific interpretation");
    expect(content).toContain("Reflection, submission and portfolio artifact");
    expect(content).toContain("### Submission");
    expect(content).toContain("### Portfolio artifact");
    expect(content).toContain(source.artifact);
    expect(wordCount(content)).toBeGreaterThanOrEqual(1_700);

    expect(details.formativeChecks.length).toBeGreaterThanOrEqual(3);
    expect(new Set(details.formativeChecks.map((check) => check.id)).size).toBe(details.formativeChecks.length);
    for (const check of details.formativeChecks) {
      expect(content).toContain(`[[CHECK:${check.id}]]`);
      expect(check.options.length).toBeGreaterThanOrEqual(3);
      expect(check.explanation.length).toBeGreaterThan(60);
    }
    expect(details.submissionChecklist.length).toBeGreaterThanOrEqual(5);
    expect(details.rubric.map((item) => item.dimension)).toEqual([
      "Technical correctness",
      "Conceptual understanding",
      "Reproducibility",
      "Scientific communication",
    ]);
    expect(details.technicalMetadata.coreReferences.every((item) => item.href.startsWith("https://"))).toBe(true);
    expect(details.technicalMetadata.furtherReading.every((item) => item.href.startsWith("https://"))).toBe(true);
    expect(details.lessonType).toBeTruthy();
    expect(details.technicalMetadata.pythonVersion).toBe(MODULE2_SOFTWARE_VERSIONS.python);
    expect(details.technicalMetadata.testedVersions).toEqual(expect.arrayContaining([
      { label: "GeoPandas", value: MODULE2_SOFTWARE_VERSIONS.geopandas },
      { label: "Shapely", value: MODULE2_SOFTWARE_VERSIONS.shapely },
      { label: "PyProj", value: MODULE2_SOFTWARE_VERSIONS.pyproj },
    ]));
  });

  it("adds twelve unnumbered, reviewed chapter practica", () => {
    expect(module2ChapterPractica.map((item) => item.id)).toEqual([
      "module-2-chapter-1-practicum",
      "module-2-chapter-2-practicum",
      "module-2-chapter-3-practicum",
      "module-2-chapter-4-practicum",
      "module-2-chapter-5-practicum",
      "module-2-chapter-6-practicum",
      "module-2-chapter-7-practicum",
      "module-2-chapter-8-practicum",
      "module-2-chapter-9-practicum",
      "module-2-chapter-10-practicum",
      "module-2-chapter-11-practicum",
      "module-2-chapter-12-practicum",
    ]);
    for (const practicum of module2ChapterPractica) {
      const details = module2PracticumDetails[practicum.id];
      const content = practicumMarkdown(practicum.id);
      expect(details.lessonType).toBe("Chapter Practicum");
      expect(details.formativeChecks).toHaveLength(3);
      expect(content).toContain(practicum.artifact);
      for (const check of details.formativeChecks) {
        expect(content).toContain(`[[CHECK:${check.id}]]`);
      }
    }
    expect(practicumMarkdown("module-2-chapter-1-practicum")).toContain("DATA_ACCEPTANCE_DECISION.md");
    expect(practicumMarkdown("module-2-chapter-1-practicum")).toMatch(/250–350 words maximum/i);
    expect(practicumMarkdown("module-2-chapter-2-practicum")).toContain("Vector Handover Review");
    expect(practicumMarkdown("module-2-chapter-2-practicum")).toContain("Professional Mistakes — Vector GIS");
    expect(practicumMarkdown("module-2-chapter-3-practicum")).toContain("Professional Mistakes — Raster Science");
    expect(practicumMarkdown("module-2-chapter-3-practicum")).toContain("RASTER_QA_REPORT.md");
    expect(practicumMarkdown("module-2-chapter-4-practicum")).toContain("Professional Mistakes — UAV and Photogrammetry");
    expect(practicumMarkdown("module-2-chapter-4-practicum")).toContain("UAV_PRODUCT_QA_REPORT.md");
    expect(practicumMarkdown("module-2-chapter-5-practicum")).toContain("Professional Mistakes — Satellite Earth Observation");
    expect(practicumMarkdown("module-2-chapter-5-practicum")).toContain("SATELLITE_EO_EVIDENCE_REPORT.md");
    expect(practicumMarkdown("module-2-chapter-6-practicum")).toContain("SPATIAL_INFERENCE_DECISION.md");
    expect(practicumMarkdown("module-2-chapter-7-practicum")).toContain("SPATIAL_DATABASE_HANDOVER_DECISION.md");
    expect(practicumMarkdown("module-2-chapter-8-practicum")).toContain("CLOUD_NATIVE_EO_RELEASE_DECISION.md");
    expect(practicumMarkdown("module-2-chapter-9-practicum")).toContain("WEB_GIS_RELEASE_DECISION.md");
    expect(practicumMarkdown("module-2-chapter-10-practicum")).toContain("PROFESSIONAL_ECOSYSTEM_DECISION.md");
    expect(practicumMarkdown("module-2-chapter-11-practicum")).toContain("IMAGE_ANALYSIS_RELEASE_DECISION.md");
    expect(practicumMarkdown("module-2-chapter-12-practicum")).toContain("PRODUCTION_RELEASE_DECISION.md");
  });

  it("covers the required professional reasoning in each lesson", () => {
    const lesson1 = lessonMarkdown("lesson-2-01");
    expect(lesson1).toMatch(/point, line or polygon/i);
    expect(lesson1).toMatch(/referenced grid/i);
    expect(lesson1).toMatch(/coordinates without a verified CRS/i);
    expect(lesson1).toMatch(/not claimed to contain published Baltic plot locations/i);
    for (const term of ["accuracy", "precision", "resolution", "uncertainty", "error"]) {
      expect(lesson1).toMatch(new RegExp(term, "i"));
    }

    const lesson2 = lessonMarkdown("lesson-2-02");
    expect(lesson2).toMatch(/geographic and projected CRSs/i);
    expect(lesson2).toContain("set_crs()");
    expect(lesson2).toContain("to_crs()");
    expect(lesson2).toMatch(/area of use/i);
    expect(lesson2).toMatch(/vertical CRS|vertical reference/i);
    expect(lesson2).toContain("DSM");
    expect(lesson2).toContain("DTM");
    expect(lesson2).toContain("Geod");
    expect(lesson2).toMatch(/geodesic distance/i);

    const lesson3 = lessonMarkdown("lesson-2-03");
    expect(lesson3).toMatch(/spatial support/i);
    expect(lesson3).toMatch(/mixed pixels/i);
    expect(lesson3).toContain("MAUP");
    expect(lesson3).toMatch(/5 cm UAV pixel/i);
    expect(lesson3).toMatch(/10 m Sentinel-2 pixel/i);
    expect(lesson3).toMatch(/temporal support/i);
    expect(lesson3).toMatch(/measurement process/i);

    const lesson4 = lessonMarkdown("lesson-2-04");
    for (const format of ["Shapefile", "GeoPackage", "GeoJSON", "GeoParquet", "GeoTIFF", "COG", "NetCDF", "Zarr"]) {
      expect(lesson4).toContain(format);
    }
    expect(lesson4).toMatch(/verify every conversion/i);

    const lesson5 = lessonMarkdown("lesson-2-05");
    expect(lesson5).toMatch(/active geometry/i);
    expect(lesson5).toContain("total_bounds");
    expect(lesson5).toMatch(/missing and empty geometry/i);
    expect(lesson5).toMatch(/reopened and compared/i);

    const lesson6 = lessonMarkdown("lesson-2-06");
    for (const concept of ["Point", "LineString", "Polygon", "centroid", "buffer", "intersection", "union", "distance", "multipart"]) {
      expect(lesson6).toMatch(new RegExp(concept, "i"));
    }
    expect(lesson6).toMatch(/Valid geometry ≠ valid scientific design/i);

    const lesson7 = lessonMarkdown("lesson-2-07");
    expect(lesson7).toMatch(/attribute join/i);
    expect(lesson7).toContain("sjoin_nearest()");
    expect(lesson7).toMatch(/one-to-many/i);
    expect(lesson7).toMatch(/input and output row counts/i);
    expect(lesson7).toMatch(/overlay creates new geometry/i);

    const lesson8 = lessonMarkdown("lesson-2-08");
    expect(lesson8).toMatch(/n × m/i);
    expect(lesson8).toMatch(/bounding-box candidate/i);
    expect(lesson8).toMatch(/broad phase/i);
    expect(lesson8).toContain("sindex.query");
    expect(lesson8).toMatch(/stable identifier-pair sets/i);
    expect(lesson8).toMatch(/already use spatial indexing/i);
    expect(lesson8).toContain("sjoin(");
    expect(lesson8).toMatch(/rows\/matches\/unmatched\/one-to-many/i);
    expect(lesson8).toMatch(/memory/i);

    const lesson9 = lessonMarkdown("lesson-2-09");
    for (const operation of ["make_valid()", "explode()", "dissolve", "clip"]) {
      expect(lesson9).toContain(operation);
    }
    expect(lesson9).toMatch(/immutable source/i);
    expect(lesson9).toMatch(/no universal sliver-area threshold/i);
    expect(lesson9).toMatch(/normalise coordinate ordering/i);
    expect(lesson9).toMatch(/validity is a computational property/i);
    expect(lesson9).toMatch(/individually valid feature does \*\*not\*\* prove dataset-level topology/i);
    for (const condition of ["overlap", "gap", "unintended interior holes", "adjacency", "snapping", "floating-point", "tolerance"]) {
      expect(lesson9).toMatch(new RegExp(condition, "i"));
    }

    const lesson10 = lessonMarkdown("lesson-2-10");
    expect(lesson10).toMatch(/Python performs reproducible processing/i);
    expect(lesson10).toMatch(/on the fly/i);
    expect(lesson10).toContain("Check validity");
    expect(lesson10).toMatch(/raster[\s\S]*CRS[\s\S]*extent[\s\S]*dimensions[\s\S]*pixel size[\s\S]*bands[\s\S]*data type[\s\S]*NoData/i);
    expect(lesson10).toMatch(/Export both PDF and PNG/i);
    expect(lesson10).toMatch(/reopen both/i);
    expect(lesson10).toMatch(/TP04/);
    expect(lesson10).toMatch(/TP05/);
    expect(lesson10).toMatch(/Visual agreement[\s\S]*cannot establish/i);
  });

  it("keeps worked Python examples compact and syntactically valid", () => {
    for (const source of publishedModule2Lessons) {
      for (const block of fencedPythonBlocks(lessonMarkdown(source.id))) {
        expect(block.split("\n").length).toBeLessThanOrEqual(20);
        const result = spawnSync("python3", ["-c", `compile(${JSON.stringify(block)}, '<lesson>', 'exec')`]);
        expect(result.status, result.stderr.toString()).toBe(0);
      }
    }
  });

  it("uses explanatory diagrams and avoids unfinished or irrelevant teaching copy", () => {
    const allContent = publishedModule2Lessons.map((item) => lessonMarkdown(item.id)).join("\n");
    for (const diagram of [
      "geospatial-evidence-chain.svg",
      "crs-assign-vs-transform.svg",
      "spatial-support-scales.svg",
      "geospatial-format-decision.svg",
      "geodataframe-spatial-audit.svg",
      "shapely-geometry-decisions.svg",
      "spatial-join-cardinality.svg",
      "spatial-index-two-stage.svg",
      "vector-cleaning-decision-log.svg",
      "qgis-python-qa-loop.svg",
      "raster-anatomy.svg",
      "affine-transform-grid.svg",
      "crop-mask-reproject-resample.svg",
      "raster-grid-alignment.svg",
      "raster-vector-support.svg",
      "windowed-raster-processing.svg",
      "dem-dsm-dtm.svg",
      "uav-sensor-system.svg",
      "flight-overlap-gsd.svg",
      "radiometric-calibration.svg",
      "gcp-rtk-ppk.svg",
      "sfm-workflow.svg",
      "pointcloud-dsm-dtm-orthomosaic.svg",
      "uav-qa-chain.svg",
      "multispectral-stack.svg",
    ]) {
      expect(allContent).toContain(`lesson-media/images/${diagram}`);
      expect(existsSync(join(process.cwd(), "public/lesson-media/images", diagram))).toBe(true);
    }
    expect(allContent).not.toMatch(/lorem ipsum|coming soon|placeholder|shopping cart|fruit list|bank account/i);
  });

  it("provides explicit synthetic vector training data without inventing published plot locations", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/vector-foundations");
    const expectedFiles = [
      ["training_field_plots.geojson", 5],
      ["training_study_area.geojson", 1],
      ["training_management_zones.geojson", 2],
      ["training_vegetation_zones.geojson", 2],
      ["training_topology_cases.geojson", 5],
      ["training_topology_corrupted.geojson", 7],
    ] as const;

    for (const [filename, featureCount] of expectedFiles) {
      const source = JSON.parse(readFileSync(join(folder, filename), "utf8")) as {
        type: string;
        features: Array<{ geometry: { type: string } }>;
      };
      expect(source.type).toBe("FeatureCollection");
      expect(source.features).toHaveLength(featureCount);
      expect(source.features.every((feature) => Boolean(feature.geometry.type))).toBe(true);
    }

    const readme = readFileSync(join(folder, "README.md"), "utf8");
    expect(readme).toMatch(/synthetic and exists only for instruction/i);
    expect(readme).toMatch(/do not contain published Baltic coastal-meadow plot locations/i);
    expect(readme).toContain("Zenodo record 20083250");

    const qgisChecklist = readFileSync(join(folder, "QGIS_Vector_QA_Checklist.md"), "utf8");
    const qgisLog = readFileSync(join(folder, "qgis_qa_observations.csv"), "utf8");
    expect(qgisChecklist).toMatch(/project CRS and measurement units/i);
    expect(qgisChecklist).toMatch(/not permission to edit source data/i);
    expect(qgisLog).toContain("affected_ids");
    expect(qgisLog).toContain("decision_owner");

    const corrupted = readFileSync(join(folder, "training_topology_corrupted.geojson"), "utf8");
    for (const condition of ["overlap", "gap", "self-intersection", "duplicate", "sliver"]) {
      expect(corrupted).toMatch(new RegExp(condition, "i"));
    }

    const manifest = JSON.parse(readFileSync(join(folder, "training_data_manifest.json"), "utf8")) as {
      assets: Array<{
        filename: string;
        purpose: string;
        crs: string | null;
        geometryType: string;
        featureCount: number | null;
        expectedQaBehavior: string;
        licenseStatus: string;
        sha256: string;
      }>;
    };
    expect(manifest.assets.length).toBeGreaterThanOrEqual(8);
    for (const asset of manifest.assets) {
      expect(asset.purpose).toBeTruthy();
      expect(asset.geometryType).toBeTruthy();
      expect(asset.expectedQaBehavior).toBeTruthy();
      expect(asset.licenseStatus).toBeTruthy();
      const actual = createHash("sha256").update(readFileSync(join(folder, asset.filename))).digest("hex");
      expect(actual, `${asset.filename} checksum`).toBe(asset.sha256);
    }
  });

  it("teaches the complete Raster Science decision chain", () => {
    const rasterLessons = Array.from({ length: 7 }, (_, index) =>
      lessonMarkdown(`lesson-2-${String(index + 11).padStart(2, "0")}`),
    );
    const [anatomy, rasterio, operations, alignment, extraction, largeRaster, terrain] = rasterLessons;

    for (const term of ["transform", "CRS", "NoData", "mask", "cell centre", "categorical", "continuous"]) {
      expect(anatomy).toMatch(new RegExp(term, "i"));
    }
    expect(rasterio).toMatch(/context manager/i);
    expect(rasterio).toMatch(/reopen/i);
    for (const operation of ["crop", "mask", "reproject", "resample"]) {
      expect(operations).toMatch(new RegExp(operation, "i"));
    }
    expect(operations).toMatch(/nearest neighbour/i);
    expect(alignment).toMatch(/same CRS[\s\S]*not enough|same CRS is not enough/i);
    expect(alignment).toMatch(/transform[\s\S]*resolution[\s\S]*shape[\s\S]*bounds/i);
    expect(extraction).toMatch(/point sampling/i);
    expect(extraction).toMatch(/zonal statistics/i);
    expect(largeRaster).toMatch(/window/i);
    expect(largeRaster).toMatch(/halo/i);
    expect(terrain).toMatch(/DEM[\s\S]*DSM[\s\S]*DTM/i);
    expect(terrain).toMatch(/vertical reference/i);
    expect(terrain).toMatch(/slope[\s\S]*aspect[\s\S]*hillshade/i);

    for (const source of publishedModule2Lessons.filter((item) => item.chapter === 3)) {
      expect(module2LessonDetails[source.id].technicalMetadata.testedVersions).toEqual(expect.arrayContaining([
        { label: "NumPy", value: MODULE2_SOFTWARE_VERSIONS.numpy },
        { label: "Rasterio", value: MODULE2_SOFTWARE_VERSIONS.rasterio },
        { label: "QGIS", value: MODULE2_SOFTWARE_VERSIONS.qgis },
      ]));
    }
  });

  it("ships a complete checksummed synthetic raster training pack", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/raster-foundations");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      assets: Array<{
        filename: string;
        purpose: string;
        crs: string | null;
        transform: number[];
        resolution: number[];
        shape: number[];
        bounds: number[];
        bandCount: number;
        dtype: string;
        nodata: number | null;
        semanticType: string;
        units: string;
        expectedQaBehavior: string;
        syntheticOpenStatus: string;
        sha256: string;
      }>;
      supportVectors: Array<{ filename: string; sha256: string }>;
    };

    expect(manifest.licence).toMatch(/^CC0/);
    expect(manifest.assets.length).toBeGreaterThanOrEqual(15);
    for (const asset of manifest.assets) {
      expect(asset.purpose).toBeTruthy();
      expect(asset.transform).toHaveLength(6);
      expect(asset.resolution).toHaveLength(2);
      expect(asset.shape).toHaveLength(2);
      expect(asset.bounds).toHaveLength(4);
      expect(asset.bandCount).toBeGreaterThanOrEqual(1);
      expect(asset.dtype).toBeTruthy();
      expect(asset.semanticType).toBeTruthy();
      expect(asset.units).toBeTruthy();
      expect(asset.expectedQaBehavior).toBeTruthy();
      expect(asset.syntheticOpenStatus).toMatch(/synthetic/i);
      const actual = createHash("sha256").update(readFileSync(join(folder, asset.filename))).digest("hex");
      expect(actual, `${asset.filename} checksum`).toBe(asset.sha256);
    }
    for (const vector of manifest.supportVectors) {
      const actual = createHash("sha256").update(readFileSync(join(folder, vector.filename))).digest("hex");
      expect(actual, `${vector.filename} checksum`).toBe(vector.sha256);
    }
    const guide = readFileSync(join(folder, "README.md"), "utf8");
    expect(guide).toMatch(/synthetic/i);
    expect(guide).toMatch(/EPSG:3301/);
    expect(guide).toMatch(/NoData/i);
  });

  it("teaches the complete UAV acquisition-to-analysis evidence chain", () => {
    const uavLessons = Array.from({ length: 8 }, (_, index) =>
      lessonMarkdown(`lesson-2-${String(index + 18).padStart(2, "0")}`),
    );
    const [fundamentals, mission, radiometry, georeferencing, sfm, products, qa, multispectral] = uavLessons;

    for (const sensor of ["RGB", "multispectral", "thermal", "LiDAR"]) {
      expect(fundamentals).toMatch(new RegExp(sensor, "i"));
    }
    expect(fundamentals).toMatch(/orthomosaic is derived evidence/i);
    expect(fundamentals).toMatch(/GSD does \*\*not\*\* equal/i);
    expect(mission).toMatch(/GSD ≈ sensor pixel size × height above ground \/ focal length/i);
    expect(mission).toMatch(/forward overlap/i);
    expect(mission).toMatch(/side overlap/i);
    expect(mission).toMatch(/rolling shutter/i);
    expect(radiometry).toMatch(/digital number|DN/i);
    expect(radiometry).toMatch(/radiance/i);
    expect(radiometry).toMatch(/reflectance/i);
    expect(radiometry).toMatch(/reference panel/i);
    expect(radiometry).toMatch(/irradiance sensor/i);
    expect(georeferencing).toMatch(/GCP/i);
    expect(georeferencing).toMatch(/check point/i);
    expect(georeferencing).toMatch(/RTK/i);
    expect(georeferencing).toMatch(/PPK/i);
    expect(georeferencing).toMatch(/planimetric RMSE/i);
    expect(sfm).toMatch(/feature detection/i);
    expect(sfm).toMatch(/bundle adjustment/i);
    expect(sfm).toMatch(/reprojection error is useful but limited/i);
    expect(products).toMatch(/sparse point cloud/i);
    expect(products).toMatch(/dense point cloud/i);
    expect(products).toMatch(/orthorectification/i);
    expect(products).toMatch(/seamline/i);
    for (const category of ["Mission QA", "Image QA", "Photogrammetry QA", "Georeferencing QA", "Orthomosaic QA", "DSM QA", "Multispectral QA", "Temporal QA"]) {
      expect(qa).toContain(category);
    }
    expect(multispectral).toContain("NDVI");
    expect(multispectral).toContain("GNDVI");
    expect(multispectral).toMatch(/Red-edge NDVI must remain blocked/i);

    for (const source of publishedModule2Lessons.filter((item) => item.chapter === 4)) {
      expect(module2LessonDetails[source.id].technicalMetadata.testedVersions).toEqual(expect.arrayContaining([
        { label: "pandas", value: MODULE2_SOFTWARE_VERSIONS.pandas },
        { label: "NumPy", value: MODULE2_SOFTWARE_VERSIONS.numpy },
        { label: "Rasterio", value: MODULE2_SOFTWARE_VERSIONS.rasterio },
        { label: "QGIS", value: MODULE2_SOFTWARE_VERSIONS.qgis },
      ]));
    }
  });

  it("ships a checksummed UAV pack with every deliberate QA condition", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/uav-foundations");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      knownDeliberateConditions: string[];
      assets: Array<{
        filename: string;
        purpose: string;
        dataType: string;
        sourceStatus: string;
        crs: string | null;
        resolution: number[] | null;
        shape: Array<number | null>;
        nodata: number | null;
        semanticMeaning: string;
        expectedQaIssue: string;
        checksum: string;
        licenceStatus: string;
      }>;
    };

    expect(manifest.licence).toMatch(/^CC0/);
    expect(manifest.assets).toHaveLength(16);
    expect(manifest.knownDeliberateConditions).toEqual(expect.arrayContaining([
      "variable illumination",
      "weak south-east georeferencing",
      "half-pixel NIR shift",
      "orthomosaic seam and ghosting",
      "DSM spike and pit",
      "four-day temporal mismatch",
      "inconsistent NoData values",
      "ambiguous Red Edge reflectance scale",
    ]));
    for (const asset of manifest.assets) {
      expect(asset.purpose).toBeTruthy();
      expect(asset.dataType).toBeTruthy();
      expect(asset.sourceStatus).toMatch(/synthetic/i);
      expect(asset.shape).toHaveLength(2);
      expect(asset.semanticMeaning).toBeTruthy();
      expect(asset.expectedQaIssue).toBeTruthy();
      expect(asset.licenceStatus).toMatch(/CC0/i);
      const actual = createHash("sha256").update(readFileSync(join(folder, asset.filename))).digest("hex");
      expect(actual, `${asset.filename} checksum`).toBe(asset.checksum);
    }

    const mission = readFileSync(join(folder, "mission_metadata.csv"), "utf8");
    const images = readFileSync(join(folder, "image_metadata.csv"), "utf8");
    const controls = readFileSync(join(folder, "gcp_residuals.csv"), "utf8");
    const checks = readFileSync(join(folder, "checkpoint_residuals.csv"), "utf8");
    expect(mission).toContain("forward_overlap_pct");
    expect(mission).toContain("field_sampling_date");
    expect(images).toContain("saturation_fraction");
    expect(controls).toContain(",control,");
    expect(checks).toContain(",check,");
    expect(checks).toContain("south-east weak block");

    for (const filename of ["study_area.geojson", "field_plots.geojson"]) {
      const source = JSON.parse(readFileSync(join(folder, filename), "utf8")) as { type: string; features: unknown[] };
      expect(source.type).toBe("FeatureCollection");
      expect(source.features.length).toBeGreaterThan(0);
    }
  });

  it("defines the tested Chapter 4 calculations and stop conditions", () => {
    const pixelSizeMm = 13.2 / 5472;
    const gsdM = pixelSizeMm * 80 / 8.8;
    const footprintWidthM = 80 * 13.2 / 8.8;
    const footprintHeightM = 80 * 8.8 / 8.8;
    expect(gsdM).toBeCloseTo(0.02192982456, 10);
    expect(footprintWidthM).toBeCloseTo(120, 10);
    expect(footprintHeightM).toBeCloseTo(80, 10);
    expect(footprintHeightM * (1 - 0.8)).toBeCloseTo(16, 10);
    expect(footprintWidthM * (1 - 0.7)).toBeCloseTo(36, 10);

    const practicum = practicumMarkdown("module-2-chapter-4-practicum");
    for (const deliverable of [
      "mission_audit.csv", "georeferencing_report.csv", "raster_alignment_report.csv", "radiometric_qa.csv",
      "uav_qa_matrix.csv", "uav_stack_manifest.csv", "extraction_table.csv", "qa_map.pdf",
      "UAV_PRODUCT_QA_REPORT.md", "uav_practicum.ipynb",
    ]) {
      expect(practicum).toContain(deliverable);
    }
    expect(practicum).toContain("Automatic revision required");
    expect(practicum).toContain("GSD is presented as positional accuracy");
    expect(practicum).toContain("Professional Mistakes — UAV and Photogrammetry");
    expect((practicum.match(/^\| [^|]+ \|/gm) ?? []).length).toBeGreaterThanOrEqual(20);
  });

  it("teaches Chapter 5 as measurement physics, QA and interpretation rather than sensor marketing", () => {
    const optical = lessonMarkdown("lesson-2-26");
    for (const term of ["observation chain", "radiance", "top-of-atmosphere reflectance", "surface reflectance", "L2A", "L2SP", "0.0000275", "-0.2", "cloud shadow", "native support"]) {
      expect(optical).toMatch(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    }
    expect(optical).toMatch(/four kinds of resolution/i);
    expect(optical).toMatch(/nominal revisit is therefore not usable frequency/i);

    const indices = lessonMarkdown("lesson-2-27");
    for (const term of ["NDVI", "GNDVI", "SAVI", "MSAVI", "joint mask", "epsilon", "additive offset", "saturation", "native resolution", "proxy"]) {
      expect(indices).toMatch(new RegExp(term, "i"));
    }
    expect(indices).toMatch(/does not measure biomass directly/i);

    const sar = lessonMarkdown("lesson-2-28");
    for (const term of ["active microwave", "C-band", "VV", "VH", "incidence angle", "speckle", "relative orbit", "terrain correction", "linear power", "decibels"]) {
      expect(sar).toMatch(new RegExp(term, "i"));
    }
    expect(sar).toMatch(/moisture, roughness, structure and angle/i);

    const spectroscopy = lessonMarkdown("lesson-2-29");
    for (const term of ["spectral response function", "bandwidth", "absorption feature", "red edge", "signal-to-noise", "bad-band", "dimensionality", "mixed pixels", "training folds"]) {
      expect(spectroscopy).toMatch(new RegExp(term, "i"));
    }
    expect(spectroscopy).toMatch(/nanometres and micrometres/i);

    const lidar = lessonMarkdown("lesson-2-30");
    for (const term of ["return number", "classification", "point density", "vertical reference", "DTM", "DSM", "canopy height model", "negative canopy heights", "intensity"]) {
      expect(lidar).toMatch(new RegExp(term, "i"));
    }
    expect(lidar).toMatch(/point density from spatial accuracy/i);
  });

  it("publishes a checksum-verified synthetic satellite EO training pack", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/satellite-eo");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      sourceStatus: string;
      knownDeliberateConditions: string[];
      assets: Array<{ filename: string; purpose: string; dataType: string; sha256: string }>;
    };
    expect(manifest.licence).toBe("CC0-1.0");
    expect(manifest.sourceStatus).toMatch(/entirely synthetic/i);
    expect(manifest.assets).toHaveLength(7);
    expect(manifest.knownDeliberateConditions).toHaveLength(4);
    for (const asset of manifest.assets) {
      expect(asset.purpose).toBeTruthy();
      expect(asset.dataType).toBeTruthy();
      const actual = createHash("sha256").update(readFileSync(join(folder, asset.filename))).digest("hex");
      expect(actual, `${asset.filename} checksum`).toBe(asset.sha256);
    }
    expect(readFileSync(join(folder, "optical_observation_inventory.csv"), "utf8")).toContain("top-of-atmosphere source lacks surface-reflectance conversion");
    expect(readFileSync(join(folder, "sentinel1_backscatter_samples.csv"), "utf8")).toContain("incompatible orbit geometry");
    expect(readFileSync(join(folder, "hyperspectral_signatures.csv"), "utf8")).toContain("strong atmospheric water absorption");
    expect(readFileSync(join(folder, "lidar_point_samples.csv"), "utf8")).toContain("deliberate high outlier");
  });

  it("requires the complete cross-sensor Chapter 5 practicum delivery", () => {
    const practicum = practicumMarkdown("module-2-chapter-5-practicum");
    for (const deliverable of [
      "satellite_observation_inventory.csv", "optical_qa_report.csv", "spectral_index_report.csv",
      "sar_comparability_report.csv", "hyperspectral_feature_report.csv", "lidar_structure_report.csv",
      "satellite_evidence_map.pdf", "SATELLITE_EO_EVIDENCE_REPORT.md", "satellite_eo_practicum.ipynb",
    ]) {
      expect(practicum).toContain(deliverable);
    }
    expect(practicum).toContain("Professional Mistakes — Satellite Earth Observation");
    expect((practicum.match(/^\| [^|]+ \|/gm) ?? []).length).toBeGreaterThanOrEqual(20);
    expect(practicum).toMatch(/convergent evidence/i);
    expect(practicum).toMatch(/divergent evidence/i);
    expect(practicum).toMatch(/insufficient evidence/i);
  });

  it("teaches Chapter 6 as design-aware spatial inference rather than a statistics menu", () => {
    const autocorrelation = lessonMarkdown("lesson-2-31");
    for (const term of ["spatial-weights matrix", "Moran's I", "row standardisation", "island", "edge effects", "permutation inference", "not evidence that elevation"] ) {
      expect(autocorrelation).toMatch(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    }

    const sampling = lessonMarkdown("lesson-2-32");
    for (const term of ["target population", "sampling frame", "simple random", "systematic", "stratified", "cluster sampling", "inclusion probability", "accessibility", "spatial balance"]) {
      expect(sampling).toMatch(new RegExp(term, "i"));
    }
    expect(sampling).toMatch(/more observations do not repair|does not remove selection bias/i);

    const interpolation = lessonMarkdown("lesson-2-33");
    for (const term of ["inverse-distance weighting", "trend surface", "ordinary kriging", "semivariogram", "nugget", "sill", "range", "anisotropy", "prediction variance", "extrapolation"]) {
      expect(interpolation).toMatch(new RegExp(term, "i"));
    }
    expect(interpolation).toMatch(/separated spatial holdouts|spatial blocks/i);

    const regression = lessonMarkdown("lesson-2-34");
    for (const term of ["baseline", "residual", "spatial-lag", "spatial-error", "SLX", "geographically weighted", "spatial leakage", "causal"] ) {
      expect(regression).toMatch(new RegExp(term, "i"));
    }
    expect(regression).toMatch(/process hypothesis/i);
  });

  it("publishes a checksum-verified synthetic spatial-statistics training pack", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/spatial-statistics");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      sourceStatus: string;
      coordinateStatus: string;
      knownDeliberateConditions: string[];
      assets: Array<{ filename: string; purpose: string; dataType: string; sha256: string }>;
    };
    expect(manifest.licence).toBe("CC0-1.0");
    expect(manifest.sourceStatus).toMatch(/entirely synthetic/i);
    expect(manifest.coordinateStatus).toMatch(/local metric grid/i);
    expect(manifest.assets).toHaveLength(5);
    expect(manifest.knownDeliberateConditions).toHaveLength(4);
    for (const asset of manifest.assets) {
      expect(asset.purpose).toBeTruthy();
      expect(asset.dataType).toBeTruthy();
      const actual = createHash("sha256").update(readFileSync(join(folder, asset.filename))).digest("hex");
      expect(actual, `${asset.filename} checksum`).toBe(asset.sha256);
    }
    expect(readFileSync(join(folder, "meadow_plot_observations.csv"), "utf8")).toContain("inclusion probability undocumented");
    expect(readFileSync(join(folder, "sampling_frame.csv"), "utf8")).toContain("protected nesting area");
    expect(readFileSync(join(folder, "spatial_validation_blocks.csv"), "utf8")).toContain("isolated targeted observation");
  });

  it("requires the complete Chapter 6 spatial-inference practicum delivery", () => {
    const practicum = practicumMarkdown("module-2-chapter-6-practicum");
    for (const deliverable of [
      "README.md", "spatial_sampling_audit.csv", "weights_sensitivity.csv",
      "interpolation_validation.csv", "residual_diagnostics.csv", "model_comparison.csv",
      "spatial_inference_map.pdf", "SPATIAL_INFERENCE_DECISION.md", "spatial_statistics_practicum.ipynb",
    ]) {
      expect(practicum).toContain(deliverable);
    }
    expect(practicum).toContain("Professional Mistakes — Spatial Statistics and Geostatistics");
    expect((practicum.match(/^\| [^|]+ \|/gm) ?? []).length).toBeGreaterThanOrEqual(25);
    expect(practicum).toMatch(/Automatic revision is required/i);
    expect(practicum).toMatch(/release for exploratory survey planning/i);
  });

  it("teaches Chapter 7 as governed scientific evidence rather than database syntax alone", () => {
    const sql = lessonMarkdown("lesson-2-35");
    for (const term of ["SELECT", "FROM", "WHERE", "GROUP BY", "JOIN", "primary key", "foreign key", "cardinality", "LEFT JOIN", "NULL", "distinct"] ) {
      expect(sql).toMatch(new RegExp(term, "i"));
    }
    expect(sql).toMatch(/query declares a population|declaration of which records become evidence/i);

    const postgis = lessonMarkdown("lesson-2-36");
    for (const term of ["geometry", "geography", "SRID", "GiST", "ST_Intersects", "ST_Within", "ST_Buffer", "ST_Distance", "ST_DWithin", "ST_Transform", "GeoPandas"] ) {
      expect(postgis).toMatch(new RegExp(term, "i"));
    }
    expect(postgis).toMatch(/boundary review|boundary ambiguity/i);
    expect(postgis).toMatch(/bounding-box candidate|bounding box candidate/i);

    const storage = lessonMarkdown("lesson-2-37");
    for (const term of ["GeoPackage", "GeoParquet", "PostGIS", "object storage", "authoritative", "access copy", "index", "partition", "provenance", "restore test", "least privilege"] ) {
      expect(storage).toMatch(new RegExp(term, "i"));
    }
    expect(storage).toMatch(/one update authority|one write authority/i);
  });

  it("publishes a checksum-verified synthetic spatial-database training pack", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/spatial-databases");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      sourceStatus: string;
      coordinateStatus: string;
      knownDeliberateConditions: string[];
      assets: Array<{ filename: string; purpose: string; dataType: string; sha256: string }>;
    };
    expect(manifest.licence).toBe("CC0-1.0");
    expect(manifest.sourceStatus).toMatch(/entirely synthetic/i);
    expect(manifest.coordinateStatus).toMatch(/invented/i);
    expect(manifest.assets).toHaveLength(8);
    expect(manifest.knownDeliberateConditions).toHaveLength(5);
    for (const asset of manifest.assets) {
      expect(asset.purpose).toBeTruthy();
      expect(asset.dataType).toBeTruthy();
      const actual = createHash("sha256").update(readFileSync(join(folder, asset.filename))).digest("hex");
      expect(actual, `${asset.filename} checksum`).toBe(asset.sha256);
    }
    expect(readFileSync(join(folder, "plot_observations.csv"), "utf8")).toContain("812,review");
    expect(readFileSync(join(folder, "field_plots.csv"), "utf8")).toContain("review_boundary");
    expect(readFileSync(join(folder, "database_handover_inventory.csv"), "utf8")).toContain("possible duplicate");
    expect(readFileSync(join(folder, "schema.sql"), "utf8")).toContain("USING gist");
  });

  it("requires the complete Chapter 7 spatial-database handover", () => {
    const practicum = practicumMarkdown("module-2-chapter-7-practicum");
    for (const deliverable of [
      "authority_register.csv", "database_schema_diagram.pdf", "import_reconciliation.csv",
      "01_environmental_queries.sql", "02_spatial_queries.sql", "query_reconciliation.csv",
      "plot_zone_predicate_audit.csv", "geopandas_postgis_reconciliation.csv",
      "index_and_workload_plan.md", "storage_architecture_matrix.csv",
      "lineage_and_access_diagram.pdf", "SPATIAL_DATABASE_QA.md",
      "SPATIAL_DATABASE_HANDOVER_DECISION.md", "spatial_database_practicum.ipynb",
    ]) {
      expect(practicum).toContain(deliverable);
    }
    expect(practicum).toContain("Professional Mistakes — Spatial Databases");
    expect((practicum.match(/^\| [^|]+ \|/gm) ?? []).length).toBeGreaterThanOrEqual(30);
    expect(practicum).toMatch(/Automatic revision is required/i);
    expect(practicum).toMatch(/conditionally implement/i);
  });

  it("teaches Chapter 8 as one discovery-to-release evidence system", () => {
    const xarray = lessonMarkdown("lesson-2-38");
    for (const term of ["DataArray", "Dataset", "dimension", "coordinate", "attribute", ".isel()", ".sel()", "descending", "write_crs", "exact alignment"]) {
      expect(xarray).toMatch(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    }
    expect(xarray).toMatch(/labels are part of the evidence/i);

    const cube = lessonMarkdown("lesson-2-39");
    for (const term of ["time × band × y × x", "cube contract", "scale factor", "local quality", "median", "valid-observation count", "source Item"] ) {
      expect(cube).toMatch(new RegExp(term, "i"));
    }
    expect(cube).toMatch(/scene cloud[\s\S]*local validity|local validity[\s\S]*scene cloud/i);

    const dask = lessonMarkdown("lesson-2-40");
    for (const term of ["lazy", "task graph", "chunk", "compute()", "persist()", "working set", "rechunk", "storage chunks", "bounded"] ) {
      expect(dask).toMatch(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    }
    expect(dask).toMatch(/compressed[\s\S]*memory|memory[\s\S]*compressed/i);

    const formats = lessonMarkdown("lesson-2-41");
    for (const term of ["Cloud Optimized GeoTIFF", "tiles", "overviews", "HTTP byte-range", "CORS", "Zarr", "codec", "versioned prefix", "reader compatibility"] ) {
      expect(formats).toMatch(new RegExp(term, "i"));
    }
    expect(formats).toMatch(/extension alone|filename[\s\S]*prove/i);

    const stac = lessonMarkdown("lesson-2-42");
    for (const term of ["Catalog", "Collection", "Item", "Asset", "GeoJSON Feature", "pagination", "west, south, east, north", "signed URLs", "conformance"] ) {
      expect(stac).toMatch(new RegExp(term, "i"));
    }
    expect(stac).toMatch(/discovery[\s\S]*not[\s\S]*validation|discovery[\s\S]*not[\s\S]*acceptance/i);
  });

  it("publishes a checksum-verified synthetic cloud-native EO training pack", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/cloud-native-eo");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      data_status: string;
      files: Array<{ path: string; bytes: number; sha256: string }>;
    };
    expect(manifest.licence).toBe("CC0-1.0");
    expect(manifest.data_status).toMatch(/synthetic training evidence/i);
    expect(manifest.files).toHaveLength(8);
    for (const asset of manifest.files) {
      const body = readFileSync(join(folder, asset.path));
      expect(body.byteLength, `${asset.path} bytes`).toBe(asset.bytes);
      expect(createHash("sha256").update(body).digest("hex"), `${asset.path} checksum`).toBe(asset.sha256);
    }
    expect(readFileSync(join(folder, "observation_inventory.csv"), "utf8")).toContain("shifted_half_pixel");
    expect(readFileSync(join(folder, "observation_inventory.csv"), "utf8")).toContain("review_mask");
    expect(readFileSync(join(folder, "chunk_scenarios.csv"), "utf8")).toContain("too_many_tiny_tasks");
    expect(readFileSync(join(folder, "cloud_format_inventory.csv"), "utf8")).toContain("reject_COG_claim");
    expect(readFileSync(join(folder, "stac_items_fixture.json"), "utf8")).toContain("example.invalid");
  });

  it("requires the complete Chapter 8 cloud-native EO practicum delivery", () => {
    const practicum = practicumMarkdown("module-2-chapter-8-practicum");
    for (const deliverable of [
      "cloud_native_eo_practicum.ipynb", "stac_query_contract.json", "stac_items.csv",
      "stac_assets.csv", "cube_eligibility.csv", "cube_contract.md",
      "labelled_array_audit.csv", "seasonal_nir_pixel_summary.csv",
      "chunk_memory_plan.csv", "compute_budget.md", "cloud_format_audit.csv",
      "pipeline_reconciliation.csv", "CLOUD_NATIVE_EO_QA.md",
      "CLOUD_NATIVE_EO_RELEASE_DECISION.md",
    ]) {
      expect(practicum).toContain(deliverable);
    }
    expect(practicum).toContain("Professional mistakes — Multidimensional and Cloud-Native Data");
    expect((practicum.match(/^\| \d+ \|/gm) ?? []).length).toBeGreaterThanOrEqual(30);
    expect(practicum).toMatch(/release, conditional release or do not release/i);
    expect(practicum).toMatch(/GIS\/Remote Sensing Engineer/i);
    expect(practicum).toMatch(/Geospatial Data Analyst/i);
    expect(practicum).toMatch(/Remote Sensing Researcher/i);
  });

  it("teaches Chapter 9 as accessible evidence delivery rather than map decoration", () => {
    const services = lessonMarkdown("lesson-2-43");
    for (const term of ["client", "server", "XYZ", "WMS", "WFS", "WMTS", "GeoJSON", "vector tiles", "coverage", "COG", "STAC", "public field allow-list"] ) {
      expect(services).toMatch(new RegExp(term, "i"));
    }
    expect(services).toMatch(/portrayal.*measurement|measurement.*portrayal/i);

    const mapping = lessonMarkdown("lesson-2-44");
    for (const term of ["Folium", "MapLibre", "keyboard", "touch", "320", "375", "legend", "table", "text summary", "hover", "missing NIR", "synthetic"] ) {
      expect(mapping).toMatch(new RegExp(term, "i"));
    }
    expect(mapping).toMatch(/evidence sufficiency, not ecological status|evidence status.*not ecological condition/i);

    const interoperability = lessonMarkdown("lesson-2-45");
    for (const term of ["GetCapabilities", "GetMap", "GetFeature", "WCS", "tile matrix", "conformance", "service-desc", "next", "axis order", "media type", "stable identifiers"] ) {
      expect(interoperability).toMatch(new RegExp(term, "i"));
    }
    expect(interoperability).toMatch(/interoperability is verified behaviour/i);
  });

  it("publishes a checksum-verified synthetic Web GIS delivery training pack", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/web-gis-delivery");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      data_status: string;
      files: Array<{ path: string; bytes: number; sha256: string }>;
    };
    expect(manifest.licence).toBe("CC0-1.0");
    expect(manifest.data_status).toMatch(/synthetic training evidence/i);
    expect(manifest.files).toHaveLength(8);
    for (const asset of manifest.files) {
      const body = readFileSync(join(folder, asset.path));
      expect(body.byteLength, `${asset.path} bytes`).toBe(asset.bytes);
      expect(createHash("sha256").update(body).digest("hex"), `${asset.path} checksum`).toBe(asset.sha256);
    }
    const sites = JSON.parse(readFileSync(join(folder, "monitoring_sites.geojson"), "utf8")) as { features: Array<{ id: string }> };
    expect(sites.features).toHaveLength(6);
    expect(new Set(sites.features.map((feature) => feature.id)).size).toBe(6);
    expect(readFileSync(join(folder, "monitoring_summary.csv"), "utf8")).toContain("PUB_D,Eastern margin,not assessed,0,,");
    expect(readFileSync(join(folder, "service_capability_inventory.csv"), "utf8")).toContain("axis order not tested");
    expect(readFileSync(join(folder, "interoperability_fixture.json"), "utf8")).toContain("\"numberMatched\": 6");
    expect(readFileSync(join(folder, "interoperability_fixture.json"), "utf8")).toContain("example.invalid");
  });

  it("requires the complete Chapter 9 accessible Web GIS handover", () => {
    const practicum = practicumMarkdown("module-2-chapter-9-practicum");
    for (const deliverable of [
      "environmental_monitoring_map.html", "public_information_contract.md",
      "delivery_architecture.md", "public_schema_audit.csv",
      "map_table_reconciliation.csv", "service_decisions.csv",
      "accessibility_responsive_results.csv", "performance_failure_results.csv",
      "interoperability_acceptance.csv", "release_inventory.csv",
      "WEB_GIS_DELIVERY_QA.md", "WEB_GIS_RELEASE_DECISION.md",
    ]) {
      expect(practicum).toContain(deliverable);
    }
    expect(practicum).toContain("Professional mistakes — Web GIS and Delivery");
    expect((practicum.match(/^\| \d+ \|/gm) ?? []).length).toBeGreaterThanOrEqual(32);
    expect(practicum).toMatch(/320 × 568/);
    expect(practicum).toMatch(/375 × 812/);
    expect(practicum).toMatch(/GIS\/Remote Sensing Engineer/i);
    expect(practicum).toMatch(/Geospatial Data Analyst/i);
    expect(practicum).toMatch(/Remote Sensing Researcher/i);
  });

  it("teaches Chapter 10 as scientific workflow translation rather than product advocacy", () => {
    const lesson = lessonMarkdown("lesson-2-46");
    for (const term of [
      "scientific invariant", "ArcGIS Pro", "geodatabase", "ModelBuilder", "ArcPy",
      "ArcGIS Online", "ArcGIS Enterprise", "QGIS", "GeoPandas", "Rasterio",
      "PostGIS", "authority", "least privilege", "round-trip", "migration",
    ]) {
      expect(lesson).toMatch(new RegExp(term, "i"));
    }
    expect(lesson).toMatch(/implementations may change; scientific invariants may not/i);
    expect(lesson).toMatch(/No paid ArcGIS licence is required|ArcGIS access is optional/i);
    expect(lesson).toMatch(/not.*universally superior|universally superior/i);
    expect(lesson).toMatch(/visual similarity|maps can.*look equivalent/i);
  });

  it("publishes a checksum-verified synthetic professional GIS ecosystem pack", () => {
    const folder = join(process.cwd(), "public/lesson-resources/module-2/professional-gis-ecosystems");
    const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
      licence: string;
      data_status: string;
      files: Array<{ path: string; bytes: number; sha256: string }>;
    };
    expect(manifest.licence).toBe("CC0-1.0");
    expect(manifest.data_status).toMatch(/synthetic organisational and technical training evidence/i);
    expect(manifest.files).toHaveLength(7);
    for (const asset of manifest.files) {
      const body = readFileSync(join(folder, asset.path));
      expect(body.byteLength, `${asset.path} bytes`).toBe(asset.bytes);
      expect(createHash("sha256").update(body).digest("hex"), `${asset.path} checksum`).toBe(asset.sha256);
    }
    expect(readFileSync(join(folder, "workflow_requirements.csv"), "utf8")).toContain("REQ-10");
    expect(readFileSync(join(folder, "ecosystem_component_inventory.csv"), "utf8")).toContain("CMP-12");
    expect(readFileSync(join(folder, "sharing_risk_register.csv"), "utf8")).toContain("SHR-10");
    expect(readFileSync(join(folder, "environment_constraints.json"), "utf8")).toContain("ENV-C");
    expect(readFileSync(join(folder, "workflow_translation.csv"), "utf8")).toContain("STG-10");
  });

  it("requires the complete Chapter 10 portable professional architecture", () => {
    const practicum = practicumMarkdown("module-2-chapter-10-practicum");
    for (const deliverable of [
      "enterprise_gis_comparison.md", "workflow_role_matrix.csv",
      "environment_and_licence_inventory.csv", "scientific_invariant_tests.csv",
      "workflow_translation_contract.csv", "data_authority_map.md",
      "sharing_and_privacy_review.csv", "interoperability_acceptance.csv",
      "migration_drill_results.csv", "operations_and_recovery_plan.md",
      "PROFESSIONAL_ECOSYSTEM_QA.md", "PROFESSIONAL_ECOSYSTEM_DECISION.md",
      "release_inventory.csv",
    ]) {
      expect(practicum).toContain(deliverable);
    }
    expect(practicum).toContain("Professional mistakes — Enterprise GIS and Ecosystem Translation");
    expect((practicum.match(/^\| \d+ \|/gm) ?? []).length).toBeGreaterThanOrEqual(36);
    expect(practicum).toMatch(/GIS\/Remote Sensing Engineer/i);
    expect(practicum).toMatch(/Geospatial Data Analyst/i);
    expect(practicum).toMatch(/Remote Sensing Researcher/i);
    expect(practicum).toMatch(/accept.*conditionally accept.*reject/i);
  });

  it("teaches advanced image analysis as a spatially validated evidence system", () => {
    const segmentation = lessonMarkdown("lesson-2-47");
    for (const term of ["threshold", "connected-component", "four-neighbour", "eight-neighbour", "over-segmentation", "under-segmentation", "minimum mapping unit", "edge-censored", "texture"]) {
      expect(segmentation).toMatch(new RegExp(term, "i"));
    }
    expect(segmentation).toMatch(/segmentation[\s\S]*classification|classification[\s\S]*segmentation/i);

    const design = lessonMarkdown("lesson-2-48");
    for (const term of ["CNN", "semantic segmentation", "U-Net", "receptive field", "patch", "augmentation", "class imbalance", "spatial partition", "baseline"]) {
      expect(design).toMatch(new RegExp(term, "i"));
    }
    expect(design).toMatch(/image[\s\S]*patch[\s\S]*model[\s\S]*probability[\s\S]*mask/i);

    const assurance = lessonMarkdown("lesson-2-49");
    for (const term of ["spatial leakage", "overlapping", "domain shift", "annotation uncertainty", "resolution mismatch", "calibration", "false confidence", "withheld-site"]) {
      expect(assurance).toMatch(new RegExp(term, "i"));
    }
    expect(assurance).toMatch(/per-class|class-specific/i);
    expect(assurance).toMatch(/region-specific|regional/i);
  });

  it("teaches production geospatial computing as validated and recoverable operations", () => {
    const api = lessonMarkdown("lesson-2-50");
    for (const term of ["HTTP", "JSON", "authentication", "pagination", "retry", "rate limit", "provenance", "stable ID", "secret"]) {
      expect(api).toMatch(new RegExp(term, "i"));
    }

    const cli = lessonMarkdown("lesson-2-51");
    for (const command of ["gdalinfo", "gdal_translate", "gdalwarp", "ogrinfo", "ogr2ogr", "rio"]) {
      expect(cli).toContain(command);
    }
    expect(cli).toMatch(/reopen[\s\S]*invariant|invariant[\s\S]*reopen/i);

    const docker = lessonMarkdown("lesson-2-52");
    for (const term of ["image", "container", "GDAL", "non-root", "read-only", "digest", "mount", "architecture"]) {
      expect(docker).toMatch(new RegExp(term, "i"));
    }

    const ci = lessonMarkdown("lesson-2-53");
    for (const term of ["input validation", "unit tests", "integration tests", "deterministic", "least privilege", "GitHub Actions", "release gate", "recovery"]) {
      expect(ci).toMatch(new RegExp(term, "i"));
    }
    expect(ci).toMatch(/scientific validation[\s\S]*does not|does not[\s\S]*scientific validation/i);
  });

  it("publishes checksum-verified synthetic packs for Chapters 11 and 12", () => {
    for (const folderName of ["advanced-image-analysis", "production-geospatial-computing"]) {
      const folder = join(process.cwd(), "public/lesson-resources/module-2", folderName);
      const manifest = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8")) as {
        licence: string;
        sourceStatus: string;
        assets: Array<{ filename: string; purpose: string; sha256: string }>;
      };
      expect(manifest.licence).toBe("CC0-1.0");
      expect(manifest.sourceStatus).toMatch(/entirely synthetic/i);
      expect(manifest.assets.length).toBeGreaterThanOrEqual(5);
      for (const asset of manifest.assets) {
        expect(asset.purpose).toBeTruthy();
        const actual = createHash("sha256").update(readFileSync(join(folder, asset.filename))).digest("hex");
        expect(actual, `${folderName}/${asset.filename} checksum`).toBe(asset.sha256);
      }
    }
    expect(readFileSync(join(process.cwd(), "public/lesson-resources/module-2/advanced-image-analysis/patch_partition_inventory.csv"), "utf8")).toContain("deliberate_overlap");
    expect(readFileSync(join(process.cwd(), "public/lesson-resources/module-2/production-geospatial-computing/source_contract.json"), "utf8")).toContain("access_token");
  });

  it("requires complete Chapter 11, Chapter 12 and capstone professional deliveries", () => {
    const imagePracticum = practicumMarkdown("module-2-chapter-11-practicum");
    for (const file of ["spatial_partition_audit.geojson", "segmentation_sensitivity.csv", "model_comparison.csv", "calibration_and_thresholds.csv", "IMAGE_ANALYSIS_RELEASE_DECISION.md"]) {
      expect(imagePracticum).toContain(file);
    }
    const productionPracticum = practicumMarkdown("module-2-chapter-12-practicum");
    for (const file of ["acquisition_manifest.json", "geospatial_cli_workflow.sh", "Dockerfile", "scientific_invariants.csv", "failure_and_recovery_drill.md", "PRODUCTION_RELEASE_DECISION.md"]) {
      expect(productionPracticum).toContain(file);
    }
    const capstone = lessonMarkdown("lesson-2-capstone");
    expect(capstone).toContain("UAV_and_Satellite_Analysis_Pipeline");
    expect(capstone).toMatch(/GIS\/Remote Sensing Engineer/i);
    expect(capstone).toMatch(/Geospatial Data Analyst/i);
    expect(capstone).toMatch(/Remote Sensing Researcher/i);
    expect(capstone).toMatch(/field[\s\S]*vector[\s\S]*raster[\s\S]*UAV[\s\S]*satellite/i);
  });

  it("extends the portfolio starter through the complete Module 2 capstone", () => {
    const notebook = JSON.parse(readFileSync(
      join(process.cwd(), "public/lesson-resources/module-2/UAV_Satellite_Analysis_Pipeline_Starter.ipynb"),
      "utf8",
    )) as { cells: Array<{ source: string[] }> };
    const source = notebook.cells.flatMap((cell) => cell.source).join("");
    for (const lesson of ["2.8", "2.9", "2.10", "2.11", "2.12", "2.13", "2.14", "2.15", "2.16", "2.17", "2.18", "2.19", "2.20", "2.21", "2.22", "2.23", "2.24", "2.25", "2.26", "2.27", "2.28", "2.29", "2.30", "2.31", "2.32", "2.33", "2.34", "2.35", "2.36", "2.37", "2.38", "2.39", "2.40", "2.41", "2.42", "2.43", "2.44", "2.45", "2.46", "2.47", "2.48", "2.49", "2.50", "2.51", "2.52", "2.53"]) {
      expect(source).toContain(`Lesson ${lesson} checkpoint`);
    }
    expect(source).toContain("Chapter 1 Practicum checkpoint");
    expect(source).toContain("Chapter 2 Practicum checkpoint");
    expect(source).toContain("Chapter 3 Practicum checkpoint");
    expect(source).toContain("Chapter 4 Practicum checkpoint");
    expect(source).toContain("Chapter 5 Practicum checkpoint");
    expect(source).toContain("Chapter 6 Practicum checkpoint");
    expect(source).toContain("Chapter 7 Practicum checkpoint");
    expect(source).toContain("Chapter 8 Practicum checkpoint");
    expect(source).toContain("Chapter 9 Practicum checkpoint");
    expect(source).toContain("Chapter 10 Practicum checkpoint");
    expect(source).toContain("Chapter 11 Practicum checkpoint");
    expect(source).toContain("Chapter 12 Practicum checkpoint");
    expect(source).toContain("Module 2 Capstone checkpoint");
  });
});
