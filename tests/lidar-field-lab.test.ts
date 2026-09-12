import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { lidarFieldLabPath, lidarProfilePoints, lidarWorkflowSteps } from "@/lib/lidar-field-lab";

describe("Field Lab 09 LiDAR release", () => {
  it("publishes a complete point-to-structure workflow", () => {
    expect(lidarFieldLabPath).toBe("/field-labs/lidar-canopy-structure/");
    expect(lidarWorkflowSteps).toHaveLength(10);
    expect(lidarWorkflowSteps.every((step) => step.what && step.action.length && step.input.length && step.output.length && step.check.length && step.failure)).toBe(true);
    expect(existsSync("app/field-labs/lidar-canopy-structure/page.tsx")).toBe(true);
    expect(existsSync("public/field-labs/lidar-canopy-structure/lidar-evidence-checklist.md")).toBe(true);
  });
  it("preserves the known synthetic outlier and evidence boundary", () => {
    expect(lidarProfilePoints.find((point) => !point.valid)?.height).toBe(10.56);
    const page = readFileSync("app/field-labs/lidar-canopy-structure/page.tsx", "utf8");
    expect(page).toContain("tiny synthetic teaching fixture");
    expect(page).toContain("photogrammetric point cloud ≠ LiDAR point cloud");
    expect(page).toContain("Cannot automatically support");
  });
  it("links the lab from collection, navigator and sitemap", () => {
    expect(readFileSync("app/field-labs/page.tsx", "utf8")).toContain("Build defensible LiDAR canopy structure");
    expect(readFileSync("lib/remote-sensing-topics.ts", "utf8")).toContain(lidarFieldLabPath);
    expect(readFileSync("app/sitemap.ts", "utf8")).toContain("lidarFieldLabPath");
  });
});
