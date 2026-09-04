"use client";

import { useEffect, useMemo, useState } from "react";
import { CoastalHabitatTransect } from "@/app/components/coastal-habitat-transect";
import { SpeciesCard } from "@/app/components/species-card";
import { families, habitatCodes, habitatDefinitions, type HabitatCode, type SpeciesRecord, verifiedHabitats } from "@/lib/species-atlas";

export function filterSpecies(records: SpeciesRecord[], query: string, habitat: HabitatCode | "ALL", family: string) {
  const normalized = query.trim().toLocaleLowerCase();
  return records.filter((species) => {
    const matchesQuery = !normalized || species.scientificName.toLocaleLowerCase().includes(normalized);
    const matchesHabitat = habitat === "ALL" || verifiedHabitats(species).includes(habitat);
    const matchesFamily = !family || species.family === family;
    return matchesQuery && matchesHabitat && matchesFamily;
  });
}

export function SpeciesAtlasBrowser({ records }: { records: SpeciesRecord[] }) {
  const [query, setQuery] = useState("");
  const [habitat, setHabitat] = useState<HabitatCode | "ALL">("ALL");
  const [family, setFamily] = useState("");
  const [urlReady, setUrlReady] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const params = new URLSearchParams(window.location.search);
      const requestedHabitat = params.get("habitat");
      setQuery(params.get("q") ?? "");
      setFamily(params.get("family") ?? "");
      if (requestedHabitat && habitatCodes.includes(requestedHabitat as HabitatCode)) {
        setHabitat(requestedHabitat as HabitatCode);
      }
      setUrlReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (habitat !== "ALL") params.set("habitat", habitat);
    if (family) params.set("family", family);
    const suffix = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState(null, "", suffix);
  }, [query, habitat, family, urlReady]);

  const filtered = useMemo(() => filterSpecies(records, query, habitat, family), [records, query, habitat, family]);
  const highlighted = habitat === "ALL" ? [] : [habitat];

  return (
    <section className="atlas-browser" aria-labelledby="atlas-browser-title">
      <div className="atlas-transect-panel">
        <CoastalHabitatTransect highlighted={highlighted} />
        <p>Communities form an environmental gradient. Species may occur across multiple habitat types; no habitat membership is inferred without a verified source.</p>
      </div>

      <div className="atlas-controls">
        <label className="atlas-search">
          <span>Search the Atlas</span>
          <input type="search" placeholder="Search species…" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <fieldset>
          <legend>Habitat · matches any selected habitat</legend>
          <div className="habitat-filter-row">
            <button type="button" aria-pressed={habitat === "ALL"} onClick={() => setHabitat("ALL")}>All</button>
            {habitatCodes.map((code) => (
              <button type="button" aria-pressed={habitat === code} onClick={() => setHabitat(code)} key={code}>
                {code}<span>{habitatDefinitions[code].name}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <label className="atlas-family-filter">
          <span>Verified family</span>
          <select value={family} onChange={(event) => setFamily(event.target.value)}>
            <option value="">All families</option>
            {families().map((name) => <option value={name} key={name}>{name}</option>)}
          </select>
        </label>
      </div>

      <div className="atlas-results-heading">
        <div>
          <p className="section-kicker">Species records</p>
          <h2 id="atlas-browser-title">{filtered.length} of {records.length} species</h2>
        </div>
        {(query || habitat !== "ALL" || family) && <button type="button" onClick={() => { setQuery(""); setHabitat("ALL"); setFamily(""); }}>Clear filters</button>}
      </div>

      {filtered.length
        ? <div className="species-card-grid">{filtered.map((species) => <SpeciesCard species={species} key={species.speciesId} />)}</div>
        : <div className="atlas-empty" role="status">
            <strong>No verified records match this filter.</strong>
            <p>The current PDF package does not supply OP/LS/US/TG species observations. Habitat results will populate after a verified field-data import.</p>
          </div>}
    </section>
  );
}
