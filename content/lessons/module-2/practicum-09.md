---
title: Deliver an Accessible Environmental Monitoring Map
lessonId: module-2-chapter-9-practicum
---

## Chapter 9 practicum — Deliver an Accessible Environmental Monitoring Map

### Learning outcome

By the end of this practicum, you will be able to convert a reviewed EO evidence package into a purpose-led web delivery architecture; create a small interactive public map with an equivalent table and text summary; prevent sensitive or unsupported data from reaching the browser; validate service capabilities, OGC API conformance, CRS, paging and identifiers; test mobile, keyboard, touch, performance and failure behaviour; and issue an evidence-based release decision for multiple professional clients.

- **Estimated time:** 420–540 minutes
- **Prerequisites:** Lessons 2.43–2.45 and the Chapter 8 cloud-native EO evidence package
- **Portfolio output:** **Artifact 2.I — Accessible Web GIS Evidence Delivery**
- **Training status:** all sites, values and service endpoints are synthetic; locations are invented and generalized

### Why this practicum matters

An analysis is not complete when its notebook finishes. People must be able to find, view, query and interpret the result without receiving data they should not see. A web map can support that handover, but it can also create a convincing failure: colour suggests ecological condition, the first API page omits half the sites, a WMS axis swap places the study elsewhere, hidden attributes remain embedded in GeoJSON, or a basemap failure leaves an empty screen.

Professional delivery connects the scientific evidence contract to a public information contract. The public map has a narrower purpose than the analysis cube. It communicates which generalized synthetic sites have sufficient seasonal evidence for review. It does not release precise plots, raw imagery, private comments or causal conclusions.

The practicum evaluates three graduate profiles. A **Geospatial Data Analyst** must reconcile status, counts, missingness and map/table results. A **GIS/Remote Sensing Engineer** must design bounded representations, test standards and deliver a resilient artifact. A **Remote Sensing Researcher** must prevent portrayal from overstating measurement and explain the limits of seasonal evidence.

### Scientific brief

The coastal-meadow group asks:

> Can the reviewed synthetic seasonal evidence be delivered as an accessible public monitoring map and interoperable analyst handover without losing provenance, exposing restricted information or overstating ecological meaning?

Your final decision may be **release**, **conditional release** or **do not release**. A map that looks polished but fails privacy, accessibility, reconciliation or scientific-meaning checks must not receive unconditional release.

## 1. Establish the project and evidence boundary

Read `web-gis-delivery/README.md` and verify all checksums in `manifest.json`. Preserve the supplied pack unchanged under `inputs/`:

- `monitoring_sites.geojson`;
- `monitoring_summary.csv`;
- `service_capability_inventory.csv`;
- `tile_request_scenarios.csv`;
- `interoperability_fixture.json`;
- `map_content_contract.json`;
- `WEB_GIS_DELIVERY_QA_TEMPLATE.md`.

Create:

```text
web_gis_evidence_delivery/
├── README.md
├── environment.txt
├── inputs/
├── contracts/
├── src/
├── outputs/
│   ├── map/
│   ├── tables/
│   └── diagrams/
├── WEB_GIS_DELIVERY_QA.md
└── WEB_GIS_RELEASE_DECISION.md
```

State on the first page of every deliverable that the data are synthetic and locations generalized. Record the library, browser and operating environment actually tested. A live basemap or service may be used only when its terms allow it; the assessed evidence must remain understandable without network access.

## 2. Gate A — define audience, question and permitted claims

Create `contracts/public_information_contract.md` with:

- audience: environmental programme managers and scientific reviewers;
- primary question: which generalized sites have sufficient seasonal evidence for review;
- public unit: one generalized synthetic site;
- visible fields and their meanings;
- forbidden fields and precise-location policy;
- status rule and missing-data rule;
- spatial and temporal support;
- accessible alternative;
- data date, source, licence and attribution;
- permitted and prohibited conclusions.

The status categories describe **evidence sufficiency**, not meadow health. Write the exact sentence users may conclude and three statements they may not conclude. Include “not assessed” as a real category rather than omitting it.

Create `outputs/tables/public_schema_audit.csv`. Compare GeoJSON properties, CSV columns and the allow-list from `map_content_contract.json`. Fail the gate if an extra field reaches the planned browser payload. A field hidden by CSS or omitted from a popup is still delivered.

[[CHECK:m2-p9-public]]

## 3. Gate B — choose delivery patterns by user need

Create `contracts/delivery_architecture.md` with separate paths for:

1. public context portrayal;
2. six public monitoring sites;
3. analyst access to seasonal raster values;
4. observation discovery and provenance;
5. accessible table and text summary.

For each path, name authority, derivative, representation, client, update process, maximum response, cache/freshness rule, licence, authentication and fallback. Evaluate at minimum:

- XYZ or WMTS for cached context;
- WMS for server-controlled portrayal;
- bounded GeoJSON or OGC API Features for six queryable sites;
- vector tiles as the future large-layer option;
- COG or coverage access for measured raster values;
- STAC for discovery.

Do not deploy every candidate. Select the smallest architecture that satisfies the current audience and preserve triggers for migration.

Review `service_capability_inventory.csv`. Keep the missing attribution, untested WMS axis order, unbounded WFS and untested COG CORS issues visible. Create `outputs/tables/service_decisions.csv` with accept, review or reject, evidence, risk, owner and next action.

## 4. Gate C — reconcile the public dataset

Validate both public datasets:

- exactly six unique site IDs;
- one GeoJSON Point and one CSV row per ID;
- RFC 7946 longitude/latitude order and plausible bounds;
- identical public status, count, NIR, uncertainty and date values;
- missing NIR remains missing for `PUB_D`;
- no precision or property beyond the public contract;
- all coordinates and records retain synthetic/generalized status.

Create `outputs/tables/map_table_reconciliation.csv` with one row per stable ID and field-by-field pass/fail. Compare category counts. The expected public summary is three sufficient, one conditional, one review and one not assessed. Do not hard-code that sentence without deriving and reconciling it.

Write a text summary with the counts and one limitation. It must remain useful if the map fails to load.

## 5. Gate D — build the interactive map

Create `src/build_monitoring_map.ipynb` or a script plus notebook narrative. Use Folium for the assessed six-site artifact unless you justify an equally lightweight alternative.

The delivered `outputs/map/environmental_monitoring_map.html` must contain:

- a visible title and primary question;
- a concise method/status rule;
- neutral context and one monitoring-status layer;
- a legend with all four text categories;
- status not encoded by colour alone;
- click/tap selection with site, text status, valid count, median NIR or “Not available”, update and uncertainty;
- visible synthetic status, data date, source, licence, attribution and limitations outside popups;
- a “Skip map and view site table” route;
- an equivalent captioned table with the six public records;
- a text result summary;
- a fallback message for map-layer or tile failure.

Keep controls restrained. The map does not need animation, 3-D terrain, geolocation, drawing tools, heat maps, clusters or many basemaps. Do not teach frontend engineering through avoidable complexity.

Inspect the saved HTML for forbidden field names, credential patterns and exact data payload. Record file size and whether any external request is required. If a basemap requires a provider, confirm its licence and visible attribution.

[[CHECK:m2-p9-accessibility]]

## 6. Gate E — test accessibility and responsive behaviour

Create `outputs/tables/accessibility_responsive_results.csv`. Test at:

- 320 × 568;
- 375 × 812;
- 768 × 1024;
- desktop width.

At every width, verify:

1. no horizontal page overflow;
2. title and scientific question remain visible and readable;
3. map controls do not cover the legend or result;
4. touch targets remain usable;
5. legend text wraps rather than shrinking excessively;
6. the table remains usable in a bounded region;
7. selected-site information remains readable;
8. source, date and limitation remain visible.

Test keyboard-only use:

- the skip link works;
- focus is visible;
- order follows the page structure;
- map controls can be reached or bypassed;
- users can leave the map without a keyboard trap;
- no essential content depends on hover;
- the table is reachable and understandable.

Inspect semantic headings, table caption/headers and the map's accessible name/instructions. Use automated accessibility tools if available, but do not report an automated pass as complete accessibility. Document manual evidence and limitations.

## 7. Gate F — test performance, privacy and failures

Create `outputs/tables/performance_failure_results.csv` with test environment, initial HTML bytes, embedded data bytes, network requests, transferred bytes, result and limitation.

Run or design these tests:

- basemap network blocked;
- GeoJSON layer unavailable or malformed;
- one site has missing NIR;
- map and table IDs differ;
- response contains a forbidden field;
- service returns HTML instead of expected GeoJSON;
- first feature page returns three of six records;
- narrow viewport;
- unsupported WebGL if a MapLibre extension is used.

The public page must not turn a failed layer into an apparently empty scientific result. Show a visible data-unavailable state while retaining the table, method and provenance. A retry should be bounded and must not conceal persistent schema or authentication errors.

Scan the final files for API keys, tokens, cookies, signed URLs, internal endpoints and personal paths. If any secret is found, revoke it when applicable and remove it from repository history before submission.

## 8. Gate G — verify interoperability

Use `interoperability_fixture.json`; do not fetch its `example.invalid` endpoints.

Create `outputs/tables/interoperability_acceptance.csv` with rows for:

- OGC API landing links;
- Features Core conformance;
- GeoJSON conformance;
- Collection identity, CRS and extent;
- bounded `items` request;
- page-count and `next` link;
- WMS 1.3.0 capability and axis-order test design;
- WFS 2.0 schema, output and paging evidence;
- WMTS 1.0 tile matrix and zoom limit;
- STAC Item discovery;
- COG analyst access.

For each row, record client need, exact standard/version/class, request/resource, expected media type, CRS/axis, bounds, counts, stable IDs, authentication, licence, simulated result and issue owner.

Reconcile all six site IDs after the two feature pages conceptually. Do not construct an undocumented paging parameter; follow the declared `next` link in a real service. Add negative acceptance tests for swapped bbox axes, absent next-link handling and wrong media type.

Create `outputs/diagrams/interoperability_flow.pdf` or an accessible diagram plus text alternative showing:

```text
STAC discovery → COG measurement access → reviewed status derivation
                                        ↓
OGC API Features / bounded GeoJSON → interactive map + table
                                        ↓
WMS or WMTS portrayal for other GIS clients
```

Every arrow needs a stable identifier, CRS/representation and QA record.

[[CHECK:m2-p9-interoperability]]

## 9. Gate H — prepare the professional handover

Complete `WEB_GIS_DELIVERY_QA.md`. Write `README.md` with:

- public question and synthetic status;
- audience and permitted interpretation;
- folder structure;
- exact local reproduction instructions;
- environment and browser support;
- data and checksum sources;
- public-schema and generalization rules;
- map and table use;
- service/interoperability assumptions;
- update and cache policy;
- accessibility and failure behaviour;
- known limitations and responsible next action.

Create `outputs/tables/release_inventory.csv` with path, role, media type, checksum, data date, public/private status, authority/derivative status and verification result.

Define publication control:

1. build into a new versioned output directory;
2. validate all fields and links;
3. reconcile map, table and service IDs;
4. run responsive, keyboard, privacy and failure checks;
5. compute checksums;
6. promote only the complete reviewed version;
7. retain a rollback version and visible data timestamp;
8. invalidate or version caches according to the declared update policy.

## 10. Final release decision

Write `WEB_GIS_RELEASE_DECISION.md` in 700–1,000 words:

1. **Decision** — release, conditional release or do not release.
2. **Audience and task** — who uses the product and for what question.
3. **Public evidence** — records, fields, geometry generalization and status rule.
4. **Delivery architecture** — representation chosen for each user need.
5. **Map communication** — layers, legend, selection, table and text summary.
6. **Accessibility** — tested widths, keyboard/touch evidence and remaining limits.
7. **Interoperability** — standards, versions/classes, clients and acceptance results.
8. **Performance/privacy/failure** — bounds, scans and fallback behaviour.
9. **Scientific interpretation** — what the map supports and does not support.
10. **Next actions** — owner, evidence needed and reassessment trigger.

A release decision must not describe the synthetic map as live monitoring. It may demonstrate a professional delivery method ready to be applied after real-data, licence and security review.

## 11. Professional mistakes — Web GIS and Delivery

Add detected status and evidence location for each mistake before release.

| # | Professional mistake | Why it fails | Required recovery |
| ---: | --- | --- | --- |
| 1 | Building before defining audience and question | Interaction has no decision purpose | Write the public information contract first |
| 2 | Calling evidence status ecological condition | Portrayal overstates the measurement | Use exact evidence-status language |
| 3 | Treating WMS pixels as measured raster values | Styled colours are not source measurements | Provide COG/coverage access for analysts |
| 4 | Sending every field to the browser | Hidden fields remain inspectable | Apply a public allow-list before serialization |
| 5 | Publishing precise sensitive locations | Styling cannot undo disclosure | Generalize or aggregate before delivery |
| 6 | Assigning EPSG:4326 instead of transforming | Projected coordinates are mislocated | Verify source CRS and transform explicitly |
| 7 | Reversing GeoJSON longitude and latitude | Features appear in the wrong geography | Validate RFC 7946 order and bounds |
| 8 | Using Web Mercator for scientific area/distance | Display distortion changes measurement | Analyse in a justified CRS |
| 9 | Delivering an unbounded GeoJSON | Browser performance and privacy fail | Bound, simplify, paginate or tile |
| 10 | Assuming vector tiles preserve source geometry | Clipping and quantization are ignored | Treat tiles as display derivatives |
| 11 | Omitting licence or attribution | Terms and provenance are broken | Display and record provider requirements |
| 12 | Hiding the data date | Cached content appears current | Show timestamp and define invalidation |
| 13 | Colour-only status | Users cannot reliably distinguish categories | Add text and non-colour cues |
| 14 | Essential content only on hover | Touch and keyboard users lose evidence | Add click/tap, persistent summary and table |
| 15 | Missing “not assessed” from legend | Missing evidence disappears | Include explicit missing category |
| 16 | Converting missing NIR to zero | Absence becomes a measurement | Preserve missingness and reason |
| 17 | Map canvas without accessible name | Assistive users lack purpose/instructions | Add name, instructions and skip path |
| 18 | Keyboard trap inside the map | Users cannot continue through the page | Provide predictable focus and bypass |
| 19 | Oversized mobile map | Controls block context and page scrolling | Constrain height and test narrow widths |
| 20 | No non-map alternative | Key evidence depends on visual interaction | Publish equivalent table and summary |
| 21 | Treating automated accessibility scan as complete | Interaction barriers remain untested | Add manual keyboard/touch and user review |
| 22 | Blank map interpreted as no evidence | Service failure becomes a scientific result | Show explicit error and retain table |
| 23 | Retrying invalid requests indefinitely | Load and confusion increase | Retry only transient failures with bounds |
| 24 | Assuming a standard name proves capability | Optional operations may be absent | Inspect version/capabilities/conformance |
| 25 | Ignoring WMS version and axis order | Requested extent can be transposed | Run an asymmetric bbox test |
| 26 | Ignoring API pagination | Records disappear silently | Follow `next` links and reconcile IDs |
| 27 | Assuming OGC API Core includes advanced filtering | Unsupported queries can fail or be ignored | Inspect exact conformance/queryables |
| 28 | Trusting extension instead of media type | Error HTML can enter a parser | Validate status, content type and schema |
| 29 | Placing privileged tokens in browser code | Credentials and write access are exposed | Use scoped server-side access and least privilege |
| 30 | Publishing only from one tested client | Other required clients may fail | Maintain an explicit client acceptance matrix |
| 31 | Treating STAC, COG and WMS as competitors | Discovery, access and portrayal roles are confused | Map each standard to its responsibility |
| 32 | Presenting synthetic sites as real monitoring | Training evidence becomes misinformation | Keep synthetic/generalized status prominent |

## 12. Assessment rubric

### Technical correctness

The map and table reconcile exactly; GeoJSON uses correct coordinate order and public fields; missingness and status rules remain correct; service/version/CRS/paging evidence is validated; and the artifact works at required widths with clear failure behaviour.

### Conceptual understanding

The learner distinguishes portrayal, tiles, features, coverages, discovery and cloud assets; connects interaction to audience evidence; and treats interoperability as verified behaviour rather than a standards list.

### Reproducibility

The package contains immutable inputs, checksums, environment, code, public contract, service inventory, stable IDs, map/table reconciliation, test results, release inventory and a controlled version-promotion process.

### Scientific communication

The product answers one question clearly, remains usable without map interaction, states dates and limitations, and never confuses evidence sufficiency, seasonal NIR, ecological condition or real monitoring.

## 13. Submission

Submit one repository or compressed project containing:

- `environmental_monitoring_map.html`;
- source notebook/script;
- accessible table and text summary;
- `public_information_contract.md` and `delivery_architecture.md`;
- `public_schema_audit.csv` and `map_table_reconciliation.csv`;
- `service_decisions.csv`;
- `accessibility_responsive_results.csv`;
- `performance_failure_results.csv`;
- `interoperability_acceptance.csv` and flow diagram;
- `release_inventory.csv`;
- `WEB_GIS_DELIVERY_QA.md`;
- `WEB_GIS_RELEASE_DECISION.md`;
- `README.md`, `environment.txt` and checksum evidence.

Open the final package from a clean relative path. Confirm that all six public IDs reconcile, no forbidden field or credential is embedded, the table remains useful offline and every result is labelled synthetic.

## 14. Portfolio artifact

Publish the reviewed package as **Artifact 2.I — Accessible Web GIS Evidence Delivery** inside the **UAV and Satellite Analysis Pipeline** portfolio. It demonstrates that you can move a remote-sensing result from governed evidence to a useful public and analyst handover while preserving scientific meaning, access boundaries and interoperability.
