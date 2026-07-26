"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateProgress,
  createBrowserLearnerProgressStorage,
  createEmptyLearnerProgress,
  getNextIncompleteLessonId,
  type LearnerProgressState,
  type LearnerProgressStorage,
  type StorageLoadStatus,
} from "@/lib/learner-progress";

export type AcademyLesson = {
  id: string;
  week: string;
  title: string;
  description: string;
  tools: string[];
};

type LearnerCurriculumProps = {
  lessons: AcademyLesson[];
};

function activityTimestamp() {
  return new Date().toISOString();
}

export default function LearnerCurriculum({ lessons }: LearnerCurriculumProps) {
  const lessonIds = useMemo(() => lessons.map((lesson) => lesson.id), [lessons]);
  const storageRef = useRef<LearnerProgressStorage | null>(null);
  const [progress, setProgress] = useState<LearnerProgressState>(createEmptyLearnerProgress);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadStatus, setLoadStatus] = useState<StorageLoadStatus>("empty");
  const [saveFailed, setSaveFailed] = useState(false);

  // Browser-local state must hydrate after mount so server rendering stays deterministic.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storage = createBrowserLearnerProgressStorage();
    const loaded = storage.load();
    const summary = calculateProgress(lessonIds, loaded.state);
    const initialState = {
      ...loaded.state,
      currentLessonId: summary.currentLessonId,
    };

    storageRef.current = storage;
    setProgress(initialState);
    setLoadStatus(loaded.status);
    setHasLoaded(true);
  }, [lessonIds]);

  useEffect(() => {
    if (!hasLoaded || !storageRef.current) {
      return;
    }

    setSaveFailed(!storageRef.current.save(progress));
  }, [hasLoaded, progress]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const summary = calculateProgress(lessonIds, progress);
  const currentLesson = lessons.find((lesson) => lesson.id === summary.currentLessonId) ?? null;

  function setCurrentLesson(lessonId: string) {
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

  function resetProgress() {
    const confirmed = window.confirm(
      "Reset all lesson progress and personal notes saved in this browser?",
    );

    if (!confirmed) {
      return;
    }

    storageRef.current?.reset();
    setProgress({
      ...createEmptyLearnerProgress(),
      currentLessonId: lessonIds[0] ?? null,
    });
    setLoadStatus("empty");
    setSaveFailed(false);
  }

  const storageNotice = saveFailed || loadStatus === "unavailable"
    ? "Local saving is unavailable in this browser. Progress will last only until this page closes."
    : loadStatus === "recovered"
      ? "Unreadable browser data was safely reset. New progress will save in this browser."
      : "Progress and notes are saved only in this browser. They are not shared with other browsers or devices.";

  return (
    <>
      <section className="learner-dashboard" aria-labelledby="learner-dashboard-title">
        <div className="learner-dashboard-heading">
          <div>
            <p className="section-kicker">Your learning</p>
            <h3 id="learner-dashboard-title">Continue from where you stopped.</h3>
          </div>
          {currentLesson && (
            <a className="button button-primary learner-continue" href={`#${currentLesson.id}`}>
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

        <div className="learner-storage-row">
          <p>{storageNotice}</p>
          <button className="learner-reset" type="button" onClick={resetProgress}>
            Reset progress
          </button>
        </div>
      </section>

      <div className="module-list">
        {lessons.map((lesson, index) => {
          const isCompleted = progress.completedLessonIds.includes(lesson.id);
          const isCurrent = summary.currentLessonId === lesson.id;
          const noteId = `${lesson.id}-notes`;

          return (
            <article
              className={`module${isCompleted ? " module-complete" : ""}${isCurrent ? " module-current" : ""}`}
              id={lesson.id}
              key={lesson.id}
            >
              <div className="module-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="module-week">WEEKS {lesson.week}</div>
              <div className="module-copy">
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <div className="tool-list">
                  {lesson.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>

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
                    Personal lesson notes <span>Autosaved locally</span>
                  </label>
                  <textarea
                    id={noteId}
                    rows={4}
                    value={progress.lessonNotes[lesson.id] ?? ""}
                    placeholder="Keep a private note for this lesson."
                    onChange={(event) => setLessonNote(lesson.id, event.target.value)}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
