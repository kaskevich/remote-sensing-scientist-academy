"use client";

import { useState } from "react";
import { FromFieldCallout, WhereThisGoesNext } from "@/app/components/field-evidence-callouts";

const pipeline = [
  ["OBSERVED", "Identify vegetation community", "Place the plot within OP, LS, US or TG without treating those study labels as universal habitat classes."],
  ["OBSERVED", "Establish a 1 m² quadrat", "The quadrat defines the field observation support and the unit linked by SampleID."],
  ["OBSERVED", "Record species and cover", "Identity describes composition; cover records each taxon’s contribution within the plot."],
  ["OBSERVED", "Measure traits and environment", "Individual CCI and leaf area, height, biomass, soil temperature and moisture add functional, structural and environmental evidence."],
  ["DERIVED", "Aggregate to plot variables", "Species medians and species-only relative cover support plot-level community-weighted means."],
  ["DERIVED", "Link plots to UAV predictors", "Reviewed plot geometry and SampleID connect field responses to co-located bands, indices and structural predictors."],
  ["MODELLED", "Train and validate models", "Site-aware validation asks how well predictors generalise without leakage or pixel pseudo-replication."],
  ["MODELLED", "Predict across the landscape", "A fitted model turns aligned raster predictors into a continuous trait or biomass prediction surface."],
  ["INTERPRET", "State limitations", "Predicted traits inherit field, support, alignment and model uncertainty. They do not identify a plant species."],
];

const variables = [
  ["Species identity", "Community", "Taxon recorded by botanists", "Defines composition and links field labels to accepted taxonomy."],
  ["Species cover", "Community", "% cover recorded in the plot", "Separates occurrence from abundance and supplies trait weights."],
  ["Richness", "Community", "Derived count of taxa", "Describes how many taxa occur, not which taxa or their abundance."],
  ["Bare ground, litter, moss", "Community", "% cover categories", "Describe non-vascular or non-species surface components; they are excluded from species-only trait weights."],
  ["Height_median", "Structure", "Median of five above-ground vegetation-height measurements, cm", "Represents plot structure for field comparison and UAV structural modelling."],
  ["AGB", "Productivity", "Above-ground biomass, g; collected in situ, air dried and weighed", "Supplies a biomass/productivity response, distinct from the project’s trait composite."],
  ["CCI_raw", "Trait", "Individual Chlorophyll Content Index reading with CCM200 over 71 mm²", "Contributes to pooled species CCI summaries and plot CCI CWM."],
  ["LA_raw", "Trait", "Individual leaf area measured in ImageJ, cm²", "Contributes to pooled species leaf-area summaries and plot LA CWM."],
  ["Temp_average", "Environment", "Average of three thermoscanner soil-temperature measurements, °C", "Describes measured plot conditions."],
  ["Moisture_average", "Environment", "Average of three WET-sensor soil-moisture measurements, %", "Describes measured plot conditions."],
  ["Elevation", "Environment", "Present in the public analysis table; unit/protocol absent from supplied metadata", "Use only after its measurement contract is verified."],
];

export function FieldToEoExplorer() {
  const [step, setStep] = useState(0);
  const [variable, setVariable] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [mix, setMix] = useState<"a" | "b">("a");
  const current = pipeline[step];
  const currentVariable = variables[variable];
  const cwm = mix === "a" ? 1.15 : 1.65;

  return <>
    <section className="story-section" aria-labelledby="pipeline-title">
      <p className="section-kicker">Field-to-map pipeline</p><h2 id="pipeline-title">Follow the evidence, not just the arrows</h2>
      <div className="pipeline-steps">{pipeline.map((item, index) => <button type="button" aria-pressed={step === index} onClick={() => setStep(index)} key={item[1]}><span>{index + 1}</span><small>{item[0]}</small>{item[1]}</button>)}</div>
      <div className={`pipeline-detail evidence-${current[0].toLowerCase()}`}><span>{current[0]}</span><h3>{current[1]}</h3><p>{current[2]}</p></div>
    </section>

    <section className="story-section" aria-labelledby="quadrat-title">
      <p className="section-kicker">Inside one field observation</p><h2 id="quadrat-title">What we measured in a 1 m² plot</h2>
      <div className="quadrat-explorer"><div className="quadrat-illustration" aria-label="Illustrated one-square-metre vegetation quadrat"><span>1 m</span><i /><i /><i /><i /><b>SampleID</b></div><div className="variable-picker">{variables.map((item, index) => <button type="button" aria-pressed={variable === index} onClick={() => setVariable(index)} key={item[0]}>{item[0]}</button>)}</div><article><span>{currentVariable[1]}</span><h3>{currentVariable[0]}</h3><p><strong>What and how:</strong> {currentVariable[2]}.</p><p><strong>Why and where next:</strong> {currentVariable[3]}</p></article></div>
      <FromFieldCallout>SampleID must stay consistent: it is the key that connects a plot record to reviewed geometry, raster extraction and the eventual model row.</FromFieldCallout>
    </section>

    <section className="story-section" aria-labelledby="cover-title">
      <p className="section-kicker">Composition and abundance</p><h2 id="cover-title">The same species list can describe a different community</h2>
      <div className="community-compare"><CommunityMix title="Plot A" values={[70, 20, 10]} /><CommunityMix title="Plot B" values={[15, 25, 60]} /></div>
      <p>Both examples have richness 3 and the same three taxa. Composition is the same; cover differs. Their community-weighted properties can therefore differ without assuming any predetermined spectral response.</p>
    </section>

    <section className="story-section cwm-lab" aria-labelledby="cwm-title">
      <p className="section-kicker">Interactive method</p><h2 id="cwm-title">Predict the community-weighted mean</h2>
      <p><strong>CWM = Σ(relative species cover × species trait value)</strong></p>
      <div className="cwm-controls"><button type="button" aria-pressed={mix === "a"} onClick={() => { setMix("a"); setPrediction(null); }}>70 / 20 / 10 cover</button><button type="button" aria-pressed={mix === "b"} onClick={() => { setMix("b"); setPrediction(null); }}>15 / 25 / 60 cover</button></div>
      <div className="cwm-species"><span>Taxon 1 · trait 1.0</span><span>Taxon 2 · trait 1.5</span><span>Taxon 3 · trait 2.0</span></div>
      <fieldset><legend>Before revealing the value, predict whether the weighted mean is nearer 1.0 or 2.0.</legend><button type="button" onClick={() => setPrediction("1.0")}>Nearer 1.0</button><button type="button" onClick={() => setPrediction("2.0")}>Nearer 2.0</button></fieldset>
      {prediction && <div className="cwm-result" role="status"><strong>CWM = {cwm.toFixed(2)}</strong><p>Your prediction was {prediction === (cwm < 1.5 ? "1.0" : "2.0") ? "consistent" : "not consistent"} with the weighting. Raw cover can sum to values other than 100; species-only relative cover first removes bare ground, litter and moss, then rescales the included species weights to sum to 1.</p></div>}
      <div className="interpretation-grid"><p><b>Correct:</b> abundance-weighted mean trait represented by measured species under the stated method.</p><p><b>Incorrect:</b> an individual-plant trait, direct satellite measurement, universal habitat property or diversity metric.</p></div>
      <WhereThisGoesNext label="Species cover" steps={["field cover", "composition", "trait weighting", "plot ecological variable"]} />
    </section>

    <section className="story-section" aria-labelledby="decision-title">
      <p className="section-kicker">Scientific decision</p><h2 id="decision-title">Why pool species measurements?</h2>
      <div className="coverage-meters"><Coverage label="CCI" value={87.2} /><Coverage label="Leaf area" value={81.96} /></div>
      <p>The method note reports overall pool-wise representation of 87.20% for CCI and 81.96% for leaf area. It retains species with at least five measurements, uses their medians, and checks the share of species-only cover represented. The 80% criterion is literature-motivated, not a universal law; plot representation still varies.</p>
      <FromFieldCallout>Missing trait is not zero, and one measurement is not evidence equivalent to 58. The ≥5 rule is a minimum inclusion criterion, not a claim of negligible uncertainty.</FromFieldCallout>
    </section>

    <section className="story-section" aria-labelledby="juncus-title">
      <p className="section-kicker">Follow one species</p><h2 id="juncus-title"><i>Juncus gerardi</i> through the pipeline</h2>
      <div className="juncus-chain"><span>Recorded as <i>Juncus gerardii</i></span><span>Cover recorded per quadrat</span><span>124 CCI readings · median 1.00</span><span>58 LA measurements · median 0.4565 cm²</span><span>Species median × relative cover</span><span>Plot CWM response</span><span>UAV predictors + model</span><span>Trait prediction surface</span></div>
      <p>In SALS1, the workbook records 85% raw cover for this taxon and 90% total species cover, or 94.44% species-only relative cover. Its normalized contributions are 0.944 to the CCI CWM and 0.431 cm² to the LA CWM before adding other represented taxa. This does not mean UAV imagery identifies <i>Juncus gerardi</i>.</p>
      <WhereThisGoesNext label="CCI" steps={["leaf CCI", "species median", "plot CWM", "field response", "UAV model", "prediction map"]} />
    </section>

    <section className="story-section" aria-labelledby="sensor-title">
      <p className="section-kicker">Interpretation boundary</p><h2 id="sensor-title">What the ecologist records and what the sensor sees</h2>
      <div className="sensor-split"><article><h3>Field ecologist</h3><p>Species, cover, traits, height, biomass, environment and community.</p></article><article><h3>Sensor</h3><p>Reflected radiation, bands, scale-dependent texture and structure, surface geometry and derived raster products.</p></article></div>
      <p>CCI can inform visible, red-edge and near-infrared interpretation; leaf area relates to vegetation amount and canopy response; height relates to UAV surface structure; AGB may be modelled with spectral and structural predictors. These are conceptual links, not automatic species detection.</p>
      <blockquote>Remote sensing does not replace field observations. Field observations give ecological meaning to the remotely sensed signal and provide reference data for modelling.</blockquote>
    </section>

    <section className="story-section" aria-labelledby="scale-title">
      <p className="section-kicker">Scale and support</p><h2 id="scale-title">One number can describe a leaf, plot, pixel or landscape</h2>
      <div className="scale-chain"><span>leaf<br/><small>CCI_raw / LA_raw</small></span><span>plant</span><span>1 m² quadrat<br/><small>CWM</small></span><span>UAV pixels<br/><small>predictors</small></span><span>satellite pixels</span><span>landscape map<br/><small>model output</small></span></div>
      <p><strong>Key rule:</strong> never compare variables merely because they have numbers. First check whether they describe compatible biological and spatial support.</p>
      <FromFieldCallout>A 1 m² quadrat and a raster pixel differ in footprint, timing and positional uncertainty. Matching their numbers does not make their support equivalent.</FromFieldCallout>
    </section>

    <section className="story-section" aria-labelledby="lineage-title">
      <p className="section-kicker">Data lineage</p><h2 id="lineage-title">Observed, derived and modelled</h2>
      <div className="lineage-flow"><span className="observed">CCI_raw / LA_raw</span><b>→</b><span className="derived">species QA ≥5</span><b>→</b><span className="derived">species medians</span><b>+</b><span className="observed">species cover</span><b>→</b><span className="derived">relative cover</span><b>→</b><span className="derived">plot CWM</span><b>→</b><span className="derived">modelling table + UAV predictors</span><b>→</b><span className="modelled">fitted model</span><b>→</b><span className="modelled">prediction raster</span></div>
      <p>Species cover also supports composition and richness. Richness, CWM and functional diversity answer different ecological questions. AGB describes biomass/productivity and is not one of the traits in the project’s composite functional-diversity metric.</p>
    </section>
  </>;
}

function CommunityMix({ title, values }: { title: string; values: number[] }) {
  return <article><h3>{title} · richness 3</h3><div className="cover-stack">{values.map((value, index) => <i key={index} style={{ width: `${value}%` }}>{value}%</i>)}</div><p>Taxon 1 · Taxon 2 · Taxon 3</p></article>;
}

function Coverage({ label, value }: { label: string; value: number }) {
  return <article><strong>{label} · {value.toFixed(2)}%</strong><div><i style={{ width: `${value}%` }} /><b style={{ left: "80%" }}>80% criterion</b></div></article>;
}
