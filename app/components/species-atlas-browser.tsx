"use client";

import { useEffect, useMemo, useState } from "react";
import { CoastalHabitatTransect } from "@/app/components/coastal-habitat-transect";
import { SpeciesCard } from "@/app/components/species-card";
import { families, habitatCodes, habitatDefinitions, type HabitatCode, type SpeciesRecord, verifiedHabitats } from "@/lib/species-atlas";

export function filterSpecies(records: SpeciesRecord[], query: string, habitat: HabitatCode | "ALL", family: string, site = "", trait = "", photo = false) {
  const normalized = query.trim().toLocaleLowerCase();
  return records.filter((species) => {
    const matchesQuery = !normalized || species.scientificName.toLocaleLowerCase().includes(normalized);
    const matchesHabitat = habitat === "ALL" || verifiedHabitats(species).includes(habitat);
    const matchesFamily = !family || species.family === family;
    const matchesSite = !site || species.studyEvidence.siteEvidence[site]?.recorded;
    const matchesTrait = !trait || trait in species.studyEvidence.traits;
    const matchesPhoto = !photo || species.images.length > 0;
    return matchesQuery && matchesHabitat && matchesFamily && matchesSite && matchesTrait && matchesPhoto;
  });
}

export function SpeciesAtlasBrowser({ records }: { records: SpeciesRecord[] }) {
  const [query, setQuery] = useState("");
  const [habitat, setHabitat] = useState<HabitatCode | "ALL">("ALL");
  const [family, setFamily] = useState("");
  const [site, setSite] = useState("");
  const [trait, setTrait] = useState("");
  const [photo, setPhoto] = useState(false);
  const [sort, setSort] = useState("name");
  const [urlReady, setUrlReady] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const params = new URLSearchParams(window.location.search);
      const requestedHabitat = params.get("habitat");
      setQuery(params.get("q") ?? "");
      setFamily(params.get("family") ?? "");
      setSite(params.get("site") ?? "");
      setTrait(params.get("trait") ?? "");
      setPhoto(params.get("photo") === "yes");
      setSort(params.get("sort") ?? "name");
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
    if (site) params.set("site", site);
    if (trait) params.set("trait", trait);
    if (photo) params.set("photo", "yes");
    if (sort !== "name") params.set("sort", sort);
    const suffix = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState(null, "", suffix);
  }, [query, habitat, family, site, trait, photo, sort, urlReady]);

  const filtered = useMemo(() => {
    const matches = filterSpecies(records, query, habitat, family, site, trait, photo);
    return matches.sort((a, b) => sort === "frequency"
      ? (b.studyEvidence.occupiedPlotCount ?? 0) - (a.studyEvidence.occupiedPlotCount ?? 0) || a.scientificName.localeCompare(b.scientificName)
      : sort === "family"
        ? (a.family ?? "").localeCompare(b.family ?? "") || a.scientificName.localeCompare(b.scientificName)
        : a.scientificName.localeCompare(b.scientificName));
  }, [records, query, habitat, family, site, trait, photo, sort]);
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
        <label><span>Study site</span><select value={site} onChange={(event) => setSite(event.target.value)}><option value="">All sites</option>{["Saardu", "Keemu", "Koera", "Kudani"].map((name) => <option key={name}>{name}</option>)}</select></label>
        <label><span>Measured traits</span><select value={trait} onChange={(event) => setTrait(event.target.value)}><option value="">Any availability</option><option value="CCI">CCI available</option><option value="LA">Leaf area available</option></select></label>
        <label className="atlas-photo-filter"><span>Image evidence</span><input type="checkbox" checked={photo} onChange={(event) => setPhoto(event.target.checked)} /> Licensed photo available</label>
        <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Scientific name</option><option value="frequency">Most observed</option><option value="family">Family</option></select></label>
      </div>

      <div className="atlas-results-heading">
        <div>
          <p className="section-kicker">Species records</p>
          <h2 id="atlas-browser-title">{filtered.length} of {records.length} species</h2>
        </div>
        {(query || habitat !== "ALL" || family || site || trait || photo || sort !== "name") && <button type="button" onClick={() => { setQuery(""); setHabitat("ALL"); setFamily(""); setSite(""); setTrait(""); setPhoto(false); setSort("name"); }}>Clear filters</button>}
      </div>

      {filtered.length
        ? <div className="species-card-grid">{filtered.map((species) => <SpeciesCard species={species} key={species.speciesId} />)}</div>
        : <div className="atlas-empty" role="status">
            <strong>No verified records match this filter.</strong>
            <p>No published Atlas record matches every selected evidence filter.</p>
          </div>}
    </section>
  );
}
