export const LESSON_CODE_STORAGE_PREFIX = "rs-academy:lesson-code:v1:";

type LessonCodeDraft = {
  version: 1;
  code: string;
  updatedAt: string;
};

export type LessonCodeLoadResult = {
  code: string;
  status: "starter" | "saved" | "recovered";
};

type BrowserStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function lessonCodeStorageKey(lessonId: string) {
  return `${LESSON_CODE_STORAGE_PREFIX}${lessonId}`;
}

export function loadLessonCodeDraft(
  storage: BrowserStorage | null,
  lessonId: string,
  starterCode: string,
): LessonCodeLoadResult {
  if (!storage) {
    return { code: starterCode, status: "starter" };
  }

  try {
    const stored = storage.getItem(lessonCodeStorageKey(lessonId));
    if (!stored) {
      return { code: starterCode, status: "starter" };
    }

    const parsed = JSON.parse(stored) as Partial<LessonCodeDraft>;
    if (parsed.version !== 1 || typeof parsed.code !== "string") {
      return { code: starterCode, status: "recovered" };
    }

    return { code: parsed.code, status: "saved" };
  } catch {
    return { code: starterCode, status: "recovered" };
  }
}

export function saveLessonCodeDraft(
  storage: BrowserStorage | null,
  lessonId: string,
  code: string,
  updatedAt = new Date().toISOString(),
) {
  if (!storage) return false;

  try {
    const draft: LessonCodeDraft = { version: 1, code, updatedAt };
    storage.setItem(lessonCodeStorageKey(lessonId), JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearLessonCodeDraft(storage: BrowserStorage | null, lessonId: string) {
  if (!storage) return false;

  try {
    storage.removeItem(lessonCodeStorageKey(lessonId));
    return true;
  } catch {
    return false;
  }
}

export function extractFirstPythonCode(markdown: string) {
  const match = markdown.match(/```(?:python|py)\s*\n([\s\S]*?)```/i);
  return match?.[1].trimEnd() ?? null;
}
