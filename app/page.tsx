import { Fragment } from "react";
import content from "@/content/site.json";
import LearnerCurriculum, { type AcademyLesson } from "@/app/components/learner-curriculum";

const visibleNavigation = content.navigation.items.filter((item) => item.visible);
const visiblePaths = content.pathsSection.items.filter((path) => path.visible);
const visibleModules = content.curriculum.modules.filter((module) => module.visible);
const learnerLessons: AcademyLesson[] = visibleModules.map((module, index) => ({
  id: `lesson-${String(index + 1).padStart(2, "0")}`,
  week: module.week,
  title: module.title,
  description: module.description,
  tools: module.tools,
}));

export default function Home() {
  const applicationTarget = content.application.openInNewTab ? "_blank" : undefined;
  const applicationRel = content.application.openInNewTab ? "noreferrer" : undefined;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${content.metadata.title} home`}>
          <span className="brand-mark" aria-hidden="true">
            <span>{content.brand.mark}</span>
          </span>
          <span className="brand-name">
            {content.brand.lineOne}
            <strong>{content.brand.lineTwo}</strong>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {visibleNavigation.map((item) => (
            <a href={item.href} key={`${item.label}-${item.href}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {visibleNavigation.map((item) => (
              <a href={item.href} key={`${item.label}-${item.href}`}>
                {item.label}
              </a>
            ))}
            {content.navigation.showApplyButton && (
              <a className="mobile-apply" href={content.navigation.applyHref}>
                {content.navigation.applyLabel} ↗
              </a>
            )}
          </nav>
        </details>

        {content.navigation.showApplyButton && (
          <a className="header-cta" href={content.navigation.applyHref}>
            {content.navigation.applyLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="eyebrow">
              <span
                className={`status-dot${content.hero.admissionsOpen ? "" : " status-dot-closed"}`}
              />
              {content.hero.eyebrow}
            </div>
            <h1>
              {content.hero.title}
              <br />
              <em>{content.hero.accentTitle}</em>
            </h1>
            <p className="hero-intro">{content.hero.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={content.hero.primaryButtonHref}>
                {content.hero.primaryButtonLabel} <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href={content.hero.secondaryButtonHref}>
                {content.hero.secondaryButtonLabel} <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="note-line" aria-hidden="true" />
              {content.hero.notes.map((note, index) => (
                <Fragment key={note}>
                  {index > 0 && <span aria-hidden="true">·</span>}
                  <span>{note}</span>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label={content.hero.visualAriaLabel}>
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
              <span>{content.hero.telemetryTopLabel}</span>
              <strong>{content.hero.telemetryTopValue}</strong>
            </div>
            <div className="telemetry telemetry-bottom">
              <span>{content.hero.telemetryBottomLabel}</span>
              <strong>{content.hero.telemetryBottomValue}</strong>
            </div>
            <div className="crosshair crosshair-one">+</div>
            <div className="crosshair crosshair-two">+</div>
            <div className="visual-caption">
              <span>{content.hero.visualCaptionLeft}</span>
              <span>{content.hero.visualCaptionRight}</span>
            </div>
          </div>
        </section>

        <section className="signal-strip" aria-label="Curriculum scope">
          {content.signalStrip.map((signal, index) => (
            <Fragment key={signal}>
              <span>{signal}</span>
              {index < content.signalStrip.length - 1 && <i />}
            </Fragment>
          ))}
        </section>

        {content.pathsSection.visible && (
          <section className="section paths-section" id="paths">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{content.pathsSection.kicker}</p>
                <h2>
                  {content.pathsSection.titleLineOne}
                  <br />
                  {content.pathsSection.titleLineTwo}
                </h2>
              </div>
              <p className="section-summary">{content.pathsSection.summary}</p>
            </div>

            <div className="path-grid">
              {visiblePaths.map((path) => (
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
                    <a href={content.navigation.applyHref} aria-label={`Learn more about ${path.title}`}>
                      ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {content.fieldLab.visible && (
          <section className="field-lab section" id="field-lab">
            <div className="lab-map" aria-label={content.fieldLab.mapAriaLabel}>
              <div className="contour contour-one" />
              <div className="contour contour-two" />
              <div className="contour contour-three" />
              <div className="burn-zone zone-one" />
              <div className="burn-zone zone-two" />
              <div className="burn-zone zone-three" />
              <div className="map-grid" />
              <div className="map-pin pin-one">A</div>
              <div className="map-pin pin-two">B</div>
              <div className="map-coordinates">{content.fieldLab.coordinates}</div>
              <div className="map-legend">
                <span>
                  <i className="legend-before" /> {content.fieldLab.legendBefore}
                </span>
                <span>
                  <i className="legend-after" /> {content.fieldLab.legendAfter}
                </span>
              </div>
            </div>

            <div className="lab-content">
              <p className="section-kicker">{content.fieldLab.kicker}</p>
              <h2>{content.fieldLab.title}</h2>
              <p className="lab-lead">{content.fieldLab.lead}</p>
              <ol className="lab-steps">
                {content.fieldLab.steps.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <a className="button button-dark" href={content.fieldLab.buttonHref}>
                {content.fieldLab.buttonLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>
        )}

        {content.curriculum.visible && (
          <section className="section curriculum-section" id="curriculum">
            <div className="section-heading curriculum-heading">
              <div>
                <p className="section-kicker">{content.curriculum.kicker}</p>
                <h2>
                  {content.curriculum.titleLineOne}
                  <br />
                  {content.curriculum.titleLineTwo}
                </h2>
              </div>
              <div className="cohort-card">
                <span>{content.curriculum.cohortLabel}</span>
                <strong>{content.curriculum.cohortDate}</strong>
                <p>{content.curriculum.cohortMeta}</p>
              </div>
            </div>

            <LearnerCurriculum lessons={learnerLessons} />
          </section>
        )}

        {content.outcomes.visible && (
          <section className="outcomes">
            <div className="outcomes-copy">
              <p className="section-kicker">{content.outcomes.kicker}</p>
              <h2>{content.outcomes.title}</h2>
              <p>{content.outcomes.description}</p>
            </div>
            <div className="outcomes-grid">
              {content.outcomes.items.map((outcome) => (
                <div className="outcome" key={outcome.label}>
                  <strong>{outcome.value}</strong>
                  <span>{outcome.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.application.visible && (
          <section className="apply-section" id="apply">
            <div className="apply-orbit" aria-hidden="true" />
            <div className="apply-copy">
              <p className="section-kicker light">{content.application.kicker}</p>
              <h2>{content.application.title}</h2>
              <p>{content.application.description}</p>
              <a
                className="button button-primary button-large"
                href={content.application.buttonHref}
                target={applicationTarget}
                rel={applicationRel}
              >
                {content.application.buttonLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="apply-meta">
              <span>{content.application.cohortMeta}</span>
              <span>{content.application.deadlineMeta}</span>
            </div>
          </section>
        )}

        <footer>
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark">
              <span>{content.brand.mark}</span>
            </span>
            <span className="brand-name">
              {content.brand.lineOne}
              <strong>{content.brand.lineTwo}</strong>
            </span>
          </a>
          <p>{content.footer.description}</p>
          <div className="footer-links">
            {visibleNavigation.map((item) => (
              <a href={item.href} key={`${item.label}-${item.href}`}>
                {item.label}
              </a>
            ))}
            <a href={content.footer.contactHref}>{content.footer.contactLabel}</a>
          </div>
          <div className="footer-bottom">
            <span>{content.footer.copyright}</span>
            <span>{content.footer.manifesto}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
