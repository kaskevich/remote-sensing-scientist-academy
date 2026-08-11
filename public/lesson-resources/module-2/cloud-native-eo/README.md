# Chapter 8 — Multidimensional and Cloud-Native Data

This compact training pack supports Lessons 2.38–2.42 and the Chapter 8 practicum. It is designed for deterministic learning on an ordinary laptop. No learner is required to download a remote archive or rely on a live catalogue to complete the assessed work.

## Scientific status

Every observation, coordinate, asset URL and catalogue record in this directory is **synthetic training evidence**. The values imitate plausible optical Earth Observation structure but are not measurements from the published Baltic coastal plant-traits dataset and must not be presented as real field locations or acquisitions.

The continuing scientific context is a research group preparing a seasonal evidence cube for Baltic coastal-meadow monitoring. The real dataset remains the ecological context; this pack supplies small, licensed computational fixtures for learning cloud-native methods safely.

## Files

- `meadow_cube_structure.json` — declared dimensions, coordinates, variables, attributes, nodata policy and candidate chunk layout;
- `observation_inventory.csv` — six synthetic acquisitions with scale, mask and common-grid evidence;
- `cube_pixel_samples.csv` — small long-form reflectance and validity records for four labelled pixels through six dates;
- `chunk_scenarios.csv` — deliberately contrasting chunk plans and access patterns;
- `cloud_format_inventory.csv` — COG, ordinary GeoTIFF and Zarr claims requiring verification;
- `stac_items_fixture.json` — deterministic STAC ItemCollection with synthetic Items and assets;
- `CLOUD_NATIVE_EO_QA_TEMPLATE.md` — reusable evidence and release template;
- `manifest.json` — file sizes, SHA-256 checksums, licence and data-status declarations.

## Required handling

1. Preserve the supplied files unchanged under `inputs/`.
2. Verify checksums against `manifest.json` before analysis.
3. Record Python, Xarray, Rioxarray, Dask, Zarr and STAC-client versions actually used.
4. Keep raw digital numbers, scaled reflectance and derived indices distinguishable.
5. Declare dimension order, coordinate direction, CRS, affine transform, nodata and mask meanings.
6. Treat scene cloud cover as discovery metadata, not proof that the meadow study area is clear.
7. Bound every compute by space, time, band or output size before execution.
8. Save catalogue endpoint, request, returned Item IDs, asset roles and retrieval time.
9. Never store access tokens, signed query strings or private credentials in the notebook.

## Suggested local environment

Use a dedicated environment and record resolved versions. A typical environment contains Python, JupyterLab, NumPy, pandas, Xarray, Rioxarray, Rasterio, Dask, Zarr and PySTAC Client. Exact pins belong in the learner's submitted `environment.txt`; this pack does not claim that every future package combination is interoperable.

## Licence

The synthetic training fixtures in this directory are released under CC0-1.0. External standards and documentation retain their own licences.
