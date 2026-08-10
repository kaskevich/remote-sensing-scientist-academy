# QGIS vector QA checklist

Use this checklist with Lesson 2.10. It is a verification record, not permission to edit source data.

## Project record

- [ ] Record QGIS version and operating system
- [ ] Save `coastal_meadow_vector_qa.qgz` in the `qgis_qa/` folder
- [ ] Record the project CRS and measurement units
- [ ] Confirm that every layer resolves from its expected source path
- [ ] Label every layer as `RAW`, `INTERIM` or `DERIVED`

## Metadata and identity

- [ ] Record provider, geometry type, layer CRS, extent and feature count
- [ ] Compare row and stable-ID counts with the Python audit
- [ ] Identify null, empty and unclassified records explicitly
- [ ] Confirm that source identifiers survive in derivatives
- [ ] Record all selected-feature filters used during review

## Geometry and spatial relationships

- [ ] Style source and derivative boundaries so changes remain visible
- [ ] Run **Check validity** and retain its diagnostic outputs
- [ ] Reconcile every validity result with the Python topology report
- [ ] Inspect multipart, repair, duplicate and narrow-polygon QA cases
- [ ] Recheck the `TP04` boundary case and `TP05` outside-site case
- [ ] Compare any QGIS join with the declared Python predicate and cardinality

## Raster display checkpoint

- [ ] Record CRS, extent, dimensions, pixel size, bands, type and NoData
- [ ] Record the renderer and stretch used for display
- [ ] Inspect declared locations with the Identify tool
- [ ] Report seams, stripes, unexpected values and NoData edges without editing

## Layout and delivery

- [ ] Include a precise title, readable legend, relevant scale bar and CRS
- [ ] Include data-source, derivative-date and limitation notes
- [ ] Export PDF and PNG with recorded page size and resolution
- [ ] Reopen both files and check labels, legend classes and transparency
- [ ] Link every confirmed issue to a Python test, decision or unresolved record

## Scientific status

All vector coordinates, identifiers, boundaries and classes supplied in the training pack are synthetic. They are not published Baltic coastal-meadow observations and must not be presented as ecological evidence.
