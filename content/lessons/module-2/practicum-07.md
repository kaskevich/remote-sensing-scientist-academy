---
title: Build a Governed Spatial Database Handover
lessonId: module-2-chapter-7-practicum
---

## Chapter 7 practicum — Build a Governed Spatial Database Handover

### Learning outcome

By the end of this practicum, you will be able to convert a deliberately imperfect spatial-data handover into a reviewable relational design, write population and spatial queries with reconciled results, document integrity and index evidence, select fit-for-purpose storage roles, and issue an implementation decision that protects authority, access, provenance, recovery and scientific meaning.

- **Estimated time:** 360–480 minutes
- **Prerequisites:** Lessons 2.35–2.37
- **Portfolio output:** **Artifact 2.G — Spatial Database and Governance Package**
- **Training status:** every supplied record and geometry is synthetic and released for instruction under CC0-1.0

### Why this practicum matters

A spatial database is not a collection of advanced function names. It is a shared scientific contract. The contract identifies a plot consistently, prevents an observation from referring to a nonexistent plot, states how geometry is referenced, records which rows enter a summary, preserves boundary ambiguity and controls who may change authoritative evidence.

Professional failure often occurs between apparently successful steps. A CSV imports but `NULL` becomes zero. A spatial join runs but boundary plots multiply. An index exists but the query transforms every geometry on demand and cannot use it effectively. A cloud folder contains three “final” orthomosaics but no checksum or owner. This practicum treats those transitions as the main work.

You are not expected to operate a production database. Use a disposable authorised PostGIS environment if available, or prepare and inspect the SQL without execution. Never expose credentials or run destructive commands against an operational service.

### Scientific brief

The Baltic coastal meadow research group wants a governed foundation for plot observations and spatial products. It must support:

- repeat field observations linked to stable plots and sites;
- management-zone queries with explicit boundary handling;
- analysis snapshots for Python workflows;
- immutable UAV and satellite acquisitions;
- portable reviewed deliveries;
- traceable derived products and recovery.

The group asks:

> Can the supplied synthetic handover be promoted into a controlled spatial-data system, and what conditions must be resolved before the proposed architecture becomes operational?

Your answer may be **implement**, **conditionally implement** or **block pending evidence**. A database that cannot be restored, secured or reconciled must not receive an unconditional approval.

## 1. Required training assets

Use `spatial-databases/README.md` first and preserve all supplied files unchanged:

- `meadow_sites.csv`;
- `field_plots.csv`;
- `plot_observations.csv`;
- `management_zones.csv`;
- `database_handover_inventory.csv`;
- `schema.sql`;
- `SPATIAL_DATABASE_QA_TEMPLATE.md`;
- `manifest.json`.

Create:

```text
spatial_database_governance_package/
├── README.md
├── environment.txt
├── inputs/
├── sql/
├── outputs/
│   ├── tables/
│   └── diagrams/
├── SPATIAL_DATABASE_QA.md
└── SPATIAL_DATABASE_HANDOVER_DECISION.md
```

Verify every checksum and record tool versions. State clearly that the EPSG:3301 geometries are invented training locations. If you use a database, create a training schema and a read-only analysis role. Do not connect the notebook to an unapproved database.

## 2. Gate A — define grain, authority and intended use

For every source table, state:

- what one row represents;
- the primary key and any candidate keys;
- foreign-key relationships;
- whether the table is a source, staging object, curated authority or derivative;
- who would own updates in a real project;
- expected geometry type, CRS, units and temporal support;
- accepted and review statuses;
- intended queries and users.

Define the main analytical population before importing:

> Accepted synthetic plot observations linked to registered plots and sites, retained at one row per plot and survey date, with missing biomass preserved as missing.

Define the spatial assignment question separately:

> Identify unambiguous plot interiors and preserve boundary intersections for review rather than forcing one management zone.

Create `authority_register.csv`. The supplied `database_handover_inventory.csv` contains candidates and duplicates; it is not already an authority map.

[[CHECK:m2-p7-integrity]]

## 3. Gate B — review schema before loading data

Inspect `schema.sql` line by line. Produce a schema diagram that includes:

- all four tables;
- primary and foreign keys;
- the unique `(plot_id, survey_date)` observation constraint;
- value-domain checks;
- point and polygon geometry declarations;
- B-tree and GiST indexes;
- the accepted-observation view.

For each constraint, explain what it can prevent and what it cannot establish scientifically. For example, `ndvi_mean BETWEEN -1 AND 1` blocks impossible numeric range under this representation; it does not prove correct atmospheric correction, spatial alignment or measurement date.

Write migration notes rather than editing the DDL silently. If you propose new fields—such as `created_at`, source checksum or review reason—state whether they are mandatory, how existing rows are backfilled and how rollback or forward correction works.

## 4. Gate C — stage, validate and promote

Design a staged import:

1. load text-form source rows into a staging schema;
2. preserve source filename, source row number, checksum and load batch;
3. parse dates and numeric fields explicitly;
4. convert empty biomass to SQL `NULL`, never zero;
5. create geometry from WKT with the verified training SRID;
6. test keys, references, ranges, geometry type, SRID, emptiness and validity;
7. retain rejected rows with reasons;
8. promote only reconciled records inside a transaction;
9. compare staging, promoted and rejected counts;
10. roll back the promotion if a blocking condition appears.

Create `import_reconciliation.csv` with file, source rows, staged rows, promoted rows, review rows, rejected rows, checksum and decision. A perfect count is not required; unexplained loss is unacceptable.

Test at minimum:

- primary-key uniqueness;
- plot–site and observation–plot foreign-key coverage;
- uniqueness of plot and survey date;
- NDVI range;
- negative and missing biomass behaviour;
- geometry type and SRID;
- duplicate WKT or duplicate coordinate pairs;
- accepted/review status domains.

## 5. Gate D — build and validate the relational query pack

Write `sql/01_environmental_queries.sql` containing:

1. row counts for all curated tables;
2. key uniqueness and foreign-key anti-joins;
3. accepted observation population by date;
4. all registered plots with their accepted July observation status;
5. site summaries with observation count, distinct plot count, non-missing biomass count, mean NDVI and mean biomass;
6. sites or plots excluded by the primary rule;
7. a paired-round table retaining only plots with both accepted rounds;
8. an explicit listing of `NULL` and review conditions.

For every final query, include a comment block with question, input grain, output grain, join type, filters, missing-value policy and expected count. Save `query_reconciliation.csv` comparing source, intermediate and result totals.

Do not use `SELECT *` in a published result. Do not infer temporal change from the paired table; it is a relational preparation step and still requires appropriate repeated-measures analysis.

## 6. Gate E — build and validate the spatial query pack

Write `sql/02_spatial_queries.sql` containing:

- geometry type, SRID, validity and emptiness inspection;
- plot–zone assignment using `ST_Within`;
- candidate relationships using `ST_Intersects`;
- an audit that counts candidates and containing interiors by plot;
- a boundary-review result;
- distance from plots to zone boundaries with units stated;
- a 75 m proximity query using `ST_DWithin`;
- an intentional mixed-SRID guard or validation query;
- index definitions and representative `EXPLAIN` output instructions.

Create `plot_zone_predicate_audit.csv` with one row per plot and fields for within count, intersect count, candidate zone IDs, boundary status, final decision and decision basis. Preserve P012 as a reviewed relationship unless you supply independent management evidence.

Reproduce the within and intersects pairs in GeoPandas. Create `geopandas_postgis_reconciliation.csv` with relationship key, Python presence, database presence and difference reason. Matching row totals are insufficient.

[[CHECK:m2-p7-predicate]]

## 7. Gate F — inspect performance without performance theatre

Create `index_and_workload_plan.md` with three representative workloads:

1. accepted observations for a date interval and plot set;
2. plots intersecting one management zone;
3. observations joined to sites for repeated reporting.

For each, state anticipated table growth, selectivity, latency need, candidate B-tree/composite/spatial index and evidence required before adding it. Include a safe `EXPLAIN` plan. Use `EXPLAIN ANALYZE` only in the disposable training environment because it executes the query.

The tiny training tables may use sequential scans. Do not falsify evidence or disable planner behaviour to claim an index “works”. Explain how the index would serve a larger workload and identify the threshold at which representative performance testing should occur.

Decide whether partitioning is justified now. A defensible answer may be “no”. If you propose survey-year partitioning, explain pruning, retention and cross-year queries and set minimum data-volume or operational evidence. Never partition by individual plot merely because a key exists.

## 8. Gate G — resolve the storage architecture

Classify every row in `database_handover_inventory.csv`. Create `storage_architecture_matrix.csv` with:

- data class;
- authoritative store;
- immutable source location;
- analysis copy;
- delivery format;
- owner;
- update pattern;
- access roles;
- schema/version mechanism;
- backup and restore rule;
- retention/lifecycle;
- provenance link;
- migration status.

Your recommendation must explicitly evaluate:

- GeoPackage for portable reviewed delivery;
- GeoParquet for versioned analytical vector snapshots;
- PostGIS for shared transactional spatial records;
- object storage for immutable imagery and large file products.

Resolve the two candidate plot masters through evidence, not filename recency. Define the comparison, responsible decision role and promotion/deprecation procedure. The proposed hybrid architecture must have only one update authority per data class.

## 9. Gate H — security, recovery and change control

Create a role matrix for:

- database owner/administrator;
- migration service;
- ingestion service;
- analyst;
- instructor or scientific reviewer;
- public or delivery consumer.

Apply least privilege and separate schema ownership from routine analysis. Provide a credential-free connection example. If a secret appears anywhere in your submission, revoke it and remove it from history before delivery.

Define:

- migration review and version control;
- transaction and rollback policy;
- database backup schedule and retention;
- actual restore-test schedule and success evidence;
- object versioning and lifecycle;
- checksum revalidation;
- incident owner and recovery objectives;
- service export and exit path.

A backup plan without a tested restore remains a review condition. A replicated object without version or deletion protection may copy corruption and is not sufficient evidence of recovery.

## 10. Build the decision matrix

Create one claim–evidence matrix:

| Decision area | Required evidence | Observed result | Risk | Status | Responsible action |
| --- | --- | --- | --- | --- | --- |
| Relational integrity | keys, constraints, reconciled counts | | | | |
| Scientific population | query contract, inclusion and missingness | | | | |
| Spatial semantics | CRS, predicate, boundary audit | | | | |
| Performance | representative plan and growth assumption | | | | |
| Authority | owner and one write source per class | | | | |
| Provenance | checksum, lineage, version and QA | | | | |
| Access | roles and secret boundary | | | | |
| Recovery | backup plus successful restore test | | | | |

Use:

- **accept:** evidence supports the stated use;
- **review:** a named uncertainty has an owner and bounded consequence;
- **block:** a condition can corrupt, expose or make the intended use irreproducible.

[[CHECK:m2-p7-architecture]]

## 11. Required deliverables

Submit this exact package:

1. `README.md` — scope, training status, environment and execution safety;
2. `authority_register.csv` — owner, authority and evidence by object;
3. `database_schema_diagram.pdf` — tables, keys, geometry and constraints;
4. `import_reconciliation.csv` — source, staging, promoted, review and rejected counts;
5. `sql/01_environmental_queries.sql` — relational population and summaries;
6. `sql/02_spatial_queries.sql` — predicates, proximity, CRS and plan evidence;
7. `query_reconciliation.csv` — count and unmatched-key evidence;
8. `plot_zone_predicate_audit.csv` — boundary-aware assignment evidence;
9. `geopandas_postgis_reconciliation.csv` — stable-pair comparison;
10. `index_and_workload_plan.md` — measured index and partition decisions;
11. `storage_architecture_matrix.csv` — format and authority design;
12. `lineage_and_access_diagram.pdf` — sources, roles, stores and derivatives;
13. `SPATIAL_DATABASE_QA.md` — completed QA template;
14. `SPATIAL_DATABASE_HANDOVER_DECISION.md` — final professional decision;
15. `spatial_database_practicum.ipynb` — executable or clearly non-executed evidence notebook.

Every table must retain stable identifiers. Every figure needs a title, units or type labels, source status and accessible text description. Every query must be safe for a disposable training environment and avoid destructive production assumptions.

## 12. Write the handover decision

Create `SPATIAL_DATABASE_HANDOVER_DECISION.md` with no more than 1,200 words:

1. **Purpose and users**
2. **Scientific population and source status**
3. **Relational and spatial integrity result**
4. **Boundary and missingness decisions**
5. **Authority and storage architecture**
6. **Performance and scaling evidence**
7. **Access, migration and recovery controls**
8. **Implementation status**
9. **Responsible next actions**

Choose one final status:

- implement the governed training architecture;
- conditionally implement after named controls;
- block migration pending authoritative or recovery evidence.

State two scientific uses supported by the design and three claims the synthetic training evidence does not support. Acknowledge that database integrity is not measurement validity.

## 13. Professional Mistakes — Spatial Databases

Every row needs a status and action in your QA report.

| Professional mistake | Why it fails | Evidence that reveals it | Required recovery |
| --- | --- | --- | --- |
| Importing before defining one row | grain becomes implicit | duplicate and summary counts | write the table contract first |
| Using row order as identity | sorting or reload changes links | missing stable keys | create governed persistent IDs |
| Allowing orphan observations | measurements lose their plot context | foreign-key anti-join | repair the source relationship before promotion |
| Treating a successful import as reconciliation | rows may be coerced or lost | source/staging/promoted counts | retain batch-level count evidence |
| Converting missing biomass to zero | absence becomes a measurement | paired null and value counts | preserve `NULL` and its reason |
| Using `SELECT *` in a release query | schema changes alter outputs | undocumented extra columns | select explicit named fields |
| Forgetting output grain after a join | one-to-many rows masquerade as plots | distinct-key comparison | declare and validate cardinality |
| Filtering a left-joined table in `WHERE` unintentionally | unmatched subjects disappear | before/after anti-join | place filters according to population intent |
| Averaging without a non-missing denominator | incomplete evidence appears complete | `COUNT(*)` versus `COUNT(value)` | report both denominators |
| Labelling coordinates with the desired SRID | wrong coordinates gain plausible metadata | unchanged coordinate values | verify source and transform correctly |
| Measuring metres in geographic geometry | degree units are misinterpreted | CRS and implausible distances | use an appropriate projection or geography |
| Using `ST_Intersects` as automatic zone membership | boundaries may match several polygons | match count by feature | preserve ambiguity and define policy |
| Using `ST_Within` to hide boundary cases | boundary plots become silently unmatched | intersects-versus-within audit | create a boundary review class |
| Buffering until every point matches | tolerance is outcome-tuned | unexplained buffer distance | justify tolerance from independent accuracy/process evidence |
| Transforming both geometry columns inside every large join | usable stored indexes may be bypassed | execution plan | materialise an approved analysis representation |
| Assuming an index validates geometry | performance and validity are confused | invalid/empty geometry checks | validate before indexing/querying |
| Adding every possible index | writes and maintenance degrade | unused-index and workload evidence | index representative queries only |
| Forcing an index on tiny tables | planner evidence is distorted | slower forced plan | accept sequential scans when appropriate |
| Partitioning by plot ID | tiny partitions proliferate | partition count and cross-plot workload | choose a stable coarse key only when measured |
| Calling ordinary Parquet GeoParquet | spatial metadata may be absent | metadata inspection | validate specification-conformant export |
| Editing GeoPackage and PostGIS as co-masters | conflicts have no authority rule | divergent geometry versions | establish one write authority and read-only copies |
| Naming files `final2` | version and approval are hidden in prose | competing filenames | use releases, manifests and stable names |
| Storing imagery in PostGIS by default | database operations may not suit large immutable objects | workload and cost analysis | use governed object storage when appropriate |
| Keeping object URLs without checksums | changed content can be undetected | missing immutable identity | record version, checksum, size and media type |
| Treating replication as backup | deletion/corruption can replicate | absent restore evidence | maintain protected backups and test restore |
| Keeping credentials in notebooks | access can leak through sharing/history | secret scan | revoke and use protected secret injection |
| Giving analysts owner privileges | routine work can alter controls | role membership audit | apply least privilege and separate ownership |
| Migrating schema manually in production | state cannot be reproduced | missing migration history | version, review and test migrations |
| Removing rejected import rows | failure evidence disappears | count gap | retain quarantine rows and reasons |
| Publishing a database result without query version | result population cannot be reconstructed | missing code revision | version query, inputs, parameters and output checksum |
| Assuming a database proves measurement validity | structural rules cannot validate sensor physics | absent acquisition/QA evidence | connect records to scientific QA and provenance |
| Omitting an exit/export plan | service dependency becomes permanent | no tested export | define open-format export and metadata recovery |

## 14. Acceptance criteria and automatic revision

The practicum is complete only when:

- every source checksum matches;
- every table grain, key and authority is declared;
- import counts reconcile with review/rejection reasons;
- SQL populations preserve `NULL`, QA status and unmatched evidence;
- spatial predicates expose P012 boundary behaviour;
- GeoPandas and PostGIS relationship pairs reconcile or every difference is explained;
- index and partition decisions use representative workload evidence;
- the architecture gives one update authority per data class;
- migrations, roles, backups and restore tests have responsible owners;
- the final decision separates database integrity from scientific measurement validity.

Automatic revision is required if an unexplained row disappears, a `NULL` becomes zero, a spatial assignment depends on arbitrary row order, a secret is exposed, two stores are declared co-authoritative or recovery has no testable evidence.

### Scientific interpretation

The completed system supports controlled organisation and reproducible querying of synthetic meadow evidence. It can show which registered plots have accepted observations, which rows contribute to a site summary and which plot–zone relationships are ambiguous. It can prevent some structural contradictions and preserve provenance across access copies.

It does not prove that NDVI or biomass is measured correctly, that the synthetic pattern exists in Baltic meadows, that a boundary policy matches field management or that a query result is causal. Those claims require acquisition metadata, calibration, sampling design, ecological evidence and review from the relevant data owners.

The main professional result is a traceable chain: source identity → governed authority → constrained schema → declared query population → validated spatial relationship → reviewable derivative → recovery and release decision.

## 15. Reflection, submission and portfolio artifact

### Reflection

- Which constraint protects structure but cannot protect measurement meaning?
- What evidence changed your choice between GeoPackage, GeoParquet and PostGIS?
- Why is a boundary review row more useful than a forced complete assignment?
- What single missing control would most strongly block production implementation?

### Submission

Upload the complete fifteen-file package, one screenshot of the relationship/schema evidence, one screenshot or plan excerpt for a spatial query, the two required diagrams and the final decision. Add a short written answer explaining how authority, spatial semantics and recovery jointly protect scientific work.

### Portfolio artifact

Add **Artifact 2.G — Spatial Database and Governance Package** to the **UAV and Satellite Analysis Pipeline**. Link the SQL query pack, predicate audit, architecture matrix, access/lineage diagram and handover decision. This artifact provides evidence relevant to GIS/Remote Sensing Engineer, Geospatial Data Analyst and Remote Sensing Researcher profiles because it combines implementation discipline, analytical population control and scientific interpretation rather than listing database technologies alone.

