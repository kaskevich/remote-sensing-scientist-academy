---
title: Interpolation and Geostatistics
lessonId: lesson-2-33
---

## 1. Predict between observations without inventing certainty

### Learning outcome

By the end of this lesson, you will be able to explain interpolation as a spatial prediction model; distinguish inverse-distance weighting, trend surfaces and ordinary kriging; construct and interpret an empirical semivariogram; explain nugget, sill and range; compare predictions using separated spatial holdouts; and map prediction uncertainty and unsupported extrapolation explicitly.

- **Lesson type:** Geostatistical reasoning and validation lab
- **Estimated time:** 190–240 minutes
- **Prerequisites:** Projected metric coordinates, raster grids, spatial sampling and autocorrelation
- **Portfolio output:** `geostatistical_interpolation.ipynb`

### Why this matters

Environmental teams often need a continuous surface from measurements collected at discrete plots. The resulting map can appear complete even though most pixels were never observed. Colour gradients and smooth contours are model outputs, not additional field measurements.

Interpolation becomes scientifically useful when the target behaves continuously at the analysed scale, sampling supports the domain, model assumptions are examined and predictions are validated at genuinely separated locations. It becomes dangerous when software defaults turn sparse, clustered or biased observations into an authoritative-looking surface.

Kriging is not automatically superior because it is geostatistical. Inverse-distance weighting is not automatically wrong because it is simple. The defensible method is the one whose assumptions, validation geography and uncertainty match the scientific question.

### Scientific context

The synthetic coastal-meadow observations show gradual changes in NDVI, biomass and elevation across the core sampling frame. The team wants a plot-support prediction surface for planning additional field visits—not a final ecological map.

The roadside observations may bias spatial coverage, and P024 lies well outside the core domain. Your task is to compare a deterministic distance-based method with ordinary kriging using accepted probability observations, withhold separated spatial blocks and mark where predictions extend beyond credible support.

## 2. Interpolation is a model of continuity

### Concept

The single idea in this lesson is that **interpolation predicts an unobserved value by assuming how similarity changes across space**.

Before choosing an algorithm, define:

- the measured quantity, units and observation support;
- the prediction support and output grid;
- the spatial domain inside which continuity is plausible;
- the expected trend, directionality and barriers;
- the validation distance and decision use;
- the meaning of uncertainty.

Interpolating a plot mean to a 10 m grid does not create 10 m field measurements. The pixel is a location at which the model reports a prediction. Its information comes from the plots, covariates and assumptions, not from the number of output cells.

### Visual explanation

| Method | Main spatial assumption | Strength | Principal risk |
| --- | --- | --- | --- |
| Inverse-distance weighting | nearby observations should receive more influence according to a chosen power | transparent and local | no process-based covariance model; sensitive to clustering and power |
| Trend surface | broad spatial coordinates explain a smooth mean pattern | exposes large-scale gradient | can erase local structure or extrapolate an implausible trend |
| Ordinary kriging | residual spatial dependence follows a fitted variogram and mean is unknown but constant under the model | provides model-based prediction variance | sensitive to variogram, trend, anisotropy, support and sampling |

Each method can produce a smooth surface. Smoothness is a display property, not validation evidence.

## 3. Read a semivariogram as a diagnostic

For pairs of observations separated by distance *h*, an empirical semivariogram summarises half the average squared difference in their values:

```text
semivariance(h) = 0.5 × average[(value_i − value_j)²]
```

Pairs are grouped into distance bins because few pairs have exactly the same separation. If nearby observations are similar, short-distance semivariance tends to be lower than semivariance at longer distances.

Three parameters provide an intuitive vocabulary:

- **nugget:** semivariance near zero distance; it may reflect measurement error, microscale variation or unresolved support, not merely instrument noise;
- **sill:** the level at which semivariance stabilises under a bounded model;
- **range:** the distance over which spatial dependence is represented before the model approaches the sill.

These are model concepts, not guaranteed visible features. A variogram can show a trend rather than a stable sill. Sparse sampling may provide too few pairs at certain distances. Bins share observations and are not independent points. A fitted curve is therefore a scientific model with choices, not a line that discovers the true range automatically.

Direction matters. **Anisotropy** occurs when continuity differs by direction—for example along a shoreline versus across an elevation gradient. An omnidirectional variogram averages those directions. Before fitting a more complex model, map the data, examine directional evidence and ask whether sample density supports the additional parameters.

[[CHECK:m2-l33-variogram]]

## 4. Ordinary kriging is more than weighted averaging

Ordinary kriging estimates a value as a weighted combination of observations, but the weights come from the spatial covariance or variogram model, observation geometry and an unbiasedness constraint. They are not simply inverse distances. The method assumes an unknown constant mean within the modelled domain after any explicitly handled trend.

If a strong east–west environmental trend remains, ordinary kriging may attribute it to stationary spatial dependence. Options include restricting the domain, modelling a trend, using universal/regression kriging or including justified covariates later. Do not jump to a more complex method merely to improve the map. First identify what structure the mean and residual components are intended to represent.

Kriging variance describes uncertainty under the fitted model and sampling configuration. It is not an observed prediction error, and it may omit variogram-parameter uncertainty, measurement-process uncertainty and model misspecification. Validate it empirically where possible.

[[CHECK:m2-l33-uncertainty]]

## 5. Validation must reproduce the intended prediction

Leave-one-out cross-validation hides one observation and predicts it from all remaining observations. For dense spatial samples, immediate neighbours can make this task much easier than predicting an unsampled region. Random train/test splits have the same problem: nearby locations share environmental structure, so test performance can be optimistic.

Use validation geography that resembles intended use:

- leave out separated blocks when the surface will extend to unsampled parts of the same landscape;
- leave out entire sites when the model will transfer to new meadows;
- use temporal holdouts when future seasons are the target;
- report performance by stratum and distance from training support.

Compare methods with the same folds and accepted rows. Useful error summaries include mean error for bias, MAE for typical absolute error and RMSE for stronger emphasis on large errors. Always retain residual maps. Similar aggregate RMSE can conceal systematic failure in one region.

### Extrapolation is not interpolation

Prediction outside the sampled spatial domain or environmental range is extrapolation. The convex hull of sample points is a simple geometric warning boundary, not a complete definition of support. Interior gaps, barriers and under-sampled habitats may also be unsupported. Mark these regions rather than allowing a rectangular output grid to imply equal confidence everywhere.

## 6. Worked example — build an empirical variogram table

### Predict before running

Using accepted plots only, compare P001/P002 with P001/P018. Which pair should have the smaller coordinate distance? Which pair do you expect to have the smaller squared NDVI difference? Does one pair prove a general distance relationship?

```python
import numpy as np
import pandas as pd
from scipy.spatial.distance import pdist

table = pd.read_csv("inputs/spatial-statistics/meadow_plot_observations.csv")
plots = table.loc[table["qa_status"].eq("accept")]
coordinates = plots[["x_m", "y_m"]].to_numpy()
values = plots["ndvi_mean"].to_numpy()
distance = pdist(coordinates)
semivariance = 0.5 * pdist(values[:, None], metric="sqeuclidean")
bins = np.arange(0, 701, 100)
lag = pd.cut(distance, bins=bins, include_lowest=True)
empirical = pd.DataFrame({"lag": lag, "gamma": semivariance})
summary = empirical.groupby("lag", observed=True)["gamma"].agg(["mean", "count"])
print(summary)
```

### Code walkthrough

1. `numpy` supplies numeric bin boundaries; `pandas` manages the plot and pair table.
2. `pdist` computes each unique pair once rather than building a duplicate square matrix.
3. The CSV is loaded from immutable inputs.
4. The primary analysis keeps only declared accepted observations.
5. x and y columns become an *n* by 2 coordinate array in documented metric units.
6. NDVI values remain in exactly the same row order.
7. `pdist(coordinates)` calculates Euclidean distance for every unique plot pair.
8. Squared Euclidean distance between one-column values is the squared value difference.
9. Multiplying by 0.5 converts squared differences to classical semivariance contributions.
10. The bin edges create 100 m lag intervals through 700 m.
11. `pd.cut()` assigns each pair distance to a lag interval.
12. A DataFrame keeps lag membership and semivariance together.
13. Grouping calculates mean empirical semivariance and pair count per lag.
14. Printing both columns prevents a visually unstable bin with very few pairs from looking equally reliable.

This table is an exploratory diagnostic. It has not fitted a variogram model, handled directional dependence or corrected a trend. Those decisions come after plotting values and understanding the sampling design.

## 7. Common mistakes and recovery

### Mistake: choosing the smoothest map

**Why beginners make it:** smoothness looks scientifically coherent.  
**Recognition:** method selection cites appearance but no spatial holdout results.  
**Recovery:** compare candidate methods on identical separated folds, residual maps and support masks.

### Mistake: fitting the variogram before checking trend

**Why beginners make it:** software presents the variogram as the first geostatistical step.  
**Recognition:** semivariance rises without approaching a stable sill while values show a clear coordinate gradient.  
**Recovery:** map the variable, inspect relationships with coordinates and known covariates, then decide whether to model trend or restrict the domain.

### Mistake: interpreting the nugget as measurement error only

**Why beginners make it:** “error” is an easy label for short-distance difference.  
**Recognition:** microscale variability and support differences are not considered.  
**Recovery:** call it short-range/unresolved variance unless replicated or calibration evidence separates components.

### Mistake: calling kriging variance validation

**Why beginners make it:** the software produces a second uncertainty raster automatically.  
**Recognition:** no observations are withheld and no residual coverage is assessed.  
**Recovery:** distinguish model-based variance from empirical prediction error. Use spatial holdouts and examine standardised residuals.

### Mistake: predicting across the isolated P024 gap

**Why beginners make it:** the output grid fills every requested coordinate.  
**Recognition:** the surface spans a large data-free region with no extrapolation flag.  
**Recovery:** define the core prediction domain, map distance to observations and mask unsupported locations. Analyse P024 as a separate transfer question.

[[CHECK:m2-l33-validation]]

## 8. Guided practice — compare IDW and ordinary kriging

1. Create `13_interpolation_geostatistics.ipynb` and define the prediction target, units, plot support and core domain.
2. Load the README, plot table and validation blocks. Keep roadside and targeted review rows visible but outside the primary fit.
3. Map accepted NDVI and biomass with equal aspect. Inspect trend, clusters, edge coverage and the P024 gap.
4. Reproduce the empirical variogram code for NDVI. Add bin midpoint, mean semivariance and pair count.
5. Compare 75 m and 125 m lag widths. Explain which apparent features are stable and which depend on binning.
6. Examine directional pair groups along and across the east–west gradient. Do not fit anisotropy unless the pair evidence supports it.
7. Specify at least two plausible bounded variogram models and record nugget, sill and range conventions. Note whether the library expects full or partial sill.
8. Fit ordinary kriging using accepted rows and a documented model. Preserve the exact parameters rather than relying on an unrecorded automatic fit.
9. Implement IDW with a declared power and neighbour search. Prevent division by zero at observation coordinates.
10. Use `spatial_validation_blocks.csv` to leave out one separated core block at a time. Apply identical folds to both methods.
11. Save one row per held-out plot and method with observed value, prediction, residual, distance to nearest training plot and model-based variance when available.
12. Calculate mean error, MAE and RMSE by method and block. Do not select solely from the lowest aggregate RMSE.
13. Map residuals using a common colour scale. Identify directional or edge patterns.
14. Create a core-domain prediction grid whose cell size is appropriate for communication. Label it as model output at grid locations, not measured fine-resolution NDVI.
15. Produce an uncertainty panel and an extrapolation/support mask. Keep the colour legend, units and domain rule explicit.
16. Save `interpolation_validation.csv`, `variogram_decision.csv` and one map PDF.

## 9. Independent challenge — when should you refuse a surface?

Evaluate biomass rather than NDVI. Decide whether the accepted training sample supports a continuous biomass surface. Your answer may be “not yet”. Compare sample density, trend, variogram pair counts, block-validation errors and spatial support.

Write a release decision with one of three statuses:

- **release for exploratory planning**;
- **release with restricted domain and explicit uncertainty**;
- **do not release; collect or redesign evidence first**.

State the exact use allowed, the use prohibited and the next observation that would most improve the decision. A cautious refusal supported by evidence is a successful professional outcome.

### Scientific interpretation

The synthetic core has a strong broad gradient and dense local neighbours. Both IDW and ordinary kriging may reproduce that pattern under nearby holdouts. This does not prove either method can predict the isolated targeted location or a new meadow site. Block validation will usually produce more realistic transfer errors than random splits because entire geographic regions are withheld.

If kriging reports low variance inside dense sampling and high variance near edges, the pattern is consistent with its sampling geometry. It remains conditional on the fitted variogram and mean assumptions. If observed block residuals are larger than model-based uncertainty suggests, the uncertainty model is incomplete or mis-specified.

The final map must therefore present prediction, empirical validation, model-based uncertainty and support boundary together. The prediction surface alone is not the scientific result.

## 10. Reflection, submission and portfolio artifact

### Reflection

- Which continuity assumption makes interpolation meaningful for your chosen variable?
- What different processes could contribute to an apparent nugget?
- Why might random cross-validation reward a method that fails in an unsampled region?
- What does a prediction-variance map omit when variogram parameters are uncertain?

### Submission

Submit:

1. `geostatistical_interpolation.ipynb` with the empirical variogram, IDW and ordinary-kriging comparison;
2. `variogram_decision.csv` preserving alternative bin and model choices;
3. `interpolation_validation.csv` with separated-block residuals for both methods;
4. one three-panel PDF showing prediction, empirical residual evidence and uncertainty/support;
5. one screenshot of the lag table including pair counts;
6. the independent biomass release decision;
7. the completed interpolation section of `SPATIAL_INFERENCE_QA_TEMPLATE.md`.

### Portfolio artifact

Add **geostatistical_interpolation.ipynb** to the UAV and Satellite Analysis Pipeline. A reviewer should be able to see how discrete plot evidence became a prediction, which continuity model was assumed, how genuine spatial transfer was tested and where the resulting surface must not be used.
