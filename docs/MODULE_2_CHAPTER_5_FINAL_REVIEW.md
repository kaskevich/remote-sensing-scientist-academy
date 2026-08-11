# Module 2 Chapter 5 final review

## Review decision

Chapter 5 is ready for release as the Satellite Earth Observation foundation of Module 2. The five lessons preserve one professional standard across very different sensors: identify the measured quantity, qualify the observation, preserve spatial and temporal support, derive only from accepted evidence, and stop interpretation where validation ends.

The chapter does not treat sensor availability as scientific fitness. Optical, spectral-index, SAR, imaging-spectroscopy and LiDAR evidence remain physically distinct through the final practicum.

## Quality findings

| Dimension | Finding |
| --- | --- |
| Optical observation science | Product level, band response, four resolution concepts, scale/offset and cloud/shadow evidence precede analysis |
| Spectral indices | NDVI, GNDVI, SAVI and MSAVI are taught as masked context-dependent proxies rather than biological measurements |
| SAR reasoning | C-band, VV/VH, geometry, speckle, calibration, RTC and linear/decibel arithmetic form one comparable-observation contract |
| Imaging spectroscopy | Spectral response, absorption features, SNR, bad bands, dimensionality and leakage-safe feature selection are integrated |
| LiDAR structure | Returns, classes, density, vertical reference, interpolation, DSM/DTM and negative-height diagnostics remain traceable |
| Cross-sensor synthesis | The practicum records convergence, divergence and insufficient evidence without forcing incompatible supports into one claim |
| Beginner accessibility | Every lesson uses one main concept, prediction before execution, short executable code, line-by-line walkthrough and guided practice |
| Reproducibility | Synthetic provenance, immutable inputs, checksums, reason fields, explicit QA gates and round-trip output checks are assessed |
| Portfolio value | Five lesson artifacts culminate in Artifact 2.E, a reviewable Satellite EO Evidence Package |

## Scientific safeguards

- Stored digital numbers are never compared without product-specific scaling evidence
- A resampled grid is never described as new native sensor resolution
- Scene cloud percentage never replaces local pixel-level quality review
- Spectral indices never become direct biomass, chlorophyll or biodiversity measurements
- SAR brightness retains moisture, roughness, structure and geometry as competing controls
- Decibel and linear-power operations remain distinct
- Spectral bad-band decisions remain in the inventory
- Outcome-informed feature selection remains inside future training validation
- LiDAR return order never replaces validated point classification
- Point density, positional accuracy and vertical reference remain separate
- Negative canopy-height differences remain diagnostic evidence rather than being silently clipped

## Training-pack review

The Chapter 5 pack is deliberately compact and entirely synthetic under CC0-1.0. It includes optical product and reflectance tables, Sentinel-1-style backscatter, spectral signatures, point samples, a QA template and a SHA-256 manifest. Deliberate conditions include cloud, shadow, haze, missing scale evidence, incompatible SAR geometry, failed RTC, low-SNR wavelengths and an unclassified elevation outlier.

The pack supports decision logic and code practice. It does not claim to reproduce the texture, volume, uncertainty or processing burden of real mission products.

## Known limits and deferred depth

- Full Sentinel SAFE/Landsat product reading, atmospheric-correction execution and BRDF harmonisation are deferred
- SAR SLC phase, interferometry, coherence and polarimetry require later specialist treatment
- Imaging-spectroscopy cube processing and large Xarray/Dask workflows are introduced in later Module 2 chapters
- Point-cloud rasterisation uses a compact table rather than a production LAS/LAZ survey
- Formal uncertainty propagation, sensor harmonisation and predictive ecological modelling are deferred until the relevant statistics and modelling modules
- Mission catalog/API retrieval is not required for this chapter, so learners can focus on measurement contracts before platform syntax

## Verification record

- lesson structure, formative checks, rubrics and minimum content depth verified automatically
- all Python examples syntax-checked and limited to short teaching blocks
- training-pack checksums verified automatically
- portfolio notebook extended through Lessons 2.26–2.30 and Chapter 5 Practicum
- lint, TypeScript checks, 148 automated tests and production static export passed
- browser smoke tests passed at mobile, tablet and desktop widths with no horizontal overflow

## Final benchmark statement

A learner who completes Chapter 5 should be able to explain what each sensor measures, select and qualify observations, calculate valid derivatives, preserve native support, identify principal confounders and deliver a cross-sensor evidence package whose limits are as visible as its results. That is the required foundation before spatial statistics, databases, cloud-native data and later predictive modelling.
