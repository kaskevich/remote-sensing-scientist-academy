import content from "@/content/site.json";
import { academyHref } from "@/lib/site-paths";

const seoNavigation = [
  { label: "Pathway", href: `${academyHref("/")}#paths`, key: "pathway" },
  { label: "Curriculum", href: academyHref("/curriculum/"), key: "curriculum" },
  { label: "Field Lab 06", href: academyHref("/projects/track-recovery-after-fire/"), key: "field-lab-06" },
  { label: "Species Atlas", href: academyHref("/species/"), key: "species" },
  { label: "About", href: academyHref("/about/"), key: "about" },
];

export function JsonLd({
  value,
}: {
  value: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const json = JSON.stringify(value).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function SeoHeader({ current }: { current?: string }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <a className="brand" href={academyHref("/")} aria-label={`${content.metadata.title} home`}>
          <span className="brand-mark" aria-hidden="true"><span>{content.brand.mark}</span></span>
          <span className="brand-name">{content.brand.lineOne}<strong>{content.brand.lineTwo}</strong></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {seoNavigation.map((item) => (
            <a href={item.href} aria-current={current === item.key ? "page" : undefined} key={item.key}>
              {item.label}
            </a>
          ))}
        </nav>
        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {seoNavigation.map((item) => (
              <a href={item.href} aria-current={current === item.key ? "page" : undefined} key={item.key}>
                {item.label}
              </a>
            ))}
          </nav>
        </details>
        {content.navigation.showApplyButton && (
          <a className="header-cta" href={`${academyHref("/")}#apply`}>
            {content.navigation.applyLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>
    </>
  );
}

export function SeoBreadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href
              ? <a href={item.href}>{item.label}</a>
              : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SeoFooter() {
  return (
    <footer>
      <a className="brand footer-brand" href={academyHref("/")}>
        <span className="brand-mark" aria-hidden="true"><span>{content.brand.mark}</span></span>
        <span className="brand-name">{content.brand.lineOne}<strong>{content.brand.lineTwo}</strong></span>
      </a>
      <p>{content.footer.description}</p>
      <div className="footer-links">
        <a href={academyHref("/curriculum/")}>Curriculum</a>
        <a href={academyHref("/module-1/")}>Module 1</a>
        <a href={academyHref("/module-2/")}>Module 2</a>
        <a href={academyHref("/module-3/")}>Module 3</a>
        <a href={academyHref("/projects/track-recovery-after-fire/")}>Field Lab 06</a>
        <a href={academyHref("/species/")}>Species Atlas</a>
        <a href={academyHref("/about/")}>About</a>
        <a href="https://github.com/kaskevich" rel="me">Volha Kaskevich on GitHub</a>
        <a href={content.footer.contactHref}>{content.footer.contactLabel}</a>
      </div>
      <div className="footer-bottom"><span>{content.footer.copyright}</span><span>{content.footer.manifesto}</span></div>
    </footer>
  );
}
