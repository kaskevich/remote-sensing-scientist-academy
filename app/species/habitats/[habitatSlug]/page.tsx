import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoastalHabitatTransect } from "@/app/components/coastal-habitat-transect";
import { SpeciesCard } from "@/app/components/species-card";
import { JsonLd, SeoBreadcrumbs, SeoFooter, SeoHeader } from "@/app/components/seo-navigation";
import { academyHref, academyUrl } from "@/lib/site-paths";
import { habitatBySlug, habitatCodes, habitatDefinitions, relevantLessonLinks, speciesInHabitat } from "@/lib/species-atlas";

export const dynamicParams = false;

export function generateStaticParams() {
  return habitatCodes.map((code) => ({ habitatSlug: habitatDefinitions[code].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ habitatSlug: string }> }): Promise<Metadata> {
  const { habitatSlug } = await params;
  const habitat = habitatBySlug(habitatSlug);
  if (!habitat) return {};
  const url = academyUrl(`/species/habitats/${habitat.slug}/`);
  return {
    title: `${habitat.name} (${habitat.code}) — Coastal Meadow Species Atlas`,
    description: `Review the ${habitat.code} ${habitat.name} position in the Academy coastal-meadow transect and browse species with verified study associations when available.`,
    alternates: { canonical: url },
    openGraph: { title: `${habitat.name} — Coastal Meadow Species Atlas`, description: `${habitat.position}. Verified species associations are shown only when field data support them.`, url, type: "website" },
  };
}

export default async function HabitatPage({ params }: { params: Promise<{ habitatSlug: string }> }) {
  const { habitatSlug } = await params;
  const habitat = habitatBySlug(habitatSlug);
  if (!habitat) notFound();
  const records = speciesInHabitat(habitat.code);
  const url = academyUrl(`/species/habitats/${habitat.slug}/`);

  return (
    <>
      <JsonLd value={[
        { "@context": "https://schema.org", "@type": "CollectionPage", name: `${habitat.name} — Coastal Meadow Species Atlas`, url, description: `Academy reference page for the ${habitat.code} study-community band, with only source-verified species associations.` },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Academy", item: academyUrl("/") },
          { "@type": "ListItem", position: 2, name: "Species Atlas", item: academyUrl("/species/") },
          { "@type": "ListItem", position: 3, name: habitat.name, item: url },
        ] },
      ]} />
      <SeoHeader current="species" />
      <main className="habitat-page" id="main-content">
        <SeoBreadcrumbs items={[{ label: "Academy", href: academyHref("/") }, { label: "Species Atlas", href: academyHref("/species/") }, { label: habitat.name }]} />
        <header className="habitat-hero">
          <p className="section-kicker">Habitat band {habitat.code}</p>
          <h1>{habitat.name}</h1>
          <p>{habitat.position}. This is a study-community label and transect position, not a universal ecological description.</p>
        </header>
        <CoastalHabitatTransect highlighted={[habitat.code]} />
        <p className="transect-disclaimer">The transect communicates relative position and increasing inland context. It does not imply rigid boundaries, elevation values or unverified environmental tolerances.</p>

        <section className="habitat-species-section" aria-labelledby="habitat-species-title">
          <p className="section-kicker">OUR STUDY</p>
          <h2 id="habitat-species-title">{records.length} species with a verified {habitat.code} association</h2>
          {records.length
            ? <div className="species-card-grid">{records.map((species) => <SpeciesCard species={species} key={species.slug} />)}</div>
            : <div className="atlas-empty"><strong>Study distribution pending verified field-data import.</strong><p>The 38 FinBIF PDFs establish species identity but do not contain species-by-plot community observations. No species has been assigned to {habitat.code} from intuition.</p></div>}
        </section>

        <section className="habitat-learning-links" aria-labelledby="habitat-learning-title">
          <p className="section-kicker">Academy links</p>
          <h2 id="habitat-learning-title">Connect habitat evidence to spatial observation</h2>
          <ul>{relevantLessonLinks.map((lesson) => <li key={lesson.href}><a href={academyHref(lesson.href)}>{lesson.label} →</a></li>)}</ul>
        </section>
      </main>
      <SeoFooter />
    </>
  );
}
