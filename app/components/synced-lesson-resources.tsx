"use client";

import { useEffect, useState } from "react";
import { useAcademyAuth } from "@/app/components/academy-auth-provider";
import type { AcademyResource } from "@/lib/platform-types";
import { formatFileSize } from "@/lib/upload-validation";

const RESOURCE_BUCKET = "lesson-resources";

function mapResource(row: Record<string, unknown>): AcademyResource {
  return {
    id: String(row.id),
    moduleId: typeof row.module_id === "string" ? row.module_id : null,
    lessonId: typeof row.lesson_id === "string" ? row.lesson_id : null,
    title: String(row.title),
    description: typeof row.description === "string" ? row.description : "",
    storagePath: String(row.storage_path),
    fileName: String(row.file_name),
    mimeType: String(row.mime_type ?? "application/octet-stream"),
    sizeBytes: Number(row.size_bytes ?? 0),
    licenseSource: typeof row.license_source === "string" ? row.license_source : "",
    visibility:
      row.visibility === "authenticated" || row.visibility === "draft"
        ? row.visibility
        : "public",
    ordering: Number(row.ordering ?? 0),
    createdAt: String(row.created_at),
  };
}

export default function SyncedLessonResources({ lessonId }: { lessonId: string }) {
  const auth = useAcademyAuth();
  const [resources, setResources] = useState<AcademyResource[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!auth.client) return;
    let active = true;
    void auth.client
      .from("resource_files")
      .select("id,module_id,lesson_id,title,description,storage_path,file_name,mime_type,size_bytes,license_source,visibility,ordering,created_at")
      .eq("lesson_id", lessonId)
      .order("ordering")
      .then(({ data }) => {
        if (active) {
          setResources(((data ?? []) as Array<Record<string, unknown>>).map(mapResource));
        }
      });
    return () => {
      active = false;
    };
  }, [auth.client, auth.dataRevision, lessonId]);

  async function downloadResource(resource: AcademyResource) {
    if (!auth.client) return;
    setMessage(`Preparing ${resource.title}…`);
    const { data, error } = await auth.client.storage
      .from(RESOURCE_BUCKET)
      .download(resource.storagePath);
    if (error || !data) {
      setMessage("This resource could not be downloaded with the current account.");
      return;
    }
    const url = URL.createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = resource.fileName;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    setMessage("");
  }

  if (resources.length === 0) return null;

  return (
    <section className="synced-resources" aria-labelledby={`${lessonId}-resources-title`}>
      <h4 id={`${lessonId}-resources-title`}>Instructor resources</h4>
      <ul>
        {resources.map((resource) => (
          <li key={resource.id}>
            <div>
              <strong>{resource.title}</strong>
              {resource.description && <p>{resource.description}</p>}
              <small>
                {resource.fileName} · {formatFileSize(resource.sizeBytes)}
                {resource.licenseSource ? ` · ${resource.licenseSource}` : ""}
              </small>
            </div>
            <button type="button" onClick={() => void downloadResource(resource)}>
              Secure download
            </button>
          </li>
        ))}
      </ul>
      {message && <p role="status">{message}</p>}
    </section>
  );
}
