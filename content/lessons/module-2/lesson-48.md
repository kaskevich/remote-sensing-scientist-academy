## 1. Deep Learning for Geospatial Images

### Learning outcome

By the end of this lesson, you will be able to trace a semantic-segmentation workflow from georeferenced image to patch, model, probability and mask; explain convolution, receptive field and the U-Net encoder–decoder concept without relying on a model API; design labels, spatial partitions, augmentation and class-balance treatment for coastal-meadow imagery; compare a deep model with a transparent baseline; and specify what must be restored after prediction to produce a valid geospatial output.

- **Lesson type:** Geospatial Deep-Learning Design Studio
- **Estimated time:** 210–270 minutes
- **Prerequisites:** Lesson 2.47, raster grids, NumPy, sampling design and geographic validation
- **Portfolio output:** `geospatial_segmentation_design.ipynb`

### Why this matters

Deep learning can recognise image patterns that a single threshold cannot represent. It can use spectral and spatial context to distinguish complex boundaries, shadows and texture. Yet it also makes it easier to produce convincing maps whose validation is invalid. Overlapping patches can place near-duplicate pixels in training and test data. Labels can encode an interpreter's uncertainty as if it were truth. A model trained on one sensor, season or resolution can become confidently wrong elsewhere.

The professional skill is therefore not calling a training function. It is designing an evidence system in which the input measurement, target definition, geography, model output and intended use remain explicit.

### Scientific context

The coastal-meadow team wants to map candidate reed encroachment from reviewed UAV multispectral imagery. Thresholding provides a useful baseline but confuses shaded meadow with the target. A semantic-segmentation experiment may use spatial context and multiple bands. The result will prioritise field review; it will not certify habitat condition.

The training pack is synthetic. The lesson designs a small, auditable experiment and deliberately avoids a costly full training run. The aim is to understand the complete contract before selecting architecture or hardware.

```text
georeferenced image + valid-data mask + labels
                      ↓
          scene-level spatial partition
                      ↓
            fixed-size image patches
                      ↓
       convolutional model (for example U-Net)
                      ↓
            per-pixel probability grid
                      ↓ threshold + QA mask
                 candidate mask
                      ↓ restore transform and CRS
              reviewable geospatial product
```

### Concept — a model learns a conditional mapping from labelled examples

An image tensor is commonly organised as batch, channel, height and width: `(N, C, H, W)`. A batch contains several patches. Channels may contain blue, green, red and near-infrared measurements. The target mask usually contains a class code per pixel.

A **convolution** applies learned local filters across the image. Early filters can respond to edges or local contrasts; deeper representations combine broader patterns. The **receptive field** is the region of input that can influence one output. It grows through layers. If the target requires context larger than the receptive field, the model cannot use that context; if a patch is too small, boundaries dominate.

A **CNN** is a neural network built around convolutional operations. **Semantic segmentation** predicts a class or score for every pixel. It differs from image classification, which predicts one label for a complete image, and from instance segmentation, which distinguishes individual objects of the same class.

#### U-Net as a reasoning pattern

U-Net has an encoder and decoder with skip connections. The encoder reduces spatial dimensions while learning broader context. The decoder restores spatial detail. Skip connections pass fine-resolution features across the network so boundaries need not be reconstructed only from compressed information.

You do not need to memorise layer counts. You do need to ask:

- Which context should influence each prediction?
- Which spatial detail must survive?
- What image and mask shapes enter and leave the model?
- How are NoData cells excluded from loss and metrics?
- Does the output correspond to the same grid as the target?

### Labels are measurements too

Training labels are not unquestionable truth. Record who interpreted them, from which image and field evidence, using which class definition, at which scale and date. Preserve ambiguous boundaries rather than forcing them into a confident class. Options include an `uncertain` code excluded from loss, multiple annotator layers or a confidence weight.

Rasterise vector labels onto the exact image grid only after checking CRS, transform and pixel-footprint convention. A half-pixel shift teaches the model a systematic boundary error.

Class imbalance occurs when background dominates the image. Overall accuracy may look high even if the target is never detected. Use per-class metrics, sampling design and a justified loss or weighting strategy. Do not oversample one class until training and validation cease to represent deployment prevalence without documenting the change.

[[CHECK:m2-l48-patches]]

### Spatial partition before patch extraction

Split independent sites, flight blocks or acquisition regions first. Then extract patches within each partition. If you create overlapping patches first and randomly split them, neighbouring or nearly identical pixels can enter both training and validation.

A valid design might reserve entire sites for testing, use separate sites for validation and train on the remainder. If only one site exists, use spatial blocks separated by a buffer that exceeds the patch overlap and relevant spatial dependence. The claimed deployment domain must match the holdout design.

Augmentation creates transformed training examples such as flips, rotations or modest radiometric variation. It must preserve class meaning and geospatial physics. A horizontal flip may be harmless for local vegetation texture, while an arbitrary spectral shift could erase calibration meaning. Apply augmentation only to training data and record its probability and parameters.

### Worked example — trace tensor shapes before model training

#### Predict before running

Four bands are sampled into 256 × 256 patches. Predict the image and target shapes for a batch of eight. Why does the target have one channel when the image has four? Which metadata are missing from these shapes?

```python
patch_size = 256
bands = ["blue", "green", "red", "nir"]
batch_size = 8
class_names = ["background", "candidate_reed"]

image_shape = (batch_size, len(bands), patch_size, patch_size)
mask_shape = (batch_size, 1, patch_size, patch_size)
probability_shape = (batch_size, len(class_names), patch_size, patch_size)

print("image", image_shape)
print("target", mask_shape)
print("probabilities", probability_shape)
```

### Code walkthrough

1. `patch_size` declares the square sampling window in pixels; its physical width still depends on resolution.
2. `bands` fixes channel order. A different order at inference is a serious contract violation.
3. `batch_size` controls how many patches are processed together, subject to memory.
4. `class_names` gives semantic meaning to output channels.
5. `image_shape` places batch first, then four channels, height and width.
6. `mask_shape` contains one integer class code per target cell.
7. `probability_shape` contains one score field per class before the final class decision.
8. Printing shapes is an early interface test; it does not validate values, masks or geography.

The tensor does not carry CRS, affine transform, scene ID, time, scale factor or validity mask by itself. Your dataset object and manifest must preserve those associations.

[[CHECK:m2-l48-output]]

### From score to map

For two classes, the model might output background and target probabilities. The selected class or target threshold creates a mask. That threshold belongs to the decision, not merely the software default. Tune it on validation geography for a declared error trade-off, then report its performance once on the independent test geography.

Patch predictions must be mosaicked without seams or duplicated weighting. Edge cells may have less context. Overlapping inference windows can be blended with a fixed rule, but that rule must be tested. Restore the source transform, CRS, dimensions, mask and provenance. Reopen the written raster and compare the expected grid and representative values.

### Baselines and experiment control

A threshold, logistic regression or shallow tree using the same accepted bands provides a transparent baseline. Use the same spatial partitions and target labels. If U-Net improves only a random-patch metric but not withheld-site evidence, complexity has not improved the deployment claim.

Maintain an experiment record:

- source and label checksums;
- scene and patch IDs;
- train, validation and test site membership;
- band order, scaling and mask policy;
- patch size, stride and edge policy;
- architecture and initialisation;
- optimiser, loss, learning schedule and stopping rule;
- random seeds and determinism limitations;
- selected checkpoint and threshold;
- software, hardware and runtime evidence.

[[CHECK:m2-l48-baseline]]

### Common mistakes and recovery

#### Mistake 1 — random patch splitting

**Recognise it:** training and evaluation patch footprints overlap or share the same flight strip.

**Recover:** assign entire sites or buffered blocks before extraction and publish a split map.

#### Mistake 2 — selecting architecture before auditing labels

**Recognise it:** discussion centres on layers and GPUs while class boundaries and uncertain pixels are undocumented.

**Recover:** freeze the target definition, annotation protocol and label QA before model comparison.

#### Mistake 3 — discarding NoData as background

**Recognise it:** outside-flight areas improve apparent background accuracy.

**Recover:** retain a separate valid-data mask and exclude invalid support from loss and metrics.

#### Mistake 4 — reporting only overall accuracy

**Recognise it:** rare target failure is hidden by abundant background.

**Recover:** report per-class precision, recall and intersection over union, plus object and regional results.

#### Mistake 5 — calling probability confidence

**Recognise it:** a score of 0.9 is described as 90% certainty without calibration evidence.

**Recover:** call it a model probability or score, evaluate reliability on independent data and map unsupported domains.

### Guided practice

1. Verify the image, label and partition manifest from the synthetic training pack.
2. Write the target class definition, inclusion rules, ambiguous cases and intended use.
3. Confirm that image bands, label grid and validity mask share shape, transform and CRS.
4. Map scene-level partitions before creating patches. Calculate the minimum distance between train and test footprints.
5. Choose a patch size by converting pixels to ground dimensions and comparing it with target-object size.
6. Create a patch inventory with scene ID, partition, row/column window, class fractions and valid fraction.
7. Identify patches that cross partition boundaries or contain insufficient valid support; block them.
8. Define physically plausible augmentation and one transformation you reject.
9. Specify a threshold baseline and a U-Net experiment under the same evaluation contract.
10. Draw the image → patch → model → probability → mask → geospatial output chain and attach one QA gate to every arrow.
11. Design a model card that states intended use, exclusions, data, metrics, ethical/ecological risks and monitoring needs.
12. Issue a readiness decision for training; do not claim results from a model you have not run.

### Independent challenge

Design a second experiment for a different sensor or season. Identify exactly what remains invariant and what must be revalidated. Include band compatibility, radiometric scaling, ground sampling distance, patch support, label interpretation and spatial holdouts. Propose one transfer test and one condition that would block use.

### Scientific interpretation

A semantic-segmentation model learns statistical associations between image context and supplied labels within a documented domain. It does not observe ecological cause. A candidate reed mask may support field prioritisation when independent sites, relevant seasons and appropriate resolution have been validated. It cannot establish species identity or management effect without corresponding evidence.

The strongest result is a bounded one: where, when and for which target definition the method works; how performance varies by class and place; and which conditions require review.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which source of leakage is most plausible in the proposed patch design?
2. What physical ground area does one patch represent?
3. Which ambiguous pixels should be excluded or represented separately?
4. What would justify the deep model over the threshold baseline?

#### Submission

Submit `geospatial_segmentation_design.ipynb`, a spatial split map, patch inventory schema, target/label protocol, baseline comparison plan, model card and 300–500 word scientific interpretation. Include one screenshot showing the tensor and geospatial metadata together. Upload no sensitive imagery or credentials.

#### Portfolio artifact

Add the notebook and model card to `advanced-image-analysis/model-design/`. The artifact demonstrates experiment architecture and scientific judgement before computation—the evidence employers and reviewers need to trust later results.
