# Platform routing and SEO

## Public route model

The Academy is exported as static HTML for GitHub Pages. Its public information architecture is derived from the curriculum data in `lib/academy-platform.tsx` and normalised by `lib/academy-routes.ts`.

- `/` is the concise public pathway page.
- `/curriculum/` is the complete curriculum index.
- `/module-{n}/` is a module overview.
- `/module-{n}/{chapter-slug}/` is a chapter overview.
- `/module-{n}/{chapter-slug}/{lesson-slug}/` is the canonical lesson page.
- `/about/` is the author and Academy story.
- `/admin/` remains a private application surface and is excluded from indexing.

The static export currently contains three module pages, 25 chapter pages and 109 lesson, practicum and capstone pages. Every indexed page has a canonical URL, one primary heading and a useful description. Lesson pages include `LearningResource` and breadcrumb structured data; module pages include `Course` structured data.

## Stable learner identity

URL slugs are presentation and discovery identifiers. Learner persistence continues to use the existing stable lesson IDs such as `lesson-01`, `lesson-2-05` and `lesson-3-01`.

This separation preserves:

- completed lessons and the current lesson;
- private lesson notes;
- code drafts;
- local task results and uploaded files;
- Supabase progress, notes, submissions, comments and feedback.

Changing a title or slug must not change the stable lesson ID. The route tests enforce uniqueness for both IDs and canonical paths.

## Legacy links

Old links such as `/#lesson-2-05` are recognised on the homepage and replaced with the corresponding canonical lesson URL in browsers with JavaScript. Non-lesson anchors such as `#paths` continue to behave as ordinary section links.

New internal navigation must use real paths, not hash lesson anchors.

## GitHub Pages deployment

Production builds set:

```text
PAGES_BASE_PATH=/remote-sensing-scientist-academy
```

The Next.js base path, asset prefix, public media links, canonical URLs, sitemap and robots directives all account for that project path. The generated `out/` directory can therefore be deployed directly by the existing GitHub Pages workflow.

## Search discovery

Submit this sitemap in Google Search Console:

```text
https://kaskevich.github.io/remote-sensing-scientist-academy/sitemap.xml
```

The sitemap lists only canonical public pages. It excludes `/admin/`, hash routes and duplicate URLs. Search engines decide when and whether to index a page; deployment and sitemap submission do not guarantee immediate indexing.

## Verification commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test tests/e2e/academy.smoke.spec.ts
```

The browser suite covers direct lesson access with and without JavaScript, learner persistence, code and upload workspaces, legacy hash migration, metadata, structured-data endpoints, useful 404 behaviour and horizontal overflow at 320, 375, 768 and desktop widths.
