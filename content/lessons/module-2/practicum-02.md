---
title: Vector Handover Review
lessonId: module-2-chapter-2-practicum
---

## Professional Mistakes — Vector GIS

Use this checkpoint before accepting responsibility for a vector derivative.

| Mistake | Why it happens | Detect | Prevent | Potential consequence |
|---|---|---|---|---|
| Treating the DataFrame index as scientific ID | row labels look unique | reorder or export and compare | create, validate and preserve a stable ID | records cannot be traced across stages |
| Trusting visual overlap | the map looks convincing | compare CRS, bounds and control evidence | audit metadata and known positions | systematically displaced results appear valid |
| Buffering geographic coordinates | the layer already draws correctly | inspect CRS units before distance work | transform to a justified projected CRS | meaningless or latitude-dependent distances |
| Using `intersects` for every relationship | it returns many plausible matches | test boundary and containment cases | define the scientific relationship first | boundary contacts become false assignments |
| Deleting unmatched features | complete tables look cleaner | reconcile left-side IDs before and after | retain and classify unmatched records | missingness and sampling bias are hidden |
| Dropping one-to-many rows as duplicates | repeated IDs resemble errors | inspect matched right-side IDs and geometry | declare cardinality and aggregation policy | legitimate relationships are erased |
| Nearest assignment without a threshold | every feature receives an answer | map distance distribution and far matches | use projected units and a justified maximum distance | unrelated features are attached |
| Assuming valid geometry means valid topology | each feature passes `is_valid` | inspect overlaps, gaps and coverage rules | test dataset-level expectations | contradictory or incomplete coverage persists |
| Auto-repairing without review | software returns a valid result | compare type, count, area and boundaries | preserve source and review repair candidates | real features are split, collapsed or moved |
| Ignoring spatial-index performance | small examples run quickly | calculate `n × m` and profile controlled cases | use indexed operations and verify equivalent IDs | scaling prompts manual shortcuts or incomplete QA |
| Overwriting raw layers | a fix feels final | check whether an immutable input remains | write named derivatives only | provenance and recovery are lost |
| Failing to reopen derivatives | successful write feels complete | read the delivered file in a fresh step | validate CRS, schema, counts and geometry after write | corrupt or incomplete handovers escape review |

## Chapter 2 Practicum — Vector Handover Review

### Professional outcome

By the end of this practicum, you will be able to accept, conditionally accept or reject a vector delivery using reproducible Python evidence and independent QGIS inspection.

## 1. Client request

An environmental consultancy receives synthetic field points, management polygons and habitat polygons. The client asks for “one clean analysis-ready GeoPackage.” That phrase is not a specification. Your first responsibility is to define what **analysis-ready** means for the proposed spatial assignments while preserving unresolved evidence.

Use the clean training pack for intended relationships and the separately labelled corrupted topology derivative for diagnostic practice. Never replace the clean source with the corrupted or repaired copy.

[[CHECK:m2-p2-validity]]

## 2. Complete the fifteen-step review

1. Audit every file, layer, feature count, geometry type and extent
2. Verify source CRS evidence, axes, units and analysis CRS
3. Check stable IDs for nulls, uniqueness and preservation
4. Diagnose missing, empty, invalid, multipart and duplicate geometry separately
5. Test dataset topology for overlaps, gaps, slivers, unintended holes and coverage expectations
6. Resolve only documented defects; preserve rejected and unresolved candidates
7. Define each attribute or spatial relationship and predicate before execution
8. Perform joins with traceable left and right IDs
9. Audit input/output counts, unmatched cases, one-to-many results and unused right-side features
10. Profile a repeated predicate or join and verify indexed/naive equivalence
11. Reconcile Python evidence in QGIS, including `TP04`, `TP05`, assignments and topology defects
12. Write named layers to `vector_handover_review.gpkg` without overwriting sources
13. Reopen the GeoPackage and rerun schema, CRS, count, ID and geometry checks
14. Create a QA map that exposes decisions and unresolved cases
15. Write a short handover note with fitness, limitations, owners and next actions

## 3. Required integrity report

Create `vector_integrity_report.csv` with at least:

`check_id`, `layer`, `feature_id`, `condition`, `expected`, `observed`, `severity`, `decision`, `evidence`, `owner`, `status`

Keep two outputs distinct:

- the **integrity report**, which retains every finding and decision
- the **repaired derivative**, which contains only explicitly accepted geometry changes

A clean-looking derivative without its integrity report is not a complete handover.

[[CHECK:m2-p2-reconcile]]

## 4. Reconciliation rules

Python and QGIS should reproduce the same declared relationships. Visual agreement is useful evidence, but it is not numerical proof. Reconcile:

- source path, CRS and feature count
- `TP04` boundary behaviour and `TP05` outside status
- management and vegetation-zone assignments
- invalid, overlap, gap, duplicate and sliver cases
- changed geometry IDs and post-repair status

If results differ, compare input versions, selected-feature filters, predicate direction, tolerance, precision and software version. Do not choose the answer with fewer unresolved records.

## 5. QA map and handover decision

The map must include a precise purpose, CRS, scale where relevant, synthetic-data label, source/provenance note, stable IDs for review cases and a legend that distinguishes accepted, unresolved and rejected conditions without relying on colour alone.

End `HANDOVER_NOTES.md` with one status:

- accepted for the defined analysis
- conditionally accepted with listed restrictions
- rejected pending listed evidence or correction

[[CHECK:m2-p2-handover]]

### Scientific interpretation

This review can establish that the delivered vector relationships and derivatives satisfy declared structural and computational rules. It cannot establish ecological boundary truth, survey accuracy or temporal relevance beyond the supplied evidence.

### Submission

- `vector_handover_review.ipynb`
- `vector_handover_review.gpkg`
- `vector_qa_map.pdf` or `vector_qa_map.svg`
- `vector_integrity_report.csv`
- `HANDOVER_NOTES.md`

### Portfolio artifact

**Artifact 2.B — Analysis-ready vector handover**

Add the notebook, GeoPackage, integrity report, QA map and handover note as one reviewable package in the UAV and Satellite Analysis Pipeline.
