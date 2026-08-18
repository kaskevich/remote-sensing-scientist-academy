# Practicum 11 — Audit a Meadow Segmentation Product

## 1. Professional brief

### Learning outcome

By the end of this practicum, you will be able to turn synthetic UAV imagery, reference labels and model outputs into a complete geospatial image-analysis assurance package; prove spatial independence; compare a threshold baseline with a semantic-segmentation candidate; evaluate pixels, boundaries, objects, regions and calibration; identify domain shift; and issue a release decision tied to one environmental use.

- **Practicum type:** Image-analysis and model-assurance review
- **Estimated time:** 480–600 minutes
- **Prerequisites:** Lessons 2.47–2.49 and the Chapter 4 UAV QA artifact
- **Portfolio output:** **Artifact 2.K — Geospatial Image Analysis Audit**

### Why this matters

A model handover often contains a checkpoint, a probability raster and one aggregate metric. None proves that evaluation geography was independent, that labels represent the target consistently, or that the output is usable at the minimum mapping unit. This practicum asks you to accept responsibility for the evidence—not to maximise a score.

### Scientific context

The Baltic coastal-meadow group has received a synthetic candidate reed-encroachment product for field-review prioritisation. The pack contains image-tile metadata, patch footprints, label provenance, baseline and model summaries, regional results and several deliberate defects. It contains no real protected locations or operational model.

Your decision is one of:

- **accept** for the stated field-review use;
- **conditionally accept** with enforceable restrictions;
- **reject** until blocking evidence is repaired.

Do not convert the result into habitat certification, species presence or management-effect evidence.

[[CHECK:m2-p11-contract]]

## 2. Required deliverables

Create `portfolio/module-2/artifact-2-k/` with:

1. `README.md` — question, use, non-claims, environment and execution order;
2. `source_and_label_inventory.csv` — stable IDs, checksums, licences, CRS, grid, sensor, date and label status;
3. `spatial_partition_audit.geojson` — train, validation and test footprints with overlap/buffer results;
4. `segmentation_sensitivity.csv` — threshold, connectivity, size, pixel, object and boundary evidence;
5. `patch_and_class_audit.csv` — partition, valid fraction, target fraction and overlap flags;
6. `model_comparison.csv` — baseline and candidate results under identical partitions;
7. `regional_error_metrics.csv` — per-class, object and region results;
8. `calibration_and_thresholds.csv` — probability ranges and decision consequences;
9. `applicability_domain.md` — supported and unsupported sensor, season, resolution and geography;
10. `image_analysis_error_map.pdf` — accessible map of omission, commission, ambiguity and unsupported support;
11. `GEOSPATIAL_IMAGE_ANALYSIS_QA.md` — completed audit record;
12. `IMAGE_ANALYSIS_RELEASE_DECISION.md` — accept, conditional or reject;
13. `image_analysis_audit.ipynb` — compact reproducible calculations;
14. `release_inventory.csv` — path, role, checksum, access class and review state.

## 3. Phase A — freeze the scientific contract

### Step 1 — verify the pack

Verify every manifest checksum. Record that the imagery, labels, locations and results are synthetic. Preserve originals read-only. Reject any file whose byte identity does not match until its source is resolved.

### Step 2 — declare target and use

Write a target statement containing:

- the candidate physical feature;
- image date and measurement support;
- minimum mapping unit;
- field-review use;
- cost of omission and commission;
- prohibited claims;
- responsible reviewer.

Define how shadows, NoData, boundary ambiguity and mixed vegetation are represented. Do this before viewing final test metrics.

### Step 3 — define acceptance evidence

Predeclare primary and diagnostic measures. Include target recall, precision, intersection over union, object detection above the minimum mapping unit, split/merge counts, boundary tolerance, region-specific floors and calibration. State which failure blocks release.

## 4. Phase B — prove spatial independence

### Step 4 — map partitions

Join every patch to its source scene and footprint. Produce `spatial_partition_audit.geojson`. Test exact intersections and a justified separation buffer between training and test geography. A different filename is not evidence of independence.

### Step 5 — inspect temporal and acquisition duplication

Check whether different dates show nearly unchanged imagery of the same location, whether flight strips cross partitions, and whether preprocessing statistics were fitted on all scenes. Record each leakage route as pass, review or fail.

### Step 6 — reconcile patches and classes

For every partition, report patch count, valid-cell support, class prevalence, ambiguous labels and site coverage. Preserve the natural prevalence of the independent test sites. Training resampling must not be mistaken for deployment prevalence.

## 5. Phase C — audit segmentation geometry

### Step 7 — reproduce the baseline

Run the threshold baseline across the predeclared parameter grid. For each threshold, connectivity and minimum-area setting, calculate:

- positive area;
- object count and area distribution;
- edge-censored objects;
- pixel intersection over union;
- reference objects detected;
- splits, merges and false objects;
- boundary distance.

The final test sites are not used to select these values.

### Step 8 — inspect scale

Convert pixels to physical dimensions from the grid transform. Compare the receptive field and patch size with target objects. Flag any target below the reliable mapping unit. Resampling may change representation but does not create missing detail.

### Step 9 — compare object evidence

Create an accessible overlay that shows reference, prediction, omission and commission. Include a table for readers who cannot use the map. Give edge and ambiguous regions distinct statuses.

## 6. Phase D — audit model evidence

### Step 10 — compare on the same contract

Compare baseline and model using identical test geography, valid mask, labels, threshold-selection protocol and object rules. If a model result lacks one required condition, mark it not comparable instead of filling the gap.

### Step 11 — report regional and rare-class performance

Produce `regional_error_metrics.csv`. A minimum regional or class result governs its corresponding claim even when the pooled result is high.

[[CHECK:m2-p11-errors]]

### Step 12 — evaluate calibration

Group independent predictions by probability range and compare mean predicted probability with observed target frequency. Record sample support. Do not present sparse bins as precise evidence. Build a threshold-consequence table showing missed target objects and field-review burden.

### Step 13 — review annotations

Map ambiguous labels and interpreter disagreement. Repeat the boundary metric under the predeclared tolerance. Keep the primary strict result visible. Do not choose a tolerance after seeing which one makes the model pass.

## 7. Phase E — applicability and failure geography

### Step 14 — construct the domain record

For training, validation, test and intended deployment, compare:

- sensor and product level;
- bands and order;
- radiometric scaling;
- ground sampling distance;
- season and illumination;
- meadow and management context;
- valid-data and shadow prevalence.

Mark each deployment condition as represented, partially represented or unsupported.

### Step 15 — map errors

Produce `image_analysis_error_map.pdf` with stable site IDs, not sensitive coordinates. Show false negatives, false positives, reference ambiguity, edge censoring and unsupported imagery. Include title, legend, scale, north indication where useful, source status, intended use, date and limitations.

[[CHECK:m2-p11-release]]

### Step 16 — write monitoring triggers

Define automatic review triggers such as new sensor, resolution outside range, new season, elevated invalid fraction, probability-distribution shift or deteriorating field-review yield. Give every trigger an owner and response.

## 8. Phase F — release decision

Write `IMAGE_ANALYSIS_RELEASE_DECISION.md` in 500–800 words:

1. decision and intended use;
2. evidence that passed;
3. evidence that failed or remains conditional;
4. geographic, sensor, season and scale boundary;
5. threshold and error consequence;
6. prohibited claims;
7. monitoring and review date;
8. owner and measurable closure condition.

Do not describe a high probability as ecological certainty. Do not turn field-review prioritisation into absence evidence.

## 9. Professional Mistakes — Advanced Image Analysis

| Mistake | Why it happens | Evidence of harm | Recovery |
| --- | --- | --- | --- |
| Split overlapping patches randomly | convenient library default | near-duplicate pixels cross partitions | partition scenes or buffered blocks first |
| Tune on test sites | desire for best metric | threshold follows final outcomes | freeze on validation geography |
| Treat NoData as background | one mask is simpler | invalid support inflates accuracy | preserve a separate validity mask |
| Report only overall accuracy | familiar summary | rare target failure disappears | report class, object and region evidence |
| Ignore reference uncertainty | labels appear authoritative | boundary disagreement becomes model error | audit protocol and ambiguity |
| Remove small objects visually | cleaner map | rare habitat candidates vanish | declare physical minimum mapping unit |
| Use pixel metrics only | easy calculation | splits and merges remain hidden | add object and boundary metrics |
| Accept diagonal connectivity silently | software default | separate patches merge | justify neighbourhood rule |
| Call score confidence | intuitive language | users over-trust unsupported areas | test calibration and domain |
| Resize new imagery and call it compatible | shapes now match | resolution physics remain different | require transfer validation |
| Select architecture before baseline | novelty bias | complexity lacks evidence | compare with transparent method |
| Hide failed regions | pooled result looks stronger | deployment boundary is false | map and govern failure geography |
| Rasterise labels on a shifted grid | metadata overlooked | systematic boundary error | verify transform and pixel convention |
| Mix train and test preprocessing | efficient workflow | evaluation informs model inputs | fit transformations on training only |
| Publish precise locations | map convenience | sensitive ecology may be exposed | generalise or restrict delivery |

## 10. Scientific interpretation

The artifact should explain a conditional result. For example, it may support field-review prioritisation on represented summer UAV imagery while blocking absence claims and new-sensor deployment. It should make failure visible enough that another scientist can decide whether the product fits a different use.

## 11. Submission and portfolio

Submit the complete Artifact 2.K folder, one screenshot of the independent split map, the error map, the decision, notebook and release inventory. Use private notes for your own reasoning; use the learner submission for assessed evidence; use instructor feedback for revision; and use shared discussion only for non-sensitive methodological questions.

This artifact is a chapter checkpoint in the final UAV and Satellite Analysis Pipeline. It demonstrates that advanced image analysis is accepted through evidence, not because it uses deep learning.
