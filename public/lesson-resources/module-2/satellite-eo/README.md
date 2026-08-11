# Satellite Earth Observation training pack

This compact pack supports Module 2, Chapter 5 of Remote Sensing Scientist Academy. Every value, identifier and coordinate is synthetic and was created for instruction. The files are **not** downloaded satellite products, real Baltic field plots or published measurements. They reproduce realistic metadata patterns and deliberate quality-control conditions without claiming real observations.

Use the pack to practise evidence-aware decisions before working with large Sentinel, Landsat, imaging-spectroscopy or LiDAR products. The ecological story is a Baltic coastal meadow monitoring question, informed by the vocabulary of the published [Baltic coastal plant traits 2024 dataset](https://doi.org/10.5281/zenodo.20083250). No row is derived from that dataset.

## Files

- `optical_observation_inventory.csv` compares product level, band support, scaling and quality status
- `optical_reflectance_samples.csv` contains small surface-reflectance samples with deliberate cloud and shadow cases
- `sentinel1_backscatter_samples.csv` contains synthetic Sentinel-1-style VV/VH observations with one incompatible orbit and one failed RTC case
- `hyperspectral_signatures.csv` contains illustrative spectra, bandwidth, signal-to-noise and deliberate bad-band flags
- `lidar_point_samples.csv` contains a tiny point-cloud table with returns, classes, heights and a deliberate unclassified outlier
- `SATELLITE_EO_QA_TEMPLATE.md` provides a cross-sensor decision structure
- `manifest.json` records status, licence, intended use and SHA-256 checksums

## Working rules

1. Keep the downloaded files unchanged in an `inputs/` folder
2. Write derived tables to a separate `outputs/` folder
3. Read `manifest.json` before interpreting values
4. Preserve rejected rows and record why they failed
5. Treat resampling as a representation change, not new sensor resolution
6. Treat spectral indices as proxies, SAR backscatter as a compound response and canopy height as a difference between estimated surfaces
7. Do not describe the data as real observations in a submission or portfolio

## Licence

The instructional files are released under CC0-1.0. External documentation linked by the lessons retains its original copyright and licence.
