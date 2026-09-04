import type { Metadata } from "next";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { academyHref, academyUrl } from "@/lib/site-paths";

const url = academyUrl("/data/baltic-coastal-meadow-2024/");
export const metadata: Metadata = { title: "Baltic Coastal Meadow 2024 Study Data Guide | Remote Sensing Scientist Academy", description: "Provenance, sampling structure, variables, derived traits and limitations for the 120 western Estonia coastal-meadow quadrats used throughout the Academy.", alternates: { canonical: url } };

const combinations = [
  ["Saardu", "LS", 10], ["Saardu", "TG", 10],
  ["Keemu", "OP", 10], ["Keemu", "US", 10], ["Keemu", "TG", 10],
  ["Koera", "LS", 10], ["Koera", "US", 10], ["Koera", "TG", 10],
  ["Kudani", "OP", 20], ["Kudani", "LS", 10], ["Kudani", "US", 10],
] as const;

const lessons = [
  ["Module 1 · Open the Published Dataset with pandas", "/module-1/open-the-published-dataset-with-pandas/", "Entity hierarchy, provenance, schema and SampleID"],
  ["Module 1 · Missing Values, Types and Data Quality", "/module-1/missing-values-types-and-data-quality/", "Missing traits are not zero"],
  ["Module 1 · Filter, Group and Summarise", "/module-1/filter-group-and-summarise/", "Occurrence, abundance and denominators"],
  ["Module 1 · Join, Reshape and Visualise", "/module-1/join-reshape-and-visualise/", "Species, trait and plot keys"],
  ["Module 2 · Scale, Resolution and Spatial Support", "/module-2/scale-resolution-and-spatial-support/", "1 m² quadrats and raster support"],
  ["Module 2 · Raster–Vector Integration", "/module-2/raster-vector-integration/", "Plot geometry, support and UAV predictors"],
  ["Module 3 · Define the Target and Prediction Unit", "/module-3/define-the-target-and-prediction-unit/", "Field response and modelling unit"],
  ["Module 3 · Spatial, Grouped and Leave-Location-Out Validation", "/module-3/spatial-grouped-and-leave-location-out-validation/", "Site-aware validation"],
  ["Module 3 · Raster Inference at Scale", "/module-3/raster-inference-at-scale/", "From fitted model to prediction surface"],
] as const;

export default function StudyDataGuidePage() {
  return <><JsonLd value={{ "@context": "https://schema.org", "@type": "Dataset", name: "Baltic coastal meadow 2024 study data guide", spatialCoverage: "Western Estonia", temporalCoverage: "2024-07", url }} /><SeoHeader /><main className="study-guide-page" id="main-content"><SeoBreadcrumbs items={[{ label: "Academy", href: academyHref("/") }, { label: "Study Data Guide" }]} /><header className="story-hero"><p className="section-kicker">Study Data Guide</p><h1>Baltic Coastal Meadow 2024</h1><p>This field campaign characterized coastal vegetation and created ecological reference observations for UAV analysis. The Academy uses a public 120-row plot table; this guide explains its evidence hierarchy without exposing non-public source workbooks.</p></header>
  <section className="guide-section"><h2>The field campaign behind the Atlas</h2><p>Botanists sampled Boreal Baltic coastal wetland and meadow vegetation in western Estonia during July 2024. The hierarchy is <strong>site → vegetation community → 1 m² quadrat → species and measurements</strong>. SampleID preserves the plot key used to connect tabular records to reviewed spatial evidence.</p><div className="campaign-strip"><div><strong>4 sites</strong><span>Saardu, Keemu, Koera, Kudani</span></div><div><strong>4 study communities</strong><span>OP, LS, US, TG</span></div><div><strong>120 plots</strong><span>30 per community</span></div><div><strong>1 m² support</strong><span>field observation unit</span></div></div></section>
  <section className="guide-section"><h2>Actual site-community design</h2><p>Only combinations present in the workbook are shown. Most contain 10 plots; Kudani OP contains 20. The source does not justify splitting that 20 into undocumented sub-strata.</p><div className="combination-grid">{combinations.map(([site, code, plots]) => <div key={`${site}-${code}`}><strong>{site}</strong><span>{code} · {plots} plots</span></div>)}</div></section>
  <section className="guide-section"><h2>Observed, derived and modelled variables</h2><div className="guide-three"><article><span>OBSERVED</span><p>Species identity and raw cover; individual CCI and leaf area; vegetation height; above-ground biomass; soil temperature and moisture; bare ground, litter and moss where recorded.</p></article><article><span>DERIVED</span><p>Richness, species medians, species-only relative cover, community-weighted means, vegetation indices and plot-level raster summaries.</p></article><article><span>MODELLED</span><p>Machine-learning trait predictions, continuous prediction surfaces and later model-derived functional-landscape products.</p></article></div></section>
  <section className="guide-section"><h2>CCI and leaf-area aggregation</h2><p>The original trait sampling was not robust enough for direct plot-wise inference under a complete per-plot trait protocol. The documented working method pools measurements by species, retains summaries with at least five measurements, uses species medians, converts cover to species-only relative cover, then calculates plot CWM. The method note reports 87.20% overall pool-wise cover representation for CCI and 81.96% for leaf area; representation varies among plots.</p><p><strong>CWM is an abundance-weighted trait summary, not richness, functional diversity, an individual measurement or a direct sensor observation.</strong></p></section>
  <section className="guide-section"><h2>Missingness and limitations</h2><ul><li>Blank trait or cover values are not measured zeroes.</li><li>Presence records without numeric cover can support occurrence but not cover statistics.</li><li>Trait sample size differs among taxa; the ≥5 rule is only a minimum.</li><li>Plot cover and location have observational uncertainty.</li><li>A 1 m² field plot and a raster pixel do not automatically share spatial support.</li><li>The 120 plots support this study, not a regional inventory or causal habitat claim.</li></ul></section>
  <section className="guide-section"><h2>Follow the data through the Academy</h2><div className="lesson-link-grid">{lessons.map(([label, href, purpose]) => <a href={academyHref(href)} key={href}><strong>{label}</strong><span>{purpose} →</span></a>)}</div><p><a href={academyHref("/species/")}>Explore the Species Atlas →</a> <a href={academyHref("/species/from-field-to-earth-observation/")}>Open the Field-to-EO explainer →</a></p></section>
  <section className="guide-section"><h2>Provenance</h2><p>Public teaching table: <a href="https://zenodo.org/records/20083250">Baltic coastal plant traits 2024 dataset record ↗</a>. Enrichment calculations use the supplied `Records_West_Estonia_2024_dec16_shared.xlsx`; aggregated values were cross-checked against `BasicGraphs_FieldData.xlsx`. Trait interpretation follows `HowTo_species_to_community_level_traits_13Dez.docx`. Taxonomy and image metadata come from FinBIF/Laji.fi and retain retrieval and licence provenance.</p></section></main><SeoFooter /></>;
}
