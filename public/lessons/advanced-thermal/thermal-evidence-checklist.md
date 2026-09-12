# Advanced thermal evidence checklist

Use this checklist with the Academy's standalone advanced thermal lesson. It is product-agnostic: the selected product's own metadata and documentation remain authoritative.

## Question and product

- [ ] Surface, time window, spatial support and intended comparison are defined.
- [ ] Non-claims are explicit: thermal is not automatically air temperature, soil moisture, evapotranspiration or plant stress.
- [ ] Product identifier, collection/version, processing level, acquisition time and sensor are recorded.
- [ ] Variable, units, scale, offset, fill, valid range and QA layers are verified.

## Processing

- [ ] Fill and invalid pixels are masked before arithmetic.
- [ ] Stored values are decoded with product-specific metadata.
- [ ] Brightness temperature and land-surface temperature are not conflated.
- [ ] Cloud, shadow, saturation, emissivity and uncertainty evidence are retained where supplied.
- [ ] Emissivity and atmospheric assumptions are documented.
- [ ] CRS, transform, extent, resolution, NoData and resampling method are verified.

## Comparison and validation

- [ ] Local time, season, weather and surface context are recorded.
- [ ] Field/reference observations have compatible timestamp, footprint and units.
- [ ] Matching and exclusion rules were declared before validation.
- [ ] Bias and error are reported with sample count and support limitations.
- [ ] Spatial/grouped validation is used when prediction performance is estimated.

## Release

- [ ] Temperature, QA mask, context, validation, methods and limitations travel together.
- [ ] Every map legend states variable, units, acquisition time and valid support.
- [ ] Observed temperature, derived contrast and modelled ecological quantity are labelled separately.
- [ ] Files reopen with correct CRS, units, scale and NoData.
