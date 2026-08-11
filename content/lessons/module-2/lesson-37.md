---
title: Managing Large Spatial Data
lessonId: lesson-2-37
---

## 1. Choose a storage system from the scientific workflow

### Learning outcome

By the end of this lesson, you will be able to decide when a project should use GeoPackage, GeoParquet, PostGIS or object storage; distinguish an authoritative source from access copies and derived products; explain attribute/spatial indexing and partitioning without treating them as automatic fixes; design stable naming, schema, provenance, access, backup and lifecycle rules; and defend a storage architecture for an expanding Earth Observation programme.

- **Lesson type:** Data-architecture decision studio
- **Estimated time:** 180–220 minutes
- **Prerequisites:** File formats, raster/vector workflows, SQL and PostGIS fundamentals
- **Portfolio output:** `spatial_storage_architecture.md`

### Why this matters

Large spatial data problems are not defined only by terabytes. A research group can lose scientific integrity with fifty small files when several people edit different copies, identifiers drift and nobody can establish which output is authoritative. Conversely, a well-designed collection of large immutable images in object storage can remain orderly because every object has a stable key, checksum, metadata record and lifecycle rule.

Remote Sensing Scientists need to choose storage by access pattern and responsibility. A portable field delivery, a columnar analytical archive, a multi-user transactional dataset and a library of immutable imagery have different needs. Moving everything into one database creates cost and complexity; leaving everything as files can create version and concurrency failures.

Storage architecture is part of scientific method. It determines whether another analyst can recover the exact source, reproduce a query, understand a transformation, protect restricted data and verify that a published result is unchanged.

### Scientific context

The coastal meadow programme now has site and plot vectors, repeated observations, UAV orthomosaics, satellite scenes, derived indices, QA reports and notebooks. The supplied `database_handover_inventory.csv` describes a familiar but unsafe state: “final” filenames compete, one derived table lacks geospatial metadata, CRSs differ and a proposed PostGIS database has no migration or backup policy.

The team asks you to design a governed architecture for continued research. You will not migrate production data in this lesson. You will identify authoritative classes, define access and delivery copies, set evidence thresholds for architectural changes and produce a decision record that another engineer or researcher can implement.

## 2. One concept — storage follows authority and access patterns

### Concept

The single idea in this lesson is that **a spatial storage choice should follow who owns the data, how it changes, how it is queried and what evidence must be preserved**.

Begin with four roles:

- **authoritative source:** the governed record allowed to receive controlled updates;
- **immutable raw source:** an acquired object preserved exactly as received;
- **access copy:** a representation optimised for a legitimate operation but not independently authoritative;
- **derived product:** an output that must point back to inputs, code, parameters and environment.

A format name does not establish a role. A GeoPackage can be authoritative for a small single-editor project or merely a delivery copy from PostGIS. GeoParquet can be an efficient analysis copy or a versioned authoritative dataset under strong controls. Object storage can contain immutable raw imagery or an uncontrolled pile of duplicates. Governance gives the format meaning.

### Visual explanation

```text
acquisition / field entry
          │
          ▼
immutable raw objects ── checksums, licence, acquisition metadata
          │
          ▼
authoritative curated records ── stable IDs, schema, transactions, owner
          │
     ┌────┴────────────┐
     ▼                 ▼
analysis access copy   operational query/service
GeoParquet / COG       PostGIS / controlled API
     │                 │
     └────┬────────────┘
          ▼
versioned derived products ── lineage, QA, release decision
          │
          ▼
portable delivery ── GeoPackage / COG / report / manifest
```

Arrows express governed lineage. They do not mean that every project requires every layer.

[[CHECK:m2-l37-authority]]

## 3. Four storage patterns

### GeoPackage — portable, self-contained project delivery

GeoPackage stores vector features, attributes and potentially raster tiles in one SQLite-based file. It is useful for exchange, field workflows, desktop GIS and small projects where one file is easier to validate and deliver than a Shapefile family. It supports tables and indexes, but a shared network copy is not a substitute for a multi-user transactional service. Concurrent editing, fine-grained permissions and automated operational updates may exceed the intended workflow.

Choose it when portability, desktop compatibility and bounded scope dominate. Include a manifest and never let “one file” imply “self-documenting”.

### GeoParquet — columnar analytical datasets

Parquet stores columnar data efficiently, supports selective column reads and is widely used in analytical systems. GeoParquet standardises how geometry and geospatial metadata are represented. It is effective for versioned vector snapshots, large analytical scans and interoperability with modern data tools.

GeoParquet is generally not a transactional multi-editor database. Partitioned datasets require a consistent schema and metadata strategy. A `.parquet` extension without valid geospatial metadata is not automatically GeoParquet. Validate the specification version, geometry encoding, CRS metadata, bounding information and reader compatibility.

### PostGIS — shared relational and spatial operations

PostGIS is appropriate when many users or services need one controlled source, updates must be transactional, relationships and constraints matter, access must be role-based or repeated indexed spatial queries are central. It supports foreign keys, checks, views, transactions and spatial indexes alongside SQL.

It requires operations: migrations, backups, restore tests, monitoring, permission design, connection management and software upgrades. A database without an owner and restore procedure is not a stronger archive than files—it is a more complicated single point of failure.

### Object storage — durable objects and scalable distribution

Object storage addresses objects by keys and is suited to immutable raw imagery, COGs, archives, model artifacts and other large files. Versioning, lifecycle rules and checksums can support durable provenance. It does not provide relational constraints or arbitrary spatial SQL by itself. A catalogue, manifest or database must make objects discoverable and connect them to scientific metadata.

Object keys should not contain secrets or personal data. Access policies, encryption, retention and deletion rules must match data governance. “In the cloud” is neither a backup strategy nor permission design.

## 4. Decide from evidence, not format fashion

Use a decision matrix:

| Requirement | GeoPackage | GeoParquet | PostGIS | Object storage |
| --- | --- | --- | --- | --- |
| portable desktop handover | strong | moderate | weak without export | moderate |
| column-selective analytical scans | limited | strong | strong for queries | depends on stored format |
| simultaneous controlled edits | limited | weak | strong | object replacement/versioning, not row transactions |
| relational constraints | local SQLite scope | weak | strong | absent |
| repeated spatial predicates | local scale | engine-dependent | strong with indexes | catalogue/engine required |
| very large immutable imagery | unsuitable as default | not raster image storage | references/metadata often better | strong |
| offline use | strong | strong with reader | weak | weak unless downloaded |
| fine-grained roles | file-system level | object/file policy | strong | bucket/object policy |

Hybrid architecture is normal. For example: immutable UAV and satellite sources in versioned object storage; authoritative plots and observations in PostGIS; versioned GeoParquet snapshots for reproducible analysis; GeoPackage and COG outputs for delivery.

The hybrid needs one authority map. If both PostGIS and a GeoPackage are editable “masters”, conflict becomes inevitable.

## 5. Indexing and partitioning

An **index** is an additional data structure that speeds particular lookups at the cost of storage and write maintenance. Use B-tree indexes for common equality/range patterns on IDs and dates; use GiST or another appropriate spatial index for geometry predicates. Index columns because measured queries need them, not because the table contains them.

Measure with representative queries and inspect plans. Too many indexes slow imports and updates. A composite index follows query order and selectivity; separate indexes are not always equivalent. Indexes also require maintenance and statistics.

**Partitioning** divides one logical dataset into physical parts, often by date, region or another stable rule. It can help prune irrelevant data, manage lifecycle and isolate operations. It is not a synonym for splitting files arbitrarily.

A defensible partition key:

- appears in major query filters;
- has stable meaning and manageable cardinality;
- avoids one huge or many tiny partitions;
- does not make cross-partition integrity impossible to govern;
- supports retention and update patterns.

Partitioning by individual plot would create hundreds or millions of tiny parts. Partitioning observations by survey year may help only after the table and workload justify it. Begin with an unpartitioned, indexed design and record the measurement threshold that would trigger change.

[[CHECK:m2-l37-partition]]

## 6. Worked example — create an architecture decision record

### Predict before running

The inventory contains raw imagery, shared vectors, repeat observations and portable outputs. Predict whether one storage system can meet every need without compromise. Which class requires transactions? Which requires immutable, scalable object handling? Which is best treated as a derived access copy?

```python
storage_plan = {
    "raw_imagery": ("versioned object storage", "immutable acquisition"),
    "plots_and_observations": ("PostGIS", "controlled shared updates"),
    "analysis_snapshot": ("GeoParquet", "versioned columnar read"),
    "desktop_handover": ("GeoPackage", "portable reviewed delivery"),
}

for data_class, (store, reason) in storage_plan.items():
    print(f"{data_class}: {store} — {reason}")
```

### Code walkthrough

1. `storage_plan` is a small decision structure, not infrastructure automation.
2. Each key names a data class rather than a particular accidental filename.
3. Each value contains both a storage choice and its purpose.
4. Raw imagery is treated as immutable acquisition evidence.
5. Plots and observations require shared, controlled updates and relationships.
6. The analysis snapshot is a versioned access copy, not a second editable master.
7. The desktop handover is a reviewed delivery representation.
8. The loop makes every choice and reason visible for review.
9. Nothing here creates permissions, backups, schemas or lifecycle rules; those belong in the implementation plan.

The example separates data classes before technologies. Your full decision record must also name owner, source of truth, update mechanism, schema/version, access roles, retention, backup, restore test, provenance and exit strategy.

## 7. Naming, schema and provenance

Names should be stable enough for machines and understandable enough for humans. Avoid `final`, `final2` and dates embedded inconsistently in authoritative table names. Prefer stable object names plus governed version metadata or releases. Use consistent lowercase identifiers, explicit units such as `biomass_g_m2`, and unambiguous time fields such as UTC timestamps or ISO dates.

Schema evolution must be deliberate. Adding a nullable field, changing a unit, renaming a code or converting geometry type can alter downstream meaning. Record migrations in version control, review them, test them against representative fixtures and provide rollback or forward-recovery plans. Separate raw/staging, curated and published schemas when their trust levels differ.

For every released object, provenance should answer:

- what authoritative sources and versions were used;
- who or what created the derivative and when;
- which code revision, environment and parameters were used;
- which CRS, spatial/temporal support and units apply;
- which QA checks passed, failed or remain under review;
- what checksum identifies the immutable file;
- what licence, consent or restriction controls use;
- what object supersedes it or when it expires.

A filename is not provenance. A notebook is not provenance if its environment, inputs and executed state are unknown. A database timestamp is not provenance if the transformation is undocumented.

[[CHECK:m2-l37-provenance]]

## 8. Reliability, access and lifecycle

Backups must be recoverable. Define recovery-point and recovery-time needs, create backups separately from the live system and test restoration. Synchronisation can copy deletion or corruption; it is not automatically a backup. For object storage, define versioning, retention and lifecycle transitions. For PostGIS, test logical or physical restore according to the service design.

Apply least privilege. Analysts who only query curated tables should not own the database or modify source records. Ingestion services should write only to intended schemas. Credentials belong in protected secret management or environment configuration, never notebooks, URLs, repositories or screenshots.

Lifecycle rules should distinguish raw evidence, intermediate caches, reproducible derivatives and formal releases. Deleting every intermediate may make a costly workflow irreproducible; retaining everything forever creates cost, exposure and ambiguity. State which products can be regenerated, from what inputs and within what time.

Portability is also a governance concern. Record how the organisation could export data and metadata from a service. Open formats reduce lock-in but do not remove operational dependencies.

## 9. Common mistakes and recovery

### Mistake: moving to PostGIS because the folder looks untidy

**Why beginners make it:** a database appears inherently organised.  
**Recognition:** no user, query, update or integrity requirement is documented.  
**Recovery:** inventory data classes and access patterns first; improve naming and provenance regardless of platform.

### Mistake: declaring both a database and shared files authoritative

**Why beginners make it:** teams want familiar local copies.  
**Recognition:** edits flow in both directions without conflict rules.  
**Recovery:** designate one update authority; publish access snapshots and make their read-only or expiry status explicit.

### Mistake: partitioning before measuring workload

**Why beginners make it:** partitioning sounds like scale.  
**Recognition:** many tiny partitions and slower planning appear.  
**Recovery:** establish baseline query evidence, then define a threshold and partition key linked to actual filters and lifecycle.

### Mistake: calling any Parquet file GeoParquet

**Why beginners make it:** geometry objects were present before export.  
**Recognition:** CRS or geometry encoding metadata are missing.  
**Recovery:** validate against the GeoParquet specification and reader tools; preserve the producer version and schema.

### Mistake: storing object paths without checksums or versions

**Why beginners make it:** the URL opens today.  
**Recognition:** content can be replaced without a detectable identity change.  
**Recovery:** use immutable/versioned objects and record content checksum, size, media type and source metadata.

### Mistake: treating replication as tested recovery

**Why beginners make it:** several copies exist.  
**Recognition:** nobody has restored a complete, consistent system.  
**Recovery:** document recovery targets and perform scheduled restore tests with recorded outcomes.

### Mistake: placing credentials in notebooks

**Why beginners make it:** connection code becomes immediately reproducible.  
**Recognition:** passwords appear in version history or shared outputs.  
**Recovery:** revoke exposed credentials, use protected secret injection, supply a credential-free connection template and apply least privilege.

## 10. Guided practice — design the meadow data architecture

1. Create `17_spatial_storage_architecture.ipynb` and `spatial_storage_architecture.md`.
2. Read the pack README, manifest and handover inventory. Do not rename or “clean” source files in place.
3. Classify each inventory row as candidate authority, immutable source, access copy, derivative, duplicate/review or proposed service.
4. Record owner, version, CRS, schema, update pattern, licence, restriction and checksum evidence. Mark absent evidence explicitly.
5. Identify conflicts: competing plot masters, mixed CRS, ambiguous Parquet metadata, duplicate imagery and missing migration/backup rules.
6. Define data classes independent of current filenames: field observations, plot/site master, management zones, raw imagery, curated raster products, analysis vectors, notebooks and formal releases.
7. Choose one authoritative store for each class. Explain why other representations are access or delivery copies.
8. Complete the decision matrix for GeoPackage, GeoParquet, PostGIS and object storage using users, writes, queries, volume, latency, portability, offline use and governance.
9. Draw lineage from immutable source through curated authority, analysis copy and release.
10. Define stable identifiers, naming convention, unit naming, geometry type and CRS policy.
11. Propose B-tree and spatial indexes only for named representative queries.
12. Decide whether partitioning is currently justified. If not, state a measurable trigger such as row count, retention need or query-plan evidence.
13. Define roles for data steward, ingestion service, analyst, instructor/reviewer and public consumer.
14. Write a migration sequence with staging, reconciliation, constraint validation, cutover, rollback and decommissioning of obsolete editable copies.
15. Define backups, restore testing, retention, checksum validation and service export.
16. Complete the QA template and issue a conditional architecture decision.

## 11. Independent challenge — resolve the competing plot masters

The inventory contains `field_plots_2026_final.shp` and `field_plots_FINAL2.gpkg`, both described as candidate plot sources. Design a resolution protocol without assuming that the newer-looking filename is correct.

Your protocol must compare stable IDs, geometry counts, geometry hashes or differences, attribute schema, CRS, provenance, responsible owner and downstream references. Define how conflicts are adjudicated, how the accepted master is promoted, how the rejected copy is retained or archived and how future updates avoid recreating the conflict.

Then choose whether the governed plot master should be PostGIS, GeoPackage or a versioned GeoParquet dataset for the stated team. Include the strongest argument against your choice and the condition that would trigger a new decision.

### Scientific interpretation

A storage architecture does not improve ecological evidence by itself. It improves the conditions under which evidence can remain consistent, traceable and reusable. PostGIS can enforce plot–site relationships and controlled updates. GeoParquet can distribute stable analytical snapshots efficiently. Object storage can preserve large immutable acquisitions. GeoPackage can deliver a portable reviewed subset.

The scientific benefit appears only when authority, metadata and lineage remain explicit. A mean NDVI result is reproducible when its source observations, plot geometry version, query, QA policy and output identity can be recovered. Large-data engineering is therefore not separate from Remote Sensing Science; it protects the chain from measurement to claim.

## 12. Reflection, submission and portfolio artifact

### Reflection

- Which workflow requirement most strongly justifies moving from files to PostGIS?
- Why can an analysis copy be valuable without becoming authoritative?
- What evidence would justify partitioning repeated observations by year?
- How would you prove that a backup supports recovery rather than only storage?

### Submission

Submit:

1. `spatial_storage_architecture.md` with the authority map and hybrid architecture;
2. the classified and annotated handover inventory;
3. a format decision matrix covering GeoPackage, GeoParquet, PostGIS and object storage;
4. a lineage diagram and naming/schema convention;
5. an index/partition decision tied to representative workloads;
6. a migration, access, backup, restore and lifecycle plan;
7. the completed `SPATIAL_DATABASE_QA_TEMPLATE.md` and a 300–450 word architecture decision.

### Portfolio artifact

Add `spatial_storage_architecture.md` to the **UAV and Satellite Analysis Pipeline** as the architecture component of the **Spatial Database and Governance Package**. It should show not merely that you recognise technologies, but that you can connect each technology to authority, access, reproducibility, security, recovery and scientific use. This decision becomes the foundation for the cloud-native data chapter that follows.

