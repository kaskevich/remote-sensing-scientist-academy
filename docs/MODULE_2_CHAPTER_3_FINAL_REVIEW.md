# Module 2 Chapter 3 — Raster Science final review

**Review date:** 11 August 2026  
**Scope:** Lessons 2.11–2.17, Chapter 3 practicum, explanatory SVGs, portfolio notebook checkpoints, synthetic training pack and automated validation  
**Release decision:** Ready for draft pull-request review; not yet a production release

## Evidence reviewed

- All seven lesson manuscripts and the complete practicum were read end to end.
- Every Python teaching block was compiled and checked against the 20-line worked-example limit.
- All GeoTIFFs were opened with Rasterio 1.4.4; CRS, transform, resolution, shape, bounds, type, bands, NoData and SHA-256 were compared with the manifest.
- Continuous and categorical resampling, valid zero versus NoData, grid alignment, windowed/full-array equivalence, polygon extraction and terrain-derivative round trips were tested automatically.
- Official Rasterio, GDAL, QGIS, NumPy and USGS sources were used for technical definitions and API behaviour.

## Perspective review

| Perspective | Score | Review finding |
|---|---:|---|
| Raster GIS specialist | 9.1/10 | The grid contract, affine transform, validity mask, alignment, resampling and raster–vector support are treated as first-class scientific decisions. Future work should add rotated rasters and sub-pixel geometry edge cases. |
| Remote-sensing scientist | 8.9/10 | Measurement semantics, native support, interpolation limits and terrain-surface meaning are consistently separated from file structure. Real sensor radiometry and calibration remain appropriately deferred to later EO chapters. |
| Geospatial Python educator | 9.2/10 | Concepts progress from array-plus-metadata to auditable processing, with compact examples, predictions, recovery paths and one cumulative notebook. Learner setup friction should be observed during pilot delivery. |
| Spatial data scientist | 9.0/10 | Assertions, checksums, masks, extraction evidence and machine-readable QA support defensible downstream modelling. Joint-mask sensitivity and uncertainty propagation need deeper treatment later. |
| Terrain-analysis specialist | 8.7/10 | DEM/DSM/DTM, vertical reference, slope units, circular aspect, edge effects and resolution are introduced cautiously. Hydrological conditioning and robust vegetation-height workflows are explicitly outside this chapter. |
| Reproducibility reviewer | 9.3/10 | Synthetic licensing, immutable inputs, pinned validation dependencies, generated manifests, reopened outputs and tests create a traceable evidence chain. A lockfile for the Python teaching environment would strengthen cross-platform reproduction. |
| Beginner learner | 8.8/10 | Every new operation begins with a spatial question and a small visual model. The practicum is substantial; optional instructor pacing guidance may be needed after first-cohort observation. |
| UX and accessibility reviewer | 9.0/10 | The existing accordion, progress, notes, upload and feedback interface is preserved. SVGs use titles and descriptions and avoid decorative detail. Final browser testing must still confirm rendered long tables and code at all required widths. |

## Scientific and technical decisions

- The pack is explicitly synthetic, CC0, and does not imply that it contains published Baltic plot coordinates or sensor observations.
- EPSG:3301 provides a projected teaching grid; the lessons do not claim that an EPSG code alone proves fitness for a study.
- Continuous and categorical rasters use separate resampling rules. Nearest neighbour is the default for class labels; continuous interpolation still requires a support-based justification.
- Zero remains a valid value unless the variable contract says otherwise. NoData values and masks are audited separately.
- Matching CRS and nominal resolution do not establish alignment. Transform, origin, pixel orientation, dimensions and bounds are asserted as a grid contract.
- DEM, DSM and DTM labels are treated as product meanings that require provenance. A DSM-minus-DEM difference is not automatically called vegetation height.

## Explicit limitations and deferrals

- The chapter does not yet teach real satellite band calibration, atmospheric correction, cloud masking or spectral-index validity; these belong to the Satellite Earth Observation chapter.
- Xarray, Dask, Zarr, COG/STAC delivery and distributed processing are deferred to the multidimensional and cloud-native chapter. Lesson 2.16 builds the memory and chunking mental model without pretending local windows are distributed computing.
- The pack does not cover rotated/skewed grids, RPC/GCP georeferencing, vertical datum transformations, multidimensional rasters or time series.
- Synthetic rasters validate logic and controlled failure modes; they cannot validate sensor accuracy or ecological transferability.
- Automated checks establish structural and numerical expectations, not scientific truth. Visual QA and domain interpretation remain required.

## Recommended follow-up after learner review

1. Observe at least three beginners completing Lesson 2.11 and record where affine-transform language causes hesitation.
2. Time the Chapter 3 practicum and split instructor feedback checkpoints if completion exceeds nine hours.
3. Add one openly licensed real raster case only after provenance, redistribution rights and stable hosting are verified.
4. Add a Python environment lock or conda specification before a packaged course release.
5. Extend browser tests to assert Chapter 3 figures, long tables and resource links at the Academy’s supported widths.

## Final judgement

Chapter 3 is internally coherent, technically testable and suitable for expert review. It should enter the draft pull-request stage without merging. Production readiness depends on continuous integration, responsive browser checks and final human review of the rendered lesson experience.
