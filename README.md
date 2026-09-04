# GIS & Remote Sensing Academy — Volha Kaskevich

The Remote Sensing Scientist Academy is an open educational project created by
[Volha Kaskevich](https://github.com/kaskevich), a Junior Research Fellow and
PhD researcher at the Estonian University of Life Sciences. It teaches GIS,
remote sensing, Earth Observation and geospatial data science through practical
environmental applications and reproducible portfolio projects.

The curriculum progresses from scientific Python to vector, raster, UAV and
satellite analysis, then to Google Earth Engine and defensible machine-learning
workflows. It uses tools and concepts including Python, Jupyter, QGIS,
GeoPandas, Rasterio, Xarray and XGBoost.

## Live site

[Open Remote Sensing Scientist Academy](https://kaskevich.github.io/remote-sensing-scientist-academy/)

[Open Field Lab 06: Northern Evia Fire Recovery](https://kaskevich.github.io/remote-sensing-scientist-academy/projects/track-recovery-after-fire/)

[Open the Boreal Baltic Coastal Meadow Species Atlas](https://kaskevich.github.io/remote-sensing-scientist-academy/species/)

## Creator

Volha Kaskevich works with GIS, UAV and satellite remote sensing, spatial
analysis, environmental monitoring and machine learning, with research focused
on coastal wetlands and blue-green infrastructure.

- [GitHub profile](https://github.com/kaskevich)
- [ORCID](https://orcid.org/0000-0003-2801-4490)
- [Estonian Research Information System (ETIS)](https://www.etis.ee/CV/Volha_Kaskevich/eng/)
- [Estonian University of Life Sciences](https://www.emu.ee/en/contacts/volha-kaskevich)
- [LinkedIn](https://ee.linkedin.com/in/volha-kaskevich-b13439b3)

## What is included

- Responsive website for desktop and mobile
- Programs, curriculum, field lab, outcomes, and application sections
- A complete northern Evia wildfire recovery mini-project with the official Copernicus EMSR527 perimeter, reproducible Earth Engine code and portfolio templates
- A searchable, data-driven Coastal Meadow Species Atlas with 38 source-traceable FinBIF records, individual species routes, habitat-reference pages and image-level licensing
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
to each program task. Guest work remains private to the current browser. When
Supabase is configured, signed-in learners can synchronize progress and private
notes, upload private submission files, and receive instructor feedback.

Platform setup and security instructions are in
[`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md). The local and synchronized
data distinction is documented in [`docs/PRIVACY_AND_DATA.md`](docs/PRIVACY_AND_DATA.md).

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
