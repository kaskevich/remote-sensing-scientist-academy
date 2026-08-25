import type { MetadataRoute } from "next";
import {
  academyChapterRoutes,
  academyLessonRoutes,
  academyModuleRoutes,
} from "@/lib/academy-routes";
import { academyUrl } from "@/lib/site-paths";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-25T00:00:00.000Z");
  const general: MetadataRoute.Sitemap = [
    { url: academyUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: academyUrl("/curriculum/"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: academyUrl("/about/"), lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
  const modules = academyModuleRoutes.map((module) => ({
    url: academyUrl(module.path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));
  const chapters = academyChapterRoutes.map((chapter) => ({
    url: academyUrl(chapter.path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));
  const lessons = academyLessonRoutes.map((lesson) => ({
    url: academyUrl(lesson.path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...general, ...modules, ...chapters, ...lessons];
}
