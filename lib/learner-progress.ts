export const LEARNER_PROGRESS_STORAGE_KEY = "rs-academy:learner-progress:v1";

export type LearnerProgressState = {
  version: 1;
  completedLessonIds: string[];
  currentLessonId: string | null;
  lessonNotes: Record<string, string>;
  lastActivityTimestamp: string | null;
};

export type StorageLoadStatus = "empty" | "ok" | "recovered" | "unavailable";

export type StorageLoadResult = {
  state: LearnerProgressState;
  status: StorageLoadStatus;
};

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LearnerProgressStorage {
  load(): StorageLoadResult;
  save(state: LearnerProgressState): boolean;
  reset(): boolean;
}

export type ProgressSummary = {
  totalLessonCount: number;
  completedLessonCount: number;
  completionPercent: number;
  currentLessonId: string | null;
  nextIncompleteLessonId: string | null;
};

export function createEmptyLearnerProgress(): LearnerProgressState {
  return {
    version: 1,
    completedLessonIds: [],
    currentLessonId: null,
    lessonNotes: {},
    lastActivityTimestamp: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isStoredProgress(value: unknown): value is LearnerProgressState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 1 &&
    Array.isArray(value.completedLessonIds) &&
    value.completedLessonIds.every((lessonId) => typeof lessonId === "string") &&
    (value.currentLessonId === null || typeof value.currentLessonId === "string") &&
    isRecord(value.lessonNotes) &&
    Object.values(value.lessonNotes).every((note) => typeof note === "string") &&
    (value.lastActivityTimestamp === null || isValidTimestamp(value.lastActivityTimestamp))
  );
}

function normalizeProgress(value: unknown): LearnerProgressState {
  if (!isRecord(value)) {
    return createEmptyLearnerProgress();
  }

  const completedLessonIds = Array.isArray(value.completedLessonIds)
    ? Array.from(
        new Set(value.completedLessonIds.filter((lessonId): lessonId is string => typeof lessonId === "string")),
      )
    : [];

  const lessonNotes: Record<string, string> = {};
  if (isRecord(value.lessonNotes)) {
    for (const [lessonId, note] of Object.entries(value.lessonNotes)) {
      if (typeof note === "string") {
        lessonNotes[lessonId] = note;
      }
    }
  }

  return {
    version: 1,
    completedLessonIds,
    currentLessonId: typeof value.currentLessonId === "string" ? value.currentLessonId : null,
    lessonNotes,
    lastActivityTimestamp: isValidTimestamp(value.lastActivityTimestamp)
      ? value.lastActivityTimestamp
      : null,
  };
}

export class LocalStorageLearnerProgressAdapter implements LearnerProgressStorage {
  constructor(
    private readonly storage: StorageLike | null,
    private readonly storageKey = LEARNER_PROGRESS_STORAGE_KEY,
  ) {}

  load(): StorageLoadResult {
    if (!this.storage) {
      return { state: createEmptyLearnerProgress(), status: "unavailable" };
    }

    try {
      const storedValue = this.storage.getItem(this.storageKey);
      if (storedValue === null) {
        return { state: createEmptyLearnerProgress(), status: "empty" };
      }

      const parsedValue: unknown = JSON.parse(storedValue);
      if (isStoredProgress(parsedValue)) {
        return { state: normalizeProgress(parsedValue), status: "ok" };
      }

      const recoveredState = normalizeProgress(parsedValue);
      this.storage.setItem(this.storageKey, JSON.stringify(recoveredState));
      return { state: recoveredState, status: "recovered" };
    } catch {
      try {
        this.storage.removeItem(this.storageKey);
      } catch {
        // Storage may be blocked entirely. Returning a safe empty state is enough.
      }

      return { state: createEmptyLearnerProgress(), status: "recovered" };
    }
  }

  save(state: LearnerProgressState): boolean {
    if (!this.storage) {
      return false;
    }

    try {
      this.storage.setItem(this.storageKey, JSON.stringify(normalizeProgress(state)));
      return true;
    } catch {
      return false;
    }
  }

  reset(): boolean {
    if (!this.storage) {
      return false;
    }

    try {
      this.storage.removeItem(this.storageKey);
      return true;
    } catch {
      return false;
    }
  }
}

export function createBrowserLearnerProgressStorage(): LearnerProgressStorage {
  try {
    return new LocalStorageLearnerProgressAdapter(window.localStorage);
  } catch {
    return new LocalStorageLearnerProgressAdapter(null);
  }
}

export function calculateProgress(
  lessonIds: readonly string[],
  state: Pick<LearnerProgressState, "completedLessonIds" | "currentLessonId">,
): ProgressSummary {
  const availableLessonIds = new Set(lessonIds);
  const completedLessonIds = new Set(
    state.completedLessonIds.filter((lessonId) => availableLessonIds.has(lessonId)),
  );
  const firstIncompleteLessonId = lessonIds.find((lessonId) => !completedLessonIds.has(lessonId)) ?? null;
  const currentLessonId =
    state.currentLessonId && availableLessonIds.has(state.currentLessonId)
      ? state.currentLessonId
      : firstIncompleteLessonId ?? lessonIds.at(-1) ?? null;

  return {
    totalLessonCount: lessonIds.length,
    completedLessonCount: completedLessonIds.size,
    completionPercent:
      lessonIds.length === 0 ? 0 : Math.round((completedLessonIds.size / lessonIds.length) * 100),
    currentLessonId,
    nextIncompleteLessonId: firstIncompleteLessonId,
  };
}

export function getNextIncompleteLessonId(
  lessonIds: readonly string[],
  completedLessonIds: readonly string[],
  currentLessonId: string,
): string | null {
  const completed = new Set(completedLessonIds);
  const currentIndex = lessonIds.indexOf(currentLessonId);
  const orderedCandidates = [
    ...lessonIds.slice(Math.max(currentIndex + 1, 0)),
    ...lessonIds.slice(0, Math.max(currentIndex + 1, 0)),
  ];

  return orderedCandidates.find((lessonId) => !completed.has(lessonId)) ?? null;
}
