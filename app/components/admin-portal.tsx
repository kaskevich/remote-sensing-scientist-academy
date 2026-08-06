"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import AcademyAccountPanel from "@/app/components/academy-account-panel";
import { useAcademyAuth } from "@/app/components/academy-auth-provider";
import type {
  AcademyResource,
  AcademyRole,
  SubmissionFileRecord,
  SubmissionRecord,
  SubmissionStatus,
} from "@/lib/platform-types";
import { isStaffRole } from "@/lib/platform-types";
import {
  configuredMaxUploadBytes,
  formatFileSize,
  safeStorageFileName,
} from "@/lib/upload-validation";

const RESOURCE_BUCKET = "lesson-resources";
const SUBMISSION_BUCKET = "learner-submissions";
const MAX_BYTES = configuredMaxUploadBytes();
const adminExtensions = new Set([
  "png", "jpg", "jpeg", "webp", "svg", "pdf", "csv", "geojson", "json", "ipynb",
  "zip", "tif", "tiff", "py", "md", "txt", "html",
]);

type LessonOption = { id: string; title: string };
type AdminTab = "content" | "resources" | "learners" | "submissions" | "discussions";

function extension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function mapResource(row: Record<string, unknown>): AcademyResource {
  return {
    id: String(row.id),
    moduleId: typeof row.module_id === "string" ? row.module_id : null,
    lessonId: typeof row.lesson_id === "string" ? row.lesson_id : null,
    title: String(row.title),
    description: String(row.description ?? ""),
    storagePath: String(row.storage_path),
    fileName: String(row.file_name),
    mimeType: String(row.mime_type),
    sizeBytes: Number(row.size_bytes),
    licenseSource: String(row.license_source ?? ""),
    visibility:
      row.visibility === "public" || row.visibility === "draft"
        ? row.visibility
        : "authenticated",
    ordering: Number(row.ordering ?? 0),
    createdAt: String(row.created_at),
  };
}

function ContentPanel() {
  return (
    <section className="admin-platform-panel">
      <p className="section-kicker">Public content</p>
      <h2>Marketing and curriculum overview</h2>
      <p>
        Pages CMS continues to manage the public landing-page copy, curriculum summaries, and
        repository-hosted lesson media.
      </p>
      <a
        className="button button-primary"
        href="https://app.pagescms.org/"
        target="_blank"
        rel="noreferrer"
      >
        Open Pages CMS <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}

function ResourcesPanel({ client, lessons }: { client: SupabaseClient; lessons: LessonOption[] }) {
  const auth = useAcademyAuth();
  const [resources, setResources] = useState<AcademyResource[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessonId, setLessonId] = useState(lessons[0]?.id ?? "");
  const [licenseSource, setLicenseSource] = useState("");
  const [visibility, setVisibility] = useState<"public" | "authenticated" | "draft">("authenticated");
  const [ordering, setOrdering] = useState(0);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data } = await client
      .from("resource_files")
      .select("id,module_id,lesson_id,title,description,storage_path,file_name,mime_type,size_bytes,license_source,visibility,ordering,created_at")
      .order("lesson_id")
      .order("ordering");
    setResources(((data ?? []) as Array<Record<string, unknown>>).map(mapResource));
  }, [client]);

  // Load external Academy data after the client component mounts.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function uploadResource(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.user || !file) return;
    if (!adminExtensions.has(extension(file.name))) {
      setMessage(`${file.name} is not a supported instructor resource.`);
      return;
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      setMessage(`Resources must be between 1 byte and ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`);
      return;
    }

    setUploading(true);
    setMessage("Uploading resource securely…");
    const storagePath = `${lessonId}/${crypto.randomUUID()}-${safeStorageFileName(file.name)}`;
    const { error: uploadError } = await client.storage
      .from(RESOURCE_BUCKET)
      .upload(storagePath, file, { contentType: file.type || "application/octet-stream" });
    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { error: metadataError } = await client.from("resource_files").insert({
      lesson_id: lessonId,
      module_id: null,
      title: title.trim(),
      description: description.trim(),
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
      license_source: licenseSource.trim(),
      visibility,
      ordering,
      uploaded_by: auth.user.id,
    });
    if (metadataError) {
      await client.storage.from(RESOURCE_BUCKET).remove([storagePath]);
      setMessage(metadataError.message);
      setUploading(false);
      return;
    }

    setFile(null);
    setTitle("");
    setDescription("");
    setLicenseSource("");
    setOrdering(0);
    setMessage("Resource uploaded and attached to the lesson.");
    setUploading(false);
    auth.notifyDataChanged();
    await load();
  }

  async function deleteResource(resource: AcademyResource) {
    if (!window.confirm(`Delete ${resource.title}?`)) return;
    const { error: storageError } = await client.storage
      .from(RESOURCE_BUCKET)
      .remove([resource.storagePath]);
    if (storageError) {
      setMessage(storageError.message);
      return;
    }
    await client.from("resource_files").delete().eq("id", resource.id);
    auth.notifyDataChanged();
    await load();
  }

  return (
    <section className="admin-platform-panel">
      <p className="section-kicker">Instructor resources</p>
      <h2>Attach resources to lessons</h2>
      <p>Resources are stored outside GitHub in the private lesson-resources bucket.</p>

      <form className="admin-resource-form" onSubmit={uploadResource}>
        <label>
          Lesson
          <select value={lessonId} onChange={(event) => setLessonId(event.target.value)}>
            {lessons.map((lesson) => <option value={lesson.id} key={lesson.id}>{lesson.title}</option>)}
          </select>
        </label>
        <label>
          Resource title
          <input required value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="admin-form-wide">
          Description
          <textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label>
          License or source
          <input value={licenseSource} onChange={(event) => setLicenseSource(event.target.value)} />
        </label>
        <label>
          Visibility
          <select value={visibility} onChange={(event) => setVisibility(event.target.value as typeof visibility)}>
            <option value="authenticated">Signed-in learners</option>
            <option value="public">Public</option>
            <option value="draft">Staff only draft</option>
          </select>
        </label>
        <label>
          Display order
          <input type="number" value={ordering} onChange={(event) => setOrdering(Number(event.target.value))} />
        </label>
        <label className="admin-form-wide">
          File
          <input
            required
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,.csv,.geojson,.json,.ipynb,.zip,.tif,.tiff,.py,.md,.txt,.html"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <small>Images, datasets, notebooks, PDFs, templates, code, GeoTIFF, or ZIP · {Math.round(MAX_BYTES / 1024 / 1024)} MB maximum</small>
        </label>
        <button className="button button-primary" type="submit" disabled={uploading || !file}>
          {uploading ? "Uploading…" : "Upload resource"}
        </button>
        {uploading && <progress aria-label="Uploading instructor resource" />}
        {message && <p className="admin-form-wide" role="status">{message}</p>}
      </form>

      <div className="admin-record-list">
        {resources.map((resource) => (
          <article key={resource.id}>
            <div>
              <span>{resource.lessonId} · {resource.visibility}</span>
              <strong>{resource.title}</strong>
              <p>{resource.fileName} · {formatFileSize(resource.sizeBytes)}</p>
            </div>
            <button type="button" onClick={() => void deleteResource(resource)}>Delete</button>
          </article>
        ))}
        {resources.length === 0 && <p>No synchronized lesson resources yet.</p>}
      </div>
    </section>
  );
}

type LearnerRow = {
  id: string;
  displayName: string;
  email: string;
  role: AcademyRole;
  completed: number;
  assignedInstructorId: string | null;
};

function LearnersPanel({ client }: { client: SupabaseClient }) {
  const auth = useAcademyAuth();
  const [learners, setLearners] = useState<LearnerRow[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await client
      .from("profiles")
      .select("id,display_name,email,role")
      .order("display_name");
    if (error) {
      setMessage(error.message);
      return;
    }
    const profiles = (data ?? []) as Array<Record<string, unknown>>;
    const { data: enrollmentRows } = await client
      .from("enrollments")
      .select("learner_id,instructor_id")
      .eq("active", true);
    const rows = await Promise.all(profiles.map(async (profile) => {
      const id = String(profile.id);
      const { count } = await client
        .from("lesson_progress")
        .select("lesson_id", { count: "exact", head: true })
        .eq("user_id", id)
        .eq("completed", true);
      return {
        id,
        displayName: String(profile.display_name ?? "Academy member"),
        email: String(profile.email ?? ""),
        role: profile.role as AcademyRole,
        completed: count ?? 0,
        assignedInstructorId:
          ((enrollmentRows ?? []) as Array<Record<string, unknown>>)
            .find((enrollment) => enrollment.learner_id === id)
            ?.instructor_id?.toString() ?? null,
      };
    }));
    setLearners(rows);
  }, [client]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function changeRole(learner: LearnerRow, role: AcademyRole) {
    const { error } = await client.from("profiles").update({ role }).eq("id", learner.id);
    setMessage(error ? error.message : `${learner.displayName} is now ${role}.`);
    if (!error) await load();
  }

  async function assignInstructor(learner: LearnerRow, instructorId: string) {
    await client.from("enrollments").delete().eq("learner_id", learner.id);
    if (instructorId) {
      const { error } = await client.from("enrollments").insert({
        learner_id: learner.id,
        instructor_id: instructorId,
        active: true,
      });
      if (error) {
        setMessage(error.message);
        return;
      }
    }
    setMessage(
      instructorId
        ? `${learner.displayName} was assigned to an instructor.`
        : `${learner.displayName} is currently unassigned.`,
    );
    await load();
  }

  return (
    <section className="admin-platform-panel">
      <p className="section-kicker">Learners</p>
      <h2>Enrolled learner progress</h2>
      <p>Instructors see assigned learners. Admins can also manage Academy roles.</p>
      <div className="admin-record-list">
        {learners.map((learner) => (
          <article key={learner.id}>
            <div>
              <span>{learner.role}</span>
              <strong>{learner.displayName}</strong>
              <p>{learner.email} · {learner.completed} completed lessons</p>
            </div>
            {auth.role === "admin" && (
              <div className="admin-learner-controls">
                <select
                  aria-label={`Role for ${learner.displayName}`}
                  value={learner.role}
                  onChange={(event) => void changeRole(learner, event.target.value as AcademyRole)}
                >
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                {learner.role === "learner" && (
                  <select
                    aria-label={`Instructor for ${learner.displayName}`}
                    value={learner.assignedInstructorId ?? ""}
                    onChange={(event) => void assignInstructor(learner, event.target.value)}
                  >
                    <option value="">No instructor</option>
                    {learners
                      .filter((candidate) => candidate.role === "instructor" || candidate.role === "admin")
                      .map((candidate) => (
                        <option value={candidate.id} key={candidate.id}>{candidate.displayName}</option>
                      ))}
                  </select>
                )}
              </div>
            )}
          </article>
        ))}
        {learners.length === 0 && <p>No learners are assigned to this account.</p>}
      </div>
      {message && <p role="status">{message}</p>}
    </section>
  );
}

function mapSubmission(row: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    lessonId: String(row.lesson_id),
    writtenResult: String(row.written_result ?? ""),
    status: row.status as SubmissionStatus,
    submittedAt: typeof row.submitted_at === "string" ? row.submitted_at : null,
    updatedAt: String(row.updated_at),
  };
}

function ReviewSubmission({ client, submission }: { client: SupabaseClient; submission: SubmissionRecord }) {
  const auth = useAcademyAuth();
  const [files, setFiles] = useState<SubmissionFileRecord[]>([]);
  const [comments, setComments] = useState<Array<{ id: string; authorId: string; body: string; createdAt: string }>>([]);
  const [feedback, setFeedback] = useState("");
  const [privateComment, setPrivateComment] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [fileResponse, commentResponse] = await Promise.all([
      client.from("submission_files").select("id,submission_id,user_id,storage_path,file_name,mime_type,size_bytes,created_at").eq("submission_id", submission.id),
      client.from("submission_comments").select("id,author_id,body,created_at").eq("submission_id", submission.id).order("created_at"),
    ]);
    setFiles(((fileResponse.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id), submissionId: String(row.submission_id), userId: String(row.user_id),
      storagePath: String(row.storage_path), fileName: String(row.file_name),
      mimeType: String(row.mime_type), sizeBytes: Number(row.size_bytes), createdAt: String(row.created_at),
    })));
    setComments(((commentResponse.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id), authorId: String(row.author_id), body: String(row.body), createdAt: String(row.created_at),
    })));
  }, [client, submission.id]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { void load(); }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function download(file: SubmissionFileRecord) {
    const { data, error } = await client.storage.from(SUBMISSION_BUCKET).download(file.storagePath);
    if (error || !data) { setMessage(error?.message ?? "Download failed."); return; }
    const url = URL.createObjectURL(data);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = file.fileName; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  async function saveFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.user || !feedback.trim()) return;
    const { data: latest } = await client
      .from("instructor_feedback")
      .select("revision_number")
      .eq("submission_id", submission.id)
      .order("revision_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    const revisionNumber = Number(latest?.revision_number ?? 0) + 1;
    const { error } = await client.from("instructor_feedback").insert({
      submission_id: submission.id,
      instructor_id: auth.user.id,
      status,
      body: feedback.trim(),
      revision_number: revisionNumber,
    });
    if (!error) {
      await client.from("submissions").update({ status }).eq("id", submission.id);
      setFeedback("");
      setMessage("Feedback saved and shared privately with the learner.");
    } else setMessage(error.message);
  }

  async function sendPrivateComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.user || !privateComment.trim()) return;
    const { error } = await client.from("submission_comments").insert({
      submission_id: submission.id,
      author_id: auth.user.id,
      body: privateComment.trim(),
    });
    if (!error) { setPrivateComment(""); await load(); } else setMessage(error.message);
  }

  return (
    <article className="admin-submission-review">
      <span>{submission.lessonId} · {submission.status.replace("_", " ")}</span>
      <h3>Learner {submission.userId.slice(0, 8)}</h3>
      <p className="admin-submission-text">{submission.writtenResult || "No written result."}</p>
      <div className="admin-submission-files">
        {files.map((file) => (
          <button type="button" key={file.id} onClick={() => void download(file)}>
            {file.fileName} · {formatFileSize(file.sizeBytes)}
          </button>
        ))}
      </div>
      <section>
        <strong>Private learner–instructor conversation</strong>
        <ol>
          {comments.map((comment) => (
            <li key={comment.id}>
              <b>{comment.authorId === auth.user?.id ? "You" : "Learner"}</b>: {comment.body}
            </li>
          ))}
        </ol>
        <form onSubmit={sendPrivateComment}>
          <label>Private comment<textarea rows={2} value={privateComment} onChange={(event) => setPrivateComment(event.target.value)} /></label>
          <button type="submit">Send privately</button>
        </form>
      </section>
      <form className="admin-feedback-form" onSubmit={saveFeedback}>
        <label>
          Review status
          <select value={status} onChange={(event) => setStatus(event.target.value as SubmissionStatus)}>
            <option value="not_reviewed">Submitted</option>
            <option value="needs_revision">Revision requested</option>
            <option value="reviewed">Meets expectations</option>
            <option value="approved">Portfolio ready</option>
          </select>
        </label>
        <label>Instructor feedback<textarea required rows={3} value={feedback} onChange={(event) => setFeedback(event.target.value)} /></label>
        <button className="button button-primary" type="submit">Save feedback</button>
      </form>
      {message && <p role="status">{message}</p>}
    </article>
  );
}

function SubmissionsPanel({ client }: { client: SupabaseClient }) {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  useEffect(() => {
    void client.from("submissions").select("id,user_id,lesson_id,written_result,status,submitted_at,updated_at").order("updated_at", { ascending: false })
      .then(({ data }) => setSubmissions(((data ?? []) as Array<Record<string, unknown>>).map(mapSubmission)));
  }, [client]);
  return (
    <section className="admin-platform-panel">
      <p className="section-kicker">Submissions</p><h2>Review learner work</h2>
      <p>Only enrolled learners’ submissions are visible to instructors.</p>
      <div className="admin-review-list">
        {submissions.map((submission) => <ReviewSubmission client={client} submission={submission} key={submission.id} />)}
        {submissions.length === 0 && <p>No accessible learner submissions yet.</p>}
      </div>
    </section>
  );
}

function DiscussionsPanel({ client, lessons }: { client: SupabaseClient; lessons: LessonOption[] }) {
  const auth = useAcademyAuth();
  const [threads, setThreads] = useState<Array<{ id: string; lessonId: string; title: string; enabled: boolean }>>([]);
  const [comments, setComments] = useState<Array<{ id: string; threadId: string; author: string; body: string; deletedAt: string | null }>>([]);
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    const { data } = await client.from("lesson_discussions").select("id,lesson_id,title,enabled").order("lesson_id");
    setThreads(((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id), lessonId: String(row.lesson_id), title: String(row.title), enabled: row.enabled === true,
    })));
    const { data: commentRows } = await client
      .from("discussion_comments")
      .select("id,thread_id,author_display_name,body,deleted_at")
      .order("created_at", { ascending: false });
    setComments(((commentRows ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id),
      threadId: String(row.thread_id),
      author: String(row.author_display_name ?? "Academy member"),
      body: String(row.body ?? ""),
      deletedAt: typeof row.deleted_at === "string" ? row.deleted_at : null,
    })));
  }, [client]);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { void load(); }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function ensureThread(lesson: LessonOption) {
    if (!auth.user) return;
    const current = threads.find((thread) => thread.lessonId === lesson.id);
    const { error } = await client.from("lesson_discussions").upsert({
      lesson_id: lesson.id,
      title: current?.title ?? `${lesson.title} discussion`,
      enabled: !(current?.enabled ?? false),
      created_by: auth.user.id,
    }, { onConflict: "lesson_id" });
    setMessage(error ? error.message : "Discussion setting updated.");
    if (!error) { auth.notifyDataChanged(); await load(); }
  }

  async function moderateComment(commentId: string) {
    if (!window.confirm("Remove this shared discussion comment?")) return;
    const { error } = await client
      .from("discussion_comments")
      .update({ body: "", deleted_at: new Date().toISOString() })
      .eq("id", commentId);
    setMessage(error ? error.message : "Discussion comment removed.");
    if (!error) await load();
  }

  return (
    <section className="admin-platform-panel">
      <p className="section-kicker">Shared discussions</p><h2>Enable and moderate lesson discussions</h2>
      <div className="admin-record-list">
        {lessons.map((lesson) => {
          const thread = threads.find((item) => item.lessonId === lesson.id);
          return (
            <article key={lesson.id}>
              <div><span>{lesson.id}</span><strong>{lesson.title}</strong><p>{thread?.enabled ? "Visible to signed-in members" : "Discussion disabled"}</p></div>
              <button type="button" onClick={() => void ensureThread(lesson)}>{thread?.enabled ? "Disable" : "Enable"}</button>
            </article>
          );
        })}
      </div>
      <h3 className="admin-subheading">Recent discussion comments</h3>
      <div className="admin-record-list">
        {comments.map((comment) => {
          const thread = threads.find((item) => item.id === comment.threadId);
          return (
            <article key={comment.id}>
              <div>
                <span>{thread?.lessonId ?? "Lesson"} · {comment.author}</span>
                <strong>{comment.deletedAt ? "Removed by a moderator" : comment.body}</strong>
              </div>
              {!comment.deletedAt && (
                <button type="button" onClick={() => void moderateComment(comment.id)}>Moderate</button>
              )}
            </article>
          );
        })}
        {comments.length === 0 && <p>No shared discussion comments yet.</p>}
      </div>
      {message && <p role="status">{message}</p>}
    </section>
  );
}

export default function AdminPortal({ lessons }: { lessons: LessonOption[] }) {
  const auth = useAcademyAuth();
  const [tab, setTab] = useState<AdminTab>("content");
  const tabs: Array<{ id: AdminTab; label: string }> = [
    { id: "content", label: "Content" },
    { id: "resources", label: "Resources" },
    { id: "learners", label: "Learners" },
    { id: "submissions", label: "Submissions" },
    { id: "discussions", label: "Discussions" },
  ];

  return (
    <main className="admin-platform-shell">
      <header className="admin-platform-header">
        <a className="brand" href="../" aria-label="Return to the Academy">
          <span className="brand-mark" aria-hidden="true"><span>RS</span></span>
          <span className="brand-name">Academy<strong>Administration</strong></span>
        </a>
        <a className="admin-back" href="../">← Return to the academy</a>
      </header>

      <AcademyAccountPanel />

      {!auth.user ? (
        <section className="admin-access-message">
          <h1>Sign in to manage the Academy.</h1>
          <p>
            Synchronized learner data requires an instructor or admin account. Public website
            content remains protected by the separate GitHub sign-in in Pages CMS.
          </p>
          <a className="button button-primary" href="https://app.pagescms.org/" target="_blank" rel="noreferrer">
            Open Pages CMS <span aria-hidden="true">↗</span>
          </a>
        </section>
      ) : !isStaffRole(auth.role) ? (
        <section className="admin-access-message">
          <h1>Instructor access required.</h1>
          <p>Your learner account cannot view resources, learners, submissions, or moderation tools.</p>
        </section>
      ) : auth.client ? (
        <div className="admin-platform-workspace">
          <nav className="admin-tabs" aria-label="Academy administration">
            {tabs.map((item) => (
              <button
                className={tab === item.id ? "active" : ""}
                type="button"
                aria-pressed={tab === item.id}
                onClick={() => setTab(item.id)}
                key={item.id}
              >
                {item.label}
              </button>
            ))}
          </nav>
          {tab === "content" && <ContentPanel />}
          {tab === "resources" && <ResourcesPanel client={auth.client} lessons={lessons} />}
          {tab === "learners" && <LearnersPanel client={auth.client} />}
          {tab === "submissions" && <SubmissionsPanel client={auth.client} />}
          {tab === "discussions" && <DiscussionsPanel client={auth.client} lessons={lessons} />}
        </div>
      ) : null}
    </main>
  );
}
