import type { Metadata } from "next";
import { UavBandExplorer } from "@/app/components/uav-field-lab-explorer";
import {
  PhotogrammetryExplorer,
  ScientificWorkflowExplorer,
  UavPortfolioChallenge,
  UavPreflightPreparation,
  UavProjectExamples,
} from "@/app/components/uav-field-lab-interactions";
import { UavFieldLabTutorial } from "@/app/components/uav-field-lab-tutorial";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import {
  droneLabPath,
  flightConfiguration,
  qaStopGates,
  uavFieldLabPath,
  uavOutputs,
  uavSources,
  uavTutorialSteps,
  vegetationIndices,
} from "@/lib/uav-field-lab";

const pageUrl = academyUrl(uavFieldLabPath);

export const metadata: Metadata = {
  title: "Field Lab 07 · Plan, Fly and Process an eBee Mission",
  description: "A chronological 22-step tutorial for planning, flying and processing the verified 2024 Estonian eBee X coastal-wetland campaign into analysis-ready ecological predictors.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Field Lab 07 · From eBee Mission Plan to Ecological Map",
    description: "Plan, acquire, position, reconstruct, quality-check and hand off a complete UAV mission.",
    type: "article",
    url: pageUrl,
  },
};

const missionPlanningSteps = [
  ["Define survey boundary", "Include the target meadow, required plots and operational margin; identify obstacles and an approved fixed-wing recovery area."],
  ["Choose sensor", "Choose RGB, Sequoia or Duet T from the required measurement domain—not from convenience alone."],
  ["Choose required GSD", "Relate research detail to nominal GSD, altitude, camera footprint, coverage and practical endurance."],
  ["Set overlap", "Set forward and side overlap so consecutive images and adjacent flight lines share enough stable content for reconstruction."],
  ["Choose landing approach", "Evaluate the landing direction and area under the current approved eBee procedure; this tutorial does not replace manufacturer training."],
  ["Plan GCP distribution", "Where control is used, distribute visible surveyed targets around and within the block; avoid one corner or a single line."],
  ["Save and document", "Record mission name, site, flight date, payload, planned GSD, altitude and both overlaps; capture the settings screen."],
] as const;

export default function UavCoastalWetlandsPage() {
  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Field Lab 07 · Plan, Fly and Process an eBee Mission",
          description: metadata.description,
          url: pageUrl,
          totalTime: "P1D",
          step: uavTutorialSteps.map((step) => ({ "@type": "HowToStep", position: Number(step.number), name: step.title, text: `${step.what} ${step.action.join(" ")}`, url: `${pageUrl}#tutorial-step-${step.number}` })),
          creator: creatorReference(),
          isPartOf: { "@type": "WebSite", name: "Remote Sensing Scientist Academy", url: academyUrl("/") },
          citation: Object.values(uavSources),
          hasPart: { "@type": "HowTo", name: "Drone Lab · eBee Post-flight and Pix4D Processing", url: academyUrl(droneLabPath) },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Field Labs", item: academyUrl("/field-labs/") },
            { "@type": "ListItem", position: 3, name: "Field Lab 07", item: pageUrl },
          ],
        },
      ]} />
      <SeoHeader current="field-labs" />
      <main className="uav-lab-page uav-tutorial-page" id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Field Labs", href: academyHref("/field-labs/") },
          { label: "Field Lab 07" },
        ]} />

        <header className="uav-lab-hero uav-tutorial-hero">
          <div>
            <p className="section-kicker">Field Lab 07 · operational tutorial · western Estonia</p>
            <h1>Plan, fly and process an eBee mission</h1>
            <p>Follow one chronological workflow from the ecological question to an analysis-ready raster stack. Every stage names its inputs, output, software location, quality check, failure response and next action.</p>
            <div className="uav-hero-actions">
              <a className="button button-primary" href="#tutorial-step-01">Begin at Step 01 ↓</a>
              <a className="text-link" href={academyHref(droneLabPath)}>Open the detailed post-flight Drone Lab →</a>
            </div>
          </div>
          <div className="uav-flight-visual" role="img" aria-label="Fixed-wing eBee mapping a coastal meadow with overlapping image footprints and field plots">
            <div className="uav-wing">eBee X</div><i /><i /><i /><i /><b>1 m² plots</b><span>planned flight → checked products</span>
          </div>
        </header>

        <section className="uav-fact-strip" aria-label="Verified 2024 campaign facts">
          <div><strong>30 Jun–2 Jul 2024</strong><span>Acquisition window</span></div>
          <div><strong>Saardu · Keemu</strong><span>Western Estonia sites 1–2</span></div>
          <div><strong>Koera · Kudani</strong><span>Western Estonia sites 3–4</span></div>
          <div><strong>eBee X · 120 plots</strong><span>Fixed-wing mapping + 1 m² references</span></div>
        </section>

        <section className="uav-start-panel" aria-labelledby="how-to-use-title">
          <div><p className="section-kicker">How to use this lab</p><h2 id="how-to-use-title">Do the step. Check the evidence. Then continue.</h2></div>
          <ol>
            <li><strong>Field Lab</strong><span>Use Steps 01–22 to understand and execute the complete mission.</span></li>
            <li><strong>Drone Lab</strong><span>Open the workstation-level eMotion, PPK, GCP and Pix4D procedure.</span></li>
            <li><strong>Reference desk</strong><span>Open the science explanation linked from a step only when you need it.</span></li>
          </ol>
          <a className="uav-checklist-download" href={academyHref("/field-labs/uav-coastal-wetlands/complete-mission-checklist.md")} download>Download the complete 22-step mission checklist ↓</a>
          <p className="uav-core-message"><strong>The sensor records radiation and image geometry.</strong> Field observations supply ecological meaning and reference responses. The UAV did not directly measure species identity, CCI, leaf area, vegetation height or AGB.</p>
        </section>

        <UavPreflightPreparation />

        <section className="uav-workflow-overview" aria-labelledby="workflow-overview-title">
          <header><p className="section-kicker">Clickable scientific workflow</p><h2 id="workflow-overview-title">See what each stage means before you operate it</h2><p>Open a card for the meaning, the 2024 example, its scientific purpose, the check and a direct link to the relevant tutorial step.</p></header>
          <ScientificWorkflowExplorer />
        </section>

        <UavFieldLabTutorial />

        <UavProjectExamples />

        <section className="uav-reference-library" aria-labelledby="reference-library-title">
          <header>
            <p className="section-kicker">Supporting science · open when a step links here</p>
            <h2 id="reference-library-title">Field Lab reference desk</h2>
            <p>The operational timeline is the spine of this lab. These concise chapters explain the science behind its decisions without interrupting the chronological workflow.</p>
          </header>

          <details className="uav-reference-chapter" id="reference-flight">
            <summary><span>01</span><div><strong>Flight design and the fixed-wing decision</strong><small>Platform · altitude · overlap · GSD</small></div></summary>
            <div className="uav-reference-content">
              <p>A fixed-wing eBee X was appropriate for systematic coverage of spatially extensive meadow sites. A multirotor remains preferable for hovering, tight launch areas and fine local inspection; neither platform is universally superior.</p>
              <div className="uav-platform-compare"><article><span>FIXED-WING</span><strong>Systematic area mapping</strong><ul><li>Efficient forward coverage</li><li>Longer endurance potential</li><li>Cannot hover</li><li>Needs suitable launch/recovery space</li></ul></article><article><span>MULTIROTOR</span><strong>Flexible local inspection</strong><ul><li>Hover and oblique views</li><li>Tighter launch/landing</li><li>Fine local positioning</li><li>Usually less area per battery</li></ul></article></div>
              <div className="uav-flight-table" role="region" aria-label="Verified 2024 flight configuration" tabIndex={0}><table><thead><tr><th>System</th><th>Payload</th><th>Altitude</th><th>Overlap</th><th>Output GSD</th><th>Purpose</th></tr></thead><tbody>{flightConfiguration.map((row) => <tr key={row.system}><th>{row.system}</th><td>{row.payload}</td><td>{row.altitude}</td><td>{row.overlap}</td><td>{row.gsd}</td><td>{row.role}</td></tr>)}</tbody></table></div>
              <ol className="uav-mission-planning-steps">{missionPlanningSteps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
              <p><strong>Pixel size is not always effective spatial resolution.</strong> Blur, motion, reconstruction, geolocation and resampling can reduce the detail that is scientifically distinguishable.</p>
            </div>
          </details>

          <details className="uav-reference-chapter" id="reference-sensors">
            <summary><span>02</span><div><strong>What RGB, Sequoia and Duet T measure</strong><small>Spectrum · reflectance · thermal emission · indices</small></div></summary>
            <div className="uav-reference-content">
              <UavBandExplorer />
              <div className="uav-sensor-triptych"><article><span>RGB · S.O.D.A.</span><h3>Visible colour and geometry</h3><p>High-resolution visible imagery supports context, boundaries, texture and reconstruction. It is scientific evidence, not merely a normal picture.</p></article><article><span>SEQUOIA</span><h3>Four reflectance bands</h3><p>Green 550/40 nm, Red 660/40 nm, Red Edge 735/10 nm and NIR 790/40 nm are calibrated separately.</p></article><article className="thermal"><span>DUET T</span><h3>Thermal emission</h3><p>S.O.D.A. RGB is paired with a 640 × 512 thermal camera. Thermal values represent emitted infrared/apparent surface temperature when calibrated—not reflectance.</p></article></div>
              <div className="uav-misconceptions"><strong>THERMAL ≠ REFLECTANCE</strong><strong>THERMAL ≠ DIRECT SOIL MOISTURE</strong><strong>THERMAL ≠ DIRECT PLANT STRESS</strong></div>
              <div className="palette-measurement" role="img" aria-label="Identical point pattern shown with grey and thermal colour palettes while measurement source remains unchanged"><div className="grey">RGB-derived points</div><div className="false-colour">thermal-looking palette</div><strong>COLOUR PALETTE ≠ MEASUREMENT</strong></div>
            </div>
          </details>

          <details className="uav-reference-chapter" id="reference-geometry">
            <summary><span>03</span><div><strong>Positioning and control</strong><small>Time · RINEX · PPK · GCP · CRS</small></div></summary>
            <div className="uav-reference-content">
              <div className="ppk-diagram" role="img" aria-label="UAV GNSS and base-station observations with overlapping time feed a PPK solution"><span>UAV GNSS<br /><small>rover observations</small></span><strong>+</strong><span>Reference station<br /><small>RINEX observations</small></span><strong>+</strong><span>Overlapping time<br /><small>mission + margin</small></span><b>→ PPK solution → corrected camera geotags</b></div>
              <p><strong>PPK</strong> combines rover and reference GNSS observations after flight. <strong>RINEX</strong> transfers receiver-independent observation/navigation data. The 2024 manual example improved reported geotag uncertainty from approximately 0.806 m to 0.049 m; that is not a universal guarantee of map accuracy.</p>
              <div className="uav-time-check"><strong>TIME CHECK</strong><p>For the July 2024 mission, Estonia local time was UTC+3. Verify the source time basis and request reference data for the complete flight plus margin.</p></div>
              <div className="geometry-radiometry"><article><span>GEOMETRY</span><h3>Where is this pixel?</h3><ul><li>geotagging and PPK</li><li>GCPs</li><li>EPSG:3301</li><li>bundle adjustment</li><li>DSM and orthorectification</li></ul></article><article><span>RADIOMETRY</span><h3>What does its value represent?</h3><ul><li>sensor response</li><li>illumination and calibration</li><li>reflectance</li><li>thermal signal</li></ul></article></div>
            </div>
          </details>

          <details className="uav-reference-chapter" id="reference-photogrammetry">
            <summary><span>04</span><div><strong>What Pix4D reconstructs</strong><small>Tie points · bundle adjustment · dense surface · orthorectification</small></div></summary>
            <div className="uav-reference-content"><PhotogrammetryExplorer /><p>Pix4D is not simply stitching pictures. Repeated features link overlapping views; bundle adjustment estimates camera geometry; dense reconstruction estimates the visible surface; the DSM then supports orthorectification into map geometry.</p></div>
          </details>

          <details className="uav-reference-chapter" id="reference-products">
            <summary><span>05</span><div><strong>Products, indices and failure boundaries</strong><small>RGB · DSM · reflectance · thermal · vegetation indices</small></div></summary>
            <div className="uav-reference-content">
              <div className="uav-output-table" role="region" aria-label="UAV output meaning and limitations" tabIndex={0}><table><thead><tr><th>Product</th><th>Status</th><th>Pixel / sample meaning</th><th>Scale</th><th>Use</th><th>Limitation</th></tr></thead><tbody>{uavOutputs.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
              <div className="uav-misconceptions"><strong>BAND ≠ INDEX</strong><strong>INDEX ≠ TRAIT</strong><strong>TRAIT PREDICTION ≠ DIRECT MEASUREMENT</strong></div>
              <div className="uav-index-grid">{vegetationIndices.map((item) => <article key={item.id}><span>{item.id}</span><code>{item.formula}</code><p><strong>Why:</strong> {item.why}.</p><p><strong>Use:</strong> {item.use}.</p><p><strong>Failure boundary:</strong> {item.limits}</p></article>)}</div>
              <div className="uav-warning-grid"><strong>HIGH NDVI ≠ HIGH BIODIVERSITY</strong><strong>HIGH NDVI ≠ AUTOMATICALLY HIGH BIOMASS</strong><strong>HIGH NDVI ≠ DIRECT CHLOROPHYLL</strong></div>
            </div>
          </details>

          <details className="uav-reference-chapter" id="reference-field-link">
            <summary><span>06</span><div><strong>From 1 m² plot to ecological model</strong><small>Support · aggregation · prediction · non-claims</small></div></summary>
            <div className="uav-reference-content">
              <div className="field-uav-model"><article><span>FIELD · OBSERVED / DERIVED</span><p>CCI · leaf area · height · AGB/productivity · species and cover</p></article><strong>↓</strong><article><span>UAV · PROCESSED / DERIVED</span><p>Green · Red · Red Edge · NIR · indices · DSM</p></article><strong>↓</strong><article><span>MODELLED</span><p>Fitted relationship → continuous prediction map</p></article></div>
              <div className="scale-support-diagram"><span>leaf</span><span>plant</span><span>1 m² quadrat</span><span>many UAV pixels</span><span>plot raster summary</span><span>prediction surface</span></div>
              <p>Plot responses are paired with plot-level raster summaries. Treating every pixel inside a quadrat as an independent field observation manufactures replication and ignores biological support.</p>
              <a href={academyHref("/species/from-field-to-earth-observation/")}>Continue through the Species Atlas field-to-EO evidence chain →</a>
            </div>
          </details>
        </section>

        <section className="uav-stop-section" aria-labelledby="stop-gates-title">
          <p className="section-kicker">Final failure gallery</p><h2 id="stop-gates-title">A completed process can still be unusable</h2>
          <div className="uav-stop-grid">{qaStopGates.map((gate, index) => <article key={gate}><span>STOP {String(index + 1).padStart(2, "0")}</span><strong>{gate}</strong></article>)}</div>
        </section>

        <UavPortfolioChallenge />

        <section className="uav-lab-section uav-references" aria-labelledby="references-title">
          <p className="section-kicker">Evidence and software references</p><h2 id="references-title">Verified project records and current technical documentation</h2>
          <ul><li><a href={uavSources.ebee} target="_blank" rel="noopener noreferrer">AgEagle/senseFly eBee X specifications ↗</a></li><li><a href={uavSources.sequoia} target="_blank" rel="noopener noreferrer">Parrot Sequoia user guide ↗</a></li><li><a href={uavSources.duetT} target="_blank" rel="noopener noreferrer">AgEagle camera collection · Duet T ↗</a></li><li><a href={uavSources.pix4dProcess} target="_blank" rel="noopener noreferrer">PIX4Dmapper processing sequence and Quality Report ↗</a></li><li><a href={uavSources.trimbleExport} target="_blank" rel="noopener noreferrer">Trimble Access export guidance ↗</a></li><li><a href={uavSources.epsg3301} target="_blank" rel="noopener noreferrer">EPSG:3301 registry record ↗</a></li></ul>
        </section>

        <nav className="field-lab-sequence" aria-label="Field Lab sequence"><a href={academyHref("/projects/track-recovery-after-fire/")}><span>Previous</span><strong>Field Lab 06 · Change Detection</strong></a><a href={academyHref(droneLabPath)}><span>Detailed practical companion</span><strong>Drone Lab · eMotion, PPK, GCP and Pix4D</strong></a></nav>
      </main>
      <SeoFooter />
    </>
  );
}
