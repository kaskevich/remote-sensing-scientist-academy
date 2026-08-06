import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const site = JSON.parse(
  readFileSync(join(process.cwd(), "content/site.json"), "utf8"),
) as {
  hero: { title: string; accentTitle: string };
  pathsSection: { titleLineTwo: string; summary: string };
  fieldLab: { title: string };
  curriculum: { titleLineTwo: string };
  outcomes: { title: string };
  footer: { manifesto: string };
};

describe("homepage slogan punctuation", () => {
  it("keeps slogan-style copy free from full stops", () => {
    const slogans = [
      site.hero.title,
      site.hero.accentTitle,
      site.pathsSection.titleLineTwo,
      site.pathsSection.summary,
      site.fieldLab.title,
      site.curriculum.titleLineTwo,
      site.outcomes.title,
      site.footer.manifesto,
    ];

    for (const slogan of slogans) {
      expect(slogan).not.toContain(".");
    }
  });
});
