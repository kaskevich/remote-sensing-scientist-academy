---
title: Interactive Mapping
lessonId: lesson-2-44
---

## 1. Make interaction answer a scientific question

### Learning outcome

By the end of this lesson, you will be able to define a map audience and primary question; build a lightweight Folium map from a reviewed public GeoJSON; design status styling, selection content, legend and provenance without colour-only meaning; provide an equivalent table and text summary; evaluate keyboard, touch, mobile, payload, attribution and failure behaviour; and issue an accessible map handover decision.

- **Lesson type:** Accessible interactive-map studio
- **Estimated time:** 190–240 minutes
- **Prerequisites:** GeoPandas, GeoJSON, web-delivery patterns and scientific visual communication
- **Portfolio output:** `environmental_monitoring_map.html`

### Why this matters

Interactivity can help a user inspect a location, compare layers and reveal supporting evidence without crowding a static figure. It can also hide essential information inside hover states, exclude keyboard users, overwhelm a phone, disclose sensitive attributes and encourage exploration without interpretation.

A professional map is not defined by the number of controls. It gives a specific audience an efficient path to a specific question. Every interaction should expose evidence, uncertainty, provenance or navigation that the task needs. If removing an animation or layer does not reduce understanding, it probably does not belong.

Maps are intrinsically visual and spatial, so perfect equivalence in text is not always possible. The response is not to abandon accessibility. Provide a meaningful accessible name and instructions, ensure controls can be reached, avoid colour-only status, preserve visible focus, and publish the same key records in a labelled table with a concise textual summary. The map then becomes one representation, not the only route to the information.

### Scientific context

The group has approved six generalized synthetic sites for a training map. Three meet the minimum seasonal evidence rule, one is conditional, one remains in review and one is not assessed. `median_nir` is a seasonal remote-sensing summary, not a habitat-condition class. Valid observation count and uncertainty note must remain visible.

You will create a compact map for programme managers using Folium, which converts Python objects into a Leaflet-based HTML document. MapLibre is introduced as an alternative for larger vector-tile applications, but the assessed work does not require JavaScript framework engineering. The design must remain portable, understandable and testable without a paid service.

## 2. One concept — interaction is evidence disclosure

### Concept

The single idea is: **an interaction is justified when it reveals evidence the audience needs to answer the declared question**.

Start with the question, then define the minimum interaction:

```text
Question
Which generalized sites have sufficient seasonal evidence?
        │
        ├── initial view: all six sites + status legend
        ├── select site: status, count, NIR, date, limitation
        ├── layer control: context on/off, status sites remain clear
        └── alternative: same records in table + written summary
```

Panning and zooming support spatial orientation. Selection reveals a site's evidence. A legend decodes symbols. A reset control may restore context. Animation, 3-D pitch and dozens of basemap choices do not help this question.

The information architecture should work before visual styling:

- a visible title states the scientific question;
- a short method note defines the status rule;
- the legend lists every status, including missing/not assessed;
- selection content uses labels, units, date and limitation;
- source, synthetic status, attribution and update remain outside popups;
- a table provides the same public records;
- a conclusion states what the map does not show.

[[CHECK:m2-l44-purpose]]

## 3. Select the public schema before mapping

Load the public GeoJSON and compare its properties with the allow-list in `map_content_contract.json`. The map should receive only:

- site ID and public name;
- evidence status;
- valid-observation count;
- seasonal NIR summary;
- uncertainty note;
- update date.

Precise plot coordinates, internal comments, personal identifiers, credentials and unreleased results must not be present in the delivered HTML. Folium embeds GeoJSON content in the HTML when local objects are used. A user can inspect it even if no popup shows a property.

GeoJSON under RFC 7946 uses longitude, latitude in WGS 84. A GeoDataFrame should be transformed to EPSG:4326 before export. Do not call `set_crs(4326)` on projected values. Validate bounds and sample positions after transformation.

Stable IDs are important for table-map reconciliation. The six feature IDs and table IDs must match exactly. Missing NIR remains missing and receives a textual status such as “not assessed”; it must never become `0.00` through formatting.

## 4. Visual hierarchy without false meaning

Use position, shape, border and text as well as colour. A possible restrained status system is:

- sufficient evidence — filled dark blue circle plus text label;
- conditional — orange diamond or distinct outlined symbol plus text;
- review — lime or yellow triangle plus text;
- not assessed — grey open circle plus text.

Folium's simplest GeoJSON style uses path colour and fill, but point-marker shape may require `point_to_layer` customisation or separate marker groups. For the first implementation, colour plus a clearly labelled tooltip, popup and legend is acceptable only when the alternative table and status text are present. Do not rely on green/red alone; common colour-vision differences and cultural meanings make it weak.

Map symbol area can imply quantity. Avoid changing marker radius by NIR unless the scientific question requires magnitude comparison and the legend explains the mapping. The current task is evidence status, so status should dominate.

Choose a basemap that supports, rather than competes with, the overlay. Verify terms and attribution. A neutral basemap can provide orientation, but it may require network access. The map must still show a useful message, title, table and provenance if tiles fail.

### Legends are data contracts

The legend needs exact class labels matching the data. It should not say “good”, “bad” or “healthy” because status describes evidence sufficiency, not ecological condition. Include “not assessed”. If counts determine status, state the threshold. Position the legend where it does not obscure map controls on a phone; allow it to wrap rather than shrink text.

## 5. Popups, tooltips and selection panels

A tooltip supports quick identification but cannot hold essential information because hover is unavailable on touch and difficult for keyboard users. A popup opened by click/tap can show more, but it is still transient. The accompanying table remains the stable alternative.

Selection content should follow a consistent order:

1. public site name and ID;
2. evidence status in text;
3. valid observations with denominator context;
4. median NIR with unitless notation and missing handling;
5. update date;
6. uncertainty note;
7. synthetic training statement.

Avoid injecting untrusted strings as raw HTML. Real applications must escape or safely render service-provided text to reduce cross-site scripting risk. A static training fixture is controlled, but the production habit should still be explicit.

## 6. Folium and MapLibre in professional context

**Folium** is effective when analysis is already in Python and the map can be a self-contained or lightly hosted HTML artifact. It supports GeoJSON layers, tooltips, popups, tile layers and layer controls. The result is convenient for a report or small handover, but accessibility and custom application behaviour need deliberate testing. Large embedded feature datasets make the HTML heavy.

**MapLibre GL JS** renders interactive maps with WebGL and is well suited to vector tiles, data-driven styling and application integration. It exposes keyboard navigation and controls, but an application developer still needs to create meaningful page structure, focus order, fallback content, security policy and data access. MapLibre is a mapping library, not automatic accessibility or governance.

Choose Folium here because six reviewed points and one compact deliverable fit it. Record the condition that would justify migration to a MapLibre application: larger vector-tile layers, frequent API updates, coordinated filters or more controlled application behaviour.

[[CHECK:m2-l44-accessibility]]

## 7. Worked example — map the reviewed public fields

### Predict before running

Predict which data are embedded in the saved HTML. If you omit a field from `GeoJsonTooltip`, does that remove it from the GeoJSON payload? What happens to the basemap if the user is offline?

```python
import folium
import geopandas as gpd

sites = gpd.read_file("inputs/monitoring_sites.geojson")
public = sites[["site_id", "site_name", "status",
                "valid_observations", "uncertainty_note", "geometry"]]
public = public.to_crs(4326)
view = folium.Map(location=[58.75, 24.15], zoom_start=8,
                  tiles="CartoDB positron")
folium.GeoJson(public, name="Evidence status",
    tooltip=folium.GeoJsonTooltip(
        fields=["site_name", "status", "valid_observations"],
        aliases=["Site", "Evidence status", "Valid observations"]
    )).add_to(view)
folium.LayerControl(collapsed=False).add_to(view)
view.save("outputs/environmental_monitoring_map.html")
```

### Code walkthrough

1. Folium creates the interactive Leaflet-based document.
2. GeoPandas reads the verified local fixture.
3. The column selection applies a public allow-list before the map receives data.
4. Geometry remains necessary for mapping; internal fields are excluded.
5. `to_crs(4326)` transforms verified source geometry for GeoJSON-compatible web display. It does not assign an unknown CRS.
6. The map starts at an overview suitable for the invented generalized sites.
7. The named basemap requires network access and attribution inherited through Folium; verify the final output.
8. `GeoJson` embeds the selected public features as an overlay.
9. The tooltip fields and aliases make three values readable, but they are not the complete accessible alternative.
10. An expanded layer control makes the overlay visible and understandable.
11. The saved HTML is a delivery artifact that must be inspected and tested.

The worked example is a structural start, not a finished professional map. Add reviewed status styling, a complete selection panel or popup, visible title/question, legend, method, synthetic statement, date, attribution, table and fallback. Reopen the HTML from a clean path and inspect the embedded data for forbidden fields.

## 8. Accessibility and responsive testing

Test the page—not only the map canvas—at 320, 375, tablet and desktop widths. At each size:

- title and primary question remain readable without horizontal scrolling;
- map height leaves room for the legend and selected-site information;
- touch controls are large enough to operate;
- the legend wraps without covering essential controls;
- focus is visible and follows a logical order;
- keyboard users can reach map controls or skip directly to the table;
- the map has an accessible name and concise instructions;
- status is available in text;
- no information depends only on hover;
- the data table can scroll within its own region if necessary without widening the whole page.

Provide a “Skip map and view site table” link before the map. Map interaction can trap arrow keys that users expect for page scrolling, so give clear instructions and an exit path. Avoid auto-moving the map. Respect reduced-motion preferences if animations are added.

The table should use a caption, header cells and the same six records. Include a text summary such as “Three sites meet the evidence rule, one is conditional, one requires review and one was not assessed.” That summary conveys the central result without requiring spatial perception.

## 9. Performance and failure design

Measure the HTML file and embedded GeoJSON size. Record initial network requests, transferred bytes and render time under a realistic connection if browser tooling is available. Six points should be small; this is a baseline, not proof that the same design scales to a regional polygon layer.

Test failures:

- block network access so basemap tiles fail;
- simulate missing `median_nir`;
- remove one optional layer;
- open at a narrow viewport;
- follow the page using keyboard only;
- compare map and table IDs;
- check that the page still communicates the primary result.

A basemap failure should not remove monitoring evidence, provenance or the table. A failed overlay should create a visible error rather than an empty map that appears to mean “no sites”.

## 10. Common mistakes and recovery

### Mistake 1 — beginning with visual effects

Map libraries make markers and plugins immediately rewarding.

**Recognise it:** the map has animation, clusters or many basemaps but no clear question.

**Recover:** write the audience, question and required evidence before selecting interactions.

### Mistake 2 — colour-only status

Colour creates a compact visual distinction.

**Recognise it:** removing colour makes categories indistinguishable.

**Recover:** add text labels, distinct outlines/shapes where possible, and an equivalent table.

### Mistake 3 — essential information only on hover

Tooltips keep the map uncluttered.

**Recognise it:** touch and keyboard users cannot discover the status.

**Recover:** provide click/tap selection, persistent summary and table; treat hover as enhancement.

### Mistake 4 — hidden fields remain embedded

The tooltip displays only approved fields.

**Recognise it:** saved HTML contains internal properties.

**Recover:** apply the allow-list to the data object before creating the map and inspect the final artifact.

### Mistake 5 — missing values become zero

Formatting numeric fields can coerce blanks.

**Recognise it:** not-assessed sites display `0.00` NIR.

**Recover:** preserve missingness and display “Not available” with its reason.

### Mistake 6 — location and precision overclaim

Many decimal places appear scientific.

**Recognise it:** generalized training points are shown with survey-like precision.

**Recover:** state generalization, reduce displayed precision and never provide coordinates beyond the public need.

### Mistake 7 — map fills the phone screen

Large maps feel immersive.

**Recognise it:** users cannot reach title, legend, method or table without fighting the map.

**Recover:** constrain map height, preserve page scrolling and put the question and alternative first.

### Mistake 8 — assuming library defaults satisfy accessibility

Controls work with a mouse, creating confidence.

**Recognise it:** focus is invisible, order is confusing or screen-reader text is absent.

**Recover:** test the final document with keyboard, browser accessibility tools and representative users; provide fallback content.

[[CHECK:m2-l44-handover]]

## 11. Guided practice — build the accessible monitoring map

1. Verify the Chapter 9 inputs and reconcile six GeoJSON IDs with six table IDs.
2. Read `map_content_contract.json` and copy its public allow-list into the notebook as an assertion.
3. Load the GeoJSON, confirm EPSG:4326/CRS84-compatible coordinate order, geometry type, bounds and missing fields.
4. Create a status count table and one-sentence result before building the map.
5. Build the two-layer Folium map: neutral context and monitoring sites.
6. Add restrained status styling with a text legend containing all four categories.
7. Add selection content with name, text status, valid count, median NIR or “Not available”, date and limitation.
8. Add a visible title, scientific question, status rule, synthetic statement, source, licence, attribution and update date outside popups.
9. Add a skip link and an HTML table equivalent to `monitoring_summary.csv` with caption and headers.
10. Inspect the final HTML text for forbidden fields and credential-like strings.
11. Test network failure, missing values, keyboard flow and widths of 320, 375, 768 and desktop. Record results in the QA template.
12. Save `environmental_monitoring_map.html`, `monitoring_map_summary.html` and the source notebook.

## 12. Independent challenge — redesign for 50,000 features

Assume the public programme expands to 50,000 generalized management polygons updated weekly. Do not implement the full application. Produce a migration design comparing embedded GeoJSON, bounded OGC API Features and vector tiles rendered by MapLibre.

Specify public schema, simplification by zoom, tile/property privacy, filter strategy, cache invalidation, data timestamp, loading/failure states, keyboard and table alternative. Identify which six-site behaviours must remain unchanged. Set measurable thresholds for payload, first useful render and feature query.

Explain why a vector tile is a display derivative rather than the source record, and how an analyst retrieves authoritative features when permitted.

## 13. Scientific interpretation

### Scientific interpretation

The map communicates evidence sufficiency, not ecological status. Three synthetic sites pass a minimum valid-observation rule, but their median NIR values do not establish biomass, conservation condition or trend. The conditional and review categories are results, not visual inconveniences. “Not assessed” means the evidence contract was not met, not that the measured phenomenon was zero.

Generalized positions support regional orientation while intentionally limiting site-level inference. The accessible table preserves the same public evidence without map interaction. A strong handover makes those distinctions visible on first use, not buried in a technical README.

## 14. Reflection, submission and portfolio artifact

### Reflection

1. Which interaction most directly supports the declared programme-manager question?
2. What information remains inaccessible if only the map canvas is published?
3. Which fields should never reach the browser, even if hidden from popups?
4. What would trigger migration from Folium to a MapLibre/vector-tile application?

### Submission

Submit:

- `environmental_monitoring_map.html` and the notebook or script that creates it;
- `monitoring_map_summary.html` or equivalent accessible table and text summary;
- `public_schema_audit.csv` and map–table ID reconciliation;
- `map_accessibility_test.md` covering keyboard, touch, 320, 375, tablet and desktop;
- `map_performance_and_failure_log.csv`;
- a completed Web GIS QA record;
- a 300–450 word scientific interpretation that separates evidence status, NIR and ecological condition.

Open the exported HTML from a clean relative path before submission. Confirm that no forbidden field, precise real location, credential or unsupported real-world claim is present.

### Portfolio artifact

Add `environmental_monitoring_map.html` to **Artifact 2.I — Accessible Web GIS Evidence Delivery**. It is the audience-facing product paired with a text/table alternative and evidence record. The final chapter lesson will test whether its delivery components can interoperate across professional geospatial systems.
