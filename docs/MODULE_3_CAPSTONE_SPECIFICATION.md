# Environmental Monitoring Project — capstone specification

## Status

**Planned.** This specification fixes the destination before later lessons are written. The capstone is not marked available until all 30 lessons, data fixtures and review gates pass.

## Professional brief

A coastal-environment team needs a reproducible Earth Observation model that predicts an explicitly defined ecological response across a declared area and monitoring period. The learner must deliver more than a prediction raster. They must show what was measured, why each predictor is usable, what baseline was beaten, which transfer claim was tested, where the model fails, how uncertainty behaves, where predictions extrapolate and how future runs will be governed.

The published Baltic coastal-meadow record provides scientific context. Teaching fixtures may be synthetic or derived only where licensing, provenance and variable meanings permit. Synthetic records must remain unmistakably labelled.

## Fifteen capstone phases

| Phase | Required output | Automatic revision gate |
|---:|---|---|
| 1 | Decision statement and stakeholder use | No model work if the decision or user is absent |
| 2 | Prediction Problem Statement | Revise if predictive and causal claims are conflated |
| 3 | Target specification | Stop if unit, support, protocol or prediction unit is guessed |
| 4 | Predictor hypothesis register | Reject leakage and inference-time unavailable features |
| 5 | Model-ready table and data dictionary | Stop for duplicate IDs, unexplained exclusions or absent structural fields |
| 6 | Frozen experiment plan | Stop if final-test evidence can influence development |
| 7 | Naive and scientific baselines | Revise if complexity has no meaningful comparator |
| 8 | Reproducible candidate pipeline | Stop if transformations differ between training and inference |
| 9 | Structured validation | Revise if folds do not represent the stated new-place/new-time claim |
| 10 | Controlled tuning record | Stop if selection crosses the declared development boundary |
| 11 | Evaluation and residual diagnostics | Revise if averages conceal subgroup or geographic failure |
| 12 | Interpretation and stability report | Revise causal language or unstable feature narratives |
| 13 | Uncertainty and applicability analysis | Stop if unsupported areas look equally trustworthy |
| 14 | Prediction evidence package | Require separate prediction, uncertainty and applicability layers |
| 15 | Operational runbook and model card | Stop release without version, owner, monitoring and update policy |

## Required repository structure

```text
environmental-monitoring-project/
├── README.md
├── CITATION.cff
├── environment.yml
├── data/
│   ├── README.md
│   ├── raw/                 # immutable or download instructions
│   └── processed/           # generated, traceable model evidence
├── docs/
│   ├── PREDICTION_PROBLEM.md
│   ├── TARGET_SPECIFICATION.md
│   ├── MODEL_EXPERIMENT_PLAN.md
│   ├── MODEL_DIAGNOSTIC_REPORT.md
│   ├── MODEL_CARD.md
│   └── MONITORING_RUNBOOK.md
├── notebooks/
│   ├── 01_evidence_contract.ipynb
│   ├── 02_model_development.ipynb
│   └── 03_independent_evaluation.ipynb
├── src/
│   ├── data.py
│   ├── features.py
│   ├── validation.py
│   ├── train.py
│   └── predict.py
├── tests/
├── models/
└── outputs/
    ├── tables/
    ├── figures/
    └── rasters/
```

## Final evidence package

The submission must contain a clean-run repository, immutable source record, processed-data provenance, saved folds, baseline comparison, fitted pipeline, independent evaluation, fold-level metrics, residual and failure maps, interpretation stability evidence, uncertainty diagnostics, applicability mask, prediction raster, accessible figures, model card, limitations and operational runbook.

## Assessment rubric

| Dimension | Weight | Distinction evidence |
|---|---:|---|
| Scientific framing and target integrity | 15% | Claim, decision, target, support, domain and non-claims are precise and traceable |
| Data and predictor evidence | 15% | Feature availability, transformations, provenance and exclusions are reviewable; leakage is absent |
| Validation and model selection | 25% | Baselines and structured/nested evaluation match the intended transfer; final test remains independent |
| Evaluation, failure and uncertainty | 20% | Multiple metrics, spatial/subgroup diagnostics, interval behaviour and applicability constrain conclusions |
| Reproducible engineering | 15% | A clean environment reproduces validated outputs through tested, versioned code |
| Scientific communication and governance | 10% | Maps, model card, limitations, monitoring triggers and update ownership support responsible use |

A technically executing model cannot pass if target meaning is unresolved, test evidence leaked into development, validation contradicts the prediction claim, or unsupported regions are presented without an applicability warning.

## Graduate-profile evidence

- **GIS / Remote Sensing Engineer:** fixed raster schema, chunked inference, provenance, automated checks and interoperable evidence layers.
- **Geospatial Data Analyst:** target definition, baseline reasoning, structured evaluation, residual geography and decision-oriented communication.
- **Remote Sensing Researcher:** measurement hypotheses, sampling/transfer logic, independent evidence, uncertainty, limitations and reproducible scientific argument.
