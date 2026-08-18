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

export type ValidationFold = {
  fold: number;
  trainIndices: number[];
  testIndices: number[];
  heldOutGroups: string[];
};

export type FoldMetricSummary = {
  mean: number;
  standardDeviation: number;
  minimum: number;
  maximum: number;
};

function requireGroups(groups: string[]) {
  if (groups.length === 0) {
    throw new Error("Validation requires at least one observation group");
  }
  if (groups.some((group) => blank(group))) {
    throw new Error("Every validation observation needs a non-empty group");
  }
}

export function createBalancedGroupFolds(groups: string[], nSplits: number): ValidationFold[] {
  requireGroups(groups);
  const uniqueGroups = [...new Set(groups)].sort();
  if (!Number.isInteger(nSplits) || nSplits < 2 || nSplits > uniqueGroups.length) {
    throw new Error("nSplits must be an integer between two and the number of unique groups");
  }

  const groupCounts = uniqueGroups
    .map((group) => ({ group, count: groups.filter((value) => value === group).length }))
    .sort((a, b) => b.count - a.count || a.group.localeCompare(b.group));
  const assignedGroups = Array.from({ length: nSplits }, () => [] as string[]);
  const assignedCounts = Array.from({ length: nSplits }, () => 0);

  for (const entry of groupCounts) {
    const destination = assignedCounts.indexOf(Math.min(...assignedCounts));
    assignedGroups[destination].push(entry.group);
    assignedCounts[destination] += entry.count;
  }

  return assignedGroups.map((heldOutGroups, fold) => {
    const heldOut = new Set(heldOutGroups);
    const testIndices = groups.flatMap((group, index) => heldOut.has(group) ? [index] : []);
    const trainIndices = groups.flatMap((group, index) => heldOut.has(group) ? [] : [index]);
    return { fold, trainIndices, testIndices, heldOutGroups: [...heldOutGroups].sort() };
  });
}

export function createLeaveOneGroupOutFolds(groups: string[]): ValidationFold[] {
  requireGroups(groups);
  return [...new Set(groups)].sort().map((heldOutGroup, fold) => {
    const testIndices = groups.flatMap((group, index) => group === heldOutGroup ? [index] : []);
    const trainIndices = groups.flatMap((group, index) => group === heldOutGroup ? [] : [index]);
    return { fold, trainIndices, testIndices, heldOutGroups: [heldOutGroup] };
  });
}

export function findFoldGroupOverlap(groups: string[], fold: ValidationFold) {
  requireGroups(groups);
  const indices = [...fold.trainIndices, ...fold.testIndices];
  if (indices.some((index) => !Number.isInteger(index) || index < 0 || index >= groups.length)) {
    throw new Error("Fold indices must refer to existing observations");
  }
  const trainGroups = new Set(fold.trainIndices.map((index) => groups[index]));
  return [...new Set(fold.testIndices.map((index) => groups[index]))]
    .filter((group) => trainGroups.has(group))
    .sort();
}

export function createForwardTemporalFolds(periods: Array<string | number>): ValidationFold[] {
  if (periods.length === 0) {
    throw new Error("Temporal validation requires at least one observation period");
  }
  const normalized = periods.map((period) => String(period).trim());
  if (normalized.some((period) => !period)) {
    throw new Error("Every temporal validation observation needs a period");
  }
  const uniquePeriods = [...new Set(normalized)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (uniquePeriods.length < 2) {
    throw new Error("Forward validation requires at least two ordered periods");
  }

  return uniquePeriods.slice(1).map((testPeriod, fold) => {
    const earlierPeriods = new Set(uniquePeriods.slice(0, fold + 1));
    const trainIndices = normalized.flatMap((period, index) => earlierPeriods.has(period) ? [index] : []);
    const testIndices = normalized.flatMap((period, index) => period === testPeriod ? [index] : []);
    return { fold, trainIndices, testIndices, heldOutGroups: [testPeriod] };
  });
}

export function summariseFoldMetrics(values: number[]): FoldMetricSummary {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new Error("Fold metrics must contain at least one finite value");
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return {
    mean,
    standardDeviation: Math.sqrt(variance),
    minimum: Math.min(...values),
    maximum: Math.max(...values),
  };
}

export type NestedValidationAssignment = {
  observationId: string;
  outerFold: number;
  outerRole: "development" | "assessment";
  innerFold: number | null;
  usedForModelSelection: boolean;
};

export function validateNestedValidationAssignments(assignments: NestedValidationAssignment[]) {
  const issues: ModellingValidationIssue[] = [];
  const seen = new Set<string>();

  for (const assignment of assignments) {
    const key = `${assignment.outerFold}:${assignment.observationId}`;
    if (seen.has(key)) {
      issues.push({ code: "duplicate-outer-assignment", message: `${assignment.observationId} appears twice in outer fold ${assignment.outerFold}`, severity: "blocker" });
    }
    seen.add(key);

    if (assignment.outerRole === "assessment" && assignment.usedForModelSelection) {
      issues.push({ code: "outer-assessment-used-for-selection", message: `${assignment.observationId} from outer fold ${assignment.outerFold} influenced model selection`, severity: "blocker" });
    }
    if (assignment.outerRole === "assessment" && assignment.innerFold !== null) {
      issues.push({ code: "outer-assessment-assigned-inner-fold", message: `${assignment.observationId} must remain outside inner folds for outer fold ${assignment.outerFold}`, severity: "blocker" });
    }
    if (assignment.outerRole === "development" && assignment.innerFold === null) {
      issues.push({ code: "development-row-missing-inner-fold", message: `${assignment.observationId} needs an inner-fold assignment inside outer fold ${assignment.outerFold}`, severity: "blocker" });
    }
  }

  return issues;
}

export type OptimisationProtocol = {
  primaryMetric: string;
  searchSpaceRationale: string;
  innerValidationUnit: string;
  outerAssessmentUnit: string;
  candidateBudget: number;
  randomSeed: number;
  finalTestOpened: boolean;
};

export function countDiscreteSearchCombinations(space: Record<string, readonly unknown[]>) {
  const entries = Object.entries(space);
  if (entries.length === 0 || entries.some(([, values]) => values.length === 0)) {
    throw new Error("Every search-space parameter needs at least one candidate value");
  }
  return entries.reduce((count, [, values]) => count * values.length, 1);
}

export function validateOptimisationProtocol(protocol: OptimisationProtocol) {
  const issues: ModellingValidationIssue[] = [];
  for (const [value, label] of [
    [protocol.primaryMetric, "primary metric"],
    [protocol.searchSpaceRationale, "search-space rationale"],
    [protocol.innerValidationUnit, "inner validation unit"],
    [protocol.outerAssessmentUnit, "outer assessment unit"],
  ]) {
    if (blank(value)) {
      issues.push({ code: `missing-${label.replaceAll(" ", "-")}`, message: `The optimisation protocol needs a ${label}`, severity: "blocker" });
    }
  }
  if (!Number.isInteger(protocol.candidateBudget) || protocol.candidateBudget < 1) {
    issues.push({ code: "invalid-candidate-budget", message: "Candidate budget must be a positive integer", severity: "blocker" });
  }
  if (!Number.isInteger(protocol.randomSeed) || protocol.randomSeed < 0) {
    issues.push({ code: "invalid-search-seed", message: "Search seed must be a non-negative integer", severity: "blocker" });
  }
  if (protocol.finalTestOpened) {
    issues.push({ code: "final-test-used-during-optimisation", message: "The final test must stay sealed throughout optimisation", severity: "blocker" });
  }
  return issues;
}

export type LearningDynamicsDiagnosis = "underfit" | "overfit" | "controlled";

export function diagnoseLearningDynamics(
  trainingLoss: number,
  validationLoss: number,
  baselineLoss: number,
): LearningDynamicsDiagnosis {
  if (![trainingLoss, validationLoss, baselineLoss].every(Number.isFinite) || baselineLoss <= 0 || trainingLoss < 0 || validationLoss < 0) {
    throw new Error("Learning-dynamics losses must be finite and non-negative, with a positive baseline loss");
  }
  if (validationLoss >= baselineLoss * 0.95 && trainingLoss >= baselineLoss * 0.75) {
    return "underfit";
  }
  if (validationLoss - trainingLoss > baselineLoss * 0.25) {
    return "overfit";
  }
  return "controlled";
}

export type FeatureImportanceRecord = {
  feature: string;
  fold: string;
  importance: number;
};

export type FeatureStabilitySummary = {
  feature: string;
  foldCount: number;
  positiveFoldFraction: number;
  meanImportance: number;
  standardDeviation: number;
};

export function summariseFeatureStability(records: FeatureImportanceRecord[]): FeatureStabilitySummary[] {
  if (records.length === 0) {
    throw new Error("Feature stability requires at least one fold-level importance record");
  }
  const seen = new Set<string>();
  const grouped = new Map<string, number[]>();
  for (const record of records) {
    const feature = record.feature.trim();
    const fold = record.fold.trim();
    if (!feature || !fold || !Number.isFinite(record.importance)) {
      throw new Error("Every feature-stability record needs a feature, fold and finite importance");
    }
    const key = `${feature}:${fold}`;
    if (seen.has(key)) {
      throw new Error("Each feature may occur only once per fold");
    }
    seen.add(key);
    grouped.set(feature, [...(grouped.get(feature) ?? []), record.importance]);
  }
  return [...grouped.entries()].map(([feature, values]) => {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
    return {
      feature,
      foldCount: values.length,
      positiveFoldFraction: values.filter((value) => value > 0).length / values.length,
      meanImportance: mean,
      standardDeviation: Math.sqrt(variance),
    };
  }).sort((a, b) => b.positiveFoldFraction - a.positiveFoldFraction || b.meanImportance - a.meanImportance || a.feature.localeCompare(b.feature));
}

export type BinaryClassificationMetrics = {
  threshold: number;
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
  precision: number;
  recall: number;
  specificity: number;
};

export function calculateBinaryClassificationMetrics(
  observed: Array<0 | 1>,
  probabilities: number[],
  threshold: number,
): BinaryClassificationMetrics {
  if (observed.length === 0 || observed.length !== probabilities.length) {
    throw new Error("Observed classes and probabilities must have equal, non-zero length");
  }
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1 || probabilities.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
    throw new Error("Probabilities and threshold must be finite values between zero and one");
  }
  let truePositive = 0;
  let falsePositive = 0;
  let trueNegative = 0;
  let falseNegative = 0;
  observed.forEach((value, index) => {
    const prediction = probabilities[index] >= threshold ? 1 : 0;
    if (value === 1 && prediction === 1) truePositive += 1;
    if (value === 0 && prediction === 1) falsePositive += 1;
    if (value === 0 && prediction === 0) trueNegative += 1;
    if (value === 1 && prediction === 0) falseNegative += 1;
  });
  const positivePredictions = truePositive + falsePositive;
  const observedPositives = truePositive + falseNegative;
  const observedNegatives = trueNegative + falsePositive;
  return {
    threshold,
    truePositive,
    falsePositive,
    trueNegative,
    falseNegative,
    precision: positivePredictions === 0 ? 0 : truePositive / positivePredictions,
    recall: observedPositives === 0 ? 0 : truePositive / observedPositives,
    specificity: observedNegatives === 0 ? 0 : trueNegative / observedNegatives,
  };
}

export function selectThresholdByMinimumRecall(
  observed: Array<0 | 1>,
  probabilities: number[],
  thresholds: number[],
  minimumRecall: number,
) {
  if (!Number.isFinite(minimumRecall) || minimumRecall < 0 || minimumRecall > 1 || thresholds.length === 0) {
    throw new Error("Threshold selection needs candidate thresholds and a minimum recall between zero and one");
  }
  const eligible = thresholds
    .map((threshold) => calculateBinaryClassificationMetrics(observed, probabilities, threshold))
    .filter((metrics) => metrics.recall >= minimumRecall)
    .sort((a, b) => b.precision - a.precision || b.specificity - a.specificity || b.threshold - a.threshold);
  if (eligible.length === 0) {
    throw new Error("No candidate threshold satisfies the declared minimum recall");
  }
  return eligible[0];
}

export type ExpandedBinaryClassificationMetrics = BinaryClassificationMetrics & {
  f1: number;
  balancedAccuracy: number;
  brierScore: number;
  prevalence: number;
  flaggedFraction: number;
};

export function calculateExpandedBinaryClassificationMetrics(
  observed: Array<0 | 1>,
  probabilities: number[],
  threshold: number,
): ExpandedBinaryClassificationMetrics {
  const counts = calculateBinaryClassificationMetrics(observed, probabilities, threshold);
  const precisionRecallTotal = counts.precision + counts.recall;
  return {
    ...counts,
    f1: precisionRecallTotal === 0 ? 0 : (2 * counts.precision * counts.recall) / precisionRecallTotal,
    balancedAccuracy: (counts.recall + counts.specificity) / 2,
    brierScore: probabilities.reduce((total, probability, index) => total + (probability - observed[index]) ** 2, 0) / observed.length,
    prevalence: observed.filter((value) => value === 1).length / observed.length,
    flaggedFraction: (counts.truePositive + counts.falsePositive) / observed.length,
  };
}

export type ReliabilityBin = {
  lowerBound: number;
  upperBound: number;
  count: number;
  positiveCount: number;
  meanProbability: number | null;
  observedFrequency: number | null;
};

export function buildEqualWidthReliabilityBins(
  observed: Array<0 | 1>,
  probabilities: number[],
  binCount: number,
): ReliabilityBin[] {
  calculateBinaryClassificationMetrics(observed, probabilities, 0.5);
  if (!Number.isInteger(binCount) || binCount < 2 || binCount > 100) {
    throw new Error("Reliability diagrams require between two and one hundred bins");
  }
  return Array.from({ length: binCount }, (_, index) => {
    const lowerBound = index / binCount;
    const upperBound = (index + 1) / binCount;
    const members = probabilities.flatMap((probability, row) => {
      const belongs = index === binCount - 1
        ? probability >= lowerBound && probability <= upperBound
        : probability >= lowerBound && probability < upperBound;
      return belongs ? [{ probability, observed: observed[row] }] : [];
    });
    const positiveCount = members.filter((member) => member.observed === 1).length;
    return {
      lowerBound,
      upperBound,
      count: members.length,
      positiveCount,
      meanProbability: members.length === 0 ? null : mean(members.map((member) => member.probability)),
      observedFrequency: members.length === 0 ? null : positiveCount / members.length,
    };
  });
}

export type ResidualGroupRecord = {
  group: string;
  site: string;
  residual: number;
};

export type ResidualGroupSummary = {
  group: string;
  observationCount: number;
  independentSiteCount: number;
  mae: number;
  bias: number;
};

export function summariseResidualGroups(records: ResidualGroupRecord[]): ResidualGroupSummary[] {
  if (records.length === 0) {
    throw new Error("Structured-failure diagnosis requires residual records");
  }
  const grouped = new Map<string, ResidualGroupRecord[]>();
  for (const record of records) {
    const group = record.group.trim();
    const site = record.site.trim();
    if (!group || !site || !Number.isFinite(record.residual)) {
      throw new Error("Every residual record needs a group, site and finite residual");
    }
    grouped.set(group, [...(grouped.get(group) ?? []), { ...record, group, site }]);
  }
  return [...grouped.entries()].map(([group, values]) => ({
    group,
    observationCount: values.length,
    independentSiteCount: new Set(values.map((value) => value.site)).size,
    mae: mean(values.map((value) => Math.abs(value.residual))),
    bias: mean(values.map((value) => value.residual)),
  })).sort((left, right) => right.mae - left.mae || left.group.localeCompare(right.group));
}

export type NearestAnalogueResult = {
  distance: number;
  trainingIndex: number;
  outsideUnivariateRange: number[];
};

export function calculateStandardizedNearestAnalogue(
  training: number[][],
  prediction: number[],
): NearestAnalogueResult {
  if (training.length < 2 || prediction.length === 0) {
    throw new Error("Applicability analysis requires at least two training rows and one prediction feature");
  }
  const width = prediction.length;
  if (training.some((row) => row.length !== width) || [...training.flat(), ...prediction].some((value) => !Number.isFinite(value))) {
    throw new Error("Training and prediction vectors must have matching dimensions and finite values");
  }
  const columns = Array.from({ length: width }, (_, column) => training.map((row) => row[column]));
  const means = columns.map((column) => mean(column));
  const scales = columns.map((column, index) => {
    const variance = mean(column.map((value) => (value - means[index]) ** 2));
    const scale = Math.sqrt(variance);
    if (scale === 0) {
      throw new Error("Applicability distance cannot standardize a constant training feature");
    }
    return scale;
  });
  const standardizedPrediction = prediction.map((value, column) => (value - means[column]) / scales[column]);
  const distances = training.map((row) => Math.sqrt(row.reduce((total, value, column) => {
    const difference = (value - means[column]) / scales[column] - standardizedPrediction[column];
    return total + difference ** 2;
  }, 0)));
  const distance = Math.min(...distances);
  return {
    distance,
    trainingIndex: distances.indexOf(distance),
    outsideUnivariateRange: columns.flatMap((column, index) => {
      const value = prediction[index];
      return value < Math.min(...column) || value > Math.max(...column) ? [index] : [];
    }),
  };
}

export type ApplicabilityState = "supported" | "review" | "outside";

export function classifyApplicability(
  result: NearestAnalogueResult,
  supportedMaximum: number,
  reviewMaximum: number,
): ApplicabilityState {
  if (![result.distance, supportedMaximum, reviewMaximum].every(Number.isFinite)
    || supportedMaximum < 0 || reviewMaximum <= supportedMaximum) {
    throw new Error("Applicability thresholds must be finite, non-negative and ordered");
  }
  if (result.outsideUnivariateRange.length > 0 || result.distance > reviewMaximum) return "outside";
  if (result.distance > supportedMaximum) return "review";
  return "supported";
}

export type IntervalDiagnostics = {
  count: number;
  coveredCount: number;
  coverage: number;
  meanWidth: number;
  medianWidth: number;
  lowerMisses: number;
  upperMisses: number;
};

function validateIntervalVectors(observed: number[], lower: number[], upper: number[]) {
  if (observed.length === 0 || observed.length !== lower.length || observed.length !== upper.length) {
    throw new Error("Observed values and interval bounds must have equal, non-zero length");
  }
  if ([...observed, ...lower, ...upper].some((value) => !Number.isFinite(value))) {
    throw new Error("Observed values and interval bounds must be finite");
  }
}

export function findIntervalCrossings(lower: number[], upper: number[]) {
  if (lower.length === 0 || lower.length !== upper.length) {
    throw new Error("Lower and upper interval bounds must have equal, non-zero length");
  }
  if ([...lower, ...upper].some((value) => !Number.isFinite(value))) {
    throw new Error("Interval bounds must be finite");
  }
  return lower.flatMap((value, index) => value > upper[index] ? [index] : []);
}

export function calculateIntervalDiagnostics(
  observed: number[],
  lower: number[],
  upper: number[],
): IntervalDiagnostics {
  validateIntervalVectors(observed, lower, upper);
  const crossings = findIntervalCrossings(lower, upper);
  if (crossings.length > 0) {
    throw new Error(`Crossed interval bounds must be diagnosed before coverage: ${crossings.join(", ")}`);
  }
  const widths = upper.map((value, index) => value - lower[index]);
  const orderedWidths = [...widths].sort((left, right) => left - right);
  const middle = Math.floor(orderedWidths.length / 2);
  const medianWidth = orderedWidths.length % 2 === 0
    ? (orderedWidths[middle - 1] + orderedWidths[middle]) / 2
    : orderedWidths[middle];
  const covered = observed.map((value, index) => value >= lower[index] && value <= upper[index]);
  const coveredCount = covered.filter(Boolean).length;
  return {
    count: observed.length,
    coveredCount,
    coverage: coveredCount / observed.length,
    meanWidth: mean(widths),
    medianWidth,
    lowerMisses: observed.filter((value, index) => value < lower[index]).length,
    upperMisses: observed.filter((value, index) => value > upper[index]).length,
  };
}

export type SplitConformalQuantile = {
  quantile: number;
  rank: number;
  calibrationCount: number;
  targetCoverage: number;
};

export function calculateSplitConformalQuantile(
  calibrationScores: number[],
  alpha: number,
): SplitConformalQuantile {
  if (calibrationScores.length === 0 || calibrationScores.some((score) => !Number.isFinite(score) || score < 0)) {
    throw new Error("Calibration scores must contain finite, non-negative values");
  }
  if (!Number.isFinite(alpha) || alpha <= 0 || alpha >= 1) {
    throw new Error("Conformal alpha must be a finite value strictly between zero and one");
  }
  const calibrationCount = calibrationScores.length;
  const rank = Math.min(calibrationCount, Math.ceil((calibrationCount + 1) * (1 - alpha)));
  const ordered = [...calibrationScores].sort((left, right) => left - right);
  return {
    quantile: ordered[rank - 1],
    rank,
    calibrationCount,
    targetCoverage: 1 - alpha,
  };
}

export function buildSymmetricPredictionIntervals(predictions: number[], halfWidth: number) {
  assertFiniteVector(predictions, "Point predictions");
  if (!Number.isFinite(halfWidth) || halfWidth < 0) {
    throw new Error("Interval half-width must be a finite, non-negative number");
  }
  return predictions.map((prediction) => ({
    prediction,
    lower: prediction - halfWidth,
    upper: prediction + halfWidth,
    width: halfWidth * 2,
  }));
}

export type PredictionReleaseState = "supported" | "review" | "withhold" | "nodata";

export function assignPredictionReleaseState(input: {
  inputValid: boolean;
  applicability: ApplicabilityState;
  intervalWidth: number | null;
  widthReviewThreshold: number;
}): PredictionReleaseState {
  if (!Number.isFinite(input.widthReviewThreshold) || input.widthReviewThreshold < 0) {
    throw new Error("The uncertainty review threshold must be finite and non-negative");
  }
  if (!input.inputValid) return "nodata";
  if (input.intervalWidth === null || !Number.isFinite(input.intervalWidth) || input.intervalWidth < 0) {
    throw new Error("Input-valid predictions need a finite, non-negative interval width");
  }
  if (input.applicability === "outside") return "withhold";
  if (input.applicability === "review" || input.intervalWidth > input.widthReviewThreshold) return "review";
  return "supported";
}
