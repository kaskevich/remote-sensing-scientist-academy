import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BotanicalPlaceholder } from "@/app/components/species-card";
import { CoastalHabitatTransect } from "@/app/components/coastal-habitat-transect";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyAssetHref, academyAssetUrl, academyHref, academyUrl } from "@/lib/site-paths";
import { getSpecies, habitatDefinitions, relevantLessonLinks, speciesRecords, verifiedHabitats } from "@/lib/species-atlas";

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
            <p className="section-kicker">FinBIF taxon · {species.taxonId}</p>
            <h1><i>{species.scientificName}</i></h1>
            <dl className="species-identity-list">
              <div><dt>Family</dt><dd>{species.family ?? "Not extractable from the supplied PDF"}</dd></div>
              <div><dt>Genus</dt><dd><i>{species.genus}</i></dd></div>
              <div><dt>Common name</dt><dd>Not supplied in the source PDF</dd></div>
            </dl>
            <a className="species-source-button" href={species.sourceUrl} target="_blank" rel="noopener noreferrer">Open verified FinBIF record ↗</a>
          </div>
        </header>

        <section className="species-detail-section" aria-labelledby="coastal-position-title">
          <p className="section-kicker">Coastal-meadow position</p>
          <h2 id="coastal-position-title">A habitat position requires field evidence</h2>
          <CoastalHabitatTransect highlighted={habitats} />
          <p className="transect-disclaimer">Community boundaries are not rigid, and one species may occur in several communities. This record currently has no verified OP/LS/US/TG association.</p>
          <div className="species-evidence-split">
            <article><span>SOURCE ECOLOGY</span><h3>Typical ecology</h3><p>{species.ecology ?? "No ecological narrative was present in the supplied FinBIF PDF. No habitat preference has been inferred."}</p></article>
            <article><span>OUR STUDY</span><h3>Observed in our study</h3><p>Study distribution pending verified field-data import.</p><ul>{Object.values(habitatDefinitions).map((habitat) => <li key={habitat.code}><a href={academyHref(`/species/habitats/${habitat.slug}/`)}>{habitat.code} · {habitat.name}</a><strong>Pending</strong></li>)}</ul></article>
          </div>
        </section>

        <section className="species-detail-section species-taxonomy-grid" aria-labelledby="taxonomy-title">
          <div>
            <p className="section-kicker">SOURCE TAXONOMY</p>
            <h2 id="taxonomy-title">Printed FinBIF lineage</h2>
            <ol className="species-taxonomy-list">
              {species.taxonomy.map((entry) => <li key={entry.taxonId}><span>{entry.taxonId}</span><strong>{entry.name}</strong></li>)}
              <li><span>{species.taxonId}</span><strong><i>{species.scientificName}</i></strong></li>
            </ol>
          </div>
          <aside>
            <p className="section-kicker">IDENTIFICATION</p>
            <h2>Source boundary</h2>
            <p>{species.identification ?? "The saved taxon page does not provide identification prose. Consult the linked FinBIF record and appropriate regional keys; do not identify a plant from this photograph alone."}</p>
          </aside>
        </section>

        <section className="species-detail-section species-observation-panel" aria-labelledby="observations-title">
          <div>
            <p className="section-kicker">OUR STUDY</p>
            <h2 id="observations-title">Coastal-meadow observations</h2>
          </div>
          <div className="species-pending-data">
            <strong>Pending verified field-data import</strong>
            <p>No species-by-plot table is present in the Academy repository. Sites, occupied plots, habitat occurrence, cover and traits remain intentionally blank.</p>
            <code>occurrence frequency within habitat = occupied plots in habitat / total sampled plots in habitat</code>
            <small>This denominator will be used only when both numerator and sampled-plot denominator are traceable.</small>
          </div>
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
            <div><dt>Taxon source</dt><dd><a href={species.sourceUrl} target="_blank" rel="noopener noreferrer">{species.sourceName} · {species.taxonId} ↗</a></dd></div>
            <div><dt>Source access date</dt><dd>{species.sourceAccessDate ?? "Not available"}</dd></div>
            <div><dt>Supplied document</dt><dd>{species.sourceDocument} · SHA-256 {species.sourceDocumentSha256}</dd></div>
            {image ? <>
              <div><dt>Photograph</dt><dd>{image.copyrightOwner}; extracted from {image.sourceDocument}</dd></div>
              <div><dt>Image licence</dt><dd><a href={image.licenseUrl} target="_blank" rel="license noopener noreferrer">{image.license} ↗</a>{image.nonCommercial ? " · NonCommercial restriction applies" : ""}{image.shareAlike ? " · ShareAlike applies" : ""}</dd></div>
              <div><dt>Image source</dt><dd><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">FinBIF taxon image page ↗</a></dd></div>
            </> : <div><dt>Photograph</dt><dd>Not published because the individual image-to-credit mapping was not uniquely verifiable.</dd></div>}
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
