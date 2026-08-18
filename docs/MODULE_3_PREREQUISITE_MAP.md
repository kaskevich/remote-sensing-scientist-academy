# Module 3 prerequisite and novelty map

## Purpose

This map prevents **Remote Sensing Modelling** from repeating Modules 1–2. Module 3 assumes the learner can work reproducibly with scientific tables, vector and raster data, spatial support, EO products, grouped evidence and quality records. Each lesson uses those capabilities to answer a new question: **what evidence makes a remote-sensing prediction defensible?**

The intended entry profile is completion of Modules 1–2 or demonstrably equivalent experience. A learner who cannot yet explain CRS, grid alignment, NoData, field-to-pixel support, spatial autocorrelation or independent QA should revisit the linked foundations before modelling.

| Lesson | Assumed from Module 1 | Assumed from Module 2 | New modelling knowledge | Why it belongs here |
|---|---|---|---|---|
| 3.1 Prediction, Inference and Explanation | Variables, functions, tables and cautious interpretation | Observation chains and bounded EO claims | Predictive, descriptive, explanatory and causal claim boundaries | It defines what a fitted model may legitimately claim |
| 3.2 Define the Target and Prediction Unit | Data types, missingness and documented variables | Spatial/temporal support, raster cells, plots and metadata QA | Target contract, prediction unit and prediction domain | These are properties of a prediction problem, not general GIS operations |
| 3.3 Design Predictors and Modelling Hypotheses | Dictionaries, tabular schemas and scientific reasoning | Sensor measurements, indices, texture, scale and provenance | Feature hypotheses, proxies, nuisance variables and training-serving skew | It turns processed EO variables into an operational feature contract |
| 3.4 Build the Modelling Dataset and Pre-register the Experiment | pandas tables, validation functions and reproducible notebooks | Joins, sampling units, groups, blocks and spatial leakage warnings | One-row modelling contract, saved folds, final-test firewall and pre-registration | It freezes the evidence design before model choice can influence it |
| 3.5 What Does a Useful Model Need to Beat? | Summary statistics | Sampling-aware comparisons | Naive and scientific baselines, skill and bias–variance | Model value has meaning only relative to a declared comparator |
| 3.6 Trees, Ensembles and Boosting | Conditions and functions | Continuous/categorical predictors | Partitions, bagging, random forests and sequential correction | It introduces model mechanisms through prediction behaviour |
| 3.7 XGBoost from First Principles | Iteration and functions | EO feature tables | Additive trees, loss, shrinkage and regularisation | It establishes algorithm understanding before software use |
| 3.8 Train the First Defensible XGBoost Model | Reproducible workflow | Analysis-ready predictor stack | Fixed folds, untuned candidate, baseline comparison and model metadata | It creates the first reviewable model without tuning theatre |
| 3.9 Validation Is Part of the Model | Testing mindset | Spatial dependence and sampling design | Generalisation claim as a property of the split | It connects validation directly to the intended prediction |
| 3.10 Spatial, Grouped and Leave-Location-Out Validation | Data grouping | Sites, spatial blocks and autocorrelation | Within-site versus new-site versus new-region evaluation | It tests transfer rather than random-row memorisation |
| 3.11 Temporal and Spatiotemporal Validation | Dates in tables | EO acquisition timing and time-series structure | Future holdout, rolling origin and drift | It protects future prediction from future-data leakage |
| 3.12 Nested Model Selection and Leakage Prevention | Functions and pipelines | Spatial partitions | Inner selection, outer estimation and pipeline boundaries | It separates model choice from honest performance estimation |
| 3.13 Hyperparameter Optimisation | Loops and parameter values | Reproducible computation | Controlled search spaces and development-only optimisation | Tuning becomes an experiment rather than repeated test peeking |
| 3.14 Early Stopping, Regularisation and Learning Dynamics | Plot interpretation | QA evidence | Learning curves, early stopping and underfit/overfit diagnosis | It uses behaviour through training to control complexity |
| 3.15 Feature Selection, Redundancy and Stability | Correlation and tables | Sensor/index relationships | Permutation relevance, fold stability and scientific retention | It evaluates whether features are dependable, not merely selected |
| 3.16 Imbalanced Classification and Decision Thresholds | Booleans and conditions | Habitat labels and map classes | Error costs, precision–recall and threshold policy | Classification decisions need an ecological utility rule |
| 3.17 Regression Evaluation | Numeric summaries and plots | Continuous environmental variables | R², RMSE, MAE, bias and fold distributions | Multiple diagnostics constrain one continuous prediction claim |
| 3.18 Classification Evaluation and Probability Quality | Categories and proportions | Thematic maps and reference labels | Confusion matrices, ranking, calibration and threshold metrics | Class and probability claims require different evidence |
| 3.19 Residual Geography and Structured Failure | Data filtering | Mapping, subgroups and spatial dependence | Residual maps and failure stratification | Average accuracy can conceal geographic model failure |
| 3.20 Model Interpretation Without Causal Overclaiming | Scientific interpretation | Proxy measurements | Gain, permutation, SHAP and partial dependence limitations | Predictive contribution is separated from causal explanation |
| 3.21 Domain of Applicability and Extrapolation | Ranges and missingness | Multidimensional environmental space | Analogue distance, extrapolation flags and applicability maps | A prediction layer needs an evidence-support layer |
| 3.22 What Uncertainty Means in Predictive EO | Measurement caution | Sensor, sampling and processing uncertainty | Measurement, sampling, model, residual and transfer uncertainty | It prevents one number from standing in for unlike uncertainties |
| 3.23 Prediction Intervals and Quantile Approaches | Percentiles | Continuous prediction rasters | Conditional quantiles, interval width and coverage | Point predictions become bounded statements |
| 3.24 Conformal Prediction and Empirical Coverage | Functions and evaluation sets | Structured dependence | Calibration sets, empirical coverage and exchangeability limits | It teaches distribution-light intervals with honest assumptions |
| 3.25 Uncertainty and Applicability Maps | Figure communication | Raster writing and masks | Prediction, uncertainty and applicability as separate layers | It produces a decision-ready evidence package |
| 3.26 Raster Inference at Scale | Modular Python | Chunked rasters, NoData and grid contracts | Frozen feature order, tiled inference and schema gates | Training logic becomes a repeatable spatial prediction system |
| 3.27 Google Earth Engine for Modelling Workflows | Functions | Earth Engine concepts, sampling and exports | Supported server-side classifiers and bounded cloud component | It adds cloud execution without pretending Earth Engine runs every model |
| 3.28 Local ML versus Earth Engine ML | Decision records | Local/cloud geospatial architectures | Architecture selection by validation control, scale and access | It makes system choice part of scientific defensibility |
| 3.29 Monitoring Through Repeated Predictions | Reusable workflows | Comparable EO time steps | Drift gates, repeatability and predicted-change boundaries | Repeated predictions are governed as monitoring evidence |
| 3.30 Reproducibility, Model Cards and Operational QA | README, environment and tests | Provenance, CI and delivery QA | Model cards, update policy and operational acceptance | It packages the complete predictive claim for review and reuse |

## Repetition gate

Module 3 may briefly retrieve earlier concepts but does not reteach them as primary outcomes. Each lesson must devote at least three quarters of its assessed work to the new modelling column above. If a lesson requires substantial remediation in Python, GIS or EO processing, that remediation belongs in a prerequisite link or optional support note—not in the Module 3 assessment.
