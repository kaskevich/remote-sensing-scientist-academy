---
title: Web Maps and Spatial Services
lessonId: lesson-2-43
---

## 1. Deliver the right representation

### Learning outcome

By the end of this lesson, you will be able to explain client and server responsibilities; distinguish rendered maps, raster tiles, vector tiles, features and measured coverages; compare XYZ, WMS, WFS, WMTS, GeoJSON, COG and OGC API delivery; choose a bounded pattern from audience and task; and document CRS, payload, cache, privacy, licence and failure evidence before a web map is released.

- **Lesson type:** Web-delivery architecture lab
- **Estimated time:** 170–220 minutes
- **Prerequisites:** Vector, raster, COG, STAC, spatial databases and public-data governance
- **Portfolio output:** `web_delivery_architecture.md`

### Why this matters

A map in a browser may look like one product, but its layers can arrive in fundamentally different forms. One server sends styled PNG pixels. Another sends vector features and attributes. A tile service sends only the pieces visible at the current zoom. A coverage endpoint preserves measured values for analysis. The browser may receive enough raw detail to restyle, query or accidentally expose sensitive information.

Choosing a delivery pattern is therefore a scientific and governance decision. A rendered map can protect complex styling and reduce transferred detail, but users cannot recover original values from its colours. Raw GeoJSON is transparent and easy to inspect, but an unbounded response can be slow and can disclose fields that the interface never shows. Cached tiles are responsive, but a stale map can appear current unless the date and invalidation policy are visible.

Remote Sensing Scientists need to ask what the audience must **view**, **query**, **download** or **analyse**. The answer determines which representation belongs in the browser and which authoritative evidence remains on the server.

### Scientific context

Chapter 8 produced a synthetic, cloud-native seasonal evidence package. The coastal-meadow group now wants a public monitoring view for programme managers and a separate path for scientific analysts. The public question is deliberately narrow:

> Which generalized training sites have sufficient seasonal evidence for review?

The supplied sites are invented and generalized. The public map must not imply real monitoring locations or temporal change. It must show status, observation count, seasonal NIR summary, update date and limitation. Analysts may need measured raster values and catalogue provenance, but public users do not need the full cube, exact plots or internal review fields.

## 2. One concept — service choice follows the representation users need

### Concept

The single idea is: **choose web delivery from the information the user must receive, not from the technology that is easiest to publish**.

Separate three roles:

- the **authoritative source** holds governed records or immutable observations;
- the **service or distribution layer** selects, styles, tiles or encodes a representation;
- the **client** requests and presents that representation and handles user interaction.

```text
authoritative evidence
PostGIS / COG / Zarr / reviewed files
             │
             ▼
delivery service or static distribution
map image · raster tile · vector tile · feature · coverage · catalogue
             │
             ▼
browser client
view · identify · filter · compare · download
             │
             ▼
text/table alternative and provenance
```

The client is not automatically trusted. Anything delivered to it can be inspected, regardless of whether a popup or style hides it. Public-schema filtering and location generalization must occur before delivery.

[[CHECK:m2-l43-representation]]

## 3. Rendered maps and raster tiles

### WMS — request a rendered map image

The OGC Web Map Service standard defines requests for georeferenced map images. A typical `GetMap` request identifies layers, styles, bounding box, CRS, image size, format and transparency. The server performs portrayal and returns pixels such as PNG. `GetCapabilities` describes offered layers, formats, CRSs and operations. Optional `GetFeatureInfo` can return information near a selected image position, but WMS remains a map-portrayal service rather than feature-data delivery.

Use WMS when consistent server-controlled cartography matters, many clients must display the same styling, or source features should not be transferred. Record the service version. Axis-order behaviour can differ with version and CRS; never copy a bounding box from a WMS 1.1.1 request into WMS 1.3.0 without testing. Also test scale-dependent layers, styles, transparency, exception responses and legend support.

The response image is not an analysis raster: portrayal is not measurement. Pixel colours may include antialiasing, labels and classification. Do not sample them as if they were reflectance.

### XYZ tiles — a common web convention

XYZ tile URLs commonly contain `{z}/{x}/{y}` for zoom, column and row. They are simple, cacheable and widely supported, but “XYZ” alone is not a complete international standard or scientific contract. Providers differ in scheme, zoom range, tile size, licence, attribution, update policy and authentication. Most public basemaps use a Web Mercator tile pyramid; that projection distorts area and distance and is a display context, not the analysis CRS.

Every pan or zoom can request several tiles. Caching improves responsiveness, but cached content needs a freshness rule. An outdated monitoring layer without a visible date is a communication failure.

### WMTS — declared tile matrices

The OGC Web Map Tile Service standard serves pre-defined image tiles through declared tile matrix sets. A tile matrix identifies scale, tile size, grid dimensions and coordinate reference. This makes the tiling scheme discoverable and interoperable. WMTS is effective for stable, frequently viewed cartography because tiles can be prepared and cached.

It is less flexible than arbitrary WMS images: the client chooses among offered matrix levels rather than any extent and size. A layer can disappear beyond the declared zoom range, and reprojection is not something the browser should improvise silently.

## 4. Vector features and tiles

### GeoJSON — a bounded feature representation

GeoJSON expresses feature geometry and properties as JSON. Under RFC 7946, coordinates use WGS 84 longitude, latitude order. It is readable and works well for a small public dataset such as six generalized monitoring sites.

GeoJSON is not a delivery strategy for every vector dataset. Fifty thousand detailed polygons can create a large initial download, slow parsing and rendering, and privacy risk. Excess coordinate precision increases payload without improving source accuracy. Simplification, server-side filtering, pagination or vector tiling may be more appropriate.

### WFS and OGC API Features — query feature data

WFS provides fine-grained feature and property access through operations such as `GetCapabilities`, `DescribeFeatureType` and `GetFeature`. Some profiles include transaction and locking operations. Those editing capabilities require authentication, validation and governance; they must never be exposed merely because the standard supports them.

OGC API – Features offers resource-oriented web access. A landing page links to the API definition, conformance declaration and Collections. Features are accessed under `/collections/{collectionId}/items`, with bounded parameters such as `bbox`, `datetime` and `limit` in the Core. Pages can include a `next` link. The default Core CRS for GeoJSON is CRS84 longitude/latitude; additional parts and conformance classes can add capabilities.

The modern API form is easier to explore through ordinary HTTP and JSON, but it does not mean every filter is supported. Inspect `/conformance`, Collection metadata, queryables when available, media types, limits and pagination.

### Vector tiles — features prepared for display

Vector tiles encode clipped, simplified features for one tile. The browser styles them, enabling responsive restyling and interaction without downloading the entire source dataset. They are display representations, not necessarily lossless source exports. Geometry can be clipped at tile boundaries, coordinates quantized and attributes reduced.

Before public delivery, inspect the tile schema itself. Removing a field from a popup does not remove it from the vector tile. Stable internal identifiers, rare habitat labels or precise geometry can remain sensitive.

[[CHECK:m2-l43-bounded]]

## 5. Coverage and cloud-native value access

A **coverage** maps positions in a spatial or spatiotemporal domain to values. WCS supports retrieval of coverage data rather than a rendered picture. OGC API – Coverages develops modern resource-oriented access. A COG can also expose a georeferenced raster through bounded byte ranges when the file, service and client support it.

Choose coverage or COG access when a user needs measured values and metadata for analysis. The request must preserve CRS, grid, band meaning, scaling, nodata and interpolation semantics. A coverage subset can still be scientifically invalid if it resamples categorical values incorrectly or mixes processing levels.

STAC is complementary: it helps discover and identify assets. It is not a rendered map service or a replacement for feature/coverage access. One system can use STAC for discovery, COG for raster values, OGC API Features for reviewed site features and WMTS for a cached public status map.

## 6. Choose from the user task

| User need | Candidate representation | Evidence to verify |
| --- | --- | --- |
| see consistent status cartography | WMS or WMTS/raster tiles | style, date, scale range, legend, cache |
| inspect six public sites | bounded GeoJSON or OGC API Features | public field allow-list, CRS84, count, paging |
| browse many styled polygons | vector tiles | simplification, tile schema, privacy, zoom |
| analyse reflectance values | COG or coverage service | CRS, grid, range/subset, scale, nodata |
| discover observations | STAC | query, Items, assets, licence, pagination |

The same project may need several distributions. Define which one is authoritative and which are derivatives. A public map is usually a delivery product, not the source of record.

## 7. Worked example — make a delivery matrix

### Predict before running

The public audience needs only context and six generalized site summaries. Analysts need measured pixels and source discovery. Predict which outputs should reach the public browser and which should remain an explicit analytical route.

```python
delivery = {
    "public context": ("XYZ or WMTS", "rendered cached tiles"),
    "public sites": ("bounded GeoJSON", "allow-listed features"),
    "seasonal raster": ("COG", "measured values by range"),
    "source discovery": ("STAC", "Item and Asset metadata"),
}

for purpose, (pattern, representation) in delivery.items():
    print(f"{purpose}: {pattern} — {representation}")
```

### Code walkthrough

1. The dictionary begins with audience purpose, not product names.
2. Public context uses a rendered tile representation; it requires provider terms and attribution.
3. Six generalized sites are small enough for bounded GeoJSON after a public-schema allow-list.
4. The seasonal raster remains measured data and is delivered through validated COG access to authorised analysts.
5. STAC records how analysts discover the eligible raster assets.
6. Each value names both a delivery pattern and the representation the user receives.
7. Printing the matrix makes hidden distinctions reviewable.

The code does not establish endpoints, authorisation or performance. Extend it with source authority, service version, CRS, maximum response, cache rule, licence, privacy decision, failure behaviour and verification owner.

## 8. Common mistakes and recovery

### Mistake 1 — using one service for every audience

One endpoint seems simpler to maintain.

**Recognise it:** public users receive analysis fields, or analysts receive only styled pictures.

**Recover:** separate public portrayal, bounded feature access, measured coverage and discovery by task and permission.

### Mistake 2 — calling a WMS image “the data”

The map looks spatially correct and can be saved.

**Recognise it:** users sample display colours or assume labels and antialiasing are measurements.

**Recover:** label WMS as portrayal and provide an authorised feature or coverage route for data values.

### Mistake 3 — sending a huge GeoJSON

GeoJSON works during development with a small sample.

**Recognise it:** slow initial load, frozen mobile browsers and multi-megabyte payloads.

**Recover:** bound by space and properties, simplify for the display scale, paginate, or move to vector tiles.

### Mistake 4 — hiding sensitive fields only in the popup

The interface no longer displays the field, so it feels removed.

**Recognise it:** browser developer tools or downloaded GeoJSON still contain it.

**Recover:** apply an explicit server/export allow-list and generalize geometry before delivery.

### Mistake 5 — treating Web Mercator as an analysis CRS

The basemap and overlays line up visually.

**Recognise it:** area, distance or buffer is calculated from display coordinates.

**Recover:** analyse in a justified CRS, then transform only the reviewed delivery representation.

### Mistake 6 — ignoring tile and response limits

The service returns something at the initial view.

**Recognise it:** blank layers at other zooms, truncated features or missed pagination.

**Recover:** record zoom/matrix limits, maximum responses and next-link handling; test the complete intended extent.

### Mistake 7 — omitting attribution and timestamp

The basemap already looks familiar, and caching feels operational.

**Recognise it:** source terms, update date and processing status are absent from the visible map.

**Recover:** treat licence, attribution and data date as release requirements outside transient popups.

### Mistake 8 — assuming service success proves scientific suitability

A `200` response and correctly rendered layer feel conclusive.

**Recognise it:** no grid, measurement, mask, support or validation evidence exists.

**Recover:** link every public derivative to the scientific QA package and state what the delivery does not prove.

[[CHECK:m2-l43-governance]]

## 9. Guided practice — design the meadow delivery architecture

1. Verify the Chapter 9 manifest and mark every site and endpoint as synthetic.
2. Read `map_content_contract.json`. Restate the audience, question, public fields, forbidden content and accessible alternative.
3. Audit `service_capability_inventory.csv`. Separate claim from verified evidence for every row.
4. Read `tile_request_scenarios.csv`. For each user action, explain what the browser receives and what remains on the server.
5. Create `delivery_requirements.csv` with audience, task, representation, interaction, maximum payload, privacy class, authority and fallback.
6. Recommend delivery for public context, six public sites, seasonal raster values and catalogue discovery.
7. Reject or conditionally accept at least two supplied service claims. Name the missing evidence and owner.
8. Calculate the GeoJSON payload size. Explain why six features are suitable for one bounded response but why the decision would change at 50,000 detailed polygons.
9. Verify that `monitoring_sites.geojson` and `monitoring_summary.csv` contain the same six stable site IDs and only the allowed public attributes.
10. Draw the architecture from authority through service/distribution to client and text/table alternative.
11. Complete the public-contract and service sections of `WEB_GIS_DELIVERY_QA_TEMPLATE.md`.
12. Save the result as `web_delivery_architecture.md`.

## 10. Independent challenge — evaluate two competing architectures

Compare:

- **Architecture A:** one public GeoJSON file plus a third-party XYZ basemap;
- **Architecture B:** an OGC API Features endpoint, WMTS status layer, COG analyst asset and STAC catalogue.

Evaluate public task fit, analytical value, payload, cache, update complexity, privacy, attribution, offline failure and long-term interoperability. Do not choose the more complex design automatically. For six static sites, Architecture A may be defensible if the update and provenance process is strong. Architecture B may be justified for frequent updates and multiple clients.

Conclude with a conditional decision and the measurable trigger that would cause migration: feature count, payload, update frequency, concurrent users, permission needs or analysis requirement.

## 11. Scientific interpretation

### Scientific interpretation

Web delivery changes representation, not the underlying evidence. A green site symbol can communicate “sufficient evidence under the declared rule”; it cannot prove good ecological condition. A WMS image can show the accepted classification; it cannot expose the source reflectance values. A generalized point protects location but weakens fine-scale spatial interpretation.

The Chapter 9 map must state that its sites and values are synthetic. Its scientific contribution is a traceable public summary of evidence status and observation support. It does not show temporal change, causal drivers or real meadow condition. Delivery is successful only when users can understand those limits without inspecting source code.

## 12. Reflection, submission and portfolio artifact

### Reflection

1. When is a rendered map safer or clearer than feature delivery?
2. Which browser-visible fields would create the greatest privacy or ecological risk?
3. Why are vector-tile features not necessarily suitable as lossless analysis inputs?
4. What evidence distinguishes a stale cached map from a current one?

### Submission

Submit:

- `web_delivery_architecture.md` with the selected representations and authority map;
- `delivery_requirements.csv` and reviewed service inventory;
- `public_schema_audit.csv` comparing GeoJSON and table fields;
- one architecture diagram with descriptive text;
- a completed service and public-data contract section of the QA record;
- a 300–450 word scientific interpretation explaining what each distribution supports and does not support.

Do not include private coordinates, service credentials, API keys or claims that the training records are real observations.

### Portfolio artifact

Add `web_delivery_architecture.md` to the **UAV and Satellite Analysis Pipeline** under **Artifact 2.I — Accessible Web GIS Evidence Delivery**. It is the representation and governance gate. The next lesson turns its public contract into a focused interactive map without teaching unrelated frontend engineering.
