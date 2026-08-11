---
title: UAV Remote Sensing Fundamentals
lessonId: lesson-2-18
---

## 1. Start with the observing system

### Learning outcome

By the end of this lesson, you will be able to describe a UAV as a complete remote-sensing system; distinguish RGB, multispectral, thermal and LiDAR measurements; separate direct image records from derived products; and explain why fine ground sampling distance does not establish accuracy or scientific suitability.

- **Lesson type:** Concept lesson
- **Estimated time:** 70–90 minutes
- **Prerequisites:** Lessons 2.1–2.4 and Chapter 3 raster concepts. You should be able to distinguish a coordinate reference system, raster cell, resolution, NoData and spatial support.

### Why this matters

A small aircraft can acquire imagery when satellite observations are cloudy, too coarse or poorly timed. That flexibility makes UAV data valuable for Baltic coastal meadows, where plant communities, grazing boundaries, tidal channels and bare-soil patches can vary over metres or centimetres.

The same flexibility also makes every flight a new measurement campaign. Platform motion, sensor configuration, illumination, positioning and processing are part of the observation. An orthomosaic is not a photograph that has merely been “put on a map.” It is a reconstructed geospatial product whose pixels inherit decisions from the entire workflow.

> **Professional principle:** A UAV orthomosaic is derived evidence, not raw observation.

### Scientific context

The research group wants a UAV survey to support vegetation mapping near synthetic coastal-meadow plots. The Chapter 4 files are deliberately synthetic. They reproduce realistic metadata and failure patterns without publishing real imagery or field locations.

Your role is not to fly a drone. It is to decide what a proposed survey actually measured, how the derived products were produced and whether they are fit for an ecological question.

### Learner action

Create `01_mission_design.ipynb` inside `uav_photogrammetry/`. Add a Markdown heading named **Observation chain**. Beneath it, write the ecological target, the proposed sensor measurement and the intended derived product as three separate statements.

## 2. Mental model — platform, payload and evidence chain

A UAV remote-sensing system contains several interacting components:

- the **platform** carries the payload through a planned path;
- the **flight-control system** manages position, speed, height and triggering;
- the **sensor** converts incoming electromagnetic energy or laser returns into recorded values;
- the **navigation system** records position, time and sometimes orientation;
- the **data-storage system** preserves images and metadata;
- the **mission design** determines viewing geometry, overlap, spatial extent and observation time.

No component acts alone. A good sensor on an unstable or poorly documented mission does not guarantee good evidence. Precise geotags do not correct motion blur. High overlap does not correct saturated pixels. A visually seamless mosaic does not establish reflectance comparability.

![Technical diagram tracing platform, sensor, navigation, storage and flight control through direct measurements to derived UAV products.](lesson-media/images/uav-sensor-system.svg)

The direct record is usually an individual sensor image plus metadata. A point cloud, digital surface model, orthorectified image, orthomosaic, reflectance layer or vegetation index is created through additional modelling and processing.

[[CHECK:m2-l18-system]]

## 3. Platform types change mission possibilities

Three broad platform designs appear in environmental work.

### Multirotor

A multirotor can hover, change direction in a compact area and follow flexible flight geometry. These capabilities are useful around small sites and obstacles. Its endurance and large-area efficiency are commonly more limited than fixed-wing systems.

### Fixed-wing

A fixed-wing platform gains lift through forward motion. It can cover larger areas efficiently and may remain airborne longer, but it cannot hover and can require more space and planning for launch, recovery and low-speed turns.

### VTOL hybrid

A vertical-take-off-and-landing hybrid combines vertical launch with wing-borne forward flight. It can reduce launch-space constraints while retaining some fixed-wing efficiency. That does not make it universally preferable: payload, wind response, maintenance, mission geometry and operational approval still matter.

These are observing-platform categories, not shopping recommendations. A professional acquisition plan begins with study area, target, required support, timing, uncertainty and safety—not a preferred aircraft model.

### Interpretation task

For a 4-hectare meadow with narrow channels and nearby trees, list one potential measurement advantage and one operational limitation for multirotor and fixed-wing designs. Do not choose a platform until you state the ecological target and required area.

## 4. Sensor types measure different signals

### RGB camera

An RGB camera records visible-band responses through red, green and blue channels. Depending on camera and processing, stored digital values may represent a rendered colour image rather than calibrated radiance or reflectance. RGB imagery can support visual interpretation, structural reconstruction, object delineation and high-detail orthomosaics. It does not automatically provide comparable surface reflectance.

### Multispectral camera

A multispectral camera records several bands, often including Green, Red, Red Edge and near-infrared. Band centres and bandwidths must come from documented sensor metadata. Separate lenses or detectors can see a feature from slightly different viewpoints, so band co-registration must be demonstrated before cell-wise indices are calculated.

Multispectral digital numbers do not become reflectance merely because the files are labelled by wavelength. Exposure, black level, gain, calibration coefficients, reference panels and irradiance measurements may all contribute to the radiometric chain.

### Thermal camera

A thermal infrared camera detects emitted radiation within its response range. A processed output may represent brightness or apparent surface temperature under stated assumptions. It is not direct air temperature. Emissivity, sensor drift, reflected environmental radiation, atmosphere, viewing angle and calibration affect interpretation.

### UAV LiDAR

LiDAR is active sensing: the instrument emits laser pulses and records returned energy and timing. It can produce three-dimensional points and, depending on system and processing, multiple returns, intensity and classifications. Photogrammetric point clouds and LiDAR point clouds can both contain XYZ coordinates, but they arise from different measurement processes and have different failure modes.

[[CHECK:m2-l18-sensors]]

### QA check

For each sensor, complete this sentence: “The instrument directly records ___; the environmental quantity I want is ___; the required processing or calibration is ___.” If the first and second blanks are identical without explanation, review your reasoning.

## 5. Raw image, calibrated image and derived product

Use precise product language:

| Product | What it is | What it is not |
|---|---|---|
| Raw image | Sensor record in one camera perspective with acquisition metadata | A planimetrically correct map |
| Calibrated image | Image values transformed under a documented radiometric model | Proof that illumination and directional effects are eliminated |
| Orthorectified image | One image geometrically corrected using camera geometry and a surface model | A complete mosaic |
| Orthomosaic | Selected and blended regions from multiple orthorectified images | One instantaneous raw photograph |
| Point cloud | Discrete reconstructed or measured 3-D locations | A continuous terrain surface |
| DSM | Gridded representation of the reconstructed upper visible surface | Bare earth or direct canopy height |
| Reflectance product | Values processed toward surface-response comparability | An automatically validated ecological variable |
| Vegetation index | Mathematical combination of selected spectral bands | Direct biomass, chlorophyll or species identity |

The distinctions matter because quality evidence differs by product. Image blur is assessed in source frames. Control and check-point residuals assess georeferencing. Seamlines are mosaic properties. Band alignment and scale govern a multispectral index.

### Worked example — classify the evidence

#### Predict before running

Which entries are direct sensor records, and which depend on a reconstruction or transformation?

```python
products = {
    "raw RGB frame": "direct image record",
    "image geotag": "navigation metadata",
    "dense point cloud": "derived reconstruction",
    "orthomosaic": "derived raster product",
    "NDVI": "derived spectral index",
}

for product, evidence_type in products.items():
    print(f"{product}: {evidence_type}")
```

### Code walkthrough

1. A dictionary stores one product name and one evidence classification per entry.
2. The raw frame is a direct sensor record, but still requires metadata and quality review.
3. A geotag is navigation metadata; its presence does not state its positional accuracy.
4. The dense cloud depends on matching and geometric reconstruction.
5. The orthomosaic depends on geometry, a surface, orthorectification, resampling and mosaicking.
6. NDVI depends on band identity, radiometry, alignment, masks and a formula.
7. The loop prints a human-readable inventory suitable for expansion into a QA table.

This classification is conceptual rather than a claim that “direct” means error-free. Direct records still contain instrument response, perspective, timing and exposure effects.

## 6. Ground sampling distance is only one scale description

Ground sampling distance, or GSD, describes the nominal ground distance represented by one image pixel under a stated acquisition geometry. A 2 cm GSD means adjacent sensor samples project approximately 2 cm apart on a reference surface under the model.

GSD does **not** equal:

- absolute horizontal or vertical accuracy;
- true optical resolving power;
- the smallest object that can be detected reliably;
- the positional uncertainty of a boundary;
- the support of a derived ecological metric;
- scientific accuracy.

Blur, lens modulation, contrast, resampling and reconstruction can reduce effective detail. An object may need multiple pixels and sufficient contrast to be detected. A centimetre-scale mosaic can be displaced by decimetres or metres if georeferencing is weak. A very fine grid can also amplify irrelevant leaf-level variation when the ecological question concerns a 10 m community plot.

### Learner action

Write two statements: one that correctly reports nominal GSD and one that separately describes the positional evidence you would require. Avoid the phrase “2 cm accurate.”

## 7. A mosaic is not necessarily instantaneous

A flight can last tens of minutes or hours. Images contributing to the western edge may be acquired earlier than images in the east. During that interval:

- sun angle and cloud cover can change;
- shadows can move;
- wind can move grass and shrubs;
- tides or surface water can change;
- thermal conditions can drift;
- mowing, grazing or trampling can occur between field and image dates.

Mosaicking places these observations into one spatial layer, but it does not remove temporal differences. The `mission_metadata.csv` fixture records a 32-minute flight and a field date four days earlier. Whether that mismatch is acceptable depends on process stability, weather and the question—not the calendar difference alone.

[[CHECK:m2-l18-time]]

## 8. Legal, safety and governance context

UAV work operates under aviation permissions, no-fly restrictions, risk assessment, operator competence, land access, privacy and data-governance requirements. Rules vary by jurisdiction and change over time. This Academy does not provide operational or legal authorisation.

A scientific analyst should nevertheless ask whether acquisition was lawful, safe and appropriately governed. High-resolution imagery can reveal people, property, infrastructure or sensitive ecological locations. Access controls, minimisation, retention and publication decisions belong in provenance and handover records.

For a real mission, consult the current aviation authority and organisational procedures before acquisition. Do not reuse a lesson’s conceptual flight design as operational permission.

## 9. Common mistakes and recovery

### Calling an orthomosaic raw imagery

**Why it happens:** the mosaic looks photographic. **Recognition:** no reconstruction, surface or seamline history is reported. **Recovery:** identify source images, orthorectification surface, resampling, seamline and blending evidence.

### Treating GSD as accuracy

**Why it happens:** both use distance units. **Recognition:** “2 cm accurate” is justified only by pixel size. **Recovery:** report GSD, independent check-point accuracy, effective resolution and target support separately.

### Assuming a sensor label defines measurement units

**Why it happens:** a file is named `rededge`. **Recognition:** scale, calibration and band metadata are missing. **Recovery:** quarantine quantitative interpretation until the product definition is verified.

### Treating a UAV survey as instantaneous

**Why it happens:** the output is one raster. **Recognition:** acquisition start/end and contribution times are absent. **Recovery:** preserve capture times and investigate conditions across the block.

### Selecting a platform before defining evidence needs

**Why it happens:** equipment is concrete and visible. **Recognition:** the plan lists aircraft features but not target, support, extent or uncertainty. **Recovery:** write the scientific observation contract first.

## 10. Guided practice — build the UAV sensor and product inventory

Use `mission_metadata.csv`, `image_metadata.csv`, `photogrammetry_report.json` and the raster manifest.

1. Record the mission identifier, platform category, payload and observation period.
2. Identify every direct sensor record, navigation record and derived product.
3. For each sensor type in the lesson, state the direct physical signal and a possible environmental use.
4. Separate recorded facts from assumptions. “Red Edge scale ambiguous” is evidence; “divide by 10,000” is an unsupported action.
5. Record the nominal raster cell size without calling it accuracy.
6. Identify which products depend on a surface model.
7. Identify which products depend on multi-image matching.
8. Record the four-day field/UAV temporal mismatch as a review condition.
9. Name the quality evidence required before accepting each product.
10. Add a `decision_status` column with `accept`, `review` or `unsuitable` and a reason.

### QGIS visual QA companion

Open `uav_rgb_preview.tif`, `uav_dsm.tif` and `uav_red.tif` in QGIS. Inspect layer CRS, dimensions, pixel size, bands, type and NoData. Use the metadata panel to establish that these are different product classes. Visual appearance cannot resolve reflectance scale or positional accuracy.

### QA checklist

- [ ] Platform, payload, navigation and acquisition interval are recorded.
- [ ] Direct observations and derived products are separated.
- [ ] Sensor type is linked to measured signal, not only an application.
- [ ] GSD is not presented as positional or scientific accuracy.
- [ ] Spatial and temporal support are explicit.
- [ ] Synthetic status and data-governance limits are visible.

## 11. Independent challenge — choose evidence for one meadow question

The team asks: “Can the UAV survey identify changes in vegetation structure after grazing?” Prepare a one-page evidence design that:

- defines the target change and spatial unit;
- compares what RGB, multispectral, thermal and LiDAR could contribute;
- identifies at least one derived product per relevant sensor;
- states which product would need a surface model, radiometric calibration or band alignment;
- separates nominal GSD from required positional evidence;
- specifies field and UAV temporal compatibility;
- identifies one privacy or sensitive-location risk;
- rejects at least one unnecessary product with a scientific reason.

Do not claim that a sensor directly measures grazing impact. It records electromagnetic or geometric evidence that may support a validated inference.

### Scientific interpretation

UAV remote sensing is a designed observation system. The scientific value does not come from flying close to the ground; it comes from connecting sensor measurement, mission geometry, calibration, georeferencing, processing and validation to a defined environmental question.

A professional inventory should make downstream assumptions visible. If a product cannot be traced to direct records and processing evidence, its visual detail does not make it analysis-ready.

## 12. Reflection, submission and portfolio artifact

Answer in your private notes:

1. What does each principal UAV sensor directly measure?
2. Why is an orthomosaic not a raw image?
3. What does GSD describe, and what does it not describe?
4. How can a 30-minute mission contain temporal inconsistency?
5. Which evidence would make you stop before analysing a product?

### Submission

- **Notebook:** `01_mission_design.ipynb` with observation chain and product classification.
- **Table:** sensor/product inventory with direct/derived status, units, support and required QA.
- **Screenshot:** QGIS metadata views for one image-like product and one surface product.
- **Written answer:** 250–320 words explaining why the orthomosaic is derived evidence.

### Portfolio artifact

**Artifact 2.18 — UAV sensor and product inventory**

Add the inventory and evidence design to the **Professional UAV Product Audit and Processing Report**. This becomes the product vocabulary and provenance foundation for every later lesson.
