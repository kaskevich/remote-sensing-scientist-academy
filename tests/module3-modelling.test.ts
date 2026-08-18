import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  applyBoostingStage,
  calculateErrorSkill,
  calculateRegressionMetrics,
  createMeanBaseline,
  createMedianBaseline,
  findTrainingServingSkew,
  findBestRegressionStump,
  validateExperimentPlan,
  validateModelRunMetadata,
  validateModellingDataset,
  validatePredictorHypotheses,
  validateTargetSpecification,
  type ModelRunMetadata,
  type ModelExperimentPlan,
  type ModellingObservation,
  type PredictorHypothesis,
  type TargetSpecification,
} from "@/lib/module3-modelling";
import {
  MODULE3_SOFTWARE_VERSIONS,
  module3LessonDetails,
  module3Lessons,
  module3Overview,
  publishedModule3Lessons,
} from "@/lib/module3-pedagogy";

const repositoryRoot = process.cwd();
const resourceRoot = join(repositoryRoot, "public/lesson-resources/module-3/modelling-foundations");
const chapter2ResourceRoot = join(repositoryRoot, "public/lesson-resources/module-3/baseline-and-xgboost");

function read(path: string) {
  return readFileSync(join(repositoryRoot, path), "utf8");
}

function sha256(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function validTarget(overrides: Partial<TargetSpecification> = {}): TargetSpecification {
  return {
    target: "vegetation_height_cm",
    units: "cm",
    observationMethod: "maximum field height within a documented plot protocol",
    spatialSupport: "2 m × 2 m field plot",
    temporalSupport: "field date ± 3 days from EO acquisition",
    validMinimum: 0,
    validMaximum: 180,
    predictionUnit: "10 m raster cell with declared plot-to-cell reconciliation",
    predictionDomain: "represented Baltic coastal-meadow sites during the growing season",
    ...overrides,
  };
}

function validPredictor(overrides: Partial<PredictorHypothesis> = {}): PredictorHypothesis {
  return {
    predictor: "sentinel2_ndvi",
    source: "Sentinel-2 surface reflectance",
    unit: "unitless index",
    spatialSupport: "10 m raster cell",
    temporalSupport: "nearest quality-controlled acquisition within 3 days",
    scientificRationale: "can carry predictive information about green canopy response",
    expectedRelationship: "positive within the represented phenological window",
    knownLimitation: "saturation and sensitivity to soil/background conditions",
    availableAtPredictionTime: true,
    ...overrides,
  };
}

function validObservation(overrides: Partial<ModellingObservation> = {}): ModellingObservation {
  return {
    observationId: "obs-001",
    target: 42.5,
    site: "site-a",
    group: "campaign-2025",
    spatialBlock: "block-a",
    date: "2025-06-14",
    fold: "fold-1",
    excluded: false,
    exclusionReason: null,
    predictors: { sentinel2_ndvi: 0.63, uav_height_p95: 38.2 },
    ...overrides,
  };
}

function validExperimentPlan(overrides: Partial<ModelExperimentPlan> = {}): ModelExperimentPlan {
  return {
    primaryTarget: "vegetation_height_cm",
    baseline: "training-fold mean",
    primaryMetric: "MAE in centimetres",
    candidateModel: "untuned XGBoost regressor",
    validationStrategy: "grouped outer folds by site",
    tuningStrategy: "inner development folds only",
    finalTestData: "withheld sites listed in final_test_registry.csv",
    featureSet: ["sentinel2_ndvi", "uav_height_p95"],
    exclusions: "only predeclared protocol failures with recorded reasons",
    frozenBeforeModelling: true,
    finalTestUsedForTuning: false,
    ...overrides,
  };
}

describe("Module 3 curriculum architecture", () => {
  it("publishes two complete opening chapters while exposing the full planned pathway", () => {
    expect(module3Overview.moduleNumber).toBe(3);
    expect(module3Overview.title).toBe("Remote Sensing Modelling");
    expect(module3Overview.accent).toBe("terracotta");
    expect(module3Overview.chapters).toHaveLength(7);
    expect(module3Lessons).toHaveLength(30);
    expect(new Set(module3Lessons.map((lesson) => lesson.id)).size).toBe(30);
    expect(module3Lessons.map((lesson) => lesson.number)).toEqual(
      Array.from({ length: 30 }, (_, index) => `3.${index + 1}`),
    );
    expect(publishedModule3Lessons.map((lesson) => lesson.id)).toEqual([
      "lesson-3-01",
      "lesson-3-02",
      "lesson-3-03",
      "lesson-3-04",
      "lesson-3-05",
      "lesson-3-06",
      "lesson-3-07",
      "lesson-3-08",
    ]);
    expect(module3Overview.chapters.flatMap((chapter) => chapter.lessons).filter((lesson) => lesson.status === "available")).toHaveLength(8);
    expect(module3Overview.capstone).toMatchObject({ title: "Environmental Monitoring Project", status: "planned" });
  });

  it("keeps every released lesson substantive, cumulative and reviewable", () => {
    const requiredSignals = [
      "Learning outcome",
      "Lesson type",
      "Prerequisites",
      "Why this matters",
      "Mental model",
      "Scientific context",
      "Visual explanation",
      "Worked example",
      "Predict before running",
      "Code walkthrough",
      "Diagnostic check",
      "Common mistakes",
      "Guided practice",
      "Independent challenge",
      "Scientific interpretation",
      "Submission",
      "Portfolio artifact",
      "Reflection",
      "Core references",
      "advanced reading",
      "Tested software versions",
    ];

    for (const lesson of publishedModule3Lessons) {
      const details = module3LessonDetails[lesson.id];
      const markdown = read(details.markdownFile);
      expect(markdown.split(/\s+/).length, lesson.id).toBeGreaterThan(2400);
      for (const signal of requiredSignals) {
        expect(markdown.toLowerCase(), `${lesson.id}: ${signal}`).toContain(signal.toLowerCase());
      }
      expect(details.formativeChecks, lesson.id).toHaveLength(3);
      expect(details.rubric, lesson.id).toHaveLength(4);
      expect(details.technicalMetadata.coreReferences.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(details.technicalMetadata.datasetCitation, lesson.id).toContain("synthetic records are not measurements");
    }
  });

  it("records current tested software versions without implying every package is used in every lesson", () => {
    expect(MODULE3_SOFTWARE_VERSIONS).toEqual({
      python: "3.12.13",
      jupyter: "JupyterLab 4 / Notebook 7",
      numpy: "2.4.2",
      pandas: "2.2.3",
      scikitLearn: "1.9.0",
      xgboost: "3.3.0",
    });
  });

  it("maps prerequisites and genuinely new content for all thirty lessons", () => {
    const map = read("docs/MODULE_3_PREREQUISITE_MAP.md");
    for (let lesson = 1; lesson <= 30; lesson += 1) {
      expect(map).toContain(`| 3.${lesson} `);
    }
    expect(map).toContain("Assumed from Module 1");
    expect(map).toContain("Assumed from Module 2");
    expect(map).toContain("New modelling knowledge");
  });
});

describe("Module 3 teaching assets", () => {
  it("ships valid, accessible terracotta concept diagrams for every released lesson", () => {
    for (const filename of [
      "prediction-vs-explanation.svg",
      "target-prediction-unit.svg",
      "training-serving-skew.svg",
      "experiment-design-gates.svg",
      "baseline-ladder.svg",
      "tree-to-boosting.svg",
      "xgboost-sequential-learning.svg",
      "first-model-evidence-chain.svg",
    ]) {
      const path = join(repositoryRoot, "public/lesson-media/images", filename);
      const svg = readFileSync(path, "utf8");
      expect(svg).toContain("<title");
      expect(svg).toContain("<desc");
      expect(svg).toContain("#A35F47");
      expect(svg).not.toContain("telemetry");
    }
  });

  it("provides one continuous, executable-format portfolio notebook", () => {
    const notebook = JSON.parse(read("public/lesson-resources/module-3/Environmental_Monitoring_Project_Starter.ipynb")) as {
      nbformat: number;
      cells: Array<{ cell_type: string; source: string[] }>;
    };
    expect(notebook.nbformat).toBe(4);
    expect(notebook.cells.some((cell) => cell.cell_type === "code")).toBe(true);
    const narrative = notebook.cells.flatMap((cell) => cell.source).join("");
    for (let lesson = 1; lesson <= 8; lesson += 1) {
      expect(narrative).toContain(`Lesson 3.${lesson} checkpoint`);
    }
    expect(narrative).toContain("synthetic");
    expect(narrative).toContain("plan_frozen_before_modelling");
  });

  it("verifies every training-pack checksum in the manifest", () => {
    const manifestPath = join(resourceRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      data_status: string;
      files: Array<{ path: string; sha256: string }>;
    };
    expect(manifest.data_status).toContain("synthetic");
    expect(manifest.files).toHaveLength(10);
    for (const file of manifest.files) {
      const path = resolve(dirname(manifestPath), file.path);
      expect(existsSync(path), file.path).toBe(true);
      expect(sha256(path), file.path).toBe(file.sha256);
    }
  });

  it("verifies the Chapter 2 saved-split pack and its checksum manifest", () => {
    const manifestPath = join(chapter2ResourceRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      data_status: string;
      files: Array<{ path: string; sha256: string }>;
    };
    expect(manifest.data_status).toContain("synthetic");
    expect(manifest.files).toHaveLength(5);
    for (const file of manifest.files) {
      const path = resolve(dirname(manifestPath), file.path);
      expect(existsSync(path), file.path).toBe(true);
      expect(sha256(path), file.path).toBe(file.sha256);
    }

    const rows = readFileSync(join(chapter2ResourceRoot, "baseline_modelling_data.csv"), "utf8")
      .trim()
      .split("\n");
    expect(rows).toHaveLength(45);
    expect(rows.filter((row) => row.includes(",train,"))).toHaveLength(28);
    expect(rows.filter((row) => row.includes(",validation,"))).toHaveLength(8);
    expect(rows.filter((row) => row.includes(",sealed,"))).toHaveLength(8);
  });

  it("records an honest Chapter 2 multi-lens review", () => {
    const review = read("docs/MODULE_3_CHAPTER_2_REVIEW.md");
    expect(review).toContain("4.57 / 5");
    expect(review).toContain("not the validation or optimisation chapter");
    expect(review).toContain("The saved Chapter 2 split is instructional");
  });
});

describe("Module 3 baseline and ensemble behaviour", () => {
  it("fits mean and median constants from training targets only", () => {
    expect(createMeanBaseline([10, 20, 30], 3)).toEqual([20, 20, 20]);
    expect(createMedianBaseline([10, 20, 200, 30], 2)).toEqual([25, 25]);
    expect(() => createMeanBaseline([], 1)).toThrow("at least one value");
    expect(() => createMedianBaseline([10, Number.NaN], 1)).toThrow("finite numbers");
  });

  it("calculates regression errors with an explicit prediction-minus-observation bias sign", () => {
    const metrics = calculateRegressionMetrics([10, 20, 30], [12, 18, 33]);
    expect(metrics.mae).toBeCloseTo(7 / 3);
    expect(metrics.rmse).toBeCloseTo(Math.sqrt(17 / 3));
    expect(metrics.bias).toBeCloseTo(1);
    expect(metrics.rSquared).toBeCloseTo(0.915);
    expect(() => calculateRegressionMetrics([1, 2], [1])).toThrow("equal length");
  });

  it("reports positive, zero and negative error skill without hiding failure", () => {
    expect(calculateErrorSkill(6, 10)).toBeCloseTo(0.4);
    expect(calculateErrorSkill(10, 10)).toBe(0);
    expect(calculateErrorSkill(12, 10)).toBeCloseTo(-0.2);
    expect(() => calculateErrorSkill(1, 0)).toThrow("positive number");
  });

  it("finds an inspectable best regression stump from threshold candidates", () => {
    const stump = findBestRegressionStump([0.2, 0.3, 0.8, 0.9], [10, 12, 30, 32]);
    expect(stump.threshold).toBeCloseTo(0.55);
    expect(stump.leftValue).toBe(11);
    expect(stump.rightValue).toBe(31);
    expect(stump.predictions).toEqual([11, 11, 31, 31]);
    expect(stump.squaredError).toBe(4);
  });

  it("applies a scaled additive boosting stage and validates its contract", () => {
    expect(applyBoostingStage([24, 24, 24, 24], [-4, -2, 3, 5], 0.3)).toEqual([22.8, 23.4, 24.9, 25.5]);
    expect(() => applyBoostingStage([1], [1, 2], 0.3)).toThrow("equal length");
    expect(() => applyBoostingStage([1], [1], 0)).toThrow("at most one");
  });
});

function validModelRunMetadata(overrides: Partial<ModelRunMetadata> = {}): ModelRunMetadata {
  return {
    modelFamily: "XGBRegressor",
    objective: "reg:squarederror",
    datasetVersion: "module3-chapter2-synthetic-v1",
    foldRegistryVersion: "chapter2-saved-split-v1",
    featureOrder: ["sentinel2_ndvi", "uav_height_p95"],
    randomSeed: 42,
    packageVersions: { xgboost: "3.3.0", sklearn: "1.9.0" },
    finalTestOpened: false,
    ...overrides,
  };
}

describe("Module 3 first-model handover", () => {
  it("accepts complete model metadata and blocks semantic or test-firewall failures", () => {
    expect(validateModelRunMetadata(validModelRunMetadata())).toEqual([]);
    const issues = validateModelRunMetadata(validModelRunMetadata({
      featureOrder: ["sentinel2_ndvi", "sentinel2_ndvi"],
      randomSeed: -1,
      packageVersions: {},
      finalTestOpened: true,
    }));
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "duplicate-feature-order", severity: "blocker" }),
      expect.objectContaining({ code: "invalid-random-seed", severity: "blocker" }),
      expect.objectContaining({ code: "missing-package-versions", severity: "blocker" }),
      expect.objectContaining({ code: "final-test-opened-during-development", severity: "blocker" }),
    ]));
  });
});

describe("Module 3 scientific contracts", () => {
  it("accepts a complete target contract and blocks ambiguous or impossible targets", () => {
    expect(validateTargetSpecification(validTarget())).toEqual([]);

    const issues = validateTargetSpecification(validTarget({
      units: "",
      predictionDomain: "",
      validMinimum: 180,
      validMaximum: 0,
    }));
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "missing-units",
      "missing-predictionDomain",
      "invalid-target-range",
    ]));
    expect(issues.every((issue) => issue.severity === "blocker")).toBe(true);
  });

  it("detects training-serving skew and incomplete predictor hypotheses", () => {
    const unavailable = validPredictor({
      predictor: "field_height_measured_after_prediction",
      availableAtPredictionTime: false,
    });
    expect(findTrainingServingSkew([validPredictor(), unavailable])).toEqual([
      expect.objectContaining({ code: "predictor-unavailable-at-inference", severity: "blocker" }),
    ]);

    const issues = validatePredictorHypotheses([
      validPredictor(),
      validPredictor({ scientificRationale: "", knownLimitation: "" }),
      unavailable,
    ]);
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "duplicate-predictor",
      "missing-predictor-scientific-rationale",
      "missing-predictor-known-limitation",
      "predictor-unavailable-at-inference",
    ]));
  });

  it("blocks duplicate observations, absent evidence structure and silent exclusions", () => {
    const issues = validateModellingDataset([
      validObservation(),
      validObservation({ target: null, site: "", fold: "", date: "not-a-date" }),
      validObservation({ observationId: "obs-003", excluded: true, exclusionReason: null }),
    ]);
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "duplicate-observation-id",
      "missing-target",
      "missing-site",
      "missing-saved-fold-assignment",
      "invalid-observation-date",
      "unexplained-exclusion",
    ]));
  });

  it("keeps model selection outside the final test and makes plan freezing visible", () => {
    expect(validateExperimentPlan(validExperimentPlan())).toEqual([]);

    const issues = validateExperimentPlan(validExperimentPlan({
      featureSet: ["sentinel2_ndvi", "sentinel2_ndvi"],
      frozenBeforeModelling: false,
      finalTestUsedForTuning: true,
    }));
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "duplicate-feature", severity: "blocker" }),
      expect.objectContaining({ code: "plan-not-frozen", severity: "warning" }),
      expect.objectContaining({ code: "test-set-contamination", severity: "blocker" }),
    ]));
  });

  it("keeps deliberate defects in the Lesson 3.4 diagnostic fixture", () => {
    const fixture = read("public/lesson-resources/module-3/modelling-foundations/modelling_observation_fixture.csv");
    expect((fixture.match(/^OBS-010,/gm) ?? [])).toHaveLength(2);
    expect(fixture).toContain("2025-13-02");
    expect(fixture).toMatch(/OBS-014,[^\n]+,true,,/);
    expect(fixture).toMatch(/,,/);
  });
});
