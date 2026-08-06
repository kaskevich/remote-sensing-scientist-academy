"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateProgress,
  createEmptyLearnerProgress,
  getNextIncompleteLessonId,
  type LearnerProgressState,
  type StorageLoadStatus,
} from "@/lib/learner-progress";
import {
  createAuthenticatedLearnerDataProvider,
  createGuestLearnerDataProvider,
  type LearnerDataProvider,
} from "@/lib/learner-data";
import {
  LessonImageGallery,
  LessonResources,
  MarkdownContent,
  type LessonImage,
  type LessonMap,
  type LessonResource,
} from "@/app/components/lesson-materials";
import TaskResultPanel from "@/app/components/task-result-panel";
import AcademyAccountPanel, {
  AcademyDashboardStats,
} from "@/app/components/academy-account-panel";
import { useAcademyAuth } from "@/app/components/academy-auth-provider";
import LessonDiscussion from "@/app/components/lesson-discussion";
import SyncedLessonResources from "@/app/components/synced-lesson-resources";

export type AcademyLesson = {
  id: string;
  week: string;
  title: string;
  description: string;
  tools: string[];
  content: string;
  images: LessonImage[];
  resources: LessonResource[];
  task: {
    title: string;
    instructions: string;
    referenceImages: LessonImage[];
    referenceMaps: LessonMap[];
  };
};

type LearnerCurriculumProps = {
  lessons: AcademyLesson[];
};

function activityTimestamp() {
  return new Date().toISOString();
}

export default function LearnerCurriculum({ lessons }: LearnerCurriculumProps) {
  const auth = useAcademyAuth();
  const lessonIds = useMemo(() => lessons.map((lesson) => lesson.id), [lessons]);
  const storageRef = useRef<LearnerDataProvider | null>(null);
  const [progress, setProgress] = useState<LearnerProgressState>(createEmptyLearnerProgress);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadStatus, setLoadStatus] = useState<StorageLoadStatus>("empty");
  const [saveFailed, setSaveFailed] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(true);
  const [openLessonId, setOpenLessonId] = useState<string | null>(() => lessons[0]?.id ?? null);

  // Browser-local state must hydrate after mount so server rendering stays deterministic.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storage = auth.client && auth.user
      ? createAuthenticatedLearnerDataProvider(auth.client, auth.user.id)
      : createGuestLearnerDataProvider();
    let active = true;
    storageRef.current = storage;
    setHasLoaded(false);
    void storage.load().then((loaded) => {
      if (!active) return;
      const summary = calculateProgress(lessonIds, loaded.state);
      setProgress({
        ...loaded.state,
        currentLessonId: summary.currentLessonId,
      });
      setLoadStatus(loaded.status);
      setHasLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [auth.client, auth.user, auth.dataRevision, lessonIds]);

  useEffect(() => {
    if (!hasLoaded || !storageRef.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void storageRef.current?.save(progress).then((saved) => setSaveFailed(!saved));
    }, storageRef.current.mode === "authenticated" ? 600 : 0);

    return () => window.clearTimeout(timeout);
  }, [hasLoaded, progress]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const summary = calculateProgress(lessonIds, progress);
  const currentLesson = lessons.find((lesson) => lesson.id === summary.currentLessonId) ?? null;

  function setCurrentLesson(lessonId: string) {
    setIsModuleOpen(true);
    setOpenLessonId(lessonId);
    setProgress((previous) => ({
      ...previous,
      currentLessonId: lessonId,
      lastActivityTimestamp: activityTimestamp(),
    }));
  }

  function setLessonCompletion(lessonId: string, isCompleted: boolean) {
    setProgress((previous) => {
      const completedLessonIds = isCompleted
        ? Array.from(new Set([...previous.completedLessonIds, lessonId]))
        : previous.completedLessonIds.filter((completedId) => completedId !== lessonId);
      const currentLessonId = isCompleted
        ? getNextIncompleteLessonId(lessonIds, completedLessonIds, lessonId) ?? lessonId
        : lessonId;

      return {
        ...previous,
        completedLessonIds,
        currentLessonId,
        lastActivityTimestamp: activityTimestamp(),
      };
    });
  }

  function setLessonNote(lessonId: string, note: string) {
    setProgress((previous) => ({
      ...previous,
      currentLessonId: lessonId,
      lessonNotes: {
        ...previous.lessonNotes,
        [lessonId]: note,
      },
      lastActivityTimestamp: activityTimestamp(),
    }));
  }

  async function resetProgress() {
    const confirmed = window.confirm(
      auth.user
        ? "Reset all synchronized lesson progress and private notes in your Academy account?"
        : "Reset all lesson progress and personal notes saved in this browser?",
    );

    if (!confirmed) {
      return;
    }

    await storageRef.current?.reset();
    setProgress({
      ...createEmptyLearnerProgress(),
      currentLessonId: lessonIds[0] ?? null,
    });
    setLoadStatus("empty");
    setSaveFailed(false);
  }

  const storageNotice = saveFailed || loadStatus === "unavailable"
    ? auth.user
      ? "Account synchronization is temporarily unavailable. Recent changes may not be saved."
      : "Local saving is unavailable in this browser. Progress will last only until this page closes."
    : loadStatus === "recovered"
      ? "Unreadable browser data was safely reset. New progress will save in this browser."
      : auth.user
        ? "Progress and private notes are synchronized securely with your Academy account."
        : "Progress and notes are saved only in this browser. They are not shared with other browsers or devices.";

  return (
    <>
      <section className="learner-dashboard" aria-labelledby="learner-dashboard-title">
        <AcademyAccountPanel />
        <div className="learner-dashboard-heading">
          <div>
            <p className="section-kicker">Your learning</p>
            <h3 id="learner-dashboard-title">Continue from where you stopped</h3>
          </div>
          {currentLesson && (
            <a
              className="button button-primary learner-continue"
              href={`#${currentLesson.id}`}
              onClick={() => {
                setIsModuleOpen(true);
                setOpenLessonId(currentLesson.id);
              }}
            >
              Continue learning <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>

        <div className="learner-summary-grid">
          <div className="learner-summary-item learner-current-summary">
            <span>Current lesson</span>
            <strong>{currentLesson?.title ?? "No lesson selected"}</strong>
          </div>
          <div className="learner-summary-item">
            <span>Completed lessons</span>
            <strong>
              {summary.completedLessonCount} / {summary.totalLessonCount}
            </strong>
          </div>
          <div className="learner-summary-item learner-progress-summary">
            <span>Module progress</span>
            <strong>{summary.completionPercent}%</strong>
            <div
              className="learner-progress-track"
              role="progressbar"
              aria-label="Curriculum completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={summary.completionPercent}
            >
              <span style={{ width: `${summary.completionPercent}%` }} />
            </div>
          </div>
        </div>

        <AcademyDashboardStats />

        <div className="learner-storage-row">
          <p>{storageNotice}</p>
          <button className="learner-reset" type="button" onClick={() => void resetProgress()}>
            Reset progress
          </button>
        </div>
      </section>

      <details
        className="curriculum-module"
        open={isModuleOpen}
      >
        <summary
          className="curriculum-module-summary"
          onClick={(event) => {
            event.preventDefault();
            setIsModuleOpen((previous) => !previous);
          }}
        >
          <span>
            <small>Module navigation</small>
            <strong>Module 1 lessons</strong>
          </span>
          <span className="curriculum-module-meta">
            <span>{lessons.length} lessons</span>
            <span className="curriculum-module-toggle">
              <span className="curriculum-module-toggle-open">Hide lessons</span>
              <span className="curriculum-module-toggle-closed">Show lessons</span>
              <i aria-hidden="true" />
            </span>
          </span>
        </summary>

        <div className="module-list">
          {lessons.map((lesson, index) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);
            const isCurrent = summary.currentLessonId === lesson.id;
            const isOpen = openLessonId === lesson.id;
            const noteId = `${lesson.id}-notes`;

            return (
              <details
                className={`module${isCompleted ? " module-complete" : ""}${isCurrent ? " module-current" : ""}`}
                id={lesson.id}
                key={lesson.id}
                open={isOpen}
              >
                <summary
                  className="module-summary"
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenLessonId((previous) => previous === lesson.id ? null : lesson.id);
                  }}
                >
                  <span className="module-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="module-week">WEEKS {lesson.week}</span>
                  <span className="module-overview">
                    <span className="module-title-row">
                      <span className="module-lesson-label">Lesson {String(index + 1).padStart(2, "0")}</span>
                      {isCompleted && <span className="module-status">Completed</span>}
                      {!isCompleted && isCurrent && <span className="module-status">Current</span>}
                    </span>
                    <strong className="module-heading">{lesson.title}</strong>
                    <span className="module-description">{lesson.description}</span>
                    <span className="tool-list">
                      {lesson.tools.map((tool) => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </span>
                    <span className="module-toggle">
                      {isOpen ? "Close lesson" : "Open lesson"}
                      <i aria-hidden="true" />
                    </span>
                  </span>
                </summary>

                <div className="module-body">
                  <div className="module-copy">
                    {(lesson.content || lesson.images.length > 0 || lesson.resources.length > 0) && (
                      <div className="lesson-managed-content">
                        <MarkdownContent>{lesson.content}</MarkdownContent>
                        <LessonImageGallery images={lesson.images} />
                        <LessonResources resources={lesson.resources} />
                      </div>
                    )}

                    <SyncedLessonResources lessonId={lesson.id} />

                    <div className="lesson-actions">
                      <label className="lesson-completion-control">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={(event) => setLessonCompletion(lesson.id, event.target.checked)}
                        />
                        <span>{isCompleted ? "Lesson completed" : "Mark lesson complete"}</span>
                      </label>
                      {isCurrent ? (
                        <span className="current-lesson-label">Current lesson</span>
                      ) : (
                        <button type="button" onClick={() => setCurrentLesson(lesson.id)}>
                          Set as current
                        </button>
                      )}
                    </div>

                    <div className="lesson-notes">
                      <label htmlFor={noteId}>
                        Private learner notes <span>{auth.user ? "Autosaved to your account" : "Autosaved locally"}</span>
                      </label>
                      <textarea
                        id={noteId}
                        rows={4}
                        value={progress.lessonNotes[lesson.id] ?? ""}
                        placeholder="Keep a private note for this lesson."
                        onChange={(event) => setLessonNote(lesson.id, event.target.value)}
                      />
                    </div>

                    <TaskResultPanel
                      lessonId={lesson.id}
                      title={lesson.task.title}
                      instructions={lesson.task.instructions}
                      referenceImages={lesson.task.referenceImages}
                      referenceMaps={lesson.task.referenceMaps}
                    />
                    <LessonDiscussion lessonId={lesson.id} lessonTitle={lesson.title} />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </details>
    </>
  );
}
