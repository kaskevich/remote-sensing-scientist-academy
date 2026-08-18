export type ModellingValidationIssue = {
  code: string;
  message: string;
  severity: "warning" | "blocker";
};

export type TargetSpecification = {
  target: string;
  units: string;
  observationMethod: string;
  spatialSupport: string;
  temporalSupport: string;
  validMinimum: number | null;
  validMaximum: number | null;
  predictionUnit: string;
  predictionDomain: string;
};

export type PredictorHypothesis = {
  predictor: string;
  source: string;
  unit: string;
  spatialSupport: string;
  temporalSupport: string;
  scientificRationale: string;
  expectedRelationship: string;
  knownLimitation: string;
  availableAtPredictionTime: boolean;
};

export type ModellingObservation = {
  observationId: string;
  target: number | string | null;
  site: string;
  group: string;
  spatialBlock: string;
  date: string;
  fold: string;
  excluded: boolean;
  exclusionReason: string | null;
  predictors: Record<string, unknown>;
};

export type ModelExperimentPlan = {
  primaryTarget: string;
  baseline: string;
  primaryMetric: string;
  candidateModel: string;
  validationStrategy: string;
  tuningStrategy: string;
  finalTestData: string;
  featureSet: string[];
  exclusions: string;
  frozenBeforeModelling: boolean;
  finalTestUsedForTuning: boolean;
};

export type RegressionMetrics = {
  mae: number;
  rmse: number;
  bias: number;
  rSquared: number;
};

export type RegressionStump = {
  threshold: number;
  leftValue: number;
  rightValue: number;
  predictions: number[];
  squaredError: number;
};

export type ModelRunMetadata = {
  modelFamily: string;
  objective: string;
  datasetVersion: string;
  foldRegistryVersion: string;
  featureOrder: string[];
  randomSeed: number;
  packageVersions: Record<string, string>;
  finalTestOpened: boolean;
};

function assertFiniteVector(values: number[], label: string) {
  if (values.length === 0) {
    throw new Error(`${label} must contain at least one value`);
  }
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error(`${label} must contain only finite numbers`);
  }
}

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function createMeanBaseline(trainingTargets: number[], predictionCount: number) {
  assertFiniteVector(trainingTargets, "Training targets");
  if (!Number.isInteger(predictionCount) || predictionCount < 0) {
    throw new Error("Prediction count must be a non-negative integer");
  }
  return Array.from({ length: predictionCount }, () => mean(trainingTargets));
}

export function createMedianBaseline(trainingTargets: number[], predictionCount: number) {
  assertFiniteVector(trainingTargets, "Training targets");
  if (!Number.isInteger(predictionCount) || predictionCount < 0) {
    throw new Error("Prediction count must be a non-negative integer");
  }
  const ordered = [...trainingTargets].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  const median = ordered.length % 2 === 0
    ? (ordered[middle - 1] + ordered[middle]) / 2
    : ordered[middle];
  return Array.from({ length: predictionCount }, () => median);
}

export function calculateRegressionMetrics(observed: number[], predicted: number[]): RegressionMetrics {
  assertFiniteVector(observed, "Observed values");
  assertFiniteVector(predicted, "Predicted values");
  if (observed.length !== predicted.length) {
    throw new Error("Observed and predicted values must have equal length");
  }

  const residuals = predicted.map((prediction, index) => prediction - observed[index]);
  const absoluteErrors = residuals.map((residual) => Math.abs(residual));
  const squaredErrors = residuals.map((residual) => residual ** 2);
  const observedMean = mean(observed);
  const totalSumOfSquares = observed.reduce((total, value) => total + (value - observedMean) ** 2, 0);
  const residualSumOfSquares = squaredErrors.reduce((total, value) => total + value, 0);

  return {
    mae: mean(absoluteErrors),
    rmse: Math.sqrt(mean(squaredErrors)),
    bias: mean(residuals),
    rSquared: totalSumOfSquares === 0 ? Number.NaN : 1 - residualSumOfSquares / totalSumOfSquares,
  };
}

export function calculateErrorSkill(candidateError: number, baselineError: number) {
  if (!Number.isFinite(candidateError) || candidateError < 0) {
    throw new Error("Candidate error must be a finite non-negative number");
  }
  if (!Number.isFinite(baselineError) || baselineError <= 0) {
    throw new Error("Baseline error must be a finite positive number");
  }
  return 1 - candidateError / baselineError;
}

export function findBestRegressionStump(feature: number[], target: number[]): RegressionStump {
  assertFiniteVector(feature, "Feature values");
  assertFiniteVector(target, "Target values");
  if (feature.length !== target.length) {
    throw new Error("Feature and target values must have equal length");
  }

  const uniqueValues = [...new Set(feature)].sort((left, right) => left - right);
  if (uniqueValues.length < 2) {
    throw new Error("A regression stump needs at least two distinct feature values");
  }

  let best: RegressionStump | null = null;
  for (let index = 0; index < uniqueValues.length - 1; index += 1) {
    const threshold = (uniqueValues[index] + uniqueValues[index + 1]) / 2;
    const leftTargets = target.filter((_, row) => feature[row] <= threshold);
    const rightTargets = target.filter((_, row) => feature[row] > threshold);
    if (leftTargets.length === 0 || rightTargets.length === 0) continue;
    const leftValue = mean(leftTargets);
    const rightValue = mean(rightTargets);
    const predictions = feature.map((value) => value <= threshold ? leftValue : rightValue);
    const squaredError = predictions.reduce(
      (total, prediction, row) => total + (target[row] - prediction) ** 2,
      0,
    );
    if (!best || squaredError < best.squaredError) {
      best = { threshold, leftValue, rightValue, predictions, squaredError };
    }
  }

  if (!best) throw new Error("No valid regression split could be constructed");
  return best;
}

export function applyBoostingStage(currentPredictions: number[], treeCorrections: number[], learningRate: number) {
  assertFiniteVector(currentPredictions, "Current predictions");
  assertFiniteVector(treeCorrections, "Tree corrections");
  if (currentPredictions.length !== treeCorrections.length) {
    throw new Error("Predictions and tree corrections must have equal length");
  }
  if (!Number.isFinite(learningRate) || learningRate <= 0 || learningRate > 1) {
    throw new Error("Learning rate must be greater than zero and at most one");
  }
  return currentPredictions.map(
    (prediction, index) => prediction + learningRate * treeCorrections[index],
  );
}

export function validateModelRunMetadata(metadata: ModelRunMetadata) {
  const issues: ModellingValidationIssue[] = [];
  for (const [value, label] of [
    [metadata.modelFamily, "model family"],
    [metadata.objective, "objective"],
    [metadata.datasetVersion, "dataset version"],
    [metadata.foldRegistryVersion, "fold registry version"],
  ]) {
    if (blank(value)) {
      issues.push({ code: `missing-${label.replaceAll(" ", "-")}`, message: `Model metadata needs a ${label}`, severity: "blocker" });
    }
  }
  if (metadata.featureOrder.length === 0) {
    issues.push({ code: "empty-feature-order", message: "Record the ordered feature schema used during fitting", severity: "blocker" });
  }
  if (new Set(metadata.featureOrder).size !== metadata.featureOrder.length) {
    issues.push({ code: "duplicate-feature-order", message: "Feature order contains duplicate names", severity: "blocker" });
  }
  if (!Number.isInteger(metadata.randomSeed) || metadata.randomSeed < 0) {
    issues.push({ code: "invalid-random-seed", message: "Random seed must be a recorded non-negative integer", severity: "blocker" });
  }
  if (Object.keys(metadata.packageVersions).length === 0) {
    issues.push({ code: "missing-package-versions", message: "Record the software versions used to fit and serialize the model", severity: "blocker" });
  }
  if (metadata.finalTestOpened) {
    issues.push({ code: "final-test-opened-during-development", message: "Chapter 2 development must not open the sealed final test data", severity: "blocker" });
  }
  return issues;
}

function blank(value: string) {
  return value.trim().length === 0;
}

export function validateTargetSpecification(specification: TargetSpecification) {
  const issues: ModellingValidationIssue[] = [];
  const required: Array<[keyof TargetSpecification, string]> = [
    ["target", "Target"],
    ["units", "Units or an explicit undocumented-unit statement"],
    ["observationMethod", "Observation method"],
    ["spatialSupport", "Spatial support"],
    ["temporalSupport", "Temporal support"],
    ["predictionUnit", "Prediction unit"],
    ["predictionDomain", "Prediction domain"],
  ];

  for (const [field, label] of required) {
    const value = specification[field];
    if (typeof value === "string" && blank(value)) {
      issues.push({
        code: `missing-${String(field)}`,
        message: `${label} must be stated before modelling`,
        severity: "blocker",
      });
    }
  }

  if (
    specification.validMinimum !== null
    && specification.validMaximum !== null
    && specification.validMinimum >= specification.validMaximum
  ) {
    issues.push({
      code: "invalid-target-range",
      message: "The valid target minimum must be lower than the valid maximum",
      severity: "blocker",
    });
  }

  return issues;
}

export function findTrainingServingSkew(predictors: PredictorHypothesis[]) {
  return predictors
    .filter((predictor) => !predictor.availableAtPredictionTime)
    .map((predictor) => ({
      code: "predictor-unavailable-at-inference",
      message: `${predictor.predictor} is present during training but unavailable when predictions are required`,
      severity: "blocker" as const,
    }));
}

export function validatePredictorHypotheses(predictors: PredictorHypothesis[]) {
  const issues: ModellingValidationIssue[] = [...findTrainingServingSkew(predictors)];
  const names = new Set<string>();

  for (const predictor of predictors) {
    const normalizedName = predictor.predictor.trim().toLowerCase();
    if (!normalizedName) {
      issues.push({ code: "unnamed-predictor", message: "Every predictor needs a stable name", severity: "blocker" });
    } else if (names.has(normalizedName)) {
      issues.push({ code: "duplicate-predictor", message: `${predictor.predictor} appears more than once`, severity: "blocker" });
    }
    names.add(normalizedName);

    for (const [value, label] of [
      [predictor.source, "source"],
      [predictor.unit, "unit or unit-status statement"],
      [predictor.spatialSupport, "spatial support"],
      [predictor.temporalSupport, "temporal support"],
      [predictor.scientificRationale, "scientific rationale"],
      [predictor.knownLimitation, "known limitation"],
    ]) {
      if (blank(value)) {
        issues.push({
          code: `missing-predictor-${label.replaceAll(" ", "-")}`,
          message: `${predictor.predictor || "Predictor"} is missing its ${label}`,
          severity: "blocker",
        });
      }
    }
  }

  return issues;
}

export function validateModellingDataset(observations: ModellingObservation[]) {
  const issues: ModellingValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (const observation of observations) {
    const id = observation.observationId.trim();
    if (!id) {
      issues.push({ code: "missing-observation-id", message: "Every modelling row needs an observation ID", severity: "blocker" });
    } else if (seenIds.has(id)) {
      issues.push({ code: "duplicate-observation-id", message: `${id} occurs in more than one modelling row`, severity: "blocker" });
    }
    seenIds.add(id);

    if (!observation.excluded && (observation.target === null || observation.target === "")) {
      issues.push({ code: "missing-target", message: `${id || "An included row"} has no target value`, severity: "blocker" });
    }

    for (const [value, label] of [
      [observation.site, "site"],
      [observation.group, "group"],
      [observation.spatialBlock, "spatial block"],
      [observation.fold, "saved fold assignment"],
    ]) {
      if (blank(value)) {
        issues.push({ code: `missing-${label.replaceAll(" ", "-")}`, message: `${id || "A row"} is missing ${label}`, severity: "blocker" });
      }
    }

    if (Number.isNaN(Date.parse(observation.date))) {
      issues.push({ code: "invalid-observation-date", message: `${id || "A row"} has an invalid observation date`, severity: "blocker" });
    }

    if (observation.excluded && blank(observation.exclusionReason ?? "")) {
      issues.push({ code: "unexplained-exclusion", message: `${id || "An excluded row"} needs an exclusion reason`, severity: "blocker" });
    }
  }

  return issues;
}

export function validateExperimentPlan(plan: ModelExperimentPlan) {
  const issues: ModellingValidationIssue[] = [];
  const required: Array<[keyof ModelExperimentPlan, string]> = [
    ["primaryTarget", "primary target"],
    ["baseline", "baseline"],
    ["primaryMetric", "primary metric"],
    ["candidateModel", "candidate model"],
    ["validationStrategy", "validation strategy"],
    ["tuningStrategy", "tuning strategy"],
    ["finalTestData", "final test data"],
    ["exclusions", "exclusion policy"],
  ];

  for (const [field, label] of required) {
    const value = plan[field];
    if (typeof value === "string" && blank(value)) {
      issues.push({ code: `missing-${String(field)}`, message: `The experiment plan needs a declared ${label}`, severity: "blocker" });
    }
  }

  if (plan.featureSet.length === 0) {
    issues.push({ code: "empty-feature-set", message: "The experiment plan needs a predeclared feature set", severity: "blocker" });
  }
  if (new Set(plan.featureSet).size !== plan.featureSet.length) {
    issues.push({ code: "duplicate-feature", message: "The predeclared feature set contains duplicate names", severity: "blocker" });
  }
  if (!plan.frozenBeforeModelling) {
    issues.push({ code: "plan-not-frozen", message: "Freeze and timestamp the experiment plan before model fitting", severity: "warning" });
  }
  if (plan.finalTestUsedForTuning) {
    issues.push({ code: "test-set-contamination", message: "Final test data must not influence tuning, feature selection or model choice", severity: "blocker" });
  }

  return issues;
}
