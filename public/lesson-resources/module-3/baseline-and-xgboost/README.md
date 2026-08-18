# Module 3 Chapter 2 training pack

## Purpose

This pack supports Lessons 3.5–3.8 of **Remote Sensing Modelling**. It provides a small, inspectable regression experiment for learning baselines, tree ensembles, XGBoost mechanisms and reproducible model handover.

## Scientific status

Every row in `baseline_modelling_data.csv` is **synthetic**. The values were constructed for teaching and are not field, UAV or satellite measurements from the Baltic coastal plant-traits dataset or any monitoring programme. Site labels such as `coast-a` are fictional. Do not use the fixture for ecological inference.

The continuing Academy story is informed by the kinds of field and EO evidence used in coastal-meadow research. The published dataset remains cited separately at <https://doi.org/10.5281/zenodo.20083250>. The published record does not authorise the Academy to invent coordinates, measurement units or EO matches.

## Files

| File | Role |
|---|---|
| `baseline_modelling_data.csv` | synthetic continuous-target modelling table with saved Chapter 2 roles |
| `BASELINE_REPORT_TEMPLATE.md` | evidence structure for Lesson 3.5 |
| `parameter_decision_record.csv` | parameter-effect and justification register for Lesson 3.7 |
| `MODEL_METADATA_TEMPLATE.json` | sidecar metadata structure for Lesson 3.8 |
| `manifest.json` | file identities, licence and SHA-256 checksums |

## Split contract

`chapter2_split` has three allowed values:

- `train`: may fit Chapter 2 baselines and the untuned candidate;
- `validation`: may score those frozen candidates on identical observation IDs;
- `sealed`: must not influence Chapter 2 feature, parameter or model decisions.

The split is instructional. It does not yet prove new-site, spatial or temporal transfer. Chapter 3 will replace it with validation designs aligned to specific generalisation claims.

## Feature contract

| Field | Teaching meaning | Unit/status |
|---|---|---|
| `vegetation_height_cm` | synthetic continuous target | centimetres |
| `sentinel2_ndvi` | synthetic NDVI-style predictor | unitless |
| `sentinel2_ndmi` | synthetic NDMI-style predictor | unitless |
| `uav_height_p95` | synthetic UAV canopy-height percentile | centimetres |
| `texture_contrast` | synthetic image-texture contrast | arbitrary teaching scale |
| `acquisition_gap_days` | synthetic absolute field-to-imagery day gap | days |

These meanings apply only to this fixture. They do not establish the accuracy, acquisition protocol or operational availability of similarly named variables elsewhere.

## Recommended integrity checks

1. Verify every checksum in `manifest.json`.
2. Confirm observation IDs are unique.
3. Confirm split labels use only the allowed values.
4. Select features by one recorded ordered list.
5. Keep baseline and candidate validation IDs identical.
6. Save row-level predictions keyed by observation ID.
7. Keep the sealed targets outside development decisions.
8. Store model JSON and experiment metadata together.

## Licence

The synthetic training pack is released under CC0-1.0 for teaching and testing. Authoritative software documentation and the published scientific dataset retain their own terms.
