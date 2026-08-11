---
title: COG, Zarr and Cloud-Native Formats
lessonId: lesson-2-41
---

## 1. Choose a layout that serves the question

### Learning outcome

By the end of this lesson, you will be able to explain how internal tiling, reduced-resolution images and HTTP byte ranges support Cloud Optimized GeoTIFF access; explain how Zarr stores chunked multidimensional arrays with metadata and codecs; distinguish a format claim from validated cloud behaviour; compare COG and Zarr for specific EO access patterns; and write a release decision that includes compatibility, request and provenance evidence.

- **Lesson type:** Cloud-format decision studio
- **Estimated time:** 170–220 minutes
- **Prerequisites:** GeoTIFF structure, raster windows, Xarray cubes, Dask chunks and object-storage roles
- **Portfolio output:** `cloud_format_audit.ipynb`

### Why this matters

Putting a raster at an HTTPS address does not make it cloud-optimised. A client may still need the complete file to inspect one small area. Renaming a GeoTIFF to include `cog` does not reorganise its bytes. Likewise, a Zarr store can be technically valid yet perform poorly because one query requires thousands of tiny object requests or because its version and codecs are unsupported by the intended readers.

Cloud-native formats align stored pieces with selective access. For a large two-dimensional map, a COG can expose spatial tiles and reduced-resolution views within one GeoTIFF. For a multidimensional cube, Zarr can expose encoded chunks across time, band and space. Neither is universally superior. Their usefulness depends on query shape, storage service, client behaviour, data mutability and the evidence required for publication.

Format design is scientific infrastructure. If access costs prevent analysts from checking source pixels, or if an output cannot be interpreted by the receiving tool, reproducibility fails even when the calculations were correct.

### Scientific context

The coastal-meadow programme needs two outputs. Managers want a browseable seasonal NIR map. Researchers want repeated labelled observations for temporal analysis. The supplied `cloud_format_inventory.csv` includes an ordinary striped GeoTIFF, a validated COG candidate, a file merely claimed to be a COG, and two candidate Zarr layouts.

You will not benchmark a commercial cloud account. You will audit declared layout evidence, design bounded verification requests and recommend a format for each output. All URLs and format records in the pack are synthetic. A live remote test is optional extension evidence, never a requirement for completing the assessed decision.

## 2. One concept — cloud-friendly means selective retrieval by design

### Concept

The single idea is: **a cloud-native layout places independently retrievable pieces where common clients can request only the evidence they need**.

Cloud access adds latency and request cost. Reading a small spatial window should not require transferring every full-resolution pixel. Reading NIR for June should not require decoding all years and bands. A useful format combines:

- internal pieces suited to typical access;
- metadata that lets a client locate those pieces;
- a server or object store capable of returning them selectively;
- a client that understands the format and request mechanism;
- validation that the complete chain behaves as intended.

```text
scientific request
      │
      ▼
client understands metadata and layout
      │
      ▼
requests selected byte range(s) or chunk object(s)
      │
      ▼
storage service returns only required pieces
      │
      ▼
client decodes, masks and validates the bounded result
```

If one link fails, the extension can remain correct while access is not cloud-friendly. An HTTP server without range support can force a full COG transfer. A browser blocked by CORS may fail even when the object store supports byte ranges. A Zarr reader missing a required codec cannot decode the selected chunks.

[[CHECK:m2-l41-selective]]

## 3. Cloud Optimized GeoTIFF

A COG remains a TIFF/GeoTIFF. Its cloud behaviour comes from a constrained internal organisation. The OGC COG standard uses tiled image storage, georeferencing and reduced-resolution subfiles—often called overviews—so clients can locate useful parts. With HTTP byte-range support, a client can retrieve selected ranges rather than downloading the entire object.

**Tiles** place neighbouring cells in bounded blocks. A spatial window can therefore be served from intersecting tiles. **Overviews** store lower-resolution representations. A map zoomed far out can request the appropriate overview instead of full-resolution pixels. TIFF image-file-directory placement and offset ordering help clients locate metadata and image blocks efficiently.

The server side matters. A byte-range-capable service responds to a range request with partial content and appropriate headers. HTTPS browser access can also require suitable Cross-Origin Resource Sharing configuration. Do not infer range behaviour solely from `Accept-Ranges`; verify an actual bounded request when possible. Conversely, do not use one failed client as proof that the file layout is wrong—the server, authentication, redirects or CORS may be responsible.

A normal striped GeoTIFF can be valid and useful locally without being a COG. A tiled GeoTIFF without suitable organisation or overview structure may still fail a COG conformance check. Validate with a recognised COG validator or current GDAL tooling, inspect block shapes and overview levels, and reopen a derivative after creation.

COGs are strong for stable two-dimensional raster products, individual scenes and map-oriented access. They can store multiple bands, but a long evolving time cube split among many COGs needs catalogue and orchestration evidence; the format does not supply a labelled time dimension across files by itself.

## 4. Zarr

Zarr represents n-dimensional arrays as metadata plus separately addressable encoded chunks in a key-value or filesystem-like store. Array metadata declares shape, data type, chunk grid, fill value, dimension-related information and codec pipeline under its specification version. Chunk objects contain encoded values for regions of the logical array.

For `time × band × y × x`, the chunk grid can expose pieces that suit temporal and spatial operations. Xarray can present the store as labelled arrays; Dask can execute chunked calculations. These layers remain distinct: Zarr defines storage, Xarray supplies labelled data structures, and Dask can supply lazy execution.

Zarr version and codec compatibility must be recorded. A writer and reader may support different parts of Zarr v2 or v3. Extensions and evolving ecosystem conventions require an interoperability test with the actual receiving clients. “Zarr” is not one timeless binary profile.

Metadata request patterns matter. A dataset with many arrays and fragmented metadata can require many requests before values are read. Consolidated metadata is a common optimisation in Zarr v2 ecosystems, but support and behaviour must be verified for the selected version and library. Zarr v3 has its own metadata model. Do not present “consolidated metadata” as a universal checkbox detached from version.

Object count matters too. Very small chunks can create numerous objects and requests; very large chunks can create read amplification and memory pressure. Compression and codecs influence transfer and decode cost. Choose chunks from the Chapter 8 workload, then validate reader compatibility, request count and result equivalence.

Zarr can support multidimensional analysis and cloud object stores well. It is not automatically the best interchange format for a single static map, and updating a published store safely requires governance. Prefer immutable versioned prefixes or a controlled write/promotion process so readers never observe a partially written scientific release.

[[CHECK:m2-l41-formats]]

## 5. Worked example — make the format decision explicit

### Predict before running

The team needs a browseable seasonal map and a repeated time cube. Predict which format is the stronger initial candidate for each. Which evidence could reverse your decision?

```python
requirements = {
    "seasonal_map": {"dims": "y,x", "access": "window and zoom"},
    "analysis_cube": {"dims": "time,band,y,x", "access": "time and area"},
}

format_plan = {
    "seasonal_map": "validated COG",
    "analysis_cube": "versioned Zarr store",
}

for product, choice in format_plan.items():
    print(product, requirements[product], "→", choice)
```

### Code walkthrough

1. `requirements` describes products by dimensionality and intended access, not by file-size fashion.
2. The seasonal map is a spatial surface commonly read by window and zoom level.
3. The analysis cube needs named time, band and spatial dimensions.
4. `format_plan` states candidates rather than automatic final approvals.
5. “Validated COG” requires both conformant file organisation and a suitable serving path.
6. “Versioned Zarr store” requires declared specification, codecs, chunks, reader compatibility and controlled publication.
7. The loop exposes requirement and choice together for review.

Your audit must go beyond this decision table. For COG, collect block size, overview levels, CRS, transform, dtype, nodata, compression and conformance result. Test a bounded HTTP range only against an authorised endpoint. For Zarr, collect specification version, array shape, dtype, chunk grid, codecs, fill value, metadata pattern, coordinate evidence and reader versions. Benchmark one representative bounded query for each format and preserve request and timing context.

## 6. Compare by workload, not slogans

| Decision question | COG evidence | Zarr evidence |
| --- | --- | --- |
| primary scientific shape | one georeferenced raster or band stack | n-dimensional labelled arrays |
| selective access unit | byte ranges containing tiles/overviews | independently addressed encoded chunks |
| overview browsing | explicit reduced-resolution images | requires pyramid/multiscale convention or computation |
| time-axis organisation | external catalogue or file collection | native logical array dimension |
| common risk | valid TIFF falsely claimed as COG; poor server range behaviour | tiny-object/request explosion; version/codec mismatch |
| publication control | immutable object and checksum | immutable/versioned store and completeness marker |

The table is not a scorecard. COG and Zarr can coexist: catalogue source COG assets; assemble an analysis-ready Zarr cube; publish a seasonal COG derivative. Every conversion creates a new product requiring provenance and numerical/spatial validation.

## 7. Common mistakes and recovery

### Mistake 1 — trusting the extension or MIME type

The object ends in `.tif` or `.zarr`, so the label feels authoritative.

**Recognise it:** no layout, metadata, conformance or reader evidence accompanies the claim.

**Recover:** inspect internal organisation with current tooling and record specification/profile, not only the name.

### Mistake 2 — assuming every tiled TIFF is a COG

Tiling is one required idea, not the complete access contract.

**Recognise it:** overview, directory order, georeferencing or serving evidence is absent.

**Recover:** run a COG conformance check; inspect overview and block structure; test bounded range behaviour through the intended delivery route.

### Mistake 3 — assuming COG removes the need for a catalogue

A map can open from one URL, creating an illusion of discoverability.

**Recognise it:** acquisition time, collection, licence, band roles and relationships across files exist only in filenames.

**Recover:** maintain STAC or another governed inventory; preserve asset-level metadata and provenance.

### Mistake 4 — making Zarr chunks very small

Tiny chunks reduce each transfer and appear responsive in a local test.

**Recognise it:** one scientific query opens thousands of objects or spends most time on request latency.

**Recover:** measure actual access patterns, increase useful work per request and consider metadata consolidation appropriate to the version.

### Mistake 5 — ignoring Zarr version and codecs

The writer succeeds, so interoperability is assumed.

**Recognise it:** the intended browser, GIS or analysis environment cannot open the store.

**Recover:** declare version and codec pipeline, test each required reader, and provide a supported fallback delivery when needed.

### Mistake 6 — modifying a published store in place

Object storage looks like a shared folder, and updating individual chunks seems efficient.

**Recognise it:** readers can see mixed old/new chunks or metadata during publication.

**Recover:** write to a new versioned prefix, validate completeness and checksums, then promote a stable catalogue reference.

### Mistake 7 — measuring only transfer volume

Cloud-friendly is reduced to downloaded bytes.

**Recognise it:** request count, latency, decoding, memory, cache and result integrity are absent.

**Recover:** benchmark end-to-end bounded queries and record every relevant condition.

[[CHECK:m2-l41-validation]]

## 8. Guided practice — audit five format claims

1. Verify `cloud_format_inventory.csv` against the manifest and preserve it as an immutable input.
2. For each row, separate **claimed format** from **verified evidence**. Empty evidence remains unknown, not false.
3. Evaluate `seasonal_ndvi_a`: identify why striped local GeoTIFF may be valid but not suitable as the claimed remotely windowed product.
4. Evaluate `seasonal_ndvi_b`: list the additional file and server tests required before acceptance, despite promising tile and overview evidence.
5. Evaluate `seasonal_ndvi_c`: explain why range-capable hosting cannot repair non-conformant internal organisation.
6. Evaluate `meadow_cube_a` and `meadow_cube_b`: calculate chunks per full array from the declared Chapter 8 shape, then compare expected request shapes for one date, one spatial tile and a seasonal interval.
7. Create `cloud_format_verification_plan.csv` with asset, claim, file-layout check, server check, client check, result check, status and next action.
8. If GDAL is installed, create a tiny local tiled GeoTIFF derivative and inspect it with `gdalinfo`. Do not claim COG conformance unless a suitable validator confirms it.
9. If Zarr is installed, write a tiny labelled dataset to a new local training store. Record Zarr version, chunks and codecs, reopen it, and assert coordinate and value equivalence.
10. Design two bounded remote tests on paper: a 256-by-256 map window and a two-month cube subset. State expected objects/ranges and abort limits.
11. Complete the format-evidence section of `CLOUD_NATIVE_EO_QA_TEMPLATE.md`.
12. Save the work as `cloud_format_audit.ipynb`.

## 9. Independent challenge — recommend a publication architecture

The group must publish:

- an immutable source-scene collection;
- an analysis-ready time cube;
- a seasonal map for rapid browsing;
- a provenance and discovery record.

Write a 600–900 word architecture decision. You may recommend COG, Zarr, both or a justified alternative, but you must specify format profile/version, storage and serving assumptions, common access queries, chunk/tile logic, reader compatibility, immutable promotion, checksums and catalogue linkage. Include one rejected design and the evidence that makes it inferior for this project.

Add an exit strategy: how would the team recover interpretable data if the object-storage vendor, selected codec or current client library became unavailable? Cloud-native should reduce transfer friction, not create unrecorded dependency.

## 10. Scientific interpretation

### Scientific interpretation

The format does not change reflectance, but it changes which evidence can be retrieved and verified efficiently. A COG overview is a reduced-resolution representation for access and display; it must not silently replace the full-resolution analytical product. A Zarr chunk is an execution/storage unit; its boundaries are not ecological zones. Those distinctions prevent operational structures from being mistaken for scientific support.

A defensible decision states that the selected layout serves declared queries under tested clients and delivery conditions. It also states limitations: cold-cache latency, unavailable assets, unsupported codecs, differing readers and costs can change performance. Cloud optimisation is an empirically validated property of the delivery chain, not a permanent adjective attached to a filename.

## 11. Reflection, submission and portfolio artifact

### Reflection

1. Why can a conformant COG still perform poorly through one delivery service?
2. Which access pattern would make Zarr's multidimensional chunks more useful than separate COGs?
3. What does a COG overview represent scientifically, and when must it not be analysed?
4. Why should a released Zarr store use controlled version promotion?

### Submission

Submit:

- `cloud_format_audit.ipynb` with reproducible inspections and bounded tests;
- `cloud_format_verification_plan.csv` containing evidence gaps and decisions for all five assets;
- `cloud_publication_architecture.md` with the COG/Zarr recommendation and exit strategy;
- one small screenshot or diagram of tile/chunk access with a clear caption;
- a completed cloud-format section of the QA record;
- a 250–400 word scientific interpretation distinguishing access units from ecological support.

Do not upload large derived stores, unlicensed imagery, private endpoints, credentials or signed URLs.

### Portfolio artifact

Add `cloud_format_audit.ipynb` to **Artifact 2.H — Cloud-Native EO Discovery and Cube Package**. It links the Chapter 8 computation plan to a validated storage and delivery design. The final lesson will add a catalogue record so the evidence can be discovered and reproduced.
