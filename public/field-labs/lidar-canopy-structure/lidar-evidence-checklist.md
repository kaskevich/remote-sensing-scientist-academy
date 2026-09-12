# Field Lab 09 — LiDAR structural evidence checklist

## Define
- [ ] Name the target product and ecological or terrain question
- [ ] State horizontal support, vertical units and vertical reference
- [ ] Reserve independent field or surveyed checkpoints
- [ ] State non-claims before processing

## Inventory and point QA
- [ ] Preserve exact LAS/LAZ source files and metadata
- [ ] Record LAS version, point format, CRS, vertical datum/geoid and units
- [ ] Verify tile count, extents, overlaps and gaps
- [ ] Map point density/distribution rather than only a project-wide mean
- [ ] Inspect flightline overlap and relative vertical consistency
- [ ] Record scan-angle and source-ID coverage where available
- [ ] Flag noise/outliers without deleting the source evidence

## Ground and normalization
- [ ] Review ground classification in map and cross-section views
- [ ] Inspect slopes, water edges, low vegetation, bridges and buildings
- [ ] Interpolate a DTM with a documented method and void mask
- [ ] Validate DTM elevation against independent open-ground checkpoints
- [ ] Calculate height above ground while preserving original z
- [ ] Audit negative and implausibly high normalized heights

## Metrics and validation
- [ ] Define grid cell or plot support before computing metrics
- [ ] Record included classes, minimum point count and empty-cell behavior
- [ ] Test maximum/percentile metrics for outlier sensitivity
- [ ] Keep DSM, DTM and CHM as different products
- [ ] Compare final structural metrics with held-out observations at compatible support and timing
- [ ] Report sample count, signed bias and an error metric

## Handoff
- [ ] Export accepted and flagged point clouds in an open format
- [ ] Export DTM, CHM, density, void and applicability rasters on the declared grid
- [ ] Save classification, filter, interpolation and grid settings
- [ ] Confirm products open outside the production software
- [ ] Label Academy point samples as synthetic instructional data
