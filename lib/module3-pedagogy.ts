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
  { number: 9, chapter: 3, title: "Validation Is Part of the Model", description: "Treat the validation design as part of the scientific claim.", tools: ["Generalisation", "Cross-validation", "Leakage"], artifact: "validation_claim.md", code: "" },
  { number: 10, chapter: 3, title: "Spatial, Grouped and Leave-Location-Out Validation", description: "Match folds to within-site, new-site and new-region prediction claims.", tools: ["GroupKFold", "Spatial blocks", "Location holdout"], artifact: "spatial_validation_comparison.ipynb", code: "" },
  { number: 11, chapter: 3, title: "Temporal and Spatiotemporal Validation", description: "Evaluate future transfer without allowing future observations into model development.", tools: ["Temporal holdout", "Rolling origin", "Drift"], artifact: "temporal_validation_report.md", code: "" },
  { number: 12, chapter: 3, title: "Nested Model Selection and Leakage Prevention", description: "Separate model selection from independent generalisation assessment.", tools: ["Nested CV", "Pipelines", "Leakage audit"], artifact: "leakage_checklist.md", code: "" },
  { number: 13, chapter: 4, title: "Hyperparameter Optimisation", description: "Design a controlled search space inside development data.", tools: ["RandomizedSearchCV", "Search space", "Independent test"], artifact: "tuning_protocol.ipynb", code: "" },
  { number: 14, chapter: 4, title: "Early Stopping, Regularisation and Learning Dynamics", description: "Diagnose underfit and overfit behaviour from learning evidence.", tools: ["Early stopping", "Learning curves", "Regularisation"], artifact: "learning_dynamics_report.pdf", code: "" },
  { number: 15, chapter: 4, title: "Feature Selection, Redundancy and Stability", description: "Evaluate scientific utility and fold stability without automatic correlation pruning.", tools: ["Permutation relevance", "Redundancy", "Stability"], artifact: "feature_stability_report.csv", code: "" },
  { number: 16, chapter: 4, title: "Imbalanced Classification and Decision Thresholds", description: "Choose thresholds from ecological error costs rather than a default of 0.5.", tools: ["Class weighting", "Precision–recall", "Thresholds"], artifact: "rare_habitat_threshold_report.md", code: "" },
  { number: 17, chapter: 5, title: "Regression Evaluation", description: "Interpret R², RMSE, MAE and bias together with fold variability and diagnostics.", tools: ["R²", "RMSE", "Residuals"], artifact: "regression_evaluation_package", code: "" },
  { number: 18, chapter: 5, title: "Classification Evaluation and Probability Quality", description: "Evaluate classes, thresholds, ranking and probability calibration.", tools: ["Confusion matrix", "PR curve", "Calibration"], artifact: "classification_evaluation_package", code: "" },
  { number: 19, chapter: 5, title: "Residual Geography and Structured Failure", description: "Map where errors concentrate and expose subgroup failure hidden by averages.", tools: ["Residual maps", "Subgroups", "Failure geography"], artifact: "MODEL_DIAGNOSTIC_REPORT.md", code: "" },
  { number: 20, chapter: 5, title: "Model Interpretation Without Causal Overclaiming", description: "Compare gain, permutation and SHAP while preserving predictive claim boundaries.", tools: ["Permutation importance", "SHAP", "Partial dependence"], artifact: "interpretation_stability_report.md", code: "" },
  { number: 21, chapter: 5, title: "Domain of Applicability and Extrapolation", description: "Identify and map predictions unsupported by the training domain.", tools: ["Environmental distance", "Analogues", "Applicability map"], artifact: "applicability.tif", code: "" },
  { number: 22, chapter: 6, title: "What Uncertainty Means in Predictive EO", description: "Separate measurement, sampling, model, residual and transfer uncertainty.", tools: ["Uncertainty sources", "Error", "Transfer"], artifact: "uncertainty_inventory.md", code: "" },
  { number: 23, chapter: 6, title: "Prediction Intervals and Quantile Approaches", description: "Evaluate interval coverage and width alongside point predictions.", tools: ["Prediction intervals", "Quantiles", "Coverage"], artifact: "quantile_prediction_report.ipynb", code: "" },
  { number: 24, chapter: 6, title: "Conformal Prediction and Empirical Coverage", description: "Construct calibrated intervals while examining structured-dependence limits.", tools: ["Conformal prediction", "Calibration", "Exchangeability"], artifact: "conformal_coverage_report.ipynb", code: "" },
  { number: 25, chapter: 6, title: "Uncertainty and Applicability Maps", description: "Deliver prediction, uncertainty and applicability as three different evidence layers.", tools: ["Prediction map", "Uncertainty map", "Applicability map"], artifact: "Prediction Evidence Package", code: "" },
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
  navigationMeta: "8 of 30 lessons available · capstone planned",
  syllabusAriaLabel: "Thirty-lesson Module 3 curriculum map",
  planningNote:
    "Chapters 1–2 are available now. Later chapters remain visibly planned and will be released only after their scientific, software and accessibility reviews pass.",
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
