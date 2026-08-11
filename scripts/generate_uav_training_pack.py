"""Generate the synthetic UAV and Photogrammetry training pack.

The compact fixtures model documented quality conditions without distributing
real flights, private imagery, or unpublished ecological locations.
"""

from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

import numpy as np
import rasterio
from rasterio.transform import from_origin
from rasterio.warp import transform as transform_coordinates


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/lesson-resources/module-2/uav-foundations"
CRS = "EPSG:3301"
TRANSFORM = from_origin(500_000, 6_500_008, 0.2, 0.2)
NODATA = -9999.0


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65_536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def raster_asset(
    filename: str,
    array: np.ndarray,
    *,
    purpose: str,
    semantic_meaning: str,
    expected_issue: str,
    units: str,
    transform=TRANSFORM,
    crs: str = CRS,
    nodata: int | float | None = NODATA,
    scale_status: str = "documented",
) -> dict[str, object]:
    path = OUTPUT / filename
    bands = array[np.newaxis, ...] if array.ndim == 2 else array
    profile = {
        "driver": "GTiff",
        "height": bands.shape[1],
        "width": bands.shape[2],
        "count": bands.shape[0],
        "dtype": str(bands.dtype),
        "crs": crs,
        "transform": transform,
        "nodata": nodata,
        "compress": "deflate",
    }
    with rasterio.open(path, "w", **profile) as dst:
        dst.write(bands)
        dst.update_tags(
            ACADEMY_STATUS="Synthetic, openly reusable Academy training data",
            SEMANTIC_MEANING=semantic_meaning,
            PURPOSE=purpose,
            UNITS=units,
            REFLECTANCE_SCALE_STATUS=scale_status,
        )
        for index in range(1, bands.shape[0] + 1):
            dst.set_band_description(index, f"{semantic_meaning} band {index}")

    with rasterio.open(path) as src:
        return {
            "filename": filename,
            "purpose": purpose,
            "dataType": src.dtypes[0],
            "sourceStatus": "Synthetic Academy fixture; not observed UAV data",
            "crs": src.crs.to_string() if src.crs else None,
            "transform": list(src.transform)[:6],
            "resolution": [abs(src.res[0]), abs(src.res[1])],
            "shape": [src.height, src.width],
            "bounds": list(src.bounds),
            "bandCount": src.count,
            "nodata": src.nodata,
            "semanticMeaning": semantic_meaning,
            "units": units,
            "reflectanceScaleStatus": scale_status,
            "expectedQaIssue": expected_issue,
            "checksum": sha256(path),
            "licenceStatus": "CC0-1.0 synthetic training data",
        }


def write_csv(filename: str, rows: list[dict[str, object]], purpose: str, expected_issue: str) -> dict[str, object]:
    path = OUTPUT / filename
    with path.open("w", newline="", encoding="utf8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    return {
        "filename": filename,
        "purpose": purpose,
        "dataType": "CSV table",
        "sourceStatus": "Synthetic Academy fixture; not a real flight log",
        "crs": None,
        "resolution": None,
        "shape": [len(rows), len(rows[0])],
        "nodata": None,
        "semanticMeaning": purpose,
        "expectedQaIssue": expected_issue,
        "checksum": sha256(path),
        "licenceStatus": "CC0-1.0 synthetic training data",
    }


def ring_to_lon_lat(ring: list[tuple[float, float]]) -> list[list[float]]:
    eastings, northings = zip(*ring)
    longitudes, latitudes = transform_coordinates(CRS, "EPSG:4326", eastings, northings)
    return [[round(lon, 8), round(lat, 8)] for lon, lat in zip(longitudes, latitudes, strict=True)]


def write_geojson(filename: str, features: list[dict[str, object]], purpose: str) -> dict[str, object]:
    path = OUTPUT / filename
    payload = {
        "type": "FeatureCollection",
        "academyStatus": "Synthetic, openly reusable Academy training data",
        "features": features,
    }
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf8")
    return {
        "filename": filename,
        "purpose": purpose,
        "dataType": "GeoJSON FeatureCollection",
        "sourceStatus": "Synthetic Academy fixture; not a published field location",
        "crs": "OGC:CRS84 (RFC 7946 longitude, latitude)",
        "resolution": None,
        "shape": [len(features), None],
        "nodata": None,
        "semanticMeaning": purpose,
        "expectedQaIssue": "Transform to the raster CRS before overlay or extraction",
        "checksum": sha256(path),
        "licenceStatus": "CC0-1.0 synthetic training data",
    }


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    assets: list[dict[str, object]] = []

    mission_rows = [{
        "mission_id": "SYN_UAV_2026_06_18",
        "platform_type": "multirotor",
        "sensor_type": "four-band multispectral plus RGB",
        "sensor_width_mm": 13.2,
        "sensor_height_mm": 8.8,
        "image_width_px": 5472,
        "image_height_px": 3648,
        "focal_length_mm": 8.8,
        "nominal_height_agl_m": 80,
        "forward_overlap_pct": 80,
        "side_overlap_pct": 70,
        "flight_speed_m_s": 5,
        "shutter_type": "rolling",
        "start_utc": "2026-06-18T08:10:00Z",
        "end_utc": "2026-06-18T08:42:00Z",
        "field_sampling_date": "2026-06-14",
        "illumination_note": "thin cloud arrived during flight line L03",
        "positioning": "onboard GNSS plus GCPs and withheld check points",
    }]
    assets.append(write_csv(
        "mission_metadata.csv", mission_rows,
        "Mission geometry, timing, sensor and positioning evidence",
        "Variable illumination and a four-day field/UAV temporal mismatch require review",
    ))

    image_rows: list[dict[str, object]] = []
    for index in range(1, 13):
        line = f"L{(index - 1) // 4 + 1:02d}"
        exposure = 0.0016 if index < 9 else 0.0022
        irradiance = 1.0 if index < 9 else 0.78 + 0.03 * (index - 9)
        image_rows.append({
            "image_id": f"IMG_{index:04d}",
            "flight_line": line,
            "capture_utc": f"2026-06-18T08:{10 + index * 2:02d}:00Z",
            "height_agl_m": round(79.4 + 0.15 * index, 2),
            "exposure_s": exposure,
            "irradiance_relative": round(irradiance, 3),
            "saturation_fraction": 0.001 if index != 10 else 0.064,
            "blur_score_px": 0.35 if index != 7 else 1.8,
            "gnss_quality": "standard onboard GNSS",
            "panel_capture": "before_and_after",
            "qa_note": "motion blur review" if index == 7 else ("illumination/saturation review" if index == 10 else "none"),
        })
    assets.append(write_csv(
        "image_metadata.csv", image_rows,
        "Image-level exposure, illumination, blur and positioning audit",
        "IMG_0007 is blurred; line L03 changes exposure/irradiance and IMG_0010 has high saturation",
    ))

    gcp_rows = [
        {"point_id": "GCP01", "role": "control", "east_residual_m": 0.012, "north_residual_m": -0.008, "vertical_residual_m": 0.021, "region": "west"},
        {"point_id": "GCP02", "role": "control", "east_residual_m": -0.016, "north_residual_m": 0.011, "vertical_residual_m": -0.018, "region": "north"},
        {"point_id": "GCP03", "role": "control", "east_residual_m": 0.009, "north_residual_m": 0.015, "vertical_residual_m": 0.026, "region": "centre"},
        {"point_id": "GCP04", "role": "control", "east_residual_m": -0.011, "north_residual_m": -0.014, "vertical_residual_m": -0.022, "region": "south"},
        {"point_id": "GCP05", "role": "control", "east_residual_m": 0.014, "north_residual_m": 0.007, "vertical_residual_m": 0.017, "region": "east"},
        {"point_id": "GCP06", "role": "control", "east_residual_m": -0.008, "north_residual_m": 0.010, "vertical_residual_m": -0.019, "region": "south-east"},
    ]
    checkpoint_rows = [
        {"point_id": "CP01", "role": "check", "east_residual_m": 0.031, "north_residual_m": -0.018, "vertical_residual_m": 0.052, "region": "west"},
        {"point_id": "CP02", "role": "check", "east_residual_m": 0.028, "north_residual_m": -0.021, "vertical_residual_m": 0.061, "region": "north"},
        {"point_id": "CP03", "role": "check", "east_residual_m": 0.036, "north_residual_m": -0.016, "vertical_residual_m": 0.057, "region": "centre"},
        {"point_id": "CP04", "role": "check", "east_residual_m": 0.142, "north_residual_m": -0.096, "vertical_residual_m": 0.238, "region": "south-east weak block"},
        {"point_id": "CP05", "role": "check", "east_residual_m": 0.034, "north_residual_m": -0.019, "vertical_residual_m": 0.064, "region": "east"},
    ]
    assets.append(write_csv("gcp_residuals.csv", gcp_rows, "Control-point residual evidence", "Control residuals are fitting evidence, not independent accuracy"))
    assets.append(write_csv("checkpoint_residuals.csv", checkpoint_rows, "Withheld check-point residual evidence", "South-east check point exposes local warping and all points show small directional bias"))

    processing_report = {
        "academyStatus": "Synthetic processing-report fixture",
        "softwareNeutralStages": ["feature detection", "feature matching", "tie points", "camera pose", "bundle adjustment", "dense reconstruction", "surface", "orthorectification", "mosaic"],
        "imagesTotal": 12,
        "imagesAligned": 11,
        "medianKeypointsPerImage": 4210,
        "medianTiePointsPerImage": 1190,
        "reprojectionErrorPixels": 0.42,
        "cameraFocalLengthChangePct": 2.8,
        "weakRegion": "south-east block edge",
        "missingEvidence": ["independent accuracy standard classification", "verified reflectance scale for Red Edge", "vertical datum"],
    }
    report_path = OUTPUT / "photogrammetry_report.json"
    report_path.write_text(json.dumps(processing_report, indent=2) + "\n", encoding="utf8")
    assets.append({
        "filename": report_path.name,
        "purpose": "Software-neutral synthetic reconstruction report",
        "dataType": "JSON record",
        "sourceStatus": "Synthetic Academy fixture; not a proprietary report",
        "crs": None,
        "resolution": None,
        "shape": [1, len(processing_report)],
        "nodata": None,
        "semanticMeaning": "Internal photogrammetric diagnostics",
        "expectedQaIssue": "One image is unaligned, calibration changes and a weak block edge require review; reprojection error is not absolute accuracy",
        "checksum": sha256(report_path),
        "licenceStatus": "CC0-1.0 synthetic training data",
    })

    rows, cols = np.indices((40, 40))
    meadow = np.exp(-(((rows - 20) / 12) ** 2 + ((cols - 18) / 14) ** 2))
    texture = 0.01 * np.sin(rows / 2.5) * np.cos(cols / 3.5)
    red = (0.18 - 0.07 * meadow + texture).astype("float32")
    green = (0.19 + 0.05 * meadow + texture * 0.6).astype("float32")
    nir = (0.32 + 0.36 * meadow + texture).astype("float32")
    rededge_scaled = np.round((0.23 + 0.18 * meadow + texture) * 10_000).astype("uint16")
    for band in (red, green, nir):
        band[:2, :2] = NODATA
    rededge_scaled[:2, :2] = 65_535

    assets.append(raster_asset(
        "uav_red.tif", red, purpose="Aligned calibrated Red training band", semantic_meaning="synthetic red reflectance proxy",
        expected_issue="Reference grid; one NoData corner; reflectance scale documented as fraction", units="synthetic reflectance fraction",
    ))
    assets.append(raster_asset(
        "uav_green.tif", green, purpose="Aligned calibrated Green training band", semantic_meaning="synthetic green reflectance proxy",
        expected_issue="Aligns with Red and contains the same NoData corner", units="synthetic reflectance fraction",
    ))
    assets.append(raster_asset(
        "uav_rededge.tif", rededge_scaled, purpose="Red Edge band with ambiguous handover scale", semantic_meaning="synthetic red-edge digital values",
        expected_issue="Values look like reflectance scaled by 10000, but the handover deliberately omits authoritative scale confirmation", units="ambiguous scaled digital value",
        nodata=65_535, scale_status="ambiguous; do not divide by 10000 without verified metadata",
    ))
    assets.append(raster_asset(
        "uav_nir.tif", nir, purpose="Aligned calibrated NIR training band", semantic_meaning="synthetic near-infrared reflectance proxy",
        expected_issue="Aligns with Red; verify cell-by-cell grid before index calculation", units="synthetic reflectance fraction",
    ))
    assets.append(raster_asset(
        "uav_nir_shifted.tif", nir, purpose="Half-pixel band co-registration failure", semantic_meaning="synthetic near-infrared reflectance proxy",
        expected_issue="Same CRS, resolution and shape as Red but origin is shifted by 0.1 m in x and y", units="synthetic reflectance fraction",
        transform=from_origin(500_000.1, 6_500_008.1, 0.2, 0.2),
    ))

    dsm = (2.1 + rows * 0.006 + cols * 0.003 + 0.85 * meadow).astype("float32")
    dsm[:2, :2] = NODATA
    dsm_spike = dsm.copy()
    dsm_spike[29, 31] = 18.5
    dsm_spike[30, 31] = -3.0
    assets.append(raster_asset(
        "uav_dsm.tif", dsm, purpose="Synthetic reconstructed upper surface", semantic_meaning="synthetic UAV digital surface model",
        expected_issue="Vertical datum is deliberately undocumented; this is not a DTM or direct vegetation-height measurement", units="metres; vertical datum undocumented",
    ))
    assets.append(raster_asset(
        "uav_dsm_spike_demo.tif", dsm_spike, purpose="DSM spike-and-pit diagnosis fixture", semantic_meaning="synthetic UAV DSM with deliberate artefacts",
        expected_issue="One 18.5 m spike and one -3.0 m pit violate the local meadow surface pattern", units="metres; vertical datum undocumented",
    ))

    irradiance_gradient = (red * np.linspace(0.72, 1.18, 40, dtype="float32")[None, :]).astype("float32")
    irradiance_gradient[:2, :2] = NODATA
    assets.append(raster_asset(
        "uav_radiometric_gradient_demo.tif", irradiance_gradient, purpose="Variable-illumination diagnosis fixture",
        semantic_meaning="synthetic Red proxy with across-flight radiometric gradient",
        expected_issue="A strong west-east gradient represents uncorrected illumination change rather than ecology", units="uncalibrated synthetic fraction",
        scale_status="not analysis-ready; variable illumination deliberately retained",
    ))

    red_byte = np.clip(red, 0, 1)
    rgb = np.stack([
        np.round(red_byte * 900).clip(0, 255),
        np.round(np.clip(green, 0, 1) * 720).clip(0, 255),
        np.round((0.14 + 0.04 * (1 - meadow)) * 900).clip(0, 255),
    ]).astype("uint8")
    rgb[:, :, 21:] = np.clip(rgb[:, :, 21:].astype("float32") * 0.72, 0, 255).astype("uint8")
    rgb[:, 17:24, 19:23] = np.roll(rgb[:, 17:24, 19:23], 2, axis=2)
    assets.append(raster_asset(
        "uav_rgb_preview.tif", rgb, purpose="Orthomosaic seam and ghosting preview", semantic_meaning="synthetic RGB orthomosaic preview",
        expected_issue="Brightness seam at column 21 and locally shifted texture near the seam", units="8-bit display values, not reflectance",
        nodata=0,
    ))

    site_ring = [(500_000, 6_500_000), (500_008, 6_500_000), (500_008, 6_500_008), (500_000, 6_500_008), (500_000, 6_500_000)]
    site_features = [{
        "type": "Feature",
        "properties": {"site_id": "SYN_UAV_SITE", "status": "synthetic"},
        "geometry": {"type": "Polygon", "coordinates": [ring_to_lon_lat(site_ring)]},
    }]
    assets.append(write_geojson("study_area.geojson", site_features, "Synthetic UAV survey boundary"))

    plot_rings = [
        [(500_000.8, 6_500_006.0), (500_002.4, 6_500_006.0), (500_002.4, 6_500_007.6), (500_000.8, 6_500_007.6), (500_000.8, 6_500_006.0)],
        [(500_003.2, 6_500_003.2), (500_004.8, 6_500_003.2), (500_004.8, 6_500_004.8), (500_003.2, 6_500_004.8), (500_003.2, 6_500_003.2)],
        [(500_005.8, 6_500_000.6), (500_007.4, 6_500_000.6), (500_007.4, 6_500_002.2), (500_005.8, 6_500_002.2), (500_005.8, 6_500_000.6)],
    ]
    plot_features = [
        {
            "type": "Feature",
            "properties": {"plot_id": f"UAVP{index:02d}", "support": "1.6 m synthetic square", "field_date": "2026-06-14"},
            "geometry": {"type": "Polygon", "coordinates": [ring_to_lon_lat(ring)]},
        }
        for index, ring in enumerate(plot_rings, start=1)
    ]
    assets.append(write_geojson("field_plots.geojson", plot_features, "Synthetic field-sampling polygons"))

    manifest = {
        "title": "Module 2 UAV and Photogrammetry synthetic training pack",
        "generatedWith": {"python": "3.12.13", "rasterio": rasterio.__version__, "numpy": np.__version__},
        "coordinateNote": "Raster coordinates and survey records are synthetic. GeoJSON follows RFC 7946 longitude-latitude order.",
        "licence": "CC0-1.0 synthetic training data; no unpublished/private UAV imagery or locations",
        "knownDeliberateConditions": [
            "variable illumination", "weak south-east georeferencing", "half-pixel NIR shift", "orthomosaic seam and ghosting",
            "DSM spike and pit", "four-day temporal mismatch", "inconsistent NoData values", "ambiguous Red Edge reflectance scale",
        ],
        "assets": assets,
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf8")


if __name__ == "__main__":
    main()
