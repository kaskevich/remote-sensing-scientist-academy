import type { Metadata } from "next";
import { DroneLabSop } from "@/app/components/uav-drone-lab";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import { droneLabPath, uavFieldLabPath, uavSources } from "@/lib/uav-field-lab";

const pageUrl = academyUrl(droneLabPath);

export const metadata: Metadata = {
  title: "Drone Lab · eBee Post-flight and Pix4D Processing",
  description: "A safe, check-driven SOP for the 2024 coastal-wetland eBee workflow: copy raw data, eMotion PPK, Pix4D GCP marking, reoptimization, point cloud, DSM, orthomosaic and reflectance maps.",
  alternates: { canonical: pageUrl },
};

const misconceptions = [
  "SD card ≠ working directory",
  "Image geolocation ≠ photogrammetric matching",
  "PPK ≠ GCP",
  "PPK ≠ perfect position",
  "GCP import ≠ GCP correctly marked",
  "CRS present ≠ CRS correct",
  "Point cloud ≠ orthomosaic",
  "DSM ≠ DEM",
  "Orthomosaic ≠ reflectance map",
  "Thermal palette ≠ thermal measurement",
  "Processing completed ≠ scientifically valid",
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

export default function DroneLabPage() {
  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Drone Lab · eBee Post-flight and Pix4D Processing",
          description: metadata.description,
          url: pageUrl,
          creator: creatorReference(),
          isPartOf: { "@type": "LearningResource", name: "Field Lab 07 · UAV Remote Sensing", url: academyUrl(uavFieldLabPath) },
          citation: [uavSources.pix4dProcess, uavSources.trimbleExport, uavSources.epsg3301],
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Field Labs", item: academyUrl("/field-labs/") },
            { "@type": "ListItem", position: 3, name: "Field Lab 07", item: academyUrl(uavFieldLabPath) },
            { "@type": "ListItem", position: 4, name: "Drone Lab", item: pageUrl },
          ],
        },
      ]} />
      <SeoHeader current="field-labs" />
      <main className="drone-lab-page" id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Field Labs", href: academyHref("/field-labs/") },
          { label: "Field Lab 07", href: academyHref(uavFieldLabPath) },
          { label: "Drone Lab" },
        ]} />
        <header className="drone-lab-hero">
          <div>
            <p className="section-kicker">Field Lab 07 · practical companion</p>
            <h1>Drone Lab</h1>
            <h2>eBee Post-flight and Pix4D Processing</h2>
            <p>Operational workflow used in our 2024 coastal-wetland UAV campaign. Follow every stop gate: this is a processing SOP and a record of why each action exists.</p>
          </div>
          <div className="drone-lab-status" aria-label="Drone Lab workflow status sequence"><span>RETRIEVE</span><span>COPY</span><span>CORRECT</span><span>RECONSTRUCT</span><span>CHECK</span><strong>HAND OFF</strong></div>
        </header>

        <section className="drone-version-note">
          <strong>2024 project workflow</strong>
          <p>The source manual used eMotion 3.23.12494 and PIX4Dmapper 4.3.27. Interface labels can differ in newer versions. Read the control’s current help before acting; never substitute similar-looking buttons.</p>
        </section>

        <section className="drone-lab-section">
          <p className="section-kicker">Before software</p>
          <h2>Separate the source media from the working project</h2>
          <div className="retrieval-diagram">
            <article><span>CAMERA MEDIA</span><strong>SD card</strong><p>RGB, multispectral or thermal imagery plus basic flight data.</p></article>
            <article><span>INTERNAL AIRCRAFT LOGS</span><strong>eBee X mini-USB branch</strong><p>Remove camera, power on, wait about 20 seconds, then attach mini-USB—only under the approved eBee X procedure.</p></article>
            <article><span>PROJECT DRIVE</span><strong>Verified copy</strong><p>Never process from the SD card. Preserve original files unchanged.</p></article>
          </div>
          <pre className="folder-tree" aria-label="Recommended UAV project directory structure"><code>{`site/
  raw/
    logs/  rgb/  multispectral/  thermal/  gnss/
  processing/
    emotion/  pix4d/
  outputs/
  qa/`}</code></pre>
        </section>

        <section className="drone-lab-section">
          <p className="section-kicker">Operational map</p>
          <h2>Twenty annotated diagrams before twenty-one SOP steps</h2>
          <p>These safe, code-native diagrams replace the source manual’s private-path, credential-bearing and version-specific screenshots. Each preserves the scientific action while avoiding disclosure and false UI precision.</p>
          <div className="practical-visual-grid">
            {practicalVisuals.map((visual, index) => (
              <article className={`practical-visual visual-${visual.id}`} key={visual.id}>
                <span>{String(index + 1).padStart(2, "0")}</span><h3>{visual.title}</h3>
                <div>{visual.nodes.map((node, nodeIndex) => <strong key={node}>{node}{nodeIndex < visual.nodes.length - 1 && <i aria-hidden="true">→</i>}</strong>)}</div>
                <p>{visual.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="drone-lab-section sop-section">
          <p className="section-kicker">Action · why · expected · check · stop</p>
          <h2>The complete eBee Postflight and Pix4D SOP</h2>
          <DroneLabSop />
        </section>

        <section className="drone-lab-section">
          <p className="section-kicker">Processing state</p>
          <h2>Accept geometry before generating final rasters</h2>
          <div className="processing-toggle-diagram">
            <article><span>FIRST RUN</span><strong>✓ Initial Processing</strong><small>□ Point Cloud and Mesh<br />□ DSM, Orthomosaic and Index</small></article>
            <i>GCP import → mark → reoptimize → QA</i>
            <article><span>FINAL RUN</span><strong>□ Initial Processing</strong><small>✓ Point Cloud and Mesh<br />✓ DSM, Orthomosaic and Index</small></article>
          </div>
          <div className="final-products-diagram">
            <article><span>RGB</span><strong>orthomosaic · point cloud · DSM</strong></article>
            <article><span>MULTISPECTRAL</span><strong>Green · Red · Red Edge · NIR reflectance · indices</strong></article>
            <article><span>THERMAL</span><strong>thermal product plus RGB companion evidence</strong></article>
          </div>
        </section>

        <section className="drone-lab-section">
          <p className="section-kicker">Misconception firewall</p>
          <h2>Similar words do not make equivalent evidence</h2>
          <div className="drone-misconception-grid">{misconceptions.map((item) => <strong key={item}>{item}</strong>)}</div>
        </section>

        <section className="drone-lab-section drone-security-note">
          <p className="section-kicker">Publication security</p>
          <h2>No operational credentials or internal paths</h2>
          <p>The private 2024 processing manual was used to reconstruct the sequence, PPK example and software checkpoints. No usernames, passwords, authenticated URLs, machine paths or unverified local project/job names are reproduced. The public repository runs a dedicated UAV-publication secret scan before Pages deployment.</p>
        </section>

        <section className="drone-lab-section drone-references">
          <p className="section-kicker">Current help to consult at the workstation</p>
          <h2>Authoritative operational references</h2>
          <ul>
            <li><a href={uavSources.pix4dProcess} target="_blank" rel="noopener noreferrer">PIX4Dmapper recommended processing sequence and Quality Report checks ↗</a></li>
            <li><a href={uavSources.pix4dThermal} target="_blank" rel="noopener noreferrer">PIX4D thermal-image processing guidance ↗</a></li>
            <li><a href={uavSources.trimbleExport} target="_blank" rel="noopener noreferrer">Trimble Access job-data export guidance ↗</a></li>
            <li><a href={uavSources.epsg3301} target="_blank" rel="noopener noreferrer">EPSG registry · Estonian Coordinate System of 1997 (EPSG:3301) ↗</a></li>
          </ul>
        </section>

        <nav className="field-lab-sequence" aria-label="Field Lab 07 navigation">
          <a href={academyHref(uavFieldLabPath)}><span>Return to the science</span><strong>Field Lab 07 · From Flight to Ecological Map</strong></a>
          <a href={academyHref("/species/from-field-to-earth-observation/")}><span>Continue the evidence chain</span><strong>Species → field plot → EO model</strong></a>
        </nav>
      </main>
      <SeoFooter />
    </>
  );
}
