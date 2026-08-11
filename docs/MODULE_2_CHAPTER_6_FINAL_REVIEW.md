# Module 2 Chapter 6 final review

## Review decision

Chapter 6 is ready for learner review as the Spatial Statistics and Geostatistics foundation of Module 2. The four lessons follow one decision sequence: define the represented population, state a spatial relationship hypothesis, test pattern under that hypothesis, validate prediction across separated geography and restrict claims to the evidence.

The chapter does not teach statistical packages as proof of sophistication. Spatial weights, sampling design, variograms, interpolation and spatial regression remain conditional models whose domain, support and uncertainty must be visible.

## Quality findings

| Dimension | Finding |
| --- | --- |
| Spatial autocorrelation | Moran's I is taught with explicit weights, transformation, islands, edge effects, expected value and permutation inference |
| Sampling design | Target population, frame, design, realised sample and QA analysis set remain separate; accessibility and unknown inclusion probabilities are preserved |
| Interpolation | IDW, trend and ordinary kriging are compared through continuity assumptions, empirical variograms and separated spatial holdouts |
| Geostatistical uncertainty | Nugget, sill, range, anisotropy and kriging variance are presented as model concepts rather than direct truth |
| Spatial regression | An ordinary baseline and mapped residuals precede lag, error, SLX and GWR concepts; alternatives require a process hypothesis |
| Validation | Predeclared geographic blocks are used consistently to expose spatial leakage and unsupported transfer |
| Beginner accessibility | Each lesson develops one main decision, predicts before execution and explains every worked-example line |
| Reproducibility | The synthetic pack records source status, local coordinate meaning, frame restrictions, review observations, validation blocks and SHA-256 checksums |
| Portfolio value | Four lesson artifacts culminate in Artifact 2.F, a bounded Spatial Inference and Validation Package |

## Scientific safeguards

- No real EPSG code is assigned to synthetic local coordinates
- Spatial autocorrelation is never described as ecological cause
- Weights are predeclared and compared rather than selected by significance
- K-nearest-neighbour weights cannot hide the isolated plot without a visible long-link diagnostic
- Inaccessible frame cells and convenience observations remain in the evidence record
- A larger convenience sample is never described as repairing selection bias
- Smooth interpolation is never accepted without separated spatial validation
- Kriging variance remains distinct from observed prediction error
- Prediction outside credible spatial support is marked as extrapolation
- Ordinary regression diagnostics precede any spatial alternative
- Spatial lag, spatial error, SLX and GWR retain different process meanings
- NDVI–biomass results remain observational associations

## Training-pack review

The Chapter 6 pack is compact and entirely synthetic under CC0-1.0. It includes 24 plot observations, a 36-cell sampling frame, predeclared validation blocks, a spatial-inference QA template and a SHA-256 manifest. Deliberate conditions include a roadside convenience cluster with undocumented inclusion probabilities, inaccessible frame cells, an edge observation and one isolated targeted plot outside the core frame.

The pack supports reasoning, audit logic and short code practice. It does not reproduce the sample size, covariance complexity, temporal dependence or regulatory design requirements of a production ecological survey.

## Known limits and deferred depth

- Local indicators of spatial association are deferred beyond an optional, corrected exploratory appendix
- Formal survey estimators, multi-stage variance estimation and adaptive designs require a specialist sampling course
- Variogram estimation uncertainty, co-kriging, spatiotemporal geostatistics and Bayesian spatial models are deferred
- Spatial-regression estimation is conceptual and diagnostic; the small synthetic sample does not support production inference
- Causal spatial analysis is explicitly outside this observational chapter
- Full predictive modelling, spatial cross-validation pipelines and uncertainty maps continue in the later modelling stage

## Verification record

- all four lesson manuscripts exceed 1,700 words and contain the full Academy lesson architecture
- every lesson includes three formative checks, a complete submission, rubric and portfolio artifact
- all worked Python examples are syntax-checked and limited to 20 lines
- all five training-pack asset checksums are verified automatically
- the portfolio starter is extended through Lessons 2.31–2.34 and Chapter 6 Practicum
- ESLint, TypeScript, 155 automated tests and the production static export pass
- 11 browser smoke tests pass, including public/admin overflow checks at 320, 375, 768 and desktop widths

## Final benchmark statement

A learner who completes Chapter 6 should be able to explain why spatial dependence changes inference, audit how field locations entered the evidence, compare interpolation under genuine geographic holdouts, diagnose residual spatial structure and issue a restricted release decision. That is the required foundation before databases, multidimensional data, production workflows and later predictive modelling.
