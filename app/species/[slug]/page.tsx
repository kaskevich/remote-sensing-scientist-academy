import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BotanicalPlaceholder } from "@/app/components/species-card";
import { CoastalHabitatTransect } from "@/app/components/coastal-habitat-transect";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyAssetHref, academyAssetUrl, academyHref, academyUrl } from "@/lib/site-paths";
import { getSpecies, habitatDefinitions, relevantLessonLinks, speciesRecords, type TraitSummary, verifiedHabitats } from "@/lib/species-atlas";

export const dynamicParams = false;

export function generateStaticParams() {
  return speciesRecords.map((species) => ({ slug: species.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const species = getSpecies(slug);
  if (!species) return {};
  const url = academyUrl(`/species/${species.slug}/`);
  const description = `Review the verified FinBIF identity, source-labelled evidence, image attribution and coastal-meadow study status for ${species.scientificName}.`;
  const image = species.images[0];
  return {
    title: `${species.scientificName} — Coastal Meadow Species Atlas | Remote Sensing Scientist Academy`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${species.scientificName} — Coastal Meadow Species Atlas`,
      description,
      type: "article",
      url,
      images: image ? [{ url: academyAssetUrl(image.file), alt: image.alt }] : undefined,
    },
  };
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const species = getSpecies(slug);
  if (!species) notFound();
  const image = species.images[0];
  const habitats = verifiedHabitats(species);
  const url = academyUrl(`/species/${species.slug}/`);
  const sameGenus = speciesRecords.filter((candidate) => candidate.genus === species.genus && candidate.slug !== species.slug);
  const sameFamily = species.family
    ? speciesRecords.filter((candidate) => candidate.family === species.family && candidate.slug !== species.slug && candidate.genus !== species.genus)
    : [];
  const related = [...sameGenus, ...sameFamily].slice(0, 4);

  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: `${species.scientificName} — Coastal Meadow Species Atlas`,
          description: `A source-traceable Academy record for ${species.scientificName}, with FinBIF taxonomy, image attribution, field-evidence status and remote-sensing context.`,
          url,
          learningResourceType: "Species reference",
          creator: creatorReference(),
          citation: species.sourceUrl,
          image: image ? academyAssetUrl(image.file) : undefined,
          isPartOf: { "@type": "CollectionPage", name: "Boreal Baltic Coastal Meadow Species Atlas", url: academyUrl("/species/") },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Species Atlas", item: academyUrl("/species/") },
            { "@type": "ListItem", position: 3, name: species.scientificName, item: url },
          ],
        },
      ]} />
      <SeoHeader current="species" />
      <main className="species-detail-page" id="main-content">
        <SeoBreadcrumbs items={[
          { label: "Academy", href: academyHref("/") },
          { label: "Species Atlas", href: academyHref("/species/") },
          { label: species.scientificName },
        ]} />

        <header className="species-detail-hero">
          <figure>
            {image ? <Image src={academyAssetHref(image.file)} alt={image.alt} width={1200} height={900} priority unoptimized /> : <BotanicalPlaceholder />}
            {image && <figcaption>{image.attributionText}. <a href={image.licenseUrl} target="_blank" rel="license noopener noreferrer">Licence ↗</a></figcaption>}
          </figure>
          <div>
            <p className="section-kicker">FinBIF accepted taxon · {species.taxonId}</p>
            <h1><i>{species.scientificName}</i>{species.scientificNameAuthorship && <small className="species-authorship"> {species.scientificNameAuthorship}</small>}</h1>
            <dl className="species-identity-list">
              <div><dt>Family</dt><dd>{species.family ?? "Not extractable from the supplied PDF"}</dd></div>
              <div><dt>Genus</dt><dd><i>{species.genus}</i></dd></div>
              <div><dt>Common names</dt><dd>{Object.entries(species.commonNames).length ? Object.entries(species.commonNames).map(([language, name]) => `${language.toUpperCase()}: ${name}`).join(" · ") : "None returned by FinBIF"}</dd></div>
              {species.studyEvidence.studyNames.length > 0 && <div><dt>2024 dataset</dt><dd>Recorded as {species.studyEvidence.studyNames.map((name) => name.replaceAll("_", " ")).join(", ")}</dd></div>}
            </dl>
            <a className="species-source-button" href={species.sourceUrl} target="_blank" rel="noopener noreferrer">Open verified FinBIF record ↗</a>
          </div>
        </header>

        <section className="species-detail-section" aria-labelledby="coastal-position-title">
          <p className="section-kicker">Coastal-meadow position</p>
          <h2 id="coastal-position-title">Our 2024 field observations</h2>
          <CoastalHabitatTransect highlighted={habitats} evidence={species.habitats} />
          <p className="transect-disclaimer">Occurrence uses the 30 sampled plots in each community. Community boundaries are not rigid; these are study observations, not a complete Estonian distribution.</p>
          <div className="species-evidence-split">
            <article><span>INDEPENDENT BOTANICAL EVIDENCE</span><h3>General ecology</h3><p>{species.ecology ?? "FinBIF description payloads are retained in the maintenance cache, but no English ecological narrative was returned for automatic publication. No ecological affinity or specialization has been inferred from our study communities."}</p></article>
            <article><span>OUR FIELD EVIDENCE</span><h3>Occurrence in our 2024 coastal-meadow study</h3><p>{species.studyEvidence.studyNames.length ? `Recorded in ${species.studyEvidence.occupiedPlotCount} of ${species.studyEvidence.totalPlotCount} sampled plots.` : "No study label was safely reconciled to this accepted taxon."}</p><ul>{Object.values(habitatDefinitions).map((habitat) => { const value = species.habitats[habitat.code]; const cover = value.coverAmongOccupiedPlots; return <li className="habitat-evidence-row" key={habitat.code}><a href={academyHref(`/species/habitats/${habitat.slug}/`)}>{habitat.code} · {habitat.name}</a><strong>{value.occupiedPlots} / {value.totalPlots} · {Math.round(value.occurrenceFrequency * 100)}%</strong>{cover.n > 0 && <small>Cover among {cover.n} plots: median {cover.median}% · IQR {cover.q1}–{cover.q3}%</small>}</li>; })}</ul></article>
          </div>
          <div className="species-site-grid" aria-label="Site occurrence in the 2024 study">{Object.entries(species.studyEvidence.siteEvidence).map(([site, value]) => <div key={site}><strong>{site}</strong><span>{value.occupiedPlots} / {value.totalPlots} plots</span></div>)}</div>
        </section>

        <section className="species-detail-section species-taxonomy-grid" aria-labelledby="taxonomy-title">
          <div>
            <p className="section-kicker">FINBIF TAXONOMY</p>
            <h2 id="taxonomy-title">Current verified classification</h2>
            <ol className="species-taxonomy-list">
              {species.taxonomy.map((entry) => <li key={`${entry.taxonId}-${entry.rank}`}><span>{entry.rank ?? entry.taxonId}</span><strong>{entry.name}{entry.authorship ? ` ${entry.authorship}` : ""}</strong></li>)}
            </ol>
          </div>
          <aside>
            <p className="section-kicker">IDENTIFICATION</p>
            <h2>Source boundary</h2>
            <p>{species.identification ?? "No English identification prose was returned for automatic publication. Consult the linked FinBIF record and appropriate regional keys; do not identify a plant from photographs alone."}</p>
          </aside>
        </section>

        <section className="species-detail-section species-observation-panel" aria-labelledby="observations-title">
          <div><p className="section-kicker">OUR MEASURED TRAITS</p><h2 id="observations-title">Pool-wise CCI and leaf area</h2><p>Trait values are pooled measurements collected during the 2024 coastal-meadow field campaign and are study observations, not fixed species constants. Only summaries with at least five measurements are shown.</p></div>
          <div className="species-trait-list">{species.studyEvidence.traits.CCI && <TraitPlot label="Chlorophyll Content Index" value={species.studyEvidence.traits.CCI} />}{species.studyEvidence.traits.LA && <TraitPlot label="Leaf area" value={species.studyEvidence.traits.LA} />}{!species.studyEvidence.traits.CCI && !species.studyEvidence.traits.LA && <div className="species-pending-data"><strong>No validated pool-wise trait summary</strong><p>This species did not meet the ≥5-measurement rule in the supplied CCI or leaf-area summary tables.</p></div>}</div>
        </section>

        <section className="species-detail-section species-images" aria-labelledby="images-title">
          <p className="section-kicker">Licensed FinBIF photographs</p><h2 id="images-title">Image evidence</h2>
          <div className="species-image-grid">{species.images.map((item, index) => <figure key={item.imageId ?? item.file}><Image src={academyAssetHref(item.file)} alt={item.alt} width={1200} height={900} loading={index ? "lazy" : "eager"} unoptimized /><figcaption>{item.attributionText}. <a href={item.licenseUrl} target="_blank" rel="license noopener noreferrer">{item.license} ↗</a> · <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">source ↗</a></figcaption></figure>)}</div>
        </section>

        <section className="species-detail-section species-eo-panel" aria-labelledby="eo-title">
          <div>
            <p className="section-kicker">REMOTE-SENSING INTERPRETATION</p>
            <h2 id="eo-title">Why this record matters for Earth Observation</h2>
            <p>{species.remoteSensingContext}</p>
          </div>
          <div className="eo-chain" aria-label="Conceptual evidence chain from plant evidence to remotely sensed observation">
            <span>species traits or abundance</span><b>→</b><span>community cover and structure</span><b>→</b><span>mixed spectral or structural response</span><b>→</b><span>UAV or satellite observation</span>
          </div>
          <p className="eo-nonclaim">This page does not claim that Sentinel-2 or a UAV can uniquely identify <i>{species.scientificName}</i>.</p>
        </section>

        <section className="species-detail-section species-sources" aria-labelledby="sources-title">
          <p className="section-kicker">Sources and image credits</p>
          <h2 id="sources-title">Trace every published element</h2>
          <dl>
            <div><dt>FinBIF taxonomy</dt><dd><a href={species.sourceUrl} target="_blank" rel="noopener noreferrer">{species.sourceName} · {species.taxonId} · refreshed 2026-09-04 ↗</a></dd></div>
            <div><dt>Source access date</dt><dd>{species.sourceAccessDate ?? "Not available"}</dd></div>
            <div><dt>Seed provenance</dt><dd>{species.sourceDocument}{species.sourceDocumentSha256 ? ` · SHA-256 ${species.sourceDocumentSha256}` : ""}</dd></div>
            <div><dt>2024 field data</dt><dd>Records_West_Estonia_2024_dec16_shared.xlsx · occurrence from inwork_Sp_presence · cover from Community_level_data</dd></div>
            <div><dt>Trait method</dt><dd>HowTo_species_to_community_level_traits_13Dez.docx · pooled species medians · minimum n = 5 · cover-weighted community interpretation</dd></div>
            <div><dt>Photographs</dt><dd>{species.images.length} individually licensed FinBIF image{species.images.length === 1 ? "" : "s"}; creator, licence and source are shown with each image.</dd></div>
          </dl>
        </section>

        <section className="species-detail-section species-related" aria-labelledby="related-title">
          <div>
            <p className="section-kicker">Curriculum connections</p>
            <h2 id="related-title">Continue the evidence chain</h2>
            <ul>{relevantLessonLinks.map((lesson) => <li key={lesson.href}><a href={academyHref(lesson.href)}>{lesson.label} →</a></li>)}</ul>
          </div>
          <div>
            <p className="section-kicker">Source-based relations</p>
            <h2>Same genus or verified family</h2>
            {related.length ? <ul>{related.map((candidate) => <li key={candidate.slug}><a href={academyHref(`/species/${candidate.slug}/`)}><i>{candidate.scientificName}</i> →</a></li>)}</ul> : <p>No additional supplied record shares a source-verified genus or family.</p>}
          </div>
        </section>
      </main>
      <SeoFooter />
    </>
  );
}

function TraitPlot({ label, value }: { label: string; value: TraitSummary }) {
  const span = Math.max(value.max - value.min, Number.EPSILON);
  const position = ((value.median - value.min) / span) * 100;
  return <article className="trait-plot"><div><span>OUR 2024 MEASUREMENTS</span><h3>{label}</h3></div><div className="trait-range" aria-label={`${label}: median ${value.median}, range ${value.min} to ${value.max}, n ${value.n}`}><i style={{ left: `${position}%` }} /><b>{value.median} {value.unit === "index" ? "" : value.unit}</b></div><p>Range {value.min}–{value.max} · average {value.average} · n = {value.n}</p></article>;
}
