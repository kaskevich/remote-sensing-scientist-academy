## 1. Problem — make the target measurable before making it predictable

### Learning outcome

By the end of this lesson, you will be able to define a continuous or categorical target; document its unit, protocol, range, zeros, missingness and detection limits; distinguish the target’s observation support from the intended prediction unit; and produce a reviewable `TARGET_SPECIFICATION.md` that prevents the model from silently changing the scientific question.

- **Lesson type:** Target Contract Laboratory
- **Estimated time:** 140–190 minutes
- **Prerequisites:** Lesson 3.1; Module 1 data types, missingness and metadata caution; Module 2 scale, raster cells, spatial support and temporal alignment
- **Portfolio output:** `TARGET_SPECIFICATION.md`

### Why this matters

A model learns the target it is given, not the ecological idea in the researcher’s mind. “Meadow condition,” “biomass” and “habitat quality” are not complete targets. Each may refer to a measurement, a derived score, an expert label or a policy category. Changing the definition changes what success means.

Target ambiguity can survive a complete workflow. Code runs, validation produces a score and a map is exported—yet no reviewer can determine what one predicted value represents. This is especially serious when field plots and raster cells cover different ground, or when measurements and imagery come from different dates.

> **Core lesson:** a target is a documented observation contract, not merely the name of the `y` column.

### Mental model

Define the target through four connected questions:

1. **What property was observed?** Include its operational definition.
2. **How was it observed?** Record protocol, unit, range and quality rules.
3. **Over what support?** State the ground footprint and time represented.
4. **What will receive one prediction?** Name the prediction unit and intended domain.

The target is ready only when another scientist could determine whether a new record belongs to the same measurement system.

## 2. Scientific context — from field values to mapped predictions

The Baltic coastal-meadow group wants to predict vegetation structure from UAV and satellite evidence. Three candidate targets are proposed:

- a field-measured vegetation-height value;
- a three-class ecological-condition label;
- above-ground biomass stored under the field name `AGB` in the published table.

The first two can be explored using the synthetic Module 3 pack because their teaching definitions are supplied. The third must remain restricted: the published record does not document a unit in the material currently supplied to the Academy. Presence of numeric values does not authorise the course to invent a unit or measurement protocol.

This distinction demonstrates an important professional rule. Technical predictability does not repair incomplete target metadata. A model fitted to undocumented numbers may reproduce them, but the result cannot support a scientifically interpretable unit-bearing claim.

## 3. Concept — target type changes the modelling question

### Continuous target

A continuous target represents a numeric quantity for which differences have quantitative meaning. Examples include height in centimetres, chlorophyll concentration under a documented method or percent cover within defined bounds.

Continuous does not mean unconstrained. Record:

- unit;
- physically or procedurally valid range;
- whether negative values are possible;
- whether zeros mean a measured absence or something else;
- measurement precision and detection limit;
- whether transformation may later be considered.

### Categorical target

A categorical target assigns each modelling observation to one of a defined set of labels. A class code must have:

- a name and definition;
- an assignment protocol;
- a reference date or period;
- rules for ambiguous and mixed cases;
- information about class prevalence;
- a distinction between missing, unknown and a valid “other” class.

Integer encoding does not create order. Classes encoded `0`, `1` and `2` are not automatically low, medium and high. If a genuine order exists, document it separately and decide later whether the modelling method should use that information.

### Bounded target

Percent cover, proportions and indices may have fixed bounds. A model can generate values outside those bounds unless the method or post-processing addresses them. Do not silently clip predictions merely to make a map look plausible; record the rule and evaluate how often it is invoked.

### Skewed target and zeros

Biomass and abundance can have many low values and a smaller number of high values. Zeros may be ecologically real, below a detection limit, or codes for missing values. Inspect the observation protocol before choosing a transformation or loss function.

### Detection limits

“Not detected” is not always numeric zero. If the instrument or protocol cannot distinguish values below a limit, the target is censored. A generic regression that treats every such record as exactly zero changes the observation model. Record the condition even if Chapter 1 does not solve it.

## 4. Visual explanation — target support and prediction unit

![A diagram distinguishes a field plot target footprint, a 10 metre raster cell prediction unit, a habitat polygon prediction unit and an object prediction unit, with warnings when their spatial or temporal supports do not match.](lesson-media/images/target-prediction-unit.svg)

### What exactly receives one prediction?

This is the central question of the lesson.

| Prediction unit | One prediction belongs to | Required reconciliation |
|---|---|---|
| field plot | the documented plot footprint and visit | predictor aggregation to the plot support and date |
| raster cell | the ground area represented by a grid cell | target support, mixed pixels, grid and temporal window |
| polygon | a defined management or habitat feature | within-polygon heterogeneity and aggregation rule |
| object | a segmented crown, patch or structural feature | segmentation definition, boundary uncertainty and match rule |

A field plot is not a dimensionless point merely because its centroid is stored as coordinates. A raster cell is not an independent ecological individual merely because it forms one row after extraction. Module 2 established these support ideas; Module 3 uses them to decide what `y` means.

[[CHECK:m3-l2-unit]]

## 5. The target specification

Create one target contract with these fields:

| Field | Required content |
|---|---|
| target | stable machine-readable name and clear human definition |
| target type | continuous, binary, multiclass or another justified form |
| unit | documented unit, or an explicit unresolved status |
| observation method | who or what measured or labelled it, using which protocol |
| spatial support | footprint or feature represented by the observation |
| temporal support | instant, visit, window, composite or period |
| valid range | scientifically and procedurally acceptable values |
| zeros | measured absence, below detection, valid minimum or code? |
| missing values | representation and inclusion/exclusion policy |
| detection limit | value and interpretation, or documented not applicable/unknown |
| prediction unit | entity assigned one output |
| prediction domain | intended places, times, sensors and conditions |
| transformation | none initially, or a later candidate that must be justified inside validation |
| provenance | source, version, licence and target derivation |

Do not fill a field with “N/A” merely to pass a checklist. Use a specific statement: “not applicable because…”, “not documented in supplied metadata” or “unresolved; modelling blocked until…”.

## 6. Worked example — represent a target contract as inspectable data

### Predict before running

Predict whether the final condition will pass. Which field would you refuse to populate by guessing if the source metadata were incomplete?

```python
target = {
    "name": "vegetation_height_cm",
    "type": "continuous",
    "unit": "cm",
    "valid_range": (0.0, 180.0),
    "prediction_unit": "10 m raster cell",
    "spatial_support": "documented field-plot footprint",
    "temporal_support": "field date ± 3 days",
}

required = {"name", "type", "unit", "prediction_unit"}
missing = required - set(target)
if missing:
    raise ValueError(f"Incomplete target contract: {sorted(missing)}")
print(target)
```

### Code walkthrough

1. `target` keeps the scientific definition as named fields rather than disconnected comments.
2. `name` is stable and includes the unit cue, but the separate `unit` field remains authoritative.
3. `type` identifies continuous regression; it does not guarantee that every numeric value is valid.
4. `valid_range` records the accepted teaching range as a tuple with lower and upper bounds.
5. `prediction_unit` says what will receive one output.
6. `spatial_support` records the target observation footprint; its exact dimensions belong in the Markdown specification.
7. `temporal_support` declares the teaching match window. It is an experimental design decision, not a universal standard.
8. `required` lists the minimum fields the small code example can verify.
9. A set difference identifies absent keys.
10. The condition stops the workflow when required structure is incomplete.
11. The error prints missing fields rather than failing later with an obscure key error.
12. The final line displays the contract for human review.

The code cannot verify whether `180 cm` is a scientifically justified maximum or whether ±3 days is suitable. Those decisions require protocol evidence and ecological judgement.

### Diagnostic check

Change `valid_range` to `(180.0, 0.0)`. The required-key check still passes. This is deliberate evidence of a limit: structural validation must be followed by semantic validation. The supplied Academy validator additionally checks that a declared minimum is lower than the maximum, but even that cannot establish the correct ecological range.

## 7. Target traps in the coastal-meadow candidates

### Candidate A — vegetation height regression

Questions to resolve:

- maximum, mean or another field summary?
- height of which vegetation layer?
- centimetres from which reference surface?
- one value per quadrat, plot or visit?
- how close in time must EO predictors be?

### Candidate B — ecological-condition classification

Questions to resolve:

- who assigned the class and for what decision?
- are classes mutually exclusive?
- is there a genuine order?
- how are transitional or uncertain cases recorded?
- does class prevalence in training reflect the prediction domain?

### Candidate C — published `AGB`

The field contains numeric values and missing values, but the Academy must not infer an undocumented unit or sampling protocol. A responsible specification says:

> Target field: `AGB`. Unit and full measurement protocol are not documented in the supplied metadata reviewed for this course. Use is restricted to data-literacy exercises; unit-bearing prediction is blocked pending authoritative metadata.

[[CHECK:m3-l2-unknown-unit]]

## 8. Model clinic — the target changes halfway through the project

**Situation:** the team first defines habitat condition as a field expert’s three-class label. After modelling begins, it replaces the target with a score calculated partly from NDVI because that score is easier to predict from NDVI.

| Question | Diagnosis |
|---|---|
| problem | the target definition changed after seeing predictor behaviour and now partially contains a candidate predictor |
| evidence | target derivation history, formula, dates, source variables and previous experiment plan |
| consequence | performance may reflect mathematical overlap rather than independent ecological prediction |
| fix | restore an independently defined target or explicitly formulate and validate a different project with a new plan |

The issue is not that derived targets are always invalid. The issue is whether the derivation answers the intended environmental question and whether predictors leak into the target.

## 9. Common mistakes and recovery

### Using a broad ecological concept as a target

- **Why it happens:** “condition” or “quality” is meaningful in conversation.
- **How to detect it:** two reviewers cannot decide whether the same example is valid.
- **How to prevent it:** specify the measurement or label protocol and decision purpose.
- **Consequence:** model scores compare inconsistent target meanings.

### Guessing units from a familiar field name

- **Why it happens:** domain experience suggests a plausible convention.
- **How to detect it:** the unit appears in analysis but not in authoritative metadata.
- **How to prevent it:** state the unit as unresolved and block unit-bearing claims.
- **Consequence:** scientifically meaningless errors and maps can be reported with false units.

### Treating missing as zero

- **Why it happens:** algorithms require complete targets and zero is convenient.
- **How to detect it:** missing target counts disappear after data preparation.
- **How to prevent it:** preserve missingness and declare a target-specific exclusion or modelling strategy.
- **Consequence:** absence and non-observation become the same outcome.

### Ignoring target support

- **Why it happens:** a join produces one target beside one raster value.
- **How to detect it:** no one can state the plot footprint, cell size or aggregation rule.
- **How to prevent it:** draw both supports and document their match.
- **Consequence:** the model learns inconsistent spatial averages or mixed phenomena.

### Converting labels to integers and assuming order

- **Why it happens:** encoded values look numeric.
- **How to detect it:** class `2` is described as twice class `1` without an ordinal definition.
- **How to prevent it:** preserve the class dictionary and state whether order exists.
- **Consequence:** the selected objective can impose a false relationship.

### Defining the target after examining model performance

- **Why it happens:** researchers try nearby definitions until one scores well.
- **How to detect it:** target versions and rejected analyses are absent.
- **How to prevent it:** version the target contract and pre-register the primary definition.
- **Consequence:** reported performance includes hidden target-selection optimism.

## 10. Guided practice — audit the target candidates

Download `target_candidate_register.csv` and `TARGET_SPECIFICATION_TEMPLATE.md`.

1. Identify each candidate as continuous, binary, multiclass, bounded, count or unresolved.
2. Separate a valid zero from missing, unknown and below-detection states.
3. Mark every undocumented unit or protocol field.
4. Name the observation support and proposed prediction unit.
5. Decide whether a support conversion is required and what evidence it would need.
6. Assign one status: `eligible`, `eligible with conditions`, `blocked` or `not appropriate for prediction`.
7. Write a reason that another scientist could challenge.

Do not choose the candidate with the fewest missing fields automatically. Choose the target that answers the project need and has sufficient measurement evidence.

[[CHECK:m3-l2-support]]

## 11. Independent challenge — complete `TARGET_SPECIFICATION.md`

Use the target from your Lesson 3.1 Prediction Problem Statement. Include:

- exact target name and human definition;
- regression or classification framing;
- unit or explicit unit-status statement;
- observation and label protocol;
- spatial and temporal support;
- valid range and invalid-value rules;
- meaning of zero;
- missingness and detection-limit treatment;
- prediction unit;
- intended prediction domain;
- target provenance and version;
- unresolved questions;
- proceed, revise or stop decision.

Add a **target–prediction-unit reconciliation** table:

| Issue | Target evidence | Prediction requirement | Decision | Residual risk |
|---|---|---|---|---|

Your decision may be “stop.” Preventing an invalid model is a professional outcome.

## 12. Scientific interpretation

The target contract converts an ecological intention into a falsifiable modelling task. It does not claim that the target is perfect. It exposes how the target was observed, which values it can take, what ground and time it represents, and which unit will later receive a prediction.

This enables later diagnostics. A large residual may reflect model error, target measurement uncertainty, support mismatch or a case outside the prediction domain. Without the contract, those possibilities are blurred.

## 13. Reflection, submission and portfolio artifact

### Reflection

1. What exactly receives one prediction in your project?
2. Which part of the target definition is measured and which is interpreted?
3. Could zero and missing be confused?
4. Which target metadata would block publication if unresolved?
5. Does the target support match the decision scale?

### Submission

Submit:

- `TARGET_SPECIFICATION.md`;
- completed `target_candidate_register.csv`;
- one target–prediction-unit diagram or annotated screenshot;
- a 220–320 word defence of the chosen target and one rejected alternative.

### Portfolio artifact

**Artifact 3.2 — Target and Prediction Unit Contract**

Store the contract beside the Lesson 3.1 Prediction Problem Statement. If the target changes later, create a new version and record why; never overwrite the decision history silently.

## 14. Core references and advanced reading

- [scikit-learn glossary and target types](https://scikit-learn.org/stable/glossary.html)
- [Baltic coastal plant traits 2024 dataset record](https://doi.org/10.5281/zenodo.20083250)
- [FAIR Guiding Principles](https://www.go-fair.org/fair-principles/)
- [OGC standards catalogue](https://www.ogc.org/standards/)

### Tested software versions

Python 3.12.13, NumPy 2.4.2, pandas 2.2.3, scikit-learn 1.9.0 and XGBoost 3.3.0. The example uses core Python; the environment record is shared with the continuing Module 3 project.

### Species-to-response bridge

One row should represent the declared plot-level observation. CCI CWM, leaf-area CWM, height or AGB can be ecological responses; UAV bands, indices and DSM-derived structure can be predictors. Species and trait evidence constructs and interprets the response—it is not the raster predictor itself. [Inspect the Field-to-EO pipeline](/species/from-field-to-earth-observation/).
