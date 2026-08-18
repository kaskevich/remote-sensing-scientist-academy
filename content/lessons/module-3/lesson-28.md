## 1. Problem — platform choice changes the evidence you can preserve

### Learning outcome

By the end of this lesson, you will be able to compare local Python/XGBoost, native Google Earth Engine modelling and hybrid architectures across algorithm control, spatial validation, archive scale, data locality, reproducibility, interpretability, tuning, export and operational burden; convert project requirements into a reviewable architecture decision; reject false either-or choices; and defend an implementation that preserves the Environmental Monitoring Project's scientific claim.

- **Lesson type:** Modelling Architecture Decision Studio
- **Estimated time:** 230–320 minutes
- **Prerequisites:** Lessons 3.8–3.27, especially structured validation, interpretation, applicability, uncertainty, raster inference and the Earth Engine component
- **Portfolio outputs:** `ARCHITECTURE_DECISION.md`, requirements matrix, hybrid data-flow diagram, risk register and the Lesson 3.28 notebook checkpoint

### Why this matters

“Should we use Earth Engine or Python?” sounds like a software preference. It is actually a systems question. One project may require a custom XGBoost objective and nested spatial validation. Another may need annual processing of a national Sentinel archive. A third may contain restricted field locations that cannot be uploaded to a public cloud project. The correct architecture follows the scientific and operational requirements.

Choosing a fashionable platform first encourages teams to weaken validation, change algorithms or move data without documenting why. Choosing local computing for everything can create a different failure: downloads and storage become unmanageable, provenance fragments, and an archive-scale workflow cannot be repeated reliably.

> **Core lesson:** select the smallest architecture that preserves the claim, evidence, data governance and repeatable operation.

### Mental model

```text
requirements → non-negotiable scientific controls → feasible architectures
                                                  ↓
          local Python        Earth Engine        hybrid
                \                 |                 /
                 evidence, risk, cost and operations comparison
                                  ↓
                 documented decision + review triggers
```

The architecture decision is provisional. It should name the conditions that would cause the team to revisit it.

## 2. Scientific context — one project, several plausible systems

The Environmental Monitoring Project has a target contract, ordered predictors, spatial and temporal folds, a fixed XGBoost candidate, diagnostic evidence, interval procedure, applicability rule and aligned prediction package. Chapter 7 now needs a repeatable operational pathway.

Some predictor construction may benefit from Earth Engine's archive access. The chosen XGBoost model and custom validation are most transparent in the controlled Python environment. Spatial inference may occur locally against Cloud Optimized GeoTIFFs, while Earth Engine may prepare seasonal Sentinel composites. That division is neither automatically good nor bad. It becomes defensible when interfaces are explicit and verified.

The Chapter 7 scenarios are decision exercises. They do not estimate actual computing cost, legal suitability or real coastal-meadow performance. Check institutional policy, data licences, service quotas and current platform documentation for a real deployment.

## 3. Concept — architecture is a chain of responsibilities

An architecture assigns each workflow responsibility to an environment:

- asset discovery and access;
- radiometric and quality preprocessing;
- temporal compositing;
- target and feature joining;
- spatial/temporal fold construction;
- model selection and fitting;
- protected evaluation;
- interpretation and uncertainty analysis;
- wall-to-wall prediction;
- export and spatial QA;
- scheduled repetition, logging and review;
- storage, access control and archival preservation.

The interfaces between responsibilities are as important as the components. A hybrid workflow can fail when an Earth Engine export changes band order, scale, mask or projection before local XGBoost inference. A local workflow can fail when manually downloaded scenes do not preserve catalogue IDs or processing baselines. A native Earth Engine workflow can fail when convenient random sampling replaces the required spatial folds.

### Three candidate patterns

**Local Python + XGBoost:** data are available as controlled local/object-store files; preprocessing, folds, model and inference run in versioned Python. This offers fine algorithm, validation and interpretability control, but the team owns compute, storage, orchestration and archive access.

**Native Earth Engine modelling:** catalogue assets, feature construction, sampling, a supported `ee.Classifier`, prediction and export stay largely in Earth Engine. This is strong for archive-scale preprocessing and supported algorithms, but custom local packages and XGBoost are not native, and external reproducibility requires careful script, asset and export records.

**Hybrid:** Earth Engine prepares or exports a frozen predictor stack or modelling table; Python performs XGBoost fitting, structured validation, diagnostics and possibly inference; versioned products move across a checked interface. This can preserve the strengths of both, but adds transfer, schema and operational boundaries.

[[CHECK:m3-l28-hybrid]]

## 4. Visual explanation

![Decision diagram comparing local Python, native Earth Engine and hybrid modelling workflows through evidence-control, scale, interface and operational gates.](lesson-media/images/local-vs-earth-engine-architecture.svg)

The centre gate asks whether every transition preserves feature meaning, observation identity, fold assignment and grid geometry. “Hybrid” is not a compromise label; it is a design with additional interfaces that require tests.

## 5. Compare the architectures across professional criteria

### Model and algorithm control

Local Python supports XGBoost's documented objectives, callbacks, early stopping, feature handling and saved model formats. It also supports scikit-learn pipelines and custom diagnostics. Earth Engine provides a bounded set of server-side classifiers and modes. If the scientific design requires XGBoost specifically, native Earth Engine modelling does not satisfy that requirement.

Do not confuse algorithm preference with a scientific requirement. If a supported Earth Engine Random Forest meets the predeclared claim and evidence thresholds, choosing it can reduce system complexity. The decision record should say whether the algorithm is fixed by evidence, comparability or operational constraint.

[[CHECK:m3-l28-architecture]]

### Validation flexibility

Python makes nested grouped folds, buffered splits, temporal ordering and custom assessment records straightforward to inspect and test. Earth Engine can encode spatial groups and evaluate held-out features, but complex fold orchestration and preservation of every candidate result may require more explicit engineering. The relevant question is not “Can the platform split data?” It is “Can this team implement and audit the exact validation claim without leakage?”

### Archive access and spatial scale

Earth Engine is designed to process its data catalogue server-side. National and multi-year composites can avoid large local downloads. Local workflows can scale through cloud object storage, Dask or batch compute, but the team must build and govern that system. For 120 field plots and small UAV rasters, archive-scale infrastructure may not be the limiting problem.

### Data locality and governance

Local processing can keep restricted field coordinates inside an institutional environment. Earth Engine asset permissions can control access, but uploading sensitive data requires policy and legal review. A privacy-preserving hybrid might upload generalized regions or export imagery, keeping exact field supports local. Never solve governance by deleting provenance or pretending coordinates are harmless.

### Reproducibility

A local lockfile, model artifact, input checksums and container can preserve an executable environment. It still fails if source assets are not archived or paths are machine-specific. Earth Engine scripts preserve computation descriptions and asset IDs, while managed catalogue assets or algorithms may evolve. Durable reproduction therefore needs exported evidence, script commits, parameter records, task IDs and acquisition identities in either system.

### Interpretation, tuning and uncertainty

The Module 3 XGBoost interpretation and uncertainty methods live naturally in Python. Native Earth Engine supplies different classifier outputs and may require exported assessment tables for calibration, interval or SHAP analysis. Do not claim that one environment's diagnostic automatically transfers to another algorithm.

### Operational complexity

Local systems own scheduling, retries, credentials, dependency updates, storage and monitoring. Earth Engine owns much infrastructure but retains quotas, task states, asset permissions and service/API changes. Hybrid systems own both component behaviours plus interface checks. Count the people and procedures required to operate the system, not only the lines of modelling code.

## 6. Worked example — score requirements without allowing the score to decide

```python
requirements = {
    "requires_xgboost": True,
    "custom_nested_spatial_cv": True,
    "archive_scale_processing": True,
    "restricted_field_coordinates": True,
    "annual_repeat": True,
}
architecture_fit = {
    "local": {"requires_xgboost", "custom_nested_spatial_cv",
              "restricted_field_coordinates"},
    "earth_engine": {"archive_scale_processing", "annual_repeat"},
    "hybrid": set(requirements),
}
scores = {name: sum(key in fit for key in requirements)
          for name, fit in architecture_fit.items()}
print(scores)
print("Decision requires risk review, not score alone")
```

### Predict before running

1. Which architecture receives the largest illustrative score?
2. Does that prove it is the correct architecture?
3. Which requirement could prohibit transfer of exact field coordinates?
4. What interface risk is absent from the simple score?

Run the cell. Hybrid scores five, local three and Earth Engine two. These values reflect the sets we entered; they are not empirical platform benchmarks. A legal prohibition, unavailable skill, unaffordable workflow or untestable interface can veto the highest score.

### Code walkthrough

1. `requirements` records five project needs as named Booleans.
2. The architecture map lists capabilities in deliberately simplified sets.
3. The local set preserves XGBoost, custom validation and restricted coordinates.
4. The Earth Engine set represents archive processing and repeatable server tasks.
5. Hybrid is shown as potentially satisfying all needs.
6. The comprehension counts matching names.
7. The final print prevents the arithmetic from masquerading as a decision rule.

A stronger decision record assigns weights, evidence links, risks, mitigations and vetoes. It does not turn subjective entries into false precision.

[[CHECK:m3-l28-evidence]]

## 7. Apply the matrix to four scenarios

### Scenario A — 120 field plots plus UAV predictors

The data volume is moderate; custom spatial validation and image-to-plot support are central. A local Python workflow is usually plausible because the UAV rasters are already project products and XGBoost diagnostics matter. Earth Engine offers little advantage if the imagery is not hosted there. A hybrid may still add Sentinel context, but interface complexity must earn its place.

### Scenario B — national Sentinel habitat classification

Archive filtering, compositing and wall-to-wall inference are substantial. If a supported Earth Engine classifier meets the claim and validation can be preserved, native Earth Engine may be efficient. If custom XGBoost or independent probability calibration is required, export a frozen feature stack or sampling table and use a hybrid. Field sampling design and protected regions remain decisive.

### Scenario C — annual monitoring

The system must repeat identical predictor semantics, record each run, detect drift and support review triggers. Earth Engine can schedule or simplify archive-side feature construction, while a local registry can govern model versions and evidence. The best choice depends on where the operational team can monitor failures and retain artifacts over years.

### Scenario D — experimental XGBoost study

The purpose is controlled comparison of objectives, tuning and explanations on bounded data. Local Python offers the most direct experimental control. Introducing cloud export may add variability without solving a scale problem. Revisit the architecture if the experiment graduates to regional operation.

## 8. Build a decision record rather than a feature checklist

Your `ARCHITECTURE_DECISION.md` should include:

1. decision and status;
2. date, owner and reviewers;
3. scientific claim and operational destination;
4. non-negotiable requirements;
5. constraints and data-governance rules;
6. considered architectures;
7. evidence for each comparison;
8. chosen responsibility allocation;
9. data and metadata crossing each interface;
10. failure modes and mitigations;
11. cost/skill/maintenance assumptions;
12. acceptance tests;
13. unsupported uses;
14. review triggers and sunset/replacement conditions.

Write “unknown” where evidence is missing. A visible unknown is safer than an invented cost or capability claim.

## 9. Diagnostic check — trace one record end to end

Take one synthetic observation and one prediction cell. Trace them through the proposed architecture:

- source asset and acquisition identity;
- masking and composite rule;
- predictor values and ordered schema;
- target join and spatial support;
- fold assignment and model version;
- prediction, interval and applicability values;
- export grid and release state;
- run ID and checksum.

At each boundary, write the automated check and human review. If you cannot reconstruct the trace without opening an undocumented interactive session, the architecture is not yet reviewable.

Then simulate three failures: a changed Sentinel processing baseline, swapped band order and expired export credential. State which component detects each, whether the run stops, and what an operator sees.

## 10. Common mistakes

### Choosing by tool familiarity

**Why beginners make it:** known tools feel less risky. **Recognition:** the record begins “we always use…” without requirements. **Fix:** write non-negotiable claim and evidence controls first.

### Treating hybrid as automatically best

**Why:** it appears to combine every advantage. **Recognition:** no interface contract or owner exists. **Fix:** count transfers, permissions, schemas, retries and duplicated skills; select hybrid only when benefits exceed these costs.

### Comparing algorithms instead of systems

**Why:** model accuracy is visible. **Recognition:** storage, export, monitoring and governance rows are absent. **Fix:** compare the complete evidence lifecycle.

### Inventing exact cost claims

**Why:** decisions seem stronger with numbers. **Recognition:** prices, quotas or labour estimates lack date and source. **Fix:** measure a bounded prototype and record assumptions; revisit changing service conditions.

### Ignoring exit and portability

**Why:** the first successful run dominates attention. **Recognition:** no export, archive or replacement plan. **Fix:** specify durable artifacts and the process for reconstructing the pipeline elsewhere.

### Moving sensitive data by convenience

**Why:** cloud upload simplifies joins. **Recognition:** no data-classification or permission decision. **Fix:** follow institutional policy and redesign data flow before transfer.

## 11. Guided practice — decide for the Environmental Monitoring Project

1. Open `ARCHITECTURE_DECISION_TEMPLATE.md`.
2. Copy the frozen claim from Chapter 1.
3. Mark XGBoost, spatial validation, uncertainty, applicability and repeated monitoring as required or negotiable.
4. Record predictor volume, archive dependency, field-data sensitivity and update frequency.
5. Compare local, Earth Engine and hybrid across ten criteria.
6. Link every platform claim to documentation or a bounded test.
7. Draw the chosen components and interfaces.
8. Define schema, checksum, identity and grid tests at transfers.
9. Assign an owner and failure state to each component.
10. Name three review triggers.
11. Trace one synthetic record through the design.
12. Record why the rejected alternatives were not chosen now.

The likely course architecture is hybrid, but your record must justify it. A well-supported local decision is stronger than an unexamined hybrid diagram.

## 12. Independent challenge — conduct an architecture review

Write three one-page proposals for the four scenarios above, allowing one proposal to cover two related scenarios. Each proposal must specify the scientific claim, dominant scale, protected validation, chosen algorithm, data location, responsibility allocation, export artifacts, operator workflow, primary failure and review trigger.

Then act as a reviewer. Identify one hidden assumption in each proposal and issue a verdict: accept, revise or reject. Finish with a 300-word synthesis explaining which elements can be shared across systems and which must remain project-specific.

## 13. Scientific interpretation

Architecture quality cannot rescue weak training evidence, but architecture can destroy strong evidence. A platform transition that changes temporal composites, feature order or masks changes the fitted relationship. A scheduled run without drift checks repeats computation, not necessarily valid monitoring. A scalable classifier without spatial validation produces more predictions, not stronger generalisation evidence.

The chosen architecture therefore supports a bounded claim: it preserves a declared model-and-evidence package across the represented domain and operational frequency. It does not prove that the platform, algorithm or workflow is universally superior.

## 14. Submission

Submit:

- completed `ARCHITECTURE_DECISION.md` and scored requirements matrix;
- one system diagram identifying local, Earth Engine and interface responsibilities;
- an end-to-end record trace;
- a risk register with owner, detection, mitigation and review trigger;
- three alternative-scenario decisions;
- the Lesson 3.28 notebook checkpoint;
- a 350–500 word justification explaining why the chosen architecture preserves the claim better than the rejected alternatives.

Redact credentials and restricted locations. Do not submit a platform logo or feature list as an architecture decision.

## 15. Portfolio artifact

**Artifact 28 — Model Architecture Decision Record**

This artifact connects modelling expertise with systems judgement. It shows that you can select local, cloud or hybrid responsibilities from evidence needs, protect interfaces and explain when the decision must change.

## 16. Reflection

1. Which requirement is a veto rather than a weighted preference?
2. Where does a hybrid workflow create training-serving skew risk?
3. What must be archived to reproduce a managed-cloud result?
4. Which architecture is simplest for the 120-plot UAV scenario, and why?
5. What event should reopen your decision?

## 17. Core references

- [Google Earth Engine supervised classification guide](https://developers.google.com/earth-engine/guides/classification)
- [XGBoost 3.3 Python API](https://xgboost.readthedocs.io/en/stable/python/python_api.html)
- [The Turing Way — reproducible environments](https://book.the-turing-way.org/reproducible-research/renv)

### Further advanced reading

- [Google Earth Engine client versus server](https://developers.google.com/earth-engine/guides/client_server)
- [scikit-learn common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html)
- [C4 model for visualising software architecture](https://c4model.com/)

## 18. Tested software versions

The local reference environment uses Python 3.12.13, scikit-learn 1.9.0 and XGBoost 3.3.0. Earth Engine is a managed service; verify current classifier modes, quotas, exports and organizational policy at implementation time. The illustrative scores are teaching data, not measured performance, prices or service guarantees.
