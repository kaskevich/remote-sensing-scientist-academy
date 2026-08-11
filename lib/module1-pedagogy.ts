export type FormativeCheck = {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
};

export type LessonTechnicalMetadata = {
  pythonVersion: string;
  jupyterEnvironment: string;
  reviewDate: string;
  testedVersions?: Array<{ label: string; value: string }>;
  datasetCitation?: string;
  coreReferences: Array<{ title: string; href: string }>;
  furtherReading: Array<{ title: string; href: string }>;
};

export type ReviewedLessonDetails = {
  estimatedTime: string;
  lessonType?: string;
  position: number;
  totalPositions: number;
  markdownFile: string;
  content?: string;
  formativeChecks: FormativeCheck[];
  submissionChecklist: string[];
  rubric: Array<{ dimension: string; expectation: string }>;
  technicalMetadata: LessonTechnicalMetadata;
  additionalResources?: Array<{ href: string; title: string }>;
};

export type ModuleChapterLesson = {
  number: number;
  title: string;
  status: "available" | "planned";
  lessonId?: string;
};

export type ModuleChapter = {
  number: number;
  title: string;
  lessons: ModuleChapterLesson[];
  practicum?: {
    title: string;
    status: "available" | "planned";
    lessonId?: string;
  };
};

export type AcademyModuleOverview = {
  moduleNumber: number;
  accent: "lime" | "blue";
  overviewLabel: string;
  navigationTitle: string;
  navigationMeta: string;
  syllabusAriaLabel: string;
  planningNote: string;
  title: string;
  purpose: string;
  finalProject: string;
  prerequisites: string;
  outcomes: string[];
  progression?: string[];
  chapters: ModuleChapter[];
  capstone?: ModuleChapterLesson;
};

export type Module1Overview = AcademyModuleOverview;

export const module1Overview: Module1Overview = {
  moduleNumber: 1,
  accent: "lime",
  overviewLabel: "Module 1 overview",
  navigationTitle: "Available Module 1 lessons",
  navigationMeta: "12 lessons",
  syllabusAriaLabel: "Complete twelve-lesson Module 1 map",
  planningNote:
    "All twelve lessons are available. Each lesson extends the same Vegetation Data Explorer notebook and contributes one portfolio checkpoint.",
  title: "Thinking Like a Scientific Programmer",
  purpose:
    "Learn Python from zero and become capable of inspecting, organising and explaining scientific ecological data.",
  finalProject: "Vegetation Data Explorer",
  prerequisites: "None",
  outcomes: [
    "Use Jupyter and Python confidently",
    "Represent scientific information using appropriate data types",
    "Write conditions, loops and functions",
    "Work with NumPy arrays",
    "Load and inspect a published dataset with pandas",
    "Identify missing, invalid and inconsistent values",
    "Filter, group, summarise, join and reshape tables",
    "Create clear scientific figures",
    "Document and interpret a reproducible analysis",
  ],
  chapters: [
    {
      number: 1,
      title: "Start with Python",
      lessons: [
        { number: 1, title: "Welcome to Scientific Programming", status: "available", lessonId: "lesson-01" },
        { number: 2, title: "Variables and Scientific Data", status: "available", lessonId: "lesson-02" },
        { number: 3, title: "Collections for Ecological Information", status: "available", lessonId: "lesson-03" },
      ],
    },
    {
      number: 2,
      title: "Control and Reuse",
      lessons: [
        { number: 4, title: "Conditions and Data-Quality Rules", status: "available", lessonId: "lesson-04" },
        { number: 5, title: "Repetition, Loops and Vectorised Thinking", status: "available", lessonId: "lesson-05" },
        { number: 6, title: "Functions, Errors and Debugging", status: "available", lessonId: "lesson-06" },
      ],
    },
    {
      number: 3,
      title: "Work with Scientific Tables",
      lessons: [
        { number: 7, title: "NumPy and Numerical Arrays", status: "available", lessonId: "lesson-07" },
        { number: 8, title: "Open the Published Dataset with pandas", status: "available", lessonId: "lesson-08" },
        { number: 9, title: "Missing Values, Types and Data Quality", status: "available", lessonId: "lesson-09" },
      ],
    },
    {
      number: 4,
      title: "Analyse and Communicate",
      lessons: [
        { number: 10, title: "Filter, Group and Summarise", status: "available", lessonId: "lesson-10" },
        { number: 11, title: "Join, Reshape and Visualise", status: "available", lessonId: "lesson-11" },
        { number: 12, title: "Vegetation Data Explorer Project", status: "available", lessonId: "lesson-12" },
      ],
    },
  ],
};

const sharedTechnicalMetadata = {
  pythonVersion: "Python 3.12.3",
  jupyterEnvironment: "JupyterLab 4 / Notebook 7 compatible notebook format (nbformat 4.5)",
  reviewDate: "6 August 2026",
  datasetCitation:
    "Baltic coastal plant traits 2024, Zenodo record 20083250, https://doi.org/10.5281/zenodo.20083250",
};

export const reviewedLessonDetails: Record<string, ReviewedLessonDetails> = {
  "lesson-01": {
    estimatedTime: "75–90 minutes",
    position: 1,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-01.md",
    formativeChecks: [
      {
        id: "l1-cells",
        question: "You want to explain why a research question matters. Which notebook cell should you use?",
        options: ["A Markdown cell", "A code cell", "Either cell produces the same result"],
        correctOption: 0,
        explanation:
          "Markdown cells hold narrative, headings and interpretation. Code cells contain instructions that the Python kernel executes.",
      },
      {
        id: "l1-invalid-instruction",
        question: "What happens when Python reaches an invalid instruction in a code cell?",
        options: [
          "Python guesses the intended instruction",
          "Python reports an error and stops that cell",
          "Jupyter silently deletes the instruction",
        ],
        correctOption: 1,
        explanation:
          "Python reports an error at the point where it cannot continue. Earlier completed instructions may already have produced output, but later instructions in that cell do not run.",
      },
      {
        id: "l1-interpretation",
        question: "A cell runs and prints a number. What has been established?",
        options: [
          "Only that Python executed the instruction and produced that output",
          "That the number is scientifically valid",
          "That the ecological hypothesis is correct",
        ],
        correctOption: 0,
        explanation:
          "Successful execution is computational evidence, not scientific validation. The scientist must still check data, assumptions and interpretation.",
      },
    ],
    submissionChecklist: [
      "The starter notebook is renamed Vegetation_Data_Explorer.ipynb",
      "All required Markdown and code cells are present and executed",
      "The deliberately broken print instruction is corrected",
      "A clean restart-and-Run-All check is recorded",
      "The notebook is saved, reopened and a downloaded copy is retained",
      "The handover note identifies the question, run sequence, expected output and interpretation limit",
      "The written answer distinguishes code cells from Markdown cells",
      "The reflection is complete",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Required cells run and the simple syntax error is corrected" },
      { dimension: "Conceptual understanding", expectation: "Explains scientific programming and code versus Markdown" },
      { dimension: "Reproducibility", expectation: "Notebook is clearly named, clean-run from top to bottom, reopened and preserved" },
      { dimension: "Scientific communication", expectation: "Handover note separates successful execution from scientific interpretation" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "Project Jupyter documentation", href: "https://docs.jupyter.org/en/latest/start/index.html" },
        { title: "Python built-in functions: print", href: "https://docs.python.org/3/library/functions.html#print" },
      ],
      furtherReading: [
        { title: "Try Jupyter in a browser", href: "https://jupyter.org/try" },
        { title: "The Turing Way: reproducible research", href: "https://book.the-turing-way.org/reproducible-research/reproducible-research" },
      ],
    },
    additionalResources: [
      {
        href: "lesson-resources/module-1/Vegetation_Data_Explorer_Starter.ipynb",
        title: "Download the Vegetation Data Explorer starter notebook",
      },
    ],
  },
  "lesson-02": {
    estimatedTime: "70–85 minutes",
    position: 2,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-02.md",
    formativeChecks: [
      {
        id: "l2-types",
        question: "Which pair represents two different Python values?",
        options: ["\"72\" and 72", "72 and 72", "True and True"],
        correctOption: 0,
        explanation:
          "\"72\" is a string of two characters; 72 is an integer that can take part in arithmetic. Appearance alone does not determine type.",
      },
      {
        id: "l2-type-inspection",
        question: "What is the safest way to confirm the current Python type of species_richness?",
        options: ["Read the variable name", "Run type(species_richness)", "Assume whole-looking values are integers"],
        correctOption: 1,
        explanation:
          "type() reports the Python type of the current value. A name can suggest meaning, but it cannot guarantee either type or scientific validity.",
      },
      {
        id: "l2-units",
        question: "Why should a unit be recorded in a variable name or nearby metadata?",
        options: [
          "Because Python automatically verifies the unit",
          "Because a numeric value alone does not document what was measured",
          "Because every float must use metres",
        ],
        correctOption: 1,
        explanation:
          "Python stores a number, not its method or unit. A clear name or metadata note preserves meaning, but the unit must still come from documented sources.",
      },
    ],
    submissionChecklist: [
      "One vegetation plot is represented with variables",
      "Strings, integers, floats, Booleans and None are used appropriately",
      "type() output is visible for the required values",
      "The data-contract table records role, unit status, missing convention and source",
      "The identifier-conversion failure is demonstrated and explained",
      "Every variable receives a justified ready, review or stop status",
      "The response distinguishes a missing value from zero",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Assignments and type inspections execute with appropriate basic types" },
      { dimension: "Conceptual understanding", expectation: "Explains why each type represents the scientific value" },
      { dimension: "Reproducibility", expectation: "Lesson 2 extends the same clean-running notebook and preserves source representation" },
      { dimension: "Scientific communication", expectation: "Data contract documents identity, missingness, unit limits and QA status" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "Python: an informal introduction", href: "https://docs.python.org/3/tutorial/introduction.html" },
        { title: "Python built-in functions: type", href: "https://docs.python.org/3/library/functions.html#type" },
      ],
      furtherReading: [
        { title: "The Turing Way: research data management", href: "https://book.the-turing-way.org/reproducible-research/rdm" },
      ],
    },
  },
  "lesson-03": {
    estimatedTime: "90–105 minutes",
    position: 3,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-03.md",
    formativeChecks: [
      {
        id: "l3-list",
        question: "You need to preserve the order in which species names were recorded and allow later corrections. Which structure fits?",
        options: ["A list", "A set", "A Boolean"],
        correctOption: 0,
        explanation:
          "A list preserves order, permits repeated observations and can be updated. A set removes duplicates and does not preserve a scientific sequence.",
      },
      {
        id: "l3-dictionary",
        question: "You need to retrieve the site using the label site rather than a numeric position. Which structure fits?",
        options: ["A tuple", "A dictionary", "A list of unlabelled values"],
        correctOption: 1,
        explanation:
          "A dictionary connects named keys to values, so plot information can be retrieved by a documented field name.",
      },
      {
        id: "l3-supporting-structures",
        question: "Which statement describes the limited role of tuples and sets in this lesson?",
        options: [
          "Tuples preserve a fixed order; sets keep unique membership when order is irrelevant",
          "Tuples and sets both replace dictionaries",
          "Sets are the best way to preserve observation order",
        ],
        correctOption: 0,
        explanation:
          "Use a tuple for a small fixed convention and a set for distinct labels. Lists and dictionaries remain the main structures for this lesson.",
      },
    ],
    submissionChecklist: [
      "A species list is created, indexed and updated",
      "A plot dictionary is created and its values are accessed and updated",
      "A required-versus-available field audit reports missing and unexpected fields",
      "The written answer explains what each collection preserves and may discard",
      "Published values are distinguished from instructional examples in a provenance table",
      "A justified structure ready, provenance review or stop decision is recorded",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Collection operations and the field-set audit run and retrieve the intended values" },
      { dimension: "Conceptual understanding", expectation: "Collection choices match order, naming, fixed position or uniqueness and acknowledge information loss" },
      { dimension: "Reproducibility", expectation: "The record, expected schema and QA output run in the continuing notebook" },
      { dimension: "Scientific communication", expectation: "Provenance limits and the evidence-based handover decision are stated concisely" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "Python data structures", href: "https://docs.python.org/3/tutorial/datastructures.html" },
        { title: "Baltic coastal plant traits dataset", href: "https://zenodo.org/records/20083250" },
      ],
      furtherReading: [
        { title: "The Turing Way: data provenance", href: "https://book.the-turing-way.org/reproducible-research/rdm/rdm-provenance" },
      ],
    },
  },
  "lesson-04": {
    estimatedTime: "90–105 minutes",
    position: 4,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-04.md",
    formativeChecks: [
      {
        id: "l4-comparison",
        question: "A review rule should include richness values of exactly 6. Which comparison expresses that boundary?",
        options: ["richness > 6", "richness >= 6", "richness == True"],
        correctOption: 1,
        explanation: "The greater-than-or-equal operator includes the boundary value. The threshold still requires scientific justification outside the syntax.",
      },
      {
        id: "l4-missingness",
        question: "Why should the biomass rule check `is None` before comparing the value with zero?",
        options: ["None is the same as zero", "A missing value cannot take part safely in that numerical comparison", "Python will infer the missing biomass"],
        correctOption: 1,
        explanation: "Checking missingness first prevents an invalid comparison and preserves the distinction between no recorded measurement and measured zero biomass.",
      },
      {
        id: "l4-rule-design",
        question: "A plot triggers a quality flag. What has the code established?",
        options: ["The measurement is definitely wrong", "The record meets a documented review criterion", "The plot must be deleted"],
        correctOption: 1,
        explanation: "A flag records that a criterion was met. Scientific review, metadata and protocol evidence are still needed before correction or exclusion.",
      },
    ],
    submissionChecklist: [
      "Missingness is checked before numerical validity",
      "The input contract, threshold boundary and provenance are explicit",
      "Source values remain unchanged beside derived statuses",
      "Missing, negative, zero, boundary and above-boundary cases are evidenced",
      "SALS4 and SALS5 rules run from a clean kernel",
      "Instructional readiness and scientific deployment readiness are judged separately",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Conditions, branch order, indentation and boundary tests produce the intended exclusive statuses" },
      { dimension: "Conceptual understanding", expectation: "Explains input scope, comparisons, boundaries, uncertainty and missing-versus-zero" },
      { dimension: "Reproducibility", expectation: "Rule specification, inputs, cases, observed results and audit messages are visible" },
      { dimension: "Scientific communication", expectation: "Separates computational behaviour from criterion validity and operational readiness" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "Python control flow", href: "https://docs.python.org/3/tutorial/controlflow.html#if-statements" },
        { title: "Baltic coastal plant traits dataset", href: "https://zenodo.org/records/20083250" },
      ],
      furtherReading: [
        { title: "The Turing Way: quality assurance", href: "https://book.the-turing-way.org/reproducible-research/quality-assurance" },
      ],
    },
  },
  "lesson-05": {
    estimatedTime: "75–90 minutes",
    position: 5,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-05.md",
    formativeChecks: [
      {
        id: "l5-trace",
        question: "In `for plot_id in plot_ids`, what does `plot_id` represent?",
        options: ["The complete list", "The current item during one iteration", "The number of plots"],
        correctOption: 1,
        explanation: "The loop variable is rebound to one current item on each iteration while the source collection remains the same.",
      },
      {
        id: "l5-accumulator",
        question: "Where should a running richness total be initialised?",
        options: ["Once before the loop", "Inside every iteration", "After the mean is calculated"],
        correctOption: 0,
        explanation: "Initialising once before the loop preserves the value accumulated from earlier iterations instead of resetting it for every plot.",
      },
      {
        id: "l5-interpretation",
        question: "What does the mean of SALS1–SALS3 describe?",
        options: ["All Baltic coastal meadows", "Only the selected three published records", "The cause of species richness"],
        correctOption: 1,
        explanation: "The calculation summarises the selected records. Sampling scope and design prevent generalisation or causal explanation from that value alone.",
      },
    ],
    submissionChecklist: [
      "Loop state is traced for known plot records",
      "Accumulators are initialised before iteration",
      "Final summaries are calculated after the loop",
      "The six-plot challenge is verified by hand",
      "Interpretation states the selected population and threshold limitation",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Loops, indentation, accumulation and counts produce verified results" },
      { dimension: "Conceptual understanding", expectation: "Explains current item, repeated method and vectorised alternative" },
      { dimension: "Reproducibility", expectation: "Inputs, trace output and hand check remain visible" },
      { dimension: "Scientific communication", expectation: "Limits summaries to the records actually processed" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "Python for statements", href: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" },
        { title: "Python built-in len", href: "https://docs.python.org/3/library/functions.html#len" },
      ],
      furtherReading: [
        { title: "Scientific Python: array computing", href: "https://scientific-python.org/" },
      ],
    },
  },
  "lesson-06": {
    estimatedTime: "80–95 minutes",
    position: 6,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-06.md",
    formativeChecks: [
      {
        id: "l6-function-boundary",
        question: "Why should a scientific function receive required values through parameters?",
        options: ["To make hidden notebook state more important", "To make inputs visible and the method easier to test", "To avoid returning a result"],
        correctOption: 1,
        explanation: "Visible parameters define the function boundary and allow controlled tests without relying on unrelated cells or global names.",
      },
      {
        id: "l6-test-cases",
        question: "Which test set best covers the biomass classifier?",
        options: ["Only 311.33", "None, Boolean, negative, text and recorded numeric values", "Two identical positive values"],
        correctOption: 1,
        explanation: "Each branch needs a known case so missingness, Boolean rejection, invalid type, invalid range and ordinary recorded behaviour are all exercised.",
      },
      {
        id: "l6-traceback",
        question: "What should you do first when a repeatable traceback appears?",
        options: ["Replace the entire notebook", "State the expected result and read the final error line", "Hide the error with a broad exception"],
        correctOption: 1,
        explanation: "Expected behaviour and the final error line provide focused evidence. One controlled change can then be tested against all known cases.",
      },
    ],
    submissionChecklist: [
      "Functions have narrow names, parameters, docstrings and return values",
      "Normal, boundary, missing and invalid cases are tested",
      "Boolean input is rejected before the general numeric check",
      "Three error categories are diagnosed from messages",
      "The independent function does not mutate source records",
      "Scientific validation is distinguished from software testing",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Functions return expected statuses for all documented cases" },
      { dimension: "Conceptual understanding", expectation: "Explains parameters, return values, tests and traceback evidence" },
      { dimension: "Reproducibility", expectation: "Expected and actual outputs support each debugging conclusion" },
      { dimension: "Scientific communication", expectation: "States what passing tests cannot validate scientifically" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "Python defining functions", href: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
        { title: "Python errors and exceptions", href: "https://docs.python.org/3/tutorial/errors.html" },
      ],
      furtherReading: [
        { title: "The Turing Way: testing research software", href: "https://book.the-turing-way.org/reproducible-research/testing" },
      ],
    },
  },
  "lesson-07": {
    estimatedTime: "80–95 minutes",
    position: 7,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-07.md",
    formativeChecks: [
      {
        id: "l7-import",
        question: "What does `import numpy as np` do?",
        options: ["Loads the dataset", "Makes NumPy available under a conventional short name", "Converts every list automatically"],
        correctOption: 1,
        explanation: "The import exposes NumPy through the `np` alias. Data conversion or analysis happens only through later explicit instructions.",
      },
      {
        id: "l7-shape",
        question: "What does array shape `(10,)` mean?",
        options: ["Ten rows and one hidden column", "One axis containing ten elements", "Ten missing dimensions"],
        correctOption: 1,
        explanation: "The one-item shape tuple reports one dimension of length ten; the comma is Python tuple notation.",
      },
      {
        id: "l7-mask",
        question: "Why must a Boolean mask align with its source array?",
        options: ["Each True or False selects the value at the same position", "Masks use field names", "Alignment changes the units"],
        correctOption: 0,
        explanation: "Boolean indexing is positional, so every mask element must correspond to the intended source-array position.",
      },
    ],
    submissionChecklist: [
      "Arrays are tied to exact published fields and row scope",
      "Shape and dtype are inspected before calculation",
      "Vectorised comparisons and masks align correctly",
      "Missing-value policy is stated with available count",
      "The two-dimensional bridge identifies rows, columns, shape and dimension",
      "Interpretation does not generalise beyond each subset",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Array creation, summaries, comparisons and masking return verified outputs" },
      { dimension: "Conceptual understanding", expectation: "Explains shape, dtype, vectorisation and positional alignment" },
      { dimension: "Reproducibility", expectation: "Dataset DOI, field names, values and subset scope are visible" },
      { dimension: "Scientific communication", expectation: "Reports missingness and subset limitations with summaries" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "NumPy absolute basics for beginners", href: "https://numpy.org/doc/stable/user/absolute_beginners.html" },
        { title: "NumPy indexing", href: "https://numpy.org/doc/stable/user/basics.indexing.html" },
      ],
      furtherReading: [
        { title: "NumPy missing data discussion", href: "https://numpy.org/doc/stable/user/misc.html" },
      ],
    },
  },
  "lesson-08": {
    estimatedTime: "90–110 minutes",
    position: 8,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-08.md",
    formativeChecks: [
      {
        id: "l8-path",
        question: "Why keep the CSV in a project `data` folder and use a relative path?",
        options: ["It makes the notebook portable with its source", "It changes the CSV values", "It removes the need for citation"],
        correctOption: 0,
        explanation: "A relative project path can travel with the notebook and avoids a machine-specific Downloads location while preserving source identity.",
      },
      {
        id: "l8-load",
        question: "Which result most directly detects a wrong delimiter or accidental extra header?",
        options: ["A successful import statement", "Expected shape, fields and first identifiers", "The notebook title"],
        correctOption: 1,
        explanation: "Shape, schema and first identifiers test what the parser produced; successful execution alone does not confirm the intended table.",
      },
      {
        id: "l8-dataframe",
        question: "What does pandas dtype establish?",
        options: ["How values are currently stored", "The ecological validity and unit", "The complete sampling design"],
        correctOption: 0,
        explanation: "Dtype is a technical storage description. Meaning, unit, protocol and validity still require metadata and scientific review.",
      },
    ],
    submissionChecklist: [
      "The unchanged CSV is stored under the relative data path",
      "Zenodo provenance, DOI, licence and parsing choices are recorded",
      "Shape is verified as 120 rows by 25 columns",
      "Identifiers, categories, dates and duplicates are audited",
      "The schema note identifies unresolved metadata questions",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "The documented path and read_csv options load the expected table" },
      { dimension: "Conceptual understanding", expectation: "Explains rows, columns, index, identifiers and dtypes" },
      { dimension: "Reproducibility", expectation: "Source, filename, path, parsing and audit output are explicit" },
      { dimension: "Scientific communication", expectation: "Does not infer unsupported units or field definitions" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "pandas read_csv", href: "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html" },
        { title: "pandas DataFrame introduction", href: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/01_table_oriented.html" },
      ],
      furtherReading: [
        { title: "Python pathlib", href: "https://docs.python.org/3/library/pathlib.html" },
      ],
    },
    additionalResources: [
      { href: "https://zenodo.org/records/20083250", title: "Open the published Baltic coastal plant traits dataset" },
    ],
  },
  "lesson-09": {
    estimatedTime: "90–110 minutes",
    position: 9,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-09.md",
    formativeChecks: [
      {
        id: "l9-missing",
        question: "What should accompany a missing-value percentage?",
        options: ["The count and denominator", "A claim that missing equals zero", "Automatic row deletion"],
        correctOption: 0,
        explanation: "Count and denominator make the percentage auditable and reveal the analysis population used to calculate it.",
      },
      {
        id: "l9-types",
        question: "What risk does `errors=\"coerce\"` create?",
        options: ["Unparseable present text can become missing silently", "Every number becomes a date", "It validates the measurement"],
        correctOption: 0,
        explanation: "Coercion can erase the evidence contained in unparseable present values, so newly missing positions must be identified and inspected.",
      },
      {
        id: "l9-rules",
        question: "Why should range checks be field-specific?",
        options: ["Different variables have different meanings and valid domains", "All numeric fields share one range", "pandas requires one rule per table"],
        correctOption: 0,
        explanation: "A negative value may be impossible for biomass but valid for another measurement, so rules require field meaning and protocol evidence.",
      },
    ],
    submissionChecklist: [
      "Quality profile reports dtype, missingness and uniqueness",
      "The Lesson 6 classifier is upgraded with pd.isna and all six required cases",
      "AGB missingness is quantified overall and by sampling group",
      "Field-specific flags remain separate from source measurements",
      "Decision log records action and justification",
      "Not flagged is not described as fully validated",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Profiles, masks and group coverage calculations are accurate" },
      { dimension: "Conceptual understanding", expectation: "Distinguishes missing, invalid and inconsistent values and explains why the earlier function contract evolves" },
      { dimension: "Reproducibility", expectation: "Quality rules and decisions are preserved in an audit trail" },
      { dimension: "Scientific communication", expectation: "Reports unresolved causes and avoids automatic deletion or imputation" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "pandas working with missing data", href: "https://pandas.pydata.org/docs/user_guide/missing_data.html" },
        { title: "pandas data types", href: "https://pandas.pydata.org/docs/user_guide/basics.html#dtypes" },
      ],
      furtherReading: [
        { title: "The Turing Way: research data management", href: "https://book.the-turing-way.org/reproducible-research/rdm" },
      ],
    },
  },
  "lesson-10": {
    estimatedTime: "90–110 minutes",
    position: 10,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-10.md",
    formativeChecks: [
      {
        id: "l10-filter",
        question: "When should the analysis-population filter be applied?",
        options: ["Before grouping and summarising", "Only to the displayed result", "After writing the conclusion"],
        correctOption: 0,
        explanation: "Filtering first ensures every group statistic is calculated from the explicitly defined population rather than only changing presentation.",
      },
      {
        id: "l10-group",
        question: "Why report `n` beside a group mean?",
        options: ["It shows how many observations support the summary", "It makes every group balanced", "It proves causality"],
        correctOption: 0,
        explanation: "The denominator is part of the evidence and reveals unequal group support; it does not correct imbalance or establish cause.",
      },
      {
        id: "l10-interpretation",
        question: "What is justified by a higher mean richness at one sampled site?",
        options: ["A descriptive difference in this table", "Proof that site caused higher richness", "Guaranteed regional ranking"],
        correctOption: 0,
        explanation: "The grouped result describes the sampled observations. Unequal counts and community composition limit causal and regional claims.",
      },
    ],
    submissionChecklist: [
      "The analytical question names population, response and grouping",
      "Filters are named, counted and inspected",
      "Summaries include n, centre and spread",
      "AGB coverage is reported separately from observed-value summaries",
      "Interpretation remains descriptive and states confounding factors",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Filters, groupby operations and named aggregations return verified values" },
      { dimension: "Conceptual understanding", expectation: "Explains population, grouping, denominator, centre and spread" },
      { dimension: "Reproducibility", expectation: "Every summary can be traced to selected rows and missingness policy" },
      { dimension: "Scientific communication", expectation: "Uses cautious descriptive language and identifies design limits" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "pandas groupby user guide", href: "https://pandas.pydata.org/docs/user_guide/groupby.html" },
        { title: "pandas indexing and selecting data", href: "https://pandas.pydata.org/docs/user_guide/indexing.html" },
      ],
      furtherReading: [
        { title: "NIST exploratory data analysis", href: "https://www.itl.nist.gov/div898/handbook/eda/eda.htm" },
      ],
    },
  },
  "lesson-11": {
    estimatedTime: "100–120 minutes",
    position: 11,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-11.md",
    formativeChecks: [
      {
        id: "l11-join",
        question: "What does `validate=\"one_to_one\"` protect?",
        options: ["The expected uniqueness of the key in both summaries", "The ecological validity of the means", "The figure colours"],
        correctOption: 0,
        explanation: "Join validation encodes the expected entity relationship and stops accidental row multiplication; it cannot validate scientific meaning by itself.",
      },
      {
        id: "l11-audit",
        question: "Which evidence best detects an unintended many-to-many join?",
        options: ["Before-and-after row counts and key uniqueness", "A longer chart title", "Rounding the result"],
        correctOption: 0,
        explanation: "Row counts, duplicate-key checks, unmatched keys and relationship validation reveal whether the join preserved intended entities.",
      },
      {
        id: "l11-reshape",
        question: "What does an empty site–community cell in the pivot mean?",
        options: ["Zero species richness", "That combination is not represented in the table", "pandas deleted the site"],
        correctOption: 1,
        explanation: "The missing cell records an unsampled or unrepresented combination. Filling it with zero would invent an observation.",
      },
    ],
    submissionChecklist: [
      "Join row meaning, key and relationship are documented",
      "Key uniqueness, row counts and unmatched keys are audited",
      "Mean and count matrices preserve unsampled combinations",
      "Figures have readable labels and complete captions",
      "Chart interpretation reports n and avoids causal claims",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Validated join, reshape and figure code preserve expected rows and values" },
      { dimension: "Conceptual understanding", expectation: "Explains entity keys, long/wide structure and chart purpose" },
      { dimension: "Reproducibility", expectation: "Tables, audits, figure code and captions are traceable" },
      { dimension: "Scientific communication", expectation: "Visual design is clear and limitations remain visible" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "pandas merge", href: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html" },
        { title: "pandas pivot tables", href: "https://pandas.pydata.org/docs/user_guide/reshaping.html#pivot-tables" },
        { title: "Matplotlib tutorials", href: "https://matplotlib.org/stable/tutorials/index.html" },
      ],
      furtherReading: [
        { title: "Fundamentals of Data Visualization", href: "https://clauswilke.com/dataviz/" },
      ],
    },
  },
  "lesson-12": {
    estimatedTime: "3–5 hours",
    position: 12,
    totalPositions: 12,
    markdownFile: "content/lessons/module-1/lesson-12.md",
    formativeChecks: [
      {
        id: "l12-question",
        question: "Which project question is appropriately scoped for Module 1?",
        options: ["How does observed richness vary among sampled groups?", "Which satellite model proves site caused richness?", "Where are all Baltic species located?"],
        correctOption: 0,
        explanation: "The published table supports a descriptive comparison of sampled field records; it lacks imagery, coordinates and design evidence for the broader claims.",
      },
      {
        id: "l12-architecture",
        question: "Where should quality decisions appear in a professional notebook?",
        options: ["Before the analysis results, with evidence and rationale", "Only in a private memory", "After the conclusion with no output"],
        correctOption: 0,
        explanation: "Visible quality evidence and decisions define the analysis population and allow a reader to interpret every later result.",
      },
      {
        id: "l12-validation",
        question: "What does a clean Run All establish?",
        options: ["The notebook executes in order without hidden state", "Every ecological claim is true", "The sampling design is unbiased"],
        correctOption: 0,
        explanation: "A clean run is a computational reproducibility check. Scientific validity still depends on data, design, assumptions and interpretation.",
      },
    ],
    submissionChecklist: [
      "The question is focused, descriptive and supported by available fields",
      "Provenance, schema, quality decisions and population are explicit",
      "Tested functions, summaries, validated structure and two figures are included",
      "Every result is traceable and the notebook passes a clean Run All",
      "The briefing states limitations and the evidence needed for future EO work",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "The complete notebook executes and all reported values match visible outputs" },
      { dimension: "Conceptual understanding", expectation: "Integrates data structures, control flow, arrays, tables and quality reasoning" },
      { dimension: "Reproducibility", expectation: "Source, environment, decisions, exports and clean execution are documented" },
      { dimension: "Scientific communication", expectation: "Question, figures, finding, uncertainty and limitations form a coherent argument" },
    ],
    technicalMetadata: {
      ...sharedTechnicalMetadata,
      coreReferences: [
        { title: "Baltic coastal plant traits dataset", href: "https://zenodo.org/records/20083250" },
        { title: "Jupyter notebook documentation", href: "https://docs.jupyter.org/en/latest/" },
        { title: "The Turing Way: reproducible research", href: "https://book.the-turing-way.org/reproducible-research/reproducible-research" },
      ],
      furtherReading: [
        { title: "The Turing Way: research communication", href: "https://book.the-turing-way.org/communication/communication" },
      ],
    },
  },
};

export function submissionStatusLabel(status: string, submittedAt?: string | null) {
  if (!submittedAt && status === "not_reviewed") return "Not submitted";
  if (status === "not_reviewed") return "Submitted";
  if (status === "needs_revision") return "Revision requested";
  if (status === "reviewed") return "Meets expectations";
  if (status === "approved") return "Portfolio ready";
  return status.replaceAll("_", " ");
}
