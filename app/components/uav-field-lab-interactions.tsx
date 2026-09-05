"use client";
/* eslint-disable @next/next/no-img-element -- static-export project rasters must resolve as direct GitHub Pages assets */

import { useState } from "react";
import { academyHref } from "@/lib/site-paths";
import { droneLabPath } from "@/lib/uav-field-lab";

type ChecklistItem = { item: string; why: string };

const atHome: ChecklistItem[] = [
  { item: "Batteries charged", why: "Fixed-wing missions need predictable endurance; incomplete charging can shorten coverage or interrupt a mission." },
  { item: "Aircraft packed", why: "The correct inspected eBee X must be associated with the planned mission and payload." },
  { item: "Wings packed", why: "A complete, compatible airframe must reach the site before any mission can be executed." },
  { item: "Camera / payload packed", why: "The payload determines the evidence collected, camera footprint, target GSD and processing branch." },
  { item: "Cables / connectors packed", why: "Missing payload, power or data connections can block acquisition or later retrieval." },
  { item: "SD / media checked", why: "Usable, empty-enough media prevents an otherwise valid flight from producing an incomplete image set." },
  { item: "Laptop / controller packed", why: "eMotion planning, prechecks and mission monitoring depend on the correct workstation equipment." },
  { item: "Communication hardware packed", why: "The aircraft communication chain supports eMotion prechecks and monitoring in the documented workflow." },
  { item: "Field notebook prepared", why: "Mission identity, time, camera, weather and deviations must survive after the aircraft is packed away." },
  { item: "Mission map prepared", why: "The survey boundary, required plots, obstacles and recovery area must be reviewable before arrival." },
  { item: "Offline maps prepared where needed", why: "A field connection cannot be assumed; the situational map must remain available offline." },
  { item: "GCP targets packed", why: "Control targets must be visible in imagery and tied to the same surveyed point identities used later in Pix4D." },
  { item: "RTK / Trimble equipment prepared", why: "Surveyed GCP RTK records ground control; it is distinct from aircraft PPK and reference-station RINEX." },
  { item: "Memory stick / transfer storage packed", why: "The audited GCP export and mission evidence need a controlled transfer path." },
  { item: "Backup storage packed", why: "Raw images and logs need a second verified copy separate from source media." },
  { item: "Weather checked", why: "Wind, precipitation and illumination can make the approved plan unsafe or scientifically unsuitable." },
  { item: "Site access checked", why: "A technically valid mission cannot proceed without current lawful and practical access." },
  { item: "Planned sensor confirmed", why: "The sensor must match the intended visible, multispectral or thermal evidence." },
  { item: "Planned altitude / GSD confirmed", why: "Sensor footprint and altitude jointly determine coverage and nominal pixel spacing." },
  { item: "Forward overlap confirmed", why: "Successive images need common content along each flight line." },
  { item: "Side overlap confirmed", why: "Adjacent flight lines need common content across the mapping block." },
  { item: "Landing area considered", why: "A fixed-wing recovery area must be evaluated as part of the mission, following the approved eBee procedure." },
  { item: "Mission naming convention prepared", why: "A stable site/date/flight identifier links field notes, eMotion logs, images, RINEX and Pix4D outputs." },
];

const onSite: ChecklistItem[] = [
  { item: "Identify survey boundary", why: "The live mission must correspond to the intended meadow and include the required plots with margin." },
  { item: "Inspect take-off / landing area", why: "Ground conditions, obstacles and wind may differ from the desk plan; use the approved operational procedure." },
  { item: "Deploy GCPs", why: "Targets must be stable, visible and linked to the planned control records." },
  { item: "Place GCPs around and within the survey area", why: "Control concentrated in one corner or on one line constrains the complete survey geometry poorly." },
  { item: "Survey GCPs with RTK", why: "Ground targets require measured coordinates; this is separate from aircraft PPK." },
  { item: "Record GCP IDs", why: "The image target and surveyed coordinate must retain one identity through export and marking." },
  { item: "Assemble eBee wings", why: "Assembly must follow the current eBee X manufacturer/project procedure—not a DJI checklist." },
  { item: "Connect required aircraft / sensor connections", why: "Required connections must match the installed eBee X payload and approved procedure." },
  { item: "Install / check payload", why: "A correct mission polygon flown with the wrong camera does not answer the planned measurement question." },
  { item: "Prepare the communication antenna / system", why: "The 2024 workflow required the eBee communication chain for mission checks and monitoring." },
  { item: "Open eMotion", why: "The current mission, aircraft and payload state must be checked in the actual planning/monitoring software." },
  { item: "Verify current location", why: "A saved mission can be valid but belong to another site." },
  { item: "Load / open the correct mission", why: "Mission identity must match the site/date record before settings are trusted." },
  { item: "Verify mission polygon", why: "The map must cover the current survey boundary, plots and control—not merely have the right filename." },
  { item: "Verify altitude", why: "Altitude affects camera footprint, GSD, coverage and operational constraints." },
  { item: "Verify GSD", why: "Nominal ground sampling must match the scientific plan and selected payload." },
  { item: "Verify forward overlap", why: "Along-track common image content supports matching and reconstruction." },
  { item: "Verify side overlap", why: "Cross-track common image content connects adjacent flight lines." },
  { item: "Verify landing direction", why: "Fixed-wing landing geometry is planned, not improvised; follow current approved eBee guidance." },
  { item: "Complete eMotion prechecks", why: "A failed aircraft, payload, storage, battery or GNSS state is a stop condition before launch." },
  { item: "Verify storage", why: "The payload must have capacity for the planned image sequence." },
  { item: "Verify battery", why: "Charge state must support the actual mission and current conditions." },
  { item: "Verify GNSS / status", why: "The current aircraft/navigation state must pass the approved precheck before launch." },
  { item: "Verify and record weather / wind / light conditions", why: "Wind moves vegetation and can affect matching; illumination influences image and radiometric conditions." },
  { item: "Take screenshot / photo of mission settings", why: "This preserves evidence of camera, altitude, GSD and overlap if exported records are incomplete." },
  { item: "Record flight / log identifier", why: "The log suffix, time and image count disambiguate missions during Postflight and PPK." },
];

const fieldNoteFields = ["Site", "Date", "Mission name", "Flight / log number (including the recorded suffix)", "Aircraft", "Camera / payload", "Multispectral / RGB / thermal", "Start time", "End time", "Time zone", "Planned altitude", "Planned GSD", "Forward overlap", "Side overlap", "Wind", "Cloud / light conditions", "GCP IDs", "Number of images", "Notes / warnings", "Landing condition", "Operator comments"];

const preflightSop = ["Charge batteries", "Prepare mission and offline map", "Prepare GCP targets + Trimble / RTK", "Assemble eBee", "Connect payload and required cables", "Prepare communications hardware", "Open the correct eMotion mission", "Verify area", "Verify camera", "Verify altitude / GSD", "Verify forward / side overlap", "Verify landing area / direction", "Complete eMotion prechecks", "Record mission settings / log ID", "Survey GCPs", "Record weather / light", "Fly the approved mission"];

function Checklist({ items }: { items: ChecklistItem[] }) {
  return <ul className="uav-preflight-list">{items.map(({ item, why }) => <li key={item}><label><input type="checkbox" /><span><strong>{item}</strong><small><b>WHY</b>{why}</small></span></label></li>)}</ul>;
}

export function UavPreflightPreparation() {
  return (
    <section className="uav-preflight" id="phase-0" aria-labelledby="phase-0-title">
      <header><p className="section-kicker">Phase 0 · before the flight</p><h2 id="phase-0-title">Preparation makes the mission traceable</h2><p>This eBee X checklist reconciles the 2024 field notes with the documented PPK/GCP workflow. DJI-specific calibration or base-station actions are intentionally not transferred into this SOP.</p></header>
      <aside className="uav-positioning-distinction"><strong>Keep four positioning ideas separate</strong><span><b>Aircraft RTK</b> real-time onboard corrections</span><span><b>Aircraft PPK</b> post-flight rover + reference observations</span><span><b>Surveyed GCP RTK</b> target coordinates measured on the ground</span><span><b>ESTPOS / reference data</b> station observations supplied to a PPK workflow</span></aside>
      <div className="uav-preflight-columns">
        <article><span>A</span><h3>At home · before leaving</h3><Checklist items={atHome} /></article>
        <article><span>B</span><h3>On site · before launch</h3><Checklist items={onSite} /></article>
      </div>
      <article className="uav-field-note-template" id="field-note-template"><div><span>C</span><p className="section-kicker">Instructional template · do not invent missing values</p><h3>2024 UAV field note</h3></div><dl>{fieldNoteFields.map((field) => <div key={field}><dt>{field}</dt><dd aria-label={`${field} blank field`}>________________</dd></div>)}</dl></article>
      <div className="uav-field-note-continuity" role="img" aria-label="Field note values link the correct mission to post-flight PPK processing"><span><b>FIELD NOTE</b>log ID · start/end + zone · camera · image count</span><i>→</i><span><b>POST-FLIGHT</b>find log → match time → match images → request RINEX → PPK</span></div>
    </section>
  );
}

export function DronePreflightQuickSop() {
  return <section className="drone-preflight-quick" id="preflight-quick-sop" aria-labelledby="preflight-quick-title"><header><p className="section-kicker">Before flight · quick SOP</p><h2 id="preflight-quick-title">Prepare, document, then fly</h2><p>These checks precede the post-flight workstation SOP below. Hardware assembly, prechecks, launch and recovery must follow the current approved eBee X procedure.</p></header><ol>{preflightSop.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><label><input type="checkbox" />{item}</label></li>)}</ol><a href={academyHref("/field-labs/uav-coastal-wetlands/#phase-0")}>Open the explained preparation checklist →</a></section>;
}

type ExpandableItem = { id: string; label: string; meaning: string; example: string; why: string; check: string; href: string };

const scientificWorkflow: ExpandableItem[] = [
  { id: "question", label: "Ecological question", meaning: "Define the response, observational unit and claim before choosing a sensor.", example: "Relate plot-level field responses to plot summaries of UAV predictors.", why: "The question determines the products, support and validation—not the other way around.", check: "Can you state the response, predictor family and non-claim?", href: "#tutorial-step-01" },
  { id: "sensor", label: "Sensor choice", meaning: "Choose RGB, Sequoia multispectral or Duet T for the evidence required.", example: "The 2024 campaign used visible geometry, four reflectance bands and a separate thermal branch.", why: "Different sensors record different measurement domains.", check: "Does the selected payload produce the evidence named in the question?", href: "#reference-sensors" },
  { id: "flight", label: "Flight design", meaning: "Define boundary, altitude, GSD, overlap, lines and landing geometry.", example: "Sequoia: about 106–109 m AGL, 80% forward / 75% side overlap and about 10 cm working output.", why: "Altitude affects GSD and coverage; overlap supplies common content for photogrammetry.", check: "Do coverage, endurance and recovery geometry remain defensible?", href: "#tutorial-step-03" },
  { id: "raw", label: "Raw imagery", meaning: "Preserve original camera files and aircraft logs before any processing.", example: "Sensor-specific raw folders plus a separate working copy.", why: "An immutable source supports recovery and audit.", check: "Do counts, dates, site and payload reconcile?", href: "#tutorial-step-05" },
  { id: "position", label: "Positioning", meaning: "Link every image capture to time and camera coordinates.", example: "eMotion associates the verified mission log with its image folder.", why: "Position evidence initializes reconstruction and links it to map space.", check: "Is the mission/time/image association unique?", href: "#tutorial-step-06" },
  { id: "ppk-gcp", label: "PPK / GCP", meaning: "PPK corrects camera geotags; GCPs constrain image geometry using surveyed targets.", example: "2024: RINEX-based PPK plus EPSG:3301 GCP import and manual image marking.", why: "They are complementary but not interchangeable sources of position evidence.", check: "Are time overlap, base metadata, GCP CRS, IDs and marks verified?", href: `${academyHref(droneLabPath)}#step-05` },
  { id: "photogrammetry", label: "Photogrammetry", meaning: "Match repeated features and solve camera geometry before reconstructing a dense surface.", example: "Initial Processing → Quality Report → GCP marks → Reoptimize → point cloud.", why: "A mosaic is a geometric reconstruction, not simple picture stitching.", check: "Did the initial network pass before dense stages?", href: "#reference-photogrammetry" },
  { id: "radiometry", label: "Radiometry", meaning: "Relate sensor values to incident and measured radiation using the required calibration evidence.", example: "Sequoia band reflectance products are distinct from an RGB mosaic or thermal product.", why: "Geometry answers where; radiometry answers what a value represents.", check: "Is calibration provenance present and appropriate to the sensor?", href: "#reference-sensors" },
  { id: "domains", label: "RGB / multispectral / thermal", meaning: "Keep visible colour, narrow reflected bands and emitted thermal radiation distinct.", example: "S.O.D.A. RGB, Sequoia Green/Red/Red Edge/NIR and Duet T thermal were separate project evidence branches.", why: "A shared map extent does not make pixel values equivalent.", check: "Is every product labelled with its measurement domain?", href: "#project-examples" },
  { id: "bands", label: "Reflectance bands", meaning: "Inspect Green, Red, Red Edge and NIR as separate calibrated band rasters.", example: "A four-band stack can support indices after identity, grid and calibration checks.", why: "Each band samples a different spectral region; band is not index.", check: "Do names, units, extent, resolution, alignment and NoData agree?", href: "#reference-products" },
  { id: "indices", label: "Vegetation indices", meaning: "Calculate documented arithmetic combinations of aligned reflectance bands.", example: "Saardu NDVI, GNDVI, RNDVI and MSAVI show different contrast over the same study area.", why: "Different formulas emphasize different spectral relationships.", check: "Are formula, band order, scaling and masks explicit?", href: "#project-examples" },
  { id: "dsm", label: "DSM", meaning: "Rasterize the visible upper surface from the accepted dense reconstruction.", example: "Saardu DSM preserves spatial structure but includes vegetation and objects.", why: "DSM supports geometry and structural predictors; it is not automatically ground elevation or vegetation height.", check: "Are CRS, vertical reference, artefacts and NoData documented?", href: "#tutorial-step-16" },
  { id: "qa", label: "Quality control", meaning: "Accept, qualify or block geometry, radiometry and every requested product.", example: "Quality Report plus independent inspection of seams, grids, band alignment and coverage.", why: "Processing completed does not mean scientifically valid.", check: "Does each warning have an explanation or corrective action?", href: "#tutorial-step-21" },
  { id: "interpret", label: "Ecological interpretation", meaning: "Connect field responses to sensor predictors without turning associations into direct measurements.", example: "A model may predict plot-level CCI CWM from UAV predictors; it does not identify a species.", why: "Field observations give ecological meaning to sensor signals.", check: "Are support, validation and uncertainty stated?", href: "#reference-field-link" },
  { id: "handoff", label: "Analysis-ready data", meaning: "Package accepted rasters, metadata, logs and QA in one reproducible handoff.", example: "Aligned predictor stack + manifest + CRS/grid/mask definitions + acceptance record.", why: "Downstream analysis must know exactly what every layer represents.", check: "Can another analyst reproduce identity, lineage and exclusions?", href: "#tutorial-step-22" },
];

const photogrammetryWorkflow: ExpandableItem[] = [
  { id: "overlap", label: "Overlapping images", meaning: "Photographs view the same ground from several camera positions.", example: "Forward and side overlap create repeated coverage along and between flight lines.", why: "Reconstruction requires common image content.", check: "Does the analysis area have sufficient achieved overlap?", href: "#tutorial-step-03" },
  { id: "features", label: "Feature detection", meaning: "Software identifies repeatable local image patterns.", example: "Texture and stable edges are more useful than uniform water or moving vegetation.", why: "Candidate features are the raw material for cross-image correspondence.", check: "Are blur and low-texture zones limiting detection?", href: "#tutorial-step-11" },
  { id: "matching", label: "Image matching", meaning: "Features believed to represent the same scene point are linked across images.", example: "This is distinct from eMotion associating image timestamps with a flight log.", why: "Matches establish relative view geometry.", check: "Do images form one plausible connected block?", href: "#tutorial-step-10" },
  { id: "bundle", label: "Bundle adjustment", meaning: "Camera positions, orientations and 3-D tie points are solved together.", example: "Initial Processing creates the first camera network; Reoptimize later adds accepted GCP constraints.", why: "All image rays must agree in one geometric solution.", check: "Are calibration, blocks and residuals plausible?", href: "#tutorial-step-14" },
  { id: "sparse", label: "Sparse points", meaning: "Matched tie points form a diagnostic 3-D network.", example: "Inspect this state in the initial Quality Report before dense processing.", why: "It exposes weak connectivity early.", check: "Is coverage coherent over the required area?", href: "#tutorial-step-11" },
  { id: "dense", label: "Dense reconstruction", meaning: "The accepted camera model is used to estimate many surface samples.", example: "Low/Fast can support diagnostic work; Optimal may suit final needs when justified.", why: "Dense samples support a surface model, but density is not positional accuracy.", check: "Are holes, noise and low-texture failures acceptable?", href: "#tutorial-step-15" },
  { id: "dsm-stage", label: "DSM", meaning: "Dense samples are interpolated into an upper-surface elevation grid.", example: "Vegetation, objects and water artefacts remain part of the visible surface.", why: "The DSM provides surface geometry for orthorectification.", check: "Are grid, units, vertical reference and artefacts recorded?", href: "#tutorial-step-16" },
  { id: "ortho", label: "Orthorectification", meaning: "Perspective and surface displacement are corrected into map geometry.", example: "Camera solution + DSM + CRS support consistent ground coordinates.", why: "An unrectified photograph does not have uniform map scale.", check: "Does the product align with accepted control and coverage?", href: "#tutorial-step-17" },
  { id: "mosaics", label: "Orthomosaic / reflectance maps", meaning: "Corrected image information is combined into mapped visible or band products.", example: "RGB context and four separate Sequoia reflectance GeoTIFFs are different outputs.", why: "Geometry can be shared while radiometric meanings differ.", check: "Are seams, calibration, grids, masks and band identity verified?", href: "#tutorial-step-18" },
];

function ExpandableCards({ items, label, className = "" }: { items: ExpandableItem[]; label: string; className?: string }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return <ol className={`uav-expandable-cards ${className}`} aria-label={label}>{items.map((item, index) => { const isOpen = open === item.id; return <li id={`concept-${item.id}`} className={isOpen ? "is-open" : ""} key={item.id}><button type="button" aria-expanded={isOpen} aria-controls={`concept-panel-${item.id}`} onClick={() => setOpen(isOpen ? null : item.id)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><small>{isOpen ? "Close" : "Open details"} <i aria-hidden="true">{isOpen ? "↑" : "↓"}</i></small></button>{isOpen && <div id={`concept-panel-${item.id}`}><p><b>WHAT IT MEANS</b>{item.meaning}</p><p><b>OUR 2024 EXAMPLE</b>{item.example}</p><p><b>WHY</b>{item.why}</p><p><b>WHAT TO CHECK</b>{item.check}</p><a href={item.href}>Go to the relevant practical step →</a></div>}</li>; })}</ol>;
}

export function ScientificWorkflowExplorer() { return <ExpandableCards items={scientificWorkflow} label="Interactive 15-step scientific workflow" />; }
export function PhotogrammetryExplorer() { return <ExpandableCards items={photogrammetryWorkflow} label="Interactive photogrammetry reconstruction workflow" className="uav-photogrammetry-cards" />; }

const projectExamples = [
  { id: "ndvi", label: "NDVI", src: "examples/saardu-ndvi.png", formula: "(NIR − Red) / (NIR + Red)", bands: "NIR + Red", seeing: "A derived vegetation-index surface for Saardu.", different: "The ratio emphasizes contrast between red absorption and NIR scattering.", pixels: "Unitless NDVI values in this processed map.", infer: "Spatial variation in this index within the accepted product.", cannot: "High biodiversity, high AGB or direct chlorophyll without a validated relationship." },
  { id: "gndvi", label: "GNDVI", src: "examples/saardu-gndvi.png", formula: "(NIR − Green) / (NIR + Green)", bands: "NIR + Green", seeing: "The same Saardu landscape through a Green–NIR ratio.", different: "Changing Red to Green changes the spectral contrast and therefore the spatial pattern.", pixels: "Unitless GNDVI values in this processed map.", infer: "Where GNDVI differs within this product and extent.", cannot: "A named plant trait or species identity from the colour alone." },
  { id: "rndvi", label: "RNDVI / NDVIRe", src: "examples/saardu-rndvi.png", formula: "(NIR − Red Edge) / (NIR + Red Edge)", bands: "NIR + Red Edge", seeing: "A project red-edge index over the same Saardu extent.", different: "Red Edge samples the transition between red absorption and NIR reflectance.", pixels: "Unitless red-edge ratio values in this processed map.", infer: "Index contrast that can enter a documented predictor set.", cannot: "Direct CCI, leaf area, biomass, health or biodiversity." },
  { id: "msavi", label: "MSAVI", src: "examples/saardu-msavi.png", formula: "[2NIR + 1 − √((2NIR + 1)² − 8(NIR − Red))] / 2", bands: "NIR + Red", seeing: "A soil-adjusted derived index for the same project site.", different: "Its nonlinear formula changes contrast relative to NDVI.", pixels: "Unitless MSAVI values from aligned reflectance bands.", infer: "Spatial patterns in this specific derived layer.", cannot: "That apparent contrast is a causal ecological mechanism." },
  { id: "dsm", label: "DSM", src: "examples/saardu-dsm.png", formula: "Dense surface → elevation grid", bands: "Geometry, not a spectral index", seeing: "The reconstructed upper visible surface of Saardu.", different: "Colour encodes surface elevation rather than reflectance or an index.", pixels: "Elevation of the reconstructed visible surface in the documented raster reference.", infer: "Surface-form variation after vertical-reference and artefact checks.", cannot: "Vegetation height without a suitable terrain reference and derivation." },
  { id: "thermal", label: "Thermal", src: "examples/saardu-thermal.png", formula: "Calibrated thermal product", bands: "Emitted thermal infrared", seeing: "A processed thermal-domain map for the same Saardu study site.", different: "Thermal emission is a different measurement domain from reflected Green/Red/Red Edge/NIR.", pixels: "Processed thermal values under the product calibration and palette.", infer: "Spatial thermal contrast after product QA.", cannot: "Warm = dry or cool = healthy without independent validation." },
];

function projectExampleSrc(relativePath: string) {
  const route = "/field-labs/uav-coastal-wetlands/";
  if (typeof window === "undefined") return `${academyHref(route)}${relativePath}`;
  const routeIndex = window.location.pathname.indexOf(route);
  const deployedBase = routeIndex >= 0 ? window.location.pathname.slice(0, routeIndex) : "";
  return `${deployedBase}${route}${relativePath}`;
}

export function UavProjectExamples() {
  const [selected, setSelected] = useState(projectExamples[0].id);
  const item = projectExamples.find((entry) => entry.id === selected) ?? projectExamples[0];
  return <section className="uav-project-examples" id="project-examples" aria-labelledby="project-examples-title"><header><p className="section-kicker">Real 2024 project evidence · Saardu</p><h2 id="project-examples-title">Same site, different measurement product</h2><p>Every panel uses an Academy-safe crop of a real processed project map. The map footprint is preserved; precise axis coordinates were removed for public teaching.</p></header><div className="uav-example-selector" role="group" aria-label="Select a 2024 Saardu product">{projectExamples.map((entry) => <button type="button" aria-pressed={selected === entry.id} onClick={() => setSelected(entry.id)} key={entry.id}>{entry.label}</button>)}</div><div className="uav-example-stage"><figure><img src={projectExampleSrc(item.src)} width="1200" height="1179" alt={`${item.label} processed map for the Saardu 2024 UAV study site`} /><figcaption><strong>{item.label}</strong><span>Processed / derived 2024 project example · Saardu</span></figcaption></figure><article><p><b>FORMULA / SOURCE</b><code>{item.formula}</code></p><p><b>BANDS / DOMAIN</b>{item.bands}</p><p><b>WHAT YOU ARE SEEING</b>{item.seeing}</p><p><b>WHY IT LOOKS DIFFERENT</b>{item.different}</p><p><b>WHAT THE PIXELS REPRESENT</b>{item.pixels}</p><p><b>WHAT WE CAN INFER</b>{item.infer}</p><p><b>WHAT WE CANNOT INFER</b>{item.cannot}</p></article></div><div className="uav-same-site-strip">{projectExamples.filter((entry) => ["ndvi", "rndvi", "dsm", "thermal"].includes(entry.id)).map((entry) => <button type="button" onClick={() => setSelected(entry.id)} key={entry.id}><img src={projectExampleSrc(entry.src)} width="500" height="491" alt={`${entry.label} thumbnail for Saardu`} /><span>{entry.label}</span></button>)}</div><aside><strong>IMAGE ≠ BAND ≠ REFLECTANCE ≠ INDEX</strong><p>The available public-safe 2024 teaching exports support a same-site comparison of derived indices, DSM and thermal. A raw RGB plus individually scaled Green/Red/Red Edge/NIR panel is not shown because no verified safe like-for-like export was available; a decorative substitute would be scientifically misleading.</p></aside></section>;
}

const portfolio = [
  { id: "manifest", title: "Mission and source manifest", fields: ["site, date and mission name", "aircraft and sensor", "altitude, GSD and both overlaps", "flight time, time zone, log ID and image count", "raw-file inventory", "GCP file, CRS and schema", "PPK evidence", "software and version"] },
  { id: "atlas", title: "Product and QA atlas", fields: ["RGB orthomosaic", "four reflectance bands", "selected index rasters", "DSM and thermal where used", "pixel meaning and units", "resolution, grid and NoData", "product-specific QA", "accept / qualify / block decision"] },
  { id: "support", title: "Field-to-pixel audit", fields: ["SampleID and plot geometry", "1 m² biological support", "raster pixels intersecting each plot", "aggregation rule", "CRS/alignment check", "coverage and NoData exclusions", "pseudo-replication safeguard", "model-row identity"] },
  { id: "brief", title: "Ecological interpretation brief", fields: ["response and predictors", "observed / derived / modelled labels", "scientifically supported interpretation", "explicit non-claims", "validation design", "field and EO uncertainty", "scale limitations", "analysis-ready handoff link"] },
];

export function UavPortfolioChallenge() {
  const [open, setOpen] = useState<string | null>(null);
  return <section className="uav-portfolio-challenge" aria-labelledby="portfolio-title"><p className="section-kicker">Portfolio challenge</p><h2 id="portfolio-title">Produce an auditable mission handoff</h2><div>{portfolio.map((entry) => { const isOpen = open === entry.id; return <article id={`portfolio-${entry.id}`} key={entry.id}><button type="button" aria-expanded={isOpen} aria-controls={`portfolio-panel-${entry.id}`} onClick={() => setOpen(isOpen ? null : entry.id)}><strong>{entry.title}</strong><span>{isOpen ? "Close" : "Open deliverables"} <i aria-hidden="true">{isOpen ? "↑" : "↓"}</i></span></button>{isOpen && <section id={`portfolio-panel-${entry.id}`}><b>REQUIRED</b><ul>{entry.fields.map((field) => <li key={field}>{field}</li>)}</ul></section>}</article>; })}</div></section>;
}
