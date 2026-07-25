const learningPaths = [
  {
    number: "01",
    label: "FOUNDATIONS",
    title: "Earth Observation Essentials",
    description:
      "Build fluency in spectral signatures, sensor systems, resolutions, and the physics behind every pixel.",
    meta: "6 weeks · Beginner",
    accent: "lime",
  },
  {
    number: "02",
    label: "ANALYSIS",
    title: "Geospatial Data Science",
    description:
      "Move from raw scenes to defensible insight with Python, cloud workflows, and reproducible spatial analysis.",
    meta: "10 weeks · Intermediate",
    accent: "blue",
  },
  {
    number: "03",
    label: "APPLICATION",
    title: "Climate Intelligence",
    description:
      "Detect change, quantify risk, and communicate environmental signals across time and scale.",
    meta: "8 weeks · Advanced",
    accent: "orange",
  },
];

const modules = [
  {
    week: "01—03",
    title: "See beyond RGB",
    description:
      "Sensor physics, spectral response, atmospheric effects, and the anatomy of an Earth observation product.",
    tools: ["Sentinel-2", "Landsat", "QGIS"],
  },
  {
    week: "04—07",
    title: "Build the processing chain",
    description:
      "Search catalogs, prepare data cubes, engineer indices, classify land cover, and validate your results.",
    tools: ["Python", "STAC", "Google Earth Engine"],
  },
  {
    week: "08—10",
    title: "Turn signals into decisions",
    description:
      "Design a complete monitoring product and present findings with the uncertainty decision-makers need.",
    tools: ["xarray", "GeoPandas", "Cloud Optimized GeoTIFF"],
  },
];

const outcomes = [
  ["12", "guided field labs"],
  ["04", "portfolio projects"],
  ["30+", "satellite datasets"],
  ["01", "capstone defense"],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Remote Sensing Scientist Academy home">
          <span className="brand-mark" aria-hidden="true">
            <span>RS</span>
          </span>
          <span className="brand-name">
            Remote Sensing
            <strong>Scientist Academy</strong>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#paths">Programs</a>
          <a href="#curriculum">Curriculum</a>
          <a href="#field-lab">Field Lab</a>
        </nav>

        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="#paths">Programs</a>
            <a href="#curriculum">Curriculum</a>
            <a href="#field-lab">Field Lab</a>
            <a className="mobile-apply" href="#apply">Apply for cohort ↗</a>
          </nav>
        </details>

        <a className="header-cta" href="#apply">
          Apply for cohort <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="main-content">
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            Admissions open · Autumn cohort
          </div>
          <h1>
            Read the planet.
            <br />
            <em>Shape what comes next.</em>
          </h1>
          <p className="hero-intro">
            An intensive online academy for the next generation of remote
            sensing scientists—built around real satellite data, rigorous
            analysis, and problems that matter.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#paths">
              Explore programs <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="#field-lab">
              View a field lab <span aria-hidden="true">↘</span>
            </a>
          </div>
          <div className="hero-note">
            <span className="note-line" aria-hidden="true" />
            Learn from anywhere
            <span aria-hidden="true">·</span>
            Work with real missions
            <span aria-hidden="true">·</span>
            Graduate with evidence
          </div>
        </div>

        <div className="hero-visual" aria-label="Satellite observation data visualization">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="satellite">
            <span className="satellite-wing wing-left" />
            <span className="satellite-body" />
            <span className="satellite-wing wing-right" />
          </div>
          <div className="earth">
            <div className="earth-grid" />
            <div className="land land-one" />
            <div className="land land-two" />
            <div className="scan-line" />
          </div>
          <div className="telemetry telemetry-top">
            <span>AOI_59.4N</span>
            <strong>PASS 084</strong>
          </div>
          <div className="telemetry telemetry-bottom">
            <span>NDVI Δ</span>
            <strong>+0.184</strong>
          </div>
          <div className="crosshair crosshair-one">+</div>
          <div className="crosshair crosshair-two">+</div>
          <div className="visual-caption">
            <span>LIVE TRAINING SCENE</span>
            <span>S2A · 10M · 07:42 UTC</span>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Curriculum scope">
        <span>OPTICAL</span>
        <i />
        <span>SAR</span>
        <i />
        <span>LIDAR</span>
        <i />
        <span>THERMAL</span>
        <i />
        <span>HYPERSPECTRAL</span>
        <i />
        <span>GEOSPATIAL AI</span>
      </section>

      <section className="section paths-section" id="paths">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Choose your trajectory</p>
            <h2>Learn in layers.<br />Advance with purpose.</h2>
          </div>
          <p className="section-summary">
            Start with one focused path or combine all three into the complete
            Remote Sensing Scientist program.
          </p>
        </div>

        <div className="path-grid">
          {learningPaths.map((path) => (
            <article className={`path-card path-${path.accent}`} key={path.number}>
              <div className="path-topline">
                <span>{path.label}</span>
                <span>{path.number}</span>
              </div>
              <div className="path-signal" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <div className="path-footer">
                <span>{path.meta}</span>
                <a href="#apply" aria-label={`Learn more about ${path.title}`}>
                  ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="field-lab section" id="field-lab">
        <div className="lab-map" aria-label="Stylized wildfire recovery analysis map">
          <div className="contour contour-one" />
          <div className="contour contour-two" />
          <div className="contour contour-three" />
          <div className="burn-zone zone-one" />
          <div className="burn-zone zone-two" />
          <div className="burn-zone zone-three" />
          <div className="map-grid" />
          <div className="map-pin pin-one">A</div>
          <div className="map-pin pin-two">B</div>
          <div className="map-coordinates">39.74°N / 105.18°W</div>
          <div className="map-legend">
            <span><i className="legend-before" /> PRE-FIRE</span>
            <span><i className="legend-after" /> RECOVERY</span>
          </div>
        </div>

        <div className="lab-content">
          <p className="section-kicker">Field lab 06 · Change detection</p>
          <h2>Measure recovery after the fire.</h2>
          <p className="lab-lead">
            In this guided investigation, you’ll build a multi-year recovery
            model from Sentinel-2 imagery and explain where—and why—the
            landscape is struggling to return.
          </p>
          <ol className="lab-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Assemble the time series</strong>
                <p>Filter, mask, and harmonize six years of surface reflectance.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Model the signal</strong>
                <p>Quantify burn severity and vegetation recovery trajectories.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Defend the finding</strong>
                <p>Validate uncertainty and deliver a concise scientific briefing.</p>
              </div>
            </li>
          </ol>
          <a className="button button-dark" href="#curriculum">
            See how the program works <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="section curriculum-section" id="curriculum">
        <div className="section-heading curriculum-heading">
          <div>
            <p className="section-kicker">The complete program</p>
            <h2>From photons<br />to foresight.</h2>
          </div>
          <div className="cohort-card">
            <span>NEXT COHORT</span>
            <strong>14 September</strong>
            <p>10 weeks · 8–10 hours/week · Online</p>
          </div>
        </div>

        <div className="module-list">
          {modules.map((module, index) => (
            <article className="module" key={module.week}>
              <div className="module-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="module-week">WEEKS {module.week}</div>
              <div className="module-copy">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div className="tool-list">
                  {module.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="outcomes">
        <div className="outcomes-copy">
          <p className="section-kicker">Your evidence of work</p>
          <h2>Graduate with more than a certificate.</h2>
          <p>
            Leave with a reviewed portfolio, a reproducible analysis workflow,
            and the confidence to explain technical results to real decision-makers.
          </p>
        </div>
        <div className="outcomes-grid">
          {outcomes.map(([value, label]) => (
            <div className="outcome" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="apply-section" id="apply">
        <div className="apply-orbit" aria-hidden="true" />
        <div className="apply-copy">
          <p className="section-kicker light">Applications now open</p>
          <h2>The planet is already talking.</h2>
          <p>Learn how to listen—then turn the signal into action.</p>
          <a className="button button-primary button-large" href="mailto:admissions@rss.academy">
            Start your application <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="apply-meta">
          <span>AUTUMN COHORT · 24 PLACES</span>
          <span>APPLICATIONS CLOSE 21 AUGUST</span>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark"><span>RS</span></span>
          <span className="brand-name">
            Remote Sensing
            <strong>Scientist Academy</strong>
          </span>
        </a>
        <p>
          Serious training for people who want to understand a changing planet.
        </p>
        <div className="footer-links">
          <a href="#paths">Programs</a>
          <a href="#curriculum">Curriculum</a>
          <a href="mailto:admissions@rss.academy">Contact</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Remote Sensing Scientist Academy</span>
          <span>EARTH, OBSERVED WITH INTENT.</span>
        </div>
      </footer>
      </main>
    </>
  );
}
