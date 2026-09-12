"use client";

import { useMemo, useState } from "react";
import { sarComparabilityRows, sarThresholdCases } from "@/lib/sar-field-lab";

const decisions = ["accept", "review", "reject"] as const;

export function SarComparabilityLab() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const answered = Object.keys(answers).length;
  const score = useMemo(() => sarComparabilityRows.filter((row) => answers[row.id] === row.decision).length, [answers]);

  return (
    <section className="sar-practical" aria-labelledby="sar-comparability-title">
      <header>
        <p className="section-kicker">Decision lab · synthetic training records</p>
        <h2 id="sar-comparability-title">Would you compare this observation?</h2>
        <p>Classify each row before revealing the audit. “Review” means the row needs evidence or a different design—not that it is automatically unusable.</p>
      </header>
      <div className="sar-decision-grid">
        {sarComparabilityRows.map((row) => (
          <article key={row.id}>
            <div className="sar-record-head"><strong>{row.id}</strong><span>{row.date}</span></div>
            <dl><div><dt>Geometry</dt><dd>{row.orbit}</dd></div><div><dt>Incidence</dt><dd>{row.angle}</dd></div><div><dt>VV / VH</dt><dd>{row.vv} / {row.vh} dB</dd></div></dl>
            <fieldset><legend>Your gate</legend><div>{decisions.map((decision) => <label key={decision} className={answers[row.id] === decision ? "is-selected" : undefined}><input type="radio" name={`decision-${row.id}`} value={decision} checked={answers[row.id] === decision} onChange={() => { setAnswers((current) => ({ ...current, [row.id]: decision })); setChecked(false); }} />{decision}</label>)}</div></fieldset>
            {checked && <p className={answers[row.id] === row.decision ? "sar-feedback correct" : "sar-feedback"}><b>{row.decision.toUpperCase()}</b> · {row.reason}</p>}
          </article>
        ))}
      </div>
      <div className="sar-practical-actions"><button type="button" disabled={answered !== sarComparabilityRows.length} onClick={() => setChecked(true)}>Check all five decisions</button><span>{checked ? `${score} / ${sarComparabilityRows.length} aligned with the QA record` : `${answered} / ${sarComparabilityRows.length} decided`}</span></div>
      <aside><strong>Training-data boundary</strong><p>These compact records are synthetic and are designed to expose metadata and QA decisions. They are not Sentinel-1 measurements from the Estonian field campaign.</p></aside>
    </section>
  );
}

export function SarScaleLab() {
  const [power, setPower] = useState(0.03);
  const db = 10 * Math.log10(power);
  return (
    <section className="sar-scale-lab" aria-labelledby="sar-scale-title">
      <div><p className="section-kicker">Measurement scale</p><h2 id="sar-scale-title">Linear power and decibels are two representations</h2><p>Move the same positive linear backscatter value through the logarithmic conversion. The physical evidence has not changed; its numerical representation has.</p></div>
      <div className="sar-scale-control"><label htmlFor="sar-power">Linear power <strong>{power.toFixed(3)}</strong></label><input id="sar-power" type="range" min="0.001" max="1" step="0.001" value={power} onChange={(event) => setPower(Number(event.target.value))} /><div><span>10 × log<sub>10</sub>({power.toFixed(3)})</span><strong>{db.toFixed(2)} dB</strong></div><p>Average in linear space when the method calls for mean power. A mean of dB values is a different statistic.</p></div>
    </section>
  );
}

export function SarThresholdLab() {
  const [selected, setSelected] = useState<(typeof sarThresholdCases)[number] | null>(null);
  return (
    <section className="sar-threshold-lab" aria-labelledby="sar-threshold-title">
      <header><p className="section-kicker">Interpretation boundary</p><h2 id="sar-threshold-title">Dark at the event date is not enough</h2><p>Select a sample to see why chronology, context and geometry must accompany a threshold.</p></header>
      <div className="sar-threshold-grid">{sarThresholdCases.map((item) => <button type="button" key={item.id} className={selected?.id === item.id ? "is-selected" : undefined} aria-pressed={selected?.id === item.id} onClick={() => setSelected(item)}><span>{item.id}</span><strong>{item.context}</strong><small>reference {item.reference} dB → event {item.event} dB</small></button>)}</div>
      <div className="sar-threshold-result" aria-live="polite">{selected ? <><span>{selected.expected}</span><p>{selected.explanation}</p></> : <p>Choose A–D. Predict whether it is a candidate, exclusion or review case before reading the explanation.</p>}</div>
    </section>
  );
}
