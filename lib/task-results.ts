export const TASK_RESULTS_DATABASE_NAME = "rs-academy-task-results-v1";
export const TASK_RESULTS_STORE_NAME = "task-results";

export type ImageTaskAttachment = {
  id: string;
  kind: "image";
  name: string;
  mimeType: string;
  size: number;
  blob: Blob;
};

export type GeoJsonTaskAttachment = {
  id: string;
  kind: "geojson";
  name: string;
  mimeType: string;
  size: number;
  geojson: Record<string, unknown>;
};

export type TaskAttachment = ImageTaskAttachment | GeoJsonTaskAttachment;

export type TaskResult = {
  version: 1;
  lessonId: string;
  text: string;
  attachments: TaskAttachment[];
  lastActivityTimestamp: string | null;
};

export type TaskResultLoadStatus = "empty" | "ok" | "recovered" | "unavailable";

export type TaskResultLoadResult = {
  result: TaskResult;
  status: TaskResultLoadStatus;
};

export interface TaskResultStorage {
  load(lessonId: string): Promise<TaskResultLoadResult>;
  save(result: TaskResult): Promise<boolean>;
  resetLesson(lessonId: string): Promise<boolean>;
}

export function createEmptyTaskResult(lessonId: string): TaskResult {
  return {
    version: 1,
    lessonId,
    text: "",
    attachments: [],
    lastActivityTimestamp: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isImageAttachment(value: unknown): value is ImageTaskAttachment {
  return (
    isRecord(value) &&
    value.kind === "image" &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.mimeType === "string" &&
    typeof value.size === "number" &&
    value.blob instanceof Blob
  );
}

function isGeoJsonAttachment(value: unknown): value is GeoJsonTaskAttachment {
  return (
    isRecord(value) &&
    value.kind === "geojson" &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.mimeType === "string" &&
    typeof value.size === "number" &&
    isRecord(value.geojson)
  );
}

function normalizeTaskResult(value: unknown, lessonId: string): TaskResult {
  if (!isRecord(value)) {
    return createEmptyTaskResult(lessonId);
  }

  const attachments = Array.isArray(value.attachments)
    ? value.attachments.filter(
        (attachment): attachment is TaskAttachment =>
          isImageAttachment(attachment) || isGeoJsonAttachment(attachment),
      )
    : [];

  return {
    version: 1,
    lessonId,
    text: typeof value.text === "string" ? value.text : "",
    attachments,
    lastActivityTimestamp: isTimestamp(value.lastActivityTimestamp)
      ? value.lastActivityTimestamp
      : null,
  };
}

function isStoredTaskResult(value: unknown, lessonId: string): value is TaskResult {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 1 &&
    value.lessonId === lessonId &&
    typeof value.text === "string" &&
    Array.isArray(value.attachments) &&
    value.attachments.every(
      (attachment) => isImageAttachment(attachment) || isGeoJsonAttachment(attachment),
    ) &&
    (value.lastActivityTimestamp === null || isTimestamp(value.lastActivityTimestamp))
  );
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  });
}

export class IndexedDbTaskResultStorage implements TaskResultStorage {
  private databasePromise: Promise<IDBDatabase> | null = null;

  constructor(
    private readonly indexedDb: IDBFactory | null,
    private readonly databaseName = TASK_RESULTS_DATABASE_NAME,
  ) {}

  private openDatabase(): Promise<IDBDatabase> {
    if (!this.indexedDb) {
      return Promise.reject(new Error("IndexedDB is unavailable"));
    }

    if (!this.databasePromise) {
      this.databasePromise = new Promise((resolve, reject) => {
        const request = this.indexedDb!.open(this.databaseName, 1);

        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(TASK_RESULTS_STORE_NAME)) {
            request.result.createObjectStore(TASK_RESULTS_STORE_NAME, { keyPath: "lessonId" });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Could not open IndexedDB"));
        request.onblocked = () => reject(new Error("IndexedDB upgrade was blocked"));
      });
    }

    return this.databasePromise;
  }

  async load(lessonId: string): Promise<TaskResultLoadResult> {
    try {
      const database = await this.openDatabase();
      const transaction = database.transaction(TASK_RESULTS_STORE_NAME, "readonly");
      const storedValue = await requestResult(
        transaction.objectStore(TASK_RESULTS_STORE_NAME).get(lessonId),
      );
      await transactionComplete(transaction);

      if (storedValue === undefined) {
        return { result: createEmptyTaskResult(lessonId), status: "empty" };
      }

      if (isStoredTaskResult(storedValue, lessonId)) {
        return { result: normalizeTaskResult(storedValue, lessonId), status: "ok" };
      }

      const recoveredResult = normalizeTaskResult(storedValue, lessonId);
      await this.save(recoveredResult);
      return { result: recoveredResult, status: "recovered" };
    } catch {
      return { result: createEmptyTaskResult(lessonId), status: "unavailable" };
    }
  }

  async save(result: TaskResult): Promise<boolean> {
    try {
      const database = await this.openDatabase();
      const normalizedResult = normalizeTaskResult(result, result.lessonId);
      const transaction = database.transaction(TASK_RESULTS_STORE_NAME, "readwrite");
      transaction.objectStore(TASK_RESULTS_STORE_NAME).put(normalizedResult);
      await transactionComplete(transaction);
      return true;
    } catch {
      return false;
    }
  }

  async resetLesson(lessonId: string): Promise<boolean> {
    try {
      const database = await this.openDatabase();
      const transaction = database.transaction(TASK_RESULTS_STORE_NAME, "readwrite");
      transaction.objectStore(TASK_RESULTS_STORE_NAME).delete(lessonId);
      await transactionComplete(transaction);
      return true;
    } catch {
      return false;
    }
  }
}

export function createBrowserTaskResultStorage(): TaskResultStorage {
  try {
    return new IndexedDbTaskResultStorage(window.indexedDB);
  } catch {
    return new IndexedDbTaskResultStorage(null);
  }
}
