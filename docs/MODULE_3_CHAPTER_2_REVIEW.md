# Module 3 Chapter 2 quality review

## Scope

This review covers Lessons 3.5–3.8 of **Remote Sensing Modelling**:

1. What Does a Useful Model Need to Beat?
2. Trees, Ensembles and Boosting
3. XGBoost from First Principles
4. Train the First Defensible XGBoost Model

The review checks vertical lesson quality and horizontal integrity with Chapter 1, later validation chapters and the Environmental Monitoring Project. It does not certify the model for ecological use. The Chapter 2 fixture is entirely synthetic.

## Review summary

| Lens | Score / 5 | Finding |
|---|---:|---|
| Remote-sensing scientist | 4.6 | EO predictors retain measurement, support and proxy cautions; no algorithm is allowed to repair a weak observation chain |
| Spatial ML researcher | 4.4 | split limitations are explicit and Chapter 3 is a mandatory next gate; Chapter 2 intentionally does not claim spatial transfer |
| Statistical-learning reviewer | 4.6 | comparator choice, error skill, bias–variance intuition and additive objectives are explained without turning one split into generalisation proof |
| XGBoost specialist | 4.7 | objective, gradients, Hessians, regularised gain, shrinkage, missing routing, model IO and primary parameters are connected to behaviour |
| Scientific reproducibility reviewer | 4.7 | data/split/schema/model/metadata identities and save–reload verification form a strong handover chain |
| Ecologist/domain scientist | 4.5 | feature signals remain proxies and the synthetic fixture is separated from the published Baltic record throughout |
| Intermediate learner | 4.5 | concepts progress from a comparator control to one tree, ensembles, XGBoost mechanism and a complete model package |
| Hiring-manager/portfolio reviewer | 4.6 | artifacts show judgement, traceability and model handover rather than only library usage |
| UX/accessibility reviewer | 4.5 | four lessons use existing accordions, large explanatory SVGs, descriptive alternatives and established learner controls |

**Overall:** 4.57 / 5. The chapter is ready as a reviewed development release. It is not the validation or optimisation chapter.

## Scientific integrity checks

### Passed

- Every baseline is fitted on training targets only.
- Baseline and candidate comparisons require identical validation IDs.
- Mean, median and a transparent feature-aware model answer different comparator questions.
- Error skill names the underlying metric and comparator.
- Tree thresholds are presented as fitted predictive partitions, not ecological laws.
- Random Forest averaging and gradient-boosting addition are distinguished precisely.
- XGBoost is taught through objective, additive updates and regularisation before API fitting.
- Missing-value routing is separated from scientific missingness policy.
- The first candidate is intentionally untuned.
- The sealed final test cannot influence Chapter 2 development.
- Model JSON is accompanied by explicit experiment metadata and a feature schema.
- Reload verification checks predictions, not merely file existence.

### Boundaries retained for later chapters

- The saved Chapter 2 split is instructional and does not support new-site, new-region or future-time claims.
- Parameter optimisation, early stopping and model selection remain in Chapter 4.
- Residual geography, feature interpretation and applicability remain in Chapter 5.
- Prediction intervals and empirical coverage remain in Chapter 6.
- The synthetic fixture is not suitable for ecological inference or operational mapping.

## Prerequisite and repetition audit

The lessons retrieve, but do not reteach:

- Python, pandas, arrays and plotting from Module 1;
- EO variable construction, support, sampling, QA and spatial dependence from Module 2;
- target, predictor, modelling-row and experiment contracts from Module 3 Chapter 1.

New assessed knowledge is baseline control, error skill, tree/ensemble mechanisms, XGBoost optimisation logic, model serialization and evidence-preserving handover. More than three quarters of the assessed work is therefore new modelling judgement.

## Artifact continuity

| Lesson | Artifact | Contribution to Environmental Monitoring Project |
|---|---|---|
| 3.5 | Baseline Evidence Report | fixes the comparator ladder and usefulness rule |
| 3.6 | Tree Ensemble Mechanism Audit | explains what candidate families compute |
| 3.7 | XGBoost Parameter Decision Record | documents objective and parameter-effect hypotheses |
| 3.8 | First Defensible XGBoost Candidate | preserves model, schema, metadata, predictions and reload evidence |

The artifacts are cumulative. None replaces the target, predictor or experiment contracts from Chapter 1.

## Software and source review

Technical content was checked against stable XGBoost 3.3 documentation and scikit-learn 1.9 documentation. Primary sources cover dummy estimators, tree and ensemble behaviour, boosted-tree objectives, parameter definitions, the scikit-learn estimator interface and JSON model IO. Peer-reviewed foundations are included for Random Forest, gradient boosting and XGBoost.

## Accessibility and mobile review gate

The chapter uses the existing responsive lesson component rather than a new layout. SVGs include `<title>` and `<desc>`, use the Module 3 terracotta palette and remain concept-driven. The release gate still requires automated browser checks at mobile, tablet and desktop widths, direct-link opening for Lesson 3.5 and a no-horizontal-overflow assertion.

## Release recommendation

Approve Chapter 2 when lint, type checks, unit/content tests, browser smoke tests and the production static build all pass. The next branch should implement Chapter 3 without revising Chapter 2 validation scores into stronger claims.
