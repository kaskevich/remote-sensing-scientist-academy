---
title: OGC Standards and Interoperability
lessonId: lesson-2-45
---

## 1. Test the contract between systems

### Learning outcome

By the end of this lesson, you will be able to relate WMS, WFS, WCS, WMTS and modern OGC API families to map, feature, coverage and tile needs; explain how COG and STAC complement service standards; inspect capabilities, landing links and conformance declarations; test version, CRS, axis order, format, paging, identifiers, licence and authentication; and produce an interoperability matrix based on observed exchange rather than product labels.

- **Lesson type:** Interoperability verification lab
- **Estimated time:** 180–230 minutes
- **Prerequisites:** Web delivery patterns, GeoJSON, COG, STAC and spatial reference systems
- **Portfolio output:** `interoperability_map.md`

### Why this matters

Environmental evidence moves between field systems, databases, analysis code, desktop GIS, web clients and archives. Interoperability means more than opening a layer once. Different systems must agree what is being requested, how geometry and values are encoded, which CRS and axis order apply, how pages continue, what identifiers remain stable and which operations are actually supported.

Standards reduce one-off integrations by defining shared contracts. They do not make implementations identical. A service can conform to a Core class but omit an optional filter. Two WMS servers can support different styles and CRSs. A GeoJSON response can be syntactically valid while omitting the stable identifier required by the workflow. A COG can be efficiently readable but undiscoverable without catalogue metadata.

The professional approach is capability-led. Inspect what a service declares, send a bounded request, validate the response and record the exact version or conformance class. “Uses OGC” is not a test result.

### Scientific context

The coastal-meadow group must hand its synthetic monitoring product to three consumers:

- a desktop GIS reviewer who needs consistent portrayal and identifiable sites;
- a browser map that needs bounded public features and cached context;
- a scientific analyst who needs measured raster values and source provenance.

The supplied `interoperability_fixture.json` simulates a modern OGC API landing page, conformance declaration, Collection, partial feature page and legacy WMS/WFS/WMTS capability extracts. All endpoints use `example.invalid` and must not be fetched. You will trace each user need through one or more standards, identify missing evidence and design a provider-neutral acceptance test.

## 2. One concept — interoperability is verified behaviour at a declared boundary

### Concept

The single idea is: **systems interoperate when a bounded, versioned request and response preserve the meaning needed by both sides**.

The boundary is more than a URL:

```text
client need
    │
    ▼
declared standard + version / conformance class
    │
    ▼
request: operation, resource, CRS, bounds, format, limit
    │
    ▼
response: media type, identifiers, geometry/values, links, errors
    │
    ▼
validation: meaning, count, spatial extent, missingness, licence
```

A successful HTTP response proves only that the server returned something. Interoperability evidence must show that the response represents the intended layer, collection, features, coverage or tiles and can be used correctly by the target client.

[[CHECK:m2-l45-contract]]

## 3. Established OGC web services

### WMS — portrayal

WMS provides georeferenced map images. Core professional checks include:

- service version and `GetCapabilities` document;
- layer names, human titles and queryability;
- offered CRSs, geographic bounds and scale limits;
- styles and legend routes;
- image formats and transparency;
- `GetMap` bbox, width and height;
- axis order for version/CRS combination;
- optional `GetFeatureInfo` format and semantics;
- structured exception response.

WMS supports visual interoperability: different clients can request a portrayal. It does not provide the original feature schema or measured raster values.

### WFS — feature access

WFS provides feature and property access. `GetCapabilities` advertises service behaviour, `DescribeFeatureType` describes schemas and `GetFeature` retrieves matching features. WFS 2.0 can support stored queries, paging and transactional operations depending on profile and implementation.

For read access, validate type names, output format, identifiers, CRS, bbox/filter semantics, maximum count and paging. GML namespaces and axis order can challenge clients. GeoJSON output may be easier for browser use but remains provider capability, not something to assume.

Transactional WFS is a separate risk surface. Editing requires authentication, authorisation, validation, concurrency policy and audit logs. Chapter 9 needs public read delivery only.

### WCS — measured coverages

WCS delivers coverage values over spatial or spatiotemporal domains. It is relevant when the consumer needs the environmental measurements, not a styled image. Validate coverage identifier, domain, range fields, CRS, resolution, subset semantics, format, interpolation and nodata.

Coverage access can be powerful and complex. A subset request should be small and scientifically explicit. If the receiving client cannot interpret the encoding and metadata, theoretical conformance does not complete the handover.

### WMTS — map tiles

WMTS publishes map tiles on declared tile matrix sets. Verify layer, style, format, tile matrix set, supported matrix levels, top-left origin, tile dimensions and row/column conventions. A client cannot request arbitrary resolution outside the matrices.

WMTS supports efficient cached portrayal. It does not deliver arbitrary source features or continuous analytical subsets.

## 4. OGC API families

OGC API standards use web-resource patterns familiar to modern applications. OGC API – Features Part 1 Core defines a landing page, API definition, conformance declaration, Collections and feature Items. A Core server exposes which conformance classes it implements through `/conformance`; clients should not infer optional behaviour from the product name.

Common links have defined relationships:

- `service-desc` links to a machine-readable API definition;
- `service-doc` can link to human-readable documentation;
- `conformance` links to declared conformance classes;
- `data` links to Collections;
- `items` links from a Collection to its member resources;
- `next` links to another result page.

OGC API – Maps, Tiles, Coverages, Records and Processes address other capabilities. Their maturity, parts and implementation support vary. Describe the exact standard and conformance class; do not use “OGC API” as one undifferentiated version.

The modern APIs and older web services can coexist. Organisations often maintain WMS/WMTS for broad desktop compatibility while adding OGC APIs for resource-oriented access. Migration should follow client requirements and tested parity, not fashion.

[[CHECK:m2-l45-conformance]]

## 5. COG and STAC in the interoperability system

COG and STAC have different roles from request/response services:

- **COG** is an internally organised GeoTIFF profile supporting efficient bounded reads when served appropriately;
- **STAC** describes and links spatiotemporal assets through Catalogs, Collections, Items and Assets;
- **WMS/OGC API Maps** can portray a COG-backed product without exposing measurement values;
- **WCS/OGC API Coverages** can expose measured coverage subsets;
- **STAC** can let an analyst discover the COG asset;
- **OGC API Features** can deliver public monitoring sites related to that product.

They are complementary, not interchangeable. A STAC Item can link a COG and describe its time, geometry and asset role. The COG layout can then support bounded reads. Neither defines the public legend, feature-selection panel or evidence status by itself.

An interoperability diagram should therefore show responsibilities, not a list of logos.

## 6. CRS, axis order and spatial meaning

CRS errors are among the most plausible cross-system failures. GeoJSON under RFC 7946 uses longitude, latitude in WGS 84/CRS84. WMS 1.3.0 follows CRS axis definitions, which creates a well-known risk when EPSG:4326 latitude/longitude axis expectations meet software accustomed to x/y. CRS84 retains longitude/latitude order. Test rather than memorising one rule for every service.

For each boundary:

1. record the source CRS and axis order;
2. record the requested/response CRS;
3. use an asymmetric bbox whose swapped axes would be visibly different;
4. verify returned extent against a known control;
5. confirm geometry coordinates and metadata agree;
6. keep analysis in the justified CRS and transform the delivery derivative explicitly.

A layer appearing near the correct region on a broad basemap is not sufficient. Validate representative coordinates and bounds numerically.

## 7. Formats, identifiers, paging and errors

Use HTTP content negotiation and declared formats where supported. Check the response `Content-Type`, not only the filename. A client expecting GeoJSON should fail clearly when it receives an HTML error page with status 200 or a GML response it cannot parse.

Stable identifiers connect services and evidence. A monitoring site ID delivered through OGC API Features should match the accessible table and source authority. A WMS image cannot carry feature identifiers directly, though `GetFeatureInfo` may refer to them. A STAC Item ID identifies an observation asset, not necessarily a monitoring site.

Paging must be followed and reconciled. In the fixture, `numberMatched` is six while `numberReturned` is three and a `next` link exists. Treating the first page as complete loses half the sites. Do not invent offset parameters; follow advertised links or client abstractions.

Error handling is part of interoperability. Record HTTP status, declared exception format, retry class and user-facing fallback. Retry temporary network or rate-limit failures with bounded backoff. Do not retry invalid CRS, authentication denial or malformed filters without correction.

## 8. Licence, authentication and governance

Standard access does not mean open access. A conformant service may require authentication and impose licence, attribution, rate or redistribution conditions. Separate:

- public anonymous portrayal;
- public bounded read access;
- authenticated analyst access;
- privileged editing or administration.

Never place write credentials or unrestricted analyst tokens in browser code. Use short-lived, scoped access only where architecture requires it, and do not commit it. A public client must receive only the data and permissions it needs.

Record service owner, support contact, update policy, deprecation notice, stable endpoint strategy and exit plan. Interoperability includes organisational continuity as well as encoding.

## 9. Worked example — inspect a deterministic API contract

### Predict before running

The fixture says six features matched and three were returned. Predict whether the page is complete. Which link relation should a client follow? Does Core conformance prove support for advanced attribute filtering?

```python
import json

with open("inputs/interoperability_fixture.json") as stream:
    evidence = json.load(stream)

classes = evidence["conformsTo"]
page = evidence["feature_page"]
next_links = [link["href"] for link in page["links"]
              if link["rel"] == "next"]

print("conformance classes", len(classes))
print("matched", page["numberMatched"])
print("returned", page["numberReturned"])
print("next page declared", bool(next_links))
```

### Code walkthrough

1. Python's standard JSON library is sufficient for this deterministic inspection.
2. The local fixture is opened; its non-fetchable endpoints remain metadata only.
3. `conformsTo` records the exact classes the synthetic service claims.
4. `feature_page` represents one bounded response page.
5. The list comprehension selects links whose relation is `next` rather than constructing a provider-specific URL.
6. Three summary prints make capability, population and paging visible.
7. Six matched and three returned means the current page is incomplete.
8. The advertised Core and GeoJSON classes do not prove the optional Filtering part. A client must inspect additional conformance/queryables evidence.

Extend the audit by checking required landing link relations, Collection ID, CRS, extent, item link media type and the synthetic endpoint guard. Validate the final six-site population from the provided GeoJSON rather than trying to fetch `example.invalid`.

## 10. Common mistakes and recovery

### Mistake 1 — treating a standard name as a capability test

The service is labelled WFS or OGC API.

**Recognise it:** no version, conformance or operation evidence is stored.

**Recover:** inspect capabilities/landing page, exact conformance classes, formats, limits and a bounded response.

### Mistake 2 — confusing maps, features and coverages

All are spatial and display in GIS.

**Recognise it:** WMS pixels are analysed as values or WCS is used only to obtain a screenshot.

**Recover:** state whether the consumer needs portrayal, object properties or measured domain values.

### Mistake 3 — assuming STAC replaces every service

STAC can point to many assets.

**Recognise it:** there is no tested access route for portrayal, feature query or coverage subset.

**Recover:** use STAC for discovery and pair assets with the appropriate access representation.

### Mistake 4 — hard-coding CRS axis order

One successful service pattern is copied everywhere.

**Recognise it:** asymmetric bbox tests fail or returned extent is transposed.

**Recover:** read version and CRS semantics, use a diagnostic bbox, and validate coordinates numerically.

### Mistake 5 — ignoring pagination

The first response contains valid features.

**Recognise it:** `numberReturned < numberMatched` or a `next` link remains.

**Recover:** follow declared links within a bounded request and reconcile stable IDs.

### Mistake 6 — assuming optional filters

The API accepts `bbox`, so advanced filters seem likely.

**Recognise it:** undocumented parameters are ignored or rejected.

**Recover:** inspect conformance classes and queryables; design fallback only within bounded, permitted data.

### Mistake 7 — trusting file extension over media type

The URL ends in `.json` or `.tif`.

**Recognise it:** the response contains HTML error text or another encoding.

**Recover:** validate HTTP status, `Content-Type`, schema and representative values before use.

### Mistake 8 — exposing a privileged service through the browser

The standard endpoint already exists for internal users.

**Recognise it:** browser code contains reusable credentials or transaction operations.

**Recover:** publish a scoped read representation, enforce least privilege on the server and keep write workflows separate.

### Mistake 9 — validating only one client

The author's QGIS version opens the layer.

**Recognise it:** no browser, second GIS or version matrix exists.

**Recover:** test representative required clients and record passed operations, not vague compatibility.

[[CHECK:m2-l45-acceptance]]

## 11. Guided practice — build the interoperability acceptance matrix

1. Verify `interoperability_fixture.json` and state that all endpoints are non-fetchable synthetic evidence.
2. Validate landing links for `self`, `conformance`, `data` and `service-desc`.
3. Record every conformance URI exactly. Separate Core, GeoJSON and HTML; note that Filtering is absent.
4. Audit the `public_monitoring_sites` Collection: ID, item type, default CRS, spatial/temporal extent and items link.
5. Diagnose the partial feature page and define how all six IDs will be reconciled without inventing a page URL.
6. Review the WMS extract. Design an asymmetric bbox test for CRS84 and EPSG:4326 axis behaviour.
7. Review the WFS extract. Identify missing paging evidence and the authenticated-access constraint.
8. Review the WMTS extract. Record tile matrix set and maximum zoom; explain what should happen beyond zoom 14.
9. Map STAC discovery, COG access, public features and portrayal in one data-flow diagram.
10. Create `interoperability_acceptance.csv` with client, need, standard, version/class, bounded request, expected media type, CRS, count, stable IDs, auth, licence, test result and issue owner.
11. Add a negative test for HTML returned where GeoJSON was expected, swapped bbox axes and missing next-page handling.
12. Complete the service and interoperability sections of `WEB_GIS_DELIVERY_QA_TEMPLATE.md` and save `interoperability_map.md`.

## 12. Independent challenge — design a cross-organisation handover

Organisation A publishes the monitoring evidence. Organisation B uses QGIS and a browser client. Organisation C archives observations and reproduces analysis.

Design a handover in which:

- A offers public portrayal and bounded feature access;
- B can load a standard layer and reconcile six site IDs;
- C can discover source Items, retrieve measured COG values and verify checksums;
- no public route exposes exact internal plots or write privileges.

Specify standards, profiles, endpoints/resources, CRSs, encodings, authentication scopes, stable identifiers, update/deprecation rules and acceptance tests. Include one failure where a valid-looking response has the wrong axis order and one where paging omits records. Explain how each is detected before publication.

## 13. Scientific interpretation

### Scientific interpretation

Interoperability preserves access to representations; it does not make different representations scientifically equivalent. A WMS portrayal, OGC API feature and COG coverage can refer to the same seasonal evidence while supporting different operations. The client must not infer measured NIR from map colour, precise location from generalized public geometry or complete evidence from a first result page.

The strongest Chapter 9 handover states what each boundary preserves: stable site status and counts in features, reviewed portrayal in tiles/images, measured values in a coverage asset, and provenance in STAC. It also states unresolved limitations. A system that communicates those boundaries clearly is more interoperable scientifically than one that merely supports many protocols.

## 14. Reflection, submission and portfolio artifact

### Reflection

1. Which exact evidence demonstrates OGC API Features Filtering support?
2. Why can a WMS and COG legitimately represent the same product without being interchangeable?
3. How does an asymmetric bounding box reveal axis-order failure?
4. Which stable identifiers must connect catalogue, raster, feature, map and table outputs?

### Submission

Submit:

- `interoperability_map.md` with the cross-system role diagram;
- `interoperability_acceptance.csv` containing positive and negative tests;
- `capability_and_conformance_audit.json` preserving exact versions/classes and evidence;
- `paging_and_id_reconciliation.csv` for all six public sites;
- one CRS/axis-order diagnostic record;
- a completed Web GIS QA record;
- a 350–500 word handover statement defining supported clients, operations and limitations.

Do not fetch the fixture's invalid endpoints or include service credentials. Label all test results as simulated unless you used an authorised real service and recorded it separately.

### Portfolio artifact

Add `interoperability_map.md` to **Artifact 2.I — Accessible Web GIS Evidence Delivery**. It completes the chapter chain: governed representation → accessible interactive map → tested interoperability handover.
