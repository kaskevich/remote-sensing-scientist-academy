import rawSpecies from "@/content/species/species.json";
import rawReconciliation from "@/content/species/taxon-reconciliation.json";
import rawStudy from "@/data/species/study-species-summary.json";
import rawFinbif from "@/data/species/finbif-cache.json";

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
  imageId?: string;
  retrievedAt?: string;
};

export type HabitatEvidence = {
  observed: boolean;
  sampled: boolean;
  occupiedPlots: number;
  totalPlots: number;
  occurrenceFrequency: number;
  coverAmongOccupiedPlots: { median: number | null; q1: number | null; q3: number | null; mean: number | null; max: number | null; n: number };
  zeroPlotsExcludedFromCoverSummary: boolean;
  occurrenceSourceSheet: string;
  coverSourceSheet: string;
};

export type TraitSummary = {
  median: number;
  min: number;
  max: number;
  average: number;
  n: number;
  unit: string;
  sourceSheet: string;
  sourceMinHeader: string;
};

export type SpeciesRecord = {
  speciesId: string;
  slug: string;
  scientificName: string;
  scientificNameAuthorship: string | null;
  commonName: string | null;
  commonNames: Partial<Record<"fi" | "sv" | "en" | "et", string>>;
  family: string | null;
  genus: string;
  taxonId: string;
  sourceUrl: string;
  sourceName: string;
  sourceAccessDate: string | null;
  sourceDocument: string;
  sourceDocumentSha256: string | null;
  taxonRank: string | null;
  taxonomicStatus: string | null;
  taxonomy: Array<{ rank?: string; name: string; taxonId: string; authorship?: string | null }>;
  identification: string | null;
  ecology: string | null;
  occurrence: string | null;
  habitats: Record<HabitatCode, HabitatEvidence>;
  studyEvidence: {
    status: "verified_2024_field_data" | "not_recorded_in_cover_table";
    studyNames: string[];
    reconciliationStatuses: string[];
    sites: string[];
    siteEvidence: Record<string, { recorded: boolean; occupiedPlots: number; totalPlots: number; occurrenceFrequency: number }>;
    occupiedPlotCount: number | null;
    totalPlotCount: number | null;
    habitatOccurrence: Partial<Record<HabitatCode, number>>;
    traits: Partial<Record<"CCI" | "LA", TraitSummary>>;
  };
  images: SpeciesImage[];
  remoteSensingContext: string;
  references: Array<{ title: string; url: string }>;
  warnings: string[];
};

type Reconciliation = {
  studyName: string;
  finbifAcceptedName: string | null;
  taxonId: string | null;
  matchStatus: string;
  synonyms: string[];
};

type StudySummary = {
  studyName: string;
  coverAvailable: boolean;
  habitats: Partial<Record<HabitatCode, Omit<HabitatEvidence, "observed">>>;
  sites: Record<string, { recorded: boolean; occupiedPlots: number; totalPlots: number; occurrenceFrequency: number }>;
  occupiedPlots: number;
  totalPlots: number | null;
  traits: Partial<Record<"CCI" | "LA", TraitSummary>>;
};

type FinbifRecord = {
  taxonId: string;
  scientificName: string;
  scientificNameAuthorship: string | null;
  taxonRank: string | null;
  classification: Array<{ rank: string; name: string; taxonId: string; authorship?: string | null }>;
  commonNames: SpeciesRecord["commonNames"];
  media: Array<{
    imageId: string;
    file?: string;
    url: string;
    sourcePage: string;
    creator: string;
    copyrightOwner: string;
    license: string;
    licenseUrl: string;
    attribution: string;
    retrievedAt: string;
    nonCommercial: boolean;
    shareAlike: boolean;
  }>;
  primaryImageId?: string | null;
};

const reconciliation = rawReconciliation as Reconciliation[];
const study = (rawStudy as { species: Record<string, StudySummary> }).species;
const finbif = rawFinbif as Record<string, FinbifRecord>;
const acceptedStatuses = new Set(["exact", "accepted-name-match", "synonym-match", "spelling-normalization"]);

type AtlasBase = {
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
  sourceDocumentSha256: string | null;
  taxonomy: Array<{ name: string; taxonId: string }>;
  identification: string | null;
  ecology: string | null;
  occurrence: string | null;
  images: SpeciesImage[];
  remoteSensingContext: string;
  references: Array<{ title: string; url: string }>;
  warnings: string[];
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const seedBases = rawSpecies as unknown as AtlasBase[];
const seedIds = new Set(seedBases.map((record) => record.taxonId));
const fieldBases: AtlasBase[] = reconciliation
  .filter((item) => item.taxonId && item.finbifAcceptedName && acceptedStatuses.has(item.matchStatus) && !seedIds.has(item.taxonId))
  .filter((item, index, records) => records.findIndex((candidate) => candidate.taxonId === item.taxonId) === index)
  .map((item) => ({
    speciesId: slugify(item.finbifAcceptedName!),
    slug: slugify(item.finbifAcceptedName!),
    scientificName: item.finbifAcceptedName!,
    commonName: null,
    family: null,
    genus: item.finbifAcceptedName!.split(" ")[0],
    taxonId: item.taxonId!,
    sourceUrl: `https://laji.fi/en/taxon/${item.taxonId}/identification`,
    sourceName: "Finnish Biodiversity Information Facility (FinBIF / laji.fi)",
    sourceAccessDate: "2026-09-04",
    sourceDocument: "Current FinBIF public taxon service; no supplied seed PDF",
    sourceDocumentSha256: null,
    taxonomy: [],
    identification: null,
    ecology: null,
    occurrence: null,
    images: [],
    remoteSensingContext: "Species occurrence and cover contribute to community composition and trait weighting. UAV or satellite observations describe mixed canopy and surface responses; this record does not establish species identification from imagery.",
    references: [{ title: "FinBIF taxon page", url: `https://laji.fi/en/taxon/${item.taxonId}/identification` }],
    warnings: [],
  }));

const emptyHabitat = (): HabitatEvidence => ({
  observed: false,
  sampled: true,
  occupiedPlots: 0,
  totalPlots: 30,
  occurrenceFrequency: 0,
  coverAmongOccupiedPlots: { median: null, q1: null, q3: null, mean: null, max: null, n: 0 },
  zeroPlotsExcludedFromCoverSummary: true,
  occurrenceSourceSheet: "inwork_Sp_presence",
  coverSourceSheet: "Community_level_data",
});

export const speciesRecords: SpeciesRecord[] = [...seedBases, ...fieldBases].map((base) => {
  const current = finbif[base.taxonId];
  const links = reconciliation.filter((item) => item.taxonId === base.taxonId && acceptedStatuses.has(item.matchStatus));
  const evidence = links.map((item) => study[item.studyName]).filter(Boolean);
  const primary = evidence[0];
  const habitats = Object.fromEntries(habitatCodes.map((code) => {
    const value = primary?.habitats[code];
    return [code, value ? { ...value, observed: value.occupiedPlots > 0 } : emptyHabitat()];
  })) as Record<HabitatCode, HabitatEvidence>;
  const onlineImages: SpeciesImage[] = (current?.media ?? []).filter((image) => image.file).map((image) => ({
    file: image.file!,
    alt: `${current.scientificName} photograph from the Finnish Biodiversity Information Facility`,
    sourceUrl: image.sourcePage,
    sourceDocument: `FinBIF media ${image.imageId}`,
    copyrightOwner: image.copyrightOwner,
    license: image.license,
    licenseUrl: image.licenseUrl,
    attributionText: image.attribution,
    nonCommercial: image.nonCommercial,
    shareAlike: image.shareAlike,
    imageId: image.imageId,
    retrievedAt: image.retrievedAt,
  }));
  const orderedImages = current?.primaryImageId ? [...onlineImages, ...base.images] : [...base.images, ...onlineImages];
  const images = orderedImages.filter((image, index, records) => records.findIndex((candidate) => candidate.file === image.file) === index).slice(0, 4);
  const commonNames = current?.commonNames ?? {};
  return {
    ...base,
    scientificName: current?.scientificName ?? base.scientificName,
    scientificNameAuthorship: current?.scientificNameAuthorship ?? null,
    commonName: commonNames.en ?? commonNames.et ?? null,
    commonNames,
    family: current?.classification.find((item) => item.rank === "family")?.name ?? base.family,
    genus: current?.classification.find((item) => item.rank === "genus")?.name ?? base.genus,
    taxonRank: current?.taxonRank ?? null,
    taxonomicStatus: "accepted",
    taxonomy: current?.classification ?? base.taxonomy,
    habitats,
    studyEvidence: {
      status: primary?.coverAvailable ? "verified_2024_field_data" : "not_recorded_in_cover_table",
      studyNames: links.map((item) => item.studyName),
      reconciliationStatuses: links.map((item) => item.matchStatus),
      sites: primary ? Object.entries(primary.sites).filter(([, value]) => value.recorded).map(([site]) => site) : [],
      siteEvidence: primary?.sites ?? {},
      occupiedPlotCount: primary?.occupiedPlots ?? 0,
      totalPlotCount: primary?.totalPlots ?? 120,
      habitatOccurrence: Object.fromEntries(habitatCodes.map((code) => [code, habitats[code].occurrenceFrequency])),
      traits: primary?.traits ?? {},
    },
    images,
  } satisfies SpeciesRecord;
});

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
  return habitatCodes.filter((code) => species.habitats[code].occupiedPlots > 0);
}

export function strongestHabitats(species: SpeciesRecord) {
  const maximum = Math.max(...habitatCodes.map((code) => species.habitats[code].occurrenceFrequency));
  return maximum > 0 ? habitatCodes.filter((code) => species.habitats[code].occurrenceFrequency === maximum) : [];
}

export function getSpecies(slug: string) {
  return speciesRecords.find((species) => species.slug === slug);
}

export function habitatBySlug(slug: string) {
  return Object.values(habitatDefinitions).find((habitat) => habitat.slug === slug);
}

export function speciesInHabitat(code: HabitatCode) {
  return speciesRecords
    .filter((species) => species.habitats[code].occupiedPlots > 0)
    .sort((a, b) => b.habitats[code].occurrenceFrequency - a.habitats[code].occurrenceFrequency || a.scientificName.localeCompare(b.scientificName));
}

export function families() {
  return [...new Set(speciesRecords.flatMap((species) => species.family ? [species.family] : []))].sort();
}
