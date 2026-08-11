# Module 2 Chapter 9 final review

Review date: 11 August 2026

## Scope

Chapter 9 publishes three complete lessons and one practicum:

- 2.43 Web Maps and Spatial Services;
- 2.44 Interactive Mapping;
- 2.45 OGC Standards and Interoperability;
- Chapter 9 Practicum — Deliver an Accessible Environmental Monitoring Map.

The chapter extends Chapter 8 from cloud-native evidence into public and analyst delivery. It preserves the existing Academy interface, navigation, learner progress, notes, uploads, submissions, discussions and instructor feedback.

## Vertical lesson quality

Every lesson includes one conceptual centre, scientific motivation, continuing coastal-meadow context, visual explanation, short worked example, line-by-line walkthrough, prediction, three formative checks, beginner failure recovery, guided practice, independent challenge, scientific interpretation, reflection, submission and portfolio integration.

The content does not become a frontend-engineering course. Folium provides the assessed lightweight implementation; MapLibre and vector tiles are introduced where scale and application behaviour justify them.

## Horizontal curriculum integrity

Chapter 9 creates **Artifact 2.I — Accessible Web GIS Evidence Delivery** and adds four checkpoints to the Module 2 starter. It applies earlier competencies:

- Chapter 1 CRS, format and public-data decisions become service and payload contracts;
- Chapter 2 vector schema and topology become bounded public GeoJSON;
- Chapter 3 raster/coverage distinctions prevent WMS portrayal from being analysed as values;
- Chapter 7 authority, permissions and storage roles govern public and analyst routes;
- Chapter 8 STAC, COG and cube provenance connect discovery and measured access to portrayal.

## Scientific, accessibility and security boundaries

- every site, value and service endpoint is synthetic;
- public points are invented and generalized;
- evidence status is never called ecological condition;
- missing NIR remains missing rather than zero;
- browser data use an explicit public field allow-list;
- precise/internal attributes are removed before serialization;
- map information remains available in an equivalent table and text summary;
- keyboard, touch and 320/375/tablet/desktop checks are required;
- failed services create an explicit unavailable state rather than a false empty result;
- credentials, signed URLs and write operations are excluded from public delivery;
- all standards are referenced by exact version or conformance class and bounded acceptance behaviour.

## Standards baseline

The lessons were checked against current primary specifications and documentation for WMS, WFS, WCS, WMTS, OGC API – Features, GeoJSON, STAC, COG, Folium, MapLibre and WCAG 2.2. Established web services and modern OGC APIs are presented as coexisting professional options rather than a simplistic old/new ranking.

## Training pack

`public/lesson-resources/module-2/web-gis-delivery/` contains a checksum manifest, six-site GeoJSON/table pair, service inventory, request scenarios, deterministic conformance/capability fixture, map content contract and QA template. Deliberate conditions include:

- absent XYZ attribution;
- untested WMS axis order;
- unbounded WFS response;
- WMTS zoom and timestamp limits;
- partial feature paging;
- COG CORS uncertainty;
- missing NIR and not-assessed status;
- non-fetchable `example.invalid` endpoints.

## Release decision

Chapter 9 is ready for automated validation and local review when lint, typecheck, content tests, production export and browser smoke tests pass. It must not be represented as a live public monitoring service; it teaches a professional delivery and acceptance method on safe deterministic evidence.
