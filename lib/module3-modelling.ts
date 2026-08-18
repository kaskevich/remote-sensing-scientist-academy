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
