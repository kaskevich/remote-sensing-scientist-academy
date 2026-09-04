import { describe, expect, it } from "vitest";
import { filterSpecies } from "@/app/components/species-atlas-browser";
import { habitatCodes, speciesRecords, verifiedHabitats } from "@/lib/species-atlas";

describe("Coastal Meadow Species Atlas", () => {
  it("publishes exactly the 38 unique supplied taxon records", () => {
    expect(speciesRecords).toHaveLength(38);
    expect(new Set(speciesRecords.map((species) => species.slug)).size).toBe(38);
    expect(new Set(speciesRecords.map((species) => species.taxonId)).size).toBe(38);
    for (const species of speciesRecords) {
      expect(species.scientificName).toMatch(/^[A-Z][a-z]+ [a-z-]+$/);
      expect(species.sourceUrl).toBe(`https://laji.fi/en/taxon/${species.taxonId}/identification`);
      expect(species.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("keeps unsupported scientific fields explicitly empty", () => {
    for (const species of speciesRecords) {
      expect(species.commonName).toBeNull();
      expect(species.identification).toBeNull();
      expect(species.ecology).toBeNull();
      expect(species.occurrence).toBeNull();
      expect(verifiedHabitats(species)).toEqual([]);
      expect(species.studyEvidence.status).toBe("pending_verified_field_data_import");
      expect(species.studyEvidence.sites).toEqual([]);
      for (const code of habitatCodes) expect(species.habitats[code].observed).toBeNull();
    }
  });

  it("publishes only photographs with complete adjacent attribution", () => {
    const photographs = speciesRecords.flatMap((species) => species.images);
    expect(photographs).toHaveLength(36);
    expect(speciesRecords.filter((species) => species.images.length === 0).map((species) => species.scientificName)).toEqual([
      "Lolium arundinaceum",
      "Trifolium repens",
    ]);
    for (const image of photographs) {
      expect(image.copyrightOwner).not.toBe("");
      expect(image.license).toMatch(/^CC BY-NC(?:-SA)? 4\.0$/);
      expect(image.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\/licenses\//);
      expect(image.sourceUrl).toMatch(/^https:\/\/laji\.fi\/en\/taxon\//);
      expect(image.nonCommercial).toBe(true);
    }
  });

  it("filters scientific names and verified families without inventing habitat matches", () => {
    expect(filterSpecies(speciesRecords, "Juncus", "ALL", "").map((species) => species.scientificName)).toEqual(["Juncus gerardi"]);
    const asteraceae = filterSpecies(speciesRecords, "", "ALL", "Asteraceae");
    expect(asteraceae.length).toBeGreaterThan(0);
    expect(asteraceae.every((species) => species.family === "Asteraceae")).toBe(true);
    expect(filterSpecies(speciesRecords, "", "LS", "")).toEqual([]);
  });
});
