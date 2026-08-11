---
title: Build a Defensible Satellite Evidence Package
lessonId: module-2-chapter-5-practicum
---

## Chapter 5 practicum — Build a Defensible Satellite Evidence Package

### Learning outcome

By the end of this practicum, you will be able to audit optical, SAR, imaging-spectroscopy and LiDAR-style evidence as separate measurement systems; build valid sensor-specific derivatives; reconcile different spatial and temporal supports; document agreement and disagreement; and deliver a professional evidence package whose claims remain traceable to quality-controlled observations.

- **Estimated time:** 420–540 minutes
- **Prerequisites:** Lessons 2.26–2.30
- **Portfolio output:** **Artifact 2.E — Satellite EO Evidence Package**
- **Training status:** every supplied value and identifier is synthetic and released for instruction under CC0-1.0

### Why this practicum matters

Professional Earth Observation rarely ends with one sensor and one index. An analyst may receive optical surface reflectance, radar backscatter, dense spectra and elevation products for the same environmental question. The challenge is not to place every column into one table. It is to know what each measurement means, whether it passes its own contract, how its support differs and which interpretation is strengthened—or contradicted—when evidence is combined.

Cross-sensor work can create false confidence. Two variables may agree because they share season, spatial gradient or preprocessing artifact. Two measurements may disagree because they respond to different physical properties rather than because one is wrong. Resampling to one grid can conceal native support. A professional package exposes those relationships.

### Scientific brief

The Baltic coastal meadow research group asks:

> Which synthetic meadow supports show converging evidence of stronger vegetation spectral response and structure, and which observations remain unsuitable for ecological interpretation?

You are not being asked to estimate real biomass or classify real habitat. The pack has deliberately simplified tables and deliberate QA failures. Your job is to produce a reproducible decision system that would scale to authoritative mission products.

## 1. Required training assets

Read `satellite-eo/README.md` and `manifest.json` before opening the CSV files. Verify every SHA-256 checksum. Keep the original pack unchanged.

Your project should contain:

```text
satellite_eo_practicum/
├── inputs/
│   └── satellite-eo/                  # immutable supplied pack
├── notebooks/
│   └── satellite_eo_practicum.ipynb
├── outputs/
│   ├── satellite_observation_inventory.csv
│   ├── optical_qa_report.csv
│   ├── spectral_index_report.csv
│   ├── sar_comparability_report.csv
│   ├── hyperspectral_feature_report.csv
│   ├── lidar_structure_report.csv
│   └── satellite_evidence_map.pdf
└── SATELLITE_EO_EVIDENCE_REPORT.md
```

Do not rename source columns without recording the mapping. Do not remove failed rows from the audit trail. An observation can be blocked from analysis and still remain essential evidence in the delivery.

## 2. Gate A — provenance and inventory

Build `satellite_observation_inventory.csv`. It must have one record per supplied asset and include:

- filename and SHA-256 checksum;
- data type and row count;
- source status and licence;
- sensor or measurement family;
- represented quantity and units;
- spatial-support description;
- temporal-support description;
- product or processing level where relevant;
- supplied quality fields;
- deliberate condition;
- intended practicum use;
- initial accept, review or reject status;
- reason, consequence, owner and next action.

Separate **observed metadata** from **your assumptions**. “The values look plausible” is not metadata. If wavelength unit, vertical reference or scaling is supplied as synthetic or unresolved, preserve that status.

Before proceeding, answer:

1. Which assets represent observation-level rows, spectral bands or points?
2. Which quantities are surface reflectance, decibels, coordinates, elevation or dimensionless derivatives?
3. Which files can be joined by `plot_id`, and why does a shared identifier not prove identical support?
4. Which conditions are blocking rather than merely cautionary?

## 3. Gate B — optical product and observation QA

Use `optical_observation_inventory.csv` and `optical_reflectance_samples.csv` to create `optical_qa_report.csv`.

### Required checks

1. Confirm unique asset IDs and parse acquisition times.
2. Separate surface-reflectance products from Level-1/top-of-atmosphere inputs.
3. Require documented scale factor and offset. Do not infer missing Sentinel-2 metadata from familiar values.
4. Record native Red, NIR and Red Edge support separately.
5. Apply a scene-level cloud gate as search evidence, not as the final pixel mask.
6. Create a plot-row valid mask from cloud, shadow, finite reflectance and valid-support fraction.
7. Preserve the haze row as `review` unless your declared rule and evidence justify another status.
8. Record the exact consequence for every failed condition.

Your optical report must distinguish:

- an asset-level product decision;
- a plot-observation-level validity decision;
- a claim the accepted reflectance can support;
- a stronger ecological claim that remains untested.

Do not calculate indices from the missing-scale asset or from cloudy/shadowed rows.

## 4. Gate C — spectral-index evidence

Create `spectral_index_report.csv` from accepted reflectance rows. It must include NDVI, GNDVI, SAVI with `L = 0.5` and MSAVI.

### Numerical contract

- use floating-point reflectance;
- require a joint valid mask;
- use an explicit denominator epsilon;
- test the MSAVI radicand before square root;
- preserve `NaN` and an exclusion reason;
- retain input reflectance beside each output;
- store formula version and parameters;
- verify finite accepted results and investigate values outside expected mathematical ranges.

Create one figure comparing two indices. Use stable plot labels and visually distinguish `accept`, `review` and invalid support. The caption must state that the indices are correlated transformations of shared bands, not independent confirmation.

Write a maximum 180-word interpretation that answers:

- Where do indices rank accepted plots similarly?
- Where do they diverge, and which formula/input explains it?
- Which soil, atmosphere, season or canopy mechanisms remain plausible?
- What field measurement and sampling support would validate the ecological relationship?

## 5. Gate D — SAR comparability

Create `sar_comparability_report.csv` from `sentinel1_backscatter_samples.csv`.

### Required checks

1. Verify acquisition time, mode context, VV/VH fields and finite incidence angle.
2. Select a primary comparison track with ascending orbit, relative orbit 131 and your documented angle interval.
3. Require complete radiometric terrain correction.
4. Preserve the descending record as valid but not directly comparable in the primary track.
5. Preserve the failed-RTC record as rejected for the current use.
6. Convert VV and VH from dB to linear power and test a numerical round trip.
7. Calculate VH/VV in linear power and the equivalent decibel difference.
8. Aggregate power only in the linear domain when reporting a power mean.
9. Record count, spread, valid support, orbit and representation with every summary.

Do not use optical language such as “cloud-free radar pixel”. Do not interpret greater backscatter as greater biomass. Produce three competing explanations for the constructed wetter-scenario difference and name evidence that could discriminate them.

[[CHECK:m2-p5-convergence]]

## 6. Gate E — imaging-spectroscopy feature

Create `hyperspectral_feature_report.csv` from `hyperspectral_signatures.csv`.

### Required checks

1. Confirm strictly increasing wavelength coordinate, nanometre unit and positive bandwidth.
2. Build separate `finite`, `supplied_bad_band` and `snr_pass` fields.
3. Define a transparent exercise SNR threshold and state that it is not universal.
4. Retain rejected bands in the output inventory.
5. Plot spectra with bad bands marked and do not draw an apparently continuous reliable curve across rejected atmospheric gaps.
6. Calculate a red-edge slope between two accepted wavelengths.
7. Propose a water-related feature but block it if its defining absorption region fails quality.
8. Record how sensor response and mixed pixels would affect transfer to real imagery.
9. Write a model-development note placing target-informed feature selection inside training resampling.

The report must separate a visible spectral pattern from a validated plant-trait relationship. No predictive performance may be invented for the synthetic spectra.

## 7. Gate F — LiDAR structural evidence

Create `lidar_structure_report.csv` from `lidar_point_samples.csv`.

### Required checks

1. Verify unique point IDs and valid return-number relationships.
2. Count classes and points per plot.
3. Record horizontal metric coordinates and unresolved synthetic local vertical reference.
4. Preserve the unclassified 12.4 m outlier and exclude it from the vegetation surface under an explicit rule.
5. Estimate plot DTM from accepted ground points and upper vegetation surface from a documented percentile.
6. Calculate the difference only where both estimates exist.
7. Store counts and class coverage beside height.
8. Flag negative or implausible differences; do not silently clamp them.
9. Draft a raster grid contract for a future DSM, DTM and height product.
10. State whether each plot has enough points for interpretation. For this tiny training table, caution is expected.

The point table demonstrates logic, not a full point-cloud survey. Do not report formal density without an area or describe the plot summaries as accurate canopy height.

## 8. Gate G — reconcile support before synthesis

The evidence types do not observe identical supports:

- Sentinel-2 Red/NIR and Red Edge have different native pixel sizes;
- Landsat has coarser optical support;
- SAR support and effective resolution depend on processing and aggregation;
- spectra may represent a pixel, footprint or sample depending on the real product;
- LiDAR points and footprints sample three-dimensional returns discretely.

A shared `plot_id` enables a relational join. It does not erase support differences. Create a support table with one row per evidence type and these fields:

- native or observation support;
- delivered grid or aggregation support;
- positional uncertainty status;
- valid coverage requirement;
- acquisition time;
- ecological reference support;
- comparison decision;
- remaining risk.

Choose one synthesis approach:

1. aggregate valid evidence to a common plot support and report valid fractions; or
2. retain separate supports and compare only qualitative/standardised plot evidence.

Do not upsample every layer to the finest grid and call the result higher-resolution evidence.

[[CHECK:m2-p5-support]]

## 9. Build the evidence matrix

For each accepted or review plot, create a matrix with:

| Evidence family | Observation | Derived evidence | Interpretation supported | Alternative explanation | QA status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Optical | valid Red, Green, NIR reflectance | spectral contrast | stronger/weaker accepted optical response | soil, haze, shadow, phenology |  |  |
| Index | NDVI/GNDVI/SAVI/MSAVI | formula comparison | consistency of selected contrasts | saturation and shared-band correlation |  |  |
| SAR | geometry-controlled VV/VH | linear ratio or dB difference | changed microwave backscatter | moisture, roughness, structure, angle |  |  |
| Spectroscopy | accepted wavelength regions | red-edge slope | resolvable synthetic spectral shape | SNR, response, mixture |  |  |
| LiDAR | accepted ground/vegetation points | structural difference | relative structural evidence | classes, gaps, vertical reference |  |  |

Use three synthesis labels:

- **convergent evidence:** different measurement systems support a compatible hypothesis under their QA contracts;
- **divergent evidence:** observations differ in a scientifically meaningful way that requires explanation;
- **insufficient evidence:** support or quality does not permit comparison.

Do not use “confirmed” unless independent reference evidence establishes the claim. Convergence is stronger than one sensor alone, but sensors can share seasonal gradients, spatial bias or co-registration errors.

## 10. Produce the evidence map

Create `satellite_evidence_map.pdf`. The supplied pack does not contain real polygons, so the map may be a clearly labelled **synthetic evidence-location diagram** using the point-table coordinates, not a geographic map of real meadows.

The PDF must include:

- title stating synthetic instructional evidence;
- stable plot IDs;
- accepted/review/insufficient evidence status;
- one restrained visual encoding of cross-sensor synthesis;
- scale information appropriate to the synthetic local coordinates;
- data-source and licence note;
- explanation that coordinates are not real locations;
- creation date and notebook reference;
- concise caption with limitations.

Do not use a satellite basemap that would imply the synthetic coordinates locate real observations. A simple coordinate plot is scientifically clearer.

## 11. Write the professional decision report

`SATELLITE_EO_EVIDENCE_REPORT.md` must contain:

1. **Decision summary** — 200 words maximum
2. **Scientific question and intended use**
3. **Data provenance and synthetic status**
4. **Observation and support contracts**
5. **Optical product and mask decisions**
6. **Index formulas, parameters and limits**
7. **SAR geometry, representation and comparability**
8. **Spectral quality and feature decision**
9. **Point-cloud classes, surfaces and vertical-reference status**
10. **Cross-sensor convergence, divergence and missing evidence**
11. **Claims supported and claims blocked**
12. **Required field validation and next actions**
13. **Reproducibility record** — versions, files, checksums and output creation

Every important conclusion should follow this structure:

**evidence → interpretation → limitation → consequence → next action**

Example:

> The accepted synthetic optical rows show stronger NIR–Red contrast for SAL01 than SAL03 under the supplied masks. This is consistent with a difference in vegetation spectral response, but soil background, canopy structure and the absence of field calibration prevent a biomass claim. The index can enter a future predictor table with provenance; biomass interpretation remains blocked until compatible field measurements are validated.

## 12. Reproducibility and release tests

Before delivery:

- restart the notebook kernel and run all cells in order;
- confirm the run starts only from supplied immutable inputs;
- assert required columns and unique identifiers;
- assert no accepted output contains an undocumented unit;
- verify all output filenames and reopen CSV files;
- verify the PDF opens and contains its synthetic-data statement;
- calculate output checksums;
- record Python and library versions;
- ensure no absolute personal file path remains in code;
- ensure every rejected observation remains traceable;
- compare output row counts against inputs and explain changes;
- keep warnings visible or resolve them explicitly.

An empty result after a strict gate is not a software failure. It may be the correct scientific outcome. Report what evidence would allow the analysis to continue.

[[CHECK:m2-p5-release]]

## 13. Professional Mistakes — Satellite Earth Observation

Review all twenty mistakes before release.

| Mistake | Why it fails | Required correction |
| --- | --- | --- |
| A thumbnail is treated as quantitative reflectance | display stretch has no measurement contract | return to calibrated bands and metadata |
| Raw DNs are compared across products | stored codes have mission/product scaling | apply documented scale and offset |
| Level-1 and surface reflectance are mixed | quantities represent different processing levels | harmonise valid product meaning first |
| Resampling is called new resolution | interpolation does not add sensor information | preserve native and destination support |
| Scene cloud percentage replaces a pixel mask | local study support may remain contaminated | inspect and report pixel-level QA |
| Cloud or shadow is replaced with zero | zero becomes a false measurement | preserve invalid support as missing |
| NDVI is called biomass | index is a spectral proxy | validate against compatible field data |
| A new index is assumed to cure saturation | formula change is not validation | compare response under independent evidence |
| Decibels are averaged as linear power | log-domain arithmetic changes the quantity | aggregate in the correct domain |
| Ascending and descending SAR are mixed silently | viewing geometry changes response | separate or model geometry explicitly |
| Speckle is smoothed for appearance | filtering changes support and boundaries | justify and evaluate the operation |
| SAR brightness is assigned one cause | moisture, roughness, structure and angle interact | retain competing explanations |
| Every hyperspectral band enters the model | correlated/noisy dimensions overfit small samples | screen and validate feature design |
| Bad bands disappear without an inventory | the feature cannot be reproduced | record flag, reason and effect |
| Wavelength units are guessed | nanometres and micrometres differ by 1000 | read and assert metadata |
| Feature selection sees test outcomes | evaluation becomes optimistic | select inside training resampling |
| Last returns are assumed to be ground | return order is not a class | use and validate classification |
| Point density is reported as accuracy | sampling amount and georeferencing error differ | report each quantity separately |
| Any DSM is subtracted from any DTM | grid or vertical incompatibility becomes false height | enforce full alignment/reference contract |
| Negative height is silently clipped | diagnostic evidence is hidden | investigate, preserve and document masking |

Any unresolved mistake that affects the intended claim requires revision or a blocked claim in the report.

## 14. Assessment standard

### Technical correctness

The submission must calculate only from accepted inputs, apply scale and masks correctly, keep SAR domains and geometries consistent, screen spectral bands, derive class-aware structural metrics and reopen outputs successfully.

### Conceptual understanding

The submission must explain how optical reflectance, spectral indices, radar backscatter, imaging spectroscopy and LiDAR structure represent different physical evidence. It must preserve native support and avoid direct ecological labels without validation.

### Reproducibility

The submission must preserve immutable inputs, checksums, complete code, versions, explicit gates, reason fields and all accepted/review/rejected records.

### Scientific communication

The report and map must distinguish observations from derivatives and interpretations. Agreement, disagreement, uncertainty, blocked claims and next actions must be concise and actionable.

## 15. Submission and portfolio artifact

### Submission

Submit these nine deliverables:

1. `satellite_observation_inventory.csv`
2. `optical_qa_report.csv`
3. `spectral_index_report.csv`
4. `sar_comparability_report.csv`
5. `hyperspectral_feature_report.csv`
6. `lidar_structure_report.csv`
7. `satellite_evidence_map.pdf`
8. `SATELLITE_EO_EVIDENCE_REPORT.md`
9. `satellite_eo_practicum.ipynb`

Also upload one screenshot of the complete sensor-specific QA matrix and one screenshot showing a blocked observation retained with its reason.

### Portfolio artifact

Add **Artifact 2.E — Satellite EO Evidence Package** to the UAV and Satellite Analysis Pipeline. The artifact is successful when another analyst can trace every statement to a qualified observation, reproduce every derivative and see exactly where the current evidence stops.
