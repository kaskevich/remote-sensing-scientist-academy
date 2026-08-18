# Academy curriculum map and graduate evidence plan

## Design decision

Keep the 12-lesson Module 1 and the complete 12-chapter Module 2. They form a coherent progression from scientific programming through spatial reasoning, vector GIS, raster science, UAV product QA, satellite Earth Observation, spatial inference, governed spatial databases, cloud-native EO data, accessible delivery, professional GIS ecosystems, advanced image analysis and production geospatial computing.

Module 2 now ends in one integrated UAV and Satellite Analysis Pipeline capstone. Later modules must deepen predictive modelling, time series and independent research without duplicating these foundations or advertising unsupported career outcomes.

## Proposed six-module pathway

| Stage | Module | Central professional problem | Main project | Current state |
|---|---|---|---|---|
| Foundations | 1. Thinking Like a Scientific Programmer | How can ecological measurements become a reproducible scientific argument? | Vegetation Data Explorer | Implemented; final integrity revision in progress |
| Geospatial | 2. Geospatial Evidence and UAV Analysis | How can vector, raster, UAV and satellite products be made analysis-ready, scientifically defensible and reproducibly delivered? | UAV and Satellite Analysis Pipeline | Complete: Lessons 2.1–2.53, twelve chapter practica and capstone |
| Modelling | 3. Remote Sensing Modelling | How can EO models be framed, trained, spatially validated, diagnosed, bounded and operationalised without leakage or causal overclaiming? | Environmental Monitoring Project | Chapters 1–3 implemented: Lessons 3.1–3.12 establish the prediction contract, meaningful baselines, first serialized XGBoost candidate, and spatial, temporal and nested validation architecture; Lessons 3.13–3.30 and capstone remain planned |
| Earth Observation | 4. Cloud EO and Time Series | How can optical, SAR and multidimensional satellite observations become comparable monitoring evidence through time? | Baltic Wetlands Monitoring Workflow | Planned to extend the implemented Module 2 Chapters 5 and 8 foundation into longer real-data time-series analysis; not advertised as available |
| Professional systems | 5. Professional Scientific Computing | How can a validated EO workflow become a maintainable, tested and governed production system? | Production-ready Coastal Meadow EO Pipeline | Planned to deepen Module 2 Chapters 7–12 and Module 3 operational modelling through larger institutional scenarios |
| Professional synthesis | 6. Portfolio, Research and Career Launch | How can one independently scoped EO investigation be reproduced, defended and communicated? | Environmental EO Case Study | Missing; future capstone and graduate-profile assessment |

This map is problem-led. Tools such as Rasterio, Xarray, PostGIS and XGBoost are implementations within a scientific problem, not module identities.

## Five-project portfolio architecture

Small lesson artifacts are checkpoints inside these projects; they are not presented as dozens of unrelated portfolio projects.

### Project 1 — Vegetation Data Explorer

Module 1 grows one notebook into a documented ecological analysis. The final package must contain a README, data citation, reproducible notebook, QA record, figure, interpretation, limitations and clean-run instructions.

### Project 2 — Geospatial Evidence and Vector QA Package

Module 2 Chapters 1–2 combine the spatial inventory, CRS decision, support decision, vector audit, topology log and QGIS map into one professional handover review.

### Project 3 — Analysis-Ready Raster Stack

Module 2 Chapter 3 combines the raster inventory, transformations, alignment validator, field extraction and terrain QA into a single verified raster product and report.

### Project 4 — UAV Survey Assessment and Multispectral Pipeline

Module 2 Chapter 4 combines mission, radiometric, georeferencing, photogrammetry, surface and multispectral evidence into a defensible accept/review/stop decision package.

### Project 5 — UAV and Satellite Analysis Pipeline

Module 2 Chapters 11–12 connect segmentation and geospatial model assurance to API acquisition, command-line processing, container reproducibility and CI. The Module 2 capstone integrates field, vector, raster, UAV and satellite evidence into one geographically validated, accessible and reproducible release. It remains bounded to the represented datasets, sensors, seasons and decision use.

### Future project — Environmental EO Case Study

Modules 3–6 deepen predictive modelling, satellite time series, production systems and independent professional research into advanced case studies. Only the implemented Module 3 Chapters 1–3 may currently be presented as available.

Module 2 Chapter 8 contributes **Artifact 2.H — Cloud-Native EO Discovery and Cube Package** to this future case study. It proves deterministic STAC discovery, labelled-array and cube contracts, bounded Dask execution, and COG/Zarr publication decisions on synthetic training evidence. It does not yet prove a multi-year real-data monitoring result.

Module 2 Chapter 9 contributes **Artifact 2.I — Accessible Web GIS Evidence Delivery**. It proves representation selection, public-schema governance, an accessible map/table pair and standards-based client acceptance on generalized synthetic evidence. It does not represent a live production monitoring service.

Module 2 Chapter 10 contributes **Artifact 2.J — Portable Professional GIS Architecture**. It proves role-based ArcGIS/open ecosystem selection, scientific invariant testing, authority and sharing controls, operating ownership and a bounded migration drill. It does not verify a live licence, organisation or production deployment.

## Required project package

Each major project must include:

- `README.md` with purpose, question, data, structure and reproduction instructions;
- pinned or otherwise reproducible environment specification;
- immutable `data/raw/` and traceable `data/processed/` separation;
- code/notebooks with relative paths and meaningful names;
- method and decision log;
- QA/QC evidence and validation results;
- maps and figures with accessible explanatory text;
- results, interpretation and limitations;
- source, licence, version and provenance record.

## Graduate-profile evidence matrix

Status describes the current implemented release before the lesson-by-lesson integrity pass.

| Competency evidence | GIS / Remote Sensing Engineer | Geospatial Data Analyst | Remote Sensing Researcher | Current evidence | Gap / required strengthening |
|---|---|---|---|---|---|
| Reproducible Python/notebook workflow | Required | Required | Required | Module 1 notebook | Add README and environment evidence |
| Data intake, schema and quality audit | Required | Required | Required | Module 1 + all Module 2 practica | Consolidate decision records |
| CRS, geometry, topology and vector workflows | Required | Required | Useful | Module 2 Chapters 1–2 | Final lesson QA only |
| Raster grid, masking, alignment and resampling | Required | Required | Required | Module 2 Chapter 3 | Final lesson QA only |
| QGIS visual QA and professional map | Required | Required | Useful | Lesson 2.10 and practica | Strengthen cartographic communication |
| UAV mission/product/photogrammetry understanding | Required | Useful | Required for UAV research | Module 2 Chapter 4 | Add later model connection |
| Independent georeferencing and accuracy evidence | Required | Required | Required | Lesson 2.21 and practicum | Final lesson QA only |
| Satellite optical and SAR processing | Required | Required | Required | Module 2 Chapter 5 | Add multidimensional time-series processing in Module 3 |
| Time series and multidimensional data | Useful | Required | Required | Module 2 Chapter 8 labelled arrays, EO cubes, lazy computation and discovery package | Extend to multi-year real EO analysis in Module 4 |
| Sampling and spatial autocorrelation | Useful | Required | Required | Module 2 Chapter 6; Module 3 Chapters 1 and 3 preserve and apply groups, blocks, dates, spatial folds and transfer claims | Chapter 4 must keep optimisation inside this structured evidence architecture |
| Spatial databases and scalable delivery | Required | Useful | Useful | Module 2 Chapters 7–10 relational governance, bounded computation, cloud-native formats, accessible delivery and professional ecosystem translation | Automated production depth remains for Modules 3/5/6 |
| ArcGIS/open ecosystem translation | Required | Useful | Useful | Lesson 2.46 and Chapter 10 practicum role matrix, equivalence gate, sharing review and migration drill | Verify organisation-specific capabilities only in authorised environments |
| Reproducible environments, CLI, tests and CI | Required | Useful | Required | Module 2 Chapter 12 practicum and capstone release | Deepen with larger production operations later |
| Correct ML problem framing and metrics | Useful | Required | Required | Module 2 Chapter 11 semantic-segmentation design and baseline; Module 3 Chapters 1–2 prediction, target, baseline, error-skill and first-candidate evidence | Module 3 Chapter 5 will complete regression and classification diagnostic evaluation |
| Spatial CV, leakage and extrapolation control | Required for modelling pipelines | Required | Required | Module 2 Chapters 6 and 11 plus capstone; Module 3 Chapters 1 and 3 implement predictor/test firewalls, grouped and spatial folds, temporal direction, nested CV and leakage audits | Module 3 Chapter 5 will add full applicability and structured-failure diagnostics |
| Prediction, validation and uncertainty maps | Useful | Required | Required | Chapter 11 error/domain maps and capstone validation package | Extend to later continuous predictive modelling |
| Hypothesis, sampling, limitations and methods defence | Useful | Useful | Required | Question/limitations strong; hypothesis/sampling weak | Modules 3–6 |
| Employer/supervisor-ready case study | Required | Required | Required | Module 2 capstone with explicit three-profile evidence | Later independent case study remains planned |

## Graduation tests

### GIS / Remote Sensing Engineer

The graduate must be able to build and validate repeatable spatial data pipelines, explain format/CRS/grid decisions, automate checks, preserve provenance and deliver interoperable outputs. Technology names alone are insufficient.

### Geospatial Data Analyst

The graduate must be able to turn tabular, vector, raster and EO observations into defensible summaries and models, test support and sampling assumptions, visualise patterns and explain uncertainty.

### Remote Sensing Researcher

The graduate must be able to formulate a researchable question and hypothesis, justify data and sampling, trace sensor measurements through processing, validate against independent evidence, avoid unsupported causal claims and communicate reproducible methods and limitations.

## Integration rule

The website may advertise a competency as available only when the matrix identifies lessons containing theory, guided practice, independent application, failure-mode reasoning and portfolio evidence. Planned capabilities must be labelled clearly as planned.
