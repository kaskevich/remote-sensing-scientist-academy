# Spatial Databases training pack

This pack supports Module 2 Chapter 7 of Remote Sensing Scientist Academy. Every record, coordinate, geometry and organisation name in the pack is synthetic and released under CC0-1.0 for instruction. The ecological questions are informed by the Academy's Baltic coastal meadow story, but the values are not observations from the published Baltic coastal plant-traits dataset and the coordinates are not field locations.

## What the pack represents

The research group has outgrown a folder of independently edited tables. It needs one reviewable representation of sites, plots, field observations and management zones. The pack lets you practise relational design, SQL population definition, PostGIS predicates, integrity checks and a storage-architecture decision without needing access to private or operational data.

The WKT geometries use EPSG:3301 syntax so CRS checks and spatial SQL can be taught explicitly. They are deliberately invented training geometries. Never join them to the published dataset as if they were real locations.

## Files

- `schema.sql` creates a small PostgreSQL/PostGIS teaching schema with primary keys, foreign keys, checks, views and indexes
- `meadow_sites.csv` contains four synthetic study-site records
- `field_plots.csv` contains twelve synthetic plots with stable identifiers and point WKT
- `plot_observations.csv` contains repeat vegetation observations, including deliberate review conditions
- `management_zones.csv` contains three synthetic polygon WKT records for predicate practice
- `database_handover_inventory.csv` describes a deliberately imperfect file handover that must be governed rather than copied blindly
- `SPATIAL_DATABASE_QA_TEMPLATE.md` is the evidence template for lessons and the chapter practicum
- `manifest.json` records provenance, deliberate conditions and SHA-256 checksums

## Deliberate training conditions

The pack includes conditions that a professional handover must surface:

1. one observation is marked `review` because its biomass value is outside the training protocol range;
2. one observation has no biomass value, represented as SQL `NULL` after import rather than zero;
3. one plot has no observation in the second survey round, so a `LEFT JOIN` and an `INNER JOIN` answer different questions;
4. one plot lies exactly on a management-zone boundary, so `ST_Within` and `ST_Intersects` do not assign it identically;
5. the handover inventory contains duplicated, missing-provenance and mixed-CRS entries that must not become authoritative silently.

These are not defects to erase. They are evidence for practising explicit population, predicate and governance decisions.

## Suggested import order

1. Read this guide and verify the manifest checksums.
2. Inspect `schema.sql`; do not run unfamiliar DDL against an operational database.
3. Create a disposable training database with PostgreSQL and PostGIS, or reason through the SQL without executing it.
4. Load sites before plots, zones before spatial assignment and plots before observations so foreign-key relationships remain visible.
5. Compare source and destination row counts and rejected rows after every import.
6. Run the non-spatial SQL checks before spatial predicates.
7. Preserve the supplied CSV files unchanged and write derivatives to a separate folder or training schema.

## Important safety boundary

The Academy is a static website and does not provide a shared database server. The SQL files are downloadable learning resources. Use a disposable local PostGIS environment, an instructor-provided training database or another explicitly authorised sandbox. Never paste credentials into a notebook, commit them to Git or run destructive SQL against a production database.

