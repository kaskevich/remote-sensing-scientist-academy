import type { Metadata } from "next";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import { uavFieldLabPath } from "@/lib/uav-field-lab";

const path = "/field-labs/";
const url = academyUrl(path);

export const metadata: Metadata = {
  title: "Field Labs | Remote Sensing Scientist Academy",
  description: "Applied Academy investigations in satellite change detection and UAV coastal-wetland mapping, each with reproducible evidence, QA and portfolio outputs.",
  alternates: { canonical: url },
};

const labs = [
  {
    number: "06",
    eyebrow: "Satellite change detection",
    title: "Track recovery after a fire",
    description: "Build a reproducible Sentinel-2 investigation of disturbance and multi-year spectral vegetation recovery after the 2021 northern Evia wildfire.",
    href: "/projects/track-recovery-after-fire/",
    tags: ["Sentinel-2", "NBR / dNBR", "Google Earth Engine", "Recovery uncertainty"],
    className: "fire",
  },
  {
    number: "07",
    eyebrow: "UAV remote sensing",
    title: "From Flight to Ecological Map",
    description: "Process a real 2024 eBee coastal-wetland mission from raw imagery and positioning data to RGB, multispectral, thermal, DSM and reflectance products.",
    href: uavFieldLabPath,
    tags: ["eBee X", "Sequoia + Duet T", "PPK / GCP", "Pix4D"],
    className: "uav",
  },
] as const;

export default function FieldLabsPage() {
  return (
    <>
      <JsonLd value={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Remote Sensing Scientist Academy Field Labs",
        description: metadata.description,
        url,
        creator: creatorReference(),
        hasPart: labs.map((lab) => ({ "@type": "LearningResource", name: `Field Lab ${lab.number} · ${lab.title}`, url: academyUrl(lab.href) })),
      }} />
      <SeoHeader current="field-labs" />
      <main className="field-labs-page" id="main-content">
        <SeoBreadcrumbs items={[{ label: "Academy", href: academyHref("/") }, { label: "Field Labs" }]} />
        <header className="field-labs-hero">
          <p className="section-kicker">Applied investigations</p>
          <h1>Field Labs</h1>
          <p>Work from an explicit scientific question through processing, quality control, interpretation and a portfolio-ready result. Each lab keeps its own dataset, evidence boundary and non-claims.</p>
        </header>
        <ol className="field-lab-list">
          {labs.map((lab) => (
            <li className={`field-lab-card ${lab.className}`} key={lab.number}>
              <a href={academyHref(lab.href)}>
                <div className="field-lab-number"><small>Field Lab</small><strong>{lab.number}</strong></div>
                <div>
                  <p className="section-kicker">{lab.eyebrow}</p>
                  <h2>{lab.title}</h2>
                  <p>{lab.description}</p>
                  <ul>{lab.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  <span className="text-link">Open Field Lab {lab.number} →</span>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </main>
      <SeoFooter />
    </>
  );
}
