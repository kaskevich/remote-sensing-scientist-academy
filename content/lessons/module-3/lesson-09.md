## 1. Problem — a model score is inseparable from the evidence withheld

### Learning outcome

By the end of this lesson, you will be able to distinguish training, validation and final-test evidence; explain generalisation error as performance on the destination represented by withheld observations; identify proximity leakage; compare a random split with a site-separated split; and write a validation claim that names the prediction unit, withheld unit, place, time and evidence boundary.

- **Lesson type:** Validation Claim and Evidence Laboratory
- **Estimated time:** 170–230 minutes
- **Prerequisites:** Lessons 3.1–3.8, especially the frozen experiment plan, saved Chapter 2 split, baseline report and first XGBoost candidate; Module 2 knowledge of spatial autocorrelation and spatial support
- **Portfolio outputs:** `validation_claim.md`, `split_overlap_audit.csv`, and Lesson 3.9 checkpoint in `Environmental_Monitoring_Project_Starter.ipynb`

### Why this matters

Remote-sensing observations are not interchangeable tokens. Two plots metres apart can share soil, management history, vegetation structure, illumination and pixels from the same image. Repeated observations from one location can share everything except date. If one enters training and its near twin enters validation, a model may appear capable of transfer when it has only interpolated among familiar conditions.

A headline such as “validation MAE = 3.2 cm” is therefore incomplete. The number acquires meaning only after the reader knows what was withheld. A random plot? A spatial block? An entire site? A later year? A site and year together? Each design tests a different operational question.

> **Core lesson:** validation is part of the model because the split defines which form of novelty the performance claim has actually survived.

### Mental model

Treat validation as a scientific instrument:

```text
intended prediction destination
          ↓
unit that must be withheld
          ↓
fold construction + separation audit
          ↓
training-only fit and prediction
          ↓
fold-level errors + failure diagnostics
          ↓
claim bounded to the evaluated destination
```

Changing the folds changes the instrument. The resulting scores do not answer the same question and should not be ranked as though only the model changed.

## 2. Scientific context — what does “new” mean in the Environmental Monitoring Project?

The cumulative project predicts the synthetic teaching target `vegetation_height_cm` from EO and UAV predictors. Chapter 2 used a fixed instructional split to establish a reproducible baseline and first model. That split was useful for learning the fit–predict–evaluate chain, but it was not yet justified as evidence for spatial transfer.

Chapter 3 introduces `structured_validation_data.csv`, containing 48 synthetic observations across four invented site codes, four blocks per site and three years. Coordinates are a synthetic metre-based teaching grid, not real geographic positions. The fixture is deliberately structured so you can ask distinct questions:

- Can the model predict another observation among represented sites?
- Can it predict a withheld block within the study system?
- Can it transfer to an entirely withheld site?
- Can it predict a later season?
- Can it survive both spatial and temporal separation?

These are ordered by neither prestige nor universal difficulty. The correct design is the one that approximates the intended use. A conservation team filling gaps inside monitored sites needs different evidence from a team deploying a model across an unvisited coast.

## 3. Concept — training, validation, test and generalisation

### Training performance

Training performance measures error on observations used to fit the model. It is useful for diagnostics: very poor training performance can indicate underfitting, a broken pipeline or inadequate predictors. It is not an independent estimate of generalisation because the model was explicitly adjusted to those targets.

### Validation performance

Validation evidence supports development decisions. It can compare models, features, preprocessing choices and later hyperparameters. In cross-validation, several training/assessment rotations provide repeated estimates. Because validation results influence development, they are not the final untouched test.

### Final-test performance

The final test is opened after the modelling procedure is fixed. It estimates the performance of the complete selected procedure on evidence that made no contribution to feature design, tuning, stopping, threshold selection or validation-architecture choice. Repeatedly checking a test set converts it into development data, regardless of what the file is named.

### Generalisation error

Generalisation error is expected error on the intended destination population or domain. A cross-validation score estimates it only to the extent that the held-out folds represent that destination. Randomly withheld neighbours can estimate interpolation among similar observations. They cannot, by themselves, estimate transfer to another site or region.

### Cross-validation

Cross-validation rotates which observations are held out. For each fold, the model and every learned transformation are fitted on that fold’s training rows and scored on its assessment rows. Report the distribution of fold errors, not only the pooled value. A mean can conceal one site where the workflow fails badly.

### Leakage by proximity

Proximity leakage occurs when assessment observations have training neighbours that share information the deployment destination would not provide. The leak may be geographic, temporal or procedural. Adjacent raster chips can overlap. Several field plots can sample the same management unit. Pixels derived from one polygon can appear in different folds. Multiple dates can repeat a location. A random splitter cannot detect those scientific relationships unless you encode them.

[[CHECK:m3-l9-generalisation]]

## 4. Visual explanation — random mixing versus spatial separation

![Two maps compare intermingled random training and assessment plots with a spatially separated assessment block; the first supports evidence among nearby represented conditions while the second tests transfer to withheld space.](lesson-media/images/random-vs-spatial-validation.svg)

In the left panel, assessment squares sit among training circles. The model can exploit relationships learned from close neighbours. In the right panel, assessment observations occupy a withheld spatial area. The separation is more representative of a spatial-transfer claim, although its adequacy still depends on block size, buffers, environmental coverage and the actual deployment destination.

The diagram does not say that spatial separation is always “better.” It says that the designs answer different questions. A strict regional holdout may waste information if the operational task is interpolation inside the same monitored field. Conversely, a random split can be dangerously optimistic when the deliverable is a map for unobserved sites.

## 5. Write the claim before constructing the split

Complete these sentences before code:

1. One prediction will be made for **[prediction unit]**.
2. The workflow will be used at **[represented places, times and sensor conditions]**.
3. The validation design must approximate prediction for **[new plot / new block / new site / future time / combined novelty]**.
4. Therefore, every assessment fold must withhold **[grouping unit]** from model fitting and learned preprocessing.
5. The result will not support **[unsupported destination]**.

A useful example is:

> We estimate vegetation height for 10 m cells in represented Baltic coastal-meadow conditions. Site-grouped validation assesses transfer to an entirely withheld synthetic site code. It does not establish performance in another region, season, sensor generation or habitat type.

Notice the restraint. “Withheld site” does not mean “all unseen coastlines.” The four synthetic site codes contain a narrow designed range and are not field evidence.

## 6. Worked example — audit a random and site-separated split

### Predict before running

The dataset contains twelve observations per site. Predict whether a random 25% holdout will place at least one site in both training and assessment. Then predict the overlap for a group-aware split that withholds whole sites. Write why the first outcome can make error look smaller even when no rows are literally duplicated.

```python
import pandas as pd
from sklearn.model_selection import GroupShuffleSplit, train_test_split

data = pd.read_csv("data/structured_validation_data.csv")
indices = data.index.to_numpy()
random_train, random_test = train_test_split(
    indices, test_size=0.25, random_state=42
)
group_split = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=42)
group_train, group_test = next(
    group_split.split(data, groups=data["site"])
)

def shared_sites(train_index, test_index):
    train_sites = set(data.loc[train_index, "site"])
    test_sites = set(data.loc[test_index, "site"])
    return sorted(train_sites & test_sites)

print("Random shared sites:", shared_sites(random_train, random_test))
print("Grouped shared sites:", shared_sites(group_train, group_test))
```

### Code walkthrough

1. pandas reads the versioned synthetic fixture.
2. `GroupShuffleSplit` and `train_test_split` create two different evidence designs.
3. `indices` preserves row identity so the audit can inspect metadata after splitting.
4. The random split selects individual observations without knowing that sites exist.
5. The fixed seed makes this comparison reproducible; it does not make the design scientifically appropriate.
6. `GroupShuffleSplit` receives the `site` column through `groups`.
7. The splitter keeps each site wholly on one side of the boundary for this split.
8. `shared_sites` constructs the set of training sites and the set of assessment sites.
9. The intersection reports any site appearing on both sides.
10. A non-empty random result is expected because observations, not sites, were separated.
11. The grouped intersection should be empty. If it is not, the fold violates its stated contract and scoring must stop.

The example audits one structural property. It does not yet train XGBoost, measure distances, choose a block size or prove that four sites represent the desired deployment coast.

### Diagnostic check

For each split, save a ledger with `observation_id`, `role`, `site`, `spatial_block`, `year`, `x_m` and `y_m`. Assert that identifiers are disjoint and count shared sites, blocks and repeated coordinate locations. Map the roles. A zero site overlap is necessary for new-site validation but not sufficient: the held-out site may occupy predictor conditions absent from training, and the small number of sites can make the estimate unstable.

## 7. Model clinic — why a clean random score can be misleading

Suppose the first XGBoost candidate obtains validation MAE of 2.8 cm under random splitting and 7.1 cm when one site is withheld. Do not describe grouped validation as “making the model worse.” The fitted algorithm may be identical. The destination changed from nearby represented observations to a new site.

Investigate four possibilities:

- **spatial dependence:** neighbours share target and predictor patterns;
- **site signature:** the model learns site-specific ranges that do not transfer;
- **covariate shift:** the withheld site contains predictor combinations absent from training;
- **small-group uncertainty:** one difficult site strongly affects the mean across four folds.

The gap between scores is evidence about transfer, not an inconvenience to hide. Report both only when their claims are labelled. Never average them into one “overall accuracy.”

[[CHECK:m3-l9-proximity]]

## 8. Guided practice — build the validation claim and overlap audit

1. Add `## Lesson 3.9 — validation claim` to the cumulative notebook.
2. Read the training-pack README and label the fixture as synthetic in the first Markdown cell.
3. Write one operational question for predicting a new plot within known sites and one for predicting a new site.
4. For each question, name the unit that must be withheld.
5. Run the worked example and save the random and grouped roles to `split_overlap_audit.csv`.
6. Check identifier, site and block overlap. Do not rely on the splitter name as proof.
7. Draw two small scatter maps using `x_m`, `y_m` and split role. Use equal axis scaling so distance is not visually distorted.
8. Fit the Chapter 2 mean baseline inside each training partition and calculate assessment MAE. The constant must be learned separately for each split.
9. Fit the fixed untuned Chapter 2 XGBoost configuration without changing parameters.
10. Save row-level predictions with the design name and observation ID.
11. Report training and assessment MAE for both designs plus the difference between them.
12. Write why the random and grouped results estimate different forms of novelty.

If package execution is unavailable, complete the ledger, overlap audit and predicted result structure. Do not invent metric values.

## 9. Independent challenge — defend one validation design

Choose one scenario:

- fill unmapped cells inside the four monitored site codes;
- deploy to a fifth, entirely unobserved coastal-meadow site;
- make next-year predictions at the same sites.

Write `validation_claim.md` with target, prediction unit, destination, withheld unit, splitter, primary metric, baseline, expected dependence and unsupported claim. Then inspect the fixture and propose the correct metadata field or derived group for the split. Include two failure checks that would invalidate the folds before training.

Do not select a design because it gives a favourable score. Your defence must begin with the deployment question. If the fixture cannot represent the scenario, say so and specify what new evidence would be required.

## 10. Common mistakes

### Calling every held-out subset a test set

**Why it happens:** Tutorials use “test” for any temporary holdout. **Recognition:** the same rows influence repeated model choices. **Fix:** call them validation or outer-assessment evidence and reserve final test for the untouched end-stage evaluation. **Scientific consequence:** repeated consultation produces an optimistic final claim.

### Assuming cross-validation removes all bias

**Why it happens:** Rotation sounds comprehensive. **Recognition:** folds rotate individual rows while sites, neighbours or years cross the boundary. **Fix:** encode the dependence unit and audit overlap. **Scientific consequence:** the model is evaluated on familiar rather than operationally novel evidence.

### Treating a fixed seed as scientific validity

**Why it happens:** reproducibility and appropriateness are conflated. **Recognition:** the split repeats exactly but still contradicts the destination claim. **Fix:** justify the unit withheld, then record randomness. **Scientific consequence:** a precisely reproducible error estimate can still answer the wrong question.

### Reporting only the pooled score

**Why it happens:** one number is easy to compare. **Recognition:** difficult folds disappear inside the average. **Fix:** report fold results, mean, spread, range and worst transfer. **Scientific consequence:** decision-makers cannot see where failure is concentrated.

### Choosing the validation design after seeing scores

**Why it happens:** the least demanding design produces a more attractive result. **Recognition:** the experiment record contains several split trials but only one favourable design is reported. **Fix:** freeze the validation claim and design before model comparison; preserve amendments. **Scientific consequence:** the score reflects hindsight selection.

## 11. Scientific interpretation

If grouped performance is weaker than random performance, the defensible statement is that the candidate transfers less successfully across the withheld site structure than it interpolates among randomly withheld observations in this synthetic fixture. The result does not reveal the single cause. It motivates diagnostics of site coverage, predictor range, target protocol, acquisition conditions and residual structure.

If the scores are similar, do not claim spatial dependence is absent. The fixture may have weak site effects, too few sites or a block structure smaller than the relevant dependence range. Validation is empirical evidence under a design, not proof that every untested dependency has disappeared.

## 12. Submission

Submit:

- the executed Lesson 3.9 notebook checkpoint with random and site-separated ledgers, maps and baseline/model comparisons;
- `validation_claim.md` naming the supported and unsupported destination;
- `split_overlap_audit.csv` with stable observation identifiers and overlap results;
- one screenshot showing the two split maps at equal scale;
- a 250–350 word interpretation explaining why the scores answer different questions.

### Portfolio artifact

**Structured Validation Design — Part 1: Validation Claim and Separation Audit**

The artifact demonstrates that you can turn an operational prediction destination into a reviewable evidence split, verify its structure and bound the resulting claim.

## 13. Reflection

1. What exactly is “new” in your chosen prediction claim?
2. Which relationship could cross a random fold without creating a duplicate row?
3. Why is final-test evidence different from repeated validation evidence?
4. What would an unexpectedly large random-to-grouped performance gap make you investigate?
5. Which claim remains unsupported even if site overlap is zero?

[[CHECK:m3-l9-test-firewall]]

## 14. Core references and advanced reading

### Core references

- [scikit-learn 1.9 — cross-validation and grouped splitters](https://scikit-learn.org/stable/modules/cross_validation.html)
- [Roberts et al. (2017) — cross-validation for structured ecological data](https://doi.org/10.1111/ecog.02881)

### Optional advanced reading

- [Valavi et al. (2019) — spatial and environmental blocking](https://doi.org/10.1111/2041-210X.13107)
- [scikit-learn common pitfalls — leakage and pipelines](https://scikit-learn.org/stable/common_pitfalls.html)

### Tested software versions

Python 3.12.13; JupyterLab 4 / Notebook 7; NumPy 2.4.2; pandas 2.2.3; scikit-learn 1.9.0; XGBoost 3.3.0. Check the current API documentation when using a different environment, especially group metadata routing and splitter options.
