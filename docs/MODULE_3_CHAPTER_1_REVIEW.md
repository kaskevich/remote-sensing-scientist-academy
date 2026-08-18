# Module 3 Chapter 1 review

## Review status

Chapter 1 is ready for draft review. It is intentionally the only teaching chapter released in this branch; later chapters remain planned until the evidence contract below has been tested with learners and reviewers.

| Review lens | Result | Evidence and remaining risk |
|---|---|---|
| Remote-sensing science | Pass | Target, support, sensor/product context and prediction domain are explicit. Real target units must still be checked against authoritative metadata before any real-data model. |
| Statistical reasoning | Pass | Prediction, explanation and causality are separated; final-test independence is introduced before fitting. Later chapters must implement the promised structured validation. |
| Python progression | Pass | Code is short and inspectable, extends Module 1 skills and does not make algorithm syntax the learning outcome. |
| Curriculum continuity | Pass | All four lessons grow one Environmental Monitoring Project notebook and end in a frozen experiment contract for Chapter 2. |
| Non-duplication | Pass | The prerequisite map identifies prior Python/GIS/EO capabilities and assesses new modelling decisions. |
| Beginner comprehensibility | Pass with monitoring | Terms are defined before use and examples are staged. Lesson 3.4 is conceptually demanding; facilitator feedback should test whether 180–240 minutes is realistic. |
| Scientific caution | Pass | Undocumented units are labelled unresolved, synthetic fixtures are clearly identified and predictive usefulness is not called causality. |
| Practical evidence | Pass | Templates, imperfect fixture, notebook checkpoints, code walkthroughs and independent challenges produce inspectable artifacts. |
| Accessibility and responsive design | Pending automated verification | SVGs contain titles/descriptions and use text plus structure, not colour alone. Browser checks must confirm controls, reading order and overflow. |
| Reproducibility and software QA | Pending automated verification | Runtime validators and fixtures are present. Lint, typecheck, unit, browser and production-build results are recorded in the pull request. |

## Release decision

Release Chapter 1 as a **draft learning sequence** after automated checks pass. Do not mark Chapters 2–7 or the capstone available. Reviewers should focus on whether the learner can state a bounded prediction problem and detect leakage before encountering any fitted model.
