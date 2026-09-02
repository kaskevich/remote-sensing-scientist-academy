import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { seoLessons, seoModules } from "@/lib/seo-curriculum";
import { academyProductionBasePath } from "@/lib/site-paths";
import { creatorEntity, volhaKaskevich } from "@/lib/professional-identity";

function unique(values: string[]) {
  return new Set(values).size === values.length;
}

describe("Academy SEO architecture", () => {
  it("indexes the complete published curriculum", () => {
    expect(seoModules.map((module) => module.lessons.length)).toEqual([12, 66, 31]);
    expect(seoLessons).toHaveLength(109);
  });

  it("provides unique titles, slugs, paths and canonical URLs", () => {
    expect(unique(seoLessons.map((lesson) => lesson.pageTitle))).toBe(true);
    expect(unique(seoLessons.map((lesson) => lesson.path))).toBe(true);
    expect(unique(seoLessons.map((lesson) => lesson.canonicalUrl))).toBe(true);
    for (const academyModule of seoModules) {
      expect(unique(academyModule.lessons.map((lesson) => lesson.slug))).toBe(true);
    }
  });

  it("provides useful lesson metadata and crawlable educational content", () => {
    for (const lesson of seoLessons) {
      expect(lesson.title.trim().length, lesson.id).toBeGreaterThan(2);
      expect(lesson.description.length, lesson.id).toBeGreaterThanOrEqual(80);
      expect(lesson.description.length, lesson.id).toBeLessThanOrEqual(180);
      expect(lesson.content.length, lesson.id).toBeGreaterThan(500);
      expect(lesson.content, lesson.id).toMatch(/^##\s+/m);
      expect(lesson.path.endsWith("/")).toBe(true);
      expect(new URL(lesson.canonicalUrl).pathname).toContain(academyProductionBasePath);
    }
  });

  it("uses meaningful alt text for every Markdown learning image", () => {
    for (const lesson of seoLessons) {
      for (const match of lesson.content.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)) {
        expect(match[1].trim(), `${lesson.id} image alt`).not.toBe("");
        expect(match[1].trim().toLowerCase(), `${lesson.id} image alt`).not.toMatch(/^image\s*\d*$/);
      }
    }
  });

  it("generates a complete sitemap with no duplicate URLs", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(115);
    expect(unique(entries.map((entry) => entry.url))).toBe(true);
    expect(entries.some((entry) => entry.url.endsWith("/curriculum/"))).toBe(true);
    for (const lesson of seoLessons) {
      expect(entries.some((entry) => entry.url === lesson.canonicalUrl), lesson.id).toBe(true);
    }
  });

  it("allows public crawling, excludes admin and references the sitemap", () => {
    const policy = robots();
    expect(policy.sitemap).toBe("https://kaskevich.github.io/remote-sensing-scientist-academy/sitemap.xml");
    expect(policy.rules).toEqual({
      userAgent: "*",
      allow: "/remote-sensing-scientist-academy/",
      disallow: ["/remote-sensing-scientist-academy/admin/"],
    });
    expect(existsSync("app/robots.ts")).toBe(true);
    expect(existsSync("app/sitemap.ts")).toBe(true);
  });

  it("uses one verified creator identity across Academy schema", () => {
    const creator = creatorEntity();
    expect(creator.name).toBe("Volha Kaskevich");
    expect(creator.sameAs).toEqual([
      "https://github.com/kaskevich",
      "https://orcid.org/0000-0003-2801-4490",
      "https://www.etis.ee/CV/Volha_Kaskevich/eng/",
      "https://www.emu.ee/en/contacts/volha-kaskevich",
      "https://ee.linkedin.com/in/volha-kaskevich-b13439b3",
    ]);
    expect(creator.sameAs).toContain(volhaKaskevich.github);
  });
});
