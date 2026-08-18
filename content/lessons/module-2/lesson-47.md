## 1. Image Segmentation Fundamentals

### Learning outcome

By the end of this lesson, you will be able to explain the difference between segmentation and classification; create vegetation objects from a small raster using thresholding and connected-component labelling; describe how connectivity, minimum object size, texture and spatial resolution change those objects; evaluate over-segmentation and under-segmentation against reference evidence; and decide whether a segmentation is fit for a stated coastal-meadow measurement.

- **Lesson type:** Image Segmentation Laboratory
- **Estimated time:** 180–230 minutes
- **Prerequisites:** Raster Science, UAV and Photogrammetry, NumPy arrays and raster masks
- **Portfolio output:** `segmentation_experiment.ipynb`

### Why this matters

A raster gives one value per cell, but many environmental questions concern spatial objects: a patch of reed encroachment, a bare-soil opening, a flowering plant cluster or a drainage feature. Before measuring the area, shape or number of such objects, an analyst must define which neighbouring cells belong together. That is segmentation.

Segmentation is not merely image tidying. Its decisions change the measurement. A threshold may split one continuous vegetation patch into fragments. Eight-neighbour connectivity may join regions that only touch at a corner. Removing small objects may reduce sensor noise, but it may also delete the rare habitat patches the survey was designed to detect. A professional workflow therefore connects every parameter to a scientific target and evaluates the resulting geometry.

### Scientific context

The Baltic coastal-meadow team has a quality-reviewed UAV orthomosaic and a derived vegetation-index raster. The management question is narrow: identify candidate dense-vegetation patches larger than the minimum mapping unit for field review. The output is not a habitat classification and it does not prove species composition. It is a reproducible set of candidate regions.

The lesson uses a synthetic image tile. It contains no published plot coordinates. Its purpose is to make the segmentation decisions visible before you apply them to real imagery.

```text
reflectance or index raster
          ↓ threshold rule
      binary mask
          ↓ connectivity rule
   labelled regions
          ↓ size and edge policy
  candidate objects
          ↓ reference review
accepted, revised or rejected segmentation
```

### Concept — segmentation creates geometry; classification assigns meaning

**Segmentation** partitions an image into regions. **Classification** assigns a class label such as dense vegetation, open water or bare soil. A threshold can participate in both, but the questions remain different:

- segmentation asks, “Which cells form one region?”;
- classification asks, “What does this cell or region represent?”

The distinction matters because a plausible region is not automatically the intended ecological class. A dark connected shape might be water, shadow or missing imagery. A bright vegetation-index region may contain several plant communities. The segmentation output becomes candidate geometry that needs classification evidence and scientific interpretation.

#### Thresholding

A threshold converts a continuous raster into a Boolean mask. For a vegetation index, `ndvi > 0.45` might mark candidate dense vegetation. That number is not universal. Illumination, calibration, season, soil background and sensor response change the distribution. Select a threshold from documented evidence, and examine sensitivity to nearby values.

#### Connected components

Connected-component labelling assigns an integer ID to each contiguous positive region. Under four-neighbour connectivity, a cell connects through its top, bottom, left and right edges. Under eight-neighbour connectivity, diagonal contact also counts.

```text
1 .       Four-neighbour: two objects
. 1       Eight-neighbour: one object
```

Neither rule is automatically correct. If diagonal crown contact represents one shrub patch at the working resolution, eight-neighbour connectivity may be defensible. If corner contact should not bridge open ground, four-neighbour connectivity may be safer.

[[CHECK:m2-l47-purpose]]

#### Scale and minimum mapping unit

Object size is counted in cells, but ecological reporting usually needs area. For square pixels:

`object area = cell count × pixel width × pixel height`

A 20-cell object represents 0.05 m² at 5 cm resolution, but 2,000 m² at 10 m resolution. A rule such as “remove objects smaller than 20 pixels” has no stable scientific meaning without the grid. Declare the minimum mapping unit in physical units first, then convert it to cells.

Objects touching the image boundary need a policy. They may continue outside the tile, so their area and shape are incomplete. Retain them with an `edge_censored` flag, analyse a buffered tile, or exclude them from shape inference while preserving them in the inventory.

#### Texture and object-based image analysis

Two regions can have the same mean reflectance but different internal patterns. Texture describes local variation, repetition or directional structure. It can help distinguish smooth water from heterogeneous vegetation, or uniform turf from mixed tall vegetation. Texture depends strongly on window size and resolution. A three-pixel window at 5 cm sees 15 cm of ground; at 10 m it sees 30 m.

Object-based image analysis combines region geometry, spectral summaries, texture and context. It can be powerful, but it does not remove the need for a target definition. Every object feature still represents a chosen scale, grid and segmentation.

### Worked example — label candidate vegetation regions

#### Predict before running

The mask below contains diagonal contact and one isolated positive cell. Predict the number of labelled objects with eight-neighbour connectivity. Which object will be smallest? What could change if connectivity becomes four-neighbour?

```python
import numpy as np
from skimage.measure import label, regionprops_table

ndvi = np.array([
    [0.18, 0.51, 0.54, 0.20],
    [0.22, 0.49, 0.19, 0.47],
    [0.17, 0.21, 0.52, 0.50],
])
mask = ndvi > 0.45
regions = label(mask, connectivity=2)
properties = regionprops_table(
    regions, intensity_image=ndvi,
    properties=("label", "area", "mean_intensity"),
)
print(mask.astype(int))
print(regions)
print(properties)
```

### Code walkthrough

1. `numpy` represents the synthetic vegetation-index tile as a two-dimensional numerical array.
2. `label` performs connected-component labelling; `regionprops_table` measures the resulting objects.
3. `ndvi` contains three rows and four columns. Values are synthetic and dimensionless.
4. `ndvi > 0.45` creates a Boolean mask. It does not yet claim a habitat class.
5. `connectivity=2` allows full two-dimensional, or eight-neighbour, connectivity.
6. Every connected positive region receives a positive integer label; background remains zero.
7. `regionprops_table` receives both the labels and original values.
8. `label` and `area` describe region identity and cell count.
9. `mean_intensity` summarises original NDVI within each candidate object.
10. The printed mask, label grid and table let you reconcile cell membership before accepting any summary.

The example deliberately stops before filtering. Inspecting raw regions first prevents a minimum-area rule from silently deleting evidence.

[[CHECK:m2-l47-components]]

### Evaluate segmentation quality

Pixel agreement alone is incomplete. A segmentation is a geometric hypothesis. Review it at three levels:

1. **pixel level** — intersection over union, omission and commission relative to a reference mask;
2. **boundary level** — distance between predicted and reference boundaries, with an explicit tolerance;
3. **object level** — matched, missed, merged and split reference objects.

**Over-segmentation** occurs when one meaningful reference object becomes several predicted objects. **Under-segmentation** occurs when distinct reference objects merge. Both can coexist. A low threshold may bridge neighbouring patches, while noise within a patch fragments it.

Do not create the reference by tracing the final segmentation. Reference objects should come from an independent annotation protocol, field evidence or a separate image interpretation whose uncertainty is documented. When experts disagree, preserve disagreement or label ambiguity rather than forcing false certainty.

### Common mistakes and recovery

#### Mistake 1 — choosing the threshold on the final evaluation tile

The analyst adjusts the threshold until the overlay looks good.

**Recognise it:** no independent site remains for evaluation.

**Recover:** choose candidate parameters on training/development geography, freeze the rule and evaluate once on withheld locations.

#### Mistake 2 — treating pixel count as area

The object table reports 120 cells and the report calls it 120 square metres.

**Recognise it:** grid resolution and projected units are absent.

**Recover:** validate the affine transform and CRS, calculate physical cell area and state whether projection distortion is acceptable.

#### Mistake 3 — removing small objects as “noise” without a target rule

Small regions make the map untidy.

**Recognise it:** the filter is justified by appearance rather than sensor noise, positional error or minimum mapping unit.

**Recover:** state the intended object, derive a physical-area threshold and report sensitivity, including rare objects removed.

#### Mistake 4 — ignoring edge-censored objects

Regions that meet tile boundaries receive apparently precise shapes.

**Recognise it:** edge objects have incomplete perimeter or area but no flag.

**Recover:** add edge status and exclude incomplete shape metrics or analyse an appropriately buffered extent.

#### Mistake 5 — calling every segment a habitat patch

The method has produced geometry, so the interpretation becomes categorical.

**Recognise it:** no independent evidence connects regions to habitat meaning.

**Recover:** call them candidate image objects and add a separate classification and validation stage.

### Guided practice

Use the Advanced Image Analysis training pack.

1. Verify the manifest and record the source checksum, licence, CRS, resolution, acquisition status and synthetic-data statement.
2. Open the supplied index tile and label raster. Confirm matching shape, transform, CRS and valid-data mask.
3. Plot the value histogram using only valid cells. Record why missing and masked cells must not influence threshold selection.
4. Run thresholds 0.40, 0.45 and 0.50 using four- and eight-neighbour connectivity.
5. For each combination, record positive area, object count, median object area, edge-object count and reference intersection over union.
6. Create an overlay that distinguishes correct overlap, omission and commission without relying on red–green colour alone.
7. Match predicted and reference objects. Count splits, merges, missed reference objects and unmatched predicted regions.
8. Convert the minimum mapping unit from square metres to cells using the validated resolution.
9. Apply the rule while preserving an inventory of removed objects and reasons.
10. Write a short decision: accepted, conditionally accepted or rejected for field-review prioritisation.

[[CHECK:m2-l47-qa]]

### Independent challenge

Design a segmentation comparison for one alternative target: drainage-line vegetation, bare-soil openings or standing-water patches. You may use a threshold baseline and one additional method such as watershed, region growing or superpixels. Keep the target, reference data, partitions and acceptance metrics constant.

Your comparison must answer:

- What physical object is being approximated?
- What is its minimum mapping unit?
- Which connectivity and edge rules apply?
- Which parameter changes cause splits or merges?
- Which locations are unsupported because of shadow, NoData or label ambiguity?
- Does the additional method improve independent object evidence enough to justify its complexity?

Do not select a winner from visual preference alone.

### Scientific interpretation

The resulting objects are a model of spatial organisation at one resolution and time. They can support statements such as, “Under the declared threshold and connectivity rule, the reviewed tile contains seven candidate dense-vegetation regions larger than 0.25 m².” They cannot by themselves establish species, habitat condition, biomass or management cause.

Report parameter sensitivity alongside the selected result. If object count changes dramatically under a small threshold adjustment, the measurement is unstable near the decision boundary. That instability may be more important than the final count.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which parameter changed object geometry most strongly, and why?
2. When would eight-neighbour connectivity create an ecologically implausible bridge?
3. Which error matters more for the intended use: a missed small patch or a merged pair of patches?
4. What additional field or image evidence would strengthen the class interpretation?

#### Submission

Submit:

- `segmentation_experiment.ipynb` with predictions before outputs and compact code;
- a threshold/connectivity sensitivity table;
- one accessible reference overlay;
- an object-error table containing splits, merges, omissions and commissions;
- a 250–400 word scientific interpretation and release decision;
- your private lesson notes and one question for feedback.

Use the submission checklist shown below the lesson. Do not upload real sensitive imagery or coordinates.

#### Portfolio artifact

Add `segmentation_experiment.ipynb` to the UAV and Satellite Analysis Pipeline under `advanced-image-analysis/`. Its professional value is the traceable relationship between target definition, raster evidence, parameters, object geometry and independent review—not the visual complexity of the map.
