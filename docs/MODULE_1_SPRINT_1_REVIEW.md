# Module 1 Sprint 1 pedagogical review

Review date: 6 August 2026

Branch: `codex/module1-pedagogical-review`

## What changed

- Added a complete Module 1 overview with purpose, prerequisites, nine outcomes, the Vegetation Data Explorer final project and all twelve lessons grouped into four chapters.
- Kept Lessons 1–3 as the only available lesson pages. Lessons 4–12 are labelled planned syllabus and have no completion controls or empty pages.
- Revised Lesson 1 into seven short, action-led blocks for a 60–75 minute beginner session. Environment management, extensive reproducibility theory and detailed notebook state are no longer core Lesson 1 content.
- Revised Lesson 2 around one concept: variables and basic scientific values. It now introduces assignment, `str`, `int`, `float`, `bool`, `None`, `type()`, cautious conversion, naming and unit metadata from first principles.
- Revised Lesson 3 to prioritise lists and dictionaries. Tuples and sets now have brief supporting roles, and the independent record omits undocumented management and coordinate values.
- Added three retryable formative checks to each lesson. Feedback explains the reasoning, does not affect lesson completion and uses native keyboard-accessible controls.
- Added a valid starter notebook at `public/lesson-resources/module-1/Vegetation_Data_Explorer_Starter.ipynb` with predictions, prepared cells, reflection and a submission checklist.
- Added internal lesson contents, estimated time, position, check completion, previous/next navigation, submission checklists, four-dimension rubrics, review-status labels and technical/source metadata.
- Added restrained Core lesson, Scientific note and Go deeper content layers while retaining the three explanatory SVGs.
- Preserved learner progress, private notes, local and synchronized submissions, uploads, private comments, instructor feedback and shared discussions.
- Added automated curriculum, notebook, code-syntax, review-label, formative-check, mobile and persistence coverage.
- Added the reviewed Markdown files to Pages CMS as a dedicated, ordered Module 1 lesson collection so edits continue to publish from the admin interface.

## Four-role review

### Scientific reviewer

- Kept the established Baltic coastal meadow story and the verified SALS1, SALS2 and SALS3 values already used in the Academy.
- Preserved published field names and neutral naming where a unit or definition is not documented in the material used by the course.
- Did not expand `LS`, invent a unit dictionary, add plot coordinates or add a management label.
- Labelled species identities and notebook-only review fields as instructional rather than published observations.
- Repeated the limit that a plot record is not evidence about a whole site or the wider Baltic coastal meadow system.

### Python reviewer

- Checked every Python fence for a maximum of twenty lines.
- Compiled every Python example under Python 3.12.3, excluding the single deliberately incomplete Lesson 1 instruction.
- Kept Lesson 1 to `print()`, execution order and one syntax error.
- Kept collections out of Lesson 2 and avoided deeply nested records in Lesson 3.
- Validated the starter notebook as nbformat 4.5 JSON and compiled all prepared code cells before learner editing.

### Instructional reviewer

- One central concept is taught in each lesson: execution in Lesson 1, basic values in Lesson 2 and collections in Lesson 3.
- Interactions appear throughout the lesson rather than only at the end.
- Predictions occur before execution, and explanations distinguish Python behaviour from scientific meaning.
- Guided practice reduces support gradually before the independent challenge.
- Submission requirements and assessment expectations are explicit and do not assess advanced programming style in Lesson 1.

### UX reviewer

- The open lesson shows time, position, content layers, internal navigation and completed checks before the long lesson body.
- Planned lessons are visible in sequence but cannot be opened or marked complete.
- Previous and next controls identify the destination; Lesson 3 names Lesson 4 as planned rather than linking to an empty page.
- Automated tests confirm no page-level horizontal overflow at 320×568, 375×812, 768×1024 and 1440×900 on public and admin pages.
- Code blocks scroll internally when required, and tested lesson controls remain at least 44 px tall.
- A visual browser review at 320 px and 768 px identified duplicate numbering in the lesson contents; the issue was corrected before completion.

## Intentionally deferred

- Lessons 4–12 remain syllabus entries only. They have not been written as lesson pages.
- Full debugging, traceback interpretation, notebook state management and functions remain deferred to Lesson 6.
- Virtual environments and detailed package management remain optional context until the learner needs them.
- The published dataset is not loaded in Lessons 1–3. Direct table work begins in the planned pandas lesson.
- Formative-check answers are intentionally ungraded and session-local. They do not change completion or instructor review status.

## Known limitations

- The automated suite validates notebook JSON and Python cell syntax, but does not launch a separate installed JupyterLab desktop application.
- Guest notes, progress and submissions remain local to the current browser. Signed-in synchronization still depends on the configured Supabase project being available.
- Review-status language is mapped onto the existing database states to avoid a database migration in a content-focused branch.
- The revised lesson bodies are maintained as dedicated Markdown files and exposed through a separate Pages CMS collection; lesson metadata, resources and tasks remain in the Academy website editor.

## Recommended scope for Lessons 4–6

### Lesson 4 — Conditions and Data-Quality Rules

- Introduce Boolean expressions and `if` statements through explicit ecological plausibility and missing-value rules.
- Separate computational flags from decisions to discard or correct measurements.
- Extend the same notebook with a small, documented plot-quality checklist.

### Lesson 5 — Repetition, Loops and Vectorised Thinking

- Begin with repeated inspection of a few ecological values, then introduce a loop as a way to express the repetition once.
- Contrast conceptual repetition with vectorised array/table operations without teaching pandas prematurely.
- Produce a transparent repeated-summary section in the portfolio notebook.

### Lesson 6 — Functions, Errors and Debugging

- Turn a repeated quality rule into one small function with inputs, a returned result and a concise docstring.
- Teach traceback reading, undefined names, incompatible types and notebook-state recovery systematically.
- End with a clean restart-and-run-all workflow that prepares the learner for NumPy and the published table.
