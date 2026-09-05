# Field Lab 07 — Complete UAV Mission Checklist

Use this checklist with the chronological Field Lab tutorial. A checked action does not override a failed QA gate.

## Phase 0 — before the flight

- [ ] Charge batteries; pack the aircraft, wings, selected payload, connections, media, workstation and communication hardware.
- [ ] Prepare the mission map and offline mapping; confirm site access and weather.
- [ ] Prepare visible GCP targets, the approved Trimble/RTK job, transfer media and backup storage.
- [ ] Record the intended sensor, altitude, GSD, forward overlap, side overlap and mission naming convention.
- [ ] On site, inspect the survey boundary and approved take-off/landing area.
- [ ] Distribute and survey GCPs around and within the block where control is used; preserve point IDs.
- [ ] Assemble the eBee X and payload under the current approved manufacturer/project procedure.
- [ ] In eMotion, verify current location, mission, polygon, camera, altitude/GSD, both overlaps and landing geometry.
- [ ] Complete eMotion prechecks; verify storage, battery, GNSS and current weather/light.
- [ ] Capture the mission settings and record log ID, start/end with time zone, camera, image count and deviations.

## Plan and acquire

- [ ] 01 — Define the ecological response, site boundary, products, sensor, target GSD and overlap.
- [ ] 02 — Confirm the operating area, launch/recovery plan, plot identifiers and control/check strategy.
- [ ] 03 — Build the correct eMotion mission and review payload, altitude, overlap, coverage and endurance.
- [ ] 04 — Use the approved eBee X pre-flight/flight procedure and record every mission deviation.
- [ ] 05 — Retrieve, copy and inventory images, logs and GNSS evidence; preserve raw files unchanged.

## Match and position

- [ ] 06 — Match one flight log to the correct image folder; verify site, date, count and time basis.
- [ ] 07 — Load overlapping reference RINEX data, process PPK and audit the solution.
- [ ] 08 — Export the approved Trimble control/check points and verify schema, units and EPSG:3301.

## Reconstruct and control

- [ ] 09 — Create the Pix4D project with corrected imagery, verified camera groups and coordinate systems.
- [ ] 10 — Run Initial Processing only.
- [ ] 11 — Read the initial Quality Report and accept or block the camera network.
- [ ] 12 — Import GCPs with explicit point-ID and X/Y/Z column mapping.
- [ ] 13 — Mark every accepted GCP in multiple suitable images.
- [ ] 14 — Reoptimize, audit residuals and correct/repeat when required.
- [ ] 15 — Generate and inspect the dense point cloud from accepted geometry.

## Build products

- [ ] 16 — Generate and verify the DSM, including CRS, grid, NoData and surface artefacts.
- [ ] 17 — Generate and inspect the RGB orthomosaic, seams, alignment, extent and resolution.
- [ ] 18 — Generate Green, Red, Red Edge and NIR reflectance GeoTIFFs and audit calibration/alignment.
- [ ] 19 — Process the actual Duet T thermal product; do not interpret a colour palette as a measurement.
- [ ] 20 — Calculate the eight verified vegetation indices from compatible reflectance bands.

## QA and handoff

- [ ] 21 — Reconcile Quality Reports, products, grids, plots, control, warnings and exclusions.
- [ ] 22 — Archive raw/processing/output/QA folders and deliver rasters, manifest, checksums and plot summaries.

## Release gate

- [ ] The mission can be traced from ecological question to field plot, sensor, processing state and accepted product.
- [ ] CRS, units, scaling, NoData, resolution, extent and grid alignment are recorded.
- [ ] Field plots fall inside accepted coverage.
- [ ] The handoff distinguishes observed, processed, derived and modelled information.
- [ ] No claim says the UAV directly measured species identity, CCI, leaf area, height or AGB.
