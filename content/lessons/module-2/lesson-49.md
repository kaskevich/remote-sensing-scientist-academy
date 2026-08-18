## 1. Geospatial Deep Learning QA

### Learning outcome

By the end of this lesson, you will be able to audit a mapped deep-learning result for spatial leakage, overlapping patches, class imbalance, annotation uncertainty, domain shift, resolution mismatch and false confidence; calculate and interpret class- and region-specific evidence; distinguish discrimination from calibration; map failure geography; and issue a bounded accept, conditionally accept or reject decision for a coastal-meadow use.

- **Lesson type:** Geospatial Model Assurance Review
- **Estimated time:** 210–270 minutes
- **Prerequisites:** Lessons 2.47–2.48, spatial validation, confusion matrices and raster QA
- **Portfolio output:** `deep_learning_qa_report.pdf`

### Why this matters

Image models can produce coherent maps even when their evaluation is compromised. Randomly split patches may share the same plants, illumination and flight artefacts. A common background class can dominate aggregate accuracy. A probability map can be sharply confident in a new sensor domain where predictions are unreliable. These failures are especially dangerous because the output looks spatially complete.

Quality assurance asks whether the evaluation supports the intended claim. It does not search for one impressive metric. It connects geography, classes, boundaries, labels, probabilities and operational domain to consequences and release conditions.

### Scientific context

The coastal-meadow team receives a candidate reed-encroachment model and prediction rasters for six synthetic sites. The developer reports strong random-patch accuracy. Managers want to use the map to prioritise field visits. Before release, you must determine whether the evaluation represents new sites, whether rare target patches are detected, whether probability values are calibrated and where the model should not be used.

The supplied predictions and labels are synthetic. Their deliberate defects make the assurance logic visible without claiming a real ecological model.

```text
claimed use
   ↓
deployment domain ── compare ── training and evaluation domain
   ↓                              ↓
geographic independence       label and class audit
   ↓                              ↓
regional/class/boundary metrics + calibration
   ↓
failure map + threshold consequence
   ↓
accept, conditionally accept or reject
```

### Concept — performance is conditional

A model result is conditional on at least:

- target and class definition;
- image measurement, scaling and resolution;
- place, season and acquisition conditions;
- label source and uncertainty;
- spatial partition and sampling prevalence;
- threshold and post-processing;
- intended decision and cost of errors.

Changing any of these may invalidate a summary metric. The assurance report therefore keeps metrics attached to their domain and decision.

#### Spatial leakage

Leakage occurs when evaluation contains information that would not be available for a genuinely new prediction. In geospatial imagery it can arise through:

- overlapping train and test patches;
- neighbouring patches from the same object;
- the same site or flight strip in both partitions;
- temporal duplicates of nearly unchanged locations;
- preprocessing fitted on all scenes;
- labels derived from a product also used as a predictor.

Prove independence with geometry, not filenames alone. Map patch footprints and calculate intersections or separation buffers. A site-level holdout supports a new-site claim more directly than a random-patch holdout.

[[CHECK:m2-l49-leakage]]

#### Class and object evidence

A binary confusion matrix separates true positives, false positives, false negatives and true negatives. Precision describes how many predicted target cells are target in the reference. Recall describes how much referenced target area was detected. Intersection over union measures overlap.

Pixel metrics can still hide fragmentation and merging. Add object-level match rates, split and merge counts, boundary distance and minimum-mapping-unit performance. Report by site or spatial block. A method that succeeds in central homogeneous meadow and fails at tidal margins needs that geography exposed.

Class imbalance affects both learning and interpretation. Do not report a prevalence-sensitive number without the class distribution. Keep the natural prevalence in independent test geography, even if training used balanced sampling.

#### Annotation uncertainty

Reference labels are observations with error. Review:

- interpreter identity and protocol;
- image date relative to field evidence;
- boundary tolerance and minimum object size;
- ambiguous or occluded areas;
- agreement between annotators;
- label revision history.

If disagreement concentrates at boundaries, a strict cell-by-cell score may punish uncertainty as if it were model error. Report a justified boundary-tolerance analysis alongside the primary metric, not instead of it.

#### Domain shift and resolution mismatch

Domain shift means deployment data differ from training in a way relevant to prediction. Examples include a new sensor, season, illumination distribution, geography, management regime or atmospheric state. Resolution mismatch changes both measurement mixing and spatial texture. Upsampling a 10 m image to 5 cm does not create UAV detail.

Create an applicability-domain table with supported sensors, products, bands, scaling, ground sampling distances, seasons, geographic conditions and valid-data limits. A new observation outside that table is unsupported until transfer evidence exists.

### Worked example — compare performance by independent region

#### Predict before running

The same probability threshold is applied to three withheld regions. Predict whether a good pooled confusion matrix guarantees similar performance in each region. Which region should govern a claim about transfer to the entire study area?

```python
import numpy as np
from sklearn.metrics import confusion_matrix

reference = np.array([1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0])
probability = np.array([.9, .7, .6, .2, .8, .1, .4, .3, .7, .2, .55, .1])
regions = np.array(["north"] * 4 + ["central"] * 4 + ["south"] * 4)
predicted = probability >= 0.6

print("pooled\n", confusion_matrix(reference, predicted))
for region in np.unique(regions):
    use = regions == region
    print(region, confusion_matrix(reference[use], predicted[use], labels=[0, 1]))
```

### Code walkthrough

1. `reference` contains independent binary labels; one is target and zero is background.
2. `probability` contains model scores, not proven ecological confidence.
3. `regions` assigns every observation to one withheld geographic group.
4. The threshold of 0.6 is assumed frozen from validation data.
5. `predicted` converts scores to a decision for this use.
6. The pooled confusion matrix describes all observations together.
7. The loop selects each region independently.
8. `labels=[0, 1]` preserves a consistent two-by-two layout even if one small region lacks a class.
9. Regional matrices expose failure that pooling can hide.

This teaching array is tiny. Real assessment operates on valid raster cells and object evidence, with stable site identifiers and geospatial partitions preserved.

### Calibration and threshold consequences

Discrimination asks whether target examples tend to receive higher scores than background. Calibration asks whether probabilities correspond to observed frequencies. A well-ranked model can be overconfident. Reliability diagrams or calibration error group predictions into probability ranges and compare predicted with observed target frequency.

Calibration must be checked on independent, representative data. A statement such as “among predictions near 0.8, roughly 80% were positive” is empirical and domain-specific. It is not a universal guarantee for every pixel or future sensor.

Select a threshold from decision consequences. If missing a rare habitat patch is costly, favour recall while reporting the additional field-review burden from false positives. If intervention is costly, require stronger precision. Present a threshold table rather than hiding the trade-off.

[[CHECK:m2-l49-calibration]]

### False confidence and uncertainty layers

Low predictive entropy or a high softmax score does not necessarily mean the input is familiar. Neural networks can be confident outside their training domain. Add separate evidence for:

- distance from the documented feature or acquisition domain;
- disagreement across models or repeated fits;
- data quality and valid support;
- class probability or margin;
- annotation uncertainty;
- geographic validation density.

Do not collapse these into one unexplained “uncertainty” surface. Each answers a different question.

[[CHECK:m2-l49-domain]]

### Common mistakes and recovery

#### Mistake 1 — accepting random-patch validation

**Recognise it:** patches from the same site or overlapping windows appear across partitions.

**Recover:** reconstruct partitions from spatial footprints, retrain and report withheld-site performance.

#### Mistake 2 — using test data to choose the threshold

**Recognise it:** the reported threshold was selected because it maximised the final test score.

**Recover:** choose it on validation geography from a declared decision objective; use test geography once for final assessment.

#### Mistake 3 — hiding rare-class failure in overall accuracy

**Recognise it:** only one aggregate number is published.

**Recover:** report per-class, object, boundary and region results with prevalence.

#### Mistake 4 — treating reference labels as perfect

**Recognise it:** ambiguous edges and annotator disagreement are absent from metadata.

**Recover:** audit provenance, map disagreement and perform a bounded tolerance sensitivity.

#### Mistake 5 — resampling away domain shift

**Recognise it:** a new sensor is resized to training dimensions and declared compatible.

**Recover:** compare measurement and acquisition contracts and obtain representative transfer validation.

#### Mistake 6 — publishing a probability map without applicability limits

**Recognise it:** all valid pixels appear equally supported.

**Recover:** mask unsupported domains and publish calibration, data-quality and validation-coverage evidence separately.

### Guided practice

1. Verify checksums and reconcile prediction, reference, site, patch and acquisition inventories.
2. Draw train, validation and test footprints. Test overlaps and buffered separation.
3. Audit the label protocol, ambiguous code, annotator agreement and reference dates.
4. Reconcile target prevalence by partition and site.
5. Calculate per-class precision, recall and intersection over union for each withheld site.
6. Match reference and predicted objects; report missed, split, merged and spurious regions above the minimum mapping unit.
7. Evaluate boundary distance under a predeclared positional tolerance.
8. Create a threshold-consequence table across at least five values using validation evidence.
9. On test sites, assess reliability by probability range and identify overconfidence.
10. Compare sensor, season, resolution and value distribution with the documented deployment domain.
11. Map false positives, false negatives, ambiguous labels and unsupported areas.
12. Write release conditions with owner, evidence required and review date.

### Independent challenge

Audit one proposed transfer: a different UAV camera, a later season or satellite imagery at coarser resolution. Write a transfer protocol including measurement compatibility, resampling limits, label updates, independent geography, calibration, minimum object size and an acceptance threshold. State what would trigger retraining versus restricted use.

### Scientific interpretation

The QA report does not pronounce a model universally good or bad. It determines whether defined evidence supports a defined use. A responsible conclusion might be: “The model is conditionally accepted for field-review prioritisation within 5–7 cm reviewed summer UAV imagery at the three represented meadow types. South-site recall and probability calibration do not support absence claims, and imagery outside the sensor–season domain remains blocked.”

That statement is more useful than a larger pooled metric because it gives users a boundary, consequence and next action.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which result changed most between pooled and regional assessment?
2. How would overlapping patches change the apparent evidence?
3. Which threshold reflects the intended field-review cost?
4. Which domain-shift signal should automatically block publication?

#### Submission

Submit `deep_learning_qa_report.pdf`, a machine-readable metrics table, split-proof map, threshold-consequence table, calibration graphic, error-geography map, applicability-domain record and 300–500 word release decision. Include the code or notebook that reproduces every table.

#### Portfolio artifact

Add the assurance package to `advanced-image-analysis/model-assurance/`. It provides professional evidence for the Remote Sensing Researcher profile through valid evaluation, the Geospatial Data Analyst profile through transparent error analysis, and the GIS/Remote Sensing Engineer profile through enforceable release gates.
