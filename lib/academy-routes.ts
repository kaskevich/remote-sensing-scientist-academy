import type { AcademyLesson } from "@/app/components/learner-curriculum";
import { academyCurriculumModules } from "@/lib/academy-platform";
export { academyHref, academyUrl, academyAssetUrl } from "@/lib/site-paths";

export type AcademyLessonRoute = {
  lessonId: string;
  slug: string;
  path: string;
  canonicalUrl: string;
  moduleNumber: number;
  moduleSlug: string;
  moduleTitle: string;
  modulePath: string;
  chapterNumber: number | null;
  chapterSlug: string;
  chapterTitle: string;
  chapterPath: string;
  lessonNumber: string;
  lessonType: string;
  difficulty: string | null;
  estimatedTime: string;
  portfolioArtifact: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  lesson: AcademyLesson;
};

export type AcademyChapterRoute = {
  moduleNumber: number;
  moduleSlug: string;
  moduleTitle: string;
  modulePath: string;
  chapterNumber: number | null;
  chapterSlug: string;
  title: string;
  path: string;
  lessons: AcademyLessonRoute[];
};

export type AcademyModuleRoute = {
  moduleNumber: number;
  moduleSlug: string;
  title: string;
  path: string;
  purpose: string;
  finalProject: string;
  prerequisites: string;
  accent: "lime" | "blue" | "terracotta";
  outcomes: string[];
  chapters: AcademyChapterRoute[];
  lessons: AcademyLessonRoute[];
};

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function findChapter(
  module: (typeof academyCurriculumModules)[number],
  lessonId: string,
) {
  for (const chapter of module.overview.chapters) {
    if (chapter.lessons.some((lesson) => lesson.lessonId === lessonId)) {
      return { number: chapter.number, title: chapter.title };
    }
    if (chapter.practicum?.lessonId === lessonId) {
      return { number: chapter.number, title: chapter.title };
    }
  }
  if (module.overview.capstone?.lessonId === lessonId) {
    return { number: null, title: "Capstone" };
  }
  return { number: null, title: "Portfolio" };
}

function buildLessonRoute(
  module: (typeof academyCurriculumModules)[number],
  lesson: AcademyLesson,
): AcademyLessonRoute {
  const moduleNumber = module.overview.moduleNumber;
  const moduleSlug = `module-${moduleNumber}`;
  const modulePath = `/${moduleSlug}/`;
  const chapter = findChapter(module, lesson.id);
  const chapterSlug = chapter.number === null ? slugify(chapter.title) : slugify(chapter.title);
  const chapterPath = `${modulePath}${chapterSlug}/`;
  const slug = lesson.pedagogy?.slug ?? slugify(lesson.title);
  const path = `${chapterPath}${slug}/`;
  const lessonType = lesson.pedagogy?.lessonType
    ?? (lesson.kind === "practicum" ? "Practicum" : lesson.numberLabel === "Capstone" ? "Capstone" : "Lesson");
  const estimatedTime = lesson.pedagogy?.estimatedTime ?? "Self-paced";
  const portfolioArtifact = lesson.pedagogy?.portfolioArtifact
    ?? lesson.task.title.replace(/^Submit\s+/i, "");

  return {
    lessonId: lesson.id,
    slug,
    path,
    canonicalUrl: `https://kaskevich.github.io/remote-sensing-scientist-academy${path}`,
    moduleNumber,
    moduleSlug,
    moduleTitle: module.overview.title,
    modulePath,
    chapterNumber: chapter.number,
    chapterSlug,
    chapterTitle: chapter.title,
    chapterPath,
    lessonNumber: lesson.numberLabel ?? lesson.id,
    lessonType,
    difficulty: lesson.pedagogy?.difficulty ?? null,
    estimatedTime,
    portfolioArtifact,
    title: lesson.title,
    description: lesson.description,
    seoTitle: lesson.pedagogy?.seoTitle ?? lesson.title,
    seoDescription: lesson.pedagogy?.seoDescription ?? lesson.description,
    lesson,
  };
}

export const academyModuleRoutes: AcademyModuleRoute[] = academyCurriculumModules.map((module) => {
  const moduleNumber = module.overview.moduleNumber;
  const moduleSlug = `module-${moduleNumber}`;
  const modulePath = `/${moduleSlug}/`;
  const lessons = module.lessons.map((lesson) => buildLessonRoute(module, lesson));
  const chapterOrder = [
    ...module.overview.chapters.map((chapter) => ({
      number: chapter.number,
      title: chapter.title,
      slug: slugify(chapter.title),
    })),
    ...(module.overview.capstone ? [{ number: null, title: "Capstone", slug: "capstone" }] : []),
  ];
  const chapters = chapterOrder
    .map((chapter): AcademyChapterRoute => ({
      moduleNumber,
      moduleSlug,
      moduleTitle: module.overview.title,
      modulePath,
      chapterNumber: chapter.number,
      chapterSlug: chapter.slug,
      title: chapter.title,
      path: `${modulePath}${chapter.slug}/`,
      lessons: lessons.filter((lesson) => lesson.chapterSlug === chapter.slug),
    }))
    .filter((chapter) => chapter.lessons.length > 0);

  return {
    moduleNumber,
    moduleSlug,
    title: module.overview.title,
    path: modulePath,
    purpose: module.overview.purpose,
    finalProject: module.overview.finalProject,
    prerequisites: module.overview.prerequisites,
    accent: module.overview.accent,
    outcomes: module.overview.outcomes,
    chapters,
    lessons,
  };
});

export const academyLessonRoutes = academyModuleRoutes.flatMap((module) => module.lessons);
export const academyChapterRoutes = academyModuleRoutes.flatMap((module) => module.chapters);

export const lessonRouteById = Object.fromEntries(
  academyLessonRoutes.map((lesson) => [lesson.lessonId, lesson]),
) as Record<string, AcademyLessonRoute>;

export function getModuleRoute(moduleSlug: string) {
  return academyModuleRoutes.find((module) => module.moduleSlug === moduleSlug) ?? null;
}

export function getChapterRoute(moduleSlug: string, chapterSlug: string) {
  return academyChapterRoutes.find(
    (chapter) => chapter.moduleSlug === moduleSlug && chapter.chapterSlug === chapterSlug,
  ) ?? null;
}

export function getLessonRoute(moduleSlug: string, chapterSlug: string, lessonSlug: string) {
  return academyLessonRoutes.find(
    (lesson) => lesson.moduleSlug === moduleSlug
      && lesson.chapterSlug === chapterSlug
      && lesson.slug === lessonSlug,
  ) ?? null;
}

export function previousAndNextLessons(lessonId: string) {
  const current = lessonRouteById[lessonId];
  if (!current) return { previous: null, next: null };
  const academyModule = academyModuleRoutes.find((candidate) => candidate.moduleNumber === current.moduleNumber);
  if (!academyModule) return { previous: null, next: null };
  const index = academyModule.lessons.findIndex((lesson) => lesson.lessonId === lessonId);
  return {
    previous: academyModule.lessons[index - 1] ?? null,
    next: academyModule.lessons[index + 1] ?? null,
  };
}
