# Module 2 vector-foundations training data

These small GeoJSON files support Lessons 2.5–2.7 of Remote Sensing Scientist Academy.

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

The deliberately ambiguous boundary point makes predicate behaviour and one-to-many outcomes visible. The outlying point makes unmatched and nearest-neighbour decisions visible.

## Provenance

Created for Remote Sensing Scientist Academy. Last reviewed 10 August 2026. Preserve this README with downloaded copies and record any transformations or derivatives in the learner notebook.
