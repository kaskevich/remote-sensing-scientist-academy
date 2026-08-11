# Practicum 10 — Design a Portable Coastal-Meadow GIS Architecture

## 1. Professional brief

### Learning outcome

By the end of this practicum, you will be able to convert scientific, organisational and operational requirements into a defensible professional GIS architecture; allocate ArcGIS and open components by role; verify cross-ecosystem equivalence; protect authoritative data and public delivery; test a migration route; and issue a release decision that identifies evidence, conditions, owners and residual risk.

- **Practicum type:** Architecture, interoperability and governance review
- **Estimated time:** 480–600 minutes
- **Prerequisites:** Lesson 2.46 and completed Chapter 7–9 portfolio evidence
- **Portfolio output:** **Artifact 2.J — Portable Professional GIS Architecture**

### Why this matters

Technology diagrams often show applications connected by arrows but omit the decisions that determine scientific trust: which copy is authoritative, who may edit, how a raster's measurement semantics survive publication, what counts as an equivalent output, and whether a partner can operate or leave the system.

In this practicum you work as the Remote Sensing Scientist responsible for a cross-organisation handover. You are not being assessed on ArcGIS menu knowledge. You are being assessed on whether the architecture preserves a scientific evidence chain and remains understandable to GIS analysts, platform staff, data stewards and reviewers.

### Scientific context

The coastal-meadow group must sustain a weekly evidence update. Accepted COG composites and reviewed management zones feed six generalized site summaries. A public map reports evidence status and limitations. The regional authority uses an ArcGIS environment, the university uses an open Python and PostGIS stack, and the field partner works offline.

No partner may create a conflicting authority. The public response must contain only allowed fields and generalized geometry. A change of tool may not silently change eligible observations, missingness or spatial support.

All supplied content is synthetic. Do not invent access to a live product, licence or service.

## 2. The decision you must make

Recommend one of four bounded patterns:

1. **ArcGIS Online-centred** — ArcGIS Pro authoring, governed source, hosted views and public delivery;
2. **ArcGIS Enterprise-centred** — controlled infrastructure with portal, services and governed data;
3. **open service-centred** — QGIS/Python/PostGIS plus standards-based delivery;
4. **hybrid** — different implementations separated by explicit scientific and service contracts.

You may choose any pattern if your evidence supports it. You may also reject all candidates until a blocking condition is resolved.

Your architecture must allocate:

- desktop authoring and QA;
- automated vector and raster processing;
- authoritative editing;
- analytical raster storage;
- organisational service delivery;
- public read-only delivery and alternative table;
- identity and least privilege;
- logging, monitoring and deprecation;
- backup, restore and incident response;
- offline exchange;
- migration or exit.

[[CHECK:m2-p10-requirements]]

## 3. Required deliverables

Create the following files in `portfolio/module-2/artifact-2-j/`:

1. `enterprise_gis_comparison.md` — the decision narrative and two candidate architectures;
2. `workflow_role_matrix.csv` — one component, authority class, owner and evidence set per role;
3. `environment_and_licence_inventory.csv` — versions, service levels, user types, extensions, privileges, constraints and verification status;
4. `scientific_invariant_tests.csv` — exact, tolerant and negative comparison tests;
5. `workflow_translation_contract.csv` — stage-by-stage ArcGIS/open method and transfer evidence;
6. `data_authority_map.md` — authorities, snapshots, services, public views and offline copies;
7. `sharing_and_privacy_review.csv` — anonymous and least-privilege test results;
8. `interoperability_acceptance.csv` — format, OGC/service, CRS, type, null and identifier tests;
9. `migration_drill_results.csv` — export, import, round-trip difference and acceptable loss;
10. `operations_and_recovery_plan.md` — monitoring, ownership, backup, restore, incident and deprecation;
11. `PROFESSIONAL_ECOSYSTEM_QA.md` — completed review record;
12. `PROFESSIONAL_ECOSYSTEM_DECISION.md` — accept, conditionally accept or reject;
13. `release_inventory.csv` — path, role, checksum, access class, source and review state.

Every claim must link to supplied evidence, authoritative documentation or a clearly labelled test record. “Supported” without version, environment and a bounded test is not acceptance evidence.

## 4. Phase A — establish requirements before products

### Step 1 — verify the training pack

Verify every byte count and SHA-256 checksum in `manifest.json`. Confirm that the pack contains no real account, endpoint, licence or location. Preserve the original files read-only and record your working-copy checksum.

### Step 2 — classify requirements

Review `workflow_requirements.csv`. Add columns for:

- requirement class: scientific, functional, governance, operational or procurement;
- mandatory or desirable;
- acceptance method;
- responsible owner;
- blocking severity;
- review date.

Do not convert every desirable feature into a mandatory requirement. Complexity is a cost and a failure surface.

### Step 3 — freeze the scientific contract

Read `environment_constraints.json` and create `scientific_invariant_tests.csv`. At minimum, define:

| Evidence | Comparison rule |
| --- | --- |
| source asset identity | exact ID and checksum |
| public sites | exact six-ID set |
| categories and missingness | exact match |
| public schema | exact field allow-list, no extras |
| CRS and coordinate order | exact declared identifier and tested behaviour |
| continuous summaries | predeclared numerical tolerance |
| geometry | topology plus coordinate tolerance |
| provenance | required source, method, date, licence and owner |

Define tolerance from scientific consequence, not from whichever difference appears after running the comparison.

## 5. Phase B — map authority and responsibility

### Step 4 — separate data states

Create `data_authority_map.md`. Include:

- authoritative management-zone edits;
- immutable accepted COG assets;
- versioned analysis snapshots;
- derived site summaries;
- organisational hosted or referenced services;
- filtered public views;
- offline packages;
- catalog metadata;
- QA and decision records.

Use a solid arrow for controlled update flow and a dashed arrow for read-only use. Label every boundary with identity, format/service, version and validation.

### Step 5 — assign owners

For each role in `workflow_role_matrix.csv`, name a human responsibility, not only a team name:

- scientific method owner;
- data steward;
- database or service operator;
- security approver;
- public-content owner;
- backup and restore owner;
- procurement/licence reviewer;
- migration owner.

A component without an operating owner cannot be accepted for production.

### Step 6 — prevent competing authorities

Document which operations are allowed on snapshots, services and offline copies. Define how an offline correction returns to the authority and how conflicts are reviewed. A timestamp alone does not resolve scientific conflicts.

## 6. Phase C — verify candidate components

### Step 7 — audit claims

Open `ecosystem_component_inventory.csv`. For each candidate, record:

- exact version or current service review date;
- required licence, user type, extension or privilege;
- supported input and output for this task;
- positive test;
- negative or failure test;
- evidence location;
- portability boundary;
- status: accepted, conditional, blocked or not required.

If you do not have ArcGIS access, use official documentation as capability context and keep runtime claims **unverified**. Do not turn absence of a paid licence into a failed scientific test.

### Step 8 — distinguish authoring from automation

Evaluate ArcGIS Pro and QGIS for inspection and authoring. Evaluate ModelBuilder and code for orchestration. Evaluate ArcPy and open Python for repeatable processing. Do not assume the same choice must win every role.

For ModelBuilder, require executable model, tool inventory, parameters, environment settings, fixture and post-run QA. For ArcPy, require environment probe, explicit geoprocessing environments, messages, output validation and a portable method contract.

### Step 9 — distinguish Online from Enterprise

For an ArcGIS Online-centred candidate, evaluate item ownership, hosted copies, views, editing, export, groups, anonymous access, lifecycle and service-usage governance.

For an ArcGIS Enterprise-centred candidate, also allocate identity integration, federation, certificates, patching, monitoring, capacity, backup, restore, upgrade and disaster-recovery ownership.

For an open candidate, allocate the same responsibilities across its database, service, identity, client and infrastructure. “Open” does not remove operations.

[[CHECK:m2-p10-authority]]

## 7. Phase D — translate and compare the workflow

### Step 10 — create two executable specifications

Use `workflow_translation.csv` to write `workflow_translation_contract.csv`. Each row must contain:

- scientific role;
- ArcGIS implementation;
- open implementation;
- shared input contract;
- shared output contract;
- parameter source;
- scientific invariant;
- comparison rule;
- failure response.

Avoid translating tool names one-to-one. An enterprise geodatabase, PostGIS database, hosted feature layer and static GeoPackage have different behaviours. Translate the responsibility and evidence.

### Step 11 — build an equivalence gate

Use the supplied scenario evidence to design a deterministic gate:

```python
required = {
    "site_count": 6,
    "missing_count": 1,
    "public_fields": 7,
    "editable_anonymously": False,
}

def evaluate(observed):
    return {
        key: observed.get(key) == expected
        for key, expected in required.items()
    }

for implementation, evidence in comparison.items():
    result = evaluate(evidence)
    print(implementation, all(result.values()), result)
```

Extend the gate to actual ID sets, null positions, continuous tolerances, geometry and provenance. A missing test result is a failure to establish equivalence, not evidence of equivalence.

### Step 12 — explain differences

For every difference, classify:

- representational only;
- operational but scientifically neutral;
- scientifically material;
- governance or security material;
- unresolved.

Do not force identical files where equivalent representations are appropriate. Do not accept visual similarity where scientific values differ.

## 8. Phase E — sharing, interoperability and migration

### Step 13 — test sharing as a non-privileged user

Review `sharing_risk_register.csv`. Your test plan must include:

- anonymous read of permitted content;
- anonymous create, update and delete rejection;
- field and geometry allow-list inspection;
- export/download behaviour;
- authenticated editor boundaries;
- item or service dependency sharing;
- stale or deprecated content behaviour;
- missing-service fallback.

Run tests only in an authorised disposable environment. If no live environment exists, write the exact request and expected result and label execution pending.

### Step 14 — verify interoperability

For each required exchange, test:

- format and version;
- geometry types, validity and precision;
- CRS and coordinate order;
- identifiers and field names;
- numeric, date, Boolean, category and null types;
- domains, relationships, attachments or styles that do not transfer;
- raster scaling, nodata, transform and grid;
- service conformance, paging and permissions;
- client versions.

Opening a dataset is the first test, not the final one.

### Step 15 — perform a migration drill

Select one authoritative-vector snapshot and one analytical raster representation. Design a round trip from the chosen ecosystem to an approved interchange form, into the second ecosystem, and back to a comparable evidence record.

Record:

- source and destination versions;
- export and import parameters;
- checksums;
- lost or transformed properties;
- stable-ID and schema differences;
- geometry and value comparisons;
- manual repair required;
- acceptable and unacceptable loss;
- elapsed effort and responsible owner.

The goal is not zero byte-level difference. The goal is to know whether essential scientific and governance meaning survives.

## 9. Phase F — operations and decision

### Step 16 — design operations

Create `operations_and_recovery_plan.md` covering:

- service availability and capacity assumption;
- monitoring signal and alert owner;
- scheduled processing ownership;
- credential rotation without embedding secrets;
- item and data lifecycle;
- environment and dependency updates;
- backup schedule and protected location;
- restore target and tested evidence;
- incident containment and rollback;
- deprecation, archive and migration trigger.

### Step 17 — compare total responsibility

Use qualitative bands—low, medium, high or unknown—for:

- licence and service dependency;
- infrastructure operations;
- staff skills;
- integration effort;
- reproducibility effort;
- security responsibility;
- offline support;
- migration effort.

Do not invent prices. Record who must obtain a dated quote or entitlement record.

### Step 18 — issue the decision

Write `PROFESSIONAL_ECOSYSTEM_DECISION.md` with:

1. audience and scientific question;
2. selected pattern and rejected alternatives;
3. scientific invariants;
4. role allocation and authorities;
5. equivalence evidence;
6. sharing and security evidence;
7. operations and recovery evidence;
8. licence and capability conditions;
9. migration evidence;
10. residual risk and unsupported claims;
11. decision, owner, expiry and retest trigger.

Use **accept**, **conditionally accept** or **reject**. Conditional acceptance must name measurable closure evidence, not “review later.”

[[CHECK:m2-p10-decision]]

## 10. Failure drills

Run or specify at least these drills:

1. an ArcPy-dependent step runs where ArcPy is unavailable;
2. a ModelBuilder tool extension is not licensed;
3. a hosted view exposes one extra restricted field;
4. an anonymous client attempts an edit;
5. an OGC client interprets an unsupported capability;
6. a GeoPackage round trip changes a date or null type;
7. the public service is unavailable while the text summary remains required;
8. an offline package returns edits after the authority changed;
9. a backup completes but the restore test fails;
10. a service or product upgrade changes one output beyond tolerance.

For each drill, record expected detection, safe response, evidence retained, owner and return-to-service criterion.

## 11. Professional mistakes — Enterprise GIS and Ecosystem Translation

| # | Mistake | Why it happens | Professional recovery |
| --- | --- | --- | --- |
| 1 | Starting with a product diagram | Existing software feels like a fixed requirement | Freeze users, operations and scientific contracts first |
| 2 | Writing “ArcGIS” as one component | The suite appears unified | Name Pro, Online, Enterprise, Server, data store and exact role separately |
| 3 | Treating the desktop project as authority | All layers appear inside one interface | Trace every layer to its governed write source |
| 4 | Selecting by feature count | Procurement comparisons encourage lists | Score only required operations, evidence and total responsibility |
| 5 | Calling an open stack free | Licence cost is visible; operations are not | Allocate hosting, identity, support, patch and recovery ownership |
| 6 | Calling proprietary work irreproducible | Licence dependency is confused with evidence quality | Preserve versions, scripts/models, fixtures, parameters and exports |
| 7 | Assuming Python is portable | ArcPy and open Python look syntactically similar | Separate method, implementation adapter and test contract |
| 8 | Saving only a ModelBuilder screenshot | The diagram communicates well | Preserve executable model, inventory, environments and fixture results |
| 9 | Hiding ModelBuilder defaults | Interface defaults feel harmless | Export every material geoprocessing environment and parameter |
| 10 | Omitting extensions and privileges | Workflow works for the author | Record entitlement evidence and a least-privileged test user |
| 11 | Hard-coding a licence-dependent path | Local project conventions feel stable | Use configuration, environment inventory and portable input contracts |
| 12 | Publishing the editable source | One layer is easier to maintain | Separate authority from filtered read-only publication |
| 13 | Trusting popup configuration | Hidden fields look private | Inspect the complete anonymous payload and export route |
| 14 | Testing as an administrator | Admin access hides permission failures | Use anonymous, viewer, editor and operator identities separately |
| 15 | Confusing hosted and referenced data | Both display as web layers | Record copy/reference, update route and authority explicitly |
| 16 | Assuming Online removes governance | Infrastructure is provider-operated | Govern items, sharing, ownership, usage, lifecycle and public content |
| 17 | Assuming Enterprise means private | It runs in controlled infrastructure | Test identity, federation, service and public-access configuration |
| 18 | Omitting Enterprise operations | Software features dominate design | Assign certificates, patches, capacity, monitoring, backup and recovery |
| 19 | Creating two editable masters | Partners both need updates | Declare one authority and a controlled contribution/reconciliation route |
| 20 | Treating offline sync as conflict resolution | Synchronization sounds automatic | Define stable IDs, conflict policy, audit and human decision owner |
| 21 | Accepting a successful export | The destination opens the file | Compare schema, types, nulls, domains, relationships, CRS and geometry |
| 22 | Assuming open format means identical behaviour | Standard names create confidence | Test exact client versions and supported profiles |
| 23 | Comparing maps only | Visual agreement is persuasive | Reconcile machine-readable IDs, values, missingness and provenance |
| 24 | Choosing tolerance after seeing differences | A passing result is desired | Predeclare tolerance from scientific consequence |
| 25 | Ignoring raster display processing | Both maps look similar | Compare accepted pixel values, scaling, nodata, grid and processing chain |
| 26 | Treating an OGC logo as interoperability | Compliance appears binary | Test version, operation, CRS, paging, format, auth and meaning |
| 27 | Saving temporary service URLs as provenance | The link works today | Preserve stable item/service identity and resolution procedure |
| 28 | Inventing current costs | A numerical comparison looks precise | Assign procurement evidence, date and owner |
| 29 | Recording licence keys in documentation | Reproduction is confused with secret capture | Record entitlement class, not secrets |
| 30 | Designing no migration test | Exit feels distant | Run a small round trip before dependency becomes critical |
| 31 | Requiring zero loss without classifying meaning | Byte equality feels rigorous | Distinguish essential invariant, acceptable representation loss and failure |
| 32 | Accepting a backup without restore | Successful job status feels sufficient | Test recovery against declared data and time targets |
| 33 | Leaving deprecation undefined | Published items remain discoverable | Assign lifecycle owner, review date, replacement and archive state |
| 34 | Documenting no unresolved claim | Architecture reports seek certainty | Keep a visible condition register with owner and retest |
| 35 | Choosing hybrid by default | It appears inclusive | Use hybrid only when distinct constraints justify integration cost |
| 36 | Claiming software proves science | Tools are sophisticated | Link every conclusion to accepted data, method and validation evidence |

## 12. Assessment rubric

| Dimension | Excellent evidence | Insufficient evidence |
| --- | --- | --- |
| Scientific integrity | Every implementation is constrained by explicit IDs, CRS, grid, units, missingness, method and QA invariants | Product choice substitutes for a scientific contract |
| Architecture | Roles, authorities, identities, data flows, owners and operations form one coherent system | A list of applications with unlabeled arrows |
| Ecosystem understanding | ArcGIS Pro, geodatabases, ModelBuilder, ArcPy, Online and Enterprise have accurate bounded roles | “ArcGIS” is treated as one product or unverified feature claims are accepted |
| Cross-ecosystem translation | Two implementations share fixtures and exact/tolerant comparison rules | Tools are matched by name or maps are compared visually |
| Governance and security | Authority, views, least privilege, anonymous tests, lifecycle and offline conflicts are controlled | Popup visibility or administrator access is treated as security evidence |
| Interoperability and exit | Client/profile tests and a round-trip drill expose loss and migration effort | Opening one export is called portability |
| Operations | Monitoring, capacity, licence review, backup, restore, incident and deprecation have owners | The architecture ends after publication |
| Scientific communication | Decision is conditional, evidence-linked and explicit about untested claims | One ecosystem is promoted as universally superior |

## 13. Graduate-profile evidence

### GIS/Remote Sensing Engineer

Demonstrates component boundaries, authority, service architecture, environment control, least privilege, monitoring, recovery and migration design.

### Geospatial Data Analyst

Demonstrates requirement analysis, reproducible workflow translation, exact and tolerant comparison, public-data review and decision communication.

### Remote Sensing Researcher

Demonstrates protection of raster measurement semantics, spatial support, missingness, provenance, uncertainty and scientifically material acceptance thresholds.

One artifact supports all three profiles only when evidence is explicit. A technology diagram alone supports none of them.

## 14. Scientific interpretation

### Scientific interpretation

The practicum result is not “ArcGIS and open tools produce the same map.” It is a bounded decision about whether two organisational implementations preserve the same accepted evidence under declared rules.

For the synthetic scenario, six IDs, one missing record and a CRS match are necessary but not sufficient. The team must also verify the actual identifiers, public fields, categories, measurement values, geometry, eligibility, provenance and anonymous permissions. A numerical tolerance is defensible only when its scientific consequence is understood.

The architecture cannot establish current prices, live service performance, real security posture or every product capability without authorised environments. Those limitations do not weaken the exercise when they are recorded as conditions. Honest uncertainty is stronger professional evidence than invented certainty.

## 15. Reflection

1. Which role in your chosen architecture has the greatest concentration of authority?
2. Which product-specific dependency would be hardest to replace, and why?
3. Which export loss is acceptable for public portrayal but unacceptable for analysis?
4. What evidence would change your architecture decision?
5. Who needs to understand the workflow besides the person who built it?

## 16. Submission

Submit the complete `artifact-2-j` directory, the verified source manifest, one architecture diagram with text alternative, your decision record and a 500–700 word scientific interpretation.

Remove credentials, private endpoints, real sensitive coordinates, personal information and confidential organisational details. Mark every unexecuted product test as pending or unverified.

## 17. Portfolio artifact

**Artifact 2.J — Portable Professional GIS Architecture** completes the enterprise-ecosystem bridge in the UAV and Satellite Analysis Pipeline. It demonstrates that you can enter an ArcGIS, open-source or hybrid organisation without confusing software familiarity with scientific validity.
