---
title: EO Data Cubes
lessonId: lesson-2-39
---

## 1. Build comparison into the cube

### Learning outcome

By the end of this lesson, you will be able to explain the progression from a spatial band to a `band × y × x` observation and a `time × band × y × x` Earth Observation cube; define a measurement, grid, time and validity contract before stacking; select and mask labelled observations; create a seasonal composite with valid-observation counts; and judge whether the result supports comparison.

- **Lesson type:** EO cube construction lab
- **Estimated time:** 170–220 minutes
- **Prerequisites:** Xarray dimensions and coordinates, raster grids, optical reflectance and quality masks
- **Portfolio output:** `eo_data_cube.ipynb`

### Why this matters

A folder of images is not automatically a time series, and a four-dimensional array is not automatically a defensible data cube. Remote sensing observations can differ in grid origin, processing baseline, scale, band meaning, mask availability, acquisition geometry and time. Software may stack them successfully while scientific comparability fails.

An EO cube makes repeated questions concise: select a period, retrieve one measurement, mask invalid support, aggregate through time and retain spatial coordinates. That convenience increases responsibility. One composite pixel may be based on six clear observations while its neighbour is based on one. A median surface without an observation-count surface hides uneven evidence.

The professional habit is to build a **cube contract** before building the cube. It states what a value means and under which conditions two values may be compared. The array then implements that contract rather than inventing one through defaults.

### Scientific context

The Baltic coastal-meadow team wants a seasonal reflectance summary to support later field-plot extraction. The Chapter 8 pack contains six synthetic dates. One acquisition is shifted by half a pixel. Another lacks a local quality mask. A scene with 42 percent catalogue cloud still has 81 percent clear support over the small training area, while the low scene-cloud value does not prove every study pixel is clear.

You must decide which dates can enter a common cube, preserve reasons for exclusion or review, apply scale before interpretation, mask invalid local pixels and publish both a seasonal statistic and its observation count. The exercise does not infer vegetation change. It creates the defensible evidence structure that a later analysis could use.

## 2. One concept — a cube is a comparability contract

### Concept

The single idea is: **stack observations only when their measurement and coordinate contracts make comparison meaningful**.

Start with one band:

```text
red(y, x)
```

Add named measurements acquired together:

```text
reflectance(band, y, x)
band = [red, red_edge, nir]
```

Add repeated observation time:

```text
reflectance(time, band, y, x)
```

This structure separates measurement axes. `band` is not interchangeable with `time`; `y` and `x` are not merely matrix positions. Other variables can use a subset of those axes: `scl(time, y, x)` contains a classification per date and cell, while `spatial_ref` may be scalar metadata.

The cube contract must define at least:

- the physical quantity, units and scaling for each measurement;
- band identity and spectral meaning;
- spatial CRS, resolution, origin, transform, bounds and cell support;
- timestamp convention, timezone and duplicate-time policy;
- nodata and valid-data classes;
- whether observations share processing level and baseline;
- alignment and resampling decisions;
- provenance from each cube slice back to a source Item and asset.

If one acquisition is shifted half a cell, its shape may still match. Exact coordinate comparison should stop stacking. A justified reprojection could create a compatible derivative, but its interpolation, support and lineage must be recorded. If the source meaning is uncertain, quarantine is safer than silent alignment.

[[CHECK:m2-l39-contract]]

## 3. Selection, masking and aggregation

Labelled selection can narrow a cube by time, band and space:

- `.sel(time=slice("2025-05-01", "2025-08-31"))` selects an inclusive labelled period;
- `.sel(band=["red", "nir"])` selects measurements by name;
- `.sel(x=slice(...), y=slice(...))` selects a spatial window in stored coordinate direction;
- `.isel(time=0)` selects the first stored acquisition by position.

Selection is not filtering for quality. A mask expresses which observations are usable for the intended calculation. In the training contract, SCL classes 4, 5 and 6 are provisionally valid; other classes are invalid. A real project must review the product definition, processing baseline and ecological need rather than copying those classes universally.

`where(valid)` retains coordinates while replacing invalid values with missing values. This often promotes an integer array to floating type because IEEE `NaN` represents missing numeric values. Record the representation change. Never convert nodata or masked pixels to zero unless zero is explicitly the scientific value.

Aggregation reduces one or more dimensions. `median("time", skipna=True)` creates a robust seasonal summary at each remaining band and cell, but “robust” does not mean unbiased. Clouds, acquisition timing and phenological sampling can remain uneven. Always calculate `count("time")` under the same mask and period. Then apply a predeclared minimum count or communicate low-support cells separately.

### A composite is not one acquisition

A median composite combines values from multiple dates. Neighbouring output cells can come from different temporal subsets. The output does not have one sensor acquisition time in the ordinary sense. Its metadata should record the period, reducer, mask rule, eligible source IDs and count distribution. It supports a statement such as “median valid reflectance during the declared interval”, not “reflectance observed on 1 July”.

## 4. Assemble without losing provenance

`xr.concat(arrays, dim="time")` can assemble repeated arrays after exact grid checks. `xr.combine_by_coords()` can be useful for structured collections but may align coordinates in ways that conceal a source mismatch if you do not validate first. Choose the combining operation from the declared contract.

Before concatenation:

1. verify unique Item or acquisition identifiers;
2. parse timestamps with a declared timezone;
3. sort by time only after retaining original IDs;
4. reject or reconcile duplicate timestamps explicitly;
5. compare band sets and order;
6. require exact spatial coordinates, CRS and transform;
7. confirm scaling, offset and nodata semantics;
8. keep the quality mask paired with its acquisition.

After concatenation, reconcile the number of accepted inventory records with the `time` size. Confirm that every `time` coordinate maps to exactly one recorded source ID. Save excluded items and reasons; absence from the cube must not become invisible.

The supplied `observation_inventory.csv` is the decision surface. `SYN_M2_20250719` has a shifted grid and should not enter direct stacking. `SYN_M2_20250814` lacks the local mask required by the current rule. You may conditionally include it only if you establish a defensible replacement mask; scene cloud percentage is not that replacement.

[[CHECK:m2-l39-mask]]

## 5. Worked example — make a masked seasonal summary

### Predict before running

Assume `cube` is an already validated Dataset. Predict whether every median pixel will use the same number of dates. What dimensions remain after selecting `nir` and reducing `time`? What happens where every observation is invalid?

```python
valid = cube["scl"].isin([4, 5, 6])
nir = cube["reflectance"].sel(band="nir")
nir = nir * cube["reflectance"].attrs["scale_factor"]
season = nir.sel(time=slice("2025-05-01", "2025-08-31"))
season_valid = season.where(valid.sel(time=season.time))
median_nir = season_valid.median("time", skipna=True)
valid_count = season_valid.count("time")
supported = median_nir.where(valid_count >= 3)
print(supported.dims, supported.shape)
print(valid_count.min().item(), valid_count.max().item())
```

### Code walkthrough

1. `isin([4, 5, 6])` turns the declared SCL rule into a Boolean validity array.
2. The band label selects NIR without relying on its position in storage.
3. The scale factor converts stored digital numbers into the declared reflectance representation. A real source may also require an offset.
4. The time slice limits the analysis period before aggregation.
5. The validity array is selected to the same time labels, then applied without dropping coordinates.
6. `median("time")` removes only the time dimension; `y` and `x` remain.
7. `count("time")` counts non-missing NIR observations under exactly the same mask.
8. The minimum of three observations is an analysis rule that must be justified and recorded.
9. Printing dimensions and counts is a reconciliation step, not the complete QA.

The worked example is intentionally concise. Your notebook must also verify reflectance range after scaling, exact coordinate alignment, CRS, source-item mapping, period boundaries, count histogram and metadata on written outputs. If a cell has no valid observations, its median remains missing. That is evidence about observation availability, not zero reflectance.

## 6. Common mistakes and recovery

### Mistake 1 — stacking by filename order

Filenames often sort differently from acquisition time, and duplicate or missing dates can pass unnoticed.

**Recognise it:** `time` is an integer index or the time order cannot be reconciled to source IDs.

**Recover:** parse verified timestamps, keep source Item IDs as coordinates or provenance variables, assert uniqueness and reconcile inventory counts.

### Mistake 2 — using shape equality as grid equality

Arrays with equal rows and columns feel compatible.

**Recognise it:** coordinates, transform or bounds differ despite equal shape.

**Recover:** require exact coordinate, CRS and transform agreement. If a resampling derivative is justified, preserve the original and record method and support consequences.

### Mistake 3 — averaging before masking

Cloud and shadow values remain numeric, so the reducer completes.

**Recognise it:** composites are bright, dark or spatially discontinuous in known contaminated areas; counts include invalid observations.

**Recover:** build and inspect the Boolean mask first, apply it to the unaggregated observations, then derive both summary and count.

### Mistake 4 — treating scene cloud cover as local validity

Catalogue filtering is convenient. A low scene percentage can coexist with cloud over the small meadow; a cloudy scene can contain a clear meadow area.

**Recognise it:** items are accepted or rejected without examining a local mask.

**Recover:** use scene cloud for discovery, local pixel QA for analysis, and document both.

### Mistake 5 — forgetting scale and offset

Digital numbers resemble plausible large measurements and the cube still plots.

**Recognise it:** reflectance exceeds the declared range or different processing baselines have incompatible values.

**Recover:** read source metadata, apply scale and offset once, record the representation and validate ranges. Do not apply scaling twice.

### Mistake 6 — publishing a composite without counts

The summary map looks complete and counts seem like an internal detail.

**Recognise it:** reviewers cannot tell whether cells summarize one date or many.

**Recover:** publish observation count and mask provenance as first-class companion products.

### Mistake 7 — assuming metadata automatically remains true

Xarray may retain some coordinates and attributes, giving reassurance.

**Recognise it:** an output still says “single acquisition” after temporal aggregation or retains a source timestamp.

**Recover:** write derived metadata explicitly: period, reducer, eligibility rule, scale, units, source IDs and count requirement.

[[CHECK:m2-l39-composite]]

## 7. Guided practice — create the deterministic meadow cube

1. Verify the Chapter 8 manifest and load `observation_inventory.csv` with parsed UTC dates.
2. Create an acceptance table. Keep the shifted-grid and missing-mask records in review rather than deleting them.
3. Load `cube_pixel_samples.csv`. State that it is a long-form fixture representing four labelled pixels, not the full six-by-eight declared grid.
4. Check uniqueness of `(item_id, pixel_id)` and reconcile every sample Item to the inventory.
5. Convert `red_dn`, `red_edge_dn` and `nir_dn` using the declared scale factor. Validate the scaled range and preserve original digital numbers in the immutable input table.
6. Convert the accepted sample table to labelled Xarray variables with dimensions `time`, `band` and `pixel_id`. For this compact diagnostic, keep `x_m` and `y_m` as coordinates of `pixel_id`.
7. Apply `valid_local`, create May–August median NIR and valid-observation count, and require at least three observations.
8. Report which pixels fail the threshold and which dates contribute to each accepted median.
9. Repeat one reducer with mean. Explain why a numerical difference does not identify which reducer is scientifically preferable.
10. Create `cube_contract.md` for the future full `time × band × y × x` cube. Include grid, measurement, time, mask, provenance and duplicate rules.
11. Save `observation_count.csv`, `seasonal_nir_summary.csv` and an inventory reconciliation.
12. Complete the cube and output sections of `CLOUD_NATIVE_EO_QA_TEMPLATE.md`.

## 8. Independent challenge — test one changed rule

Choose one justified sensitivity question:

- minimum valid observations of two versus three;
- median versus mean reducer;
- May–August versus June–August interval;
- inclusion versus exclusion of one reviewed acquisition after a documented correction.

Predeclare the comparison and keep every other rule fixed. Produce a table showing value change and valid count by pixel. Map or plot the difference only after the table is checked. Explain whether the scientific conclusion would change and whether that change reflects vegetation evidence, sampling support or a processing decision.

Do not select the preferred rule by choosing the most visually attractive result. The challenge evaluates decision transparency, not a particular reducer.

## 9. Scientific interpretation

### Scientific interpretation

A seasonal NIR or index composite is a summary of valid observations under explicit rules. It can reduce cloud gaps and expose broad spatial patterns, but it compresses phenology and acquisition history. A high median could represent consistently high response or a small number of favourable observations. The valid-count layer distinguishes some of that support; it does not remove atmospheric, geometric or sensor uncertainty.

For the synthetic meadow pixels, interpret values only as evidence that the workflow preserves labelled measurements and variable observation counts. Do not call the output biomass, habitat condition or real coastal-meadow change. Those claims require calibrated variables, field-support matching, representative time sampling and validation. The scientifically mature result of this lesson is a cube whose limitations are visible enough to prevent those overclaims.

## 10. Reflection, submission and portfolio artifact

### Reflection

1. Which parts of a cube contract can software test exactly, and which require product documentation or domain judgment?
2. Why is a local validity mask conceptually different from a scene-level discovery filter?
3. What scientific information is lost when time is reduced to one median?
4. When would preserving an irregular set of acquisition times be better than resampling to regular monthly dates?

### Submission

Submit:

- `eo_data_cube.ipynb`, restarted and run from start to finish;
- `cube_contract.md` with measurement, grid, time, mask and provenance rules;
- `observation_inventory_decisions.csv` including accepted and reviewed Items;
- `seasonal_nir_summary.csv` and `observation_count.csv`;
- one figure pairing the seasonal summary with observation support;
- a 300–450 word interpretation of comparability, missingness and limitations.

The submission must preserve the synthetic-data statement and must not contain remote credentials or private signed URLs.

### Portfolio artifact

Add `eo_data_cube.ipynb` to **Artifact 2.H — Cloud-Native EO Discovery and Cube Package**. It is the measurement-and-comparability gate that extends the labelled-array audit. The next lesson will change how larger versions execute, not the scientific rules they implement.
