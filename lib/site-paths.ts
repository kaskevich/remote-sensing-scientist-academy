export const academyOrigin = "https://kaskevich.github.io";
export const academyProductionBasePath = "/remote-sensing-scientist-academy";

function normalisePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  const withoutQuery = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (/\/[a-z0-9_-]+\.[a-z0-9]+$/i.test(withoutQuery)) return withoutQuery;
  return withoutQuery.endsWith("/") ? withoutQuery : `${withoutQuery}/`;
}

export function academyHref(pathname: string) {
  const path = normalisePath(pathname);
  const runtimeBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.PAGES_BASE_PATH ?? "";
  return path === "/" ? `${runtimeBasePath}/` : `${runtimeBasePath}${path}`;
}

export function academyUrl(pathname: string) {
  const path = normalisePath(pathname);
  return `${academyOrigin}${academyProductionBasePath}${path}`;
}

export function academyAssetUrl(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${academyOrigin}${academyProductionBasePath}${path}`;
}

export function academyAssetHref(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const runtimeBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.PAGES_BASE_PATH ?? "";
  return `${runtimeBasePath}${path}`;
}
