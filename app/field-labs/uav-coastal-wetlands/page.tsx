import type { Metadata } from "next";
import { UavBandExplorer } from "@/app/components/uav-field-lab-explorer";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import {
  droneLabPath,
  flightConfiguration,
  qaStopGates,
  scientificPipeline,
  uavFieldLabPath,
  uavOutputs,
  uavSources,
  vegetationIndices,
} from "@/lib/uav-field-lab";

const pageUrl = academyUrl(uavFieldLabPath);

export const metadata: Metadata = {
  title: "Field Lab 07 · UAV Remote Sensing — From Flight to Ecological Map",
  description: "Follow a verified 2024 eBee X coastal-wetland campaign from sensor choice, PPK and Pix4D processing to reflectance, DSM, vegetation predictors and ecological maps.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Field Lab 07 · UAV Remote Sensing",
    description: "From a 2024 eBee X mission to analysis-ready ecological predictors and maps.",
    type: "article",
    url: pageUrl,
  },
};

const fieldToMap = ["1 m² field plot", "UAV images", "pixels and bands", "orthomosaic / reflectance", "plot summaries", "model", "ecological map"];
const pix4dPipeline = ["Overlapping images", "Feature detection", "Image matching", "Camera orientation + bundle adjustment", "Sparse points", "Dense reconstruction", "DSM", "Orthorectification", "Orthomosaic / reflectance"];
const flightPlan = ["Research question", "Site boundary", "Required GSD", "Sensor", "Altitude", "Overlap", "Weather + light", "Battery + landing", "Mission plan"];

function Flow({ items, label, compact = false }: { items: readonly string[]; label: string; compact?: boolean }) {
  return <ol className={`uav-flow ${compact ? "compact" : ""}`} aria-label={label}>{items.map((item, index) => <li key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol>;
}

export default function UavCoastalWetlandsPage() {
  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Field Lab 07 · UAV Remote Sensing — From Flight to Ecological Map",
          description: metadata.description,
          url: pageUrl,
          learningResourceType: "Field lab",
          educationalUse: "instruction",
          teaches: ["UAV mission design", "eBee X", "multispectral reflectance", "thermal imaging", "PPK and GCP", "photogrammetry", "vegetation indices", "field-to-raster modelling"],
          creator: creatorReference(),
          isPartOf: { "@type": "WebSite", name: "Remote Sensing Scientist Academy", url: academyUrl("/") },
          citation: Object.values(uavSources),
          hasPart: { "@type": "LearningResource", name: "Drone Lab · eBee Post-flight and Pix4D Processing", url: academyUrl(droneLabPath) },
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
      <main className="uav-lab-page" id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Field Labs", href: academyHref("/field-labs/") },
          { label: "Field Lab 07" },
        ]} />

        <header className="uav-lab-hero">
          <div>
            <p className="section-kicker">Field Lab 07 · UAV Remote Sensing · Western Estonia</p>
            <h1>From Flight to Ecological Map</h1>
            <p>Process the scientific reasoning behind a real 2024 eBee X coastal-wetland campaign—from sensor and mission design to georeferenced, radiometrically meaningful products and bounded ecological interpretation.</p>
            <div className="uav-hero-actions">
              <a className="button button-primary" href={academyHref(droneLabPath)}>Open the operational Drone Lab →</a>
              <a className="text-link" href="#sensor-system">Start with what the drone sees ↓</a>
            </div>
          </div>
          <div className="uav-flight-visual" role="img" aria-label="Fixed-wing eBee mapping a coastal meadow with overlapping image footprints and field plots">
            <div className="uav-wing">eBee X</div><i /><i /><i /><i /><b>1 m² plots</b><span>overlapping image footprints</span>
          </div>
        </header>

        <section className="uav-fact-strip" aria-label="Verified 2024 campaign facts">
          <div><strong>30 Jun–2 Jul 2024</strong><span>Acquisition window</span></div>
          <div><strong>4 sites</strong><span>Saardu · Keemu · Kõera · Kudani</span></div>
          <div><strong>eBee X</strong><span>Fixed-wing mapping platform</span></div>
          <div><strong>120 plots</strong><span>1 m² ecological references</span></div>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Scientific story</p>
          <h2>Follow the evidence from question to usable raster</h2>
          <Flow items={scientificPipeline} label="Complete Field Lab 07 scientific workflow" />
          <div className="uav-core-message">
            <strong>The sensor records radiation and image geometry.</strong>
            <p>Field observations supply ecological meaning and reference responses. The aircraft did not directly measure CCI, leaf area, above-ground biomass, vegetation height or species identity.</p>
          </div>
          <Flow items={fieldToMap} label="One square metre field plot to ecological prediction map" compact />
        </section>

        <section className="uav-lab-section uav-platform-section">
          <div>
            <p className="section-kicker">Platform choice</p>
            <h2>Why a fixed-wing eBee?</h2>
            <p>The eBee X was suitable for systematic mapping across spatially extensive meadow sites. Its fixed-wing form supports efficient forward flight and longer coverage than a typical hover-focused platform, while RTK/PPK and interchangeable mapping payloads support survey workflows.</p>
            <p>That is a project-fit decision, not a universal ranking. A multirotor can hover, launch in tighter spaces and inspect small targets more flexibly. Fixed-wing work needs suitable take-off/landing areas and flight planning.</p>
            <a href={uavSources.ebee} target="_blank" rel="noopener noreferrer">AgEagle/senseFly eBee X specifications ↗</a>
          </div>
          <div className="uav-platform-compare" aria-label="Fixed-wing and multirotor scientific comparison">
            <article><span>FIXED-WING</span><strong>Systematic area mapping</strong><ul><li>Efficient forward coverage</li><li>Longer endurance potential</li><li>Landing-space constraints</li><li>Cannot hover</li></ul></article>
            <article><span>MULTIROTOR</span><strong>Flexible local inspection</strong><ul><li>Hover and oblique views</li><li>Tighter launch/landing</li><li>Fine local positioning</li><li>Usually less area per battery</li></ul></article>
          </div>
        </section>

        <section className="uav-lab-section" id="sensor-system">
          <p className="section-kicker">Sensor system</p>
          <h2>Visible, multispectral and thermal are different measurements</h2>
          <UavBandExplorer />
          <div className="uav-sensor-triptych">
            <article><span>RGB · S.O.D.A.</span><h3>Visible colour and geometry</h3><p>High-resolution RGB supports spatial context, vegetation boundaries, texture, orthomosaic interpretation and photogrammetric reconstruction. It is scientific evidence, not merely a “normal picture”.</p></article>
            <article><span>SEQUOIA</span><h3>Four reflectance bands</h3><p>Green, Red, Red Edge and NIR are separate narrow-band images calibrated into reflectance products before quantitative index calculation.</p></article>
            <article className="thermal"><span>DUET T</span><h3>Thermal emission</h3><p>The Duet T pairs a S.O.D.A. RGB camera with a 640 × 512 thermal camera. Thermal information describes emitted infrared radiation/apparent surface temperature when calibrated—not reflectance.</p></article>
          </div>
          <div className="uav-misconceptions"><strong>THERMAL ≠ REFLECTANCE</strong><strong>THERMAL ≠ DIRECT SOIL MOISTURE</strong><strong>THERMAL ≠ DIRECT PLANT STRESS</strong></div>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Radiometry</p>
          <h2>How sunlight becomes a reflectance value</h2>
          <div className="uav-radiometry-grid">
            <div className="sun-sensor-diagram" role="img" aria-label="Sunlight travels through atmosphere to vegetation and reflected radiation reaches the sensor">
              <span className="sun">SUN<br /><small>irradiance</small></span><i>↓ atmosphere</i><span className="leaf">LEAF + CANOPY</span><i>↗ reflected</i><span className="sensor">SENSOR</span>
            </div>
            <div>
              <p>Irradiance reaches vegetation after atmospheric and illumination effects. Leaves and canopies absorb, scatter, transmit and reflect different portions. The camera initially records a digital response; calibration connects that response to incident illumination and sensor properties.</p>
              <div className="reflectance-equation">reflectance ≈ reflected radiation / incident radiation</div>
              <p>This is a conceptual relation. Operational radiometric calibration also depends on sensor response, exposure, calibration targets/sunshine data, viewing geometry and processing choices.</p>
            </div>
          </div>
          <div className="leaf-energy-diagram" role="img" aria-label="Incoming radiation is divided among reflected, absorbed and transmitted energy at a leaf">
            <span>INCOMING</span><i className="reflected">REFLECTED ↗</i><b>LEAF</b><i className="absorbed">ABSORBED</i><i className="transmitted">TRANSMITTED ↓</i>
          </div>
          <figure className="spectral-curve">
            <svg viewBox="0 0 900 280" role="img" aria-labelledby="spectral-title spectral-desc">
              <title id="spectral-title">Conceptual green vegetation spectral response</title>
              <desc id="spectral-desc">Reflectance is modest in visible green, low in red, rises through the red edge and is high in near infrared.</desc>
              <path d="M55 230 C130 220 170 170 220 205 S320 235 380 215 C430 195 445 85 505 55 S690 58 845 74" fill="none" stroke="currentColor" strokeWidth="7" />
              <line x1="55" y1="240" x2="855" y2="240" stroke="currentColor" opacity=".35" /><line x1="55" y1="20" x2="55" y2="240" stroke="currentColor" opacity=".35" />
              <g><circle cx="210" cy="202" r="9" /><text x="180" y="265">Green</text></g><g><circle cx="365" cy="218" r="9" /><text x="345" y="265">Red</text></g><g><circle cx="458" cy="103" r="9" /><text x="422" y="265">Red Edge</text></g><g><circle cx="655" cy="58" r="9" /><text x="640" y="265">NIR</text></g>
            </svg>
            <figcaption>Conceptual vegetation response only; not a measured spectrum from the 2024 sites.</figcaption>
          </figure>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Flight configuration</p>
          <h2>Verified project settings and different output scales</h2>
          <div className="uav-flight-table" role="region" aria-label="Verified 2024 flight configuration" tabIndex={0}>
            <table><thead><tr><th>System</th><th>Payload</th><th>Altitude</th><th>Overlap</th><th>Output GSD</th><th>Purpose</th></tr></thead><tbody>{flightConfiguration.map((row) => <tr key={row.system}><th>{row.system}</th><td>{row.payload}</td><td>{row.altitude}</td><td>{row.overlap}</td><td>{row.gsd}</td><td>{row.role}</td></tr>)}</tbody></table>
          </div>
          <p>Different focal lengths, detector sizes, image dimensions, altitudes and processing outputs produce different GSDs. <strong>Pixel size is not always effective spatial resolution:</strong> blur, motion, reconstruction, resampling and geolocation can reduce the detail that is scientifically distinguishable.</p>
          <h3>Flight planning is an evidence chain</h3>
          <Flow items={flightPlan} label="UAV mission planning chain" compact />
          <div className="overlap-diagram" role="img" aria-label="Three overlapping aerial photographs share tie points used for photogrammetric matching">
            <div>A <i /><i /><i /></div><div>B <i /><i /><i /></div><div>C <i /><i /><i /></div><span>shared tie points → camera geometry → bundle adjustment</span>
          </div>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Positioning</p>
          <h2>PPK improves camera geotags; control tests another part of the chain</h2>
          <div className="ppk-diagram" role="img" aria-label="UAV GNSS and base station observations with overlapping time feed a post-processed kinematic solution">
            <span>UAV GNSS<br /><small>rover observations</small></span><strong>+</strong><span>Reference station<br /><small>RINEX observations</small></span><strong>+</strong><span>Overlapping time<br /><small>complete mission + margin</small></span><b>→ PPK solution → corrected camera geotags</b>
          </div>
          <p><strong>PPK</strong> is post-processed kinematic positioning: rover and reference GNSS observations are combined after flight. <strong>RINEX</strong> is a receiver-independent exchange format used to transfer GNSS observations and navigation information.</p>
          <div className="ppk-before-after">
            <article><span>STANDALONE EXAMPLE</span><strong>≈0.806 m</strong><p>Manual project example of reported geotag uncertainty.</p></article>
            <article><span>POST-PROCESSED EXAMPLE</span><strong>≈0.049 m</strong><p>Manual project example after PPK—not a universal guarantee of final map accuracy.</p></article>
          </div>
          <div className="uav-time-check"><strong>TIME CHECK</strong><p>eMotion/image records may use UTC/GPS-style time while the reference-data interface may use local time. During this 2024 summer campaign Estonia local time was UTC+3. Verify the time basis and request an interval that covers the entire mission with margin.</p></div>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Photogrammetry</p>
          <h2>Pix4D reconstructs camera and surface geometry</h2>
          <Flow items={pix4dPipeline} label="Pix4D photogrammetric reconstruction pipeline" />
          <p>Pix4D is not simply stitching pictures. It detects repeatable features, matches observations across overlapping images, estimates camera orientation and internal parameters through bundle adjustment, reconstructs 3-D surface evidence, then uses a DSM to orthorectify imagery into map geometry.</p>
          <div className="geometry-radiometry">
            <article><span>GEOMETRY</span><h3>Where is this pixel?</h3><ul><li>geotags and PPK</li><li>GCPs and CRS</li><li>bundle adjustment</li><li>DSM geometry</li><li>orthorectification</li></ul></article>
            <article><span>RADIOMETRY</span><h3>What does its value represent?</h3><ul><li>sensor response</li><li>incident illumination</li><li>calibration</li><li>reflectance</li><li>thermal signal</li></ul></article>
          </div>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Analysis products</p>
          <h2>Know the support and claim of every output</h2>
          <div className="uav-output-table" role="region" aria-label="UAV output meaning and limitations" tabIndex={0}>
            <table><thead><tr><th>Product</th><th>Status</th><th>Pixel / sample meaning</th><th>Scale</th><th>Use</th><th>Limitation</th></tr></thead><tbody>{uavOutputs.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>
          </div>
          <div className="uav-misconceptions"><strong>BAND ≠ INDEX</strong><strong>INDEX ≠ TRAIT</strong><strong>TRAIT PREDICTION ≠ DIRECT MEASUREMENT</strong></div>
          <div className="uav-index-grid">{vegetationIndices.map((item) => <article key={item.id}><span>{item.id}</span><code>{item.formula}</code><p>{item.limits}</p></article>)}</div>
          <div className="uav-warning-grid"><strong>HIGH NDVI ≠ HIGH BIODIVERSITY</strong><strong>HIGH NDVI ≠ AUTOMATICALLY HIGH BIOMASS</strong><strong>HIGH NDVI ≠ DIRECT CHLOROPHYLL</strong></div>
        </section>

        <section className="uav-lab-section uav-thermal-section">
          <div>
            <p className="section-kicker">Thermal interpretation</p>
            <h2>Colour palette is not measurement</h2>
            <p>A point cloud reconstructed from RGB geometry can be displayed with a thermal-looking palette. Colouring a geometric product does not insert thermal observations. The thermal image/product carrying calibrated thermal values is the evidence source.</p>
            <p>The 2024 campaign collected Duet T thermal imagery, but the documented final vegetation-trait models used reflectance bands, vegetation indices and DSM-derived structure rather than thermal predictors. The project record does not establish a reason for that analytical choice, so none is invented here.</p>
          </div>
          <div className="palette-measurement" role="img" aria-label="Identical point pattern shown with grey and thermal colour palettes while measurement source remains unchanged"><div className="grey">RGB-derived points</div><div className="false-colour">thermal-looking palette</div><strong>same geometry ≠ thermal measurement</strong></div>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Field ecology connection</p>
          <h2>Reference observations turn image predictors into ecological models</h2>
          <div className="field-uav-model">
            <article><span>FIELD · OBSERVED / DERIVED</span><p>CCI · leaf area · height · AGB/productivity · species and cover</p></article><strong>↓</strong>
            <article><span>UAV · PROCESSED / DERIVED</span><p>Green · Red · Red Edge · NIR · indices · DSM</p></article><strong>↓</strong>
            <article><span>MODELLED</span><p>Fitted relationship → continuous prediction map</p></article>
          </div>
          <div className="scale-support-diagram"><span>leaf</span><span>plant</span><span>1 m² quadrat</span><span>many UAV pixels</span><span>plot-level raster summary</span><span>prediction surface</span></div>
          <p>Plot responses were paired with plot-level summaries of raster predictors. Treating every pixel inside a plot as an independent field observation would manufacture replication and ignore the support of the reference measurement.</p>
          <a href={academyHref("/species/from-field-to-earth-observation/")}>Connect this flight workflow to the Species Atlas and field-to-EO story →</a>
        </section>

        <section className="uav-lab-section">
          <p className="section-kicker">Stop gates</p>
          <h2>A finished process can still be scientifically unusable</h2>
          <div className="uav-stop-grid">{qaStopGates.map((gate, index) => <article key={gate}><span>STOP {String(index + 1).padStart(2, "0")}</span><strong>{gate}</strong></article>)}</div>
          <div className="uav-qa-sequence" role="img" aria-label="Quality control sequence from source inventory through geometry, radiometry, raster alignment and field coverage"><span>Source inventory</span><span>Geometry</span><span>Radiometry</span><span>Raster grid</span><span>Field coverage</span><strong>ACCEPT / BLOCK</strong></div>
        </section>

        <section className="uav-lab-section uav-portfolio-section">
          <p className="section-kicker">Portfolio challenge</p>
          <h2>Produce an analysis-ready mission handoff</h2>
          <div className="uav-portfolio-grid">
            <article><span>01</span><h3>Mission and source manifest</h3><p>Sensor, dates, site, image counts, positioning, CRS, calibration and immutable raw-file inventory.</p></article>
            <article><span>02</span><h3>Product and QA atlas</h3><p>RGB, reflectance bands, point cloud, DSM, thermal product and indices with meaning, support and limits.</p></article>
            <article><span>03</span><h3>Field-to-pixel audit</h3><p>Plot geometry, coverage, extraction support, NoData and alignment decisions.</p></article>
            <article><span>04</span><h3>Ecological interpretation brief</h3><p>What the model predicts, what the sensor did not measure, uncertainty and defensible next analysis.</p></article>
          </div>
          <a className="button button-primary" href={academyHref(droneLabPath)}>Continue to Drone Lab · eBee Post-flight and Pix4D Processing →</a>
        </section>

        <section className="uav-lab-section uav-references">
          <p className="section-kicker">Evidence and software references</p>
          <h2>Project records plus authoritative technical documentation</h2>
          <p>Project-specific dates, flight settings, software versions, index formulas, PPK example and modelling inputs were verified against the 2024 processing manual and project methods/manuscript records. Public technical definitions were checked against:</p>
          <ul>
            <li><a href={uavSources.sequoia} target="_blank" rel="noopener noreferrer">Parrot Sequoia user guide ↗</a></li>
            <li><a href={uavSources.duetT} target="_blank" rel="noopener noreferrer">AgEagle camera collection · Duet T ↗</a></li>
            <li><a href={uavSources.pix4dSteps} target="_blank" rel="noopener noreferrer">PIX4Dmapper processing steps ↗</a></li>
            <li><a href={uavSources.epsg3301} target="_blank" rel="noopener noreferrer">EPSG registry · Estonian Coordinate System of 1997 ↗</a></li>
          </ul>
        </section>

        <nav className="field-lab-sequence" aria-label="Field Lab sequence">
          <a href={academyHref("/projects/track-recovery-after-fire/")}><span>Previous</span><strong>Field Lab 06 · Change Detection</strong></a>
          <a href={academyHref(droneLabPath)}><span>Practical companion</span><strong>Drone Lab · Post-flight and Pix4D</strong></a>
        </nav>
      </main>
      <SeoFooter />
    </>
  );
}
