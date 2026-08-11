---
title: Evaluate a UAV Survey Before Scientific Analysis
lessonId: module-2-chapter-4-practicum
---

## Chapter 4 Practicum — Evaluate a UAV Survey Before Scientific Analysis

### Assessment purpose

This is the Chapter 4 synthesis assessment, not Lesson 2.26. You are the remote-sensing scientist accepting a UAV survey handover for ecological analysis. Your responsibility is to decide which evidence is usable, which needs review and which is unsuitable—not to force every file into one stack.

Allow 7–10 hours across focused sessions. Reuse your mission, radiometric, georeferencing, reconstruction, product and raster-QA functions. Keep raw inputs immutable and preserve every stopped workflow as a documented decision.

### Scenario

The research team supplies:

- `mission_metadata.csv` and `image_metadata.csv`;
- `photogrammetry_report.json`;
- separate GCP and withheld check-point residual tables;
- RGB orthomosaic preview;
- Red, Green, Red Edge and NIR bands;
- clean and deliberately damaged DSM variants;
- study boundary and synthetic field polygons;
- calibration-panel availability and irradiance metadata.

The handover contains eight deliberate conditions: variable illumination, one weakly georeferenced area, one band-alignment problem, one orthomosaic seam/ghost, one DSM spike/pit pair, a temporal mismatch warning, inconsistent NoData metadata and one ambiguous reflectance scale.

Every asset is synthetic and CC0. No file contains private imagery, personal information or published Baltic plot coordinates.

> **Decision principle:** An attractive product is not analysis-ready until acquisition, geometry, radiometry, support, timing and provenance meet the intended-use contract.

[[CHECK:m2-p4-gsd]]

## Required delivery structure

```text
uav_practicum/
├── mission_audit.csv
├── georeferencing_report.csv
├── raster_alignment_report.csv
├── radiometric_qa.csv
├── uav_qa_matrix.csv
├── uav_stack_manifest.csv
├── extraction_table.csv
├── qa_map.pdf
├── UAV_PRODUCT_QA_REPORT.md
└── uav_practicum.ipynb
```

Store downloaded fixtures under `data/raw/`. Use `data/interim/` only for named diagnostic or alignment candidates. Put accepted derivatives under `outputs/`. Never overwrite the fixture pack.

## Stage 1 — establish identity and integrity

1. Compare every file SHA-256 with `manifest.json`.
2. Record synthetic/open status and refuse any claim that coordinates are real field sites.
3. Parse every CSV and JSON; open every GeoTIFF and GeoJSON.
4. Record software versions and environment.
5. Separate observed metadata, derived calculation, assumption, decision and missing evidence into distinct columns.

Stop if a checksum changes unexpectedly, a file cannot open, coordinate reference is missing where transformation is required, or product identity cannot be established.

## Stage 2 — audit the mission

6. Describe platform category, payload, mission time, positioning and intended products.
7. Calculate sensor pixel pitch and approximate GSD using consistent units.
8. Calculate image footprint dimensions.
9. Calculate nominal forward and side spacing from overlap.
10. Calculate trigger interval at documented speed.
11. State the pinhole, nadir and level-surface assumptions.
12. Record rolling-shutter and motion implications.
13. Compare UAV date with field date and list contextual evidence required to accept the mismatch.

Do not describe nominal GSD as positional accuracy or minimum detectable feature.

## Stage 3 — audit images and radiometry

14. Plot exposure, irradiance, saturation and blur by capture time and flight line.
15. Identify the blurred image, exposure transition and high-saturation image.
16. Record panel evidence and its limitations.
17. Compare the clean Red raster with `uav_radiometric_gradient_demo.tif` using a fixed stretch and column profiles.
18. Inventory the stored quantity, scale, units, NoData and valid range of every band.
19. Classify Red Edge scale as blocking review until authoritative metadata are available.
20. Produce `radiometric_qa.csv` with consequence and action.

[[CHECK:m2-p4-radiometry]]

## Stage 4 — evaluate photogrammetric reconstruction

21. Map each processing-report field to feature matching, tie points, camera model, bundle adjustment or missing downstream evidence.
22. Calculate aligned-image fraction.
23. Interpret the 0.42-pixel reprojection error as internal fitted evidence only.
24. Review the 2.8% focal-length change without applying a universal limit.
25. Link the reported weak region to mission coverage, image conditions and later check-point evidence.
26. List dense-cloud, surface, orthorectification and mosaic settings absent from the handover.

The report passes only if its diagnostic meaning and missing evidence are correctly stated. A low reprojection residual never substitutes for check-point validation.

## Stage 5 — assess georeferencing independently

27. Keep GCP and check-point tables separate.
28. Verify point ID, role, residual sign and units.
29. Calculate mean east/north/vertical bias, component RMSE, planimetric RMSE, vertical RMSE and maximum residual.
30. Plot check-point residual vectors with a declared arrow scale.
31. Identify the south-east outlier/local deformation and retain it.
32. Record horizontal and vertical reference limitations.
33. Produce region-specific accept/review/unsuitable decisions in `georeferencing_report.csv`.

[[CHECK:m2-p4-checkpoints]]

## Stage 6 — audit orthomosaic and DSM

34. Inspect RGB metadata and state that it is an 8-bit display preview, not reflectance.
35. Quantify the brightness difference around the seam and locate ghosted texture.
36. Overlay field polygons and identify affected analytical support.
37. Compare clean and defective DSM rasters under identical styling.
38. Detect the 18.5 m spike and -3 m pit, then inspect local context.
39. Record that the DSM is an upper reconstructed surface with undocumented vertical datum.
40. Do not calculate canopy height because a validated DTM is absent.
41. Add every finding to `uav_qa_matrix.csv` and the QA map.

## Stage 7 — verify multispectral raster integrity

42. Run the complete grid contract across Red, Green, NIR, shifted NIR, Red Edge and DSM.
43. Demonstrate that aligned NIR passes and shifted NIR fails despite matching CRS, resolution and shape.
44. Compare NoData values and create variable-specific masks.
45. Check accepted reflectance-proxy ranges and flag Red Edge scale.
46. Inspect local registration around sharp features in QGIS.
47. Define the target grid and any resampling/correction evidence required.
48. Produce `raster_alignment_report.csv`.

Do not relabel the shifted band’s transform as a correction. Do not calculate indices until content registration and the grid contract pass.

## Stage 8 — build only the accepted spectral subset

49. Use aligned Red, Green and NIR from the synthetic pack.
50. Intersect masks and apply denominator safety.
51. Calculate NDVI and GNDVI in float.
52. Verify finite valid values and the expected mathematical range.
53. Leave Red-edge NDVI blocked and record the required metadata.
54. Integrate the clean DSM only with its vertical limitation.
55. Create a reason-coded QA mask.
56. Reopen and compare every derivative with declared expectations.
57. Produce `uav_stack_manifest.csv` for accepted, blocked and review layers.

## Stage 9 — extract to field support

58. Transform field polygons to EPSG:3301; do not relabel them.
59. Choose and document centre-based, all-touched or area-weighted raster support.
60. Report candidate and valid cells, valid fraction, statistic, units, source checksum, raster QA status and field/UAV dates.
61. Flag plots intersecting seam, weak georeferencing or invalid support.
62. Produce and reopen `extraction_table.csv`.

Extraction does not validate an index as an ecological proxy. It only creates a traceable link from accepted raster support to synthetic polygons.

## Stage 10 — final product decisions

Classify each product and relevant region:

- **acceptable** — evidence meets the declared use;
- **review** — bounded missing evidence or correction remains;
- **unsuitable** — a requirement is not met for this use.

At minimum decide separately for RGB orientation, Red/Green/NIR spectral use, Red Edge, NDVI/GNDVI, DSM upper-surface use, south-east plot overlay and field-date comparison.

Every decision must cite evidence, affected support, scientific consequence and next action. “Looks good” is not acceptable evidence.

## Required QA map

`qa_map.pdf` must show:

- study boundary and synthetic plots;
- orthomosaic seam and ghost region;
- check-point residual vectors;
- weak south-east area;
- DSM spike/pit locations;
- affected or excluded plot support;
- legend, CRS, scale and source note;
- labels or patterns so colour is not the only signal.

Reopen the PDF and verify text, labels and geometry at normal reading size.

## Final report structure

`UAV_PRODUCT_QA_REPORT.md` must include:

1. Mission description
2. Sensor description and measurement quantities
3. Flight geometry, GSD and assumptions
4. Radiometric evidence and unresolved scale
5. GCP/check-point and horizontal/vertical evidence
6. Photogrammetric reconstruction QA
7. Orthomosaic seam/ghost diagnosis
8. DSM interpretation and artefacts
9. Multispectral grid, masks and indices
10. Spatial extraction support
11. Temporal support and field compatibility
12. Known limitations
13. Product/region decisions
14. Corrective action and owners
15. Provenance, software and checksums

## Assessment rubric

| Dimension | Weight | Full-credit evidence |
|---|---:|---|
| Mission and sensor reasoning | 15% | Correct GSD/footprint/spacing with assumptions; sensor and product meanings remain distinct |
| Photogrammetry understanding | 20% | Complete software-independent chain; internal diagnostics are interpreted within limits |
| Georeferencing QA | 20% | Control/check separation, correct statistics, residual map and local/vertical interpretation |
| Raster and multispectral QA | 20% | Alignment, scale, masks, safe indices, DSM and output round trips are demonstrably correct |
| Scientific interpretation | 15% | Product- and region-specific decisions connect evidence to ecological consequence and timing |
| Documentation and provenance | 10% | Immutable inputs, checksums, versions, manifest, limitations and actions are complete |

### Automatic revision required

Revision is required if:

- GSD is presented as positional accuracy;
- orthomosaic is described as raw imagery;
- reprojection error is treated as absolute validation;
- GCPs and check points are interchangeable;
- reflectance scale is assumed;
- bands enter calculations without alignment validation;
- DSM is called bare ground or direct vegetation height;
- an index uses shifted bands;
- temporal mismatch is ignored;
- visual appearance is the only QA evidence.

## Professional Mistakes — UAV and Photogrammetry

Use this table as a final failure-mode review. Add a row to your QA matrix for every mistake relevant to the handover.

| Mistake | Why it happens | How to detect it | How to prevent it | Scientific consequence |
|---|---|---|---|---|
| GSD = accuracy | Both use distance units | Accuracy claim cites pixel size only | Report GSD, effective resolution and independent residuals separately | Boundaries and plot overlays appear more certain than supported |
| Orthomosaic = raw photograph | Mosaic looks photographic | No surface, seamline or source-image history | Preserve the reconstruction and contribution chain | Derived pixels are interpreted as direct instantaneous observation |
| High overlap = guaranteed quality | One plan percentage is easy to compare | Blur, texture, motion and achieved coverage are absent | Audit sharpness, matches, geometry and actual footprints | Reconstruction failure remains despite many images |
| All surveyed points used as GCPs | Fitted residuals become smaller | No withheld role exists | Reserve independent, distributed check points | External accuracy is untested and optimistic |
| Low reprojection error proves position | Internal diagnostic is called error | No check-point residuals accompany the claim | Label internal versus external evidence | Shifted/warped products are accepted |
| Vertical accuracy ignored | Maps focus on planimetry | Vertical datum and RMSE Z are missing | Audit height reference, transformation and checks | DSM differences receive unsupported height meaning |
| Rolling shutter ignored | Frames look sharp at first glance | Shutter/readout and motion are undocumented | Record shutter and validate motion modelling | Systematic geometric distortion enters the block |
| Motion blur ignored | Mosaic blending hides weak frames | Source-image sharpness not reviewed | Predeclare sharpness rules and inspect frames | Matches and fine boundaries degrade |
| Changing illumination ignored | Colour balancing looks smooth | Exposure/irradiance varies with flight order | Track light, settings and image contribution | False spatial/spectral gradients appear |
| Panel guarantees reflectance | Reference target sounds definitive | Panel timing/exposure/condition absent | Follow protocol and retain residual limits | DN is presented as comparable reflectance |
| Automatic exposure unreviewed | Images look visually balanced | exposure/gain varies across block | Audit metadata and use documented correction | Between-image values are incomparable |
| Bands assumed perfectly aligned | Files share dimensions | transforms or edges disagree | Numeric contract plus local registration checks | Spectral arithmetic mixes ground footprints |
| NDVI calculated before registration | Formula is simple | index halos follow object edges | Make alignment a blocking gate | False vegetation patterns are created |
| DSM treated as DTM | Both are elevation rasters | ground-classification evidence absent | Document surface generation and validate terrain | Canopy/buildings are interpreted as ground |
| DSM treated as direct vegetation height | Height appears above ground | no aligned DTM or vertical validation | Require compatible surfaces and uncertainty | Plant structure is overstated or biased |
| Seamlines ignored | Mosaic looks continuous at normal zoom | contribution/brightness boundaries untested | Inspect fixed stretches and source map | Radiometric or geometric discontinuity biases analysis |
| Block-edge distortion ignored | central area dominates global metrics | residuals increase near boundary | acquire margins and map local error | Edge plots have worse position than reported |
| Water/moving vegetation ignored in SfM | software still returns points | noisy clouds, holes or ghosts align with target type | anticipate failure and mask/model explicitly | Invented or unstable surfaces enter products |
| Field/UAV date mismatch ignored | dates are close numerically | process events/tide/grazing absent | define temporal compatibility before extraction | raster and field data represent different states |
| Bad areas hidden | final map looks cleaner | exclusions lack IDs, reason or original support | map and document every excluded region | users assume complete coverage and selection bias is concealed |

## Reflection and submission

Answer in private notes:

1. Which product passed geometric QA but failed another category?
2. Which internal diagnostic was most tempting to overinterpret?
3. Which finding affected only one region rather than the whole survey?
4. Why was stopping Red-edge NDVI the correct scientific decision?
5. What new evidence would change your final classification?

### Submission

Upload the complete `uav_practicum/` folder or project archive, the verified QA map, your notebook, all tables and the final Markdown report. Include one 350–500 word executive summary that a research lead can act on without opening the code.

### Portfolio artifact

**Artifact 2.D — Professional UAV Survey Assessment**

Add the complete assessment to the **Professional UAV Product Audit and Processing Report**. It is the Chapter 4 portfolio handover and the acquisition-to-analysis bridge for the later Satellite Earth Observation chapter.
