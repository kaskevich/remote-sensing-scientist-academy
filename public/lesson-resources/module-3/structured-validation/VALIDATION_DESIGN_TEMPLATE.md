# Structured Validation Design

## 1. Prediction claim

- Target and unit:
- Prediction unit:
- Intended destination: new plot within known site / new block / new site / future season / new site and future season
- Represented domain:
- Unsupported transfer claim:

## 2. Dependence structure

- Repeated or nearby observations:
- Site or campaign groups:
- Spatial coordinates and CRS status:
- Observation dates and acquisition windows:
- Estimated or assumed dependence range:
- Evidence used to choose block or buffer size:

## 3. Outer assessment design

- Splitter and version:
- Grouping or ordering field:
- Number of folds:
- Held-out unit per fold:
- Spatial buffer or exclusion rule:
- Minimum training and assessment counts:
- Fold registry path and checksum:

## 4. Inner model-selection design

- Inner splitter:
- Grouping or ordering field:
- Candidate decisions allowed:
- Preprocessing fitted inside each inner training partition:
- Evidence unavailable to selection:

## 5. Metrics and diagnostics

- Primary metric and unit:
- Baseline comparator:
- Secondary metrics:
- Fold-level distribution summary:
- Site, year and response-range diagnostics:
- Failure or instability threshold:

## 6. Leakage audit

- Observation-ID overlap:
- Site/group overlap:
- Spatial-neighbour audit:
- Temporal direction audit:
- Duplicate and derivative-sample audit:
- Preprocessing fit scope:
- Feature-selection fit scope:
- Final-test access log:

## 7. Results and claim boundary

- Fold-level results table:
- Mean, standard deviation and range:
- Worst-transfer case:
- Comparison with random splitting:
- Supported statement:
- Remaining uncertainty:
- Decision: proceed / revise design / revise model / collect evidence

