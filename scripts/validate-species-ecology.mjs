import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const ecology = JSON.parse(readFileSync("content/species/general-ecology.json", "utf8"));
const finbif = JSON.parse(readFileSync("data/species/finbif-cache.json", "utf8"));
const studyBytes = readFileSync("data/species/study-species-summary.json");
const records = ecology.records ?? {};
const expectedStudyHash = "d9481f956ad4f29bcb218fec0140a916eba43107fdb8402db49d4c6ba8320362";
const oldFallback = "description payloads are retained in the maintenance cache";
const studyLanguage = /\b(?:OP|LS|US|TG)\b|2024 field|sampled plots|occurrence frequency/i;
const unsupportedSpecialism = /\bcoastal specialist\b|\bLower Shore species\b|\bUpper Shore species\b/i;
const relevantFinbifFields = new Set([
  "MX.ecology",
  "MX.growthFormAndGrowthHabit",
  "MX.habitat",
  "MX.habitatSubstrate",
  "MX.originAndDistributionText",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasFinbifEvidence(record) {
  return (record.descriptionSections ?? []).some((section) =>
    (section.groups ?? []).some((group) =>
      (group.variables ?? []).some((variable) =>
        relevantFinbifFields.has(variable.variable) && String(variable.content ?? "").replace(/<[^>]+>/g, "").trim().length > 0,
      ),
    ),
  );
}

const taxonIds = Object.keys(records);
assert(taxonIds.length === 78, `Expected 78 ecology records, found ${taxonIds.length}`);
assert(new Set(taxonIds).size === taxonIds.length, "Ecology taxon IDs must be unique");
assert(new Set(Object.keys(finbif)).size === taxonIds.length, "Ecology and FinBIF record counts differ");
assert(taxonIds.every((taxonId) => finbif[taxonId]), "Every ecology taxon ID must resolve to the FinBIF cache");
assert(createHash("sha256").update(studyBytes).digest("hex") === expectedStudyHash, "The verified 2024 study evidence changed during ecology enrichment");

for (const [taxonId, record] of Object.entries(records)) {
  assert(["complete", "partial", "under_review"].includes(record.status), `${taxonId}: invalid status`);
  assert(typeof record.summary === "string" && record.summary.trim(), `${taxonId}: missing summary`);
  assert(!record.summary.includes(oldFallback), `${taxonId}: old fallback remains`);
  assert(!studyLanguage.test(record.summary), `${taxonId}: ecology contains study-frequency language`);
  assert(!unsupportedSpecialism.test(record.summary), `${taxonId}: unsupported specialism language`);
  if (record.status === "under_review") {
    assert(record.summary === "General ecology summary is still under source review.", `${taxonId}: invalid review state`);
    continue;
  }
  assert(record.sources?.length > 0, `${taxonId}: sourced summary has no source`);
  for (const source of record.sources) {
    assert(/^https:\/\//.test(source.url), `${taxonId}: source URL must be HTTPS`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(source.retrievedAt), `${taxonId}: invalid retrieval date`);
    assert(source.geographicScope?.trim(), `${taxonId}: missing geographic scope`);
    assert(source.contentFieldsSupported?.length > 0, `${taxonId}: missing supported fields`);
    if (source.name === "FinBIF / Laji.fi") assert(hasFinbifEvidence(finbif[taxonId]), `${taxonId}: FinBIF is cited without cached ecology evidence`);
  }
}

const sourceBreakdown = Object.values(records).flatMap((record) => record.sources.map((source) => source.name)).reduce((counts, name) => {
  counts[name] = (counts[name] ?? 0) + 1;
  return counts;
}, {});

console.log(JSON.stringify({
  taxa: taxonIds.length,
  complete: Object.values(records).filter((record) => record.status === "complete").length,
  partial: Object.values(records).filter((record) => record.status === "partial").length,
  underReview: Object.values(records).filter((record) => record.status === "under_review").length,
  sourceBreakdown,
  studyEvidenceSha256: expectedStudyHash,
}, null, 2));
