import { describe, expect, it } from "vitest";
import {
  clearLessonCodeDraft,
  extractFirstPythonCode,
  lessonCodeStorageKey,
  loadLessonCodeDraft,
  saveLessonCodeDraft,
} from "../lib/lesson-code-workspace";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("lesson code workspace storage", () => {
  it("saves and restores a lesson draft", () => {
    const storage = memoryStorage();
    expect(saveLessonCodeDraft(storage, "lesson-2-18", "print('meadow')", "2026-08-11T10:00:00.000Z")).toBe(true);
    expect(loadLessonCodeDraft(storage, "lesson-2-18", "print()"))
      .toEqual({ code: "print('meadow')", status: "saved" });
  });

  it("recovers safely from corrupted or unavailable storage", () => {
    const storage = memoryStorage();
    storage.setItem(lessonCodeStorageKey("lesson-2-18"), "not json");
    expect(loadLessonCodeDraft(storage, "lesson-2-18", "print()"))
      .toEqual({ code: "print()", status: "recovered" });
    expect(loadLessonCodeDraft(null, "lesson-2-18", "print()"))
      .toEqual({ code: "print()", status: "starter" });
  });

  it("clears only the selected lesson draft", () => {
    const storage = memoryStorage();
    saveLessonCodeDraft(storage, "lesson-01", "print(1)");
    saveLessonCodeDraft(storage, "lesson-02", "print(2)");
    expect(clearLessonCodeDraft(storage, "lesson-01")).toBe(true);
    expect(loadLessonCodeDraft(storage, "lesson-01", "starter").code).toBe("starter");
    expect(loadLessonCodeDraft(storage, "lesson-02", "starter").code).toBe("print(2)");
  });
});

describe("lesson code extraction", () => {
  it("extracts the first Python block and ignores non-Python fences", () => {
    const markdown = "```text\nnot code\n```\n\n```python\nprint('Baltic meadow')\n```";
    expect(extractFirstPythonCode(markdown)).toBe("print('Baltic meadow')");
  });
});
