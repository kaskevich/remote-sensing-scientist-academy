import rawSpecies from "@/content/species/species.json";

export const habitatCodes = ["OP", "LS", "US", "TG"] as const;
export type HabitatCode = (typeof habitatCodes)[number];

export type SpeciesImage = {
  file: string;
  alt: string;
  sourceUrl: string;
  sourceDocument: string;
  copyrightOwner: string;
  license: string;
  licenseUrl: string;
  attributionText: string;
  nonCommercial: boolean;
  shareAlike: boolean;
};

export type SpeciesRecord = {
  speciesId: string;
  slug: string;
  scientificName: string;
  commonName: string | null;
  family: string | null;
  genus: string;
  taxonId: string;
  sourceUrl: string;
  sourceName: string;
  sourceAccessDate: string | null;
  sourceDocument: string;
  sourceDocumentSha256: string;
  taxonomy: Array<{ name: string; taxonId: string }>;
  identification: string | null;
  ecology: string | null;
  occurrence: string | null;
  habitats: Record<HabitatCode, {
    observed: boolean | null;
    plotCount: number | null;
    occurrencePct: number | null;
    coverSummary: string | null;
  }>;
  studyEvidence: {
    status: "pending_verified_field_data_import";
    sites: string[];
    occupiedPlotCount: number | null;
    totalPlotCount: number | null;
    habitatOccurrence: Partial<Record<HabitatCode, number>>;
    traits: Record<string, number | string>;
  };
  images: SpeciesImage[];
  remoteSensingContext: string;
  references: Array<{ title: string; url: string }>;
  warnings: string[];
};

export const speciesRecords = rawSpecies as SpeciesRecord[];

export const habitatDefinitions: Record<HabitatCode, {
  code: HabitatCode;
  name: string;
  slug: string;
  position: string;
}> = {
  OP: { code: "OP", name: "Open Pioneer", slug: "open-pioneer", position: "First mapped community band after the sea edge" },
  LS: { code: "LS", name: "Lower Shore", slug: "lower-shore", position: "Second mapped community band along the Academy transect" },
  US: { code: "US", name: "Upper Shore", slug: "upper-shore", position: "Third mapped community band along the Academy transect" },
  TG: { code: "TG", name: "Tall Grass", slug: "tall-grass", position: "Fourth mapped community band before the inland context" },
};

export const relevantLessonLinks = [
  { label: "Scale, Resolution and Spatial Support", href: "/module-2/scale-resolution-and-spatial-support/" },
  { label: "Vegetation and Spectral Indices", href: "/module-2/vegetation-and-spectral-indices/" },
  { label: "UAV Remote Sensing Fundamentals", href: "/module-2/uav-remote-sensing-fundamentals/" },
];

export function verifiedHabitats(species: SpeciesRecord) {
  return habitatCodes.filter((code) => species.habitats[code].observed === true);
}

export function getSpecies(slug: string) {
  return speciesRecords.find((species) => species.slug === slug);
}

export function habitatBySlug(slug: string) {
  return Object.values(habitatDefinitions).find((habitat) => habitat.slug === slug);
}

export function speciesInHabitat(code: HabitatCode) {
  return speciesRecords.filter((species) => species.habitats[code].observed === true);
}

export function families() {
  return [...new Set(speciesRecords.flatMap((species) => species.family ? [species.family] : []))].sort();
}
