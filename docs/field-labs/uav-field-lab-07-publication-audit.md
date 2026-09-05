# Field Lab 07 publication audit

## Revision after mobile review

- The flagship page is a chronological 22-step mission-to-handoff tutorial rather than a concept-first card sequence.
- Every major step exposes WHAT, ACTION, WHERE, WHY, INPUT, OUTPUT, CHECK, IF THIS FAILS and NEXT.
- Workflow, photogrammetry, tutorial and portfolio cards are keyboard-operable, expose `aria-expanded`, and use one-open-card interaction.
- Phase 0 reconciles the field-preparation notes into explained at-home, on-site and per-flight-note checklists while keeping eBee X, DJI, PPK, aircraft RTK, surveyed GCP RTK and reference-station data distinct.
- The Drone Lab begins with a 17-step pre-flight quick SOP, then clearly transitions to its 21-step post-flight procedure.
- Six Academy-safe crops of real 2024 Saardu products support a same-site NDVI, GNDVI, RNDVI, MSAVI, DSM and thermal comparison.

## 2024 processing-manual reconciliation

| Manual page / section | Field Lab 07 | Drone Lab | Status |
|---|---|---|---|
| Aircraft/camera data retrieval | Tutorial 05 | Step 00 + reference A | IMPLEMENTED |
| Copy imagery and logs before processing | Tutorial 05 | Step 01 | IMPLEMENTED |
| eMotion Postflight start | Tutorial 06 | Step 02 | IMPLEMENTED |
| Select mission log, date and interval | Tutorial 06 | Step 03 | IMPLEMENTED |
| July 2024 UTC/local-time relationship | Tutorial 06 + positioning reference | Step 03 | IMPLEMENTED |
| Match flight log to image folder | Tutorial 06 | Step 04 | IMPLEMENTED |
| Obtain overlapping RINEX/base observations | Tutorial 07 | Step 05 | IMPLEMENTED |
| PPK result and uncertainty comparison | Tutorial 07 | Step 05 | IMPLEMENTED |
| Write/preserve corrected geotags | Tutorial 07–09 | Step 06 | IMPLEMENTED |
| Create PIX4D project and verify image groups | Tutorial 09 | Step 07 | IMPLEMENTED |
| Set Estonian project/control CRS | Tutorial 08–09 | Step 08 | IMPLEMENTED |
| Run Initial Processing only | Tutorial 10 | Step 09 | IMPLEMENTED |
| Export Trimble control data | Tutorial 08 | Step 10 | IMPLEMENTED |
| Import GCP table and map fields | Tutorial 12 | Step 11 | IMPLEMENTED |
| Manually mark every accepted GCP | Tutorial 13 | Step 12 | IMPLEMENTED |
| Reoptimize and inspect residuals | Tutorial 14 | Steps 13–14 | IMPLEMENTED |
| Enable dense/raster stages | Tutorial 15–19 | Steps 15–18 | IMPLEMENTED |
| Quality Report and final output audit | Tutorial 11 + 21 | Steps 19–20 | IMPLEMENTED |
| Manual screenshots with credentials/paths | Code-native public diagrams | References A–C | SECURITY REDACTED |
| Historical Trimble job names | Omitted | Omitted | NEEDS VERIFICATION |
| Unambiguous vertical datum | Limitation stated | Stop gate | NEEDS VERIFICATION |

## Field-preparation-note reconciliation

| Field-note topic | Field Lab 07 | Drone Lab | Status |
|---|---|---|---|
| Charge batteries and pack complete aircraft/payload | Phase 0A | Pre-flight 01, 04–05 | IMPLEMENTED |
| Offline map and mission-map preparation | Phase 0A | Pre-flight 02 | IMPLEMENTED |
| Prepare GCP targets and Trimble/RTK job | Phase 0A | Pre-flight 03 | IMPLEMENTED |
| Place control around and within survey | Phase 0B | Pre-flight 15 | IMPLEMENTED |
| Survey GCP positions and preserve IDs | Phase 0B | Pre-flight 15 | IMPLEMENTED |
| Assemble wings/connections/payload | Phase 0B | Pre-flight 04–05 | IMPLEMENTED |
| Communication hardware and eMotion location | Phase 0B | Pre-flight 06–08 | IMPLEMENTED |
| Mission polygon, camera, altitude/GSD and overlap | Phase 0B + mission tutorial | Pre-flight 08–11 | IMPLEMENTED |
| Fixed-wing landing area/direction | Phase 0B | Pre-flight 12 | IMPLEMENTED |
| eMotion prechecks | Phase 0B | Pre-flight 13 | IMPLEMENTED |
| Settings screenshot and log ID | Phase 0B | Pre-flight 14 | IMPLEMENTED |
| Wind/light and flight metadata | Phase 0C | Pre-flight 16 | IMPLEMENTED |
| Field note → log/time/image-count/RINEX continuity | Phase 0 continuity visual | Steps 03–05 | IMPLEMENTED |
| DJI-only calibration/base-station shorthand | Excluded from eBee SOP | Excluded | NOT APPLICABLE |
| Exact electrical/launch/recovery sequence | Current approved procedure required | Safety boundary stated | SUPERSEDED |

## Verified project facts

- acquisition: 30 June–2 July 2024 at Saardu, Keemu, Koera and Kudani;
- aircraft: senseFly eBee X;
- multispectral payload: Parrot Sequoia, approximately 106–109 m AGL, 80% forward and 75% side overlap, approximately 10 cm/pixel output;
- RGB/thermal payload: senseFly Duet T with S.O.D.A. RGB and 640 × 512 thermal camera;
- RGB: approximately 119–125 m AGL, 85–88% forward and 80–86% side overlap, approximately 2.7 cm/pixel output;
- thermal output: approximately 15.6 cm/pixel;
- processing: eMotion 3.23.12494 and PIX4Dmapper 4.3.27 in the project record;
- project analysis CRS: Estonian Coordinate System of 1997, EPSG:3301;
- verified project indices: NDVI, GNDVI, SAVI, MSAVI, RNDVI, RTVIcore, SRe and CIre.

## Security and real-project visual audit

The private source manual informed the sequence but no username, credential, authenticated URL, machine path or unverified local job name is public. Code-native diagrams replace unsafe manual screenshots.

The image assets derive from user-supplied 2024 project maps in the `Vegetation_Indices_Plots` collection. A deterministic identical crop removes precise latitude/longitude axes and the original legend; raster-map pixels are otherwise unaltered, then downsampled for web delivery. Provenance is stored with the assets.

No raw RGB or like-for-like individual Green/Red/Red Edge/NIR render is published: the reviewed safe plot collection did not contain those products, and large research rasters were not converted without a verified public display scale. The public page states this limitation rather than inventing a comparison.

## Facts intentionally bounded

- The PPK change from approximately 0.806 m to 0.049 m is one manual/project example, not guaranteed final map accuracy.
- Estonia local time is stated as UTC+3 only for the 2024 summer workflow.
- No vertical datum is claimed where project evidence was not unambiguous.
- Historical Trimble Access project/job names are omitted.
- No reason is invented for excluding thermal predictors from the final trait models.
