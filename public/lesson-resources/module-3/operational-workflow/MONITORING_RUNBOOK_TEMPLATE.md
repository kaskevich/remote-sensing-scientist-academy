# Monitoring Runbook

## Baseline and cadence

- Target/prediction unit:
- Reference run and checksum:
- Prediction grid/valid population:
- Imagery, mask, temporal and feature-schema versions:
- Model, uncertainty, applicability and release-policy versions:
- Run cadence and owner:

## Run gates

| Indicator | Reference | Trigger | Action | Owner | Closure evidence |
|---|---:|---:|---|---|---|
| Schema equality | exact | mismatch | stop | | |
| Sensor QA | | | review/stop | | |
| Temporal support | | | withhold/review | | |
| Outside-applicability fraction | | | review | | |
| Recent labelled coverage | | | review/recalibrate | | |

## Drift diagnosis

Keep separate records for data-quality change, covariate shift, concept drift and possible ecological change. State which indicators require new target observations.

## Review and communication

Define accessible text summaries, scientific review, field verification, override authorization and user notification.

## Update, rollback and retirement

Protect new assessment labels before retraining. State promotion, rollback, historical-series and retirement rules.
