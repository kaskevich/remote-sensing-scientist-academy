# UAV and Photogrammetry synthetic training pack

This compact pack supports Module 2 Chapter 4. Every coordinate, flight record, residual, image value and quality defect is **synthetic**. The files do not contain private imagery, unpublished field locations or observations from the published Baltic coastal-meadow dataset. They are released as CC0-1.0 training fixtures.

## Intended learning use

Use the pack to practise the decision chain between acquisition and analysis-ready data:

1. audit mission and image metadata;
2. calculate nominal GSD, image footprint and planned spacing;
3. distinguish control-point fitting evidence from withheld check-point validation;
4. inspect reconstruction diagnostics without treating reprojection error as positional proof;
5. diagnose a mosaic seam, changing illumination, a shifted band, DSM artefacts and inconsistent NoData;
6. calculate vegetation indices only after band identity, scale, alignment and masks are resolved;
7. decide whether each product is acceptable, needs review or is unsuitable for a stated analysis.

## Tables and records

- `mission_metadata.csv` records one synthetic 80 m AGL mission, sensor geometry, planned overlap, timing and positioning. The field date is deliberately four days earlier than the flight.
- `image_metadata.csv` contains twelve image records. `IMG_0007` has a blur warning; line `L03` changes exposure and irradiance; `IMG_0010` has increased saturation.
- `gcp_residuals.csv` contains six points used as control. These residuals describe the fitted solution and are not independent accuracy evidence.
- `checkpoint_residuals.csv` contains five withheld points. The south-east point exposes local warping; the residual field also contains a small directional bias.
- `photogrammetry_report.json` is software-neutral. It deliberately reports one unaligned image, a weak block edge and missing evidence despite a low internal reprojection error.

## Raster products

All rasters use a synthetic EPSG:3301 grid with 0.2 m cells unless the deliberate defect says otherwise.

| File | Meaning | Deliberate condition |
|---|---|---|
| `uav_red.tif` | synthetic Red reflectance proxy | reference grid and `-9999` NoData |
| `uav_green.tif` | synthetic Green reflectance proxy | aligned reference band |
| `uav_rededge.tif` | synthetic scaled Red Edge values | scale is deliberately ambiguous; NoData is `65535` |
| `uav_nir.tif` | synthetic NIR reflectance proxy | aligned reference band |
| `uav_nir_shifted.tif` | copy of NIR values | origin shifted by half a 0.2 m cell |
| `uav_dsm.tif` | synthetic upper-surface model | vertical datum undocumented; not a DTM |
| `uav_dsm_spike_demo.tif` | damaged DSM copy | one 18.5 m spike and one -3 m pit |
| `uav_radiometric_gradient_demo.tif` | uncorrected Red proxy | strong west–east illumination gradient |
| `uav_rgb_preview.tif` | 8-bit RGB mosaic preview | brightness seam and local ghosted texture |

`study_area.geojson` and `field_plots.geojson` use RFC 7946 longitude–latitude order. Transform them into the raster CRS before overlay or extraction. Their locations are synthetic and must never be presented as Baltic field sites.

## Stop conditions

Do not calculate indices from `uav_rededge.tif` until authoritative scale metadata are supplied. Do not combine `uav_nir_shifted.tif` cell by cell with the reference grid. Do not describe the DSM as bare ground or direct vegetation height. Do not accept the full mosaic solely because most check points or internal diagnostics look good.

## Reproduction and validation

The pack was generated with Python 3.12.13, Rasterio 1.4.4 and NumPy 2.4.2:

```bash
python scripts/generate_uav_training_pack.py
python scripts/validate_uav_training_pack.py
```

The validator checks every checksum and file, the mission calculations, residual statistics, band alignment, scale ambiguity, safe NDVI behaviour, DSM spike/pit, radiometric gradient, mosaic seam and all declared defects.
