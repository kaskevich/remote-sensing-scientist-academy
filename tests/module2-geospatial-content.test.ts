import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  module2LessonDetails,
  module2Lessons,
  module2Overview,
  publishedModule2LessonIds,
  publishedModule2Lessons,
} from "../lib/module2-pedagogy";

function lessonMarkdown(lessonId: string) {
  const details = module2LessonDetails[lessonId];
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
    expect(chapterLessons).toHaveLength(49);
    expect(chapterLessons.map((item) => item.number)).toEqual(
      Array.from({ length: 49 }, (_, index) => index + 1),
    );
    expect(chapterLessons.filter((item) => item.status === "available")).toHaveLength(7);
    expect(chapterLessons.filter((item) => item.status === "planned")).toHaveLength(42);
    expect(chapterLessons.slice(0, 7).every((item) => item.lessonId)).toBe(true);
    expect(chapterLessons.slice(7).every((item) => item.lessonId === undefined)).toBe(true);
    expect(module2Overview.capstone?.status).toBe("planned");
    expect(module2Overview.capstone?.lessonId).toBeUndefined();
    expect(module2Overview.navigationMeta).toBe("7 lessons available");
  });

  it("uses unique stable IDs for the 49-lesson syllabus and capstone", () => {
    const ids = module2Lessons.map((item) => item.id);
    expect(module2Lessons).toHaveLength(50);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.slice(0, 49)).toEqual(
      Array.from({ length: 49 }, (_, index) => `lesson-2-${String(index + 1).padStart(2, "0")}`),
    );
    expect(ids.at(-1)).toBe("lesson-2-capstone");
  });

  it("publishes Spatial Foundations and the reviewed vector-analysis sequence", () => {
    expect(publishedModule2LessonIds).toEqual([
      "lesson-2-01",
      "lesson-2-02",
      "lesson-2-03",
      "lesson-2-04",
      "lesson-2-05",
      "lesson-2-06",
      "lesson-2-07",
    ]);
    expect(publishedModule2Lessons.map((item) => item.id)).toEqual(publishedModule2LessonIds);
    expect(Object.keys(module2LessonDetails)).toEqual(publishedModule2LessonIds);
    expect(module2Lessons.slice(7).every((item) => module2LessonDetails[item.id] === undefined)).toBe(true);
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

    expect(details.formativeChecks).toHaveLength(3);
    expect(new Set(details.formativeChecks.map((check) => check.id)).size).toBe(3);
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
  });

  it("covers the required professional reasoning in each lesson", () => {
    const lesson1 = lessonMarkdown("lesson-2-01");
    expect(lesson1).toMatch(/point, line or polygon/i);
    expect(lesson1).toMatch(/referenced grid/i);
    expect(lesson1).toMatch(/coordinates without a verified CRS/i);
    expect(lesson1).toMatch(/not claimed to contain published Baltic plot locations/i);

    const lesson2 = lessonMarkdown("lesson-2-02");
    expect(lesson2).toMatch(/geographic and projected CRSs/i);
    expect(lesson2).toContain("set_crs()");
    expect(lesson2).toContain("to_crs()");
    expect(lesson2).toMatch(/area of use/i);

    const lesson3 = lessonMarkdown("lesson-2-03");
    expect(lesson3).toMatch(/spatial support/i);
    expect(lesson3).toMatch(/mixed pixels/i);
    expect(lesson3).toContain("MAUP");
    expect(lesson3).toMatch(/5 cm UAV pixel/i);
    expect(lesson3).toMatch(/10 m Sentinel-2 pixel/i);

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
  });
});
