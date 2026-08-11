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
    expect(chapterLessons.filter((item) => item.status === "available")).toHaveLength(25);
    expect(chapterLessons.filter((item) => item.status === "planned")).toHaveLength(28);
    expect(chapterLessons.slice(0, 25).every((item) => item.lessonId)).toBe(true);
    expect(chapterLessons.slice(25).every((item) => item.lessonId === undefined)).toBe(true);
    expect(module2Overview.capstone?.status).toBe("planned");
    expect(module2Overview.capstone?.lessonId).toBeUndefined();
    expect(module2Overview.navigationMeta).toBe("25 lessons · 4 practica available");
    expect(module2Overview.chapters[0].practicum?.lessonId).toBe("module-2-chapter-1-practicum");
    expect(module2Overview.chapters[1].practicum?.lessonId).toBe("module-2-chapter-2-practicum");
    expect(module2Overview.chapters[2].practicum?.lessonId).toBe("module-2-chapter-3-practicum");
    expect(module2Overview.chapters[3].practicum?.lessonId).toBe("module-2-chapter-4-practicum");
    expect(module2Overview.chapters.slice(4).every((chapter) => chapter.practicum === undefined)).toBe(true);
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

  it("publishes the four fully reviewed opening chapters", () => {
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
    ]);
    expect(publishedModule2Lessons.map((item) => item.id)).toEqual(publishedModule2LessonIds);
    expect(Object.keys(module2LessonDetails)).toEqual(publishedModule2LessonIds);
    expect(module2Lessons.slice(25).every((item) => module2LessonDetails[item.id] === undefined)).toBe(true);
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

  it("adds four unnumbered, reviewed chapter practica", () => {
    expect(module2ChapterPractica.map((item) => item.id)).toEqual([
      "module-2-chapter-1-practicum",
      "module-2-chapter-2-practicum",
      "module-2-chapter-3-practicum",
      "module-2-chapter-4-practicum",
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
  });

  it("covers the required professional reasoning in each lesson", () => {
    const lesson1 = lessonMarkdown("lesson-2-01");
    expect(lesson1).toMatch(/point, line or polygon/i);
    expect(lesson1).toMatch(/referenced grid/i);
    expect(lesson1).toMatch(/coordinates without a verified CRS/i);
    expect(lesson1).toMatch(/not claimed to contain published Baltic plot locations/i);
    expect(lesson1).toContain("### Learning pathway");
    expect(lesson1).toContain("expected_status");
    expect(lesson1).toContain('assert status == expected_status[asset["name"]]');
    expect(lesson1).toMatch(/observed[\s\S]*verified[\s\S]*unknown/i);
    expect(lesson1).toMatch(/ready for Lesson 2\.2/i);
    expect(lesson1).toContain("Portfolio Project 2 — Geospatial Evidence and Vector QA Package");
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

  it("extends the portfolio starter through the complete UAV chapter", () => {
    const notebook = JSON.parse(readFileSync(
      join(process.cwd(), "public/lesson-resources/module-2/UAV_Satellite_Analysis_Pipeline_Starter.ipynb"),
      "utf8",
    )) as { cells: Array<{ source: string[] }> };
    const source = notebook.cells.flatMap((cell) => cell.source).join("");
    for (const lesson of ["2.8", "2.9", "2.10", "2.11", "2.12", "2.13", "2.14", "2.15", "2.16", "2.17", "2.18", "2.19", "2.20", "2.21", "2.22", "2.23", "2.24", "2.25"]) {
      expect(source).toContain(`Lesson ${lesson} checkpoint`);
    }
    expect(source).toContain("Chapter 1 Practicum checkpoint");
    expect(source).toContain("Chapter 2 Practicum checkpoint");
    expect(source).toContain("Chapter 3 Practicum checkpoint");
    expect(source).toContain("Chapter 4 Practicum checkpoint");
    expect(source).toContain("required_inventory_fields");
    expect(source).toContain("inventory_is_complete");
    expect(source).toContain("Portfolio Project 2 — Geospatial Evidence and Vector QA Package");
  });
});
