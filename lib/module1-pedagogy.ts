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
  datasetCitation?: string;
  coreReferences: Array<{ title: string; href: string }>;
  furtherReading: Array<{ title: string; href: string }>;
};

export type ReviewedLessonDetails = {
  estimatedTime: string;
  position: number;
  totalPositions: number;
  markdownFile: string;
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
};

export type Module1Overview = {
  title: string;
  purpose: string;
  finalProject: string;
  prerequisites: string;
  outcomes: string[];
  chapters: ModuleChapter[];
};

export const module1Overview: Module1Overview = {
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
        { number: 4, title: "Conditions and Data-Quality Rules", status: "planned" },
        { number: 5, title: "Repetition, Loops and Vectorised Thinking", status: "planned" },
        { number: 6, title: "Functions, Errors and Debugging", status: "planned" },
      ],
    },
    {
      number: 3,
      title: "Work with Scientific Tables",
      lessons: [
        { number: 7, title: "NumPy and Numerical Arrays", status: "planned" },
        { number: 8, title: "Open the Published Dataset with pandas", status: "planned" },
        { number: 9, title: "Missing Values, Types and Data Quality", status: "planned" },
      ],
    },
    {
      number: 4,
      title: "Analyse and Communicate",
      lessons: [
        { number: 10, title: "Filter, Group and Summarise", status: "planned" },
        { number: 11, title: "Join, Reshape and Visualise", status: "planned" },
        { number: 12, title: "Vegetation Data Explorer Project", status: "planned" },
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
    estimatedTime: "60–75 minutes",
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
      "The notebook is saved and a downloaded copy is retained",
      "The written answer distinguishes code cells from Markdown cells",
      "The reflection is complete",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Required cells run and the simple syntax error is corrected" },
      { dimension: "Conceptual understanding", expectation: "Explains scientific programming and code versus Markdown" },
      { dimension: "Reproducibility", expectation: "Notebook is clearly named, saved and run in order" },
      { dimension: "Scientific communication", expectation: "Separates execution from scientific interpretation" },
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
      "One data-type choice is explained",
      "The response distinguishes a missing value from zero",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "Assignments and type inspections execute with appropriate basic types" },
      { dimension: "Conceptual understanding", expectation: "Explains why each type represents the scientific value" },
      { dimension: "Reproducibility", expectation: "Lesson 2 extends the same notebook and runs after Lesson 1" },
      { dimension: "Scientific communication", expectation: "Documents missingness and avoids unsupported units" },
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
    estimatedTime: "75–90 minutes",
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
      "The submission uses appropriate indexing and key access",
      "The written answer explains why each collection type was chosen",
      "Published values are distinguished from instructional examples",
    ],
    rubric: [
      { dimension: "Technical correctness", expectation: "List and dictionary operations run and retrieve the intended values" },
      { dimension: "Conceptual understanding", expectation: "Collection choices match order, naming, fixed position or uniqueness" },
      { dimension: "Reproducibility", expectation: "The record is readable and runs in the continuing notebook" },
      { dimension: "Scientific communication", expectation: "Provenance limits and collection choices are stated concisely" },
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
};

export function submissionStatusLabel(status: string, submittedAt?: string | null) {
  if (!submittedAt && status === "not_reviewed") return "Not submitted";
  if (status === "not_reviewed") return "Submitted";
  if (status === "needs_revision") return "Revision requested";
  if (status === "reviewed") return "Meets expectations";
  if (status === "approved") return "Portfolio ready";
  return status.replaceAll("_", " ");
}
