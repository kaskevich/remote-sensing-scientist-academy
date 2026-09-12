"use client";

import { useMemo, useState } from "react";
import { hyperspectralSignatures } from "@/lib/hyperspectral-field-lab";

type Signature = "dry" | "moist" | "water";
const labels: Record<Signature, string> = { dry: "Illustrative dry meadow", moist: "Illustrative moist meadow", water: "Illustrative open water" };
function pointsFor(key: Signature, maskBad: boolean) {
  return hyperspectralSignatures.map((row) => {
    const x = 48 + (row.wavelength - 450) / (2400 - 450) * 704;
    const y = 270 - row[key] / .5 * 230;
    return row.bad && maskBad ? null : `${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

export function SpectralExplorer() {
  const [selected, setSelected] = useState<Signature>("dry");
  const [maskBad, setMaskBad] = useState(false);
  const segments = useMemo(() => {
    const points = pointsFor(selected, maskBad); const result: string[] = []; let current: string[] = [];
    for (const point of points) { if (point) current.push(point); else if (current.length) { result.push(current.join(" ")); current = []; } }
    if (current.length) result.push(current.join(" ")); return result;
  }, [selected, maskBad]);
  return <section className="hyper-explorer" aria-labelledby="hyper-explorer-title"><header><p className="section-kicker">Interactive spectrum · synthetic training data</p><h2 id="hyper-explorer-title">A spectrum is a measured sequence with gaps and uncertainty</h2><p>Switch the illustrative target and then mask the flagged low-quality bands. The gap is honest: interpolation would be a separate modelling decision.</p></header><div className="hyper-explorer-controls"><div role="group" aria-label="Select spectrum">{(Object.keys(labels) as Signature[]).map((key) => <button type="button" key={key} aria-pressed={selected === key} onClick={() => setSelected(key)}>{labels[key]}</button>)}</div><label><input type="checkbox" checked={maskBad} onChange={(event) => setMaskBad(event.target.checked)} />Mask flagged bands</label></div><div className="hyper-chart"><svg viewBox="0 0 800 320" role="img" aria-label={`${labels[selected]} reflectance spectrum from 450 to 2400 nanometres`}><title>{`${labels[selected]} reflectance spectrum`}</title><path d="M48 30V270H770" className="axes" /><text x="12" y="42">0.5</text><text x="18" y="274">0</text><text x="42" y="296">450</text><text x="730" y="296">2400 nm</text>{hyperspectralSignatures.filter((row) => row.bad).map((row) => { const x = 48 + (row.wavelength - 450) / 1950 * 704; return <rect key={row.wavelength} x={x - 7} y="30" width="14" height="240" className="bad-band" />; })}{segments.map((points, index) => <polyline key={index} points={points} className="spectral-line" />)}{hyperspectralSignatures.map((row) => { const x = 48 + (row.wavelength - 450) / 1950 * 704; const y = 270 - row[selected] / .5 * 230; return <circle key={row.wavelength} cx={x} cy={y} r="4" className={row.bad ? "flagged" : "valid"} />; })}</svg><div><span><i className="valid" />valid teaching band</span><span><i className="flagged" />flagged low-quality band</span></div></div><aside><strong>{maskBad ? "16 bands retained · 4 excluded" : "20 bands displayed · 4 require review"}</strong><p>In an operational cube, use its sensor/product metadata and QA—not these instructional wavelengths—as the authority for exclusion.</p></aside></section>;
}

export function SpectralMixer() {
  const [dryShare, setDryShare] = useState(60);
  const mixed = hyperspectralSignatures.map((row) => row.dry * dryShare / 100 + row.water * (100 - dryShare) / 100);
  const points = mixed.map((value, index) => { const row = hyperspectralSignatures[index]; return `${48 + (row.wavelength - 450) / 1950 * 704},${270 - value / .5 * 230}`; }).join(" ");
  return <section className="hyper-mixer" aria-labelledby="hyper-mixer-title"><div><p className="section-kicker">Spatial support</p><h2 id="hyper-mixer-title">One pixel can mix more than one material</h2><p>Change the illustrative areal mixture. A smooth intermediate curve is not a new pure material and does not prove either class occupies the whole pixel.</p><label htmlFor="dry-share">Dry-meadow fraction <strong>{dryShare}%</strong></label><input id="dry-share" type="range" min="0" max="100" value={dryShare} onChange={(event) => setDryShare(Number(event.target.value))} /><p><b>{100 - dryShare}%</b> illustrative open water</p></div><svg viewBox="0 0 800 320" role="img" aria-label={`Synthetic mixed spectrum with ${dryShare} percent dry meadow`}><path d="M48 30V270H770" className="axes" /><polyline points={points} className="mixed-line" /><text x="48" y="296">450 nm</text><text x="700" y="296">2400 nm</text></svg></section>;
}

const orders = [
  { id: "safe", label: "Spatial split → fit preprocessing on training folds → transform validation → evaluate", good: true, note: "Correct. The validation spectra do not inform scaling, PCA or feature selection." },
  { id: "leak", label: "Fit PCA on all pixels → random pixel split → evaluate", good: false, note: "Leakage. The full cube influences the feature space, and adjacent pixels can appear on both sides of the split." },
  { id: "map", label: "Choose the prettiest feature map → tune labels → report the same pixels", good: false, note: "Circular evaluation. Visual selection and label tuning used the evidence later called validation." },
] as const;
export function HyperspectralLeakageLab() { const [choice, setChoice] = useState<(typeof orders)[number] | null>(null); return <section className="hyper-leakage" aria-labelledby="hyper-leakage-title"><header><p className="section-kicker">Prediction before reveal</p><h2 id="hyper-leakage-title">Which order protects the test evidence?</h2></header><div>{orders.map((item) => <button type="button" key={item.id} aria-pressed={choice?.id === item.id} onClick={() => setChoice(item)}>{item.label}</button>)}</div><aside className={choice?.good ? "correct" : undefined} aria-live="polite">{choice ? choice.note : "Choose one processing order. High dimensionality makes leakage especially easy to hide."}</aside></section>; }
