# Field Lab 08 — Sentinel-1 SAR evidence checklist

## Claim and reference

- [ ] State the target as surface water, candidate event inundation, or another explicit class
- [ ] Record the event chronology and reference/event time windows
- [ ] Define the area of interest and minimum mapping unit
- [ ] Reserve independent validation evidence before threshold tuning
- [ ] List permanent water, radar shadow, layover, built surfaces, wind-roughened water and emergent vegetation as possible confounders

## Scene comparability

- [ ] Record exact product identifiers and acquisition UTC
- [ ] Verify GRD/SLC product type and acquisition mode
- [ ] Verify polarization exists for every selected observation
- [ ] Compare orbit direction, relative orbit and incidence-angle range
- [ ] Confirm complete AOI coverage and common valid support
- [ ] Preserve rejected scenes and record the reason

## Processing

- [ ] Confirm what the source or processing service has already applied
- [ ] Use one documented orbit/noise/calibration/terrain-correction chain
- [ ] Record backscatter coefficient and linear or dB scale
- [ ] Record the DEM, projection, pixel spacing, grid origin and NoData
- [ ] Record speckle filter and spatial support, or state that no filter was used
- [ ] Verify exact co-registration of reference, event and masks

## Classification and validation

- [ ] Separate tuning samples from validation samples
- [ ] Record every feature, operator and threshold
- [ ] Distinguish permanent water, new candidate water, excluded and uncertain pixels
- [ ] Build a confusion matrix with sample counts
- [ ] Report inundation-class precision and recall plus IoU or F1
- [ ] Stratify errors by context when evidence supports it
- [ ] Sweep a defensible threshold interval and record mapped-area sensitivity

## Handoff

- [ ] Export calibrated dates, masks, final class and confidence layer
- [ ] Save the scene inventory, processing graph, decision log and validation report
- [ ] Confirm every output opens outside the processing project
- [ ] State supported claims and non-claims
- [ ] Label the Academy table as synthetic instructional data
