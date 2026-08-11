# Spatial Database QA Record

## 1. Question and analysis population

- Scientific question:
- Observation unit and support:
- Inclusion rule:
- Exclusion/review rule:
- Expected grain and extent:

## 2. Source and authority register

| Object | Owner | Authoritative source | Version | Stable key | CRS | Licence | Update rule | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## 3. Relational integrity

| Check | Expected | Observed | Status | Evidence/action |
| --- | --- | --- | --- | --- |
| Primary-key uniqueness | | | | |
| Foreign-key coverage | | | | |
| Join cardinality | | | | |
| Required-field completeness | | | | |
| NULL policy | | | | |
| Domain/range constraints | | | | |

## 4. Spatial integrity

| Check | Expected | Observed | Status | Evidence/action |
| --- | --- | --- | --- | --- |
| Geometry type | | | | |
| SRID | | | | |
| Geometry validity | | | | |
| Boundary predicate | | | | |
| Unmatched/one-to-many features | | | | |
| Distance and buffer units | | | | |

## 5. Query reconciliation

Record SQL text or script path, input row counts, output row counts, grouped totals, unmatched identifiers, duplicate identifiers, execution date and software version. Compare one key result with GeoPandas or QGIS using the same inputs, predicate, CRS and filter.

## 6. Performance and operations

- Attribute indexes and their query purpose:
- Spatial indexes and their query purpose:
- Evidence from `EXPLAIN` or `EXPLAIN ANALYZE`:
- Partitioning decision and evidence threshold:
- Transaction, migration and rollback plan:
- Backup and restore-test policy:
- Read/write roles and credential boundary:

## 7. Storage architecture

| Data class | Authoritative store | Access copy | Delivery format | Update pattern | Retention | Rationale |
| --- | --- | --- | --- | --- | --- | --- |

## 8. Provenance and release decision

- Immutable sources and checksums:
- Transformation lineage:
- Derived product version:
- Known limitations:
- Accept, conditional accept or block:
- Responsible role and next action:

