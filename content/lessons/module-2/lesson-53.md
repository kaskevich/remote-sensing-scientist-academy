## 1. Workflow Automation and CI

### Learning outcome

By the end of this lesson, you will be able to decompose a geospatial workflow into input validation, processing, testing and output stages; distinguish unit, integration and scientific validation evidence; design deterministic licensed fixtures; express scientific invariants as automated tests; build a safe GitHub Actions workflow; control dependencies, permissions, secrets, caching and artifacts; fail early; and define a reviewed release gate with recovery evidence.

- **Lesson type:** Geospatial Automation and CI Laboratory
- **Estimated time:** 210–270 minutes
- **Prerequisites:** Lessons 2.50–2.52, tests, Git and the complete Module 2 evidence chain
- **Portfolio output:** `geospatial_pipeline_ci.yml`

### Why this matters

A reproducible command is useful; a continuously checked workflow is stronger. Continuous integration runs defined checks when code or configuration changes. It can reveal that a new dependency altered geometry handling, an input fixture lost its CRS, an output grid shifted or a public schema exposed a restricted field.

CI is not a scientific peer reviewer. A tiny fixture cannot represent every meadow, sensor or season. The workflow should automate stable contracts and preserve failures while leaving domain validation and release authority visible.

### Scientific context

The coastal-meadow team has a reviewed acquisition, CLI workflow and container. It now wants every proposed change to prove that a small synthetic fixture still passes input, method, output, security and reproducibility gates. Only reviewed main-branch releases may create a portfolio artifact. Production data and live credentials must never enter pull-request jobs.

```text
change proposed
      ↓
input contract ──fail──► diagnostic log, no processing
      ↓ pass
unit + integration tests ──fail──► no output promotion
      ↓ pass
scientific output invariants ──fail──► quarantined QA artifact
      ↓ pass
security + provenance gate
      ↓
reviewed release artifact
```

### Concept — automate a directed evidence chain

A workflow has stages and dependencies. Validation should occur as early as possible:

1. verify source/fixture checksum and licence;
2. inspect schema, CRS, grid, mask and stable IDs;
3. run pure transformation unit tests;
4. run an end-to-end integration fixture;
5. reopen outputs and compare scientific invariants;
6. scan the release inventory for missing or forbidden content;
7. retain redacted QA evidence;
8. publish only under the approved event and permissions.

If the source raster has the wrong CRS, the input stage should fail before resampling, model execution or map creation.

[[CHECK:m2-l53-order]]

### Testing levels

**Unit tests** exercise a small function with controlled values, such as validating a raster grid signature or converting a physical minimum mapping unit to cells.

**Integration tests** connect components, such as reading a tiny raster, warping it to a target grid, extracting zonal values and writing a validated table.

**Contract tests** verify boundaries with services or formats: required API fields, accepted media type, stable IDs or output schema.

**Regression tests** protect an expected behaviour from unintended change. Compare meaningful values and structures, not large opaque files without explanation.

**Scientific validation** evaluates whether the method supports the environmental claim across representative geography, time and conditions. CI can reproduce the calculation and check registered results, but a tiny fixture does not establish external validity.

### Deterministic geospatial fixtures

A fixture should be small enough to run quickly and rich enough to expose important errors. Include:

- explicit licence and synthetic-data status;
- stable checksum and provenance;
- known CRS and transform;
- continuous and categorical rasters;
- valid and NoData cells;
- vector geometries including one boundary case;
- stable IDs and expected join cardinality;
- an expected output grid and value table;
- one deliberate invalid input for negative testing.

Keep production or sensitive data out of CI. A public repository makes fixture bytes public. Even private CI logs and artifacts require retention/access review.

[[CHECK:m2-l53-fixture]]

### Worked example — a visible validation workflow

#### Predict before running

Which lines obtain source code, establish Python and run tests? Which important production controls are absent? Would this workflow be safe for an untrusted pull request if it used a deployment secret?

```yaml
name: validate-geospatial-pipeline
on: [push, pull_request]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest -q
      - run: python src/run_pipeline.py --config tests/fixture.yml
```

### Code walkthrough

1. `name` gives the check a stable human-readable identity.
2. `on` runs it for pushes and pull requests; production release needs a narrower separate event.
3. `permissions: contents: read` reduces the default token authority.
4. The job uses a hosted Linux runner whose exact image changes over time.
5. Checkout and setup actions are major-version tags in this teaching example; a hardened workflow reviews and pins third-party action revisions.
6. Python is declared as 3.12, but dependencies also need reviewed constraints.
7. `pytest` runs deterministic checks.
8. The pipeline processes a small fixture only after tests pass.
9. The example does not yet upload artifacts, record environment evidence, enforce timeouts, use a container digest or validate output separately.

Do not add a release secret to pull-request code from forks. Separate validation from deployment and use protected environments/approval for publication.

### Scientific invariants as assertions

Test properties tied to meaning:

- source and fixture checksums match;
- vector IDs are unique and expected sets reconcile;
- CRS identifiers and axis conventions are declared;
- output width, height, transform and resolution match the target grid;
- valid mask and NoData counts meet expectations;
- categories remain within the allowed set;
- continuous values remain within scientific tolerance;
- spatial join cardinality and unmatched IDs are expected;
- output schema includes units, time and lineage;
- public artifacts exclude forbidden fields and precise sensitive coordinates.

Avoid brittle tests of incidental metadata such as file creation time unless the contract requires it. Avoid permissive snapshots that are updated automatically whenever tests fail.

### Dependencies, caches and environments

Pin direct dependencies and preserve resolved evidence. A cache improves speed but is not a trusted source by itself. Key caches using dependency definitions and runner characteristics; never cache secret files. Test cache misses periodically so a hidden local state does not become required.

For closer environment equivalence, run the validated container image by digest. Still record the runner, container runtime and mounted fixture identity. A container does not remove workflow permissions or supply-chain review.

### Artifacts and failure evidence

Artifacts may include test reports, a compact QA table, logs, checksums and a small map preview. Set retention deliberately. Do not upload credentials, full protected data, signed URLs, precise sensitive locations or unrestricted environment dumps.

On failure, preserve enough redacted evidence to identify the violated contract. Do not publish a final map from a failed run. If diagnostics themselves may contain protected values, produce a safe summary and store detailed logs only in an authorised system.

[[CHECK:m2-l53-artifact]]

### Release gates and authority

Separate ordinary validation from release. A release job may require:

- all required checks from the exact commit;
- protected main branch;
- approved environment and least-privilege token;
- reviewed source and dataset version;
- signed-off scientific QA decision;
- output inventory and checksums;
- version tag and immutable provenance;
- post-deployment smoke and rollback plan.

CI provides evidence. A named human or governed rule retains release authority where scientific judgement is required.

### Common mistakes and recovery

#### Mistake 1 — running processing before validation

**Recognise it:** expensive stages fail later because source CRS or schema was wrong.

**Recover:** make validation a prerequisite and fail on the first broken contract.

#### Mistake 2 — using production data in CI

**Recognise it:** repository, logs or artifacts contain restricted imagery or locations.

**Recover:** stop access, follow incident policy, remove/rotate exposed authority and replace with licensed synthetic fixtures.

#### Mistake 3 — giving validation jobs write permission

**Recognise it:** pull-request code can publish pages or modify repository contents.

**Recover:** set least privilege and isolate deployment behind protected events/environments.

#### Mistake 4 — updating expected outputs to make tests pass

**Recognise it:** a changed result is accepted without scientific review.

**Recover:** investigate cause, compare consequence and require explicit approval for a justified expectation change.

#### Mistake 5 — treating CI success as external validation

**Recognise it:** fixture pass is used to claim performance on new sites.

**Recover:** state what the fixture tests and retain independent geographic validation.

#### Mistake 6 — exposing secrets in logs

**Recognise it:** commands echo environment values or resolved signed URLs.

**Recover:** revoke affected secrets, minimise environment, redact output and test logging behaviour.

### Guided practice

1. Draw the current pipeline as input, transform, test and output stages.
2. Identify the earliest gate for checksum, schema, CRS, grid, mask, stable IDs and licence.
3. Create one valid and one deliberately invalid synthetic fixture.
4. Write unit tests for grid signature, category set and physical-area conversion.
5. Write an integration test from fixture input to reopened output.
6. Test a wrong CRS, duplicated stable ID, missing field and forbidden public attribute.
7. Design a GitHub Actions validation workflow with read-only permissions, timeout and dependency evidence.
8. Add a container-by-digest execution plan or record why it is deferred.
9. Define safe artifacts and retention.
10. Separate release into a protected job with no access from untrusted changes.
11. Simulate a failed stage and confirm downstream publication cannot run.
12. Create a release inventory and rollback/recovery record.

### Independent challenge

Design a scheduled monitoring workflow for a new upstream observation. It must retrieve a bounded snapshot, detect source/schema drift, compare with the last accepted version, run the fixture suite, quarantine unexpected output and notify a named owner. Explain how rerunning remains idempotent and how a failed schedule recovers without duplicated publication.

### Scientific interpretation

CI makes assumptions executable and failures visible. It strengthens the software and data evidence chain, especially when a pipeline changes. It does not decide whether a new sensor represents vegetation in the same way or whether validation geography supports deployment. Those scientific judgements remain explicit gates whose evidence can be checked and preserved by automation.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which invariant should fail earliest in your workflow?
2. What can the small fixture prove, and what can it not prove?
3. Which job should have permission to publish?
4. What evidence would let you diagnose and recover from failure safely?

#### Submission

Submit `geospatial_pipeline_ci.yml`, fixture manifest, unit/integration tests, expected invariant table, negative-test evidence, permissions review, artifact/retention policy and 300–500 word release-gate decision. Do not include production data or secrets.

#### Portfolio artifact

Add the workflow and tests to `production-geospatial-computing/ci/`. This completes the automated spine of the final UAV and Satellite Analysis Pipeline: validated input, reproducible processing, tested output and controlled publication.
