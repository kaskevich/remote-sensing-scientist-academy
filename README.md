# Remote Sensing Scientist Academy

A practical online academy for learning remote sensing with real satellite
data. The site includes programs, a field lab, a full curriculum, outcomes,
and applications.

## Live site

[Open Remote Sensing Scientist Academy](https://kaskevich.github.io/remote-sensing-scientist-academy/)

## What is included

- Responsive website for desktop and mobile
- Programs, curriculum, field lab, outcomes, and application sections
- Content editing with Pages CMS
- Automatic publishing with GitHub Pages

## Edit the content

Open the academy's [admin launcher](https://kaskevich.github.io/remote-sensing-scientist-academy/admin/),
then sign in with the GitHub account connected to this repository. Save your
changes in Pages CMS and GitHub Pages will publish the new version.

In **Curriculum → Modules**, each lesson can include formatted lesson content,
supporting imagery, downloadable resources, task instructions, reference
imagery, and GeoJSON reference maps. Uploaded author files are stored in the
repository under `public/lesson-media/` and published with the website.

## Learner work

Learners can save a written result and attach PNG, JPEG, WebP, or GeoJSON files
to each program task. These results, lesson notes, and progress are private to
the current browser. They are not uploaded to GitHub or shared across devices.

## Development

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Create the GitHub Pages static export with:

```bash
PAGES_BASE_PATH=/remote-sensing-scientist-academy \
NEXT_PUBLIC_SITE_URL=https://kaskevich.github.io/remote-sensing-scientist-academy \
npm run pages:build
```
