# Baseline Evidence Report

## Experiment identity

- Target specification version:
- Experiment plan version:
- Dataset path and SHA-256:
- Split registry version:
- Feature schema version:
- Author and date:

## Intended comparison

State the prediction question, validation cases and target unit. State explicitly what generalisation claim this Chapter 2 split does **not** evaluate.

## Predeclared comparators

| Comparator | Training rule | Predictor information | Scientific purpose |
|---|---|---|---|
| Training mean | | | |
| Training median | | | |
| Transparent feature-aware model | | | |

## Evidence boundary

- Training observation count:
- Validation observation count:
- Sealed observation count:
- Confirmation that baseline fitting used training targets only:
- Confirmation that every comparator scored the same validation IDs:
- Confirmation that sealed targets did not influence development:

## Results

| Model | MAE | RMSE | MAE skill vs mean | RMSE skill vs mean | Unit |
|---|---:|---:|---:|---:|---|
| Training mean | | | 0 | 0 | cm |
| Training median | | | | | cm |
| Transparent model | | | | | cm |

## Diagnostic interpretation

Discuss absolute error, large-error sensitivity, signed bias, target range, row-level failures and whether a simple model captures most of the usable signal.

## Usefulness rule for the XGBoost candidate

Write the rule before fitting Lesson 3.8. Do not invent an unsupported operational tolerance.

## Limitations and next validation gate

State why Chapter 3 grouped, spatial and temporal validation may change the performance estimate.
