"use client";

import { useEffect, useRef, useState } from "react";
import AuthenticatedTaskResultPanel from "@/app/components/authenticated-task-result-panel";
import { useAcademyAuth } from "@/app/components/academy-auth-provider";
import { GeoJsonMap } from "@/app/components/geojson-map";
import {
  LessonImageGallery,
  LessonMaps,
  MarkdownContent,
  type LessonImage,
  type LessonMap,
} from "@/app/components/lesson-materials";
import { isDisplayableGeoJson } from "@/lib/geojson";
import {
  createBrowserTaskResultStorage,
  createEmptyTaskResult,
  type ImageTaskAttachment,
  type FileTaskAttachment,
  type TaskAttachment,
  type TaskResult,
  type TaskResultLoadStatus,
  type TaskResultStorage,
} from "@/lib/task-results";
import {
  MAX_SUBMISSION_FILES,
  configuredMaxUploadBytes,
  formatFileSize,
  validateAcademyUpload,
} from "@/lib/upload-validation";

const MAX_UPLOAD_BYTES = configuredMaxUploadBytes();

type TaskResultPanelProps = {
  lessonId: string;
  title: string;
  instructions: string;
  referenceImages: LessonImage[];
  referenceMaps: LessonMap[];
};

function timestamp() {
  return new Date().toISOString();
}

function attachmentId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function LocalTaskImage({ attachment }: { attachment: ImageTaskAttachment }) {
  const [src] = useState(() => URL.createObjectURL(attachment.blob));

  useEffect(() => () => URL.revokeObjectURL(src), [src]);

  // Blob URLs are browser-generated and cannot use Next image optimization.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={`Uploaded task result: ${attachment.name}`} src={src} />;
}

function LocalTaskFile({ attachment }: { attachment: FileTaskAttachment }) {
  const [href] = useState(() => URL.createObjectURL(attachment.blob));

  useEffect(() => () => URL.revokeObjectURL(href), [href]);

  return (
    <div className="task-generic-file">
      <span>{attachment.name.split(".").pop()?.toUpperCase() || "FILE"}</span>
      <strong>{formatFileSize(attachment.size)}</strong>
      <a href={href} download={attachment.name}>Download local file</a>
    </div>
  );
}

function GuestTaskResultPanel({
  lessonId,
  title,
  instructions,
  referenceImages,
  referenceMaps,
}: TaskResultPanelProps) {
  const storageRef = useRef<TaskResultStorage | null>(null);
  const [result, setResult] = useState<TaskResult>(() => createEmptyTaskResult(lessonId));
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadStatus, setLoadStatus] = useState<TaskResultLoadStatus>("empty");
  const [saveFailed, setSaveFailed] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // IndexedDB is browser-only external state and hydrates after mount.
  useEffect(() => {
    const storage = createBrowserTaskResultStorage();
    storageRef.current = storage;
    storage.load(lessonId).then((loaded) => {
      setResult(loaded.result);
      setLoadStatus(loaded.status);
      setHasLoaded(true);
    });
  }, [lessonId]);

  useEffect(() => {
    if (!hasLoaded || !storageRef.current) {
      return;
    }

    storageRef.current.save(result).then((saved) => setSaveFailed(!saved));
  }, [hasLoaded, result]);

  function setText(text: string) {
    setResult((previous) => ({
      ...previous,
      text,
      lastActivityTimestamp: timestamp(),
    }));
  }

  async function addFiles(files: File[]) {
    setUploadMessage("");
    const availableSlots = Math.max(0, MAX_SUBMISSION_FILES - result.attachments.length);
    const acceptedFiles = files.slice(0, availableSlots);

    if (acceptedFiles.length === 0) {
      setUploadMessage(`Each task can keep up to ${MAX_SUBMISSION_FILES} uploaded results.`);
      return;
    }

    const attachments: TaskAttachment[] = [];
    const errors: string[] = [];

    for (const file of acceptedFiles) {
      const validation = validateAcademyUpload(file, MAX_UPLOAD_BYTES);
      if (!validation.valid) {
        errors.push(validation.error);
        continue;
      }

      if (validation.previewKind === "image") {
        attachments.push({
          id: attachmentId(),
          kind: "image",
          name: file.name,
          mimeType: file.type,
          size: file.size,
          blob: file.slice(0, file.size, file.type),
        });
        continue;
      }

      if (validation.previewKind === "geojson") {
        try {
          const geojson: unknown = JSON.parse(await file.text());
          if (!isDisplayableGeoJson(geojson)) {
            errors.push(`${file.name} does not contain displayable GeoJSON geometry.`);
            continue;
          }

          attachments.push({
            id: attachmentId(),
            kind: "geojson",
            name: file.name,
            mimeType: file.type || "application/geo+json",
            size: file.size,
            geojson,
          });
        } catch {
          errors.push(`${file.name} is not valid GeoJSON.`);
        }
        continue;
      }

      attachments.push({
        id: attachmentId(),
        kind: "file",
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        blob: file.slice(0, file.size, file.type || "application/octet-stream"),
      });
    }

    if (attachments.length > 0) {
      setResult((previous) => ({
        ...previous,
        attachments: [...previous.attachments, ...attachments],
        lastActivityTimestamp: timestamp(),
      }));
    }

    setUploadMessage(errors.join(" "));
  }

  function removeAttachment(attachmentIdToRemove: string) {
    setResult((previous) => ({
      ...previous,
      attachments: previous.attachments.filter(
        (attachment) => attachment.id !== attachmentIdToRemove,
      ),
      lastActivityTimestamp: timestamp(),
    }));
  }

  async function clearResult() {
    if (!window.confirm("Clear this task result, including its text, imagery, and maps?")) {
      return;
    }

    await storageRef.current?.resetLesson(lessonId);
    setResult(createEmptyTaskResult(lessonId));
    setLoadStatus("empty");
    setSaveFailed(false);
    setUploadMessage("");
  }

  const storageNotice = saveFailed || loadStatus === "unavailable"
    ? "Task-result storage is unavailable in this browser."
    : loadStatus === "recovered"
      ? "Unreadable task data was safely reset. New results will save in this browser."
      : "Learner submission prototype: private and saved only in this browser. Sign in to synchronize it and contact an instructor.";

  return (
    <section className="program-task" aria-labelledby={`${lessonId}-task-title`}>
      <div className="program-task-heading">
        <span>Program task</span>
        <h4 id={`${lessonId}-task-title`}>{title || "Build and explain your result"}</h4>
      </div>

      <MarkdownContent>{instructions}</MarkdownContent>
      <LessonImageGallery images={referenceImages} />
      <LessonMaps maps={referenceMaps} />

      <div className="task-result-editor">
        <div className="task-result-title-row">
          <div>
            <span>Learner submission · browser prototype</span>
            <strong>Map, imagery, and interpretation</strong>
          </div>
          {(result.text || result.attachments.length > 0) && (
            <button type="button" onClick={clearResult}>
              Clear result
            </button>
          )}
        </div>

        <label className="task-result-text" htmlFor={`${lessonId}-result-text`}>
          <span>Written result</span>
          <textarea
            id={`${lessonId}-result-text`}
            rows={5}
            value={result.text}
            placeholder="Explain what the map or imagery shows, including uncertainty."
            onChange={(event) => setText(event.target.value)}
          />
        </label>

        <div className="task-upload-row">
          <label className="task-upload-button" htmlFor={`${lessonId}-result-files`}>
            Add imagery or GeoJSON
          </label>
          <input
            id={`${lessonId}-result-files`}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.webp,.geojson,.tif,.tiff,.csv,.pdf,.ipynb,.html,.zip"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              void addFiles(files);
            }}
          />
          <span>Up to {MAX_SUBMISSION_FILES} files · {Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB each</span>
        </div>

        {uploadMessage && <p className="task-upload-message" role="status">{uploadMessage}</p>}

        {result.attachments.length > 0 && (
          <div className="task-result-gallery">
            {result.attachments.map((attachment) => (
              <figure className={`task-result-card task-result-${attachment.kind}`} key={attachment.id}>
                {attachment.kind === "image" ? (
                  <LocalTaskImage attachment={attachment} />
                ) : attachment.kind === "geojson" ? (
                  <GeoJsonMap data={attachment.geojson} label={`Uploaded map: ${attachment.name}`} />
                ) : (
                  <LocalTaskFile attachment={attachment} />
                )}
                <figcaption>
                  <span>{attachment.name}</span>
                  <button type="button" onClick={() => removeAttachment(attachment.id)}>
                    Remove
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <p className="task-storage-notice">{storageNotice}</p>

        <section className="submission-conversation submission-conversation-disabled">
          <div>
            <span>Private learner–instructor conversation</span>
            <strong>Questions, revision requests, and feedback</strong>
            <p>Sign in to share private comments with an instructor.</p>
          </div>
        </section>

        <aside className="instructor-feedback instructor-feedback-disabled">
          <span>Instructor feedback</span>
          <p>Sign in and submit work to receive synchronized review feedback.</p>
        </aside>
      </div>
    </section>
  );
}

export default function TaskResultPanel(props: TaskResultPanelProps) {
  const auth = useAcademyAuth();

  if (auth.client && auth.user) {
    return <AuthenticatedTaskResultPanel {...props} client={auth.client} user={auth.user} />;
  }

  return <GuestTaskResultPanel {...props} />;
}
