# Earth Engine Modelling Component

## Identity and bounded purpose

- Script commit:
- Owner/reviewer:
- Target and prediction unit:
- Intended use:
- Explicitly unsupported use:

## Predictor-image contract

Record collection/asset IDs, processing baseline, dates, masks, scale factors, composite, projection and exact ordered bands.

## Sampling contract

Record point/polygon meaning, target property, `scale`, projection, reducer, missing-sample audit and retained `observation_id`, `site`, `block`, `date`, `fold`.

## Model contract

- Exact `ee.Classifier`:
- Parameters/seed:
- Verified output mode and official documentation date:
- Class encoding or regression unit:
- XGBoost native: **No**

## Evidence contract

State development and protected folds, baseline, metrics, probability/interval/applicability evidence and limitations.

## Export contract

Record region, CRS, transform/scale, dimensions, dtype, mask/NoData, task ID, destination, completion and independent spatial QA.

## Blocking tests

| Failure | Detection | State | Owner |
|---|---|---|---|
| Missing feature band | | blocked | |
| Unsupported output mode | | blocked | |
| Lost sample identifiers | | blocked | |
| Ambiguous export grid | | blocked | |
