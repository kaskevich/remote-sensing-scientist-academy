import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { sarComparabilityRows, sarFieldLabPath, sarThresholdCases, sarWorkflowSteps } from "@/lib/sar-field-lab";

describe("Field Lab 08 SAR release", () => {
  it("publishes the route, workflow and downloadable checklist", () => {
    expect(sarFieldLabPath).toBe("/field-labs/sar-wetland-inundation/");
    expect(existsSync("app/field-labs/sar-wetland-inundation/page.tsx")).toBe(true);
    expect(existsSync("public/field-labs/sar-wetland-inundation/sar-evidence-checklist.md")).toBe(true);
    expect(sarWorkflowSteps).toHaveLength(11);
    expect(sarWorkflowSteps.every((step) => step.what && step.action.length && step.where && step.why && step.input.length && step.output.length && step.check.length && step.failure && step.next)).toBe(true);
  });

  it("keeps measurement, classification and interpretation distinct", () => {
    const page = readFileSync("app/field-labs/sar-wetland-inundation/page.tsx", "utf8");
    expect(page).toContain("dark pixels for proof");
    expect(page).toContain("not direct water depth or soil moisture");
    expect(page).toContain("synthetic");
    expect(sarThresholdCases.map((item) => item.expected)).toEqual(["candidate", "exclude", "review", "exclude"]);
  });

  it("contains accept, review and reject comparability decisions", () => {
    expect(new Set(sarComparabilityRows.map((row) => row.decision))).toEqual(new Set(["accept", "review", "reject"]));
  });

  it("links Field Lab 08 from the collection and navigator", () => {
    expect(readFileSync("app/field-labs/page.tsx", "utf8")).toContain("Map wetland inundation with Sentinel-1");
    expect(readFileSync("lib/remote-sensing-topics.ts", "utf8")).toContain("/field-labs/sar-wetland-inundation/");
    expect(readFileSync("app/sitemap.ts", "utf8")).toContain("sarFieldLabPath");
  });
});
