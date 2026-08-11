# Chapter 9 — Web GIS and Delivery

This compact training pack supports Lessons 2.43–2.45 and the Chapter 9 practicum. It is designed for deterministic work on an ordinary laptop. Learners do not need a paid basemap, hosted GIS account or public server to complete the assessed work.

## Scientific status

Every site, coordinate, service endpoint and monitoring value in this directory is **synthetic training evidence**. Site positions are invented and deliberately generalized. They are not published Baltic coastal-meadow locations and must not be described as such.

The continuing scientific context is a research group preparing a public-facing monitoring map from the reviewed outputs of Chapter 8. The group must decide what to show, what to withhold, which delivery mechanism fits each information need and how to preserve a non-map alternative.

## Files

- `monitoring_sites.geojson` — six generalized synthetic sites in RFC 7946 longitude/latitude order;
- `monitoring_summary.csv` — the same public attributes in an accessible tabular form;
- `service_capability_inventory.csv` — deliberately mixed service and delivery claims for architectural review;
- `tile_request_scenarios.csv` — common user actions and their expected requests, payloads and failure risks;
- `interoperability_fixture.json` — deterministic service-capability and OGC API conformance evidence;
- `map_content_contract.json` — audience, question, layer, privacy, legend and alternative-content requirements;
- `WEB_GIS_DELIVERY_QA_TEMPLATE.md` — reusable map, service and release review template;
- `manifest.json` — size, SHA-256 checksum, licence and data-status evidence.

## Required handling

1. Preserve all supplied files unchanged under `inputs/`.
2. Verify checksums before analysis.
3. Record the browser, Python, Folium or MapLibre version actually used.
4. Keep authoritative data, delivery representation and presentation style distinct.
5. Never send sensitive attributes or precise locations to a browser and then merely hide them with styling.
6. Treat WMS images, vector features, coverage values and tiles as different representations.
7. Inspect service version, capabilities or conformance, CRS, axis order, formats, limits, paging, licence and authentication.
8. Test the map at keyboard and touch sizes and provide an equivalent table and text summary.
9. Record data timestamp, processing status, valid-observation count and limitations in the delivery.
10. Never commit credentials, API keys, cookies or signed URLs.

## Licence

The synthetic training fixtures in this directory are released under CC0-1.0. External standards, libraries and basemaps retain their own terms and attribution requirements.
