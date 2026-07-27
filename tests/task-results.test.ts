import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { buildGeoJsonDrawing, collectGeoJsonShapes, isDisplayableGeoJson } from "../lib/geojson";
import {
  IndexedDbTaskResultStorage,
  TASK_RESULTS_STORE_NAME,
  createEmptyTaskResult,
  type TaskResult,
} from "../lib/task-results";

function openDatabase(indexedDb: IDBFactory, databaseName: string) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDb.open(databaseName, 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function completeTransaction(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

describe("IndexedDbTaskResultStorage", () => {
  it("saves and reloads task text, imagery, and GeoJSON", async () => {
    const indexedDb = new IDBFactory();
    const storage = new IndexedDbTaskResultStorage(indexedDb, "task-results-save-test");
    const result: TaskResult = {
      version: 1,
      lessonId: "lesson-01",
      text: "Vegetation recovery is strongest in the eastern area.",
      attachments: [
        {
          id: "image-1",
          kind: "image",
          name: "recovery.png",
          mimeType: "image/png",
          size: 4,
          blob: new Blob(["test"], { type: "image/png" }),
        },
        {
          id: "map-1",
          kind: "geojson",
          name: "recovery.geojson",
          mimeType: "application/geo+json",
          size: 120,
          geojson: {
            type: "Feature",
            properties: {},
            geometry: { type: "Point", coordinates: [24.75, 59.44] },
          },
        },
      ],
      lastActivityTimestamp: "2026-07-27T10:00:00.000Z",
    };

    expect(await storage.save(result)).toBe(true);
    const loaded = await storage.load("lesson-01");

    expect(loaded.status).toBe("ok");
    expect(loaded.result.text).toBe(result.text);
    expect(loaded.result.attachments).toHaveLength(2);
    expect(loaded.result.attachments[0]).toMatchObject({ kind: "image", name: "recovery.png" });
    expect(loaded.result.attachments[1]).toMatchObject({ kind: "geojson", name: "recovery.geojson" });
  });

  it("recovers malformed task records without throwing", async () => {
    const indexedDb = new IDBFactory();
    const databaseName = "task-results-recovery-test";
    const storage = new IndexedDbTaskResultStorage(indexedDb, databaseName);
    await storage.load("lesson-02");

    const database = await openDatabase(indexedDb, databaseName);
    const transaction = database.transaction(TASK_RESULTS_STORE_NAME, "readwrite");
    transaction.objectStore(TASK_RESULTS_STORE_NAME).put({
      lessonId: "lesson-02",
      version: "wrong",
      text: 42,
      attachments: ["broken"],
    });
    await completeTransaction(transaction);

    expect(await storage.load("lesson-02")).toEqual({
      result: createEmptyTaskResult("lesson-02"),
      status: "recovered",
    });
  });

  it("returns a safe unavailable result without IndexedDB", async () => {
    const storage = new IndexedDbTaskResultStorage(null);

    expect(await storage.load("lesson-03")).toEqual({
      result: createEmptyTaskResult("lesson-03"),
      status: "unavailable",
    });
    expect(await storage.save(createEmptyTaskResult("lesson-03"))).toBe(false);
    expect(await storage.resetLesson("lesson-03")).toBe(false);
  });
});

describe("GeoJSON rendering", () => {
  const collection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[[24, 59], [25, 59], [25, 60], [24, 60], [24, 59]]],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [24.75, 59.44] },
      },
    ],
  };

  it("extracts and projects displayable map geometry", () => {
    expect(isDisplayableGeoJson(collection)).toBe(true);
    expect(collectGeoJsonShapes(collection)).toHaveLength(2);

    const drawing = buildGeoJsonDrawing(collection);
    expect(drawing?.shapes).toHaveLength(2);
    expect(drawing?.bounds).toEqual([24, 59, 25, 60]);
  });

  it("rejects JSON without displayable geometry", () => {
    expect(isDisplayableGeoJson({ type: "FeatureCollection", features: [] })).toBe(false);
    expect(buildGeoJsonDrawing({ type: "FeatureCollection", features: [] })).toBeNull();
  });
});
