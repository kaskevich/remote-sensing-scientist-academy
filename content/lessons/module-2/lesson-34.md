---
title: Spatial Regression Concepts
lessonId: lesson-2-34
---

## 1. Diagnose what an ordinary model leaves in space

### Learning outcome

By the end of this lesson, you will be able to explain why spatial dependence can violate ordinary regression assumptions; build and diagnose a baseline regression using mapped residuals and Moran's I; distinguish spatial-lag, spatial-error, spatially lagged predictor and geographically weighted concepts; choose a model family from a scientific process hypothesis; and evaluate performance with geographically separated validation.

- **Lesson type:** Spatial-model diagnosis studio
- **Estimated time:** 190–240 minutes
- **Prerequisites:** Scientific variables, regression vocabulary, spatial weights, sampling design and spatial validation
- **Portfolio output:** `spatial_regression_diagnostic.ipynb`

### Why this matters

Remote Sensing Scientists often relate field measurements to spectral indices, terrain and management information. A familiar linear model may fit and return coefficients, standard errors and an impressive R² even when nearby residuals remain similar. In that situation, the model has not captured all spatial structure and the nominal independent-error evidence may be overconfident.

Adding coordinates or selecting a spatial model does not automatically solve the problem. Residual clustering may reflect omitted environmental drivers, an incorrect response relationship, measurement support, sampling design, non-stationarity or a spatial interaction process. Different spatial models encode different hypotheses. Choosing one because its output contains a map or a significant coefficient replaces diagnosis with software ritual.

The professional workflow is staged: define the scientific relationship, fit a transparent baseline, map and test residual structure, compare plausible spatial explanations and evaluate new geography.

### Scientific context

The synthetic coastal-meadow table contains field biomass, NDVI and elevation. An ordinary model using NDVI and elevation may describe much of the broad pattern. The team wants to know whether residual spatial structure remains and whether adding a spatial formulation would improve defensible prediction.

The four roadside observations and isolated P024 also create a design problem. You will keep the primary model restricted to accepted probability observations, diagnose residual structure using predeclared weights and compare performance across spatial blocks. You will not claim that NDVI or elevation causes biomass from this observational exercise.

## 2. Regression separates a mean relationship from residual variation

### Concept

The single idea in this lesson is that **spatial regression begins by asking what spatial structure remains after the stated predictors are considered**.

A simple model can be written conceptually as:

```text
biomass = intercept + NDVI effect + elevation effect + residual
```

The fitted mean describes the relationship represented by the predictors and functional form. The residual is observed minus predicted. Ordinary least squares commonly assumes residuals are independent, have a stable variance and follow the specified mean structure for inferential calculations.

Spatially patterned residuals question that independence and possibly the mean model. The first response should not be “use a spatial model”. Ask:

- Was an important environmental variable omitted?
- Is the relationship non-linear or interacting?
- Do response and predictors describe compatible spatial and temporal support?
- Does the sample overrepresent one location type?
- Is the spatial-weights definition relevant to the residual process?
- Does the model need a spatial dependence structure, or does the research design need improvement?

### Visual explanation

| Stage | Evidence | Decision |
| --- | --- | --- |
| Scientific model | response, predictors, support and causal assumptions | what relationship is being estimated? |
| Baseline fit | coefficients, predictions and ordinary diagnostics | is the mean form plausible? |
| Residual geography | map, neighbour plot and Moran's I | does location retain structure? |
| Spatial hypothesis | lag, error, lagged predictors or local variation | which process could create the structure? |
| Spatial validation | held-out blocks/sites and residual maps | does the alternative improve transfer? |
| Communication | coefficients, impacts, uncertainty and limitations | what can and cannot be inferred? |

Residual Moran's I uses a weights matrix just like the previous lesson. It is conditional on the fitted model and neighbour definition. A small permutation probability says residual arrangement is unusual under that procedure; it does not identify the correct replacement model.

[[CHECK:m2-l34-residual]]

## 3. Four spatial model ideas

### Spatially lagged predictors: SLX

An SLX model adds neighbouring values of selected explanatory variables. It asks whether the response at one location is associated with nearby environmental context in addition to local predictors. This may suit processes where surrounding vegetation, management or hydrology influences the plot. The lag must be scientifically meaningful and temporal ordering still matters for causal claims.

### Spatial lag of the response

A spatial-lag model includes a weighted neighbouring response term. Conceptually, outcomes may interact or diffuse across connected locations. Because each response depends on others, coefficient interpretation includes direct and indirect impacts rather than an ordinary one-unit local effect. A lag coefficient can also absorb omitted spatial structure, so the process interpretation requires strong justification.

### Spatial error dependence

A spatial-error model places dependence in the disturbance process. Unmeasured spatially structured influences produce correlated errors. The model can correct efficiency and uncertainty under its assumptions, but “spatial error” is not an excuse to stop investigating omitted variables or support mismatch.

### Geographically weighted approaches

Geographically weighted regression estimates location-varying relationships using nearby observations weighted by distance and a bandwidth. It explores spatial non-stationarity: for example, an NDVI–biomass relationship might differ along a moisture gradient. Local coefficients can be unstable under collinearity, sparse edges and flexible bandwidth selection. Many local estimates also create multiple-comparison and interpretation risks. GWR is an exploratory local model, not automatically a better global explanation.

These models answer different questions. They should not be compared as interchangeable menu items.

[[CHECK:m2-l34-families]]

## 4. Prediction, explanation and causation

For prediction, the main question is whether the model generalises to intended new locations and whether uncertainty identifies failure. A spatial random effect or coordinates may improve interpolation inside the sampled domain while failing at a new site.

For explanation, coefficient meaning, confounding, measurement error, selection and model specification matter. Spatial adjustment can change estimates but does not create randomised evidence.

For causal inference, a map and a regression are not sufficient. You need a defensible causal question, temporal ordering, assumptions about confounding and often a design beyond this chapter. Write “associated with” unless the design supports stronger language.

Beware of **spatial leakage**. If neighbouring plots enter training and test sets, a model can exploit local similarity. Random cross-validation may evaluate interpolation between known neighbours rather than transfer to an unsampled management zone. Use the same spatial blocks established in Lesson 2.32 and compare all models on identical folds.

### Model comparison needs more than residual Moran's I

A spatial model can reduce residual autocorrelation and still predict poorly. A flexible local model can improve in-sample fit while becoming unstable at edges. Evaluate:

- geographically separated MAE, RMSE and bias;
- residual maps and residual autocorrelation under predeclared weights;
- coefficient or impact plausibility and uncertainty;
- sensitivity to weights, folds and influential locations;
- prediction domain and extrapolation;
- complexity relative to sample size;
- whether the model supports the intended explanatory or predictive use.

## 5. Worked example — diagnose the baseline first

### Predict before running

Accepted NDVI, biomass and elevation share a broad west–east pattern. Before running the model, predict whether using both predictors will remove all residual spatial structure. Could a high R² coexist with clustered residuals?

```python
import geopandas as gpd
import pandas as pd
from esda.moran import Moran
from libpysal.weights import KNN
from sklearn.linear_model import LinearRegression
table = pd.read_csv("inputs/spatial-statistics/meadow_plot_observations.csv")
accepted = table.loc[table["qa_status"].eq("accept")].copy()
X = accepted[["ndvi_mean", "elevation_m"]]
y = accepted["biomass_g_m2"]
model = LinearRegression().fit(X, y)
accepted["residual"] = y - model.predict(X)
plots = gpd.GeoDataFrame(
    accepted, geometry=gpd.points_from_xy(accepted.x_m, accepted.y_m)
)
weights = KNN.from_dataframe(plots, k=4)
residual_moran = Moran(plots["residual"].to_numpy(), weights,
                       permutations=999, seed=731)
print("R²", round(model.score(X, y), 3))
print("residual Moran's I", round(residual_moran.I, 3),
      "p_sim", round(residual_moran.p_sim, 3))
```

### Code walkthrough

1. GeoPandas creates the point geometry needed for spatial weights.
2. pandas loads the synthetic observation table.
3. `Moran` and `KNN` provide the same diagnostic vocabulary used in Lesson 2.31.
4. `LinearRegression` creates the transparent ordinary baseline.
5. The table is loaded without assigning a false real-world CRS.
6. Only accepted rows enter the primary model; review rows remain available for sensitivity work.
7. `X` contains the two declared predictors in a reproducible order.
8. `y` is field biomass with documented units.
9. `.fit()` estimates the in-sample ordinary relationship.
10. Residuals are observed biomass minus fitted biomass.
11. Geometry is created in the same row order as the residual values.
12. Four-nearest-neighbour weights define the diagnostic relationship.
13. `Moran` tests residual arrangement with 999 reproducible permutations.
14. R² describes in-sample mean fit; it is not spatial validation.
15. The final output places fit and residual spatial evidence together without allowing one to replace the other.

This example does not yet inspect linearity, leverage, heteroscedasticity or uncertainty. Those ordinary diagnostics remain necessary. Spatial analysis adds to them; it does not replace them.

## 6. Common mistakes and recovery

### Mistake: fitting a spatial model before mapping the baseline residuals

**Why beginners make it:** spatial software seems more advanced.  
**Recognition:** there is no ordinary benchmark or residual map.  
**Recovery:** fit the simplest scientifically meaningful baseline, inspect standard diagnostics and map residuals first.

### Mistake: choosing lag, error or GWR from the smallest p-value

**Why beginners make it:** the models appear to compete for significance.  
**Recognition:** the report contains no process hypothesis for where dependence enters.  
**Recovery:** state whether neighbouring outcomes, unmeasured disturbances, surrounding predictors or local relationships are plausible, then compare predeclared alternatives.

### Mistake: interpreting a response lag like an ordinary predictor

**Why beginners make it:** the output table presents one coefficient.  
**Recognition:** the coefficient is described as a purely local one-unit effect.  
**Recovery:** report direct, indirect and total impacts using the model's spatial multiplier and avoid causal language without design support.

### Mistake: using GWR coefficient colours as discoveries

**Why beginners make it:** local maps look detailed and explanatory.  
**Recognition:** edge instability, bandwidth, collinearity and multiple local comparisons are absent.  
**Recovery:** treat GWR as an exploratory diagnostic, map local condition and uncertainty, and validate any hypothesised non-stationarity independently.

### Mistake: evaluating with random plot splits

**Why beginners make it:** standard modelling examples shuffle rows.  
**Recognition:** adjacent plots occur in both training and test sets.  
**Recovery:** evaluate with separated blocks or sites matched to the deployment geography and report distance from test to training support.

[[CHECK:m2-l34-cause]]

## 7. Guided practice — build a spatial model decision record

1. Create `14_spatial_regression.ipynb` and state whether your main purpose is explanation, prediction or diagnosis.
2. Load the training README, plot table and spatial blocks. Record the primary population and review-row policy.
3. Draw a causal sketch in Markdown linking elevation, moisture context, NDVI, sampling access and biomass. Mark unmeasured variables rather than pretending they do not exist.
4. Plot response and predictors in both coordinate space and scatterplots. Check units, missingness and support.
5. Fit an intercept-only benchmark, an NDVI-only baseline and the NDVI-plus-elevation baseline.
6. Save coefficients, predictions and residuals for every accepted plot. Use stable `plot_id`, not row position, for joins.
7. Check residual distribution, fitted–residual pattern, leverage and influential observations before spatial testing.
8. Map residuals with a zero-centred scale and plot the four-nearest neighbour graph.
9. Calculate residual Moran's I under the same four-nearest, six-nearest and 170 m definitions used in Lesson 2.31.
10. Write three process hypotheses: one for lagged response, one for spatially structured error and one for surrounding predictors. Reject any that lack ecological plausibility.
11. Specify one spatial alternative suitable for investigation. Record weights, standardisation, estimator and interpretation of its parameters.
12. Use the predeclared spatial blocks to compare the ordinary baseline with the spatial alternative. If the library cannot predict held-out regions consistently, document that limitation rather than substituting in-sample fit.
13. Report block-wise MAE, RMSE, bias, residual Moran's I and distance to training support.
14. Compare coefficient direction and magnitude across folds. Large instability is part of the result.
15. Add roadside review observations only in a labelled sensitivity analysis. Explain whether design change or statistical dependence better accounts for the difference.
16. Save `residual_diagnostics.csv`, `model_comparison.csv` and one residual/validation map.

## 8. Independent challenge — recommend a model family

Prepare a one-page methods decision for the question:

> How strongly are accepted plot biomass values associated with NDVI and elevation within the synthetic core meadow domain?

Choose one of these recommendations:

- retain the ordinary model with restricted descriptive interpretation;
- use a spatial-error formulation;
- investigate a spatial-lag or SLX formulation;
- use GWR only as exploratory evidence;
- do not model until sampling or variables improve.

Your recommendation must cite baseline diagnostics, residual spatial evidence, sample design, separated validation and coefficient interpretation. Include the strongest argument against your own recommendation and a falsifying test or new measurement.

### Scientific interpretation

A strong ordinary in-sample fit can coexist with spatially structured residuals because R² and residual independence answer different questions. If residual autocorrelation remains after NDVI and elevation, the model may be missing a spatially structured process or using an incomplete functional form. It may also reflect the sampling geometry.

If a spatial-error model reduces residual dependence, the defensible conclusion is that correlated unexplained structure was represented more successfully under that weights model. It does not identify the omitted process. If a lag model improves prediction, the result still requires a credible interaction mechanism. If GWR produces variable local coefficients, the maps remain exploratory until stability and independent transfer are established.

The goal is not to eliminate every spatial pattern. The goal is to produce inference and prediction whose assumptions, geography and limitations match the evidence.

## 9. Reflection, submission and portfolio artifact

### Reflection

- What does residual spatial autocorrelation reveal that response autocorrelation does not?
- Which process hypothesis would support an SLX model for meadow biomass?
- Why can reduced residual autocorrelation coexist with worse spatial prediction?
- What evidence would be required before using causal language about NDVI, elevation and biomass?

### Submission

Submit:

1. `spatial_regression_diagnostic.ipynb` with baseline, mapped residuals and weights sensitivity;
2. `residual_diagnostics.csv` retaining one row per plot and model;
3. `model_comparison.csv` with identical separated folds for every candidate;
4. one residual and validation map with accessible text description;
5. one screenshot showing in-sample fit beside residual Moran evidence;
6. the one-page model-family decision and counterargument;
7. the completed regression section of `SPATIAL_INFERENCE_QA_TEMPLATE.md`.

### Portfolio artifact

Add **spatial_regression_diagnostic.ipynb** to the UAV and Satellite Analysis Pipeline. A reviewer should see a transparent ordinary benchmark, spatially explicit residual evidence, a process-based alternative and honest geographic validation—not a catalogue of spatial-model buttons.
