import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { seoLessons } from "../lib/seo-curriculum";
import {
  remoteSensingLessonDomains,
  remoteSensingTopics,
  sensorChoiceScenarios,
} from "../lib/remote-sensing-topics";

const expectedIds = ["optical", "sar", "lidar", "thermal", "hyperspectral", "spatial-analysis"];
const nonLessonRoutes = new Set([
  "/projects/track-recovery-after-fire/",
  "/field-labs/uav-coastal-wetlands/",
  "/field-labs/uav-coastal-wetlands/drone-lab/",
  "/field-labs/sar-wetland-inundation/",
  "/field-labs/lidar-canopy-structure/",
  "/species/from-field-to-earth-observation/",
]);

describe("Remote Sensing topic navigator", () => {
  it("publishes the six stable topics with a complete shared content model", () => {
    expect(remoteSensingTopics.map((topic) => topic.id)).toEqual(expectedIds);
    for (const topic of remoteSensingTopics) {
      expect(topic.definition.length).toBeGreaterThan(80);
      expect(topic.measurement.length).toBeGreaterThan(30);
      expect(topic.commonData.length).toBeGreaterThanOrEqual(4);
      expect(topic.applications.length).toBeGreaterThanOrEqual(4);
      expect(topic.limitations.length).toBeGreaterThanOrEqual(2);
      expect(topic.status.length).toBeGreaterThanOrEqual(2);
      expect(topic.links.start.length).toBeGreaterThan(0);
    }
  });

  it("uses only routes present in the published lesson registry or verified public features", () => {
    const lessonRoutes = new Set(seoLessons.map((lesson) => lesson.path));
    const links = remoteSensingTopics.flatMap((topic) => [
      ...topic.links.start,
      ...topic.links.deeper,
      ...topic.links.practice,
    ]);

    expect(links).toHaveLength(28);
    for (const link of links) {
      expect(lessonRoutes.has(link.href) || nonLessonRoutes.has(link.href), link.href).toBe(true);
    }
  });

  it("keeps the required scientific boundaries explicit", () => {
    const copy = JSON.stringify(remoteSensingTopics).toLowerCase();
    for (const boundary of [
      "optical is one remote-sensing family",
      "multispectral ≠ hyperspectral",
      "thermal ≠ reflectance",
      "sar is not an optical image",
      "photogrammetric point cloud ≠ lidar point cloud",
      "spatial analysis ≠ sensor",
      "backscatter ≠ one physical property",
      "spectral signature ≠ automatic species id",
      "index ≠ trait",
    ]) expect(copy).toContain(boundary);
  });

  it("covers every topic in the sensor-choice exercise", () => {
    expect(sensorChoiceScenarios.map((scenario) => scenario.best)).toEqual(expectedIds);
    for (const scenario of sensorChoiceScenarios) {
      expect(scenario.why).toBeTruthy();
      expect(scenario.alternatives).toBeTruthy();
      expect(scenario.limitation).toBeTruthy();
    }
  });

  it("adds backlinks only to six highly relevant lesson routes", () => {
    expect(Object.keys(remoteSensingLessonDomains)).toHaveLength(6);
    for (const [slug, topicId] of Object.entries(remoteSensingLessonDomains)) {
      expect(seoLessons.some((lesson) => lesson.slug === slug), slug).toBe(true);
      expect(expectedIds).toContain(topicId);
    }
  });

  it("leaves both existing field labs unchanged", () => {
    const fieldLab = readFileSync("app/field-labs/uav-coastal-wetlands/page.tsx", "utf8");
    const fieldLab06 = readFileSync("app/projects/track-recovery-after-fire/page.tsx", "utf8");
    expect(fieldLab).toContain("Field Lab 07");
    expect(fieldLab06).toContain("Field Lab 06");
  });
});
