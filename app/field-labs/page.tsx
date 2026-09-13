import type { Metadata } from "next";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import { uavFieldLabPath } from "@/lib/uav-field-lab";
import { sarFieldLabPath } from "@/lib/sar-field-lab";
import { lidarFieldLabPath } from "@/lib/lidar-field-lab";
import { hyperspectralFieldLabPath } from "@/lib/hyperspectral-field-lab";
import { advancedThermalLessonPath } from "@/lib/advanced-thermal-lesson";

const path = "/field-labs/";
const url = academyUrl(path);

export const metadata: Metadata = {
  title: "Field Labs | Remote Sensing Scientist Academy",
  description: "Applied Academy investigations across satellite and UAV remote sensing, each with reproducible evidence, quality control and portfolio outputs.",
  alternates: { canonical: url },
};

type LearningListing = {
  number: string;
  kind: "Field Lab" | "Advanced lesson";
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  tags: readonly string[];
  className: string;
};

const labs: readonly LearningListing[] = [
  {
    number: "06",
    kind: "Field Lab",
    eyebrow: "Satellite change detection",
    title: "Track recovery after a fire",
    description: "Build a reproducible Sentinel-2 investigation of disturbance and multi-year spectral vegetation recovery after the 2021 northern Evia wildfire.",
    href: "/projects/track-recovery-after-fire/",
    tags: ["Sentinel-2", "NBR / dNBR", "Google Earth Engine", "Recovery uncertainty"],
    className: "fire",
  },
  {
    number: "07",
    kind: "Field Lab",
    eyebrow: "UAV remote sensing",
    title: "Plan, fly and process an eBee mission",
    description: "Follow a chronological 22-step tutorial from ecological mission planning and field preparation through eMotion, PPK/GCP, Pix4D products, final QA and an analysis-ready handoff.",
    href: uavFieldLabPath,
    tags: ["eBee X", "Sequoia + Duet T", "PPK / GCP", "Pix4D", "Mission → handoff"],
    className: "uav",
  },
  {
    number: "08",
    kind: "Field Lab",
    eyebrow: "Synthetic aperture radar",
    title: "Map wetland inundation with Sentinel-1",
    description: "Build a comparable SAR scene stack, preserve measurement scale, validate a candidate-inundation rule and communicate uncertainty without treating dark pixels as proof.",
    href: sarFieldLabPath,
    tags: ["Sentinel-1", "VV / VH", "Backscatter", "Validation", "Uncertainty"],
    className: "sar",
  },
  {
    number: "09",
    kind: "Field Lab",
    eyebrow: "Three-dimensional remote sensing",
    title: "Build defensible LiDAR canopy structure",
    description: "Audit point density and classification, establish terrain, normalize height, derive structural metrics and validate the final quantity at compatible support.",
    href: lidarFieldLabPath,
    tags: ["LAS / LAZ", "Point QA", "DTM / CHM", "Height metrics", "Vertical accuracy"],
    className: "lidar",
  },
  {
    number: "10",
    kind: "Field Lab",
    eyebrow: "Imaging spectroscopy",
    title: "Build a hyperspectral evidence pipeline",
    description: "Audit cube metadata and bad bands, connect spectra to compatible reference samples, prevent leakage and publish predictions with uncertainty and applicability.",
    href: hyperspectralFieldLabPath,
    tags: ["Spectral cube", "Bad-band QA", "Mixed pixels", "Fold-safe features", "Applicability"],
    className: "hyperspectral",
  },
  {
    number: "TIR",
    kind: "Advanced lesson",
    eyebrow: "Thermal infrared remote sensing",
    title: "From emitted radiance to a defensible temperature claim",
    description: "Separate radiance, brightness temperature and land-surface temperature; audit emissivity, atmosphere, scale, QA and support before making an ecological interpretation.",
    href: advancedThermalLessonPath,
    tags: ["Thermal radiance", "Emissivity", "Landsat ST", "ECOSTRESS", "Validation"],
    className: "thermal",
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
        hasPart: labs.map((lab) => ({ "@type": "LearningResource", name: `${lab.kind}${lab.kind === "Field Lab" ? ` ${lab.number}` : ""} · ${lab.title}`, url: academyUrl(lab.href) })),
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
                <div className="field-lab-number"><small>{lab.kind}</small><strong>{lab.number}</strong></div>
                <div>
                  <p className="section-kicker">{lab.eyebrow}</p>
                  <h2>{lab.title}</h2>
                  <p>{lab.description}</p>
                  <ul>{lab.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  <span className="text-link">{lab.kind === "Field Lab" ? `Open Field Lab ${lab.number}` : "Open advanced thermal lesson"} →</span>
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
