import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LocalStorageLearnerProgressAdapter,
  createBrowserLearnerProgressStorage,
  createEmptyLearnerProgress,
  type LearnerProgressState,
  type StorageLoadResult,
  type StorageLoadStatus,
} from "./learner-progress";

export type AsyncStorageLoadResult = StorageLoadResult & {
  status: StorageLoadStatus;
};

export interface LearnerDataProvider {
  readonly mode: "guest" | "authenticated";
  load(): Promise<AsyncStorageLoadResult>;
  save(state: LearnerProgressState): Promise<boolean>;
  reset(): Promise<boolean>;
}

export class GuestLearnerDataProvider implements LearnerDataProvider {
  readonly mode = "guest" as const;

  constructor(
    private readonly adapter = createBrowserLearnerProgressStorage(),
  ) {}

  async load() {
    return this.adapter.load();
  }

  async save(state: LearnerProgressState) {
    return this.adapter.save(state);
  }

  async reset() {
    return this.adapter.reset();
  }
}

function latestTimestamp(timestamps: Array<string | null | undefined>) {
  return timestamps
    .filter((value): value is string => typeof value === "string")
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0] ?? null;
}

export class SupabaseLearnerDataProvider implements LearnerDataProvider {
  readonly mode = "authenticated" as const;
  private knownLessonIds = new Set<string>();

  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async load(): Promise<AsyncStorageLoadResult> {
    const [progressResponse, notesResponse] = await Promise.all([
      this.client
        .from("lesson_progress")
        .select("lesson_id,completed,is_current,updated_at")
        .eq("user_id", this.userId),
      this.client
        .from("lesson_notes")
        .select("lesson_id,note,updated_at")
        .eq("user_id", this.userId),
    ]);

    if (progressResponse.error || notesResponse.error) {
      return { state: createEmptyLearnerProgress(), status: "unavailable" };
    }

    const progressRows = (progressResponse.data ?? []) as Array<Record<string, unknown>>;
    const noteRows = (notesResponse.data ?? []) as Array<Record<string, unknown>>;
    this.knownLessonIds = new Set([
      ...progressRows.map((row) => String(row.lesson_id)),
      ...noteRows.map((row) => String(row.lesson_id)),
    ]);

    if (progressRows.length === 0 && noteRows.length === 0) {
      return { state: createEmptyLearnerProgress(), status: "empty" };
    }

    const lessonNotes: Record<string, string> = {};
    for (const row of noteRows) {
      if (typeof row.lesson_id === "string" && typeof row.note === "string") {
        lessonNotes[row.lesson_id] = row.note;
      }
    }

    return {
      status: "ok",
      state: {
        version: 1,
        completedLessonIds: progressRows
          .filter((row) => row.completed === true)
          .map((row) => String(row.lesson_id)),
        currentLessonId:
          progressRows.find((row) => row.is_current === true)?.lesson_id?.toString() ?? null,
        lessonNotes,
        lastActivityTimestamp: latestTimestamp([
          ...progressRows.map((row) =>
            typeof row.updated_at === "string" ? row.updated_at : null,
          ),
          ...noteRows.map((row) =>
            typeof row.updated_at === "string" ? row.updated_at : null,
          ),
        ]),
      },
    };
  }

  async save(state: LearnerProgressState) {
    const allLessonIds = new Set([
      ...this.knownLessonIds,
      ...state.completedLessonIds,
      ...Object.keys(state.lessonNotes),
      ...(state.currentLessonId ? [state.currentLessonId] : []),
    ]);
    const updatedAt = state.lastActivityTimestamp ?? new Date().toISOString();

    const clearCurrent = await this.client
      .from("lesson_progress")
      .update({ is_current: false, updated_at: updatedAt })
      .eq("user_id", this.userId)
      .eq("is_current", true);
    if (clearCurrent.error) return false;

    const progressRows = Array.from(allLessonIds).map((lessonId) => ({
      user_id: this.userId,
      lesson_id: lessonId,
      completed: state.completedLessonIds.includes(lessonId),
      is_current: lessonId === state.currentLessonId,
      updated_at: updatedAt,
    }));
    if (progressRows.length > 0) {
      const { error } = await this.client
        .from("lesson_progress")
        .upsert(progressRows, { onConflict: "user_id,lesson_id" });
      if (error) return false;
    }

    const noteRows = Array.from(allLessonIds).map((lessonId) => ({
      user_id: this.userId,
      lesson_id: lessonId,
      note: state.lessonNotes[lessonId] ?? "",
      updated_at: updatedAt,
    }));
    if (noteRows.length > 0) {
      const { error } = await this.client
        .from("lesson_notes")
        .upsert(noteRows, { onConflict: "user_id,lesson_id" });
      if (error) return false;
    }

    this.knownLessonIds = allLessonIds;
    return true;
  }

  async reset() {
    const [progressResult, notesResult] = await Promise.all([
      this.client.from("lesson_progress").delete().eq("user_id", this.userId),
      this.client.from("lesson_notes").delete().eq("user_id", this.userId),
    ]);
    if (progressResult.error || notesResult.error) return false;
    this.knownLessonIds.clear();
    return true;
  }
}

export function createGuestLearnerDataProvider() {
  return new GuestLearnerDataProvider();
}

export function createAuthenticatedLearnerDataProvider(
  client: SupabaseClient,
  userId: string,
) {
  return new SupabaseLearnerDataProvider(client, userId);
}

export function hasMeaningfulGuestProgress(state: LearnerProgressState) {
  return (
    state.completedLessonIds.length > 0 ||
    state.currentLessonId !== null ||
    Object.values(state.lessonNotes).some((note) => note.trim().length > 0)
  );
}

export function mergeLearnerProgress(
  guest: LearnerProgressState,
  authenticated: LearnerProgressState,
): LearnerProgressState {
  const lessonNotes = { ...authenticated.lessonNotes };
  for (const [lessonId, note] of Object.entries(guest.lessonNotes)) {
    if (note.trim()) lessonNotes[lessonId] = note;
  }

  return {
    version: 1,
    completedLessonIds: Array.from(
      new Set([...authenticated.completedLessonIds, ...guest.completedLessonIds]),
    ),
    currentLessonId: guest.currentLessonId ?? authenticated.currentLessonId,
    lessonNotes,
    lastActivityTimestamp: latestTimestamp([
      guest.lastActivityTimestamp,
      authenticated.lastActivityTimestamp,
    ]),
  };
}

export async function migrateGuestProgressToAccount(
  guestProvider: LearnerDataProvider,
  authenticatedProvider: LearnerDataProvider,
) {
  const [guest, authenticated] = await Promise.all([
    guestProvider.load(),
    authenticatedProvider.load(),
  ]);
  if (guest.status === "unavailable" || authenticated.status === "unavailable") {
    return false;
  }

  return authenticatedProvider.save(mergeLearnerProgress(guest.state, authenticated.state));
}

export function createTestGuestLearnerDataProvider(storage: Storage) {
  return new GuestLearnerDataProvider(new LocalStorageLearnerProgressAdapter(storage));
}
