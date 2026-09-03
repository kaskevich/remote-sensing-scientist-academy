import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const publicBase = "/remote-sensing-scientist-academy";
const sitemapPath = join(out, "sitemap.xml");
const robotsPath = join(out, "robots.txt");
const errors = [];

function localPath(url) {
  const pathname = new URL(url).pathname;
  const relative = pathname.replace(new RegExp(`^${publicBase}/?`), "");
  return relative ? join(out, relative, "index.html") : join(out, "index.html");
}

function meta(html, name) {
  return html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1]
    ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"))?.[1]
    ?? "";
}

function canonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    ?? "";
}

if (!existsSync(sitemapPath)) errors.push("out/sitemap.xml is missing");
if (!existsSync(robotsPath)) errors.push("out/robots.txt is missing");

const sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, "utf8") : "";
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length !== 116) errors.push(`sitemap contains ${urls.length} URLs instead of 116`);
if (new Set(urls).size !== urls.length) errors.push("sitemap contains duplicate URLs");
const titles = [];
const canonicals = [];

for (const url of urls) {
  const file = localPath(url);
  if (!existsSync(file)) {
    errors.push(`missing exported HTML for ${url}`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const description = meta(html, "description");
  const canonicalUrl = canonical(html);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  titles.push(title);
  canonicals.push(canonicalUrl);
  if (!title.trim()) errors.push(`${url} has no title`);
  if (!description.trim()) errors.push(`${url} has no meta description`);
  if (canonicalUrl !== url) errors.push(`${url} canonical is ${canonicalUrl || "missing"}`);
  if (h1Count !== 1) errors.push(`${url} has ${h1Count} h1 elements`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      errors.push(`${url} has invalid JSON-LD`);
    }
  }
  if (/\/module-[123]\/[^/]+\/$/.test(new URL(url).pathname) && !/class="lesson-rich-text/.test(html)) {
    errors.push(`${url} is missing pre-rendered lesson content`);
  }
  for (const match of html.matchAll(/<(?:a|link|script|img)[^>]+(?:href|src)=["']([^"']+)["']/gi)) {
    const reference = match[1];
    if (/^(?:data:|blob:|mailto:|tel:|javascript:)/i.test(reference)) continue;
    let resolved;
    try {
      resolved = new URL(reference, url);
    } catch {
      errors.push(`${url} has an invalid local reference: ${reference}`);
      continue;
    }
    if (resolved.origin !== "https://kaskevich.github.io") continue;
    if (!resolved.pathname.startsWith(`${publicBase}/`) && resolved.pathname !== publicBase) continue;
    const relative = resolved.pathname.replace(new RegExp(`^${publicBase}/?`), "");
    const target = !relative
      ? join(out, "index.html")
      : resolved.pathname.endsWith("/")
        ? join(out, relative, "index.html")
        : join(out, relative);
    if (!existsSync(target)) errors.push(`${url} links to missing local target ${resolved.pathname}`);
  }
}

if (new Set(titles).size !== titles.length) errors.push("exported pages contain duplicate titles");
if (new Set(canonicals).size !== canonicals.length) errors.push("exported pages contain duplicate canonicals");

const robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "";
if (!robots.includes("Allow: /remote-sensing-scientist-academy/")) errors.push("robots.txt does not allow the production path");
if (!robots.includes("Disallow: /remote-sensing-scientist-academy/admin/")) errors.push("robots.txt does not exclude admin");
if (!robots.includes("Sitemap: https://kaskevich.github.io/remote-sensing-scientist-academy/sitemap.xml")) errors.push("robots.txt does not reference the production sitemap");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${urls.length} canonical static pages, structured data, headings, robots and sitemap`);
