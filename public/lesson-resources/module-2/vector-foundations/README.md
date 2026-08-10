# Module 2 vector-foundations training data

These small GeoJSON and QA-support files support Lessons 2.5–2.10 of Remote Sensing Scientist Academy.

## Scientific status

Every coordinate, identifier, boundary and class in this folder is synthetic and exists only for instruction. The files do not contain published Baltic coastal-meadow plot locations, management boundaries or vegetation observations. Do not use them as ecological evidence.

The published plant-traits dataset used elsewhere in the Academy is cited separately as Zenodo record 20083250. Its table does not publish plot coordinates. These training files must never be joined to that table as if their `plot_id` values represented real samples.

## Spatial convention

The files follow RFC 7946 GeoJSON position order: longitude first, latitude second, in WGS 84 decimal degrees. GeoPandas should report a compatible geographic CRS when they are read. Transform a copy to a justified projected CRS before metre-based distance, area or buffer operations.

## Files

- `training_field_plots.geojson` — five instructional point features; one lies on intersecting zone boundaries and one lies outside the training study area
- `training_study_area.geojson` — one rectangular instructional site boundary
- `training_management_zones.geojson` — two polygons sharing a vertical boundary
- `training_vegetation_zones.geojson` — two polygons sharing a horizontal boundary
- `training_topology_cases.geojson` — five original deliberate QA cases covering multipart, invalid, duplicate and narrow polygon conditions
- `training_topology_corrupted.geojson` — separate, explicitly corrupted derivative containing overlap, gap, invalid, duplicate and sliver cases for Lesson 2.9; never substitute it for the clean pack
- `training_data_manifest.json` — machine-readable purpose, geometry, CRS, feature-count, QA expectation, status and checksum record
- `QGIS_Vector_QA_Checklist.md` — ordered visual-verification protocol for the QGIS checkpoint
- `qgis_qa_observations.csv` — structured observation log linking visual findings to features, evidence and decisions

The deliberately ambiguous boundary point makes predicate behaviour and one-to-many outcomes visible. The outlying point makes unmatched and nearest-neighbour decisions visible.

The topology cases are designed to provoke inspection rather than automatic repair. A condition named in `qa_case` is not an instruction to delete or alter a feature. Learners must preserve the source, create reviewed candidates and document every decision.

## Provenance

Created for Remote Sensing Scientist Academy. Last reviewed 11 August 2026. Preserve this README with downloaded copies and record any transformations or derivatives in the learner notebook.
