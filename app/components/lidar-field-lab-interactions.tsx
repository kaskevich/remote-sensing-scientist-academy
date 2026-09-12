"use client";

import { useMemo, useState } from "react";
import { lidarProfilePoints } from "@/lib/lidar-field-lab";

export function LidarHeightLab() {
  const [surface, setSurface] = useState(4.8);
  const [terrain, setTerrain] = useState(1.7);
  const height = surface - terrain;
  return <section className="lidar-height-lab" aria-labelledby="lidar-height-title"><div><p className="section-kicker">Surface arithmetic</p><h2 id="lidar-height-title">Elevation is not height above ground</h2><p>DSM and DTM are modelled surfaces. Their difference can estimate canopy or object height only where both surfaces are defensible and aligned.</p></div><div className="lidar-height-controls"><label>Surface estimate · DSM <strong>{surface.toFixed(1)} m</strong><input aria-label="Surface estimate" type="range" min="1" max="12" step="0.1" value={surface} onChange={(event) => setSurface(Number(event.target.value))} /></label><label>Terrain estimate · DTM <strong>{terrain.toFixed(1)} m</strong><input aria-label="Terrain estimate" type="range" min="0" max="5" step="0.1" value={terrain} onChange={(event) => setTerrain(Number(event.target.value))} /></label><div><span>CHM = DSM − DTM</span><strong>{height.toFixed(1)} m</strong></div>{height < 0 && <p role="alert">A negative result is a QA signal: inspect alignment, interpolation, water/void handling and classification.</p>}</div></section>;
}

export function LidarProfileLab() {
  const [includeOutlier, setIncludeOutlier] = useState(true);
  const accepted = useMemo(() => lidarProfilePoints.filter((point) => includeOutlier || point.valid), [includeOutlier]);
  const max = Math.max(...accepted.map((point) => point.height));
  return <section className="lidar-profile-lab" aria-labelledby="lidar-profile-title"><header><p className="section-kicker">Point-profile audit · synthetic SAL06</p><h2 id="lidar-profile-title">One unreviewed return can become the canopy</h2><p>The profile comes from the Academy’s synthetic point table. Toggle the unclassified high return and watch the maximum-height metric change.</p></header><div className="lidar-profile-stage"><div className="lidar-profile-chart" role="img" aria-label={`Vertical point profile with maximum accepted height ${max.toFixed(2)} metres`}>{lidarProfilePoints.map((point) => <div className={`lidar-point ${point.classification} ${!point.valid && !includeOutlier ? "excluded" : ""}`} style={{ bottom: `${10 + point.height / 10.56 * 82}%` }} key={point.id}><span>{point.id}</span><i /></div>)}<b className="lidar-ground-line">ground model · 1.84 m elevation</b></div><aside><button type="button" aria-pressed={!includeOutlier} onClick={() => setIncludeOutlier((value) => !value)}>{includeOutlier ? "Flag P017 as an outlier" : "Restore P017 for comparison"}</button><dl><div><dt>Maximum height</dt><dd>{max.toFixed(2)} m</dd></div><div><dt>Accepted points</dt><dd>{accepted.length} / {lidarProfilePoints.length}</dd></div></dl><p>{includeOutlier ? "The unclassified 10.56 m return dominates the maximum. Its intensity and height do not prove that it is canopy." : "After the review flag, the largest retained normalized height is 0.71 m. The source point remains traceable rather than deleted."}</p></aside></div><div className="lidar-point-table">{lidarProfilePoints.map((point) => <article key={point.id}><span>{point.id}</span><strong>{point.classification}</strong><small>return {point.returnText}</small><b>{point.height.toFixed(2)} m above ground</b></article>)}</div><aside className="lidar-boundary"><strong>Return number ≠ classification</strong><p>“First”, “intermediate” and “last” describe the sequence of detected returns from a pulse. Ground, vegetation, building and noise are interpreted classes that require classification and QA.</p></aside></section>;
}

const metricCases = [
  { metric: "Maximum height", strength: "Easy to interpret", risk: "Highly sensitive to one high outlier" },
  { metric: "95th percentile", strength: "Represents upper structure", risk: "Needs enough representative returns" },
  { metric: "Cover above 0.5 m", strength: "Describes return fraction", risk: "Depends on denominator, threshold and occlusion" },
  { metric: "Height variability", strength: "Describes vertical heterogeneity", risk: "Changes with density and support" },
] as const;

export function LidarMetricChooser() {
  const [selected, setSelected] = useState<(typeof metricCases)[number] | null>(null);
  return <section className="lidar-metric-lab" aria-labelledby="lidar-metric-title"><header><p className="section-kicker">Metric design</p><h2 id="lidar-metric-title">Choose a summary only after choosing support</h2><p>Select a metric to expose both its useful interpretation and its evidence burden.</p></header><div>{metricCases.map((item) => <button type="button" aria-pressed={selected?.metric === item.metric} className={selected?.metric === item.metric ? "is-selected" : undefined} key={item.metric} onClick={() => setSelected(item)}>{item.metric}</button>)}</div><aside aria-live="polite">{selected ? <><strong>{selected.strength}</strong><p>{selected.risk}. Record cell or plot size, minimum point count, included classes and treatment of empty cells.</p></> : <p>Predict which metric is most sensitive to an isolated high return, then select it.</p>}</aside></section>;
}
