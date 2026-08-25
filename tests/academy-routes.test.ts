import { describe, expect, it } from "vitest";
import {
  academyChapterRoutes,
  academyLessonRoutes,
  academyModuleRoutes,
  lessonRouteById,
  previousAndNextLessons,
} from "@/lib/academy-routes";
import sitemap from "@/app/sitemap";
import { calculateProgress } from "@/lib/learner-progress";

describe("Academy canonical route model", () => {
  it("generates one unique semantic route for every stable lesson ID", () => {
    expect(academyLessonRoutes).toHaveLength(109);
    expect(new Set(academyLessonRoutes.map((lesson) => lesson.lessonId)).size).toBe(109);
    expect(new Set(academyLessonRoutes.map((lesson) => lesson.path)).size).toBe(109);
    expect(academyLessonRoutes.every((lesson) => lesson.path.endsWith("/") && !lesson.path.includes("#"))).toBe(true);
  });

  it("keeps representative route slugs separate from learner identity", () => {
    expect(lessonRouteById["lesson-01"].path).toBe(
      "/module-1/start-with-python/scientific-programming/",
    );
    expect(lessonRouteById["lesson-2-01"].path).toBe(
      "/module-2/spatial-foundations/what-makes-data-geospatial/",
    );
    expect(lessonRouteById["lesson-3-01"].path).toBe(
      "/module-3/frame-the-prediction-problem/prediction-inference-and-explanation/",
    );
    expect(lessonRouteById["lesson-2-01"].lessonId).toBe("lesson-2-01");
  });

  it("preserves progress when a public slug changes", () => {
    const lessonIds = academyLessonRoutes.map((lesson) => lesson.lessonId);
    const before = calculateProgress(lessonIds, {
      completedLessonIds: ["lesson-2-01"],
      currentLessonId: "lesson-2-01",
    });
    const hypotheticalNewSlug = "a-better-public-title";
    expect(hypotheticalNewSlug).not.toBe(lessonRouteById["lesson-2-01"].slug);
    expect(before.completedLessonCount).toBe(1);
    expect(before.currentLessonId).toBe("lesson-2-01");
  });

  it("provides real previous and next routes within each module", () => {
    expect(previousAndNextLessons("lesson-01").previous).toBeNull();
    expect(previousAndNextLessons("lesson-01").next?.lessonId).toBe("lesson-02");
    expect(previousAndNextLessons("lesson-2-01").next?.path).toMatch(/^\/module-2\//);
  });

  it("keeps all module and useful chapter pages connected", () => {
    expect(academyModuleRoutes.map((module) => module.moduleSlug)).toEqual([
      "module-1",
      "module-2",
      "module-3",
    ]);
    expect(academyChapterRoutes.length).toBeGreaterThan(20);
    expect(academyChapterRoutes.every((chapter) => chapter.lessons.length > 0)).toBe(true);
  });

  it("gives every lesson page unique title and description metadata", () => {
    expect(new Set(academyLessonRoutes.map((lesson) => lesson.seoTitle)).size).toBe(
      academyLessonRoutes.length,
    );
    expect(new Set(academyLessonRoutes.map((lesson) => lesson.seoDescription)).size).toBe(
      academyLessonRoutes.length,
    );
  });

  it("generates a canonical sitemap without private, hash, or duplicate URLs", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).not.toContain(
      "https://kaskevich.github.io/remote-sensing-scientist-academy/sitemap.xml",
    );
    expect(urls).toContain(
      "https://kaskevich.github.io/remote-sensing-scientist-academy/",
    );
    expect(urls).toContain(lessonRouteById["lesson-2-01"].canonicalUrl);
    expect(urls.some((url) => url.includes("#") || url.includes("/admin/"))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
