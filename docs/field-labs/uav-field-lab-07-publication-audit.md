# Field Lab 07 publication audit

## Public release scope

Field Lab 07 uses the documented 2024 western Estonia UAV acquisition and processing workflow. Public pages contain scientific explanations, code-native diagrams, a two-mode SOP, a downloadable checklist, source boundaries and explicit stop gates.

## Verified project facts

- acquisition: 30 June–2 July 2024 at Saardu, Keemu, Kõera and Kudani;
- aircraft: senseFly eBee X;
- multispectral payload: Parrot Sequoia, approximately 106–109 m AGL, 80% forward and 75% side overlap, approximately 10 cm/pixel output;
- RGB/thermal payload: senseFly Duet T with S.O.D.A. RGB and 640 × 512 thermal camera;
- RGB: approximately 119–125 m AGL, 85–88% forward and 80–86% side overlap, approximately 2.7 cm/pixel output;
- thermal output: approximately 15.6 cm/pixel;
- processing: eMotion 3.23.12494 and PIX4Dmapper 4.3.27 in the project record;
- project analysis CRS: Estonian Coordinate System of 1997, EPSG:3301;
- verified project indices: NDVI, GNDVI, SAVI, MSAVI, RNDVI, RTVIcore, SRe and CIre;
- the documented final vegetation-trait modelling inputs used reflectance bands, vegetation indices and DSM-derived information rather than thermal predictors.

## Operational evidence retained

The public SOP incorporates the manual’s eMotion Postflight sequence, mission/time audit, RINEX and PPK branch, image-log matching, corrected-output handoff, PIX4D image-group checks, initial-processing-only gate, GCP import and manual marking, reoptimization loop, staged point-cloud/raster processing, reflectance-map generation and Quality Report review.

## Security and screenshot decision

The source manual contains a username, password, authenticated service screen, internal machine paths, project identifiers and photographed legacy UI instructions. No source screenshot was published. Twenty code-native diagrams replace those screenshots while preserving the action, purpose, expected result, check and stop condition. No credential, private path or unverified local project/job name is included in the public release.

## Facts intentionally bounded

- The PPK change from approximately 0.806 m to 0.049 m is labelled as one manual/project example, not guaranteed final map accuracy.
- Estonia local time is stated as UTC+3 only for the 2024 summer workflow, not as a year-round rule.
- The public SOP does not claim a vertical datum that the reviewed project evidence did not unambiguously establish.
- The historical Trimble Access project/job names were not verified as reusable instructions and are omitted.
- No reason is invented for excluding thermal predictors from the final trait models.

