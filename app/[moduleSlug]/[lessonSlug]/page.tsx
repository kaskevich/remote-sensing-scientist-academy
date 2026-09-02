import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/app/components/lesson-materials";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import {
  academyName,
  getSeoLesson,
  lessonSequence,
  markdownWithPublicAssets,
  seoLessons,
} from "@/lib/seo-curriculum";
import { academyAssetUrl, academyHref, academyUrl } from "@/lib/site-paths";
import { academyEntityId, creatorReference } from "@/lib/professional-identity";

export function generateStaticParams() {
  return seoLessons.map((lesson) => ({
    moduleSlug: lesson.moduleSlug,
    lessonSlug: lesson.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const values = await params;
  const lesson = getSeoLesson(values.moduleSlug, values.lessonSlug);
  if (!lesson) return {};
  return {
    title: lesson.pageTitle,
    description: lesson.description,
    alternates: { canonical: lesson.canonicalUrl },
    openGraph: {
      title: lesson.pageTitle,
      description: lesson.description,
      type: "article",
      url: lesson.canonicalUrl,
      images: [{ url: academyAssetUrl("/og.png"), width: 1536, height: 1024, alt: academyName }],
    },
    twitter: { card: "summary_large_image", title: lesson.pageTitle, description: lesson.description },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const values = await params;
  const lesson = getSeoLesson(values.moduleSlug, values.lessonSlug);
  if (!lesson) notFound();
  const sequence = lessonSequence(lesson);
  const academyHome = academyUrl("/");

  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: lesson.title,
          description: lesson.description,
          url: lesson.canonicalUrl,
          learningResourceType: lesson.lessonType,
          educationalUse: "instruction",
          teaches: lesson.description,
          isPartOf: { "@type": "Course", name: lesson.moduleTitle, url: academyUrl(lesson.modulePath) },
          provider: { "@type": "EducationalOrganization", "@id": academyEntityId, name: academyName, url: academyHome },
          creator: creatorReference(),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyHome },
            { "@type": "ListItem", position: 2, name: lesson.moduleTitle, item: academyUrl(lesson.modulePath) },
            { "@type": "ListItem", position: 3, name: lesson.title, item: lesson.canonicalUrl },
          ],
        },
      ]} />
      <SeoHeader />
      <main className="seo-lesson-page" id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: lesson.moduleTitle, href: academyHref(lesson.modulePath) },
          { label: lesson.title },
        ]} />
        <article className="seo-lesson-article">
          <header className="seo-lesson-heading">
            <p className="section-kicker">Module {lesson.moduleNumber} · {lesson.chapterNumber === null ? "Capstone" : `Chapter ${lesson.chapterNumber}`} · {lesson.lessonType}</p>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
            <ul className="seo-lesson-meta">
              <li>{lesson.numberLabel}</li>
              <li>{lesson.estimatedTime}</li>
              <li>Portfolio: {lesson.artifact}</li>
            </ul>
            <a className="seo-workspace-link" href={`${academyHref("/")}#${lesson.id}`}>
              Open this lesson in the Academy workspace <span aria-hidden="true">→</span>
            </a>
          </header>
          <div className="lesson-managed-content">
            <MarkdownContent
              lessonId={lesson.id}
              formativeChecks={lesson.formativeChecks}
              showTableOfContents
            >
              {markdownWithPublicAssets(lesson.content)}
            </MarkdownContent>
          </div>
          <nav className="seo-lesson-sequence" aria-label="Previous and next lesson">
            {sequence.previous
              ? <a href={academyHref(sequence.previous.path)}><span>Previous</span><strong>{sequence.previous.title}</strong></a>
              : <span>Start of Module {lesson.moduleNumber}</span>}
            {sequence.next
              ? <a href={academyHref(sequence.next.path)}><span>Next</span><strong>{sequence.next.title}</strong></a>
              : <span>End of Module {lesson.moduleNumber}</span>}
          </nav>
        </article>
      </main>
      <SeoFooter />
    </>
  );
}
