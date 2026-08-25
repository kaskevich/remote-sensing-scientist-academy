"use client";

import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RemoteGeoJsonMap } from "@/app/components/geojson-map";
import { extractLessonMath, LessonMath, renderInlineLessonMath } from "@/app/components/lesson-math";
import type { FormativeCheck } from "@/lib/module1-pedagogy";

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

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return nodeText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

function headingSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function FormativeCheckCard({
  check,
  lessonId,
  completed,
  onCompleted,
}: {
  check: FormativeCheck;
  lessonId: string;
  completed: boolean;
  onCompleted?: (checkId: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(() => completed ? check.correctOption : null);
  const [checkedOption, setCheckedOption] = useState<number | null>(() => completed ? check.correctOption : null);
  const isCorrect = checkedOption === check.correctOption;
  const checkName = `${lessonId}-${check.id}`;

  function checkAnswer() {
    if (selectedOption === null) return;
    setCheckedOption(selectedOption);
    if (selectedOption === check.correctOption) onCompleted?.(check.id);
  }

  return (
    <section className="formative-check" aria-labelledby={`${checkName}-title`}>
      <div className="formative-check-heading">
        <span>Check your understanding</span>
        <strong id={`${checkName}-title`}>{check.question}</strong>
      </div>
      <fieldset>
        <legend className="sr-only">Choose one answer</legend>
        {check.options.map((option, index) => (
          <label key={option}>
            <input
              type="radio"
              name={checkName}
              checked={selectedOption === index}
              onChange={() => setSelectedOption(index)}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      {checkedOption === null ? (
        <button type="button" disabled={selectedOption === null} onClick={checkAnswer}>
          Check answer
        </button>
      ) : (
        <div className="formative-feedback" role="status">
          <strong>{isCorrect ? "Correct" : "Not quite"}</strong>
          <p>{check.explanation}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedOption(null);
              setCheckedOption(null);
            }}
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}

type MarkdownContentProps = {
  children: string;
  lessonId?: string;
  formativeChecks?: FormativeCheck[];
  completedCheckIds?: string[];
  onCheckCompleted?: (checkId: string) => void;
  showTableOfContents?: boolean;
};

export function MarkdownContent({
  children,
  lessonId = "lesson",
  formativeChecks = [],
  completedCheckIds = [],
  onCheckCompleted,
  showTableOfContents = false,
}: MarkdownContentProps) {
  if (!children.trim()) {
    return null;
  }

  const { markdown, expressions } = extractLessonMath(children);
  const isModuleThreeLesson = lessonId.startsWith("lesson-3-");

  const tableOfContents = showTableOfContents
    ? [...children.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
        label: match[1].replace(/[*_`]/g, "").replace(/^\d+\.\s*/, ""),
        href: `#${lessonId}-${headingSlug(match[1].replace(/[*_`]/g, ""))}`,
      }))
    : [];

  return (
    <div className={`lesson-rich-text${isModuleThreeLesson ? " lesson-rich-text-module-3" : ""}`}>
      {tableOfContents.length > 0 && (
        <nav className="lesson-table-of-contents" aria-label="Lesson contents">
          <span>In this lesson</span>
          <ol>
            {tableOfContents.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
          </ol>
        </nav>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children: headingChildren }) => {
            const text = nodeText(headingChildren);
            return <h2 id={`${lessonId}-${headingSlug(text)}`}>{renderInlineLessonMath(headingChildren, expressions, "h2")}</h2>;
          },
          h3: ({ children: headingChildren }) => {
            const text = nodeText(headingChildren);
            return <h3 id={`${lessonId}-${headingSlug(text)}`}>{renderInlineLessonMath(headingChildren, expressions, "h3")}</h3>;
          },
          p: ({ children: paragraphChildren }) => {
            const text = nodeText(paragraphChildren).trim();
            const mathMarker = text.match(/^%%lesson-math-block-(\d+)%%$/);
            if (mathMarker) {
              const expression = expressions[Number(mathMarker[1])];
              return expression ? <LessonMath {...expression} /> : null;
            }
            const marker = text.match(/^\[\[CHECK:([a-z0-9-]+)\]\]$/);
            if (marker) {
              const check = formativeChecks.find((candidate) => candidate.id === marker[1]);
              return check ? (
                <FormativeCheckCard
                  check={check}
                  lessonId={lessonId}
                  completed={completedCheckIds.includes(check.id)}
                  onCompleted={onCheckCompleted}
                />
              ) : null;
            }
            const onlyChild = Array.isArray(paragraphChildren) ? paragraphChildren.length === 1 ? paragraphChildren[0] : null : paragraphChildren;
            if (onlyChild && typeof onlyChild === "object" && "type" in onlyChild && onlyChild.type === "img") {
              const imageProps = (onlyChild as { props?: { src?: string; title?: string } }).props;
              const isDiagram = imageProps?.src?.toLowerCase().endsWith(".svg") ?? false;
              const caption = imageProps?.title
                ?? (isDiagram ? "On smaller screens, swipe horizontally to inspect the complete diagram" : "Scientific context image");
              return (
                <figure className={`lesson-visual-frame${isDiagram ? " lesson-diagram-frame" : " lesson-photo-frame"}`}>
                  <span className="lesson-visual-scroll">{onlyChild}</span>
                  <figcaption>{caption}</figcaption>
                </figure>
              );
            }
            return <p>{renderInlineLessonMath(paragraphChildren, expressions, "paragraph")}</p>;
          },
          li: ({ children: listChildren }) => <li>{renderInlineLessonMath(listChildren, expressions, "list")}</li>,
          td: ({ children: cellChildren }) => <td>{renderInlineLessonMath(cellChildren, expressions, "cell")}</td>,
          blockquote: ({ children: quoteChildren }) => {
            const text = nodeText(quoteChildren).trim().toLowerCase();
            const layer = text.startsWith("core lesson")
              ? "core"
              : text.startsWith("scientific note")
                ? "scientific"
                : text.startsWith("go deeper")
                  ? "deeper"
                  : "standard";
            return <blockquote className={`lesson-callout lesson-callout-${layer}`}>{renderInlineLessonMath(quoteChildren, expressions, "quote")}</blockquote>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
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
        <a
          href={resource.href}
          key={`${resource.href}-${resource.title}`}
          download={resource.href.endsWith(".ipynb") ? true : undefined}
          target={resource.href.endsWith(".ipynb") ? undefined : "_blank"}
          rel={resource.href.endsWith(".ipynb") ? undefined : "noreferrer"}
        >
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
