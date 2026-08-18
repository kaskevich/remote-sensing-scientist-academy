## 1. Problem — withhold the destination, not a convenient percentage

### Learning outcome

By the end of this lesson, you will be able to select and implement ordinary K-fold, `GroupKFold`, site-level holdout, leave-one-site-out and spatial-block validation according to a declared prediction claim; explain the purpose and limitation of buffered holdout; compare fold-level performance distributions for the same fixed model; and audit every fold for group and spatial separation.

- **Lesson type:** Spatial Validation Design Laboratory
- **Estimated time:** 210–290 minutes
- **Prerequisites:** Lesson 3.9 validation claim and split audit; Module 2 spatial autocorrelation, CRS, coordinates, extent and raster-support reasoning; Chapter 2 fixed model and baseline
- **Portfolio outputs:** `spatial_validation_comparison.ipynb`, `spatial_fold_registry.csv`, `spatial_validation_results.csv`, and a claim-to-split decision table

### Why this matters

“Use five-fold cross-validation” is not a complete method. Five folds can be formed from individual observations, campaign groups, field sites, spatial blocks or environmentally separated regions. The number is the least scientifically important part. The grouping rule determines whether assessment rows resemble the conditions a deployed model will encounter.

Remote-sensing data make this choice consequential. A field plot can share pixels with another plot. UAV image chips can overlap. Adjacent cells can inherit the same atmospheric correction, acquisition geometry, interpolation surface or management unit. When these related samples are separated as if independent, the validation experiment measures a forgiving interpolation task.

> **Critical principle:** validation must match the intended prediction claim. Predicting new plots within known sites, a completely new site and another region require different withheld evidence.

### Mental model

Move from destination to fold, never from library function to claim:

```text
new observation among represented neighbours → row-level split may be relevant
new campaign or transect                     → grouped split by campaign/transect
new block inside the study landscape         → spatial blocks
new monitored site                           → site-level holdout / leave-one-site-out
another region                               → independent regional evidence
```

Greater separation generally makes the transfer problem harder, but it does not create evidence for a region absent from the data.

## 2. Scientific context — four site codes are four transfer experiments

The Chapter 3 fixture contains four synthetic site codes: `coast-a` through `coast-d`. Each has blocks numbered 1–4 and observations across 2023–2025. The coordinates place sites apart on a synthetic teaching grid and repeated years near the same block locations.

This structure supports several controlled comparisons:

- **ordinary K-fold:** rows are partitioned without respecting site or block;
- **GroupKFold by site:** each site appears in one assessment fold and never in the corresponding training rows;
- **site-level holdout:** one selected operationally important site is withheld once;
- **leave-one-site-out:** each of four sites becomes the assessment destination in turn;
- **spatial blocking:** block labels, or newly created coordinate tiles, are kept intact;
- **buffered holdout:** training observations within a declared distance of assessment observations are excluded conceptually or through audited code.

The fixture does not contain another real region. No fold arrangement can turn it into regional validation. At best, leave-one-site-out estimates transfer among these four designed site domains.

## 3. Concept — six designs and their claims

### Ordinary K-fold

`KFold` divides individual rows into (k) rotations. With shuffling, rows are mixed before allocation. It is appropriate only when the observations can reasonably be treated as exchangeable for the intended destination. In spatial ecology that assumption often fails. K-fold remains useful as a transparent comparator and for non-spatial independent samples; it is not a default certificate of transfer.

### GroupKFold

`GroupKFold` keeps every supplied group wholly within one assessment fold across the rotation. The group must encode the scientific dependency: site, campaign, individual organism, source scene or another shared unit. Passing arbitrary IDs preserves the wrong structure. In scikit-learn 1.9, each group appears exactly once in assessment, and the number of distinct groups must be at least the number of folds.

### Site-level holdout

A fixed site holdout asks a focused operational question: how does the procedure perform at this named destination? It is useful when one site is a genuine future deployment or has meaningfully different conditions. It is not a population-wide estimate by itself. Selection of the held-out site must precede performance inspection.

### Leave-one-site-out

`LeaveOneGroupOut` with site as group trains on all but one site and assesses the omitted site, repeated for every site. It makes heterogeneity visible. With only four sites, the four errors can vary widely, and their mean has substantial uncertainty. Do not treat twelve plots in a site as twelve independent site-transfer experiments.

### Spatial blocking

Spatial blocking divides coordinates into contiguous regions, then keeps a block intact. Block size should relate to the prediction horizon, sampling structure and dependence range, not to the score you prefer. Shifting an arbitrary grid can change assignments; sensitivity analysis and a saved registry are therefore important.

### Buffered holdout

A buffer removes training observations within a chosen distance of assessment observations. It can reduce close-neighbour leakage. However, buffers reduce training data, may create uneven folds and require coordinates in a suitable distance-preserving CRS. A buffer is not automatically sufficient: environmental or hierarchical dependence can extend beyond Euclidean distance. The distance must be justified and its effect on sample support reported.

[[CHECK:m3-l10-match-claim]]

## 4. Visual explanation — the validation claim ladder

![Four ascending steps connect prediction within known sites, prediction in new spatial blocks, prediction at a new site and prediction in another region to increasingly separated validation units.](lesson-media/images/validation-claim-ladder.svg)

The ladder is a decision guide, not a competition. Moving right changes the destination. A model that performs well for known-site interpolation but poorly for new-site transfer may still be useful for the first task. Trouble begins when the first score is reported as evidence for the second.

The final step—another region—cannot be simulated merely by increasing `n_splits`. It requires evidence that represents regional changes in ecology, climate, acquisition, target protocol and predictor distribution. Spatial folds within one narrow study area can reveal local dependence without establishing continental transfer.

## 5. Design the fold unit from three prediction questions

### Question A: new plots within known sites

If training will always contain other observations from the same sites, site overlap can be operationally realistic. You may still need to group repeated locations, source polygons or overlapping image chips. A row-level split is defensible only after those relationships are controlled.

### Question B: a completely new site

The site is the assessment unit. Use site grouping or leave-one-site-out. All target values, learned transformations and derivative samples from the held-out site must remain outside fitting. The result estimates transfer among represented sites, not arbitrary geography.

### Question C: another region

Withhold an independent region selected to represent the destination. If the dataset contains only one region, state that the claim cannot yet be evaluated. Spatial blocks inside that region may be a useful stress test, but renaming them “regions” does not create the missing evidence.

Create a claim-to-split table with columns `operational_question`, `prediction_unit`, `novel_unit`, `group_field`, `splitter`, `required_audit`, `supported_claim` and `unsupported_claim`.

## 6. Worked example — leave one site out and prove separation

### Predict before running

There are four unique sites. How many folds will `LeaveOneGroupOut` create? In the fold holding out `coast-c`, how many site codes should occur in training and assessment, and what should their intersection contain? Predict before executing.

```python
import pandas as pd
from sklearn.model_selection import LeaveOneGroupOut

data = pd.read_csv("data/structured_validation_data.csv")
X = data[["sentinel2_ndvi", "sentinel2_ndmi",
          "uav_height_p95", "texture_contrast"]]
y = data["vegetation_height_cm"]
groups = data["site"]

splitter = LeaveOneGroupOut()
for fold, (train_index, test_index) in enumerate(
    splitter.split(X, y, groups=groups), start=1
):
    train_sites = set(groups.iloc[train_index])
    test_sites = set(groups.iloc[test_index])
    assert train_sites.isdisjoint(test_sites)
    print(fold, sorted(test_sites), len(train_index), len(test_index))
```

### Code walkthrough

1. The fixture is read once with its stable observation IDs.
2. `X` uses the frozen Chapter 2 feature order. Fold comparison must not introduce different predictors.
3. `y` retains the synthetic centimetre target.
4. `groups` encodes site membership. This line gives the splitter scientific meaning.
5. `LeaveOneGroupOut` creates one fold for each unique group.
6. `.split(...)` returns integer positions for training and assessment.
7. `enumerate(..., start=1)` gives human-readable fold numbers.
8. Sets of training and assessment sites support an explicit structural audit.
9. `isdisjoint` must be true before fitting. The assertion converts the design promise into an executable gate.
10. The printout shows which site is held out and the observation counts. Counts alone cannot prove that identities or neighbours are separated.

The code deliberately stops before model fitting. A professional validation workflow verifies folds before expensive modelling.

### Diagnostic check

Build `spatial_fold_registry.csv` before scores. Include every observation ID, fold, role, site, spatial block, year and coordinates. For each fold verify:

- training and assessment IDs are disjoint;
- the protected group is disjoint;
- all rows appear in the expected number of assessment rotations;
- neither side is empty;
- target and feature missingness are documented separately by role;
- no preprocessing was fitted before the split;
- the final test registry remains absent.

Map every fold. A table can satisfy group separation while revealing an implausible spatial arrangement, such as isolated assessment points surrounded by training neighbours when the claim concerns spatial extrapolation.

## 7. Compare random, grouped and spatial-block evidence

Use the identical baseline and fixed Chapter 2 XGBoost configuration under three designs:

1. shuffled row-level K-fold;
2. `GroupKFold` using `site`;
3. `GroupKFold` using `spatial_block` or a predeclared coordinate-block field.

Within every fold:

- fit the mean baseline on training targets only;
- fit the fixed model on training rows only;
- predict the held-out rows;
- save observation-level predictions and residuals;
- calculate MAE and RMSE in centimetres;
- calculate skill relative to that fold’s training-derived baseline;
- record training count, assessment count and held-out units.

Then compare distributions: mean, standard deviation, minimum, maximum and individual fold values. Unequal fold sizes mean a pooled observation-level metric and an unweighted mean of fold metrics answer slightly different questions. Report your aggregation rule. For leave-one-site-out, giving each site equal weight can represent “typical site transfer,” whereas pooling gives sites with more plots more influence.

Do not use the comparison to select the least demanding design. Use it to show how the evidence claim changes with separation.

[[CHECK:m3-l10-fold-distribution]]

## 8. Buffered holdout — concept, audit and restraint

For each assessment observation, a buffered design removes training observations closer than distance (d). Compute distance only in a CRS whose units and geometry are appropriate. Longitude and latitude degrees are not metres. The synthetic fixture uses teaching coordinates, so any buffer distance is illustrative rather than geographic evidence.

A buffer audit should report:

- chosen distance and rationale;
- coordinate reference and units;
- minimum train-to-assessment distance before and after buffering;
- rows removed per fold;
- sites or target ranges disproportionately removed;
- folds that become too small;
- sensitivity to at least one plausible alternative distance.

Do not choose (d) by testing many distances and reporting the one with the most attractive score. That is validation-design tuning. If dependence range is estimated from the same observations, document the estimation and uncertainty. When domain knowledge is weak, present buffered analyses as sensitivity evidence.

## 9. Guided practice — one model, three validation designs

1. Add `## Lesson 3.10 — spatial validation comparison` to the cumulative notebook.
2. Copy the Lesson 3.9 validation claim and version it if the destination changes.
3. Create three saved fold registries: random rows, grouped sites and grouped spatial blocks.
4. Run identifier and protected-group overlap assertions for every fold.
5. Draw one fold map per design using identical axis limits, symbols and legend meanings.
6. Fit the fold-local mean baseline and the fixed untuned XGBoost candidate.
7. Save long-format predictions: `design`, `fold`, `observation_id`, `held_out_unit`, `observed_cm`, `prediction_cm`, `residual_cm`.
8. Calculate MAE, RMSE, signed bias and baseline skill per fold.
9. Create a distribution plot that retains individual fold values. With few folds, show points rather than hiding them inside a smooth density.
10. Identify the hardest site or block and inspect target/predictor coverage without changing the model.
11. Write three separate result statements, each naming its withheld unit.
12. Confirm that no result is labelled final-test performance.

## 10. Independent challenge — design a deployable site-transfer experiment

Your research group expects to visit a fifth coastal-meadow site next season. Design the current four-site evidence experiment without opening any future fifth-site data.

Submit a protocol that:

- uses leave-one-site-out as the primary outer design;
- defines whether spatial blocks or years must also remain grouped inside development;
- names the aggregation rule across sites;
- defines a minimum acceptable baseline skill and a stability warning;
- specifies what would make the four-site evidence inadequate;
- preserves one independent future-site test for the eventual deployment decision.

Add a sensitivity plan for spatial blocking or buffering, but do not report invented scores. Explain why a model with excellent mean transfer but catastrophic error at one site may require domain restrictions rather than a celebratory average.

## 11. Common mistakes

### Passing the wrong group

**Why:** any categorical column satisfies the API. **Recognition:** the fold is technically valid but the protected scientific unit crosses the boundary. **Fix:** derive the group from the prediction destination and inspect it on a map. **Consequence:** assessment still contains familiar evidence.

### Confusing leave-one-observation-out with leave-one-site-out

**Why:** both produce many fitted models. **Recognition:** only one row is withheld while its site neighbours remain in training. **Fix:** use site labels with `LeaveOneGroupOut`. **Consequence:** the reported error does not estimate new-site transfer.

### Selecting block size from the best score

**Why:** block size visibly changes performance. **Recognition:** many sizes were tried, but the chosen one has no ecological or operational rationale. **Fix:** predeclare the primary size and report sensitivity. **Consequence:** the validation design becomes another tuned parameter.

### Ignoring fold-size imbalance

**Why:** the splitter produces the requested number of folds. **Recognition:** one fold has few observations or a narrow target range. **Fix:** report counts and aggregation rule; reconsider groups if the intended estimand is unstable. **Consequence:** a mean can be dominated or made noisy by uneven evidence.

### Buffering coordinates in degrees

**Why:** longitude and latitude look numeric. **Recognition:** a “500 m” threshold is applied directly to degree differences. **Fix:** use an appropriate projected CRS or geodesic method and record units. **Consequence:** the claimed separation distance is false.

### Claiming regional transfer from within-region blocks

**Why:** blocks look geographically separate. **Recognition:** all evidence shares the same regional acquisition and ecological context. **Fix:** name the actual withheld domain and acquire independent regional evidence. **Consequence:** a local stress test is oversold as geographic generalisation.

## 12. Scientific interpretation

Expect random-fold scores to be more favourable when nearby or repeated observations share information. Site and block scores may be weaker and more variable. This does not make structured validation “unfair.” It reveals the cost of the operational novelty you requested.

The scientifically useful result is not merely which design has the lowest MAE. It is a map between claims and observed failure. If one site dominates error, ask whether it differs in target range, vegetation structure, acquisition gap, sensor behaviour or predictor coverage. Those diagnostics belong in later chapters; do not silently exclude the site now.

With four sites, uncertainty remains large. State the fold values. A single mean with two decimals implies precision the evidence does not possess.

## 13. Submission

Submit:

- `spatial_validation_comparison.ipynb` with saved folds, maps, assertions, fixed-model evaluation and interpretations;
- `spatial_fold_registry.csv` covering all designs and observations;
- `spatial_validation_results.csv` with fold-level metrics and held-out units;
- the claim-to-split decision table;
- one screenshot comparing fold-level distributions;
- a 350–500 word defence of the primary design and its unsupported claims.

### Portfolio artifact

**Structured Validation Design — Part 2: Spatial Transfer Comparison**

This artifact shows that you can encode a spatial prediction destination as folds, verify the boundary and communicate variability rather than select validation by appearance.

## 14. Reflection

1. Which splitter fits new plots within known sites, and what grouping might still be required?
2. Why are four leave-one-site-out errors four site-transfer experiments rather than 48 independent experiments?
3. When can a buffer improve credibility, and what can it not solve?
4. Which aggregation rule matches your operational decision?
5. What evidence would be required before making a new-region claim?

[[CHECK:m3-l10-buffer]]

## 15. Core references and advanced reading

### Core references

- [scikit-learn 1.9 — GroupKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html)
- [scikit-learn 1.9 — grouped and leave-one-group-out cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html)
- [Roberts et al. (2017) — structured cross-validation in ecology](https://doi.org/10.1111/ecog.02881)

### Optional advanced reading

- [Valavi et al. (2019) — blockCV spatial, buffered and environmental strategies](https://doi.org/10.1111/2041-210X.13107)
- [scikit-learn cross_validate API and multiple metrics](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_validate.html)

### Tested software versions

Python 3.12.13; JupyterLab 4 / Notebook 7; NumPy 2.4.2; pandas 2.2.3; scikit-learn 1.9.0; XGBoost 3.3.0. The fixture coordinates are synthetic teaching values and do not authorise real-world distance claims.
