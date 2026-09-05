import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  droneLabPath,
  droneSteps,
  flightConfiguration,
  operationalChecklist,
  sequoiaBands,
  uavFieldLabPath,
  uavOutputs,
  vegetationIndices,
} from "@/lib/uav-field-lab";

const releaseFiles = [
  "app/field-labs/page.tsx",
  "app/field-labs/uav-coastal-wetlands/page.tsx",
  "app/field-labs/uav-coastal-wetlands/drone-lab/page.tsx",
  "public/field-labs/uav-coastal-wetlands/ebee-postflight-checklist.md",
];

describe("Field Lab 07 release", () => {
  it("publishes the full route and download set", () => {
    expect(uavFieldLabPath).toBe("/field-labs/uav-coastal-wetlands/");
    expect(droneLabPath).toBe("/field-labs/uav-coastal-wetlands/drone-lab/");
    for (const file of releaseFiles) expect(existsSync(file), file).toBe(true);
  });

  it("retains the verified acquisition and sensor details", () => {
    expect(flightConfiguration).toHaveLength(3);
    expect(flightConfiguration[0]).toMatchObject({ altitude: "106–109 m AGL", gsd: "≈10 cm/pixel" });
    expect(flightConfiguration[1]).toMatchObject({ altitude: "119–125 m AGL", gsd: "≈2.7 cm/pixel" });
    expect(flightConfiguration[2]).toMatchObject({ gsd: "≈15.6 cm/pixel" });
    expect(sequoiaBands.map((band) => band.centre)).toEqual(["550 nm", "660 nm", "735 nm", "790 nm"]);
  });

  it("uses the exact documented predictor formulas", () => {
    expect(vegetationIndices.map((index) => index.id)).toEqual([
      "NDVI", "GNDVI", "SAVI", "MSAVI", "RNDVI", "RTVIcore", "SRe", "CIre",
    ]);
    expect(vegetationIndices.find((index) => index.id === "RNDVI")?.name).toContain("Renormalized");
    expect(vegetationIndices.find((index) => index.id === "SAVI")?.formula).toContain("0.5");
  });

  it("provides a complete gated post-flight workflow", () => {
    expect(droneSteps).toHaveLength(21);
    expect(droneSteps.map((step) => step.number)).toEqual(
      Array.from({ length: 21 }, (_, index) => String(index).padStart(2, "0")),
    );
    expect(droneSteps.every((step) => step.action && step.why && step.expected && step.check && step.stop)).toBe(true);
    expect(droneSteps.some((step) => step.action.includes("EPSG:3301"))).toBe(true);
    expect(operationalChecklist.length).toBeGreaterThanOrEqual(15);
    expect(uavOutputs).toHaveLength(9);
  });

  it("does not expose credentials, local paths or private URLs", () => {
    const publicText = releaseFiles.map((file) => readFileSync(file, "utf8")).join("\n");
    expect(publicText).not.toMatch(/(?:\/Users\/|C:\\Users\\)/i);
    expect(publicText).not.toMatch(/\b(?:user(?:name)?|password)\s*:\s*\S+/i);
    expect(publicText).not.toMatch(/https?:\/\/(?:localhost|127\.0\.0\.1|[^\s/]*\.local)(?:[/:]|\b)/i);
  });
});
