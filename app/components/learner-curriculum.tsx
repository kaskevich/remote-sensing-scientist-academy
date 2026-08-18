"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateChapterProgress,
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
import LessonCodeWorkspace from "@/app/components/lesson-code-workspace";
import type {
  AcademyModuleOverview,
  ReviewedLessonDetails,
} from "@/lib/module1-pedagogy";

export type AcademyLesson = {
  id: string;
  kind?: "lesson" | "practicum";
  numberLabel?: string;
  scheduleLabel?: string;
  week: string;
  title: string;
  description: string;
  tools: string[];
  content: string;
  starterCode?: string;
  images: LessonImage[];
  resources: LessonResource[];
  task: {
    title: string;
    instructions: string;
    referenceImages: LessonImage[];
    referenceMaps: LessonMap[];
  };
  pedagogy: ReviewedLessonDetails | null;
};

export type AcademyCurriculumModule = {
  overview: AcademyModuleOverview;
  lessons: AcademyLesson[];
};

type LearnerCurriculumProps = {
  modules: AcademyCurriculumModule[];
};

function activityTimestamp() {
  return new Date().toISOString();
}

function ModuleOverview({
  overview,
  completedLessonIds,
  onOpenLesson,
}: {
  overview: AcademyModuleOverview;
  completedLessonIds: string[];
  onOpenLesson: (lessonId: string) => void;
}) {
  return (
    <section className={`module-overview-panel module-overview-${overview.accent}`} aria-labelledby={`module-${overview.moduleNumber}-overview-title`}>
      <div className="module-overview-intro">
        <div>
          <p className="section-kicker">{overview.overviewLabel}</p>
          <h3 id={`module-${overview.moduleNumber}-overview-title`}>{overview.title}</h3>
          <p>{overview.purpose}</p>
        </div>
        <dl>
          <div><dt>Final project</dt><dd>{overview.finalProject}</dd></div>
          <div><dt>Prerequisites</dt><dd>{overview.prerequisites}</dd></div>
        </dl>
      </div>

      {overview.progression && (
        <ol className="module-concept-progression" aria-label={`Module ${overview.moduleNumber} conceptual progression`}>
          {overview.progression.map((stage, index) => (
            <li key={stage}><span>{String(index + 1).padStart(2, "0")}</span>{stage}</li>
          ))}
        </ol>
      )}

      <details className="module-outcomes" open>
        <summary>Module outcomes</summary>
        <p>By the end of the module, you can:</p>
        <ul>
          {overview.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
        </ul>
      </details>

      <div className="module-syllabus" aria-label={overview.syllabusAriaLabel}>
        {overview.chapters.map((chapter) => (
          <ChapterOverview
            key={chapter.number}
            chapter={chapter}
            moduleNumber={overview.moduleNumber}
            completedLessonIds={completedLessonIds}
            onOpenLesson={onOpenLesson}
          />
        ))}
        {overview.capstone && (
          <details className="module-chapter module-capstone-map">
            <summary className="module-chapter-heading">
              <span>Capstone</span>
              <h4>Professional portfolio project</h4>
              <i aria-hidden="true" />
            </summary>
            <ol>
              <li className={overview.capstone.status === "planned" ? "syllabus-planned" : "syllabus-available"}>
                <span className="syllabus-number">CP</span>
                <div>
                  {overview.capstone.lessonId ? (
                    <a href={`#${overview.capstone.lessonId}`} onClick={() => onOpenLesson(overview.capstone?.lessonId as string)}>
                      {overview.capstone.title}
                    </a>
                  ) : (
                    <strong>{overview.capstone.title}</strong>
                  )}
                  <span>{overview.capstone.status === "planned" ? "Planned syllabus" : overview.capstone.lessonId && completedLessonIds.includes(overview.capstone.lessonId) ? "Completed" : "Available now"}</span>
                </div>
              </li>
            </ol>
          </details>
        )}
      </div>
      <p className="module-planning-note">{overview.planningNote}</p>
    </section>
  );
}

function ChapterOverview({
  chapter,
  moduleNumber,
  completedLessonIds,
  onOpenLesson,
}: {
  chapter: AcademyModuleOverview["chapters"][number];
  moduleNumber: number;
  completedLessonIds: string[];
  onOpenLesson: (lessonId: string) => void;
}) {
  const availableIds = [
    ...chapter.lessons.flatMap((lesson) => lesson.lessonId ? [lesson.lessonId] : []),
    ...(chapter.practicum?.lessonId ? [chapter.practicum.lessonId] : []),
  ];
  const progress = calculateChapterProgress(availableIds, completedLessonIds);

  return (
    <details className="module-chapter" open={chapter.number === 1}>
      <summary className="module-chapter-heading">
        <span>Chapter {chapter.number}</span>
        <h4>{chapter.title}</h4>
        {progress.totalItemCount > 0 && (
          <span className="module-chapter-progress">
            {progress.completedItemCount}/{progress.totalItemCount} complete
          </span>
        )}
        <i aria-hidden="true" />
      </summary>
      {progress.totalItemCount > 0 && (
        <div className="module-chapter-progressbar" role="progressbar" aria-label={`Chapter ${chapter.number} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.completionPercent}>
          <span style={{ width: `${progress.completionPercent}%` }} />
        </div>
      )}
      <ol>
              {chapter.lessons.map((lesson) => {
                const isComplete = lesson.lessonId
                  ? completedLessonIds.includes(lesson.lessonId)
                  : false;
                return (
                  <li className={lesson.status === "planned" ? "syllabus-planned" : "syllabus-available"} key={lesson.number}>
                    <span className="syllabus-number">{moduleNumber}.{lesson.number}</span>
                    <div>
                      {lesson.lessonId ? (
                        <a
                          href={`#${lesson.lessonId}`}
                          onClick={() => onOpenLesson(lesson.lessonId as string)}
                        >
                          {lesson.title}
                        </a>
                      ) : (
                        <strong>{lesson.title}</strong>
                      )}
                      <span>{lesson.status === "planned" ? "Planned syllabus" : isComplete ? "Completed" : "Available now"}</span>
                    </div>
                  </li>
                );
              })}
      </ol>
      {chapter.practicum && (
        <div className={`module-practicum-row ${chapter.practicum.status === "planned" ? "syllabus-planned" : "syllabus-available"}`}>
          <span className="syllabus-number">PRACTICUM</span>
          <div>
            {chapter.practicum.lessonId ? (
              <a href={`#${chapter.practicum.lessonId}`} onClick={() => onOpenLesson(chapter.practicum?.lessonId as string)}>
                {chapter.practicum.title}
              </a>
            ) : (
              <strong>{chapter.practicum.title}</strong>
            )}
            <span>{chapter.practicum.status === "planned" ? "Planned syllabus" : chapter.practicum.lessonId && completedLessonIds.includes(chapter.practicum.lessonId) ? "Completed" : "Available now"}</span>
          </div>
        </div>
      )}
    </details>
  );
}

function LessonSubmissionGuide({ lessonId, pedagogy }: { lessonId: string; pedagogy: ReviewedLessonDetails }) {
  return (
    <section className="lesson-submission-guide" aria-labelledby={`submission-guide-${lessonId}`}>
      <div className="lesson-submission-guide-heading">
        <span>Submission guide</span>
        <h3 id={`submission-guide-${lessonId}`}>Checklist and review rubric</h3>
      </div>
      <div className="lesson-submission-columns">
        <div>
          <h4>Before submitting</h4>
          <ul className="submission-checklist">
            {pedagogy.submissionChecklist.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4>Review dimensions</h4>
          <dl className="lesson-rubric">
            {pedagogy.rubric.map((item) => (
              <div key={item.dimension}><dt>{item.dimension}</dt><dd>{item.expectation}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <div className="review-status-key" aria-label="Submission review statuses">
        <span>Review statuses</span>
        <ul>
          {[
            "Not submitted",
            "Submitted",
            "Revision requested",
            "Meets expectations",
            "Portfolio ready",
          ].map((status) => <li key={status}>{status}</li>)}
        </ul>
      </div>
    </section>
  );
}

function LessonTechnicalDetails({ pedagogy }: { pedagogy: ReviewedLessonDetails }) {
  const metadata = pedagogy.technicalMetadata;
  return (
    <details className="lesson-technical-details">
      <summary>Technical and source information</summary>
      <dl>
        {metadata.testedVersions?.map((item) => (
          <div key={item.label}><dt>Tested {item.label}</dt><dd>{item.value}</dd></div>
        ))}
        <div><dt>Tested Python</dt><dd>{metadata.pythonVersion}</dd></div>
        <div><dt>Tested Jupyter environment</dt><dd>{metadata.jupyterEnvironment}</dd></div>
        <div><dt>Last technical review</dt><dd>{metadata.reviewDate}</dd></div>
        {metadata.datasetCitation && <div><dt>Dataset citation</dt><dd>{metadata.datasetCitation}</dd></div>}
      </dl>
      <div className="lesson-reference-columns">
        <div>
          <h4>Core references</h4>
          <ul>{metadata.coreReferences.map((reference) => <li key={reference.href}><a href={reference.href} target="_blank" rel="noreferrer">{reference.title}</a></li>)}</ul>
        </div>
        <div>
          <h4>Optional further reading</h4>
          <ul>{metadata.furtherReading.map((reference) => <li key={reference.href}><a href={reference.href} target="_blank" rel="noreferrer">{reference.title}</a></li>)}</ul>
        </div>
      </div>
    </details>
  );
}

export default function LearnerCurriculum({ modules }: LearnerCurriculumProps) {
  const lessons = useMemo(() => modules.flatMap((module) => module.lessons), [modules]);
  const auth = useAcademyAuth();
  const lessonIds = useMemo(() => lessons.map((lesson) => lesson.id), [lessons]);
  const storageRef = useRef<LearnerDataProvider | null>(null);
  const [progress, setProgress] = useState<LearnerProgressState>(createEmptyLearnerProgress);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadStatus, setLoadStatus] = useState<StorageLoadStatus>("empty");
  const [saveFailed, setSaveFailed] = useState(false);
  const [openModuleNumbers, setOpenModuleNumbers] = useState<number[]>(() => modules[0] ? [modules[0].overview.moduleNumber] : []);
  const [openLessonId, setOpenLessonId] = useState<string | null>(() => lessons[0]?.id ?? null);
  const [completedChecks, setCompletedChecks] = useState<Record<string, string[]>>({});
  const authenticatedStorageReady = Boolean(!auth.loading && auth.client && auth.user);
  const storageRevision = authenticatedStorageReady ? auth.dataRevision : 0;

  // Browser-local state must hydrate after mount so server rendering stays deterministic.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storage = authenticatedStorageReady && auth.client && auth.user
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
  }, [auth.client, auth.user, authenticatedStorageReady, storageRevision, lessonIds]);

  useEffect(() => {
    function openLessonFromHash() {
      const lessonId = decodeURIComponent(window.location.hash.slice(1));
      if (!lessonIds.includes(lessonId)) return;

      const moduleNumber = modules.find((module) =>
        module.lessons.some((lesson) => lesson.id === lessonId),
      )?.overview.moduleNumber;

      if (moduleNumber !== undefined) {
        setOpenModuleNumbers((previous) => Array.from(new Set([...previous, moduleNumber])));
      }
      setOpenLessonId(lessonId);
    }

    openLessonFromHash();
    window.addEventListener("hashchange", openLessonFromHash);
    return () => window.removeEventListener("hashchange", openLessonFromHash);
  }, [lessonIds, modules]);

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

  function moduleNumberForLesson(lessonId: string) {
    return modules.find((module) => module.lessons.some((lesson) => lesson.id === lessonId))?.overview.moduleNumber;
  }

  function openModuleForLesson(lessonId: string) {
    const moduleNumber = moduleNumberForLesson(lessonId);
    if (moduleNumber === undefined) return;
    setOpenModuleNumbers((previous) => Array.from(new Set([...previous, moduleNumber])));
  }

  function setCurrentLesson(lessonId: string) {
    openModuleForLesson(lessonId);
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
      authenticatedStorageReady
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
    ? authenticatedStorageReady
      ? "Account synchronization is temporarily unavailable. Recent changes may not be saved."
      : "Local saving is unavailable in this browser. Progress will last only until this page closes."
    : loadStatus === "recovered"
      ? "Unreadable browser data was safely reset. New progress will save in this browser."
      : authenticatedStorageReady
        ? "Progress and private notes are synchronized securely with your Academy account."
        : "Progress and notes are saved only in this browser. They are not shared with other browsers or devices.";

  return (
    <>
      {modules.map((module) => (
        <ModuleOverview
          key={module.overview.moduleNumber}
          overview={module.overview}
          completedLessonIds={progress.completedLessonIds}
          onOpenLesson={(lessonId) => {
            openModuleForLesson(lessonId);
            setOpenLessonId(lessonId);
          }}
        />
      ))}

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
                openModuleForLesson(currentLesson.id);
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
            <span>Academy progress</span>
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

      {modules.map(({ overview, lessons: moduleLessons }) => {
        const isModuleOpen = openModuleNumbers.includes(overview.moduleNumber);
        return (
      <details
        className={`curriculum-module curriculum-module-${overview.accent}`}
        open={isModuleOpen}
        key={overview.moduleNumber}
        suppressHydrationWarning
      >
        <summary
          className="curriculum-module-summary"
          onClick={(event) => {
            event.preventDefault();
            setOpenModuleNumbers((previous) => isModuleOpen
              ? previous.filter((number) => number !== overview.moduleNumber)
              : [...previous, overview.moduleNumber]);
          }}
        >
          <span>
            <small>Module navigation</small>
            <strong>{overview.navigationTitle}</strong>
          </span>
          <span className="curriculum-module-meta">
            <span>{overview.navigationMeta}</span>
            <span className="curriculum-module-toggle">
              <span className="curriculum-module-toggle-open">Hide lessons</span>
              <span className="curriculum-module-toggle-closed">Show lessons</span>
              <i aria-hidden="true" />
            </span>
          </span>
        </summary>

        <div className="module-list">
          {moduleLessons.map((lesson, index) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);
            const isCurrent = summary.currentLessonId === lesson.id;
            const isOpen = openLessonId === lesson.id;
            const noteId = `${lesson.id}-notes`;
            const pedagogy = lesson.pedagogy;
            const completedLessonChecks = completedChecks[lesson.id] ?? [];
            const previousLesson = moduleLessons[index - 1] ?? null;
            const nextLesson = moduleLessons[index + 1] ?? null;
            return (
              <details
                className={`module${isCompleted ? " module-complete" : ""}${isCurrent ? " module-current" : ""}`}
                id={lesson.id}
                key={lesson.id}
                open={isOpen}
                suppressHydrationWarning
              >
                <summary
                  className="module-summary"
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenLessonId((previous) => previous === lesson.id ? null : lesson.id);
                  }}
                >
                  <span className="module-index">{lesson.numberLabel ?? String(index + 1).padStart(2, "0")}</span>
                  <span className="module-week">{lesson.scheduleLabel ?? `WEEKS ${lesson.week}`}</span>
                  <span className="module-overview">
                    <span className="module-title-row">
                      <span className="module-lesson-label">
                        {lesson.kind === "practicum"
                          ? "Chapter practicum"
                          : lesson.numberLabel === "Capstone"
                          ? "Capstone"
                          : lesson.numberLabel
                            ? `Lesson ${lesson.numberLabel}`
                            : `Lesson ${String(index + 1).padStart(2, "0")}`}
                      </span>
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

                {isOpen && <div className="module-body">
                  <div className="module-copy">
                    {pedagogy && (
                      <div className="lesson-context" aria-label="Lesson position and progress">
                        <span>{lesson.kind === "practicum" ? "Chapter practicum" : lesson.numberLabel === "Capstone" ? "Module capstone" : `Lesson ${lesson.numberLabel ?? pedagogy.position} of ${pedagogy.totalPositions}`}</span>
                        {pedagogy.lessonType && <span>{pedagogy.lessonType}</span>}
                        <strong>{pedagogy.estimatedTime}</strong>
                        <span>{completedLessonChecks.length} of {pedagogy.formativeChecks.length} checks completed</span>
                      </div>
                    )}
                    <div className="lesson-layer-key" aria-label="Lesson content layers">
                      <span><i className="layer-core" />Core lesson · required</span>
                      <span><i className="layer-scientific" />Scientific note · applied context</span>
                      <span><i className="layer-deeper" />Go deeper · optional</span>
                    </div>
                    {(lesson.content || lesson.images.length > 0 || lesson.resources.length > 0) && (
                      <div className="lesson-managed-content">
                        <MarkdownContent
                          lessonId={lesson.id}
                          formativeChecks={pedagogy?.formativeChecks}
                          completedCheckIds={completedLessonChecks}
                          onCheckCompleted={(checkId) => {
                            setCompletedChecks((previous) => ({
                              ...previous,
                              [lesson.id]: Array.from(new Set([...(previous[lesson.id] ?? []), checkId])),
                            }));
                          }}
                          showTableOfContents
                        >
                          {lesson.content}
                        </MarkdownContent>
                        <LessonImageGallery images={lesson.images} />
                        <LessonResources resources={lesson.resources} />
                      </div>
                    )}

                    <SyncedLessonResources lessonId={lesson.id} />

                    {lesson.starterCode && (
                      <LessonCodeWorkspace lessonId={lesson.id} starterCode={lesson.starterCode} />
                    )}

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

                    <nav className="lesson-sequence-navigation" aria-label="Previous and next lessons">
                      {previousLesson ? (
                        <a
                          href={`#${previousLesson.id}`}
                          onClick={() => {
                            setOpenLessonId(previousLesson.id);
                            setCurrentLesson(previousLesson.id);
                          }}
                        >
                          <span>Previous lesson</span>
                          <strong>{previousLesson.title}</strong>
                        </a>
                      ) : <span className="lesson-sequence-empty">Start of Module {overview.moduleNumber}</span>}
                      {nextLesson ? (
                        <a
                          href={`#${nextLesson.id}`}
                          onClick={() => {
                            setOpenLessonId(nextLesson.id);
                            setCurrentLesson(nextLesson.id);
                          }}
                        >
                          <span>Next lesson</span>
                          <strong>{nextLesson.title}</strong>
                        </a>
                      ) : (
                        <span className="lesson-sequence-planned">
                          <span>End of Module {overview.moduleNumber}</span>
                          <strong>{overview.finalProject} portfolio complete</strong>
                        </span>
                      )}
                    </nav>

                    {pedagogy && <LessonSubmissionGuide lessonId={lesson.id} pedagogy={pedagogy} />}

                    <div className="lesson-notes">
                      <label htmlFor={noteId}>
                        Private learner notes <span>{authenticatedStorageReady ? "Autosaved to your account" : "Autosaved locally"}</span>
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
                    {pedagogy && <LessonTechnicalDetails pedagogy={pedagogy} />}
                  </div>
                </div>}
              </details>
            );
          })}
        </div>
      </details>
        );
      })}
    </>
  );
}
