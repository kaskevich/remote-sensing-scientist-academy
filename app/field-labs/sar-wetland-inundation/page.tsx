import type { Metadata } from "next";
import { SarComparabilityLab, SarScaleLab, SarThresholdLab } from "@/app/components/sar-field-lab-interactions";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { sarFieldLabPath, sarFieldLabSources, sarWorkflowSteps } from "@/lib/sar-field-lab";
import { academyAssetUrl, academyHref, academyUrl } from "@/lib/site-paths";

const url = academyUrl(sarFieldLabPath);

export const metadata: Metadata = {
  title: "Field Lab 08 · Sentinel-1 Wetland Inundation | Remote Sensing Scientist Academy",
  description: "Build and validate a defensible Sentinel-1 SAR wetland-inundation evidence package from scene selection through preprocessing, threshold sensitivity and uncertainty.",
  alternates: { canonical: url },
  openGraph: { title: "Field Lab 08 · Sentinel-1 Wetland Inundation", description: "A complete evidence-first SAR workflow.", type: "article", url, images: [{ url: academyAssetUrl("/og.png"), width: 1536, height: 1024, alt: "Remote Sensing Scientist Academy" }] },
};

const principles = [
  ["ACTIVE MICROWAVE", "The instrument transmits C-band microwave energy and measures the return. Illumination comes from the sensor, not the Sun."],
  ["BACKSCATTER", "Pixel values combine dielectric properties, roughness, structure and acquisition geometry. They are not direct water depth or soil moisture."],
  ["POLARIZATION", "VV and VH describe transmit–receive orientation. Different channels can respond differently to surface and volume scattering."],
  ["COHERENT IMAGING", "Speckle is inherent to coherent imaging. Filtering changes spatial support and must be recorded rather than treated as cosmetic cleanup."],
] as const;

export default function SarFieldLabPage() {
  return (
    <>
      <JsonLd value={{ "@context": "https://schema.org", "@type": "LearningResource", name: "Field Lab 08 · Sentinel-1 Wetland Inundation", description: metadata.description, url, learningResourceType: "Field lab", educationalUse: "instruction", creator: creatorReference() }} />
      <SeoHeader current="field-labs" />
      <main className="sar-field-lab" id="main-content">
        <SeoBreadcrumbs items={[{ label: "Academy", href: academyHref("/") }, { label: "Field Labs", href: academyHref("/field-labs/") }, { label: "SAR wetland inundation" }]} />
        <header className="sar-lab-hero">
          <div><p className="section-kicker">Field Lab 08 · Sentinel-1 SAR</p><h1>Map wetland inundation without confusing dark pixels for proof</h1><p>Build a traceable Sentinel-1 evidence package from an ecological question to a validated candidate-inundation map. The lab teaches decisions, failure gates and uncertainty—not a one-click flood colour ramp.</p><div className="sar-hero-actions"><a href="#workflow">Start the workflow</a><a href={academyHref("/module-2/sar-fundamentals/")}>Review SAR fundamentals</a></div></div>
          <aside><span>THE CLAIM CHAIN</span><ol><li>Comparable observations</li><li>Calibrated geometry</li><li>Candidate water evidence</li><li>Temporal interpretation</li><li>Independent validation</li></ol></aside>
        </header>

        <section className="sar-scope-note"><strong>Lab evidence boundary</strong><p>The downloadable table and interactive records are deliberately synthetic. They reproduce realistic Sentinel-1 metadata and QA problems but are not real flooding, real Baltic plots or observations from the 2024 Estonia campaign.</p></section>

        <section className="sar-question" aria-labelledby="sar-question-title"><div><p className="section-kicker">Scientific task</p><h2 id="sar-question-title">Can a Sentinel-1 time pair support a defensible map of candidate event inundation?</h2></div><p>Your answer must preserve the difference between a sensor measurement, a classification rule and a hydrological interpretation. You will finish with a map class, confidence layer, validation record and list of non-claims.</p></section>

        <section className="sar-principles" aria-labelledby="sar-principles-title"><header><p className="section-kicker">Before software</p><h2 id="sar-principles-title">What Sentinel-1 contributes</h2></header><div>{principles.map(([title, text]) => <article key={title}><span>{title}</span><p>{text}</p></article>)}</div><aside><strong>Operational land mode</strong><p>Sentinel-1 uses C-band SAR. Interferometric Wide Swath is the primary land mode and commonly provides VV+VH data. A Level-1 GRD product is detected, multi-looked and projected to ground range; phase is not retained.</p></aside></section>

        <section className="sar-physics-chain" aria-label="SAR evidence chain"><div><span>TRANSMIT</span><strong>C-band pulse</strong></div><i>→</i><div><span>INTERACT</span><strong>water · soil · stems · terrain</strong></div><i>→</i><div><span>RETURN</span><strong>amplitude / power</strong></div><i>→</i><div><span>DERIVE</span><strong>backscatter + class</strong></div></section>

        <SarScaleLab />
        <SarComparabilityLab />

        <section className="sar-workflow" id="workflow" aria-labelledby="sar-workflow-title"><header><p className="section-kicker">End-to-end procedure</p><h2 id="sar-workflow-title">Question → scenes → measurement → map → evidence</h2><p>Work in order. Each gate names the required input, the product you should have at the end and the condition that stops the workflow.</p></header><nav aria-label="SAR workflow phases">{sarWorkflowSteps.map((step) => <a href={`#sar-step-${step.number}`} key={step.number}><span>{step.number}</span>{step.phase}</a>)}</nav><div className="sar-workflow-list">{sarWorkflowSteps.map((step) => <article id={`sar-step-${step.number}`} key={step.number}><header><span>{step.number} · {step.phase}</span><h3>{step.title}</h3><p>{step.what}</p></header><div className="sar-step-fields"><section><h4>ACTION</h4><ol>{step.action.map((item) => <li key={item}>{item}</li>)}</ol></section><section><h4>WHERE</h4><p>{step.where}</p><h4>WHY</h4><p>{step.why}</p></section><section><h4>INPUT</h4><ul>{step.input.map((item) => <li key={item}>{item}</li>)}</ul><h4>OUTPUT</h4><ul>{step.output.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h4>CHECK</h4><ul>{step.check.map((item) => <li key={item}>{item}</li>)}</ul><div className="sar-stop"><b>IF THIS FAILS</b><p>{step.failure}</p></div></section></div><footer><b>NEXT</b><span>{step.next}</span></footer></article>)}</div></section>

        <SarThresholdLab />

        <section className="sar-products" aria-labelledby="sar-products-title"><header><p className="section-kicker">Analysis-ready handoff</p><h2 id="sar-products-title">Seven products, one defensible interpretation</h2></header><div>{["Scene inventory + rejection log", "Calibrated reference backscatter", "Calibrated event backscatter", "Common valid-data/context mask", "Candidate inundation class", "Confidence / sensitivity layer", "Validation + decision report"].map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></article>)}</div><aside><b>Supported:</b> “Under the documented geometry, preprocessing, rule and validation sample, these pixels are classified as candidate event inundation.”<br /><b>Not supported:</b> water depth, duration, ecological impact or direct soil moisture unless separate evidence validates those quantities.</aside></section>

        <section className="sar-downloads" aria-labelledby="sar-downloads-title"><div><p className="section-kicker">Workstation pack</p><h2 id="sar-downloads-title">Download the lab evidence</h2><p>Preserve the source-status column. Your portfolio must call these records synthetic.</p></div><div><a href={academyAssetUrl("/lesson-resources/module-2/satellite-eo/sentinel1_backscatter_samples.csv")} download>Sentinel-1 QA samples · CSV</a><a href={academyAssetUrl("/field-labs/sar-wetland-inundation/sar-evidence-checklist.md")} download>SAR evidence checklist · Markdown</a></div></section>

        <section className="sar-references"><p className="section-kicker">Authoritative references</p><h2>Continue with mission and processor documentation</h2><ul><li><a href={sarFieldLabSources.mission} target="_blank" rel="noopener noreferrer">Copernicus Sentinel-1 mission and acquisition modes ↗</a></li><li><a href={sarFieldLabSources.processing} target="_blank" rel="noopener noreferrer">Copernicus Sentinel-1 processing and GRD definition ↗</a></li><li><a href={sarFieldLabSources.dataSpace} target="_blank" rel="noopener noreferrer">Copernicus Data Space Sentinel-1 products and RTC options ↗</a></li><li><a href={sarFieldLabSources.nasaHandbook} target="_blank" rel="noopener noreferrer">NASA SAR Handbook: geometry, speckle and interpretation ↗</a></li><li><a href={sarFieldLabSources.nasaTraining} target="_blank" rel="noopener noreferrer">NASA ARSET radar applications training ↗</a></li></ul></section>
      </main>
      <SeoFooter />
    </>
  );
}
