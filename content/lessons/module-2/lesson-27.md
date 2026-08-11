---
title: Vegetation and Spectral Indices
lessonId: lesson-2-27
---

## 1. Treat an index as a question about spectral contrast

### Learning outcome

By the end of this lesson, you will be able to calculate NDVI, GNDVI, SAVI and MSAVI from correctly scaled reflectance; construct a joint validity mask and safe denominator rule; explain what each formula emphasises; compare index behaviour across soil, canopy and atmospheric conditions; and communicate an index as a sensor- and context-dependent proxy rather than a direct ecological measurement.

- **Lesson type:** Spectral-index interpretation lab
- **Estimated time:** 160–190 minutes
- **Prerequisites:** Lesson 2.26 product levels, band support, scaling and quality masks
- **Portfolio output:** `spectral_index_comparison.ipynb`

### Why this matters

Vegetation indices are among the most familiar products in Earth Observation. Their familiarity creates risk. A compact formula can hide band identity, scaling, native resolution, masks, acquisition geometry and ecological assumptions. A colourful NDVI map may look convincing even when it combines shifted bands or cloud-contaminated values.

An index is useful because it compresses a chosen spectral contrast. It is not useful because the acronym itself guarantees a biological meaning. NDVI does not measure biomass directly. GNDVI does not measure chlorophyll directly. SAVI does not remove every soil effect. Red-edge indices do not automatically solve saturation. Each can become evidence when the physical contrast, valid domain and empirical relationship to the target are stated and tested.

### Scientific context

The meadow team has accepted a small set of synthetic surface-reflectance samples from Lesson 2.26. The plots range from strong red absorption and high near-infrared response to weaker contrast. Two rows are deliberately affected by cloud and shadow; one has reduced valid support under haze. Your task is to compare spectral contrasts without converting them into unsupported ecological labels.

The future pipeline may relate spectral variables to field biomass or plant traits. Today you are building candidate predictors and an interpretation record. That separation matters: predictor construction belongs before model evaluation, while a biological relationship must be validated with independent field evidence.

## 2. The concept: a normalised contrast

### Concept

This lesson teaches one idea: a vegetation index is a **defined transformation of spectral measurements**. A normalised difference has the form:

```text
(A − B) / (A + B)
```

The numerator represents contrast. The denominator partly normalises overall brightness. Under finite, non-negative inputs and a positive denominator, the value lies between -1 and 1. That mathematical range is a useful QA check, not a certificate of ecological validity.

Common indices in this lesson are:

| Index | Formula | Spectral contrast emphasised | Important caution |
| --- | --- | --- | --- |
| NDVI | `(NIR − Red) / (NIR + Red)` | red absorption against NIR response | can saturate in dense canopy; sensitive to soil and atmosphere |
| GNDVI | `(NIR − Green) / (NIR + Green)` | green-to-NIR contrast | chlorophyll association is contextual, not a direct measurement |
| SAVI | `((NIR − Red) / (NIR + Red + L)) × (1 + L)` | red/NIR contrast with soil adjustment | `L` is a parameter, not a universal correction; often 0.5 as a conventional intermediate case |
| MSAVI | `(2NIR + 1 − sqrt((2NIR + 1)² − 8(NIR − Red))) / 2` | red/NIR contrast with an internally adjusted soil term | formula does not remove every background or atmospheric effect |

Several red-edge indices also exist. Their names are not fully standardised, so always publish the formula and band mapping. Sentinel-2 red-edge bands are natively 20 m, while its red and broad NIR bands include 10 m products. A 10 m output grid does not turn the red-edge observation into 10 m information.

### Visual explanation

Think of the workflow as five gates:

**reflectance contract → band alignment → joint valid mask → safe formula → ecological validation**

The formula is the fourth gate, not the first. A result can be numerically finite yet fail every preceding measurement condition.

## 3. Why vegetation creates spectral contrast

Healthy green leaves often absorb red light through pigments and scatter more near-infrared energy through internal leaf and canopy structure. At canopy scale, the signal also includes leaf angle, vertical layering, gaps, shadow, litter, water, exposed soil and mixed background. The same index value can arise from different combinations.

In sparse vegetation, soil brightness can strongly influence red and NIR. SAVI introduces `L` to reduce some soil-background sensitivity, but the appropriate behaviour depends on fractional cover and soil properties. In dense vegetation, NDVI can become less responsive as red absorption approaches a lower limit and NIR behaviour is influenced by canopy structure. Moving to another index may change sensitivity, but it does not automatically identify the target property.

Atmosphere and illumination matter because ratios do not cancel every additive or wavelength-dependent effect. Haze can raise visible reflectance differently from NIR. Cloud shadow reduces illumination and may change bands unequally. Topographic shading, view angle and bidirectional reflectance effects can complicate comparison, even over the flat coastal setting.

Season is not noise to ignore. A June and August difference may reflect growth, senescence, grazing, cutting, inundation or acquisition conditions. Interpret change only after defining the temporal support and plausible process.

[[CHECK:m2-l27-proxy]]

## 4. Scale, offset and band compatibility

A normalised difference is invariant when both bands are multiplied by the same positive factor. It is not generally invariant to an additive offset. Landsat Collection 2 surface-reflectance conversion uses both multiplication and subtraction. Apply the documented conversion before calculating the index.

The formula also fails when bands represent different quantities or supports. Do not combine top-of-atmosphere Red with surface-reflectance NIR. Do not combine observations from different dates without a justified design. Do not use arrays merely because they share shape: confirm CRS, transform, origin, dimensions, acquisition and content registration.

When source bands have different native resolution, choose the destination support scientifically. Resampling a 20 m red-edge band to a 10 m grid is sometimes operationally necessary for stack alignment. The result remains based on 20 m native measurement support. State interpolation, edge effects and the consequences for small plots.

## 5. Joint masks and stable denominators

An index needs all contributing bands to be valid at the same support. Construct a joint mask that can require:

- finite scaled reflectance in every input;
- valid mission quality flags;
- no cloud or cloud shadow under the declared policy;
- adequate valid-pixel fraction within the analysis support;
- accepted registration and product level;
- a denominator whose absolute magnitude exceeds a documented epsilon.

Do not replace cloud with zero. Zero is a possible numeric reflectance value and would create artificial contrast. Keep invalid observations as `NaN` in floating-point arrays and preserve a reason-specific QA table or bit mask.

A tiny denominator makes the ratio unstable. Exact comparison with zero is insufficient because floating-point values may be close to zero. An epsilon such as `1e-6` is a numerical rule whose scale must match the reflectance representation. Report it.

[[CHECK:m2-l27-mask]]

## 6. Worked example — compare NDVI and GNDVI safely

### Predict before running

For a valid sample with `Red = 0.07`, `Green = 0.09` and `NIR = 0.42`, will NDVI or GNDVI be larger? What value should appear for a sample whose mask is false? Write the prediction before executing.

```python
import numpy as np

green = np.array([0.09, 0.12, 0.16], dtype="float32")
red = np.array([0.07, 0.13, 0.20], dtype="float32")
nir = np.array([0.42, 0.38, 0.31], dtype="float32")
valid = np.array([True, True, False])

def safe_ratio(a, b, valid_mask, epsilon=1e-6):
    denominator = a + b
    use = valid_mask & np.isfinite(denominator) & (np.abs(denominator) > epsilon)
    result = np.full(a.shape, np.nan, dtype="float32")
    result[use] = (a[use] - b[use]) / denominator[use]
    return result

print("NDVI", safe_ratio(nir, red, valid))
print("GNDVI", safe_ratio(nir, green, valid))
```

### Code walkthrough

1. NumPy represents the same three supports across bands.
2. Explicit `float32` prevents unsigned subtraction and provides `NaN` support.
3. `valid` rejects the third sample independently of its plausible-looking reflectance.
4. The function receives the high-response and low-response bands without naming one specific index.
5. `denominator` is calculated once so the same value is tested and used.
6. `use` combines the scientific mask, finite-number check and numerical stability rule.
7. `result` begins invalid everywhere; validity must be earned.
8. Boolean indexing calculates the ratio only at accepted supports.
9. The two calls document the exact band pairing.
10. The first sample has lower Red than Green, so its NDVI contrast is larger than its GNDVI contrast.

The difference between indices is mathematical evidence about these bands. It is not yet evidence that one estimates chlorophyll or biomass more accurately.

## 7. Add SAVI and MSAVI transparently

For SAVI, record the value of `L`. A common teaching example uses `L = 0.5`, while `L = 0` reduces to NDVI. The parameter is not a magic switch. It represents a modelling choice about soil influence.

MSAVI uses an algebraic expression intended to adapt the soil adjustment. Before taking its square root, verify that the radicand is finite and not negative beyond floating-point tolerance. Unexpected negative values may reveal scale, mask or range problems. Do not take an absolute value to force a result.

When comparing indices, use a tidy result table with:

- stable plot and observation IDs;
- acquisition date and sensor;
- native and destination support;
- input reflectance and mask status;
- formula and parameter version;
- index value or missing value;
- exclusion reason;
- field variable reserved for later validation.

This makes the analysis auditable and prevents a chart from hiding excluded support.

## 8. Reading agreement and disagreement

Agreement between NDVI, GNDVI and SAVI can show that different formulas rank the accepted samples similarly. It does not prove the shared ranking is biological truth. The indices reuse bands, so they are not independent sensors.

Disagreement is informative. SAVI may rank sparse plots differently because its denominator includes `L`. GNDVI may respond differently where green reflectance changes relative to red. Red-edge indices may show sensitivity under some dense-canopy conditions, but their coarser native support and band response must remain visible.

Index saturation means response becomes weak across changes in the target range. It does not mean the index value literally reaches one. Test sensitivity with field observations spanning the relevant canopy conditions. An alternative index should be evaluated under the same spatial and temporal validation design.

[[CHECK:m2-l27-saturation]]

## 9. Common mistakes and recovery

### Mistake: writing “NDVI measures biomass”

**Why beginners make it:** maps and software menus attach ecological labels to products.  
**Recognition:** the statement contains no sensor, season, field calibration or uncertainty.  
**Recovery:** say what the formula measures, then state the hypothesised relationship and evidence required to test it.

### Mistake: ignoring additive offsets

**Why beginners make it:** ratios seem to remove scale.  
**Recognition:** Landsat stored integers enter the formula directly or receive only a multiplier.  
**Recovery:** convert each band using the exact product factor and offset before combining it.

### Mistake: using different masks by band

**Why beginners make it:** each array has its own valid-looking values.  
**Recognition:** cloud-contaminated Red is combined with clear NIR.  
**Recovery:** construct one joint mask from all required bands and quality conditions.

### Mistake: assuming an alternative index fixes saturation

**Why beginners make it:** a new acronym appears more advanced.  
**Recognition:** the report claims improvement without field validation.  
**Recovery:** compare response curves, spatial support and independent prediction under the target conditions.

### Mistake: treating resampled red edge as fine measurement

**Why beginners make it:** the output reports a 10 m cell size.  
**Recognition:** native support disappears from metadata or interpretation.  
**Recovery:** store both native and destination resolution and restrict claims to the coarser evidence.

## 10. Guided practice — build the comparison table

1. Create `10_spectral_indices.ipynb` and link it to the observation decisions from Lesson 2.26.
2. Read `optical_reflectance_samples.csv`; confirm unique `plot_id`–`observation_id` combinations and the synthetic source status.
3. Create a `valid` flag requiring `qa_cloud == False`, `qa_shadow == False`, finite reflectance and `valid_support_fraction >= 0.80`.
4. Calculate NDVI and GNDVI with one tested safe-ratio function.
5. Calculate SAVI for `L = 0.5`; include `L` in the output metadata.
6. Implement MSAVI with a radicand check. Preserve invalid rows as `NaN` and record a reason.
7. Summarise valid ranges and counts. Investigate, rather than clip, any unexpected values.
8. Create one scatter plot comparing NDVI with SAVI. Label points by stable plot ID and visually distinguish review observations.
9. Create a table that explains agreement or divergence for at least three plots using their input reflectance.
10. Add a paragraph on native support: the supplied samples are summaries, not proof that every index band originally had identical resolution.
11. Save `spectral_index_report.csv` and reopen it. Confirm that invalid rows and reason fields survived.
12. End with a one-sentence claim the evidence supports and a stronger claim it does not support.

## 11. Independent challenge — design a red-edge comparison

Propose a comparison between NDVI and one explicitly defined red-edge normalised difference. Do not calculate it from an observation whose red-edge scale is unresolved. Your design must state:

- exact formula and Sentinel-2 bands;
- each band's native resolution;
- destination grid and interpolation;
- joint mask and denominator rule;
- field variable and sampling support for validation;
- season and management context;
- how you would test whether the alternative reduces saturation;
- what result would show no practical improvement.

Write 250–350 words. The best answer may conclude that current evidence is insufficient to run the comparison.

### Scientific interpretation

For accepted samples, a positive NDVI indicates that NIR reflectance exceeds Red reflectance under the specified observation and masks. Differences among indices show how formula and band choice change the compressed contrast. They do not reveal a unique biological cause.

You may propose that stronger contrast is consistent with greener or more structurally developed vegetation in this context. You should also name exposed soil, litter, water, shadow, canopy geometry, atmosphere and phenological timing as possible influences. A professional interpretation joins the index to field measurements collected at compatible support and uses validation to quantify the relationship and uncertainty.

Rows rejected by cloud or shadow are not inconvenient missing numbers to fill. They are locations where the satellite did not provide the required surface observation. Their absence affects temporal and spatial representativeness and must be reported.

## 13. Reflection, submission and portfolio artifact

### Reflection

- Which part of your index result comes from measurement and which part comes from analyst choice?
- Why can two indices agree strongly without providing independent confirmation?
- What ecological process could create a real seasonal change, and what acquisition effect could imitate it?
- What validation result would make you stop using an index for the target variable?

### Submission

Submit:

1. `spectral_index_comparison.ipynb` with predictions recorded before code outputs;
2. `spectral_index_report.csv` containing inputs, masks, formulas, parameters, outputs and exclusion reasons;
3. one labelled NDVI–SAVI comparison figure with a concise caption;
4. a screenshot showing a cloud or shadow row remaining invalid after calculation;
5. the 250–350-word red-edge comparison design;
6. a written interpretation that states one supported result, two confounders and one required field validation.

### Portfolio artifact

Add **spectral_index_comparison.ipynb** to the UAV and Satellite Analysis Pipeline. It should demonstrate that you can calculate indices, but more importantly that you can defend their inputs, masks, support and ecological limits.
