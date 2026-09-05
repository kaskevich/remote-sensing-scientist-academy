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
  uavTutorialSteps,
  vegetationIndices,
} from "@/lib/uav-field-lab";

const releaseFiles = [
  "app/field-labs/page.tsx",
  "app/field-labs/uav-coastal-wetlands/page.tsx",
  "app/field-labs/uav-coastal-wetlands/drone-lab/page.tsx",
  "app/components/uav-field-lab-interactions.tsx",
  "public/field-labs/uav-coastal-wetlands/ebee-postflight-checklist.md",
  "public/field-labs/uav-coastal-wetlands/complete-mission-checklist.md",
  "public/field-labs/uav-coastal-wetlands/examples/provenance.json",
];

const projectExampleFiles = ["saardu-ndvi.png", "saardu-gndvi.png", "saardu-rndvi.png", "saardu-msavi.png", "saardu-dsm.png", "saardu-thermal.png"];

describe("Field Lab 07 release", () => {
  it("publishes the full route and download set", () => {
    expect(uavFieldLabPath).toBe("/field-labs/uav-coastal-wetlands/");
    expect(droneLabPath).toBe("/field-labs/uav-coastal-wetlands/drone-lab/");
    for (const file of releaseFiles) expect(existsSync(file), file).toBe(true);
    for (const file of projectExampleFiles) expect(existsSync(`public/field-labs/uav-coastal-wetlands/examples/${file}`), file).toBe(true);
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

  it("provides a chronological mission-to-handoff tutorial with all instructional fields", () => {
    expect(uavTutorialSteps).toHaveLength(22);
    expect(uavTutorialSteps.map((step) => step.number)).toEqual(
      Array.from({ length: 22 }, (_, index) => String(index + 1).padStart(2, "0")),
    );
    expect(uavTutorialSteps[0].title).toMatch(/Plan the mission/i);
    expect(uavTutorialSteps.at(-1)?.title).toMatch(/analysis-ready mission package/i);
    expect(uavTutorialSteps.every((step) =>
      step.what
      && step.action.length
      && step.where
      && step.why
      && step.input.length
      && step.output.length
      && step.check.length
      && step.failure
      && step.next
    )).toBe(true);
    expect(new Set(uavTutorialSteps.map((step) => step.phase))).toEqual(
      new Set(["PLAN", "ACQUIRE", "POSITION", "RECONSTRUCT", "PRODUCTS", "HANDOFF"]),
    );
  });

  it("does not expose credentials, local paths or private URLs", () => {
    const publicText = releaseFiles.map((file) => readFileSync(file, "utf8")).join("\n");
    expect(publicText).not.toMatch(/(?:\/Users\/|C:\\Users\\)/i);
    expect(publicText).not.toMatch(/\b(?:user(?:name)?|password)\s*:\s*\S+/i);
    expect(publicText).not.toMatch(/https?:\/\/(?:localhost|127\.0\.0\.1|[^\s/]*\.local)(?:[/:]|\b)/i);
  });

  it("publishes the explained pre-flight, expandable interactions and real-project provenance", () => {
    const interactions = readFileSync("app/components/uav-field-lab-interactions.tsx", "utf8");
    expect(interactions).toContain("Phase 0 · before the flight");
    expect(interactions).toContain("At home · before leaving");
    expect(interactions).toContain("On site · before launch");
    expect(interactions).toContain("2024 UAV field note");
    expect(interactions.match(/aria-expanded=/g)?.length).toBeGreaterThanOrEqual(2);
    expect(interactions).toContain("Same site, different measurement product");
    const provenance = JSON.parse(readFileSync("public/field-labs/uav-coastal-wetlands/examples/provenance.json", "utf8"));
    expect(provenance.site).toBe("Saardu");
    expect(provenance.examples).toHaveLength(6);
  });
});
