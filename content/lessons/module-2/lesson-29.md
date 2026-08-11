---
title: Hyperspectral Remote Sensing
lessonId: lesson-2-29
---

## 1. Use spectral detail only when the signal can support it

### Learning outcome

By the end of this lesson, you will be able to distinguish multispectral and imaging-spectroscopy measurements; read a reflectance spectrum using wavelength, bandwidth and spectral-response information; identify absorption features, red-edge shape and low-signal bands cautiously; screen bands with quality and signal-to-noise evidence; design physically informed features; and prevent feature-selection leakage in a later predictive workflow.

- **Lesson type:** Imaging-spectroscopy evidence lab
- **Estimated time:** 170–210 minutes
- **Prerequisites:** Lesson 2.26 optical observation chains and Lesson 2.27 spectral proxies
- **Portfolio output:** `hyperspectral_feature_note.ipynb`

### Why this matters

Imaging spectroscopy can provide hundreds of narrow, contiguous spectral bands. That density can reveal spectral shape and absorption behaviour that broader multispectral bands combine. It also introduces correlated predictors, lower signal in difficult wavelength regions, larger data volumes, demanding calibration and a strong temptation to search until an attractive relationship appears.

More bands are not automatically more information. A wavelength is useful only if the target produces a resolvable response, the instrument measures it with adequate signal, preprocessing preserves the feature, spatial support matches the question and validation demonstrates that the relationship transfers beyond the samples used to discover it.

The professional skill is therefore not “use every band”. It is to trace each candidate feature from physical reasoning through quality screening to independent evaluation.

### Scientific context

The coastal meadow group is interested in vegetation moisture, pigments and canopy condition. The synthetic training table contains three illustrative spectral signatures from 450 to 2400 nm, along with bandwidth, signal-to-noise ratio and deliberate bad-band flags. It is not an EMIT, airborne or field-spectrometer product, and its values are not measured over Baltic plots.

You will inspect the spectral evidence, remove bands for stated quality reasons and propose a small number of features. You will not fit a trait-prediction model in this lesson. Model design belongs later, after sampling, leakage and validation have been introduced in depth.

## 2. The concept: a spectrum at every support

### Concept

This lesson teaches one idea: imaging spectroscopy represents each spatial support with a densely sampled spectrum. A conventional raster band stores one value per cell. A hyperspectral or imaging-spectroscopy cube can be imagined as:

**rows × columns × wavelengths**

At one cell, selecting across wavelength produces a spectral vector. At one wavelength, selecting across rows and columns produces an image. The cube also carries coordinates, wavelength units, band centres, bandwidths, georeferencing, masks and processing metadata. Those labels are part of the measurement.

“Hyperspectral” often describes many relatively narrow contiguous bands. “Multispectral” describes fewer, usually broader and sometimes separated bands. The boundary is not a fixed band count. The scientific distinction is whether dense sampling resolves spectral shape or features unavailable to the broader system.

### Visual explanation

| View of the cube | Selection | Scientific use |
| --- | --- | --- |
| spectrum | one spatial support, many wavelengths | inspect shape, slopes and absorption features |
| band image | one wavelength interval, all supports | map spatial variation and artifacts |
| spectral subset | selected wavelength region | analyse a physically motivated feature |
| spatial subset | selected plots or polygons | compare classes with declared support |
| quality cube/mask | validity by band and support | exclude bad wavelengths or pixels explicitly |

The same array can therefore answer spectral and spatial questions, but only if dimension order and coordinates are preserved. An unlabeled three-dimensional NumPy array is not enough for a professional product. Tools such as Xarray can attach dimension names and coordinates; you will develop multidimensional workflows later in Module 2.

## 3. Band centre, bandwidth and spectral response

A band value is not reflectance at one infinitely precise wavelength. It integrates the incoming signal according to an instrument spectral response function. The reported band centre and full width at half maximum or other bandwidth description summarise that response.

Two instruments can report a band near 710 nm but integrate different wavelength ranges. Their values may differ even over the same target and time. Resampling one spectrum to another sensor's band centres should use spectral-response information where available, not only nearest wavelength. Record the original and simulated response.

Wavelength units matter. Nanometres and micrometres differ by a factor of 1000. A dataset whose coordinate runs from 0.4 to 2.5 may use micrometres; one from 400 to 2500 may use nanometres. Never guess from range alone—read metadata and assert expected units.

Spectral calibration, radiometric calibration, atmospheric correction and orthorectification all influence the delivered cube. A surface-reflectance spectrum should be described as a processed estimate under the product method, not a direct leaf measurement.

## 4. Absorption features and spectral shape

An absorption feature is a reduction in reflected energy over a wavelength region associated with absorption by materials. In vegetation spectra, pigment absorption affects visible wavelengths, the red edge describes a rapid rise from red toward near-infrared, and water-related absorption influences near- and shortwave-infrared regions. At canopy scale these features are modified by leaf structure, canopy architecture, soil, litter, shadow and mixed pixels.

Feature description may use:

- reflectance at a documented wavelength or band;
- slope across a defined interval;
- area under a curve;
- band depth relative to a continuum;
- derivative features after controlled smoothing;
- physically justified ratios or normalisations.

Each operation changes noise behaviour. Derivatives can amplify high-frequency noise. Continuum removal changes the baseline and requires stable shoulders. Smoothing can erase narrow features. Therefore publish the algorithm, wavelength window, parameters and input quality.

The “red edge” is a region, not one universal band. Its position and slope can relate to pigment and canopy properties under some conditions, but instrument response and atmospheric correction constrain what is resolvable. A plotted bend is not automatically a biochemical measurement.

[[CHECK:m2-l29-feature]]

## 5. Signal-to-noise and bad bands

Signal-to-noise ratio compares useful signal with variability attributable to noise under a defined measurement context. It can vary by wavelength, radiance level and instrument condition. A single threshold such as `SNR >= 30` is a transparent exercise rule, not a universal standard.

Atmospheric water-vapour absorption can leave surface-reflectance retrievals unreliable around strong absorption regions, commonly near 1400 and 1900 nm in many airborne/spaceborne products. Spectral edges may also have weak response. Product-specific quality information should drive masking; do not remove fixed wavelength intervals without checking the actual instrument and processing.

Bad-band screening should produce evidence:

- wavelength and unit;
- band centre and bandwidth;
- supplied quality flag;
- SNR or uncertainty measure;
- missing/finite fraction by study area;
- visible striping or systematic artifact review;
- decision, reason and effect on downstream features.

Keep rejected bands in an inventory. Deleting columns makes the final feature impossible to audit.

## 6. Dimensionality and sample size

A dataset with 300 bands and 40 field plots contains many correlated candidate predictors relative to independent samples. A flexible model can find patterns that describe those plots but fail on new sites. Spatial autocorrelation can make random train/test splits even more optimistic because nearby plots share environment and acquisition artifacts.

Physically informed feature reduction can improve interpretability, but it must not use test outcomes. If you inspect correlation with the target across the complete dataset, choose five bands and then report performance on a split from that same dataset, the test set influenced the selection.

Valid approaches include:

- predefining features from literature and sensor physics before viewing outcomes;
- performing feature selection inside each training fold of nested validation;
- reducing dimensions without the target inside a pipeline fitted only on training data;
- reserving independent sites, dates or campaigns for final evaluation.

The correct design depends on the claim. Feature discovery and final validation are different phases and should not reuse evidence silently.

[[CHECK:m2-l29-bands]]

## 7. Worked example — screen the spectrum before feature design

### Predict before running

The table marks 940, 1400, 1900 and 2400 nm as bad bands, and supplies SNR. If the rule requires `bad_band == False` and `SNR >= 30`, which wavelength regions remain? Will a value be kept merely because its reflectance is finite?

```python
from pathlib import Path
import pandas as pd

path = Path("inputs/satellite-eo/hyperspectral_signatures.csv")
spectra = pd.read_csv(path)
required = {"wavelength_nm", "bandwidth_nm", "bad_band", "snr"}
missing = required.difference(spectra.columns)
if missing:
    raise ValueError(f"Missing spectral metadata: {sorted(missing)}")
quality = (~spectra["bad_band"]) & spectra["snr"].ge(30)
spectra["use_for_feature"] = quality
red_edge = spectra["wavelength_nm"].between(680, 750) & quality
print(spectra.loc[red_edge,
      ["wavelength_nm", "meadow_dry_reflectance", "snr"]])
print("accepted bands", int(quality.sum()), "of", len(spectra))
```

### Code walkthrough

1. The path points to an immutable synthetic input.
2. pandas reads one row per wavelength.
3. `required` defines metadata needed for this decision.
4. Set difference finds absent columns without depending on column order.
5. A missing contract stops execution with a useful error.
6. `~` inverts the Boolean bad-band flag.
7. `ge(30)` applies the declared exercise threshold.
8. The quality decision is stored rather than used to delete rows.
9. `between(680, 750)` defines the red-edge window in stated nanometres.
10. `& quality` prevents a low-quality band from entering merely because its wavelength fits.
11. `.loc` prints only the relevant columns for review.
12. The final count exposes how much spectral evidence was retained.

Finite reflectance is necessary but not sufficient. Quality metadata can reject a finite value whose uncertainty is too high for the intended feature.

## 8. Design one transparent feature

For the synthetic table, a simple red-edge slope can be defined between two accepted wavelengths:

```text
slope = (R750 − R680) / (750 − 680)
```

The result has reflectance per nanometre under the stated units. It summarises a wide interval; it is not the maximum derivative position and not a direct chlorophyll estimate. If an instrument's band response differs, the feature changes.

Before calculation, confirm that both endpoint bands pass quality for the same spectrum. If a required band is invalid, the feature is invalid. Do not substitute the nearest accepted wavelength silently. A robust feature record contains feature name, formula, endpoints, units, preprocessing, valid spectrum count and physical rationale.

You can compare dry and moist synthetic curves as an exercise, but their labels are constructed scenarios, not field truth. A difference near water-sensitive wavelengths is consistent with different water-related spectral response; it does not quantify moisture content.

## 9. Spectral libraries and transfer

A spectral library can organise reference measurements with material identity, instrument, illumination, geometry, calibration and conditions. Library matching is not a lookup from spectrum to species without context. Laboratory leaf spectra, field canopy spectra and satellite pixels have different support and mixing.

Transfer from a library to imagery must consider:

- sensor spectral response and resampling;
- atmosphere and illumination;
- spectral and spatial mixtures;
- phenology and moisture;
- viewing geometry;
- preprocessing compatibility;
- uncertainty and representativeness of library samples.

The USGS Spectral Library is a valuable reference for materials and methods, but it does not replace local calibration for a coastal-meadow trait question. Treat libraries as evidence for hypotheses and algorithm testing, not automatic labels.

## 10. Common mistakes and recovery

### Mistake: assuming more bands guarantee a better model

**Why beginners make it:** feature count sounds like information content.  
**Recognition:** all wavelengths enter a small-sample model without quality or validation design.  
**Recovery:** screen quality, specify physical hypotheses and evaluate selection inside independent validation.

### Mistake: removing noisy bands by eye without a record

**Why beginners make it:** a plotted spectrum makes artifacts visible.  
**Recognition:** the cleaned table cannot reproduce which bands disappeared.  
**Recovery:** keep an inventory with flags, thresholds, reasons and product-version evidence.

### Mistake: confusing wavelength samples with exact monochromatic values

**Why beginners make it:** the coordinate is displayed as one number.  
**Recognition:** bandwidth and response function are absent from comparison.  
**Recovery:** report centre, bandwidth and response compatibility across sensors.

### Mistake: selecting features on the test set

**Why beginners make it:** the analyst wants to find the “best” wavelengths before modelling.  
**Recognition:** target correlations use every sample before the split.  
**Recovery:** pre-register features or place outcome-informed selection inside training folds.

### Mistake: interpreting a canopy spectrum as a leaf chemistry measurement

**Why beginners make it:** published laboratory relationships sound universal.  
**Recognition:** soil, shadow, structure, support and field timing are not discussed.  
**Recovery:** state the canopy-scale measurement and validate against compatible field sampling.

[[CHECK:m2-l29-leakage]]

## 11. Guided practice — produce a spectral feature note

1. Create `12_hyperspectral_remote_sensing.ipynb` and document the synthetic source.
2. Load the table and assert wavelength order, units, uniqueness and positive bandwidth.
3. Plot the three spectra against wavelength with bad bands visually marked. Do not connect across large removed regions without indicating the gap.
4. Build separate flags for supplied `bad_band`, SNR threshold and finite values; combine them into `use_for_feature`.
5. Explain why 940, 1400, 1900 and 2400 nm are rejected in this training pack without turning these exact exclusions into a universal sensor rule.
6. Calculate red-edge slope between 680 and 750 nm for the two meadow scenarios.
7. Create a long-form feature table containing scenario, feature, value, units, endpoint wavelengths, QA status and source status.
8. Propose one water-related feature but leave it blocked if the required absorption-centre band is invalid. State which shoulders and instrument evidence you would need.
9. Write a feature-selection plan that keeps target-informed selection inside training folds.
10. Explain how a field-spectrometer spectrum and a satellite pixel differ in support.
11. Save and reopen `hyperspectral_feature_report.csv`.
12. Complete the imaging-spectroscopy section of the QA template.

## 12. Independent challenge — decide whether imaging spectroscopy is justified

The team proposes using imaging spectroscopy to estimate a coastal-meadow plant trait. Write a 350–450-word decision memo that covers:

- the target trait and plausible spectral mechanism;
- wavelength region and required spectral response;
- spatial support and mixed-pixel risk;
- expected SNR and atmospheric limitations;
- field sampling and timing;
- candidate feature or dimension-reduction strategy;
- nested or independent validation design;
- comparison with a simpler multispectral baseline;
- a stopping rule if the added spectral detail does not improve defensible evidence.

A recommendation against imaging spectroscopy can be excellent if it is supported by the target, scale and validation constraints.

### Scientific interpretation

The accepted synthetic bands reveal a visible absorption-to-near-infrared rise and differences between constructed dry and moist scenarios. These patterns demonstrate how spectral shape can be represented and screened. They do not demonstrate that a particular trait can be retrieved from a real meadow.

The bad-band flags and SNR values are part of the result, not preprocessing debris. They limit which features can be calculated and which portions of a plotted curve deserve interpretation. A blocked water-absorption feature is scientifically more valuable than a forced number built from unreliable bands.

If later field-linked modelling shows that a physically justified feature predicts a trait under spatially independent validation, the interpretation may become stronger. Even then, report sensor, season, support, reference method and transfer limits. Spectral evidence is conditional on the full observation system.

## 14. Reflection, submission and portfolio artifact

### Reflection

- What scientific information is lost when a dense spectrum is reduced to one index?
- What noise or bias can be amplified by derivatives and feature searching?
- How would you determine whether a feature transfers to another sensor?
- Which part of your proposed workflow must never see the final test outcomes?

### Submission

Submit:

1. `hyperspectral_feature_note.ipynb` with band-contract assertions and prediction before output;
2. `hyperspectral_feature_report.csv` containing retained and blocked feature decisions;
3. one spectral figure marking bad bands and wavelength gaps clearly;
4. a screenshot of the quality inventory and accepted red-edge window;
5. the 350–450-word imaging-spectroscopy decision memo;
6. a short leakage-prevention plan and one statement the synthetic evidence cannot support.

### Portfolio artifact

Add **hyperspectral_feature_note.ipynb** to the UAV and Satellite Analysis Pipeline. It should show disciplined spectral reasoning: quality before feature extraction, physical rationale before model searching, and independent validation before ecological claims.
