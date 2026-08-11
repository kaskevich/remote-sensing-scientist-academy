---
title: Spatial Sampling and Bias
lessonId: lesson-2-32
---

## 1. Design what the evidence can represent

### Learning outcome

By the end of this lesson, you will be able to define a spatial target population and sampling frame; distinguish simple random, systematic, stratified and clustered designs; explain inclusion probability and unequal-probability consequences; diagnose accessibility, edge and convenience-sampling bias; and propose a reproducible supplementary field design aligned with an Earth Observation question.

- **Lesson type:** Spatial sampling-design studio
- **Estimated time:** 170–210 minutes
- **Prerequisites:** Spatial support, vector QA, plot–zone relationships and Lesson 2.31
- **Portfolio output:** `spatial_sampling_design.ipynb`

### Why this matters

Remote sensing supplies continuous-looking coverage, but ecological calibration and validation still depend on observations collected at particular places. Where those places are chosen determines which landscape, gradients and classes the evidence can represent.

A large field table is not automatically representative. Fifty plots beside a road may provide precise information about accessible road-edge conditions and weak evidence about wet interior meadow. Adding more roadside plots narrows sampling variability around the wrong population; it does not remove selection bias. A beautiful prediction map trained on that sample can extend confidence far beyond observed environmental conditions.

Professional spatial analysis therefore begins with the selection mechanism. Before fitting an interpolation or model, ask: which locations could have been selected, with what probability, and which locations were excluded by design or field reality?

### Scientific context

The synthetic coastal-meadow pack contains 18 accepted probability-based core plots, four roadside convenience observations, one accepted western edge observation and one isolated targeted plot. The separate sampling frame contains accessible and inaccessible candidate cells across low-, mid- and high-marsh strata.

The team wants a supplementary survey that improves representation of habitat strata and reduces uncertainty away from the access route. Your task is not to generate attractive random points. It is to define the population, preserve non-selection evidence and make the implemented field design traceable when access restrictions force changes.

## 2. A sampling design is an inclusion mechanism

### Concept

The single idea in this lesson is that **a spatial sample has meaning through the mechanism that allowed locations to enter the evidence**.

Start with four separate objects:

1. **Target population:** the places, times and observation units about which you want to make an inference
2. **Sampling frame:** the operational set of units from which a sample can be selected
3. **Selection design:** the rule and probabilities used to select units
4. **Realised sample:** the locations actually observed after non-response, access and field changes

These are rarely identical. A target population may be all meadow habitat in a management area. The frame may omit dangerous tidal channels or land without permission. The realised sample may lose additional plots because of flooding. Each difference restricts inference and must be visible.

### Visual explanation

| Layer | Question | Failure if undocumented |
| --- | --- | --- |
| Target domain | Where should the result apply? | a local sample is described as regional evidence |
| Frame | Which units could be selected? | gaps and ineligible areas disappear from the record |
| Design | How was selection randomised or structured? | inclusion probability cannot be reconstructed |
| Field response | Which selected units were measured? | non-response becomes silent convenience sampling |
| Analysis set | Which observations passed QA? | exclusions change the represented population invisibly |

The frame is part of the data. Preserve all candidate units and their eligibility rather than storing only successful visits.

## 3. Four designs answer different needs

### Simple random sampling

Every eligible frame unit has a known, often equal chance of selection. Randomisation supports design-based inference and protects against deliberate placement. However, a small simple random sample can leave geographic gaps or miss rare habitats by chance.

### Systematic spatial sampling

A random start is followed by a regular spatial pattern. This usually spreads observations well and can be efficient for mapping gradual variation. It can interact badly with a periodic landscape pattern, and field replacement rules must preserve the design rather than shift every inconvenient point toward an access path.

### Stratified random sampling

The frame is divided into meaningful, non-overlapping strata, then locations are selected randomly within each. Stratification can guarantee evidence from rare habitats or environmental ranges. If sampling fractions differ, naive unweighted summaries may not estimate the population composition. Strata must be defined from information available before outcome measurement, not invented after seeing the desired result.

### Cluster sampling

Groups of nearby units are selected, often to reduce travel cost. The design can be operationally efficient but may contain less independent information than the same number of dispersed plots. Multi-stage cluster designs require analysis that respects selection stages and within-cluster similarity.

No design is universally best. The correct design follows the estimand, spatial process, field costs, required domains and analysis plan.

[[CHECK:m2-l32-design]]

## 4. Inclusion probability and weighting

An inclusion probability is the probability that a frame unit enters the sample under the documented design. Its inverse can contribute to a design weight: a unit with probability 0.25 represents more frame units than one with probability 0.50 under a suitable design-based estimator.

This does not mean every analysis should mechanically use `1 / probability`. Multi-stage selection, non-response adjustment, calibration and finite-population details matter. The essential beginner principle is simpler: unequal selection probabilities change what an unweighted mean represents.

Convenience and targeted observations can still be scientifically valuable. They may document a rare condition, test a mechanism or expose a failure. But if their probability of selection is unknown, they cannot silently enter a probability-sample estimator as though they were randomly selected. Keep them in a labelled evidence stream and state which interpretations they support.

### Accessibility is not a harmless filter

Accessibility often correlates with the environment. Roads follow drier ground; waterways provide access to wet margins; protected zones may contain different vegetation. Removing inaccessible units changes the frame. The resulting estimate may remain valid for the accessible frame while failing to represent the full target domain.

A professional report distinguishes:

- **ineligible by scientific definition** from **unavailable in practice**;
- **selected but not observed** from **never eligible for selection**;
- **planned replacement** from **field-worker convenience relocation**;
- **population inference** from **model-based extrapolation beyond sampled conditions**.

[[CHECK:m2-l32-access]]

## 5. Spatial balance, edges and support

Spatial balance means distributing sample locations across the domain rather than allowing accidental concentration. It is not the same as equal spacing in every design. A stratified sample can balance habitat evidence while using different densities, and an adaptive design can intentionally add observations where uncertainty is high.

Edge effects appear in both measurement and analysis. A plot near a habitat boundary can contain mixed support. A circular field plot may extend beyond the mapped polygon used as its sampling unit. A remote-sensing pixel and a quadrat may overlap only partially. Record the actual field support and boundary rule; do not move points inward solely to make extraction easier.

Sampling design also sets the limit for spatial validation. Randomly splitting neighbouring observations can place almost identical environments in training and test sets. Later predictive work should reserve separated blocks or entire sites so evaluation represents transfer to new geography.

## 6. Worked example — create a reproducible stratified proposal

### Predict before running

Open `sampling_frame.csv`. Three strata have different declared selection probabilities, and several high-marsh cells are inaccessible. Before running the code, predict which strata will appear in the six-location proposal. Will the same rows be selected every time?

```python
import pandas as pd

frame = pd.read_csv("inputs/spatial-statistics/sampling_frame.csv")
eligible = frame.loc[frame["accessible"] & ~frame["existing_selected"]].copy()
proposal = (
    eligible.groupby("habitat_stratum", group_keys=False)
    .sample(n=2, random_state=731)
    .sort_values(["habitat_stratum", "candidate_id"])
)
proposal["design"] = "stratified random supplementary sample"
print(proposal[["candidate_id", "habitat_stratum", "x_m", "y_m"]]
      .to_string(index=False))
print("eligible frame", len(eligible), "proposed", len(proposal))
```

### Code walkthrough

1. `pandas` reads the rectangular sampling frame and preserves every candidate row.
2. `accessible` restricts the operational frame according to documented field feasibility.
3. `~existing_selected` removes units already sampled; the tilde means logical “not”.
4. `.copy()` creates a proposal workspace without altering the frame.
5. `groupby("habitat_stratum")` separates the eligible frame into the three predeclared habitats.
6. `group_keys=False` prevents the group label from becoming an extra index level.
7. `.sample(n=2, random_state=731)` selects two units randomly inside every stratum and makes the exercise reproducible.
8. Sorting produces a reviewable order; it does not change which units were selected.
9. The `design` field stores the selection mechanism beside each proposed row.
10. The first print shows identifiers, strata and coordinates needed for a field plan.
11. The second print compares the eligible-frame size with the proposed sample size.

This example guarantees equal sample counts per habitat, not proportional representation. If strata occupy different shares of the target domain, a simple mean of the six observations would overrepresent smaller strata. The design record must therefore preserve selection probabilities or enough frame counts to calculate them.

## 7. Common mistakes and recovery

### Mistake: calling a convenience sample random

**Why beginners make it:** locations were not deliberately chosen for their measured values.  
**Recognition:** sites are all near roads, but no frame, random seed or inclusion rule exists.  
**Recovery:** label the realised mechanism honestly. Use the observations for bounded purposes and design a probability-based supplement.

### Mistake: deleting inaccessible frame units

**Why beginners make it:** they cannot be visited and appear irrelevant.  
**Recognition:** the final frame contains no record of restricted areas.  
**Recovery:** retain them with eligibility and restriction reasons. State whether inference targets the full domain or only the operational frame.

### Mistake: moving a selected point without a rule

**Why beginners make it:** a nearby accessible location seems equivalent.  
**Recognition:** realised coordinates differ from planned coordinates and no replacement ID exists.  
**Recovery:** predefine replacement, alternate-selection or non-response procedures. Preserve both planned and realised locations.

### Mistake: treating equal stratum counts as equal population shares

**Why beginners make it:** the table contains the same number of rows per group.  
**Recognition:** an unweighted mean is presented as a domain mean although sampling fractions differ.  
**Recovery:** define the estimand and use a design-aware estimator or report stratum-specific results.

### Mistake: using the target variable to create strata after collection

**Why beginners make it:** it produces balanced-looking outcome groups.  
**Recognition:** strata depend on measured biomass that was unavailable when sites were selected.  
**Recovery:** use pre-observation auxiliary information such as mapped habitat, elevation class or management zone, and record its date and accuracy.

[[CHECK:m2-l32-large]]

## 8. Guided practice — audit and improve the meadow design

1. Create `12_spatial_sampling.ipynb` and define the target population, observation unit, time and estimand in plain language.
2. Read the training-pack README and state that the coordinates and values are synthetic.
3. Load all three CSV files. Verify unique IDs and a one-to-one join between plot observations and validation blocks.
4. Separate probability, roadside and targeted observations. Count rows by habitat, management zone and route.
5. Map `distance_to_access_m` and sampling route. Describe the roadside cluster without treating distance as proof of bias.
6. Summarise missing `inclusion_probability` by route. Explain why those rows cannot enter a design-weighted domain mean without additional evidence.
7. Compare habitat composition in the accessible sampling frame, the accepted probability sample and all observed rows.
8. Calculate nearest-neighbour distances for each route. Report the distribution rather than only the mean.
9. Identify inaccessible cells and group their restriction reasons. State which environmental strata lose frame coverage.
10. Generate a six-location stratified random supplement using a fixed seed. Preserve non-selected eligible rows.
11. Generate a second design using a random start and systematic selection across ordered x/y frame positions. State the pattern risk.
12. Compare the two proposals for habitat coverage, geographic spread, distance from access and field feasibility.
13. Write a predeclared replacement rule that does not allow field staff to choose the easiest nearby cell.
14. Assign future validation blocks before any model is fitted. Ensure each block represents a coherent separated region.
15. Save `sampling_design_audit.csv` with frame status, route, inclusion evidence, restriction, selected proposal and decision reason.

## 9. Independent challenge — defend the population, not the map

Choose one primary estimand:

- mean accepted NDVI across the accessible frame during the represented acquisition period; or
- habitat-stratum differences in field biomass across the target meadow domain.

Write a 250-word design note explaining which existing observations can support it, what remains unrepresented, which supplementary design you recommend and how unequal selection or non-response will be handled. Include one operational trade-off you accept and one inference you refuse to make.

Then create a small sensitivity table comparing the habitat distribution of:

1. accepted probability rows only;
2. accepted plus roadside review rows;
3. the accessible sampling frame;
4. your proposed realised sample after one hypothetical inaccessible selection.

### Scientific interpretation

The training pack is designed so access and environmental gradient are partly aligned. The roadside group contains relatively high NDVI and biomass values, while inaccessible cells are concentrated toward one edge. If all observed rows are averaged without design information, the result mixes a probability sample with convenience and targeted evidence.

The strongest conclusion is not that roadside sampling always overestimates vegetation condition. In this synthetic instance, location mechanism and values are associated. A comparable real study would need a documented frame, inclusion probabilities, non-response record and independent assessment of environmental coverage.

Stratification can ensure that low-, mid- and high-marsh conditions enter the sample. It does not by itself make estimates unbiased. Selection within strata, frame coverage, response and weighting still matter. Spatial balance can improve coverage, but the design remains conditional on the declared domain and observation support.

## 10. Reflection, submission and portfolio artifact

### Reflection

- What is the difference between the ecological target domain and the accessible sampling frame?
- Why can more observations make an estimate more precise without making it more representative?
- Which information must exist before inverse-probability weighting is meaningful?
- How would a field replacement rule affect reproducibility and inference?

### Submission

Submit:

1. `spatial_sampling_design.ipynb` with the complete frame and realised-sample audit;
2. `sampling_design_audit.csv` preserving eligible, inaccessible, selected, rejected and review units;
3. one map comparing existing observations with your two supplementary proposals;
4. one screenshot of habitat and route coverage summaries;
5. the 250-word design note naming the estimand and limits;
6. a field replacement and non-response protocol;
7. the completed source-and-design section of `SPATIAL_INFERENCE_QA_TEMPLATE.md`.

### Portfolio artifact

Add **spatial_sampling_design.ipynb** to the UAV and Satellite Analysis Pipeline. A reviewer should see which population the evidence represents, how locations entered the sample, how access altered the frame and how the next survey will improve spatial coverage without concealing compromise.
