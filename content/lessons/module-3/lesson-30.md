## 1. Problem — a model file is not an operational scientific product

### Learning outcome

By the end of this lesson, you will be able to assemble a versioned operational model package; write a model card that connects target, training domain, validation, uncertainty, applicability, intended use and limitations; define reproducibility and acceptance gates; record software, data and run provenance; specify update, rollback and retirement policies; and conduct a release review that can refuse publication when evidence is incomplete.

- **Lesson type:** Operational Model Package Signature Laboratory
- **Estimated time:** 270–370 minutes
- **Prerequisites:** All Module 3 lessons, with Module 2 reproducible delivery, raster QA and capstone handover skills
- **Portfolio outputs:** `MODEL_CARD.md`, dataset/training summary, versioned operational package inventory, acceptance-test report, update policy and Chapter 7 handover

### Why this matters

Six months after model fitting, a serialized file such as `model.json` cannot answer the questions a reviewer or operator needs. What target did it predict? Which units and support? Which feature order? Which sites and dates trained it? How was spatial transfer tested? Where should predictions be withheld? Which software version loads it? What should happen when monitoring fails?

Without these answers, the model is not reproducible, governable or safe to operate. A model card is not promotional documentation. It is a concise evidence map that helps users decide whether a model is appropriate for a particular use and directs them to the underlying records.

> **Core lesson:** an operational model is the versioned combination of executable artifact, data/schema provenance, evaluation evidence, limitations, acceptance tests and accountable update policy.

### Mental model

```text
frozen model + feature schema + training summary + protected evaluation
          + uncertainty/applicability + inference code + runbook
                              ↓
                structural and scientific release gates
                              ↓
           versioned package + MODEL_CARD.md + checksums
                              ↓
             operate → monitor → review → update/rollback/retire
```

The package is ready only when another qualified person can review the claim and reproduce the checks without relying on the original author's memory.

## 2. Scientific context — handing over the monitoring model

The Environmental Monitoring Project now includes the complete reasoning chain: prediction problem, target and unit, predictors, modelling rows, baseline, XGBoost candidate, structured validation, controlled optimisation, evaluation, residual diagnostics, interpretation boundaries, Domain of Applicability, uncertainty, spatial prediction, Earth Engine component, architecture decision and monitoring runbook.

Lesson 3.30 does not invent a better accuracy result. It packages the evidence already earned and makes gaps visible. If the synthetic training pack cannot support a real Baltic coastal-meadow accuracy or uncertainty claim, the model card must say so. A polished document cannot upgrade synthetic evidence into ecological validation.

The output is a capstone-ready operational package. The independent Environmental Monitoring Project capstone is now available as a separate assessment in which learners apply the system to an approved real or fully documented dataset.

## 3. Concept — a model card is a navigation layer over evidence

A strong card is short enough to read and specific enough to prevent misuse. It links to detailed artifacts rather than duplicating every table. Include at least:

1. **Model identity:** stable name, semantic version, status, owner, review date and predecessor.
2. **Target and prediction unit:** exact outcome, units, observation method, spatial/temporal support and grid unit.
3. **Intended use:** bounded task, user, geography, season and decision support.
4. **Unsupported use:** causal claims, unrepresented regions/seasons/sensors, individual-level decisions or other prohibited applications.
5. **Features:** ordered schema, sources, units, transformations, support and availability.
6. **Training evidence:** dataset versions, sites, dates, sampling design, exclusions and population limits.
7. **Validation:** spatial/temporal/nested procedure, baseline, protected test role and leakage controls.
8. **Performance:** fold-level metrics, counts, units, probability quality and structured failures.
9. **Uncertainty:** method, calibration evidence, coverage target and observed coverage limitations.
10. **Applicability:** support method, thresholds, mapping and withhold policy.
11. **Limitations and ethical/governance considerations:** measurement, representation, operational and communication risks.
12. **Software and reproducibility:** model format, dependencies, environment, seeds, code commit and checksums.
13. **Operation:** inference contract, monitoring indicators, update/retraining/rollback/retirement policy and contact.

The card should state “not evaluated” when appropriate. Absence of evidence is not evidence of acceptable performance.

## 4. Visual explanation

![Diagram showing a versioned operational model package containing model, schema, data summary, evaluation, uncertainty, applicability, code and runbook passing release gates into monitored operation with rollback and retirement paths.](lesson-media/images/operational-model-package.svg)

The outer boundary represents a release unit. Copying only the model file breaks the evidence chain.

## 5. Version every component that can change meaning

Use semantic versions for the model package when your governance supports them:

- **major:** target, prediction unit, feature meaning, algorithm family or supported-use change that breaks comparability;
- **minor:** new training evidence or approved procedure improvement that preserves the target contract but changes predictions;
- **patch:** documentation, packaging or implementation correction demonstrated not to change predictions under acceptance fixtures.

This rule must be project-specific. The key is that a version communicates change, not that every team uses the same numbering philosophy.

Record immutable identities for inputs and code: dataset release/DOI or asset IDs, checksums, Git commit, environment lock, model serialization checksum, schema version and run ID. A filename such as `final_model_v2_really_final.json` is not a provenance system.

When a managed asset cannot be frozen indefinitely, export sufficient evidence and record catalogue identity, processing baseline, access date and reconstruction procedure.

## 6. Worked example — a structural model-card gate

```python
required_sections = {
    "model identity", "target and prediction unit",
    "intended use", "unsupported use", "feature schema",
    "training domain", "validation and performance",
    "uncertainty", "applicability", "limitations",
    "software and provenance", "update policy",
    "acceptance tests",
}
model_card_sections = {
    heading.strip().lower()
    for heading in completed_model_card_headings
}
missing = required_sections - model_card_sections
if missing:
    raise ValueError(f"Incomplete model card: {sorted(missing)}")
print("model card passes the structural gate")
```

### Predict before running

Assume `completed_model_card_headings` lacks `Unsupported use`.

1. Will the cell print the pass message?
2. Does adding an empty heading make the card scientifically complete?
3. Why are intended and unsupported use separate?
4. Which gate checks the actual model checksum?

After recording your answers, test the failing and passing cases. The code checks structure only. Content review, linked-file existence, checksum verification and scientific acceptance require additional gates.

### Code walkthrough

1. The set declares the minimum section contract.
2. Identity and target fields stop orphan model files.
3. Intended and unsupported uses create explicit boundaries.
4. Training, validation and uncertainty sections connect claims to evidence.
5. Software/provenance and update policy connect one release to future operation.
6. The comprehension normalizes headings for comparison.
7. Set subtraction finds absent sections.
8. The exception fails closed before release.
9. The final print means only that required headings exist.

Never interpret a structural test as peer review. Automated checks can confirm presence and consistency; a qualified reviewer must evaluate whether statements are accurate and adequately supported.

[[CHECK:m3-l30-card]]

## 7. Create a dataset and training summary

The model card should link to a machine-readable summary containing:

- source dataset/asset identifiers and licences;
- extraction or sampling query and date;
- target observation protocol and units;
- row counts before and after each exclusion;
- unique sites, groups, dates, blocks and folds;
- class prevalence or target distribution;
- missingness by field and exclusion reasons;
- predictor schema and transformations;
- spatial/temporal coverage and represented conditions;
- development, calibration and protected-assessment roles;
- known sampling bias and unresolved metadata;
- checksums and responsible author.

Do not publish sensitive coordinates in a public model card. Provide safe spatial summaries and document how an authorized reviewer can inspect restricted evidence. Privacy and reproducibility require governance, not accidental disclosure.

## 8. Package the executable and explanatory artifacts

A practical release directory could contain:

```text
environmental-monitoring-model-1.0.0/
├── MODEL_CARD.md
├── model/model.ubj
├── schemas/prediction_schema.json
├── data/TRAINING_DATA_SUMMARY.json
├── evaluation/protected_predictions.csv
├── evaluation/metrics_by_fold.csv
├── uncertainty/coverage_report.csv
├── applicability/applicability_contract.json
├── src/inference.py
├── tests/acceptance_report.json
├── operations/MONITORING_RUNBOOK.md
├── environment/requirements.lock
└── manifest-sha256.json
```

The exact structure may change. Preserve separation between immutable release artifacts and mutable monitoring records. A new annual run references the model package; it does not edit the package.

XGBoost's JSON or UBJSON format preserves model structure and, in current versions, auxiliary attributes such as feature names when saved through the supported interface. Still retain the external ordered feature schema because names alone do not preserve units, source, support and transformations. Never rely on a pickled estimator as the only long-term scientific record; loading pickle-like files from untrusted sources is unsafe and environment compatibility is fragile.

## 9. Define acceptance tests at several layers

### Structural tests

- all required files exist;
- JSON, CSV, notebook and Markdown parse;
- manifest contains one checksum per immutable artifact;
- internal version and model-card version agree;
- links are relative or stable and resolve.

### Schema and numerical tests

- feature order, unit, transform, support, dtype and source version match;
- known fixture rows produce predictions within a declared tolerance;
- batch/window size does not change output;
- invalid inputs remain NoData;
- class/probability/regression output semantics are correct;
- interval bounds do not cross and applicability overrides narrowness.

### Spatial tests

- CRS, transform, bounds, dimensions and resolution match the destination grid;
- output footprint equals valid input support;
- pixel-to-coordinate spot checks pass;
- no one-pixel shift or unexpected resampling exists;
- categorical outputs and NoData are encoded safely.

### Scientific tests

- target and prediction unit match the approval record;
- validation matches the intended transfer claim;
- performance is compared with the frozen baseline;
- known subgroup failures and unsupported domains are stated;
- empirical uncertainty coverage is reported, not assumed;
- no causal or ecological-change claim exceeds evidence.

### Operational tests

- a clean environment can load the package and run the bounded fixture;
- logging records source, model and output identities;
- failed gates prevent release;
- retry is idempotent and does not overwrite an approved product;
- rollback to the incumbent version is documented and rehearsed.

[[CHECK:m3-l30-qa]]

## 10. Reproducibility has levels

**Repeatability** means the same team can rerun the same code and inputs. **Computational reproducibility** means another qualified person can recreate the result from preserved code, data and environment. **Scientific reproducibility** asks whether an independent study obtains compatible evidence. A model package mainly addresses the first two; it does not guarantee the third.

Set random seeds, but do not claim that a seed alone guarantees identical results across hardware, threads or package changes. Record deterministic settings and numerical tolerances. Verify predictions on a small golden fixture after environment updates.

The notebook must restart and run top-to-bottom, but production inference should also exist as a tested script or package. Hidden notebook state is not an operational dependency.

## 11. Write an update, rollback and retirement policy

Define:

- monitoring cadence and evidence owner;
- thresholds that trigger review rather than automatic retraining;
- minimum new labelled evidence and sampling coverage;
- how new labels are divided between development and protected assessment;
- baseline and incumbent comparisons required for promotion;
- model-card and version updates;
- approval roles and segregation of duties;
- parallel/shadow operation where appropriate;
- rollback conditions and retained incumbent artifacts;
- communication to product users;
- retirement conditions and archive duration.

An update must not erase the historical run series. If target or predictor meaning changes, declare a broken series or produce a documented bridge analysis. Never splice incompatible model versions into one trend plot without marking the transition.

[[CHECK:m3-l30-update]]

## 12. Diagnostic check — conduct a release-candidate audit

Use the operational resource pack to create release candidate `0.1.0-rc1`. Then test:

1. remove `unsupported use` from the card;
2. change one feature transformation version;
3. modify the serialized fixture checksum;
4. change raster dimensions by one column;
5. mark the interval coverage report `not recently verified`;
6. remove the monitoring owner.

For each mutation, record the test that detects it, severity, release outcome and remediation. At least target/schema mismatch, checksum mismatch and spatial mismatch must block release. Governance gaps may also block release when no accountable operator exists.

Restore the approved fixture rather than editing expected results to make the test pass. A test suite that changes whenever outputs change does not protect a scientific contract.

## 13. Common mistakes

### Writing a promotional model card

**Why beginners make it:** public documentation often emphasizes capability. **Recognition:** strengths are prominent while failure domains are vague. **Fix:** lead with target, evidence, intended/unsupported use and known limitations.

### Packaging only the model file

**Why:** serialization feels like completion. **Recognition:** feature meanings, folds or environment cannot be reconstructed. **Fix:** treat the complete evidence directory as one release unit.

### Listing metrics without destination claims

**Why:** numbers appear self-explanatory. **Recognition:** no fold, unit, baseline or domain accompanies MAE/AUC. **Fix:** report what was withheld and which use the evidence supports.

### Calling uncertainty “confidence”

**Why:** one friendly word seems easier. **Recognition:** model interval, applicability and measurement uncertainty are collapsed. **Fix:** name the method, coverage evidence and excluded sources.

### Allowing automatic retraining to self-approve

**Why:** automation sounds efficient. **Recognition:** new data train, select and promote a model without protected evaluation or human responsibility. **Fix:** separate triggers, development, assessment and approval.

### Breaking historical comparability silently

**Why:** improved preprocessing seems universally beneficial. **Recognition:** trend series combines versions without markers. **Fix:** version products, retain lineage and perform a bridge/reprocessing analysis.

## 14. Guided practice — assemble release candidate 0.1.0

1. Copy `MODEL_CARD_TEMPLATE.md` and fill every section from earlier artifacts.
2. Create the dataset/training summary with counts and provenance.
3. Freeze the feature schema and model identity.
4. Link protected evaluation, uncertainty and applicability reports.
5. Add intended and unsupported uses in plain language.
6. Create the release inventory and checksum manifest.
7. Define structural, numerical, spatial, scientific and operational gates.
8. Run the six diagnostic mutations and save the report.
9. Write update, rollback and retirement policies.
10. Ask another learner or colleague to find one unsupported implication.
11. revise the card without hiding limitations.
12. Add the Lesson 3.30 checkpoint and Chapter 7 handover to the continuing notebook.

Do not sign the candidate as approved if any blocker remains. Use status `training release candidate` where evidence is synthetic.

## 15. Independent challenge — chair a model release review

Prepare a 10-minute review with three roles: modelling scientist, operational owner and independent scientific reviewer. Present the intended use, strongest evidence, largest limitation, monitored risks and rollback plan. The reviewer must ask:

- Would the evidence support use at a new site or new year?
- What happens outside applicability?
- Which uncertainty sources remain unrepresented?
- Can the result be reconstructed without the author?
- Who can stop or retire the model?

Write a decision memo with one of four outcomes: approve training package, approve bounded pilot, revise, or reject. Because the Academy pack is synthetic, a real ecological operational approval is not available.

## 16. Scientific interpretation

A model card improves transparency; it does not validate the model. The scientific strength still comes from target quality, sampling, structured assessment, uncertainty, applicability and monitoring evidence. The card makes that strength—and its absences—visible to users.

An operational package supports reproducible generation of bounded model outputs. It does not transform predictions into causal explanations, replace field observations or guarantee future performance. When conditions drift, the correct output may be a withheld product and a request for new evidence.

## 17. Submission

Submit:

- completed `MODEL_CARD.md` with evidence links and explicit unsupported uses;
- machine-readable dataset/training summary;
- package inventory and verified checksums;
- acceptance-test definitions and mutation report;
- update, rollback and retirement policy;
- the continuing notebook through Lesson 3.30 and Chapter 7 handover;
- a release-review decision memo;
- a 400–600 word executive scientific summary distinguishing what the package can reproduce from what remains unevaluated.

No credentials, private coordinates or untrusted serialized objects should enter the public package.

## 18. Portfolio artifact

**Artifact 30 — Operational Monitoring Pipeline and Model Card**

This final chapter artifact integrates every Module 3 checkpoint into a reviewable model release. It is evidence for professional judgement across modelling, geospatial delivery and scientific communication—not a claim that the synthetic teaching model is ready for environmental decisions.

## 19. Reflection

1. Which facts belong in the card and which belong in linked evidence?
2. What change requires a major rather than patch release in your policy?
3. Which acceptance test protects feature meaning rather than file structure?
4. Why must monitoring evidence be protected before retraining?
5. Under what condition should the model be retired?

## 20. Core references

- [Mitchell et al. (2019), Model Cards for Model Reporting](https://doi.org/10.1145/3287560.3287596)
- [XGBoost 3.3 model IO documentation](https://xgboost.readthedocs.io/en/stable/tutorials/saving_model.html)
- [The Turing Way — reproducible research](https://book.the-turing-way.org/reproducible-research/reproducible-research)

### Further advanced reading

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [scikit-learn model persistence](https://scikit-learn.org/stable/model_persistence.html)
- [Datasheets for Datasets](https://doi.org/10.1145/3458723)

## 21. Tested software versions

The reference package targets Python 3.12.13, NumPy 2.4.2, pandas 2.2.3, scikit-learn 1.9.0 and XGBoost 3.3.0. Actual raster and Earth Engine components must add their tested environments and current service/API identities. Checksums prove artifact identity, not scientific truth. The supplied release remains synthetic training evidence and cannot support real coastal-meadow operational approval.
