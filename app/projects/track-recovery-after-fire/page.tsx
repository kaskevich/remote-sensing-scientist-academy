import type { Metadata } from "next";
import { RemoteGeoJsonMap } from "@/app/components/geojson-map";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyAssetUrl, academyHref, academyUrl } from "@/lib/site-paths";

const projectPath = "/projects/track-recovery-after-fire/";
const projectUrl = academyUrl(projectPath);
const emsUrl = "https://mapping.emergency.copernicus.eu/activations/EMSR527/";
const sentinelUrl = "https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED";
const nbrUrl = "https://www.usgs.gov/landsat-missions/landsat-normalized-burn-ratio";
const resourceBase = "/field-labs/fire-recovery";

export const metadata: Metadata = {
  title: "Track Recovery After a Fire with Sentinel-2 | Remote Sensing Scientist Academy",
  description:
    "Build a reproducible Sentinel-2 change-detection workflow in Google Earth Engine to measure disturbance and multi-year spectral vegetation recovery after the 2021 northern Evia wildfire.",
  alternates: { canonical: projectUrl },
  openGraph: {
    title: "Track Recovery After a Fire with Sentinel-2",
    description:
      "A scientific mini-project using Copernicus EMSR527 and harmonized Sentinel-2 surface reflectance to investigate spectral recovery after the 2021 northern Evia wildfire.",
    type: "article",
    url: projectUrl,
    images: [{ url: academyAssetUrl("/og.png"), width: 1536, height: 1024, alt: "Remote Sensing Scientist Academy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Track Recovery After a Fire with Sentinel-2",
    description: "A reproducible northern Evia wildfire recovery investigation with Sentinel-2 and Google Earth Engine.",
  },
};

const stages = [
  ["01", "Question", "Define the event, evidence and non-claims before processing imagery."],
  ["02", "Predict", "Anticipate seasonal confounding, cloud artefacts and index behaviour."],
  ["03", "Explain", "Connect NIR–SWIR and red–NIR responses to NBR and NDVI."],
  ["04", "Build", "Create masked, matched-season composites and transparent metrics."],
  ["05", "Check", "Audit valid observations, ranges, grids, denominators and exports."],
  ["06", "Interpret", "Describe spatial and temporal spectral patterns cautiously."],
  ["07", "Defend", "Communicate uncertainty and separate spectral from ecological recovery."],
];

const windows = [
  ["2019", "01 Sep–15 Oct", "Baseline year 1"],
  ["2020", "01 Sep–15 Oct", "Baseline year 2"],
  ["2021", "01 Sep–15 Oct", "Immediate post-fire reference"],
  ["2022", "01 Sep–15 Oct", "Recovery year 1"],
  ["2023", "01 Sep–15 Oct", "Recovery year 2"],
  ["2024", "01 Sep–15 Oct", "Recovery year 3"],
  ["2025", "01 Sep–15 Oct", "Latest complete recovery season"],
];

const outputs = [
  "Context map with the EMSR527 perimeter",
  "Pre-fire and immediate post-fire Sentinel-2 composites",
  "Baseline and post-fire NBR plus continuous dNBR",
  "Annual matched-season recovery maps for 2022–2025",
  "NDVI and NBR trajectories with median and IQR",
  "Relative spectral recovery map and recovery-strata comparison",
  "Observation-availability and uncertainty assessment",
  "300–500 word Environmental Recovery Monitoring Brief",
  "Reproducible Earth Engine script, CSV and analysis manifest",
];

export default function FireRecoveryProjectPage() {
  const perimeterSrc = academyHref(`${resourceBase}/EMSR527_AOI01_DEL_MONIT03_observedEventA_r1_v1.json`);
  const codeHref = academyHref(`${resourceBase}/fire_recovery.js`);

  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Northern Evia Fire Recovery — Sentinel-2 Change Detection",
          description: metadata.description,
          url: projectUrl,
          learningResourceType: "Scientific mini-project",
          educationalUse: "instruction",
          teaches: ["Sentinel-2 change detection", "NBR and dNBR", "NDVI", "multi-year spectral recovery", "Google Earth Engine", "scientific uncertainty"],
          creator: creatorReference(),
          isPartOf: { "@type": "WebSite", name: "Remote Sensing Scientist Academy", url: academyUrl("/") },
          citation: [emsUrl, sentinelUrl, nbrUrl],
          hasPart: [
            { "@type": "Dataset", name: "Copernicus EMSR527 AOI01 Monit03 observed event perimeter", contentUrl: academyAssetUrl(`${resourceBase}/EMSR527_AOI01_DEL_MONIT03_observedEventA_r1_v1.json`) },
            { "@type": "SoftwareSourceCode", name: "Northern Evia fire recovery Earth Engine workflow", programmingLanguage: "JavaScript", contentUrl: academyAssetUrl(`${resourceBase}/fire_recovery.js`) },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Track Recovery After a Fire", item: projectUrl },
          ],
        },
      ]} />
      <SeoHeader />
      <main className="fire-project" id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Field Lab 06" },
        ]} />

        <header className="fire-project-hero">
          <div>
            <p className="section-kicker">Field Lab 06 · Change Detection · Northern Evia, Greece</p>
            <h1>Track recovery after a fire</h1>
            <p className="fire-project-lead">
              Investigate how satellite-observed vegetation condition changed after the August 2021 northern Evia wildfire—and whether the subsequent spectral recovery was spatially uniform.
            </p>
            <div className="fire-project-actions">
              <a className="button button-primary" href={codeHref}>Download Earth Engine code</a>
              <a className="text-link" href="#analysis-contract">Start with the analysis contract ↓</a>
            </div>
          </div>
          <aside className="fire-project-question" aria-label="Central scientific question">
            <span>Research question</span>
            <strong>How did satellite-observed vegetation condition change after the 2021 northern Evia wildfire, and how spatially uniform was the subsequent recovery?</strong>
          </aside>
        </header>

        <section className="fire-project-warning" aria-labelledby="spectral-not-ecological">
          <div aria-hidden="true">≠</div>
          <div>
            <h2 id="spectral-not-ecological">Spectral recovery is not ecological recovery</h2>
            <p>A return of NDVI or NBR toward the pre-fire spectral baseline can indicate renewed greenness or changes in canopy and moisture structure. Sentinel-2 alone cannot prove recovery of species composition, biomass, forest structure, habitat quality or ecosystem function.</p>
          </div>
        </section>

        <section className="fire-project-section" aria-labelledby="investigation-path">
          <p className="section-kicker">Investigation path</p>
          <h2 id="investigation-path">From a defensible question to a bounded claim</h2>
          <ol className="fire-stage-grid">
            {stages.map(([number, title, description]) => (
              <li key={number}><span>{number}</span><strong>{title}</strong><p>{description}</p></li>
            ))}
          </ol>
        </section>

        <section className="fire-project-section fire-evidence-grid" aria-labelledby="event-evidence">
          <div>
            <p className="section-kicker">Authoritative spatial evidence</p>
            <h2 id="event-evidence">Copernicus EMSR527 fire perimeter</h2>
            <p>Copernicus Emergency Management Service activated EMSR527 on 4 August 2021 for wildfires in Greece. This project bundles the AOI01 Monit03 observed-event vector delivered on 11 August 2021 and filters the feature whose notation is <code>Burnt area</code>. The source product records that feature as 50,909.887828 hectares.</p>
            <p>The outline below is drawn from the bundled authoritative GeoJSON, not from an illustrative hand-drawn polygon. The vector remains an emergency-mapping observation with its own acquisition date and method—not timeless ground truth.</p>
            <div className="fire-resource-links">
              <a href={emsUrl} target="_blank" rel="noopener noreferrer">Open EMSR527 activation ↗</a>
              <a href={perimeterSrc} download>Download official observed-event GeoJSON</a>
            </div>
          </div>
          <figure className="fire-map-frame">
            <RemoteGeoJsonMap src={perimeterSrc} label="Copernicus EMSR527 AOI01 northern Evia observed wildfire perimeter" />
            <figcaption>EMSR527 · AOI01 · Delineation Monit03 · delivered 11 August 2021. Coordinates shown in WGS 84.</figcaption>
          </figure>
        </section>

        <section className="fire-project-section" id="analysis-contract" aria-labelledby="contract-title">
          <p className="section-kicker">Question before pixels</p>
          <h2 id="contract-title">Write the analysis contract first</h2>
          <div className="fire-contract-grid">
            <dl>
              <div><dt>Event</dt><dd>August 2021 northern Evia wildfire</dd></div>
              <div><dt>Perimeter</dt><dd>EMSR527 AOI01 Monit03, <code>notation = Burnt area</code></dd></div>
              <div><dt>EO source</dt><dd><code>COPERNICUS/S2_SR_HARMONIZED</code></dd></div>
              <div><dt>Unit</dt><dd>20 m analysis pixels inside the mapped perimeter; descriptive, not independent ecological replicates</dd></div>
              <div><dt>Primary evidence</dt><dd>Continuous dNBR and multi-year relative NBR spectral recovery</dd></div>
            </dl>
            <div className="fire-nonclaims">
              <strong>Required non-claims</strong>
              <p>This analysis does not directly measure species composition, tree survival, above-ground biomass, habitat quality, ecosystem function or causal drivers of recovery.</p>
            </div>
          </div>
        </section>

        <section className="fire-project-section" aria-labelledby="temporal-design">
          <p className="section-kicker">Matched seasons</p>
          <h2 id="temporal-design">A seven-period longitudinal design</h2>
          <p className="fire-section-intro">Every period uses the same 1 September–15 October window. The 2019–2020 baseline reduces dependence on one year but does not remove interannual variability. The 2021 window begins after the fire and remains seasonally comparable. The project stops at 2025 because the 2026 window is not complete.</p>
          <ol className="fire-timeline">
            {windows.map(([year, dates, role]) => <li key={year}><strong>{year}</strong><span>{dates}</span><small>{role}</small></li>)}
          </ol>
          <details className="fire-activity">
            <summary><span>Predict</span> Which comparison is fairer: July 2020 vs July 2022, or April 2020 vs September 2022?</summary>
            <p>Neither example automatically proves a fair fire comparison, but matching the same seasonal window is more defensible. Spring–late-summer differences can exaggerate disturbance through phenology and moisture seasonality.</p>
          </details>
        </section>

        <section className="fire-project-section fire-science-grid" aria-labelledby="sentinel-science">
          <div>
            <p className="section-kicker">Surface reflectance</p>
            <h2 id="sentinel-science">Why harmonized Sentinel-2 Level-2A?</h2>
            <p>Level-2A provides atmospherically corrected surface reflectance. Earth Engine’s harmonized collection adjusts newer scenes across the Sentinel-2 processing-baseline shift, supporting a more internally consistent 2019–2025 series. Reflectance bands are stored scaled by 10,000.</p>
            <ul>
              <li><code>B4</code> Red and <code>B8</code> NIR: native 10 m</li>
              <li><code>B11</code> SWIR1 and <code>B12</code> SWIR2: native 20 m</li>
              <li><code>SCL</code>: Scene Classification Layer used for core masking</li>
              <li>Common project output: 20 m to avoid implying native 10 m detail for B12</li>
            </ul>
            <a href={sentinelUrl} target="_blank" rel="noopener noreferrer">Read the Earth Engine dataset documentation ↗</a>
          </div>
          <div className="fire-band-visual" role="img" aria-label="Conceptual spectral response showing high near infrared and lower shortwave infrared for healthy vegetation, with reduced contrast after fire">
            <span>NIR · B8</span><span>SWIR2 · B12</span>
            <div className="fire-spectrum healthy"><i /><b>Vegetated baseline</b></div>
            <div className="fire-spectrum disturbed"><i /><b>Post-fire surface</b></div>
            <small>Conceptual response—not measured Evia values</small>
          </div>
        </section>

        <section className="fire-project-section" aria-labelledby="mask-composite">
          <p className="section-kicker">Quality assurance</p>
          <h2 id="mask-composite">Mask first; composite second</h2>
          <div className="fire-two-column">
            <article>
              <h3>SCL mask</h3>
              <p>The core code removes SCL 3 (cloud shadow), 8 and 9 (medium/high cloud), 10 (cirrus), 11 (snow/ice), and 6 (water) for this terrestrial analysis. Learners compare masked and unmasked imagery and map valid-observation counts. Masking changes the analysis population.</p>
            </article>
            <article>
              <h3>Median composite</h3>
              <p>Each period is a median of valid observations, reducing sensitivity to residual cloud and outliers. It is not a single “2024 image.” Contributing dates and observation counts vary spatially and must be reported.</p>
            </article>
          </div>
          <details className="fire-activity">
            <summary><span>Diagnose</span> A dark pixel appears only in one composite. Is it necessarily burned vegetation?</summary>
            <p>No. Check cloud shadow, terrain shadow, water, acquisition support, residual haze, registration and the valid-observation layer before interpreting disturbance.</p>
          </details>
        </section>

        <section className="fire-project-section" aria-labelledby="indices-title">
          <p className="section-kicker">Disturbance and vegetation evidence</p>
          <h2 id="indices-title">NBR, dNBR and NDVI answer different questions</h2>
          <div className="fire-equation-grid">
            <article><span>Fire-sensitive contrast</span><h3>NBR</h3><code>(B8 − B12) / (B8 + B12)</code><p>Tracks the contrast between near-infrared and shortwave-infrared response.</p></article>
            <article><span>Initial spectral change</span><h3>dNBR</h3><code>NBRpre − NBRpost</code><p>Retained as a continuous result. Generic thresholds are not presented as validated Evia burn-severity classes.</p></article>
            <article><span>Complementary greenness</span><h3>NDVI</h3><code>(B8 − B4) / (B8 + B4)</code><p>Supports greenness interpretation but can saturate and does not measure complete ecological recovery.</p></article>
          </div>
          <a href={nbrUrl} target="_blank" rel="noopener noreferrer">Review the USGS NBR explanation ↗</a>
          <details className="fire-activity">
            <summary><span>Explain</span> NDVI approaches baseline while NBR remains depressed. What can you say?</summary>
            <p>Green vegetation may have returned while SWIR-sensitive canopy, structure or moisture characteristics remain different. This is a spectral hypothesis, not proof of a mechanism.</p>
          </details>
        </section>

        <section className="fire-project-section fire-recovery-section" aria-labelledby="recovery-metric">
          <div>
            <p className="section-kicker">Longitudinal metric</p>
            <h2 id="recovery-metric">Relative spectral recovery</h2>
            <div className="fire-recovery-equation"><span>RecoveryFraction<sub>y</sub></span><strong>=</strong><span>(I<sub>y</sub> − I<sub>post</sub>) / (I<sub>pre</sub> − I<sub>post</sub>)</span></div>
            <p>The code masks pixels where the absolute NBR denominator is below 0.05. Values near 0 resemble the immediate post-fire reference; values near 1 have returned toward the pre-fire spectral baseline; values above 1 exceed it; and negative values are farther from baseline. This is never reported as an “ecosystem recovery percentage.”</p>
          </div>
          <div className="fire-recovery-scale" role="img" aria-label="Relative spectral recovery interpretation scale from below post-fire reference to above pre-fire baseline">
            <i /><i /><i /><i />
            <span>&lt;0<br /><small>farther from baseline</small></span>
            <span>0<br /><small>post-fire reference</small></span>
            <span>1<br /><small>pre-fire baseline</small></span>
            <span>&gt;1<br /><small>exceeds baseline</small></span>
          </div>
        </section>

        <section className="fire-project-section" aria-labelledby="heterogeneity-title">
          <p className="section-kicker">Spatial heterogeneity</p>
          <h2 id="heterogeneity-title">Does initial change relate to recovery?</h2>
          <p className="fire-section-intro">The workflow divides continuous dNBR inside the EMS perimeter at its own 33rd and 67th percentiles. These are descriptive lower, medium and higher initial spectral-change strata—not universal severity classes. Annual medians and IQRs are compared without treating neighbouring pixels as independent replicates.</p>
          <div className="fire-strata-visual" role="img" aria-label="Three initial spectral-change strata feeding separate annual relative spectral recovery trajectories">
            <div><span>Lower initial change</span><i className="strata-low" /></div>
            <div><span>Medium initial change</span><i className="strata-medium" /></div>
            <div><span>Higher initial change</span><i className="strata-high" /></div>
            <b>→ annual median + IQR → compare trajectories, not pixel p-values</b>
          </div>
          <p>A conservative lag-candidate screen requires higher initial dNBR, 2025 relative recovery below 0.6, and at least two valid observations. Its output is labelled <strong>candidate persistent spectral departure</strong>, not failed ecological recovery.</p>
        </section>

        <section className="fire-project-section" aria-labelledby="evidence-sequence">
          <p className="section-kicker">Required visual evidence</p>
          <h2 id="evidence-sequence">Every figure has an analytical job</h2>
          <ol className="fire-output-sequence">
            {[
              ["A", "Location", "Orient the event and perimeter provenance."],
              ["B", "Pre/post imagery", "Inspect comparable true- and false-colour evidence."],
              ["C", "NBR + dNBR", "Explain the disturbance-sensitive spectral contrast."],
              ["D", "Annual maps", "Show matched-season spatial recovery patterns."],
              ["E", "Trajectories", "Compare NDVI, NBR and valid observation support."],
              ["F", "Strata", "Test whether recovery appears spatially uniform."],
              ["G", "Uncertainty", "Bound what the maps and summaries can establish."],
              ["H", "Brief", "Connect methods, evidence and a defensible conclusion."],
            ].map(([letter, title, purpose]) => <li key={letter}><span>{letter}</span><strong>{title}</strong><p>{purpose}</p></li>)}
          </ol>
          <p className="fire-output-note">Satellite composites, dNBR maps and trajectories are deliberately not pre-populated here. Learners generate them by executing the supplied workflow; the Academy does not fabricate result values or imagery.</p>
        </section>

        <section className="fire-project-section" aria-labelledby="uncertainty-title">
          <p className="section-kicker">Scientific defence</p>
          <h2 id="uncertainty-title">Uncertainty is part of the result</h2>
          <div className="fire-uncertainty-grid">
            {[
              ["Atmosphere", "Residual cloud, haze and shadow can survive masking."],
              ["Phenology", "Matched dates reduce but do not eliminate seasonal or interannual differences."],
              ["Grid", "B8 is 10 m; B12 is 20 m. A common grid requires resampling decisions."],
              ["Composite", "A median mixes dates and spatially varying observation counts."],
              ["Perimeter", "EMSR527 is a dated rapid-mapping product with a stated extraction method."],
              ["Ecology", "Similar index values can arise from different vegetation communities or structures."],
              ["Baseline", "Two pre-fire seasons cannot describe the full natural range."],
              ["Dependence", "Neighbouring pixels are spatially autocorrelated, not independent replicates."],
            ].map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="fire-project-section fire-build-section" aria-labelledby="build-title">
          <div>
            <p className="section-kicker">Build and export</p>
            <h2 id="build-title">Reproducible Earth Engine workflow</h2>
            <p>The script is organized as small functions for masking, index creation, seasonal compositing, period summaries, recovery fractions and exports. Upload the bundled GeoJSON to your Earth Engine project, replace the single asset ID, inspect every QA layer, then run the exports.</p>
            <ul>
              <li>Keep AOI, dates, scale and thresholds together in <code>config</code>.</li>
              <li>Review the EMS feature filter before analysis.</li>
              <li>Start export tasks only after maps and summaries reconcile.</li>
              <li>Record the Earth Engine asset ID, retrieval date and code version.</li>
            </ul>
          </div>
          <pre aria-label="Earth Engine workflow architecture"><code>{`maskS2(image)
addIndices(image)
seasonalComposite(year)
recoveryFraction(current)
summarisePeriod(image)
summariseStratum(image, stratum)
Export.table.toDrive(...)
Export.image.toDrive(...)`}</code></pre>
        </section>

        <section className="fire-project-section" aria-labelledby="qa-title">
          <p className="section-kicker">Mandatory checks</p>
          <h2 id="qa-title">Nine gates before interpretation</h2>
          <ol className="fire-checklist">
            {[
              "The AOI matches the documented EMSR527 event feature.",
              "All temporal windows are exact and seasonally comparable.",
              "Masked and unmasked imagery plus valid counts behave sensibly.",
              "Reflectance and index ranges are plausible.",
              "The mapped fire area shows the expected broad NBR decline.",
              "Low observation availability is not driving a recovery pattern.",
              "Small or unstable recovery denominators are masked.",
              "Maps, charts and exported tables reconcile.",
              "Every interpretation says spectral recovery when that is what was measured.",
            ].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
          </ol>
        </section>

        <section className="fire-project-section" aria-labelledby="portfolio-title">
          <p className="section-kicker">Portfolio artifact</p>
          <h2 id="portfolio-title">Environmental Recovery Monitoring Brief</h2>
          <div className="fire-portfolio-grid">
            <div><ol>{outputs.map((output) => <li key={output}>{output}</li>)}</ol></div>
            <aside>
              <strong>300–500 words</strong>
              <p>Context → data and method → results → interpretation → limitations → bounded conclusion.</p>
              <p>Main findings remain blank until the workflow has actually been executed.</p>
            </aside>
          </div>
          <div className="fire-download-grid">
            <a href={codeHref} download><strong>Earth Engine script</strong><span>fire_recovery.js</span></a>
            <a href={perimeterSrc} download><strong>Official EMS perimeter</strong><span>GeoJSON</span></a>
            <a href={academyHref(`${resourceBase}/recovery_summary_template.csv`)} download><strong>Summary table</strong><span>CSV template</span></a>
            <a href={academyHref(`${resourceBase}/analysis_manifest.json`)} download><strong>Analysis manifest</strong><span>JSON template</span></a>
            <a href={academyHref(`${resourceBase}/briefing_template.md`)} download><strong>Scientific briefing</strong><span>Markdown template</span></a>
            <a href={academyHref(`${resourceBase}/portfolio_README_template.md`)} download><strong>Portfolio README</strong><span>Markdown template</span></a>
          </div>
        </section>

        <section className="fire-project-section fire-references" aria-labelledby="references-title">
          <p className="section-kicker">Authoritative references</p>
          <h2 id="references-title">Sources and purpose</h2>
          <ul>
            <li><a href={emsUrl} target="_blank" rel="noopener noreferrer">Copernicus EMSR527</a> — activation, event context and authoritative delineation/grading products.</li>
            <li><a href={sentinelUrl} target="_blank" rel="noopener noreferrer">Earth Engine harmonized Sentinel-2 Level-2A catalog</a> — collection identity, harmonization, reflectance scaling, bands and SCL classes.</li>
            <li><a href={nbrUrl} target="_blank" rel="noopener noreferrer">USGS Normalized Burn Ratio</a> — physical index rationale and standard NIR–SWIR formulation.</li>
          </ul>
        </section>
      </main>
      <SeoFooter />
    </>
  );
}
