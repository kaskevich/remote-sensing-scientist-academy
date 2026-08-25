import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  JsonLd,
  PlatformFooter,
  PlatformHeader,
} from "@/app/components/platform-navigation";
import { academyChapterRoutes, getChapterRoute } from "@/lib/academy-routes";
import { academyHref, academyUrl } from "@/lib/site-paths";

export function generateStaticParams() {
  return academyChapterRoutes.map((chapter) => ({
    moduleSlug: chapter.moduleSlug,
    chapterSlug: chapter.chapterSlug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ moduleSlug: string; chapterSlug: string }> }): Promise<Metadata> {
  const { moduleSlug, chapterSlug } = await params;
  const chapter = getChapterRoute(moduleSlug, chapterSlug);
  if (!chapter) return {};
  const title = `${chapter.title} — ${chapter.moduleTitle} | Remote Sensing Scientist Academy`;
  const description = `Explore ${chapter.title} in ${chapter.moduleTitle}, including ${chapter.lessons.length} linked learning resources and portfolio activities.`;
  return {
    title,
    description,
    alternates: { canonical: academyUrl(chapter.path) },
    openGraph: { title, description, url: academyUrl(chapter.path), type: "website" },
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ moduleSlug: string; chapterSlug: string }> }) {
  const { moduleSlug, chapterSlug } = await params;
  const chapter = getChapterRoute(moduleSlug, chapterSlug);
  if (!chapter) notFound();

  return (
    <>
      <JsonLd value={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${chapter.title} — ${chapter.moduleTitle}`,
        url: academyUrl(chapter.path),
        isPartOf: { "@type": "Course", name: chapter.moduleTitle, url: academyUrl(chapter.modulePath) },
        hasPart: chapter.lessons.map((lesson) => ({
          "@type": "LearningResource",
          name: lesson.title,
          url: academyUrl(lesson.path),
        })),
      }} />
      <PlatformHeader current={chapter.moduleSlug} />
      <main className="platform-page" id="main-content">
        <Breadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Curriculum", href: academyHref("/curriculum/") },
          { label: chapter.moduleTitle, href: academyHref(chapter.modulePath) },
          { label: chapter.title },
        ]} />
        <header className="platform-page-heading">
          <p className="section-kicker">{chapter.chapterNumber === null ? "Capstone" : `Chapter ${chapter.chapterNumber}`} · Module {chapter.moduleNumber}</p>
          <h1>{chapter.title}</h1>
          <p>This overview keeps the chapter sequence visible without repeating lesson prose. Open any lesson directly to study its complete content and activities.</p>
        </header>
        <ol className="platform-lesson-index">
          {chapter.lessons.map((lesson) => (
            <li key={lesson.lessonId}>
              <span>{lesson.lessonNumber}</span>
              <article>
                <p>{lesson.lessonType} · {lesson.estimatedTime}{lesson.difficulty ? ` · ${lesson.difficulty}` : ""}</p>
                <h2><a href={academyHref(lesson.path)}>{lesson.title}</a></h2>
                <p>{lesson.description}</p>
                <strong>Portfolio: {lesson.portfolioArtifact}</strong>
              </article>
            </li>
          ))}
        </ol>
        <nav className="platform-progression" aria-label="Chapter navigation">
          <a href={academyHref(chapter.modulePath)}>← {chapter.moduleTitle}</a>
          <a href={academyHref("/curriculum/")}>Full curriculum</a>
        </nav>
      </main>
      <PlatformFooter />
    </>
  );
}
