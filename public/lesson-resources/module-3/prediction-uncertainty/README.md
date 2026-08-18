# Module 3 Chapter 6 — prediction uncertainty training pack

This compact pack supports Lessons 3.22–3.25 of Remote Sensing Scientist Academy. It is designed for uncertainty reasoning, quantile-interval evaluation, split-conformal calibration and aligned prediction-evidence mapping.

## Scientific status

Every observation, target value, predictor-derived prediction, coordinate-free grid unit, interval and support state in this directory is **synthetic** and released under CC0-1.0. Nothing in these files is a measurement or location from the published Baltic coastal plant-traits dataset. The continuing coastal-meadow vocabulary provides scientific continuity only.

Target values use the neutral label `target_units`. The pack does not invent a measurement unit or protocol absent from supplied metadata.

## Files

- `protected_interval_predictions.csv` — synthetic out-of-fold point and interval predictions with site, fold and applicability context
- `calibration_scores.csv` — synthetic absolute-residual scores for practising the finite-sample split-conformal rule
- `prediction_evidence_grid.csv` — synthetic 4 × 6 aligned grid table for prediction, interval-width, applicability and release-state logic
- `UNCERTAINTY_INVENTORY_TEMPLATE.md` — traceable source/evidence/mitigation inventory
- `QUANTILE_INTERVAL_REPORT_TEMPLATE.md` — coverage, width and crossing report
- `CONFORMAL_COVERAGE_TEMPLATE.md` — data roles, score rule, empirical coverage and exchangeability audit
- `PREDICTION_EVIDENCE_PACKAGE_TEMPLATE.md` — aligned layer inventory and governed release policy
- `manifest.json` — SHA-256 checksums and declared purposes

## Evidence rules

1. Keep proper training, calibration, assessment and final-test roles disjoint.
2. Do not tune interval method, alpha or width policy on protected assessment labels.
3. Report observation and independent-group counts with coverage.
4. Keep predictive interval width, applicability, NoData and release policy separate.
5. Treat the grid as synthetic table data, not a georeferenced real-world raster.

The cumulative `Environmental_Monitoring_Project_Starter.ipynb` remains in the parent Module 3 resource directory and is checksum-linked from every chapter manifest.
