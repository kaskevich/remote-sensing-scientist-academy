---
title: Optical Remote Sensing
lessonId: lesson-2-26
---

## 1. Select an observation, not an attractive image

### Learning outcome

By the end of this lesson, you will be able to explain how sunlight becomes a satellite data value; distinguish digital number, radiance, top-of-atmosphere reflectance and surface reflectance; compare Sentinel-2 and Landsat products using spectral, spatial, radiometric and temporal requirements; apply documented scale and offset values; and make a defensible accept, review or reject decision for an optical observation.

- **Lesson type:** Concept and product-selection lab
- **Estimated time:** 150–180 minutes
- **Prerequisites:** Raster grids, transforms, masks and alignment from Chapter 3; UAV radiometry from Chapter 4
- **Portfolio output:** `optical_product_decision.ipynb`

### Why this matters

Optical Earth Observation often arrives as a compelling image. Colour makes the landscape familiar, but scientific analysis begins before display. You must know what interaction produced each band, what processing transformed the original signal, which ground area contributed to a pixel, and which pixels are not valid observations.

A technically correct calculation on the wrong product can answer a different question from the one you intended. Comparing unscaled digital numbers between Landsat and Sentinel-2, treating a 20 m red-edge measurement as new 10 m information after resampling, or using cloud-contaminated values as vegetation change can all produce precise numbers without defensible evidence.

Remote Sensing Scientists therefore select products by measurement requirements. The goal is not to find the clearest thumbnail. It is to construct a traceable observation contract.

### Scientific context

The Baltic coastal meadow research group wants to describe vegetation condition during the growing season. Field plots are small, management boundaries are irregular and usable cloud-free opportunities are limited. The team is considering Sentinel-2 MSI and Landsat 8/9 OLI products.

The Chapter 5 pack is entirely synthetic. It contains realistic product metadata patterns and deliberate problems, but no actual satellite measurements or published plot locations. You will use it to decide which observations could support comparison. Later lessons will derive indices and combine other sensor evidence only after this optical foundation passes review.

## 2. The observation chain

### Concept

The single idea in this lesson is that an optical pixel is the end of an **observation chain**:

**solar energy → atmosphere → surface interaction → atmosphere → sensor response → stored value → corrected product → masked analysis value**

At the surface, incoming energy may be absorbed, transmitted or reflected. Leaf pigments absorb strongly in parts of the visible spectrum. Internal leaf structure can produce relatively strong near-infrared reflection. Water, soil, litter, canopy arrangement and shadows alter the combined signal. The sensor does not observe “health”, “biomass” or “habitat quality”. It records energy over defined wavelength intervals and viewing geometry.

The atmosphere affects the path twice: before light reaches the surface and after it leaves. Molecules and aerosols scatter or absorb energy. A cloud can dominate the signal; a cloud shadow can reduce illumination; thin haze can subtly change spectral contrast. Atmospheric correction estimates surface reflectance from the measured signal, but the estimate has assumptions and uncertainty.

### Visual explanation

| Stage | Quantity or process | Question for the analyst |
| --- | --- | --- |
| Illumination | solar irradiance and geometry | Was the target illuminated comparably? |
| Surface | absorption, transmission and reflection | Which materials and structures contributed? |
| Atmosphere | scattering and absorption | What correction and quality information exist? |
| Sensor | spectral response and radiometric sampling | Which wavelength range and sensitivity were measured? |
| Grid | resampled ground representation | What is the native and delivered spatial support? |
| Product | calibration, correction, scaling and mask | What exactly does the stored number mean? |
| Analysis | accepted observations and derivatives | Which claims remain supported? |

This chain prevents a common category error: interpreting a processed number as though it were a direct field measurement.

## 3. Bands are response ranges, not colours

A multispectral band integrates energy across a spectral response function. “Red” is shorthand for a wavelength interval and instrument response, not a universal variable shared perfectly by every sensor. Sentinel-2 and Landsat have related but not identical band centres, bandwidths and response functions. Their values should not be treated as interchangeable merely because the columns carry similar names.

Four kinds of resolution shape product fitness:

1. **Spectral resolution** describes the location and width of measured bands. Narrower or strategically positioned bands may distinguish features that broad bands combine.
2. **Spatial resolution** describes ground sampling, commonly expressed as pixel size. It is not the same as positional accuracy or the smallest object reliably detectable.
3. **Radiometric resolution** describes the sensor's ability to discriminate signal levels and the numeric representation used in a product. Stored integers may require conversion.
4. **Temporal resolution** describes acquisition opportunity. It does not guarantee usable observations because cloud, shadow, latitude, orbit overlap and timing matter.

Sentinel-2 MSI has 13 spectral bands: four delivered at 10 m, six at 20 m and three at 60 m. The 10 m red and near-infrared bands can support one grid choice, while red-edge bands have 20 m native sampling. Landsat optical surface-reflectance bands are commonly delivered at 30 m. These specifications describe products; they do not declare which sensor is “better”. A larger field unit may favour a long Landsat record. Narrow linear meadow fragments may benefit from Sentinel-2 sampling. Cross-sensor analysis may require explicit harmonisation and validation.

[[CHECK:m2-l26-resolution]]

## 4. Product level changes meaning

Raw detector response is converted through processing stages. Terminology differs by mission, so read the product specification rather than assuming that all “Level 2” products are identical.

A simplified optical distinction is:

- **Digital number (DN):** stored sensor or product code; its meaning depends on calibration and scaling metadata
- **Spectral radiance:** energy reaching the sensor per area, solid angle and wavelength interval
- **Top-of-atmosphere reflectance:** a normalised quantity at the sensor/atmospheric boundary, before full surface correction
- **Surface reflectance:** an estimate of the fraction reflected at the land surface after atmospheric processing

Sentinel-2 Level-1C supplies top-of-atmosphere reflectance in mapped geometry. Level-2A supplies bottom-of-atmosphere surface reflectance with scene-classification and quality information. Landsat Collection 2 Level-2 surface reflectance uses a documented multiplicative scale factor of `0.0000275` and additive offset of `-0.2`. Therefore:

```text
surface reflectance = stored integer × 0.0000275 − 0.2
```

The offset matters. Applying only the multiplicative factor produces the wrong physical quantity. Sentinel-2 products also require the scale and any applicable offset to be read from authoritative product metadata. Never infer a scale because values “look like reflectance multiplied by 10,000”.

Values slightly outside an intuitive 0–1 interval may occur because of atmospheric-correction behaviour, noise or target conditions. Do not automatically clip them. Apply the product definition, inspect quality, record the range and decide whether a mask is justified.

[[CHECK:m2-l26-level]]

## 5. Cloud cover is not a complete mask

Scene-level cloud percentage is a search aid, not proof that the study area is clear. A scene with 60% cloud may contain a clear meadow; a scene with 5% cloud may place its only cloud over every plot. Quality must be evaluated at the analysis support.

A defensible mask policy considers:

- opaque and thin cloud;
- cloud shadow;
- cirrus or haze where relevant;
- snow and ice;
- saturated or defective pixels;
- water when excluded by the ecological question;
- edge and resampling support;
- the reliability and version of the classification method.

Automatic masks can omit cloud or remove bright surfaces incorrectly. Inspect image and mask together, preferably against stable reference features. Record manual decisions rather than silently painting the mask. If a plot contains both valid and invalid pixels, report valid support fraction and set a threshold appropriate to the analysis.

Nominal revisit is therefore not usable frequency. A five-day acquisition opportunity does not create a five-day valid time series. Phenology adds another condition: two clear observations may represent different growth stages, water levels or management events.

[[CHECK:m2-l26-revisit]]

## 6. Worked example — audit the observation inventory

### Predict before running

Open `optical_observation_inventory.csv` as text. Which records do you expect to pass these minimum gates: surface-reflectance product, scale metadata present, less than 30% scene cloud and an explicit `accept` status? Is the lowest cloud percentage automatically the strongest record?

```python
from pathlib import Path
import pandas as pd

path = Path("inputs/satellite-eo/optical_observation_inventory.csv")
inventory = pd.read_csv(path, parse_dates=["acquired_utc"])
surface = inventory["product_level"].isin(["L2A", "L2SP"])
scaled = inventory["scale_factor"].notna()
cloud_gate = inventory["cloud_cover_pct"] < 30
declared = inventory["quality_status"].eq("accept")
inventory["passes_minimum_gate"] = surface & scaled & cloud_gate & declared
columns = ["asset_id", "sensor", "product_level", "cloud_cover_pct",
           "passes_minimum_gate", "deliberate_condition"]
print(inventory[columns].to_string(index=False))
```

### Code walkthrough

1. `Path` represents the input without embedding operating-system-specific separators.
2. `read_csv()` loads the inventory and parses the acquisition field as time rather than plain text.
3. `surface` accepts only the two surface-reflectance labels documented for this exercise.
4. `scaled` requires evidence for the numeric conversion. It does not guess a mission default.
5. `cloud_gate` demonstrates a transparent search threshold. It is not the final pixel mask.
6. `declared` preserves the supplied review decision.
7. `&` requires every Boolean condition. Parentheses are not needed here because each condition is already named.
8. The resulting column records the rule without deleting failed assets.
9. `columns` limits the displayed audit table to decision evidence.
10. `to_string(index=False)` prints the rows clearly without presenting the DataFrame row number as an observation identifier.

The code does not claim that every passing scene is scientifically usable. It performs a minimum metadata gate. Pixel masks, local haze, exact phenological timing and spatial support still need review.

## 7. Common mistakes and recovery

### Mistake: treating a true-colour display as calibrated data

**Why beginners make it:** a rendered image looks complete and familiar.  
**Recognition:** values change with display stretch, or the source is a JPEG/PNG without product metadata.  
**Recovery:** return to the quantitative band product, scale metadata and quality layers. Use the image only as visual QA evidence.

### Mistake: comparing stored integers directly

**Why beginners make it:** both rasters have the same numeric data type.  
**Recognition:** one mission has values near thousands and another near hundreds, or an offset is ignored.  
**Recovery:** apply the documented mission-, collection- and product-specific conversion. Preserve the source integers.

### Mistake: calling resampled pixels higher resolution

**Why beginners make it:** the output grid reports a smaller cell size.  
**Recognition:** a 20 m band is described as “10 m data” after interpolation.  
**Recovery:** record native support and destination grid separately. State that resampling estimates values on a new grid without adding measured detail.

### Mistake: using scene cloud percentage as the analysis mask

**Why beginners make it:** it is a convenient single number in catalog search results.  
**Recognition:** cloudy or shadowed plots remain in an apparently low-cloud scene.  
**Recovery:** apply and inspect pixel-level quality information at the study support, report valid fraction and preserve exclusions.

### Mistake: selecting a sensor before defining the question

**Why beginners make it:** software tutorials begin with a named mission.  
**Recognition:** the justification lists product popularity but not target size, wavelength response, timing or uncertainty.  
**Recovery:** state the ecological quantity, spatial support, required season and acceptable uncertainty first; then compare products.

## 8. Guided practice — write an observation contract

1. Create `09_optical_remote_sensing.ipynb` in the continuing pipeline notebook folder.
2. Add a Markdown cell stating the proposed question: *Which accepted optical observations can describe within-season spectral differences among synthetic coastal meadow plots?*
3. Read the pack `README.md` and `manifest.json`. State explicitly that the training data are synthetic.
4. Load the inventory and verify that `asset_id` is unique, acquisition times parse and numeric fields contain plausible values.
5. Create separate columns for product-level, scale, scene-cloud and declared-quality gates. Do not overwrite the original status.
6. Explain why `SYN_L8_20240627_L1` cannot enter a surface-reflectance comparison without further processing.
7. Explain why `SYN_S2B_20240802_SCALE` remains in review even though its cloud percentage is low.
8. Compare Sentinel-2 and Landsat red/NIR support. State what 10 m and 30 m sampling imply for mixed meadow-boundary pixels.
9. Load `optical_reflectance_samples.csv`. Build a joint valid flag requiring no cloud, no shadow and at least 80% valid support.
10. Report accepted and excluded plot-observation rows without calculating a vegetation index yet.
11. Write an observation contract containing target signal, product quantity, native band support, scale/offset, mask policy, timing and unresolved uncertainty.
12. Save the decision table as `optical_observation_decisions.csv` and reopen it to verify identifiers and Boolean fields.

## 9. Independent challenge — choose for two different questions

Make two separate product recommendations:

1. mapping spectral variation near narrow meadow boundaries during one growing-season window;
2. placing the current observations in a multi-decade regional context.

For each recommendation, compare Sentinel-2 and Landsat rather than declaring one universally superior. Address band response, native support, acquisition opportunity, record length, surface-reflectance processing, cloud/shadow evidence and interoperability. Give one condition that would reverse your decision. Limit each recommendation to 180 words and connect every claim to the inventory or an authoritative product reference.

### Scientific interpretation

The accepted records show that a usable optical observation is a qualified estimate of surface spectral response over a defined footprint and time. It is not a photograph of ecological truth. Sentinel-2 may provide finer sampling and red-edge bands, while Landsat contributes a long calibrated archive and different support. Those properties become advantages only when they match the question.

If a clear record passes the minimum gate, you may describe its valid reflectance values and spectral contrasts. You may not yet claim biomass, chlorophyll, biodiversity or conservation status. Such claims require field linkage, temporal design and validation. If cloud, shadow or missing scale blocks a row, documenting the block improves the science because it prevents unsupported precision from entering later derivatives.

## 11. Reflection, submission and portfolio artifact

### Reflection

- At which point in the observation chain can the largest interpretive error enter your current workflow?
- Which requirement is about native measurement support, and which is only about the delivered grid?
- Why might two correctly processed sensors still produce different reflectance for the same landscape?
- What evidence would you request before moving a `review` asset to `accept`?

### Submission

Submit:

1. `optical_product_decision.ipynb` with the inventory audit and prediction recorded before output;
2. `optical_observation_decisions.csv` preserving all accepted, review and rejected rows;
3. one screenshot showing the gate table and one showing the local cloud/shadow mask review;
4. the two 180-word product recommendations;
5. a short written explanation separating DN, radiance, top-of-atmosphere reflectance and surface reflectance;
6. your completed observation contract with unresolved uncertainties and next actions.

### Portfolio artifact

Add **optical_product_decision.ipynb** to the UAV and Satellite Analysis Pipeline. A reviewer should be able to see why each observation was accepted, reviewed or rejected; reconstruct scale and mask rules; and understand what the accepted optical signal can and cannot support.
