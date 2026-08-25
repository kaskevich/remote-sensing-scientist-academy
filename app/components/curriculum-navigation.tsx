import type {
  AcademyLessonRoute,
  AcademyModuleRoute,
} from "@/lib/academy-routes";
import { academyHref } from "@/lib/site-paths";

function lessonMeta(lesson: AcademyLessonRoute) {
  return [lesson.lessonType, lesson.estimatedTime, lesson.difficulty]
    .filter(Boolean)
    .join(" · ");
}

export function CurriculumCatalog({ modules }: { modules: AcademyModuleRoute[] }) {
  return (
    <div className="platform-curriculum-list">
      {modules.map((module) => (
        <article className={`platform-module-card platform-module-${module.accent}`} key={module.moduleSlug}>
          <header>
            <p className="section-kicker">Module {module.moduleNumber}</p>
            <h2><a href={academyHref(module.path)}>{module.title}</a></h2>
            <p>{module.purpose}</p>
            <dl>
              <div><dt>Portfolio project</dt><dd>{module.finalProject}</dd></div>
              <div><dt>Prerequisites</dt><dd>{module.prerequisites}</dd></div>
            </dl>
          </header>
          <div className="platform-chapter-list">
            {module.chapters.map((chapter, index) => (
              <details key={chapter.path} open={index === 0}>
                <summary>
                  <span>{chapter.chapterNumber === null ? "Capstone" : `Chapter ${chapter.chapterNumber}`}</span>
                  <strong>{chapter.title}</strong>
                  <small>{chapter.lessons.length} {chapter.lessons.length === 1 ? "item" : "items"}</small>
                </summary>
                <div className="platform-chapter-body">
                  <a className="platform-chapter-link" href={academyHref(chapter.path)}>Chapter overview</a>
                  <ol>
                    {chapter.lessons.map((lesson) => (
                      <li key={lesson.lessonId}>
                        <span>{lesson.lessonNumber}</span>
                        <div>
                          <a href={academyHref(lesson.path)}>{lesson.title}</a>
                          <small>{lessonMeta(lesson)}</small>
                          <small>Portfolio: {lesson.portfolioArtifact}</small>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function CourseNavigation({
  modules,
  currentLessonId,
}: {
  modules: AcademyModuleRoute[];
  currentLessonId?: string;
}) {
  const currentModule = modules.find((module) =>
    module.lessons.some((lesson) => lesson.lessonId === currentLessonId),
  );

  return (
    <nav className="course-navigation" aria-label="Course navigation">
      <details open>
        <summary>Academy navigation</summary>
        <a className="course-navigation-curriculum" href={academyHref("/curriculum/")}>Full curriculum</a>
        {modules.map((module) => (
          <details
            className={`course-navigation-module course-navigation-${module.accent}`}
            open={module.moduleNumber === currentModule?.moduleNumber}
            key={module.moduleSlug}
          >
            <summary><span>Module {module.moduleNumber}</span><strong>{module.title}</strong></summary>
            {module.chapters.map((chapter) => (
              <details open={chapter.lessons.some((lesson) => lesson.lessonId === currentLessonId)} key={chapter.path}>
                <summary>{chapter.chapterNumber === null ? "Capstone" : `Chapter ${chapter.chapterNumber}`} · {chapter.title}</summary>
                <ol>
                  {chapter.lessons.map((lesson) => (
                    <li key={lesson.lessonId}>
                      <a
                        href={academyHref(lesson.path)}
                        aria-current={lesson.lessonId === currentLessonId ? "page" : undefined}
                      >
                        <span>{lesson.lessonNumber}</span>
                        {lesson.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </details>
        ))}
      </details>
    </nav>
  );
}
