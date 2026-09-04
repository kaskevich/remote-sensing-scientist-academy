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
    description: `Review the ${habitat.code} ${habitat.name} study-community position and taxa recorded there in the Academy's 2024 field plots.`,
    alternates: { canonical: url },
    openGraph: { title: `${habitat.name} — Coastal Meadow Species Atlas`, description: `${habitat.position}. Taxon occurrence is limited to the sampled 2024 plots and does not establish global habitat affinity.`, url, type: "website" },
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
        { "@context": "https://schema.org", "@type": "CollectionPage", name: `${habitat.name} — Coastal Meadow Species Atlas`, url, description: `Taxa recorded in the ${habitat.code} study-community band during the Academy's 2024 field campaign.` },
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
          <h2 id="habitat-species-title">Species recorded in our 2024 coastal-meadow sampling</h2>
          <p>{records.length} published Atlas species occurred in {habitat.code}. Records are ranked by occurrence frequency across the {records[0]?.habitats[habitat.code].totalPlots ?? 30} sampled plots; this is not a complete floristic inventory of the habitat beyond this study.</p>
          {records.length
            ? <div className="species-card-grid">{records.map((species) => <SpeciesCard species={species} key={species.slug} />)}</div>
            : <div className="atlas-empty"><strong>No reconciled Atlas species was recorded in this sample.</strong><p>No species has been assigned to {habitat.code} from intuition.</p></div>}
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
