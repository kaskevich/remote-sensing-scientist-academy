---
title: Collections for Ecological Information
lessonId: lesson-03
---

## 1. From separate values to ecological records

### Learning outcome

By the end of this lesson, you can create, index and update a species list; create a dictionary for one vegetation plot; access and update dictionary values; explain a coordinate-order tuple; and recognise when a set is useful for unique labels.

**Prerequisite:** Open the same `Vegetation_Data_Explorer.ipynb` and run Lessons 1–2 successfully.

### Why this matters

One vegetation plot contains related information. A field note may contain several species names. A published table row connects field names such as `SampleID`, `site` and `Sp_richness` to values. Remote sensing work uses the same relationships for band names, acquisition metadata, quality labels and model outputs.

A **collection** is one Python value that organises several related values. In this lesson, lists and dictionaries do the main work. Tuples and sets appear only where their specific behaviour is useful.

![A comparison of an ordered species list, a fixed coordinate-order tuple, a set of unique field labels and a dictionary of plot metadata.](lesson-media/images/ecological-collections.svg)

Use the diagram as a decision guide: editable sequence suggests a list; named fields suggest a dictionary; a small fixed convention suggests a tuple; unique membership suggests a set.

> **Scientific note** The published Baltic coastal plant traits table reports plot-level fields but does not provide the species identities or plot coordinates used in today's small teaching examples. Instructional values are labelled as such and must not be presented as published observations.

### Learner action

In Markdown, describe one ecological situation where the order of observations matters and one where named fields matter more than position.

## 2. Lists preserve an editable sequence

A **list** uses square brackets. It preserves order, can contain repeated values and can be changed. Python positions begin at zero, so index `0` retrieves the first item.

The following species names form a simplified instructional field note within the Baltic coastal meadow story. They are not species identities from the published trait table.

```python
observed_species = [
    "Juncus gerardii",
    "Festuca rubra",
    "Plantago maritima",
]

print(observed_species[0])
print(observed_species[1])
```

### Predict before running

Predict which name index `0` retrieves and which name index `1` retrieves. Run the cell and compare.

### Code walkthrough

1. `observed_species = [` begins an ordered list.
2. Each quoted species name is one string item; commas separate items.
3. `]` closes the list.
4. `observed_species[0]` retrieves the first item.
5. `observed_species[1]` retrieves the second item.

### Learner action

Add `"Triglochin maritima"` with `observed_species.append("Triglochin maritima")`. Then correct the second item with `observed_species[1] = "Festuca rubra"` and print the complete list. Explain why a list fits an editable field-note sequence.

[[CHECK:l3-list]]

## 3. Dictionaries connect field names to values

A **dictionary** stores `key: value` pairs inside braces. A key is an exact label used to retrieve its value. This makes a dictionary a useful small model of one table row.

```python
plot_record = {
    "SampleID": "SALS1",
    "site": "Saardu",
    "plantcommunity": "LS",
    "Sp_richness": 7,
}

print(plot_record["SampleID"])
print(plot_record["site"])
```

The dictionary uses values already verified from the published SALS1 row. It preserves the published key spelling without expanding the undocumented `LS` code.

### Predict before running

Predict the two outputs. Would `plot_record["Site"]` work? Run the valid cell first. Python keys are case-sensitive, so `"Site"` and `"site"` are different strings.

### Access and update

Retrieve species richness with:

```python
print(plot_record["Sp_richness"])
```

To practise an update without changing the published record, create a separate instructional copy by typing the dictionary again as `practice_plot`. Then run:

```python
practice_plot["reviewed"] = True
print(practice_plot["reviewed"])
```

The new `reviewed` key belongs only to your instructional record. It is not a field from the published table.

### Learner action

Create `practice_plot`, retrieve its site by key and add the instructional `reviewed` value. Add a Markdown note distinguishing the published keys from your notebook-only key.

[[CHECK:l3-dictionary]]

## 4. Tuples and sets have supporting roles

### Tuple: a small fixed order

A **tuple** uses parentheses and preserves order but cannot be changed in place. It can document a small convention that should remain stable:

```python
coordinate_order = ("latitude", "longitude")
print(coordinate_order)
```

This tuple records only the order of two labels. It does not contain plot coordinates and does not claim that coordinates are supplied by the published table. A real coordinate record would also need a documented coordinate reference system.

### Set: unique membership without sequence

A **set** keeps unique values when order does not carry meaning:

```python
requested_fields = {"SampleID", "site", "site", "Sp_richness"}
print(requested_fields)
```

The repeated `"site"` becomes one member. The printed order is not a scientific sequence. Use a list if observation order or duplicates matter.

> **Go deeper — why not use tuples and sets everywhere?** Immutability and uniqueness are useful, but they add no benefit when you need an editable sequence or named fields. At this stage, choose them only when their specific behaviour communicates the relationship.

### Learner action

Run both examples. Explain why the tuple is not a location and why the set is unsuitable for the order in which species were observed.

[[CHECK:l3-supporting-structures]]

## 5. Common mistakes and recovery

### Starting list positions at one

**Why it happens:** Everyday counting usually begins at one.

**How to recognise it:** `observed_species[1]` returns the second item. An index beyond the final item raises `IndexError`.

**How to fix it:** While learning, annotate positions explicitly: first → `0`, second → `1`, third → `2`.

### Misspelling a dictionary key

**Why it happens:** Human readers treat `site` and `Site` as nearly identical.

**How to recognise it:** Python reports `KeyError` even when a similar key is visible.

**How to fix it:** Copy the documented key exactly and compare capitalization and underscores.

### Expecting a set to preserve order

**Why it happens:** A printed set appears in some order on screen.

**How to recognise it:** The order may differ while membership remains the same.

**How to fix it:** Use sets only for uniqueness or membership questions.

### Inventing missing record fields

**Why it happens:** A realistic plot record feels incomplete without management or coordinates.

**How to recognise it:** A value cannot be traced to the dataset documentation or is based on a guess.

**How to fix it:** Omit the field or mark it explicitly as unavailable. Never make a record look complete by fabricating evidence.

### Learner action

Deliberately request `plot_record["Site"]`, read the `KeyError`, then correct only the capitalization and rerun.

## 6. Guided practice

Build two simple structures without nesting them.

1. Create `indicator_species` as an instructional list containing `"Juncus gerardii"` and `"Festuca rubra"`.
2. Predict and print its first item.
3. Append `"Plantago maritima"` and print the updated list.
4. Create `practice_plot` with the published SALS2 values `SampleID` `SALS2`, site `Saardu`, community code `LS` and species richness `6`.
5. Retrieve the site and richness by their exact dictionary keys.
6. Add an instructional Boolean key named `reviewed_in_notebook` and set it to `True`.
7. Explain in Markdown why the species list is instructional and which dictionary fields come from the published row.

### Scientific interpretation

The list preserves an editable teaching sequence. The dictionary connects named fields to values for one plot. Neither structure proves that the values are complete, valid or representative of the wider site. Structure makes relationships explicit; scientific provenance determines what claims are defensible.

### Learner action

Run the guided practice from top to bottom and check every retrieved value against the cell where it was created.

## 7. Independent plot-record task

Create one compact record for published plot `SALS2`.

Your work must include:

- `SampleID`: `SALS2`;
- `site`: `Saardu`;
- `plantcommunity`: `LS`;
- an instructional species list clearly labelled as not sourced from the published trait table;
- trait values containing the published `Sp_richness` value `6` and `CCI_CWM` value `96.5`;
- no management label, because no verified management field is being taught here;
- no coordinates, because plot coordinates are not supplied in the published table used for these lessons.

You may use one shallow dictionary inside the plot record for the two trait values. Avoid deeper nesting.

```python
plot_record = {
    "SampleID": "SALS2",
    "site": "Saardu",
    "plantcommunity": "LS",
    "species_practice": ["Juncus gerardii", "Festuca rubra"],
    "trait_values": {"Sp_richness": 6, "CCI_CWM": 96.5},
}
```

Add code that:

1. retrieves the first practice species;
2. retrieves `site`;
3. retrieves `Sp_richness`;
4. updates only the instructional species list;
5. prints the updated list.

Write a concise explanation of why you used a list for species and dictionaries for named plot and trait fields. State the provenance limitation clearly.

### Learner action

Complete the task independently, then use the submission checklist to upload the continuing notebook, one screenshot and your collection-choice explanation.

## 8. Reflection and portfolio artifact

Write short answers in your private notes:

1. Why does a species sequence fit a list?
2. What meaning is protected by retrieving `plot_record["site"]` rather than position `1`?
3. When is a tuple useful at this stage?
4. When is a set useful, and what information does it discard?
5. Which fields in your independent record are published and which are instructional?

### Portfolio artifact

**Artifact 03 — Vegetation plot record**

Your `Vegetation_Data_Explorer.ipynb` now contains an editable species list, a named plot dictionary, precise access and update operations, and a documented distinction between published and instructional values.
