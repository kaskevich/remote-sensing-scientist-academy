# Module 3 Chapter 4 controlled-optimisation training pack

This pack supports Lessons 3.13–3.16 of **Remote Sensing Modelling**. Every numeric record is deterministic, synthetic teaching evidence. The records are not observations from the Baltic coastal plant-traits dataset and must not be used to claim real model performance, habitat prevalence or ecological relationships.

## Evidence roles

- `search_results_fixture.csv` is a compact record of a bounded inner search across three synthetic spatial blocks. It teaches candidate comparison and selection instability; it is not an outer assessment.
- `learning_dynamics_fixture.csv` contains selected rounds from three synthetic learning histories. It teaches underfit, controlled and overfit diagnosis; it is not the output of a fitted Academy production model.
- `feature_stability_fixture.csv` contains synthetic fold-level permutation relevance. Values describe the fixture only and do not establish causal or sensor importance.
- `rare_habitat_probabilities.csv` contains synthetic labels, sites and development probabilities for threshold arithmetic. “Rare habitat” is a teaching class, not a mapped ecological claim.
- the four templates preserve design decisions before protected evidence is inspected.

The Chapter 3 Structured Validation Design remains the governing architecture. Parameter, stopping, feature and threshold decisions occur inside development evidence. Outer assessment evaluates the complete procedure. The final test remains sealed.

## Suggested order

1. Complete `TUNING_PROTOCOL_TEMPLATE.md` before opening the search-result fixture.
2. Diagnose every run in the learning-dynamics fixture and complete `LEARNING_DYNAMICS_TEMPLATE.md`.
3. Preserve fold-level feature patterns in `FEATURE_STABILITY_TEMPLATE.csv`; do not reduce them to one causal ranking.
4. Complete `THRESHOLD_DECISION_TEMPLATE.md` before comparing rare-habitat thresholds.
5. Verify file hashes against `manifest.json`.

## Licence and citation

Academy-authored synthetic teaching fixtures and templates are released under CC0-1.0. Scientific context is informed by the Baltic coastal plant-traits record at <https://doi.org/10.5281/zenodo.20083250>, but none of these rows are measurements from that record.
