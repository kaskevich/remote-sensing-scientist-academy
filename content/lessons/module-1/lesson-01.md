---
title: Welcome to Scientific Programming
lessonId: lesson-01
---

## 1. Scientific question and computational method

### Learning outcome

By the end of this lesson, you can explain scientific programming in one sentence, distinguish Markdown and code cells, run notebook cells in order, use `print()`, recognise and correct one syntax error, save the notebook, and explain why successful execution does not prove scientific validity.

**Prerequisites:** None. You do not need to know Python, files, folders, terminals or notebooks.

### Why this matters

You have joined a research group studying Baltic coastal meadows. Across the module, your working question is:

> How can field measurements help us describe and compare vegetation patterns across Baltic coastal meadow plots?

A scientific question is not yet a computational method. To analyse it, a scientist must turn decisions into instructions: which data to inspect, which values to compare, what to calculate and how to check the result.

**Programming** means writing instructions a computer can execute. **Scientific programming** means using explicit, repeatable computer instructions to investigate scientific evidence while keeping scientific judgement with the researcher.

The relationship is simple:

1. The scientist defines the question.
2. The notebook records explanation and instructions.
3. Python executes the instructions.
4. The scientist checks and interprets the result.

> **Core lesson** Write your own one-sentence definition of scientific programming in your private notes. Include both *repeatable instructions* and *scientific judgement*.

### Learner action

Write one scientific question about Baltic coastal meadow vegetation that could eventually be investigated using field measurements and Earth Observation data. Do not try to write code yet.

## 2. Meet the notebook

A **file** is a saved digital item with a name. A Jupyter notebook is a file ending in `.ipynb`. It can keep the question, code, output and interpretation together, which makes the route from evidence to conclusion easier to inspect than a final Word report alone.

A notebook contains cells:

- A **Markdown cell** holds headings, explanations, predictions and interpretations. Running it formats the text.
- A **code cell** holds Python instructions. Running it sends those instructions to Python and returns output or an error.

The **kernel** is the running Python process behind the notebook. When you run a code cell, Jupyter sends the cell to the kernel. The kernel reads instructions from top to bottom within that cell and stops if it reaches an instruction it cannot complete.

Download the starter notebook from the lesson resources below. Keep the downloaded file somewhere you can find again, then rename it exactly:

`Vegetation_Data_Explorer.ipynb`

Open it in JupyterLab, Jupyter Notebook, or your institution's current Jupyter environment. If you have no installed environment, [Try Jupyter](https://jupyter.org/try) provides a browser workspace. Browser workspaces may be temporary, so always download your work before leaving.

> **Go deeper — why not install everything today?** Professional projects often use separate environments and recorded package versions. Those practices matter, but installing and managing environments is not required for this first lesson. The module will introduce reproducibility in stages.

### Learner action

Open the starter notebook. Find its title cell, one prediction field and one prepared code cell. Change the learner-name placeholder to your name or researcher identifier, then save.

[[CHECK:l1-cells]]

## 3. Run the first instruction

The first prepared code cell contains:

```python
print()
```

Before running it, predict what will appear: the word `print`, an error, or an empty-looking line. Record the prediction in the Markdown field directly above the code.

Now select the code cell and press **Shift + Enter**, or use the Run control.

`print` is a built-in Python function that sends information to the output area. The parentheses mean “run this function now”. Nothing appears inside the parentheses, so `print()` produces only a new line. The output looks empty, but Python still completed a valid instruction.

![A scientific question moves through a notebook plan, a code cell, Python execution, output and scientific interpretation.](lesson-media/images/scientific-programming-execution.svg)

The top row of the diagram shows computation. The lower return path matters just as much: a scientist checks whether the output is relevant and defensible.

### Code walkthrough

1. `print` is the function name.
2. `(` opens the function call.
3. There is no value to display.
4. `)` closes the call.
5. The kernel executes the complete instruction and returns a line break.

### Learner action

Under the output, add a Markdown sentence explaining why an empty-looking result can still show that an instruction ran.

## 4. Predict execution order

The next prepared code cell contains three instructions:

```python
print("Vegetation Data Explorer")
print("Study system: Baltic coastal meadows")
print("Question: How does vegetation vary among field plots?")
```

### Predict before running

In the prediction field, write the three lines in the order you expect them to appear. Then run the cell.

Expected output:

```text
Vegetation Data Explorer
Study system: Baltic coastal meadows
Question: How does vegetation vary among field plots?
```

Python works from the first line to the third line. Each `print(...)` call contains a **string**: text between straight quotation marks. You will study strings formally in Lesson 2. For now, notice that the quotation marks tell Python where the text begins and ends; they are not shown in the output.

### Scientific interpretation

Python displayed a research question, but it did not judge whether the question is answerable, whether the data are suitable or whether the wording is ecologically sound. Execution answers “Did the computer follow the instruction?” Interpretation asks “What does the result mean, and is the method scientifically defensible?”

> **Scientific note** A precise output can still result from weak data, an unsuitable method or an unsupported assumption. Computational correctness and scientific validity must be checked separately.

### Learner action

Change only the final printed question so it matches the scientific question you wrote in Block 1. Predict the output order again, run the cell and confirm the lines remain in the expected sequence.

[[CHECK:l1-interpretation]]

## 5. Cause and fix one error

Create a new code cell and deliberately type this incomplete instruction:

```python
print("Baltic coastal meadow)
```

Run it. Python should report a `SyntaxError` because the opening quotation mark has no matching closing quotation mark. The error is information, not a judgement about your ability.

### When code fails

1. Read the final error line.
2. Identify the referenced line.
3. Compare names and punctuation.
4. Change one thing.
5. Run the cell again.

Add the missing straight quotation mark so the corrected cell becomes:

```python
print("Baltic coastal meadow")
```

Run it again and keep the corrected output. Full debugging and notebook-state management will be taught in Lesson 6.

### Common mistake: code in a Markdown cell

If `print("Baltic coastal meadow")` appears as formatted text instead of producing output, the instruction is probably in a Markdown cell. Change the cell type to **Code** and run it again.

### Learner action

Add a Markdown note below the corrected cell. State what Python reported, which single character was missing and how you knew the fix worked.

[[CHECK:l1-invalid-instruction]]

## 6. Save and submit the notebook

Saving updates the notebook in its current workspace. Downloading creates a separate copy that you control. Use both actions:

1. Confirm the notebook is named `Vegetation_Data_Explorer.ipynb`.
2. Save it in Jupyter.
3. Download a copy to a known folder on your computer.
4. Reopen the downloaded copy if your environment allows it.
5. Run the required cells from top to bottom and confirm that the corrected cell succeeds.

### Guided practice

Complete the starter notebook's Markdown prompts: project title, researcher name, scientific question, predictions, first execution note and error correction note.

### Independent challenge

Add one code cell with no more than three `print()` instructions. Display:

- your researcher name or identifier;
- one ecological feature you want to understand;
- one kind of Earth Observation evidence that might eventually help.

Predict the line order before running. After running, add two Markdown sentences: one identifies the executed instructions and output; the other identifies the scientific judgement that remains yours.

### Learner action

Use the submission checklist shown below the lesson. Upload the renamed notebook and one screenshot, then add the requested written explanation in the submission panel.

## 7. Reflection and summary

Write short answers in your private notes:

1. What is scientific programming, in one sentence?
2. When should you use a Markdown cell, and when should you use a code cell?
3. What did the kernel do when it reached the incomplete string?
4. Why does a successfully executed cell not prove that a scientific claim is valid?
5. Where is your downloaded notebook stored?

### Portfolio artifact

**Artifact 01 — Scientific notebook foundation**

Your `Vegetation_Data_Explorer.ipynb` now contains a project title, a scientific question, predictions, executable Python instructions, a corrected error and a reflection on scientific interpretation. Keep this notebook: Lesson 2 extends it rather than replacing it.

### Summary

You can now describe scientific programming as a partnership between explicit computation and scientific judgement. You can use the two essential notebook cell types, run simple instructions in order, correct one syntax error and preserve your notebook as a file.
