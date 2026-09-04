import Image from "next/image";
import { CoastalHabitatTransect } from "@/app/components/coastal-habitat-transect";
import { academyAssetHref, academyHref } from "@/lib/site-paths";
import { type SpeciesRecord, verifiedHabitats } from "@/lib/species-atlas";

export function SpeciesCard({ species }: { species: SpeciesRecord }) {
  const image = species.images[0];
  const habitats = verifiedHabitats(species);
  return (
    <article className="species-card">
      <a className="species-card-image" href={academyHref(`/species/${species.slug}/`)} tabIndex={-1} aria-hidden="true">
        {image
          ? <Image src={academyAssetHref(image.file)} alt={image.alt} width={1200} height={900} loading="lazy" unoptimized />
          : <BotanicalPlaceholder />}
      </a>
      <div className="species-card-copy">
        <p className="species-card-source">FINBIF · {species.taxonId}</p>
        <h2><a href={academyHref(`/species/${species.slug}/`)}><i>{species.scientificName}</i></a></h2>
        <p>{species.family ?? "Family not extractable from supplied PDF"}</p>
        <CoastalHabitatTransect highlighted={habitats} compact />
        <p className="species-study-status">
          {habitats.length ? `${habitats.join(" · ")} verified in study data` : "Study distribution pending verified field-data import"}
        </p>
        <a className="species-card-link" href={academyHref(`/species/${species.slug}/`)}>View species →</a>
      </div>
    </article>
  );
}

export function BotanicalPlaceholder() {
  return (
    <div className="botanical-placeholder" role="img" aria-label="Botanical image unavailable because attribution or licence could not be verified">
      <svg viewBox="0 0 300 360" aria-hidden="true">
        <path d="M151 315 C150 250 149 172 145 76" />
        <path d="M146 120 C103 101 78 75 69 39 C105 43 139 70 146 120 Z" />
        <path d="M148 181 C194 164 220 137 230 99 C190 105 156 135 148 181 Z" />
        <path d="M150 240 C111 225 88 202 78 171 C114 174 142 198 150 240 Z" />
        <circle cx="144" cy="68" r="16" />
      </svg>
      <span>Image withheld</span>
      <small>Attribution mapping requires review</small>
    </div>
  );
}
