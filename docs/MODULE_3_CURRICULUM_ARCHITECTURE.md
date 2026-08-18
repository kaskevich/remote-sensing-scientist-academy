# Module 3 curriculum architecture

## Module identity

- **Title:** Remote Sensing Modelling
- **Professional question:** How can Earth Observation measurements support predictions that remain scientifically defensible across new observations, locations or times?
- **Capstone:** Environmental Monitoring Project
- **Length:** 30 lessons in seven chapters, followed by one integrated capstone
- **Visual accent:** terracotta (`#A35F47`) with secondary (`#B97358`) and tint (`#F6ECE8`)

The module is not a catalogue of algorithms. It follows one evidence chain:

> decision → claim → target → prediction unit → predictor contract → modelling observations → baseline → candidate model → validation → diagnosis → uncertainty → applicability → operational monitoring

Every new technique must strengthen one link in that chain. A higher score alone is not a sufficient reason to add complexity.

## Seven-chapter sequence

| Chapter | Lessons | Central decision | Cumulative artifact |
|---|---:|---|---|
| 1. Frame the Prediction Problem | 3.1–3.4 | What exactly is predicted, from what evidence, for which unit and domain? | Frozen Prediction Contract and Model Experiment Plan |
| 2. Establish the Baseline | 3.5–3.8 | Does a tree-ensemble candidate improve on a meaningful simple rule? | First Defensible XGBoost Candidate |
| 3. Validate Spatial Models Properly | 3.9–3.12 | Which withheld evidence represents the intended transfer claim? | Structured Validation Design |
| 4. Optimise Without Fooling Yourself | 3.13–3.16 | How can model choices improve without contaminating assessment? | Controlled Model Selection Record |
| 5. Evaluate, Diagnose and Understand | 3.17–3.21 | Where, when and for whom does the model fail or extrapolate? | Model Diagnostic and Applicability Package |
| 6. Quantify Prediction Uncertainty | 3.22–3.25 | How uncertain is each prediction, and is observed coverage adequate? | Prediction Evidence Package |
| 7. From Model to Operational EO Workflow | 3.26–3.30 | Can a fixed, versioned model run repeatedly without semantic drift? | Operational Monitoring Pipeline and Model Card |

## Current release scope

All seven chapters and the independent Environmental Monitoring Project capstone are implemented in full. Lessons 3.1–3.30 and the capstone are available. The release includes:

- thirty publishable lessons with theory, guided practice, model clinics, independent work and assessment;
- one continuous `Environmental_Monitoring_Project_Starter.ipynb`;
- downloadable target, predictor, data-dictionary, experiment-plan, baseline-report, parameter-decision and model-metadata templates;
- a deliberately imperfect modelling-table fixture plus checksum-verified synthetic Chapter 2–7 training packs;
- thirty explanatory SVG diagrams with text alternatives in lesson content;
- runtime validators for the Chapter 1 contracts, baseline metrics, regression stumps, boosting updates, model metadata, grouped folds, temporal folds, nested evidence roles, optimisation protocols, learning dynamics, feature stability, decision thresholds, interval diagnostics, finite-sample conformal quantiles, evidence-layer release states, operational feature schemas, inference windows, architecture requirements, monitoring gates and model-card structure;
- an explicit prerequisite/novelty map that prevents repetition of Modules 1–2.

## Pedagogical pattern

Every full lesson follows the same learning rhythm:

1. establish the scientific decision and measurable outcome;
2. retrieve only the necessary prior knowledge;
3. introduce one primary modelling concept with precise vocabulary;
4. inspect a visual model of the concept;
5. predict a result before running concise code;
6. walk through the code and interpret the output scientifically;
7. diagnose a realistic failure in a model clinic;
8. complete guided practice and an independent challenge;
9. submit a cumulative artifact against a four-part rubric;
10. record limitations, reflection and next-step dependencies.

Formative checks cover concept, application and claim boundary. Completion controls, notes, uploads, submissions, private instructor feedback and optional discussion use the Academy’s existing learner system.

## Evidence standards

- **Data identity:** real and synthetic records must never be blended silently.
- **Target integrity:** units, observation protocol, spatial/temporal support and valid range are explicit or marked unresolved.
- **Feature integrity:** every predictor has a source, transformation, support, rationale, limitation and inference-time availability status.
- **Evaluation integrity:** final-test evidence cannot influence feature choice, tuning, thresholding or model selection.
- **Spatial integrity:** grouped, spatial or temporal structure is retained in the modelling table and later validation design.
- **Communication integrity:** performance is bounded to represented domains; association and variable importance are not described as causal effects.

## Implementation phases

1. **Released:** architecture, capstone brief and Chapter 1 (3.1–3.4).
2. **Released:** Chapter 2 (3.5–3.8), from baseline controls through the first serialized XGBoost candidate.
3. **Released:** Chapter 3 (3.9–3.12), with structured spatial, grouped, temporal and nested validation.
4. **Released:** Chapter 4 (3.13–3.16), with controlled optimisation, learning dynamics, feature stability and decision thresholds.
5. **Released:** Chapter 5 (3.17–3.21), with regression and classification evidence, probability quality, structured failure, interpretation boundaries and a Domain of Applicability map.
6. **Released:** Chapter 6 (3.22–3.25), with uncertainty-source reasoning, quantile intervals, split-conformal coverage and aligned prediction evidence maps.
7. **Released in this chapter update:** Chapter 7 (3.26–3.30), with fail-closed raster inference, a bounded Earth Engine component, architecture selection, repeated-prediction drift gates and a versioned operational model package.
8. **Released:** the independent Environmental Monitoring Project capstone, cross-module integrity audit, browser accessibility QA and final scientific review.
