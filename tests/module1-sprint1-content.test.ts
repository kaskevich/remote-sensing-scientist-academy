import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type CurriculumLesson = {
  id: string;
  title: string;
  lessonContent: string;
  task: {
    title: string;
    instructions: string;
  };
};

const site = JSON.parse(
  readFileSync(join(process.cwd(), "content/site.json"), "utf8"),
) as {
  curriculum: {
    titleLineOne: string;
    titleLineTwo: string;
    cohortDate: string;
    modules: CurriculumLesson[];
  };
};

const lessons = site.curriculum.modules;

const requiredSections = [
  "Learning Outcome",
  "Why This Matters",
  "Scientific Context",
  "Concept",
  "Visual Explanation",
  "Worked Example",
  "Code Walkthrough",
  "Predict Before Running",
  "Common Mistakes",
  "Guided Practice",
  "Independent Challenge",
  "Scientific Interpretation",
  "Reflection",
  "Submission",
  "Portfolio Artifact",
] as const;

function lesson(id: string) {
  const match = lessons.find((candidate) => candidate.id === id);
  expect(match, `Missing ${id}`).toBeDefined();
  return match as CurriculumLesson;
}

function fencedPythonBlocks(markdown: string) {
  return [...markdown.matchAll(/```python\n([\s\S]*?)```/g)].map((match) => match[1].trimEnd());
}

describe("Module 1 Sprint 1 curriculum", () => {
  it("publishes the requested module identity and three complete lessons", () => {
    expect(`${site.curriculum.titleLineOne} ${site.curriculum.titleLineTwo}`).toBe(
      "Thinking Like a Scientific Programmer.",
    );
    expect(site.curriculum.cohortDate).toBe("Vegetation Data Explorer");
    expect(lessons.map(({ id, title }) => ({ id, title }))).toEqual([
      { id: "lesson-01", title: "Welcome to Scientific Programming" },
      { id: "lesson-02", title: "Variables and Scientific Data" },
      { id: "lesson-03", title: "Collections: Organizing Ecological Information" },
    ]);
  });

  it.each(lessons)("includes every required learning section in $id", (candidate) => {
    for (const section of requiredSections) {
      expect(candidate.lessonContent).toContain(`## ${section}`);
    }

    expect(candidate.lessonContent).toContain("Vegetation_Data_Explorer.ipynb");
    expect(candidate.lessonContent).toContain("https://zenodo.org/records/20083250");
    expect(candidate.task.title).toMatch(/^Portfolio checkpoint 0[1-3]/);
    expect(candidate.task.instructions).toContain("Vegetation_Data_Explorer.ipynb");
    expect(candidate.task.instructions.toLowerCase()).toContain("screenshot");
    expect(candidate.task.instructions.toLowerCase()).toContain("written result");
  });

  it("starts Lesson 1 Python work with an empty print call", () => {
    expect(fencedPythonBlocks(lesson("lesson-01").lessonContent)[0]).toBe("print()");
  });

  it("keeps every worked Python block within twenty lines", () => {
    for (const candidate of lessons) {
      const workedSection = candidate.lessonContent
        .split("## Worked Example")[1]
        .split("## Predict Before Running")[0];

      const blocks = fencedPythonBlocks(workedSection);
      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks) {
        expect(block.split("\n").length).toBeLessThanOrEqual(20);
      }
    }
  });

  it("uses verified SALS1 values without inventing an elevation unit", () => {
    const content = lesson("lesson-02").lessonContent;
    expect(content).toContain('plot_id = "SALS1"');
    expect(content).toContain('site_name = "Saardu"');
    expect(content).toContain("species_richness = 7");
    expect(content).toContain("elevation_value = 0.530");
    expect(content).not.toContain("elevation_m =");
  });

  it("teaches all four collections while documenting provenance limits", () => {
    const content = lesson("lesson-03").lessonContent;
    expect(content).toContain("### List:");
    expect(content).toContain("### Tuple:");
    expect(content).toContain("### Set:");
    expect(content).toContain("### Dictionary:");
    expect(content).toContain("does not provide plot coordinates");
    expect(content).toContain("does not include the species identities");
  });

  it("contains all explanatory SVG assets referenced by the lessons", () => {
    for (const candidate of lessons) {
      const imagePaths = [...candidate.lessonContent.matchAll(/!\[[^\]]*\]\(([^)]+\.svg)\)/g)].map(
        (match) => match[1],
      );
      expect(imagePaths).toHaveLength(1);
      for (const imagePath of imagePaths) {
        expect(existsSync(join(process.cwd(), "public", imagePath))).toBe(true);
      }
    }
  });

  it("contains no placeholder or prohibited generic-example language", () => {
    const allContent = lessons.map((candidate) => candidate.lessonContent).join("\n");
    expect(allContent).not.toMatch(/lorem ipsum|shopping cart|fruit list|bank account/i);
  });
});
