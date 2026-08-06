# Module 1 Chapters 2–4 review

## Scope

This release completes Lessons 4–12 of **Thinking Like a Scientific Programmer** while preserving the existing Academy interface, progress, notes, submission, discussion and instructor-feedback components.

## Educational design

- One continuing scientific story and one growing `Vegetation_Data_Explorer.ipynb`
- Explicit learning outcomes, prerequisites, scientific motivation and remote-sensing relevance
- Predict–run–explain cycles, compact worked examples and line-level walkthroughs
- Three retryable formative checks per lesson
- Common mistakes explained through cause, recognition and recovery
- Guided practice followed by an independent, less-scaffolded task
- Scientific interpretation that separates computation, evidence and inference
- Submission checklist, four-part rubric and one portfolio artifact per lesson
- Complete claim–evidence capstone rather than a collection of disconnected exercises

## Verified dataset facts used in the lessons

Source: **Baltic coastal plant traits 2024 dataset**, Zenodo record `20083250`, CC BY 4.0.

- 120 quadrat rows and 25 fields
- Four site labels: Keemu, Koera, Kudani and Saardu
- Four community codes: LS, OP, TG and US
- No missing `Sp_richness` or `CCI_CWM` values
- 59 missing `AGB` and 59 missing `N_AGB_Sample` values
- Unequal site row counts are retained in the interpretation guidance
- The course does not invent plot coordinates, community-code expansions or undocumented measurement units

## Curriculum progression

- **Chapter 2 — Control and Reuse:** conditions, iteration, functions, errors and test-led debugging
- **Chapter 3 — Work with Scientific Tables:** NumPy, reproducible CSV loading, pandas structure, missingness and field-specific quality control
- **Chapter 4 — Analyse and Communicate:** explicit analysis populations, grouped summaries, validated joins, reshaping, scientific figures and the final portfolio project

## Quality evidence

- All Markdown Python blocks are no longer than 20 lines and compile successfully
- One explanatory SVG is present for each of the twelve lessons
- Lint passes
- TypeScript passes
- 84 unit and content tests pass
- 8 browser smoke tests pass
- Public and admin pages have no horizontal overflow at 320, 375, 768 and desktop widths
- Static production build passes

