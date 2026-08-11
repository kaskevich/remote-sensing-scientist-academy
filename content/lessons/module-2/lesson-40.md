---
title: Dask and Lazy Computation
lessonId: lesson-2-40
---

## 1. Make large work bounded and reviewable

### Learning outcome

By the end of this lesson, you will be able to explain Dask arrays as collections of NumPy-like chunks; distinguish a lazy task description from computed values; estimate array and chunk memory; choose a defensible initial chunk plan from storage and analytical access patterns; identify accidental eager loading; and execute one deliberately bounded Xarray calculation with recorded evidence.

- **Lesson type:** Bounded-computation planning lab
- **Estimated time:** 160–210 minutes
- **Prerequisites:** NumPy memory basics, Xarray selection and EO cube masking
- **Portfolio output:** `lazy_cube_processing.ipynb`

### Why this matters

An EO cube can be larger than a workstation's memory even when the desired answer is small. Loading 180 dates, four bands and a 12,000-by-12,000 grid as 32-bit values would require roughly 386 GiB for one uncompressed array. Masks, temporary results and reducers can require more. The scientifically correct calculation is still unusable if its execution is unbounded, crashes after hours or silently reads far more data than expected.

Dask lets Xarray describe operations on chunks and execute them when requested. It is not infinite memory and it does not make every workflow fast. Poor chunks can create millions of tiny tasks, one impossible task or expensive rechunking. Network requests and compression change costs again. The professional objective is to connect scientific selection to an explicit compute budget: filter early, preserve chunk visibility, estimate memory and calculate only the required result.

This lesson stays on a single workstation conceptually. You do not need to administer a distributed cluster. The transferable skill is knowing what will execute, how much evidence it may touch and how to make failure diagnosable.

### Scientific context

The coastal-meadow group has validated the structure of a seasonal cube. The compact fixture runs eagerly without difficulty, but the proposed regional archive has 180 times, four bands and 144 million cells per band. The group wants seasonal summaries over particular sites, not an unconditional global load.

The supplied `chunk_scenarios.csv` contains five plans. One produces tiny tasks, one treats the complete cube as a single chunk, and several are candidates for measurement. Your responsibility is to choose a starting plan for a stated operation, estimate its memory consequences and run a bounded diagnostic. Performance claims must be tied to the tested system, storage and query. “Dask is faster” is not an acceptable conclusion.

## 2. One concept — delay execution until the question is bounded

### Concept

The single idea is: **lazy computation is useful when it lets you narrow and inspect a calculation before materialising values**.

A Dask array represents a larger logical array as a grid of chunks. Each chunk is commonly a NumPy array when computed. Operations build a task graph describing how input chunks produce output chunks. Metadata such as dimension names, overall shape and often chunk structure can be inspected without reading every pixel.

```text
logical cube: time × band × y × x

┌──────┬──────┬──────┐  time chunk 1
│ y/x  │ y/x  │ y/x  │
├──────┼──────┼──────┤
│ y/x  │ y/x  │ y/x  │
└──────┴──────┴──────┘
         ⋮
┌──────┬──────┬──────┐  time chunk n
│ tasks reference stored chunks │
└──────┴──────┴──────┘

selection → mask → reduction = graph
`.compute()` = execute graph and return an in-memory result
```

Opening a compatible Zarr store with chunks, selecting dates, choosing NIR and defining a mean can remain lazy. Calling `.compute()`, `.load()`, `.values`, `.to_numpy()` or some plotting/export operations can trigger execution. A scalar such as `.min().item()` may also require reading data. Treat every boundary between metadata and values consciously.

`compute()` returns a computed object while leaving the original lazy object available. `load()` generally loads values into the existing Xarray object. `persist()` computes chunks and keeps them available through the active Dask scheduler; it can accelerate repeated work but consumes managed memory. None is automatically correct. For a final small result, `compute()` is often clear. For a reused intermediate, `persist()` may help after a measured decision.

[[CHECK:m2-l40-lazy]]

## 3. Estimate before execution

For an uncompressed numeric array:

```text
bytes = number of elements × bytes per element
```

A `float32` value uses four bytes. A chunk with `time=12`, `band=1`, `y=512`, `x=512` contains 3,145,728 values, or 12 MiB uncompressed. That is only the input chunk. A calculation may hold several inputs, an output, a mask and temporary arrays concurrently. Compression reduces stored bytes, not necessarily in-memory bytes after decoding.

Overall array size and chunk size answer different questions. Overall size tells you why eager loading is unsafe. Chunk size tells you the approximate unit of I/O and task execution. A safe plan considers:

- worker or workstation memory;
- number of chunks that may run concurrently;
- intermediate-array multiplier;
- stored compression and decoding;
- task count and scheduler overhead;
- spatial versus temporal shape of the operation;
- storage chunk alignment and remote request cost.

Leave headroom for the operating system, notebook and libraries. Do not plan to fill all advertised RAM. A budget is a safety condition, not a speed guarantee.

### Chunking follows access patterns

For viewing one date over a spatial window, chunks with a short time axis and moderate spatial tiles can fit the request. For a per-pixel seasonal reducer, chunks that contain a meaningful time span can reduce cross-chunk combination, but an entire long time series may be too large or poorly aligned with storage. For extracting many tiny points, large spatial chunks can read much unused area.

Good starting chunks usually:

- are large enough that task overhead is small compared with useful work;
- are small enough that multiple concurrent chunks and intermediates fit memory;
- align with stored chunks when practical;
- align with the main calculation's dimensions;
- avoid extreme fragmentation or one monolithic chunk.

These are design principles, not universal sizes. Dask documentation commonly discusses chunks from tens of megabytes upward, but the right value depends on hardware, codecs, storage latency and operation. Benchmark representative small queries and record the result.

## 4. Rechunking is a transformation, not a free setting

Xarray's `chunks=` argument can choose a Dask view of stored data, but a mismatch can cause read amplification. Rechunking changes the logical chunk grid; when it requires redistributing values, it can be expensive in memory, I/O and temporary storage. Repeatedly rechunking for each notebook section is a warning that the published storage layout may not fit the workload.

Distinguish:

- **storage chunks:** how encoded values are grouped in COG tiles or Zarr chunk objects;
- **Dask chunks:** how tasks see groups of values;
- **output chunks:** how a derivative is written for future access.

They can differ, but every difference has a cost. An operational project may publish separate access products for map browsing and time-series analysis rather than forcing one layout to serve every pattern.

Unknown chunk sizes are another risk. Some operations such as filtering by a lazy Boolean array can leave dimensions unknown until execution. Asking Dask to calculate chunk sizes can trigger computation. Inspect the graph and use a bounded known-size route where possible.

[[CHECK:m2-l40-chunks]]

## 5. Worked example — compute one bounded diagnostic

### Predict before running

Assume `data/meadow_cube.zarr` is a validated local store. Which lines only describe work? Which line reads and computes values? Why is the spatial subset applied before `.compute()`?

```python
import xarray as xr

cube = xr.open_zarr("data/meadow_cube.zarr",
                    chunks={"time": 12, "y": 512, "x": 512})
nir = cube["reflectance"].sel(band="nir")
season = nir.sel(time=slice("2025-05-01", "2025-08-31"))
clear = season.where(cube["valid_mask"].sel(time=season.time))
summary = clear.median("time", skipna=True)
diagnostic = summary.isel(y=slice(0, 256), x=slice(0, 256))
print(summary.data)
result = diagnostic.compute()
print(result.shape, result.nbytes)
```

### Code walkthrough

1. Xarray delegates chunked array execution to Dask when the store is opened with chunks.
2. The chosen chunk mapping is a candidate, not a claim of optimality; omitted dimensions follow reader behaviour and must be inspected.
3. Selecting the named NIR band narrows the measurement.
4. Selecting the seasonal interval narrows time.
5. The aligned validity mask replaces contaminated values with missing values before reduction.
6. The median definition remains lazy when backed by Dask.
7. A 256-by-256 diagnostic subset bounds the output requested for this test.
8. Printing `summary.data` should expose a Dask-backed representation rather than values.
9. `.compute()` executes the diagnostic graph and returns an in-memory Xarray result.
10. The final line reports the computed output footprint; it is not the peak memory of the calculation.

In your notebook, inspect `cube.chunks`, dimension sizes and dtypes before the calculation. Record elapsed time and peak process memory if you have a reliable tool, but do not turn one run into a universal benchmark. Validate the computed result against the eager compact fixture so that performance changes do not change scientific results.

## 6. Common mistakes and recovery

### Mistake 1 — calling `.compute()` on the whole cube to “see it”

Beginners understandably want visible confirmation. The command crosses from a compact graph to all source values.

**Recognise it:** the kernel becomes unresponsive, network traffic rises or memory grows before any scientific subset is applied.

**Recover:** stop if safe, reopen metadata, select one variable, interval and bounded window, then compute only a diagnostic or final compact output.

### Mistake 2 — using `.values` inside exploratory code

It resembles a harmless property from NumPy and pandas.

**Recognise it:** an apparently small line triggers long execution, or labelled/chunk context disappears.

**Recover:** inspect `.data`, `.chunks`, `.sizes`, coordinates and a small `.isel()` subset. Convert only after the result is demonstrably bounded.

### Mistake 3 — choosing tiny chunks

Small pieces sound memory-safe.

**Recognise it:** the task graph contains enormous numbers of tasks, scheduler overhead dominates, and remote storage receives many small requests.

**Recover:** increase chunks while retaining memory headroom, align with storage, and benchmark a representative operation.

### Mistake 4 — choosing one giant chunk

One task seems simple and avoids overhead.

**Recognise it:** one chunk approaches the full dataset size or exceeds safe memory after intermediates.

**Recover:** divide along dimensions appropriate to the operation and keep each concurrent working set bounded.

### Mistake 5 — assuming compression solves memory

A 2 GiB compressed object may decode to tens of GiB.

**Recognise it:** disk size is used as the RAM estimate.

**Recover:** estimate from logical shape and decoded dtype, then add headroom for masks, outputs and temporary values.

### Mistake 6 — rechunking repeatedly without measuring

Changing `chunks` feels like metadata configuration.

**Recognise it:** graphs contain shuffle/rechunk layers, temporary storage grows or most time is spent reorganising data.

**Recover:** separate storage and compute layouts, measure the common access pattern, and write a reusable derivative only when justified.

### Mistake 7 — reporting speed without result equivalence

Faster execution is attractive and easy to communicate.

**Recognise it:** chunk experiments do not compare coordinates, masks, counts and numeric tolerance.

**Recover:** validate a small result against a trusted eager calculation before accepting any performance plan.

[[CHECK:m2-l40-memory]]

## 7. Guided practice — write a chunk and memory plan

1. Verify `chunk_scenarios.csv` and read every scenario before opening a data source.
2. Recalculate the full logical cube size from `time=180`, `band=4`, `y=12000`, `x=12000`, `float32`. Report decimal GB and binary GiB with formulas.
3. Recalculate uncompressed chunk MiB for scenarios A–E. Compare your results with the supplied estimates and investigate rounding differences.
4. For each scenario, estimate a conservative working set using four simultaneous chunks and an intermediate multiplier of three. State that this is a planning approximation.
5. Reject the tiny-task and one-chunk extremes with written evidence. Do not call another scenario optimal yet.
6. Choose two candidates for a seasonal spatial summary and two for a per-pixel time series. Explain how the preferred dimension shapes differ.
7. If a Dask environment is available, create a synthetic lazy array with smaller dimensions but proportional chunks. Inspect task count and run one bounded mean. Do not create a multi-gigabyte fixture.
8. Compare the result with an eager NumPy calculation on the same small fixture using coordinate and numeric assertions.
9. Record storage alignment, elapsed time, observed memory, result checksum and caveats in `chunk_benchmark.csv`.
10. Add a “compute gate” to the notebook that refuses a requested output whose estimated bytes exceed your declared diagnostic threshold.
11. Complete the computation-plan section of `CLOUD_NATIVE_EO_QA_TEMPLATE.md`.
12. Save the notebook as `lazy_cube_processing.ipynb`.

## 8. Independent challenge — design for two workloads

Design two alternative plans for the same proposed cube:

1. create a regional seasonal median and observation count;
2. retrieve the full 180-date NIR series for 200 field-plot neighbourhoods.

For each, declare selection order, stored chunks, candidate Dask chunks, expected task shape, memory budget, output form and validation fixture. Identify where read amplification may occur. Decide whether one storage layout is an acceptable compromise or whether a second derived access product is warranted.

Support your answer with calculations, not adjectives. “Smaller” and “faster” are incomplete without dimensions, bytes, operation and test conditions. Include one abort criterion that would stop computation before failure.

## 9. Scientific interpretation

### Scientific interpretation

Lazy execution does not change the ecological question. It changes when and in what pieces values are read and calculated. If chunking changes a seasonal median beyond the expected numeric tolerance, something is wrong in alignment, reducer behaviour, dtype, missingness or implementation. Performance engineering is acceptable only when the scientific result remains equivalent.

A well-bounded workflow also improves scientific reasoning. Selecting the period, measurement, spatial support and mask before computation makes the analysis population explicit. Recording observation counts and graph scope exposes what evidence actually contributed. The result supports a reproducible computation claim under the tested environment; it does not prove that the chosen seasonal reducer captures meadow phenology or that another storage system will have the same performance.

## 10. Reflection, submission and portfolio artifact

### Reflection

1. Which familiar Xarray operations can unexpectedly trigger value loading?
2. Why is compressed object size a poor estimate of working memory?
3. When might a chunk layout good for map display be poor for a temporal reducer?
4. What evidence would justify creating a new rechunked derivative rather than adapting each analysis?

### Submission

Submit:

- `lazy_cube_processing.ipynb` with a bounded computation and result-equivalence check;
- `chunk_memory_plan.csv` containing formulas, candidates, working-set estimates and decisions;
- `chunk_benchmark.csv` with the exact environment, storage, query and limitations;
- `compute_gate.md` stating subset, memory and abort rules;
- one screenshot of the inspected lazy graph or chunk representation before computation;
- a 250–400 word explanation of why the selected plan is safe for the stated workload but not universally optimal.

Do not upload large derived arrays, scheduler dashboards containing private URLs, credentials or machine-specific absolute paths.

### Portfolio artifact

Add `lazy_cube_processing.ipynb` to **Artifact 2.H — Cloud-Native EO Discovery and Cube Package**. It becomes the execution plan attached to the cube contract. The next lesson will examine whether the stored format can serve those chunks without excessive transfer.
