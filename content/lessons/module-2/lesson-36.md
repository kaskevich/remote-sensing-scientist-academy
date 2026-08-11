---
title: PostGIS Fundamentals
lessonId: lesson-2-36
---

## 1. Move a spatial relationship into the database

### Learning outcome

By the end of this lesson, you will be able to distinguish PostGIS `geometry` and `geography`; inspect and reason about geometry type and SRID; choose `ST_Intersects`, `ST_Within`, `ST_Buffer`, `ST_Distance`, `ST_DWithin` and `ST_Transform` for a stated spatial question; explain how a GiST spatial index supports candidate search; translate a GeoPandas spatial operation into reviewable SQL; and validate boundary, CRS and join-cardinality behaviour before accepting the result.

- **Lesson type:** Spatial SQL reasoning lab
- **Estimated time:** 190–240 minutes
- **Prerequisites:** CRS, vector geometry, spatial predicates, joins and Lesson 2.35
- **Portfolio output:** `postgis_plot_assignment.sql`

### Why this matters

GeoPandas is excellent for analysis in a notebook, but an organisation may need many analysts and applications to query the same authoritative spatial objects. Repeatedly downloading files, repairing them locally and sending new copies creates inconsistency. PostgreSQL provides transactions, constraints, roles and relational queries; PostGIS extends it with spatial types, indexes and functions.

Moving an operation into PostGIS does not change the scientific question. “Assign each plot to a management zone” still depends on CRS, geometry validity, boundary semantics and one-to-many behaviour. The database can execute the operation for millions of features, but scale amplifies a mistaken predicate as efficiently as a correct one.

The professional skill is therefore not knowing function names. It is preserving the meaning of a spatial relationship while moving it from an in-memory workflow into a shared, indexed system.

### Scientific context

The synthetic Chapter 7 database contains twelve field-plot points and three management-zone polygons. Most plots lie clearly inside one zone. Plot P012 lies exactly on the shared boundary between the central and eastern zones. That deliberate condition asks a real scientific question: does a boundary plot belong to neither zone, one chosen zone or both zones for the intended analysis?

You will compare `ST_Within` and `ST_Intersects`, retain the ambiguity and create a reviewed assignment rather than hiding it with an arbitrary spatial rule. The geometries are invented training data encoded with SRID 3301 and are not published Baltic field locations.

## 2. One concept — spatial SQL combines measurement semantics with relational control

### Concept

The single idea in this lesson is that **a spatial database query is valid only when its spatial type, reference system, predicate and relational grain all match the scientific relationship**.

PostGIS adds spatial columns such as:

```text
geometry(Point, 3301)
geometry(Polygon, 3301)
geography(Point, 4326)
```

The declaration constrains geometry family and SRID. `geometry` represents coordinates in a planar coordinate space defined by the CRS. Distance and area use that coordinate system's units and distortion properties. `geography` represents longitude/latitude on the Earth and provides a more convenient spheroidal interpretation for supported measurements, commonly returning metres, but with different function coverage and computational cost.

Neither type is universally better. For a local analysis already designed in an appropriate projected CRS, `geometry` makes planar overlay and measurement clear. For global or long-distance longitude/latitude measurement, `geography` can avoid treating degrees as linear units. The choice must follow extent, accuracy, operation and intended meaning.

### SRID is metadata, not a repair

An SRID—spatial reference system identifier—states how coordinates should be interpreted. `ST_SRID(geom)` inspects the recorded identifier. `ST_SetSRID(geom, 3301)` labels existing coordinate numbers; it does not move them. `ST_Transform(geom, 3301)` calculates new coordinate numbers in the target CRS using the known source CRS.

This mirrors GeoPandas:

| Intent | GeoPandas | PostGIS |
| --- | --- | --- |
| inspect CRS/SRID | `gdf.crs` | `ST_SRID(geom)` / metadata views |
| assign verified missing reference | `set_crs()` | `ST_SetSRID()` or typed load |
| transform coordinates | `to_crs()` | `ST_Transform()` |

Assigning the desired SRID to coordinates that belong to another CRS makes invalid geometry look authoritative. Verify the source before setting or transforming it.

[[CHECK:m2-l36-srid]]

## 3. Spatial predicates are scientific definitions

### `ST_Intersects(a, b)`

Returns true when the geometries share any point. A point on a polygon boundary intersects it. Two polygons that only touch also intersect. It is inclusive and useful for detecting any contact, but it can return multiple zones for one boundary point.

### `ST_Within(a, b)`

Asks whether geometry A lies within geometry B under the topological definition. A point on the polygon boundary is not within its interior. Argument order matters: plot within zone is not written zone within plot. The inverse relation is usually `ST_Contains(b, a)`.

### `ST_Buffer(a, distance)`

Creates a geometry containing locations within a specified distance under the input type and CRS. With projected geometry, the number uses CRS units. Buffering longitude/latitude geometry by `100` means 100 degrees, not 100 metres. Buffering can also change analytical support: a 20 m plot neighbourhood is a modelled area, not a measured plot.

### `ST_Distance(a, b)` and `ST_DWithin(a, b, distance)`

`ST_Distance` returns a distance; units and Earth model follow the types and CRS. For “find features within a threshold”, `ST_DWithin` expresses the condition directly and can make effective use of a suitable spatial index. Calculating distance for every possible pair and filtering afterward may be unnecessarily expensive.

### `ST_Transform(a, srid)`

Transforms geometry coordinates into another reference system. It is scientifically necessary when inputs are in different known CRSs or an analysis CRS is required. Transforming both columns inside every large join may prevent the stored-column index from serving the predicate efficiently. A reviewed, materialised analysis-CRS column or derivative table can be preferable when the operation recurs.

### Visual explanation

```text
Spatial join evaluation

1  scientific question     "Does a plot fall inside a management interior?"
             ↓
2  compatible geometry     Point and Polygon, known valid SRID
             ↓
3  index candidate test    bounding boxes may overlap
             ↓
4  exact predicate         ST_Within or ST_Intersects
             ↓
5  relational audit        unmatched and multiple matches by plot_id
             ↓
6  interpretation          assignment, boundary review or no assignment
```

The spatial index provides an efficient bounding-box candidate screen, not a replacement for the exact predicate.

[[CHECK:m2-l36-predicate]]

## 4. Spatial indexes and query evidence

A conventional B-tree index works well for ordered values such as IDs and dates. Geometry does not have one natural one-dimensional order. PostGIS commonly uses a GiST index that organises feature bounding boxes. Functions such as `ST_Intersects`, `ST_Within` and `ST_DWithin` can apply an index-supported bounding-box filter and then evaluate exact geometry for candidates.

Create the index on the stored geometry column:

```sql
CREATE INDEX field_plots_geom_gix
ON academy.field_plots USING gist (geom);
```

An index has costs: storage, maintenance during writes and operational complexity. On twelve training plots, a sequential scan may be faster. The reason to inspect an execution plan here is to learn the evidence, not force the optimiser to use an index. `EXPLAIN` shows the planned operations; `EXPLAIN ANALYZE` executes the query and records actual behaviour, so run it only in an authorised safe environment.

Statistics must be current enough for the planner, and the expression in the query must match what can be indexed. A spatial index does not validate geometries, reconcile CRSs or define the correct predicate.

## 5. Worked example — assign plots and preserve boundary review

### Predict before running

P012 lies on the border shared by Z02 and Z03. Predict whether `ST_Within(p.geom, z.geom)` will return zero, one or two matches for that plot. Then predict the result under `ST_Intersects`. Which result is more useful for detecting ambiguity, and which is a defensible final assignment?

```sql
WITH candidate_assignments AS (
  SELECT
    p.plot_id,
    z.zone_id,
    ST_Within(p.geom, z.geom) AS is_within,
    ST_Intersects(p.geom, z.geom) AS intersects
  FROM academy.field_plots AS p
  JOIN academy.management_zones AS z
    ON ST_Intersects(p.geom, z.geom)
)
SELECT
  plot_id,
  COUNT(*) AS intersecting_zones,
  COUNT(*) FILTER (WHERE is_within) AS containing_interiors,
  STRING_AGG(zone_id, ', ' ORDER BY zone_id) AS candidate_zone_ids
FROM candidate_assignments
GROUP BY plot_id
ORDER BY plot_id;
```

### Code walkthrough

1. The common table expression preserves candidate relationships for audit.
2. `plot_id` keeps every result connected to a stable plot.
3. `zone_id` identifies the candidate management polygon.
4. `ST_Within` tests whether the plot is inside the zone interior under the topological model.
5. `ST_Intersects` records any shared point, including a boundary.
6. Plots and zones are read from their authoritative schema-qualified tables.
7. The join condition uses `ST_Intersects`, intentionally retaining boundary candidates.
8. The outer query reports one row per plot that has at least one candidate.
9. `COUNT(*)` exposes one-to-many intersections rather than silently duplicating plots.
10. The filtered count reports how many candidates contain the plot in their interior.
11. `STRING_AGG` preserves all candidate zone IDs in stable order for human review.
12. Grouping restores the declared one-row-per-plot output grain.
13. Ordering makes the review table stable but does not change its meaning.

This query is an **audit**, not the final zone assignment. Clearly interior plots should have one intersecting zone and one containing interior. P012 should expose multiple intersecting zones and no containing interior. A final policy may use surveyed ownership, management records, a tolerance rule or an explicit boundary category. It must not select the first returned polygon, because database row order is not a scientific rule.

## 6. GeoPandas and PostGIS equivalents

The tools can express related operations, but equivalent syntax does not guarantee equivalent results.

| Scientific operation | GeoPandas / Shapely | PostGIS |
| --- | --- | --- |
| inspect reference | `gdf.crs` | `ST_SRID(geom)` |
| transform | `gdf.to_crs(3301)` | `ST_Transform(geom, 3301)` |
| validity | `gdf.geometry.is_valid` | `ST_IsValid(geom)` |
| any contact | `gpd.sjoin(..., predicate="intersects")` | join on `ST_Intersects()` |
| point in polygon interior | `predicate="within"` | join on `ST_Within()` |
| buffer | `gdf.buffer(20)` | `ST_Buffer(geom, 20)` |
| threshold distance | spatial index plus distance logic | `ST_DWithin()` |
| nearest relationship | `sjoin_nearest()` | `ORDER BY geom <-> target LIMIT ...` plus exact validation |

To reconcile results, use the same source version, geometry cleaning, CRS, predicate, boundary policy and QA filters. Compare stable ID pairs, not just total counts. Differences can arise from library versions, geometry validity, precision, geographic versus planar operations and tie handling.

## 7. Common mistakes and recovery

### Mistake: treating SRID 4326 geometry distances as metres

**Why beginners make it:** web maps display longitude/latitude naturally.  
**Recognition:** a 100-unit buffer spans countries or warnings are ignored.  
**Recovery:** choose an appropriate projected CRS for local measurement or a supported geography operation; document accuracy and units.

### Mistake: using `ST_SetSRID` to “reproject” coordinates

**Why beginners make it:** the output reports the desired SRID.  
**Recognition:** coordinate numbers do not change after the supposed reprojection.  
**Recovery:** verify the true source reference, label only when justified, then use `ST_Transform` to calculate new coordinates.

### Mistake: choosing `ST_Intersects` because it returns fewer unmatched rows

**Why beginners make it:** completeness looks like quality.  
**Recognition:** boundary plots acquire two zones.  
**Recovery:** derive the predicate from the relationship, report ambiguity and introduce a reviewed boundary policy.

### Mistake: buffering to repair positional uncertainty silently

**Why beginners make it:** more features match after a tolerance.  
**Recognition:** the buffer distance has no accuracy or process basis.  
**Recovery:** quantify uncertainty, justify tolerance independently and report sensitivity rather than changing the geometry's meaning invisibly.

### Mistake: assuming an index makes every query fast

**Why beginners make it:** indexes are described as performance switches.  
**Recognition:** wrapped expressions or small tables use sequential scans.  
**Recovery:** inspect the plan, query the indexed stored representation and optimise only after measuring the relevant workload.

### Mistake: comparing only GeoPandas and PostGIS row totals

**Why beginners make it:** totals are quick to report.  
**Recognition:** different plot–zone pairs cancel into the same count.  
**Recovery:** perform an anti-join on stable relationship keys and inspect every disagreement.

[[CHECK:m2-l36-index]]

## 8. Guided practice — build a spatial predicate audit

1. Create `16_postgis_fundamentals.ipynb` and `postgis_plot_assignment.sql`.
2. Read the pack README, manifest and `schema.sql`. Identify every constraint and index before execution.
3. Use only a disposable authorised PostGIS database. Record PostgreSQL and PostGIS versions and never store credentials in the notebook.
4. Load the synthetic source tables into a staging schema. Reconcile source, imported, rejected and promoted row counts.
5. Confirm geometry types, SRIDs, emptiness and validity before spatial queries.
6. Verify that plot and zone geometry columns share SRID 3301. State why this label is used only for invented teaching geometry.
7. Count `ST_Within` assignments by plot. List unmatched and multiple matches.
8. Repeat with `ST_Intersects`. Compare exact plot–zone ID pairs.
9. Create an explicit `boundary_review` result for plots with zero interiors and more than one intersection.
10. Test a 20 m plot buffer against zones. State how the buffer changes support and why this is not automatically a better assignment.
11. Calculate distance from each plot to the nearest zone boundary in projected units. Review ties.
12. Write a proximity query using `ST_DWithin`, then compare it with `ST_Distance(...) <= threshold` conceptually and with an execution plan.
13. Inspect the GiST indexes and use `EXPLAIN` on a representative predicate. Do not demand an index scan on this tiny dataset.
14. Reproduce the within/intersects ID pairs with GeoPandas using the same files and predicate definitions.
15. Save an anti-join table of any differences. If none exist, retain the zero-difference evidence.
16. Complete the spatial-integrity and query-reconciliation sections of the QA template.

## 9. Independent challenge — design a reviewed proximity rule

The field team asks for plots “within 75 metres of the eastern management unit”. Write two candidate PostGIS queries:

1. a planar `geometry` query in the declared local projected CRS using `ST_DWithin`;
2. a carefully justified alternative showing how the operation would differ if authoritative source points were stored as WGS 84 geography.

Return plot ID, distance, inside/intersects status and QA status. State whether distance is measured to the zone surface or boundary and how inside plots should be reported. Add an execution-plan note and a test for mixed SRIDs.

Do not present the synthetic coordinates as an actual 75 m Baltic monitoring result. The deliverable is a method and validation record.

### Scientific interpretation

PostGIS centralises spatial relationships, constraints and access, which can make multi-user evidence more consistent. It does not decide whether the scientific relationship is “within”, “touches”, “intersects” or “within a tolerance”. Those are domain definitions with consequences for ecological classification.

The P012 boundary case is valuable because it prevents a clean-looking count from replacing reasoning. An intersection audit identifies that the point touches two zones. A within audit identifies that it belongs to neither polygon interior. The correct management assignment requires evidence beyond geometry or an explicit boundary policy. Preserving the ambiguity is more professional than silently choosing one row.

## 10. Reflection, submission and portfolio artifact

### Reflection

- When would geography be preferable to projected geometry for an environmental distance query?
- Why can a spatial index accelerate a wrong predicate without making it valid?
- Which evidence should govern a plot lying exactly on a management boundary?
- What must match before GeoPandas and PostGIS results are comparable?

### Submission

Submit:

1. `postgis_plot_assignment.sql` with schema inspection, predicates, proximity and audit queries;
2. `plot_zone_predicate_audit.csv` with within, intersects and review status by plot;
3. a GeoPandas–PostGIS reconciliation table keyed by plot and zone ID;
4. one execution-plan explanation identifying candidate and exact spatial work;
5. one diagram showing geometry/geography, CRS and operation decisions;
6. a 250–350 word boundary and distance interpretation;
7. the completed spatial sections of `SPATIAL_DATABASE_QA_TEMPLATE.md`.

### Portfolio artifact

Add `postgis_plot_assignment.sql` to the **Spatial Database Query Pack** in the UAV and Satellite Analysis Pipeline. Include the reviewed predicate matrix, SRID evidence, index definition, reconciliation result and boundary decision. The artifact should demonstrate that you can scale a spatial operation without losing the spatial reasoning established in the earlier GeoPandas chapters.
