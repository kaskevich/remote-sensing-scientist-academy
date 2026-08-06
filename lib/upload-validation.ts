export const DEFAULT_MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_SUBMISSION_FILES = 5;

const allowedFiles = {
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  webp: ["image/webp"],
  geojson: ["application/geo+json", "application/json", "text/plain", ""],
  tif: ["image/tiff", "image/geotiff", "application/geotiff", "application/octet-stream", ""],
  tiff: ["image/tiff", "image/geotiff", "application/geotiff", "application/octet-stream", ""],
  csv: ["text/csv", "application/csv", "application/vnd.ms-excel", "text/plain", ""],
  pdf: ["application/pdf"],
  ipynb: ["application/json", "text/plain", ""],
  html: ["text/html", ""],
  zip: ["application/zip", "application/x-zip-compressed", "application/octet-stream", ""],
} as const;

export type AcceptedFileExtension = keyof typeof allowedFiles;
export type UploadPreviewKind = "image" | "geojson" | "file";

export type UploadValidation =
  | { valid: true; extension: AcceptedFileExtension; previewKind: UploadPreviewKind }
  | { valid: false; error: string };

export function configuredMaxUploadBytes() {
  const configuredMegabytes = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ?? "50");
  if (!Number.isFinite(configuredMegabytes) || configuredMegabytes <= 0) {
    return DEFAULT_MAX_UPLOAD_BYTES;
  }

  return Math.round(configuredMegabytes * 1024 * 1024);
}

export function fileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function validateAcademyUpload(
  file: Pick<File, "name" | "type" | "size">,
  maxBytes = configuredMaxUploadBytes(),
): UploadValidation {
  const extension = fileExtension(file.name);
  if (!(extension in allowedFiles)) {
    return {
      valid: false,
      error: `${file.name} has an unsupported file type.`,
    };
  }

  if (file.size <= 0) {
    return { valid: false, error: `${file.name} is empty.` };
  }

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `${file.name} is larger than ${Math.round(maxBytes / 1024 / 1024)} MB.`,
    };
  }

  const typedExtension = extension as AcceptedFileExtension;
  const acceptedMimeTypes = allowedFiles[typedExtension] as readonly string[];
  if (!acceptedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `${file.name} does not match its expected file type.`,
    };
  }

  const previewKind: UploadPreviewKind = ["png", "jpg", "jpeg", "webp"].includes(extension)
    ? "image"
    : extension === "geojson"
      ? "geojson"
      : "file";

  return { valid: true, extension: typedExtension, previewKind };
}

export function safeStorageFileName(fileName: string) {
  const cleaned = fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return cleaned || "academy-file";
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
