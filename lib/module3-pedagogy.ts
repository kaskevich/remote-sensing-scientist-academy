import type {
  AcademyModuleOverview,
  FormativeCheck,
  ReviewedLessonDetails,
} from "@/lib/module1-pedagogy";

export type Module3LessonSource = {
  id: string;
  number: string;
  chapter: number;
  title: string;
  description: string;
  tools: string[];
  artifact: string;
  code: string;
};

type Module3PlanEntry = Omit<Module3LessonSource, "id" | "number"> & { number: number };

const plannedLessons: Module3PlanEntry[] = [
  {
    number: 1,
    chapter: 1,
    title: "Prediction, Inference and Explanation",
    description: "Separate predictive claims from description, explanation and causal inference before selecting an algorithm.",
    tools: ["Scientific reasoning", "Prediction contract", "Claim boundaries"],
    artifact: "Prediction Problem Statement",
    code: `statements = {
    "Estimate biomass for an unseen plot": "predictive",
    "Summarise biomass in sampled plots": "descriptive",
    "Test whether grazing causes change": "causal",
}
for statement, claim_type in statements.items():
    print(claim_type, "→", statement)`,
  },
  {
    number: 2,
    chapter: 1,
    title: "Define the Target and Prediction Unit",
    description: "Specify exactly what is predicted, how it was observed, and what receives one prediction.",
    tools: ["Target contract", "Spatial support", "Prediction domain"],
    artifact: "TARGET_SPECIFICATION.md",
    code: `target_specification = {
    "target": "vegetation_height_cm",
    "unit": "cm",
    "prediction_unit": "10 m raster cell",
    "spatial_support": "field plot footprint",
    "temporal_support": "measurement date ± 3 days",
}
for field, value in target_specification.items():
    print(f"{field}: {value}")`,
  },
  {
    number: 3,
    chapter: 1,
    title: "Design Predictors and Modelling Hypotheses",
    description: "Choose operationally available predictors through measurement reasoning rather than correlation hunting.",
    tools: ["Predictor hypotheses", "Training-serving skew", "Proxies"],
    artifact: "predictor_hypotheses.csv",
    code: `predictors = {
    "sentinel2_ndvi": True,
    "uav_height_p95": True,
    "field_height_measured_after_prediction": False,
}
for name, available_at_prediction_time in predictors.items():
    status = "eligible" if available_at_prediction_time else "reject"
    print(name, status, sep=" → ")`,
  },
  {
    number: 4,
    chapter: 1,
    title: "Build the Modelling Dataset and Pre-register the Experiment",
    description: "Create one auditable row per modelling observation and freeze the evaluation contract before fitting.",
    tools: ["Data contract", "Fold registry", "Experiment plan"],
    artifact: "MODEL_EXPERIMENT_PLAN.md",
    code: `required = {
    "observation_id", "target", "site", "group",
    "spatial_block", "date", "fold",
}
missing = required - set(model_data.columns)
if missing:
    raise ValueError(f"Missing modelling fields: {sorted(missing)}")
if model_data["observation_id"].duplicated().any():
    raise ValueError("One observation ID must map to one modelling row")`,
  },
  {
    number: 5,
    chapter: 2,
    title: "What Does a Useful Model Need to Beat?",
    description: "Define naive and simple baselines before judging complexity.",
    tools: ["Baselines", "Model skill", "Bias–variance"],
    artifact: "baseline_report.md",
    code: `from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error

baseline = DummyRegressor(strategy="mean")
baseline.fit(X_train, y_train)
baseline_predictions = baseline.predict(X_validation)
baseline_mae = mean_absolute_error(y_validation, baseline_predictions)
print(f"Mean baseline MAE: {baseline_mae:.2f} cm")`,
  },
  {
    number: 6,
    chapter: 2,
    title: "Trees, Ensembles and Boosting",
    description: "Reason from decision-tree partitions to bagging and sequential error correction.",
    tools: ["Decision trees", "Random Forest", "Gradient boosting"],
    artifact: "ensemble_reasoning.ipynb",
    code: `from sklearn.tree import DecisionTreeRegressor

stump = DecisionTreeRegressor(max_depth=1, random_state=42)
stump.fit(X_train[["uav_height_p95"]], y_train)
stump_predictions = stump.predict(X_validation[["uav_height_p95"]])
print(f"First split threshold: {stump.tree_.threshold[0]:.2f}")`,
  },
  {
    number: 7,
    chapter: 2,
    title: "XGBoost from First Principles",
    description: "Connect loss, additive trees, regularisation and learning rate to model behaviour.",
    tools: ["XGBoost", "Objectives", "Regularisation"],
    artifact: "xgboost_mechanism_notebook.ipynb",
    code: `import numpy as np

prediction_0 = np.full(4, 24.0)
tree_1_correction = np.array([-4.0, -2.0, 3.0, 5.0])
learning_rate = 0.3
prediction_1 = prediction_0 + learning_rate * tree_1_correction
print(prediction_1)`,
  },
  {
    number: 8,
    chapter: 2,
    title: "Train the First Defensible XGBoost Model",
    description: "Fit an untuned, reproducible candidate against a declared baseline and folds.",
    tools: ["XGBRegressor", "Metadata", "Serialization"],
    artifact: "first_xgboost_model",
    code: `from xgboost import XGBRegressor

model = XGBRegressor(
    objective="reg:squarederror",
    n_estimators=200,
    learning_rate=0.05,
    max_depth=3,
    random_state=42,
    n_jobs=1,
)
model.fit(X_train[feature_order], y_train)
predictions = model.predict(X_validation[feature_order])`,
  },
  {
    number: 9,
    chapter: 3,
    title: "Validation Is Part of the Model",
    description: "Treat the withheld evidence and its destination claim as part of the scientific model.",
    tools: ["Generalisation", "Cross-validation", "Proximity leakage"],
    artifact: "validation_claim.md",
    code: `from sklearn.model_selection import GroupShuffleSplit

splitter = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=42)
train_index, test_index = next(splitter.split(data, groups=data["site"]))
train_sites = set(data.loc[train_index, "site"])
test_sites = set(data.loc[test_index, "site"])
assert train_sites.isdisjoint(test_sites)
print("Held-out site:", sorted(test_sites))`,
  },
  {
    number: 10,
    chapter: 3,
    title: "Spatial, Grouped and Leave-Location-Out Validation",
    description: "Match row, group, block, site and buffered folds to the intended spatial transfer claim.",
    tools: ["GroupKFold", "Spatial blocks", "LeaveOneGroupOut"],
    artifact: "spatial_validation_comparison.ipynb",
    code: `from sklearn.model_selection import LeaveOneGroupOut

splitter = LeaveOneGroupOut()
for fold, (train_index, test_index) in enumerate(
    splitter.split(X, y, groups=data["site"]), start=1
):
    train_sites = set(data.loc[train_index, "site"])
    test_sites = set(data.loc[test_index, "site"])
    assert train_sites.isdisjoint(test_sites)
    print(fold, sorted(test_sites), len(test_index))`,
  },
  {
    number: 11,
    chapter: 3,
    title: "Temporal and Spatiotemporal Validation",
    description: "Evaluate future and future-site transfer without allowing later evidence to move backward in time.",
    tools: ["Temporal holdout", "Rolling origin", "Drift"],
    artifact: "temporal_validation_report.md",
    code: `years = sorted(data["year"].unique())
for fold, test_year in enumerate(years[1:], start=1):
    train_years = years[:fold]
    train_index = data.index[data["year"].isin(train_years)]
    test_index = data.index[data["year"] == test_year]
    assert data.loc[train_index, "year"].max() < test_year
    print(fold, train_years, "→", test_year)`,
  },
  {
    number: 12,
    chapter: 3,
    title: "Nested Model Selection and Leakage Prevention",
    description: "Keep inner procedure selection inside outer generalisation assessment and audit every leakage route.",
    tools: ["Nested CV", "Pipeline", "Leakage audit"],
    artifact: "Structured Validation Design",
    code: `outer = LeaveOneGroupOut()
for train_index, test_index in outer.split(X, y, groups=site):
    search.fit(
        X.iloc[train_index],
        y.iloc[train_index],
        groups=spatial_block.iloc[train_index],
    )
    predictions = search.predict(X.iloc[test_index])
    save_outer_predictions(test_index, predictions, search.best_params_)`,
  },
  {
    number: 13,
    chapter: 4,
    title: "Hyperparameter Optimisation",
    description: "Design a bounded, reproducible search inside nested development evidence and compare it fairly with the untuned candidate.",
    tools: ["RandomizedSearchCV", "Grouped inner folds", "Search protocol"],
    artifact: "Controlled Tuning Protocol",
    code: `from sklearn.model_selection import GroupKFold, RandomizedSearchCV
from xgboost import XGBRegressor

inner = GroupKFold(n_splits=3)
search = RandomizedSearchCV(
    XGBRegressor(objective="reg:squarederror", random_state=42, n_jobs=1),
    {"max_depth": [2, 3, 4], "learning_rate": [0.02, 0.05, 0.1],
     "min_child_weight": [1, 3, 6], "subsample": [0.7, 0.9, 1.0]},
    n_iter=12, scoring="neg_mean_absolute_error", cv=inner,
    random_state=42, n_jobs=1, refit=True,
)
search.fit(X_outer_development, y_outer_development,
           groups=block_outer_development)`,
  },
  {
    number: 14,
    chapter: 4,
    title: "Early Stopping, Regularisation and Learning Dynamics",
    description: "Read training and structured-development loss together, then stop boosting before additional trees cease to improve transferable performance.",
    tools: ["XGBoost early stopping", "Learning curves", "Regularisation"],
    artifact: "Learning Dynamics Report",
    code: `from xgboost import XGBRegressor

model = XGBRegressor(
    n_estimators=2000,
    learning_rate=0.03,
    max_depth=3,
    min_child_weight=3,
    subsample=0.8,
    colsample_bytree=0.8,
    early_stopping_rounds=40,
    eval_metric="mae",
    random_state=42,
    n_jobs=1,
)
model.fit(X_inner_train, y_inner_train,
          eval_set=[(X_inner_train, y_inner_train),
                    (X_stopping_group, y_stopping_group)], verbose=False)`,
  },
  {
    number: 15,
    chapter: 4,
    title: "Feature Selection, Redundancy and Stability",
    description: "Compare full and scientifically reduced predictor sets using fold-level relevance and stability rather than one automatic ranking.",
    tools: ["Permutation importance", "Correlated predictors", "Fold stability"],
    artifact: "Feature Stability Report",
    code: `from sklearn.inspection import permutation_importance

result = permutation_importance(
    fitted_inner_model,
    X_inner_validation,
    y_inner_validation,
    scoring="neg_mean_absolute_error",
    n_repeats=30,
    random_state=42,
)
fold_importance = (
    pd.DataFrame({"feature": X_inner_validation.columns,
                  "importance": result.importances_mean,
                  "spread": result.importances_std})
    .sort_values("importance", ascending=False)
)
fold_importance`,
  },
  {
    number: 16,
    chapter: 4,
    title: "Imbalanced Classification and Decision Thresholds",
    description: "Separate probability estimation from ecological action and choose a rare-habitat threshold from declared error costs.",
    tools: ["Precision and recall", "Class weighting", "Decision thresholds"],
    artifact: "Rare-habitat Threshold Decision",
    code: `from sklearn.metrics import confusion_matrix

rows = []
for threshold in [0.20, 0.35, 0.50, 0.65]:
    predicted = (rare_probability >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(
        y_inner_validation, predicted, labels=[0, 1]
    ).ravel()
    rows.append({
        "threshold": threshold,
        "precision": tp / (tp + fp) if tp + fp else 0,
        "recall": tp / (tp + fn) if tp + fn else 0,
        "specificity": tn / (tn + fp) if tn + fp else 0,
    })
pd.DataFrame(rows)`,
  },
  {
    number: 17,
    chapter: 5,
    title: "Regression Evaluation",
    description: "Interpret R², RMSE, MAE and bias together with fold variability and residual diagnostics.",
    tools: ["R²", "RMSE", "Residual diagnostics"],
    artifact: "Regression Evaluation Package",
    code: `from sklearn.metrics import mean_absolute_error, r2_score, root_mean_squared_error

evaluation = outer_predictions.copy()
evaluation["residual"] = evaluation["prediction"] - evaluation["observed"]
summary = {
    "mae_cm": mean_absolute_error(evaluation["observed"], evaluation["prediction"]),
    "rmse_cm": root_mean_squared_error(evaluation["observed"], evaluation["prediction"]),
    "bias_cm": evaluation["residual"].mean(),
    "r_squared": r2_score(evaluation["observed"], evaluation["prediction"]),
}
summary`,
  },
  {
    number: 18,
    chapter: 5,
    title: "Classification Evaluation and Probability Quality",
    description: "Separate fixed class decisions, score ranking and probability calibration under class imbalance.",
    tools: ["Confusion matrix", "ROC and PR curves", "Calibration"],
    artifact: "Classification Evaluation and Probability-quality Package",
    code: `from sklearn.metrics import brier_score_loss, confusion_matrix, roc_auc_score

y_true = outer_scores["rare_habitat"].to_numpy()
probability = outer_scores["rare_probability"].to_numpy()
predicted = (probability >= frozen_threshold).astype(int)
tn, fp, fn, tp = confusion_matrix(y_true, predicted, labels=[0, 1]).ravel()
evidence = {
    "counts": {"tn": tn, "fp": fp, "fn": fn, "tp": tp},
    "roc_auc": roc_auc_score(y_true, probability),
    "brier": brier_score_loss(y_true, probability),
}
evidence`,
  },
  {
    number: 19,
    chapter: 5,
    title: "Residual Geography and Structured Failure",
    description: "Map where errors concentrate and expose site, subgroup and acquisition failure hidden by averages.",
    tools: ["Residual maps", "Subgroup evidence", "Failure hypotheses"],
    artifact: "Model Diagnostic Report",
    code: `diagnostic = outer_predictions.merge(
    context_registry, on="observation_id", how="left", validate="one_to_one"
)
diagnostic["residual"] = diagnostic["prediction"] - diagnostic["observed"]
diagnostic["absolute_error"] = diagnostic["residual"].abs()
by_habitat = diagnostic.groupby("habitat_stratum").agg(
    n=("observation_id", "size"),
    sites=("site", "nunique"),
    mae_cm=("absolute_error", "mean"),
    bias_cm=("residual", "mean"),
)
by_habitat`,
  },
  {
    number: 20,
    chapter: 5,
    title: "Model Interpretation Without Causal Overclaiming",
    description: "Compare gain, permutation, dependence and SHAP explanations while preserving predictive claim boundaries.",
    tools: ["Permutation importance", "SHAP", "Partial dependence and ICE"],
    artifact: "Interpretation Stability Report",
    code: `import pandas as pd
from sklearn.inspection import permutation_importance

gain = pd.Series(fitted_model.feature_importances_, index=feature_order)
permuted = permutation_importance(
    fitted_model, X_outer_assessment[feature_order], y_outer_assessment,
    scoring="neg_mean_absolute_error", n_repeats=30, random_state=42,
)
comparison = pd.DataFrame({
    "gain": gain,
    "permutation_mae_increase": permuted.importances_mean,
    "permutation_spread": permuted.importances_std,
})
comparison.sort_values("permutation_mae_increase", ascending=False)`,
  },
  {
    number: 21,
    chapter: 5,
    title: "Domain of Applicability and Extrapolation",
    description: "Identify, flag and map predictions unsupported by represented multivariate training evidence.",
    tools: ["Predictor-space distance", "Nearest analogues", "Applicability map"],
    artifact: "Model Diagnostic and Applicability Package",
    code: `import numpy as np
from sklearn.preprocessing import StandardScaler

features = ["sentinel2_ndvi", "uav_height_p95", "moisture_index"]
scaler = StandardScaler().fit(X_development[features])
training_z = scaler.transform(X_development[features])
prediction_z = scaler.transform(prediction_units[features])
distance = np.sqrt(
    ((prediction_z[:, None, :] - training_z[None, :, :]) ** 2).sum(axis=2)
)
prediction_units["nearest_training_distance"] = distance.min(axis=1)
prediction_units["nearest_training_row"] = distance.argmin(axis=1)`,
  },
  {
    number: 22,
    chapter: 6,
    title: "What Uncertainty Means in Predictive EO",
    description: "Separate measurement, sampling, model, residual and transfer uncertainty before choosing a numerical method.",
    tools: ["Uncertainty inventory", "Evidence chain", "Claim boundaries"],
    artifact: "Uncertainty Inventory",
    code: `uncertainty_register = [
    {"source": "field measurement", "type": "measurement", "represented_by_interval": False},
    {"source": "which meadows were sampled", "type": "sampling", "represented_by_interval": False},
    {"source": "unexplained held-out variation", "type": "residual", "represented_by_interval": True},
    {"source": "new sensor or year", "type": "transfer", "represented_by_interval": False},
]
for item in uncertainty_register:
    print(item["type"], "→", item["represented_by_interval"])`,
  },
  {
    number: 23,
    chapter: 6,
    title: "Prediction Intervals and Quantile Approaches",
    description: "Fit lower and upper conditional quantiles and evaluate interval coverage and width on protected transfer evidence.",
    tools: ["Quantile regression", "Pinball loss", "Coverage and width"],
    artifact: "Quantile Interval Report",
    code: `from xgboost import XGBRegressor

def fit_quantile(alpha):
    model = XGBRegressor(
        objective="reg:quantileerror", quantile_alpha=alpha,
        tree_method="hist", n_estimators=400, learning_rate=0.04,
        max_depth=3, random_state=42, n_jobs=1,
    )
    return model.fit(X_train[feature_order], y_train)

lower_model = fit_quantile(0.10)
upper_model = fit_quantile(0.90)
lower = lower_model.predict(X_assessment[feature_order])
upper = upper_model.predict(X_assessment[feature_order])`,
  },
  {
    number: 24,
    chapter: 6,
    title: "Conformal Prediction and Empirical Coverage",
    description: "Calibrate split-conformal intervals, test empirical coverage, and audit exchangeability under spatial and temporal dependence.",
    tools: ["Split conformal", "Nonconformity scores", "Structured coverage"],
    artifact: "Conformal Coverage Report",
    code: `import numpy as np

calibration_prediction = model.predict(X_calibration[feature_order])
scores = np.abs(y_calibration - calibration_prediction)
alpha = 0.10
n = len(scores)
rank = min(n, int(np.ceil((n + 1) * (1 - alpha))))
q_hat = np.sort(scores)[rank - 1]

test_prediction = model.predict(X_assessment[feature_order])
lower = test_prediction - q_hat
upper = test_prediction + q_hat
covered = (y_assessment >= lower) & (y_assessment <= upper)`,
  },
  {
    number: 25,
    chapter: 6,
    title: "Uncertainty and Applicability Maps",
    description: "Release prediction, interval width and applicability as aligned but non-interchangeable evidence layers.",
    tools: ["Prediction map", "Uncertainty map", "Applicability map"],
    artifact: "Prediction Evidence Package",
    code: `evidence = prediction_grid.copy()
evidence["interval_width"] = evidence["upper"] - evidence["lower"]
evidence["release_state"] = "supported"
evidence.loc[evidence["interval_width"] > frozen_width_limit, "release_state"] = "review"
evidence.loc[
    evidence["applicability_state"] == "outside", "release_state"
] = "withhold"
evidence.loc[evidence["input_valid"] == False, "release_state"] = "nodata"

assert evidence[["prediction", "lower", "upper"]].notna().all(axis=1).equals(
    evidence["input_valid"]
)`,
  },
  { number: 26, chapter: 7, title: "Raster Inference at Scale", description: "Apply a fixed feature schema through masks and chunked prediction without changing meaning.", tools: ["Schema validation", "Chunked inference", "NoData"], artifact: "spatial_prediction_pipeline.py", code: "" },
  { number: 27, chapter: 7, title: "Google Earth Engine for Modelling Workflows", description: "Use server-side sampling, supported classifiers and exports for a justified component.", tools: ["Earth Engine", "ee.Classifier", "Export"], artifact: "earth_engine_modelling_component.ipynb", code: "" },
  { number: 28, chapter: 7, title: "Local ML versus Earth Engine ML", description: "Select an architecture by validation control, scale, access and reproducibility.", tools: ["Architecture", "XGBoost", "Earth Engine"], artifact: "model_architecture_decision.md", code: "" },
  { number: 29, chapter: 7, title: "Monitoring Through Repeated Predictions", description: "Separate predicted differences from observed ecological change and define drift gates.", tools: ["Repeated inference", "Drift", "Review triggers"], artifact: "monitoring_runbook.md", code: "" },
  { number: 30, chapter: 7, title: "Reproducibility, Model Cards and Operational QA", description: "Package the model, evidence, limitations and update policy for reviewable operation.", tools: ["Model card", "Versioning", "Operational QA"], artifact: "MODEL_CARD.md", code: "" },
];

export const module3Lessons: Module3LessonSource[] = plannedLessons.map((item) => ({
  ...item,
  id: `lesson-3-${String(item.number).padStart(2, "0")}`,
  number: `3.${item.number}`,
}));

export const publishedModule3LessonIds = [
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
] as const;

const publishedLessonIdSet = new Set<string>(publishedModule3LessonIds);

export const publishedModule3Lessons = module3Lessons.filter((lesson) => publishedLessonIdSet.has(lesson.id));

const chapterTitles = [
  "Frame the Prediction Problem",
  "Establish the Baseline",
  "Validate Spatial Models Properly",
  "Optimise Without Fooling Yourself",
  "Evaluate, Diagnose and Understand",
  "Quantify Prediction Uncertainty",
  "From Model to Operational EO Workflow",
];

export const module3Overview: AcademyModuleOverview = {
  moduleNumber: 3,
  accent: "terracotta",
  overviewLabel: "Module 3 overview",
  navigationTitle: "Remote Sensing Modelling lessons",
  navigationMeta: "25 of 30 lessons available · capstone planned",
  syllabusAriaLabel: "Thirty-lesson Module 3 curriculum map",
  planningNote:
    "Chapters 1–6 are available now. Chapter 7 and the capstone remain visibly planned and will be released only after their scientific, software and accessibility reviews pass.",
  title: "Remote Sensing Modelling",
  purpose:
    "Turn remote-sensing observations into defensible predictions by making the scientific claim, training evidence, validation design, uncertainty and operational domain explicit.",
  finalProject: "Environmental Monitoring Project",
  prerequisites:
    "Modules 1–2 or equivalent competence in scientific Python, tabular data, spatial support, raster and EO products, spatial sampling, model QA and reproducible delivery",
  outcomes: [
    "Formulate predictive EO questions without confusing association, explanation and causality",
    "Define target, prediction unit, domain and operational predictor contract",
    "Establish baselines and train reproducible tree-ensemble and XGBoost models",
    "Design spatial, temporal and nested validation that matches the intended claim",
    "Evaluate regression, classification, calibration and structured failure",
    "Map domain of applicability and prediction uncertainty",
    "Operationalise bounded local and Earth Engine modelling workflows",
  ],
  progression: [
    "Question",
    "Target and unit",
    "Predictor hypotheses",
    "Training evidence",
    "Baseline and model",
    "Independent validation",
    "Uncertainty and applicability",
    "Operational monitoring",
  ],
  chapters: chapterTitles.map((title, index) => ({
    number: index + 1,
    title,
    lessons: module3Lessons
      .filter((lesson) => lesson.chapter === index + 1)
      .map((lesson) => ({
        number: Number(lesson.number.split(".")[1]),
        title: lesson.title,
        status: publishedLessonIdSet.has(lesson.id) ? "available" as const : "planned" as const,
        lessonId: publishedLessonIdSet.has(lesson.id) ? lesson.id : undefined,
      })),
  })),
  capstone: {
    number: 31,
    title: "Environmental Monitoring Project",
    status: "planned",
  },
};

export const MODULE3_SOFTWARE_VERSIONS = {
  python: "3.12.13",
  jupyter: "JupyterLab 4 / Notebook 7",
  numpy: "2.4.2",
  pandas: "2.2.3",
  scikitLearn: "1.9.0",
  xgboost: "3.3.0",
} as const;

type LessonConfiguration = {
  estimatedTime: string;
  lessonType: string;
  markdownFile: string;
  formativeChecks: FormativeCheck[];
  submissionChecklist: string[];
  rubric: ReviewedLessonDetails["rubric"];
  coreReferences: Array<{ title: string; href: string }>;
  furtherReading: Array<{ title: string; href: string }>;
};

const commonChecklist = [
  "The scientific claim, prediction unit and intended domain are explicit",
  "Every field and decision is linked to traceable evidence rather than a guessed meaning",
  "The notebook or document distinguishes observation, prediction and interpretation",
  "Limitations and unsupported claims are stated in the artifact itself",
  "Files use stable names and can be reviewed without hidden notebook state",
];

const rubric = (technical: string, judgement: string): ReviewedLessonDetails["rubric"] => [
  { dimension: "Technical correctness", expectation: technical },
  { dimension: "Conceptual understanding", expectation: judgement },
  { dimension: "Reproducibility", expectation: "Records source identity, definitions, exclusions, decisions and a reviewable output with stable filenames" },
  { dimension: "Scientific communication", expectation: "States the supported predictive claim, relevant uncertainty and the boundary beyond which the evidence does not extend" },
];

const lessonConfigurations: Record<string, LessonConfiguration> = {
  "lesson-3-01": {
    estimatedTime: "120–160 minutes",
    lessonType: "Prediction Framing Studio",
    markdownFile: "content/lessons/module-3/lesson-01.md",
    formativeChecks: [
      {
        id: "m3-l1-prediction-cause",
        question: "A model predicts biomass accurately from a vegetation index in withheld sites. Which claim is supported?",
        options: [
          "The index contains useful predictive information in the represented domain",
          "Changing the index would cause biomass to change",
          "The index is the ecological mechanism controlling biomass",
        ],
        correctOption: 0,
        explanation: "Independent predictive performance supports an association useful for prediction in the evaluated domain. It does not identify an intervention or causal mechanism.",
      },
      {
        id: "m3-l1-observation-model",
        question: "What is the model in a supervised regression workflow?",
        options: [
          "A learned mapping from predictors to a continuous target under stated conditions",
          "The original field measurement itself",
          "A guarantee that the predictor explains the target causally",
        ],
        correctOption: 0,
        explanation: "The model is fitted from examples and produces predictions. Its validity depends on target definition, evidence, validation and prediction domain.",
      },
      {
        id: "m3-l1-claim-domain",
        question: "Why must a predictive statement name its domain?",
        options: [
          "Because performance evidence applies to represented places, times, sensors and conditions",
          "Because every model requires a global map",
          "Because domain wording automatically removes uncertainty",
        ],
        correctOption: 0,
        explanation: "A result evaluated on particular sites, seasons and measurements cannot silently support every geography or future acquisition condition.",
      },
    ],
    submissionChecklist: [...commonChecklist, "The Prediction Problem Statement classifies descriptive, predictive, explanatory and causal claims correctly"],
    rubric: rubric("Classifies claim types, target, predictors, observations, regression/classification and prediction domain without conflation", "Explains why predictive usefulness and causal explanation are different scientific achievements"),
    coreReferences: [
      { title: "Shmueli (2010), To Explain or to Predict?", href: "https://doi.org/10.1214/10-STS330" },
      { title: "scikit-learn glossary: feature, sample and target", href: "https://scikit-learn.org/stable/glossary.html" },
    ],
    furtherReading: [
      { title: "What If: Causal Inference book", href: "https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/" },
      { title: "Roberts et al. (2017), structured cross-validation", href: "https://doi.org/10.1111/ecog.02881" },
    ],
  },
  "lesson-3-02": {
    estimatedTime: "140–190 minutes",
    lessonType: "Target Contract Laboratory",
    markdownFile: "content/lessons/module-3/lesson-02.md",
    formativeChecks: [
      { id: "m3-l2-unit", question: "What exactly receives one prediction in a 10 m habitat-condition map?", options: ["Each defined 10 m raster cell", "The entire satellite scene", "Every field measurement regardless of support"], correctOption: 0, explanation: "The prediction unit is the entity assigned one output. It must be reconciled with field support, raster support and the intended decision." },
      { id: "m3-l2-unknown-unit", question: "The dataset records AGB but its supplied metadata does not document a unit. What should the target contract say?", options: ["Unit undocumented in the supplied metadata; do not infer it", "Assume grams per square metre", "Remove the field name and call it biomass"], correctOption: 0, explanation: "A model can execute on undocumented values, but the result cannot support a unit-bearing scientific claim until authoritative metadata resolve the measurement definition." },
      { id: "m3-l2-support", question: "Why is a plot measurement not automatically a raster-cell target?", options: ["The plot and cell may cover different ground areas and times", "Raster cells cannot contain continuous values", "Plots are always more accurate"], correctOption: 0, explanation: "Target–predictor pairing needs a documented support rule. Neither representation is inherently correct when their footprints or acquisition periods differ." },
    ],
    submissionChecklist: [...commonChecklist, "TARGET_SPECIFICATION.md records target definition, unit status, protocol, valid range, spatial and temporal support, prediction unit and domain"],
    rubric: rubric("Defines a measurable target and reconciles its valid values, observation protocol and support with the intended prediction unit", "Defends why one prediction belongs to a plot, cell, polygon or object and identifies unresolved metadata"),
    coreReferences: [
      { title: "scikit-learn glossary and target types", href: "https://scikit-learn.org/stable/glossary.html" },
      { title: "Baltic coastal plant traits 2024 dataset record", href: "https://doi.org/10.5281/zenodo.20083250" },
    ],
    furtherReading: [
      { title: "OGC Abstract Specification: geographic information", href: "https://www.ogc.org/standards/" },
      { title: "FAIR Guiding Principles", href: "https://www.go-fair.org/fair-principles/" },
    ],
  },
  "lesson-3-03": {
    estimatedTime: "150–210 minutes",
    lessonType: "Predictor Hypothesis Workshop",
    markdownFile: "content/lessons/module-3/lesson-03.md",
    formativeChecks: [
      { id: "m3-l3-serving", question: "A field height measured after the monitoring date strongly predicts the target in training. Is it eligible for an operational prediction made before field visits?", options: ["No; it is unavailable at prediction time and creates training-serving skew", "Yes; strong correlation makes every predictor valid", "Yes; field variables are always preferable to EO variables"], correctOption: 0, explanation: "Predictive strength cannot repair temporal impossibility. Operational features must exist, with the same definition and transformation, when the prediction is generated." },
      { id: "m3-l3-proxy", question: "A texture metric predicts habitat condition. What is the cautious interpretation?", options: ["Texture may act as a proxy carrying useful predictive information", "Texture is proven to cause habitat condition", "Texture has no scientific limitations because it is numeric"], correctOption: 0, explanation: "Predictors can represent indirect proxies for vegetation structure, moisture, management or acquisition effects. Predictive relevance is not a causal mechanism." },
      { id: "m3-l3-redundancy", question: "Two indices are strongly correlated. What should happen immediately?", options: ["Document their roles and evaluate redundancy and stability within validation", "Delete one using an automatic universal threshold", "Keep both and claim they are independent mechanisms"], correctOption: 0, explanation: "Correlation is evidence to investigate, not an automatic deletion rule. Operational availability, scientific rationale, stability and interpretation all matter." },
    ],
    submissionChecklist: [...commonChecklist, "predictor_hypotheses.csv documents source, unit, support, rationale, expected relationship, limitations and inference-time availability for every candidate"],
    rubric: rubric("Creates an operational feature contract that rejects target leakage and unavailable predictors and records support and units", "Connects each predictor to a defensible measurement hypothesis while distinguishing proxy, nuisance and causal claims"),
    coreReferences: [
      { title: "scikit-learn common pitfalls: inconsistent preprocessing and leakage", href: "https://scikit-learn.org/stable/common_pitfalls.html" },
      { title: "Google Rules of ML: training-serving skew", href: "https://developers.google.com/machine-learning/guides/rules-of-ml" },
    ],
    furtherReading: [
      { title: "Google production ML monitoring", href: "https://developers.google.com/machine-learning/crash-course/production-ml-systems/monitoring" },
      { title: "Shmueli (2010), To Explain or to Predict?", href: "https://doi.org/10.1214/10-STS330" },
    ],
  },
  "lesson-3-04": {
    estimatedTime: "180–240 minutes",
    lessonType: "Experiment Design and Data Integrity Laboratory",
    markdownFile: "content/lessons/module-3/lesson-04.md",
    formativeChecks: [
      { id: "m3-l4-row", question: "What should one row represent in the Chapter 1 modelling table?", options: ["One predeclared modelling observation at the target and predictor support", "One arbitrary CSV line", "One predictor variable"], correctOption: 0, explanation: "Rows become modelling observations only after identity, target, support, time and predictor pairing are defined. A convenient table layout is not itself the scientific unit." },
      { id: "m3-l4-test", question: "After seeing disappointing final-test performance, may the learner change predictors and retest on the same data?", options: ["No; the test set has influenced development and is no longer an untouched final test", "Yes; iteration never affects independence", "Yes, if the result improves"], correctOption: 0, explanation: "Once test performance influences a modelling choice, that set becomes development evidence. A new independent assessment is required for an unbiased final claim." },
      { id: "m3-l4-fold", question: "Why save fold assignments as data?", options: ["To make the exact validation partition reviewable and reproducible", "To increase the number of observations", "To guarantee every fold is scientifically valid"], correctOption: 0, explanation: "Saved folds prevent silent regeneration and let reviewers inspect grouping, time and spatial separation. Their design must still be justified against the intended claim." },
    ],
    submissionChecklist: [...commonChecklist, "The model-ready table has unique IDs, explicit exclusions, saved folds and no undeclared target or predictor transformations", "MODEL_EXPERIMENT_PLAN.md was frozen before fitting and isolates the final test data from tuning"],
    rubric: rubric("Builds a one-row-per-observation table with target, predictors, grouping, blocks, dates, folds, exclusions and provenance checks", "Pre-registers baseline, metric, model, validation, tuning, test and feature decisions and explains how each prevents hindsight bias"),
    coreReferences: [
      { title: "scikit-learn model selection and evaluation", href: "https://scikit-learn.org/stable/model_selection.html" },
      { title: "scikit-learn common pitfalls: data leakage", href: "https://scikit-learn.org/stable/common_pitfalls.html" },
    ],
    furtherReading: [
      { title: "Roberts et al. (2017), structured cross-validation", href: "https://doi.org/10.1111/ecog.02881" },
      { title: "The Turing Way: reproducible research", href: "https://book.the-turing-way.org/reproducible-research/reproducible-research" },
    ],
  },
  "lesson-3-05": {
    estimatedTime: "150–210 minutes",
    lessonType: "Baseline and Skill Laboratory",
    markdownFile: "content/lessons/module-3/lesson-05.md",
    formativeChecks: [
      { id: "m3-l5-training-only", question: "Which observations may determine a mean baseline used to score one validation fold?", options: ["Only the corresponding training observations", "Training and validation observations together", "The final test observations only"], correctOption: 0, explanation: "Even a one-number baseline is a fitted estimator. Its constant must be learned from training evidence only or the validation score contains held-out target information." },
      { id: "m3-l5-negative-skill", question: "A candidate has higher validation MAE than the predeclared mean baseline. What does this show?", options: ["The candidate has negative error skill for that comparison", "The candidate is useful because it is more complex", "The baseline must be removed from the report"], correctOption: 0, explanation: "For an error skill score of 1 − candidate error / baseline error, a worse candidate has a negative value. Complexity does not create usefulness." },
      { id: "m3-l5-bias-variance", question: "Why keep a simple linear baseline alongside a constant baseline?", options: ["It tests whether a transparent relationship captures most usable signal", "It guarantees the final model is causal", "It removes the need for structured validation"], correctOption: 0, explanation: "If a simple model performs comparably, the additional variance, maintenance and interpretation burden of a complex model may not be justified." },
    ],
    submissionChecklist: [...commonChecklist, "baseline_report.md declares training-only mean and median comparators, one transparent feature-aware comparator, metrics, fold identity and model skill", "The sealed final test set remains unopened"],
    rubric: rubric("Fits every baseline on training targets only and compares identical validation cases with correctly signed metrics and skill", "Explains what each comparator tests and why complexity is not evidence of scientific value"),
    coreReferences: [
      { title: "scikit-learn dummy estimators", href: "https://scikit-learn.org/stable/api/sklearn.dummy.html" },
      { title: "scikit-learn regression metrics", href: "https://scikit-learn.org/stable/api/sklearn.metrics.html#regression-metrics" },
    ],
    furtherReading: [
      { title: "scikit-learn linear models", href: "https://scikit-learn.org/stable/modules/linear_model.html" },
      { title: "Hastie, Tibshirani and Friedman, Elements of Statistical Learning", href: "https://hastie.su.domains/ElemStatLearn/" },
    ],
  },
  "lesson-3-06": {
    estimatedTime: "160–220 minutes",
    lessonType: "Tree and Ensemble Mechanism Laboratory",
    markdownFile: "content/lessons/module-3/lesson-06.md",
    formativeChecks: [
      { id: "m3-l6-leaf", question: "What does a regression-tree leaf store for prediction?", options: ["A fitted output value for observations reaching that leaf", "A causal explanation of the target", "A new field measurement"], correctOption: 0, explanation: "The path of threshold decisions assigns a case to a leaf. The leaf returns a fitted numerical value; it does not identify ecological mechanism." },
      { id: "m3-l6-forest", question: "What primarily distinguishes a Random Forest from gradient boosting?", options: ["Forest trees are diversified and averaged; boosting trees are added sequentially to improve the current model", "Only a Random Forest uses trees", "Boosting never uses previous model error"], correctOption: 0, explanation: "Random forests reduce variance by averaging randomized trees. Gradient boosting builds an additive sequence in which each new tree is chosen relative to the current predictions and loss." },
      { id: "m3-l6-superiority", question: "When is Gradient Boosting universally superior to Random Forest?", options: ["Never; performance and operational suitability must be evaluated for the stated problem", "Whenever the dataset contains EO predictors", "Whenever more than one tree is fitted"], correctOption: 0, explanation: "Different ensemble mechanisms have different sensitivities, tuning demands and failure modes. No model family wins independently of evidence and validation design." },
    ],
    submissionChecklist: [...commonChecklist, "ensemble_reasoning.ipynb identifies the first split, leaf predictions and the distinct averaging versus sequential-correction mechanisms", "All model families use the same development split and evaluation cases"],
    rubric: rubric("Traces one observation through a tree and correctly distinguishes a single tree, bagging, Random Forest and gradient boosting", "Chooses among mechanisms from validation evidence, stability, complexity and intended use rather than reputation"),
    coreReferences: [
      { title: "scikit-learn decision trees", href: "https://scikit-learn.org/stable/modules/tree.html" },
      { title: "scikit-learn ensemble methods", href: "https://scikit-learn.org/stable/modules/ensemble.html" },
    ],
    furtherReading: [
      { title: "Breiman (2001), Random Forests", href: "https://doi.org/10.1023/A:1010933404324" },
      { title: "Friedman (2001), Greedy Function Approximation", href: "https://doi.org/10.1214/aos/1013203451" },
    ],
  },
  "lesson-3-07": {
    estimatedTime: "190–260 minutes",
    lessonType: "XGBoost Mechanism Studio",
    markdownFile: "content/lessons/module-3/lesson-07.md",
    formativeChecks: [
      { id: "m3-l7-objective", question: "What does the XGBoost objective combine?", options: ["Training loss and a regularisation term", "Accuracy and causal certainty", "Only the number of trees"], correctOption: 0, explanation: "The loss represents predictive error under the chosen objective, while regularisation penalises model complexity. Their balance shapes which splits and leaf weights are worthwhile." },
      { id: "m3-l7-learning-rate", question: "What does a smaller learning rate do to each new tree's contribution?", options: ["Shrinks it, usually requiring more boosting rounds", "Deletes all previous trees", "Guarantees generalisation"], correctOption: 0, explanation: "Shrinkage scales each additive update. It changes the learning-rate/tree-count trade-off but does not remove the need for validation or regularisation." },
      { id: "m3-l7-missing", question: "XGBoost learns a default branch for missing feature values. What must the scientist still check?", options: ["Whether missingness has the same meaning and frequency during prediction", "Nothing; automatic handling makes missingness scientifically harmless", "Only whether the CSV opens"], correctOption: 0, explanation: "Algorithmic handling prevents a crash. It does not make missingness mechanisms, sensor failures or training-serving differences scientifically valid." },
    ],
    submissionChecklist: [...commonChecklist, "xgboost_mechanism_notebook.ipynb explains additive updates, objective, loss, regularisation and every selected parameter by behavioural effect", "Advanced constraints are marked optional and tied to a scientific need"],
    rubric: rubric("Explains sequential additive trees, gradients, Hessians, split gain, shrinkage, missing-value routing and the main parameter effects without API folklore", "Connects objective and constraints to the target contract while separating predictive optimisation from causal inference"),
    coreReferences: [
      { title: "XGBoost: Introduction to Boosted Trees", href: "https://xgboost.readthedocs.io/en/stable/tutorials/model.html" },
      { title: "XGBoost parameters", href: "https://xgboost.readthedocs.io/en/stable/parameter.html" },
    ],
    furtherReading: [
      { title: "Chen and Guestrin (2016), XGBoost", href: "https://doi.org/10.1145/2939672.2939785" },
      { title: "XGBoost categorical data tutorial", href: "https://xgboost.readthedocs.io/en/stable/tutorials/categorical.html" },
    ],
  },
  "lesson-3-08": {
    estimatedTime: "210–280 minutes",
    lessonType: "First Model Reproducibility Laboratory",
    markdownFile: "content/lessons/module-3/lesson-08.md",
    formativeChecks: [
      { id: "m3-l8-untuned", question: "Why is the first Chapter 2 XGBoost candidate intentionally untuned?", options: ["To isolate a declared starting configuration before Chapter 3 validation and Chapter 4 tuning", "Because XGBoost parameters never matter", "To allow the final test set to choose settings"], correctOption: 0, explanation: "The first model establishes a reproducible reference. Structured validation and model selection come later and must remain separate from the sealed final test." },
      { id: "m3-l8-schema", question: "Why record feature order even when a model file is saved?", options: ["Inference must reproduce the same feature meanings, names, order and transformations", "Feature order affects only plot colours", "A JSON model stores the complete data provenance automatically"], correctOption: 0, explanation: "A model artifact is not the complete experiment record. A sidecar schema and metadata file preserve the contract between training data and future inference." },
      { id: "m3-l8-serialization", question: "What is the strongest save/load check?", options: ["Reload the model and confirm predictions match on a fixed verification table", "Confirm that model.json exists", "Rename the file after fitting"], correctOption: 0, explanation: "File existence does not prove the artifact can be loaded or reproduces fitted behaviour. A fixed schema and prediction comparison test the handover." },
    ],
    submissionChecklist: [...commonChecklist, "The untuned XGBRegressor uses the frozen feature order, saved Chapter 2 split and recorded random seed", "model.json reloads successfully and reproduces validation predictions", "MODEL_METADATA.json records data, folds, parameters, objective, metrics, versions and confirms the final test stayed sealed"],
    rubric: rubric("Fits, evaluates, serializes and reloads one declared XGBRegressor against the same baseline cases with stable feature order and metadata", "Explains why this is a development candidate rather than final evidence and identifies the stronger validation still required"),
    coreReferences: [
      { title: "XGBoost Python package introduction", href: "https://xgboost.readthedocs.io/en/stable/python/python_intro.html" },
      { title: "XGBoost scikit-learn estimator interface", href: "https://xgboost.readthedocs.io/en/stable/python/sklearn_estimator.html" },
    ],
    furtherReading: [
      { title: "XGBoost model IO", href: "https://xgboost.readthedocs.io/en/stable/tutorials/saving_model.html" },
      { title: "scikit-learn common pitfalls", href: "https://scikit-learn.org/stable/common_pitfalls.html" },
    ],
  },
  "lesson-3-09": {
    estimatedTime: "170–230 minutes",
    lessonType: "Validation Claim and Evidence Laboratory",
    markdownFile: "content/lessons/module-3/lesson-09.md",
    formativeChecks: [
      { id: "m3-l9-generalisation", question: "A random holdout contains neighbours from every site. Which claim does its error best support?", options: ["Interpolation among represented nearby conditions", "Transfer to a completely new region", "Performance in every future year"], correctOption: 0, explanation: "The withheld rows are novel identities but not novel sites or necessarily independent spatial conditions. The score must be bounded to that evidence design." },
      { id: "m3-l9-proximity", question: "Training and assessment IDs are disjoint. Can proximity leakage still occur?", options: ["Yes; neighbours, repeated locations and derivative samples can share information", "No; unique IDs guarantee independence", "Only when the target column is duplicated exactly"], correctOption: 0, explanation: "Row identity is only one layer. Spatial, temporal, hierarchical and processing relationships must also be encoded and audited." },
      { id: "m3-l9-test-firewall", question: "After validation performance changes the model, what remains the role of those validation rows?", options: ["Development evidence, not an untouched final test", "Independent final evidence forever", "Training data automatically"], correctOption: 0, explanation: "Evidence that influences a decision participates in development. A separate final test or external assessment is needed for an untouched end-stage claim." },
    ],
    submissionChecklist: [...commonChecklist, "validation_claim.md names the destination and withheld unit before scores are inspected", "split_overlap_audit.csv proves identifier and protected-group separation for the compared designs", "Random and grouped results are reported as different claims rather than averaged"],
    rubric: rubric("Distinguishes training, validation and final-test roles; builds and audits random and site-separated evidence without proximity overclaiming", "Explains what each split estimates and bounds generalisation to the represented destination"),
    coreReferences: [
      { title: "scikit-learn cross-validation and grouped splitters", href: "https://scikit-learn.org/stable/modules/cross_validation.html" },
      { title: "Roberts et al. (2017), structured cross-validation", href: "https://doi.org/10.1111/ecog.02881" },
    ],
    furtherReading: [
      { title: "Valavi et al. (2019), spatial and environmental blocking", href: "https://doi.org/10.1111/2041-210X.13107" },
      { title: "scikit-learn common pitfalls", href: "https://scikit-learn.org/stable/common_pitfalls.html" },
    ],
  },
  "lesson-3-10": {
    estimatedTime: "210–290 minutes",
    lessonType: "Spatial Validation Design Laboratory",
    markdownFile: "content/lessons/module-3/lesson-10.md",
    formativeChecks: [
      { id: "m3-l10-match-claim", question: "The operational claim is prediction at a completely unobserved site. Which primary fold unit matches it?", options: ["Site", "Individual randomly shuffled row", "One predictor column"], correctOption: 0, explanation: "All observations and derivative information from the destination site must be held outside fitting to evaluate new-site transfer among represented sites." },
      { id: "m3-l10-fold-distribution", question: "Why report every leave-one-site-out fold instead of only mean MAE?", options: ["To reveal site-specific transfer failure and instability", "Because a mean cannot be calculated", "To make observations independent"], correctOption: 0, explanation: "A mean can hide one site where the workflow fails. Fold values, spread, counts and aggregation rules make heterogeneity visible." },
      { id: "m3-l10-buffer", question: "What must precede a 500 m buffered holdout?", options: ["A distance-valid coordinate method, a scientific rationale and an impact audit", "Only changing the splitter name", "Selecting the buffer that gives the lowest error"], correctOption: 0, explanation: "Buffers need defensible units and distance, reduce usable data and can themselves become tuned design choices." },
    ],
    submissionChecklist: [...commonChecklist, "spatial_fold_registry.csv preserves exact row, group, block and coordinate roles", "The same baseline and fixed candidate are evaluated under random, site-grouped and spatial-block designs", "Fold-level distributions, worst transfer and aggregation rules are reported"],
    rubric: rubric("Constructs ordinary, grouped, site, leave-location-out and block comparisons with executable overlap audits and appropriately scoped buffers", "Selects a primary design from the intended transfer claim and communicates spatial heterogeneity without claiming unsupported regional transfer"),
    coreReferences: [
      { title: "scikit-learn GroupKFold", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html" },
      { title: "scikit-learn grouped cross-validation", href: "https://scikit-learn.org/stable/modules/cross_validation.html" },
      { title: "Roberts et al. (2017), structured cross-validation", href: "https://doi.org/10.1111/ecog.02881" },
    ],
    furtherReading: [
      { title: "Valavi et al. (2019), blockCV", href: "https://doi.org/10.1111/2041-210X.13107" },
      { title: "scikit-learn cross_validate", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html" },
    ],
  },
  "lesson-3-11": {
    estimatedTime: "190–260 minutes",
    lessonType: "Temporal Transfer and Drift Laboratory",
    markdownFile: "content/lessons/module-3/lesson-11.md",
    formativeChecks: [
      { id: "m3-l11-direction", question: "Which fold respects a 2025 deployment?", options: ["Train through 2024 and assess 2025", "Train on 2025 and assess 2023", "Shuffle all years and call the holdout future"], correctOption: 0, explanation: "A future prediction may use only information available before its cut-off. The complete feature and preprocessing pipeline must respect the same direction." },
      { id: "m3-l11-drift", question: "Chronological error rises in 2025. What does that prove?", options: ["Transfer weakened in the represented future assessment, but the drift mechanism still needs diagnosis", "The sensor alone caused the failure", "The model must be tuned on 2025 immediately"], correctOption: 0, explanation: "Phenology, management, sensor, processing and environmental changes can all contribute. The error establishes a result under the design, not one cause." },
      { id: "m3-l11-firewall", question: "The team changes features after viewing 2025 performance. What role does 2025 now have?", options: ["Validation/development evidence", "Untouched final-test evidence", "No role because it is a year"], correctOption: 0, explanation: "Once the result affects a modelling decision, the period has participated in development and later independent evidence is needed." },
    ],
    submissionChecklist: [...commonChecklist, "temporal_fold_registry.csv proves every training period precedes assessment and records prediction cut-offs", "The report compares random and chronological evidence with the same fixed procedure", "Phenology, management, sensor and environmental drift are separated and the new-site/future-site distinction is explicit"],
    rubric: rubric("Builds chronological and rolling-origin folds, audits feature availability, and combines spatial and temporal separation without backwards information flow", "Interprets future-transfer evidence cautiously and distinguishes measured error change from hypotheses about drift mechanisms"),
    coreReferences: [
      { title: "scikit-learn cross-validation of time series", href: "https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-of-time-series-data" },
      { title: "scikit-learn TimeSeriesSplit", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html" },
      { title: "Roberts et al. (2017), temporal and spatial validation", href: "https://doi.org/10.1111/ecog.02881" },
    ],
    furtherReading: [
      { title: "scikit-learn common pitfalls", href: "https://scikit-learn.org/stable/common_pitfalls.html" },
      { title: "The Turing Way: research data provenance", href: "https://book.the-turing-way.org/reproducible-research/rdm/rdm-provenance" },
    ],
  },
  "lesson-3-12": {
    estimatedTime: "220–300 minutes",
    lessonType: "Nested Evidence and Leakage Audit Laboratory",
    markdownFile: "content/lessons/module-3/lesson-12.md",
    formativeChecks: [
      { id: "m3-l12-loops", question: "What is the inner loop allowed to do?", options: ["Select the procedure using only the current outer development partition", "Inspect the outer assessment target", "Open the final test after every candidate"], correctOption: 0, explanation: "Inner evidence selects preprocessing and model decisions. The outer fold assesses that selection process, and the final test remains separate." },
      { id: "m3-l12-leakage", question: "An imputer is fitted on all rows before nested cross-validation. Is the result protected?", options: ["No; outer and inner assessment distributions influenced preprocessing", "Yes; imputation is not modelling", "Yes, if the target was omitted"], correctOption: 0, explanation: "A learned transformation must be fitted inside each relevant training partition. Feature-only distribution information can leak." },
      { id: "m3-l12-final-firewall", question: "After nested CV, may final-test error choose a new cloud threshold?", options: ["No; that would convert the final test into development evidence", "Yes; nested CV protects every later decision", "Yes, if the new threshold improves MAE"], correctOption: 0, explanation: "Nested CV protects its outer assessments from inner selection. It does not authorise repeated final-test-driven changes." },
    ],
    submissionChecklist: [...commonChecklist, "nested_fold_registry.csv proves outer assessment rows never enter inner selection", "Every learned transformation is fold-local and the final test remains sealed", "LEAKAGE_CHECKLIST.md audits duplicates, derivatives, neighbours, time, target-derived predictors, upstream processing and model selection"],
    rubric: rubric("Implements and verifies grouped nested evidence roles, fold-local pipelines and row-level outer predictions without contaminating assessment", "Explains selection bias, limited-group instability and the difference between nested outer evidence and the final test"),
    coreReferences: [
      { title: "scikit-learn nested versus non-nested cross-validation", href: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html" },
      { title: "scikit-learn common pitfalls and leakage prevention", href: "https://scikit-learn.org/stable/common_pitfalls.html" },
      { title: "scikit-learn Pipeline", href: "https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html" },
    ],
    furtherReading: [
      { title: "Cawley and Talbot (2010), model selection over-fitting", href: "https://jmlr.org/papers/v11/cawley10a.html" },
      { title: "Roberts et al. (2017), structured cross-validation", href: "https://doi.org/10.1111/ecog.02881" },
      { title: "Valavi et al. (2019), spatial blocking", href: "https://doi.org/10.1111/2041-210X.13107" },
    ],
  },
  "lesson-3-13": {
    estimatedTime: "210–290 minutes",
    lessonType: "Controlled Search Design Laboratory",
    markdownFile: "content/lessons/module-3/lesson-13.md",
    formativeChecks: [
      { id: "m3-l13-search-role", question: "Where may RandomizedSearchCV compare hyperparameters during a nested outer fold?", options: ["Only inside the current outer development partition", "On the outer assessment site", "On the sealed final test"], correctOption: 0, explanation: "Candidate configurations are development decisions. Inner structured folds select them; outer assessment evaluates the complete selection procedure." },
      { id: "m3-l13-space", question: "What makes a search space scientifically defensible?", options: ["Each range has a behavioural rationale, feasible budget and predeclared bounds", "It contains every value the software accepts", "It is expanded until one score looks impressive"], correctOption: 0, explanation: "A bounded space encodes prior scientific and computational judgement. Post-result expansion increases selection flexibility and must be versioned as a new experiment." },
      { id: "m3-l13-compare", question: "How should tuned and untuned candidates be compared?", options: ["On identical protected outer folds with the same metric and features", "Using each model's best inner score", "By opening the final test for both"], correctOption: 0, explanation: "Only like-for-like outer predictions isolate whether the controlled selection procedure improved transfer evidence." },
    ],
    submissionChecklist: [...commonChecklist, "TUNING_PROTOCOL.md declares metric, search space, candidate budget, grouped inner folds and random seed before execution", "Untuned and selected procedures use identical outer assessment rows and preserve every fold-level result", "The search log confirms no outer assessment or final-test target influenced candidate choice"],
    rubric: rubric("Implements a reproducible bounded RandomizedSearchCV procedure inside grouped inner folds and preserves candidate, fold, runtime and failure records", "Justifies every searched parameter by expected model behaviour and judges improvement from identical outer evidence rather than the winning inner score"),
    coreReferences: [
      { title: "scikit-learn 1.9 — RandomizedSearchCV", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html" },
      { title: "scikit-learn 1.9 — tuning estimator hyperparameters", href: "https://scikit-learn.org/stable/modules/grid_search.html" },
      { title: "Cawley and Talbot (2010), model-selection over-fitting", href: "https://jmlr.org/papers/v11/cawley10a.html" },
    ],
    furtherReading: [
      { title: "Bergstra and Bengio (2012), random search", href: "https://www.jmlr.org/papers/v13/bergstra12a.html" },
      { title: "scikit-learn grouped cross-validation", href: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    ],
  },
  "lesson-3-14": {
    estimatedTime: "220–300 minutes",
    lessonType: "Learning Dynamics and Early-stopping Laboratory",
    markdownFile: "content/lessons/module-3/lesson-14.md",
    formativeChecks: [
      { id: "m3-l14-curves", question: "Training MAE keeps falling while structured-development MAE rises. What is the strongest diagnosis?", options: ["Additional capacity is fitting development-specific detail rather than improving transfer", "The model is necessarily causal", "The validation group should be added to training immediately"], correctOption: 0, explanation: "A widening train–development gap is evidence of overfit under that split. It does not identify one ecological mechanism or justify contaminating assessment." },
      { id: "m3-l14-stopping-set", question: "May the outer assessment site serve as XGBoost's early-stopping eval_set?", options: ["No; the stopping round would be selected from assessment evidence", "Yes; eval_set never changes a model", "Only when MAE improves"], correctOption: 0, explanation: "Early stopping is model selection. Its monitoring evidence must come from the current development partition." },
      { id: "m3-l14-refit", question: "Why record best_iteration for every structured fold?", options: ["Stopping behaviour may vary by site or block and needs a transparent final refit rule", "The largest number is always the final answer", "It proves the model will generalise everywhere"], correctOption: 0, explanation: "Fold variation reveals instability. A final tree-count rule must be declared from development evidence and cannot be chosen from the outer assessment or final test." },
    ],
    submissionChecklist: [...commonChecklist, "The report includes deliberately underfit, overfit and controlled runs on the same structured development evidence", "Training and development metric histories, best_iteration and stopping rule are saved per fold", "The outer assessment and final test never appear in eval_set or influence the refit rule"],
    rubric: rubric("Configures and diagnoses XGBoost learning dynamics, early stopping and regularisation with correctly separated evidence and saved histories", "Explains the learning-rate/tree-count and capacity/regularisation trade-offs without treating early stopping as a guarantee against overfitting"),
    coreReferences: [
      { title: "XGBoost 3.4 — scikit-learn estimator and early stopping", href: "https://xgboost.readthedocs.io/en/stable/python/sklearn_estimator.html" },
      { title: "XGBoost parameters", href: "https://xgboost.readthedocs.io/en/stable/parameter.html" },
      { title: "scikit-learn — validation and learning curves", href: "https://scikit-learn.org/stable/modules/learning_curve.html" },
    ],
    furtherReading: [
      { title: "XGBoost callbacks", href: "https://xgboost.readthedocs.io/en/stable/python/callbacks.html" },
      { title: "Chen and Guestrin (2016), XGBoost", href: "https://doi.org/10.1145/2939672.2939785" },
    ],
  },
  "lesson-3-15": {
    estimatedTime: "210–290 minutes",
    lessonType: "Feature Relevance and Stability Laboratory",
    markdownFile: "content/lessons/module-3/lesson-15.md",
    formativeChecks: [
      { id: "m3-l15-permutation", question: "What does held-out permutation importance measure?", options: ["How much this fitted model's selected score degrades when one feature is disrupted on that evidence", "The causal effect of the environmental variable", "A universal property of the sensor band"], correctOption: 0, explanation: "Permutation importance is model-, metric- and dataset-dependent. It describes predictive reliance, not mechanism or causality." },
      { id: "m3-l15-correlated", question: "Two predictors carry similar information. Why can each receive low individual permutation importance?", options: ["The unpermuted partner can retain much of the same predictive information", "Both variables must be measurement errors", "Correlation guarantees neither is useful"], correctOption: 0, explanation: "Redundancy can dilute individual importance. Correlated groups require scientific interpretation and controlled full-versus-reduced comparisons." },
      { id: "m3-l15-stability", question: "A feature ranks first in one site fold and near zero in three others. What should the report say?", options: ["Its relevance is unstable across represented transfer contexts", "It is the universally best predictor", "Delete the three inconvenient folds"], correctOption: 0, explanation: "Fold variation is evidence. Stable delivery requires reporting selection frequency, sign, magnitude and affected sites rather than one pooled rank." },
    ],
    submissionChecklist: [...commonChecklist, "feature_stability_report.csv preserves fold-level means, spreads, positive-fold frequency and correlation context", "Full and scientifically reduced feature sets are compared within the nested selection architecture", "No feature is removed solely because one importance or correlation threshold was crossed"],
    rubric: rubric("Computes held-out permutation relevance, correlation structure and fold stability; compares fixed full and reduced schemas with protected evidence", "Separates predictive reliance from causal importance and justifies retention or removal through measurement meaning, redundancy, stability, cost and transferability"),
    coreReferences: [
      { title: "scikit-learn 1.9 — permutation feature importance", href: "https://scikit-learn.org/stable/modules/permutation_importance.html" },
      { title: "scikit-learn — permutation importance with correlated features", href: "https://scikit-learn.org/stable/auto_examples/inspection/plot_permutation_importance_multicollinear.html" },
    ],
    furtherReading: [
      { title: "Molnar — Interpretable Machine Learning: permutation importance", href: "https://christophm.github.io/interpretable-ml-book/feature-importance.html" },
      { title: "scikit-learn feature selection", href: "https://scikit-learn.org/stable/modules/feature_selection.html" },
    ],
  },
  "lesson-3-16": {
    estimatedTime: "220–300 minutes",
    lessonType: "Rare-habitat Decision Threshold Laboratory",
    markdownFile: "content/lessons/module-3/lesson-16.md",
    formativeChecks: [
      { id: "m3-l16-probability-decision", question: "What changes when a fitted classifier's decision threshold changes?", options: ["The conversion from scores or probabilities to class actions", "The original field labels", "The sensor's spectral response"], correctOption: 0, explanation: "Thresholding is a decision layer. The underlying predicted scores stay the same, while false-positive and false-negative counts change." },
      { id: "m3-l16-accuracy", question: "Rare habitat occupies 5% of samples. Why can 95% accuracy be useless?", options: ["Predicting absence everywhere reaches 95% while finding no rare habitat", "Accuracy is never mathematically defined", "Class imbalance changes the coordinate system"], correctOption: 0, explanation: "Majority dominance hides zero sensitivity. Report the confusion matrix, precision, recall and specificity for the declared positive class." },
      { id: "m3-l16-firewall", question: "Where should a rare-habitat threshold be selected?", options: ["Inside structured development validation using a predeclared ecological objective", "On the outer assessment site after seeing its labels", "On the final test until recall looks acceptable"], correctOption: 0, explanation: "Threshold selection is model selection. Outer and final evidence must assess the already fixed model-plus-threshold procedure." },
    ],
    submissionChecklist: [...commonChecklist, "The positive class, error consequences and minimum-recall or cost rule are declared before threshold inspection", "The report shows confusion counts, precision, recall/sensitivity and specificity across candidate thresholds", "Class weighting and any sampling are performed inside training partitions, with probability limitations and protected assessment kept explicit"],
    rubric: rubric("Calculates threshold-specific confusion counts and class metrics, evaluates class weighting, and selects a reproducible threshold inside structured development evidence", "Connects false negatives and false positives to a bounded ecological decision without claiming that 0.5, accuracy or one threshold is universally correct"),
    coreReferences: [
      { title: "scikit-learn 1.9 — tuning the decision threshold", href: "https://scikit-learn.org/stable/modules/classification_threshold.html" },
      { title: "scikit-learn — precision-recall", href: "https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics" },
      { title: "scikit-learn — balanced class weights", href: "https://scikit-learn.org/stable/modules/generated/sklearn.utils.class_weight.compute_class_weight.html" },
    ],
    furtherReading: [
      { title: "XGBoost parameters: scale_pos_weight", href: "https://xgboost.readthedocs.io/en/stable/parameter.html" },
      { title: "scikit-learn threshold post-tuning example", href: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_tuned_decision_threshold.html" },
    ],
  },
  "lesson-3-17": {
    estimatedTime: "220–300 minutes",
    lessonType: "Regression Evidence and Diagnostic Laboratory",
    markdownFile: "content/lessons/module-3/lesson-17.md",
    formativeChecks: [
      { id: "m3-l17-metrics", question: "Which statement correctly distinguishes MAE and RMSE?", options: ["Both use the target unit, but RMSE gives large residuals greater influence", "MAE is unitless while RMSE has the target unit", "RMSE always gives the scientifically correct model choice"], correctOption: 0, explanation: "MAE weights absolute deviations linearly; RMSE squares them before averaging and returns to the target unit. The appropriate emphasis depends on the decision." },
      { id: "m3-l17-r2", question: "A held-out site has negative R². What does that mean?", options: ["The fixed predictions have greater squared error than predicting that site's assessment mean", "The software failed to calculate a legal value", "The model has negative causal influence"], correctOption: 0, explanation: "R² can be negative on assessment evidence. It is a relative squared-error comparison, not a causal quantity or a percentage of each observation explained." },
      { id: "m3-l17-folds", question: "Why report fold metrics before a pooled result?", options: ["A pooled average can hide a failed transfer site and weighting by row count", "Every fold is an independent estimate of global truth", "Pooling is mathematically prohibited"], correctOption: 0, explanation: "Fold results retain the spatial or temporal transfer contexts defined by validation. Pooling can still be useful when its weighting and limits are explicit." },
    ],
    submissionChecklist: [...commonChecklist, "Model and baseline metrics use identical protected rows and declare the residual sign", "MAE, RMSE, bias and R² are reported with units, counts, fold spread and diagnostic plots", "No valid extreme or weak fold is removed because it reduces reported performance"],
    rubric: rubric("Calculates and compares regression metrics correctly, preserves fold evidence, and produces observed–predicted, residual and distribution diagnostics", "Explains the unit, sensitivity and blind spot of each metric and limits the claim when errors vary by magnitude or transfer context"),
    coreReferences: [
      { title: "scikit-learn 1.9 — regression metrics", href: "https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics" },
      { title: "scikit-learn — R² score", href: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html" },
      { title: "scikit-learn — root mean squared error", href: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.root_mean_squared_error.html" },
    ],
    furtherReading: [
      { title: "Gneiting (2011), Making and Evaluating Point Forecasts", href: "https://doi.org/10.1198/jasa.2011.r10138" },
      { title: "Roberts et al. (2017), structured validation", href: "https://doi.org/10.1111/ecog.02881" },
    ],
  },
  "lesson-3-18": {
    estimatedTime: "230–310 minutes",
    lessonType: "Classification and Probability-quality Laboratory",
    markdownFile: "content/lessons/module-3/lesson-18.md",
    formativeChecks: [
      { id: "m3-l18-decision-ranking", question: "Which evidence evaluates the one frozen operational threshold?", options: ["Confusion counts and their derived decision metrics", "ROC-AUC alone", "A reliability diagram alone"], correctOption: 0, explanation: "ROC and PR curves describe ranking across thresholds, while reliability describes probability meaning. The frozen action is evaluated by its confusion evidence and workload." },
      { id: "m3-l18-roc-pr", question: "Why pair ROC with precision–recall evidence for a rare class?", options: ["A small false-positive rate can still create many false positives, while precision shows positive retrieval at the evaluated prevalence", "ROC-AUC is undefined whenever classes are imbalanced", "Precision–recall curves are independent of prevalence"], correctOption: 0, explanation: "ROC remains a valid ranking view, but the operational region and false-positive counts can be obscured. Precision is prevalence-dependent and must be reported with that context." },
      { id: "m3-l18-calibration", question: "May outer assessment labels fit a calibrator and also assess its Brier score?", options: ["No; calibration is learned model development and needs fresh protected assessment", "Yes; calibration never changes predictions", "Yes, whenever reliability improves"], correctOption: 0, explanation: "A post-hoc calibrator learns from labels. Fitting and judging it on the same outer evidence contaminates probability-quality assessment." },
    ],
    submissionChecklist: [...commonChecklist, "The positive class, frozen threshold, prevalence and confusion counts are explicit", "ROC, PR and reliability evidence are distinguished and fold metrics mark non-estimable cases", "No calibrator or threshold is fitted on the outer evidence being reported"],
    rubric: rubric("Calculates threshold metrics, ranking summaries and Brier/reliability evidence with correct class orientation, denominators and counts", "Distinguishes classification, ranking and calibration and connects the operating point to a bounded rare-habitat screening action"),
    coreReferences: [
      { title: "scikit-learn 1.9 — classification metrics", href: "https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics" },
      { title: "scikit-learn 1.9 — probability calibration", href: "https://scikit-learn.org/stable/modules/calibration.html" },
      { title: "scikit-learn — precision–recall", href: "https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics" },
    ],
    furtherReading: [
      { title: "Saito and Rehmsmeier (2015), precision–recall and ROC", href: "https://doi.org/10.1371/journal.pone.0118432" },
      { title: "Gneiting and Raftery (2007), proper scoring rules", href: "https://doi.org/10.1198/016214506000001437" },
    ],
  },
  "lesson-3-19": {
    estimatedTime: "230–310 minutes",
    lessonType: "Structured Failure and Residual Geography Laboratory",
    markdownFile: "content/lessons/module-3/lesson-19.md",
    formativeChecks: [
      { id: "m3-l19-pattern-cause", question: "A coastal band has negative residuals. What is supported?", options: ["The fixed model has a geographically structured underprediction pattern that needs competing hypotheses", "Salinity caused the prediction error", "Adding coordinates will necessarily solve transfer"], correctOption: 0, explanation: "Residual geography establishes a pattern under the design. Mechanism requires additional measurements and a suitable inferential design." },
      { id: "m3-l19-subgroups", question: "What must accompany a subgroup MAE?", options: ["Observation count, independent-site count, target/class support and fold context", "Only the subgroup name", "A smooth residual surface"], correctOption: 0, explanation: "Rows from one site and unusual target ranges do not establish general subgroup performance. Representation and estimability must remain visible." },
      { id: "m3-l19-revision", question: "A new feature is suggested by outer residuals. What is the defensible next step?", options: ["Preregister a revised procedure and evaluate it on fresh protected evidence", "Add it and quote the same outer results", "Delete the failed subgroup"], correctOption: 0, explanation: "Outer diagnostics can generate a development hypothesis. They cannot remain neutral assessment after selecting a revision." },
    ],
    submissionChecklist: [...commonChecklist, "Prediction-to-context joins are one-to-one and preserve every protected row", "Residual maps and subgroup tables report direction, magnitude, counts, folds and support without unsupported interpolation", "Every serious pattern is labelled predeclared or exploratory and linked to competing explanations and new evidence"],
    rubric: rubric("Maps residuals and class errors and summarises structured failure by site, habitat, management, gradients and acquisition context with valid joins", "Separates documented error patterns from causal mechanisms and translates findings into proportionate support, review or withholding decisions"),
    coreReferences: [
      { title: "Roberts et al. (2017), structured cross-validation", href: "https://doi.org/10.1111/ecog.02881" },
      { title: "scikit-learn — model evaluation", href: "https://scikit-learn.org/stable/modules/model_evaluation.html" },
      { title: "GeoPandas — merging data", href: "https://geopandas.org/en/stable/docs/user_guide/mergingdata.html" },
    ],
    furtherReading: [
      { title: "Valavi et al. (2019), blockCV", href: "https://doi.org/10.1111/2041-210X.13107" },
      { title: "Ploton et al. (2020), spatial validation", href: "https://doi.org/10.1038/s41586-020-2466-6" },
    ],
  },
  "lesson-3-20": {
    estimatedTime: "240–320 minutes",
    lessonType: "Predictive Interpretation and Claim-boundary Laboratory",
    markdownFile: "content/lessons/module-3/lesson-20.md",
    formativeChecks: [
      { id: "m3-l20-methods", question: "What does held-out permutation importance estimate?", options: ["How much this fitted model's chosen score degrades when one feature is disrupted on that evidence", "The feature's causal ecological effect", "The sensor's universal physical importance"], correctOption: 0, explanation: "The result depends on model, metric, evidence and feature dependence. It measures predictive reliance, not mechanism." },
      { id: "m3-l20-shap", question: "What does a local SHAP explanation describe?", options: ["An allocation of this model output relative to a reference under the explainer assumptions", "The intervention effect of changing a feature", "The probability that the prediction is correct"], correctOption: 0, explanation: "SHAP explains the fitted output under a background/dependence formulation. Applicability and causal evidence are separate." },
      { id: "m3-l20-claim", question: "Which statement stays inside the predictive claim boundary?", options: ["The fitted model repeatedly relied on canopy-height information across represented folds", "Increasing canopy height will cause the target to rise", "SHAP proves the ecological mechanism"], correctOption: 0, explanation: "Stable predictive reliance can be reported with its model, evidence and range. Interventions and mechanisms require a separate causal design." },
    ],
    submissionChecklist: [...commonChecklist, "Gain, permutation, PDP/ICE and SHAP are compared by question, evidence and limitation", "Correlation, fold stability, supported ranges, SHAP background and output scale are explicit", "All conclusions use predictive wording and local explanations carry applicability status"],
    rubric: rubric("Produces reproducible global and local explanation evidence with documented metric, fold, feature dependence, background and support", "Compares method agreement and disagreement while refusing causal or mechanistic claims not supported by the predictive design"),
    coreReferences: [
      { title: "scikit-learn 1.9 — permutation importance", href: "https://scikit-learn.org/stable/modules/permutation_importance.html" },
      { title: "scikit-learn 1.9 — partial dependence and ICE", href: "https://scikit-learn.org/stable/modules/partial_dependence.html" },
      { title: "SHAP — TreeExplainer", href: "https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html" },
    ],
    furtherReading: [
      { title: "Molnar — Interpretable Machine Learning", href: "https://christophm.github.io/interpretable-ml-book/" },
      { title: "Apley and Zhu (2020), accumulated local effects", href: "https://doi.org/10.1111/rssb.12377" },
    ],
  },
  "lesson-3-21": {
    estimatedTime: "250–340 minutes",
    lessonType: "Domain of Applicability Signature Laboratory",
    markdownFile: "content/lessons/module-3/lesson-21.md",
    formativeChecks: [
      { id: "m3-l21-interpolation", question: "Every predictor is within its separate training range. Is multivariate support guaranteed?", options: ["No; their combination may still lack a close training analogue", "Yes; univariate ranges prove interpolation", "Yes, if the pixel is geographically near a plot"], correctOption: 0, explanation: "Separate ranges cannot describe the joint predictor manifold. Geographic and environmental similarity are also different." },
      { id: "m3-l21-threshold", question: "Where should applicability thresholds be derived?", options: ["From structured development evidence consistent with the validation design", "From repeated inspection of final-test errors", "From a universal Euclidean-distance value"], correctOption: 0, explanation: "Scaling, dimension and validation design define distance behaviour. The support rule must be frozen before protected assessment." },
      { id: "m3-l21-map", question: "How should outside-applicability predictions be released?", options: ["Flagged or masked with reason codes and a machine-readable support layer", "Coloured exactly like supported predictions", "Replaced silently by the nearest training value"], correctOption: 0, explanation: "A visually complete map must not imply equal evidence. Preserve prediction, support state, NoData and reasons distinctly." },
    ],
    submissionChecklist: [...commonChecklist, "Feature order, units, scaler, distance, validation design and thresholds are frozen and versioned", "Univariate flags, multivariate distance, nearest analogue and upstream QA remain distinct and traceable", "The aligned applicability raster exposes supported, review, outside and NoData states and defines a release policy"],
    rubric: rubric("Calculates auditable predictor-space support, validates nearest analogues and writes an aligned categorical applicability product with reason codes", "Distinguishes geographic and environmental extrapolation, refuses universal thresholds and treats applicability as support rather than probability or uncertainty"),
    coreReferences: [
      { title: "Meyer and Pebesma (2021), area of applicability", href: "https://doi.org/10.1111/2041-210X.13650" },
      { title: "scikit-learn 1.9 — StandardScaler", href: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html" },
      { title: "scikit-learn 1.9 — nearest neighbours", href: "https://scikit-learn.org/stable/modules/neighbors.html" },
    ],
    furtherReading: [
      { title: "Meyer et al. (2018), spatio-temporal model performance", href: "https://doi.org/10.1016/j.ecolmodel.2017.12.001" },
      { title: "CAST — area of applicability", href: "https://hannameyer.github.io/CAST/" },
    ],
  },
  "lesson-3-22": {
    estimatedTime: "210–290 minutes",
    lessonType: "Predictive Uncertainty Reasoning Laboratory",
    markdownFile: "content/lessons/module-3/lesson-22.md",
    formativeChecks: [
      { id: "m3-l22-uncertainty-error", question: "A prediction interval is wide, but the observed value falls near its centre. Which statement is correct?", options: ["The prediction was uncertain but happened to have a small realised error", "The interval proves the prediction was wrong", "Uncertainty and realised error are identical"], correctOption: 0, explanation: "Uncertainty describes a range of plausible outcomes before the value is known. Error is the realised difference after observation." },
      { id: "m3-l22-sources", question: "Can one residual interval automatically represent measurement, sampling, model and transfer uncertainty?", options: ["No; its scope depends on the data, fitting procedure and evaluation design", "Yes; every interval includes all uncertainty", "Yes, when it is labelled 90%"], correctOption: 0, explanation: "An interval derived from held-out residuals represents variation under that evidence design. It does not automatically propagate undocumented measurement error or new-domain shift." },
      { id: "m3-l22-transfer", question: "What is the strongest response to predictions from a sensor regime absent from calibration?", options: ["Flag a transfer limitation and require new evidence rather than inflating an arbitrary interval", "Multiply every interval by two", "Call the map 95% confident"], correctOption: 0, explanation: "Unrepresented transfer cannot be repaired by an unsupported multiplier. Applicability, drift and fresh validation must remain explicit." },
    ],
    submissionChecklist: [...commonChecklist, "Every uncertainty source is tied to a stage, evidence source, representation and mitigation", "Realised error, expected predictive uncertainty, applicability and ignorance remain distinct", "The inventory states which sources the planned interval will and will not represent"],
    rubric: rubric("Builds a traceable uncertainty inventory spanning measurement, sampling, model, residual, spatial and transfer sources", "Uses bounded language, distinguishes uncertainty from error and refuses to combine unlike sources into an unsupported confidence claim"),
    coreReferences: [
      { title: "Gneiting and Raftery (2007), probabilistic forecasts and proper scores", href: "https://doi.org/10.1198/016214506000001437" },
      { title: "IPCC guidance note on uncertainty", href: "https://www.ipcc.ch/site/assets/uploads/2018/05/uncertainty-guidance-note.pdf" },
      { title: "JCGM 100 — evaluation of measurement uncertainty", href: "https://www.bipm.org/en/committees/jc/jcgm/publications" },
    ],
    furtherReading: [
      { title: "O'Hagan (2012), probabilistic uncertainty specification", href: "https://doi.org/10.1016/j.ress.2011.08.017" },
      { title: "Meyer and Pebesma (2021), area of applicability", href: "https://doi.org/10.1111/2041-210X.13650" },
    ],
  },
  "lesson-3-23": {
    estimatedTime: "240–330 minutes",
    lessonType: "Quantile Prediction Interval Laboratory",
    markdownFile: "content/lessons/module-3/lesson-23.md",
    formativeChecks: [
      { id: "m3-l23-meaning", question: "What does a fitted 0.90 conditional quantile estimate?", options: ["A value below which about 90% of outcomes are intended to fall for represented predictor conditions", "A 90% probability that the model is correct", "The upper 90% confidence bound for the mean"], correctOption: 0, explanation: "Quantile regression estimates a conditional outcome quantile. Pairing lower and upper quantiles forms a central prediction interval, not a confidence interval for a mean parameter." },
      { id: "m3-l23-quality", question: "Which interval result is automatically better?", options: ["Neither narrow nor wide alone; coverage, width, subgroup behaviour and decision use must be judged together", "The narrowest interval", "The interval with 100% coverage regardless of width"], correctOption: 0, explanation: "Sharp intervals are useful only when adequately calibrated. Extreme width can obtain high coverage without useful resolution." },
      { id: "m3-l23-crossing", question: "A lower-quantile prediction exceeds the upper-quantile prediction. What should happen?", options: ["Record quantile crossing as a model failure and investigate it", "Silently swap the two values", "Drop the assessment row"], correctOption: 0, explanation: "Crossing is evidence about the fitted quantile models. A documented repair may be evaluated, but silent sorting hides failure and changes the procedure." },
    ],
    submissionChecklist: [...commonChecklist, "Lower and upper quantile objectives, alphas, feature schema and development-only fitting are versioned", "Coverage, mean/median width, crossing count and group-level behaviour use protected structured evidence", "The report distinguishes prediction intervals from confidence intervals and refuses narrowness-only claims"],
    rubric: rubric("Fits reproducible lower and upper conditional-quantile models and evaluates coverage, width, crossing and protected subgroup behaviour", "Explains pinball loss and interval trade-offs in scientific language and limits conclusions to represented transfer conditions"),
    coreReferences: [
      { title: "XGBoost 3.3 — quantile regression example", href: "https://xgboost.readthedocs.io/en/stable/python/examples/quantile_regression.html" },
      { title: "XGBoost 3.3 — quantile objective parameters", href: "https://xgboost.readthedocs.io/en/stable/parameter.html" },
      { title: "Koenker and Bassett (1978), regression quantiles", href: "https://doi.org/10.2307/1913643" },
    ],
    furtherReading: [
      { title: "Gneiting and Raftery (2007), proper scoring rules", href: "https://doi.org/10.1198/016214506000001437" },
      { title: "scikit-learn — prediction intervals for gradient boosting regression", href: "https://scikit-learn.org/stable/auto_examples/ensemble/plot_gradient_boosting_quantile.html" },
    ],
  },
  "lesson-3-24": {
    estimatedTime: "250–340 minutes",
    lessonType: "Structured Split-conformal Coverage Laboratory",
    markdownFile: "content/lessons/module-3/lesson-24.md",
    formativeChecks: [
      { id: "m3-l24-calibration", question: "Which labels may calculate split-conformal nonconformity scores?", options: ["A calibration partition kept separate from model fitting and final assessment", "The final assessment labels", "Every prediction-grid cell"], correctOption: 0, explanation: "Calibration labels convert model residual behaviour into an interval rule. Reusing assessment labels destroys independent coverage evaluation." },
      { id: "m3-l24-coverage", question: "A nominal 90% interval covers 90% of pooled rows but only 55% at one held-out site. What is the conclusion?", options: ["Pooled marginal coverage conceals poor transfer coverage and the claim must be restricted", "The method is valid everywhere because pooled coverage is 90%", "The failed site should be removed"], correctOption: 0, explanation: "Marginal coverage does not guarantee conditional or site-specific coverage. Structured failures are central evidence for an EO transfer claim." },
      { id: "m3-l24-exchangeability", question: "Why is ordinary split conformal delicate for spatial or temporal EO data?", options: ["Dependence and distribution shift can make calibration and deployment scores non-exchangeable", "Coordinates make quantiles undefined", "Conformal prediction requires a linear model"], correctOption: 0, explanation: "The basic finite-sample coverage argument relies on exchangeability. Spatial grouping, temporal order and drift require explicit design and empirical stress tests." },
    ],
    submissionChecklist: [...commonChecklist, "Training, calibration and assessment roles are disjoint and preserve the declared spatial or temporal transfer unit", "The finite-sample quantile rule, alpha, score definition, counts, coverage and widths are reproducible", "Pooled results are accompanied by site/fold/applicability coverage and an explicit exchangeability limitation"],
    rubric: rubric("Constructs a split-conformal interval without assessment leakage and evaluates empirical coverage and width across structured evidence", "States the marginal coverage target precisely, diagnoses exchangeability threats and withholds guarantees beyond the represented calibration design"),
    coreReferences: [
      { title: "Angelopoulos and Bates (2023), conformal prediction: a gentle introduction", href: "https://doi.org/10.1561/2200000101" },
      { title: "Romano, Patterson and Candès (2019), conformalized quantile regression", href: "https://doi.org/10.48550/arXiv.1905.03222" },
      { title: "Oliveira et al. (2024), split conformal prediction and non-exchangeable data", href: "https://www.jmlr.org/papers/v25/23-1553.html" },
    ],
    furtherReading: [
      { title: "Vovk, Gammerman and Shafer (2005), Algorithmic Learning in a Random World", href: "https://doi.org/10.1007/b106715" },
      { title: "Tibshirani et al. (2019), conformal prediction under covariate shift", href: "https://doi.org/10.48550/arXiv.1904.06019" },
    ],
  },
  "lesson-3-25": {
    estimatedTime: "250–350 minutes",
    lessonType: "Prediction Evidence Mapping Signature Laboratory",
    markdownFile: "content/lessons/module-3/lesson-25.md",
    formativeChecks: [
      { id: "m3-l25-layers", question: "What does the interval-width map answer?", options: ["How wide the model's represented predictive interval is at each valid prediction unit", "Whether the unit lies inside training support", "Whether ecological change has occurred"], correctOption: 0, explanation: "Width is a model-and-calibration uncertainty diagnostic. Applicability and observed change are separate questions." },
      { id: "m3-l25-narrow", question: "A cell is outside applicability but has a narrow interval. What is the defensible release state?", options: ["Withhold or prominently flag it because model-based narrowness does not restore support", "Release it as high confidence", "Replace the interval with NoData and call the inputs missing"], correctOption: 0, explanation: "Intervals can be overconfident under extrapolation. Applicability remains an independent gate, and NoData retains its own meaning." },
      { id: "m3-l25-communication", question: "Which package is decision-ready?", options: ["Aligned prediction, lower, upper, width, applicability, valid-mask and release-state layers with metadata and text summary", "A prediction PNG without machine-readable evidence", "One confidence heatmap combining every limitation"], correctOption: 0, explanation: "Separate aligned layers preserve meaning, enable review and avoid an opaque composite confidence score." },
    ],
    submissionChecklist: [...commonChecklist, "Prediction, bounds, width, applicability, input validity and release state share one verified grid contract", "NoData, wide uncertainty and outside applicability remain separate categories with reason codes", "The map suite includes accessible legends, textual summaries, empirical coverage evidence and a bounded release policy"],
    rubric: rubric("Builds and validates an aligned multi-layer Prediction Evidence Package with traceable release states and machine-readable metadata", "Explains the different question answered by each layer and prevents narrow extrapolated intervals or visually complete maps from overstating evidence"),
    coreReferences: [
      { title: "OGC — Cloud Optimized GeoTIFF standard", href: "https://docs.ogc.org/is/21-026/21-026.html" },
      { title: "Meyer and Pebesma (2021), area of applicability", href: "https://doi.org/10.1111/2041-210X.13650" },
      { title: "Angelopoulos and Bates (2023), conformal prediction", href: "https://doi.org/10.1561/2200000101" },
    ],
    furtherReading: [
      { title: "ColorBrewer — map colour guidance", href: "https://colorbrewer2.org/" },
      { title: "W3C — images tutorial for accessibility", href: "https://www.w3.org/WAI/tutorials/images/" },
    ],
  },
};

export const module3LessonDetails: Record<string, ReviewedLessonDetails> = Object.fromEntries(
  publishedModule3Lessons.map((source) => {
    const configuration = lessonConfigurations[source.id];
    if (!configuration) {
      throw new Error(`Missing reviewed Module 3 configuration for ${source.id}`);
    }
    return [
      source.id,
      {
        estimatedTime: configuration.estimatedTime,
        lessonType: configuration.lessonType,
        position: Number(source.number.split(".")[1]),
        totalPositions: 30,
        markdownFile: configuration.markdownFile,
        formativeChecks: configuration.formativeChecks,
        submissionChecklist: configuration.submissionChecklist,
        rubric: configuration.rubric,
        technicalMetadata: {
          pythonVersion: MODULE3_SOFTWARE_VERSIONS.python,
          jupyterEnvironment: MODULE3_SOFTWARE_VERSIONS.jupyter,
          reviewDate: "18 August 2026",
          testedVersions: [
            { label: "NumPy", value: MODULE3_SOFTWARE_VERSIONS.numpy },
            { label: "pandas", value: MODULE3_SOFTWARE_VERSIONS.pandas },
            { label: "scikit-learn", value: MODULE3_SOFTWARE_VERSIONS.scikitLearn },
            { label: "XGBoost", value: MODULE3_SOFTWARE_VERSIONS.xgboost },
          ],
          datasetCitation: "Synthetic Module 3 modelling-foundations training pack, CC0-1.0. Scientific context informed by Baltic coastal plant traits 2024, https://doi.org/10.5281/zenodo.20083250; the synthetic records are not measurements from that dataset.",
          coreReferences: configuration.coreReferences,
          furtherReading: configuration.furtherReading,
        },
      } satisfies ReviewedLessonDetails,
    ];
  }),
);
