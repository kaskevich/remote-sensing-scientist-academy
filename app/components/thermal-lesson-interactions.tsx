"use client";

import { useMemo, useState } from "react";

export function ThermalSignalLab() {
  const [temperatureC, setTemperatureC] = useState(25);
  const [emissivity, setEmissivity] = useState(0.95);
  const emitted = useMemo(() => emissivity * Math.pow((temperatureC + 273.15) / 300, 4), [temperatureC, emissivity]);
  const reflected = (1 - emissivity) * 0.82;
  const total = emitted + reflected;

  return <section className="thermal-signal-lab" aria-labelledby="thermal-signal-title">
    <div>
      <p className="section-kicker">Interactive radiance reasoning</p>
      <h2 id="thermal-signal-title">Temperature is not the only control on the signal leaving a surface</h2>
      <p>Adjust temperature and emissivity. The bars are a <strong>dimensionless teaching proxy</strong>, not a sensor calibration or land-surface-temperature retrieval.</p>
      <label htmlFor="surface-temperature">Surface temperature <strong>{temperatureC} °C</strong></label>
      <input id="surface-temperature" type="range" min="0" max="55" value={temperatureC} onChange={(event) => setTemperatureC(Number(event.target.value))} />
      <label htmlFor="surface-emissivity">Emissivity <strong>{emissivity.toFixed(2)}</strong></label>
      <input id="surface-emissivity" type="range" min="75" max="99" value={Math.round(emissivity * 100)} onChange={(event) => setEmissivity(Number(event.target.value) / 100)} />
    </div>
    <div className="thermal-signal-bars" role="img" aria-label={`Teaching proxy with emitted contribution ${emitted.toFixed(2)}, reflected downwelling contribution ${reflected.toFixed(2)}, and total ${total.toFixed(2)}`}>
      <article><span style={{ height: `${Math.min(100, emitted / 1.2 * 100)}%` }} /><b>εB(T)</b><small>emitted contribution</small></article>
      <article><span style={{ height: `${Math.min(100, reflected / .22 * 100)}%` }} /><b>(1−ε)L↓</b><small>reflected downwelling</small></article>
      <article><span style={{ height: `${Math.min(100, total / 1.2 * 100)}%` }} /><b>leaving signal</b><small>before atmosphere</small></article>
    </div>
    <aside><b>What the full sensor receives also includes atmospheric transmission and path radiance.</b> A surface-temperature algorithm must separate these effects under stated assumptions.</aside>
  </section>;
}

export function LandsatScaleLab() {
  const [dn, setDn] = useState(44947);
  const kelvin = dn * 0.00341802 + 149;
  const celsius = kelvin - 273.15;
  return <section className="thermal-scale-lab" aria-labelledby="thermal-scale-title">
    <div>
      <p className="section-kicker">Product-specific decoding</p>
      <h2 id="thermal-scale-title">A stored integer is not yet a temperature</h2>
      <p>For the USGS Landsat Collection 2 Level-2 surface-temperature band, use the documented scale and offset below. Do not copy this conversion to another product or collection.</p>
      <code>ST (K) = DN × 0.00341802 + 149.0</code>
    </div>
    <div>
      <label htmlFor="landsat-dn">Stored pixel value <strong>{dn.toLocaleString("en-US")}</strong></label>
      <input id="landsat-dn" type="range" min="20000" max="60000" step="1" value={dn} onChange={(event) => setDn(Number(event.target.value))} />
      <dl><div><dt>Kelvin</dt><dd>{kelvin.toFixed(1)} K</dd></div><div><dt>Celsius</dt><dd>{celsius.toFixed(1)} °C</dd></div></dl>
      <p>The default DN 44,947 reproduces the USGS example: 302.6 K, or 29.5 °C after Kelvin-to-Celsius conversion.</p>
    </div>
  </section>;
}

const thermalClaims = [
  { id: "observed", label: "The valid surface-temperature product is 4 °C warmer here at this acquisition time.", note: "Supported at the product's stated support, after scale, QA and uncertainty checks. The cause still requires evidence.", good: true },
  { id: "stress", label: "The vegetation is water-stressed because this pixel is warm.", note: "Not supported from temperature alone. Radiation, wind, surface mixture, moisture, phenology and timing can contribute; a stress claim needs a validated model and reference evidence.", good: false },
  { id: "air", label: "This pixel is the air temperature people experienced.", note: "Incorrect. Land-surface temperature describes the radiating surface, not standard meteorological near-surface air temperature.", good: false },
] as const;

export function ThermalClaimCheck() {
  const [choice, setChoice] = useState<(typeof thermalClaims)[number] | null>(null);
  return <section className="thermal-claim-check" aria-labelledby="thermal-claim-title"><header><p className="section-kicker">Prediction before reveal</p><h2 id="thermal-claim-title">Which statement stays inside the evidence?</h2></header><div>{thermalClaims.map((claim) => <button type="button" key={claim.id} aria-pressed={choice?.id === claim.id} onClick={() => setChoice(claim)}>{claim.label}</button>)}</div><aside className={choice?.good ? "correct" : undefined} aria-live="polite">{choice ? choice.note : "Choose the strongest statement the thermal product can support by itself."}</aside></section>;
}
