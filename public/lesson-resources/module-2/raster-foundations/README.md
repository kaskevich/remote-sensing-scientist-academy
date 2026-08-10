# Raster Science synthetic training pack

This pack exists only for Academy instruction. Every raster value, coordinate,
habitat code and support polygon is synthetic. The files contain no unpublished
UAV imagery, private field coordinates or observations from the Baltic coastal
plant-traits dataset. They may be reused under CC0-1.0.

Use `manifest.json` as the machine-readable contract. It records each raster's
purpose, CRS, affine transform, resolution, shape, bounds, data type, NoData,
measurement semantics, expected QA result and SHA-256 checksum. Verify the
checksum before analysis, then inspect the file metadata independently.

## Why the pack contains mismatches

`aligned_continuous.tif` is the reference grid. `aligned_categorical.tif`
shares its grid but stores habitat class codes. Other files deliberately differ:

| File | Deliberate condition |
|---|---|
| `shifted_origin.tif` | same CRS, resolution and shape; half-cell origin shift |
| `different_crs.tif` | geographic rather than EPSG:3301 coordinates |
| `different_resolution.tif` | 20 m cells and a 6 × 6 grid |
| `cropped_extent.tif` | smaller spatial extent and dimensions |
| `conflicting_nodata.tif` | valid zero plus explicit `-9999` NoData |
| `missing_crs.tif` | no CRS metadata; a mandatory stop condition |
| `training_dem.tif` | synthetic terrain surface; vertical datum undocumented |
| `training_dsm.tif` | synthetic upper surface aligned with the DEM |
| `large_tiled_continuous.tif` | 256 × 256 raster stored in 64 × 64 blocks |

The practicum inputs deliberately mix CRS, resolution, grid origin, extent and
NoData conventions. The learner must not edit them in place.

## Suggested project layout

```text
raster_science/
├── data/raw/raster_foundations/      # unchanged downloads
├── data/interim/                     # named processing stages
├── outputs/aligned/                  # verified target-grid rasters
├── outputs/tables/                   # audits and extraction results
├── outputs/maps/                     # QA maps
└── RASTER_QA_REPORT.md
```

## Required handling rules

1. Keep raw files immutable and record their checksums.
2. Treat CRS, transform, dimensions, resolution, bounds and NoData as one grid
   contract. A match in only one field is not alignment.
3. Use nearest-neighbour resampling for the categorical habitat codes unless a
   different class-preserving method is explicitly justified.
4. Do not convert NoData to zero. Zero is valid in
   `conflicting_nodata.tif`.
5. Reopen every written GeoTIFF and compare its metadata, valid-cell count and
   representative values with the declared operation.
6. Treat `training_dsm.tif - training_dem.tif` as a synthetic surface
   difference only. It is not validated vegetation height.
7. Use QGIS for visual QA and Python for reproducible computation. Neither view
   alone proves scientific validity.

## Reproducibility

The pack was generated with `scripts/generate_raster_training_pack.py` using
the versions recorded in `manifest.json`. Regeneration changes checksums and
must be reviewed like a data release. Validate the pack with:

```bash
python3 scripts/validate_raster_training_pack.py
```

The validator requires the pinned packages in
`requirements-raster-validation.txt`.
