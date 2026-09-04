## 1. Problem — turn scientific records into modelling observations without hindsight

### Learning outcome

By the end of this lesson, you will be able to define one row as one modelling observation; preserve observation identity, target, predictors, site, group, spatial block, date, fold, exclusions and provenance; audit duplicates and missing targets; save fold assignments; and freeze a `MODEL_EXPERIMENT_PLAN.md` before fitting any model.

- **Lesson type:** Experiment Design and Data Integrity Laboratory
- **Estimated time:** 180–240 minutes
- **Prerequisites:** Lessons 3.1–3.3; Module 1 pandas, data-quality and reproducibility work; Module 2 support, sampling, spatial blocks and leakage concepts
- **Portfolio outputs:** `model_ready_data.parquet`, `data_dictionary.csv`, `MODEL_EXPERIMENT_PLAN.md`

### Why this matters

A model matrix can be rectangular and still be scientifically invalid. Duplicate measurements may appear in different folds. Several rows may come from one field plot but be treated as independent plots. Targets and predictors may refer to different dates or supports. Excluded observations may disappear without explanation. Fold assignments may change every time the notebook runs.

Experiment design is also vulnerable to hindsight. A team tries several targets, features, metrics and splits, repeatedly checks the same test set, and reports the best result as if it were an independent evaluation. The computation may be reproducible while the scientific claim is optimistically biased.

> **Core lesson:** define the modelling evidence and freeze the evaluation rules before model performance can influence them.

### Mental model

Separate three objects:

1. **source records** — measurements and EO evidence in their original structures;
2. **modelling observation table** — one justified target–predictor case per row;
3. **experiment plan** — the rules governing baseline, validation, tuning and final evaluation.

The table answers “what evidence enters the experiment?” The plan answers “how will choices be made without contaminating the final claim?”

## 2. Scientific context — build the first Environmental Monitoring Project dataset

The synthetic Chapter 1 pack contains field and EO-style attributes for generalized coastal-meadow plots. It is not the published Zenodo dataset and must never be described as real ecological measurement. Deliberate defects make the audit visible:

- one repeated observation identifier;
- one included row with a missing target;
- one excluded row without a sufficient reason;
- one malformed date;
- one row without a saved fold;
- candidates from several sites and spatial blocks.

Your job is not to “clean until the model runs.” It is to identify which records can support the declared target and prediction claim, preserve exclusions, and create an auditable derivative.

The published Baltic dataset remains scientific context and potential future evidence. It cannot be spatially matched to EO predictors from the supplied CSV because coordinates are absent. Do not fabricate coordinates to complete this exercise.

## 3. Concept — one row is one modelling observation

“One row” is a data layout. “One modelling observation” is a scientific decision.

A modelling observation must connect:

- one stable observation ID;
- one target under the Lesson 3.2 contract;
- candidate predictors under the Lesson 3.3 contract;
- one spatial and temporal support pairing;
- grouping variables needed to protect independence;
- provenance back to source records and transformations.

### Repeated measurements

If the same plot is measured on several dates, each visit may form a row for a temporal model. The rows are not independent simply because dates differ. Preserve `plot_id`, `site`, date and grouping information so later validation can keep related records together when required.

### Raster cells

If cells become modelling observations, neighbouring rows remain spatially structured. Store block or region assignments. Do not use millions of nearby cells as if they were millions of independent field samples.

### Aggregated targets

If several field measurements are averaged to a polygon, the polygon may become the modelling unit. Preserve the number of contributing measurements, aggregation rule and coverage. The mean is not one new independent observation unless the design says what population it represents.

[[CHECK:m3-l4-row]]

## 4. Required modelling fields

The Chapter 1 table must contain:

| Field | Purpose | Failure if absent |
|---|---|---|
| `observation_id` | stable identity of one modelling case | duplicates or source tracing cannot be checked |
| `target` | value or label under the target contract | supervised fitting has no declared response |
| predictors | features under the predictor contract | model inputs are undefined |
| `site` | site-level grouping and diagnostics | new-site transfer cannot be evaluated |
| `group` | repeated-subject or ecological grouping | related observations may cross folds |
| `spatial_block` | predeclared spatial partition | proximity leakage cannot be inspected |
| `date` | target or pairing date under a declared rule | temporal ordering and drift cannot be evaluated |
| `fold` | saved development-fold assignment | validation silently changes between runs |
| `excluded` | explicit inclusion status | removed records disappear from the audit |
| `exclusion_reason` | evidence-based reason | exclusions become unreviewable researcher choices |
| source keys | trace back to raw target and predictor records | derivation cannot be reproduced |

The final-test role should be stored separately from ordinary development folds. Do not encode a final-test observation into a tuning fold and hope documentation will repair it.

## 5. Visual explanation — experiment firewalls

![A gated workflow shows source evidence entering development data, inner tuning and validation decisions remaining inside development, and a sealed final test set opened only once for the frozen candidate.](lesson-media/images/experiment-design-gates.svg)

### Development data

Development data support iteration. Within them, later chapters will create training and validation folds, compare baselines, tune hyperparameters and choose features.

### Final test data

Final test data estimate performance for the selected workflow after development choices are frozen. They do not answer questions during feature design. If a test score changes a modelling decision, the data have become development evidence.

### External or future validation

An external site, later year or independent campaign can test a stronger transfer claim. It is not automatically required for every lesson, but the intended claim must state what level of independence is needed.

The plan should be honest about the available evidence. Calling a random subset “external” does not make it so.

## 6. Pre-register the modelling experiment

Pre-registration here means timestamping the primary modelling decisions before fitting and evaluating candidates. It does not prohibit learning or revision. It makes changes visible.

Record:

- primary target and prediction unit;
- intended prediction domain and new-case claim;
- baseline model;
- primary metric and why it matches the decision;
- candidate model family;
- primary validation strategy;
- fold-generation rule and saved assignment file;
- tuning strategy and search budget;
- final test data and when they may be opened;
- primary feature set;
- exclusion and missingness policies;
- seed policy and software environment;
- diagnostic and subgroup analyses;
- conditions requiring stop or redesign;
- amendment log.

The plan must distinguish **confirmatory** decisions from exploratory work. Exploratory comparisons are valuable, but their results should not be presented as if they were predeclared independent tests.

## 7. Worked example — audit structure before exporting model-ready data

### Predict before running

The fixture contains a repeated ID. Predict which check stops first. Why should the duplicate be investigated rather than removed automatically?

```python
from pathlib import Path
import pandas as pd

source = Path("data/modelling_observation_fixture.csv")
records = pd.read_csv(source)
required = {"observation_id", "target", "site", "group",
            "spatial_block", "date", "fold", "excluded"}
missing = required - set(records.columns)
if missing:
    raise ValueError(f"Missing fields: {sorted(missing)}")
if records["observation_id"].duplicated().any():
    duplicates = records.loc[records["observation_id"].duplicated(False), "observation_id"]
    raise ValueError(f"Duplicate IDs: {duplicates.unique().tolist()}")
included = records.loc[~records["excluded"]].copy()
if included["target"].isna().any():
    raise ValueError("Included observations cannot have missing targets")
```

### Code walkthrough

1. `Path` creates a project-relative source path rather than a machine-specific Downloads path.
2. pandas is imported with its conventional alias.
3. `source` names the fixture explicitly.
4. `read_csv` loads a working DataFrame without changing the source file.
5. `required` records the minimum modelling structure.
6. Set difference identifies missing columns regardless of their order.
7. The first condition stops when the table contract is incomplete.
8. The next condition tests uniqueness of the modelling observation ID.
9. `duplicated(False)` marks every occurrence of a repeated ID, not only the later copy.
10. The error reports the repeated IDs for investigation.
11. Included rows are selected only after the structural checks pass.
12. `.copy()` makes the derivative explicit.
13. The final condition blocks an included observation whose target is absent.

The fixture is expected to fail. Diagnose and document the duplicate’s source meaning before deciding whether it represents accidental duplication, a repeated visit that needs a new ID, or conflicting records requiring exclusion.

### Diagnostic check

After resolving the deliberate issues in a new derivative, add:

```python
model_ready.to_parquet("outputs/model_ready_data.parquet", index=False)
```

Record the Parquet engine and version in the environment. Reopen the file and compare row count, columns, dtypes and observation IDs with the in-memory table. A successful write is not sufficient evidence of a correct derivative.

## 8. Fold assignments are evidence

Do not regenerate folds invisibly on every notebook run. Save a fold registry with:

```text
observation_id
development_or_test
outer_fold
group
spatial_block
assignment_method
assignment_version
```

Chapter 1 does not yet claim that the supplied folds are the correct spatial-validation design. Chapter 3 will compare grouped, spatial, temporal and nested strategies. Saving the assignments now provides three benefits:

1. exact reproducibility;
2. direct inspection for group or spatial leakage;
3. a stable link between predictions, residuals and evaluation folds.

A random seed alone is weaker evidence than a saved assignment. Library versions and row order can alter regenerated splits even when the same seed is recorded.

## 9. Missingness, exclusions and provenance

### Missing target

Supervised learning usually cannot fit a row with an unknown target. Preserve the record in the audit and exclude it from labelled development data unless a justified semi-supervised design is explicitly introduced later. Never replace an unknown target with zero.

### Missing predictor

The treatment depends on model capability, missingness mechanism and operational behaviour. Do not impute yet. Record missingness by feature, site, date and fold so that later preprocessing is learned inside development folds only.

### Exclusion

Every exclusion needs a rule and evidence. Prefer rule-based fields such as `target_missing`, `support_mismatch` or `source_qa_failed` over free text alone. Preserve original values and source IDs.

### Provenance

For each derived feature, store or link:

- source asset and version;
- observation date;
- transformation function and parameters;
- spatial/temporal matching rule;
- QA mask or exclusion state;
- output field name and unit.

The model-ready table is a derivative, never the new raw source.

## 10. Model clinic — the test set becomes a tuning assistant

**Situation:** the team trains an initial model, sees weak final-test performance, changes the feature set and tree depth, and reports the improved score on the same test set.

| Question | Diagnosis |
|---|---|
| problem | the final test influenced feature and model choices |
| evidence | notebook history, result timestamps, experiment-plan amendments and repeated test predictions |
| consequence | the final score is no longer an independent estimate for the chosen workflow |
| fix | treat that set as development data, freeze the revised workflow and evaluate on new independent evidence |

The team does not need to hide the failed attempt. It should report the iteration honestly and obtain new evidence for a final claim.

[[CHECK:m3-l4-test]]

## 11. Common mistakes and recovery

### Treating every table row as independent

- **Why it happens:** modelling APIs accept rectangular arrays.
- **How to detect it:** repeated plots, neighbouring cells or same-date replicates cross folds.
- **How to prevent it:** preserve group, site, block and date identities.
- **Consequence:** validation performance is inflated by related examples.

### Dropping bad rows without an audit

- **Why it happens:** a shorter table lets the model run.
- **How to detect it:** source and modelling row counts cannot be reconciled.
- **How to prevent it:** store exclusion status and reason, then produce a reconciliation table.
- **Consequence:** researcher choices and sampling bias are hidden.

### Preprocessing before the split

- **Why it happens:** one clean table seems efficient.
- **How to detect it:** imputation, scaling or feature selection was fitted on all rows.
- **How to prevent it:** split first and fit learned preprocessing inside development folds.
- **Consequence:** validation receives information from held-out data.

### Changing the test set after seeing performance

- **Why it happens:** weak results are attributed to inconvenient cases.
- **How to detect it:** exclusions or partitions are justified by model errors rather than predeclared data-quality rules.
- **How to prevent it:** freeze the test registry and require documented amendments.
- **Consequence:** the claim describes a curated easy subset.

### Reporting only one split

- **Why it happens:** one train/test result is simple to communicate.
- **How to detect it:** no fold variability or alternative transfer design is recorded.
- **How to prevent it:** predeclare repeated or structured evaluation appropriate to the claim.
- **Consequence:** performance may depend on one fortunate partition.

### Regenerating folds invisibly

- **Why it happens:** a splitter call feels deterministic with a seed.
- **How to detect it:** observation-to-fold assignments are absent from outputs.
- **How to prevent it:** save and checksum the fold registry.
- **Consequence:** results cannot be traced or audited for leakage.

## 12. Guided practice — audit the supplied fixture

Download `modelling_observation_fixture.csv`, `data_dictionary_template.csv` and `MODEL_EXPERIMENT_PLAN_TEMPLATE.md`.

1. Verify file identity and record the manifest checksum.
2. Profile shape, fields and data types.
3. Reconcile unique observation IDs with row count.
4. Parse dates explicitly and report failures.
5. Count missing targets among included and excluded rows separately.
6. Check that every exclusion has a controlled reason.
7. Inspect site, group, spatial block and fold combinations.
8. Identify whether related observations cross folds.
9. Create an immutable audit table listing every issue and decision.
10. Produce a corrected derivative without editing the source fixture.
11. Save `model_ready_data.parquet` and reopen it.
12. Export `fold_registry.csv` and `data_dictionary.csv`.

Your corrected derivative should not contain the deliberate defects. Your audit must preserve evidence that they existed.

[[CHECK:m3-l4-fold]]

## 13. Independent challenge — freeze the experiment plan

Complete `MODEL_EXPERIMENT_PLAN.md` before fitting any model. Required sections:

1. problem statement and target-contract versions;
2. prediction unit and domain;
3. source and model-ready dataset versions;
4. primary baseline;
5. primary metric and secondary diagnostics;
6. candidate model family;
7. development and final-test registry;
8. primary validation claim and fold strategy;
9. future spatial/temporal validation requirements;
10. tuning strategy and budget;
11. predeclared feature set;
12. missingness and exclusion policy;
13. subgroup and failure analyses;
14. random seeds and software versions;
15. stop conditions;
16. amendment log.

Add this declaration:

> Final test data will not influence preprocessing, feature selection, hyperparameter tuning, threshold choice or model selection. If viewed for any of those purposes, they will be reclassified as development data and new independent evaluation evidence will be required.

Commit or otherwise timestamp the plan. Do not write a result section yet.

## 14. Scientific interpretation

The modelling dataset is not merely a convenient join of targets and predictors. It is the operational definition of the experiment’s observations. Its grouping, dates, blocks and exclusions determine which generalisation claims can later be tested.

Pre-registration does not make the chosen plan correct. It makes the reasoning visible before results encourage selective revision. Scientific improvement remains possible through amendments, but the record must distinguish planned evidence from exploratory iteration.

## 15. Reflection, submission and portfolio artifact

### Reflection

1. What does one row represent scientifically?
2. Which records are related even though their IDs differ?
3. What evidence justifies each exclusion?
4. Which decisions may use development folds?
5. Which decisions must not use final-test results?
6. What would force a new experiment plan version?

### Submission

Submit:

- `model_ready_data.parquet`;
- `data_dictionary.csv`;
- `fold_registry.csv`;
- `modelling_data_audit.csv`;
- `MODEL_EXPERIMENT_PLAN.md`;
- one screenshot showing source-to-derivative row reconciliation;
- a 300–450 word explanation of how the plan protects the final claim.

### Portfolio artifact

**Artifact 3.4 — Pre-registered Modelling Evidence Package**

Together, Lessons 3.1–3.4 form the complete Chapter 1 foundation: problem statement, target contract, predictor hypotheses, model-ready evidence, saved folds and a frozen experiment plan. Chapter 2 will establish baselines and introduce tree ensembles without changing these definitions silently.

## 16. Core references and advanced reading

- [scikit-learn model selection and evaluation](https://scikit-learn.org/stable/model_selection.html)
- [scikit-learn common pitfalls: data leakage](https://scikit-learn.org/stable/common_pitfalls.html)
- [Roberts et al. (2017), structured cross-validation](https://doi.org/10.1111/ecog.02881)
- [The Turing Way: reproducible research](https://book.the-turing-way.org/reproducible-research/reproducible-research)

### Tested software versions

Python 3.12.13, NumPy 2.4.2, pandas 2.2.3, scikit-learn 1.9.0 and XGBoost 3.3.0. Record the exact Parquet engine and version used in your environment because pandas delegates Parquet writing to an installed engine.
### From the Field — modelling-table lineage

Before fitting XGBoost, require one auditable chain: `SampleID` → plot response → reviewed geometry → raster extraction → predictor row. Fit trait aggregation and preprocessing inside the permitted training evidence; otherwise site or target information can leak across the split. [Review the data lineage](/species/from-field-to-earth-observation/).
