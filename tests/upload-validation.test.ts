import { describe, expect, it } from "vitest";
import { safeStorageFileName, validateAcademyUpload } from "../lib/upload-validation";

function candidate(name: string, type: string, size = 1024) {
  return { name, type, size } as Pick<File, "name" | "type" | "size">;
}

describe("Academy upload validation", () => {
  it.each([
    ["map.png", "image/png"],
    ["map.jpg", "image/jpeg"],
    ["map.webp", "image/webp"],
    ["result.geojson", "application/geo+json"],
    ["surface.tif", "image/tiff"],
    ["metrics.csv", "text/csv"],
    ["report.pdf", "application/pdf"],
    ["analysis.ipynb", "application/json"],
    ["report.html", "text/html"],
    ["alignment_check.py", "text/x-python"],
    ["postgis_query.sql", "application/sql"],
    ["pipeline.sh", "application/x-sh"],
    ["workflow.yml", "application/yaml"],
    ["readme.md", "text/markdown"],
    ["stac_item.json", "application/json"],
    ["study.gpkg", "application/geopackage+sqlite3"],
    ["plots.parquet", "application/vnd.apache.parquet"],
    ["project.zip", "application/zip"],
  ])("accepts %s with a matching MIME type", (name, mimeType) => {
    expect(validateAcademyUpload(candidate(name, mimeType))).toMatchObject({ valid: true });
  });

  it("rejects unsupported extensions, MIME mismatches, empty files, and oversized files", () => {
    expect(validateAcademyUpload(candidate("script.exe", "application/octet-stream")).valid).toBe(false);
    expect(validateAcademyUpload(candidate("report.pdf", "image/png")).valid).toBe(false);
    expect(validateAcademyUpload(candidate("empty.csv", "text/csv", 0)).valid).toBe(false);
    expect(validateAcademyUpload(candidate("large.zip", "application/zip", 101), 100).valid).toBe(false);
  });

  it("creates safe user-scoped storage file names", () => {
    expect(safeStorageFileName("Baltic Meadow — Map 01.TIF")).toBe("baltic-meadow-map-01.tif");
  });
});
