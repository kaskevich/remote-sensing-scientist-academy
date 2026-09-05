# eBee Postflight Checklist

Field Lab 07 · Drone Lab · 2024 project workflow

## Retrieve and preserve

- [ ] Follow the approved eBee X hardware and media-access procedure.
- [ ] Copy flight logs.
- [ ] Copy RGB, multispectral and thermal images used by the mission.
- [ ] Copy GNSS/raw positioning information.
- [ ] Compare file counts and sizes with the source media.
- [ ] Preserve the raw copy unchanged.
- [ ] Process only from the project drive.

## eMotion Postflight and PPK

- [ ] Start eMotion Postflight / Flight Data Manager.
- [ ] Verify site, mission, date, start/end and time basis.
- [ ] For the 2024 summer campaign, check the UTC-to-Estonia-local UTC+3 relationship.
- [ ] Select a RINEX/base-station interval covering the complete mission with margin.
- [ ] Match the correct flight log to the correct image folder.
- [ ] Confirm the expected image count and investigate every mismatch.
- [ ] Load the required observation/navigation data and process PPK.
- [ ] Inspect fix status, base information, time overlap and positional improvement.
- [ ] Export corrected imagery/geotags and retain processing evidence.

## PIX4Dmapper geometry and control

- [ ] Add the required corrected image groups.
- [ ] For Duet T, verify both S.O.D.A. RGB and thermal imagery/camera models.
- [ ] Verify the project and GCP CRS; the 2024 study analysis uses EPSG:3301.
- [ ] Run Initial Processing only.
- [ ] Read the initial Quality Report before continuing.
- [ ] Export approved GCPs from the correct Trimble Access project/job when control is used.
- [ ] Verify CSV point names, coordinate columns/order, elevation, delimiter, units and CRS.
- [ ] Import the CSV through Project → GCP/MTP Manager.
- [ ] Manually mark every accepted GCP in enough suitable images.
- [ ] Reoptimize.
- [ ] Inspect residuals, outliers, marking quality and control distribution.
- [ ] Correct and reoptimize again when required.
- [ ] Preserve independent check points where available.

## Dense products and handoff

- [ ] Uncheck Initial Processing after accepting geometry.
- [ ] Enable Point Cloud and Mesh.
- [ ] Enable DSM, Orthomosaic and Index.
- [ ] Select and document the point-cloud density appropriate to the purpose.
- [ ] Request RGB orthomosaic and DSM outputs as needed.
- [ ] Request Green, Red, Red Edge and NIR Reflectance Map GeoTIFFs.
- [ ] Run steps 2 and 3.
- [ ] Review the final Quality Report.
- [ ] Open every output independently.
- [ ] Verify CRS, resolution, grid, extent, units, band identity, masks and NoData.
- [ ] Archive raw data, processing state, outputs, metadata and QA separately.

## Stop gates

Stop if the mission, time basis, RINEX interval, camera model, CRS, GCP column order, radiometric calibration, raster grid, NoData, output support or field coverage is unresolved.

Processing completed does not mean scientifically valid.

