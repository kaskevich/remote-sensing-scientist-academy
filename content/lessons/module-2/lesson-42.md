---
title: STAC
lessonId: lesson-2-42
---

## 1. Turn discovery into reproducible evidence

### Learning outcome

By the end of this lesson, you will be able to distinguish a STAC Catalog, Collection, Item and Asset; explain the difference between a static catalogue and a STAC API; construct a bounded search by collection, space and time; treat cloud cover as discovery metadata rather than local validity; inspect asset roles, media types, licences and projection metadata; handle pagination and service differences; and save a reproducible discovery inventory without exposing temporary credentials.

- **Lesson type:** Reproducible EO discovery lab
- **Estimated time:** 170–220 minutes
- **Prerequisites:** EO product metadata, spatial extents, COG/Zarr access and JSON
- **Portfolio output:** `stac_search_inventory.ipynb`

### Why this matters

Earth Observation archives contain far more scenes than a researcher can inspect manually. Search must narrow by geography, time, collection and properties, then identify the correct data and quality assets. If the query lives only in an interactive web page, another scientist may not be able to reproduce which items were considered. If the notebook stores temporary signed URLs, access will fail later and credentials may leak.

STAC—the SpatioTemporal Asset Catalog specification—provides common JSON structures for describing spatiotemporal data and linking to its assets. A STAC API adds a consistent search interface. The standard improves interoperability; it does not guarantee that every provider exposes the same extensions, collection identifiers, query operators, licences or stable asset locations. A professional discovery record preserves both the standard structure and the provider-specific evidence.

Discovery is the first selection stage, not the final scientific acceptance stage. A scene intersecting a bounding box can barely overlap the area of interest. A low scene cloud percentage can still hide the meadow. An asset named `visual` may be unsuitable for quantitative reflectance. Every returned Item remains a candidate until geometry, processing level, asset role, local quality and grid compatibility pass review.

### Scientific context

The coastal-meadow group needs a transparent inventory of optical observations from May through September. The assessed exercise uses `stac_items_fixture.json`, a deterministic synthetic ItemCollection whose URLs use the reserved invalid domain and must not be fetched. The search extent `[23.30, 58.10, 24.80, 59.20]` is a broad invented training extent, not a publication of real plot coordinates.

An optional extension may query an authorised public STAC API. Because live services change, fail or paginate differently, its result cannot replace the fixture in assessed work. You will build a query contract, inspect returned Items and Assets, connect discovery decisions to the Chapter 8 observation inventory, and state what additional evidence is needed before cube assembly.

## 2. One concept — discovery metadata proposes evidence; it does not validate it

### Concept

The single idea is: **a reproducible catalogue query identifies candidate assets, while scientific fitness requires additional local and product-specific validation**.

The core STAC hierarchy is:

```text
Catalog
├── links to children and items
└── Collection
    ├── shared spatial/temporal extents, licence and summaries
    └── Item (GeoJSON Feature for one spatiotemporal entity)
        ├── geometry / bbox / datetime / properties
        ├── links
        └── Assets
            ├── measurement data
            ├── quality mask
            ├── thumbnail
            └── metadata or other roles
```

A **Catalog** organises links. A **Collection** extends catalogue information for related Items and carries shared metadata such as extent, licence, providers and summaries. An **Item** is the atomic GeoJSON Feature describing one spatiotemporal entity. An **Asset** is a linked resource associated with an Item, described by fields such as `href`, media type, title and roles.

An Item can have many assets: red, NIR, scene classification, metadata and thumbnail. Asset keys are provider conventions, not universal band names. Roles help describe intended use but must be inspected with collection documentation. A browse image is not quantitative reflectance simply because it looks like the scene.

A static STAC catalogue consists of linked JSON resources that can be crawled. A STAC API is a service interface whose landing page declares conformance and whose Item Search capability returns ItemCollections for queries. Search implementation and extensions vary. Inspect the API's conformance declarations instead of assuming support for every filter.

[[CHECK:m2-l42-model]]

## 3. Define a search contract before sending it

A reproducible query record should include:

- API endpoint and advertised conformance classes;
- collection IDs and why they represent the required product;
- spatial input and CRS—STAC search geometry and bounding boxes use longitude/latitude under the API specification;
- time interval with clear inclusive/exclusive interpretation;
- property filters and extension requirements;
- page limit, pagination process and final Item count;
- request time, client version and response snapshot or Item IDs;
- licence and provider metadata;
- asset keys, roles and media types required later.

For an API bbox, coordinate order is west, south, east, north. This differs from the EPSG:3301 analysis coordinates used in the synthetic cube. Transform the area of interest with verified CRS evidence, inspect the result and never swap latitude and longitude silently.

`intersects` can preserve a study polygon more precisely than its bounding box, but support depends on the API and the search still uses geometric intersection, not complete coverage. Record which spatial relation was used and calculate actual overlap during item QA if coverage matters.

Time filters define candidate acquisition dates. Check whether the product `datetime`, `start_datetime` or `end_datetime` carries the relevant observation support. Use UTC-aware values. Duplicate timestamps or reprocessed versions require an explicit preference and provenance rule.

Cloud-cover filters are commonly expressed through the EO extension property `eo:cloud_cover`, usually at scene or Item scale. This is useful for limiting candidates, but local cloud, shadow and haze require pixel-level quality evidence. Do not apply an arbitrary very-low threshold that removes most seasonal observations before checking local support; document a discovery threshold and later mask rule separately.

## 4. Inspect Items and Assets

For every candidate Item, record:

- stable Item ID and Collection ID;
- geometry, bbox and datetime;
- platform, instruments and processing metadata when provided;
- scene-level cloud and other quality summaries;
- extensions used, such as EO, projection or raster metadata;
- required asset key, roles, media type and title;
- licence inherited from Collection or declared under provider rules;
- whether an asset URL is stable, authenticated or temporarily signed;
- local-grid and quality checks still required.

STAC metadata can describe projection, raster bands and data-cube dimensions through extensions, but presence varies. Missing projection metadata does not prove an asset lacks a CRS internally; it means the catalogue evidence is incomplete for the intended automated decision. Inspect the source asset header through an authorised bounded read before accepting it.

Asset `href` values may be absolute or relative. Some services return signed URLs whose query parameters expire and may contain sensitive access information. Do not commit them. Preserve the endpoint, Item ID, asset key and retrieval process; resolve a fresh URL at execution time through the approved client. Store checksums for acquired immutable objects when the provider exposes or permits them.

[[CHECK:m2-l42-assets]]

## 5. Pagination and service reality

A search response may be limited to one page. The API communicates next-page navigation through links or client abstractions. Iterating only the first response can silently omit evidence. Conversely, converting an unbounded search to a list may retrieve far more Items than intended.

Bound the scientific request before pagination: one collection, defined area, defined period and documented property filter. Then iterate all returned pages, respect rate limits and record final count. Use timeouts and retry only transient failures. Authentication errors and invalid queries require correction rather than blind retries.

Providers can update catalogues, replace endpoints or reprocess Collections. Reproducibility therefore needs a discovery snapshot: exact request, retrieval timestamp, Item IDs, relevant properties, asset keys and preferably a saved metadata response when licence and size allow. That snapshot does not make remote assets immutable. Record product versions, checksums or provider identifiers that support later verification.

The deterministic fixture represents such a snapshot. Its `example.invalid` links deliberately prevent accidental download. The lesson evaluates metadata reasoning independently of network availability.

## 6. Worked example — express a bounded STAC search

### Predict before running

This example describes an optional live search. Predict which criteria the server applies and which validity question remains unanswered. Will `eo:cloud_cover <= 40` prove that the meadow area is clear?

```python
from pystac_client import Client

api = Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")
search = api.search(
    collections=["sentinel-2-l2a"],
    bbox=[23.30, 58.10, 24.80, 59.20],
    datetime="2025-05-01/2025-09-30",
    query={"eo:cloud_cover": {"lte": 40}},
    max_items=20,
)
items = list(search.items())
inventory = [(item.id, item.datetime, sorted(item.assets))
             for item in items]
print("returned", len(inventory))
```

### Code walkthrough

1. PySTAC Client supplies a service-aware interface; its version belongs in the environment record.
2. `Client.open()` contacts a specific STAC API endpoint. Endpoint availability and authentication can change.
3. `collections` limits product family; the Collection metadata must still be reviewed for processing and licence.
4. The bbox is longitude/latitude in west–south–east–north order and is only the invented broad training extent.
5. The date interval bounds discovery to the stated season.
6. The cloud query is a server-side candidate filter if supported through the advertised conformance/extensions.
7. `max_items=20` is a safety bound for this diagnostic, not a scientific sampling rule.
8. Iterating `search.items()` lets the client follow pagination up to that bound.
9. The inventory retains Item ID, datetime and available asset keys.
10. No asset values are read, no local cloud is assessed and no cube is created.

Run the live version only if network use is authorised. For assessed work, parse `stac_items_fixture.json` locally and produce the same inventory fields. Do not “correct” the fixture's invalid URLs. Their purpose is to separate catalogue inspection from data acquisition.

## 7. Connect discovery to cube eligibility

Join Item IDs from the fixture to `observation_inventory.csv`. Reconcile candidates, inventory rows and cube decisions. This linkage should reveal:

- the shifted-grid Item requires spatial correction or exclusion;
- the missing-quality-asset Item cannot meet the current local-mask contract;
- scene cloud and local clear fraction answer different questions;
- an asset's COG media type is a claim that still requires delivery-chain validation;
- only accepted Item–asset pairs can become cube slices.

Create one row per Item–asset pair rather than one row per Item when provenance must identify specific measurements. Fields should include Item ID, Collection, datetime, Item geometry status, scene cloud, asset key, role, media type, href classification, required local checks and decision. If several assets jointly form one observation, preserve their relationship through the stable Item ID.

## 8. Common mistakes and recovery

### Mistake 1 — searching without a Collection

The endpoint feels like one homogeneous archive.

**Recognise it:** results mix processing levels, sensors or incompatible measurement semantics.

**Recover:** inspect Collections first, select explicit IDs and record product documentation and licence.

### Mistake 2 — reversing bbox axes

People commonly say latitude–longitude, while many GIS tables use x–y.

**Recognise it:** results are empty or located on another continent.

**Recover:** record bbox order as west, south, east, north; inspect it on a map; transform from the source CRS with a verified operation.

### Mistake 3 — treating intersection as full coverage

The search returns an Item, which feels like a positive coverage test.

**Recognise it:** the scene footprint touches only a small corner of the study area.

**Recover:** calculate and record overlap or containment required by the scientific use.

### Mistake 4 — treating scene cloud as pixel validity

It is a convenient numeric property and widely searchable.

**Recognise it:** no local mask is retrieved or applied.

**Recover:** keep scene cloud as discovery evidence and require the product-specific local quality asset for analysis.

### Mistake 5 — assuming asset-key meanings are universal

`B04`, `red` and `visual` appear self-explanatory.

**Recognise it:** quantitative analysis uses a display-rendered asset or the wrong processing level.

**Recover:** inspect Collection and asset metadata, roles, media type, band definitions, scale and offset.

### Mistake 6 — reading only the first page

The first response looks complete and may contain many Items.

**Recognise it:** a `next` link exists or counts differ between client methods.

**Recover:** use the client's pagination iterator within a bounded query and reconcile the final Item count.

### Mistake 7 — committing signed URLs

Copying the working URL seems reproducible.

**Recognise it:** long query strings contain signatures, expiry or tokens.

**Recover:** remove and revoke exposed credentials, store stable Item ID and asset key, and resolve access at runtime.

### Mistake 8 — treating search success as analysis readiness

The API has already filtered several properties.

**Recognise it:** Items enter the cube without grid, scale, mask or range-read checks.

**Recover:** make STAC discovery the first gate and connect each candidate to the Chapter 8 acceptance workflow.

[[CHECK:m2-l42-reproducibility]]

## 9. Guided practice — build a deterministic Item inventory

1. Verify `stac_items_fixture.json` with the Chapter 8 manifest. Confirm that it is a FeatureCollection of synthetic Items.
2. Write `stac_query_contract.json` containing the invented bbox, interval, collection, discovery cloud threshold, expected asset roles, client/version and retrieval mode `local_fixture`.
3. Parse the fixture. Assert unique Item IDs, valid GeoJSON Feature types, non-empty geometries, UTC datetimes and Collection membership.
4. Flatten assets into one row per Item and asset key. Preserve roles as a delimited list and classify every `href` as `synthetic_nonfetchable`.
5. Identify Items missing the required quality asset. Do not infer that a reflectance asset can replace it.
6. Join the Item table with `observation_inventory.csv`. Reconcile five fixture Items against six planned observations and explain the one inventory-only record.
7. Compare `eo:cloud_cover` with `local_clear_fraction`. Write two sentences explaining why the values need not be complements.
8. Produce `stac_item_decisions.csv` with candidate, review and accepted states. Keep all rejected/reviewed Items visible.
9. Add the COG claim as a separate validation status; do not copy the media type into a “verified COG” field.
10. Save the exact fixture checksum, query contract, response count and Item IDs in the QA template.
11. Optional: run the bounded live search from the worked example. Save only stable metadata and clearly separate it from assessed fixture results.
12. Save the notebook as `stac_search_inventory.ipynb`.

## 10. Independent challenge — design a provider-neutral discovery adapter

Design a small function specification—not a production service—that accepts endpoint, Collection, geometry, interval, property filters and required asset roles. Its output must use one provider-neutral inventory schema and preserve provider-specific fields separately.

Test the design against two imagined differences: one provider uses asset key `B08`, another uses `nir`; one supports the query extension, another requires client-side property filtering after a bounded search. State how the adapter checks conformance, prevents unbounded downloads, handles pagination, records rejected Items and avoids signed-URL persistence.

Write three tests in plain language or code: bbox axis reversal should fail validation; duplicate Item IDs should stop promotion; a missing required quality role should produce review rather than acceptance.

## 11. Scientific interpretation

### Scientific interpretation

STAC makes discovery traceable because the query and returned metadata can be recorded in standard structures. It does not make the observations ecologically representative. Search dates may miss rapid phenological events; clouds and revisit patterns create uneven temporal support; Collection processing choices affect quantitative use; and spatial intersection does not guarantee plot coverage.

The defensible Chapter 8 statement is: “These candidate Item–asset pairs were found by this bounded query and reviewed under this eligibility contract.” Only after local mask, grid, scale, licence and access checks may they be called cube inputs. The catalogue supports provenance and reproducibility. It does not replace sensor understanding or local data QA.

## 12. Reflection, submission and portfolio artifact

### Reflection

1. Which metadata belong most naturally at Collection, Item and Asset levels?
2. Why is a static STAC catalogue useful even without a search API?
3. What must be saved to reproduce discovery when remote hrefs can expire?
4. How would you separate a broad discovery threshold from a strict local analysis mask?

### Submission

Submit:

- `stac_search_inventory.ipynb`, run from start to finish against the deterministic fixture;
- `stac_query_contract.json` with endpoint/fixture, collection, space, time, filters and bounds;
- `stac_item_asset_inventory.csv` with one row per Item–asset pair;
- `stac_item_decisions.csv` preserving accepted, review and excluded candidates;
- `catalogue_reconciliation.md` linking discovery to cube eligibility and explaining pagination;
- one screenshot of the structured inventory, not a provider's marketing page;
- a 300–450 word scientific interpretation of what discovery supports and what it does not.

Remove tokens, signatures, cookies, private endpoints and absolute private paths. If you ran the optional live query, identify it as volatile extension evidence and retain the deterministic fixture result.

### Portfolio artifact

Add `stac_search_inventory.ipynb` to **Artifact 2.H — Cloud-Native EO Discovery and Cube Package**. It completes the discovery-to-computation lineage: query → Item and Asset inventory → eligibility decision → cube contract → bounded computation → cloud-format release.
