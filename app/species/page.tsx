import type { Metadata } from "next";
import { SpeciesAtlasBrowser } from "@/app/components/species-atlas-browser";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { creatorReference } from "@/lib/professional-identity";
import { academyHref, academyUrl } from "@/lib/site-paths";
import { habitatCodes, habitatDefinitions, speciesRecords } from "@/lib/species-atlas";

const atlasUrl = academyUrl("/species/");

export const metadata: Metadata = {
  title: "Boreal Baltic Coastal Meadow Species Atlas | Remote Sensing Scientist Academy",
  description: "Browse 78 source-traceable taxa recorded in a 2024 western Estonia coastal-meadow study, with FinBIF identity kept separate from plot evidence.",
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
          <p>Explore verified FinBIF identities alongside plot occurrence, cover, sites and pool-wise trait measurements from 120 plots sampled in western Estonia in 2024. Botanical reference data and study evidence remain explicitly separate.</p>
        </header>

        <aside className="atlas-scope-note"><strong>Study occurrence is not global ecology.</strong><p>A taxon appears here because it was recorded in our Boreal Baltic coastal-meadow study. OP/LS/US/TG frequencies describe only these 120 plots; they do not make a taxon a coastal specialist, salt-marsh species or member of one universal habitat. General ecological statements are published only when an independent authoritative source supports them.</p></aside>

        <nav className="atlas-feature-links" aria-label="Species Atlas learning guides">
          <a href={academyHref("/species/from-field-to-earth-observation/")}><span>Interactive explainer</span><strong>From Plant Species to Earth Observation</strong><small>Follow observations through traits, plots, UAV predictors, models and maps →</small></a>
          <a href={academyHref("/data/baltic-coastal-meadow-2024/")}><span>Study provenance</span><strong>Baltic Coastal Meadow 2024 Data Guide</strong><small>Understand the campaign, variables, aggregation and limitations →</small></a>
        </nav>

        <SpeciesAtlasBrowser records={speciesRecords} />

        <section className="atlas-evidence-section" aria-labelledby="atlas-evidence-title">
          <div>
            <p className="section-kicker">Evidence architecture</p>
            <h2 id="atlas-evidence-title">Three labels, three different claims</h2>
          </div>
          <div className="atlas-evidence-grid">
            <article><span>GENERAL ECOLOGY</span><p>Ecology reproduced only when an independent, traceable botanical source provides it.</p></article>
            <article><span>OUR 2024 OBSERVATIONS</span><p>Occurrence comes from the presence table with 30 plots per habitat. Cover summaries use positive numeric cover records and exclude absence plots.</p></article>
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
          <p>Published photographs retain individual owner, licence and source details. NonCommercial and ShareAlike restrictions are labelled per image; review or replace restricted assets before monetized use. Records and image assets remain separate so photographs can change without breaking species URLs.</p>
        </aside>
      </main>
      <SeoFooter />
    </>
  );
}
