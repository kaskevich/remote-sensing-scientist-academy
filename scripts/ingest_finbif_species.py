#!/usr/bin/env python3
"""Extract traceable Stage 1 species records from saved FinBIF taxon PDFs.

Usage:
  python scripts/ingest_finbif_species.py /path/to/Plant_Species.zip

The script deliberately leaves habitat, ecology, common-name and study fields
empty unless the supplied PDFs contain unambiguous evidence. A page-2 image is
published only when its copyright owner and licence collapse to one unique
mapping on that page.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import tempfile
import zipfile
from datetime import datetime
from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
CONTENT_PATH = ROOT / "content" / "species" / "species.json"
IMAGE_ROOT = ROOT / "public" / "species"
REPORT_PATH = ROOT / "docs" / "SPECIES_ATLAS_INGESTION_REPORT.md"
VALID_HABITATS = ("OP", "LS", "US", "TG")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalized_candidate(path: Path) -> str:
    words = re.split(r"[_\s]+", path.stem.strip())
    return " ".join(words).strip()


def verified_name(path: Path, text: str) -> str:
    candidate = normalized_candidate(path)
    match = re.search(rf"\b{re.escape(candidate)}\b", text, re.IGNORECASE)
    if match:
        page_name = match.group(0)
    else:
        # Chrome's printed Carex flava PDF maps the "fl" ligature to a null
        # extraction glyph. Accept only that exact recoverable filename/title
        # alignment; every other mismatch remains a hard failure.
        genus, epithet = candidate.split(" ", 1)
        ligature_form = f"{genus} \x00{epithet[2:]}" if epithet.lower().startswith("fl") else ""
        if not ligature_form or ligature_form.lower() not in text.lower():
            raise ValueError(f"Scientific name from filename not found on page 1: {candidate}")
        page_name = candidate
    genus, epithet = page_name.split(" ", 1)
    return f"{genus[0].upper()}{genus[1:].lower()} {epithet.lower()}"


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def lineage(text: str) -> list[dict[str, str]]:
    cleaned = text.replace("\x00", "")
    values: list[dict[str, str]] = []
    pattern = r"(?:^|\))([^()\n]+?)\s*\(/en/taxon/(MX\.\d+)/identi[^)]*\)"
    for match in re.finditer(pattern, cleaned, re.MULTILINE):
        name = re.sub(r"\s+", " ", match.group(1)).strip()
        if name:
            values.append({"name": name, "taxonId": match.group(2)})
    return values


def access_date(text: str) -> str | None:
    match = re.search(r"\b(\d{1,2}/\d{1,2}/\d{2}),", text)
    if not match:
        return None
    return datetime.strptime(match.group(1), "%m/%d/%y").date().isoformat()


def licence_url(text: str) -> str | None:
    match = re.search(r"https://creativecommons\.org/licenses/[^\s)]+/?", text)
    return match.group(0) if match else None


def normalized_licence(value: str) -> str:
    return value.strip().replace("CC-BY", "CC BY").replace("-4.0", " 4.0")


def photo_candidates(reader: PdfReader):
    if len(reader.pages) < 2:
        return []
    photos = []
    for embedded in reader.pages[1].images:
        image = embedded.image
        if image.mode in {"RGB", "RGBA"} and image.width * image.height >= 200_000:
            photos.append(embedded)
    return photos


def save_webp(embedded, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image: Image.Image = embedded.image.convert("RGB")
    image.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
    image.save(path, "WEBP", quality=86, method=6)


def build_record(pdf: Path) -> tuple[dict, list[str]]:
    reader = PdfReader(pdf)
    page_one = reader.pages[0].extract_text() or ""
    page_two = reader.pages[1].extract_text() or "" if len(reader.pages) > 1 else ""
    scientific_name = verified_name(pdf, page_one)
    genus = scientific_name.split()[0]
    slug = slugify(scientific_name)
    taxon_ids = re.findall(r"MX\.\d+", page_one)
    if not taxon_ids:
        raise ValueError(f"No taxon ID found: {pdf.name}")
    taxon_id = taxon_ids[-1]
    taxon_lineage = lineage(page_one)
    family_entry = next((item for item in reversed(taxon_lineage) if item["name"].endswith("aceae")), None)
    owners = [value.strip() for value in re.findall(r"Copyright owner:\s*(.+)", page_two)]
    licences = [normalized_licence(value) for value in re.findall(r"License:\s*([^\n]+)", page_two)]
    owner_values = sorted(set(owners))
    licence_values = sorted(set(licences))
    photos = photo_candidates(reader)
    warnings = [
        "No OP/LS/US/TG association supplied; study distribution remains pending.",
        "No source-supported ecology or identification prose was present in the saved PDF.",
        "No common name or growth form was imported.",
    ]
    if not family_entry:
        warnings.append("Family was not extractable from the printed FinBIF lineage.")

    images: list[dict] = []
    if len(owner_values) == 1 and len(licence_values) == 1 and photos and licence_url(page_two):
        output = IMAGE_ROOT / slug / "finbif-page-02.webp"
        save_webp(max(photos, key=lambda item: item.image.width * item.image.height), output)
        licence = licence_values[0]
        owner = owner_values[0]
        images.append({
            "file": f"/species/{slug}/finbif-page-02.webp",
            "alt": f"{scientific_name} photographed for the Finnish Biodiversity Information Facility",
            "sourceUrl": f"https://laji.fi/en/taxon/{taxon_id}/identification",
            "sourceDocument": f"{pdf.name}, page 2",
            "copyrightOwner": owner,
            "license": licence,
            "licenseUrl": licence_url(page_two),
            "attributionText": f"{scientific_name} photograph by {owner}, {licence}, via FinBIF",
            "nonCommercial": "NC" in licence,
            "shareAlike": "SA" in licence,
        })
    else:
        warnings.append(
            "No image published: page-2 image-to-owner/licence mapping was not uniquely verifiable."
        )

    record = {
        "speciesId": slug,
        "slug": slug,
        "scientificName": scientific_name,
        "commonName": None,
        "family": family_entry["name"] if family_entry else None,
        "genus": genus,
        "taxonId": taxon_id,
        "sourceUrl": f"https://laji.fi/en/taxon/{taxon_id}/identification",
        "sourceName": "Finnish Biodiversity Information Facility (FinBIF / laji.fi)",
        "sourceAccessDate": access_date(page_one),
        "sourceDocument": pdf.name,
        "sourceDocumentSha256": sha256(pdf),
        "taxonomy": taxon_lineage,
        "identification": None,
        "ecology": None,
        "occurrence": None,
        "habitats": {code: {"observed": None, "plotCount": None, "occurrencePct": None, "coverSummary": None} for code in VALID_HABITATS},
        "studyEvidence": {
            "status": "pending_verified_field_data_import",
            "sites": [],
            "occupiedPlotCount": None,
            "totalPlotCount": None,
            "habitatOccurrence": {},
            "traits": {},
        },
        "images": images,
        "remoteSensingContext": "No species-specific trait or spectral evidence was supplied. At community scale, changes in plant cover, leaf area and canopy structure can alter the vegetation fraction and structure contributing to UAV or satellite observations; this does not establish species identification from imagery.",
        "references": [{"title": "FinBIF taxon page", "url": f"https://laji.fi/en/taxon/{taxon_id}/identification"}],
        "warnings": warnings,
    }
    return record, warnings


def write_report(records: list[dict]) -> None:
    lines = [
        "# FinBIF species PDF ingestion report",
        "",
        "Generated from the 38 PDFs supplied in `Plant_Species.zip`. The saved taxon",
        "pages provide identity, printed lineage, images and image credits; they do not",
        "provide the Academy's species-by-plot field observations.",
        "",
        "| Source PDF | Scientific name | Taxon ID | Family | Image | Licence | Warnings |",
        "|---|---|---|---|---|---|---|",
    ]
    for record in records:
        image = record["images"][0] if record["images"] else None
        warnings = " ".join(record["warnings"])
        lines.append(
            f"| {record['sourceDocument']} | *{record['scientificName']}* | {record['taxonId']} | "
            f"{record['family'] or 'Not extractable'} | {'Published' if image else 'Placeholder'} | "
            f"{image['license'] if image else 'Not applicable'} | {warnings} |"
        )
    lines.extend([
        "",
        "## Licensing decision",
        "",
        "A photograph is exported only when page 2 contains one unique copyright owner,",
        "one unique Creative Commons licence and at least one photograph-sized embedded",
        "image. Every published image retains adjacent owner, licence and source links in",
        "the Atlas. All current published photographs carry a NonCommercial licence; they",
        "must be reviewed or replaced before any monetized use. ShareAlike records are",
        "flagged separately in structured metadata.",
        "",
        "## Filename normalization decisions",
        "",
        "Scientific names and slugs come from the printed page-one taxon heading, not",
        "blindly from filenames. This normalizes `Agrostis_Stolonifera.pdf` to",
        "*Agrostis stolonifera*, trims the trailing space in `Juncus_gerardi .pdf`,",
        "normalizes the space in `Salicornia perennans.pdf`, and restores the PDF text",
        "extraction ligature in *Carex flava*. The source filenames remain recorded.",
        "",
        "## Scientific limits",
        "",
        "No common name, growth form, habitat assignment, field occurrence percentage,",
        "trait value, identification description or ecological claim was inferred. These",
        "fields remain empty until a traceable source or verified field-data import exists.",
    ])
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    args = parser.parse_args()
    if not args.archive.exists():
        raise SystemExit(f"Archive not found: {args.archive}")

    with tempfile.TemporaryDirectory(prefix="finbif-species-") as temp_dir:
        with zipfile.ZipFile(args.archive) as archive:
            archive.extractall(temp_dir)
        pdfs = sorted(
            path for path in Path(temp_dir).glob("**/*.pdf")
            if "__MACOSX" not in path.parts and not path.name.startswith("._")
        )
        if len(pdfs) != 38:
            raise SystemExit(f"Expected 38 PDFs, found {len(pdfs)}")

        if IMAGE_ROOT.exists():
            shutil.rmtree(IMAGE_ROOT)
        records = [build_record(pdf)[0] for pdf in pdfs]

    slugs = [record["slug"] for record in records]
    ids = [record["speciesId"] for record in records]
    if len(slugs) != len(set(slugs)) or len(ids) != len(set(ids)):
        raise SystemExit("Duplicate species slug or ID detected")
    if any(not record["sourceUrl"] or not record["scientificName"] for record in records):
        raise SystemExit("Missing required identity or source URL")

    CONTENT_PATH.parent.mkdir(parents=True, exist_ok=True)
    CONTENT_PATH.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_report(records)
    print(f"Imported {len(records)} records")
    print(f"Published {sum(bool(record['images']) for record in records)} licensed images")
    print(f"Used {sum(not record['images'] for record in records)} botanical placeholders")


if __name__ == "__main__":
    main()
