import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  JsonLd,
  PlatformFooter,
  PlatformHeader,
} from "@/app/components/platform-navigation";
import { academyModuleRoutes, getModuleRoute } from "@/lib/academy-routes";
import { academyHref, academyUrl } from "@/lib/site-paths";

export function generateStaticParams() {
  return academyModuleRoutes.map((module) => ({ moduleSlug: module.moduleSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ moduleSlug: string }> }): Promise<Metadata> {
  const { moduleSlug } = await params;
  const academyModule = getModuleRoute(moduleSlug);
  if (!academyModule) return {};
  const title = `${academyModule.title} | Remote Sensing Scientist Academy`;
  return {
    title,
    description: academyModule.purpose,
    alternates: { canonical: academyUrl(academyModule.path) },
    openGraph: { title, description: academyModule.purpose, url: academyUrl(academyModule.path), type: "website" },
  };
}

export default async function ModulePage({ params }: { params: Promise<{ moduleSlug: string }> }) {
  const { moduleSlug } = await params;
  const academyModule = getModuleRoute(moduleSlug);
  if (!academyModule) notFound();
  const nextModule = academyModuleRoutes.find((candidate) => candidate.moduleNumber === academyModule.moduleNumber + 1);

  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "Course",
          name: academyModule.title,
          description: academyModule.purpose,
          url: academyUrl(academyModule.path),
          provider: {
            "@type": "Organization",
            name: "Remote Sensing Scientist Academy",
            url: academyUrl("/"),
          },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Curriculum", item: academyUrl("/curriculum/") },
            { "@type": "ListItem", position: 3, name: academyModule.title, item: academyUrl(academyModule.path) },
          ],
        },
      ]} />
      <PlatformHeader current={academyModule.moduleSlug} />
      <main className={`platform-page platform-module-page platform-module-${academyModule.accent}`} id="main-content">
        <Breadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Curriculum", href: academyHref("/curriculum/") },
          { label: academyModule.title },
        ]} />
        <header className="platform-page-heading">
          <p className="section-kicker">Module {academyModule.moduleNumber}</p>
          <h1>{academyModule.title}</h1>
          <p>{academyModule.purpose}</p>
          <dl className="platform-module-facts">
            <div><dt>Portfolio project</dt><dd>{academyModule.finalProject}</dd></div>
            <div><dt>Prerequisites</dt><dd>{academyModule.prerequisites}</dd></div>
          </dl>
        </header>
        <section className="platform-outcomes" aria-labelledby="module-outcomes">
          <h2 id="module-outcomes">What you will be able to do</h2>
          <ul>{academyModule.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
        </section>
        <section className="platform-module-chapters" aria-labelledby="module-chapters">
          <h2 id="module-chapters">Chapters and lessons</h2>
          {academyModule.chapters.map((chapter, index) => (
            <details open={index === 0} key={chapter.path}>
              <summary>
                <span>{chapter.chapterNumber === null ? "Capstone" : `Chapter ${chapter.chapterNumber}`}</span>
                <strong>{chapter.title}</strong>
              </summary>
              <a className="platform-chapter-link" href={academyHref(chapter.path)}>Open chapter overview</a>
              <ol>
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.lessonId}>
                    <span>{lesson.lessonNumber}</span>
                    <div><a href={academyHref(lesson.path)}>{lesson.title}</a><small>{lesson.lessonType} · {lesson.estimatedTime}</small></div>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </section>
        <nav className="platform-progression" aria-label="Module progression">
          <a href={academyHref("/curriculum/")}>← Full curriculum</a>
          {nextModule && <a href={academyHref(nextModule.path)}>Next module: {nextModule.title} →</a>}
        </nav>
      </main>
      <PlatformFooter />
    </>
  );
}
