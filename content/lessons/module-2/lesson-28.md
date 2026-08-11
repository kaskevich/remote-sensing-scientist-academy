---
title: SAR Fundamentals
lessonId: lesson-2-28
---

## 1. Interpret backscatter as an interaction, not a picture

### Learning outcome

By the end of this lesson, you will be able to explain how synthetic aperture radar differs from passive optical sensing; interpret C-band backscatter as a joint response to dielectric properties, roughness, structure and geometry; distinguish VV and VH measurements; convert correctly between linear power and decibels; evaluate Sentinel-1 acquisition comparability; and design a calibration-to-terrain-correction workflow with explicit limits.

- **Lesson type:** SAR reasoning and comparability lab
- **Estimated time:** 170–210 minutes
- **Prerequisites:** spatial support and raster alignment; Lesson 2.26 observation contracts
- **Portfolio output:** `sentinel1_workflow_report.ipynb`

### Why this matters

Microwave radar can observe through cloud and without sunlight, which is valuable in the cloudy Baltic region. That advantage is often simplified into “all-weather imagery”. The difficult scientific work remains: radar is side-looking, coherent and sensitive to viewing geometry. Brightness is not greenness. A change may arise from surface moisture, inundation, roughness, vegetation structure, incidence angle, orbit direction or preprocessing.

SAR becomes useful when the observation geometry and processing chain are controlled and the physical alternatives are explicit. It becomes misleading when any bright pixel is labelled “more vegetation” or when incompatible ascending and descending acquisitions are averaged as though they observed the same relationship.

### Scientific context

The coastal meadow team needs observations during cloud-prone periods. Synthetic Sentinel-1-style records have VV and VH backscatter, orbit information, incidence angle and radiometric terrain-correction status. Some are comparable; one comes from a different viewing direction, one lies at the edge of the accepted angle range and one intentionally failed terrain correction.

You will decide which records can form a preliminary comparison. You will not retrieve a real Sentinel-1 archive or claim that the synthetic values represent the published Baltic dataset. The purpose is to learn the reasoning required before a time series or ecological model is defensible.

## 2. The concept: active microwave backscatter

### Concept

This lesson teaches one idea: SAR measures the portion of transmitted microwave energy that returns to the sensor under a particular acquisition geometry. The sensor supplies its own illumination, sends pulses to the side and records amplitude and phase. Synthetic aperture processing combines measurements along the flight path to achieve fine along-track resolution.

Sentinel-1 operates at C-band, with a wavelength of roughly a few centimetres. The signal interacts with structures relative to that wavelength. Smooth open water often directs energy away from the sensor and can appear dark, but wind, vegetation or geometry can alter the response. A rough or structured surface may scatter more energy back. Water content changes the dielectric properties of soil and vegetation, often affecting backscatter strongly.

The sensor does not isolate those controls. Backscatter is a compound observation:

**returned signal = f(wavelength, polarisation, dielectric properties, roughness, structure, incidence geometry, processing)**

This is the SAR equivalent of the optical observation chain. It prevents one-to-one ecological labels.

### Visual explanation

| Element | What changes | Why comparison can fail |
| --- | --- | --- |
| Wavelength | interaction scale and penetration | different frequencies respond to different structures |
| Polarisation | transmitted and received orientation | VV and VH represent different scattering pathways |
| Incidence angle | line of sight relative to surface | the same meadow can return different power |
| Orbit direction | viewing direction and shadow/layover geometry | ascending and descending views are not interchangeable |
| Moisture | dielectric contrast | wet soil may brighten without vegetation change |
| Roughness/structure | scattering configuration | mowing, lodging or wind can alter return |
| Processing | calibration, geometry and terrain normalisation | inconsistent products create artificial differences |

## 3. Slant range, ground range and SAR geometry

Radar measures travel time in the sensor line of sight, called slant range. Products may be represented in slant-range or ground-range geometry. Sentinel-1 Ground Range Detected products are detected and projected toward ground range; phase information is not retained in the same way as complex SLC products.

Side-looking geometry produces characteristic distortions in terrain: foreshortening, layover and radar shadow. Coastal meadows may be relatively flat, but embankments, woodland edges and local relief still matter. A flat appearance does not remove incidence-angle sensitivity.

Incidence angle describes the angle between the incoming radar line and the local surface normal under a defined convention. Across a wide swath, angle changes. Backscatter from the same surface may therefore vary spatially even without ecological change. Record the appropriate angle information and restrict or model comparisons rather than assuming a single scene-wide value.

Radiometric terrain correction aims to reduce terrain-related geometric and radiometric effects using an elevation model. It improves comparability but does not make all viewing geometries identical or correct a poor DEM. Record the DEM, output convention and processing implementation.

## 4. Polarisation and scattering pathways

Polarisation describes the orientation of the transmitted and received electromagnetic field. In common Sentinel-1 land products:

- **VV** means vertical transmission and vertical reception;
- **VH** means vertical transmission and horizontal reception.

Cross-polarised VH can be sensitive to volume scattering from complex vegetation, while VV often includes strong surface and double-bounce contributions. These are useful tendencies, not universal ecological conversions. Canopy geometry, soil moisture, flooding and incidence angle can change both.

A ratio or difference between VH and VV may reduce some shared effects, but it remains a derived radar variable. In linear power, `VH / VV` is a ratio. In decibels, `VH_dB − VV_dB` is the equivalent log-ratio. State the representation and never divide decibel values as though they were linear power.

[[CHECK:m2-l28-brightness]]

## 5. Linear power and decibels

Calibrated backscatter may be stored in linear power or expressed in decibels:

```text
dB = 10 × log10(linear power)
linear power = 10 ** (dB / 10)
```

Because typical linear backscatter is below one, decibel values are commonly negative. A value of -8 dB represents greater power than -15 dB. “Greater” does not mean ecologically better; it means more returned power under the observation conditions.

Logarithms change arithmetic. The mean of decibel values is not generally the decibel transform of the mean linear power. If the scientific operation is averaging power over a plot, convert to linear power, aggregate with an explicit support rule and convert the result back to dB for reporting if desired. Also report valid pixel count and spread.

[[CHECK:m2-l28-db]]

## 6. Speckle is part of coherent imaging

SAR speckle is a granular pattern created by constructive and destructive interference among scatterers within a resolution cell. It is not ordinary camera noise that can simply be erased. Multilooking, spatial aggregation and filters can reduce variance, but they change effective spatial support and may blur boundaries.

Choose speckle treatment from the intended analysis:

- plot summaries may aggregate valid linear power within a polygon;
- mapping may use a documented filter whose window and edge behaviour are reported;
- time-series approaches can exploit multiple dates;
- small features may be damaged by aggressive smoothing.

Never select a filter only because the image looks cleaner. Compare before and after statistics at stable and boundary regions, and preserve the unfiltered calibrated product.

## 7. A defensible preprocessing chain

Software platforms package steps differently, but a reviewable GRD workflow commonly addresses:

1. product identity, mode and acquisition metadata;
2. precise orbit information when the processor supports it;
3. removal of known instrument artifacts and thermal noise where required;
4. radiometric calibration to a declared backscatter quantity;
5. geometric and radiometric terrain correction with a documented DEM;
6. optional speckle treatment or spatial aggregation;
7. conversion between linear and decibel representation only as required;
8. masking of border noise, invalid geometry and unsuitable support;
9. output grid, metadata, software version and round-trip QA.

Terms such as sigma nought and gamma nought represent different normalisations. Do not rename one as another. Follow product and processor documentation, particularly for radiometric terrain correction.

The final product should record mode, polarisation, orbit direction, relative orbit, acquisition time, incidence-angle range, calibration quantity, terrain-correction method, DEM, representation and valid support.

## 8. Worked example — screen a comparable observation set

### Predict before running

Which rows should pass a rule requiring ascending orbit, relative orbit 131, incidence angle from 37° to 40°, complete RTC and supplied `accept` status? Will the descending row pass because it is numerically valid?

```python
from pathlib import Path
import pandas as pd

path = Path("inputs/satellite-eo/sentinel1_backscatter_samples.csv")
sar = pd.read_csv(path, parse_dates=["acquired_utc"])
geometry = sar["orbit_direction"].eq("ascending")
geometry &= sar["relative_orbit"].eq(131)
geometry &= sar["incidence_angle_deg"].between(37, 40)
processed = sar["rtc_status"].eq("complete")
declared = sar["qa_status"].eq("accept")
sar["comparable"] = geometry & processed & declared
sar["vh_vv_difference_db"] = sar["vh_db"] - sar["vv_db"]
columns = ["plot_id", "observation_id", "comparable",
           "vh_vv_difference_db", "deliberate_condition"]
print(sar[columns].to_string(index=False))
```

### Code walkthrough

1. The table is loaded with acquisition time parsed as a temporal value.
2. The first geometry condition selects one viewing direction.
3. `&=` adds the relative-orbit requirement to the existing Boolean series.
4. `between()` declares an inclusive angle interval.
5. The processing gate requires completed radiometric terrain correction.
6. The declared QA decision remains an independent requirement.
7. `comparable` combines geometry, processing and review evidence without deleting failed rows.
8. Subtracting decibel values produces a log-domain VH/VV contrast; it is not a division of decibels.
9. Stable plot and observation identifiers remain in the report.
10. The printed condition explains why a row passed or failed.

This gate defines comparability for one exercise, not a universal Sentinel-1 filter. A different question may justify a wider angle range or separate models by orbit. The crucial step is to state and test the contract.

[[CHECK:m2-l28-comparability]]

## 9. From backscatter to ecological hypotheses

Suppose comparable observations become brighter after rainfall. Increased soil moisture is plausible because dielectric contrast can raise return. Vegetation wetness or structural change may also contribute. Suppose VH changes while VV remains more stable; volume scattering is one hypothesis, but canopy structure, moisture and noise remain alternatives.

Flooded vegetation can sometimes produce double-bounce scattering between vertical stems and the water surface, while open smooth water may be dark. Wind-roughened water or low vegetation complicates this simple picture. Field water-level measurements, precipitation, optical observations and land-cover context help discriminate explanations.

Do not describe SAR as seeing “through vegetation” without specifying wavelength, canopy and target. C-band interaction with a meadow differs from longer-wavelength radar in a forest. Penetration is conditional, not a binary sensor property.

A credible claim might be: *Within ascending relative-orbit 131 observations processed consistently to the same backscatter quantity, median VH power increased over accepted synthetic plots during the wetter scenario.* A stronger claim—*biomass increased*—needs independent evidence.

## 10. Common mistakes and recovery

### Mistake: treating SAR as a cloud-free optical image

**Why beginners make it:** both are displayed as raster brightness.  
**Recognition:** interpretation uses “greener” or optical cloud percentage.  
**Recovery:** return to active microwave interaction, polarisation, geometry and backscatter units.

### Mistake: mixing ascending and descending acquisitions silently

**Why beginners make it:** dates line up in one catalog.  
**Recognition:** orbit fields vary but are omitted from the analysis table.  
**Recovery:** analyse consistent geometry or model/view directions separately and validate their relationship.

### Mistake: averaging decibels as linear power

**Why beginners make it:** decibel values appear as ordinary numbers.  
**Recognition:** arithmetic mean is applied without stating the represented quantity.  
**Recovery:** convert to linear power for power-domain aggregation, then document any conversion back.

### Mistake: filtering speckle until the map looks smooth

**Why beginners make it:** visual noise appears like a defect.  
**Recognition:** window size is chosen aesthetically and small features disappear.  
**Recovery:** define analysis support, compare before/after metrics and preserve unfiltered data.

### Mistake: interpreting one bright pixel causally

**Why beginners make it:** radar response is described with one dominant mechanism.  
**Recognition:** moisture, roughness, structure and angle alternatives are absent.  
**Recovery:** formulate competing explanations and seek field, time-series or cross-sensor evidence.

## 11. Guided practice — create a SAR comparability report

1. Create `11_sar_fundamentals.ipynb` and state that the pack is synthetic.
2. Read the SAR table and verify stable identifiers, parseable dates, valid polarisation columns and finite angle values.
3. Convert VV and VH from dB to linear power using `10 ** (value / 10)`.
4. Reconvert a few values to dB and assert round-trip agreement within tolerance.
5. Build the comparability gate from orbit direction, relative orbit, incidence angle, RTC and QA status.
6. Keep failed rows and create a reason field rather than filtering them invisibly.
7. For accepted rows, calculate linear VH/VV and the equivalent `VH_dB − VV_dB`. Confirm they encode the same ratio under the log transform.
8. Summarise accepted linear power by observation with count, median and interquartile range.
9. Create one figure that distinguishes accepted, review and rejected points. Do not interpolate a continuous meadow map from this small table.
10. Write three competing explanations for the wetter-scenario difference and the evidence that would test each.
11. Save `sar_comparability_report.csv`, reopen it and confirm representation and status fields.
12. Complete the SAR section of `SATELLITE_EO_QA_TEMPLATE.md`.

## 12. Independent challenge — design a seasonal Sentinel-1 study

Design a real-data Sentinel-1 comparison for meadow inundation or mowing. Specify:

- product type and why it matches the question;
- mode, VV/VH availability, orbit direction and relative orbit;
- maximum acceptable incidence-angle difference or how it will be modelled;
- calibration quantity, terrain correction and DEM;
- linear/dB representation and aggregation support;
- speckle strategy and consequences for small features;
- field or optical validation;
- temporal baseline and event window;
- one stopping rule for insufficient comparability.

Write 300–400 words. Avoid promising that SAR uniquely separates moisture, structure and management without validation.

### Scientific interpretation

The accepted synthetic records form a comparable subset only under the declared geometry and processing rules. Their VV, VH and derived contrast describe returned microwave power. Differences are compatible with several physical changes, including moisture and structure, but do not identify one cause on their own.

The descending record is not “bad data”; it is unsuitable for direct inclusion in this particular geometry-controlled comparison. The failed RTC record is blocked because its terrain-related normalisation does not meet the contract. Preserving those distinctions creates a reusable archive: another analysis may use the descending acquisition in a separate track, while the failed product requires reprocessing.

SAR complements optical evidence because it responds to different properties and acquisition constraints. Complementarity does not mean interchangeability. The next professional step is to compare hypotheses across sensors at compatible support while preserving their distinct measurement meanings.

## 14. Reflection, submission and portfolio artifact

### Reflection

- Which SAR metadata field would most change your current interpretation if it were wrong?
- When should a spatial mean be calculated in linear power rather than decibels?
- Which alternative explanations can produce the same backscatter change?
- How does speckle treatment change the support of your evidence?

### Submission

Submit:

1. `sentinel1_workflow_report.ipynb` with prediction, conversions and comparability gates;
2. `sar_comparability_report.csv` retaining accept, review and rejected records with reasons;
3. a flow description from product search through calibration, RTC, masking and interpretation;
4. one figure showing accepted and non-comparable records without implying spatial continuity;
5. the 300–400-word seasonal study design;
6. a written interpretation with one supported observation, three competing causes and required validation.

### Portfolio artifact

Add **sentinel1_workflow_report.ipynb** to the UAV and Satellite Analysis Pipeline. The artifact should show that you can use SAR as physical evidence under controlled geometry rather than as a cloud-free replacement for an optical image.
