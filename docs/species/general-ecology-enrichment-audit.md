# General ecology enrichment audit

Audit completed 2026-09-06 for the 78 taxa published in the Species Atlas.

## Release summary

| Measure | Count |
| --- | ---: |
| Published taxa audited | 78 |
| Complete ecology summaries | 78 |
| Partial ecology summaries | 0 |
| Under source review | 0 |
| FinBIF-supported | 77 |
| Estonian-source-supported | 0 |
| Plants of the World Online-supported | 1 |
| GBIF-supported | 0 |
| Peer-reviewed-literature-supported | 0 |
| Other recognised national flora supported (FloraWeb) | 1 |
| Explicit saline or marine/coastal habitat evidence in the source | 24 |
| Broad or multi-setting ecological range stated in the public summary | 33 |

Before enrichment, all 78 runtime records had a null `ecology` field and therefore displayed the same developer-facing fallback. After enrichment, every record has a concise English summary and at least one linked authoritative source.

## Evidence boundary

General ecology was written only from independent botanical sources. OP, LS, US and TG frequencies, site occurrence, plot occurrence, cover, CCI and leaf-area values were not used to infer habitat affinity. The field evidence files were not edited.

The cached FinBIF description payload supplied usable life-form, habitat, substrate, moisture, salinity or distribution evidence for 77 taxa. The summaries are concise English paraphrases; Finnish source prose is not presented as a direct quotation and Finland-specific statements remain labelled as Finnish context.

`Viola hirta` had no usable FinBIF description section. Its habitat and life-form summary therefore uses FloraWeb, maintained by Germany's Federal Agency for Nature Conservation, while Plants of the World Online supplies accepted-name and distribution context.

## Explicit saline or marine/coastal source evidence

The 24 taxa in this count are: *Agrostis stolonifera*, *Argentina anserina*, *Arrhenatherum elatius*, *Carex distans*, *Carex nigra*, *Elytrigia repens*, *Galium palustre*, *Juncus gerardi*, *Linum catharticum*, *Lolium arundinaceum*, *Lotus corniculatus*, *Lysimachia maritima*, *Ononis spinosa* subsp. *arvensis*, *Pentanema salicinum*, *Phragmites australis*, *Plantago major*, *Plantago maritima*, *Salicornia perennans*, *Scorzoneroides autumnalis*, *Suaeda maritima*, *Succisa pratensis*, *Trifolium fragiferum*, *Triglochin maritima* and *Triglochin palustris*.

This category means only that an independent source explicitly mentions saline, marine, seashore or coastal habitat. It does not mean that every listed taxon is restricted to the coast.

## Source conflicts and guarded records

- FinBIF's exact-name service links the 2024 label `Salicornia_europaea` to the accepted Atlas taxon *Salicornia perennans*. Its description also treats northern Baltic material as part of a difficult diploid complex. The Atlas therefore preserves the original study name beside the accepted match and makes the taxonomic caution visible.
- Some FinBIF description sources use *Sesleria caerulea* in historical or broad context while the current accepted Atlas record is *Sesleria uliginosa*. The public summary therefore uses only the habitat, growth-form and substrate evidence attached to the accepted record and omits the conflicting distribution sentence.

No unresolved taxon was promoted, no ecological affinity filter was added, and no claim of coastal specialization was derived from the study data.

## Stored provenance

`content/species/general-ecology.json` stores, for every taxon:

- completion status;
- the public English summary;
- source name and taxon URL;
- retrieval date;
- geographic scope;
- the content fields supported by each source.

Primary sources used in this release:

- [Finnish Biodiversity Information Facility / Laji.fi](https://laji.fi/)
- [FloraWeb](https://www.floraweb.de/php/artenhome.php?suchnr=6378)
- [Plants of the World Online: *Viola hirta*](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:868309-1)
