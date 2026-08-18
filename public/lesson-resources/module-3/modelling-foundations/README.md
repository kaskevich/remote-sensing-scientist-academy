# Module 3 Chapter 1 — Modelling Foundations training pack

This pack supports Lessons 3.1–3.4 of Remote Sensing Scientist Academy.

## Scientific status

All CSV records in this folder are entirely synthetic teaching evidence. They are not measurements from the Baltic coastal plant traits 2024 dataset and must not be presented as real ecological results. The Baltic dataset supplies the continuing scientific context only. Its current public CSV does not provide the coordinates and complete target metadata required to construct the model-ready EO table used here.

## Deliberate defects

`modelling_observation_fixture.csv` contains controlled defects for audit practice:

- one duplicate `observation_id`;
- one included record with a missing target;
- one malformed date;
- one record without a fold assignment;
- one excluded record without an adequate exclusion reason.

Do not edit the fixture. Produce a documented derivative and preserve an audit table showing every issue and decision.

## Files

- `scientific_statement_cards.csv` — claim-type classification exercise for Lesson 3.1
- `target_candidate_register.csv` — target-definition audit for Lesson 3.2
- `TARGET_SPECIFICATION_TEMPLATE.md` — target and prediction-unit contract
- `predictor_candidate_register.csv` — predictor eligibility and leakage exercise for Lesson 3.3
- `predictor_hypotheses_template.csv` — required predictor-register schema
- `modelling_observation_fixture.csv` — deliberately imperfect modelling table for Lesson 3.4
- `data_dictionary_template.csv` — model-ready field documentation structure
- `MODEL_EXPERIMENT_PLAN_TEMPLATE.md` — pre-registration structure
- `manifest.json` — file purpose, licence and SHA-256 identity

## Licence

The synthetic teaching files are released under CC0-1.0. External publications linked from lesson references retain their own licences and terms.
