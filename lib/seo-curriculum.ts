import { readFileSync } from "node:fs";
import { join } from "node:path";
import content from "@/content/site.json";
import {
  type FormativeCheck,
  module1Overview,
  reviewedLessonDetails,
  type AcademyModuleOverview,
  type ReviewedLessonDetails,
} from "@/lib/module1-pedagogy";
import {
  module2ChapterPractica,
  module2LessonDetails,
  module2Overview,
  module2PracticumDetails,
  publishedModule2Lessons,
} from "@/lib/module2-pedagogy";
import {
  module3LessonDetails,
  module3Overview,
  publishedModule3Lessons,
} from "@/lib/module3-pedagogy";
import { academyUrl } from "@/lib/site-paths";

export type SeoLesson = {
  id: string;
  numberLabel: string;
  slug: string;
  path: string;
  canonicalUrl: string;
  moduleNumber: number;
  moduleSlug: string;
  moduleTitle: string;
  modulePath: string;
  chapterNumber: number | null;
  chapterTitle: string;
  title: string;
  pageTitle: string;
  description: string;
  tools: string[];
  artifact: string;
  lessonType: string;
  estimatedTime: string;
  formativeChecks: FormativeCheck[];
  content: string;
};

export type SeoModule = {
  number: number;
  slug: string;
  path: string;
  canonicalUrl: string;
  title: string;
  pageTitle: string;
  description: string;
  finalProject: string;
  prerequisites: string;
  outcomes: string[];
  overview: AcademyModuleOverview;
  lessons: SeoLesson[];
};

type LessonSeed = {
  id: string;
  numberLabel: string;
  chapterNumber: number | null;
  title: string;
  description: string;
  tools: string[];
  artifact: string;
  details: ReviewedLessonDetails;
};

export const academyName = "Remote Sensing Scientist Academy";

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function readLesson(details: ReviewedLessonDetails) {
  if (details.content?.trim()) return details.content;
  const source = readFileSync(
    join(/* turbopackIgnore: true */ process.cwd(), details.markdownFile),
    "utf8",
  );
  return source.replace(/^---\n[\s\S]*?\n---\n+/, "");
}

function conciseDescription(primary: string, tools: string[], artifact: string) {
  const clean = primary.replace(/\s+/g, " ").trim().replace(/\.$/, "");
  const toolPhrase = tools.slice(0, 3).join(", ");
  const addition = toolPhrase
    ? ` Practise with ${toolPhrase} and produce ${artifact}.`
    : ` Produce ${artifact}.`;
  const candidate = `${clean}.${addition}`.replace(/\s+/g, " ");
  if (candidate.length <= 165) return candidate;
  if (`${clean}.`.length <= 165 && clean.length >= 110) return `${clean}.`;
  const shortened = candidate.slice(0, 161).replace(/\s+\S*$/, "").replace(/[,:;]$/, "");
  return `${shortened}.`;
}

function chapterFor(overview: AcademyModuleOverview, lessonId: string) {
  for (const chapter of overview.chapters) {
    if (chapter.lessons.some((lesson) => lesson.lessonId === lessonId)) {
      return { number: chapter.number, title: chapter.title };
    }
    if (chapter.practicum?.lessonId === lessonId) {
      return { number: chapter.number, title: chapter.title };
    }
  }
  return { number: null, title: "Capstone" };
}

function buildModule(
  overview: AcademyModuleOverview,
  seeds: LessonSeed[],
): SeoModule {
  const slug = `module-${overview.moduleNumber}`;
  const path = `/${slug}/`;
  const lessons = seeds.map((seed): SeoLesson => {
    const chapter = seed.chapterNumber === null
      ? { number: null, title: "Capstone" }
      : chapterFor(overview, seed.id);
    const lessonSlug = seed.details.slug ?? slugify(seed.title);
    const lessonPath = `${path}${lessonSlug}/`;
    const seoTitle = seed.details.seoTitle ?? seed.title;
    return {
      id: seed.id,
      numberLabel: seed.numberLabel,
      slug: lessonSlug,
      path: lessonPath,
      canonicalUrl: academyUrl(lessonPath),
      moduleNumber: overview.moduleNumber,
      moduleSlug: slug,
      moduleTitle: overview.title,
      modulePath: path,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      title: seed.title,
      pageTitle: `${seoTitle} | ${academyName}`,
      description: seed.details.seoDescription
        ?? conciseDescription(seed.description, seed.tools, seed.artifact),
      tools: seed.tools,
      artifact: seed.details.portfolioArtifact ?? seed.artifact,
      lessonType: seed.details.lessonType ?? "Lesson",
      estimatedTime: seed.details.estimatedTime,
      formativeChecks: seed.details.formativeChecks,
      content: readLesson(seed.details),
    };
  });

  return {
    number: overview.moduleNumber,
    slug,
    path,
    canonicalUrl: academyUrl(path),
    title: overview.title,
    pageTitle: `${overview.title} | ${academyName}`,
    description: overview.purpose,
    finalProject: overview.finalProject,
    prerequisites: overview.prerequisites,
    outcomes: overview.outcomes,
    overview,
    lessons,
  };
}

const visibleModuleOne = content.curriculum.modules.filter((lesson) => lesson.visible);
const moduleOneSeeds: LessonSeed[] = visibleModuleOne.map((lesson, index) => ({
  id: lesson.id,
  numberLabel: `1.${index + 1}`,
  chapterNumber: chapterFor(module1Overview, lesson.id).number,
  title: lesson.title,
  description: lesson.description,
  tools: lesson.tools,
  artifact: lesson.task.title,
  details: reviewedLessonDetails[lesson.id],
}));

const numberedModuleTwoSeeds: LessonSeed[] = publishedModule2Lessons.map((lesson) => ({
  id: lesson.id,
  numberLabel: lesson.number,
  chapterNumber: lesson.id === "lesson-2-capstone" ? null : lesson.chapter,
  title: lesson.title,
  description: lesson.description,
  tools: lesson.tools,
  artifact: lesson.artifact,
  details: module2LessonDetails[lesson.id],
}));

const practicumModuleTwoSeeds: LessonSeed[] = module2ChapterPractica.map((practicum) => ({
  id: practicum.id,
  numberLabel: `2.P${practicum.chapter}`,
  chapterNumber: practicum.chapter,
  title: practicum.title,
  description: practicum.description,
  tools: [...practicum.tools],
  artifact: practicum.artifact,
  details: module2PracticumDetails[practicum.id],
}));

const moduleTwoSeeds = [
  ...module2Overview.chapters.flatMap((chapter) => [
    ...numberedModuleTwoSeeds.filter((lesson) => lesson.chapterNumber === chapter.number),
    ...practicumModuleTwoSeeds.filter((lesson) => lesson.chapterNumber === chapter.number),
  ]),
  ...numberedModuleTwoSeeds.filter((lesson) => lesson.chapterNumber === null),
];

const moduleThreeSeeds: LessonSeed[] = publishedModule3Lessons.map((lesson) => ({
  id: lesson.id,
  numberLabel: lesson.number,
  chapterNumber: lesson.id === "lesson-3-capstone" ? null : lesson.chapter,
  title: lesson.title,
  description: lesson.description,
  tools: lesson.tools,
  artifact: lesson.artifact,
  details: module3LessonDetails[lesson.id],
}));

export const seoModules: SeoModule[] = [
  buildModule(module1Overview, moduleOneSeeds),
  buildModule(module2Overview, moduleTwoSeeds),
  buildModule(module3Overview, moduleThreeSeeds),
];

export const seoLessons = seoModules.flatMap((module) => module.lessons);

export function getSeoModule(moduleSlug: string) {
  return seoModules.find((module) => module.slug === moduleSlug) ?? null;
}

export function getSeoLesson(moduleSlug: string, lessonSlug: string) {
  return seoLessons.find(
    (lesson) => lesson.moduleSlug === moduleSlug && lesson.slug === lessonSlug,
  ) ?? null;
}

export function lessonSequence(lesson: SeoLesson) {
  const academyModule = getSeoModule(lesson.moduleSlug);
  const index = academyModule?.lessons.findIndex((candidate) => candidate.id === lesson.id) ?? -1;
  return {
    previous: index > 0 ? academyModule?.lessons[index - 1] ?? null : null,
    next: index >= 0 ? academyModule?.lessons[index + 1] ?? null : null,
  };
}

export function markdownWithPublicAssets(markdown: string) {
  const base = process.env.PAGES_BASE_PATH ?? "";
  return markdown
    .replace(/^#\s+/, "## ")
    .replace(/\]\((lesson-media\/)/g, `](${base}/$1`)
    .replace(/\]\((lesson-resources\/)/g, `](${base}/$1`);
}
