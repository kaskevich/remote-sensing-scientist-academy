"use client";

import { useEffect, useState } from "react";
import { useAcademyAuth } from "@/app/components/academy-auth-provider";
import {
  createAuthenticatedLearnerDataProvider,
  createGuestLearnerDataProvider,
  hasMeaningfulGuestProgress,
  migrateGuestProgressToAccount,
} from "@/lib/learner-data";

export default function AcademyAccountPanel() {
  const auth = useAcademyAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasGuestProgress, setHasGuestProgress] = useState(false);

  useEffect(() => {
    if (!auth.user || auth.profile?.localMigrationCompletedAt) {
      return;
    }

    const guestProvider = createGuestLearnerDataProvider();
    void guestProvider.load().then(({ state }) => {
      setHasGuestProgress(hasMeaningfulGuestProgress(state));
    });
  }, [auth.user, auth.profile?.localMigrationCompletedAt]);

  async function requestMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const result = await auth.signInWithMagicLink(email);
    setMessage(result.message);
    setSubmitting(false);
  }

  async function importGuestProgress() {
    if (!auth.client || !auth.user) return;
    setSubmitting(true);
    const imported = await migrateGuestProgressToAccount(
      createGuestLearnerDataProvider(),
      createAuthenticatedLearnerDataProvider(auth.client, auth.user.id),
    );
    const marked = imported && (await auth.markLocalMigrationComplete());
    setMessage(
      marked
        ? "Browser progress and notes were copied into your Academy account."
        : "The browser progress could not be imported. It has not been deleted.",
    );
    if (marked) {
      setHasGuestProgress(false);
      auth.notifyDataChanged();
    }
    setSubmitting(false);
  }

  async function keepGuestProgressSeparate() {
    setSubmitting(true);
    const marked = await auth.markLocalMigrationComplete();
    if (marked) {
      setHasGuestProgress(false);
      setMessage("Your existing browser work remains separate and has not been deleted.");
    } else {
      setMessage("This preference could not be saved. Your browser work remains untouched.");
    }
    setSubmitting(false);
  }

  if (auth.loading) {
    return <div className="academy-account-panel">Checking your Academy account…</div>;
  }

  if (auth.user) {
    return (
      <div className="academy-account-panel academy-account-signed-in">
        <div>
          <span>Signed in · {auth.profile?.role ?? "learner"}</span>
          <strong>{auth.profile?.displayName ?? auth.user.email}</strong>
          <p>Progress, private notes, submissions, and feedback synchronize across devices.</p>
        </div>
        <button type="button" onClick={() => void auth.signOut()}>
          Sign out
        </button>

        {hasGuestProgress && !auth.profile?.localMigrationCompletedAt && (
          <div className="academy-migration" role="status">
            <strong>Bring your existing browser work into this account?</strong>
            <p>
              This copies your local lesson progress and private notes. The browser copy is kept.
            </p>
            <div>
              <button
                className="button button-primary"
                type="button"
                disabled={submitting}
                onClick={() => void importGuestProgress()}
              >
                Import browser work
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void keepGuestProgressSeparate()}
              >
                Keep separate
              </button>
            </div>
          </div>
        )}
        {(message || auth.error) && <p className="academy-account-message">{message || auth.error}</p>}
      </div>
    );
  }

  if (!auth.configured) {
    return (
      <div className="academy-account-panel">
        <div>
          <span>Guest workspace</span>
          <strong>Your work stays in this browser</strong>
          <p>Account synchronization will become available when the Academy backend is connected.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="academy-account-panel academy-sign-in" onSubmit={requestMagicLink}>
      <div>
        <span>Academy account</span>
        <strong>Save your work across devices</strong>
        <p>Enter your email and we will send a secure magic sign-in link.</p>
      </div>
      <label htmlFor="academy-sign-in-email">
        Email address
        <input
          id="academy-sign-in-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <button className="button button-primary" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Email me a sign-in link"}
      </button>
      {(message || auth.error) && <p className="academy-account-message" role="status">{message || auth.error}</p>}
    </form>
  );
}

export function AcademyDashboardStats() {
  const auth = useAcademyAuth();
  const [pending, setPending] = useState(0);
  const [needsAttention, setNeedsAttention] = useState(0);

  useEffect(() => {
    if (!auth.client || !auth.user) {
      return;
    }

    let active = true;
    void auth.client
      .from("submissions")
      .select("status")
      .eq("user_id", auth.user.id)
      .then(({ data }) => {
        if (!active) return;
        const statuses = ((data ?? []) as Array<{ status: string }>).map((row) => row.status);
        setPending(statuses.filter((status) => status === "not_reviewed").length);
        setNeedsAttention(statuses.filter((status) => status === "needs_revision").length);
      });

    return () => {
      active = false;
    };
  }, [auth.client, auth.user, auth.dataRevision]);

  if (!auth.user) return null;

  return (
    <div className="learner-synced-stats" aria-label="Submission summary">
      <div>
        <span>Pending submissions</span>
        <strong>{pending}</strong>
      </div>
      <div>
        <span>Feedback requiring attention</span>
        <strong>{needsAttention}</strong>
      </div>
    </div>
  );
}
