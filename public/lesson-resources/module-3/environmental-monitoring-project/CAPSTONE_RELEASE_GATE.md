# Environmental Monitoring Project — capstone release gate

Mark each gate `PASS`, `REVIEW`, `BLOCK` or `NOT APPLICABLE`. A `BLOCK` prevents portfolio release as an operationally defensible project. `NOT APPLICABLE` needs a reason.

## Gate A — scientific contract

| Check | State | Evidence path | Reviewer note |
|---|---|---|---|
| Decision user and action are explicit |  |  |  |
| Target, units/classes and protocol are documented |  |  |  |
| Modelling observation and prediction unit are distinct and precise |  |  |  |
| Spatial, temporal and sensor domains are bounded |  |  |  |
| Predictive, causal and ecological-change non-claims are visible |  |  |  |
| Every predictor has rationale and prediction-time availability |  |  |  |

**Gate A decision and approver:**

## Gate B — protected development

| Check | State | Evidence path | Reviewer note |
|---|---|---|---|
| Stable IDs, exclusions, roles and saved folds pass |  |  |  |
| Target and derivative leakage tests pass |  |  |  |
| Baseline, ensemble and XGBoost use comparable evidence |  |  |  |
| Preprocessing and selection are fitted inside development partitions |  |  |  |
| Hyperparameters and thresholds never use protected assessment |  |  |  |
| Final-test access history shows no breach |  |  |  |

**Gate B decision and approver:**

## Gate C — independent predictive evidence

| Check | State | Evidence path | Reviewer note |
|---|---|---|---|
| Validation represents the intended new-place/new-time claim |  |  |  |
| Group, proximity, duplicate and temporal separation pass |  |  |  |
| Primary and supporting metrics beat or contextualise the baseline |  |  |  |
| Fold variability, subgroup failure and residual geography are reported |  |  |  |
| Classification probability/threshold evidence is adequate where relevant |  |  |  |
| Interpretation is stable enough and contains no causal overclaim |  |  |  |
| Uncertainty behaviour and empirical coverage are reported where relevant |  |  |  |
| Applicability rule identifies review and withheld conditions |  |  |  |

**Gate C decision and approver:**

## Gate D — spatial and operational release

| Check | State | Evidence path | Reviewer note |
|---|---|---|---|
| Feature name/order/unit/transform/support/version/dtype match |  |  |  |
| Prediction, uncertainty and applicability grids pass QA |  |  |  |
| NoData, mask, output range and chunk invariance pass |  |  |  |
| Earth Engine component has a necessary documented role |  |  |  |
| Clean environment reproduces the bounded release |  |  |  |
| Model card, scientific summary and management brief agree |  |  |  |
| Monitoring triggers have owners, responses and protected evidence rules |  |  |  |
| Checksums, licences, accessibility and privacy review pass |  |  |  |

**Gate D decision and release authority:**

## Final disposition

- **Decision:** RELEASE / RELEASE WITH BOUNDED CONDITIONS / WITHHOLD / TRAINING DEMONSTRATION ONLY
- **Supported claim:**
- **Withheld areas, times, classes or uses:**
- **Required follow-up:**
- **Next review date or trigger:**
- **Model/project version:**
- **Signatures and dates:**
