## 1. Problem — model selection and model assessment cannot use the same evidence

### Learning outcome

By the end of this lesson, you will be able to explain the separate jobs of outer and inner cross-validation; construct a nested grouped-validation plan; place learned preprocessing inside the selection procedure; detect target, duplicate, spatial, temporal and selection leakage; verify a row-level nested fold registry; and produce a leakage-audited Structured Validation Design without opening the final test.

- **Lesson type:** Nested Evidence and Leakage Audit Laboratory
- **Estimated time:** 220–300 minutes
- **Prerequisites:** Lessons 3.9–3.11; Lesson 3.4 experiment firewall; Chapter 2 fixed XGBoost candidate and metadata; understanding that Chapter 4 will teach optimisation strategy in depth
- **Portfolio outputs:** `nested_validation_plan.md`, `nested_fold_registry.csv`, completed `LEAKAGE_CHECKLIST.md`, and the Chapter 3 handover in `Environmental_Monitoring_Project_Starter.ipynb`

### Why this matters

Validation results guide development. If you try five feature sets, four depths and three preprocessing rules, then report the best score from the same folds as though it were an untouched estimate, the assessment evidence has influenced the selected procedure. Nothing illegal happened in Python. The scientific role of the score changed.

Nested cross-validation preserves two evidence layers. The inner loop is allowed to choose among declared alternatives using only the current outer development data. The outer assessment fold remains invisible to that choice. After inner selection, the chosen procedure is refitted on the complete outer development partition and scored once on the untouched outer assessment partition.

> **Core lesson:** the outer loop estimates the generalisation of the complete selection procedure; the inner loop makes development choices. A final test remains a third, later firewall.

### Mental model

```text
FINAL TEST — sealed until the complete procedure is frozen

outer fold 1
├── outer development
│   └── inner folds select preprocessing + configuration
└── outer assessment scores the selected procedure once

outer fold 2
├── outer development
│   └── inner folds select again without outer-fold-2 assessment
└── outer assessment scores once
```

The selected configuration can differ across outer folds. That is not a bug: it reveals selection instability and estimates the process you intend to use on future development data.

## 2. Scientific context — select inside sites, assess across sites

The Environmental Monitoring Project’s primary Chapter 3 example uses sites as outer assessment groups because the claim concerns transfer to a withheld site among the represented synthetic domains. Within the remaining outer development sites, spatial blocks can define inner groups for selecting a small, predeclared set of modelling decisions.

This architecture protects the outer site from:

- feature selection;
- missing-value policy fitting;
- hyperparameter choice;
- early-stopping decisions;
- model-family comparison;
- threshold or calibration decisions;
- validation-design comparison.

The outer result is still not the Academy final test. It is cross-validated development evidence used to understand generalisation and later to define the fixed procedure. The independent final test remains sealed until optimisation, diagnostics, uncertainty and operational packaging are complete.

## 3. Concept — three roles, not three filenames

### Inner training and inner validation

Inside one outer development partition, the inner splitter rotates training and validation groups. Candidate procedures are fitted on inner-training rows and compared on inner-validation rows. “Procedure” includes every learned transformation and selection rule, not only XGBoost parameters.

### Outer development and outer assessment

The inner process selects a procedure using outer development evidence. That procedure is refitted on all outer development rows, then predicts the outer assessment rows once. Outer targets may be used to calculate that fold’s final metrics but must not change the procedure inside that fold.

### Final test

The final test remains outside all nested loops. Once it influences a modelling decision, it is no longer final independent evidence. Nested CV does not justify repeated final-test inspection.

### What nested CV estimates

Nested validation estimates how the complete selection workflow generalises under the outer split. It does not estimate the performance of one universally fixed parameter vector unless the procedure itself fixes that vector. After the study, a final model can be selected using development evidence and refitted for deployment, but its final claim needs the sealed test or appropriately independent external evidence.

[[CHECK:m3-l12-loops]]

## 4. Visual explanation — selection inside an evidence firewall

![Three outer folds keep assessment partitions behind a firewall while inner grouped folds select preprocessing and parameters only inside each outer development partition.](lesson-media/images/nested-cross-validation.svg)

The dashed boundary is the key. An outer assessment row cannot enter the inner fold registry, preprocessing fit, parameter search or stopping decision. The same logical separation must hold for derivative information: site-wide target summaries, globally selected features and normalization statistics can cross the boundary even when the raw row does not.

The loop repeats from the beginning for each outer fold. Reusing a transformation fitted during a previous outer fold can leak information if that transformation saw the new fold’s assessment rows.

## 5. Why non-nested selection is optimistic

Suppose you evaluate twenty candidate configurations on one five-fold grouped validation and choose the lowest mean MAE. The winner benefited from genuine signal plus chance aspects of those folds. Reporting the winning mean as a neutral estimate ignores that the same observations selected the winner.

The more flexible the search and the noisier or smaller the dataset, the larger selection bias can become. This does not mean search is forbidden. It means selection must occur inside evidence reserved for selection. The outer loop then evaluates the act of searching.

Chapter 4 will teach informed search spaces, `RandomizedSearchCV`, early stopping and regularisation. In this lesson, use only a tiny declared candidate set to understand the architecture. Do not optimise the Chapter 3 fixture extensively.

## 6. Leakage taxonomy — information can cross without a target column

### Preprocessing on the full dataset

An imputer median, scaler mean, category vocabulary or PCA basis is fitted before cross-validation. Assessment feature distributions influence the representation. Fit transformations inside a `Pipeline` or equivalent fold-local object.

### Feature selection on full data

Correlation ranking, importance filtering or recursive selection uses every target, then cross-validation evaluates the preselected features. Selection must be refitted within inner training partitions.

### Tuning on the test or outer assessment set

Parameters, thresholds or stopping rounds are changed after inspecting protected performance. The protected set becomes development evidence. Preserve the access history and acquire new independent evidence.

### Duplicate and derivative samples across folds

The same plot appears twice, or several chips, pixels, augmentations and dates derive from one source unit. Stable source IDs must travel with every derivative and define a group.

### Neighbouring observations across folds

Spatially close rows share environmental or image information. Use spatial groups or buffers appropriate to the claim, then audit distance.

### Temporal leakage

Future observations, composites, labels or transformation statistics influence an earlier prediction. Use availability timestamps and directional folds.

### Target-derived predictor

A predictor is computed from the target or a post-outcome measurement. Strong performance is expected but operationally impossible. Revisit the predictor hypothesis register.

### Global normalization or reference statistics

A “fixed” landscape mean, anomaly baseline or class threshold is calculated from all locations or years. If it is learned from the study data, it belongs inside folds. If it is an external operational constant, record its independent provenance.

[[CHECK:m3-l12-leakage]]

## 7. Worked example — nested site assessment with inner block selection

### Predict before running

In one outer fold, `coast-c` is assessment. Can any `coast-c` row receive an inner-fold number? Which rows may determine the imputation median? Should the selected `max_depth` be identical in every outer fold? Write your answers first.

```python
from sklearn.impute import SimpleImputer
from sklearn.model_selection import GridSearchCV, GroupKFold, LeaveOneGroupOut
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor

pipeline = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("model", XGBRegressor(n_estimators=200, learning_rate=0.05,
                           random_state=42, n_jobs=1)),
])
outer = LeaveOneGroupOut()
for train_i, test_i in outer.split(X, y, groups=site):
    inner = GroupKFold(n_splits=3)
    search = GridSearchCV(pipeline, {"model__max_depth": [2, 3]},
                          cv=inner, scoring="neg_mean_absolute_error")
    search.fit(X.iloc[train_i], y.iloc[train_i],
               groups=spatial_block.iloc[train_i])
    predictions = search.predict(X.iloc[test_i])
    save_outer_predictions(test_i, predictions, search.best_params_)
```

### Code walkthrough

1. `SimpleImputer` is a learned preprocessing step; its median must come from the current fit partition.
2. `GridSearchCV`, `GroupKFold` and `LeaveOneGroupOut` represent selection and assessment roles.
3. `Pipeline` binds preprocessing and modelling so both are refitted inside each candidate fit.
4. The XGBoost starting settings remain conservative and reproducible.
5. The outer splitter withholds one complete site.
6. Each iteration supplies only outer development rows to `search.fit`.
7. `GroupKFold` keeps spatial blocks intact inside outer development.
8. The two-depth grid is deliberately tiny. It demonstrates nested roles, not a production search strategy.
9. Negative MAE follows scikit-learn’s “higher is better” scorer convention; values must be sign-corrected for reporting in centimetres.
10. `groups` passed to `.fit(...)` belong only to outer development rows and direct the inner splitter.
11. The fitted search object selects and refits a procedure without seeing the outer assessment target.
12. Prediction occurs once for the held-out site.
13. Row-level outer predictions and the selected parameters are saved for transparent aggregation.

Depending on scikit-learn configuration, metadata routing can change how groups are passed. Check the documentation for the installed version. The scientific requirement is stable even when the API changes.

### Diagnostic check

Construct a row-level registry for every outer fold with `observation_id`, `outer_fold`, `outer_role`, `outer_held_out_site`, `inner_fold`, `used_for_model_selection`, `site`, `spatial_block` and `year`. Assert:

- outer assessment rows have no inner fold;
- outer assessment rows have `used_for_model_selection = false`;
- every outer development row has a valid inner role for each relevant rotation;
- held-out site does not occur in outer development;
- inner validation blocks do not occur in inner training for that split;
- each saved prediction comes from a model that excluded that observation’s outer unit.

## 8. Pipeline boundaries in EO workflows

Not every transformation belongs in a scikit-learn `Pipeline`. Atmospheric correction or an externally versioned surface-reflectance product may precede the modelling dataset. The question is whether the transformation was learned or chosen using the study evidence.

Use three categories:

1. **Externally fixed processing:** independently specified product processing, documented and versioned. Record it as provenance.
2. **Data-dependent preprocessing:** imputation, scaling, feature selection, target encoding, PCA, learned thresholds. Fit inside the relevant training partition.
3. **Design decisions:** cloud thresholds, temporal windows, spatial support reconciliation. If chosen after inspecting validation outcomes, they are model-selection decisions even if implemented before Python modelling.

Remote sensing leakage frequently occurs upstream. A mosaic chosen because it correlates best with the target, or a buffer adjusted until scores improve, belongs inside the decision audit.

## 9. Nested grouped validation with few sites

Four outer sites leave three sites for each inner selection problem. This is educationally clear but statistically fragile. Inner folds may have few independent groups, candidate rankings may vary and some predictor ranges may disappear.

Report:

- number of outer and inner groups;
- observation counts without treating them as independent site counts;
- selected configuration in each outer fold;
- outer fold errors and baseline skill;
- instability of selection;
- any infeasible fold;
- whether a simpler fixed procedure is more defensible than a flexible search.

Nested CV is not magic multiplication of evidence. It manages roles; it does not create new sites. When independent groups are scarce, collect more groups, simplify the procedure or narrow the claim.

## 10. Guided practice — build and audit the nested registry

1. Add `## Lesson 3.12 — nested validation and leakage audit` to the cumulative notebook.
2. Copy the primary site-transfer claim from Lesson 3.10.
3. Create outer leave-one-site-out assignments before importing a model.
4. Within each outer development partition, create block-grouped inner folds.
5. Save every role in `nested_fold_registry.csv`.
6. Run the structural assertions from the diagnostic check.
7. Put the median imputer and model in one pipeline.
8. Compare only the two predeclared depth settings. Do not expand the search after seeing results.
9. Save outer predictions and fold-local best parameters.
10. Calculate the baseline and candidate MAE per outer site.
11. Report the selected depth by outer fold as evidence about stability, not as a popularity vote.
12. Complete every item in `LEAKAGE_CHECKLIST.md`, with paths to supporting files.
13. Confirm in model metadata that the Academy final test has not been opened.
14. Write the exact procedure that Chapter 4 may optimise, including its nested evidence architecture.

## 11. Independent challenge — red-team the Environmental Monitoring Project

Assume a colleague reports excellent validation after this workflow:

1. create all raster features for all sites and years;
2. fill missing values using the complete table median;
3. retain the ten features most correlated with the target using all rows;
4. try 100 parameter combinations on site-grouped CV;
5. publish the best grouped-CV mean;
6. check the final test and slightly change the cloud threshold;
7. check the final test again.

Write a red-team report identifying every evidence crossing. For each issue state:

- leaked information;
- protected role it entered;
- why the reported score becomes optimistic or ambiguous;
- redesigned step;
- artifact that proves the correction.

Then produce `nested_validation_plan.md` for the repaired workflow. Keep the final test sealed and explain what new independent evidence would be needed after the threshold was changed.

## 12. Common mistakes

### Nesting splitters but fitting preprocessing once

**Why:** preprocessing appears separate from modelling. **Recognition:** `.fit_transform(X)` runs before the outer loop. **Fix:** place learned transformations inside a pipeline evaluated by the inner search. **Consequence:** every assessment fold influences the model representation.

### Giving outer assessment rows inner-fold labels

**Why:** one global inner registry is reused. **Recognition:** held-out site rows appear in the selection table. **Fix:** generate inner folds anew inside each outer development partition. **Consequence:** protected evidence can influence selection.

### Reporting the best inner score as performance

**Why:** the search object exposes `best_score_`. **Recognition:** the report lacks outer predictions. **Fix:** aggregate metrics only from held-out outer predictions for nested generalisation evidence. **Consequence:** selection evidence is mistaken for assessment.

### Believing a pipeline prevents every leak

**Why:** pipelines correctly contain many transformations. **Recognition:** feature windows, labels, blocks or target-derived variables were chosen upstream using all evidence. **Fix:** audit the full scientific workflow, not only estimator code. **Consequence:** semantic leakage survives technically correct APIs.

### Searching a large space with few groups

**Why:** more candidates feel more thorough. **Recognition:** selected settings vary wildly among outer folds and inner groups are scarce. **Fix:** constrain choices through prior reasoning and report instability. **Consequence:** selection overfits group-specific noise.

### Opening the final test after nested CV “for reassurance”

**Why:** nested CV feels complete. **Recognition:** test performance changes a decision. **Fix:** define one final access gate and log it. **Consequence:** the independent test becomes another validation set.

## 13. Scientific interpretation

The outer fold distribution is evidence about the complete inner selection procedure transferring to represented withheld sites. If selected settings differ by site, report instability. If outer errors exceed the non-nested grouped score, that gap is expected evidence of selection bias or variance, not a reason to discard nesting.

A poor outer result can motivate a new development cycle, but the current outer evidence has then influenced the next procedure. Preserve versions. Final claims require evidence appropriate to the revised workflow.

The strongest Chapter 3 outcome may be a simpler procedure with an honest range of transfer errors. Scientific credibility is not measured by how much optimisation occurred.

## 14. Submission

Submit:

- the executed nested-validation notebook checkpoint with fold-local pipelines and outer predictions;
- `nested_validation_plan.md` distinguishing outer, inner and final-test roles;
- `nested_fold_registry.csv` with passed structural assertions;
- the completed `LEAKAGE_CHECKLIST.md` linked to evidence;
- a screenshot of the nested evidence diagram or outer fold results;
- a 400–600 word scientific handover covering supported transfer, instability, leakage controls and what remains sealed.

### Portfolio artifact

**Structured Validation Design — Complete Chapter 3 Package**

The package combines the validation claim, random-versus-spatial comparison, temporal transfer report, nested design, row-level registries, predictions and leakage audit. It becomes the evidence architecture used by Chapter 4. Nothing from the final test is required.

## 15. Reflection

1. What exactly is selected in the inner loop besides hyperparameters?
2. Why may different outer folds select different configurations?
3. Which upstream EO processing choice could leak even with a correct pipeline?
4. How does a fold registry provide stronger evidence than naming a splitter?
5. What would force you to collect more independent sites rather than expand the search?

[[CHECK:m3-l12-final-firewall]]

## 16. Core references and advanced reading

### Core references

- [scikit-learn 1.9 — nested versus non-nested cross-validation](https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html)
- [scikit-learn 1.9 — common pitfalls and leakage prevention](https://scikit-learn.org/stable/common_pitfalls.html)
- [scikit-learn 1.9 — Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)

### Optional advanced reading

- [Cawley and Talbot (2010) — over-fitting in model selection and selection bias](https://jmlr.org/papers/v11/cawley10a.html)
- [Roberts et al. (2017) — structured cross-validation](https://doi.org/10.1111/ecog.02881)
- [Valavi et al. (2019) — spatial and environmental blocking](https://doi.org/10.1111/2041-210X.13107)

### Tested software versions

Python 3.12.13; JupyterLab 4 / Notebook 7; NumPy 2.4.2; pandas 2.2.3; scikit-learn 1.9.0; XGBoost 3.3.0. Group metadata routing and search APIs can change between scikit-learn releases; verify the installed documentation while preserving the evidence roles described here.
