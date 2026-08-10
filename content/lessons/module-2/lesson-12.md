---
title: Rasterio: Read, Inspect and Write Spatial Grids
lessonId: lesson-2-12
---

## 1. Treat a raster file as a spatial contract

### Learning outcome

By the end of this lesson, you will be able to open a GeoTIFF with Rasterio, inspect its spatial contract, read one band as a masked NumPy array, preview a small window, write a derivative without overwriting the source, reopen it and prove whether the intended metadata and values survived. You will produce a reusable raster audit report.

**Prerequisites:** Complete Lesson 2.11. You should be able to explain array shape, bands, affine transform, CRS, bounds, data type, NoData and valid-data support. Allow 100–120 minutes. This is a technical lab using Rasterio, NumPy and `pathlib`.

### Why this matters

Opening a file is not validation. A GeoTIFF can be readable while carrying the wrong CRS, a surprising band order, missing descriptions, inappropriate NoData or values outside the expected physical range. Writing a derivative without an exception proves only that bytes were written.

A professional raster workflow uses three deliberate stages:

1. **Inspect without loading unnecessary values.** Establish file identity and spatial structure.
2. **Read values with validity information.** Keep the mask attached to the numerical array.
3. **Write and reopen a derivative.** Compare the result with the declared operation.

> **Round-trip principle:** Writing successfully does not prove equivalence. The reopened file is the evidence.

### Scientific context

The coastal-meadow team has received the synthetic Raster Science pack. In this lesson, you will audit `aligned_continuous.tif`, `aligned_categorical.tif` and `conflicting_nodata.tif`. These layers are small so the complete workflow is visible. The same discipline later protects large UAV and satellite products where a mistaken read can consume gigabytes or attach the wrong band meaning to an analysis.

### Learner action

Create `02_rasterio_audit.ipynb`. Copy the training files into `data/raw/raster_foundations/` without changing their names. Record the pack manifest checksum and the exact source path. Do not open the raster in write mode.

## 2. Rasterio separates dataset access from array work

Rasterio provides a Python interface to GDAL's raster data model. It reads dataset metadata and pixel values from formats such as GeoTIFF. NumPy operates on the arrays returned by Rasterio.

Use a context manager:

```python
from pathlib import Path
import rasterio

path = Path("data/raw/raster_foundations/aligned_continuous.tif")
with rasterio.open(path) as src:
    print(src.driver, src.shape, src.count)
    print(src.crs, src.transform)
```

`rasterio.open(path)` returns an open dataset. `with` keeps it open only inside the indented block and closes file resources afterward, including when an exception occurs. Do not store `src` and continue reading from it after the block. Store the metadata or array you need while the dataset is open.

The default mode is read-only. This protects the source from accidental edits. A write operation should target a new path and use an explicit profile.

[[CHECK:m2-l12-context]]

## 3. Inspect metadata before reading a band

The following properties require little or no full-raster value loading:

| Property | Question answered |
|---|---|
| `src.width`, `src.height` | How many columns and rows exist? |
| `src.count` | How many stored bands exist? |
| `src.crs` | Which horizontal spatial reference is declared? |
| `src.transform` | How are indices mapped to coordinates? |
| `src.res` | What are the grid steps in CRS units? |
| `src.bounds` | Where are the outer grid edges? |
| `src.dtypes` | How is each band encoded? |
| `src.nodata` | Which scalar NoData value is declared? |
| `src.profile` | Which core creation properties describe the dataset? |
| `src.descriptions` | Which band descriptions are stored? |
| `src.block_shapes` | How are bands organised for efficient reading? |

The properties are related. For a north-up grid, width × x resolution should agree with right minus left bounds, and height × y resolution should agree with top minus bottom. This consistency does not prove the CRS is true; it checks that the internal grid contract is coherent.

Also inspect tags, scales, offsets, units and colour interpretation where they affect meaning. A stored integer can require scale and offset before becoming reflectance or temperature. An internal mask can make `src.nodata is None` while still identifying invalid pixels.

## 4. Build an audit that separates structure from meaning

A useful `raster_audit` record should contain:

- path and SHA-256 checksum;
- file size and driver;
- width, height and band count;
- CRS and affine transform;
- resolution and bounds;
- data type per band;
- NoData and mask flags;
- band descriptions, units, scales and offsets;
- valid and masked counts;
- minimum and maximum calculated only over valid cells;
- declared variable meaning and provenance;
- stop, review or proceed status for the intended use.

Checksum confirms file identity, not scientific quality. File size describes storage, not the number of valid observations. A metadata field can be syntactically valid and semantically wrong. Keep these claims distinct.

[[CHECK:m2-l12-audit]]

## 5. Read one band with its mask

`src.read(1)` reads the first band into a NumPy array. It does not mean Red unless the product metadata define band 1 as Red.

Prefer masked reading when a valid-data mask or NoData exists:

```python
import numpy as np
import rasterio

with rasterio.open(path) as src:
    band = src.read(1, masked=True)
    valid_count = int(band.count())
    masked_count = int(np.ma.getmaskarray(band).sum())
    valid_min = float(band.min())
    valid_max = float(band.max())

print(valid_count, masked_count, valid_min, valid_max)
```

A masked array keeps numerical data and a Boolean mask together. Its reductions normally ignore masked elements. `np.ma.getmaskarray()` produces a full Boolean mask even when no cell is masked, avoiding a scalar-mask surprise.

Do not convert the masked array immediately with `np.asarray()`: that can discard the mask. Do not call `band.filled(0)` unless zero is explicitly the correct output fill for the next format and variable. For GeoTIFF output, filling with the declared destination NoData is usually clearer.

## 6. A small window supports preview without a full read

A `Window` identifies a rectangular set of rows and columns. It is useful for a controlled preview:

```python
import rasterio
from rasterio.windows import Window

preview_window = Window(col_off=2, row_off=3, width=4, height=3)
with rasterio.open(path) as src:
    preview = src.read(1, window=preview_window, masked=True)
    preview_transform = src.window_transform(preview_window)

print(preview.shape)
print(preview_transform)
```

The array has only three rows and four columns. `window_transform()` locates that subset correctly. Reusing the source transform for a cropped window would claim that the preview begins at the source origin, which is false.

Windowed reading can still read a complete internal block from storage. It avoids allocating the full array but does not guarantee that every requested byte corresponds exactly to the requested cells. Lesson 2.16 develops blocks and performance.

[[CHECK:m2-l12-window]]

## 7. Worked example — create a compact audit

### Predict before running

For `aligned_continuous.tif`, predict the shape, CRS, resolution, NoData and number of masked cells from the manifest. Which values can be obtained without loading the band?

```python
from pathlib import Path
import hashlib
import rasterio

path = Path("data/raw/raster_foundations/aligned_continuous.tif")
checksum = hashlib.sha256(path.read_bytes()).hexdigest()
with rasterio.open(path) as src:
    band = src.read(1, masked=True)
    audit = {"file": path.name, "sha256": checksum,
             "shape": src.shape, "bands": src.count,
             "crs": str(src.crs), "transform": tuple(src.transform),
             "resolution": src.res, "bounds": tuple(src.bounds),
             "dtype": src.dtypes[0], "nodata": src.nodata,
             "valid": int(band.count()), "masked": int(band.mask.sum()),
             "minimum": float(band.min()), "maximum": float(band.max())}
print(audit)
```

### Code walkthrough

1. `Path` keeps the source path explicit and portable.
2. SHA-256 is calculated from the received bytes before transformation.
3. The context manager opens the file read-only.
4. Band 1 is read with its validity mask.
5. Filename and checksum establish input identity.
6. Shape and count describe grid dimensions and band count.
7. CRS and transform locate the grid.
8. Resolution and bounds provide redundant spatial checks.
9. Data type and NoData describe storage and one missingness mechanism.
10. `count()` reports unmasked cells.
11. The mask sum reports excluded cells.
12. Minimum and maximum operate on valid cells rather than raw `-9999` values.

The audit does not prove that the values are real reflectance. The manifest labels them synthetic and unitless; preserve that limitation.

## 8. Copy the profile, then update only the declared change

`src.profile.copy()` provides creation parameters for a derivative. It is safer than rebuilding every field from memory, but copying metadata is not automatically correct. If dimensions, transform, count, data type or NoData change, update those fields deliberately.

For an exact-value copy exercise:

```python
import rasterio

output = Path("outputs/aligned_continuous_copy.tif")
with rasterio.open(path) as src:
    profile = src.profile.copy()
    band = src.read(1, masked=True)
    with rasterio.open(output, "w", **profile) as dst:
        dst.write(band.filled(src.nodata), 1)
        dst.set_band_description(1, src.descriptions[0])
```

This writes a new file. It does not modify the raw input. Copying the profile may not preserve every tag, colour table, mask, overview or external metadata. Decide which metadata the derivative needs and copy it explicitly. For an analytical transformation, document the change rather than pretending the output is identical.

## 9. Reopen and perform round-trip QA

Compare the reopened derivative with the source:

- shape, band count and band descriptions;
- CRS, transform, resolution and bounds;
- data type, NoData, scales and offsets;
- valid and masked cell counts;
- representative cell values;
- exact array equality when no numerical change was intended;
- tolerance-based equality when a documented floating transformation occurred;
- checksum only when byte-for-byte identity is the requirement.

Different GeoTIFF compression or metadata ordering can produce a different checksum while storing equivalent analytical values. Conversely, the same shape and summary statistics can hide reordered or shifted cells. Select tests from the declared operation.

```python
import numpy as np
import rasterio

with rasterio.open(path) as source, rasterio.open(output) as result:
    same_grid = (source.crs == result.crs and
                 source.transform.almost_equals(result.transform) and
                 source.shape == result.shape)
    same_values = np.ma.allequal(source.read(1, masked=True),
                                 result.read(1, masked=True))
print("same grid:", same_grid, "same values:", same_values)
```

[[CHECK:m2-l12-roundtrip]]

## 10. Common mistakes and recovery

### Reading everything before inspecting shape and type

**Why it happens:** `read()` is the shortest route to values. **Recognition:** memory requirements were never estimated. **Fix:** inspect width, height, count and data types before selecting bands and windows.

### Calculating statistics on raw NoData

**Why it happens:** the raw array looks ordinary. **Recognition:** minimum equals `-9999` or another sentinel. **Fix:** use `masked=True`, inspect the mask and report valid-cell counts with statistics.

### Assuming band one is Red

**Why it happens:** RGB examples create a familiar order. **Recognition:** no band description or product specification is cited. **Fix:** resolve band identity from metadata and provenance before naming the array.

### Overwriting the source

**Why it happens:** the derivative seems to be a corrected version. **Recognition:** input and output paths are identical. **Fix:** keep raw data immutable and write staged derivatives under a separate folder.

### Treating a successful reopen as full equivalence

**Why it happens:** the file is readable. **Recognition:** no grid, mask or representative-value comparison follows. **Fix:** run operation-specific assertions after reopen.

## 11. Guided practice — audit three training rasters

Create one audit row for each of:

1. `aligned_continuous.tif`;
2. `aligned_categorical.tif`;
3. `conflicting_nodata.tif`.

For every raster:

1. record checksum and file size;
2. inspect driver, width, height, count, CRS, transform, resolution and bounds;
3. record band descriptions, data types, NoData, scales, offsets and mask flags;
4. read only band 1 as a masked array;
5. report valid and masked counts;
6. report min and max over valid values;
7. list unique valid class codes for the categorical raster;
8. prove that zero is valid in the conflicting-NoData raster;
9. read and plot one small window with its own transform;
10. export `raster_audit_report.csv` and reopen the CSV.

### Raster QA check

In QGIS, inspect the three files' Information and Symbology panels. Confirm dimensions, CRS, extent, data type and NoData against the Python audit. Apply an explicit categorical renderer to the habitat classes and a continuous renderer to the other rasters. Record how the default renderer could have hidden the valid zero or missing cell.

## 12. Independent challenge — write and verify two derivatives

Create two outputs from `aligned_continuous.tif`:

- an exact analytical copy with preserved grid and values;
- a scaled display derivative whose valid values are multiplied by 100 and whose metadata state the new stored-value convention.

For each output, define the expected equality before writing. Reopen both. Use exact comparison for the copy and an explicit numerical relationship for the scaled derivative. Compare mask counts, representative pixels and metadata. Explain why the scaled output cannot be called identical even if its map looks the same under a different stretch.

### Scientific interpretation

The audit and round-trip checks establish that a specific file has a declared grid, readable values and a verified derivative under stated tests. They do not establish calibration, positional accuracy, habitat truth or fitness for ecological modelling. File integrity and scientific validity are connected but different review layers.

## 13. Reflection, submission and portfolio artifact

Answer in your private notes:

1. Which properties can be inspected without reading a full band?
2. Why is a masked array safer than replacing NoData manually?
3. When is a checksum useful, and what can it not prove?
4. Why does a cropped window need a new transform?
5. Which comparisons prove an unchanged-grid copy?

### Submission

- **Notebook:** `02_rasterio_audit.ipynb` with the complete three-file audit, window preview and two derivative checks.
- **Table:** `raster_audit_report.csv` containing file identity, spatial contract, validity and summary fields.
- **Screenshot:** Python and QGIS metadata shown side by side for one raster.
- **Written answer:** 200–260 words explaining what the round-trip evidence proves and which scientific claims remain unresolved.

### Portfolio artifact

**Artifact 2.12 — Raster audit report**

Add the audit function, CSV and round-trip assertions to the input-validation stage of the **Raster QA and Harmonisation Pipeline**. Later transformations must extend this record rather than replacing it.
