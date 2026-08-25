import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(repositoryRoot, "out");
const sitemapXml = readFileSync(join(outputRoot, "sitemap.xml"), "utf8");
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const publicBase = "/remote-sensing-scientist-academy";

function decode(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function localHtml(url) {
  const pathname = new URL(url).pathname;
  const relative = pathname.replace(new RegExp(`^${publicBase}/?`), "");
  return relative ? join(outputRoot, relative, "index.html") : join(outputRoot, "index.html");
}

function match(html, pattern) {
  return decode(html.match(pattern)?.[1] ?? "");
}

const rows = urls.map((url) => {
  const html = readFileSync(localHtml(url), "utf8");
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || match(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || match(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const h1 = match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const schema = [...html.matchAll(/"@type":"([^"]+)"/g)]
    .map((item) => item[1])
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
  return { url, title, description, canonical, h1, schema, indexable: noindex ? "No" : "Yes" };
});

const lines = [
  "# SEO page audit",
  "",
  "Generated from the production GitHub Pages static export. Re-run `npm run pages:build` followed by `npm run seo:audit` after curriculum routing or metadata changes.",
  "",
  `Pages audited: ${rows.length}`,
  "",
  "| Page / Lesson | SEO title | Meta description | URL / canonical | H1 | Schema | Indexable |",
  "|---|---|---|---|---|---|---|",
  ...rows.map((row) => {
    const page = new URL(row.url).pathname.replace(publicBase, "") || "/";
    const clean = (value) => value.replace(/\|/g, "\\|");
    return `| ${clean(page)} | ${clean(row.title)} | ${clean(row.description)} | ${clean(row.canonical)} | ${clean(row.h1)} | ${clean(row.schema || "WebPage semantics")} | ${row.indexable} |`;
  }),
  "",
];

writeFileSync(join(repositoryRoot, "docs", "SEO_PAGE_AUDIT.md"), lines.join("\n"));
console.log(`Wrote docs/SEO_PAGE_AUDIT.md with ${rows.length} indexable page records`);
