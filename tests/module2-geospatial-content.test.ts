import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  module2LessonDetails,
  module2Lessons,
  module2Overview,
} from "../lib/module2-pedagogy";

function fencedPythonBlocks(markdown: string) {
  return [...markdown.matchAll(/```python\n([\s\S]*?)```/g)].map((match) => match[1].trimEnd());
}

describe("Module 2 Geospatial Data Science", () => {
  it("publishes twelve chapters, 49 sequenced lessons and a separate capstone", () => {
    expect(module2Overview.title).toBe("Geospatial Data Science");
    expect(module2Overview.accent).toBe("blue");
    expect(module2Overview.chapters).toHaveLength(12);

    const chapterLessons = module2Overview.chapters.flatMap((chapter) => chapter.lessons);
    expect(chapterLessons).toHaveLength(49);
    expect(chapterLessons.map((item) => item.number)).toEqual(
      Array.from({ length: 49 }, (_, index) => index + 1),
    );
    expect(chapterLessons.every((item) => item.status === "available")).toBe(true);
    expect(module2Overview.capstone?.lessonId).toBe("lesson-2-capstone");
    expect(module2Lessons).toHaveLength(50);
  });

  it("uses unique stable learner-progress IDs", () => {
    const ids = module2Lessons.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.slice(0, 49)).toEqual(
      Array.from({ length: 49 }, (_, index) => `lesson-2-${String(index + 1).padStart(2, "0")}`),
    );
  });

  it.each(module2Lessons)("$number $title is a complete implemented lesson", (source) => {
    const details = module2LessonDetails[source.id];
    const content = details.content ?? "";

    for (const section of [
      "Learning outcome",
      "Why this matters",
      "Scientific context",
      "Concept",
      "Predict before running",
      "Worked example",
      "Code walkthrough",
      "Common mistake",
      "Guided practice",
      "Independent challenge",
      "Scientific interpretation",
      "Reflection",
      "Submission and portfolio artifact",
    ]) {
      expect(content).toContain(`## ${section}`);
    }

    expect(details.formativeChecks).toHaveLength(3);
    expect(details.submissionChecklist.length).toBeGreaterThanOrEqual(5);
    expect(details.rubric.map((item) => item.dimension)).toEqual([
      "Technical correctness",
      "Conceptual understanding",
      "Reproducibility",
      "Scientific communication",
    ]);
    expect(details.technicalMetadata.coreReferences[0].href).toMatch(/^https:\/\//);
    expect(content).toContain(source.artifact);
  });

  it("keeps worked Python examples compact and syntactically valid", () => {
    for (const details of Object.values(module2LessonDetails)) {
      for (const block of fencedPythonBlocks(details.content ?? "")) {
        expect(block.split("\n").length).toBeLessThanOrEqual(20);
        const result = spawnSync("python3", ["-c", `compile(${JSON.stringify(block)}, '<lesson>', 'exec')`]);
        expect(result.status, result.stderr.toString()).toBe(0);
      }
    }
  });

  it("teaches spatial reasoning and QA rather than a software list", () => {
    const allContent = Object.values(module2LessonDetails).map((item) => item.content).join("\n");
    expect(allContent).toContain("Core spatial question");
    expect(allContent).toContain("spatial support");
    expect(allContent).toContain("Apply this QA rule");
    expect(allContent).not.toMatch(/lorem ipsum|coming soon|placeholder|shopping cart|fruit list|bank account/i);
  });
});
