# Conformal Coverage Report

## Data roles

| Role | Groups / periods | Labels used for | Explicitly excluded from |
|---|---|---|---|
| Proper training |  | Model fitting | Calibration and assessment |
| Calibration |  | Nonconformity scores | Model fitting and assessment |
| Outer assessment |  | Frozen-procedure evaluation | Selection and recalibration |
| Final test |  | One final evaluation after freeze | All development |

## Conformal rule

- Point or quantile model:
- Nonconformity score:
- Alpha and nominal marginal coverage:
- Calibration score count:
- Finite-sample rank `ceil((n + 1) * (1 - alpha))`:
- Selected `q_hat`:
- Tie and missing-score handling:

## Empirical coverage

| Scope | Observations | Independent units | Coverage | Mean width | Miss direction | Applicability |
|---|---:|---:|---:|---:|---|---|
| Pooled |  |  |  |  |  |  |
| Site / fold / period |  |  |  |  |  |  |

## Exchangeability audit

- What is the exchangeable unit?
- Are calibration and deployment drawn under comparable spatial and temporal conditions?
- What dependence remains?
- What distribution shift is plausible?
- Which empirical stress tests were used?
- Which coverage claim must be restricted?

Do not state universal or per-cell coverage from pooled marginal evidence.
