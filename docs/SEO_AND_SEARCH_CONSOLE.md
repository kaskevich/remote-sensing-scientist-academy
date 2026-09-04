# Academy SEO architecture and Google Search Console

## Technical audit

The Academy uses Next.js App Router and a GitHub Pages static export. Production sets `PAGES_BASE_PATH=/remote-sensing-scientist-academy`, so HTML, assets, canonical URLs, `robots.txt` and `sitemap.xml` must all preserve that repository path.

Before this SEO layer, the homepage already contained the complete lesson text in pre-rendered HTML. JavaScript controls the accordions and learner tools, but it does not fetch the core educational text after load. The content was therefore crawlable, but all 109 lessons shared the homepage URL, title, description and canonical identity because navigation used fragments such as `#lesson-3-17`.

The public `/admin/` route already carries `noindex, nofollow`. It remains excluded from the sitemap and is disallowed in `robots.txt`. The learner workspace, appearance, progress, notes, uploads and authentication behaviour are unchanged.

## Public SEO routes

- `/` remains the existing Academy and learner workspace.
- `/curriculum/` is a crawlable index of the complete pathway.
- `/module-1/`, `/module-2/` and `/module-3/` describe the three sequential courses.
- `/{module-slug}/{lesson-slug}/` is the canonical static reading page for each lesson, practicum and capstone.
- `/about/` retains its existing page and now has a canonical URL and social metadata.
- `/projects/track-recovery-after-fire/` is the canonical northern Evia scientific field lab and publishes its research design, official EMS perimeter and reproducible resources.
- `/species/` is the canonical Boreal Baltic Coastal Meadow Species Atlas index.
- `/species/{species-slug}/` provides one statically generated, source-traceable page for each of the 38 supplied FinBIF taxon records.
- `/species/habitats/{habitat-slug}/` provides four study-community reference pages (OP, LS, US and TG) without inferring unsupported species assignments.
- `/admin/` is not indexable.

Stable lesson IDs still power progress, notes, code drafts, uploads and synchronized data. Human-readable SEO slugs are a separate discovery layer, so metadata improvements do not invalidate learner data.

`lib/seo-curriculum.ts` derives every route, page title, description, breadcrumb, canonical URL and sitemap entry from the existing curriculum and reviewed lesson data. Module 1 uses its reviewed SEO fields where available. Later modules derive natural descriptions from the scientific lesson summary, tools and portfolio artifact. No hidden keyword text or analytics was added.

## Structured data

- The root layout publishes `EducationalOrganization` and `WebSite` JSON-LD.
- Module pages publish `Course` and `BreadcrumbList` JSON-LD.
- Lesson pages publish `LearningResource` and `BreadcrumbList` JSON-LD.
- The curriculum publishes `CollectionPage` JSON-LD.
- The Atlas index and habitat pages publish `CollectionPage` and `BreadcrumbList` JSON-LD; species pages publish `LearningResource` and `BreadcrumbList` JSON-LD with canonical URLs and source citations.

The schema makes no claim of accreditation, certification, guaranteed employment or unsupported institutional status.

The Atlas intentionally separates source taxonomy, pending study observations and remote-sensing interpretation. Photograph schema and social metadata are emitted only for images whose individual owner, licence and source mapping was verifiable from the supplied PDFs.

## Google ownership verification

No verification token is stored in the repository. After Google gives you an HTML-tag verification value, add only the token portion as a GitHub Actions repository variable:

1. Open the GitHub repository.
2. Go to **Settings → Secrets and variables → Actions → Variables**.
3. Create `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` with the token supplied by Google.
4. Re-run the GitHub Pages workflow.

The root metadata automatically emits the verification meta tag when that variable exists. Never invent a token.

## Google Search Console steps

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Choose **Add property**.
3. Select **URL prefix** and enter `https://kaskevich.github.io/remote-sensing-scientist-academy/`.
4. Choose **HTML tag** verification and copy the value inside the `content` attribute.
5. Add it to GitHub as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, deploy, then return to Search Console and choose **Verify**.
6. Open **Sitemaps** and submit `sitemap.xml`. The full URL is `https://kaskevich.github.io/remote-sensing-scientist-academy/sitemap.xml`.
7. Use **URL inspection** on the homepage, `/curriculum/`, each module page and a sample of lesson pages. Choose **Test live URL**, then **Request indexing** when the live test passes.
8. Under **Indexing → Pages**, monitor discovered pages, crawled pages, duplicates and exclusions. A page can be discovered before Google decides to index it.
9. Under **Performance → Search results**, monitor queries, impressions, clicks, pages and countries. Expect discovery to take time; deployment does not guarantee ranking.
10. Inspect individual lesson URLs rather than old hash fragments. Fragments are not separate documents for indexing.

## Optional actions outside the codebase

- Earn relevant, editorially legitimate links from research, GIS, university and professional profiles.
- Keep lesson titles and summaries accurate as the curriculum changes.
- Consider a custom domain only if desired; it is not required for indexing.
- Analytics is optional and was not added. Search Console works without Google Analytics.

## Maintenance and verification

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run test:seo
PAGES_BASE_PATH=/remote-sensing-scientist-academy \
NEXT_PUBLIC_SITE_URL=https://kaskevich.github.io/remote-sensing-scientist-academy \
npm run pages:build
npm run seo:validate
npm run seo:audit
```

`tests/seo.test.ts` enforces complete curriculum coverage, unique titles/slugs/canonicals, useful descriptions, meaningful Markdown alt text, a complete sitemap and the production robots policy. `scripts/generate-seo-audit.mjs` inspects the exported HTML and regenerates `docs/SEO_PAGE_AUDIT.md`.
