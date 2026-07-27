import { describe, expect, it } from "vitest";
import {
  hasMeaningfulGuestProgress,
  mergeLearnerProgress,
  migrateGuestProgressToAccount,
  type LearnerDataProvider,
} from "../lib/learner-data";
import { createEmptyLearnerProgress, type LearnerProgressState } from "../lib/learner-progress";

class MemoryLearnerProvider implements LearnerDataProvider {
  readonly mode: "guest" | "authenticated";
  saved: LearnerProgressState;

  constructor(mode: "guest" | "authenticated", state: LearnerProgressState) {
    this.mode = mode;
    this.saved = state;
  }

  async load() {
    return { state: this.saved, status: "ok" as const };
  }

  async save(state: LearnerProgressState) {
    this.saved = state;
    return true;
  }

  async reset() {
    this.saved = createEmptyLearnerProgress();
    return true;
  }
}

const guestProgress: LearnerProgressState = {
  version: 1,
  completedLessonIds: ["lesson-01"],
  currentLessonId: "lesson-02",
  lessonNotes: { "lesson-01": "My private browser note" },
  lastActivityTimestamp: "2026-07-27T10:00:00.000Z",
};

const accountProgress: LearnerProgressState = {
  version: 1,
  completedLessonIds: ["lesson-02"],
  currentLessonId: "lesson-03",
  lessonNotes: { "lesson-03": "Existing synchronized note" },
  lastActivityTimestamp: "2026-07-26T10:00:00.000Z",
};

describe("guest-to-account migration", () => {
  it("merges progress and notes without deleting either source", async () => {
    const guest = new MemoryLearnerProvider("guest", guestProgress);
    const account = new MemoryLearnerProvider("authenticated", accountProgress);

    expect(await migrateGuestProgressToAccount(guest, account)).toBe(true);
    expect(account.saved.completedLessonIds).toEqual(["lesson-02", "lesson-01"]);
    expect(account.saved.currentLessonId).toBe("lesson-02");
    expect(account.saved.lessonNotes).toEqual({
      "lesson-03": "Existing synchronized note",
      "lesson-01": "My private browser note",
    });
    expect(guest.saved).toEqual(guestProgress);
  });

  it("recognizes meaningful guest data and ignores an empty workspace", () => {
    expect(hasMeaningfulGuestProgress(guestProgress)).toBe(true);
    expect(hasMeaningfulGuestProgress(createEmptyLearnerProgress())).toBe(false);
  });

  it("keeps the latest activity timestamp", () => {
    expect(mergeLearnerProgress(guestProgress, accountProgress).lastActivityTimestamp)
      .toBe("2026-07-27T10:00:00.000Z");
  });
});
