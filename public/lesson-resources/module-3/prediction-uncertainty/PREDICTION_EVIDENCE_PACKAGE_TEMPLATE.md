# Prediction Evidence Package

## Identity

- Target and unit status:
- Prediction unit and time:
- Model version:
- Feature-schema version:
- Interval method, nominal level and calibration version:
- Applicability-rule version:
- Release-policy version:

## Aligned layer inventory

| Layer | Question answered | Dtype / NoData | Grid checksum | Semantic checksum | Public treatment |
|---|---|---|---|---|---|
| Prediction | What value is predicted? |  |  |  |  |
| Lower bound | What is the lower interval bound? |  |  |  |  |
| Upper bound | What is the upper interval bound? |  |  |  |  |
| Interval width | How wide is the represented predictive interval? |  |  |  |  |
| Applicability | Where is training support relevant? |  |  |  |  |
| Release state | What use does policy permit? |  |  |  |  |
| Release reason | Why was review or withholding triggered? |  |  |  |  |

## Release precedence

1. Invalid input → NoData.
2. Outside applicability → withhold.
3. Supported or review applicability with interval width above the frozen limit → review.
4. Supported, input-valid and within the width policy → supported release.

## Coverage evidence

- Nominal level:
- Empirical protected coverage and count:
- Independent-group count:
- Failed sites / folds / periods:
- Coverage by applicability:

## Accessible communication

- Separate prediction, uncertainty, applicability and release panels
- Units or explicit unit-status wording
- Text summary of state proportions and affected regions
- Alternative text describing the important spatial pattern

## Intended and unsupported use

- Intended:
- Requires expert review:
- Withheld / unsupported:
- New evidence required:
