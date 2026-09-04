import type { Metadata } from "next";
import { SpeciesAtlasBrowser } from "@/app/components/species-atlas-browser";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import { habitatCodes, habitatDefinitions, speciesRecords } from "@/lib/species-atlas";

const atlasUrl = academyUrl("/species/");

export const metadata: Metadata = {
  title: "Boreal Baltic Coastal Meadow Species Atlas | Remote Sensing Scientist Academy",
  description: "Browse 38 source-traceable coastal meadow plant records from FinBIF and connect botanical identity with field evidence, habitat gradients and remote-sensing concepts.",
  alternates: { canonical: atlasUrl },
  openGraph: {
    title: "Boreal Baltic Coastal Meadow Species Atlas",
    description: "A searchable, evidence-labelled plant atlas for coastal meadow learning and Earth Observation context.",
    type: "website",
    url: atlasUrl,
  },
};

export default function SpeciesAtlasPage() {
  return (
    <>
      <JsonLd value={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Boreal Baltic Coastal Meadow Species Atlas",
          description: metadata.description,
          url: atlasUrl,
          creator: creatorReference(),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: speciesRecords.length,
            itemListElement: speciesRecords.map((species, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: species.scientificName,
              url: academyUrl(`/species/${species.slug}/`),
            })),
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
            { "@type": "ListItem", position: 2, name: "Species Atlas", item: atlasUrl },
          ],
        },
      ]} />
      <SeoHeader current="species" />
      <main className="species-atlas-page" id="main-content">
        <SeoBreadcrumbs items={[{ label: "Academy", href: academyHref("/") }, { label: "Species Atlas" }]} />
        <header className="atlas-hero">
          <div>
            <p className="section-kicker">Botanical identity · field evidence · Earth Observation</p>
            <h1>Boreal Baltic Coastal Meadow Species Atlas</h1>
          </div>
          <p>Explore the plant species behind the field measurements, vegetation communities and remote-sensing patterns used throughout the Academy. The Atlas connects botanical identity with the ecological gradient of Boreal Baltic coastal meadows and, where available, with observations from our own field dataset.</p>
        </header>

        <SpeciesAtlasBrowser records={speciesRecords} />

        <section className="atlas-evidence-section" aria-labelledby="atlas-evidence-title">
          <div>
            <p className="section-kicker">Evidence architecture</p>
            <h2 id="atlas-evidence-title">Three labels, three different claims</h2>
          </div>
          <div className="atlas-evidence-grid">
            <article><span>SOURCE ECOLOGY</span><p>Taxonomy or ecology reproduced only when a traceable botanical source provides it.</p></article>
            <article><span>OUR STUDY</span><p>Species-by-plot distributions calculated only after a verified field-data import with an explicit denominator.</p></article>
            <article><span>REMOTE-SENSING INTERPRETATION</span><p>Careful links from plant cover or structure to pixel-scale evidence—not claims of unique species detection.</p></article>
          </div>
        </section>

        <section className="atlas-habitat-links" aria-labelledby="habitat-pages-title">
          <p className="section-kicker">Habitat reference pages</p>
          <h2 id="habitat-pages-title">Move along the study gradient</h2>
          <div>
            {habitatCodes.map((code) => (
              <a href={academyHref(`/species/habitats/${habitatDefinitions[code].slug}/`)} key={code}>
                <span>{code}</span><strong>{habitatDefinitions[code].name}</strong><small>Open habitat page →</small>
              </a>
            ))}
          </div>
        </section>

        <aside className="atlas-license-note">
          <strong>Image-use notice</strong>
          <p>Published photographs retain individual owner, licence and source details. The current images use Creative Commons NonCommercial licences; review or replace them before any monetized Academy use. Records and image assets are deliberately separate so photographs can be changed without breaking species URLs.</p>
        </aside>
      </main>
      <SeoFooter />
    </>
  );
}
