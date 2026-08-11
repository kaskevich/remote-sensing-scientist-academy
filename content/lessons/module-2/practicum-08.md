---
title: Build a Reproducible Cloud-Native EO Evidence Cube
lessonId: module-2-chapter-8-practicum
---

## Chapter 8 practicum — Build a Reproducible Cloud-Native EO Evidence Cube

### Learning outcome

By the end of this practicum, you will be able to turn a deterministic STAC discovery snapshot into a governed Item–asset inventory, define and validate a labelled EO cube contract, preserve rejected observations, design safe chunked execution, match COG and Zarr outputs to access patterns, reconcile every processing gate, and issue a scientifically cautious release decision for a cloud-native coastal-meadow evidence package.

- **Estimated time:** 420–540 minutes
- **Prerequisites:** Lessons 2.38–2.42
- **Portfolio output:** **Artifact 2.H — Cloud-Native EO Discovery and Cube Package**
- **Training status:** every supplied acquisition, coordinate, asset URL and value is synthetic and released for instruction under CC0-1.0

### Why this practicum matters

A cloud-native workflow can fail while every individual tool appears to work. A catalogue query returns Items, but a required quality asset is absent. Xarray stacks arrays, but one grid is shifted half a pixel. Dask delays execution, but the chunk layout creates thousands of requests. A GeoTIFF is served over HTTPS, but it is not internally organised as a COG. A Zarr store opens for its author, but the receiving environment cannot decode its version or codec.

Professional work connects these stages as one evidence system. Discovery determines the candidate population. Measurement and grid contracts determine eligibility. Masking determines valid support. Chunks and access formats determine whether the approved calculation can execute reproducibly. The release package must let another analyst inspect each decision without access to your memory or cloud account.

This practicum evaluates all three Academy graduate profiles. A **Geospatial Data Analyst** must build a correct labelled evidence table and interpret variable observation support. A **GIS/Remote Sensing Engineer** must design interoperable storage, bounded execution and traceable publication. A **Remote Sensing Researcher** must connect every operational choice to measurement comparability and scientific limits.

### Scientific brief

The Baltic coastal-meadow group wants a May–September optical evidence package for later plot-based analysis. It asks:

> Which synthetic observations can form a comparable analysis cube, how should that cube be computed and published, and what scientific claims remain unsupported?

Your decision may be **release**, **conditional release** or **do not release**. A complete-looking map is not sufficient. The package must preserve catalogue, grid, scaling, mask, count, compute and format evidence.

## 1. Required training assets and workspace

Begin with `cloud-native-eo/README.md`. Preserve every supplied file unchanged under `inputs/` and verify it against `manifest.json`:

- `meadow_cube_structure.json`;
- `observation_inventory.csv`;
- `cube_pixel_samples.csv`;
- `chunk_scenarios.csv`;
- `cloud_format_inventory.csv`;
- `stac_items_fixture.json`;
- `CLOUD_NATIVE_EO_QA_TEMPLATE.md`.

Create:

```text
cloud_native_eo_package/
├── README.md
├── environment.txt
├── inputs/
├── contracts/
├── notebooks/
├── outputs/
│   ├── tables/
│   ├── rasters/
│   └── figures/
├── CLOUD_NATIVE_EO_QA.md
└── CLOUD_NATIVE_EO_RELEASE_DECISION.md
```

Record resolved library versions and the operating environment actually used. The assessed path is fully local and deterministic. If you add live STAC or remote object evidence, store it separately as volatile extension evidence and never include credentials or signed URLs.

## 2. Gate A — state the scientific and computational contract

Write `contracts/scientific_question.md` with:

- target phenomenon and measurement proxy;
- study extent and statement that coordinates are invented;
- May–September observation window;
- intended use of the seasonal summary;
- spatial and temporal support;
- excluded claims, including real meadow condition and change;
- responsible user and release decision.

Write `contracts/cube_contract.md` with:

- logical dimensions `time × band × y × x`;
- coordinate labels, order and monotonicity;
- EPSG:3301 training CRS, affine transform, resolution and bounds;
- red, red-edge and NIR digital-number scaling;
- SCL and local-validity policy;
- timestamp and duplicate policy;
- exact-grid rule;
- minimum valid-observation rule;
- provenance link from every time slice to Item and assets;
- metadata required on each derivative.

Explain why a cube is a comparability contract rather than any four-dimensional array. State which fields are machine-testable and which depend on product documentation or scientific judgment.

[[CHECK:m2-p8-contract]]

## 3. Gate B — reproduce catalogue discovery

Create `contracts/stac_query_contract.json`. It must include fixture identity and checksum, collection, bbox, interval, discovery cloud threshold, required measurement and quality roles, retrieval time and a maximum result bound.

Parse `stac_items_fixture.json` and produce:

- `outputs/tables/stac_items.csv` — one row per Item;
- `outputs/tables/stac_assets.csv` — one row per Item–asset pair;
- `outputs/tables/stac_validation.csv` — geometry, datetime, Collection, role, media-type and href checks.

Then reconcile the catalogue to `observation_inventory.csv`. Explain why five fixture Items and six planned observations are not a silent error: the fixture is a bounded discovery snapshot, so the inventory-only September record remains unavailable to this query result unless additional evidence is acquired.

Identify assets missing local quality evidence. Keep them in review. Treat an asset media type containing a cloud-optimised profile as a claim requiring validation, not proof. Preserve Item IDs even when an observation is rejected.

## 4. Gate C — decide which observations may enter the cube

Create `outputs/tables/cube_eligibility.csv` with one row per planned Item and:

- catalogue presence;
- datetime and processing baseline;
- required reflectance assets;
- required local mask;
- scale and offset;
- grid status;
- scene cloud and local clear fraction;
- eligibility decision;
- decision evidence and next action.

Apply the declared rules:

- a shifted half-pixel grid cannot enter direct cell-wise stacking;
- a missing local mask cannot be replaced by scene cloud percentage;
- unverified scaling cannot be guessed;
- an absent catalogue Item cannot be silently acquired from a filename;
- reviewed and excluded observations remain in the report.

Reconcile candidate, accepted, review and excluded counts. Do not optimise for the highest accepted count. The objective is an honest analysis population.

## 5. Gate D — build the labelled diagnostic cube

Use `cube_pixel_samples.csv` as a compact diagnostic. It represents four labelled cells through time, not the complete declared raster grid.

Create `notebooks/cloud_native_eo_practicum.ipynb` and:

1. assert uniqueness of `(item_id, pixel_id)`;
2. link every sample to the observation inventory;
3. retain immutable digital-number columns;
4. convert red, red-edge and NIR with the declared scale factor once;
5. validate scaled ranges and missingness;
6. build an Xarray structure with named `time`, `band` and `pixel_id` dimensions;
7. attach `x_m` and `y_m` coordinates to `pixel_id`;
8. align the local mask exactly by time and pixel;
9. calculate a May–August NIR median and valid-observation count;
10. apply a predeclared minimum count of three;
11. retain source Item IDs contributing to every pixel summary;
12. compare the Xarray result with a transparent pandas or NumPy calculation.

The fixture does not support writing a genuine georeferenced raster because it contains only four long-form sample pixels from a larger declared grid. Publish the diagnostic as `seasonal_nir_pixel_summary.csv`. Separately create a **design specification**, not a false raster, for `seasonal_median_nir.tif` and `valid_observation_count.tif` from the future full cube.

[[CHECK:m2-p8-reconcile]]

## 6. Gate E — validate labelled spatial structure

Create a small in-memory `y × x` DataArray from the declared grid and demonstrate:

- `.isel()` positional selection;
- `.sel()` coordinate selection;
- descending `y` slice behaviour;
- CRS writing from verified training metadata;
- transform and bounds inspection;
- exact-alignment failure for a half-pixel-shifted grid.

Produce `outputs/tables/labelled_array_audit.csv` with accepted grid, shifted grid and reversed-label case. Record dimensions, sizes, monotonicity, coordinate equality, CRS, transform, exact-alignment status and decision.

Do not repair a reversed-label array by sorting labels alone: values must move consistently with their coordinates. Do not relabel a shifted grid as if it were aligned. If you propose reprojection, specify interpolation, target grid, source preservation and output validation without inventing source values not provided by the pack.

## 7. Gate F — design and test bounded computation

Recalculate every row in `chunk_scenarios.csv`. Produce `outputs/tables/chunk_memory_plan.csv` with:

- logical array bytes;
- uncompressed bytes per chunk;
- chunks per dimension and total chunk count;
- assumed concurrent chunks;
- intermediate multiplier;
- approximate working set;
- storage-alignment evidence;
- intended operation;
- accept, benchmark or reject decision.

Choose separate candidates for:

1. regional seasonal summary;
2. per-pixel temporal series.

Implement a small Dask-backed synthetic test if the environment supports it. Apply selection, mask and reduction lazily; inspect the graph or task count; compute only a bounded subset; compare it with an eager result. If Dask is unavailable, complete the design and clearly label it unexecuted rather than fabricating timings.

Write `contracts/compute_budget.md` with workstation memory, headroom, output limit, maximum diagnostic area, selection-before-compute rule, abort criteria and result-equivalence tolerance. Peak memory cannot be inferred solely from final `nbytes`; say so.

## 8. Gate G — select and verify cloud formats

Audit every row in `cloud_format_inventory.csv`. Create `outputs/tables/cloud_format_audit.csv` separating claim, file-layout evidence, serving evidence, client evidence and result evidence.

For each COG candidate, require a plan for:

- GeoTIFF georeferencing;
- tile/block organisation;
- overview structure;
- COG conformance validation;
- authorised HTTP byte-range response;
- HTTPS/CORS behaviour for intended browser clients;
- bounded-window value and metadata equivalence.

For each Zarr candidate, require:

- declared Zarr version;
- logical shape, dtype and fill value;
- chunk grid and codecs;
- coordinate and dimension metadata;
- reader compatibility;
- metadata-request strategy appropriate to the version;
- request-count and bounded-query evidence;
- immutable publication procedure.

Recommend a COG for the stable seasonal map only if its output design includes matching CRS, transform, nodata, scale/units, reducer, period, source lineage and companion count product. Recommend Zarr for the cube only if the declared access patterns, chunks and intended clients pass review. A hybrid recommendation is acceptable and expected when justified.

[[CHECK:m2-p8-release]]

## 9. Gate H — connect every stage with reconciliation

Create `outputs/tables/pipeline_reconciliation.csv`. At minimum, include:

| Stage | Input population | Accepted | Review | Excluded | Output | Evidence |
| --- | --- | ---: | ---: | ---: | --- | --- |
| catalogue snapshot | Items |  |  |  | item inventory | query contract |
| asset review | Item–asset pairs |  |  |  | asset inventory | role/media checks |
| cube eligibility | planned observations |  |  |  | eligible dates | grid/mask/scale rules |
| masking | pixel observations |  |  |  | valid samples | local mask |
| aggregation | valid samples |  |  |  | seasonal pixels | count threshold |
| publication | candidate products |  |  |  | released products | format/access checks |

Every difference between input and output populations needs a reason. Counts alone are insufficient: retain stable IDs so one Item cannot disappear while another duplicates and totals remain equal.

Create an end-to-end lineage diagram showing query, Item, Asset, eligibility, cube slice, masked value, aggregate and release product. Name the file or table that stores each edge.

## 10. Gate I — publish a reviewable package, not a cloud dependency

Complete `CLOUD_NATIVE_EO_QA.md` from the template. Write `README.md` containing:

- scientific question and data-status warning;
- deterministic reproduction instructions;
- environment creation and notebook order;
- input checksums;
- output inventory;
- accepted/reviewed/excluded observations;
- access-format decisions;
- limitations and responsible next action.

Define a release process:

1. write derivatives to a new versioned local or object prefix;
2. calculate checksums and reopen every output;
3. compare coordinates, masks, counts and values with the validated diagnostic;
4. confirm intended readers can open the declared COG/Zarr profile;
5. mark the version complete only after QA passes;
6. update a stable catalogue reference atomically or through controlled promotion;
7. retain the previous release for rollback under the lifecycle policy.

Do not overwrite a published Zarr store chunk by chunk where readers could see a mixed state. Do not call an ordinary TIFF a COG. Do not embed access tokens in STAC assets or notebooks.

## 11. Final release decision

Write `CLOUD_NATIVE_EO_RELEASE_DECISION.md` in 700–1,000 words:

1. **Decision** — release, conditional release or do not release.
2. **Intended use** — the exact analysis or demonstration supported.
3. **Accepted evidence** — Items, assets, dates, grid, measurements and masks.
4. **Excluded and reviewed evidence** — stable IDs and reasons.
5. **Computation** — chunks, budget, bounded test and equivalence result.
6. **Publication** — COG/Zarr choices, versions/profiles, serving assumptions and catalogue linkage.
7. **Scientific interpretation** — what the seasonal summary and count support.
8. **Limitations** — synthetic status, temporal sampling, local validity, format compatibility and untested operations.
9. **Next actions** — responsible owner, required evidence and trigger for reassessment.

Do not promise real-world monitoring performance. This package demonstrates a professional method on synthetic evidence.

## 12. Professional mistakes — Multidimensional and Cloud-Native Data

Use this table as a final self-review. Add the detected status and evidence location for every row.

| # | Professional mistake | Why it fails | Required recovery |
| ---: | --- | --- | --- |
| 1 | Calling any four-dimensional array a data cube | Dimensions do not prove comparable measurements | Define and test the cube contract |
| 2 | Relying on axis position alone | Band, time and spatial meaning become implicit | Use named dimensions and labelled selection |
| 3 | Calling `.values` on an unknown source | Labels disappear and eager loading may begin | Bound the result and keep Xarray operations lazy |
| 4 | Assuming equal shapes mean equal grids | Origin, CRS or coordinates may differ | Require exact coordinate and transform checks |
| 5 | Sorting coordinates without moving values correctly | Labels no longer describe cells | Reindex values and validate spatial orientation |
| 6 | Assigning a convenient CRS | Metadata can place evidence falsely | Verify source CRS before writing it |
| 7 | Applying scale twice | Reflectance becomes numerically wrong | Preserve raw values and record one conversion |
| 8 | Treating nodata as zero | Absence becomes a measurement | Preserve mask and missing-value semantics |
| 9 | Using scene cloud as a local mask | Study pixels may remain contaminated | Require pixel-level quality evidence |
| 10 | Aggregating before masking | Invalid values bias a plausible result | Mask every observation before reduction |
| 11 | Publishing a composite without counts | Temporal support remains invisible | Publish valid-observation count with the reducer |
| 12 | Erasing excluded Items | Analysis population cannot be audited | Retain stable IDs, reasons and next actions |
| 13 | Reading only the first STAC page | Candidate observations may be omitted | Iterate pagination within a bounded query |
| 14 | Reversing bbox axis order | Search targets the wrong geography | Validate west–south–east–north order |
| 15 | Treating intersection as full coverage | A footprint may barely touch the area | Calculate the required overlap relation |
| 16 | Assuming asset keys are universal | Wrong product or rendered imagery may be used | Inspect roles, media type and Collection docs |
| 17 | Saving signed URLs | Reproduction fails and credentials can leak | Save Item ID and asset key; resolve at runtime |
| 18 | Calling `.compute()` on the full cube | Work may exceed memory and I/O budgets | Select space, time and measurement first |
| 19 | Using many tiny chunks | Scheduler and request overhead dominate | Benchmark larger aligned chunks |
| 20 | Using one giant chunk | One task can exceed memory | Partition the working set with headroom |
| 21 | Estimating RAM from compressed size | Decoded values and intermediates are larger | Calculate from shape, dtype and concurrency |
| 22 | Rechunking without accounting for transfer | Data reorganisation can dominate the workflow | Measure and justify persistent derivatives |
| 23 | Claiming a tiled TIFF is a COG | Conformance requires more than tiling | Validate full COG organisation |
| 24 | Ignoring HTTP range and CORS behaviour | A valid COG may still require full transfer or fail in browsers | Test the intended serving path |
| 25 | Treating overviews as full-resolution evidence | Reduced values change support | Use overviews for appropriate browsing only |
| 26 | Ignoring Zarr version and codecs | Intended readers may not decode the store | Declare and test actual compatibility |
| 27 | Creating extremely fragmented Zarr metadata/chunks | One query causes excessive object requests | Measure request patterns and consolidate appropriately |
| 28 | Updating a released store in place | Readers can observe inconsistent versions | Publish immutably and promote after QA |
| 29 | Benchmarking without result equivalence | Speed can hide a changed calculation | Compare coordinates, masks, values and counts |
| 30 | Presenting synthetic results as Baltic observations | Training evidence is mistaken for science | Keep the synthetic status prominent |

## 13. Assessment rubric

### Technical correctness

The package parses and reconciles catalogue records correctly; preserves grid, coordinate, scale, missingness and mask semantics; produces a correct labelled diagnostic summary and count; calculates chunk memory accurately; and distinguishes verified COG/Zarr evidence from claims.

### Conceptual understanding

The learner explains data cubes as comparability contracts, labels as scientific evidence, lazy execution as a bounded plan, cloud formats as selective-access layouts and STAC as discovery rather than scientific validation.

### Reproducibility

The package contains immutable inputs, checksums, environment details, query contract, stable Item–asset lineage, explicit eligibility rules, reconciled populations, tested output equivalence and controlled release/version procedures.

### Scientific communication

The release decision is concise enough to act on, distinguishes operational success from ecological inference, communicates variable observation support and synthetic status, and assigns limitations and next actions responsibly.

## 14. Submission

Submit one compressed project folder or repository link containing:

- `cloud_native_eo_practicum.ipynb`;
- `stac_query_contract.json`;
- `stac_items.csv` and `stac_assets.csv`;
- `cube_eligibility.csv`;
- `cube_contract.md` and `labelled_array_audit.csv`;
- `seasonal_nir_pixel_summary.csv` and valid-observation counts;
- `chunk_memory_plan.csv` and `compute_budget.md`;
- `cloud_format_audit.csv` and publication architecture;
- `pipeline_reconciliation.csv` and lineage diagram;
- `CLOUD_NATIVE_EO_QA.md`;
- `CLOUD_NATIVE_EO_RELEASE_DECISION.md`;
- `README.md`, `environment.txt` and input manifest evidence.

Restart the kernel and run every assessed notebook cell in order. Open all outputs from a clean relative path. Confirm that checksums match, no fixture URL was fetched, no secret is present and no synthetic coordinate or value is described as a published observation.

## 15. Portfolio artifact

Publish the reviewed package as **Artifact 2.H — Cloud-Native EO Discovery and Cube Package** inside the **UAV and Satellite Analysis Pipeline** portfolio. The strongest artifact is not the largest cube. It is a compact, auditable chain showing that you can discover, qualify, organise, compute and release Earth Observation evidence without losing scientific meaning.
