# Module 2 Chapter 8 final review

Review date: 11 August 2026

## Scope

Chapter 8 publishes five complete lessons and one practicum:

- 2.38 Xarray and Rioxarray;
- 2.39 EO Data Cubes;
- 2.40 Dask and Lazy Computation;
- 2.41 COG, Zarr and Cloud-Native Formats;
- 2.42 STAC;
- Chapter 8 Practicum — Build a Reproducible Cloud-Native EO Evidence Cube.

The lessons extend one workflow from catalogue discovery through array and cube contracts, bounded execution and format release. They preserve the existing Academy layout, learner notes, progress, upload, submission and feedback functionality.

## Vertical lesson quality

Every lesson contains learning outcome, scientific motivation and continuing Baltic coastal-meadow context; one explicit conceptual centre; a visual explanation; a short worked example; line-by-line walkthrough; prediction; formative checks; beginner failure recovery; guided and independent practice; scientific interpretation; reflection; submission and portfolio artifact.

Examples remain within 20 Python lines. The lessons do not require a paid cloud account or a live service. Optional live access is clearly separated from deterministic assessed evidence.

## Horizontal curriculum integrity

The chapter creates **Artifact 2.H — Cloud-Native EO Discovery and Cube Package** and adds six checkpoints to the Module 2 portfolio starter. It reinforces rather than replaces earlier learning:

- Chapter 1 CRS, spatial support and format decisions become cube-grid and delivery contracts;
- Chapter 3 raster masks, transforms and windows become labelled-array and COG evidence;
- Chapter 5 optical scaling and local cloud QA become cube eligibility rules;
- Chapter 7 object-storage authority and immutable publication become Zarr/COG release governance.

The curriculum map and promise matrix now identify Chapter 8 as a multidimensional and scalable-computation foundation. They continue to label a real multi-year monitoring workflow and production orchestration as future work.

## Scientific and security boundaries

- all pack observations, coordinates, STAC records and asset URLs are synthetic;
- the reserved `example.invalid` domain prevents accidental fixture download;
- scene cloud is never treated as local pixel validity;
- shape equality is never treated as grid equality;
- composites require valid-observation counts and source lineage;
- signed URLs, tokens and credentials are excluded from submission guidance;
- remote compute is bounded by selection, memory estimate and abort criteria;
- COG and Zarr claims require layout, delivery, client and result evidence;
- immutable version promotion prevents partial cloud-store releases.

## Reference baseline

The content was checked against current primary documentation from Xarray, Rioxarray, Dask, the OGC COG standard, the Zarr specification and STAC specifications. The lessons distinguish standards from provider-specific implementation and avoid universal performance claims.

## Training pack

`public/lesson-resources/module-2/cloud-native-eo/` contains a checksum manifest, structure contract, observation and pixel inventories, chunk scenarios, format claims, deterministic STAC ItemCollection and QA template. Deliberate failures include:

- a half-pixel shifted observation;
- a missing local mask;
- tiny and monolithic chunk plans;
- a non-COG TIFF and a false COG claim;
- distinct Zarr versions/layouts requiring compatibility review;
- a catalogue/inventory count difference requiring reconciliation.

## Release decision

Chapter 8 is ready for automated validation and local review when lint, typecheck, content tests, production export and browser smoke tests pass. It must not be represented as a completed real-world six-year Baltic monitoring analysis; it is the professional data foundation for that later work.
