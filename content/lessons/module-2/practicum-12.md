# Practicum 12 — Productionise the Coastal-Meadow Pipeline

## 1. Professional brief

### Learning outcome

By the end of this practicum, you will be able to operate a synthetic API-to-release geospatial workflow with bounded acquisition, explicit command stages, a secure pinned container, deterministic fixtures, continuous integration, failure recovery and a controlled publication decision.

- **Practicum type:** Production workflow and release assurance
- **Estimated time:** 540–720 minutes
- **Prerequisites:** Lessons 2.50–2.53 and accepted Chapter 7–11 artifacts
- **Portfolio output:** **Artifact 2.L — Production Geospatial Workflow**

### Why this matters

An analysis becomes operational when it runs repeatedly under changing inputs, dependencies and people. Repetition introduces new risks: an API returns a partial page, a source schema changes, a container drifts, a runner receives excessive authority or a failed result is published. Production quality means failures are bounded, visible and recoverable while scientific contracts remain unchanged.

### Scientific context

The coastal-meadow team must create a weekly synthetic monitoring snapshot. A public fixture represents the API response; no live token or restricted data is required. The workflow validates a small field/vector/raster inventory, produces one analysis summary and packages QA evidence. Your task is not to build cloud infrastructure. It is to demonstrate the production contract and its enforcement.

[[CHECK:m2-p12-failure]]

## 2. Required deliverables

Create `portfolio/module-2/artifact-2-l/`:

1. `README.md` — scientific purpose, non-claims, architecture, environment and run order;
2. `acquisition_contract.json` — endpoint/fixture, parameters, schema, paging and retry policy;
3. `acquisition_manifest.json` — redacted run and stable-ID reconciliation;
4. `geospatial_cli_workflow.sh` — explicit inspection and transformation commands;
5. `Dockerfile`, `.dockerignore` and `requirements.txt`;
6. `environment_inventory.json` — image digest, Python/GDAL/PROJ and required drivers;
7. `tests/` — licensed valid/invalid fixtures, unit and integration checks;
8. `.github/workflows/validate-geospatial-pipeline.yml` — least-privilege validation;
9. `scientific_invariants.csv` — gate, evidence, threshold, failure and owner;
10. `failure_and_recovery_drill.md` — at least four simulated failures;
11. `PRODUCTION_WORKFLOW_QA.md` — completed review;
12. `PRODUCTION_RELEASE_DECISION.md` — accept, conditional or reject;
13. `release_inventory.csv` — paths, checksums, access class and provenance.

## 3. Phase A — architecture and contracts

### Step 1 — draw the workflow

Create a directed diagram from acquisition through validation, transformation, testing and release. For every boundary name the input, output, owner and failure action. No stage may rely on an unnamed manual correction.

### Step 2 — freeze scientific invariants

Include:

- accepted source and item IDs;
- query population and retrieval time;
- vector key uniqueness and geometry status;
- CRS and exact raster grid signature;
- band meaning, scale, mask and valid support;
- stable extraction population;
- allowed categories and continuous tolerances;
- public schema and restricted fields;
- output provenance and release inventory.

### Step 3 — separate permissions

Document read-only source access, writable derivative/output paths, registry read, artifact write and publication authority. Validation from untrusted code must not receive a deployment secret.

## 4. Phase B — recoverable acquisition

### Step 4 — validate the request

Use the supplied offline response fixture or a small authorised public request. Record endpoint, parameters, response content type, schema and stable IDs. Redact authentication evidence.

### Step 5 — prove pagination and retry behaviour

Test a two-page success, duplicate ID, malformed JSON, `400`, `401`, `429` and `503`. Only transient conditions may retry, with bounded attempts. Reconcile total, received and distinct IDs.

### Step 6 — promote only accepted snapshots

Raw responses enter a timestamped quarantine area. Schema and provenance validation determine whether a snapshot becomes an accepted input. A failed retrieval never replaces the last accepted snapshot.

## 5. Phase C — command and container execution

### Step 7 — inspect before transformation

Run metadata-only raster/vector inspection. Store the summaries. Commands then create versioned derivatives using explicit output paths and resampling justified by data semantics.

### Step 8 — validate commands

Reopen outputs and compare IDs, schema, CRS, grid, mask, categories, continuous values and provenance. A zero exit code is not the acceptance gate.

### Step 9 — build the container

Use a reviewed pinned base, non-root user, restrictive build context and no embedded data/credentials. Mount inputs read-only and outputs separately. Record base/final digests and environment inventory.

[[CHECK:m2-p12-container]]

### Step 10 — compare environments

Run the deterministic fixture locally and in the container. Declare exact and tolerant comparisons before execution. Investigate every mismatch rather than selecting the preferred output.

## 6. Phase D — tests and continuous integration

### Step 11 — build the fixture suite

Include a valid continuous raster, categorical raster, vector layer, boundary case, stable IDs and known expected output. Include invalid CRS, duplicate ID, wrong category and forbidden public field cases.

### Step 12 — organise tests

- unit tests for validation and conversion rules;
- integration test for the complete small workflow;
- contract test for acquisition schema;
- regression test for accepted scientific invariants;
- negative tests proving safe failure.

### Step 13 — write the workflow

Use least-privilege permissions, timeouts, reviewed action versions, pinned dependency evidence and safe artifacts. Do not expose secrets to pull requests. Make publication depend on every required gate.

[[CHECK:m2-p12-release]]

## 7. Phase E — failure and recovery drill

Simulate at least:

1. API schema change;
2. wrong raster CRS;
3. missing GDAL driver inside the container;
4. changed expected continuous value beyond tolerance;
5. duplicate stable vector ID;
6. attempted forbidden field in the public artifact.

For each record detection stage, error message, downstream stages blocked, evidence retained, owner, recovery, rerun behaviour and confirmation that the last accepted release remains intact.

## 8. Phase F — release decision

Write `PRODUCTION_RELEASE_DECISION.md` with:

- exact commit and image digest;
- accepted source snapshot and checksums;
- test and invariant results;
- unresolved limitations;
- security and secret review;
- authorised release event and owner;
- monitoring and rollback;
- expiry/review date;
- accept, conditional or reject.

## 9. Professional Mistakes — Production Geospatial Computing

| Mistake | Consequence | Recovery |
| --- | --- | --- |
| First API page treated as complete | partial scientific population | reconcile paging and IDs |
| Every failure retried | service abuse and hidden query errors | classify and bound retries |
| Token printed in log | compromised authority | revoke, redact and isolate secrets |
| Raw source overwritten | evidence loss | immutable input and versioned derivative |
| CLI exit code treated as QA | plausible wrong output | reopen and test invariants |
| Continuous resampling used for categories | invented class codes | nearest/category-aware rule |
| `latest` base used | environment drift | version plus release digest |
| Data copied into image | disclosure and image bloat | read-only runtime mount |
| Container runs as root | unnecessary impact | dedicated non-root user |
| CI uses production data | disclosure and irreproducible test | licensed synthetic fixture |
| Pull request can deploy | supply-chain compromise | least privilege and protected release |
| Expected output updated silently | regression accepted without review | change-impact decision |
| Failed run publishes artifact | invalid evidence promoted | dependency gates |
| Cache becomes required state | clean build fails | test cache miss |
| CI pass called scientific validation | unsupported deployment claim | retain geographic/domain validation |

## 10. Scientific interpretation

The artifact demonstrates that a reviewed scientific method can be executed repeatedly without hiding changes or failures. It does not claim that automation makes the ecological conclusion timeless. New sensors, seasons, labels and decision uses still require scientific review.

## 11. Submission and portfolio

Submit the complete Artifact 2.L directory, CI run evidence from authorised fixtures, the failure/recovery drill and release decision. Remove secrets and private endpoints. The instructor should be able to inspect the commit, build the environment, run the fixtures and understand exactly why publication passed or stopped.
