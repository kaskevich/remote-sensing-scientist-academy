export const academyOrigin = "https://kaskevich.github.io";
export const academyProductionBasePath = "/remote-sensing-scientist-academy";

function normalisePagePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (/\/[a-z0-9_-]+\.[a-z0-9]+$/i.test(path)) return path;
  return path.endsWith("/") ? path : `${path}/`;
}

export function academyHref(pathname: string) {
  const path = normalisePagePath(pathname);
  const runtimeBasePath = process.env.PAGES_BASE_PATH ?? "";
  return path === "/" ? `${runtimeBasePath}/` : `${runtimeBasePath}${path}`;
}

export function academyUrl(pathname: string) {
  const path = normalisePagePath(pathname);
  return `${academyOrigin}${academyProductionBasePath}${path}`;
}

export function academyAssetHref(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${process.env.PAGES_BASE_PATH ?? ""}${path}`;
}

export function academyAssetUrl(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${academyOrigin}${academyProductionBasePath}${path}`;
}
