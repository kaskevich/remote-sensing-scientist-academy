# Module 3 Chapter 5 evaluation and applicability training pack

This pack supports Lessons 3.17–3.21 of **Remote Sensing Modelling**. Every numeric record, coordinate, context label and prediction is deterministic synthetic teaching evidence. Nothing in the pack is a measurement from the Baltic coastal plant-traits dataset, a real habitat observation or evidence of real model performance.

## Evidence contract

- `regression_outer_predictions.csv` contains fixed outer-fold vegetation-height predictions and fold-local baseline predictions. The residual sign used by the lessons is prediction minus observation.
- `classification_outer_probabilities.csv` contains fixed outer-fold rare-habitat scores and the Chapter 4 threshold of 0.42. It deliberately includes class imbalance and imperfect probability calibration.
- `diagnostic_context.csv` contains one-to-one synthetic site, habitat, management, gradient, acquisition and generalized coordinate context for diagnostic joins.
- `applicability_training_and_grid.csv` contains synthetic development-training vectors and prediction-grid vectors. The grid includes a geographically plausible but environmentally novel coastal combination.
- the five templates preserve metric, interpretation, subgroup and deployment decisions in reviewable form.

The prediction rows are protected diagnostic evidence. They may describe the fixed procedure but may not select a revised model, feature schema, calibrator or applicability threshold and then re-assess that revision on the same rows. The final test remains sealed.

## Suggested order

1. Calculate regression evidence with `REGRESSION_EVALUATION_TEMPLATE.md`.
2. Evaluate the fixed class decision, ranking and reliability with `CLASSIFICATION_EVALUATION_TEMPLATE.md`.
3. Join context by `observation_id` and complete `MODEL_DIAGNOSTIC_TEMPLATE.md`.
4. compare interpretation methods using `INTERPRETATION_CLAIMS_TEMPLATE.md`.
5. define support states and release policy in `DOMAIN_OF_APPLICABILITY_TEMPLATE.md`.
6. Verify every file against `manifest.json` before analysis.

## Licence and citation

Academy-authored fixtures and templates are released under CC0-1.0. Scientific context is informed by the Baltic coastal plant-traits record at <https://doi.org/10.5281/zenodo.20083250>, but none of these rows were copied from or measured for that record.
