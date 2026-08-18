# Leakage checklist for structured Earth Observation validation

Complete this checklist for every reported validation design. “Not applicable” requires a written reason.

## Identity and partition

- [ ] Every modelling observation has one stable identifier
- [ ] Training and assessment identifiers are disjoint in every fold
- [ ] Duplicate, overlapping and derivative samples cannot cross the fold boundary
- [ ] Augmented chips, resampled pixels or repeated extracts inherit the source observation's fold
- [ ] Fold assignments are saved as data with a version and checksum

## Spatial structure

- [ ] The held-out spatial unit matches the intended transfer claim
- [ ] Site or block labels do not overlap when the design promises new-site or new-block transfer
- [ ] Near neighbours across the boundary have been measured or explicitly audited
- [ ] Any buffer distance has a scientific rationale, coordinate-system check and sensitivity analysis
- [ ] Spatial block size is not chosen after inspecting which setting gives the best score

## Temporal structure

- [ ] No future observation contributes to a model assessed on an earlier time
- [ ] Preprocessing statistics, composites and feature engineering respect the fold's temporal cut-off
- [ ] Repeated locations are either grouped or their allowed role is justified
- [ ] Phenology, management, sensor and environmental drift are examined separately
- [ ] Acquisition date and target date windows remain compatible in every fold

## Transformation and selection

- [ ] Imputation, scaling, encoding, feature selection and dimensionality reduction are fitted on training rows only
- [ ] Transformations are contained in a fold-local pipeline or equivalent auditable procedure
- [ ] Hyperparameters are selected only inside the outer development partition
- [ ] The outer assessment target never appears in inner search, early stopping or threshold choice
- [ ] Target-derived predictors and post-outcome measurements are excluded

## Test firewall and reporting

- [ ] The final test remains sealed during feature design, tuning and validation-design comparison
- [ ] Every held-out prediction is saved with observation ID, fold, site, block and time
- [ ] Fold-level metric variation and worst-case transfer are reported
- [ ] Random-split performance is labelled as a comparator, not a spatial-transfer estimate
- [ ] The final claim names the evaluated places, times, sensors and prediction unit

