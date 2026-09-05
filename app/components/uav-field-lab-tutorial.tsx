"use client";

import { useEffect, useState } from "react";
import { academyHref } from "@/lib/site-paths";
import { droneLabPath, uavTutorialPhases, uavTutorialSteps } from "@/lib/uav-field-lab";

function stepHref(number: string) { return `#tutorial-step-${number}`; }

export function UavFieldLabTutorial() {
  const [activeNumber, setActiveNumber] = useState("01");
  const [openNumber, setOpenNumber] = useState<string | null>("01");
  const activeIndex = Math.max(0, uavTutorialSteps.findIndex((step) => step.number === activeNumber));
  const activeStep = uavTutorialSteps[activeIndex];
  const previous = uavTutorialSteps[activeIndex - 1];
  const next = uavTutorialSteps[activeIndex + 1];

  useEffect(() => {
    function openFromHash() {
      const match = window.location.hash.match(/^#tutorial-step-(\d{2})$/);
      if (match && uavTutorialSteps.some((step) => step.number === match[1])) {
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

  function chooseStep(number: string, updateHistory = true) {
    setActiveNumber(number);
    setOpenNumber(number);
    const hash = stepHref(number);
    if (updateHistory && window.location.hash !== hash) window.history.pushState(null, "", hash);
    window.requestAnimationFrame(() => document.getElementById(`tutorial-step-${number}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <section className="uav-tutorial" aria-labelledby="operational-tutorial-title">
      <header className="uav-tutorial-intro">
        <p className="section-kicker">Begin here · complete operational sequence</p>
        <h2 id="operational-tutorial-title">Plan, fly, process and hand off one defensible mission</h2>
        <p>Open one step at a time. Every step names the action, workspace, evidence entering and leaving, stop condition and next decision.</p>
      </header>

      <nav className="uav-step-navigator" aria-label="Field Lab 07 tutorial navigation">
        <div className="uav-step-progress" aria-label={`Step ${activeStep.number} of ${uavTutorialSteps.length}`}><span style={{ width: `${((activeIndex + 1) / uavTutorialSteps.length) * 100}%` }} /></div>
        <div className="uav-step-mobile-control">
          <label htmlFor="uav-tutorial-step">Current step</label>
          <select id="uav-tutorial-step" value={activeNumber} onChange={(event) => chooseStep(event.target.value)}>{uavTutorialSteps.map((step) => <option value={step.number} key={step.number}>{step.number} · {step.title}</option>)}</select>
        </div>
        <div className="uav-phase-links">
          {uavTutorialPhases.map((phase) => {
            const first = uavTutorialSteps.find((step) => step.phase === phase.id);
            return <a className={activeStep.phase === phase.id ? "active" : ""} href={first ? stepHref(first.number) : "#operational-tutorial-title"} onClick={(event) => { if (first) { event.preventDefault(); chooseStep(first.number); } }} key={phase.id}><strong>{phase.label}</strong><span>{phase.range}</span></a>;
          })}
        </div>
        <div className="uav-step-arrows">
          {previous ? <a href={stepHref(previous.number)} onClick={(event) => { event.preventDefault(); chooseStep(previous.number); }} aria-label={`Previous step: ${previous.title}`}>← Previous</a> : <span />}
          <strong>{activeStep.number} / {uavTutorialSteps.length}</strong>
          {next ? <a href={stepHref(next.number)} onClick={(event) => { event.preventDefault(); chooseStep(next.number); }} aria-label={`Next step: ${next.title}`}>Next →</a> : <span />}
        </div>
      </nav>

      <ol className="uav-operational-timeline">
        {uavTutorialSteps.map((step, index) => {
          const isOpen = openNumber === step.number;
          return (
            <li className={`uav-operational-step phase-${step.phase.toLowerCase()}${isOpen ? " is-open" : ""}`} id={`tutorial-step-${step.number}`} key={step.number}>
              <button className="uav-step-toggle" type="button" aria-expanded={isOpen} aria-controls={`tutorial-panel-${step.number}`} onClick={() => isOpen ? setOpenNumber(null) : chooseStep(step.number)}>
                <span className="uav-step-identity"><b>STEP {step.number}</b><small>{step.phase}</small></span>
                <span className="uav-step-title">{step.title}</span>
                <span className="uav-step-open-label" aria-hidden="true">{isOpen ? "Close" : "Open details"}<i>{isOpen ? "↑" : "↓"}</i></span>
              </button>

              {isOpen && <div className="uav-step-panel" id={`tutorial-panel-${step.number}`}>
                <div className="uav-step-what"><strong>WHAT</strong><p>{step.what}</p></div>
                <div className="uav-step-mini-flow" role="img" aria-label={`${step.title}: input, action and output`}><span><small>INPUT</small>{step.input[0]}</span><b>→</b><span><small>DO</small>{step.action[0]}</span><b>→</b><span><small>OUTPUT</small>{step.output[0]}</span></div>
                <div className="uav-step-primary-grid">
                  <section><strong>ACTION</strong><ol>{step.action.map((item) => <li key={item}>{item}</li>)}</ol></section>
                  <section><strong>WHERE</strong><p>{step.where}</p><strong>WHY</strong><p>{step.why}</p></section>
                </div>
                <div className="uav-step-io-grid">
                  <section><strong>INPUT</strong><ul>{step.input.map((item) => <li key={item}>{item}</li>)}</ul></section>
                  <section><strong>OUTPUT</strong><ul>{step.output.map((item) => <li key={item}>{item}</li>)}</ul></section>
                  <section><strong>CHECK</strong><ul>{step.check.map((item) => <li key={item}>{item}</li>)}</ul></section>
                </div>
                <div className="uav-step-failure"><strong>IF THIS FAILS</strong><p>{step.failure}</p></div>
                <footer>
                  <div><strong>NEXT</strong><p>{step.next}</p></div>
                  {step.reference && <a href={`#${step.reference}`}>Open the supporting science ↓</a>}
                  {step.number === "05" && <a href={academyHref(droneLabPath)}>Open the detailed post-flight Drone Lab →</a>}
                  {index < uavTutorialSteps.length - 1 && <a href={stepHref(uavTutorialSteps[index + 1].number)} onClick={(event) => { event.preventDefault(); chooseStep(uavTutorialSteps[index + 1].number); }}>Continue to Step {uavTutorialSteps[index + 1].number} →</a>}
                </footer>
              </div>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
