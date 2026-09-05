"use client";

import { useEffect, useState } from "react";
import { droneSteps, operationalChecklist } from "@/lib/uav-field-lab";
import { academyHref } from "@/lib/site-paths";

const stepContext: Record<string, { what: string; where: string; input: readonly string[] }> = {
  "00": { what: "Retrieve the camera media and aircraft logs as two distinct evidence sources.", where: "Physical eBee X/camera data-access station.", input: ["Recovered aircraft", "Camera media", "Approved eBee X access procedure"] },
  "01": { what: "Create an immutable raw copy before any software changes files or metadata.", where: "Project drive → sensor-specific /raw folders.", input: ["Camera media", "Aircraft logs", "GNSS files", "Field notes"] },
  "02": { what: "Create the post-flight workspace that will associate the mission evidence.", where: "eMotion → Postflight / Flight Data Manager.", input: ["Verified raw copy", "Project workspace"] },
  "03": { what: "Identify one flight and its complete GNSS-reference time interval.", where: "eMotion mission timeline + reference-data request interface.", input: ["Flight log", "Site/date record", "Known time basis"] },
  "04": { what: "Associate capture events with the correct camera-image folder.", where: "eMotion Postflight image/log matching view.", input: ["Verified flight log", "Candidate image folder"] },
  "05": { what: "Solve post-processed camera positions from rover and reference GNSS observations.", where: "eMotion Postflight → PPK/base-station workflow.", input: ["UAV GNSS", "Overlapping RINEX files", "Verified base metadata"] },
  "06": { what: "Preserve corrected camera coordinates and their processing evidence.", where: "eMotion export/write-geotag controls → processed imagery folder.", input: ["Accepted PPK solution", "Matched images"] },
  "07": { what: "Create a camera-aware reconstruction using every intended image group.", where: "PIX4Dmapper → New Project / Image Properties.", input: ["Corrected RGB/multispectral/thermal images", "Geotag metadata"] },
  "08": { what: "Declare the horizontal coordinate reference used by control and outputs.", where: "PIX4Dmapper → project and GCP coordinate-system settings.", input: ["Project coordinate record", "EPSG:3301 control data"] },
  "09": { what: "Build initial camera geometry before dense products or control adjustment.", where: "PIX4Dmapper → Processing Options → Initial Processing.", input: ["Configured project", "Corrected overlapping images"] },
  "10": { what: "Export surveyed control without losing point identity or coordinate meaning.", where: "Trimble Access → Job → Export.", input: ["Approved survey job", "Selected control/check points", "Verified export schema"] },
  "11": { what: "Import surveyed coordinates and map the actual CSV columns deliberately.", where: "PIX4Dmapper → Project → GCP/MTP Manager.", input: ["Audited GCP CSV/TXT", "Recorded schema", "Verified CRS"] },
  "12": { what: "Measure each surveyed target in multiple overlapping images.", where: "PIX4Dmapper → GCP/MTP Manager or rayCloud image views.", input: ["Imported GCPs", "Initial camera geometry", "Images containing each target"] },
  "13": { what: "Update the bundle adjustment using the accepted image-control measurements.", where: "PIX4Dmapper → Process → Reoptimize.", input: ["Initial reconstruction", "Accepted GCP marks"] },
  "14": { what: "Audit residuals and control geometry before dense processing.", where: "PIX4Dmapper → GCP/MTP Manager, rayCloud and Quality Report.", input: ["Reoptimized reconstruction", "GCP residuals", "Control distribution"] },
  "15": { what: "Move from accepted sparse/control geometry to final product stages.", where: "PIX4Dmapper → Processing Options.", input: ["Accepted controlled solution", "Signed-off step-1 QA"] },
  "16": { what: "Choose a point-density setting matched to diagnostic or final-product needs.", where: "PIX4Dmapper → Point Cloud and Mesh options.", input: ["Accepted cameras", "Available resources", "Required surface detail"] },
  "17": { what: "Request geometrically corrected mosaics and calibrated multispectral band products.", where: "PIX4Dmapper → DSM, Orthomosaic and Index options.", input: ["Accepted geometry", "Radiometric-calibration evidence", "Output specification"] },
  "18": { what: "Run dense reconstruction and raster production from the accepted state.", where: "PIX4Dmapper → Start Processing for steps 2 and 3.", input: ["Accepted step 1/GCP state", "Recorded final options"] },
  "19": { what: "Use the report and product inspection to accept, qualify or block the mission.", where: "PIX4Dmapper Quality Report + rayCloud/map views.", input: ["Completed processing", "Quality Report", "Output previews"] },
  "20": { what: "Package readable products, metadata and QA for reproducible handoff.", where: "Project archive + GIS/raster inspection workspace.", input: ["All requested outputs", "Processing logs", "QA decisions"] },
};

const phaseLinks = [
  ["Retrieve + eMotion", "00"],
  ["PPK", "05"],
  ["Pix4D start", "07"],
  ["GCP control", "10"],
  ["Products + QA", "15"],
] as const;

export function DroneLabSop() {
  const [mode, setMode] = useState<"quick" | "why">("quick");
  const [activeNumber, setActiveNumber] = useState("00");
  const [openNumber, setOpenNumber] = useState<string | null>("00");
  const activeIndex = droneSteps.findIndex((step) => step.number === activeNumber);
  const previous = droneSteps[activeIndex - 1];
  const next = droneSteps[activeIndex + 1];

  useEffect(() => {
    function openFromHash() {
      const match = window.location.hash.match(/^#step-(\d{2})$/);
      if (match && droneSteps.some((step) => step.number === match[1])) {
        setActiveNumber(match[1]);
        setOpenNumber(match[1]);
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    window.addEventListener("popstate", openFromHash);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      window.removeEventListener("popstate", openFromHash);
    };
  }, []);

  function chooseStep(number: string) {
    setActiveNumber(number);
    setOpenNumber(number);
    window.history.pushState(null, "", `#step-${number}`);
    document.getElementById(`step-${number}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="sop-mode" aria-label="Drone Lab explanation mode">
        <button type="button" aria-pressed={mode === "quick"} onClick={() => setMode("quick")}>
          <strong>Quick SOP</strong><span>Compact operational layout with every stop gate</span>
        </button>
        <button type="button" aria-pressed={mode === "why"} onClick={() => setMode("why")}>
          <strong>Understand why</strong><span>More space for inputs, checks and scientific reasoning</span>
        </button>
      </div>

      <nav className="drone-step-navigator" aria-label="Drone Lab step navigation">
        <div className="uav-step-progress"><span style={{ width: `${((activeIndex + 1) / droneSteps.length) * 100}%` }} /></div>
        <label htmlFor="drone-sop-step">Jump to step</label>
        <select id="drone-sop-step" value={activeNumber} onChange={(event) => chooseStep(event.target.value)}>
          {droneSteps.map((step) => <option value={step.number} key={step.number}>{step.number} · {step.title}</option>)}
        </select>
        <div className="drone-phase-links">{phaseLinks.map(([label, number]) => <a href={`#step-${number}`} onClick={(event) => { event.preventDefault(); chooseStep(number); }} key={number}>{label}</a>)}</div>
        <div className="uav-step-arrows">
          {previous ? <a href={`#step-${previous.number}`} onClick={(event) => { event.preventDefault(); chooseStep(previous.number); }}>← Previous</a> : <span />}
          <strong>{activeNumber} / 20</strong>
          {next ? <a href={`#step-${next.number}`} onClick={(event) => { event.preventDefault(); chooseStep(next.number); }}>Next →</a> : <span />}
        </div>
      </nav>

      <ol className={`sop-steps mode-${mode}`}>
        {droneSteps.map((step, index) => {
          const context = stepContext[step.number];
          const isOpen = openNumber === step.number;
          return (
            <li className={isOpen ? "is-open" : ""} key={step.number} id={`step-${step.number}`}>
              <button className="sop-step-toggle" type="button" aria-expanded={isOpen} aria-controls={`sop-panel-${step.number}`} onClick={() => isOpen ? setOpenNumber(null) : chooseStep(step.number)}>
                <span>{step.number}</span><span><small>OPERATIONAL STEP</small><strong>{step.title}</strong></span><i aria-hidden="true">{isOpen ? "Close ↑" : "Open details ↓"}</i>
              </button>
              {isOpen && <div id={`sop-panel-${step.number}`}>
                <div className="sop-what"><strong>WHAT</strong><p>{context.what}</p></div>
                <div className="sop-mini-flow" role="img" aria-label={`${step.title}: input, action and output`}><span><small>INPUT</small>{context.input[0]}</span><b>→</b><span><small>ACTION</small>{step.action}</span><b>→</b><span><small>OUTPUT</small>{step.expected}</span></div>
                <div className="sop-fields">
                  <section><strong>ACTION</strong><p>{step.action}</p></section>
                  <section><strong>WHERE</strong><p>{context.where}</p></section>
                  <section className="sop-science"><strong>WHY</strong><p>{step.why}</p></section>
                  <section className="sop-science"><strong>INPUT</strong><ul>{context.input.map((item) => <li key={item}>{item}</li>)}</ul></section>
                  <section><strong>OUTPUT</strong><p>{step.expected}</p></section>
                  <section><strong>CHECK</strong><p>{step.check}</p></section>
                  <section className="sop-stop"><strong>IF THIS FAILS</strong><p>{step.stop}</p></section>
                  <section className="sop-next"><strong>NEXT</strong><p>{droneSteps[index + 1]?.title ?? "Package the accepted mission for analysis and handoff."}</p></section>
                </div>
              </div>}
            </li>
          );
        })}
      </ol>

      <section className="drone-checklist" id="operational-checklist" aria-labelledby="checklist-title">
        <p className="section-kicker">Printable operational checklist</p>
        <h2 id="checklist-title">eBee Postflight Checklist</h2>
        <div className="drone-checklist-actions">
          <button type="button" onClick={() => window.print()}>Print this checklist</button>
          <a href={academyHref("/field-labs/uav-coastal-wetlands/ebee-postflight-checklist.md")} download>Download Markdown checklist</a>
        </div>
        <ul>{operationalChecklist.map((item) => <li key={item}><span aria-hidden="true">□</span>{item}</li>)}</ul>
      </section>
    </>
  );
}
