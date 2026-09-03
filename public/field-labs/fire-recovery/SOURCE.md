# Copernicus EMSR527 source record

This folder bundles the observed-event GeoJSON used by Field Lab 06. It was
extracted without geometric editing from the official Copernicus Emergency
Management Service AOI01 Delineation Monit03 vector package.

- Activation: `EMSR527 — Forest Fires in Greece`
- Activation page: https://mapping.emergency.copernicus.eu/activations/EMSR527/
- Product archive: https://cems-mapping-website.s3.eu-west-1.amazonaws.com/static/activations/EMSR527/EMSR527_AOI01_DEL_MONIT03_r1_RTP01_v1_vector.zip
- Source file: `EMSR527_AOI01_DEL_MONIT03_observedEventA_r1_v1.json`
- Archive SHA-256: `6a6bacc4b9efd581353e61ce7659bd7aff766b1c54f1a6c5888ed064b25cfa03`
- Published GeoJSON SHA-256: `22780646fb0a97b79e0971fd2f635ee12711360b92de90334b24a6b7d6837476`
- Retrieval date: 2026-09-03

The published copy differs from the archive only by CRLF-to-LF line-ending
normalization. Its coordinates and attributes are unchanged. The GeoJSON
contains two observed-event features. The analysis explicitly
filters the feature whose `notation` property is `Burnt area`; it does not use
the smaller feature marked `Not applicable` as burned area.

See the Copernicus Emergency Management Service activation page for product
metadata, access conditions and limitations.
