"use client";

import { useState } from "react";
import { sequoiaBands, vegetationIndices } from "@/lib/uav-field-lab";

export function UavBandExplorer() {
  const [band, setBand] = useState<(typeof sequoiaBands)[number]>(sequoiaBands[0]);
  const [index, setIndex] = useState<(typeof vegetationIndices)[number]>(vegetationIndices[0]);

  return (
    <div className="uav-explorer">
      <div className="uav-spectrum" role="img" aria-label="Electromagnetic spectrum from visible light through red edge and near infrared to thermal infrared">
        <span className="visible">VISIBLE</span><span className="edge">RED EDGE</span><span className="near">NIR</span><span className="thermal">THERMAL INFRARED</span>
        {sequoiaBands.map((item) => <i className={item.className} key={item.name}>{item.name}</i>)}
        <b>Duet T thermal</b>
      </div>
      <div className="uav-explorer-grid">
        <section>
          <p className="section-kicker">Band explorer</p>
          <div className="uav-picker" role="group" aria-label="Choose a Sequoia band">
            {sequoiaBands.map((item) => (
              <button type="button" aria-pressed={band.name === item.name} onClick={() => setBand(item)} key={item.name}>{item.name}</button>
            ))}
          </div>
          <article className={`uav-band-card ${band.className}`}>
            <span>{band.centre} centre · {band.bandwidth} bandwidth</span>
            <h3>{band.name}</h3>
            <p>{band.meaning}</p>
          </article>
        </section>
        <section>
          <p className="section-kicker">Project index</p>
          <label className="uav-select-label" htmlFor="index-select">Choose one of the eight verified project formulas</label>
          <select id="index-select" value={index.id} onChange={(event) => setIndex(vegetationIndices.find((item) => item.id === event.target.value) ?? vegetationIndices[0])}>
            {vegetationIndices.map((item) => <option value={item.id} key={item.id}>{item.id} · {item.name}</option>)}
          </select>
          <article className="uav-index-card">
            <h3>{index.id}</h3>
            <code>{index.formula}</code>
            <p><strong>Why these bands:</strong> {index.why}.</p>
            <p><strong>Project role:</strong> {index.use}.</p>
            <p><strong>Boundary:</strong> {index.limits}</p>
          </article>
        </section>
      </div>
    </div>
  );
}

