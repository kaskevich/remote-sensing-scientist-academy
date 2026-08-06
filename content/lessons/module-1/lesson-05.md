---
title: Repetition, Loops and Vectorised Thinking
lessonId: lesson-05
---

## 1. Apply one transparent method to several plots

### Learning outcome

By the end of this lesson, you will be able to use a `for` loop to apply the same documented operation to several vegetation records, trace the loop one iteration at a time, and calculate a simple summary without copying code. You will also recognise when later array-based tools can replace a manual loop.

**Prerequisites:** Complete Lessons 1–4. You should be able to use lists, dictionaries, comparisons and `if` statements. Allow 75–90 minutes.

### Why this matters

A remote sensing scene may contain millions of pixels; a field campaign may contain hundreds of plots. Copying the same instruction for every observation is slow and creates opportunities for inconsistent edits. Repetition should be expressed once and applied systematically.

Loops are valuable even when a library could perform the final calculation more efficiently. A loop exposes the logic: select a record, apply the rule, update a result, continue. Understanding that sequence makes later NumPy and pandas operations easier to trust and debug.

### Scientific context

You will work with the first three published Saardu records: `SALS1`, `SALS2` and `SALS3`, whose `Sp_richness` values are 7, 6 and 5. The example is deliberately small enough to check by hand. This is a verification habit, not a toy exercise.

> **Core idea:** a loop repeats the same method for each item in a collection; the method stays constant even though the current item changes.

### Learner action

Add `## Lesson 5 — Repetition and loops` to your notebook. Under it, describe one repeated step from an ecological survey or GIS workflow and one risk created by performing it manually.

## 2. Read a `for` loop as a scientific sentence

```python
plot_ids = ["SALS1", "SALS2", "SALS3"]

for plot_id in plot_ids:
    print("Reviewing", plot_id)
```

Read the loop aloud: “For each `plot_id` in `plot_ids`, print a review message.” Python takes the first item, runs the indented block, returns for the second item, and stops only after the collection is exhausted.

The name `plot_id` is a temporary loop variable. It refers to a different list item during each iteration. The original list remains available after the loop.

### Predict before running

Predict how many output lines will appear and which identifier appears on the second line. Then run the cell and compare the actual order with the list order.

### Code walkthrough

1. The list contains three strings in a meaningful sequence.
2. `for` starts the repetition instruction.
3. `plot_id` names the current item.
4. `in plot_ids` identifies the collection to traverse.
5. The colon opens the loop block.
6. Four spaces indent the instruction repeated for every item.

[[CHECK:l5-trace]]

## 3. Keep each record together while you iterate

A list of dictionaries preserves both sequence and named fields. Each iteration can therefore process one coherent plot record rather than several disconnected lists.

### Worked example

Type the example, but calculate the expected total and mean by hand before running it:

```python
plots = [
    {"SampleID": "SALS1", "Sp_richness": 7},
    {"SampleID": "SALS2", "Sp_richness": 6},
    {"SampleID": "SALS3", "Sp_richness": 5},
]

richness_total = 0
for plot in plots:
    richness = plot["Sp_richness"]
    richness_total = richness_total + richness
    print(plot["SampleID"], richness, richness_total)

mean_richness = richness_total / len(plots)
print("Mean richness:", mean_richness)
```

The expected output is:

```text
SALS1 7 7
SALS2 6 13
SALS3 5 18
Mean richness: 6.0
```

### Code walkthrough

1. `plots` contains three related records in published order.
2. `richness_total = 0` creates an **accumulator** before the loop. Zero is an appropriate starting value for addition; it is not a missing measurement here.
3. `for plot in plots:` assigns one dictionary at a time to `plot`.
4. Dictionary access retrieves the current richness value.
5. `richness_total = richness_total + richness` replaces the running total with its previous value plus the current value.
6. The first `print` exposes the loop state. This trace is useful while learning and debugging.
7. `len(plots)` returns the number of records.
8. The mean is calculated after the loop, once the total is complete.

[[CHECK:l5-accumulator]]

## 4. Separate iteration from scientific interpretation

![Diagram comparing a loop that visits one plot at a time with an array operation that treats a complete richness column as one numerical object.](lesson-media/images/loop-vector-thinking.svg)

The loop answers a computational question: how can the same addition be applied to every current record? The resulting mean answers a descriptive question for these three plots only. It does not establish a regional pattern or a causal explanation.

The calculated value is easy to verify manually: `(7 + 6 + 5) / 3 = 6`. Use small known examples to test logic before scaling up. If code disagrees with the hand calculation, investigate before adding more data.

[[CHECK:l5-interpretation]]

## 5. From loops to vectorised thinking

**Vectorised thinking** means identifying the complete set of comparable values and expressing one operation over that set. In Lesson 7, a NumPy array will allow you to write a mean operation directly on the richness values. In Lesson 10, pandas will group many rows and summarise each group.

This does not make loops obsolete:

- loops are clear for record-specific actions, file-by-file processing and custom reporting;
- vectorised operations are usually clearer and faster for numerical transformations across a whole array or table column;
- both require the same scientific decisions about inclusion, units, missingness and interpretation.

Choose the expression that makes the method easiest to verify. Speed is not the only criterion.

## 6. Common mistakes and recovery

### Placing the accumulator inside the loop

**Recognition:** the total resets for every plot and the final value equals only the last richness. **Fix:** create the accumulator once, before the loop.

### Forgetting indentation

**Recognition:** Python reports an indentation error, or only part of the intended method repeats. **Fix:** align all instructions that belong to the loop with four spaces.

### Overwriting instead of accumulating

**Recognition:** `richness_total = richness` discards the previous total. **Fix:** include the previous accumulator value in the update.

### Dividing inside the loop

**Recognition:** several partial means are produced, or the accumulator is changed before all records are counted. **Fix:** finish collecting the total, then calculate the mean after the loop.

### Iterating over the wrong object

**Recognition:** looping directly over a dictionary produces its keys, such as `SampleID`, rather than complete records. **Fix:** inspect the structure and say aloud what one iteration should represent.

### Ignoring missing values

**Recognition:** addition fails when a value is `None`, or missingness is silently replaced by zero. **Fix:** define and document a missing-value policy before calculating. Lesson 9 will apply this systematically to the full table.

## 7. Guided practice — trace a new sequence

Use published plots `SALS4`, `SALS5` and `SALS6`, whose `Sp_richness` values are 7, 7 and 3.

1. Create a list of three dictionaries.
2. Predict the running total after each iteration.
3. Use a loop to print plot ID, current richness and running total.
4. Calculate the mean after the loop.
5. Verify the result by hand.
6. Add a condition inside the loop that prints `review` when richness is below the instructional threshold 6 and `retain` otherwise.
7. In Markdown, explain why the loop makes the rule consistent but does not validate the threshold.

Run the complete notebook from the beginning. Confirm that the new loop uses data created in its own section and does not depend on a hidden cell execution order.

## 8. Independent challenge, reflection and portfolio artifact

Create records for `SALS1` through `SALS6` using their published `Sp_richness` values: 7, 6, 5, 7, 7 and 3.

- Count how many plots fall below the instructional threshold 6.
- Track their IDs in a list named `review_ids`.
- Calculate the mean richness for all six plots.
- Print a concise audit summary.
- Predict all final values before running.

### Scientific interpretation

The count tells you how many of these six records meet a programming rule. The mean describes only this selected sequence. Neither result explains the ecological processes behind species richness, and neither should be generalised to all four study sites.

Answer in your private notes:

1. What changes during each iteration, and what stays constant?
2. Why must an accumulator be created before the loop?
3. When would a loop communicate a method more clearly than a vectorised expression?
4. What missing-value decision would be required before adding biomass values?

### Submission

- **Notebook:** the continuing notebook with the worked example, trace output, guided practice and independent six-plot challenge.
- **Screenshot:** the final audit summary and the code that produced it.
- **Written answer:** 180–250 words explaining iteration, accumulation, verification by hand and the limits of the resulting mean.

### Portfolio artifact

**Artifact 05 — Repeatable plot-processing workflow**

This checkpoint demonstrates that you can apply one documented method consistently across several ecological records and verify the result before scaling up.
