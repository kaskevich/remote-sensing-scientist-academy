import type { Metadata } from "next";
import { CurriculumCatalog } from "@/app/components/curriculum-navigation";
import {
  Breadcrumbs,
  JsonLd,
  PlatformFooter,
  PlatformHeader,
} from "@/app/components/platform-navigation";
import { academyModuleRoutes } from "@/lib/academy-routes";
import { academyHref, academyUrl } from "@/lib/site-paths";

const title = "Curriculum and Learning Path | Remote Sensing Scientist Academy";
const description = "Explore the complete Academy pathway through scientific programming, geospatial data science and remote sensing modelling, with every chapter, lesson and portfolio milestone linked directly.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: academyUrl("/curriculum/") },
  openGraph: { title, description, url: academyUrl("/curriculum/"), type: "website" },
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
        hasPart: academyModuleRoutes.map((module) => ({
          "@type": "Course",
          name: module.title,
          url: academyUrl(module.path),
        })),
      }} />
      <PlatformHeader current="curriculum" />
      <main className="platform-page" id="main-content">
        <Breadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Curriculum" },
        ]} />
        <header className="platform-page-heading">
          <p className="section-kicker">One professional pathway</p>
          <h1>Curriculum and learning path</h1>
          <p>Move from scientific programming foundations through geospatial analysis to defensible remote sensing modelling. Every lesson has a stable page and contributes evidence to a portfolio project.</p>
        </header>
        <CurriculumCatalog modules={academyModuleRoutes} />
      </main>
      <PlatformFooter />
    </>
  );
}
