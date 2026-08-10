"""Generate the synthetic Raster Science training pack.

Run this script only when the fixtures or their documented metadata change. The
outputs are intentionally small, openly reusable teaching data and do not
contain field observations or unpublished imagery.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
import rasterio
from rasterio.transform import from_origin
from rasterio.warp import transform as transform_coordinates
from rasterio.warp import transform_bounds


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/lesson-resources/module-2/raster-foundations"
TARGET_CRS = "EPSG:3301"
TARGET_TRANSFORM = from_origin(500_000, 6_500_120, 10, 10)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65_536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_raster(
    filename: str,
    array: np.ndarray,
    *,
    transform,
    crs: str | None,
    nodata: int | float | None,
    purpose: str,
    semantic_type: str,
    expected_qa: str,
    units: str,
    status: str = "Synthetic, openly reusable Academy training data",
) -> dict[str, object]:
    path = OUTPUT / filename
    bands = array[np.newaxis, ...] if array.ndim == 2 else array
    profile: dict[str, object] = {
        "driver": "GTiff",
        "height": bands.shape[1],
        "width": bands.shape[2],
        "count": bands.shape[0],
        "dtype": str(bands.dtype),
        "transform": transform,
        "nodata": nodata,
        "compress": "deflate",
    }
    if crs is not None:
        profile["crs"] = crs
    if bands.shape[1] >= 16 and bands.shape[2] >= 16:
        profile.update(tiled=True, blockxsize=64, blockysize=64)

    with rasterio.Env(GDAL_TIFF_INTERNAL_MASK=True):
        with rasterio.open(path, "w", **profile) as dst:
            dst.write(bands)
            dst.update_tags(
                ACADEMY_STATUS=status,
                MEASUREMENT_SEMANTICS=semantic_type,
                PURPOSE=purpose,
                UNITS=units,
            )
            for band_index in range(1, bands.shape[0] + 1):
                dst.set_band_description(band_index, f"{semantic_type} band {band_index}")

    with rasterio.open(path) as src:
        return {
            "filename": filename,
            "purpose": purpose,
            "crs": src.crs.to_string() if src.crs else None,
            "transform": list(src.transform)[:6],
            "resolution": [abs(src.res[0]), abs(src.res[1])],
            "shape": [src.height, src.width],
            "bounds": [src.bounds.left, src.bounds.bottom, src.bounds.right, src.bounds.top],
            "bandCount": src.count,
            "dtype": src.dtypes[0],
            "nodata": src.nodata,
            "semanticType": semantic_type,
            "units": units,
            "expectedQaBehavior": expected_qa,
            "syntheticOpenStatus": status,
            "sha256": sha256(path),
        }


def transformed_ring(ring: list[tuple[float, float]]) -> list[list[float]]:
    xs, ys = zip(*ring)
    lon, lat = transform_coordinates(TARGET_CRS, "EPSG:4326", xs, ys)
    return [[round(x, 8), round(y, 8)] for x, y in zip(lon, lat, strict=True)]


def write_support_vectors() -> list[dict[str, str]]:
    site_ring = [
        (500_000, 6_500_000),
        (500_120, 6_500_000),
        (500_120, 6_500_120),
        (500_000, 6_500_120),
        (500_000, 6_500_000),
    ]
    plot_rings = [
        [(500_010, 6_500_090), (500_040, 6_500_090), (500_040, 6_500_120), (500_010, 6_500_120), (500_010, 6_500_090)],
        [(500_050, 6_500_040), (500_080, 6_500_040), (500_080, 6_500_070), (500_050, 6_500_070), (500_050, 6_500_040)],
        [(500_090, 6_500_000), (500_120, 6_500_000), (500_120, 6_500_030), (500_090, 6_500_030), (500_090, 6_500_000)],
    ]
    assets: list[tuple[str, dict[str, object]]] = [
        (
            "training_site_boundary.geojson",
            {
                "type": "FeatureCollection",
                "academyStatus": "Synthetic, openly reusable Academy training data",
                "features": [{
                    "type": "Feature",
                    "properties": {"site_id": "SYN_SITE", "status": "synthetic"},
                    "geometry": {"type": "Polygon", "coordinates": [transformed_ring(site_ring)]},
                }],
            },
        ),
        (
            "training_plot_polygons.geojson",
            {
                "type": "FeatureCollection",
                "academyStatus": "Synthetic, openly reusable Academy training data",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {"plot_id": f"RP{index:02d}", "support": "30 m synthetic footprint"},
                        "geometry": {"type": "Polygon", "coordinates": [transformed_ring(ring)]},
                    }
                    for index, ring in enumerate(plot_rings, start=1)
                ],
            },
        ),
    ]

    manifest: list[dict[str, str]] = []
    for filename, data in assets:
        path = OUTPUT / filename
        path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf8")
        manifest.append({
            "filename": filename,
            "purpose": "Synthetic study boundary" if "site" in filename else "Synthetic extraction support polygons",
            "crs": "OGC:CRS84 (RFC 7946 longitude, latitude)",
            "sha256": sha256(path),
            "syntheticOpenStatus": "Synthetic, openly reusable Academy training data",
        })
    return manifest


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    rows, cols = np.indices((12, 12))
    continuous = (0.12 + rows * 0.006 + cols * 0.004).astype("float32")
    continuous[0, 0] = -9999
    categorical = ((rows // 4 + cols // 4) % 3 + 1).astype("uint8")
    categorical[0, 0] = 255

    dem = (2.0 + rows * 0.18 + cols * 0.06).astype("float32")
    dem[0, 0] = -9999
    surface_addition = np.zeros((12, 12), dtype="float32")
    surface_addition[3:7, 4:8] = np.array([
        [0.2, 0.5, 0.5, 0.2],
        [0.5, 1.2, 1.3, 0.5],
        [0.4, 1.0, 1.1, 0.4],
        [0.2, 0.4, 0.4, 0.2],
    ], dtype="float32")
    dsm = dem.copy()
    valid_dem = dem != -9999
    dsm[valid_dem] += surface_addition[valid_dem]

    assets: list[dict[str, object]] = []
    assets.append(write_raster(
        "aligned_continuous.tif", continuous, transform=TARGET_TRANSFORM, crs=TARGET_CRS, nodata=-9999,
        purpose="Reference grid and continuous-variable example", semantic_type="continuous surface reflectance proxy",
        expected_qa="Reference grid; opens with 10 m cells, EPSG:3301 and one NoData cell", units="unitless synthetic fraction",
    ))
    assets.append(write_raster(
        "aligned_categorical.tif", categorical, transform=TARGET_TRANSFORM, crs=TARGET_CRS, nodata=255,
        purpose="Categorical-variable and nearest-neighbour example", semantic_type="categorical habitat class",
        expected_qa="Aligns with the reference grid; valid labels remain 1, 2 or 3", units="class code",
    ))
    assets.append(write_raster(
        "shifted_origin.tif", continuous, transform=from_origin(500_005, 6_500_125, 10, 10), crs=TARGET_CRS, nodata=-9999,
        purpose="Half-cell origin mismatch", semantic_type="continuous surface reflectance proxy",
        expected_qa="Same CRS, resolution and shape as reference but transform, origin and bounds must fail alignment", units="unitless synthetic fraction",
    ))
    assets.append(write_raster(
        "different_crs.tif", continuous, transform=from_origin(24.72, 58.59, 0.0001, 0.0001), crs="EPSG:4326", nodata=-9999,
        purpose="CRS mismatch example", semantic_type="continuous surface reflectance proxy",
        expected_qa="CRS and grid contract differ from EPSG:3301 reference", units="unitless synthetic fraction",
    ))
    coarse = continuous.reshape(6, 2, 6, 2).mean(axis=(1, 3)).astype("float32")
    assets.append(write_raster(
        "different_resolution.tif", coarse, transform=from_origin(500_000, 6_500_120, 20, 20), crs=TARGET_CRS, nodata=-9999,
        purpose="Resolution mismatch example", semantic_type="continuous surface reflectance proxy",
        expected_qa="Shares broad extent and CRS but has 20 m cells and 6 by 6 shape", units="unitless synthetic fraction",
    ))
    assets.append(write_raster(
        "cropped_extent.tif", continuous[1:10, 2:11], transform=from_origin(500_020, 6_500_110, 10, 10), crs=TARGET_CRS, nodata=-9999,
        purpose="Cropped-extent mismatch example", semantic_type="continuous surface reflectance proxy",
        expected_qa="Resolution and CRS match but bounds and dimensions differ", units="unitless synthetic fraction",
    ))
    conflicting = continuous.copy()
    conflicting[2, 2] = 0.0
    conflicting[4, 4] = -9999
    assets.append(write_raster(
        "conflicting_nodata.tif", conflicting, transform=TARGET_TRANSFORM, crs=TARGET_CRS, nodata=-9999,
        purpose="NoData-versus-valid-zero example", semantic_type="continuous measurement with valid zero",
        expected_qa="Zero remains valid; only -9999 is masked. NoData semantics conflict with any workflow that assumes zero is missing", units="synthetic index",
    ))
    assets.append(write_raster(
        "missing_crs.tif", continuous, transform=TARGET_TRANSFORM, crs=None, nodata=-9999,
        purpose="Missing-CRS stop condition", semantic_type="continuous surface reflectance proxy",
        expected_qa="Must be quarantined from reprojection or overlay until source CRS is verified", units="unitless synthetic fraction",
    ))
    assets.append(write_raster(
        "training_dem.tif", dem, transform=TARGET_TRANSFORM, crs=TARGET_CRS, nodata=-9999,
        purpose="Terrain-surface derivative exercise", semantic_type="synthetic terrain elevation model",
        expected_qa="Aligned terrain surface with horizontal EPSG:3301; vertical datum deliberately undocumented", units="metres (synthetic; vertical datum undocumented)",
    ))
    assets.append(write_raster(
        "training_dsm.tif", dsm, transform=TARGET_TRANSFORM, crs=TARGET_CRS, nodata=-9999,
        purpose="Upper-surface interpretation exercise", semantic_type="synthetic digital surface model",
        expected_qa="Aligned with DEM, but DSM minus DEM is only a synthetic surface difference, not validated vegetation height", units="metres (synthetic; vertical datum undocumented)",
    ))

    large_rows, large_cols = np.indices((256, 256))
    tiled = (0.2 + 0.0005 * large_rows + 0.0003 * large_cols).astype("float32")
    tiled[:8, :8] = -9999
    assets.append(write_raster(
        "large_tiled_continuous.tif", tiled, transform=from_origin(500_000, 6_502_560, 10, 10), crs=TARGET_CRS, nodata=-9999,
        purpose="Windowed and block-wise processing exercise", semantic_type="continuous synthetic raster",
        expected_qa="Contains sixteen 64 by 64 blocks for block_windows and equivalence checks", units="unitless synthetic fraction",
    ))

    assets.append(write_raster(
        "practicum_red.tif", continuous, transform=TARGET_TRANSFORM, crs=TARGET_CRS, nodata=-9999,
        purpose="Practicum target-grid Red band", semantic_type="continuous red reflectance proxy",
        expected_qa="Defines the justified target grid after inventory review", units="unitless synthetic fraction",
    ))
    rededge = (continuous * 1.18).astype("float32")
    assets.append(write_raster(
        "practicum_rededge_shifted.tif", rededge, transform=from_origin(500_005, 6_500_125, 10, 10), crs=TARGET_CRS, nodata=-9999,
        purpose="Practicum shifted-origin Red Edge band", semantic_type="continuous red-edge reflectance proxy",
        expected_qa="Requires snapping/reprojection to the target transform despite matching CRS and nominal resolution", units="unitless synthetic fraction",
    ))
    nir = np.where(coarse == -9999, -9999, coarse * 1.45).astype("float32")
    assets.append(write_raster(
        "practicum_nir_20m.tif", nir, transform=from_origin(500_000, 6_500_120, 20, 20), crs=TARGET_CRS, nodata=-9999,
        purpose="Practicum coarse NIR band", semantic_type="continuous near-infrared reflectance proxy",
        expected_qa="Requires a documented continuous resampling decision to the 10 m target grid", units="unitless synthetic fraction",
    ))
    left, bottom, right, top = transform_bounds(TARGET_CRS, "EPSG:4326", 500_000, 6_500_000, 500_120, 6_500_120, densify_pts=21)
    dsm_wgs84_transform = from_origin(left, top, (right - left) / 12, (top - bottom) / 12)
    assets.append(write_raster(
        "practicum_dsm_wgs84.tif", dsm, transform=dsm_wgs84_transform, crs="EPSG:4326", nodata=-9999,
        purpose="Practicum DSM in a different horizontal CRS", semantic_type="synthetic digital surface model",
        expected_qa="Requires reprojection to EPSG:3301 and explicit vertical-reference limitation", units="metres (synthetic; vertical datum undocumented)",
    ))
    assets.append(write_raster(
        "practicum_habitat_cropped.tif", categorical[1:11, 1:11], transform=from_origin(500_010, 6_500_110, 10, 10), crs=TARGET_CRS, nodata=255,
        purpose="Practicum categorical habitat layer with cropped extent", semantic_type="categorical habitat class",
        expected_qa="Requires nearest-neighbour assignment and a declared union/intersection extent policy", units="class code",
    ))

    vector_assets = write_support_vectors()
    manifest = {
        "title": "Module 2 Raster Science synthetic training pack",
        "generatedWith": {"python": "3.12.13", "rasterio": rasterio.__version__, "numpy": np.__version__},
        "coordinateNote": "Raster coordinates are synthetic. Support GeoJSON follows RFC 7946 longitude/latitude order.",
        "licence": "CC0-1.0; generated synthetic data with no unpublished or personal information",
        "assets": assets,
        "supportVectors": vector_assets,
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf8")


if __name__ == "__main__":
    main()
