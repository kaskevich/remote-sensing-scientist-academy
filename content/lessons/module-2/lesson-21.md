---
title: Georeferencing — GNSS, GCP, RTK and PPK
lessonId: lesson-2-21
---

## 1. Internal consistency is not external accuracy

### Learning outcome

By the end of this lesson, you will be able to explain onboard GNSS, ground control, RTK and PPK; keep fitted control points separate from independent check points; calculate component and planimetric RMSE, bias and maximum residual; and diagnose systematic, outlier and local positional error.

- **Lesson type:** Concept + QA lab
- **Estimated time:** 100–120 minutes
- **Prerequisites:** Lesson 2.2 on coordinate reference systems, Lesson 2.19 on mission geometry, and arithmetic with square roots and means.

### Why this matters

A UAV reconstruction can be internally coherent yet shifted, tilted or warped in an external coordinate system. Plot extraction then assigns imagery to the wrong ground support. Fine GSD makes the displacement look precise; it does not make it correct.

Professional georeferencing separates the observations used to fit a solution from independent evidence used to assess it. It also reports horizontal and vertical behaviour, spatial patterns and intended use—not one unexplained error number.

### Scientific context

The synthetic handover contains six ground control points and five withheld check points. Control residuals are small. Check points show a modest east-positive, north-negative and vertical-positive bias, plus a larger error at the weak south-east block edge.

Your task is to calculate those patterns and decide whether the full product can support plot-level overlay. You must not remove the south-east point merely because it worsens the summary.

### Mental model

![Technical diagram showing onboard GNSS, RTK, PPK and ground control contributing to a fitted reconstruction while withheld check points provide independent assessment.](lesson-media/images/gcp-rtk-ppk.svg)

```text
positioning observations + image geometry + control → fitted model
withheld check points → independent external error evidence
```

### Learner action

Create `04_georeferencing_qa.ipynb`. Add two separate data sections named **Control used in fitting** and **Check points withheld from fitting**. Never concatenate them before calculating diagnostics.

## 2. Image geotags are observations with uncertainty

An image geotag can include latitude, longitude, altitude, time and orientation-related metadata. Its accuracy depends on receiver, corrections, antenna-to-camera offset, timing synchronisation, coordinate transformations and operational conditions.

Standard onboard GNSS may have metre-scale errors in some contexts, but there is no universal number. Satellite geometry, obstruction, multipath, receiver quality and processing matter. Read actual metadata and validation evidence.

Altitude needs special care. A geotag may store ellipsoidal height, a geoid-related height, barometric estimate or relative height. Do not combine vertical values until datum, reference surface and units are verified.

Geotags can provide initial camera positions and sometimes contribute weighted constraints. Their presence does not prove the final orthomosaic’s absolute accuracy.

[[CHECK:m2-l21-geotag]]

## 3. Ground control points constrain the solution

A ground control point (GCP) is a ground location with surveyed coordinates that can be identified in relevant images. The photogrammetric solution uses it as a constraint.

GCP quality depends on:

- survey method and uncertainty;
- horizontal and vertical reference;
- target size, contrast and centre definition;
- visibility in enough sharp images;
- spatial distribution across the block and elevation range;
- coordinate-entry and point-marking consistency;
- independence from other observations.

More GCPs are not automatically better. Many clustered points may leave an edge unconstrained. One misidentified target can distort a solution. Report both count and distribution, and weight observations according to defensible uncertainty when the software permits.

Residuals at GCPs describe agreement for points used to fit or constrain the solution. They are useful diagnostics but optimistic as independent accuracy estimates.

## 4. Check points must remain independent

A check point has surveyed coordinates but is withheld from adjustment. After processing, its predicted image-product or model location is compared with the surveyed reference.

If every point is used as control, there is no independent set left to assess external positional performance. Calling some fitted GCPs “check points” in a report does not make them independent.

Check-point design also matters. Points should represent the area, terrain and intended uses. A small cluster near the centre cannot reveal edge warping. Sample size affects confidence and the ability to characterise error distribution. Use current applicable standards and project requirements to design and report formal accuracy assessment; do not infer compliance from this small training fixture.

[[CHECK:m2-l21-control]]

## 5. RTK and PPK improve camera-position evidence

**Real-time kinematic (RTK)** positioning applies correction information during acquisition, producing corrected camera positions in real time when the correction link and solution remain valid.

**Post-processed kinematic (PPK)** positioning combines rover observations with base or network data after the flight. It can allow later quality review and resolution of corrections without depending on an uninterrupted real-time link.

Both require attention to:

- base/network reference and coordinates;
- antenna phase centre and camera lever-arm offsets;
- event timing between shutter and GNSS;
- fixed/float solution status and satellite geometry;
- coordinate and vertical transformations;
- processing settings and quality logs.

RTK or PPK can strengthen direct georeferencing and reduce dependence on control under suitable conditions. Neither removes the need for independent check points. A precise camera trajectory does not validate lens model, image matching, surface reconstruction, datum transformation or final product everywhere.

### Interpretation task

Write two sentences: “RTK/PPK contributes ___ evidence” and “Withheld check points still test ___.” Avoid “RTK makes GCPs unnecessary” as a general claim.

## 6. Relative and absolute accuracy

**Relative accuracy** describes internal consistency: how well features, images or points agree with each other within the reconstructed model.

**Absolute accuracy** describes agreement with an external reference system. A block can have low reprojection error, sharp tie points and internally consistent geometry but still be translated, rotated, tilted or locally deformed relative to ground coordinates.

For ecological extraction:

- relative error influences seams, duplicated features and internal measurements;
- absolute horizontal error influences overlay with plot geometry;
- absolute vertical error influences DSM interpretation and surface differencing;
- local error influences whether one region is usable even if whole-block RMSE looks acceptable.

## 7. Residuals, bias and RMSE

For each check point, define residual components consistently, for example:

```text
east residual = product easting − surveyed easting
north residual = product northing − surveyed northing
vertical residual = product height − surveyed height
```

The sign convention must be stated. The mean residual estimates directional bias in the sample. Root mean square error summarises magnitude:

```text
RMSE_E = sqrt(mean(east_residual²))
RMSE_N = sqrt(mean(north_residual²))
RMSE_planimetric = sqrt(RMSE_E² + RMSE_N²)
RMSE_Z = sqrt(mean(vertical_residual²))
```

RMSE is sensitive to large residuals, which is useful but incomplete. Report sample count, bias, maximum, distribution and spatial pattern. A single value cannot reveal local warping or directional structure.

### Worked example — independent residual statistics

#### Predict before running

Will mean east residual be close to zero? Which point is likely to dominate planimetric RMSE?

```python
import pandas as pd
import numpy as np

checks = pd.read_csv("data/raw/checkpoint_residuals.csv")
east = checks["east_residual_m"].to_numpy()
north = checks["north_residual_m"].to_numpy()
vertical = checks["vertical_residual_m"].to_numpy()

rmse_e = np.sqrt(np.mean(east ** 2))
rmse_n = np.sqrt(np.mean(north ** 2))
rmse_xy = np.sqrt(rmse_e ** 2 + rmse_n ** 2)

print("bias E/N/Z:", east.mean(), north.mean(), vertical.mean())
print("RMSE XY/Z:", rmse_xy, np.sqrt(np.mean(vertical ** 2)))
```

### Code walkthrough

1. pandas preserves each point identifier and region.
2. Component arrays retain signed residuals.
3. Squaring makes positive and negative magnitudes contribute.
4. Mean squared residual is calculated for each horizontal axis.
5. Square root returns metres.
6. Component RMSEs combine into planimetric RMSE.
7. Mean signed components expose directional bias.
8. Vertical RMSE remains separate because its reference and consequences differ.
9. The code does not classify accuracy under a formal standard.
10. Plotting vectors and inspecting regions are still required.

[[CHECK:m2-l21-rmse]]

## 8. Error patterns matter

### Systematic offset

Residual vectors point in a similar direction. Possible causes include reference transformation, antenna offset, timing or systematic model displacement. Removing the mean may improve a diagnostic, but applying a correction requires verified cause and must not conceal other deformation.

### Outlier

One point differs greatly. Possible causes include survey error, wrong ID, target-marking error, local reconstruction failure or a genuine weak area. Investigate rather than delete by an arbitrary threshold. Record any exclusion and rerun sensitivity summaries.

### Local warping

Residual magnitude or direction changes spatially, often near edges, weak overlap, terrain changes or poorly distributed control. Whole-block RMSE can hide this. Map residual vectors and evaluate the intended analysis footprint.

The south-east synthetic check point has the largest planimetric residual and is located in the weak block edge named by the processing report. This agreement across independent evidence strengthens the diagnosis.

## 9. Horizontal and vertical reference are separate

A raster can use EPSG:3301 horizontally while its heights remain ellipsoidal, geoid-related, local or undocumented. A 2-D CRS label does not define the vertical datum.

For each surveyed point and surface, record:

- horizontal CRS and coordinate epoch where relevant;
- vertical reference and units;
- survey method and uncertainty;
- transformation and geoid model;
- time and stability of the mark;
- whether the raster or report retained this information.

Do not interpret DSM differences as centimetre-scale ecological height when the vertical reference or error is uncertain.

## 10. QGIS and Python have complementary roles

Python calculates reproducible residual summaries and creates a vector layer from surveyed point coordinates plus residual components. QGIS helps inspect spatial distribution, arrows, local clusters and relationship to mosaic seams or block edges.

Use the same point IDs and sign convention. A QGIS arrow should point from reference toward product-predicted location—or the reverse—according to a documented rule. Never mix conventions across the table and map.

### QA check

Create a residual map with equal axis scale and a visible scale factor for arrows. If arrows are enlarged for legibility, state the multiplier. Do not let symbology imply that the residual itself is larger.

## 11. Common mistakes and recovery

### Using all points as GCPs

**Why:** fitted residuals become smaller. **Detect:** no withheld role exists. **Recover:** design independent checks before processing and protect their status.

### Low reprojection error proves accuracy

**Why:** the report labels it error. **Detect:** no external residuals. **Recover:** treat reprojection error as internal image-geometry evidence and use check points for external accuracy.

### More GCPs always improve accuracy

**Why:** quantity is easy to compare. **Detect:** distribution and survey quality are ignored. **Recover:** assess geometry, reference, visibility, uncertainty and influence.

### Reporting only planimetric RMSE

**Why:** one number is concise. **Detect:** bias, maximum, vertical and map are missing. **Recover:** report component statistics and spatial patterns.

### Deleting a difficult check point

**Why:** RMSE improves. **Detect:** exclusion follows result inspection without cause. **Recover:** investigate, preserve original analysis and show sensitivity with documented evidence.

## 12. Guided practice — georeferencing accuracy report

1. Read GCP and check-point files separately.
2. Verify unique IDs, roles, units and sign convention.
3. Calculate east, north, planimetric and vertical residual magnitudes per point.
4. Calculate mean signed bias, component RMSE, planimetric RMSE, vertical RMSE and maximum.
5. Compare control and check summaries without calling them equivalent.
6. Identify the maximum check point and retain it.
7. Plot check-point residual vectors with point IDs.
8. Compare the weak region with `photogrammetry_report.json`.
9. Record horizontal and vertical reference limitations.
10. Decide whether whole block, centre and south-east region are acceptable, under review or unsuitable for a defined 1.6 m plot overlay.
11. State that formal standards require adequate sampling and project-specific assessment beyond this fixture.
12. Export `georeferencing_report.csv` and reopen it.

### QA checklist

- [ ] Control and check points remain separate.
- [ ] Residual sign and units are explicit.
- [ ] Bias, RMSE, maximum, sample size and map are included.
- [ ] Horizontal and vertical results are separate.
- [ ] Outliers and local patterns are investigated, not hidden.
- [ ] RTK/PPK evidence does not replace independent assessment.
- [ ] Intended-use decision is spatially specific.

## 13. Independent challenge — review a direct-georeferencing claim

A contractor states: “RTK positions and 0.35-pixel reprojection error make check points unnecessary.” Write a 300-word technical response that:

- distinguishes camera positions, reprojection residuals and final product accuracy;
- identifies lever-arm, timing, datum and reconstruction risks;
- proposes an independent check design across the block and elevation range;
- separates horizontal and vertical use;
- states what evidence could support reduced control;
- avoids assuming that RTK has one universal accuracy.

### Scientific interpretation

Georeferencing quality is an evidence chain. Control constrains the solution; RTK or PPK strengthens camera positioning; internal residuals diagnose fitted geometry; withheld check points assess external performance. None is a substitute for all others.

## 14. Reflection, submission and portfolio artifact

Answer in your private notes:

1. What is the difference between a GCP and check point?
2. How do RTK and PPK differ conceptually?
3. Why can relative accuracy be good while absolute accuracy is poor?
4. What does RMSE hide?
5. Why is vertical reference a separate question?

### Submission

- **Notebook:** `04_georeferencing_qa.ipynb` with separate control/check analysis.
- **Table:** `georeferencing_report.csv` with components and decisions.
- **Map:** check-point residual vectors and weak region.
- **Written answer:** 280–350 words explaining the accept/review/unsuitable decision.

### Portfolio artifact

**Artifact 2.21 — Georeferencing accuracy report**

Add the table, residual map and decision to the **Professional UAV Product Audit and Processing Report**. Later extraction must cite this spatial accuracy evidence.
