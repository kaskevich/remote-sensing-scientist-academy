import ReactMarkdown from "react-markdown";
import { RemoteGeoJsonMap } from "@/app/components/geojson-map";

export type LessonImage = {
  src: string;
  alt: string;
  caption: string;
};

export type LessonResource = {
  href: string;
  title: string;
};

export type LessonMap = {
  src: string;
  title: string;
  caption: string;
};

export function MarkdownContent({ children }: { children: string }) {
  if (!children.trim()) {
    return null;
  }

  return (
    <div className="lesson-rich-text">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

export function LessonImageGallery({ images }: { images: LessonImage[] }) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="lesson-image-gallery">
      {images.map((image) => (
        <figure key={`${image.src}-${image.alt}`}>
          {/* Repository-managed lesson images have editor-defined dimensions. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={image.alt} src={image.src} />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

export function LessonResources({ resources }: { resources: LessonResource[] }) {
  if (resources.length === 0) {
    return null;
  }

  return (
    <div className="lesson-resource-list">
      {resources.map((resource) => (
        <a href={resource.href} key={`${resource.href}-${resource.title}`} target="_blank" rel="noreferrer">
          {resource.title || "Open lesson resource"} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

export function LessonMaps({ maps }: { maps: LessonMap[] }) {
  if (maps.length === 0) {
    return null;
  }

  return (
    <div className="lesson-map-list">
      {maps.map((map) => (
        <figure key={`${map.src}-${map.title}`}>
          <div className="lesson-map-heading">
            <strong>{map.title || "Reference map"}</strong>
            {map.caption && <span>{map.caption}</span>}
          </div>
          <RemoteGeoJsonMap src={map.src} label={map.title || "Lesson reference map"} />
        </figure>
      ))}
    </div>
  );
}
