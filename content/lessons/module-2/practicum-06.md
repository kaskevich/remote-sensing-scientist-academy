---
title: Design and Defend a Spatial Inference Plan
lessonId: module-2-chapter-6-practicum
---

## Chapter 6 practicum — Design and Defend a Spatial Inference Plan

### Learning outcome

By the end of this practicum, you will be able to audit a spatial sampling design, define and compare neighbour hypotheses, quantify spatial dependence, validate interpolation and regression across separated geography, map uncertainty and unsupported domains, and issue a professional release decision whose statistical claims remain conditional on spatial support and design.

- **Estimated time:** 420–540 minutes
- **Prerequisites:** Lessons 2.31–2.34
- **Portfolio output:** **Artifact 2.F — Spatial Inference and Validation Package**
- **Training status:** every supplied coordinate, value and identifier is synthetic and released for instruction under CC0-1.0

### Why this practicum matters

Spatial statistics can make an analysis appear sophisticated while concealing the most important decisions. A Moran statistic is incomplete without weights. A sample count is incomplete without a frame and inclusion mechanism. A kriging surface is incomplete without variogram evidence and spatial holdouts. A spatial-regression coefficient is incomplete without a process hypothesis and geographic validation.

In professional work, these components must form one claim–evidence system. The objective is not to use every method. It is to decide which evidence can support which inference, demonstrate sensitivity and refuse outputs whose confidence exceeds the sampling design.

### Scientific brief

The Baltic coastal meadow research group asks:

> Can the current synthetic plot evidence support a spatially continuous description of vegetation condition inside the core meadow frame, and what supplementary sampling is required before stronger ecological inference?

The team needs a planning product, not a publication-ready biomass map. You must evaluate accepted probability observations, roadside convenience records, inaccessible frame cells and the isolated targeted plot separately. You may release a restricted exploratory surface, or decide not to release one. Both outcomes are valid when supported by transparent evidence.

## 1. Required training assets

Use `spatial-statistics/README.md` first. Keep the supplied files unchanged:

- `meadow_plot_observations.csv`;
- `sampling_frame.csv`;
- `spatial_validation_blocks.csv`;
- `SPATIAL_INFERENCE_QA_TEMPLATE.md`;
- `manifest.json`.

Create a project structure:

```text
spatial_inference_package/
├── README.md
├── environment.txt
├── inputs/
├── notebooks/
├── outputs/
│   ├── tables/
│   └── figures/
└── SPATIAL_INFERENCE_DECISION.md
```

Record software versions, random seeds and file checksums. Do not assign a real EPSG code to the synthetic local metric coordinates. The absence of a geographic CRS is intentional and prevents the instructional locations from being mistaken for field sites.

## 2. Gate A — define the inference target

Write the following before running a statistic:

- population or spatial domain;
- observation unit and physical support;
- time represented by each variable;
- response or target variable and units;
- estimand or prediction use;
- accepted, review and blocked evidence;
- strongest causal claim prohibited by the design.

Use one primary target:

> Describe and predict synthetic accepted plot-level NDVI inside the accessible core sampling frame for survey planning.

This statement does not promise true 10 m vegetation condition, regional transfer or causal biomass explanation. The output grid represents prediction locations, while the evidence support remains plot level.

[[CHECK:m2-p6-target]]

## 3. Gate B — audit frame, selection and realised observations

Create `spatial_sampling_audit.csv` with one row per frame or observed unit and these fields where applicable:

- stable identifier;
- source table;
- x and y coordinate;
- habitat and management strata;
- frame eligibility;
- accessibility and restriction reason;
- selected status and route;
- inclusion probability evidence;
- response/QA status;
- primary-analysis status;
- decision reason.

Report:

1. counts by habitat for the complete frame, accessible frame and accepted probability observations;
2. missing inclusion probability by sampling route;
3. nearest-neighbour distance by route;
4. spatial distribution of inaccessible cells;
5. the consequence of mixing roadside and probability observations;
6. whether P024 belongs to the core inference domain.

Propose six supplementary sample locations using a stratified random or spatially balanced design. Preserve the full frame, seed and non-selected rows. Define a replacement rule before simulating one inaccessible selection.

## 4. Gate C — make spatial weights inspectable

Build at least three scientifically plausible neighbour definitions for accepted core plots:

- four nearest neighbours;
- six nearest neighbours;
- a 170 m distance band.

For each definition, save:

- rationale;
- transformation;
- minimum, median and maximum neighbours;
- minimum, median and maximum link distance;
- symmetry status;
- island identifiers;
- edge observations;
- map filename.

Create `weights_sensitivity.csv`. Do not remove a definition because its result is weak or inconvenient. If P024 is included in a secondary analysis, record whether the distance rule exposes it as an island and how far k-nearest neighbours force it to connect.

## 5. Gate D — quantify spatial dependence cautiously

For accepted core NDVI and elevation:

1. standardise or transform only with a documented reason;
2. calculate global Moran's I under all three weights definitions;
3. use at least 999 permutations and a fixed seed;
4. retain observed I, expected I, permutation mean, permutation probability and z-score when available;
5. map the values beside the selected graph;
6. repeat with roadside review observations as a labelled sensitivity analysis;
7. write one possible environmental explanation and two alternatives;
8. state explicitly that autocorrelation does not establish cause.

The primary report should focus on global structure. Optional local statistics may appear only in an appendix that documents multiple-testing control, weights and exploratory status.

[[CHECK:m2-p6-weights]]

## 6. Gate E — validate interpolation as a prediction task

Build an empirical variogram table for accepted core NDVI. Report distance-bin edges, midpoint, pair count and mean semivariance. Examine whether a broad coordinate trend, anisotropy or sparse long-distance pairs weaken a stationary interpretation.

Compare:

- inverse-distance weighting with a declared power and neighbour rule;
- ordinary kriging with a documented variogram model and parameters.

Use the same separated spatial blocks for both methods. Save `interpolation_validation.csv` with:

- plot ID and holdout block;
- observed value;
- method and full parameter label;
- prediction;
- residual;
- absolute and squared error;
- distance to nearest training observation;
- prediction variance when defined;
- inside/outside core support;
- QA note.

Report mean error, MAE and RMSE overall and by block. Map residuals with one common scale. If a method has a lower aggregate RMSE but systematic failure in one block, do not call it universally superior.

Create a prediction grid only inside a declared core domain. Map model-based uncertainty separately and add a support/extrapolation mask. The isolated plot must not cause the map to bridge an unobserved gap without warning.

## 7. Gate F — diagnose regression residuals

Fit a transparent baseline for synthetic biomass using accepted core NDVI and elevation. Document:

- response and predictors;
- units and support;
- ordinary diagnostics;
- coefficient interpretation as association;
- four-nearest residual Moran's I plus weights sensitivity;
- spatial-block validation performance;
- influential or edge observations.

Select only one spatial alternative for detailed comparison. It may be an SLX, spatial-error, spatial-lag or cautiously exploratory geographically weighted formulation. The decision must follow a process hypothesis, not whichever method removes residual Moran's I most strongly.

Save `residual_diagnostics.csv` and `model_comparison.csv`. If the selected library cannot generate valid out-of-sample predictions for the required geography, record that limitation and do not replace it with in-sample information criteria.

[[CHECK:m2-p6-release]]

## 8. Build the decision matrix

Create one matrix connecting every claim to its evidence:

| Claim area | Required evidence | Accepted result | Main sensitivity | Unsupported claim | Decision |
| --- | --- | --- | --- | --- | --- |
| Sampling representation | frame, inclusion mechanism, realised response |  |  |  |  |
| Spatial dependence | variable, weights, permutations, map |  |  |  |  |
| Interpolation | continuity model, spatial holdout, support mask |  |  |  |  |
| Regression | baseline, residual geography, alternative, validation |  |  |  |  |
| Ecological interpretation | measurement meaning and independent evidence |  |  |  |  |

Use the statuses:

- **accept:** evidence supports the declared limited use;
- **review:** evidence is informative but a named uncertainty or sensitivity remains;
- **block:** the proposed use exceeds the current design or validation.

## 9. Produce the spatial inference map

Create `spatial_inference_map.pdf` with at least four coordinated panels:

1. accepted, review, inaccessible and proposed sampling locations;
2. selected neighbour graph and NDVI values;
3. preferred exploratory prediction surface with observation locations;
4. validation residuals and uncertainty/support mask.

The map must state that the coordinates are a synthetic local metric grid. Include units, an equal aspect ratio, an accessible colour scheme, clear missing/blocked symbology and a text description in the report. Do not add a geographic basemap or real place name.

## 10. Write the release decision

Create `SPATIAL_INFERENCE_DECISION.md` with a maximum of 1,000 words:

1. **Question and intended use**
2. **Population, frame and realised sample**
3. **Spatial-dependence evidence**
4. **Interpolation and spatial-validation evidence**
5. **Regression diagnostic**
6. **Uncertainty and unsupported domain**
7. **Release status**
8. **Supplementary sampling priority**

Choose one final status:

- release for exploratory survey planning;
- release only inside a restricted domain with prominent uncertainty;
- do not release a continuous surface.

State one interpretation the evidence supports and three it does not. Include a next action with an owner or responsible role.

## 11. Professional Mistakes — Spatial Statistics and Geostatistics

Use this as a final review table. Every row needs an explicit status and action in your notebook or decision record.

| Professional mistake | Why it fails | Evidence that reveals it | Required recovery |
| --- | --- | --- | --- |
| Treating coordinates as spatially meaningful without units or CRS evidence | neighbour distance becomes ambiguous | metadata and coordinate audit | verify reference or retain documented local metric status |
| Selecting weights after searching for significance | inference becomes outcome-tuned | missing pre-analysis rationale | define plausible weights first and report sensitivity |
| Reporting Moran's I without W | the statistic cannot be interpreted | incomplete methods table | record neighbours, transformation and islands |
| Interpreting I against zero only | null expectation may differ | expected-I output | report expected value and permutation reference |
| Calling autocorrelation a cause | pattern does not identify mechanism | causal wording | separate description from competing explanations |
| Letting k-nearest neighbours hide an island | forced long links may be implausible | link-distance map | compare a distance rule and review the domain |
| Ignoring edge observations | neighbour structure differs near boundaries | neighbour-count summary | map and test edge sensitivity |
| Mixing accepted and review rows silently | QA and design conditions change | source-status reconciliation | retain statuses and run labelled sensitivity analysis |
| Calling roadside plots random | unknown inclusion mechanism is concealed | route and provenance audit | label convenience evidence and restrict inference |
| Deleting inaccessible frame units | target-frame gaps disappear | frame reconciliation | preserve restrictions and redefine domain honestly |
| Moving selected plots for convenience | selection probabilities become unclear | planned-versus-realised coordinates | use a predeclared replacement rule |
| Treating equal stratum sample counts as population proportions | unweighted estimates can be distorted | frame and sample shares | use design-aware estimates or stratum results |
| Interpolating an unsuitable variable | continuity assumption is unsupported | process review and variogram | refuse the surface or redesign the model |
| Choosing the smoothest interpolated map | appearance replaces validation | absent holdout results | compare identical spatial folds |
| Fitting a variogram before checking trend | non-stationary mean enters dependence model | value and residual maps | model trend or restrict domain first |
| Treating the nugget as sensor error only | microscale and support variation are ignored | replicate/support evidence | use cautious short-range-variance language |
| Ignoring variogram pair counts | sparse bins appear authoritative | lag table | report pair counts and sensitivity |
| Calling kriging variance observed error | it is conditional model uncertainty | holdout residuals | distinguish model variance from empirical error |
| Predicting across the P024 gap | output grid hides extrapolation | distance/support mask | restrict domain and flag unsupported cells |
| Validating with random neighbouring plots | local dependence leaks into test data | fold map and neighbour overlap | use separated blocks or sites |
| Selecting regression family from p-values | model lacks a process hypothesis | methods rationale | locate dependence in predictors, response or error conceptually |
| Interpreting spatial lag as an ordinary local coefficient | feedback creates indirect impacts | model definition | report appropriate direct/indirect impacts |
| Treating GWR maps as confirmed local mechanisms | local estimates may be unstable | bandwidth, collinearity and uncertainty | retain exploratory language and independent validation |
| Using in-sample R² as geographic validation | fit does not test transfer | absent block metrics | evaluate held-out geography |
| Eliminating residual autocorrelation at any cost | complexity may not improve science or prediction | cross-model comparison | balance diagnosis, transfer, stability and interpretation |
| Claiming NDVI causes biomass | observational association is not causal evidence | design and causal sketch | report association and required causal evidence |
| Publishing only the final surface | decisions and failures cannot be reconstructed | missing package files | deliver frame, weights, validation, uncertainty and decision record |

## 12. Required deliverables

Submit all nine files:

1. `README.md`
2. `spatial_sampling_audit.csv`
3. `weights_sensitivity.csv`
4. `interpolation_validation.csv`
5. `residual_diagnostics.csv`
6. `model_comparison.csv`
7. `spatial_inference_map.pdf`
8. `SPATIAL_INFERENCE_DECISION.md`
9. `spatial_statistics_practicum.ipynb`

The notebook must run from top to bottom using relative paths and immutable inputs. It must preserve random seeds, rejected rows, sensitivity definitions and package versions. Screenshots may support review but cannot replace executable tables and code.

## 13. Assessment rubric

| Dimension | Excellent evidence | Revision required |
| --- | --- | --- |
| Technical correctness | weights, statistics, variogram, interpolation, residuals and validation are calculated with compatible rows and documented units | methods run but neighbourhood, support, folds or units are ambiguous |
| Conceptual understanding | sampling, dependence, continuity and residual processes are separated and linked to defensible hypotheses | methods are presented as interchangeable software choices |
| Reproducibility | frame, inputs, checksums, seeds, parameters, software, outputs and exclusions are traceable | selected locations or model defaults cannot be recreated |
| Scientific communication | maps and decision record distinguish observations, predictions, uncertainty, extrapolation and unsupported causation | smooth surfaces or coefficients are presented as ecological truth |

Automatic revision is required if the submission:

- calls convenience locations random;
- omits the weights definition from an autocorrelation result;
- validates interpolation or regression only with random neighbouring rows;
- treats kriging variance as empirical accuracy;
- assigns a real CRS to the synthetic coordinates;
- reports causal NDVI–biomass language;
- hides inaccessible cells, review rows, islands or extrapolation.

## 14. Reflection and portfolio handover

### Reflection

- Which single decision changed your conclusion most: domain, sampling set, weights, variogram or validation geography?
- What new field location would reduce the most important uncertainty?
- Which output is safe for survey planning but unsafe for ecological reporting?
- How will this chapter change the validation design of the final UAV and Satellite Analysis Pipeline?

### Submission

Upload the nine required files, one screenshot of the rerun notebook, one screenshot of the map at readable scale and a 150-word handover note addressed to the scientist responsible for the next field campaign. The note must identify the release status, blocked interpretation, priority sample and file that contains full decision evidence.

### Portfolio artifact

Add **Artifact 2.F — Spatial Inference and Validation Package** to the UAV and Satellite Analysis Pipeline. It should demonstrate that you can turn spatial observations into a restricted, validated inference without allowing maps, p-values or advanced model names to outrun the sampling design.
