import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearnerCurriculum from "@/app/components/learner-curriculum";
import { CourseNavigation } from "@/app/components/curriculum-navigation";
import {
  Breadcrumbs,
  JsonLd,
  PlatformFooter,
  PlatformHeader,
} from "@/app/components/platform-navigation";
import { academyCurriculumModules } from "@/lib/academy-platform";
import {
  academyLessonRoutes,
  academyModuleRoutes,
  getLessonRoute,
  lessonRouteById,
  previousAndNextLessons,
} from "@/lib/academy-routes";
import { academyAssetUrl, academyHref, academyUrl } from "@/lib/site-paths";

export function generateStaticParams() {
  return academyLessonRoutes.map((lesson) => ({
    moduleSlug: lesson.moduleSlug,
    chapterSlug: lesson.chapterSlug,
    lessonSlug: lesson.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ moduleSlug: string; chapterSlug: string; lessonSlug: string }> }): Promise<Metadata> {
  const values = await params;
  const lesson = getLessonRoute(values.moduleSlug, values.chapterSlug, values.lessonSlug);
  if (!lesson) return {};
  const title = `${lesson.seoTitle} | Remote Sensing Scientist Academy`;
  return {
    title,
    description: lesson.seoDescription,
    alternates: { canonical: academyUrl(lesson.path) },
    openGraph: {
      title,
      description: lesson.seoDescription,
      url: academyUrl(lesson.path),
      type: "article",
      images: [{ url: academyAssetUrl("/og.png"), width: 1536, height: 1024, alt: "Remote Sensing Scientist Academy" }],
    },
    twitter: { card: "summary_large_image", title, description: lesson.seoDescription, images: [academyAssetUrl("/og.png")] },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ moduleSlug: string; chapterSlug: string; lessonSlug: string }> }) {
  const values = await params;
  const route = getLessonRoute(values.moduleSlug, values.chapterSlug, values.lessonSlug);
  if (!route) notFound();
  const routeByLessonId = Object.fromEntries(
    Object.entries(lessonRouteById).map(([lessonId, lesson]) => [lessonId, academyHref(lesson.path)]),
  );
  const sequence = previousAndNextLessons(route.lessonId);
  const activeModule = academyCurriculumModules.find(
    (module) => module.overview.moduleNumber === route.moduleNumber,
  );
  if (!activeModule) notFound();
  const workspaceModules = [{ overview: activeModule.overview, lessons: [route.lesson] }];

  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: route.title,
          description: route.seoDescription,
          url: academyUrl(route.path),
          learningResourceType: route.lessonType,
          educationalLevel: route.difficulty ?? "Professional continuing education",
          isPartOf: { "@type": "Course", name: route.moduleTitle, url: academyUrl(route.modulePath) },
          teaches: route.description,
          provider: { "@type": "Organization", name: "Remote Sensing Scientist Academy", url: academyUrl("/") },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: route.moduleTitle, item: academyUrl(route.modulePath) },
            { "@type": "ListItem", position: 3, name: route.chapterTitle, item: academyUrl(route.chapterPath) },
            { "@type": "ListItem", position: 4, name: route.title, item: academyUrl(route.path) },
          ],
        },
      ]} />
      <PlatformHeader current={route.moduleSlug} />
      <main className={`platform-page lesson-platform-page platform-module-${academyModuleRoutes[route.moduleNumber - 1]?.accent ?? "lime"}`} id="main-content">
        <Breadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: route.moduleTitle, href: academyHref(route.modulePath) },
          { label: route.chapterTitle, href: academyHref(route.chapterPath) },
          { label: route.title },
        ]} />
        <header className="platform-page-heading lesson-page-heading">
          <p className="section-kicker">Module {route.moduleNumber} · {route.chapterNumber === null ? "Capstone" : `Chapter ${route.chapterNumber}`} · {route.lessonType}</p>
          <h1>{route.title}</h1>
          <p>{route.description}</p>
          <ul className="lesson-page-meta">
            <li>{route.lessonNumber}</li>
            <li>{route.estimatedTime}</li>
            {route.difficulty && <li>{route.difficulty}</li>}
            <li>Portfolio: {route.portfolioArtifact}</li>
          </ul>
        </header>
        <div className="lesson-platform-layout">
          <CourseNavigation modules={academyModuleRoutes} currentLessonId={route.lessonId} />
          <section className="lesson-platform-workspace" aria-label={`${route.title} learning workspace`}>
            <LearnerCurriculum
              modules={workspaceModules}
              routeByLessonId={routeByLessonId}
              activeLessonId={route.lessonId}
              showModuleOverviews={false}
              showDashboard={false}
              showOnlyActiveLesson
              showInternalSequenceNavigation={false}
            />
            <nav className="standalone-lesson-links" aria-label="Lesson and course links">
              <a href={academyHref(route.chapterPath)}>Chapter overview</a>
              <a href={academyHref(route.modulePath)}>Module overview</a>
              <a href={academyHref("/curriculum/")}>Full curriculum</a>
            </nav>
          </section>
        </div>
        <nav className="platform-progression" aria-label="Previous and next lesson">
          {sequence.previous ? <a href={academyHref(sequence.previous.path)}>← {sequence.previous.title}</a> : <span>Start of Module {route.moduleNumber}</span>}
          {sequence.next ? <a href={academyHref(sequence.next.path)}>{sequence.next.title} →</a> : <span>End of Module {route.moduleNumber}</span>}
        </nav>
      </main>
      <PlatformFooter />
    </>
  );
}
