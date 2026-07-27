export type GeoJsonPosition = [number, number];

export type GeoJsonShape =
  | { kind: "point"; coordinates: GeoJsonPosition }
  | { kind: "line"; coordinates: GeoJsonPosition[] }
  | { kind: "polygon"; coordinates: GeoJsonPosition[] };

export type ProjectedGeoJsonShape =
  | { kind: "point"; coordinates: GeoJsonPosition }
  | { kind: "line"; coordinates: GeoJsonPosition[] }
  | { kind: "polygon"; coordinates: GeoJsonPosition[] };

export type GeoJsonDrawing = {
  shapes: ProjectedGeoJsonShape[];
  bounds: [number, number, number, number];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function position(value: unknown): GeoJsonPosition | null {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    Number.isFinite(value[0]) &&
    typeof value[1] === "number" &&
    Number.isFinite(value[1])
  ) {
    return [value[0], value[1]];
  }

  return null;
}

function positions(value: unknown): GeoJsonPosition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(position).filter((item): item is GeoJsonPosition => item !== null);
}

function collectGeometry(value: unknown, shapes: GeoJsonShape[]) {
  if (!isRecord(value) || typeof value.type !== "string") {
    return;
  }

  switch (value.type) {
    case "Point": {
      const point = position(value.coordinates);
      if (point) shapes.push({ kind: "point", coordinates: point });
      break;
    }
    case "MultiPoint":
      for (const point of positions(value.coordinates)) {
        shapes.push({ kind: "point", coordinates: point });
      }
      break;
    case "LineString": {
      const line = positions(value.coordinates);
      if (line.length > 1) shapes.push({ kind: "line", coordinates: line });
      break;
    }
    case "MultiLineString":
      if (Array.isArray(value.coordinates)) {
        for (const candidate of value.coordinates) {
          const line = positions(candidate);
          if (line.length > 1) shapes.push({ kind: "line", coordinates: line });
        }
      }
      break;
    case "Polygon":
      if (Array.isArray(value.coordinates)) {
        for (const candidate of value.coordinates) {
          const ring = positions(candidate);
          if (ring.length > 2) shapes.push({ kind: "polygon", coordinates: ring });
        }
      }
      break;
    case "MultiPolygon":
      if (Array.isArray(value.coordinates)) {
        for (const polygon of value.coordinates) {
          if (!Array.isArray(polygon)) continue;
          for (const candidate of polygon) {
            const ring = positions(candidate);
            if (ring.length > 2) shapes.push({ kind: "polygon", coordinates: ring });
          }
        }
      }
      break;
    case "GeometryCollection":
      if (Array.isArray(value.geometries)) {
        for (const geometry of value.geometries) collectGeometry(geometry, shapes);
      }
      break;
  }
}

export function collectGeoJsonShapes(value: unknown): GeoJsonShape[] {
  if (!isRecord(value) || typeof value.type !== "string") {
    return [];
  }

  const shapes: GeoJsonShape[] = [];
  if (value.type === "FeatureCollection" && Array.isArray(value.features)) {
    for (const feature of value.features) {
      if (isRecord(feature)) collectGeometry(feature.geometry, shapes);
    }
  } else if (value.type === "Feature") {
    collectGeometry(value.geometry, shapes);
  } else {
    collectGeometry(value, shapes);
  }

  return shapes;
}

export function isDisplayableGeoJson(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && collectGeoJsonShapes(value).length > 0;
}

export function buildGeoJsonDrawing(
  value: unknown,
  width = 600,
  height = 360,
  padding = 28,
): GeoJsonDrawing | null {
  const shapes = collectGeoJsonShapes(value);
  const allPositions = shapes.flatMap((shape) =>
    shape.kind === "point" ? [shape.coordinates] : shape.coordinates,
  );

  if (allPositions.length === 0) {
    return null;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const [x, y] of allPositions) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  if (minX === maxX) {
    minX -= 0.5;
    maxX += 0.5;
  }
  if (minY === maxY) {
    minY -= 0.5;
    maxY += 0.5;
  }

  const project = ([x, y]: GeoJsonPosition): GeoJsonPosition => [
    padding + ((x - minX) / (maxX - minX)) * (width - padding * 2),
    height - padding - ((y - minY) / (maxY - minY)) * (height - padding * 2),
  ];

  return {
    bounds: [minX, minY, maxX, maxY],
    shapes: shapes.map((shape) =>
      shape.kind === "point"
        ? { ...shape, coordinates: project(shape.coordinates) }
        : { ...shape, coordinates: shape.coordinates.map(project) },
    ),
  };
}
