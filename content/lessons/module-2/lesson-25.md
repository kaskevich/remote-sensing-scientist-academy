---
title: UAV Multispectral Processing Pipeline
lessonId: lesson-2-25
---

## 1. Build only from bands that pass their contracts

### Learning outcome

By the end of this lesson, you will be able to audit a UAV band inventory; resolve or stop on reflectance scale, NoData and co-registration; calculate NDVI, GNDVI and Red-edge NDVI safely; align DSM and masks; extract values at declared support; and write a manifest for an analysis-ready multispectral stack.

- **Lesson type:** Integrated technical practicum
- **Estimated time:** 140–170 minutes
- **Prerequisites:** Lessons 2.13–2.15 on raster transformations, alignment and extraction; Lessons 2.20 and 2.24 on radiometric and product QA.

### Why this matters

Spectral arithmetic is short. Establishing that bands are comparable is the professional work. A vegetation index can fall inside -1 to 1 even when band labels are reversed, pixels are shifted, values use incompatible scales or shadows differ.

The output of this lesson is not one attractive NDVI map. It is an auditable stack whose layers share a declared grid, valid support, measurement meaning and provenance.

### Scientific context

The synthetic Red, Green and NIR bands are aligned float reflectance proxies. NIR also has a half-pixel-shifted variant. Red Edge stores larger unsigned integers with an unverified scale and different NoData value. The DSM is aligned horizontally but has an undocumented vertical datum.

You may build safe NDVI and GNDVI from accepted inputs. Red-edge NDVI must remain blocked until authoritative scaling evidence is supplied. This is a scientific success: the pipeline stops rather than manufacturing certainty.

### Mental model

![Validated multispectral pipeline in which band identity, scale, radiometry, grid and masks are checked before indices, DSM integration, extraction and manifest creation.](lesson-media/images/multispectral-stack.svg)

### Learner action

Create `08_multispectral_pipeline.ipynb` and an output folder `uav_analysis_stack/`. Add a first cell named **Acceptance gates**. It should list band identity, scale, radiometric status, grid contract and mask policy.

## 2. Inventory every band before reading full arrays

For each raster, record:

- filename and checksum;
- band name and sensor metadata source;
- centre wavelength and bandwidth only if documented;
- stored quantity, scale and units;
- calibration and illumination evidence;
- CRS, transform, resolution, dimensions and bounds;
- data type and NoData;
- valid range under the product definition;
- acquisition time and temporal support;
- QA status and reason.

Do not infer wavelength from colour name or scale from value range alone. A layer can look like 0–10,000 scaled reflectance but still represent uncalibrated DN.

`manifest.json` explicitly marks the Red Edge scale ambiguous. The value pattern is a clue for review, not permission to divide.

[[CHECK:m2-l25-inventory]]

## 3. Reflectance-range checks depend on product definition

For a product documented as unitless reflectance fraction, many values are expected around 0–1, but noise, processing and target properties can complicate strict clipping. For a scaled integer product, apply only the documented scale and retain original values.

Range QA should report:

- valid minimum and maximum;
- selected quantiles;
- count/fraction below or above expected range;
- saturation and fill values;
- exact product definition and scale;
- whether values were clipped, masked or retained.

Do not clip unexpected values merely to make an index valid. Investigate whether they reflect NoData, scale mismatch, calibration failure, numeric overflow or plausible product behaviour.

## 4. Band alignment is a cell-by-cell requirement

Before index arithmetic, require identical:

- CRS;
- transform and origin within declared tolerance;
- pixel orientation and resolution;
- shape and bounds;
- intended time/support;
- mask interpretation.

Matching CRS, shape and resolution are insufficient. `uav_nir_shifted.tif` differs only in origin by 0.1 m. If combined with Red, every index cell mixes footprints.

Registration can also vary locally due to separate lenses, relief and timing. Numeric transform equality proves the output grids coincide; it does not prove source-band image content is locally co-registered. Inspect stable edges and, where appropriate, calculate displacement across the scene.

[[CHECK:m2-l25-alignment]]

## 5. Harmonise only under an explicit target-grid decision

Choose a reference grid based on intended support, trusted provenance and band characteristics. A common approach is to use a validated Red band grid, but document why.

When a band is shifted:

1. preserve the original;
2. diagnose whether the shift is a metadata-origin issue or image-content misregistration;
3. estimate a transform only from defensible controls or sensor workflow;
4. resample the continuous band to the target grid;
5. validate transform, values, edges and residual displacement;
6. record interpolation and lost support.

Do not merely copy the Red transform onto NIR. Relabelling metadata moves its interpreted footprint without resampling values or proving the correction.

## 6. Construct a joint valid mask

An index is valid only where both input bands are valid under their product masks and the denominator is safe. NoData values can differ: Red uses -9999 while Red Edge uses 65535. Compare masks, not raw sentinel equality across products.

Additional exclusions may include:

- saturated pixels;
- deep shadow or cloud under a declared rule;
- water where the ecological index is not intended;
- outside-study area;
- unregistered or weak-georeferencing regions;
- invalid radiometric blocks.

Preserve reason-specific QA bits if possible. One combined mask is convenient, but a reviewer should know why a cell is invalid.

## 7. Safe vegetation-index calculation

Three common normalised differences are:

```text
NDVI  = (NIR − Red) / (NIR + Red)
GNDVI = (NIR − Green) / (NIR + Green)
RENDVI = (NIR − RedEdge) / (NIR + RedEdge)
```

Names vary; state the exact formula. These indices emphasise spectral contrast. This lesson does not claim that they directly measure biomass, chlorophyll or ecological condition. Those relationships require sensor-, season- and target-specific validation.

Numerical safety requires:

- floating-point arithmetic;
- aligned bands;
- common radiometric quantity and scale;
- joint valid mask;
- denominator threshold near zero;
- NoData propagation;
- finite and expected-range checks.

### Worked example — safe NDVI

#### Predict before running

What value should an invalid or near-zero-denominator cell receive? Will integer arrays preserve negative differences safely?

```python
import numpy as np

def safe_ndvi(nir, red, valid, epsilon=1e-8):
    nir = nir.astype("float32")
    red = red.astype("float32")
    denominator = nir + red
    use = valid & np.isfinite(denominator) & (np.abs(denominator) > epsilon)
    result = np.full(nir.shape, np.nan, dtype="float32")
    result[use] = (nir[use] - red[use]) / denominator[use]
    return result

ndvi = safe_ndvi(nir, red, joint_valid_mask)
print(np.nanmin(ndvi), np.nanmax(ndvi))
```

### Code walkthrough

1. The function receives arrays and an explicit joint mask.
2. Converting to float prevents unsigned subtraction and integer division errors.
3. The denominator is calculated once.
4. `use` requires mask validity, finite denominator and magnitude above epsilon.
5. The output begins as NaN everywhere.
6. Only accepted support receives the ratio.
7. Valid range summary is calculated while ignoring NaN.
8. Range inside -1 to 1 is necessary for this formula under non-negative inputs, not proof of scientific validity.

[[CHECK:m2-l25-index]]

## 8. Scale compatibility comes before ratios

A normalised difference is invariant if both bands are multiplied by the same positive scale factor. It is not invariant when one band is scaled differently.

Red values around 0.15 and Red Edge values around 3,000 cannot be combined because the apparent ratio would be dominated by storage scale. Dividing Red Edge by 10,000 would be plausible only if authoritative metadata confirms that factor.

Therefore:

- NDVI from aligned accepted NIR and Red can proceed;
- GNDVI from accepted NIR and Green can proceed;
- Red-edge NDVI is blocked in the training handover.

Document a blocked derivative in `UAV_STACK_MANIFEST.csv` with status and required evidence. Do not omit it silently.

## 9. DSM integration retains different semantics

A DSM can join the common grid as a separate continuous layer after alignment and vertical metadata review. It is not reflectance and must not be radiometrically scaled with the bands.

Record:

- upper-surface meaning;
- horizontal and vertical units/reference;
- acquisition/processing time;
- grid transformation and resampling;
- spike/hole/smoothing QA;
- accepted use.

The clean synthetic DSM aligns with Red, but its vertical datum is undocumented. It can remain in the stack for workflow training and relative synthetic diagnostics, explicitly under review for real elevation interpretation.

## 10. Study mask and extraction preserve support logic

Transform `study_area.geojson` and `field_plots.geojson` from RFC 7946 longitude–latitude coordinates to EPSG:3301. Mask outside the study boundary without changing values inside.

For plot extraction, reuse Lesson 2.15:

- declare centre-based, all-touched or area-weighted support;
- report candidate and valid cells;
- report valid fraction;
- preserve plot IDs and dates;
- include raster source, units and QA status;
- reject or flag plots intersecting weak regions or seams;
- keep temporal mismatch visible.

Fine 0.2 m cells do not make a plot mean independent. Spatial autocorrelation and reconstruction sources influence effective information.

## 11. Write analysis-ready derivatives and reopen them

The requested folder is:

```text
uav_analysis_stack/
├── red.tif
├── green.tif
├── rededge.tif       # blocked until scale verified
├── nir.tif
├── ndvi.tif
├── gndvi.tif
├── rndvi.tif         # blocked until scale verified
├── dsm.tif
└── qa_mask.tif
```

Do not create misleading raster files for blocked layers. A manifest row with `not produced — blocking metadata` is more honest. If the required delivery contract mandates filenames, use a clearly documented empty/NoData sentinel file only when downstream systems require it and the distinction cannot be missed.

For every produced raster, reopen and verify:

- CRS, transform, shape, bounds and resolution;
- dtype and NoData;
- mask equivalence;
- band description, units and tags;
- valid range and representative cells;
- checksum and source lineage.

## 12. The stack manifest is part of the scientific product

`UAV_STACK_MANIFEST.csv` should contain:

- layer and filename;
- source asset/checksum;
- semantic meaning;
- CRS, resolution, transform and shape;
- dtype and NoData;
- processing and resampling;
- equation where applicable;
- scale and valid range;
- source and output valid counts;
- QA status;
- blocked reason or limitation;
- software version and processing date.

The manifest lets another scientist distinguish measured bands, aligned derivatives, mathematical indices, surface layers and QA masks.

### QGIS visual QA companion

Blink Red, Green and NIR around strong edges using the same zoom. Display NDVI with a fixed -1 to 1 scale and its QA mask. Overlay plots and the south-east review area. Do not judge registration only from a low-contrast meadow interior.

## 13. Common mistakes and recovery

### Computing NDVI before alignment

**Why:** arrays have the same shape. **Detect:** transforms differ or edge halos appear. **Recover:** validate and correct registration before arithmetic.

### Assuming reflectance scale

**Why:** values resemble a familiar convention. **Detect:** metadata do not confirm scale. **Recover:** stop the affected derivative and request authoritative evidence.

### Converting NoData to zero

**Why:** arithmetic is easier. **Detect:** invalid corners receive index values. **Recover:** propagate masks and use explicit output NoData.

### Dividing unsigned integers directly

**Why:** source types are overlooked. **Detect:** subtraction wraps or truncates. **Recover:** convert accepted valid values to float before arithmetic.

### Calling NDVI biomass

**Why:** a common correlation is overgeneralised. **Detect:** no field validation. **Recover:** describe spectral contrast and test ecological relationship later.

## 14. Guided practice — build the accepted subset

1. Verify checksums and inventory Red, Green, Red Edge, NIR, shifted NIR and DSM.
2. Read metadata before arrays.
3. Confirm Red/Green/NIR alignment and mask conventions.
4. Make `uav_nir_shifted.tif` fail the grid validator.
5. Record Red Edge scale and NoData as a blocking review.
6. Audit valid ranges under each product definition.
7. Create joint valid masks for Red–NIR and Green–NIR.
8. Calculate NDVI and GNDVI with the safe function.
9. Prove invalid and zero-denominator cells remain invalid.
10. Do not produce Red-edge NDVI.
11. Integrate the clean DSM with an explicit vertical limitation.
12. Apply the study mask.
13. Extract accepted layers to synthetic plot polygons with valid counts/fractions.
14. Write and reopen outputs.
15. Complete `UAV_STACK_MANIFEST.csv`, including blocked layers.
16. Create a QGIS/Python QA map and write the decision summary.

### QA checklist

- [ ] Band identity, scale, units and radiometric status are verified.
- [ ] Complete grid contract and local registration are checked.
- [ ] Variable-specific NoData creates a joint mask.
- [ ] Index arithmetic is floating-point and denominator-safe.
- [ ] Blocked bands do not silently enter derivatives.
- [ ] DSM semantics and vertical limits remain separate.
- [ ] Extraction records spatial and temporal support.
- [ ] Every output is reopened and represented in the manifest.

## 15. Independent challenge — revised handover evidence

The provider sends a signed sensor-processing report confirming that Red Edge stores reflectance × 10,000 and documents co-registration residuals below a project threshold. Design the controlled update:

- verify report identity and software/version;
- apply scale without altering raw data;
- align/mask Red Edge to the accepted grid;
- calculate safe Red-edge NDVI;
- compare its mask and edge behaviour with NDVI;
- update provenance, checksum and status;
- explain why metadata confirmation still does not validate an ecological relationship.

### Scientific interpretation

An analysis-ready multispectral stack is a set of compatible measurement layers plus a record of how compatibility was established. Index formulas are meaningful only after radiometric identity, scale, geometry, masks and temporal support pass their gates.

## 16. Reflection, submission and portfolio artifact

Answer in your private notes:

1. How do you prove bands correspond cell by cell?
2. Why can an index be numerically plausible but scientifically invalid?
3. What should happen when reflectance scale is ambiguous?
4. How do masks and denominators protect index arithmetic?
5. What does the stack manifest allow another analyst to verify?

### Submission

- **Notebook:** `08_multispectral_pipeline.ipynb` with gates, accepted indices and blocked Red Edge.
- **Folder:** validated `uav_analysis_stack/` subset.
- **Manifest:** `UAV_STACK_MANIFEST.csv` including produced and blocked layers.
- **Map/table:** QA mask and plot extraction.
- **Written answer:** 320–420 words explaining the acceptance and stop decisions.

### Portfolio artifact

**Artifact 2.25 — Analysis-ready UAV multispectral stack**

Add the outputs, manifest, QA figure and blocked-layer decision to the **Professional UAV Product Audit and Processing Report**.
