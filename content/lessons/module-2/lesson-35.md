---
title: SQL for Geospatial Scientists
lessonId: lesson-2-35
---

## 1. Define an environmental population with a query

### Learning outcome

By the end of this lesson, you will be able to read and write a documented SQL query using `SELECT`, `FROM`, `WHERE`, `GROUP BY` and `JOIN`; explain how keys, join direction, cardinality and `NULL` affect the scientific population; validate a query with row-count and uniqueness evidence; and save an auditable analysis table without altering its authoritative sources.

- **Lesson type:** Relational evidence lab
- **Estimated time:** 170–210 minutes
- **Prerequisites:** Tables, identifiers, missing values, filtering, grouping and vector joins
- **Portfolio output:** `environmental_queries.sql`

### Why this matters

A Remote Sensing Scientist rarely works with one perfect table. Field measurements may contain repeated surveys, site metadata may arrive from another team, management zones may change on a different schedule and raster summaries may be produced by a processing pipeline. Copying all of those fields into one spreadsheet creates several competing versions of the same fact. A relational database stores connected subjects separately and combines them through explicit questions.

SQL—Structured Query Language—is the language used to state those questions. It can make the analysis population more visible than a sequence of manual filters: which survey dates are included, which quality status is accepted, how observations connect to plots and sites, and how many records contribute to each result. That visibility matters because a technically valid query can still answer the wrong scientific question.

The objective is not to memorise syntax. It is to translate an environmental question into a relational operation and then prove that the result retained the intended evidence.

### Scientific context

The Baltic coastal meadow group now has repeated synthetic observations for twelve plots. Site information, plot identity and survey measurements are stored in separate tables. The group asks:

> For accepted July observations, what is the number of observed plots and mean NDVI at each study site?

The training data are entirely synthetic. They continue the Academy story without representing the locations or measurements in the published Baltic dataset. One plot lacks a July observation, one biomass value is missing and review records remain visible. These conditions make query semantics scientifically meaningful.

## 2. One concept — a query declares a population

### Concept

The single idea in this lesson is that **a SQL query is a precise declaration of which records become evidence and how they are combined**.

A relational table describes one kind of entity or event:

- `meadow_sites` has one row per site;
- `field_plots` has one row per plot and a `site_id` that refers to its site;
- `plot_observations` has one row per plot and survey date;
- `management_zones` has one row per zone.

A **primary key** uniquely identifies a row in its own table. `plot_id` is the primary key of `field_plots`. A **foreign key** refers to a primary key in another table. `plot_observations.plot_id` is a foreign key linking an observation to its plot. These constraints do not prove that field measurements are correct, but they prevent several structural contradictions: duplicate observation identifiers and observations assigned to nonexistent plots.

### Visual explanation

```text
meadow_sites                         plot_observations
one row per site                     one row per plot-date
┌─────────┬───────────┐              ┌──────────────┬─────────┬────────────┐
│ site_id │ site_name │              │ observation  │ plot_id │ survey_date│
└────┬────┴───────────┘              └──────────────┴────┬────┴────────────┘
     │ one                                         many │
     │                                                │
     └──────────── field_plots ────────────────────────┘
                   one row per plot
                   ┌─────────┬─────────┬──────────┐
                   │ plot_id │ site_id │ geometry │
                   └─────────┴─────────┴──────────┘
```

The lines represent declared relationships, not physical distance. A site can have many plots; a plot can have many observations. Before joining, state the expected **cardinality**: one-to-one, one-to-many or many-to-many. If you expect one row per plot but join to repeated observations, duplication is not a software accident. It is the logical result of a one-to-many relationship.

[[CHECK:m2-l35-population]]

## 3. Read SQL as a scientific sentence

### `SELECT` — which variables or calculations should be returned?

`SELECT` names the result columns. Prefer explicit fields and meaningful aliases over `SELECT *`. Explicit selection documents the output contract and prevents a new source column from silently entering a published result.

### `FROM` — which relation begins the question?

`FROM` establishes the starting table or derived relation. This choice matters especially with outer joins. Starting from sites asks what is known for every site; starting from observations asks only about recorded observations unless another relation is brought in.

### `WHERE` — which rows belong to the analysis?

`WHERE` applies row-level conditions before grouped summaries. A filter such as `qa_status = 'accept'` must follow a documented QA policy. SQL makes the condition reproducible; it cannot decide whether that policy is scientifically sufficient.

SQL uses three-valued logic. A comparison with `NULL` is unknown, not true or false. Use `IS NULL` or `IS NOT NULL`; never `= NULL`. Missing biomass is not zero biomass and must not become zero merely to simplify aggregation.

### `GROUP BY` — at what unit should records be summarised?

`GROUP BY site_id` changes the unit of the output from observation to site. Every selected field that is not aggregated must identify a group. `COUNT(*)` counts rows, while `COUNT(biomass_g_m2)` counts only non-`NULL` biomass values. The difference is evidence about completeness.

### `JOIN` — how should subjects be connected?

An `INNER JOIN` retains only rows with a match on both sides. A `LEFT JOIN` retains every row from the left table and uses `NULL` where the right side has no match. Neither is universally correct.

If the question is “summarise plots with accepted July observations”, an inner join can be appropriate. If the question is “which registered plots lack an accepted July observation”, begin with plots and use a left join. Moving a filter on the right table from `ON` to `WHERE` can unintentionally turn a left join into an inner-like result because unmatched `NULL` rows fail the `WHERE` condition.

[[CHECK:m2-l35-join]]

## 4. SQL order and the order of reasoning

SQL is written approximately as `SELECT … FROM … JOIN … WHERE … GROUP BY … ORDER BY`. Its logical evaluation is easier to reason about as:

1. choose the source relations;
2. combine rows under the join condition;
3. filter the resulting rows;
4. form groups;
5. calculate selected output expressions;
6. order the presentation.

This explains why an alias created in `SELECT` is not normally available to `WHERE`: the filtering conceptually occurs earlier. A common table expression introduced with `WITH` can name an intermediate population and make a complex query reviewable. It is useful when the scientific inclusion rule deserves its own labelled step.

Queries should also distinguish **observations** from **distinct observational units**. `COUNT(*)` after joining observations to plots counts observation rows. `COUNT(DISTINCT p.plot_id)` counts represented plots. Both may be useful, but they are not interchangeable.

## 5. Worked example — accepted July observations by site

### Predict before running

The training pack contains four sites and twelve plots, but one plot has no July observation. Predict how many sites and plots the query will return. Will the missing biomass value affect `AVG(ndvi_mean)`? Would starting from sites with a left join produce the same population?

```sql
WITH accepted_july AS (
  SELECT plot_id, ndvi_mean
  FROM academy.plot_observations
  WHERE qa_status = 'accept'
    AND survey_date >= DATE '2026-07-01'
    AND survey_date < DATE '2026-08-01'
)
SELECT
  s.site_id,
  s.site_name,
  COUNT(*) AS n_observations,
  COUNT(DISTINCT p.plot_id) AS n_plots,
  ROUND(AVG(a.ndvi_mean)::numeric, 3) AS mean_ndvi
FROM accepted_july AS a
JOIN academy.field_plots AS p ON p.plot_id = a.plot_id
JOIN academy.meadow_sites AS s ON s.site_id = p.site_id
GROUP BY s.site_id, s.site_name
ORDER BY s.site_id;
```

### Code walkthrough

1. `WITH accepted_july AS` gives the analysis population a visible name.
2. The inner `SELECT` keeps only the join key and NDVI needed later.
3. `FROM academy.plot_observations` qualifies the table with its schema.
4. The QA filter excludes review observations under the stated primary rule.
5. A closed-open date interval includes July regardless of timestamp detail and avoids ambiguous month strings.
6. The outer `SELECT` begins after the complete population is defined.
7. Site ID is a stable key; site name is a readable label.
8. `COUNT(*)` states how many accepted observation rows contribute.
9. `COUNT(DISTINCT p.plot_id)` checks how many plots those rows represent.
10. `AVG` ignores `NULL`, although accepted July NDVI is complete in this example.
11. Rounding is applied only to the reported value, not the source data.
12. The first join connects each accepted observation to its registered plot.
13. The second connects plots to sites.
14. Both joins are inner joins because the question concerns represented accepted observations.
15. `GROUP BY` declares site as the output unit while retaining the readable label.
16. `ORDER BY` creates stable presentation order; row order is not otherwise guaranteed.

The result needs reconciliation. Sum `n_observations` and compare it with the row count of `accepted_july`. Confirm that `n_observations` equals `n_plots` only because this population contains at most one accepted July row per plot. The schema's `UNIQUE (plot_id, survey_date)` constraint helps enforce that statement.

## 6. Validate before interpreting

A query that executes successfully has passed syntax and database constraints, not scientific validation. Use a compact query contract:

| Question | Evidence |
| --- | --- |
| What is one output row? | stated grain: one row per represented site |
| Which source rows qualify? | explicit QA and date filters |
| Can a source row appear more than once? | key and cardinality checks |
| Which subjects can disappear? | join direction and unmatched-ID query |
| How are missing values handled? | `NULL` policy and paired counts |
| Do totals reconcile? | source, intermediate and output counts |

Check key uniqueness before joining, then inspect unmatched keys on both sides. A database foreign key can block orphan observations, but imported staging tables may not yet have constraints. Keep a staging layer, record rejected rows and promote data only after checks pass.

Use transactions when changing data: related changes should succeed together or roll back together. In this lesson you are querying, not updating. Read-only permissions are the safest default for analysis.

[[CHECK:m2-l35-null]]

## 7. Common mistakes and recovery

### Mistake: treating SQL as spreadsheet filtering with different punctuation

**Why beginners make it:** tables look visually similar.  
**Recognition:** keys, grain and cardinality are never stated.  
**Recovery:** write one sentence defining a row in every input and output before writing the join.

### Mistake: using `SELECT *` in a reusable analysis

**Why beginners make it:** it is quick during exploration.  
**Recognition:** output fields change when the source schema changes.  
**Recovery:** select and alias only the required columns; keep exploratory inspection separate from production queries.

### Mistake: filtering the right side of a left join in `WHERE`

**Why beginners make it:** the filter looks independent of the join.  
**Recognition:** plots with no observation disappear unexpectedly.  
**Recovery:** decide whether the filter defines eligible matches or the final population, place it accordingly and test unmatched identifiers.

### Mistake: converting `NULL` to zero without a measurement rule

**Why beginners make it:** arithmetic becomes easier.  
**Recognition:** mean biomass falls after missing records are filled.  
**Recovery:** preserve `NULL`, report the non-missing denominator and impute only through a documented scientific method.

### Mistake: trusting a familiar field name across tables

**Why beginners make it:** both tables contain `site_id` or `status`.  
**Recognition:** ambiguous columns or accidental equality conditions appear.  
**Recovery:** use table aliases, qualified fields and declared keys; verify the relationship in schema documentation.

### Mistake: summarising after a many-to-many join

**Why beginners make it:** duplicated rows remain visually plausible.  
**Recognition:** counts or totals multiply after the join.  
**Recovery:** test uniqueness on the intended key, aggregate at the correct stage or introduce a legitimate bridge table.

## 8. Guided practice — build an auditable query set

1. Create `15_spatial_database_sql.ipynb` and a separate `environmental_queries.sql` file.
2. Read the training-pack README and manifest. Record that the values and locations are synthetic.
3. Draw the four-table relationship diagram. State the primary and foreign keys and the expected cardinality of each link.
4. Inspect row counts and columns without modifying the supplied files.
5. Write one query that returns accepted observations with plot label, site name, date, NDVI and biomass.
6. Count total rows, distinct observation IDs and distinct plot IDs. Explain every difference.
7. Write an unmatched-key query for observations without plots and plots without observations. Preserve zero-result checks in the notebook.
8. Compare `COUNT(*)`, `COUNT(biomass_g_m2)` and `COUNT(DISTINCT plot_id)` by survey date.
9. Build an accepted-observation summary by site and date with mean NDVI, mean biomass and non-missing biomass count.
10. Write a left-join query beginning with all twelve plots. Keep plots without accepted July observations and label their observation status rather than deleting them.
11. Move the accepted-July filter between `ON` and `WHERE`; predict and explain the changed result.
12. Test key uniqueness in every table and the declared `(plot_id, survey_date)` combination.
13. Reconcile summary counts to the accepted source rows.
14. Save a Markdown query contract containing grain, population, keys, join type, missing-value rule and expected row count.
15. Export only the final derived table, never a modified copy of an authoritative source.

## 9. Independent challenge — answer a defensible monitoring question

Answer:

> Which synthetic sites have at least two accepted July plots, and what are their mean NDVI and mean recorded biomass?

Use a named intermediate population, explicit joins, `GROUP BY` and a group-level condition. Keep `n_plots`, `n_biomass_values` and `n_observations` separate. Add a second query that lists sites excluded because they lack enough accepted July evidence. Your report must show that an omitted site is not necessarily a low-NDVI site; it may simply lack eligible observations.

Do not infer temporal change from two rounds without pairing rules, uncertainty and repeated-measure reasoning. This challenge evaluates relational population definition, not ecological trend estimation.

### Scientific interpretation

The grouped result describes accepted synthetic observations represented in the database under one date and QA rule. It does not describe every registered plot, every possible meadow location or the published Baltic dataset. Mean NDVI is conditional on the represented plots, spatial support, acquisition conditions and quality decisions.

Relational structure improves traceability because site attributes, plot identity and repeated measurements have distinct owners and update rules. It also creates responsibilities: keys must be stable, joins must match their cardinality and missingness must remain visible. The scientific claim is bounded by the query population, not by the number of records stored in the database.

## 10. Reflection, submission and portfolio artifact

### Reflection

- How does the left table express the population you intend to preserve?
- Why are row count and distinct plot count different scientific quantities?
- When would an inner join be more defensible than a left join?
- What would you need before comparing June and July as ecological change?

### Submission

Submit:

1. `environmental_queries.sql` with population, join, aggregation and validation queries;
2. the relationship diagram and query contract;
3. a CSV result with explicit grain and non-missing denominators;
4. a validation table containing source, intermediate, matched, unmatched and output counts;
5. one screenshot showing the query beside its result;
6. a 200–300 word scientific interpretation with population and missingness limits;
7. the completed relational sections of `SPATIAL_DATABASE_QA_TEMPLATE.md`.

### Portfolio artifact

Add `environmental_queries.sql` to the **UAV and Satellite Analysis Pipeline** as the first component of a reusable **Spatial Database Query Pack**. Include a short README stating the question, table grain, keys, filters, output grain, expected counts and safe execution context. A reviewer should be able to determine exactly which evidence entered the result before reading the numerical conclusion.

