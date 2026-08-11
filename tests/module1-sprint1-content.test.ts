import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  module1Overview,
  reviewedLessonDetails,
  submissionStatusLabel,
} from "../lib/module1-pedagogy";

type CurriculumLesson = {
  id: string;
  title: string;
  lessonContent: string;
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

const activeLessons = site.curriculum.modules;
const reviewedContent = Object.fromEntries(
  Object.entries(reviewedLessonDetails).map(([lessonId, details]) => [
    lessonId,
    readFileSync(join(process.cwd(), details.markdownFile), "utf8"),
  ]),
) as Record<string, string>;

function fencedPythonBlocks(markdown: string) {
  return [...markdown.matchAll(/```python\n([\s\S]*?)```/g)].map((match) => match[1].trimEnd());
}

describe("Module 1 pedagogical review", () => {
  it("publishes the complete four-chapter, twelve-lesson sequence", () => {
    expect(module1Overview.title).toBe("Thinking Like a Scientific Programmer");
    expect(module1Overview.finalProject).toBe("Vegetation Data Explorer");
    expect(module1Overview.prerequisites).toBe("None");
    expect(module1Overview.outcomes).toHaveLength(9);
    expect(module1Overview.chapters).toHaveLength(4);

    const mappedLessons = module1Overview.chapters.flatMap((chapter) => chapter.lessons);
    expect(mappedLessons).toHaveLength(12);
    expect(mappedLessons.map((lesson) => lesson.number)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
    expect(mappedLessons.every((lesson) => lesson.status === "available")).toBe(true);
    expect(mappedLessons.every((lesson) => lesson.lessonId)).toBe(true);
  });

  it("publishes all twelve lessons as interactive curriculum pages", () => {
    expect(`${site.curriculum.titleLineOne} ${site.curriculum.titleLineTwo}`).toBe(
      "Academy Curriculum",
    );
    expect(site.curriculum.cohortDate).toBe("Module 1 + Module 2 Lessons 2.1–2.25");
    expect(activeLessons.map(({ id, title }) => ({ id, title }))).toEqual([
      { id: "lesson-01", title: "Welcome to Scientific Programming" },
      { id: "lesson-02", title: "Variables and Scientific Data" },
      { id: "lesson-03", title: "Collections for Ecological Information" },
      { id: "lesson-04", title: "Conditions and Data-Quality Rules" },
      { id: "lesson-05", title: "Repetition, Loops and Vectorised Thinking" },
      { id: "lesson-06", title: "Functions, Errors and Debugging" },
      { id: "lesson-07", title: "NumPy and Numerical Arrays" },
      { id: "lesson-08", title: "Open the Published Dataset with pandas" },
      { id: "lesson-09", title: "Missing Values, Types and Data Quality" },
      { id: "lesson-10", title: "Filter, Group and Summarise" },
      { id: "lesson-11", title: "Join, Reshape and Visualise" },
      { id: "lesson-12", title: "Vegetation Data Explorer Project" },
    ]);
  });

  it("structures Lesson 1 as seven beginner-sized active blocks", () => {
    const content = reviewedContent["lesson-01"];
    const requiredBlocks = [
      "Scientific question and computational method",
      "Meet the notebook",
      "Run the first instruction",
      "Predict execution order",
      "Cause and fix one error",
      "Save and submit the notebook",
      "Reflection and summary",
    ];
    for (const [index, block] of requiredBlocks.entries()) {
      expect(content).toContain(`## ${index + 1}. ${block}`);
    }
    expect(content).toContain("Markdown cell");
    expect(content).toContain("code cell");
    expect(content).toContain("When code fails");
    expect(fencedPythonBlocks(content)[0]).toBe("print()");
    for (const connection of [
      "You already know",
      "In this lesson",
      "Why this comes now",
      "You will use this later",
    ]) {
      expect(content).toContain(`### ${connection}`);
    }
    expect(content).toContain("Word or similar document");
    expect(content).toContain("Python script");
    expect(content).toContain("restart the kernel");
    expect(content).toContain("Independent handover test");
    expect(content).toContain("Portfolio Project 1 — Vegetation Data Explorer");
  });

  it("provides Lesson 1 clean-run and handover scaffolding in the starter notebook", () => {
    const notebook = JSON.parse(
      readFileSync(
        join(process.cwd(), "public/lesson-resources/module-1/Vegetation_Data_Explorer_Starter.ipynb"),
        "utf8",
      ),
    ) as { cells: Array<{ id: string; source: string[] }> };
    const handover = notebook.cells.find((cell) => cell.id === "handover-check");
    expect(handover).toBeDefined();
    expect(handover?.source.join("")).toContain("Restart the kernel");
    expect(handover?.source.join("")).toContain("what that output does not prove");
  });

  it("keeps one main concept in each reviewed lesson", () => {
    const lesson2 = reviewedContent["lesson-02"];
    expect(lesson2).toContain("A **value** is one piece of information");
    expect(lesson2).toContain("type()");
    expect(lesson2).toContain('The values `"72"` and `72`');
    expect(lesson2).toContain("changing a type cannot correct an invalid measurement");
    expect(lesson2).toContain("## Learning pathway");
    expect(lesson2).toContain("Build a one-value data contract");
    expect(lesson2).toContain('`reported_plot_id = "007"`');
    expect(lesson2).toContain("Professional QA decision");
    expect(lesson2).toContain("Portfolio Project 1 — Vegetation Data Explorer");
    expect(lesson2).not.toMatch(/\bappend\(|\{\s*"SampleID"\s*:/);

    const lesson3 = reviewedContent["lesson-03"];
    expect(lesson3).toContain("Lists preserve an editable sequence");
    expect(lesson3).toContain("Dictionaries connect field names to values");
    expect(lesson3).toContain("Tuples and sets have supporting roles");
    expect(lesson3).toContain("no management label");
    expect(lesson3).toContain("no coordinates");
    expect(lesson3).toContain("## Learning pathway");
    expect(lesson3).toContain("Make the relationship decision first");
    expect(lesson3).toContain("required_fields - available_fields");
    expect(lesson3).toContain("Professional QA decision");
    expect(lesson3).toContain("Portfolio Project 1 — Vegetation Data Explorer");
  });

  it("develops Chapters 2–4 as one complete scientific workflow", () => {
    const requiredIdeas: Record<string, string[]> = {
      "lesson-04": ["condition asks a precise question", "missing — do not treat as zero", "quality flag"],
      "lesson-05": ["same method for each item", "accumulator", "Vectorised thinking"],
      "lesson-06": ["named, testable method", "traceback", "known cases"],
      "lesson-07": ["one-dimensional NumPy array", "Boolean mask", "59 of 120"],
      "lesson-08": ["reproducible project folder", "(120, 25)", "SampleID"],
      "lesson-09": ["49.2%", "field-specific", "decision log"],
      "lesson-10": ["analysis population", "n_plots", "descriptive rather than automatically causal"],
      "lesson-11": ["validate=\"one_to_one\"", "unsampled combinations", "scientific figure"],
      "lesson-12": ["claim–evidence chain", "Run All", "future Earth Observation work"],
    };

    for (const [lessonId, ideas] of Object.entries(requiredIdeas)) {
      for (const idea of ideas) expect(reviewedContent[lessonId]).toContain(idea);
    }

    const lesson4 = reviewedContent["lesson-04"];
    expect(lesson4).toContain("## Learning pathway");
    expect(lesson4).toContain("input contract");
    expect(lesson4).toContain("Boundary and branch stress test");
    expect(lesson4).toContain("ready for instructional use");
    expect(lesson4).toContain("Portfolio Project 1 — Vegetation Data Explorer");

    const lesson5 = reviewedContent["lesson-05"];
    expect(lesson5).toContain("## Learning pathway");
    expect(lesson5).toContain("batch-processing contract");
    expect(lesson5).toContain("Data-completeness extension");
    expect(lesson5).toContain("equivalence check");
    expect(lesson5).toContain("ready for handover");
    expect(lesson5).toContain("Portfolio Project 1 — Vegetation Data Explorer");

    const lesson6 = reviewedContent["lesson-06"];
    expect(lesson6).toContain("## Learning pathway");
    expect(lesson6).toContain("Write the function contract before its body");
    expect(lesson6).toContain("Turn expectations into executable checks");
    expect(lesson6).toContain("regression testing");
    expect(lesson6).toContain("not ready for pandas data");
    expect(lesson6).toContain("Portfolio Project 1 — Vegetation Data Explorer");

    const lesson7 = reviewedContent["lesson-07"];
    expect(lesson7).toContain("## Learning pathway");
    expect(lesson7).toContain("Record an array contract");
    expect(lesson7).toContain("Prove equivalence with the Lesson 5 loop");
    expect(lesson7).toContain("np.isnan");
    expect(lesson7).toContain("spatial meaning not assigned");
    expect(lesson7).toContain("Portfolio Project 1 — Vegetation Data Explorer");

    const lesson8 = reviewedContent["lesson-08"];
    expect(lesson8).toContain("## Learning pathway");
    expect(lesson8).toContain("Define the intake contract");
    expect(lesson8).toContain("SHA-256");
    expect(lesson8).toContain("Make the structural expectations executable");
    expect(lesson8).toContain("accepted for Lesson 9 quality audit");
    expect(lesson8).toContain("Portfolio Project 1 — Vegetation Data Explorer");
  });

  it.each(Object.entries(reviewedLessonDetails))(
    "%s includes three retryable, explanatory formative checks",
    (_lessonId, details) => {
      expect(details.formativeChecks).toHaveLength(3);
      expect(new Set(details.formativeChecks.map((check) => check.id)).size).toBe(3);
      for (const check of details.formativeChecks) {
        expect(check.options.length).toBeGreaterThanOrEqual(3);
        expect(check.correctOption).toBeGreaterThanOrEqual(0);
        expect(check.correctOption).toBeLessThan(check.options.length);
        expect(check.explanation.length).toBeGreaterThan(40);
      }
      const content = reviewedContent[_lessonId];
      for (const check of details.formativeChecks) {
        expect(content).toContain(`[[CHECK:${check.id}]]`);
      }
    },
  );

  it.each(Object.entries(reviewedLessonDetails))(
    "%s includes submission, rubric and technical metadata",
    (_lessonId, details) => {
      expect(details.submissionChecklist.length).toBeGreaterThanOrEqual(5);
      expect(details.rubric.map((item) => item.dimension)).toEqual([
        "Technical correctness",
        "Conceptual understanding",
        "Reproducibility",
        "Scientific communication",
      ]);
      expect(details.technicalMetadata.pythonVersion).toBe("Python 3.12.3");
      expect(details.technicalMetadata.jupyterEnvironment).toContain("nbformat 4.5");
      expect(details.technicalMetadata.datasetCitation).toContain("20083250");
      expect(details.technicalMetadata.coreReferences.length).toBeGreaterThan(0);
    },
  );

  it("maps existing database states to the requested learner review labels", () => {
    expect(submissionStatusLabel("not_reviewed", null)).toBe("Not submitted");
    expect(submissionStatusLabel("not_reviewed", "2026-08-06T10:00:00Z")).toBe("Submitted");
    expect(submissionStatusLabel("needs_revision")).toBe("Revision requested");
    expect(submissionStatusLabel("reviewed")).toBe("Meets expectations");
    expect(submissionStatusLabel("approved")).toBe("Portfolio ready");
  });

  it("preserves verified dataset facts and explicit provenance limits", () => {
    const lesson2 = reviewedContent["lesson-02"];
    expect(lesson2).toContain('plot_id = "SALS1"');
    expect(lesson2).toContain('site_name = "Saardu"');
    expect(lesson2).toContain("species_richness = 7");
    expect(lesson2).toContain("elevation_value = 0.530");
    expect(lesson2).not.toContain("elevation_m =");

    const lesson3 = reviewedContent["lesson-03"];
    expect(lesson3).toContain("does not provide the species identities or plot coordinates");
    expect(lesson3).toContain("It does not contain plot coordinates");
    expect(lesson3).not.toMatch(/LS means|LS stands for|metres above sea level/i);
  });

  it("refines scientific representations progressively without hiding earlier limits", () => {
    const lesson2 = reviewedContent["lesson-02"];
    expect(lesson2).toContain("biomass_value_present = True");
    expect(lesson2).toContain("table-value presence");
    expect(lesson2).toContain("not evidence of how, when or under which protocol");
    expect(lesson2).not.toContain("biomass_sampled");
    expect(JSON.stringify(site)).not.toContain("biomass_sampled");
    expect(
      readFileSync(
        join(process.cwd(), "public/lesson-media/images/scientific-variable-bindings.svg"),
        "utf8",
      ),
    ).not.toContain("biomass_sampled");

    const lesson6 = reviewedContent["lesson-06"];
    expect(lesson6).toContain("if isinstance(value, bool)");
    expect(lesson6).toContain("bool` is a subclass of `int`");
    expect(lesson6).toContain("`None` is the missing-value representation");
    expect(lesson6).toContain("could treat `np.nan` as an ordinary float");
    expect(lesson6).toContain("In Lesson 9 you will deliberately upgrade the function");

    const classifierBlock = fencedPythonBlocks(lesson6).find((block) =>
      block.includes("def classify_biomass(value)"),
    );
    expect(classifierBlock).toBeDefined();
    const classifierRun = spawnSync("python3", ["-c", classifierBlock ?? ""]);
    expect(classifierRun.status, classifierRun.stderr.toString()).toBe(0);
    expect(classifierRun.stdout.toString().trim().split("\n")).toEqual([
      "None missing",
      "True invalid Boolean",
      "-1 invalid negative",
      "'311.33' invalid type",
      "311.33 recorded",
    ]);

    const lesson7 = reviewedContent["lesson-07"];
    expect(lesson7).toContain("## 7. From a column to a grid");
    expect(lesson7).toContain("reflectance_grid.shape");
    expect(lesson7).toContain("reflectance_grid.ndim");
    expect(lesson7).toContain("reflectance_grid[0, 0]");
    expect(lesson7).toContain("reflectance_grid[0, :]");
    expect(lesson7).toContain("reflectance_grid[:, 0]");
    expect(lesson7).toContain("does not become geospatial merely because it has rows and columns");

    const lesson9 = reviewedContent["lesson-09"];
    expect(lesson9).toContain("## 4. Upgrade an earlier function as the data become more realistic");
    expect(lesson9).toContain("pd.isna(value)");
    expect(lesson9).toContain('[None, np.nan, 311.33, -1, "311.33", True]');
    expect(lesson9).toContain("iterative scientific programming");
  });

  it("keeps worked Python blocks compact and syntactically valid except the labelled error", () => {
    for (const content of Object.values(reviewedContent)) {
      for (const block of fencedPythonBlocks(content)) {
        expect(block.split("\n").length).toBeLessThanOrEqual(20);
        if (block === 'print("Baltic coastal meadow)') continue;
        const result = spawnSync("python3", ["-c", `compile(${JSON.stringify(block)}, '<lesson>', 'exec')`]);
        expect(result.status, result.stderr.toString()).toBe(0);
      }
    }
  });

  it("retains one explanatory SVG for every lesson", () => {
    const referencedImages = Object.values(reviewedContent).flatMap((content) =>
      [...content.matchAll(/!\[[^\]]*\]\(([^)]+\.svg)\)/g)].map((match) => match[1]),
    );
    expect(referencedImages).toEqual([
      "lesson-media/images/scientific-programming-execution.svg",
      "lesson-media/images/scientific-variable-bindings.svg",
      "lesson-media/images/ecological-collections.svg",
      "lesson-media/images/condition-quality-path.svg",
      "lesson-media/images/loop-vector-thinking.svg",
      "lesson-media/images/function-debug-cycle.svg",
      "lesson-media/images/numpy-array-mask.svg",
      "lesson-media/images/csv-dataframe-audit.svg",
      "lesson-media/images/data-quality-profile.svg",
      "lesson-media/images/filter-group-summary.svg",
      "lesson-media/images/join-reshape-figure.svg",
      "lesson-media/images/vegetation-explorer-workflow.svg",
    ]);
    for (const imagePath of referencedImages) {
      expect(existsSync(join(process.cwd(), "public", imagePath))).toBe(true);
    }
  });

  it("contains no placeholder or prohibited generic-example language in published lesson text", () => {
    const allContent = Object.values(reviewedContent).join("\n");
    expect(allContent).not.toMatch(/lorem ipsum|shopping cart|fruit list|bank account/i);
    expect(allContent).not.toMatch(/REPLACE THIS TEXT/i);
  });
});

describe("Vegetation Data Explorer starter notebook", () => {
  const notebookPath = join(
    process.cwd(),
    "public/lesson-resources/module-1/Vegetation_Data_Explorer_Starter.ipynb",
  );
  const notebook = JSON.parse(readFileSync(notebookPath, "utf8")) as {
    nbformat: number;
    nbformat_minor: number;
    cells: Array<{ cell_type: string; source: string[] }>;
  };

  it("is valid current notebook JSON with the required learning structure", () => {
    expect(notebook.nbformat).toBe(4);
    expect(notebook.nbformat_minor).toBeGreaterThanOrEqual(5);
    expect(notebook.cells.length).toBeGreaterThanOrEqual(12);
    const text = notebook.cells.flatMap((cell) => cell.source).join("");
    expect(text).toContain("Vegetation Data Explorer");
    expect(text).toContain("Learner name or researcher identifier");
    expect(text).toContain("Scientific question");
    expect(text).toContain("Prediction before running");
    expect(text).toContain("Reflection");
    expect(text).toContain("submission checklist");
  });

  it("contains Python code cells that all compile before learner editing", () => {
    const code = notebook.cells
      .filter((cell) => cell.cell_type === "code")
      .map((cell) => cell.source.join(""))
      .join("\n");
    const result = spawnSync("python3", ["-c", `compile(${JSON.stringify(code)}, '<starter-notebook>', 'exec')`]);
    expect(result.status, result.stderr.toString()).toBe(0);
  });
});
