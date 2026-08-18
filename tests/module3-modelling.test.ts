import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  applyBoostingStage,
  assignPredictionReleaseState,
  buildEqualWidthReliabilityBins,
  buildSymmetricPredictionIntervals,
  calculateBinaryClassificationMetrics,
  calculateErrorSkill,
  calculateExpandedBinaryClassificationMetrics,
  calculateIntervalDiagnostics,
  calculateRegressionMetrics,
  calculateSplitConformalQuantile,
  calculateStandardizedNearestAnalogue,
  classifyApplicability,
  countDiscreteSearchCombinations,
  createBalancedGroupFolds,
  createForwardTemporalFolds,
  createLeaveOneGroupOutFolds,
  createMeanBaseline,
  createMedianBaseline,
  diagnoseLearningDynamics,
  evaluateMonitoringGate,
  findFoldGroupOverlap,
  findIntervalCrossings,
  findTrainingServingSkew,
  findBestRegressionStump,
  selectThresholdByMinimumRecall,
  scoreModellingArchitectures,
  summariseResidualGroups,
  summariseFeatureStability,
  summariseFoldMetrics,
  validateExperimentPlan,
  validateModelRunMetadata,
  validateModellingDataset,
  validateNestedValidationAssignments,
  validateOperationalFeatureSchema,
  validateOperationalModelCard,
  validateOptimisationProtocol,
  validatePredictorHypotheses,
  validateTargetSpecification,
  countPredictionWindows,
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
const chapter3ResourceRoot = join(repositoryRoot, "public/lesson-resources/module-3/structured-validation");
const chapter4ResourceRoot = join(repositoryRoot, "public/lesson-resources/module-3/controlled-optimisation");
const chapter5ResourceRoot = join(repositoryRoot, "public/lesson-resources/module-3/evaluation-and-applicability");
const chapter6ResourceRoot = join(repositoryRoot, "public/lesson-resources/module-3/prediction-uncertainty");
const chapter7ResourceRoot = join(repositoryRoot, "public/lesson-resources/module-3/operational-workflow");

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
  it("publishes all seven chapters while keeping the capstone transparent", () => {
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
      "lesson-3-09",
      "lesson-3-10",
      "lesson-3-11",
      "lesson-3-12",
      "lesson-3-13",
      "lesson-3-14",
      "lesson-3-15",
      "lesson-3-16",
      "lesson-3-17",
      "lesson-3-18",
      "lesson-3-19",
      "lesson-3-20",
      "lesson-3-21",
      "lesson-3-22",
      "lesson-3-23",
      "lesson-3-24",
      "lesson-3-25",
      "lesson-3-26",
      "lesson-3-27",
      "lesson-3-28",
      "lesson-3-29",
      "lesson-3-30",
    ]);
    expect(module3Overview.chapters.flatMap((chapter) => chapter.lessons).filter((lesson) => lesson.status === "available")).toHaveLength(30);
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
      "random-vs-spatial-validation.svg",
      "validation-claim-ladder.svg",
      "temporal-validation-directions.svg",
      "nested-cross-validation.svg",
      "controlled-search-evidence.svg",
      "overfit-learning-curves.svg",
      "feature-stability-across-folds.svg",
      "classification-threshold.svg",
      "regression-diagnostic-panel.svg",
      "classification-probability-quality.svg",
      "spatial-residuals.svg",
      "model-interpretation-boundaries.svg",
      "domain-of-applicability.svg",
      "predictive-uncertainty-sources.svg",
      "quantile-interval-evidence.svg",
      "split-conformal-coverage.svg",
      "prediction-uncertainty-applicability.svg",
      "raster-inference-contract.svg",
      "earth-engine-modelling-component.svg",
      "local-vs-earth-engine-architecture.svg",
      "monitoring-drift-gates.svg",
      "operational-model-package.svg",
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
    for (let lesson = 1; lesson <= 30; lesson += 1) {
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

  it("verifies the Chapter 3 structured-validation pack and its checksum manifest", () => {
    const manifestPath = join(chapter3ResourceRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      data_status: string;
      files: Array<{ path: string; sha256: string }>;
    };
    expect(manifest.data_status).toContain("synthetic");
    expect(manifest.files).toHaveLength(6);
    for (const file of manifest.files) {
      const path = resolve(dirname(manifestPath), file.path);
      expect(existsSync(path), file.path).toBe(true);
      expect(sha256(path), file.path).toBe(file.sha256);
    }

    const rows = readFileSync(join(chapter3ResourceRoot, "structured_validation_data.csv"), "utf8")
      .trim()
      .split("\n");
    expect(rows).toHaveLength(49);
    expect(rows.filter((row) => row.includes(",coast-a,"))).toHaveLength(12);
    expect(rows.filter((row) => row.includes(",2025,"))).toHaveLength(16);
  });

  it("records an honest Chapter 3 multi-lens review", () => {
    const review = read("docs/MODULE_3_CHAPTER_3_REVIEW.md");
    expect(review).toContain("4.72 / 5");
    expect(review).toContain("cannot support a real coastal-meadow transfer claim");
    expect(review).toContain("not the hyperparameter-optimisation chapter");
  });

  it("verifies the Chapter 4 controlled-optimisation pack and its checksum manifest", () => {
    const manifestPath = join(chapter4ResourceRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      data_status: string;
      evidence_rule: string;
      files: Array<{ path: string; sha256: string }>;
    };
    expect(manifest.data_status).toContain("synthetic");
    expect(manifest.evidence_rule).toContain("final test");
    expect(manifest.files).toHaveLength(9);
    for (const file of manifest.files) {
      const path = resolve(dirname(manifestPath), file.path);
      expect(existsSync(path), file.path).toBe(true);
      expect(sha256(path), file.path).toBe(file.sha256);
    }

    const probabilityRows = readFileSync(join(chapter4ResourceRoot, "rare_habitat_probabilities.csv"), "utf8")
      .trim()
      .split("\n");
    expect(probabilityRows).toHaveLength(25);
    expect(probabilityRows.filter((row) => row.includes(",1,")).length).toBeGreaterThanOrEqual(6);
    expect(probabilityRows.every((row, index) => index === 0 || row.endsWith(",synthetic"))).toBe(true);
  });

  it("records an honest Chapter 4 multi-lens review", () => {
    const review = read("docs/MODULE_3_CHAPTER_4_REVIEW.md");
    expect(review).toContain("4.76 / 5");
    expect(review).toContain("not the complete evaluation and interpretation chapter");
    expect(review).toContain("cannot support a real coastal-meadow transfer claim");
  });

  it("verifies the Chapter 5 evaluation-and-applicability pack and its checksum manifest", () => {
    const manifestPath = join(chapter5ResourceRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      data_status: string;
      evidence_rule: string;
      files: Array<{ path: string; sha256: string }>;
    };
    expect(manifest.data_status).toContain("synthetic");
    expect(manifest.evidence_rule).toContain("final test remains sealed");
    expect(manifest.files).toHaveLength(10);
    for (const file of manifest.files) {
      const path = resolve(dirname(manifestPath), file.path);
      expect(existsSync(path), file.path).toBe(true);
      expect(sha256(path), file.path).toBe(file.sha256);
    }

    const regressionRows = readFileSync(join(chapter5ResourceRoot, "regression_outer_predictions.csv"), "utf8").trim().split("\n");
    const classRows = readFileSync(join(chapter5ResourceRoot, "classification_outer_probabilities.csv"), "utf8").trim().split("\n");
    expect(regressionRows).toHaveLength(25);
    expect(classRows).toHaveLength(25);
    expect(regressionRows.every((row, index) => index === 0 || row.endsWith(",synthetic"))).toBe(true);
    expect(classRows.filter((row) => row.includes(",1,")).length).toBeGreaterThanOrEqual(8);
  });

  it("records an honest Chapter 5 multi-lens review", () => {
    const review = read("docs/MODULE_3_CHAPTER_5_REVIEW.md");
    expect(review).toContain("4.82 / 5");
    expect(review).toContain("not the prediction-uncertainty chapter");
    expect(review).toContain("cannot support a real vegetation-height accuracy claim");
  });

  it("verifies the Chapter 6 prediction-uncertainty pack and its checksum manifest", () => {
    const manifestPath = join(chapter6ResourceRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      data_status: string;
      evidence_rule: string;
      files: Array<{ path: string; sha256: string }>;
    };
    expect(manifest.data_status).toContain("synthetic");
    expect(manifest.evidence_rule).toContain("exchangeability");
    expect(manifest.files).toHaveLength(9);
    for (const file of manifest.files) {
      const path = resolve(dirname(manifestPath), file.path);
      expect(existsSync(path), file.path).toBe(true);
      expect(sha256(path), file.path).toBe(file.sha256);
    }

    const intervalRows = readFileSync(join(chapter6ResourceRoot, "protected_interval_predictions.csv"), "utf8").trim().split("\n");
    const calibrationRows = readFileSync(join(chapter6ResourceRoot, "calibration_scores.csv"), "utf8").trim().split("\n");
    const gridRows = readFileSync(join(chapter6ResourceRoot, "prediction_evidence_grid.csv"), "utf8").trim().split("\n");
    expect(intervalRows).toHaveLength(25);
    expect(calibrationRows).toHaveLength(21);
    expect(gridRows).toHaveLength(25);
    expect(gridRows.at(-1)).toContain("false,,,,nodata");
  });

  it("records an honest Chapter 6 multi-lens review", () => {
    const review = read("docs/MODULE_3_CHAPTER_6_REVIEW.md");
    expect(review).toContain("4.86 / 5");
    expect(review).toContain("not the operational inference chapter");
    expect(review).toContain("cannot support a real coastal-meadow uncertainty");
  });

  it("verifies the Chapter 7 operational-workflow pack and its checksum manifest", () => {
    const manifestPath = join(chapter7ResourceRoot, "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      data_status: string;
      evidence_rule: string;
      files: Array<{ path: string; sha256: string }>;
    };
    expect(manifest.data_status).toContain("synthetic");
    expect(manifest.evidence_rule).toContain("predicted change");
    expect(manifest.files).toHaveLength(10);
    for (const file of manifest.files) {
      const path = resolve(dirname(manifestPath), file.path);
      expect(existsSync(path), file.path).toBe(true);
      expect(sha256(path), file.path).toBe(file.sha256);
    }
    const runs = readFileSync(join(chapter7ResourceRoot, "monitoring_runs_fixture.csv"), "utf8").trim().split("\n");
    expect(runs).toHaveLength(8);
    expect(runs.every((row, index) => index === 0 || row.endsWith(",synthetic"))).toBe(true);
  });

  it("records an honest Chapter 7 multi-lens review", () => {
    const review = read("docs/MODULE_3_CHAPTER_7_REVIEW.md");
    expect(review).toContain("4.89 / 5");
    expect(review).toContain("cannot support a real coastal-meadow monitoring claim");
    expect(review).toContain("capstone planned");
  });
});

describe("Module 3 operational workflow behaviour", () => {
  const feature = {
    name: "sentinel2_ndvi",
    unit: "unitless index",
    transform: "verified NDVI v1",
    support: "10 m seasonal cell",
    version: "1.0.0",
    dtype: "float32",
  };

  it("fails closed when operational feature meaning or order changes", () => {
    expect(validateOperationalFeatureSchema([feature], [{ ...feature }])).toEqual([]);
    expect(validateOperationalFeatureSchema([feature], [{ ...feature, transform: "annual median" }])).toEqual([
      expect.objectContaining({ code: "transform-mismatch", severity: "blocker" }),
    ]);
    expect(validateOperationalFeatureSchema([feature], [])).toEqual([
      expect.objectContaining({ code: "feature-count-mismatch", severity: "blocker" }),
    ]);
  });

  it("counts complete and edge raster windows deterministically", () => {
    expect(countPredictionWindows(1024, 768, 256, 256)).toEqual({ columns: 4, rows: 3, total: 12 });
    expect(countPredictionWindows(1025, 769, 256, 256)).toEqual({ columns: 5, rows: 4, total: 20 });
    expect(() => countPredictionWindows(0, 10, 5, 5)).toThrow("Raster width");
  });

  it("makes architecture scores inspectable rather than calling them approval", () => {
    expect(scoreModellingArchitectures({
      requiresXgboost: true,
      customStructuredValidation: true,
      archiveScaleProcessing: true,
      restrictedTargetsRemainLocal: true,
      repeatedServerSideComposites: true,
    })).toEqual({ local: 3, "earth-engine": 2, hybrid: 5 });
  });

  it("blocks schema drift and routes other monitoring failures to review", () => {
    const passing = {
      schemaMatch: true,
      sensorQaPass: true,
      temporalSupportMatch: true,
      outsideApplicabilityFraction: 0.08,
      maximumOutsideFraction: 0.10,
      coverageRecentlyVerified: true,
    };
    expect(evaluateMonitoringGate(passing)).toBe("release");
    expect(evaluateMonitoringGate({ ...passing, schemaMatch: false })).toBe("blocked");
    expect(evaluateMonitoringGate({ ...passing, outsideApplicabilityFraction: 0.11 })).toBe("review");
    expect(evaluateMonitoringGate({ ...passing, coverageRecentlyVerified: false })).toBe("review");
    expect(() => evaluateMonitoringGate({ ...passing, outsideApplicabilityFraction: 1.1 })).toThrow("between zero and one");
  });

  it("separates model-card structure from substantive completion", () => {
    const headings = [
      "model identity", "target and prediction unit", "intended use", "unsupported use",
      "feature schema", "training domain", "validation and performance", "uncertainty",
      "applicability", "limitations", "software and provenance", "update policy", "acceptance tests",
    ];
    const complete = Object.fromEntries(headings.map((heading) => [heading, `Completed ${heading}`]));
    expect(validateOperationalModelCard(complete)).toEqual({ missing: [], empty: [], valid: true });
    expect(validateOperationalModelCard({ ...complete, "unsupported use": "" })).toMatchObject({ empty: ["unsupported use"], valid: false });
    const missingUpdate = { ...complete };
    delete missingUpdate["update policy"];
    expect(validateOperationalModelCard(missingUpdate)).toMatchObject({ missing: ["update policy"], valid: false });
  });
});

describe("Module 3 prediction uncertainty behaviour", () => {
  it("calculates coverage, width and miss direction while refusing crossed bounds", () => {
    expect(calculateIntervalDiagnostics(
      [10, 20, 30, 40],
      [8, 18, 31, 35],
      [12, 22, 35, 38],
    )).toEqual({
      count: 4,
      coveredCount: 2,
      coverage: 0.5,
      meanWidth: 3.75,
      medianWidth: 4,
      lowerMisses: 1,
      upperMisses: 1,
    });
    expect(findIntervalCrossings([1, 5, 3], [2, 4, 6])).toEqual([1]);
    expect(() => calculateIntervalDiagnostics([1], [2], [1])).toThrow("Crossed interval bounds");
  });

  it("uses the finite-sample split-conformal rank and creates symmetric intervals", () => {
    const scores = Array.from({ length: 20 }, (_, index) => index + 1);
    expect(calculateSplitConformalQuantile(scores, 0.1)).toEqual({
      quantile: 19,
      rank: 19,
      calibrationCount: 20,
      targetCoverage: 0.9,
    });
    expect(buildSymmetricPredictionIntervals([10, 20], 3)).toEqual([
      { prediction: 10, lower: 7, upper: 13, width: 6 },
      { prediction: 20, lower: 17, upper: 23, width: 6 },
    ]);
    expect(() => calculateSplitConformalQuantile([1, Number.NaN], 0.1)).toThrow("finite, non-negative");
    expect(() => calculateSplitConformalQuantile([1, 2], 0)).toThrow("strictly between zero and one");
  });

  it("keeps input validity, applicability and interval width distinct in release policy", () => {
    expect(assignPredictionReleaseState({ inputValid: false, applicability: "outside", intervalWidth: null, widthReviewThreshold: 10 })).toBe("nodata");
    expect(assignPredictionReleaseState({ inputValid: true, applicability: "outside", intervalWidth: 3, widthReviewThreshold: 10 })).toBe("withhold");
    expect(assignPredictionReleaseState({ inputValid: true, applicability: "review", intervalWidth: 3, widthReviewThreshold: 10 })).toBe("review");
    expect(assignPredictionReleaseState({ inputValid: true, applicability: "supported", intervalWidth: 12, widthReviewThreshold: 10 })).toBe("review");
    expect(assignPredictionReleaseState({ inputValid: true, applicability: "supported", intervalWidth: 8, widthReviewThreshold: 10 })).toBe("supported");
    expect(() => assignPredictionReleaseState({ inputValid: true, applicability: "supported", intervalWidth: null, widthReviewThreshold: 10 })).toThrow("interval width");
  });
});

describe("Module 3 evaluation and applicability behaviour", () => {
  it("calculates decision, calibration and reliability evidence without losing counts", () => {
    const observed: Array<0 | 1> = [1, 1, 0, 0];
    const probabilities = [0.9, 0.4, 0.6, 0.1];
    const metrics = calculateExpandedBinaryClassificationMetrics(observed, probabilities, 0.5);
    expect(metrics).toMatchObject({ truePositive: 1, falsePositive: 1, trueNegative: 1, falseNegative: 1 });
    expect(metrics.f1).toBe(0.5);
    expect(metrics.balancedAccuracy).toBe(0.5);
    expect(metrics.brierScore).toBeCloseTo(0.185);
    expect(metrics.prevalence).toBe(0.5);
    expect(metrics.flaggedFraction).toBe(0.5);

    const bins = buildEqualWidthReliabilityBins(observed, probabilities, 2);
    expect(bins.map((bin) => bin.count)).toEqual([2, 2]);
    expect(bins.map((bin) => bin.positiveCount)).toEqual([1, 1]);
    expect(() => buildEqualWidthReliabilityBins(observed, probabilities, 1)).toThrow("between two and one hundred bins");
  });

  it("summarises structured failure without treating rows as independent sites", () => {
    const summaries = summariseResidualGroups([
      { group: "wet", site: "a", residual: -6 },
      { group: "wet", site: "a", residual: -4 },
      { group: "wet", site: "b", residual: -5 },
      { group: "dry", site: "a", residual: 2 },
      { group: "dry", site: "b", residual: -2 },
    ]);
    expect(summaries[0]).toEqual({ group: "wet", observationCount: 3, independentSiteCount: 2, mae: 5, bias: -5 });
    expect(summaries[1]).toEqual({ group: "dry", observationCount: 2, independentSiteCount: 2, mae: 2, bias: 0 });
    expect(() => summariseResidualGroups([])).toThrow("requires residual records");
  });

  it("calculates auditable standardized nearest analogues and applicability states", () => {
    const training = [[0, 0], [1, 1], [2, 2]];
    const supported = calculateStandardizedNearestAnalogue(training, [1.1, 1.1]);
    const outside = calculateStandardizedNearestAnalogue(training, [1, 3]);
    expect(supported.trainingIndex).toBe(1);
    expect(supported.distance).toBeLessThan(0.2);
    expect(supported.outsideUnivariateRange).toEqual([]);
    expect(outside.outsideUnivariateRange).toEqual([1]);
    expect(classifyApplicability(supported, 0.5, 1.5)).toBe("supported");
    expect(classifyApplicability({ ...supported, distance: 0.9 }, 0.5, 1.5)).toBe("review");
    expect(classifyApplicability(outside, 0.5, 3)).toBe("outside");
    expect(() => calculateStandardizedNearestAnalogue([[1, 1], [1, 2]], [1, 1.5])).toThrow("constant training feature");
    expect(() => classifyApplicability(supported, 2, 1)).toThrow("ordered");
  });
});

describe("Module 3 controlled optimisation behaviour", () => {
  it("counts bounded discrete spaces and validates the optimisation firewall", () => {
    expect(countDiscreteSearchCombinations({ depth: [2, 3, 4], rate: [0.02, 0.05], subsample: [0.8, 1] })).toBe(12);
    expect(() => countDiscreteSearchCombinations({ depth: [] })).toThrow("at least one candidate value");
    expect(validateOptimisationProtocol({
      primaryMetric: "MAE in centimetres",
      searchSpaceRationale: "modest capacity and shrinkage",
      innerValidationUnit: "spatial block",
      outerAssessmentUnit: "site",
      candidateBudget: 12,
      randomSeed: 42,
      finalTestOpened: false,
    })).toEqual([]);
    expect(validateOptimisationProtocol({
      primaryMetric: "",
      searchSpaceRationale: "",
      innerValidationUnit: "",
      outerAssessmentUnit: "site",
      candidateBudget: 0,
      randomSeed: -1,
      finalTestOpened: true,
    }).map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "missing-primary-metric",
      "missing-search-space-rationale",
      "missing-inner-validation-unit",
      "invalid-candidate-budget",
      "invalid-search-seed",
      "final-test-used-during-optimisation",
    ]));
  });

  it("distinguishes underfit, overfit and controlled learning dynamics", () => {
    expect(diagnoseLearningDynamics(8, 9, 9.4)).toBe("underfit");
    expect(diagnoseLearningDynamics(1.4, 5.2, 9.4)).toBe("overfit");
    expect(diagnoseLearningDynamics(3.3, 4.4, 9.4)).toBe("controlled");
    expect(() => diagnoseLearningDynamics(1, Number.NaN, 2)).toThrow("finite and non-negative");
  });

  it("summarises fold-level feature stability without hiding variation", () => {
    const summary = summariseFeatureStability([
      { feature: "uav_height_p95", fold: "a", importance: 1.4 },
      { feature: "uav_height_p95", fold: "b", importance: 1.0 },
      { feature: "texture", fold: "a", importance: -0.1 },
      { feature: "texture", fold: "b", importance: 0.3 },
    ]);
    expect(summary[0]).toMatchObject({ feature: "uav_height_p95", foldCount: 2, positiveFoldFraction: 1, meanImportance: 1.2 });
    expect(summary[1]).toMatchObject({ feature: "texture", positiveFoldFraction: 0.5 });
    expect(summary[1].meanImportance).toBeCloseTo(0.1);
    expect(() => summariseFeatureStability([
      { feature: "ndvi", fold: "a", importance: 1 },
      { feature: "ndvi", fold: "a", importance: 2 },
    ])).toThrow("only once per fold");
  });

  it("calculates threshold metrics and selects by a declared recall floor", () => {
    const observed: Array<0 | 1> = [1, 1, 0, 0, 0, 0];
    const probabilities = [0.8, 0.4, 0.7, 0.3, 0.2, 0.1];
    expect(calculateBinaryClassificationMetrics(observed, probabilities, 0.5)).toEqual({
      threshold: 0.5,
      truePositive: 1,
      falsePositive: 1,
      trueNegative: 3,
      falseNegative: 1,
      precision: 0.5,
      recall: 0.5,
      specificity: 0.75,
    });
    expect(selectThresholdByMinimumRecall(observed, probabilities, [0.2, 0.4, 0.5], 1)).toMatchObject({
      threshold: 0.4,
      recall: 1,
      precision: 2 / 3,
    });
    expect(() => calculateBinaryClassificationMetrics([1], [1.2], 0.5)).toThrow("between zero and one");
  });
});

describe("Module 3 structured validation behaviour", () => {
  it("creates deterministic balanced grouped folds with no protected-group overlap", () => {
    const groups = ["a", "a", "a", "b", "b", "c", "c", "d"];
    const folds = createBalancedGroupFolds(groups, 3);
    expect(folds).toHaveLength(3);
    expect(folds.flatMap((fold) => fold.testIndices).sort((a, b) => a - b)).toEqual(
      Array.from({ length: groups.length }, (_, index) => index),
    );
    expect(folds.every((fold) => findFoldGroupOverlap(groups, fold).length === 0)).toBe(true);
    expect(() => createBalancedGroupFolds(groups, 5)).toThrow("number of unique groups");
  });

  it("creates one complete assessment fold per location", () => {
    const groups = ["coast-b", "coast-a", "coast-b", "coast-c"];
    const folds = createLeaveOneGroupOutFolds(groups);
    expect(folds.map((fold) => fold.heldOutGroups)).toEqual([["coast-a"], ["coast-b"], ["coast-c"]]);
    expect(folds[1].testIndices).toEqual([0, 2]);
    expect(folds.every((fold) => findFoldGroupOverlap(groups, fold).length === 0)).toBe(true);
  });

  it("creates direction-respecting expanding temporal folds", () => {
    const periods = [2023, 2024, 2025, 2023, 2024, 2025];
    const folds = createForwardTemporalFolds(periods);
    expect(folds).toHaveLength(2);
    expect(folds[0]).toMatchObject({ trainIndices: [0, 3], testIndices: [1, 4], heldOutGroups: ["2024"] });
    expect(folds[1]).toMatchObject({ trainIndices: [0, 1, 3, 4], testIndices: [2, 5], heldOutGroups: ["2025"] });
    expect(() => createForwardTemporalFolds([2025, 2025])).toThrow("at least two ordered periods");
  });

  it("summarises fold variation without hiding the worst transfer", () => {
    expect(summariseFoldMetrics([2, 4, 6])).toEqual({
      mean: 4,
      standardDeviation: Math.sqrt(8 / 3),
      minimum: 2,
      maximum: 6,
    });
    expect(() => summariseFoldMetrics([])).toThrow("at least one finite value");
  });

  it("blocks outer assessment evidence from inner model selection", () => {
    expect(validateNestedValidationAssignments([
      { observationId: "a", outerFold: 1, outerRole: "development", innerFold: 1, usedForModelSelection: true },
      { observationId: "b", outerFold: 1, outerRole: "assessment", innerFold: null, usedForModelSelection: false },
    ])).toEqual([]);

    const issues = validateNestedValidationAssignments([
      { observationId: "a", outerFold: 1, outerRole: "development", innerFold: null, usedForModelSelection: true },
      { observationId: "b", outerFold: 1, outerRole: "assessment", innerFold: 2, usedForModelSelection: true },
      { observationId: "b", outerFold: 1, outerRole: "assessment", innerFold: null, usedForModelSelection: false },
    ]);
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "development-row-missing-inner-fold",
      "outer-assessment-used-for-selection",
      "outer-assessment-assigned-inner-fold",
      "duplicate-outer-assignment",
    ]));
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
