# Module 3 Chapter 7 multi-lens review

Review date: 18 August 2026
Scope: Lessons 3.26–3.30, operational-workflow resource pack, cumulative notebook, runtime validators and learner-facing integration

## Decision

**Release Chapter 7 as the complete operational-workflow chapter. Keep the independent Environmental Monitoring Project capstone planned.**

Composite benchmark score: **4.89 / 5**

| Lens | Score | Evidence and remaining limit |
|---|---:|---|
| Remote-sensing science | 4.9 | Feature meaning, support, temporal comparability, applicability and predicted-change boundaries remain explicit. Synthetic fixtures cannot support a real coastal-meadow monitoring claim. |
| Machine learning | 4.9 | Model-serving schema, Earth Engine classifier modes, XGBoost boundary, drift and protected update evidence are accurate and bounded. A real package still needs model-specific golden predictions. |
| Geospatial engineering | 4.9 | Window invariance, grid identity, NoData and independent export QA are first-class acceptance gates. Learners must implement actual Rasterio/COG artifacts in the capstone. |
| Instructional design | 4.9 | Five lessons progress from inference mechanics to platform, architecture, monitoring and governance with cumulative professional artifacts. Workload is intentionally advanced. |
| Reproducibility and governance | 4.9 | Model card, manifests, runbook, rollback and retirement complete the lifecycle. Institutional approval and sensitive-data policy remain contextual. |
| Accessibility and UX | 4.8 | Every lesson has a text-described terracotta diagram, structured headings, formative checks and downloadable templates. Full browser smoke testing is required before publication. |

## Vertical lesson quality

- **3.26** converts the Prediction Evidence Package into fail-closed, window-invariant raster inference rather than a decorative `predict()` loop.
- **3.27** teaches current Earth Engine server-side objects, supported output modes, sampling support, independent validation and export without implying native XGBoost.
- **3.28** compares complete systems rather than algorithm brands and makes hybrid-interface costs visible.
- **3.29** distinguishes measurement change, covariate shift, concept drift and ecological change; every trigger has an action and owner.
- **3.30** packages model, schema, evidence, limitations and lifecycle controls and explicitly separates structural tests from scientific approval.

## Horizontal curriculum integrity

Chapter 7 consumes, rather than repeats, Module 2 grid/delivery skills and Module 3 target, validation, diagnostic, uncertainty and applicability artifacts. It completes the homepage promise of a modelling workflow that can be created and communicated. It does not claim the separate capstone is available.

The graduate-profile evidence is credible for three overlapping roles:

- **GIS / Remote Sensing Engineer:** schema-controlled raster inference, cloud/local interfaces, export QA and operational acceptance;
- **Geospatial Data Analyst:** architecture decisions, repeated evidence, drift diagnosis and bounded communication;
- **Remote Sensing Researcher:** target-support continuity, protected validation, uncertainty/applicability and refusal of causal/change overclaiming.

## Scientific limits retained at release

1. Chapter 7 training records are synthetic and cannot support real accuracy, interval coverage, trend or ecological monitoring conclusions.
2. Earth Engine is a managed service; supported classifiers, modes, quotas and export behaviour must be checked against current official documentation for a real project.
3. Drift indicators without new targets cannot establish concept drift.
4. A difference between predicted maps is not automatically observed ecological change.
5. A structurally complete model card is not scientific or organizational approval.

## Release recommendation

Publish Lessons 3.26–3.30 after type, lint, unit, build, manifest, SVG and browser checks pass. The next Module 3 work should be the independently assessed Environmental Monitoring Project capstone, not another conceptual chapter.
