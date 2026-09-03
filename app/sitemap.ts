import type { MetadataRoute } from "next";
import { seoLessons, seoModules } from "@/lib/seo-curriculum";
import { academyUrl } from "@/lib/site-paths";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-25T00:00:00.000Z");
  const projectLastModified = new Date("2026-09-03T00:00:00.000Z");
  return [
    { url: academyUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: academyUrl("/curriculum/"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: academyUrl("/about/"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    {
      url: academyUrl("/projects/track-recovery-after-fire/"),
      lastModified: projectLastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...seoModules.map((module) => ({
      url: module.canonicalUrl,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...seoLessons.map((lesson) => ({
      url: lesson.canonicalUrl,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
