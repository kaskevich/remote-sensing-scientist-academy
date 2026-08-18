# Module 3 Chapter 6 quality review

## Release decision

**Recommended for publication as the predictive-uncertainty standard for Module 3.** Lessons 3.22–3.25 form one coherent evidence sequence: classify uncertainty sources, construct conditional-quantile intervals, calibrate and stress-test split-conformal coverage, then publish prediction, uncertainty and applicability as distinct aligned layers.

The teaching fixtures are synthetic. They cannot support a real coastal-meadow uncertainty, coverage or accuracy claim.

## Multi-lens score

| Lens | Score / 5 | Evidence |
|---|---:|---|
| Remote-sensing science | 4.9 | Measurement, sampling, spatial support, sensor/time transfer, applicability and reference-support limits remain explicit |
| Statistical learning | 4.9 | Quantile loss, coverage/width trade-offs, finite-sample split-conformal rank, marginal-coverage meaning and exchangeability limits are taught precisely |
| Scientific programming | 4.8 | Deterministic interval diagnostics, crossing detection, conformal quantile and release-state functions are tested; the notebook preserves the final-test firewall |
| Instructional design | 4.9 | Four cumulative lessons use predict-before-running, visual explanation, model clinics, guided practice, independent challenges and assessable artifacts |
| Professional practice | 4.8 | The Prediction Evidence Package is machine-readable, versioned, accessible and governed by a transparent release policy |
| **Overall** | **4.86 / 5** | Strong release quality with deliberate scope limits |

## Vertical lesson quality

### 3.22 — What Uncertainty Means in Predictive EO

The lesson prevents a residual interval from becoming a catch-all. Learners distinguish prospective uncertainty from realised error and record which measurement, sampling, model, residual, spatial and transfer sources are represented, partly represented or unresolved.

### 3.23 — Prediction Intervals and Quantile Approaches

The lesson distinguishes conditional quantiles, prediction intervals and confidence intervals; verifies the current XGBoost quantile objective; and evaluates calibration, sharpness, miss direction and crossing on protected structured evidence.

### 3.24 — Conformal Prediction and Empirical Coverage

The lesson teaches the finite-sample order statistic rather than an interpolated percentile, keeps proper-training/calibration/assessment roles disjoint, and limits the coverage statement to marginal performance under exchangeability. Spatial and temporal grouping are framed as alignment and stress tests, not automatic theoretical repairs.

### 3.25 — Uncertainty and Applicability Maps

The signature laboratory validates aligned prediction, bounds, width, applicability and release-state layers. Outside applicability overrides narrow model intervals; NoData remains separate; coverage is assessed only at compatible independent reference supports.

## Horizontal curriculum integrity

- Reuses Chapter 1 target, prediction-unit and feature contracts.
- Preserves Chapter 3 structured outer/inner evidence roles and the sealed final test.
- Uses Chapter 5 residual diagnostics and Domain of Applicability without relabelling them as prediction uncertainty.
- Reuses Module 2 raster contracts rather than reteaching Rasterio or alignment.
- Hands Chapter 7 a frozen semantic package for chunked inference, cloud architecture, drift monitoring and model-card governance.

## Scientific safeguards

- “Uncertainty” is not used as a synonym for realised error.
- Prediction intervals are not called confidence intervals for a mean.
- Narrowness is never treated as quality without coverage.
- Conformal prediction is not described as assumption-free.
- Pooled marginal coverage is not presented as per-site, conditional, simultaneous raster or per-cell coverage.
- Spatial/temporal dependence and distribution shift remain explicit exchangeability threats.
- Quantile crossing is retained as failure evidence rather than silently repaired.
- Applicability, interval width, NoData and release state remain separate.
- The published Baltic dataset context does not authorise invented target units or measurement precision.

## Data and software status

The Chapter 6 pack contains protected synthetic interval predictions, calibration scores, a 4 × 6 synthetic prediction-evidence grid, four professional templates and a checksum manifest. It is CC0-1.0 and clearly labelled as non-empirical.

The code and metadata target Python 3.12.13, NumPy 2.4.2, pandas 2.2.3, scikit-learn 1.9.0 and XGBoost 3.3.0. The quantile example follows the supported `reg:quantileerror`, `quantile_alpha` and histogram-tree pattern documented for XGBoost 3.3.

## Scope boundary

Chapter 6 is **not the operational inference chapter**. It does not reteach raster IO, implement large-scene tiled prediction, select a local-versus-Earth Engine architecture, govern repeated monitoring, quantify data drift or complete the model card. Those responsibilities remain in Lessons 3.26–3.30.

It also does not claim that ordinary split conformal solves arbitrary spatial dependence. Advanced non-exchangeable, local, weighted or block-conformal methods require their own assumptions and evidence; they are signposted but not presented as core guarantees.

## Remaining limitations

- Synthetic values demonstrate procedure, not ecological performance.
- Small group examples cannot establish stable conditional coverage.
- The core conformal worked example is symmetric and constant-width; conformalized quantile regression is introduced conceptually as an extension.
- Real measurement-uncertainty propagation requires documented field and sensor error models not supplied to the Academy.

## Recommendation

Publish Lessons 3.22–3.25 together. Their shared artifact—the **Prediction Evidence Package**—depends on all four stages. Keep Lessons 3.26–3.30 and the capstone visibly planned until their independent scientific, software, accessibility and operational reviews pass.
