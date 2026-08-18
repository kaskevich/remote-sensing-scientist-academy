## 1. Docker for Geospatial Reproducibility

### Learning outcome

By the end of this lesson, you will be able to distinguish a container image from a running container; explain why native GDAL/PROJ dependencies make geospatial environments difficult to reproduce; design a minimal pinned image; separate software from governed data; use a non-root runtime and read-only mounts; identify architecture and determinism limits; record an image digest and software inventory; and verify the same scientific fixture inside and outside the container.

- **Lesson type:** Container Reproducibility Studio
- **Estimated time:** 190–250 minutes
- **Prerequisites:** Lesson 2.51, environments and dependencies, geospatial file drivers
- **Portfolio output:** `geospatial_pipeline_container`

### Why this matters

Geospatial Python depends on compiled libraries, coordinate databases and format drivers. A notebook can work on one computer and fail elsewhere because GDAL, PROJ, GEOS or a system library differs. A container can package an operating-system userspace, libraries and application code into a versioned image. That reduces one major source of uncertainty.

Containers do not freeze the world. They do not preserve external data, guarantee identical hardware arithmetic, validate a scientific method, protect secrets automatically or replace an environment manifest. The professional task is to use a container as one layer in a complete reproducibility and security contract.

### Scientific context

The coastal-meadow pipeline now has reviewed acquisition and command stages. The university, regional authority and automated runner use different systems. The team needs one small execution environment for the deterministic fixture and production commands, while keeping protected source imagery outside the image.

```text
Dockerfile + pinned dependency definitions + source code
                           ↓ build
                     container image
              immutable layers + metadata + digest
                           ↓ run with
           non-root user + command + read-only inputs
                     + writable outputs
                           ↓
                   container instance
                           ↓
        validated outputs + logs + release provenance
```

### Concept — image, container and host have separate responsibilities

An **image** is a packaged, content-addressable template made of filesystem layers and configuration. A **container** is a running or stopped instance of that image. The **host** provides the kernel, CPU, storage, network and container runtime.

This distinction explains both strengths and limits. The image can pin GDAL and Python dependencies. It cannot make the host CPU architecture identical or guarantee access to an external API. Runtime mounts and environment variables can change behaviour. Record both build identity and run configuration.

[[CHECK:m2-l52-image]]

### Why geospatial dependencies are difficult

Rasterio and GeoPandas rely on compiled geospatial libraries. GDAL drivers determine which formats and remote services can be read. PROJ uses coordinate-operation definitions and grid files. GEOS supports geometric operations. Python wheels often bundle compatible versions, but mixing installation sources or system libraries can create subtle mismatches.

Typical symptoms include:

- a format driver available on one machine but not another;
- CRS transformations using different grid availability;
- binary-library import errors;
- output compression options changing across GDAL versions;
- an image built for one CPU architecture failing on another;
- a mutable base tag producing different bytes later.

A container helps by building these relationships together. It does not prove that the chosen versions are correct. Test required drivers, transforms and outputs.

### Design a minimal image

A strong Dockerfile has a small, explicit responsibility. It should:

- use a trusted base identified by version and, for release, preferably digest;
- install only required dependencies;
- pin direct dependencies and record resolved versions;
- copy dependency files before rapidly changing source when cache behaviour is useful;
- avoid package-manager caches in the final layer;
- run as a non-root user;
- define a predictable working directory and entry point;
- exclude `.git`, credentials, notebooks with sensitive output and data through `.dockerignore`;
- include labels for source revision and licence where appropriate.

Do not blindly copy a public Dockerfile. Read the base documentation and inspect what is actually installed.

### Worked example — express the environment contract

#### Predict before running

Which lines belong to image build time, and which information must be supplied at runtime? Why is the source raster not copied? What remains unpinned in this teaching example?

```dockerfile
FROM ghcr.io/osgeo/gdal:ubuntu-small-3.11.4

WORKDIR /academy
COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
RUN useradd --create-home --uid 10001 academy
USER academy

ENTRYPOINT ["python3", "src/run_pipeline.py"]
```

### Code walkthrough

1. `FROM` selects a geospatial base and a versioned tag. A production release should also record the resolved image digest.
2. `WORKDIR` creates a predictable location for following operations and runtime.
3. The dependency file is copied separately so its layer changes only when dependencies change.
4. `pip` installs the declared Python packages without retaining its download cache.
5. Application source is copied into the image; source revision must still be recorded.
6. A dedicated user with a stable numeric ID is created.
7. `USER` ensures the application does not run as root by default.
8. The JSON-form entry point passes arguments without shell interpretation.

The example is intentionally incomplete until `requirements.txt`, source tests, base digest, labels, health/exit behaviour and `.dockerignore` are reviewed. Run it only in an authorised environment.

### Data and secrets do not belong in the image

Large source rasters, private GeoPackages and learner submissions are governed data. Copying them into an image makes them part of immutable layers, even if a later layer deletes the visible path. Images may be pushed to registries or cached on shared runners.

Use explicit runtime mounts or authorised object-service access. Mount raw input read-only. Use a separate writable output directory. Do not mount the Docker daemon socket or broad home directory. Run with least privilege, resource limits and network access appropriate to the stage.

[[CHECK:m2-l52-data]]

Runtime secrets should come from the platform's secret mechanism or protected environment injection. Ensure the application never prints them. Build-time secrets require dedicated secret mounts; ordinary build arguments and environment layers can remain visible in image history.

### Reproducibility evidence

Record:

- Dockerfile and `.dockerignore` checksums;
- source Git revision;
- base image reference and resolved digest;
- final image digest and architecture;
- resolved Python packages;
- GDAL, PROJ, GEOS and driver inventory;
- build command, builder/runtime version and timestamp;
- build provenance if available;
- runtime command and non-secret environment;
- mounted input and output paths plus input checksums;
- CPU architecture and relevant limits;
- fixture and output validation results.

An image digest identifies image bytes. It does not prove that the source data, algorithm, labels or result are valid.

[[CHECK:m2-l52-limit]]

### Verify equivalence, not byte identity by habit

Run the same deterministic fixture in the reviewed local environment and in the container. Compare scientific invariants:

- stable vector IDs and schema;
- CRS and complete raster grid signature;
- masks and valid-cell counts;
- categorical values exactly;
- continuous values under a predeclared tolerance;
- provenance and expected output inventory.

Byte-for-byte checksums are strong when deterministic encoding is required, but equivalent GeoTIFFs can differ in compression metadata while representing the same grid and values. Decide which comparison matches the release contract before seeing results.

### Multi-stage builds and supply-chain review

Some projects compile dependencies in a builder stage and copy only runtime artifacts into a final stage. This can reduce size and build tools, but it increases Dockerfile complexity. Use it when evidence shows a benefit.

Review base source, update policy, vulnerability reporting, image signature/provenance and licence obligations. Pinning forever is not security. A release needs a controlled update process: rebuild, rerun fixtures, review changed dependencies and publish a new digest.

### Common mistakes and recovery

#### Mistake 1 — using `latest`

**Recognise it:** the same Dockerfile resolves to different bases over time.

**Recover:** select an explicit version and record the release digest; establish reviewed update intervals.

#### Mistake 2 — copying data or secrets into layers

**Recognise it:** Docker context includes `.env`, raw imagery or credentials.

**Recover:** stop the build, rotate exposed credentials, restrict registry/cache access, add `.dockerignore` and mount governed data at runtime.

#### Mistake 3 — running as root

**Recognise it:** application writes root-owned host files or has unnecessary capability.

**Recover:** create a dedicated user, set output permissions deliberately and test the non-root runtime.

#### Mistake 4 — assuming container equals reproducibility

**Recognise it:** no input checksum, command, seed or output comparison exists.

**Recover:** build the complete run manifest and equivalence fixture.

#### Mistake 5 — installing unpinned dependencies during every build

**Recognise it:** resolved packages drift despite unchanged source.

**Recover:** maintain reviewed constraints/lock evidence and record resolved inventories.

#### Mistake 6 — ignoring architecture

**Recognise it:** an image built on ARM fails or changes behaviour on x86 runner.

**Recover:** declare supported platforms, build accordingly and test every claimed architecture.

### Guided practice

1. Write the environment responsibility: which command and formats the container must support.
2. Inventory the current Python, GDAL, PROJ and driver requirements.
3. Create a minimal Dockerfile, pinned dependency definition and restrictive `.dockerignore`.
4. Create a non-root user and separate `/inputs` read-only from `/outputs` writable.
5. Build in an authorised environment and record the base/final digest and architecture.
6. Run an environment probe without printing secrets.
7. Run the deterministic raster/vector fixture locally and in the container.
8. Compare grid, IDs, masks, categorical values and continuous tolerances.
9. Test missing input, unwritable output, unsupported driver and memory limit.
10. Inspect logs and exit codes for actionable, redacted failure.
11. Review image contents for accidental data, credentials and unnecessary tools.
12. Write an acceptance and update decision with owner and review date.

### Independent challenge

Design a two-platform release for ARM64 and AMD64. Identify which evidence can be shared and which must be rerun. Include build provenance, driver inventory, deterministic fixture, numerical tolerance and a policy for a platform-specific failure. Do not claim cross-platform equivalence without execution evidence.

### Scientific interpretation

The container strengthens the link between source revision and executable environment. It narrows “works on my machine” uncertainty, particularly for native geospatial dependencies. Scientific reproducibility still depends on source data, parameter provenance, spatial contracts, validation and interpretation. Report the container as environment evidence, not as proof of the conclusion.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which dependency is most likely to change geospatial behaviour?
2. What belongs in the image and what must be mounted?
3. Which result must match exactly and which may use tolerance?
4. What triggers a rebuild and revalidation?

#### Submission

Submit `Dockerfile`, `.dockerignore`, pinned dependency file, environment inventory, build/run manifest, fixture-equivalence report, security review and 250–400 word acceptance decision. Do not upload image layers containing source data or credentials.

#### Portfolio artifact

Add the container definition and evidence to `production-geospatial-computing/container/`. The artifact demonstrates that the final pipeline has a portable execution contract rather than only a personal environment.
