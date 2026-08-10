---
title: Accept, Review or Reject?
lessonId: module-2-chapter-1-practicum
---

## Chapter 1 Practicum — Accept, Review or Reject?

### Professional outcome

By the end of this practicum, you will be able to make a traceable geospatial data-acceptance decision from incomplete evidence. You will deliver `DATA_ACCEPTANCE_DECISION.md`, the first formal gate in your UAV and Satellite Analysis Pipeline.

This practicum integrates Lessons 2.1–2.4. It is not a new software tutorial. Work as the scientist responsible for deciding what may enter an analysis.

## 1. The handover

The Baltic coastal-meadow team receives six assets:

| Asset | Evidence received | Deliberate problem |
|---|---|---|
| A — management zones | polygon GeoPackage, EPSG:3301, producer note | accuracy not independently checked |
| B — UAV reflectance | referenced raster dimensions, transform and CRS | band names, units and calibration absent |
| C — plot candidates | CSV with `x` and `y` columns | CRS, axes and units absent |
| D — habitat map | 5 cm output pixels | control-point review indicates poor positional accuracy |
| E — satellite scene | product metadata and valid CRS | acquisition is six weeks later than field sampling |
| F — legacy boundary | Shapefile components | incomplete provenance and truncated field descriptions |

All files open successfully. That establishes only that software can parse them.

## 2. Use one decision rule

For a clearly stated intended use, assign one status:

- **Accept for stated use:** evidence supports the proposed operation, with limitations recorded
- **Review before use:** missing evidence could change the result and has a feasible owner or verification action
- **Reject for stated use:** a blocking risk cannot be resolved within the project, or the asset cannot support the proposed inference

A status applies to a use, not to a file forever. A layer rejected for 5 cm plot extraction might still be acceptable for a regional orientation map.

[[CHECK:m2-p1-evidence]]

## 3. Build the evidence matrix

Create one row per asset with these columns:

| Required field | Question |
|---|---|
| spatial model | What does one row, feature or cell represent? |
| CRS | Are reference system, axes and units verified? |
| support | What physical space contributes to one value? |
| accuracy and precision | What evidence describes closeness and repeatability? |
| resolution | What detail or sampling interval is represented? |
| temporal support | When, and over what interval, was the observation made? |
| provenance | Who produced it, from what source and process? |
| format | Does the format preserve the required structure and metadata? |
| remaining uncertainty | What claim remains unsupported? |
| decision | Accept, review or reject for the stated use? |
| next action and owner | What happens next, and who can resolve it? |

Do not turn absence into a negative fact. “No accuracy statement supplied” is evidence; “the layer is inaccurate” is a conclusion that requires evidence.

[[CHECK:m2-p1-risk]]

## 4. Predict before deciding

Before completing the matrix, predict which two assets are most likely to be rejected for **plot-level field–imagery comparison**. Then test that prediction against every evidence field. If your decision changes, document why. Changing a prediction in response to better evidence is good scientific practice.

## 5. Independent decision

Write `DATA_ACCEPTANCE_DECISION.md` with:

1. the intended analysis and its required spatial and temporal support
2. a six-row decision table
3. the blocking evidence for every review or rejection
4. one named owner and next action for each review
5. one short paragraph explaining why “opens successfully” is not an acceptance criterion

Keep the narrative to **250–350 words maximum**, excluding the table. A concise decision is more useful than repeated definitions.

[[CHECK:m2-p1-reject]]

### Scientific interpretation

Acceptance means the available evidence is adequate for one declared use. It does not certify universal accuracy or ecological truth. Review means uncertainty is material but potentially resolvable. Rejection protects the analysis from a known blocking risk; it is not a punishment for imperfect data.

### Reflection

1. Which asset looked strongest before you separated resolution from accuracy?
2. Which missing field most directly blocks field–image comparison?
3. How did temporal support alter a technically valid spatial decision?
4. What new evidence could change one rejection into acceptance?

### Submission

- **Decision record:** `DATA_ACCEPTANCE_DECISION.md`
- **Evidence:** the completed matrix with sources and access dates
- **Screenshot:** one view showing decisions, risks and owners
- **Written answer:** the required 250–350-word decision narrative

### Portfolio artifact

**Artifact 2.A — Geospatial data acceptance decision**

Place this decision gate before all processing stages in the UAV and Satellite Analysis Pipeline. Future assets should pass through the same evidence structure.
