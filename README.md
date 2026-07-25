# Remote Sensing Scientist Academy

A responsive academy website for practical, rigorous remote sensing education.
The experience introduces learning paths, a field investigation, the full
curriculum, graduate outcomes, and the next cohort.

## Live site

[Open Remote Sensing Scientist Academy](https://kaskevich.github.io/remote-sensing-scientist-academy/)

## Highlights

- Editorial Earth-observation visual system
- Responsive desktop, tablet, and mobile layouts
- Accessible keyboard navigation and mobile menu
- Program, curriculum, field lab, and application sections
- Branded Open Graph and social-sharing artwork
- Automated deployment through GitHub Pages

## Development

Requires Node.js 22.13 or newer.

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
