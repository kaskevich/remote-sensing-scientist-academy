# Curriculum Promise → Implementation Matrix

Audit date: 18 August 2026
Scope: published homepage, README, module maps, implemented lessons 1.1–1.12, 2.1–2.53 and 3.1–3.30, twelve Module 2 practica and the Module 2 and Module 3 capstones.

## Interpretation rules

- A planned title is not implementation.
- A passing mention is not coverage.
- `Theory`, `Practice`, `Independent` and `Portfolio` refer to evidence in the currently available curriculum.
- Status values are `COMPLETE`, `PARTIAL`, `TOO SHALLOW`, `MISSING`, `DUPLICATED` or `WRONG SEQUENCE`.
- `COMPLETE` is a baseline coverage judgement, not the final lesson-QA status in `CURRICULUM_QA.md`.

## Public website and portfolio promises

| Promised topic / skill | Where promised | Module | Lesson(s) teaching it | Theory | Practice | Independent application | Portfolio evidence | Current status |
|---|---|---|---|---|---|---|---|---|
| Learn remote sensing | Hero | Academy | 2.3, 2.11–2.25 | Partial: raster/UAV | Yes | Yes | Raster and UAV artifacts | PARTIAL |
| Work with real data | Hero | Academy | 1.8–1.12 use published ecological data | Yes for field table | Yes | Yes | Vegetation Data Explorer | PARTIAL |
| Use real satellite data | Hero and README | Academy | 2.26–2.30 and 2.38–2.42 use synthetic EO training evidence | Theory only for real products | No real-data practice | No | No | MISSING; current lessons deliberately do not mislabel synthetic fixtures as real observations |
| Build a portfolio | Hero/pathway | Academy | 1.1–1.12 plus Module 2 practica | Yes | Yes | Yes in reviewed Module 1 | Portfolio Project 1 consolidated; Module 2 packages await final QA | PARTIAL |
| Complete analysis | Hero/README | Academy | 1.12 and practica 2.C/2.D | Yes | Yes | Yes | Three substantial packages | PARTIAL |
| Sentinel-2 recovery field lab | Homepage field lab | Future satellite module | No implemented lesson | No | No | No | No | MISSING |
| Surface-reflectance preparation | Field-lab step | Future satellite module | No implemented lesson | No | No | No | No | MISSING |
| Six-year change analysis | Field-lab step | Future satellite module | No implemented lesson | No | No | No | No | MISSING |
| Uncertainty-aware scientific briefing | Field lab/outcomes | 1 and 2 | 1.12, 2.21, 2.24, practica | Yes | Yes | Yes | Briefing and QA reports | COMPLETE |
| One continuous professional pathway | Pathway section | Academy | Modules 1–2 and all seven Module 3 chapters plus capstone are implemented; later stages remain planned | Yes through Module 3 | Yes | Yes | Three cumulative module projects with independent Module 2 and Module 3 capstones | PARTIAL across the six-module vision |
| Vegetation Data Explorer | Foundations card | 1 | 1.1–1.12 | Yes | Yes | Yes | Complete notebook | COMPLETE |
| UAV and Satellite Analysis Pipeline | Geospatial card/module 2 | 2 | 2.1–2.53, twelve practica and capstone | Yes | Yes | Yes | Complete integrated capstone package | COMPLETE for the bounded Module 2 scope |
| Environmental Monitoring Project | Modelling card | 3 | 3.1–3.30 plus capstone | Yes through independent project handover | Yes on synthetic teaching evidence and learner-approved data | Yes | Complete capstone brief, release gate, three-profile evidence matrix and learner submission workflow | COMPLETE for the bounded Module 3 scope |

## GIS and geospatial Python

| Promised topic / skill | Where promised | Module | Lesson(s) teaching it | Theory | Practice | Independent application | Portfolio evidence | Current status |
|---|---|---|---|---|---|---|---|---|
| Spatial thinking | Module 2 purpose | 2 | 2.1–2.4 | Yes | Yes | Yes | Spatial evidence inventory | COMPLETE |
| Vector data | Academy goals | 2 | 2.1, 2.5–2.10 | Yes | Yes | Yes | Vector handover review | COMPLETE |
| Raster data | Academy goals/card | 2 | 2.1, 2.11–2.17 | Yes | Yes | Yes | Analysis-ready raster stack | COMPLETE |
| Coordinate systems and projections | Academy goals/module outcome | 2 | 2.2, reinforced 2.5–2.25 | Yes | Yes | Yes | CRS audit in all projects | COMPLETE |
| Spatial relationships and predicates | Academy goals | 2 | 2.6–2.9 | Yes | Yes | Yes | Join/topology evidence | COMPLETE |
| Geoprocessing and overlays | Academy goals | 2 | 2.6, 2.7, 2.9, 2.13 | Yes | Yes | Yes | Vector and raster derivatives | COMPLETE |
| Spatial joins and queries | Academy goals | 2 | 2.7, 2.35–2.36 | Yes | Yes | Yes | Relational query pack and predicate audit | COMPLETE |
| Sampling and zonal statistics | Academy goals | 2 | 2.15 | Yes | Yes | Yes | Extraction evidence table | COMPLETE |
| Cartography and professional maps | Academy goals | 2 | 2.10, 2.43–2.45 and practica | Yes for evidence-led map design and delivery | Yes | Yes | QA maps and Accessible Web GIS Evidence Delivery | COMPLETE AS FOUNDATION |
| Spatial data quality and metadata | Academy goals | 2 | 2.1–2.53 and capstone | Yes | Yes | Yes | QA reports, manifests, model assurance, production release and capstone evidence records | COMPLETE |
| Spatial databases | Module 2 outcomes | 2 | 2.35–2.37 and Chapter 7 practicum | Yes | Yes | Yes | Spatial Database and Governance Package | COMPLETE AS FOUNDATION; production editing/service operations planned |
| QGIS | Geospatial card | 2 | 2.10 plus QA companions | Yes | Yes | Yes | QGIS QA map/report | COMPLETE |
| Professional GIS workflows | Academy goals | 2 | Practica 1–10 | Yes | Yes | Yes | Ten evidence, handover and architecture decisions | COMPLETE |
| Web GIS and interactive delivery | Module 2 outcome | 2 | 2.43–2.45 and Chapter 9 practicum | Yes | Yes | Yes | Accessible Web GIS Evidence Delivery | COMPLETE AS FOUNDATION |
| OGC service/API interoperability | Module 2 outcome | 2 | 2.43, 2.45 and Chapter 9 practicum | Yes | Yes | Yes | Capability, conformance, CRS and client acceptance matrix | COMPLETE AS FOUNDATION |
| ArcGIS professional ecosystem | Planned Module 2 Chapter 10 | 2 | 2.46 and Chapter 10 practicum | Yes | Yes without paid access | Yes | Portable Professional GIS Architecture | COMPLETE AS FOUNDATION; live organisational verification remains contextual |
| ArcGIS/open workflow portability | Academy professional pathway | 2 | 2.46 and Chapter 10 practicum | Yes | Yes | Yes | Scientific invariant suite, role matrix and migration drill | COMPLETE AS FOUNDATION |
| Python foundations for geospatial work | Foundations/module prerequisites | 1 | 1.1–1.12 | Yes | Yes | Yes | Vegetation Data Explorer | COMPLETE |
| NumPy | Module 1 outcome | 1/2 | 1.7, reused in raster/UAV | Yes | Yes | Yes | Numerical/raster workflow | COMPLETE |
| pandas | Module 1 outcome | 1 | 1.8–1.12 | Yes | Yes | Yes | Vegetation Data Explorer | COMPLETE |
| GeoPandas | Geospatial card | 2 | 2.5–2.10 | Yes | Yes | Yes | Vector handover package | COMPLETE |
| Shapely | Academy goals | 2 | 2.6–2.9 | Yes | Yes | Yes | Geometry/topology record | COMPLETE |
| Rasterio | Geospatial card | 2 | 2.12–2.17, 2.23–2.25 | Yes | Yes | Yes | Raster stack and UAV subset | COMPLETE |
| Xarray | Geospatial card/module outcome | 2 | 2.38–2.39 and Chapter 8 practicum | Yes | Yes | Yes | Labelled array audit and EO cube contract | COMPLETE AS FOUNDATION |
| Matplotlib and scientific plotting | Academy goals/module outcome | 1 | 1.11–1.12 | Yes for descriptive tables | Yes | Yes | Audited accessible figures with PNG/SVG handover | COMPLETE |
| File handling and relative paths | Academy goals | 1/2 | 1.8, 2.4–2.5 | Yes | Yes | Yes | Project folders | COMPLETE |
| Reproducible scripts | Academy goals | 1/2 | Functions/notebooks plus 2.50–2.53 | Yes | Yes | Yes | CLI workflow, pipeline entry point and CI | COMPLETE AS FOUNDATION |
| Notebook workflows | Pathway/module outcome | 1/2 | All implemented lessons | Yes | Yes | Yes | Main notebooks | COMPLETE |
| Functions | Module 1 outcome | 1 | 1.6, 1.9, 2.14 | Yes | Yes | Yes | Reusable QA functions | COMPLETE |
| Workflow organisation | Academy goals | 1/2 | 1.8, 1.12, practica | Yes | Yes | Yes | Structured submissions | COMPLETE |
| Environments and dependencies | Academy goals | 2 | 2.52–2.53 and Chapter 12 practicum | Yes | Yes | Yes | Pinned non-root container and environment inventory | COMPLETE AS FOUNDATION |
| Debugging | Academy goals | 1 | 1.1, 1.2, 1.6 | Yes | Yes | Yes | Debug record | COMPLETE |
| Automation | Academy goals | 2 | 2.50–2.53 and Chapter 12 practicum | Yes | Yes | Yes | Recoverable acquisition, CLI, container and CI release | COMPLETE AS FOUNDATION |

## Remote Sensing and Earth Observation

| Promised topic / skill | Where promised | Module | Lesson(s) teaching it | Theory | Practice | Independent application | Portfolio evidence | Current status |
|---|---|---|---|---|---|---|---|---|
| Electromagnetic radiation | Academy goals/remote-sensing promise | 2 | 2.26 | Yes | Yes | Yes | Optical product decision | COMPLETE |
| Spectral response | Academy goals | 2 | 2.20, 2.26, 2.29 | Yes | Yes | Yes | Sensor inventory and spectral-feature note | COMPLETE |
| Reflectance | Academy goals | 2 | 2.20, 2.25–2.27, 2.29 | Yes | Yes | Yes | Radiometric QA, optical decision and index evidence | COMPLETE |
| Spectral bands | Academy goals | 2 | 2.18, 2.20, 2.25–2.29 | Yes | Yes | Yes | Band inventory and satellite evidence package | COMPLETE |
| Spatial resolution | Academy goals | 2 | 2.3, 2.11, 2.18–2.19 | Yes | Yes | Yes | Support/mission decisions | COMPLETE |
| Spectral resolution | Academy goals | 2 | 2.26, 2.29 | Yes | Yes | Yes | Optical decision and spectral-feature note | COMPLETE |
| Temporal resolution | Academy goals | 2 | 2.3, 2.18, 2.26, 2.28, 2.39–2.42 | Yes | Yes on synthetic seasonal evidence | Yes | Support, observation and cube contracts | COMPLETE AS FOUNDATION; multi-year real-data application planned |
| Radiometric resolution | Academy goals | 2 | 2.20, 2.26 | Yes | Yes | Yes | Radiometric and product-level audits | COMPLETE |
| Sensors and platforms | Academy goals | 2 | 2.18–2.30 | Yes | Yes | Yes | UAV and satellite sensor/product inventories | COMPLETE |
| Passive vs active sensing | Academy goals | 2 | 2.18, 2.20, 2.26, 2.28 | Yes | Yes | Yes | Cross-sensor evidence package | COMPLETE |
| Optical remote sensing | Homepage/Academy goals | 2 | 2.26–2.27 | Yes | Yes | Yes | Optical product and spectral-index decisions | COMPLETE |
| Satellite imagery | Hero/geospatial card | 2 | 2.26–2.30 | Yes | Yes | Yes | Satellite EO Evidence Package | COMPLETE |
| Sentinel-2 | Hero/field lab | 2 | 2.26–2.27 | Yes | Yes | Yes | Optical product and spectral-index decisions | COMPLETE AS FOUNDATION; time series planned |
| Landsat | Academy goals | 2 | 2.26–2.27 | Yes | Yes | Yes | Cross-mission optical recommendation | COMPLETE AS FOUNDATION |
| Image products and processing levels | Academy goals | 2 | 2.18, 2.22–2.26 | Yes | Yes | Yes | UAV and satellite product inventories | COMPLETE |
| Atmospheric effects | Academy goals | 2 | 2.26–2.27, 2.29 | Yes | Yes | Yes | Optical and spectral QA decisions | COMPLETE AS FOUNDATION |
| Clouds and cloud masking | Field lab/Academy goals | 2 | 2.26–2.27, 2.39, 2.42 | Yes | Yes | Yes | Local cloud/shadow gate, masked cube and catalogue eligibility record | COMPLETE AS FOUNDATION; multi-year application planned |
| QA layers | Academy goals | 2 | 2.24–2.30 | Yes | Yes | Yes | UAV and satellite QA reports | COMPLETE |
| Band combinations | Academy goals | Planned | Multispectral indices only | Partial | Limited | Limited | UAV stack | TOO SHALLOW |
| NDVI | Hero/Academy goals | 2 | 2.25 | Yes | Yes | Yes | UAV NDVI derivative | COMPLETE |
| Other appropriate indices | Academy goals | 2 | 2.25, 2.27 | Yes | Yes | Yes | NDVI/GNDVI/SAVI/MSAVI comparison | COMPLETE |
| Raster preprocessing | Academy goals | 2 | 2.11–2.17 | Yes | Yes | Yes | Analysis-ready stack | COMPLETE |
| Clipping/masking | Academy goals | 2 | 2.13, 2.15, 2.25 | Yes | Yes | Yes | Valid-mask derivatives | COMPLETE |
| Reprojection/resampling/alignment | Academy goals | 2 | 2.13–2.14, reinforced later | Yes | Yes | Yes | Alignment report | COMPLETE |
| Mosaicking | Academy goals | 2 | Orthomosaic formation/QA 2.22–2.24; no satellite mosaic operation | Partial | QA only | Yes, QA | UAV survey assessment | PARTIAL |
| Time series | Homepage field lab/Academy goals | 2 / future 3 | 2.39–2.42 provide the cube and discovery foundation | Yes for seasonal cube structure | Yes on synthetic evidence | Yes | Cloud-Native EO Discovery and Cube Package | PARTIAL; six-year real-data analysis remains planned |
| Interpretation, validation and uncertainty | Academy goals | 1/2 | Repeated across projects/practica | Yes | Yes | Yes | Scientific briefings and QA | COMPLETE |

## Geospatial data science and modelling

| Promised topic / skill | Where promised | Module | Lesson(s) teaching it | Theory | Practice | Independent application | Portfolio evidence | Current status |
|---|---|---|---|---|---|---|---|---|
| Multidimensional raster data | Module 2 outcome | 2 | 2.38–2.42 and Chapter 8 practicum | Yes | Yes | Yes | Cloud-Native EO Discovery and Cube Package | COMPLETE AS FOUNDATION |
| Vector–raster integration | Academy goals | 2 | 2.15, 2.25 | Yes | Yes | Yes | Extraction tables | COMPLETE |
| Scalable workflows | Academy goals | 2 | 2.16, 2.35–2.42, 2.50–2.53 | Yes for bounded compute and production orchestration | Yes | Yes | Database, Cloud-Native EO and Production Workflow packages | COMPLETE AS FOUNDATION |
| Spatial data exploration and cleaning | Academy goals | 1/2 | 1.8–1.11, 2.5–2.10 | Yes | Yes | Yes | Data/vector reports | COMPLETE |
| Feature engineering | Academy goals | 3 | 3.3–3.4, 3.15, 3.20 | Yes for predictor hypotheses, support, operational availability, model-ready schema, stability and interpretation boundaries | Yes | Yes | Predictor Hypothesis Register, Feature Stability Report and Interpretation Claims | COMPLETE |
| Spatial aggregation | Academy goals | 1/2 | 1.10, 2.7, 2.15 | Yes | Yes | Yes | Summary/extraction tables | COMPLETE |
| Spatial statistics | Module 2 outcome | 2 | 2.31–2.34 | Yes | Yes | Yes | Spatial Inference and Validation Package | COMPLETE |
| Scientific visualization | Academy goals | 1/2 | 1.11–1.12, QA maps, 2.44 and Chapter 9 practicum | Yes for figures and accessible interactive evidence delivery | Yes | Yes | Figures, QA maps and map/table handover | COMPLETE AS FOUNDATION |
| What machine learning does | Modelling card | 3 | 3.1, 3.5–3.8 | Yes for prediction, baseline controls, fitted partitions, additive optimisation and evidence limits | Yes | Yes | Baseline Report, Mechanism Audit and First Defensible XGBoost Candidate | COMPLETE AS FOUNDATION |
| Features/predictors and targets | Academy goals | 3 | 3.2–3.4 | Yes | Yes | Yes | Target Specification, Predictor Hypotheses and Model Experiment Plan | COMPLETE |
| Regression and classification | Academy goals | 3 | 3.1, 3.5–3.8, 3.16–3.18 | Complete fixed-procedure regression and imbalanced classification evaluation, including decision thresholds, ranking, calibration and protected assessment | Yes | Yes | Regression and Classification Evaluation Packages | COMPLETE AS EVALUATION FOUNDATION |
| Train/validation/test design | Academy goals | 2/3 | 2.48–2.49, 3.4–3.12 | Yes for final-test firewall, random, grouped, spatial, site, temporal, spatiotemporal and nested roles | Yes | Yes | Structured Validation Design, fold registries and outer prediction ledger | COMPLETE |
| Preprocessing and feature engineering | Academy goals | 3 | 3.3–3.4, 3.8, 3.12, 3.15, 3.20–3.21 | Yes for schema, transformations, fold-local preprocessing, correlated predictors, feature stability, explanation support and applicability scaling | Yes | Yes | Feature schema, metadata, Feature Stability Report and Applicability Contract | COMPLETE AS MODELLING FOUNDATION |
| Random Forest | Academy goals | 3 | 3.6 | Yes | Yes | Yes | Tree Ensemble Mechanism Audit | COMPLETE AS FOUNDATION |
| XGBoost | Modelling card | 3 | 3.7–3.8, 3.13–3.15, 3.23, 3.26–3.28, 3.30 | Yes for mechanism, regularisation, controlled tuning, quantile objectives, feature schema, scalable local inference, architecture and model IO | Yes | Yes | XGBoost candidate, controlled-selection, interval, inference and operational packages | COMPLETE AS MODELLING FOUNDATION |
| R², RMSE and MAE | Academy goals | 2/3 | 2.21, 2.33–2.34, 3.5, 3.8, 3.17 | Complete formula, unit, sensitivity, baseline, residual and fold-level treatment for MAE, RMSE, bias and R² | Yes | Yes | Regression Evaluation Package | COMPLETE |
| Confusion matrix, precision, recall and F1 | Academy goals | 2/3 | 2.49, 3.16, 3.18 | Complete class-count, threshold, precision, recall, specificity, F1, balanced-accuracy, ROC/PR and calibration treatment | Yes | Yes | Classification Evaluation and Probability-quality Package | COMPLETE |
| Feature importance and interpretation | Academy goals | 3 | 3.15, 3.20 | Held-out permutation, gain, PDP/ICE, SHAP, correlation, fold stability and predictive-not-causal interpretation | Yes | Yes | Feature Stability and Interpretation Stability Reports | COMPLETE |
| Overfitting, hyperparameters and cross-validation | Academy goals | 2/3 | 2.48–2.49, 3.5–3.16 | Yes for bias–variance intuition, tree capacity, bounded random search, early stopping, grouped/spatial/temporal CV, nested selection and leakage boundaries | Yes | Yes | Mechanism Audit, Structured Validation Design and Controlled Model Selection Record | COMPLETE AS FOUNDATION |
| Spatial cross-validation and autocorrelation | Academy goals | 2/3 | 2.31–2.34, 3.9–3.12 | Yes for claim-matched grouping, blocks, sites, buffers, temporal direction and nested spatial assessment | Yes | Yes | Spatial/temporal fold registries and validation comparison | COMPLETE |
| Leakage, extrapolation and uncertainty | Academy goals | 2/3 | 2.29, 2.31–2.34, 2.48–2.49, 3.3–3.4, 3.9–3.30 and capstone | Target, proximity, duplicate, derivative, temporal, preprocessing, selection and final-test leakage; applicability; uncertainty; inference schemas; drift and monitoring gates | Yes | Yes | Leakage checklist, nested registry, diagnostics, Prediction Evidence Package, capstone release gate, Monitoring Runbook and Model Card | COMPLETE THROUGH INDEPENDENT MODULE 3 CAPSTONE |
| Prediction and validation maps | Modelling card | 3 | 3.9–3.11, 3.19, 3.21 | Split-role, fold, transfer, residual, class-error and Domain of Applicability maps with support and release rules | Yes | Yes | Structured Validation Design and Model Diagnostic and Applicability Package | COMPLETE AS DIAGNOSTIC FOUNDATION |

## UAV pipeline

| Promised topic / skill | Where promised | Module | Lesson(s) teaching it | Theory | Practice | Independent application | Portfolio evidence | Current status |
|---|---|---|---|---|---|---|---|---|
| Flight planning and acquisition | Academy goals | 2 | 2.18–2.19 | Yes | Yes | Yes | Mission design audit | COMPLETE |
| Overlap | Academy goals | 2 | 2.19 | Yes | Yes | Yes | Mission comparison | COMPLETE |
| GCP, RTK and PPK | Academy goals | 2 | 2.21 | Yes | Yes | Yes | Accuracy report | COMPLETE |
| Radiometric considerations | Academy goals | 2 | 2.20, 2.25 | Yes | Yes | Yes | Radiometric QA | COMPLETE |
| Photogrammetry and SfM | Academy goals | 2 | 2.22 | Yes | Yes | Yes | Reconstruction audit | COMPLETE |
| Point clouds | Academy goals | 2 | 2.22–2.23 | Yes | Interpretive practice | Yes | Product table | PARTIAL |
| Orthomosaic | Academy goals | 2 | 2.22–2.24 | Yes | QA practice | Yes | Survey assessment | COMPLETE |
| DSM and DTM | Academy goals | 2 | 2.17, 2.23–2.24 | Yes | Yes | Yes | Surface QA | COMPLETE |
| Multispectral products and indices | Academy goals | 2 | 2.20, 2.25 | Yes | Yes | Yes | Accepted subset + indices | COMPLETE |
| UAV QA/QC | Academy goals | 2 | 2.24 and practicum | Yes | Yes | Yes | Professional assessment | COMPLETE |
| Field/reference extraction | Academy goals | 2 | 2.15, 2.25 | Yes | Yes | Yes | Extraction table | COMPLETE |
| UAV modelling | Academy goals | Future modelling | No implemented lesson | No | No | No | No | MISSING |
| Mapping and validation | Academy goals | 2 | QA maps and 2.21/2.24 | Yes | Yes | Yes | QA maps/reports | COMPLETE |
| Scientific interpretation | Academy goals | 2 | 2.18–2.25 | Yes | Yes | Yes | Interpretive reports | COMPLETE |

## Research and professional engineering

| Promised topic / skill | Where promised | Module | Lesson(s) teaching it | Theory | Practice | Independent application | Portfolio evidence | Current status |
|---|---|---|---|---|---|---|---|---|
| Research question | Academy goals | 1/2 | 1.1, 1.10, 1.12; question-led Module 2 | Yes | Yes | Yes | Project question | COMPLETE |
| Hypothesis | Academy goals | Academy | Mentioned but not developed/tested explicitly | Limited | No | No | No | TOO SHALLOW |
| Data requirements | Academy goals | 1/2 | 1.12, 2.1–2.4, 2.18–2.19 | Yes | Yes | Yes | Evidence contracts | COMPLETE |
| Sampling design | Academy goals | 2 | 2.32 and Chapter 6 practicum | Yes | Yes | Yes | Sampling audit and supplementary design | COMPLETE |
| Scale | Academy goals | 2 | 2.3 and repeated | Yes | Yes | Yes | Support decision | COMPLETE |
| Spatial autocorrelation | Academy goals | 2 | 2.31 and Chapter 6 practicum | Yes | Yes | Yes | Weights sensitivity and permutation report | COMPLETE |
| Validation and uncertainty | Academy goals | 1/2 | 1.9–1.12 and Module 2 QA chain | Yes | Yes | Yes | QA/decision reports | COMPLETE |
| Reproducibility and methodological justification | Academy goals | 1/2 | 1.1, 1.8, 1.12, all practica | Yes | Yes | Yes | Reproducible reports | COMPLETE |
| Limitations and avoiding causal claims | Academy goals | 1/2 | 1.10–1.12 and Module 2 | Yes | Yes | Yes | Limitation statements | COMPLETE |
| Methods/results communication | Academy goals | 1/2 | 1.11–1.12, practica | Yes | Yes | Yes | Briefings and handovers | COMPLETE |
| Git and GitHub | Academy goals | 2/future engineering | 2.53 teaches GitHub Actions within CI but not complete Git collaboration | Partial | Yes for workflow | Limited | CI workflow | PARTIAL |
| README | Academy goals | 1/2 | Data packs contain README; learner projects do not consistently require one | Partial | Limited | Limited | Inconsistent | TOO SHALLOW |
| Reproducible environment | Academy goals | 2 | 2.52 and Chapter 12 practicum | Yes | Yes | Yes | Pinned container, digest and equivalence evidence | COMPLETE AS FOUNDATION |
| Naming conventions and relative paths | Academy goals | 1/2 | 1.1, 1.8, Module 2 handovers | Yes | Yes | Yes | Structured packages | COMPLETE |
| Raw versus processed data | Academy goals | 1/2 | 1.8, 1.12, 2.4 and practica | Yes | Yes | Yes | Immutable inputs/derivatives | COMPLETE |
| Professional figures and reports | Academy goals | 1/2 | 1.11–1.12, 2.10 and practica | Yes | Yes | Yes | Figures, maps, reports | COMPLETE |

## Baseline conclusions

### Missing

The current release does not implement a real multi-year time-series investigation, a complete Git collaboration course or broad predictive modelling beyond geospatial semantic segmentation. Production automation and learner-built reproducible environments are now implemented on synthetic fixtures, but live organisational operations remain contextual. Stage 3 has no complete curriculum module. These missing areas must not be presented as currently delivered competencies.

### Too shallow

Hypothesis development, temporal-resolution time-series application, cartographic design, scientific plotting depth, README construction and environment management need stronger progression or later dedicated teaching. Sampling design and sensor-resolution concepts now have complete foundations but must be reinforced in later predictive and time-series work.

### Duplicated with purpose

CRS, metadata, NoData, alignment, validation, uncertainty and non-causal interpretation recur across different evidence types. This is deliberate spiral learning, not redundant duplication, provided each lesson explicitly states what prior knowledge is reused and what new decision is added.

### Sequence risks

- The homepage advertises satellite data before satellite lessons are available.
- The Geospatial card lists Xarray before any Xarray lesson is implemented.
- The Modelling card presents a complete stage with no corresponding module.
- Module 2 currently contains the title map for several future specialisms inside one very large module; the proposed map separates these into coherent later modules without discarding the existing lesson plan.
