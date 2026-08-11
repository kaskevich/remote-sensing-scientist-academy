---
title: LiDAR and Point Clouds
lessonId: lesson-2-30
---

## 1. Build structural evidence from returns, classes and surfaces

### Learning outcome

By the end of this lesson, you will be able to describe a LiDAR point using coordinates, return information, class and intensity; distinguish point density from spatial accuracy; audit horizontal and vertical reference; explain how classification and interpolation produce DTM and DSM surfaces; derive a canopy-height model only from aligned compatible surfaces; and communicate structural metrics with their coverage and uncertainty.

- **Lesson type:** Point-cloud and structural-metric lab
- **Estimated time:** 170–210 minutes
- **Prerequisites:** Lesson 2.17 terrain models and Lesson 2.22 UAV elevation products
- **Portfolio output:** `lidar_structure_report.ipynb`

### Why this matters

LiDAR adds three-dimensional sampling to Earth Observation. Point clouds can describe terrain, vegetation height and vertical structure that optical reflectance does not measure directly. Yet a point cloud is not a ready-made canopy model. Return detection, georeferencing, classification, density, scan geometry, interpolation and vertical datum all influence the derived surface.

A canopy-height raster may be created with one subtraction, but that subtraction combines two estimates: a surface associated with top returns and an estimate of the ground. If either is misclassified, misaligned or referenced differently, the difference can be wrong while remaining visually plausible.

The professional task is to preserve the chain from pulse to point, point to class, class to surface and surface to ecological interpretation.

### Scientific context

The coastal meadow team wants structural evidence to complement optical and SAR signals. Low meadow vegetation is challenging: height differences can be close to vertical error, ground may be hidden locally, water can produce gaps and a classification tuned for forest may not represent short canopies well.

The supplied point table is entirely synthetic. It uses local metric coordinates and a deliberately non-authoritative local vertical reference. It includes ground and vegetation classes plus one high unclassified outlier. The coordinates are not real locations, and the heights are not published Baltic measurements.

You will audit the points, derive simple plot summaries and specify what would be required for a raster canopy-height product. The lesson connects airborne/UAV point clouds with spaceborne structural sensing, but does not imply that all LiDAR is satellite based. Platform and sampling design must always be named.

## 2. The concept: one pulse can create multiple recorded returns

### Concept

This lesson teaches one idea: a point cloud is a set of discrete observations with attributes, not a continuous surface. An emitted laser pulse may interact with several surfaces. The system can record one or more returns, each with horizontal coordinates, elevation and associated attributes.

A simplified point record may contain:

- `x`, `y`, `z` coordinates;
- return number and number of returns for the pulse;
- classification such as ground, vegetation, building, water or noise;
- intensity under instrument-specific conditions;
- scan angle, time, source ID and quality flags;
- coordinate reference and vertical-reference metadata.

The ASPRS LAS format standardises many fields and class codes, but the presence of a code does not prove classification correctness. Class meaning depends on file version and processing. Always inspect the header, point format and producer documentation.

### Visual explanation

```text
laser pulse
    ↓ first detected return — upper vegetation or another intercepted surface
    ↓ intermediate return — internal vegetation structure, when detectable
    ↓ last detected return — may be ground, but not guaranteed

classified points → ground interpolation → DTM
classified points → upper-surface rule → DSM
aligned DSM − DTM → canopy/surface-height model
```

“First” and “last” describe return order within a pulse. They are not ecological classes. A single-return pulse can originate from ground, vegetation, a roof or noise. Classification combines algorithms and sometimes manual editing to interpret the observations.

[[CHECK:m2-l30-return]]

## 3. Coordinates and vertical reference

Horizontal CRS and vertical reference are separate contracts. The `z` unit may be metres while the height is referenced to an ellipsoid, a geoid-based vertical datum, a local benchmark or an undocumented project system. Two surfaces in metres are not compatible if their zero levels differ.

Record:

- horizontal CRS and area of use;
- horizontal units;
- vertical CRS or explicit reference description;
- vertical units;
- geoid model and transformation if used;
- acquisition and processing dates;
- control/check evidence and accuracy statement.

Do not infer a vertical datum from the coordinate magnitude. If it is absent, label absolute elevation as unresolved. Relative height within one consistently processed dataset may still be useful, but only after checking alignment and local bias.

Spatial accuracy is not point density. A dense cloud can contain a systematic georeferencing offset. A sparse cloud can be well positioned but insufficient for small structural features. Report both.

## 4. Point density, pulse density and coverage

Point density commonly counts recorded points per unit area. Pulse density counts emitted pulse footprints or first returns under a specified rule. Because one pulse may create multiple returns, point density can exceed pulse density. The distinction matters when comparing penetration and sampling opportunity.

Density is not uniform. It changes with flight-line overlap, scan angle, occlusion, water response, reflectance and data removal. A scene-wide average can hide gaps. Evaluate density on the intended analysis support and map it.

For low vegetation, the relevant question is whether enough ground and vegetation evidence exists within each support to estimate their separation. A plot with many vegetation returns but no credible ground returns may have a strong DSM estimate and weak DTM estimate. A national terrain model acquired in another year might supply ground, but temporal change, vertical datum and grid alignment must be reconciled.

Spaceborne waveform LiDAR such as GEDI samples footprints along orbital tracks rather than producing a continuous wall-to-wall point cloud. That sampling design differs fundamentally from airborne scanning. Do not fill gaps and describe them as direct observations.

## 5. Classification is a scientific decision layer

Ground classification attempts to identify terrain returns while excluding vegetation, structures and noise. Algorithms use neighbourhood, slope, height and other rules; their parameters can remove real microtopography or retain low vegetation as ground. Wet meadows, embankments and dense short vegetation are difficult cases.

Audit classes using:

- class counts and spatial distribution;
- height profiles and cross-sections;
- isolated points and implausible elevations;
- withheld checkpoints or reference surfaces where available;
- consistency across flight lines;
- class-specific density;
- known water and edge behaviour;
- documented algorithm and parameters.

The synthetic outlier is unclassified and much higher than the other meadow points. A rule that uses the maximum of every point would turn it into an extreme canopy estimate. Its correct treatment is not automatic deletion: preserve it, flag why it is unsuitable for the current surface and investigate the source in real work.

Intensity can help classification, but raw intensity is influenced by range, angle, instrument settings, target response and processing. Values from different surveys are not automatically comparable. Without calibration evidence, call it recorded intensity, not reflectance.

## 6. From points to DTM and DSM

A **Digital Terrain Model (DTM)** represents an estimate of the bare-earth surface under the adopted method. A **Digital Surface Model (DSM)** represents an upper or first-reflective surface under the product definition. Product terminology varies, so describe the construction rather than trusting the acronym alone.

Surface creation requires choices:

- which classes and returns enter;
- cell size and grid origin;
- statistic such as minimum, maximum, percentile or triangulated estimate;
- interpolation method and search radius;
- treatment of empty cells, water and edges;
- smoothing or outlier rules;
- uncertainty and coverage flags.

A maximum vegetation return can be unstable when one noise point exists. A high percentile may be more robust but needs enough points. For low coastal vegetation, cell size and percentile choice can determine whether height variation is resolved or dominated by sampling noise.

Preserve source-point evidence alongside rasters. A continuous surface is a model between discrete observations, not a transformation without assumptions.

## 7. Canopy-height models and negative differences

A common structural derivative is:

```text
canopy height model = DSM − DTM
```

Before subtraction, require identical CRS, transform, resolution, dimensions, bounds, units, vertical reference and compatible temporal support. Also inspect whether both products describe the intended surfaces. A DSM built from one acquisition and a DTM from another may be acceptable for stable ground if vertical compatibility is verified, but that is an assumption to document.

Negative canopy heights can arise from:

- horizontal misalignment;
- vertical-datum or offset differences;
- ground-classification errors;
- DSM outlier removal or low sampling;
- interpolation across gaps;
- water surfaces and edges;
- changes between acquisition dates;
- floating-point tolerance near zero.

Do not immediately clamp every negative value to zero. First map, quantify and diagnose them. After the cause is understood, a documented mask or tolerance may be defensible. Preserve the raw difference and QA layer.

[[CHECK:m2-l30-chm]]

## 8. Worked example — derive plot-level structural evidence

### Predict before running

For each synthetic plot, which classes should define the ground and upper vegetation estimates? What would happen if the unclassified 12.4 m point entered a simple maximum? Record your answer before execution.

```python
from pathlib import Path
import pandas as pd

path = Path("inputs/satellite-eo/lidar_point_samples.csv")
points = pd.read_csv(path)
ground = points[points["classification"].eq("ground")]
vegetation = points[points["classification"].eq("vegetation")]
dtm = ground.groupby("plot_id")["z_m"].median().rename("dtm_m")
dsm = vegetation.groupby("plot_id")["z_m"].quantile(0.95).rename("dsm_p95_m")
structure = pd.concat([dtm, dsm], axis="columns")
structure["height_p95_m"] = structure["dsm_p95_m"] - structure["dtm_m"]
structure["passes_height_qa"] = structure["height_p95_m"].ge(0)
print(structure.reset_index().to_string(index=False))
```

### Code walkthrough

1. The input remains a point table rather than being treated as a raster.
2. `classification == ground` selects the supplied ground interpretation.
3. Vegetation points are selected independently; unclassified points remain in the source but do not enter either surface estimate.
4. The median ground elevation is a transparent robust summary for this tiny exercise.
5. The 95th vegetation percentile represents an upper structural estimate and reduces dependence on a single maximum.
6. `concat` aligns the two summaries by stable plot ID.
7. Height is calculated only after ground and vegetation summaries share the same plot support.
8. The QA flag identifies non-negative results but does not prove the values are accurate.
9. Resetting the index restores `plot_id` as an explicit output column.
10. Printing all rows makes missing DTM or DSM evidence visible.

This example does not create a real DSM or DTM. It demonstrates the classification-to-structure logic at plot support. A raster workflow must additionally define grid, interpolation, gaps and alignment.

## 9. Structural metrics beyond maximum height

Point clouds can support metrics such as height percentiles, mean/median height, coefficient of variation, return density above thresholds, canopy cover fractions and vertical-distribution summaries. Every metric depends on sampling and preprocessing.

A 95th percentile requires enough valid points to estimate a percentile meaningfully. A cover fraction above 0.5 m depends on reliable ground normalisation and threshold relevance. Comparing metrics across sensors or campaigns requires compatible pulse density, scan geometry, classification, season and footprint.

For a meadow, extremely tall-canopy forest metrics may be insensitive. Choose thresholds from ecological structure and measurement uncertainty, not from a generic software recipe. If expected vegetation height is close to vertical uncertainty, report that the sensor cannot confidently resolve the difference.

Plot extraction should account for boundary uncertainty. A small field plot and a footprint or raster cell may not coincide perfectly. Test buffered or eroded support only with a declared rationale, and report sensitivity rather than selecting the result that best matches expectations.

## 10. Relating LiDAR to optical and SAR evidence

LiDAR structural height can help interpret an optical or SAR signal because it measures a different aspect of the canopy. Higher NDVI and higher canopy-height estimates may converge on a denser vegetation hypothesis, but neither proves biomass without field calibration. SAR VH may relate to structure, moisture or both.

Cross-sensor integration must preserve:

- acquisition time and phenological state;
- horizontal support and positional uncertainty;
- whether coverage is wall-to-wall, sampled tracks or footprints;
- quality and missingness by sensor;
- scale of the ecological reference observation;
- sensor-specific uncertainty.

Do not resample everything into one fine grid and call the supports identical. Aggregating to a common coarser unit may be defensible when the unit is large enough and valid coverage is reported. Hierarchical or footprint-aware models can preserve differing supports, but those methods require later statistical training.

## 11. Common mistakes and recovery

### Mistake: assuming last returns are ground

**Why beginners make it:** diagrams show a pulse ending at terrain.  
**Recognition:** return order replaces class and QA evidence.  
**Recovery:** use documented classification, inspect cross-sections and validate ground independently.

### Mistake: confusing density with accuracy

**Why beginners make it:** more points appear more precise.  
**Recognition:** density is reported as centimetre positional accuracy.  
**Recovery:** report density, horizontal/vertical accuracy and coverage as separate quantities.

### Mistake: comparing raw intensity across surveys

**Why beginners make it:** intensity looks like a spectral band.  
**Recognition:** range, angle and calibration are absent.  
**Recovery:** restrict use to supported within-survey applications or apply documented calibration.

### Mistake: subtracting any two elevation rasters

**Why beginners make it:** DSM and DTM have the same unit and shape.  
**Recognition:** transforms or vertical references differ.  
**Recovery:** run the complete horizontal grid and vertical-reference contract before subtraction.

### Mistake: silently clipping negative heights

**Why beginners make it:** negative vegetation seems impossible.  
**Recognition:** the final raster has no negative values and no QA record.  
**Recovery:** preserve, locate and investigate the negatives; apply a documented mask only after diagnosis.

[[CHECK:m2-l30-negative]]

## 12. Guided practice — create the structural report

1. Create `13_lidar_point_clouds.ipynb` and label the source synthetic.
2. Load the point table and assert unique `point_id`, finite coordinates and valid return-number relationships (`return_number <= number_of_returns`).
3. Count points by classification and plot. Map or scatter `x_m` and `y_m`, using class for colour and flagging the outlier.
4. Report point count and return count carefully; do not call the small sample a density without a defined area.
5. Record horizontal units and the unresolved synthetic local vertical reference.
6. Calculate plot-level median ground, 95th-percentile vegetation elevation and difference as in the worked example.
7. Add counts of ground and vegetation points beside every metric. Mark insufficient evidence where a required class is missing.
8. Compare a maximum-based upper surface with the class-filtered 95th percentile. Explain the outlier consequence.
9. Design, without pretending to execute, a raster grid contract for a DTM, DSM and height model.
10. Create an explicit negative-height investigation rule and a separate final validity flag.
11. Save `lidar_structure_report.csv`, reopen it and verify IDs, units, status and missing values.
12. Complete the LiDAR section of the QA template.

## 13. Independent challenge — evaluate a structural-data proposal

The team can choose between an airborne point cloud, a UAV photogrammetric surface pair and sampled spaceborne waveform LiDAR for a meadow-structure question. Write a 400–500-word recommendation that compares:

- direct observations and derived products;
- expected coverage and spatial support;
- ground visibility and terrain estimation;
- vertical reference and validation;
- season and acquisition timing;
- point/footprint density and gaps;
- integration with field plots;
- one product-specific failure mode;
- the claim each option can and cannot support.

Do not choose the most technologically advanced option by default. Choose evidence that matches the decision scale.

### Scientific interpretation

The synthetic point table supports a demonstration of how ground and vegetation classes can produce plot-level structural differences. It does not establish absolute meadow elevation because the vertical reference is deliberately non-authoritative. It does not establish true canopy height because the sample is tiny and has no independent vertical validation.

You may report the calculated difference as a synthetic, class-dependent structural estimate under the chosen median and 95th-percentile rules. You must also report point counts, excluded unclassified evidence and the possibility that ground or vegetation classes are incomplete.

In real work, structural interpretation becomes stronger when the point cloud has documented calibration and reference, sufficient ground and canopy sampling, spatially mapped error and field measurements at compatible support. A professional output includes the QA layer and gaps, not only a smooth height map.

## 15. Reflection, submission and portfolio artifact

### Reflection

- Which stage adds more uncertainty in your context: point classification or surface interpolation?
- What does a percentile height describe that a maximum does not?
- When could a relative height remain useful even if absolute vertical datum is unresolved?
- How would you show that a low-vegetation difference exceeds measurement uncertainty?

### Submission

Submit:

1. `lidar_structure_report.ipynb` with point audits, predictions and class-aware summaries;
2. `lidar_structure_report.csv` containing units, counts, surface statistics, height and QA status;
3. one point-location/class figure that retains the unclassified outlier;
4. a DTM–DSM–height grid contract and negative-height investigation rule;
5. the 400–500-word structural-data recommendation;
6. a concise interpretation separating observed points, classified evidence, derived surfaces and ecological claims.

### Portfolio artifact

Add **lidar_structure_report.ipynb** to the UAV and Satellite Analysis Pipeline. It should demonstrate that you can turn discrete three-dimensional returns into cautious structural evidence while preserving classification, support and vertical-reference limits.
