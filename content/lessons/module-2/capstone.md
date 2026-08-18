## 1. Module 2 Capstone — UAV and Satellite Analysis Pipeline

### Learning outcome

By the end of this capstone, you will be able to design, implement, validate and communicate an end-to-end geospatial Earth Observation workflow that integrates field observations, vector boundaries, UAV products and satellite data; preserves spatial and temporal support; validates provenance, CRS, grids, masks and stable IDs; uses geographically independent evaluation; communicates uncertainty and limitations; runs in a reproducible production environment; and provides credible portfolio evidence for GIS/Remote Sensing Engineer, Geospatial Data Analyst and Remote Sensing Researcher profiles.

- **Lesson type:** Module Capstone
- **Estimated time:** 24–40 hours
- **Prerequisites:** All twelve Module 2 chapters and chapter practica
- **Portfolio output:** `UAV_and_Satellite_Analysis_Pipeline`

### Why this matters

Professional work is not a sequence of isolated tools. A coordinate-system decision changes extraction. A mask changes the observational population. A UAV quality defect affects field comparison. A random spatial split changes the model claim. A public map can expose restricted fields. A deployment workflow can publish a result whose inputs failed.

The capstone demonstrates that you can maintain one scientific evidence chain across those boundaries. The final map is important, but it is not the project by itself. Reviewers must be able to trace the question, observations, transformations, exclusions, validation, uncertainty, communication and reproducible execution.

### Scientific context

You are the Remote Sensing Scientist responsible for a Baltic coastal-meadow analysis. The research group needs a decision-support evidence package that combines:

- field observations or the published Baltic coastal plant-traits dataset where documentation permits;
- reviewed study and management boundaries;
- a UAV orthomosaic, surface product or multispectral derivative;
- satellite observations with explicit product, scaling and mask;
- one bounded spatial question;
- an accessible map, table and scientific interpretation.

You may use the Academy's synthetic resources to avoid sensitive locations and licensing barriers. If you bring another dataset, document its authority, licence and ethical constraints before use.

### Concept — a pipeline is a claim–evidence system

The capstone is organised around one claim, not around a list of technologies.

```text
question and decision boundary
          ↓
source evidence + provenance
          ↓
vector/raster/UAV/satellite acceptance gates
          ↓
common spatial and temporal support
          ↓
derived predictors or measurements
          ↓
geographically independent validation
          ↓
result + uncertainty + unsupported areas
          ↓
accessible delivery + reproducible release
```

Every arrow is a transformation or governance boundary. For each one, state inputs, method, parameter source, output, invariant, failure action and owner.

[[CHECK:m2-capstone-claim]]

### Part A — define the scientific brief

Write a one-page brief before processing. Include:

- research or monitoring question;
- intended audience and decision;
- target variable or class;
- spatial population and extent;
- spatial support of field, UAV and satellite observations;
- temporal support and acceptable mismatch;
- expected mechanism or association;
- primary validation evidence;
- important omission/commission or numerical error consequence;
- non-claims and ethical constraints.

A strong question might ask whether reviewed UAV and satellite measures can prioritise meadow zones for field assessment within a represented season. It should not claim causal management effects from one observational map.

### Part B — build a source acceptance inventory

For every input, record stable identifier, origin, licence, citation, checksum, format, CRS, extent, time, measurement meaning, units/scale, nodata/mask, spatial support, quality status and access class.

Separate supplied evidence from assumptions. If a field variable's unit or community-code meaning is undocumented, preserve the column and state the limitation; do not invent a unit or ecological category. Presence of a table value does not prove how or when it was sampled.

Reject, quarantine or conditionally accept sources. Do not delete difficult evidence merely to simplify the project.

### Part C — establish spatial contracts

Create a reference-system and support decision:

- storage CRS and analysis CRS;
- area of use and measurement units;
- vertical reference where elevation products enter;
- target raster transform, resolution, width, height and bounds;
- continuous versus categorical resampling;
- valid-data and nodata conventions;
- geometry repair and topology policy;
- plot-to-pixel support and aggregation rule;
- acceptable georegistration error relative to the ecological target.

Transform coordinates; never relabel them to make layers overlap. Compare complete grid signatures, not only pixel size.

[[CHECK:m2-capstone-gate]]

### Part D — process vectors and rasters

Build a reproducible vector stage that:

- checks unique identifiers, geometry types, empties and validity;
- preserves raw data and writes reviewed derivatives;
- documents buffer, join, overlay and nearest-neighbour semantics;
- audits row cardinality, unmatched records and boundary ambiguity;
- records feature counts and area changes after repair.

Build a raster stage that:

- inspects metadata before full reads;
- applies scale and offset correctly;
- preserves masks separately from meaningful zero;
- crops, masks, reprojects and resamples for distinct reasons;
- aligns every layer to the accepted reference grid;
- uses windows/chunks where scale requires them;
- reopens outputs and checks grid, values, masks and provenance.

### Part E — accept UAV evidence

Trace acquisition to product. Record flight date, sensor, ground sampling distance, overlap, illumination/radiometric evidence, control/check points, processing software/settings and product-level limitations.

Distinguish orthomosaic, DSM, DTM, point cloud and multispectral products. Do not treat a surface elevation or spectral index as a direct vegetation trait. Map positional residuals and exclude unsupported regions. If independent check-point evidence is absent, restrict accuracy claims.

### Part F — accept satellite evidence

State satellite mission, product level, band meaning, spatial resolution, scaling, cloud/shadow/quality masks, acquisition geometry and date. Preserve the difference between optical reflectance, SAR backscatter, imaging spectroscopy and LiDAR measurements.

If multiple observations form a time series or cube, define eligibility, time coordinates, composite statistic, valid-observation counts and source lineage. STAC discovery describes assets; it does not establish comparability. COG/Zarr layout supports access; it does not establish scientific readiness.

### Part G — combine evidence at common support

Choose an explicit comparison unit: field quadrat, plot buffer, UAV object, satellite pixel or management zone. Explain what information is aggregated or lost. Do not treat a fine pixel as automatically more accurate or a table row as equal physical support.

Create a lineage table from every final variable to source asset, transformation, support and validation state. Where field/UAV/satellite times differ, state the ecological assumption and test sensitivity or restrict interpretation.

### Part H — analysis and advanced image option

Use the simplest defensible method that answers the question. A zonal summary and uncertainty comparison may be sufficient. If using segmentation or modelling:

- define the target before parameter selection;
- preserve label provenance and ambiguity;
- partition independent geography before patches;
- compare a transparent baseline;
- report class, object, boundary and regional evidence;
- assess calibration and domain shift;
- map unsupported conditions.

Complexity is accepted only when it adds transferable evidence.

### Worked example — turn stages into visible gates

#### Predict before running

Which failed stage would invalidate the greatest number of downstream outputs? Which gate can be tested without loading every raster value? Which gates still require scientific judgement?

```python
pipeline_gates = {
    "source provenance": True,
    "vector CRS and IDs": True,
    "raster reference grid": True,
    "UAV product QA": False,
    "satellite mask and scale": True,
    "spatial validation": False,
}

for gate, passed in pipeline_gates.items():
    status = "PASS" if passed else "BLOCK"
    print(f"{gate}: {status}")

release_ready = all(pipeline_gates.values())
print("release ready:", release_ready)
```

### Code walkthrough

1. `pipeline_gates` makes each evidence condition visible rather than hiding readiness in one Boolean.
2. The values represent reviewed results, not self-validating software output.
3. The loop prints a consistent status for each gate.
4. `all()` permits release only when every required condition passes.
5. Failed UAV QA blocks derivatives that depend on that product.
6. Failed spatial validation blocks a geographic prediction claim even if processing succeeded.
7. The example does not encode conditional acceptance; a production register should include scope, owner and closure evidence.

### Part I — validate geography and uncertainty

Design evaluation that represents the intended transfer:

- independent sites or buffered spatial blocks;
- no overlapping patches across partitions;
- consistent target, mask and support;
- baseline under the same folds;
- per-region and per-class evidence;
- residual spatial autocorrelation where relevant;
- uncertainty or prediction error mapped separately from observed values;
- extrapolation and unsupported domains clearly masked.

Do not present random neighbouring folds as evidence for new geography. Do not convert association into causation.

### Part J — communicate the result

Produce:

- a primary map that answers one question;
- an equivalent accessible table and text summary;
- methods diagram;
- validation/error map;
- limitations and non-claims;
- source/licence/date/provenance;
- concise decision recommendation.

Protect sensitive locations before serialization. Hiding a field in a popup does not remove it from the browser payload. Test keyboard, touch, 320 px, tablet and desktop layouts. Ensure map meaning does not depend on colour alone.

### Part K — productionise and release

The final pipeline must have:

- bounded acquisition or versioned local source snapshot;
- explicit CLI or Python entry command;
- pinned reproducible environment or container digest;
- no embedded credentials;
- licensed deterministic fixtures;
- unit, integration, contract and negative tests;
- scientific invariant checks;
- least-privilege CI validation;
- protected release authority;
- checksummed release inventory;
- failure and recovery record.

[[CHECK:m2-capstone-release]]

### Common mistakes and recovery

#### Mistake 1 — starting with a favourite tool

**Recover:** return to the bounded question, user, support and error consequence; allocate tools only after responsibilities exist.

#### Mistake 2 — forcing all sources onto one grid without support reasoning

**Recover:** distinguish computational alignment from comparable measurement support and document aggregation/loss.

#### Mistake 3 — presenting only the final map

**Recover:** add source inventory, method, QA, validation, uncertainty, accessible table and release evidence.

#### Mistake 4 — hiding exclusions

**Recover:** retain rejected observations and regions with reason, consequence, owner and revisit condition.

#### Mistake 5 — validating with nearby random samples

**Recover:** rebuild geographically independent partitions and restrict claims until they pass.

#### Mistake 6 — overstating undocumented field meaning

**Recover:** quote only documented metadata and treat unresolved units/codes as limitations.

#### Mistake 7 — equating automation with scientific validity

**Recover:** separate software/data contracts from domain validation and human release authority.

### Guided practice — project milestones

1. Submit the one-page scientific brief for review.
2. Freeze the source inventory and acceptance decisions.
3. Submit the CRS, grid and support contract before deriving predictors.
4. Complete vector and raster QA with machine-readable reconciliations.
5. Complete UAV and satellite product acceptance separately.
6. Build the common-support evidence table and lineage.
7. Register the analysis method, baseline and validation design.
8. Produce results and independent error evidence.
9. Draft map, table, methods and limitations for user review.
10. Run production fixtures, failure tests and clean-environment execution.
11. Conduct a red-team review: find one way each stage could produce a plausible wrong result.
12. Freeze the checksummed release and issue a decision.

### Independent challenge

Prepare a two-page change proposal for extending the pipeline to a new season, sensor or meadow region. Identify reused components, new evidence required, invalidated assumptions, transfer validation and release triggers. This is not implementation; it demonstrates that you can evolve a system without silently extending its scientific claim.

### Scientific interpretation

Your conclusion should answer the original question at the supported scale and domain. Separate observation, derived measurement, model output and ecological interpretation. Explain agreement and disagreement between field, UAV and satellite evidence. Report uncertainty and what would change the decision.

A strong capstone may conclude that evidence supports prioritisation of specified zones for follow-up while withholding a causal or habitat-certification claim. Precision of scope is professional strength.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which assumption connects field and EO support most strongly?
2. Which QA gate prevented the largest downstream risk?
3. Where is uncertainty empirical, model-based or unresolved?
4. Which artifact best demonstrates each graduate profile?
5. What would you change before operational use?

#### Submission

Submit a versioned `UAV_and_Satellite_Analysis_Pipeline/` containing:

1. `README.md` and scientific brief;
2. source and licence inventory;
3. environment definition and run instructions;
4. source code/notebooks with compact documented examples;
5. vector, raster, UAV and satellite QA records;
6. analysis and geographically independent validation;
7. maps, accessible tables and figures;
8. methods, limitations and non-claims;
9. tests, CI or reproducible validation commands;
10. capstone decision and release inventory;
11. one concise portfolio case-study page.

Use personal lesson notes for private reasoning. Use the submission area for assessed files. Use learner–instructor conversation for revision and shared discussion only for non-sensitive methodological learning.

#### Portfolio artifact

The completed pipeline is Module 2's final professional artifact. It should provide:

- **GIS/Remote Sensing Engineer evidence:** interoperable architecture, spatial contracts, container/CI, governance and recoverable delivery;
- **Geospatial Data Analyst evidence:** reproducible vector/raster integration, accessible communication, QA reconciliation and decision-focused summaries;
- **Remote Sensing Researcher evidence:** sensor physics, support reasoning, independent validation, uncertainty, limitations and defensible interpretation.

One artifact can support all three profiles only when the evidence is visible. Do not merely list technologies. Link each claimed competence to a specific file, test, figure or decision in the release inventory.
