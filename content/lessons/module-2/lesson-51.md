## 1. Command-Line Geospatial Tools

### Learning outcome

By the end of this lesson, you will be able to choose command-line operations by purpose rather than memorisation; use `gdalinfo` and `ogrinfo` to inspect raster and vector contracts; explain when `gdal_translate`, `gdalwarp`, `ogr2ogr` and `rio` create derivatives; write a safe command runbook; select resampling from measurement semantics; capture versions, parameters and exit status; and validate outputs by reopening them.

- **Lesson type:** Geospatial Command-Line Laboratory
- **Estimated time:** 170–220 minutes
- **Prerequisites:** Raster and Vector chapters, file/folder paths, CRS and shell basics
- **Portfolio output:** `geospatial_cli_workflow.sh`

### Why this matters

Command-line tools expose precise geospatial operations that can be logged, scheduled and reused across environments. They are valuable for inspection, conversion, reprojection and batch processing. Their compactness is also a risk: one option can change a CRS, grid, mask or data type across hundreds of files.

Professional use is not memorising flags. It is recognising an operation category, reading the versioned help, declaring the scientific contract, executing safely and verifying the result. A successful exit code says that software completed; it does not say the output means what the analysis requires.

### Scientific context

The coastal-meadow pipeline receives a GeoPackage of reviewed plots, a continuous UAV index raster and a categorical management-zone raster. Before production automation, the team needs a small command runbook that inspects sources, creates an analysis grid and exports an approved vector subset without altering raw inputs.

```text
inspect source
  ├─ raster: gdalinfo or rio info
  └─ vector: ogrinfo
          ↓ declare intended change
translate / warp / convert
          ↓ reopen and inspect derivative
compare invariants + intended differences
          ↓ record command, version and result
```

### Concept — tools are grouped by responsibility

#### Inspection

`gdalinfo` reports raster dimensions, bands, data type, coordinate system, transform, bounds, nodata, overviews and driver metadata. It can also calculate statistics, but doing so may read all pixels and create side effects depending on options and format. Start with metadata-only inspection.

`ogrinfo` reports vector data source, layers, feature count, geometry type, spatial reference, extent and field schema. Use summary options before dumping every feature.

`rio info` and related Rasterio commands provide inspection in an interface that aligns with Rasterio-based Python workflows. The correct choice depends on environment and output needs; record the exact tool and version.

[[CHECK:m2-l51-inspect]]

#### Translation

`gdal_translate` creates a raster derivative, often changing format, data type, compression, band selection, scaling or window. It does not perform a general coordinate reprojection. If you assign CRS metadata without transforming coordinates, you repeat the same `set_crs()` versus `to_crs()` distinction learned earlier.

Translation can create a Cloud Optimized GeoTIFF when supported by the installed GDAL driver. Validate the result's layout, overviews, mask and spatial contract rather than assuming a `.tif` extension means COG.

#### Warping

`gdalwarp` reprojects, resamples, mosaics or aligns rasters. It creates a new grid. Declare target CRS, resolution, extent, alignment, resampling, nodata and output type. For a continuous vegetation index, bilinear interpolation may be defensible. For categorical classes, nearest neighbour usually avoids invented category values. Area/conservation questions may require other methods and explicit validation.

[[CHECK:m2-l51-resampling]]

#### Vector conversion

`ogr2ogr` converts or filters vector data, reprojects geometry, selects fields and writes database layers. It can also overwrite or append. Treat write mode as a controlled decision. A SQL or `-where` filter declares which records become evidence; preserve the query and reconcile stable IDs.

#### Shell and path safety

Paths containing spaces require careful quoting. Wildcards may expand to unintended files. Some tools overwrite only with explicit options; others can update data sources. Run in a dedicated output folder, use explicit filenames, preserve raw sources read-only and inspect `--help` for the installed version.

Do not construct shell commands from untrusted text. A site ID or filename from an external source can contain shell metacharacters. In production Python, prefer argument arrays through `subprocess.run(..., shell=False, check=True)` over a single shell string.

### Worked example — inspect, convert and verify

#### Predict before running

Classify each command below as inspection or transformation. Which command changes coordinate representation? Which operation needs a resampling justification? Which source should remain untouched?

```bash
gdalinfo data/uav_index.tif
ogrinfo -so data/plots.gpkg plots

ogr2ogr -f GPKG outputs/valid_plots.gpkg data/plots.gpkg \
  -where "qa_status = 'valid'"

gdalwarp -t_srs EPSG:3301 -tr 0.10 0.10 -tap \
  -r bilinear -dstnodata -9999 \
  data/uav_index.tif outputs/uav_index_3301.tif

gdalinfo outputs/uav_index_3301.tif
ogrinfo -so outputs/valid_plots.gpkg valid_plots
```

### Code walkthrough

1. The first `gdalinfo` inspects the raster source without creating a derivative.
2. `ogrinfo -so` requests layer summary for `plots` rather than printing all features.
3. `ogr2ogr` writes a new GeoPackage and keeps only rows satisfying a documented QA condition.
4. Quoting preserves the attribute expression as one shell argument.
5. `gdalwarp` creates a new raster in EPSG:3301.
6. `-tr 0.10 0.10` declares a 10 cm target resolution in target-CRS units.
7. `-tap` aligns the target grid to integer multiples of resolution; it does not prove alignment with a separate reference grid.
8. `-r bilinear` is a declared continuous-data resampling rule.
9. `-dstnodata` declares output missing-data representation. Confirm that `-9999` cannot be a valid source value.
10. Final inspection reopens both derivatives. You must still compare IDs, values, grid and mask against expectations.

The example is a design until run against authorised files. Tool version and exact driver behaviour belong in the audit.

### Build an acceptance record

For every derivative, classify properties as:

- **invariant** — source identity linkage, band meaning, stable vector IDs, valid-value meaning;
- **intentionally changed** — CRS, grid resolution, format or filtered population;
- **derived and tested** — output checksum, bounds, row count, valid cells, value range;
- **unresolved** — missing units, uncertain nodata, unsupported driver capability.

Capture the command as an argument-safe record, working directory, tool path/version, environment, start/end time, exit code, standard output/error with sensitive values redacted and output checksums.

[[CHECK:m2-l51-audit]]

### Useful inspection patterns

For rasters, inspect:

- driver and creation options;
- width, height, band count and data type;
- CRS and coordinate operation assumptions;
- transform, resolution and bounds;
- nodata, internal mask and alpha relationships;
- band descriptions, units, scale and offset;
- overviews and block size;
- representative valid values.

For vectors, inspect:

- data source and layer names;
- geometry type, dimensionality and CRS;
- feature count and extent;
- field names, types, widths and nullability;
- stable keys and missingness;
- mixed/invalid geometry and layer options.

A printed metadata block belongs in the evidence package, but machine-readable comparisons are stronger for repeated acceptance.

### Tool selection is an engineering decision

Choose a CLI when it makes the operation clearer, more portable or easier to automate. Choose a Python library when the transformation belongs inside a larger validated program or needs structured error handling. Choose QGIS when interactive inspection helps diagnose a spatial anomaly. These are complementary interfaces to geospatial responsibilities, not competing professional identities.

Before adopting a command, confirm that the installed version supports the option and driver you intend to use. Preserve the versioned help or authoritative documentation link in the method record. If a partner environment differs, compare the required behaviour with a deterministic fixture. Do not assume that a familiar command name implies identical defaults across major versions, builds or drivers.

For a batch workflow, create a dry-run inventory before writing outputs. Report source path, proposed destination, operation, expected CRS/grid or schema, overwrite state and acceptance rule. This review catches path collisions and wrong format assumptions before a command touches data.

### Common mistakes and recovery

#### Mistake 1 — running transformation before inspection

**Recognise it:** source CRS, nodata or data type are discovered after outputs exist.

**Recover:** stop, preserve the failed derivative as diagnostic evidence if safe, inspect source and rebuild from raw data.

#### Mistake 2 — using bilinear resampling for categories

**Recognise it:** output contains class values that were never defined.

**Recover:** rebuild with a category-preserving rule and compare class counts/areas.

#### Mistake 3 — assuming `-tap` aligns with a reference

**Recognise it:** resolution matches but transform origins differ.

**Recover:** derive target extent/transform from the accepted reference and compare complete grid signatures.

#### Mistake 4 — overwriting the source

**Recognise it:** input and output path resolve to the same authoritative file.

**Recover:** stop before execution; use immutable source and a versioned derivative folder. If overwritten, restore from verified backup and document incident.

#### Mistake 5 — storing only a pasted command

**Recognise it:** version, working directory, result and output validation are missing.

**Recover:** create a run record with argument list, environment, logs, checksums and acceptance results.

#### Mistake 6 — trusting zero exit status

**Recognise it:** output exists but contains wrong CRS, empty layer or unexpected mask.

**Recover:** reopen and compare predeclared invariants and intended differences.

### Guided practice

1. Record GDAL and Rasterio CLI versions and available drivers in the authorised environment.
2. Inspect the supplied raster and vector without full data dumps.
3. Create source-contract tables with CRS, grid/schema, mask, counts and value meaning.
4. Write intended-output contracts before commands.
5. Convert the approved vector subset to a new GeoPackage and reconcile stable IDs.
6. Warp the continuous raster to the accepted analysis grid with justified resampling.
7. Repeat the raster design for a categorical layer and choose a different resampling method.
8. Reopen outputs using both CLI summaries and Python assertions.
9. Test a wrong input path, existing output, invalid CRS and unexpected empty selection.
10. Preserve redacted standard error and classify each failure.
11. Write a command manifest containing exact argument arrays and checksums.
12. Decide whether each derivative is accepted, conditional or rejected.

### Independent challenge

Design a batch conversion for several source rasters without using an unsafe wildcard write. Include source discovery, unique output paths, concurrency limit, failed-item continuation policy, per-item validation and final reconciliation. Explain how you prevent one bad input from contaminating the accepted stack.

### Scientific interpretation

Command-line processing makes operations visible and composable. It does not make them scientifically neutral. A warp changes the sampling grid; a filter changes the analysis population; a conversion can change types and missingness. The acceptance record ties that transformation to measurement meaning and intended use.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which command only inspects, and which writes a derivative?
2. Which output property is most scientifically sensitive to resampling?
3. How would you prove a vector filter selected the intended population?
4. Which failure should stop the complete batch?

#### Submission

Submit `geospatial_cli_workflow.sh`, a command manifest, before/after raster and vector contracts, stable-ID reconciliation, grid/value QA, failure tests and a 250–400 word decision. The script must use explicit paths, create only derivatives and contain no credentials.

#### Portfolio artifact

Add the runbook and acceptance evidence to `production-geospatial-computing/cli/`. These commands become testable stages of the final pipeline rather than undocumented terminal history.
