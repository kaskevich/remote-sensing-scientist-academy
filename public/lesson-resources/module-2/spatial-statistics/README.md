# Spatial Statistics and Geostatistics training pack

This compact pack supports Module 2, Chapter 6 of Remote Sensing Scientist Academy. Every plot, coordinate, value and sampling decision is synthetic and was created for instruction. The files do **not** contain real Baltic coastal meadow locations or measurements. The ecological vocabulary follows the Academy's continuing coastal-meadow story, informed by the published [Baltic coastal plant traits 2024 dataset](https://doi.org/10.5281/zenodo.20083250), but no row is derived from that dataset.

Use the pack to practise spatial reasoning before applying a statistical method to real ecological observations. The design intentionally contains spatial gradients, clustered roadside observations, inaccessible sampling-frame cells, one isolated plot and incomplete inclusion-probability evidence. These conditions are not mistakes to delete. They are evidence to diagnose.

## Files

- `meadow_plot_observations.csv` contains synthetic plot coordinates, spectral and field variables, sampling route and deliberate design conditions
- `sampling_frame.csv` contains candidate sampling cells, environmental strata, accessibility and existing-selection status
- `spatial_validation_blocks.csv` assigns plots to separated validation blocks and identifies edge and isolated observations
- `SPATIAL_INFERENCE_QA_TEMPLATE.md` provides a decision structure for weights, sampling, interpolation and residual diagnosis
- `manifest.json` records licence, source status, deliberate conditions and SHA-256 checksums

## Working rules

1. Keep downloaded files unchanged in an `inputs/` folder
2. Write derived tables, maps and models to a separate `outputs/` folder
3. Treat the coordinates as a synthetic local metric grid, not as a real CRS or mappable Baltic location
4. Declare the analysis population, spatial support and target estimand before choosing a method
5. Preserve excluded and review observations with reasons
6. Compare more than one defensible spatial-weights or validation design
7. Use permutation results, interpolation surfaces and local coefficients as evidence to examine, not automatic causal explanations
8. Never describe the training pack as real field data in a submission or portfolio

## Licence

The instructional files are released under CC0-1.0. External documentation linked by the lessons retains its original copyright and licence.
