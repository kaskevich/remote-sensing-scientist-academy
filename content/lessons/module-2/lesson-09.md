---
title: Topology, Geometry Cleaning and Data Integrity
lessonId: lesson-2-09
---

## 1. Prepare geometry through decisions, not a cleaning button

### Learning outcome

By the end of this lesson, you will be able to distinguish missing, empty, invalid, multipart, duplicated and topologically suspicious geometry; explain what `clip`, `explode` and `dissolve` change; create a candidate repair with `make_valid()`; audit feature count, geometry type and area through each transformation; identify slivers without imposing an arbitrary universal threshold; and produce a topology decision log that preserves every intervention and unresolved case.

**Prerequisites:** Complete Lessons 2.5–2.8. You should be able to audit GeoDataFrames, work in a justified projected CRS, interpret predicates and compare spatial-operation outputs. Allow 135–165 minutes.

### Why this matters

Vector data rarely arrive as one ideal polygon per ecological unit. A meadow may contain disconnected patches represented by a MultiPolygon. Two management records may intentionally share a boundary. Digitising can create self-intersections, narrow gaps or tiny overlaps. Repeated geometry can be either duplicate data or two legitimate records describing different dates.

The phrase “clean the polygons” is therefore too vague for scientific work. Each operation changes a representation:

- repair may split or collapse geometry;
- explode changes one multipart feature into several rows;
- dissolve removes internal boundaries and aggregates attributes;
- clip removes space outside a mask;
- duplicate removal changes the observational record.

Those changes can affect area, sample membership and later raster summaries. A professional workflow does not merely produce a file that runs. It preserves a reviewable chain from source condition to intervention and consequence.

> **Core topology question:** Which conditions prevent the intended analysis, and which apparent defects represent valid real-world structure?

### Scientific context

The coastal-meadow team receives an explicitly corrupted synthetic training derivative containing deliberately designed overlap, gap, invalid, duplicate and sliver cases. The geometries do not describe published Baltic sites. The clean original training pack remains unchanged. The corrupted derivative exists only to make integrity decisions visible before the team prepares real study polygons for zonal analysis.

Your job is not to make every warning disappear. Your job is to decide which geometry can proceed, which needs a documented transformation and which needs authoritative source review.

### Learner action

Add `## Lesson 2.9 — Topology, geometry cleaning and data integrity` to the Module 2 notebook. Create a decision-log table with these columns before editing any geometry:

`feature_id`, `observed_condition`, `evidence`, `planned_action`, `expected_change`, `authority_needed`, `status`.

## 2. Diagnose six conditions separately

### Missing geometry

A missing geometry has no spatial object for that row. The attributes may remain valuable, but the feature cannot participate in spatial predicates until an authoritative location is recovered. Do not invent geometry from a neighbouring feature.

### Empty geometry

An empty geometry is a geometry object with no coordinates. It can result from a set operation with no shared space or from an import problem. Missing and empty are not the same state, so count them separately with `.isna()` and `.is_empty`.

### Invalid geometry

An invalid polygon violates topology rules—for example, through self-intersection. Record both `is_valid` and a validity reason. Validity is a computational property, not proof that the boundary is correct or ecologically meaningful.

### Multipart geometry

A MultiPolygon represents one feature with several polygon parts. This can be correct for a habitat class split by water or infrastructure. The question is whether one attribute record genuinely applies to all parts.

### Duplicate geometry

Two rows may have identical geometry while differing in date, observer, legal designation or ecological class. Duplicate identifier, duplicate full row, exact coordinate encoding and topological equality are different tests. Never remove a row based only on a map that appears overdrawn.

### Coverage problems and slivers

Polygons intended to form a coverage may have overlaps or gaps. A narrow polygon may be a digitising sliver, a real drainage channel or a legitimate transition zone. Area alone cannot decide which interpretation is correct.

An individually valid feature does **not** prove dataset-level topology. A layer can contain only valid polygons while still violating its stated model through:

- overlaps where coverage is intended to be mutually exclusive
- gaps where coverage is intended to be complete
- slivers created by slightly different shared boundaries
- duplicate boundaries or duplicate features
- disconnected patches where continuity is required
- unintended interior holes
- adjacency relationships that contradict the specification

Topology is therefore conditional. Two habitat classes may be allowed to overlap; two exclusive management zones may not. Write the coverage and adjacency expectations before running checks.

Snapping and coordinate precision require the same discipline. Floating-point coordinates that differ by a tiny amount are not automatically an error, and a universal tolerance can merge real narrow features. Record the source precision, expected survey or digitising scale, snapping rule and tolerance units. Test the result at that tolerance; never snap every vertex silently because the output looks cleaner.

[[CHECK:m2-l9-condition]]

## 3. Build an immutable source and staged derivatives

Keep the original file read-only. Each intervention should create a named derivative:

```text
data/training/vector_foundations/training_topology_corrupted.geojson
data/interim/01_validity_candidates.gpkg
data/interim/02_reviewed_parts.gpkg
data/processed/analysis_zones.gpkg
reports/vector_topology_decisions.csv
```

The number prefix records operation order. The decision log records why each stage exists. A script or notebook records how it was created. This separation lets a reviewer compare source and result without reconstructing an undocumented sequence of manual edits.

For every stage capture a **snapshot**:

- row count and unique feature-ID count;
- missing, empty and invalid counts;
- geometry-type counts;
- total bounds and CRS;
- total polygon area in a suitable projected CRS;
- number of exact or normalised-geometry duplicates;
- minimum and selected low-area features for review;
- input file, output file and operation parameters.

Area change is a diagnostic, not an automatic pass/fail rule. A correct clip should reduce area. A dissolve should usually preserve the unioned coverage while changing rows. A repair can alter area slightly or produce several parts. Interpret the expected direction before running the operation.

## 4. Repair creates a candidate, not truth

GeoPandas provides `GeoSeries.make_valid()`. Depending on the defect and method, the result can be a Polygon, MultiPolygon, GeometryCollection, line-like remnant or empty geometry. A successful function call therefore does not establish that the result is suitable for polygon analysis.

For each invalid geometry:

1. preserve the source geometry and validity reason;
2. create the repaired geometry in a candidate layer;
3. compare type, part count, bounds and area;
4. inspect the candidate against source imagery or authoritative boundaries;
5. record acceptance, rejection or escalation;
6. retain the method and software versions.

Do not use `buffer(0)` as a mysterious universal repair. It may produce a valid result while hiding what changed. An explicit `make_valid()` call with before-and-after evidence is more transparent, but it still requires scientific review.

![Diagram showing a source-preserving vector workflow in which diagnose, candidate repair, topology review, explode, dissolve and clip stages each create an audited derivative and decision record.](lesson-media/images/vector-cleaning-decision-log.svg)

[[CHECK:m2-l9-repair]]

## 5. Worked example — create and audit repair candidates

Before running, predict which audit values are allowed to change after `make_valid()` and which scientific conclusion it cannot provide.

```python
from pathlib import Path
import geopandas as gpd

path = Path("data/training/vector_foundations/training_topology_corrupted.geojson")
source = gpd.read_file(path)
work = source.to_crs("EPSG:3301")
invalid = work.geometry.notna() & ~work.geometry.is_valid

candidate = work.copy()
candidate.loc[invalid, "geometry"] = candidate.loc[invalid].geometry.make_valid()
audit = {
    "source_rows": len(work), "invalid_before": int(invalid.sum()),
    "invalid_after": int((candidate.geometry.notna() & ~candidate.geometry.is_valid).sum()),
    "types_after": candidate.geom_type.value_counts(dropna=False).to_dict(),
    "area_change_m2": candidate.area.sum() - work.area.sum(),
}
print(audit)
```

### Code walkthrough

1. `Path` identifies the immutable training source.
2. GeoPandas is imported.
3. `source` reads the original synthetic QA cases.
4. `to_crs` creates a projected working copy for area comparisons.
5. `notna()` prevents missing geometry from being described as a repairable invalid polygon.
6. `~...is_valid` identifies non-missing geometries that fail topology validity.
7. `candidate` is a copy; the source object remains unchanged.
8. Only the identified rows receive candidate results from `make_valid()`.
9. The audit records source population and invalid count.
10. A post-operation validity count checks the computational result.
11. Geometry-type counts reveal Polygon, MultiPolygon or collection changes.
12. The area difference quantifies one consequence in square metres.
13. Printing the dictionary exposes evidence for the decision log.

Do not proceed directly from this output to a final analysis layer. Display each changed geometry beside its source, inspect its validity reason and decide whether the candidate represents the intended boundary.

## 6. Explode makes multipart structure explicit

`explode()` creates one output row for each part of a multipart geometry. Attributes are repeated because every part came from the same source feature.

This is useful when each patch needs its own area, raster extraction or map label. It is harmful if the source feature is one legal or ecological unit that must remain aggregated.

After exploding:

- retain the original feature identifier;
- create a stable `part_id` rather than pretending repeated IDs are accidental;
- compare source feature count with part count;
- compare total area within an explicit tolerance;
- check whether empty or non-polygon parts were produced earlier;
- state whether later statistics operate per part or per source feature.

```python
parts = reviewed.explode(index_parts=False, ignore_index=True)
parts["source_area_m2"] = parts.area
parts["part_no"] = parts.groupby("feature_id").cumcount() + 1
parts["part_id"] = (
    parts["feature_id"] + "-p" + parts["part_no"].astype(str)
)
```

The new `part_id` is analytical identity. It does not replace the source identity or imply that parts were independently observed.

## 7. Dissolve combines geometry and aggregates attributes

`dissolve(by="management")` groups rows by an attribute, unions their geometries and aggregates other columns. It can remove internal boundaries between adjacent polygons and create MultiPolygons when grouped patches are separate.

The geometry operation and the attribute operation must both be specified. A default “first value” for a non-group attribute may be scientifically meaningless. Decide explicitly:

- which numeric fields should be summed, averaged, weighted or omitted;
- which text fields are constant, concatenated or not transferable;
- whether observations from different dates can be combined;
- whether internal boundaries contain information that must be retained elsewhere.

```python
dissolved = parts.dissolve(
    by="management",
    aggfunc={"feature_id": "count", "source_area_m2": "sum"},
).rename(columns={"feature_id": "source_feature_count"})
```

The unioned geometry answers “space covered by this management class.” It does not preserve one row per source observation. Keep the source-to-dissolved relationship in the provenance record.

## 8. Clip changes the analysis extent

`geopandas.clip(features, mask)` intersects features with a mask and removes space outside it. This is not the same as selecting features whose centroid falls inside the study area. A crossing polygon can be shortened; a multipart result can be created; dimension can change at a boundary.

Before clipping:

- confirm both layers have the same suitable CRS;
- validate the mask and document its provenance;
- decide whether touching-only results should remain;
- record original geometry type, count and area.

After clipping:

- report features removed, retained and changed;
- compare area and bounds with the expected mask extent;
- inspect geometry types, empties and validity;
- keep the pre-clip identity and create a derivative identifier where needed.

GeoPandas also permits a rectangular bounds tuple as a fast clipping shortcut. That path can produce slightly different edge behaviour and potentially invalid output. Use it only when a rectangular crop is the declared operation and validate the result.

[[CHECK:m2-l9-operations]]

## 9. Duplicate and sliver decisions require provenance

For a stricter exact-geometry screen, normalise coordinate ordering before creating a WKB fingerprint:

```python
fingerprint = work.geometry.normalize().to_wkb(hex=True)
possible_duplicates = work.loc[
    fingerprint.duplicated(keep=False),
    ["feature_id", "survey_date", "qa_case", "geometry"],
]
```

This identifies geometries with the same normalised encoding. It still does not decide whether rows are duplicate records. Compare identifiers, dates, source layers, attributes and purpose.

For slivers, create review evidence rather than one universal deletion rule. Useful evidence includes area, perimeter-to-area relationship, minimum width, neighbouring classes, source resolution, snapping tolerance and overlay history. A 0.5 m² polygon may be noise in a 10 m satellite classification but meaningful in a centimetre-scale UAV survey.

If polygons are intended to form a non-overlapping coverage, recent GeoPandas/Shapely environments also expose coverage-validity diagnostics. Treat tool availability as version-dependent, and retain a visual and attribute-based review. Ordinary `.is_valid` checks each polygon independently; it does not prove that a collection has no overlaps or gaps.

## 10. Operation order is an analytical decision

Repair → explode → dissolve → clip does not necessarily equal clip → repair → dissolve. An invalid feature may fail or change during clip. Dissolving before inspection can hide duplicated boundaries. Exploding before a feature-level attribute calculation can count one observation several times.

Write the intended sequence in words:

1. diagnose source conditions without editing;
2. create repair candidates only for invalid geometry;
3. review candidate meaning and geometry family;
4. expose multipart parts only when the analysis needs part-level units;
5. aggregate only with explicit attribute rules;
6. limit to the authoritative study mask;
7. run a final topology, identity and area audit;
8. export a derivative without overwriting the source.

The sequence can differ for another scientific question. What matters is that it is declared, tested and recoverable.

## 11. Common mistakes and recovery

### Applying repair to every feature

**Why it happens:** one vectorised command feels consistent. **Recognition:** valid source geometries receive unexplained replacements. **Fix:** identify invalid cases first, repair candidates selectively and preserve before-and-after evidence.

### Removing multipart geometry automatically

**Why it happens:** a single Polygon seems easier. **Recognition:** islands or separated habitat patches disappear or become unrelated records. **Fix:** establish whether multipart structure represents one ecological unit before exploding or filtering.

### Dissolving attributes by default

**Why it happens:** geometry is the visible goal. **Recognition:** the output retains an arbitrary first date or observer. **Fix:** declare an aggregation rule—or omission—for every non-group attribute.

### Deleting small polygons as slivers

**Why it happens:** small shapes look untidy. **Recognition:** the threshold has no connection to positional accuracy, mapping scale or ecological process. **Fix:** create a review class and justify decisions with provenance and scale.

### Treating stable total area as proof

**Why it happens:** the headline QA number is unchanged. **Recognition:** geometry or feature identity changed while area stayed similar. **Fix:** combine area with counts, types, IDs, topology relationships and visual comparison.

## 12. Guided practice — prepare an analysis-zone derivative

Use the downloadable topology-case layer and the synthetic training study area.

1. copy both into the notebook's raw-data folder without editing them;
2. create the predeclared decision log;
3. audit missing, empty, invalid, multipart and possible duplicate conditions;
4. record validity reasons for every invalid feature;
5. create a candidate repair layer and compare each changed geometry;
6. accept or reject candidates individually with a reason;
7. explode reviewed multipart geometry and create stable part IDs;
8. identify duplicate-geometry candidates and compare their attributes;
9. classify the narrow feature as `retain`, `remove` or `needs_authority`—with evidence;
10. dissolve only the features whose management grouping is meaningful;
11. clip the reviewed result to the study area;
12. export every stage to a separate GeoPackage layer;
13. reopen the final layer and rerun the complete snapshot audit.

### Required QA evidence

Create a stage table with input/output file, operation, parameters, row count, source-ID count, geometry types, missing/empty/invalid counts, duplicate candidates, total area, area difference and reviewer decision. Every count change must be explained.

Keep two deliverables separate. `vector_integrity_report.csv` records every condition, evidence, decision and unresolved authority question. `vector_topology_reviewed.gpkg` contains only the explicitly accepted repair decisions. Never infer that an absence from the repaired derivative means the original condition was unimportant.

## 13. Independent challenge — investigate an ambiguous sliver

Treat the provided narrow polygon as an unresolved case. Build two candidate workflows:

- retain it as a potential transition habitat;
- remove or merge it under a declared topology rule.

For each candidate, calculate area and neighbouring relationships, show how plot assignment or zonal area would change, and list the authoritative evidence needed to choose. Do not decide from appearance alone. Conclude with one of three states: accepted, rejected or escalated for source review.

### Scientific interpretation

The topology report can demonstrate what the software detected and how each candidate derivative differs. It cannot establish the true ecological boundary. That conclusion may require survey protocol, acquisition date, positional accuracy, imagery and domain expertise. An unresolved feature is a valid professional result when the evidence is insufficient.

## 14. Reflection, submission and portfolio artifact

Answer in your private notes:

1. Why are missing, empty and invalid geometries different problems?
2. When is a MultiPolygon the correct representation?
3. What information can be lost during dissolve?
4. Why is no universal sliver-area threshold defensible?
5. Which evidence would make you reject a technically valid repair?

### Submission

- **Notebook:** the continuing pipeline notebook with source audit, candidate repairs, part handling, dissolve, clip and final verification.
- **File:** `vector_topology_report.ipynb`, `vector_integrity_report.csv` and the separately named reviewed GeoPackage derivative.
- **Screenshot:** a before-and-after map highlighting every changed or unresolved geometry.
- **Written answer:** 240–320 words defending the operation sequence and explaining one rejected or escalated candidate.

### Portfolio artifact

**Artifact 2.9 — Vector topology and integrity report**

This artifact demonstrates that you can prepare analysis geometry without erasing provenance or uncertainty. Add the stage audit, topology decision log and reviewed analysis-zone derivative to the vector-processing stage of the UAV and Satellite Analysis Pipeline.
