import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { advancedThermalLessonPath, advancedThermalSources, thermalWorkflowSteps } from "@/lib/advanced-thermal-lesson";

describe("standalone advanced thermal lesson", () => {
  it("publishes a complete question-to-release evidence workflow", () => {
    expect(advancedThermalLessonPath).toBe("/lessons/advanced-thermal-remote-sensing/");
    expect(thermalWorkflowSteps).toHaveLength(11);
    expect(thermalWorkflowSteps.every((step) => step.action.length >= 2 && step.check.length >= 2 && step.output && step.fail)).toBe(true);
    expect(existsSync("app/lessons/advanced-thermal-remote-sensing/page.tsx")).toBe(true);
  });

  it("keeps measurement, retrieval and interpretation boundaries explicit", () => {
    const page = [
      readFileSync("app/lessons/advanced-thermal-remote-sensing/page.tsx", "utf8"),
      readFileSync("app/components/thermal-lesson-interactions.tsx", "utf8"),
    ].join("\n");
    for (const boundary of ["THERMAL RADIANCE", "SURFACE TEMPERATURE", "STRESS OR ET", "LAND-SURFACE TEMPERATURE ≠ AIR TEMPERATURE", "A THERMAL PALETTE ≠ A THERMAL MEASUREMENT"]) {
      expect(page).toContain(boundary);
    }
    expect(page).toContain("dimensionless teaching proxy");
    expect(page).toContain("synthetic teaching records");
  });

  it("uses official USGS and NASA JPL references", () => {
    expect(Object.values(advancedThermalSources).every((url) => url.startsWith("https://"))).toBe(true);
    expect(advancedThermalSources.landsatSurfaceTemperature).toContain("usgs.gov");
    expect(advancedThermalSources.ecostressProducts).toContain("jpl.nasa.gov");
  });

  it("ships an auditable synthetic exercise and checklist", () => {
    const csv = readFileSync("public/lessons/advanced-thermal/synthetic-thermal-pixel-audit.csv", "utf8");
    expect(csv.split("\n").filter(Boolean)).toHaveLength(7);
    expect(csv).toContain("44947,0.00341802,149.0,302.63,29.48");
    expect(csv).toContain("fill_value,synthetic");
    expect(readFileSync("public/lessons/advanced-thermal/thermal-evidence-checklist.md", "utf8")).toContain("thermal is not automatically");
  });
});
