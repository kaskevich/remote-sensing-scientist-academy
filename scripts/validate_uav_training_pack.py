"""Validate Chapter 4 UAV fixtures and their deliberate scientific defects."""

from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

import numpy as np
import rasterio


ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "public/lesson-resources/module-2/uav-foundations"
NODATA = -9999.0


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_csv(filename: str) -> list[dict[str, str]]:
    with (FOLDER / filename).open(newline="", encoding="utf8") as handle:
        return list(csv.DictReader(handle))


def root_mean_square(values: np.ndarray) -> float:
    return float(np.sqrt(np.mean(np.square(values))))


def planimetric_rmse(rows: list[dict[str, str]]) -> float:
    east = np.array([float(row["east_residual_m"]) for row in rows])
    north = np.array([float(row["north_residual_m"]) for row in rows])
    return float(np.sqrt(root_mean_square(east) ** 2 + root_mean_square(north) ** 2))


def safe_normalised_difference(first: np.ndarray, second: np.ndarray, valid: np.ndarray) -> np.ndarray:
    denominator = first + second
    use = valid & np.isfinite(first) & np.isfinite(second) & (np.abs(denominator) > 1e-8)
    result = np.full(first.shape, np.nan, dtype="float32")
    result[use] = (first[use] - second[use]) / denominator[use]
    return result


def validate_manifest_and_files() -> dict[str, object]:
    manifest = json.loads((FOLDER / "manifest.json").read_text(encoding="utf8"))
    assert manifest["licence"].startswith("CC0")
    expected_conditions = {
        "variable illumination", "weak south-east georeferencing", "half-pixel NIR shift", "orthomosaic seam and ghosting",
        "DSM spike and pit", "four-day temporal mismatch", "inconsistent NoData values", "ambiguous Red Edge reflectance scale",
    }
    assert set(manifest["knownDeliberateConditions"]) == expected_conditions
    assert len(manifest["assets"]) == 16
    for asset in manifest["assets"]:
        path = FOLDER / asset["filename"]
        assert path.exists(), asset["filename"]
        assert sha256(path) == asset["checksum"], asset["filename"]
        assert asset["purpose"] and asset["dataType"] and asset["sourceStatus"]
        assert asset["semanticMeaning"] and asset["expectedQaIssue"] and asset["licenceStatus"]
        if path.suffix == ".tif":
            with rasterio.open(path) as src:
                assert src.crs.to_string() == asset["crs"]
                assert list(src.shape) == asset["shape"]
                assert src.count == asset["bandCount"]
                assert src.dtypes[0] == asset["dataType"]
                assert src.nodata == asset["nodata"]
                assert np.allclose(list(src.transform)[:6], asset["transform"])
                assert np.allclose([abs(src.res[0]), abs(src.res[1])], asset["resolution"])
    return manifest


def validate_tables_and_vectors() -> None:
    mission = read_csv("mission_metadata.csv")
    images = read_csv("image_metadata.csv")
    gcps = read_csv("gcp_residuals.csv")
    checkpoints = read_csv("checkpoint_residuals.csv")
    assert len(mission) == 1 and len(images) == 12 and len(gcps) == 6 and len(checkpoints) == 5
    assert all(row["role"] == "control" for row in gcps)
    assert all(row["role"] == "check" for row in checkpoints)
    assert any(float(row["blur_score_px"]) > 1.0 for row in images)
    assert any(float(row["saturation_fraction"]) > 0.05 for row in images)
    assert len({row["exposure_s"] for row in images}) == 2
    assert mission[0]["field_sampling_date"] != mission[0]["start_utc"][:10]

    for filename in ("study_area.geojson", "field_plots.geojson"):
        source = json.loads((FOLDER / filename).read_text(encoding="utf8"))
        assert source["type"] == "FeatureCollection"
        assert source["features"]
        assert all(feature["geometry"]["type"] == "Polygon" for feature in source["features"])

    report = json.loads((FOLDER / "photogrammetry_report.json").read_text(encoding="utf8"))
    assert report["imagesAligned"] < report["imagesTotal"]
    assert report["reprojectionErrorPixels"] < 1
    assert "absolute" not in " ".join(report["softwareNeutralStages"]).lower()
    assert report["weakRegion"] == "south-east block edge"


def validate_mission_geometry() -> None:
    mission = read_csv("mission_metadata.csv")[0]
    sensor_width_mm = float(mission["sensor_width_mm"])
    image_width_px = float(mission["image_width_px"])
    focal_length_mm = float(mission["focal_length_mm"])
    height_m = float(mission["nominal_height_agl_m"])
    pixel_size_mm = sensor_width_mm / image_width_px
    gsd_m = pixel_size_mm * height_m / focal_length_mm
    footprint_width_m = height_m * sensor_width_mm / focal_length_mm
    footprint_height_m = height_m * float(mission["sensor_height_mm"]) / focal_length_mm
    forward_spacing_m = footprint_height_m * (1 - float(mission["forward_overlap_pct"]) / 100)
    side_spacing_m = footprint_width_m * (1 - float(mission["side_overlap_pct"]) / 100)
    assert np.isclose(gsd_m, 0.02192982456)
    assert np.isclose(footprint_width_m, 120)
    assert np.isclose(footprint_height_m, 80)
    assert np.isclose(forward_spacing_m, 16)
    assert np.isclose(side_spacing_m, 36)


def validate_georeferencing() -> None:
    gcps = read_csv("gcp_residuals.csv")
    checkpoints = read_csv("checkpoint_residuals.csv")
    gcp_rmse = planimetric_rmse(gcps)
    checkpoint_rmse = planimetric_rmse(checkpoints)
    assert gcp_rmse < 0.025
    assert checkpoint_rmse > gcp_rmse * 3
    east = np.array([float(row["east_residual_m"]) for row in checkpoints])
    north = np.array([float(row["north_residual_m"]) for row in checkpoints])
    vertical = np.array([float(row["vertical_residual_m"]) for row in checkpoints])
    assert east.mean() > 0 and north.mean() < 0 and vertical.mean() > 0
    assert max(np.hypot(east, north)) > 0.15
    assert checkpoints[int(np.argmax(np.hypot(east, north)))]["region"] == "south-east weak block"


def validate_rasters_and_defects() -> None:
    with rasterio.open(FOLDER / "uav_red.tif") as red_src, rasterio.open(FOLDER / "uav_nir.tif") as nir_src:
        assert red_src.crs == nir_src.crs
        assert red_src.transform.almost_equals(nir_src.transform)
        assert red_src.shape == nir_src.shape
        red = red_src.read(1, masked=True)
        nir = nir_src.read(1, masked=True)
        valid = ~np.ma.getmaskarray(red) & ~np.ma.getmaskarray(nir)
        ndvi = safe_normalised_difference(nir.data, red.data, valid)
        assert np.nanmin(ndvi) >= -1 and np.nanmax(ndvi) <= 1
        assert np.isnan(ndvi[:2, :2]).all()

    with rasterio.open(FOLDER / "uav_nir_shifted.tif") as shifted:
        assert shifted.crs == red_src.crs
        assert shifted.res == red_src.res and shifted.shape == red_src.shape
        assert not shifted.transform.almost_equals(red_src.transform)

    with rasterio.open(FOLDER / "uav_rededge.tif") as rededge:
        values = rededge.read(1, masked=True)
        assert float(values.min()) > 1
        assert "ambiguous" in rededge.tags()["REFLECTANCE_SCALE_STATUS"]
        assert rededge.nodata != NODATA

    first = np.array([[0.4, 0.0, np.nan]], dtype="float32")
    second = np.array([[0.2, 0.0, 0.2]], dtype="float32")
    checked = safe_normalised_difference(first, second, np.ones(first.shape, dtype=bool))
    assert np.isclose(checked[0, 0], 1 / 3)
    assert np.isnan(checked[0, 1]) and np.isnan(checked[0, 2])

    with rasterio.open(FOLDER / "uav_dsm.tif") as clean_src, rasterio.open(FOLDER / "uav_dsm_spike_demo.tif") as defect_src:
        clean = clean_src.read(1, masked=True)
        defect = defect_src.read(1, masked=True)
        assert float(clean.max()) < 5 and float(clean.min()) > 0
        assert float(defect.max()) == 18.5 and float(defect.min()) == -3.0
        assert np.count_nonzero(np.abs(defect.filled(np.nan) - clean.filled(np.nan)) > 1) == 2

    with rasterio.open(FOLDER / "uav_radiometric_gradient_demo.tif") as gradient_src:
        gradient = gradient_src.read(1, masked=True)
        left_mean = float(gradient[:, 3:10].mean())
        right_mean = float(gradient[:, 30:38].mean())
        assert right_mean > left_mean * 1.3

    with rasterio.open(FOLDER / "uav_rgb_preview.tif") as rgb_src:
        rgb = rgb_src.read()
        left = float(rgb[:, :, 16:20].mean())
        right = float(rgb[:, :, 24:28].mean())
        assert right < left * 0.85


def main() -> None:
    validate_manifest_and_files()
    validate_tables_and_vectors()
    validate_mission_geometry()
    validate_georeferencing()
    validate_rasters_and_defects()
    print("UAV training pack: manifest, mission geometry, residuals, alignment, radiometry, indices, DSM and deliberate defects passed")


if __name__ == "__main__":
    main()
