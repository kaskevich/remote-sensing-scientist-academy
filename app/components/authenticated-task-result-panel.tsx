"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { GeoJsonMap } from "@/app/components/geojson-map";
import {
  LessonImageGallery,
  LessonMaps,
  MarkdownContent,
  type LessonImage,
  type LessonMap,
} from "@/app/components/lesson-materials";
import { useAcademyAuth } from "@/app/components/academy-auth-provider";
import { isDisplayableGeoJson } from "@/lib/geojson";
import type {
  ConversationComment,
  InstructorFeedback,
  SubmissionFileRecord,
  SubmissionRecord,
  SubmissionStatus,
} from "@/lib/platform-types";
import {
  MAX_SUBMISSION_FILES,
  configuredMaxUploadBytes,
  fileExtension,
  formatFileSize,
  safeStorageFileName,
  validateAcademyUpload,
} from "@/lib/upload-validation";

const SUBMISSION_BUCKET = "learner-submissions";
const MAX_UPLOAD_BYTES = configuredMaxUploadBytes();

type AuthenticatedTaskResultPanelProps = {
  lessonId: string;
  title: string;
  instructions: string;
  referenceImages: LessonImage[];
  referenceMaps: LessonMap[];
  client: SupabaseClient;
  user: User;
};

type UploadState = {
  file: File;
  status: "uploading" | "failed";
  message: string;
};

function mapSubmission(row: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    lessonId: String(row.lesson_id),
    writtenResult: typeof row.written_result === "string" ? row.written_result : "",
    status: (row.status as SubmissionStatus) ?? "not_reviewed",
    submittedAt: typeof row.submitted_at === "string" ? row.submitted_at : null,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : new Date().toISOString(),
  };
}

function mapFile(row: Record<string, unknown>): SubmissionFileRecord {
  return {
    id: String(row.id),
    submissionId: String(row.submission_id),
    userId: String(row.user_id),
    storagePath: String(row.storage_path),
    fileName: String(row.file_name),
    mimeType: String(row.mime_type ?? "application/octet-stream"),
    sizeBytes: Number(row.size_bytes ?? 0),
    createdAt: String(row.created_at),
  };
}

function mapComment(row: Record<string, unknown>): ConversationComment {
  return {
    id: String(row.id),
    authorId: String(row.author_id),
    body: typeof row.body === "string" ? row.body : "",
    createdAt: String(row.created_at),
    editedAt: typeof row.edited_at === "string" ? row.edited_at : null,
    deletedAt: typeof row.deleted_at === "string" ? row.deleted_at : null,
  };
}

function mapFeedback(row: Record<string, unknown>): InstructorFeedback {
  return {
    id: String(row.id),
    submissionId: String(row.submission_id),
    instructorId: String(row.instructor_id),
    status: row.status as SubmissionStatus,
    body: typeof row.body === "string" ? row.body : "",
    rubricScore:
      typeof row.rubric_score === "object" && row.rubric_score !== null
        ? (row.rubric_score as Record<string, number>)
        : null,
    revisionNumber: Number(row.revision_number ?? 1),
    createdAt: String(row.created_at),
  };
}

function statusLabel(status: SubmissionStatus) {
  return status.replace("_", " ");
}

function SecureFilePreview({
  client,
  file,
  onRemove,
}: {
  client: SupabaseClient;
  file: SubmissionFileRecord;
  onRemove(): void;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [geoJson, setGeoJson] = useState<Record<string, unknown> | null>(null);
  const extension = fileExtension(file.fileName);
  const isImage = ["png", "jpg", "jpeg", "webp"].includes(extension);
  const isGeoJson = extension === "geojson";

  useEffect(() => {
    if (!isImage && !isGeoJson) return;
    let active = true;
    let nextUrl: string | null = null;

    void client.storage
      .from(SUBMISSION_BUCKET)
      .download(file.storagePath)
      .then(async ({ data }) => {
        if (!active || !data) return;
        if (isImage) {
          nextUrl = URL.createObjectURL(data);
          setObjectUrl(nextUrl);
          return;
        }

        try {
          const parsed: unknown = JSON.parse(await data.text());
          if (isDisplayableGeoJson(parsed)) setGeoJson(parsed);
        } catch {
          setGeoJson(null);
        }
      });

    return () => {
      active = false;
      if (nextUrl) URL.revokeObjectURL(nextUrl);
    };
  }, [client, file.storagePath, isGeoJson, isImage]);

  async function downloadFile() {
    const { data } = await client.storage.from(SUBMISSION_BUCKET).download(file.storagePath);
    if (!data) return;
    const url = URL.createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.fileName;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  return (
    <figure className="task-result-card task-result-file">
      {isImage && objectUrl ? (
        // Private Blob URLs cannot use Next image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={objectUrl} alt={`Submitted result: ${file.fileName}`} />
      ) : isGeoJson && geoJson ? (
        <GeoJsonMap data={geoJson} label={`Submitted map: ${file.fileName}`} />
      ) : (
        <div className="task-generic-file">
          <span>{extension.toUpperCase() || "FILE"}</span>
          <strong>{formatFileSize(file.sizeBytes)}</strong>
          <button type="button" onClick={() => void downloadFile()}>Secure download</button>
        </div>
      )}
      <figcaption>
        <span>{file.fileName}</span>
        <button type="button" onClick={onRemove}>Remove</button>
      </figcaption>
    </figure>
  );
}

export default function AuthenticatedTaskResultPanel({
  lessonId,
  title,
  instructions,
  referenceImages,
  referenceMaps,
  client,
  user,
}: AuthenticatedTaskResultPanelProps) {
  const auth = useAcademyAuth();
  const [submission, setSubmission] = useState<SubmissionRecord | null>(null);
  const [writtenResult, setWrittenResult] = useState("");
  const [files, setFiles] = useState<SubmissionFileRecord[]>([]);
  const [comments, setComments] = useState<ConversationComment[]>([]);
  const [feedback, setFeedback] = useState<InstructorFeedback | null>(null);
  const [comment, setComment] = useState("");
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const textIsDirty = useRef(false);

  const loadWorkspace = useCallback(async () => {
    setLoaded(false);
    const { data, error } = await client
      .from("submissions")
      .select("id,user_id,lesson_id,written_result,status,submitted_at,updated_at")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) {
      setMessage("Your synchronized submission could not be loaded.");
      setLoaded(true);
      return;
    }

    if (!data) {
      setSubmission(null);
      setWrittenResult("");
      setFiles([]);
      setComments([]);
      setFeedback(null);
      setLoaded(true);
      return;
    }

    const mapped = mapSubmission(data as Record<string, unknown>);
    const [fileResponse, commentResponse, feedbackResponse] = await Promise.all([
      client
        .from("submission_files")
        .select("id,submission_id,user_id,storage_path,file_name,mime_type,size_bytes,created_at")
        .eq("submission_id", mapped.id)
        .order("created_at"),
      client
        .from("submission_comments")
        .select("id,author_id,body,created_at,edited_at,deleted_at")
        .eq("submission_id", mapped.id)
        .order("created_at"),
      client
        .from("instructor_feedback")
        .select("id,submission_id,instructor_id,status,body,rubric_score,revision_number,created_at")
        .eq("submission_id", mapped.id)
        .order("revision_number", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    setSubmission(mapped);
    setWrittenResult(mapped.writtenResult);
    setFiles(((fileResponse.data ?? []) as Array<Record<string, unknown>>).map(mapFile));
    setComments(((commentResponse.data ?? []) as Array<Record<string, unknown>>).map(mapComment));
    setFeedback(
      feedbackResponse.data
        ? mapFeedback(feedbackResponse.data as Record<string, unknown>)
        : null,
    );
    setLoaded(true);
  }, [client, lessonId, user.id]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const ensureSubmission = useCallback(async () => {
    if (submission) return submission;
    const { data, error } = await client
      .from("submissions")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          written_result: writtenResult,
          status: "not_reviewed",
        },
        { onConflict: "user_id,lesson_id" },
      )
      .select("id,user_id,lesson_id,written_result,status,submitted_at,updated_at")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Could not create submission");
    const mapped = mapSubmission(data as Record<string, unknown>);
    setSubmission(mapped);
    return mapped;
  }, [client, lessonId, submission, user.id, writtenResult]);

  useEffect(() => {
    if (!loaded || !textIsDirty.current) return;
    const timeout = window.setTimeout(async () => {
      setSaving(true);
      try {
        const current = await ensureSubmission();
        const { error } = await client
          .from("submissions")
          .update({ written_result: writtenResult, updated_at: new Date().toISOString() })
          .eq("id", current.id);
        setMessage(error ? "The written result could not be saved." : "");
        if (!error) textIsDirty.current = false;
      } catch {
        setMessage("The written result could not be saved.");
      } finally {
        setSaving(false);
      }
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [client, ensureSubmission, loaded, writtenResult]);

  async function uploadFile(file: File) {
    const validation = validateAcademyUpload(file, MAX_UPLOAD_BYTES);
    if (!validation.valid) {
      setUploads((current) => [...current, { file, status: "failed", message: validation.error }]);
      return;
    }

    setUploads((current) => [
      ...current.filter((upload) => upload.file !== file),
      { file, status: "uploading", message: "Uploading securely…" },
    ]);

    try {
      const current = await ensureSubmission();
      const storagePath = `${user.id}/${lessonId}/${crypto.randomUUID()}-${safeStorageFileName(file.name)}`;
      const { error: uploadError } = await client.storage
        .from(SUBMISSION_BUCKET)
        .upload(storagePath, file, { contentType: file.type || "application/octet-stream" });
      if (uploadError) throw uploadError;

      const { error: recordError } = await client.from("submission_files").insert({
        submission_id: current.id,
        user_id: user.id,
        storage_path: storagePath,
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
      });
      if (recordError) {
        await client.storage.from(SUBMISSION_BUCKET).remove([storagePath]);
        throw recordError;
      }

      setUploads((currentUploads) => currentUploads.filter((upload) => upload.file !== file));
      await loadWorkspace();
      setMessage(`${file.name} uploaded successfully.`);
    } catch (uploadError) {
      setUploads((current) => [
        ...current.filter((upload) => upload.file !== file),
        {
          file,
          status: "failed",
          message: uploadError instanceof Error ? uploadError.message : "Upload failed.",
        },
      ]);
    }
  }

  async function addFiles(selectedFiles: File[]) {
    const available = Math.max(0, MAX_SUBMISSION_FILES - files.length);
    if (available === 0) {
      setMessage(`Each submission can contain up to ${MAX_SUBMISSION_FILES} files.`);
      return;
    }
    const accepted = selectedFiles.slice(0, available);
    if (selectedFiles.length > accepted.length) {
      setMessage(`Only the first ${available} selected files can be added.`);
    }
    for (const file of accepted) await uploadFile(file);
  }

  async function removeFile(file: SubmissionFileRecord) {
    const confirmed = window.confirm(`Remove ${file.fileName} from this submission?`);
    if (!confirmed) return;
    const { error: storageError } = await client.storage
      .from(SUBMISSION_BUCKET)
      .remove([file.storagePath]);
    if (storageError) {
      setMessage("The file could not be removed securely.");
      return;
    }
    await client.from("submission_files").delete().eq("id", file.id);
    setFiles((current) => current.filter((item) => item.id !== file.id));
  }

  async function sendForReview() {
    try {
      const current = await ensureSubmission();
      const { error } = await client
        .from("submissions")
        .update({
          status: "not_reviewed",
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id);
      if (error) throw error;
      setSubmission({ ...current, status: "not_reviewed", submittedAt: new Date().toISOString() });
      setMessage("Submission sent for instructor review.");
      auth.notifyDataChanged();
    } catch {
      setMessage("The submission could not be sent for review.");
    }
  }

  async function sendComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!comment.trim()) return;
    try {
      const current = await ensureSubmission();
      const { error } = await client.from("submission_comments").insert({
        submission_id: current.id,
        author_id: user.id,
        body: comment.trim(),
      });
      if (error) throw error;
      setComment("");
      await loadWorkspace();
    } catch {
      setMessage("Your private comment could not be sent.");
    }
  }

  async function clearSubmission() {
    if (!submission) return;
    const confirmed = window.confirm(
      "Delete this synchronized submission, its files, and its private conversation?",
    );
    if (!confirmed) return;
    if (files.length > 0) {
      const { error } = await client.storage
        .from(SUBMISSION_BUCKET)
        .remove(files.map((file) => file.storagePath));
      if (error) {
        setMessage("The submission files could not be removed.");
        return;
      }
    }
    const { error } = await client.from("submissions").delete().eq("id", submission.id);
    if (error) {
      setMessage("The submission could not be cleared.");
      return;
    }
    await loadWorkspace();
    auth.notifyDataChanged();
  }

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
            <span>Learner submission · private</span>
            <strong>Written result and supporting files</strong>
          </div>
          {submission && (
            <button type="button" onClick={() => void clearSubmission()}>Clear submission</button>
          )}
        </div>

        <label className="task-result-text" htmlFor={`${lessonId}-result-text`}>
          <span>Written result</span>
          <textarea
            id={`${lessonId}-result-text`}
            rows={5}
            value={writtenResult}
            placeholder="Explain what the result shows, including uncertainty."
            onChange={(event) => {
              textIsDirty.current = true;
              setWrittenResult(event.target.value);
            }}
          />
        </label>

        <div className="task-upload-row">
          <label className="task-upload-button" htmlFor={`${lessonId}-result-files`}>
            Add submission files
          </label>
          <input
            id={`${lessonId}-result-files`}
            type="file"
            multiple
            disabled={uploads.some((upload) => upload.status === "uploading")}
            accept=".png,.jpg,.jpeg,.webp,.geojson,.tif,.tiff,.csv,.pdf,.ipynb,.html,.zip"
            onChange={(event) => {
              const selectedFiles = Array.from(event.target.files ?? []);
              event.target.value = "";
              void addFiles(selectedFiles);
            }}
          />
          <span>Up to {MAX_SUBMISSION_FILES} files · {Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB each</span>
        </div>

        {uploads.map((upload) => (
          <div className={`task-upload-state task-upload-${upload.status}`} key={`${upload.file.name}-${upload.file.lastModified}`}>
            <span>{upload.file.name}: {upload.message}</span>
            {upload.status === "uploading" ? (
              <progress aria-label={`Uploading ${upload.file.name}`} />
            ) : (
              <div className="task-upload-actions">
                <button type="button" onClick={() => void uploadFile(upload.file)}>Retry</button>
                <button
                  type="button"
                  onClick={() => setUploads((current) => current.filter((item) => item.file !== upload.file))}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        ))}

        {files.length > 0 && (
          <div className="task-result-gallery">
            {files.map((file) => (
              <SecureFilePreview
                client={client}
                file={file}
                key={file.id}
                onRemove={() => void removeFile(file)}
              />
            ))}
          </div>
        )}

        <div className="submission-review-row">
          <span>Status: <strong>{statusLabel(submission?.status ?? "not_reviewed")}</strong></span>
          <button className="button button-primary" type="button" onClick={() => void sendForReview()}>
            {submission?.status === "needs_revision" ? "Send revision" : "Send for review"}
          </button>
        </div>

        <aside className="instructor-feedback" aria-label="Instructor feedback">
          <span>Instructor feedback{feedback ? ` · ${statusLabel(feedback.status)}` : ""}</span>
          {feedback ? (
            <>
              <p>{feedback.body}</p>
              <small>Revision {feedback.revisionNumber} · {new Date(feedback.createdAt).toLocaleString()}</small>
            </>
          ) : (
            <p>No instructor feedback has been added yet.</p>
          )}
        </aside>

        <section className="submission-conversation" aria-labelledby={`${lessonId}-conversation-title`}>
          <div>
            <span>Private learner–instructor conversation</span>
            <strong id={`${lessonId}-conversation-title`}>Questions, revision requests, and feedback</strong>
            <p>Only you and Academy instructors can read this conversation.</p>
          </div>
          {comments.length > 0 && (
            <ol>
              {comments.map((item) => (
                <li key={item.id}>
                  <strong>{item.authorId === user.id ? "You" : "Instructor"}</strong>
                  <p>{item.deletedAt ? "Comment removed by a moderator." : item.body}</p>
                  <time>{new Date(item.createdAt).toLocaleString()}</time>
                </li>
              ))}
            </ol>
          )}
          <form onSubmit={sendComment}>
            <label htmlFor={`${lessonId}-private-comment`}>Write a private comment</label>
            <textarea
              id={`${lessonId}-private-comment`}
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button type="submit" disabled={!comment.trim()}>Send privately</button>
          </form>
        </section>

        <p className="task-storage-notice" role="status">
          {saving ? "Saving written result…" : message || (loaded ? "Submission data is synchronized with your Academy account." : "Loading your private submission…")}
        </p>
      </div>
    </section>
  );
}
