import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const site = JSON.parse(
  readFileSync(join(process.cwd(), "content/site.json"), "utf8"),
) as {
  pathsSection: {
    kicker: string;
    titleLineOne: string;
    titleLineTwo: string;
    summary: string;
    items: Array<{
      number: string;
      label: string;
      title: string;
      description: string;
      skills: string[];
      build: string;
      outcome: string;
      ctaLabel: string;
    }>;
  };
};

describe("homepage Academy pathway", () => {
  it("presents one sequential three-stage journey", () => {
    expect(site.pathsSection.kicker).toBe("ONE JOURNEY · THREE STAGES");
    expect(`${site.pathsSection.titleLineOne} ${site.pathsSection.titleLineTwo}`).toBe(
      "From beginner to Earth Observation professional",
    );
    expect(site.pathsSection.summary).toBe(
      "Everything you build becomes part of your professional portfolio",
    );
    expect(site.pathsSection.items.map(({ number, label }) => ({ number, label }))).toEqual([
      { number: "01", label: "FOUNDATIONS" },
      { number: "02", label: "GEOSPATIAL" },
      { number: "03", label: "MODELLING" },
    ]);
  });

  it("gives every stage the same scannable information structure", () => {
    for (const stage of site.pathsSection.items) {
      expect(stage.description.length).toBeGreaterThan(20);
      expect(stage.skills).toHaveLength(4);
      expect(stage.build).toBeTruthy();
      expect(stage.outcome).toBeTruthy();
      expect(stage.ctaLabel).toMatch(/^Explore /);
    }
  });

  it("uses accurate modelling language without unsupported claims", () => {
    const copy = JSON.stringify(site.pathsSection);
    expect(copy).toContain("Remote Sensing Modelling");
    expect(copy).not.toMatch(
      /Remote Sensing AI|Deep Learning|GIS Developer|world-class|industry-leading|unlock your potential|become an expert|guaranteed career outcome/i,
    );
  });
});
