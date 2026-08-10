import { describe, expect, it } from "vitest";
import {
  LEARNER_PROGRESS_STORAGE_KEY,
  LocalStorageLearnerProgressAdapter,
  calculateChapterProgress,
  calculateProgress,
  createEmptyLearnerProgress,
  getNextIncompleteLessonId,
  type LearnerProgressState,
  type StorageLike,
} from "../lib/learner-progress";

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const savedProgress: LearnerProgressState = {
  version: 1,
  completedLessonIds: ["lesson-01"],
  currentLessonId: "lesson-02",
  lessonNotes: {
    "lesson-01": "Review atmospheric correction.",
  },
  lastActivityTimestamp: "2026-07-26T12:00:00.000Z",
};

describe("LocalStorageLearnerProgressAdapter", () => {
  it("saves and reloads learner progress", () => {
    const storage = new MemoryStorage();
    const adapter = new LocalStorageLearnerProgressAdapter(storage);

    expect(adapter.save(savedProgress)).toBe(true);
    expect(adapter.load()).toEqual({ state: savedProgress, status: "ok" });
  });

  it("recovers safely from corrupted JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(LEARNER_PROGRESS_STORAGE_KEY, "{this is not valid JSON");
    const adapter = new LocalStorageLearnerProgressAdapter(storage);

    expect(adapter.load()).toEqual({
      state: createEmptyLearnerProgress(),
      status: "recovered",
    });
    expect(storage.getItem(LEARNER_PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("does not throw when browser storage is unavailable", () => {
    const unavailableStorage: StorageLike = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    };
    const adapter = new LocalStorageLearnerProgressAdapter(unavailableStorage);

    expect(adapter.load()).toEqual({
      state: createEmptyLearnerProgress(),
      status: "recovered",
    });
    expect(adapter.save(savedProgress)).toBe(false);
    expect(adapter.reset()).toBe(false);
  });
});

describe("progress calculation", () => {
  const lessonIds = ["lesson-01", "lesson-02", "lesson-03"];

  it("calculates completion and keeps a valid current lesson", () => {
    expect(calculateProgress(lessonIds, savedProgress)).toEqual({
      totalLessonCount: 3,
      completedLessonCount: 1,
      completionPercent: 33,
      currentLessonId: "lesson-02",
      nextIncompleteLessonId: "lesson-02",
    });
  });

  it("falls back to the first incomplete lesson when the current ID is invalid", () => {
    expect(
      calculateProgress(lessonIds, {
        completedLessonIds: ["lesson-01", "unknown-lesson"],
        currentLessonId: "unknown-lesson",
      }),
    ).toMatchObject({
      completedLessonCount: 1,
      completionPercent: 33,
      currentLessonId: "lesson-02",
    });
  });

  it("finds the next incomplete lesson in curriculum order", () => {
    expect(getNextIncompleteLessonId(lessonIds, ["lesson-01", "lesson-02"], "lesson-02")).toBe(
      "lesson-03",
    );
    expect(getNextIncompleteLessonId(lessonIds, lessonIds, "lesson-03")).toBeNull();
  });

  it("calculates chapter progress from lessons and an unnumbered practicum", () => {
    const chapterItems = ["lesson-2-01", "lesson-2-02", "module-2-chapter-1-practicum"];
    expect(calculateChapterProgress(chapterItems, [
      "lesson-2-01",
      "module-2-chapter-1-practicum",
      "another-module-item",
    ])).toEqual({
      totalItemCount: 3,
      completedItemCount: 2,
      completionPercent: 67,
    });
  });

  it("returns safe zero chapter progress when no items are available", () => {
    expect(calculateChapterProgress([], ["unknown"])).toEqual({
      totalItemCount: 0,
      completedItemCount: 0,
      completionPercent: 0,
    });
  });
});
