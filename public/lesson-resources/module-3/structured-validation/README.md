# Module 3 Chapter 3 — structured validation training pack

This pack supports Lessons 3.9–3.12 of the Environmental Monitoring Project.

## Data status

`structured_validation_data.csv` is a **synthetic teaching fixture**. Its site codes, coordinates, dates, predictors and target values are designed to expose spatial and temporal validation behaviour. They are not observations from the published Baltic coastal plant-traits dataset and must not be cited as field evidence.

The fixture represents 48 modelling observations from four invented coastal-meadow site codes, four spatial blocks per site and three growing seasons. Coordinates use a synthetic metre-based teaching grid, not a real coordinate reference system. The target remains `vegetation_height_cm`, with centimetres used only inside this synthetic exercise.

## Files

- `structured_validation_data.csv` — modelling observations with site, block, year, coordinates, target, predictors and saved example folds
- `VALIDATION_DESIGN_TEMPLATE.md` — claim-first validation protocol and results structure
- `fold_registry_template.csv` — auditable row-level assignment structure for random, grouped, temporal and nested roles
- `LEAKAGE_CHECKLIST.md` — release gate for transformations, duplicates, neighbours, time, selection and final-test isolation
- `manifest.json` — SHA-256 checksums for the four instructional files

## Scientific use

Use this pack to compare validation designs, not to discover the best possible score. The intended progression is:

1. declare whether the claim concerns new plots, new blocks, new sites or future observations;
2. construct folds from the relevant grouping or time field;
3. prove that protected groups do not overlap between training and assessment rows;
4. fit every preprocessing step and model using training rows only;
5. save one prediction per held-out observation;
6. report fold-level errors and their spread, not only a pooled mean;
7. keep the Academy final test sealed.

`random_fold` is included as a deliberately permissive comparison. It is not automatically an acceptable design for spatial transfer. `site_fold`, `spatial_fold` and `year` provide alternative structures whose relevance depends on the operational prediction claim.

## Reproducibility contract

Do not regenerate folds silently. Save the selected design, group field, ordering rule, random seed when relevant, buffer rule, excluded rows, package versions and observation-level predictions. If the intended prediction domain changes, create a new validation-design version rather than relabelling the existing result.

