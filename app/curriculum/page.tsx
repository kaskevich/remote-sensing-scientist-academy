import type { Metadata } from "next";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { academyName, seoModules } from "@/lib/seo-curriculum";
import { academyHref, academyUrl } from "@/lib/site-paths";

const title = `Remote Sensing, GIS and Earth Observation Curriculum | ${academyName}`;
const description = "Explore a professional learning pathway in scientific Python, GIS, UAV and satellite Earth observation, spatial analysis and remote sensing modelling.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: academyUrl("/curriculum/") },
  openGraph: { title, description, type: "website", url: academyUrl("/curriculum/") },
  twitter: { card: "summary_large_image", title, description },
};

export default function CurriculumPage() {
  return (
    <>
      <JsonLd value={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Remote Sensing Scientist Academy curriculum",
        description,
        url: academyUrl("/curriculum/"),
        hasPart: seoModules.map((module) => ({
          "@type": "Course",
          name: module.title,
          url: module.canonicalUrl,
        })),
      }} />
      <SeoHeader current="curriculum" />
      <main className="seo-index-page" id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Curriculum" },
        ]} />
        <header className="seo-page-heading">
          <p className="section-kicker">One professional pathway</p>
          <h1>Remote sensing curriculum</h1>
          <p>Move from scientific programming foundations through geospatial data science to defensible remote sensing modelling. Every lesson contributes evidence to a portfolio project.</p>
        </header>
        <div className="seo-module-catalog">
          {seoModules.map((module) => (
            <section className={`seo-module-card seo-module-${module.overview.accent}`} key={module.slug}>
              <header>
                <span>Module {module.number}</span>
                <h2><a href={academyHref(module.path)}>{module.title}</a></h2>
                <p>{module.description}</p>
              </header>
              <dl>
                <div><dt>Portfolio project</dt><dd>{module.finalProject}</dd></div>
                <div><dt>Learning resources</dt><dd>{module.lessons.length}</dd></div>
              </dl>
              <ol>
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <span>{lesson.numberLabel}</span>
                    <a href={academyHref(lesson.path)}>{lesson.title}</a>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </main>
      <SeoFooter />
    </>
  );
}
