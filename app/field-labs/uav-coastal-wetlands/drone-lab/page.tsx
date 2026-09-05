import type { Metadata } from "next";
import { DroneLabSop } from "@/app/components/uav-drone-lab";
import { DronePreflightQuickSop } from "@/app/components/uav-field-lab-interactions";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import { droneLabPath, droneSteps, uavFieldLabPath, uavSources } from "@/lib/uav-field-lab";

const pageUrl = academyUrl(droneLabPath);

export const metadata: Metadata = {
  title: "Drone Lab · Step-by-step eBee, eMotion, PPK, GCP and Pix4D SOP",
  description: "A chronological workstation procedure for retrieving a 2024 eBee mission, processing PPK and GCP control, reconstructing Pix4D products and completing final QA.",
  alternates: { canonical: pageUrl },
};

const misconceptions = [
  "SD card ≠ working directory", "Image geolocation ≠ photogrammetric matching", "PPK ≠ GCP", "PPK ≠ perfect position", "GCP import ≠ GCP correctly marked", "CRS present ≠ CRS correct", "Point cloud ≠ orthomosaic", "DSM ≠ DEM", "Orthomosaic ≠ reflectance map", "Thermal palette ≠ thermal measurement", "Processing completed ≠ scientifically valid",
] as const;

const practicalVisuals = [
  { id: "retrieve", title: "Physical retrieval", nodes: ["Camera SD", "raw imagery", "archive"], note: "Internal logs use the approved remove-camera → power-on → wait → mini-USB branch." },
  { id: "copy", title: "Copy workflow", nodes: ["source media", "verified copy", "read-only raw"], note: "Counts and sizes agree before processing." },
  { id: "emotion", title: "eMotion Postflight", nodes: ["flight log", "image times", "GNSS / PPK"], note: "Associates mission evidence and corrected geotags." },
  { id: "time", title: "Time and RINEX", nodes: ["UTC flight", "+3 h summer", "local request"], note: "Request full mission coverage plus margin." },
  { id: "ppk", title: "PPK concept", nodes: ["rover", "base", "corrected geotags"], note: "Overlap in observation time is mandatory." },
  { id: "accuracy", title: "Before / after", nodes: ["≈0.806 m", "PPK", "≈0.049 m"], note: "2024 manual example, not a guarantee." },
  { id: "matching", title: "Image–log matching", nodes: ["capture time", "flight event", "image coordinate"], note: "Different from image feature matching." },
  { id: "trimble", title: "Trimble to Pix4D", nodes: ["approved job", "GCP CSV", "GCP/MTP"], note: "Verify schema, units and EPSG:3301." },
  { id: "manager", title: "GCP/MTP Manager", nodes: ["import", "plot", "inspect"], note: "Imported does not mean correctly identified." },
  { id: "marking", title: "Manual image marking", nodes: ["one target", "many images", "reprojection"], note: "Mark the same physical point precisely." },
  { id: "loop", title: "Reoptimization loop", nodes: ["mark", "reoptimize", "audit residuals"], note: "Correct and repeat until defensible." },
  { id: "toggle", title: "Stage toggles", nodes: ["Step 1 only", "control QA", "Steps 2 + 3"], note: "Do not hide failed geometry under dense outputs." },
  { id: "cloud", title: "Point cloud", nodes: ["matched rays", "dense samples", "3-D surface"], note: "Density is not positional accuracy." },
  { id: "dsm", title: "DSM", nodes: ["dense surface", "grid", "upper elevation"], note: "Includes vegetation and objects; not a DEM." },
  { id: "ortho", title: "Orthomosaic", nodes: ["images", "DSM geometry", "map mosaic"], note: "Perspective and scale are corrected." },
  { id: "reflectance", title: "Reflectance maps", nodes: ["calibration", "four bands", "GeoTIFFs"], note: "Radiometry and geometry must both pass." },
  { id: "sensors", title: "Three evidence types", nodes: ["RGB", "multispectral", "thermal"], note: "Visible, reflected narrow bands and emitted infrared." },
  { id: "bands", title: "Band stack", nodes: ["Green", "Red + Red Edge", "NIR"], note: "Align identity, scale, grid and masks." },
  { id: "folders", title: "Output structure", nodes: ["raw", "processing", "outputs + QA"], note: "Keep provenance beside products." },
  { id: "report", title: "Final QA", nodes: ["quality report", "product audit", "accept / block"], note: "Completed is not automatically valid." },
] as const;

const workflowPhases = [
  ["00–01", "Retrieve + preserve", "Move evidence off source media without altering it."],
  ["02–06", "eMotion + PPK", "Match mission time/images and correct camera geotags."],
  ["07–09", "Pix4D start", "Configure cameras/CRS and build initial geometry."],
  ["10–14", "Survey control", "Export, import, mark, reoptimize and audit GCPs."],
  ["15–19", "Products + QA", "Build dense products and read the Quality Report."],
  ["20", "Handoff", "Inventory, inspect and archive analysis-ready evidence."],
] as const;

export default function DroneLabPage() {
  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org", "@type": "HowTo", name: "Drone Lab · eBee Post-flight and Pix4D Processing", description: metadata.description, url: pageUrl, creator: creatorReference(),
          step: droneSteps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.action, url: `${pageUrl}#step-${step.number}` })),
          isPartOf: { "@type": "LearningResource", name: "Field Lab 07 · UAV Remote Sensing", url: academyUrl(uavFieldLabPath) },
          citation: [uavSources.pix4dProcess, uavSources.trimbleExport, uavSources.epsg3301],
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Field Labs", item: academyUrl("/field-labs/") },
            { "@type": "ListItem", position: 3, name: "Field Lab 07", item: academyUrl(uavFieldLabPath) },
            { "@type": "ListItem", position: 4, name: "Drone Lab", item: pageUrl },
          ],
        },
      ]} />
      <SeoHeader current="field-labs" />
      <main className="drone-lab-page drone-tutorial-page" id="main-content">
        <SeoBreadcrumbs items={[{ label: "Academy", href: academyHref("/") }, { label: "Field Labs", href: academyHref("/field-labs/") }, { label: "Field Lab 07", href: academyHref(uavFieldLabPath) }, { label: "Drone Lab" }]} />

        <header className="drone-lab-hero drone-tutorial-hero">
          <div><p className="section-kicker">Field Lab 07 · pre-flight + workstation procedure</p><h1>Prepare the eBee, then process the mission</h1><p>Begin with the pre-flight quick SOP. After recovery, move through retrieval, eMotion, PPK, GCP control and Pix4D in order. Do not continue past a failed check.</p><div className="uav-hero-actions"><a className="button button-primary" href="#preflight-quick-sop">Begin before flight ↓</a><a className="text-link" href={academyHref(uavFieldLabPath)}>Return to the complete mission tutorial →</a></div></div>
          <div className="drone-lab-status" aria-label="Drone Lab workflow status sequence"><span>PREPARE</span><span>FLY</span><span>RETRIEVE</span><span>CORRECT</span><span>RECONSTRUCT</span><strong>HAND OFF</strong></div>
        </header>

        <aside className="drone-version-note"><strong>2024 project workflow</strong><p>The source manual used eMotion 3.23.12494 and PIX4Dmapper 4.3.27. Interface labels can differ in newer versions. Read current help before acting; never substitute similar-looking buttons.</p></aside>

        <DronePreflightQuickSop />

        <div className="drone-before-after-divider"><span>BEFORE FLIGHT · preparation above</span><strong>AFTER FLIGHT · workstation SOP below</strong></div>

        <section className="drone-run-order" aria-labelledby="run-order-title"><p className="section-kicker">Run order</p><h2 id="run-order-title">One accepted state unlocks the next</h2><ol>{workflowPhases.map(([range, title, text]) => <li key={range}><span>{range}</span><strong>{title}</strong><p>{text}</p></li>)}</ol></section>

        <section className="drone-lab-section sop-section"><p className="section-kicker">WHAT · ACTION · WHERE · WHY · INPUT · OUTPUT · CHECK · IF THIS FAILS · NEXT</p><h2>The complete operational SOP</h2><DroneLabSop /></section>

        <section className="drone-reference-library" aria-labelledby="drone-reference-title">
          <p className="section-kicker">Optional workstation references</p><h2 id="drone-reference-title">Open only the support you need</h2>

          <details className="uav-reference-chapter">
            <summary><span>A</span><div><strong>Source-media retrieval and project folders</strong><small>Camera media · aircraft logs · immutable raw copy</small></div></summary>
            <div className="uav-reference-content"><div className="retrieval-diagram"><article><span>CAMERA MEDIA</span><strong>SD card</strong><p>RGB, multispectral or thermal imagery plus basic flight data.</p></article><article><span>INTERNAL AIRCRAFT LOGS</span><strong>eBee X mini-USB branch</strong><p>Remove camera, power on, wait about 20 seconds, then attach mini-USB—only under the approved eBee X procedure.</p></article><article><span>PROJECT DRIVE</span><strong>Verified copy</strong><p>Never process from the SD card. Preserve original files unchanged.</p></article></div><pre className="folder-tree" aria-label="Recommended UAV project directory structure"><code>{`site/
  raw/
    logs/  rgb/  multispectral/  thermal/  gnss/
  processing/
    emotion/  pix4d/
  outputs/
  qa/`}</code></pre></div>
          </details>

          <details className="uav-reference-chapter">
            <summary><span>B</span><div><strong>Twenty annotated procedure diagrams</strong><small>Open the visual index instead of scrolling past a card wall</small></div></summary>
            <div className="uav-reference-content"><p>These safe code-native diagrams replace credential-bearing, private-path and version-specific manual screenshots.</p><div className="practical-visual-grid">{practicalVisuals.map((visual, index) => <article className={`practical-visual visual-${visual.id}`} key={visual.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{visual.title}</h3><div>{visual.nodes.map((node, nodeIndex) => <strong key={node}>{node}{nodeIndex < visual.nodes.length - 1 && <i aria-hidden="true">→</i>}</strong>)}</div><p>{visual.note}</p></article>)}</div></div>
          </details>

          <details className="uav-reference-chapter">
            <summary><span>C</span><div><strong>Processing-stage controls and final products</strong><small>Step 1 → GCP → reoptimize → steps 2 + 3</small></div></summary>
            <div className="uav-reference-content"><div className="processing-toggle-diagram"><article><span>FIRST RUN</span><strong>✓ Initial Processing</strong><small>□ Point Cloud and Mesh<br />□ DSM, Orthomosaic and Index</small></article><i>GCP import → mark → reoptimize → QA</i><article><span>FINAL RUN</span><strong>□ Initial Processing</strong><small>✓ Point Cloud and Mesh<br />✓ DSM, Orthomosaic and Index</small></article></div><div className="final-products-diagram"><article><span>RGB</span><strong>orthomosaic · point cloud · DSM</strong></article><article><span>MULTISPECTRAL</span><strong>Green · Red · Red Edge · NIR reflectance · indices</strong></article><article><span>THERMAL</span><strong>thermal product plus RGB companion evidence</strong></article></div></div>
          </details>
        </section>

        <section className="drone-lab-section"><p className="section-kicker">Misconception firewall</p><h2>Similar words do not make equivalent evidence</h2><div className="drone-misconception-grid">{misconceptions.map((item) => <strong key={item}>{item}</strong>)}</div></section>
        <section className="drone-lab-section drone-security-note"><p className="section-kicker">Publication security</p><h2>No operational credentials or internal paths</h2><p>The private manual informed the sequence, PPK example and checkpoints. No usernames, passwords, authenticated URLs, machine paths or unverified local job names are reproduced. Deployment runs a dedicated scan.</p></section>
        <section className="drone-lab-section drone-references"><p className="section-kicker">Current help at the workstation</p><h2>Authoritative operational references</h2><ul><li><a href={uavSources.pix4dProcess} target="_blank" rel="noopener noreferrer">PIX4Dmapper processing sequence and Quality Report ↗</a></li><li><a href={uavSources.pix4dThermal} target="_blank" rel="noopener noreferrer">PIX4D thermal-image guidance ↗</a></li><li><a href={uavSources.trimbleExport} target="_blank" rel="noopener noreferrer">Trimble Access export guidance ↗</a></li><li><a href={uavSources.epsg3301} target="_blank" rel="noopener noreferrer">EPSG:3301 registry record ↗</a></li></ul></section>

        <nav className="field-lab-sequence" aria-label="Field Lab 07 navigation"><a href={academyHref(uavFieldLabPath)}><span>Return to the complete mission</span><strong>Field Lab 07 · Plan, fly and process</strong></a><a href={academyHref("/species/from-field-to-earth-observation/")}><span>Continue the evidence chain</span><strong>Species → field plot → EO model</strong></a></nav>
      </main>
      <SeoFooter />
    </>
  );
}
