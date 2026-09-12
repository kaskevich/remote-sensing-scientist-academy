import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hyperspectralFieldLabPath, hyperspectralSignatures, hyperspectralWorkflowSteps } from "@/lib/hyperspectral-field-lab";

describe("Field Lab 10 hyperspectral release", () => {
  it("publishes the cube-to-map workflow and checklist", () => {
    expect(hyperspectralFieldLabPath).toBe("/field-labs/hyperspectral-signatures/");
    expect(hyperspectralWorkflowSteps).toHaveLength(11);
    expect(hyperspectralWorkflowSteps.every((step) => step.action.length && step.check.length && step.output && step.fail)).toBe(true);
    expect(existsSync("app/field-labs/hyperspectral-signatures/page.tsx")).toBe(true);
    expect(existsSync("public/field-labs/hyperspectral-signatures/hyperspectral-evidence-checklist.md")).toBe(true);
  });
  it("matches the synthetic training signature fixture", () => {
    expect(hyperspectralSignatures).toHaveLength(20);
    expect(hyperspectralSignatures.filter((band) => band.bad).map((band) => band.wavelength)).toEqual([940, 1400, 1900, 2400]);
    const page = readFileSync("app/field-labs/hyperspectral-signatures/page.tsx", "utf8");
    expect(page).toContain("sparse synthetic teaching curves");
    expect(page).toContain("not species-identification evidence");
  });
  it("links Field Lab 10 across collection, navigator and sitemap", () => {
    expect(readFileSync("app/field-labs/page.tsx", "utf8")).toContain("Build a hyperspectral evidence pipeline");
    expect(readFileSync("lib/remote-sensing-topics.ts", "utf8")).toContain(hyperspectralFieldLabPath);
    expect(readFileSync("app/sitemap.ts", "utf8")).toContain("hyperspectralFieldLabPath");
  });
});
