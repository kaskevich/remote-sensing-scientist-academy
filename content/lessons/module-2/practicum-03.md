---
title: Build an Analysis-Ready Raster Stack
lessonId: module-2-chapter-3-practicum
---

## Chapter 3 Practicum — Build an Analysis-Ready Raster Stack

### Assessment purpose

This is the Chapter 3 synthesis assessment, not Lesson 2.18. You will act as the analyst responsible for accepting five raster inputs, harmonising them to one defensible grid, extracting values to synthetic plot polygons and delivering a Raster QA Report that another scientist can reproduce.

Allow 6–9 hours across several focused sessions. Reuse the audit, transformation, alignment, extraction and large-raster functions created in Lessons 2.11–2.17. The practicum should integrate those components rather than replace them with one unexplained processing cell.

### Scenario

An environmental monitoring team provides:

- `practicum_red.tif` — continuous Red proxy and proposed reference grid;
- `practicum_rededge_shifted.tif` — continuous Red Edge proxy with a half-cell origin shift;
- `practicum_nir_20m.tif` — continuous NIR proxy on a coarser grid;
- `practicum_dsm_wgs84.tif` — continuous upper surface in another horizontal CRS;
- `practicum_habitat_cropped.tif` — categorical habitat codes with reduced extent;
- `training_site_boundary.geojson` — synthetic site boundary in RFC 7946 longitude–latitude coordinates;
- `training_plot_polygons.geojson` — synthetic extraction footprints.

Every file is generated synthetic training data. No asset contains unpublished imagery or published Baltic sampling coordinates. The deliberately different CRS, resolution, origin, extent and NoData conventions are the assessment evidence—not defects to hide.

> **Professional task:** Build a validated common raster stack while preserving variable meaning, missingness, provenance and unresolved uncertainty.

[[CHECK:m2-p3-target-grid]]

## Required delivery structure

```text
analysis_ready_stack/
├── red.tif
├── rededge.tif
├── nir.tif
├── dsm.tif
├── habitat.tif
├── raster_stack_audit.csv
├── raster_alignment_report.csv
├── extraction_table.csv
├── qa_map.pdf
└── RASTER_QA_REPORT.md
```

Keep raw downloads outside this folder in an immutable `data/raw/` location. Intermediate experiments belong in `data/interim/` with named stages. The final folder contains only accepted derivatives and evidence.

## Stage 1 — inventory and integrity

1. Record every input filename, size and SHA-256 checksum.
2. Compare checksums with `manifest.json` and stop if any differ unexpectedly.
3. Open each raster read-only and record driver, bands, dimensions, CRS, transform, resolution, bounds, data type, NoData, mask, descriptions, units and synthetic status.
4. Record vector CRS convention, geometry type, feature count and stable identifiers.
5. Classify every raster variable as continuous or categorical and explain what the stored values represent.
6. Record horizontal and vertical reference status separately for the DSM.

The inventory must preserve facts and decisions in separate columns. “CRS is EPSG:4326” is a fact read from the file. “Reproject to the target grid” is a processing decision. “DSM vertical datum undocumented” is a limitation that remains after reprojection.

### Stop conditions

Stop the workflow if a checksum is unexpected, a file cannot be reopened, CRS required for transformation is absent, variable semantics are unresolved, or the categorical legend is missing. Do not infer missing metadata from visual overlap.

## Stage 2 — define the target grid before transforming

Write the exact target contract in `RASTER_QA_REPORT.md`:

- target CRS and area-of-use rationale;
- resolution and support rationale;
- origin and snapping convention;
- bounds and intersection, union or site-boundary policy;
- width and height derived from bounds and resolution;
- pixel orientation;
- destination data types;
- destination NoData per variable;
- joint-validity policy;
- resampling method per input.

The practicum Red raster is a candidate reference because it uses a 10 m EPSG:3301 grid covering the synthetic site. You must still justify it. Do not describe 10 m as the most accurate option.

Use nearest neighbour for habitat class codes. Choose and defend methods for continuous Red, Red Edge, NIR and DSM. State what interpolation or aggregation changes and what it cannot improve.

[[CHECK:m2-p3-resampling]]

## Stage 3 — create aligned derivatives

For each raster:

1. preserve the source path and checksum;
2. allocate the destination from the exact target transform, shape and CRS;
3. pass source and destination NoData explicitly;
4. apply the variable-specific resampling method;
5. transform or rasterise the site boundary into the target CRS;
6. mask cells outside the declared study support;
7. write to a new filename under `analysis_ready_stack/`;
8. copy or create meaningful band descriptions and units;
9. record software versions and parameters;
10. reopen the file before accepting it.

Do not call one output “original.” These are analysis-ready derivatives. Do not overwrite a raw input, even when only the filename appears inconvenient.

For habitat, verify that every valid output value belongs to the original class legend. For continuous layers, compare source and destination valid ranges and explain expected smoothing or aggregation. For DSM, retain the vertical-reference limitation in tags and the report.

## Stage 4 — prove alignment and valid support

Run the Lesson 2.14 validator across every pair or against the reference. `raster_alignment_report.csv` must include:

- reference and candidate filenames;
- CRS comparison;
- transform/origin comparison;
- x/y resolution comparison;
- shape and bounds comparison;
- pixel-centre diagnostic;
- NoData values and valid-cell counts;
- geometric `aligned` result;
- semantic compatibility note;
- reviewer decision.

Do not pass alignment because the arrays can be stacked. Assert that the CRS, transform, resolution, dimensions and bounds agree within a predeclared tolerance.

Then create a joint-validity summary:

- cells valid in all five layers;
- cells invalid by each individual source;
- cells excluded by the site mask;
- valid fraction for the final study support;
- consequence of choosing intersection or union extent.

[[CHECK:m2-p3-alignment]]

## Stage 5 — stack without erasing band identity

The five GeoTIFFs are required outputs because they preserve variable-specific data types and NoData conventions. You may also create a multiband demonstration stack for continuous layers only if:

- each band shares the exact target grid;
- band order and descriptions are explicit;
- units and scale conventions remain traceable;
- habitat classes are not coerced into an ambiguous continuous representation;
- the stack is reopened and audited.

Stacking is not merely `np.stack()`. The output contract must state what each band represents and which mask applies. If you create only the five aligned files, explain how the alignment report provides the stack contract.

## Stage 6 — extract to synthetic plot polygons

Transform the RFC 7946 plot polygons to EPSG:3301. For each plot and layer:

1. state the extraction support rule;
2. select cells under a declared rasterisation or area-weighting method;
3. report candidate and valid cell counts;
4. report valid fraction;
5. calculate a justified statistic for continuous layers;
6. report class counts or proportions for habitat;
7. retain missing output when coverage is insufficient;
8. include raster checksum or final grid identifier;
9. retain the synthetic support note;
10. write `extraction_table.csv` and reopen it.

Do not average habitat codes. Do not replace missing extraction with zero. Do not call a centroid sample a measured plot location.

## Stage 7 — create QA maps

Create a PDF QA map showing:

- site boundary and synthetic plot polygons;
- one continuous aligned layer with explicit stretch;
- habitat classes with a discrete legend;
- NoData or joint-validity boundary;
- CRS, scale, source status and processing date;
- one inset or annotation revealing the original shifted Red Edge grid;
- a concise limitation that the data are synthetic and DSM vertical datum is undocumented.

Use QGIS or Python for the layout. If QGIS is used, record the project CRS, layer paths, renderer resampling and QGIS version. Reopen the exported PDF and inspect text, legend, clipping and transparency.

## Required Raster QA Report

`RASTER_QA_REPORT.md` must contain:

1. purpose and synthetic-data statement;
2. input inventory and checksums;
3. original CRS, transform, resolution, bounds, shape, data type and NoData;
4. variable classification and value semantics;
5. exact target grid specification;
6. resampling decision for every input;
7. crop/mask/reproject/resample sequence;
8. NoData and joint-validity policy;
9. alignment results and tolerance;
10. extraction support and coverage rule;
11. numerical and visual QA results;
12. unresolved spatial, vertical and temporal uncertainty;
13. source and derivative provenance;
14. tested Python, Rasterio, NumPy, GeoPandas, Shapely, PyProj and QGIS versions;
15. final accept, conditional accept or reject decision for the stack.

The report should let another analyst reproduce the exact output grid without opening your files first.

## Assessment rubric

| Dimension | Weight | Evidence of meeting the standard |
|---|---:|---|
| Raster scientific correctness | 30% | operations and resampling follow variable meaning; no false resolution, NoData or terrain claims |
| QA and validation | 25% | checksums, round-trip checks, complete alignment report, valid coverage and visual reconciliation |
| Technical implementation | 20% | immutable inputs, explicit target grid, readable code, accepted outputs reopen successfully |
| Scientific reasoning | 15% | support, uncertainty, extent and DSM limitations are defended rather than hidden |
| Documentation and communication | 10% | required files, provenance, versions, labels and concise decision are complete |

### Automatic revision required

Revision is required if any of these conditions occur:

- same CRS is treated as proof of alignment;
- matching shape is treated as proof of grid identity;
- habitat classes use bilinear or cubic interpolation;
- NoData is treated as zero;
- source rasters are overwritten;
- output rasters are not reopened and validated;
- plot extraction support is unjustified;
- stack members retain unmatched transforms;
- resolution is described as accuracy;
- DSM is described as terrain or vegetation height without supporting evidence;
- visual QGIS overlap is the only alignment evidence.

## Submission

- **Folder:** complete `analysis_ready_stack/` structure with the five aligned rasters and four QA/report outputs.
- **Notebook or scripts:** reproducible inventory, harmonisation, validation and extraction workflow.
- **Screenshot:** final QGIS or Python QA layout plus one view exposing the original grid mismatch.
- **Written decision:** the final section of `RASTER_QA_REPORT.md`, limited to 250–350 words, stating readiness, permitted uses, limitations and next action.

### Portfolio artifact

**Artifact 2.C — Analysis-ready raster stack and QA report**

This artifact completes Chapter 3 of the **Raster QA and Harmonisation Pipeline**. It demonstrates that you can make five spatially incompatible inputs analytically comparable without hiding what was changed or claiming information the sources do not contain.

## Professional Mistakes — Raster Science

Use this table as the chapter-end review page. For any mistake found in your practicum, link the row to the relevant report section, correct the workflow and rerun its QA evidence.

| Professional mistake | Why it happens | How to recognise it | How to prevent it | Scientific consequence |
|---|---|---|---|---|
| Treating a raster as an image | display is the first interaction | discussion mentions colour but not values or grid | inspect array, metadata, mask and semantics first | persuasive map with unknown measurement meaning |
| Ignoring the affine transform | arrays look self-locating | indices are combined without Earth-coordinate checks | audit all transform coefficients and cell centres | values are assigned to wrong ground footprints |
| Assuming same CRS means alignment | CRS is the familiar field | origins or shapes differ despite equal CRS | compare the complete grid contract | false cell-wise combinations |
| Assuming same resolution means alignment | pixel size is mistaken for lattice | equal 10 m cells have shifted origins | compare transform and snap to one target | systematic spatial mixing |
| Ignoring grid origin | bounds seem close enough | half-cell offset appears in centre diagnostics | declare target origin and snapping rule | every corresponding index differs |
| Treating NoData as zero | both can display dark | valid zero disappears or missing becomes measured | use masks and declared NoData separately | biased summaries and false evidence |
| Including NoData in statistics | raw arrays look numeric | minimum equals a sentinel such as `-9999` | read masked and report valid counts | extreme bias and invalid ranges |
| Bilinear interpolation of classes | smooth output looks attractive | new fractional class codes appear | use class-preserving resampling and test labels | invented categories and boundaries |
| Treating upsampling as new detail | output cells are smaller | claims improve without new observations | preserve native-resolution limitation | exaggerated spatial information |
| Reprojecting without a target grid | software chooses defaults | layers receive slightly different origins or bounds | specify CRS, transform, shape and extent once | outputs cannot form a valid stack |
| Overwriting raw rasters | transformation is seen as correction | source checksum or before state is lost | use immutable raw and named derivatives | processing cannot be audited or reversed |
| Ignoring scale or offset | stored integers resemble measurements | values fall outside physical range | inspect and apply documented scale/offset | wrong units and magnitudes |
| Sampling one pixel for a field footprint | point APIs are easy | field support is absent from extraction record | represent the footprint and test alternatives | support mismatch and unstable inference |
| Ignoring temporal mismatch | spatial overlap dominates | field and image dates are absent | record temporal support and tolerance | values describe different ecological states |
| Ignoring vertical reference | both elevations say metres | datum or geoid is undocumented | audit vertical reference separately | biased elevation or surface differences |
| Treating DSM as terrain | elevation acronyms are conflated | canopy/building response is ignored | verify surface-generation method | canopy texture is interpreted as ground |
| Interpreting hillshade as measured data | shaded relief resembles terrain | illumination values enter analysis as elevation | use hillshade as labelled visual QA | model learns renderer geometry, not observation |
| Loading an entire huge raster | `read()` is convenient | memory is not estimated before access | select bands/windows and follow blocks | crashes, swapping and undocumented shortcuts |
| Trusting QGIS visual alignment alone | on-the-fly display is convincing | no stored-grid assertions exist | reconcile QGIS with Python metadata tests | small shifts remain hidden |
| Writing without reopening | no exception feels successful | output was never independently read | reopen, compare grid, mask and values | corrupt or incomplete derivatives reach handover |

### Final reflection

1. Which practicum decision changed the largest number of downstream outputs?
2. Which error could have produced the most convincing false map?
3. Which limitation remains even after perfect geometric alignment?
4. What evidence would you require before using this stack in a predictive model?
5. Which Chapter 3 function will you reuse first with real governed data?
