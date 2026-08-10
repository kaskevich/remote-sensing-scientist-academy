"""Validate Raster Science training assets and scientific QA rules."""

from __future__ import annotations

import csv
import hashlib
import json
import tempfile
from pathlib import Path

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.features import geometry_mask
from rasterio.warp import reproject, transform_geom


ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "public/lesson-resources/module-2/raster-foundations"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def close_tuple(left, right, tolerance=1e-9) -> bool:
    return len(left) == len(right) and all(abs(a - b) <= tolerance for a, b in zip(left, right, strict=True))


def alignment(left: rasterio.DatasetReader, right: rasterio.DatasetReader) -> dict[str, bool]:
    checks = {
        "same_crs": left.crs == right.crs,
        "same_transform": left.transform.almost_equals(right.transform),
        "same_resolution": close_tuple(left.res, right.res),
        "same_shape": left.shape == right.shape,
        "same_bounds": close_tuple(tuple(left.bounds), tuple(right.bounds)),
        "same_nodata": left.nodata == right.nodata,
    }
    checks["aligned"] = all(checks[key] for key in ("same_crs", "same_transform", "same_resolution", "same_shape", "same_bounds"))
    return checks


def validate_manifest() -> dict[str, object]:
    manifest = json.loads((FOLDER / "manifest.json").read_text(encoding="utf8"))
    assert manifest["licence"].startswith("CC0")
    assert len(manifest["assets"]) >= 15
    for asset in manifest["assets"]:
        path = FOLDER / asset["filename"]
        assert path.exists(), asset["filename"]
        assert sha256(path) == asset["sha256"], asset["filename"]
        with rasterio.open(path) as src:
            assert (src.crs.to_string() if src.crs else None) == asset["crs"]
            assert close_tuple(list(src.transform)[:6], asset["transform"])
            assert close_tuple([abs(src.res[0]), abs(src.res[1])], asset["resolution"])
            assert [src.height, src.width] == asset["shape"]
            assert close_tuple(tuple(src.bounds), asset["bounds"])
            assert src.dtypes[0] == asset["dtype"]
            assert src.nodata == asset["nodata"]
            assert src.count == asset["bandCount"]
            assert asset["semanticType"]
            assert asset["expectedQaBehavior"]
            assert "Synthetic" in asset["syntheticOpenStatus"]
    for vector in manifest["supportVectors"]:
        path = FOLDER / vector["filename"]
        assert sha256(path) == vector["sha256"]
        source = json.loads(path.read_text(encoding="utf8"))
        assert source["type"] == "FeatureCollection"
        assert source["features"]
    return manifest


def validate_alignment_cases() -> None:
    with rasterio.open(FOLDER / "aligned_continuous.tif") as reference:
        with rasterio.open(FOLDER / "aligned_categorical.tif") as categorical:
            result = alignment(reference, categorical)
            assert result["aligned"] is True
            assert result["same_nodata"] is False
        with rasterio.open(FOLDER / "shifted_origin.tif") as shifted:
            result = alignment(reference, shifted)
            assert result["same_crs"] and result["same_resolution"] and result["same_shape"]
            assert not result["same_transform"] and not result["same_bounds"] and not result["aligned"]
        with rasterio.open(FOLDER / "different_crs.tif") as changed_crs:
            assert alignment(reference, changed_crs)["same_crs"] is False
        with rasterio.open(FOLDER / "different_resolution.tif") as changed_resolution:
            result = alignment(reference, changed_resolution)
            assert result["same_resolution"] is False and result["same_shape"] is False
        with rasterio.open(FOLDER / "cropped_extent.tif") as cropped:
            result = alignment(reference, cropped)
            assert result["same_bounds"] is False and result["same_shape"] is False


def validate_resampling_and_nodata() -> None:
    with rasterio.open(FOLDER / "aligned_categorical.tif") as src:
        source = src.read(1)
        nearest = np.full((24, 24), 255, dtype="uint8")
        reproject(
            source=source,
            destination=nearest,
            src_transform=src.transform,
            src_crs=src.crs,
            src_nodata=src.nodata,
            dst_transform=rasterio.transform.from_origin(500_000, 6_500_120, 5, 5),
            dst_crs=src.crs,
            dst_nodata=255,
            resampling=Resampling.nearest,
        )
        assert set(np.unique(nearest)).issubset({1, 2, 3, 255})

        bilinear = np.full((24, 24), np.nan, dtype="float32")
        reproject(
            source=source.astype("float32"),
            destination=bilinear,
            src_transform=src.transform,
            src_crs=src.crs,
            src_nodata=src.nodata,
            dst_transform=rasterio.transform.from_origin(500_000, 6_500_120, 5, 5),
            dst_crs=src.crs,
            dst_nodata=np.nan,
            resampling=Resampling.bilinear,
        )
        finite = bilinear[np.isfinite(bilinear)]
        assert np.any(~np.isin(np.round(finite, 6), [1.0, 2.0, 3.0]))

    with rasterio.open(FOLDER / "conflicting_nodata.tif") as src:
        masked = src.read(1, masked=True)
        assert masked.mask.sum() >= 2
        zero_positions = np.argwhere(masked.data == 0)
        assert len(zero_positions) == 1
        row, col = zero_positions[0]
        assert not bool(masked.mask[row, col])


def validate_roundtrip_and_windows() -> None:
    with rasterio.open(FOLDER / "aligned_continuous.tif") as src:
        profile = src.profile.copy()
        source = src.read(1, masked=True)
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / "roundtrip.tif"
            with rasterio.open(output, "w", **profile) as dst:
                dst.write(source.filled(src.nodata), 1)
            with rasterio.open(output) as reopened:
                assert reopened.crs == src.crs
                assert reopened.transform.almost_equals(src.transform)
                assert reopened.shape == src.shape
                assert reopened.nodata == src.nodata
                np.testing.assert_allclose(reopened.read(1), source.filled(src.nodata))

    with rasterio.open(FOLDER / "large_tiled_continuous.tif") as src:
        full = src.read(1, masked=True)
        valid_sum = 0.0
        valid_count = 0
        windows = 0
        for _, window in src.block_windows(1):
            block = src.read(1, window=window, masked=True)
            valid_sum += float(block.sum())
            valid_count += int(block.count())
            windows += 1
        assert windows == 16
        assert valid_count == full.count()
        assert np.isclose(valid_sum, float(full.sum()), rtol=1e-6)


def validate_extraction_and_terrain() -> None:
    vectors = json.loads((FOLDER / "training_plot_polygons.geojson").read_text(encoding="utf8"))
    with rasterio.open(FOLDER / "aligned_continuous.tif") as src:
        rows: list[dict[str, object]] = []
        band = src.read(1, masked=True)
        for feature in vectors["features"]:
            geometry = transform_geom("EPSG:4326", src.crs, feature["geometry"])
            valid_inside = geometry_mask(
                [geometry],
                transform=src.transform,
                out_shape=src.shape,
                invert=True,
            ) & ~np.ma.getmaskarray(band)
            values = band.data[valid_inside]
            rows.append({
                "plot_id": feature["properties"]["plot_id"],
                "extraction_method": "polygon mean",
                "valid_cell_count": int(values.size),
                "valid_fraction": float(valid_inside.sum() / geometry_mask(
                    [geometry], transform=src.transform, out_shape=src.shape, invert=True
                ).sum()),
                "value": float(values.mean()),
                "raster_source": "aligned_continuous.tif",
                "spatial_support_note": feature["properties"]["support"],
            })
        assert len(rows) == 3
        assert all(row["valid_cell_count"] > 0 for row in rows)
        with tempfile.TemporaryDirectory() as folder:
            table = Path(folder) / "extraction_table.csv"
            with table.open("w", newline="", encoding="utf8") as handle:
                writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
                writer.writeheader()
                writer.writerows(rows)
            assert table.read_text(encoding="utf8").startswith("plot_id,extraction_method,valid_cell_count")

    with rasterio.open(FOLDER / "training_dem.tif") as dem_source:
        dem = dem_source.read(1, masked=True).filled(np.nan)
        dz_dy, dz_dx = np.gradient(dem, abs(dem_source.res[1]), abs(dem_source.res[0]))
        slope = np.degrees(np.arctan(np.hypot(dz_dx, dz_dy))).astype("float32")
        slope[~np.isfinite(slope)] = -9999
        profile = dem_source.profile.copy()
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / "slope_degrees.tif"
            with rasterio.open(output, "w", **profile) as dst:
                dst.write(slope, 1)
                dst.update_tags(UNITS="degrees", SOURCE_SURFACE="training_dem.tif")
            with rasterio.open(output) as reopened:
                assert reopened.tags()["UNITS"] == "degrees"
                assert reopened.crs == dem_source.crs
                assert reopened.transform.almost_equals(dem_source.transform)
                assert reopened.nodata == dem_source.nodata
                assert float(reopened.read(1, masked=True).max()) < 90


def main() -> None:
    validate_manifest()
    validate_alignment_cases()
    validate_resampling_and_nodata()
    validate_roundtrip_and_windows()
    validate_extraction_and_terrain()
    print("Raster training pack: metadata, alignment, resampling, NoData, round-trip, extraction, windows and terrain checks passed")


if __name__ == "__main__":
    main()
