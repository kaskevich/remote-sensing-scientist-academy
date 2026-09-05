"use client";

import { useState } from "react";
import { droneSteps, operationalChecklist } from "@/lib/uav-field-lab";
import { academyHref } from "@/lib/site-paths";

export function DroneLabSop() {
  const [mode, setMode] = useState<"quick" | "why">("quick");

  return (
    <>
      <div className="sop-mode" aria-label="Drone Lab explanation mode">
        <button type="button" aria-pressed={mode === "quick"} onClick={() => setMode("quick")}>
          <strong>Quick SOP</strong><span>Action, result and stop gate</span>
        </button>
        <button type="button" aria-pressed={mode === "why"} onClick={() => setMode("why")}>
          <strong>Understand why</strong><span>Full scientific reasoning and checks</span>
        </button>
      </div>

      <ol className={`sop-steps mode-${mode}`}>
        {droneSteps.map((step) => (
          <li key={step.number} id={`step-${step.number}`}>
            <div className="sop-step-heading"><span>{step.number}</span><h2>{step.title}</h2></div>
            <div className="sop-fields">
              <section><strong>Action</strong><p>{step.action}</p></section>
              {mode === "why" && <section><strong>Why</strong><p>{step.why}</p></section>}
              <section><strong>Expected result</strong><p>{step.expected}</p></section>
              {mode === "why" && <section><strong>Check</strong><p>{step.check}</p></section>}
              <section className="sop-stop"><strong>Stop if</strong><p>{step.stop}</p></section>
            </div>
          </li>
        ))}
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
