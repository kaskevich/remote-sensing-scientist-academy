## 1. Design around the scientific contract

### Learning outcome

By the end of this lesson, you will be able to place ArcGIS Pro, geodatabases, ModelBuilder, ArcPy, ArcGIS Online and ArcGIS Enterprise within a professional GIS architecture; compare them with QGIS, GeoPandas, Rasterio, PostGIS and standards-based delivery by workflow role; translate one coastal-meadow evidence workflow between ecosystems; and issue a conditional technology decision that preserves scientific meaning, access control, reproducibility and an exit path.

- **Lesson type:** Professional GIS Architecture Studio
- **Estimated time:** 210–270 minutes
- **Prerequisites:** Chapters 1–9, especially spatial databases, cloud-native EO and web delivery
- **Portfolio output:** `enterprise_gis_comparison.md`

### Why this matters

Professional remote-sensing work rarely occurs inside one software product. A public authority may author maps in ArcGIS Pro, manage organisational content in ArcGIS Online, and maintain an enterprise geodatabase. A university collaborator may process the same source evidence with Python and PostGIS. A field team may require an offline GeoPackage and PDF. Procurement, security, existing staff skills, contractual support and integration can matter as much as a tool's analytical functions.

The scientific risk appears when software choice silently changes the method. A raster may display correctly while its scaling or nodata treatment differs. A geoprocessing model may omit the version and environment needed to reproduce it. A hosted feature layer may expose attributes hidden from its popup. An export may preserve geometry but lose domains, relationships, aliases or time semantics. Two maps can therefore look equivalent while representing different evidence.

A Remote Sensing Scientist does not need loyalty to a vendor. They need to identify what each component is responsible for, what evidence crosses its boundary, and which scientific properties must remain invariant.

### Scientific context

The Baltic coastal-meadow group has completed a reviewed Web GIS delivery. A regional authority now wants to operate the result inside its ArcGIS environment. The university partner must continue the Python analysis, while a small field partner works offline.

The group is not selecting a universal winner. It must answer a bounded professional question:

> How can three organisations implement the same accepted coastal-meadow evidence workflow without changing its scientific meaning or creating an uncontrolled second source of truth?

The supplied pack is synthetic. It contains no ArcGIS account, paid licence, endpoint or real organisation. ArcGIS access is optional. If you have authorised access, you may add verified evidence; otherwise, mark product-specific claims as unverified and complete the architecture from the documented contracts.

## 2. One concept — implementations may change; scientific invariants may not

### Concept

The single idea is: **allocate components by workflow role, then protect the scientific contract at every boundary**.

A workflow role describes a responsibility such as desktop QA, automated processing, authoritative editing, web delivery, identity or recovery. A product can cover several roles, and one role can have several candidate products. Product names do not define the scientific method.

A **scientific invariant** is information or behaviour that must survive a change of implementation. For this project, the invariants include:

- source identity, checksum, licence and processing level;
- CRS, coordinate order, raster transform, grid shape and spatial support;
- measurement units, scaling, nodata, masks and eligibility rules;
- stable feature and site identifiers;
- category, missing-value and time semantics;
- method parameters, acceptance thresholds and exclusions;
- provenance, responsible owner and review state.

These invariants form a testable contract. An ArcPy tool and a GeoPandas/Rasterio workflow do not need identical source code. They do need to accept the same declared evidence and produce results that agree under a predeclared comparison rule.

### Visual explanation

```text
                    SCIENTIFIC CONTRACT
        IDs · CRS · grid · units · nodata · method · QA
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
      implementation A                implementation B
  ArcGIS Pro / ArcPy / AGOL       QGIS / Python / PostGIS
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    equivalence evidence
       counts · IDs · values · geometry · missingness
                              │
                              ▼
              release, condition, or rejection
```

Portability is not achieved by exporting a file once. It is demonstrated when a receiving environment can reconstruct the required meaning and pass the agreed tests.

[[CHECK:m2-l46-contract]]

## 3. Read the ArcGIS ecosystem by role

### ArcGIS Pro — desktop authoring, inspection and analysis

ArcGIS Pro is a desktop GIS used for maps, data management, geoprocessing, imagery and publication workflows. In an architecture diagram, describe the exact role it performs. “Uses ArcGIS” is too broad. One analyst may use Pro only to inspect an accepted COG and author a map. Another may edit an enterprise geodatabase or publish a service. These actions have different authorities and risks.

An ArcGIS Pro project stores references, maps, layouts, connections and configuration. It is not automatically the authoritative store for every connected dataset. A layer can reference a file geodatabase, an enterprise database, a web service or a file. Record where the source lives, which identity accesses it, and whether the layer is editable, cached or only a portrayal.

### Geodatabases — data model, not a synonym for every database

ArcGIS documentation distinguishes file, mobile and enterprise geodatabases. A file geodatabase is a folder-based container suited to individual or bounded project work. A mobile geodatabase is an SQLite-based single file for supported simple data workflows. An enterprise geodatabase uses a supported relational database and can support multiuser, governed editing and geodatabase behaviour.

Select among them from the operation:

| Need | Candidate | Evidence still required |
| --- | --- | --- |
| bounded project workspace | file geodatabase | ownership, locking, backup, export and schema QA |
| portable supported offline data | mobile geodatabase or GeoPackage | client support, round trip, relationships and conflict process |
| multiuser authoritative edits | enterprise geodatabase or PostGIS | roles, transaction model, constraints, versioning, backup and restore |

Do not assume that enabling geodatabase functionality is scientifically neutral. Domains and relationship classes can improve integrity, but a receiving non-ArcGIS client may not preserve every behaviour. Conversely, a plain database table may be readable but may not participate fully in geodatabase functions. The transfer contract must name what is essential and what loss is acceptable.

### ModelBuilder — visible orchestration

ModelBuilder represents geoprocessing tools and data as a connected process. It can make sequence and parameter flow visible to analysts who do not maintain Python packages. A model can also be exposed as a geoprocessing tool.

Visibility is not complete reproducibility. A professional model inventory records:

- every tool and product version;
- extensions or privileges required;
- exposed parameters and hidden defaults;
- intermediate outputs and overwrite behaviour;
- environment settings such as extent, cell size, snap raster and output CRS;
- input and output contracts;
- failure conditions and post-run validation.

A screenshot of a model is useful communication, but it cannot be executed or tested. Preserve the model file, parameters, environment, fixture and expected evidence.

### ArcPy — Python within the ArcGIS geoprocessing environment

ArcPy is a Python package for ArcGIS data analysis, conversion, management and map automation. It can make repeated organisational workflows explicit and testable. It is not equivalent to the Python standard library, and its availability and capabilities depend on the authorised ArcGIS environment.

Separate three layers in an ArcPy workflow:

1. **scientific method** — the transformation and QA rule;
2. **ArcGIS adapter** — tool calls, datasets, environments and messages;
3. **portable contract** — inputs, outputs, parameters and acceptance tests.

This separation prevents an organisation-specific API from becoming the only description of the science. The open implementation can use GeoPandas or Rasterio while sharing the same method specification and fixtures.

## 4. Distinguish ArcGIS Online from ArcGIS Enterprise

ArcGIS Online is a cloud-based mapping, analysis and collaboration service. Organisations can publish hosted web layers, maps and apps and control sharing through items, groups, roles and settings. The provider operates the cloud platform. Your organisation still owns decisions about item ownership, fields, editing, sharing, lifecycle, service usage and public communication.

ArcGIS Enterprise is software deployed in infrastructure controlled by the organisation or its cloud arrangement. A base deployment brings together a portal, server, managed data store and web integration components. It creates more operational responsibility: architecture, identity integration, patching, certificates, monitoring, capacity, backup, recovery and upgrades must have owners.

Neither is automatically “more secure.” Security depends on configuration, identity, sharing, data flow and operations. Online can be appropriate for public delivery; Enterprise can support controlled internal infrastructure. A poorly configured item or service is risky in either setting.

Ask the same questions for both:

- Who owns the source data and the published item?
- Is content hosted, copied, cached or referenced?
- Who can read, export, edit, overwrite or administer it?
- Which fields and geometries reach an anonymous client?
- What happens when the source changes?
- Which licence, user type, privilege, extension, service capacity or usage limit applies?
- How are logs, backup, restore, deprecation and incident response verified?

Do not place current prices or credit values in a scientific architecture. Record the organisation's dated procurement evidence and an owner, because service terms can change.

[[CHECK:m2-l46-roles]]

## 5. Compare ecosystems without a false contest

A fair comparison starts with responsibilities and constraints, not feature counts.

| Workflow role | ArcGIS candidates | Open or standards-based candidates | Scientific review question |
| --- | --- | --- | --- |
| desktop QA | ArcGIS Pro | QGIS | Do both reveal source CRS, schema, nodata and provenance? |
| visual orchestration | ModelBuilder | graphical processing models or documented DAG | Are parameters, environments and failures inspectable? |
| Python processing | ArcPy | GeoPandas, Rasterio, Xarray | Do results meet the same fixtures and tolerances? |
| authoritative editing | enterprise geodatabase | PostGIS | Which system owns writes, identity, integrity and recovery? |
| cloud sharing | ArcGIS Online | managed feature and tile services | Are sharing, editing, export and lifecycle controlled? |
| self-managed portal | ArcGIS Enterprise | composed portal, identity and services | Who operates every dependency and recovery path? |
| public web map | ArcGIS app components | MapLibre or other accessible client | Does the public contract and alternative table remain complete? |
| interchange | geodatabase export and services | GeoPackage, COG, GeoJSON, OGC APIs, STAC | What meaning survives a tested round trip? |

Open-source does not mean no cost or no governance. Hosting, identity, monitoring, support, upgrades and staff time remain. Proprietary software does not mean irreproducible by definition. Versioned scripts, models, fixtures and exports can provide strong evidence. The correct question is whether the complete system satisfies scientific, organisational and operational requirements.

### Portability has levels

Distinguish:

- **data portability** — the receiving tool reads geometry and attributes;
- **semantic portability** — types, units, missingness, relationships and categories retain meaning;
- **method portability** — another implementation reproduces the transformation;
- **operational portability** — identity, schedules, monitoring and recovery can be rebuilt;
- **organisational portability** — another team has the skills, rights and documentation to operate it.

A GeoPackage export may provide good data portability but not reproduce enterprise versioning or a ModelBuilder workflow. An OGC service may support client interoperability while leaving backup and edit governance product-specific.

## 6. Authority, copies and publication

The same layer may exist as an authoritative database table, an analysis snapshot, a hosted feature layer and a public read-only view. Those are not four equal sources.

Use explicit states:

```text
authoritative zones ──controlled edit──► new authoritative version
        │
        ├──versioned snapshot──► Python or ArcPy analysis
        │
        └──filtered publication──► organisational service
                                      │
                                      └──public read-only view
```

Every derivative needs a source version, transformation, owner, update rule and retirement condition. Offline packages need an expiry and conflict rule. If edits occur in two places without reconciliation ownership, architecture has created a data-integrity problem.

For public feature delivery, configure restriction before the browser response. A popup is presentation, not access control. Apply least privilege, then test anonymous read, write and export behaviour using a non-privileged session. An administrator's successful map view does not represent a public user.

## 7. Worked example — compare implementations by invariant

### Predict before running

The regional authority and university both report six public site records. Predict whether matching record counts alone prove equivalent evidence. Which additional fields must match exactly, and where might a numerical tolerance be justified?

```python
implementations = {
    "ArcGIS delivery": {"ids": 6, "missing": 1, "crs": "OGC:CRS84"},
    "Open delivery": {"ids": 6, "missing": 1, "crs": "OGC:CRS84"},
}

required = {"ids": 6, "missing": 1, "crs": "OGC:CRS84"}

for name, evidence in implementations.items():
    checks = {
        key: evidence.get(key) == expected
        for key, expected in required.items()
    }
    print(name, checks, "PASS" if all(checks.values()) else "REVIEW")
```

### Code walkthrough

1. `implementations` represents evidence from two delivery paths, not the products themselves.
2. Each path reports a stable-ID count, missing-value count and CRS identifier.
3. `required` is the predeclared acceptance contract.
4. The loop evaluates each implementation independently.
5. `evidence.get(key)` makes an absent field fail instead of inventing a value.
6. The dictionary comprehension preserves one Boolean result per invariant.
7. `all()` passes only when every declared check passes.
8. The printed record gives a compact gate, not a full scientific conclusion.

This example is intentionally small. A real equivalence suite compares the actual stable-ID set, categories, null locations, geometry, dates, raster pixel values, masks, field names and provenance. Exact agreement is appropriate for identifiers and categories. A continuous result may use a justified tolerance when algorithms or numerical libraries differ, but the tolerance must be declared before comparison and tied to scientific consequence.

## 8. Common mistakes and recovery

### Mistake 1 — selecting a suite before requirements

Existing familiarity makes the product feel like the requirement.

**Recognise it:** the proposal lists tools but not users, operations, evidence or failure impact.

**Recover:** complete the workflow-requirements table first and reject components that have no necessary role.

### Mistake 2 — treating an ArcGIS Pro project as the data authority

The project makes every connected layer feel contained.

**Recognise it:** nobody can identify whether the real source is a geodatabase, service, COG or local export.

**Recover:** trace every layer to its write authority and classify the project as configuration.

### Mistake 3 — using a ModelBuilder screenshot as reproducibility evidence

The diagram looks complete and understandable.

**Recognise it:** tool versions, environments, parameters, intermediate states and expected outputs are missing.

**Recover:** preserve the executable model, inventory and fixture tests alongside the diagram.

### Mistake 4 — assuming Python means portable

Both ArcPy and open processing use Python syntax.

**Recognise it:** the script imports unavailable modules or depends on product-specific data behaviour.

**Recover:** separate scientific method, adapter and portable acceptance contract.

### Mistake 5 — comparing maps visually

Two outputs use the same colours and symbols.

**Recognise it:** no stable-ID, null, value, geometry or provenance reconciliation exists.

**Recover:** compare machine-readable evidence under exact and tolerant rules before visual review.

### Mistake 6 — assuming an open format preserves everything

The receiving tool opens the file successfully.

**Recognise it:** domains, relationships, aliases, time zones or field types changed silently.

**Recover:** conduct a round-trip test and document acceptable loss.

### Mistake 7 — publishing an editable source

One hosted layer seems simpler than separate editor and public views.

**Recognise it:** anonymous or broad organisational users can modify or export more than intended.

**Recover:** isolate authority, create a filtered read-only view and run negative permission tests.

### Mistake 8 — recording no licence or privilege evidence

The workflow runs on the author's machine.

**Recognise it:** collaborators cannot determine whether a user type, extension or server capability is required.

**Recover:** record dated environment, privilege and procurement evidence without embedding licence keys.

### Mistake 9 — calling open-source infrastructure free

There is no product invoice.

**Recognise it:** support, hosting, identity, patching and recovery have no owner or budget.

**Recover:** compare total operating responsibilities, not only licence cost.

### Mistake 10 — designing no exit test

Migration feels like a future procurement concern.

**Recognise it:** no one has proven that data, methods or identifiers can leave the current implementation.

**Recover:** preserve open contracts and perform a small round-trip before the architecture becomes critical.

[[CHECK:m2-l46-decision]]

## 9. Guided practice — translate the coastal-meadow workflow

1. Verify `manifest.json` and confirm that all records are synthetic.
2. Read `environment_constraints.json`. Write the scientific invariants without naming software.
3. Review `workflow_requirements.csv`. Classify each requirement as scientific, functional, governance, operational or procurement evidence.
4. Audit `ecosystem_component_inventory.csv`. Change every unsupported “capability claim” to unverified until exact version, licence or privilege, and a bounded test are present.
5. Draw an authority map for management zones, COG composites, derived site summaries, organisational services and the public view.
6. For each stage in `workflow_translation.csv`, explain why the ArcGIS and open implementations can be different while the invariant remains fixed.
7. Define exact equivalence rules for IDs, categories, missingness and public schema.
8. Define justified tolerances for continuous values and geometry. State the scientific consequence at the tolerance boundary.
9. Review `sharing_risk_register.csv`. For every blocked item, specify the least-privileged positive and negative test.
10. Choose ArcGIS Online, ArcGIS Enterprise, open services or a hybrid for each delivery audience. “Use everything” is not a valid decision.
11. Record a dated licence and capability verification owner. Do not invent current prices, extensions or user entitlements.
12. Design a round-trip exit drill for the authoritative vector layer and one analytical raster.
13. Complete `PROFESSIONAL_ECOSYSTEM_QA_TEMPLATE.md`.
14. Save your result as `enterprise_gis_comparison.md`.

## 10. Independent challenge — defend a constrained architecture

Choose one of these conditions:

- the regional authority already licenses ArcGIS Pro and ArcGIS Online but cannot operate servers;
- sensitive work must stay in self-managed infrastructure and the team can operate ArcGIS Enterprise or a composed open stack;
- the partnership has no ArcGIS licences and must exchange open, documented representations;
- different partners use different ecosystems and require a hybrid architecture.

Produce two credible candidate architectures. For each, assign desktop, automation, authority, service, identity, public delivery, monitoring, backup and recovery. Estimate relative operating complexity without inventing prices. Identify product-specific dependencies, staff skills, information loss, migration triggers and unsupported claims.

Select one architecture conditionally. A defensible conclusion can select ArcGIS, open tools or a hybrid. It cannot claim that one ecosystem is universally superior.

## 11. Scientific interpretation

### Scientific interpretation

The selected ecosystem does not change what the seasonal NIR values mean. It can change how reliably the team preserves, tests and communicates them. Equivalent evidence requires more than the same visual output: the implementations must preserve the same sites, eligibility, missingness, spatial support, measurement scaling and provenance.

For the synthetic Chapter 10 scenario, the strongest architecture is likely hybrid because the partners have different operating constraints. That is not a general recommendation. The scientific result is the tested contract and evidence package; each organisation's component allocation is an implementation decision.

State limitations plainly. The chapter does not benchmark performance, verify a live ArcGIS organisation, calculate product costs, test confidential data or establish that every geodatabase behaviour survives open exchange. Those items remain conditions with owners and due dates.

## 12. Reflection, submission and portfolio artifact

### Reflection

1. Which scientific property is easiest to lose during a seemingly successful format export?
2. When does ModelBuilder provide stronger communication than code, and what evidence must accompany it?
3. Which responsibilities move to the organisation when it operates ArcGIS Enterprise or an open service stack?
4. What would make a hybrid architecture unnecessarily complex?
5. Which migration test would expose the greatest future risk today?

### Submission

Submit:

- `enterprise_gis_comparison.md` with two candidate architectures and a conditional decision;
- `workflow_role_matrix.csv` naming authority, component, owner and evidence;
- `scientific_invariant_tests.csv` with exact and tolerant comparison rules;
- `sharing_and_privacy_review.csv` with anonymous negative tests;
- one authority and data-flow diagram with descriptive text;
- one migration drill result and documented acceptable loss;
- a completed `PROFESSIONAL_ECOSYSTEM_QA.md`;
- a 400–600 word scientific interpretation.

Do not submit licence keys, tokens, private endpoints, personal information, confidential architecture details or real sensitive locations. If a capability was not tested, label it unverified.

### Portfolio artifact

Add `enterprise_gis_comparison.md` to the **UAV and Satellite Analysis Pipeline** under **Artifact 2.J — Portable Professional GIS Architecture**. The artifact demonstrates that you can work credibly across organisational ecosystems while protecting scientific invariants, governance and reproducibility.
