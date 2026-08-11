# Chapter 10 training pack — Professional GIS Ecosystems

This pack supports Lesson 2.46 and Practicum 10 of **Geospatial Data Science**. It contains a synthetic organisational scenario, not a recommendation to purchase any product and not a substitute for an organisation's current licence, security or architecture review.

## Scientific situation

The Baltic coastal-meadow research group must hand its reviewed workflow to three collaborators:

- a regional authority whose analysts use ArcGIS Pro and ArcGIS Online;
- a university team using QGIS, GeoPandas, Rasterio and PostGIS;
- a field partner that needs a small offline exchange package.

The scientific question, accepted source evidence and QA thresholds must remain the same in every environment. Only the implementation components may change.

All organisations, requirements, identifiers and decisions in this pack are invented for training. No account, licence, service endpoint, credential or real sensitive location is included.

## Files

| File | Purpose |
| --- | --- |
| `workflow_requirements.csv` | Audience, operation, evidence and risk requirements that drive architecture selection |
| `ecosystem_component_inventory.csv` | Deliberately incomplete claims about candidate ArcGIS and open components |
| `workflow_translation.csv` | One coastal-meadow workflow expressed through two implementation ecosystems |
| `sharing_risk_register.csv` | Public, organisational and restricted sharing scenarios requiring a decision |
| `environment_constraints.json` | Three synthetic operating environments with different licence, connectivity and governance constraints |
| `PROFESSIONAL_ECOSYSTEM_QA_TEMPLATE.md` | Review template for role allocation, scientific invariants, portability and release evidence |
| `manifest.json` | File sizes, SHA-256 checksums, licence and training-data status |

## Required approach

1. Verify the manifest before using the pack.
2. Start from `workflow_requirements.csv`, not from favourite software.
3. Treat every capability in the component inventory as a claim until version, licence, extension, data type and test evidence are recorded.
4. Identify one authoritative source for each data class.
5. Preserve scientific invariants across implementations: CRS, grid, spatial support, stable IDs, nodata, eligibility, provenance and acceptance thresholds.
6. Separate desktop authoring, automated processing, governed storage, service delivery, identity, backup and public communication.
7. Design at least one exit or migration test for every organisation-specific dependency.
8. Never publish credentials, internal service URLs, private coordinates or editable source layers.

## ArcGIS access is optional

No paid ArcGIS licence is required to complete the lesson or practicum. Learners with authorised access may verify additional capabilities in their organisation, but they must record product version, user type, extensions, privileges and test evidence. Learners without access use the supplied deterministic evidence and mark unverified capabilities honestly.

## Licence

The synthetic training materials in this directory are released as **CC0-1.0**. Product names belong to their respective owners. Always verify current product documentation and organisational terms before implementation.
