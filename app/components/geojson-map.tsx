"use client";

import { useEffect, useMemo, useState } from "react";
import { buildGeoJsonDrawing, isDisplayableGeoJson } from "@/lib/geojson";

type GeoJsonMapProps = {
  data: Record<string, unknown>;
  label: string;
};

export function GeoJsonMap({ data, label }: GeoJsonMapProps) {
  const [zoom, setZoom] = useState(1);
  const drawing = useMemo(() => buildGeoJsonDrawing(data), [data]);

  if (!drawing) {
    return <p className="map-message">This GeoJSON file does not contain displayable geometry.</p>;
  }

  const transform = `translate(300 180) scale(${zoom}) translate(-300 -180)`;

  return (
    <div className="geojson-map" aria-label={label}>
      <div className="geojson-map-controls" aria-label="Map zoom controls">
        <button type="button" onClick={() => setZoom((value) => Math.min(4, value * 1.5))}>
          +
          <span className="sr-only">Zoom in</span>
        </button>
        <button type="button" onClick={() => setZoom((value) => Math.max(1, value / 1.5))}>
          −
          <span className="sr-only">Zoom out</span>
        </button>
        <button type="button" onClick={() => setZoom(1)}>
          Reset
        </button>
      </div>
      <svg viewBox="0 0 600 360" role="img" aria-label={label}>
        <g transform={transform}>
          {drawing.shapes.map((shape, index) => {
            if (shape.kind === "point") {
              return (
                <circle
                  cx={shape.coordinates[0]}
                  cy={shape.coordinates[1]}
                  key={`point-${index}`}
                  r={6 / zoom}
                />
              );
            }

            const path = shape.coordinates
              .map(([x, y], coordinateIndex) => `${coordinateIndex === 0 ? "M" : "L"}${x} ${y}`)
              .join(" ");

            return (
              <path
                d={`${path}${shape.kind === "polygon" ? " Z" : ""}`}
                key={`${shape.kind}-${index}`}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      </svg>
      <div className="geojson-map-bounds">
        {drawing.bounds.map((coordinate) => coordinate.toFixed(3)).join(" · ")}
      </div>
    </div>
  );
}

type RemoteGeoJsonMapProps = {
  src: string;
  label: string;
};

export function RemoteGeoJsonMap({ src, label }: RemoteGeoJsonMapProps) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [hasError, setHasError] = useState(false);

  // Remote lesson maps are repository assets and must load after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setHasError(false);

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Map request failed");
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (isDisplayableGeoJson(value)) {
          setData(value);
        } else {
          setHasError(true);
        }
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setHasError(true);
        }
      });

    return () => controller.abort();
  }, [src]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (hasError) {
    return <p className="map-message">This reference map could not be displayed.</p>;
  }

  if (!data) {
    return <p className="map-message">Loading reference map…</p>;
  }

  return <GeoJsonMap data={data} label={label} />;
}
