# Field Lab 10 — Hyperspectral evidence checklist

## Question and reference
- [ ] Define class or continuous response, spatial support and application domain
- [ ] Record field/lab reference protocol, timing and sample independence
- [ ] Predeclare non-claims such as automatic species or stress-cause identification

## Cube contract
- [ ] Verify row, column and band axis order
- [ ] Read centre wavelength and bandwidth/FWHM for every band
- [ ] Record DN/radiance/reflectance level, scale, units and fill value
- [ ] Record CRS, transform, pixel size and acquisition geometry
- [ ] Preserve source identifiers and processing provenance

## Valid evidence
- [ ] Build spatial and spectral validity masks from product metadata and QA
- [ ] Review low-SNR, atmospheric-absorption and spectral-edge regions
- [ ] Preserve exclusions in a band/pixel audit log
- [ ] Keep NaN/NoData distinct from zero reflectance
- [ ] Plot spectra with dispersion and sample counts

## Features and validation
- [ ] Align field and image support/timing
- [ ] Convolve external reference spectra to sensor response where required
- [ ] Split by independent site/plot/object before scaling, PCA or feature selection
- [ ] Fit every learned transform inside training folds
- [ ] Compare a transparent baseline with more flexible models
- [ ] Report per-class or response-specific held-out metrics
- [ ] Map uncertainty/confidence and domain of applicability

## Handoff
- [ ] Deliver cube/band contract, masks and reference-linked spectra
- [ ] Save folds, fitted preprocessing, model and feature register
- [ ] Export prediction, uncertainty and applicability rasters
- [ ] Document sensitivity, supported claims and non-claims
- [ ] Label Academy signatures as synthetic instructional data
