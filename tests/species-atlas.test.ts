import { describe, expect, it } from "vitest";
import { filterSpecies } from "@/app/components/species-atlas-browser";
import { habitatCodes, speciesRecords } from "@/lib/species-atlas";
import reconciliation from "@/content/species/taxon-reconciliation.json";

describe("Coastal Meadow Species Atlas", () => {
  it("publishes the seed taxa and every safely reconciled field taxon", () => {
    expect(speciesRecords).toHaveLength(78);
    expect(new Set(speciesRecords.map((species) => species.slug)).size).toBe(78);
    expect(new Set(speciesRecords.map((species) => species.taxonId)).size).toBe(78);
    for (const species of speciesRecords) {
      expect(species.scientificName).toMatch(/^[A-Z][a-z]+ [a-z-]+(?: (?:subsp\.|var\.) [a-z-]+)?$/);
      expect(species.sourceUrl).toBe(`https://laji.fi/en/taxon/${species.taxonId}/identification`);
      if (species.sourceDocumentSha256) expect(species.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("enriches accepted taxonomy from the current cached FinBIF records", () => {
    for (const species of speciesRecords) {
      expect(species.scientificNameAuthorship).not.toBe("");
      expect(["species", "subspecies"]).toContain(species.taxonRank);
      expect(species.taxonomicStatus).toBe("accepted");
      expect(species.taxonomy.some((entry) => entry.rank === "family")).toBe(true);
      expect(species.taxonomy.some((entry) => entry.rank === "class")).toBe(true);
    }
  });

  it("publishes only photographs with complete adjacent attribution", () => {
    const photographs = speciesRecords.flatMap((species) => species.images);
    expect(photographs.length).toBeGreaterThanOrEqual(speciesRecords.length * 3);
    expect(speciesRecords.every((species) => species.images.length >= 3 && species.images.length <= 4)).toBe(true);
    for (const image of photographs) {
      expect(image.copyrightOwner).not.toBe("");
      expect(image.license).toMatch(/^CC (?:BY|BY-SA|BY-NC|BY-NC-SA|0) 4\.0$|^CC0 1\.0$/);
      expect(image.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\/licenses\//);
      expect(image.sourceUrl).toMatch(/^https:\/\/laji\.fi\/en\/taxon\//);
      expect(image.file).toMatch(/^\/species\/.+\.webp$/);
    }
    const phragmites = speciesRecords.find((species) => species.scientificName === "Phragmites australis")!;
    expect(phragmites.images[0].imageId).toBe("MM.122065");
    expect(phragmites.images[0].file).toBe("/species/phragmites-australis/finbif-mm-122065.webp");
  });

  it("filters scientific names, families, field habitats, sites, traits and photographs", () => {
    expect(filterSpecies(speciesRecords, "Juncus", "ALL", "").map((species) => species.scientificName)).toEqual(["Juncus gerardi"]);
    const asteraceae = filterSpecies(speciesRecords, "", "ALL", "Asteraceae");
    expect(asteraceae.length).toBeGreaterThan(0);
    expect(asteraceae.every((species) => species.family === "Asteraceae")).toBe(true);
    expect(filterSpecies(speciesRecords, "", "LS", "").length).toBeGreaterThan(0);
    expect(filterSpecies(speciesRecords, "Juncus", "LS", "", "Saardu", "CCI", true)).toHaveLength(1);
  });

  it("uses explicit habitat denominators and occupied-plot cover summaries", () => {
    const juncus = speciesRecords.find((species) => species.scientificName === "Juncus gerardi")!;
    expect(juncus.studyEvidence.studyNames).toEqual(["Juncus_gerardii"]);
    expect(juncus.studyEvidence.occupiedPlotCount).toBe(52);
    expect(juncus.habitats.LS).toMatchObject({ occupiedPlots: 30, totalPlots: 30, occurrenceFrequency: 1 });
    expect(juncus.habitats.LS.coverAmongOccupiedPlots).toMatchObject({ median: 52.5, q1: 40, q3: 63.75, n: 30 });
    for (const species of speciesRecords) for (const code of habitatCodes) {
      const evidence = species.habitats[code];
      expect(evidence.occupiedPlots).toBeLessThanOrEqual(evidence.totalPlots);
      expect(evidence.occurrenceFrequency).toBeGreaterThanOrEqual(0);
      expect(evidence.occurrenceFrequency).toBeLessThanOrEqual(1);
    }
  });

  it("retains all study labels and excludes non-taxa from reconciliation", () => {
    expect(reconciliation).toHaveLength(82);
    expect(reconciliation.some((record) => record.studyName === "Bare_ground")).toBe(false);
    expect(reconciliation.find((record) => record.studyName === "Glaux_maritima")).toMatchObject({ finbifAcceptedName: "Lysimachia maritima", matchStatus: "synonym-match" });
    expect(reconciliation.find((record) => record.studyName === "Arabis_sp")).toMatchObject({ taxonId: null, matchStatus: "unresolved" });
  });

  it("publishes only validated pool-wise trait summaries", () => {
    const withCci = speciesRecords.filter((species) => species.studyEvidence.traits.CCI);
    const withLa = speciesRecords.filter((species) => species.studyEvidence.traits.LA);
    expect(withCci.every((species) => species.studyEvidence.traits.CCI!.n >= 5)).toBe(true);
    expect(withLa.every((species) => species.studyEvidence.traits.LA!.n >= 5)).toBe(true);
    expect(speciesRecords.find((species) => species.scientificName === "Juncus gerardi")!.studyEvidence.traits.CCI!.n).toBe(124);
  });
});
