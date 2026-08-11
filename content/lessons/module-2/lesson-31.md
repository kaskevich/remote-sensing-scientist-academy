---
title: Spatial Autocorrelation
lessonId: lesson-2-31
---

## 1. Ask whether location still matters

### Learning outcome

By the end of this lesson, you will be able to explain positive, negative and weak spatial autocorrelation; translate a scientific neighbour hypothesis into a spatial-weights matrix; calculate and interpret global Moran's I with permutation inference; examine islands and edge effects; and report a sensitivity analysis without treating spatial pattern as ecological cause.

- **Lesson type:** Spatial-dependence reasoning lab
- **Estimated time:** 170–210 minutes
- **Prerequisites:** GeoDataFrames, projected coordinates, spatial support, joins and Chapter 5 plot evidence
- **Portfolio output:** `spatial_autocorrelation_report.ipynb`

### Why this matters

Ordinary statistical summaries often behave as though observations supply independent pieces of information. Spatial environmental observations frequently violate that expectation. Plots close to one another may share soil, elevation, hydrology, management history, sensor conditions or unmeasured processes. Ten adjacent plots can therefore contain less independent information than ten plots distributed across the landscape.

Ignoring this structure can produce overconfident uncertainty, misleading validation and a false impression that a pattern generalises. The opposite mistake is also common: discovering spatial clustering and immediately naming its cause. Spatial autocorrelation describes how a variable is arranged under a chosen definition of neighbourhood. It does not identify the mechanism that produced the arrangement.

A Remote Sensing Scientist needs both disciplines: detect spatial dependence before inference, and stop interpretation before pattern becomes unsupported causation.

### Scientific context

The Baltic coastal meadow team has assembled synthetic plot-level NDVI, biomass and elevation evidence after the satellite chapter. The central core of the training area contains an eastward vegetation and elevation gradient. Four observations were added close to an access route, and one targeted plot lies far beyond the core sampling frame.

The team asks whether nearby accepted plots have more similar NDVI than expected if the observed values were spatially rearranged. Before calculating a statistic, you must decide what “nearby” means. Four nearest neighbours, a 170 m distance band and shared management zones describe different scientific relationships. The answer cannot be separated from that choice.

## 2. Spatial pattern needs a relationship model

### Concept

The single idea in this lesson is that **spatial autocorrelation is a relationship between values and an explicit spatial-weights model**.

Tobler's first law is often paraphrased as nearby things being more related than distant things. It is a useful expectation, not a universal law of the dataset. Tidal channels can separate nearby plots. A management regime can connect distant fields. Wind, water and animal movement may create directional or network relationships. Distance is one candidate explanation for interaction, not the definition of interaction itself.

A spatial-weights matrix, commonly written as **W**, records which observations are neighbours and how strongly they are connected. For observations *i* and *j*, `w_ij` is usually zero when they are not neighbours and positive when they are. Common constructions include:

- **contiguity:** polygons share an edge or boundary;
- **distance band:** observations within a declared distance are connected;
- **k-nearest neighbours:** every observation connects to its *k* closest observations;
- **process-based links:** hydrological, coastal or movement pathways define the relationship.

Row standardisation rescales each row so its weights sum to one. This makes a spatial lag resemble a weighted neighbour average, but it also changes the statistic's weighting. Record the transformation rather than treating it as an invisible default.

### Visual explanation

| Step | Object | Meaning | Required decision |
| --- | --- | --- | --- |
| 1 | plot values | the variable being examined | units, support, exclusions and transformation |
| 2 | neighbour graph | the proposed spatial relationship | distance, contiguity, k or process basis |
| 3 | weights matrix **W** | numeric representation of that graph | binary or weighted, symmetric or directed, standardisation |
| 4 | spatial lag **Wz** | neighbouring standardised values | treatment of islands and edges |
| 5 | Moran's I | global value–lag association | reference expectation and sensitivity |
| 6 | permutations | empirical null distribution | what is held fixed and what is shuffled |

An **island** is an observation with no neighbours under a given rule. A very distant targeted plot may become an island under a distance band, even though a k-nearest rule forces it to connect. Neither outcome is automatically correct. The distance rule honestly reports disconnection; the k-nearest rule guarantees computability but may create an ecologically implausible long link.

[[CHECK:m2-l31-weights]]

## 3. What global Moran's I asks

Global Moran's I compares similarity in standardised values with the weights linking their locations. A positive value commonly indicates that similar values tend to be neighbours. A negative value commonly indicates that neighbouring values tend to be dissimilar. A value near its null expectation suggests little global structure under that weights model.

Do not interpret the number against zero without context. The analytical expectation under randomisation is often close to, but not exactly, zero and depends on sample size. Software reports an expected value and can build an empirical reference distribution through permutations.

Permutation inference keeps the observed locations and weights fixed, shuffles the attribute values among those locations, recalculates the statistic and asks how unusual the observed statistic is relative to the shuffled results. The null is not “the environment has no process”. It is closer to “this value arrangement is exchangeable among these locations under this fixed spatial relationship”.

The result depends on:

- the analysed observations and QA exclusions;
- the variable and any transformation;
- the spatial-weights definition;
- row standardisation or other weighting;
- the number of permutations and random seed;
- the study boundary, sampling pattern and spatial support.

A small permutation probability is evidence that the observed pattern is unusual under that reference procedure. It is not evidence that elevation, management or hydrology caused the pattern.

[[CHECK:m2-l31-permutation]]

## 4. Global and local questions are different

Global Moran's I summarises one tendency across the analysed domain. Strong clustering in one corner and dispersion elsewhere can partly cancel. A global statistic should therefore be accompanied by a map, neighbour diagnostics and—when the scientific question requires it—carefully corrected local analysis.

Local indicators can identify locations contributing to high–high, low–low, high–low or low–high patterns under a weights model. They involve many simultaneous local tests and are sensitive to boundaries, weights and sample size. This lesson does not ask you to turn local statistics into a hotspot map. First learn to build and defend the global relationship model. Local analysis belongs only after the global design, multiple-testing plan and reporting language are explicit.

## 5. Worked example — one declared neighbour model

### Predict before running

Inspect `meadow_plot_observations.csv`. Use only rows whose `qa_status` is `accept`. The accepted values generally increase from west to east. Before running the code, predict whether four-nearest-neighbour Moran's I for `ndvi_mean` will be positive, negative or close to the randomisation expectation. Which accepted edge plot might have an unusual neighbour set?

```python
import geopandas as gpd
import pandas as pd
from esda.moran import Moran
from libpysal.weights import KNN

table = pd.read_csv("inputs/spatial-statistics/meadow_plot_observations.csv")
accepted = table.loc[table["qa_status"].eq("accept")].copy()
plots = gpd.GeoDataFrame(
    accepted, geometry=gpd.points_from_xy(accepted.x_m, accepted.y_m)
)
weights = KNN.from_dataframe(plots, k=4)
weights.transform = "R"
result = Moran(plots["ndvi_mean"].to_numpy(), weights,
               permutations=999, seed=731)
print("Moran's I", round(result.I, 3))
print("expected", round(result.EI, 3), "p_sim", round(result.p_sim, 3))
```

### Code walkthrough

1. `geopandas` supplies geometry-aware tabular data; `pandas` reads the compact CSV.
2. `Moran` supplies the global statistic and permutation result.
3. `KNN` creates a k-nearest-neighbour graph from point locations.
4. The input table is loaded without treating the synthetic coordinates as a real geographic CRS.
5. Only declared `accept` rows enter this primary analysis. Review rows remain in the source.
6. `.copy()` keeps the filtered table independent and avoids accidental edits to the input object.
7. `points_from_xy()` creates point geometry from the metric x and y fields.
8. No CRS is assigned because the pack defines a synthetic local metric grid, not an EPSG-referenced location.
9. `KNN.from_dataframe(..., k=4)` gives each plot four neighbours. This is the scientific assumption to test, not a neutral setting.
10. `"R"` row-standardises the weights.
11. The analysed variable is converted to a NumPy array in the same row order as the weights.
12. `999` permutations create an empirical reference distribution; the fixed seed makes the exercise reproducible.
13. The final lines report the observed statistic, analytical expectation and permutation probability.

The code is deliberately one model. It is not the conclusion. A professional analysis must examine neighbour counts and distances, map the graph, check islands and compare plausible alternatives.

## 6. Common mistakes and recovery

### Mistake: selecting neighbours because the result is significant

**Why beginners make it:** the weights setting can feel like a tuning parameter.  
**Recognition:** several definitions are tried, but only the smallest p-value is reported.  
**Recovery:** define plausible relationships from sampling support and environmental process before examining results. Report a labelled sensitivity table for all defensible definitions.

### Mistake: using longitude and latitude as planar metres

**Why beginners make it:** coordinates appear numeric and distance functions still return values.  
**Recognition:** a distance threshold is described in metres while geometry remains in degrees.  
**Recovery:** verify and transform authoritative data to a suitable projected CRS. For this synthetic pack, use the documented local metric coordinates without assigning a false CRS.

### Mistake: allowing k-nearest neighbours to hide an island

**Why beginners make it:** k-nearest weights always return neighbours.  
**Recognition:** an isolated plot is connected across a distance much larger than links in the core domain.  
**Recovery:** inspect link-length distributions and map the graph. Compare a distance-band definition that exposes the island and decide whether the plot belongs to the same inference domain.

### Mistake: reporting only I and p

**Why beginners make it:** two numbers look like a complete statistical result.  
**Recognition:** the report omits variable, support, weights, transformation, permutations and study extent.  
**Recovery:** use the spatial-weights contract and retain diagnostic tables and a graph map.

### Mistake: writing “spatial autocorrelation caused the gradient”

**Why beginners make it:** a significant pattern seems explanatory.  
**Recognition:** the statistic becomes a causal mechanism in the discussion.  
**Recovery:** state the observed arrangement and competing hypotheses. Test environmental explanations with appropriate design, models and independent evidence.

[[CHECK:m2-l31-cause]]

## 7. Guided practice — compare spatial hypotheses

1. Create `11_spatial_autocorrelation.ipynb` and state the question, population, plot support and synthetic-data status.
2. Load the README, manifest and plot table. Confirm unique `plot_id`, numeric coordinates, units, missing inclusion probabilities and QA statuses.
3. Map accepted and review observations with equal aspect. Label P024 and the roadside group P019–P022.
4. Build four-nearest-neighbour weights for accepted plots. Record minimum, median and maximum neighbour-link distance.
5. Build six-nearest-neighbour weights. State what additional relationship the larger *k* assumes.
6. Build a 170 m distance-band model. List islands rather than silently connecting them.
7. Row-standardise each weights object and record the transformation.
8. Calculate global Moran's I for accepted `ndvi_mean` with 999 permutations and a fixed seed under all three definitions.
9. Repeat the sensitivity analysis for `elevation_m`. Do not assume the two variables must have equal spatial structure.
10. Add the four roadside review observations in a clearly labelled secondary analysis. Explain how sampling design can affect the result.
11. Keep P024 outside the primary inference domain unless you can defend its relationship to the sampling frame. Show what a forced k-nearest connection would do.
12. Save `weights_sensitivity.csv` with variable, included rows, weights definition, transformation, islands, Moran's I, expected I, permutations and empirical probability.
13. Create one map of the selected neighbour graph and a second panel showing standardised plot values. Avoid a basemap that implies real geography.
14. Write a 180–250 word interpretation separating pattern, methodological sensitivity and possible ecological explanations.

## 8. Independent challenge — challenge your preferred weights

Choose the weights definition you would use for a first report. Then make the strongest scientific argument against your own choice. Consider the plot footprint, environmental continuity, access-route cluster, domain edge and isolated location. Propose one additional piece of field or process evidence that could improve the neighbour definition.

Run a leave-one-location sensitivity check: remove P023, then recalculate your selected global statistic. Report the change without labelling P023 an error. It may be an influential but legitimate edge observation.

### Scientific interpretation

Positive global Moran's I in this synthetic table would show that similar accepted values occur near one another more often than expected under the selected permutation model. It would support the statement that spatial independence is questionable for that variable and domain. It would justify spatially aware sampling, validation and residual checks in later work.

It would not demonstrate why the pattern exists. Elevation, vegetation state and management zone all vary across the synthetic core, while the sampling frame and access route shape observation placement. The weights definition may also strengthen or weaken the statistic. These are parts of the evidence, not inconveniences to hide.

If a statistic changes materially between four-nearest, six-nearest and distance-band weights, the correct result is not to select the most impressive value. The result is that inference is sensitive to the spatial relationship model and should be reported as such.

## 9. Reflection, submission and portfolio artifact

### Reflection

- What environmental process would make a distance band more credible than k-nearest neighbours?
- What does row standardisation change in the interpretation of neighbour influence?
- Why is a permutation probability conditional on the analysed locations and weights?
- When should an isolated observation be excluded from the inference domain, and what evidence must remain?

### Submission

Submit:

1. `spatial_autocorrelation_report.ipynb` with predictions recorded before outputs;
2. `weights_sensitivity.csv` containing every compared definition, including non-preferred results;
3. one neighbour-graph map showing edge observations, islands and link distances;
4. one screenshot showing the global statistic and permutation evidence for the selected model;
5. a 180–250 word scientific interpretation that does not claim cause;
6. a completed spatial-weights section from `SPATIAL_INFERENCE_QA_TEMPLATE.md`.

### Portfolio artifact

Add **spatial_autocorrelation_report.ipynb** to the UAV and Satellite Analysis Pipeline. A reviewer should be able to reconstruct who was included, what neighbourhood meant, how results changed under alternatives and why spatial dependence matters for the next sampling, interpolation and modelling decisions.
