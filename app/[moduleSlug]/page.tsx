import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { academyName, getSeoModule, seoModules } from "@/lib/seo-curriculum";
import { academyAssetUrl, academyHref, academyUrl } from "@/lib/site-paths";
import { academyEntityId, creatorReference } from "@/lib/professional-identity";

export function generateStaticParams() {
  return seoModules.map((module) => ({ moduleSlug: module.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}): Promise<Metadata> {
  const { moduleSlug } = await params;
  const academyModule = getSeoModule(moduleSlug);
  if (!academyModule) return {};
  return {
    title: academyModule.pageTitle,
    description: academyModule.description,
    alternates: { canonical: academyModule.canonicalUrl },
    openGraph: {
      title: academyModule.pageTitle,
      description: academyModule.description,
      type: "website",
      url: academyModule.canonicalUrl,
      images: [{ url: academyAssetUrl("/og.png"), width: 1536, height: 1024, alt: academyName }],
    },
    twitter: { card: "summary_large_image", title: academyModule.pageTitle, description: academyModule.description },
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const academyModule = getSeoModule(moduleSlug);
  if (!academyModule) notFound();

  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "Course",
          name: academyModule.title,
          description: academyModule.description,
          url: academyModule.canonicalUrl,
          provider: { "@type": "EducationalOrganization", "@id": academyEntityId, name: academyName, url: academyUrl("/") },
          creator: creatorReference(),
          hasPart: academyModule.lessons.map((lesson) => ({
            "@type": "LearningResource",
            name: lesson.title,
            url: lesson.canonicalUrl,
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Curriculum", item: academyUrl("/curriculum/") },
            { "@type": "ListItem", position: 3, name: academyModule.title, item: academyModule.canonicalUrl },
          ],
        },
      ]} />
      <SeoHeader />
      <main className={`seo-index-page seo-module-${academyModule.overview.accent}`} id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Curriculum", href: academyHref("/curriculum/") },
          { label: academyModule.title },
        ]} />
        <header className="seo-page-heading">
          <p className="section-kicker">Module {academyModule.number}</p>
          <h1>{academyModule.title}</h1>
          <p>{academyModule.description}</p>
          <dl className="seo-module-facts">
            <div><dt>Portfolio project</dt><dd>{academyModule.finalProject}</dd></div>
            <div><dt>Prerequisites</dt><dd>{academyModule.prerequisites}</dd></div>
          </dl>
        </header>
        <section className="seo-module-outcomes" aria-labelledby="module-outcomes">
          <h2 id="module-outcomes">Learning outcomes</h2>
          <ul>{academyModule.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
        </section>
        <section className="seo-lesson-index" aria-labelledby="module-lessons">
          <h2 id="module-lessons">Lessons and portfolio activities</h2>
          <ol>
            {academyModule.lessons.map((lesson) => (
              <li key={lesson.id}>
                <span>{lesson.numberLabel}</span>
                <div>
                  <a href={academyHref(lesson.path)}>{lesson.title}</a>
                  <small>{lesson.lessonType} · {lesson.estimatedTime}</small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SeoFooter />
    </>
  );
}
