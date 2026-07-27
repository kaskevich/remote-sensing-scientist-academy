"use client";

import { useCallback, useEffect, useState } from "react";
import { useAcademyAuth } from "@/app/components/academy-auth-provider";
import { canManageDiscussionComment } from "@/lib/access-control";

type DiscussionThread = {
  id: string;
  title: string;
  enabled: boolean;
};

type DiscussionComment = {
  id: string;
  authorId: string;
  authorDisplayName: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
};

function mapComment(row: Record<string, unknown>): DiscussionComment {
  return {
    id: String(row.id),
    authorId: String(row.author_id),
    authorDisplayName:
      typeof row.author_display_name === "string" ? row.author_display_name : "Academy member",
    body: typeof row.body === "string" ? row.body : "",
    createdAt: String(row.created_at),
    editedAt: typeof row.edited_at === "string" ? row.edited_at : null,
    deletedAt: typeof row.deleted_at === "string" ? row.deleted_at : null,
  };
}

export default function LessonDiscussion({
  lessonId,
  lessonTitle,
}: {
  lessonId: string;
  lessonTitle: string;
}) {
  const auth = useAcademyAuth();
  const [thread, setThread] = useState<DiscussionThread | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  const loadDiscussion = useCallback(async () => {
    if (!auth.client || !auth.user) return;
    const { data } = await auth.client
      .from("lesson_discussions")
      .select("id,title,enabled")
      .eq("lesson_id", lessonId)
      .maybeSingle();
    if (!data) {
      setThread(null);
      setComments([]);
      return;
    }
    const mappedThread = {
      id: String(data.id),
      title: String(data.title || `${lessonTitle} discussion`),
      enabled: data.enabled === true,
    };
    setThread(mappedThread);
    const { data: commentRows } = await auth.client
      .from("discussion_comments")
      .select("id,author_id,author_display_name,body,created_at,edited_at,deleted_at")
      .eq("thread_id", mappedThread.id)
      .order("created_at");
    setComments(((commentRows ?? []) as Array<Record<string, unknown>>).map(mapComment));
  }, [auth.client, auth.user, lessonId, lessonTitle]);

  // Discussion data is browser-authenticated external state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadDiscussion();
  }, [loadDiscussion, auth.dataRevision]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function addComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.client || !auth.user || !thread || !body.trim()) return;
    const { error } = await auth.client.from("discussion_comments").insert({
      thread_id: thread.id,
      author_id: auth.user.id,
      body: body.trim(),
    });
    if (error) {
      setMessage("Your discussion comment could not be posted.");
      return;
    }
    setBody("");
    setMessage("");
    await loadDiscussion();
  }

  async function editComment(comment: DiscussionComment) {
    if (!auth.client) return;
    const nextBody = window.prompt("Edit your discussion comment", comment.body);
    if (!nextBody?.trim()) return;
    const { error } = await auth.client
      .from("discussion_comments")
      .update({ body: nextBody.trim(), edited_at: new Date().toISOString() })
      .eq("id", comment.id);
    if (!error) await loadDiscussion();
  }

  async function deleteComment(comment: DiscussionComment) {
    if (!auth.client || !window.confirm("Remove this shared discussion comment?")) return;
    const { error } = await auth.client
      .from("discussion_comments")
      .update({ deleted_at: new Date().toISOString(), body: "" })
      .eq("id", comment.id);
    if (!error) await loadDiscussion();
  }

  if (!auth.user) {
    return (
      <section className="lesson-discussion discussion-signed-out">
        <span>Shared lesson discussion</span>
        <p>Sign in to read or join the optional discussion for this lesson.</p>
      </section>
    );
  }

  if (!thread?.enabled) {
    return (
      <section className="lesson-discussion discussion-disabled">
        <span>Shared lesson discussion</span>
        <p>Discussion is not enabled for this lesson.</p>
      </section>
    );
  }

  return (
    <section className="lesson-discussion" aria-labelledby={`${lessonId}-discussion-title`}>
      <div>
        <span>Shared lesson discussion</span>
        <h4 id={`${lessonId}-discussion-title`}>{thread.title}</h4>
        <p>Visible to signed-in learners and instructors.</p>
      </div>
      {comments.length > 0 && (
        <ol>
          {comments.map((comment) => {
            const canManage = auth.user && auth.role
              ? canManageDiscussionComment(
                  { id: auth.user.id, role: auth.role },
                  comment.authorId,
                )
              : false;
            return (
              <li key={comment.id}>
                <strong>{comment.authorDisplayName}</strong>
                <p>{comment.deletedAt ? "Comment removed by a moderator." : comment.body}</p>
                <time>{new Date(comment.createdAt).toLocaleString()}{comment.editedAt ? " · edited" : ""}</time>
                {canManage && !comment.deletedAt && (
                  <div>
                    {comment.authorId === auth.user?.id && (
                      <button type="button" onClick={() => void editComment(comment)}>Edit</button>
                    )}
                    <button type="button" onClick={() => void deleteComment(comment)}>
                      {comment.authorId === auth.user?.id ? "Delete" : "Moderate"}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <form onSubmit={addComment}>
        <label htmlFor={`${lessonId}-discussion-comment`}>Add to the shared discussion</label>
        <textarea
          id={`${lessonId}-discussion-comment`}
          rows={3}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <button type="submit" disabled={!body.trim()}>Post to discussion</button>
      </form>
      {message && <p role="status">{message}</p>}
    </section>
  );
}
