# Model experiment plan

Plan version:

Frozen timestamp:

Owner and reviewer:

## 1. Prediction claim

- Prediction Problem Statement version:
- Target specification version:
- Predictor hypothesis register version:
- What receives one prediction:
- Intended new-case claim:
- Spatial domain:
- Temporal domain:
- Intended use:
- Unsupported uses:

## 2. Evidence

- Source dataset versions and licences:
- Model-ready dataset path and checksum:
- Observation count before and after exclusions:
- Group, site, spatial-block and date coverage:
- Exclusion policy:
- Missingness policy:
- Fold registry path and checksum:

## 3. Primary experiment

- Baseline:
- Candidate model:
- Primary metric:
- Secondary diagnostics:
- Validation strategy:
- Tuning strategy and budget:
- Primary feature set:
- Random-seed policy:
- Software environment:

## 4. Final test firewall

- Final test registry:
- Independence claim:
- Permitted access date:
- Person or process controlling access:

Declaration:

> Final test data will not influence preprocessing, feature selection, hyperparameter tuning, threshold choice or model selection. If viewed for any of those purposes, they will be reclassified as development data and new independent evaluation evidence will be required.

## 5. Required diagnostics

- Fold variability:
- Site and group performance:
- Residual or error geography:
- Domain-of-applicability evidence:
- Uncertainty evidence:
- Stop or redesign conditions:

## 6. Amendments

| Timestamp | Change | Evidence available before change | Reason | Consequence for independence | Reviewer |
|---|---|---|---|---|---|
