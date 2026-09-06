#!/usr/bin/env Rscript

suppressPackageStartupMessages({
  library(terra)
  library(png)
})

args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 2) {
  stop("Usage: Rscript scripts/prepare-uav-band-examples.R <Matsalu_Noarootsi_juuli_2024> <public output directory>")
}

source_root <- normalizePath(args[[1]], mustWork = TRUE)
output_dir <- args[[2]]
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

sources <- c(
  Green = file.path(source_root, "Dataset_VI", "Saardu_Green_fin.tif"),
  Red = file.path(source_root, "Dataset_VI", "Saardu_Red_clipped.tif"),
  RedEdge = file.path(source_root, "Dataset_VI", "Saardu_RedEdge_fin.tif"),
  NIR = file.path(source_root, "Dataset_VI", "Saardu_NIR_fin.tif")
)
rgb_source <- file.path(source_root, "Saardu_orthomosaic_clipped.tif")
stopifnot(file.exists(rgb_source), all(file.exists(sources)))

bands <- lapply(sources, rast)
reference <- bands[[1]]
for (band in bands[-1]) {
  if (!compareGeom(reference, band, stopOnError = FALSE)) stop("Saardu reflectance-band geometries do not match")
}

target <- rast(
  nrows = 1200,
  ncols = 1200,
  xmin = xmin(reference),
  xmax = xmax(reference),
  ymin = ymin(reference),
  ymax = ymax(reference),
  crs = crs(reference)
)

write_rgba <- function(array, filename) {
  writePNG(array, target = file.path(output_dir, filename))
}

rgb <- rast(rgb_source)
if (nlyr(rgb) < 3) stop("Expected at least three layers in the Saardu RGB orthomosaic")
rgb_display <- resample(rgb[[1:3]], target, method = "bilinear")
rgb_array <- as.array(rgb_display) / 255
rgb_alpha <- if (nlyr(rgb) >= 4) as.array(resample(rgb[[4]], target, method = "near"))[, , 1] / 255 else matrix(1, nrow(target), ncol(target))
rgba <- array(0, dim = c(nrow(target), ncol(target), 4))
rgba[, , 1:3] <- pmax(0, pmin(1, rgb_array))
rgba[, , 4] <- pmax(0, pmin(1, rgb_alpha))
write_rgba(rgba, "saardu-rgb.png")

render_band <- function(band, filename) {
  display <- resample(band, target, method = "bilinear")
  sampled <- spatSample(band, size = 100000, method = "regular", na.rm = TRUE, values = TRUE)
  limits <- as.numeric(quantile(sampled[, 1], probs = c(0.02, 0.98), na.rm = TRUE, names = FALSE))
  values_vector <- values(display, mat = FALSE)
  scaled <- (values_vector - limits[[1]]) / (limits[[2]] - limits[[1]])
  scaled <- pmax(0, pmin(1, scaled))
  valid <- !is.na(scaled)
  channel <- matrix(ifelse(valid, scaled, 0), nrow = nrow(target), ncol = ncol(target), byrow = TRUE)
  band_rgba <- array(0, dim = c(nrow(target), ncol(target), 4))
  band_rgba[, , 1] <- channel
  band_rgba[, , 2] <- channel
  band_rgba[, , 3] <- channel
  band_rgba[, , 4] <- matrix(as.numeric(valid), nrow = nrow(target), ncol = ncol(target), byrow = TRUE)
  write_rgba(band_rgba, filename)
  limits
}

display_limits <- list()
for (name in names(bands)) {
  display_limits[[name]] <- render_band(bands[[name]], paste0("saardu-", tolower(name), ".png"))
}

metadata <- list(
  site = "Saardu",
  source_files = list(
    RGB = basename(rgb_source),
    Green = basename(sources[["Green"]]),
    Red = basename(sources[["Red"]]),
    RedEdge = basename(sources[["RedEdge"]]),
    NIR = basename(sources[["NIR"]])
  ),
  output_size = c(width = 1200, height = 1200),
  reflectance_source_geometry = list(
    rows = nrow(reference),
    columns = ncol(reference),
    resolution_metres = unname(res(reference)),
    crs = crs(reference, proj = TRUE)
  ),
  rgb_source_geometry = list(
    rows = nrow(rgb),
    columns = ncol(rgb),
    layers = nlyr(rgb),
    resolution_metres = unname(res(rgb)),
    crs = crs(rgb, proj = TRUE)
  ),
  reflectance_display = "Each band is independently linearly stretched from its sampled 2nd to 98th percentile and rendered in grayscale. This is a display transformation only; source reflectance values are not embedded in the PNG.",
  resampling = "All public examples are resampled to one 1200 × 1200 display grid covering the common Saardu reflectance extent. Bilinear resampling is used for RGB and reflectance; nearest-neighbour resampling is used for the RGB alpha mask.",
  display_limits = display_limits,
  project_provenance = "Processed rasters from the 2024 Saardu UAV campaign"
)

json <- jsonlite::toJSON(metadata, pretty = TRUE, auto_unbox = TRUE, digits = 8)
writeLines(json, file.path(output_dir, "band-example-metadata.json"))
