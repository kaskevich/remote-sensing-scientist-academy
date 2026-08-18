# Environmental Monitoring Project capstone pack

This pack supports the independent Module 3 capstone. It is an assessment framework, not a completed model and not a real coastal-meadow dataset. The Academy fixtures remain synthetic training evidence and cannot support a real environmental decision.

## Begin here

1. Read the capstone lesson before opening a modelling environment.
2. Complete `PROJECT_BRIEF_TEMPLATE.md` and obtain review of the decision, target, prediction unit, domain and protected evidence.
3. Create a new `Environmental_Monitoring_Project/` repository using the structure below.
4. Keep raw sources immutable or provide reproducible download instructions with stable identifiers, licences and checksums.
5. Save fold and role assignments once. Do not regenerate them silently between runs.
6. Use `CAPSTONE_RELEASE_GATE.md` at proposal, development, evidence and final-release reviews.
7. Complete `GRADUATE_PROFILE_EVIDENCE_MATRIX.md` by linking capabilities to actual artifacts.
8. Copy `submission_manifest_template.json`, replace every template value, calculate checksums and submit it with the release.

## Required repository

```text
Environmental_Monitoring_Project/
├── README.md
├── CITATION.cff
├── pyproject.toml
├── environment.yml
├── config/
│   └── project.yml
├── data/
│   ├── README.md
│   ├── raw/                       # immutable or download instructions
│   └── processed/                 # reproducible derivatives only
├── docs/
│   ├── PREDICTION_PROBLEM.md
│   ├── TARGET_SPECIFICATION.md
│   ├── MODEL_EXPERIMENT_PLAN.md
│   ├── MODEL_DIAGNOSTIC_REPORT.md
│   ├── INTERPRETATION_REPORT.md
│   ├── MODEL_CARD.md
│   └── MONITORING_RUNBOOK.md
├── notebooks/
│   ├── 01_problem_definition.ipynb
│   ├── 02_training_data.ipynb
│   ├── 03_baselines.ipynb
│   ├── 04_xgboost.ipynb
│   ├── 05_tuning.ipynb
│   ├── 06_spatial_validation.ipynb
│   ├── 07_diagnostics.ipynb
│   ├── 08_interpretation.ipynb
│   ├── 09_uncertainty.ipynb
│   └── 10_spatial_prediction.ipynb
├── src/
│   ├── data.py
│   ├── validation.py
│   ├── modelling.py
│   ├── diagnostics.py
│   ├── uncertainty.py
│   └── predict.py
├── tests/
├── models/
│   ├── model.json
│   └── MODEL_CARD.md
├── outputs/
│   ├── predictions/
│   ├── uncertainty/
│   ├── applicability/
│   ├── figures/
│   └── tables/
└── reports/
    ├── SCIENTIFIC_SUMMARY.md
    └── MANAGEMENT_BRIEF.md
```

You may consolidate notebooks when the same analytical dependency is clearer in fewer documents. Do not merge the independent-evaluation notebook into model development, and do not hide scientific logic in notebook state. Reusable transformations, validation and inference belong in tested source functions.

## Minimum executable commands

The README in your project must document equivalents of:

```bash
python -m pytest
python -m src.data --config config/project.yml
python -m src.modelling --config config/project.yml
python -m src.predict --config config/project.yml
```

Commands and file names may differ, but a qualified reviewer must be able to create the environment, inspect the source contract, run deterministic tests, reproduce the bounded pipeline and locate every release output without relying on your memory.

## Evidence roles

Keep these roles distinct:

- **development:** model fitting and ordinary diagnostic iteration;
- **inner validation:** hyperparameter and threshold selection;
- **outer assessment:** performance of the complete selection procedure for the declared transfer;
- **calibration:** uncertainty or probability calibration when the method requires it;
- **final protected assessment:** one registered evaluation after the procedure is frozen.

Record any breach. A file name such as `test.csv` does not protect evidence if the learner has repeatedly inspected its labels.

## Required spatial outputs

Publish aligned but semantically separate evidence layers:

- `prediction.tif` — regression value, class or probability with explicit units/semantics;
- `uncertainty.tif` — interval width, class uncertainty or another registered quantity;
- `applicability.tif` — supported, review, withhold and NoData states;
- a validation or residual map at observation support;
- accessible legends and an equivalent table/text summary.

Reopen each output and verify CRS, transform, dimensions, resolution, bounds, dtype, NoData, valid footprint, value rules and one-pixel alignment. An output that looks plausible but fails its grid or schema contract is not releasable.

## Automatic revision conditions

The project must be revised when:

- target units, protocol, class meanings or prediction support are guessed;
- test evidence influences tuning, features, thresholds or narrative selection;
- a random split is the only evidence for a new-site or new-region claim;
- target leakage or training-serving skew is present;
- high R² or overall accuracy is treated as sufficient evidence;
- rare-class failure, subgroup failure or residual geography is ignored;
- feature importance is interpreted as cause;
- extrapolation is not identified and constrained;
- uncertainty is absent or its empirical behaviour is not checked;
- a prediction map is described as observation or truth;
- the release cannot be reproduced in a clean documented environment.

## Data and privacy rule

Do not commit confidential targets, credentials or sensitive ecological coordinates to a public repository. Provide a redacted manifest and an authorised review procedure. Reproducibility does not require unsafe disclosure; it requires explicit governance of what is restricted, why, by whom and how it can be audited.

## Review sequence

- **Gate A — proposal:** meaning and intended decision are defensible.
- **Gate B — development:** roles, folds, baselines and selection stay inside their boundaries.
- **Gate C — evidence:** structured performance, failure, uncertainty and applicability constrain the claim.
- **Gate D — release:** clean execution, raster QA, documents, manifests, accessibility and ownership agree.

A `WITHHOLD` decision can be a successful capstone when it is supported by rigorous diagnosis and a proportionate evidence plan.
