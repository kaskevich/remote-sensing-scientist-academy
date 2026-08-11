---
title: Xarray and Rioxarray
lessonId: lesson-2-38
---

## 1. Read an array by scientific meaning

### Learning outcome

By the end of this lesson, you will be able to distinguish an Xarray `DataArray` from a `Dataset`; explain dimensions, coordinates and attributes; select raster evidence by position and by coordinate label; audit spatial dimensions, coordinate direction, CRS, transform and nodata with Rioxarray; and decide whether a labelled subset remains scientifically interpretable.

- **Lesson type:** Labelled-array reasoning lab
- **Estimated time:** 150–190 minutes
- **Prerequisites:** NumPy arrays, Rasterio metadata, raster alignment and masking
- **Portfolio output:** `xarray_spatial_audit.ipynb`

### Why this matters

A NumPy array can hold millions of correct numbers while forgetting what the axes mean. Is axis zero time, spectral band or row? Does row zero represent the north or south edge? Does `0.21` mean reflectance, NDVI or an unscaled digital number? Remote sensing work becomes fragile when those answers live only in a filename, a colleague's memory or the order of earlier code.

Xarray attaches names and coordinates to array dimensions. Rioxarray adds a geospatial interface for raster CRS, transform, bounds and nodata. Together they make operations readable: selecting `band="nir"` communicates more scientific intent than selecting index `2`. Labels do not guarantee truth, however. Incorrect coordinates can be labelled confidently, attributes can become stale, and automatic alignment can introduce missing values. The professional skill is not merely using Xarray syntax; it is testing whether labels still describe the evidence.

### Scientific context

The Baltic coastal-meadow group has six synthetic training acquisitions. Each contains red, red-edge, near-infrared and scene-classification evidence on one small grid. Before building a time cube, you must establish the contract of a single labelled array.

The pack is intentionally small. Its EPSG:3301 coordinates are invented for instruction and are not published field locations. The ecological question is still serious: can the group organise observations so that later seasonal summaries retain spatial location, measurement identity and validity? You will begin with the declared structure in `meadow_cube_structure.json`, then create a tiny in-memory array whose labels can be inspected without hidden file I/O.

## 2. One concept — labels are part of the evidence

### Concept

The single idea is: **a multidimensional scientific value is interpretable only with the names and coordinates of its axes**.

A **dimension** names an axis, such as `y`, `x`, `time` or `band`. A dimension also has a size. A **coordinate** gives labels associated with a dimension: projected easting values for `x`, northing values for `y`, timestamps for `time`, or names such as `red` and `nir` for `band`. An **attribute** stores descriptive metadata that does not itself index the array, such as units, a long name or processing note.

An Xarray **DataArray** represents one labelled variable. For example, reflectance might have dimensions `(band, y, x)`, coordinates containing band names and cell-centre positions, and attributes defining the scale and units. An Xarray **Dataset** is a container of several aligned named variables. A Dataset might hold `reflectance`, `scl` and `valid_observation_count`, even when those variables do not share every dimension.

This distinction follows scientific structure. A DataArray answers “what is this variable over its axes?” A Dataset answers “which related variables and coordinates constitute this evidence package?”

### Visual explanation

```text
Dataset: meadow_observation
│
├── coordinates
│   ├── band: [red, red_edge, nir]
│   ├── y:    [6500055, 6500045, 6500035]  ← descending northing
│   └── x:    [500005, 500015, 500025, 500035]
│
├── reflectance (band, y, x)  float32
├── scl         (y, x)        uint8
└── spatial_ref ()            CRS / grid-mapping evidence

one value = reflectance at a named band and an Earth-referenced cell centre
```

Dimension order remains operationally important. `(band, y, x)` and `(y, x, band)` can describe the same conceptual axes but have different shapes and memory layouts. Named operations reduce ambiguity; they do not remove the need to inspect order.

[[CHECK:m2-l38-labels]]

## 3. Position and label are different questions

NumPy indexing is positional. `array[0, 0]` means first row, first column. Xarray preserves positional indexing through `.isel()`: `data.isel(y=0, x=0)`. This is appropriate when the scientific question is explicitly about array position, such as inspecting the upper-left stored cell.

`.sel()` uses coordinate labels: `data.sel(x=500005, y=6500055)`. This is appropriate when the question is tied to coordinates or named categories. For continuous coordinates, a requested label may not exist exactly. Xarray can use nearest selection, but tolerance must be declared. An unconstrained nearest match can silently select a far-away cell.

For slices, inspect coordinate direction. North-up rasters commonly have descending `y`: row zero has the largest northing and subsequent rows move south. A label slice for such an axis also runs from the larger value toward the smaller one. If `data.y` descends, `slice(6500055, 6500035)` can select rows; reversing those bounds can return an empty result. Never “fix” the order merely because ascending values look more familiar.

Coordinates also control alignment. When two DataArrays are added, Xarray aligns matching labels. This is powerful when labels are correct. It is dangerous when grids differ unexpectedly: a half-pixel shift can create a union of coordinates and missing values rather than an obvious shape error. Use `xr.align(..., join="exact")` or explicit grid assertions when exact cell-wise comparison is required.

## 4. CRS and grid metadata with Rioxarray

Xarray is general; it does not assume that `x` and `y` locate a raster. Rioxarray connects Xarray objects to Rasterio's geospatial model. A spatial audit should record:

- spatial dimension names and their order;
- coordinate values and direction;
- CRS and its authority when available;
- affine transform, resolution and bounds;
- pixel interpretation and nodata or encoded mask;
- units, scale and offset of the measured variable;
- whether a subset or calculation preserved the required metadata.

For a geospatial file, `rioxarray.open_rasterio(..., masked=True)` can load the raster with labelled spatial coordinates and expose `.rio.crs`, `.rio.transform()`, `.rio.bounds()` and `.rio.nodata`. For an array created in memory, spatial dimensions and CRS may need to be written deliberately. Prefer `rio.write_crs()` for an output that needs a CF-style grid mapping. Merely attaching a text attribute called `crs` is not equivalent.

Do not assign a convenient CRS to unknown coordinates. As in Chapter 1, writing CRS metadata is justified only when the source reference is verified. It does not transform coordinates. Reprojection requires `.rio.reproject()` or another explicit spatial operation.

Attributes require care. Some Xarray operations retain them, some combine them according to options, and some invalidate their meaning even if the text survives. If you calculate NDVI from reflectance bands, a carried attribute saying `long_name: red reflectance` would be wrong. Metadata preservation means validating and updating semantics, not keeping every string mechanically.

[[CHECK:m2-l38-crs]]

## 5. Worked example — build and inspect one labelled raster

### Predict before running

The `y` coordinates descend. Predict the dimensions and shape of `northwest`. Will `.sel()` preserve the coordinate labels? What does the CRS write add, and what does it not change?

```python
import numpy as np
import xarray as xr
import rioxarray  # activates the .rio accessor

values = np.array([[0.18, 0.21, 0.24, 0.20],
                   [0.25, 0.29, 0.31, 0.27],
                   [0.22, 0.26, 0.28, 0.23]])
red = xr.DataArray(values, dims=("y", "x"),
    coords={"y": [6500055, 6500045, 6500035],
            "x": [500005, 500015, 500025, 500035]},
    name="red_reflectance", attrs={"units": "1"})
red = red.rio.write_crs("EPSG:3301")
northwest = red.sel(y=slice(6500055, 6500045),
                    x=slice(500005, 500015))
print(northwest.dims, northwest.shape, northwest.rio.crs)
```

### Code walkthrough

1. NumPy supplies the three-by-four numeric grid.
2. Xarray supplies the labelled-array structure.
3. Importing Rioxarray registers the `.rio` accessor; the name is otherwise unused directly.
4. `values` contains plausible unitless reflectance, not real sensor measurements.
5. `xr.DataArray` declares that the first axis is `y` and the second is `x`.
6. The coordinate dictionary attaches one cell-centre label to every row and column.
7. The decreasing `y` sequence is consistent with a north-up grid whose rows move south.
8. `name` identifies the variable, while `attrs` states that reflectance is unitless.
9. `rio.write_crs()` records the verified training CRS. It neither changes coordinate values nor proves their provenance.
10. `.sel()` requests two northings and two eastings by their labels.
11. The resulting subset remains a `DataArray` with dimensions `("y", "x")`, shape `(2, 2)` and CRS evidence.

After running, inspect `northwest.coords`, `northwest.attrs`, `northwest.rio.transform()` and `northwest.rio.bounds()`. Explain any transform shift caused by the smaller extent. Then compare `red.isel(y=slice(0, 2), x=slice(0, 2))` with the label-based result using `.identical()`.

## 6. Common mistakes and recovery

### Mistake 1 — converting to `.values` at the beginning

Beginners do this because familiar NumPy methods appear immediately. It removes dimension names and coordinates; with a Dask-backed array it may also trigger a large eager load.

**Recognise it:** later code depends on remembering axis numbers, or memory rises during “inspection”.

**Recover:** keep operations in Xarray, select a bounded region first, and convert only a small final result when a downstream library truly requires NumPy.

### Mistake 2 — confusing `.isel()` and `.sel()`

Both look like selection. Passing `500005` to `.isel(x=...)` asks for an enormous positional index, not the coordinate 500005.

**Recognise it:** index-out-of-bounds errors or a selected cell at an unexpected coordinate.

**Recover:** state the question in words: “third stored column” means `.isel(x=2)`; “cell centred at easting 500005 m” means `.sel(x=500005)`.

### Mistake 3 — assuming `y` ascends

Table coordinates often ascend, so a descending raster axis feels wrong.

**Recognise it:** a label slice is empty or the north and south limits appear reversed.

**Recover:** inspect `data.y.values[:3]` and `data.y.values[-3:]`; construct the slice in stored coordinate order.

### Mistake 4 — treating a written CRS as reprojection

The syntax appears successful and the map may render somewhere.

**Recognise it:** coordinate numbers do not change after a supposed transformation.

**Recover:** use `write_crs()` only for verified missing metadata. Use a reprojection operation when the coordinate representation must change, then validate bounds and resolution.

### Mistake 5 — relying on automatic coordinate alignment

Named alignment seems safer than array broadcasting, but a shifted grid can expand coordinates and insert missing values.

**Recognise it:** output shape grows, valid counts fall or coordinate sets differ after arithmetic.

**Recover:** compare sizes, coordinates, CRS and transform before cell-wise operations; require exact alignment when that is the scientific contract.

### Mistake 6 — preserving incorrect attributes

Learners reasonably want metadata to survive. A derived variable can inherit a source description that no longer applies.

**Recognise it:** variable name, units or long name contradicts the calculation.

**Recover:** define metadata as part of the derivation, test it, and document what was intentionally changed.

[[CHECK:m2-l38-selection]]

## 7. Guided practice — produce a spatial contract audit

1. Read the pack `README.md`, verify `manifest.json`, and label every file as synthetic training evidence.
2. Open `meadow_cube_structure.json`. Record dimension names, order, sizes, coordinate direction, CRS, transform, scale factor, nodata and valid scene classes.
3. Recreate the worked DataArray. Print only metadata and a two-by-two subset; do not use `.values` on an unknown-size source.
4. Compare `.isel(y=0, x=0)` and `.sel(y=6500055, x=500005)`. Confirm that their scalar values and coordinates agree.
5. Select the north-west two-by-two area by labels. Record input and output shapes, coordinate limits and CRS.
6. Construct a second DataArray whose `x` coordinates are shifted five metres. Attempt `xr.align(red, shifted, join="exact")` inside a `try` block and interpret the failure as useful QA.
7. Demonstrate the default outer alignment on copies only. Count the introduced missing values and explain why matching shapes would not have protected you.
8. Create a Dataset containing `red_reflectance` and a small `valid_mask`. Explain why their variable meanings differ even though their spatial dimensions align.
9. Fill the relevant sections of `CLOUD_NATIVE_EO_QA_TEMPLATE.md` with the cube contract and uncertainty notes.
10. Save the complete audit as `xarray_spatial_audit.ipynb` and add a short conclusion: accept, conditionally accept or reject the labelled structure for later cube assembly.

## 8. Independent challenge — diagnose a labelled-array handover

Create three deliberately different arrays: the accepted grid, a grid with reversed `y` labels but unchanged values, and a grid shifted five metres in `x`. Without plotting first, write a validator that reports dimension order, coordinate monotonicity, coordinate equality, CRS, shape and exact-alignment result.

Then produce a one-page handover note answering:

- Which array is safe for direct cell-wise comparison?
- Does reversing labels reverse values as well, or merely misdescribe them?
- What transformation or correction would be required, and what evidence is needed first?
- Which checks can be automated and which require source provenance?

Do not “repair” the two problematic arrays for a cleaner conclusion. Preserve them as evidence of distinct failures: spatial displacement and metadata/value disagreement.

## 9. Scientific interpretation

### Scientific interpretation

Labels make a calculation legible. If a result is selected by `time`, `band`, `y` and `x`, a reviewer can see the intended observation dimensions. A labelled two-by-two reflectance subset is still not an ecological conclusion. It gains scientific meaning only when the band definition, scaling, spatial reference, observation time, validity mask and processing lineage are trustworthy.

The accepted outcome of this lesson is therefore a contract, not a colourful raster. It should support the statement: “These values are organised on this declared grid, with these variable semantics and these verified limitations.” It should not support statements about vegetation condition, temporal change or the real published field sites. Those require compatible observations, masks and sampling evidence introduced next.

## 10. Reflection, submission and portfolio artifact

### Reflection

1. When is positional indexing scientifically clearer than label-based indexing?
2. Which error is more dangerous: an unlabeled axis or a confidently wrong coordinate label? Why?
3. What metadata must be rewritten after deriving NDVI from red and NIR reflectance?
4. Why can exact coordinate alignment be a scientific assertion rather than a software preference?

### Submission

Submit:

- `xarray_spatial_audit.ipynb` with all cells run in order;
- `labelled_array_contract.csv` recording dimensions, coordinates, CRS, transform, units, scale, nodata and mask;
- one screenshot showing the bounded selection and its printed coordinates;
- `exact_alignment_diagnosis.md` comparing the accepted, reversed-label and shifted grids;
- a 250–350 word scientific interpretation stating what the labelled structure supports and does not support.

Before uploading, restart the kernel and run all cells. Confirm there are no credentials, absolute private paths or claims that the synthetic coordinates are real meadow locations.

### Portfolio artifact

Add `xarray_spatial_audit.ipynb` to the **UAV and Satellite Analysis Pipeline** under **Artifact 2.H — Cloud-Native EO Discovery and Cube Package**. This is the array-and-metadata gate. Later lessons may extend the notebook, but they must not bypass its exact-alignment and provenance checks.
