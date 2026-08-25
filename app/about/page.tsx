import type { Metadata } from "next";
import Image from "next/image";
import content from "@/content/site.json";
import { academyAssetUrl, academyUrl } from "@/lib/site-paths";

export const metadata: Metadata = {
  title: "About | Remote Sensing Scientist Academy",
  description:
    "Meet Volha Kaskevich and learn how environmental research, GIS, UAV and satellite remote sensing shaped the Academy's professional learning pathway.",
  alternates: { canonical: academyUrl("/about/") },
  openGraph: {
    title: "About | Remote Sensing Scientist Academy",
    description:
      "Meet Volha Kaskevich and learn how environmental research, GIS, UAV and satellite remote sensing shaped the Academy's professional learning pathway.",
    type: "profile",
    url: academyUrl("/about/"),
    images: [{ url: academyAssetUrl("/images/volha-kaskevich.jpg"), width: 1200, height: 1800, alt: "Volha Kaskevich in a botanical setting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Remote Sensing Scientist Academy",
    description: "Meet Volha Kaskevich and the environmental research context behind the Remote Sensing Scientist Academy.",
  },
};

const visibleNavigation = content.navigation.items.filter((item) => item.visible);

function aboutNavigationHref(href: string) {
  return href === "about/" ? "./" : `../${href}`;
}

export default function AboutPage() {
  const imageSrc = `${process.env.PAGES_BASE_PATH ?? ""}/images/volha-kaskevich.jpg`;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <a className="brand" href="../" aria-label={`${content.metadata.title} home`}>
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
            <a
              href={aboutNavigationHref(item.href)}
              aria-current={item.label === "About" ? "page" : undefined}
              key={`${item.label}-${item.href}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {visibleNavigation.map((item) => (
              <a
                href={aboutNavigationHref(item.href)}
                aria-current={item.label === "About" ? "page" : undefined}
                key={`${item.label}-${item.href}`}
              >
                {item.label}
              </a>
            ))}
            {content.navigation.showApplyButton && (
              <a className="mobile-apply" href="../#apply">
                {content.navigation.applyLabel} ↗
              </a>
            )}
          </nav>
        </details>

        {content.navigation.showApplyButton && (
          <a className="header-cta" href="../#apply">
            {content.navigation.applyLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>

      <main className="about-main" id="main-content">
        <header className="about-heading">
          <h1>About</h1>
        </header>

        <div className="about-layout">
          <figure className="about-portrait">
            <Image
              src={imageSrc}
              alt="Volha Kaskevich in a botanical setting"
              width={1200}
              height={1800}
              sizes="(max-width: 760px) 72vw, 330px"
              priority
              unoptimized
            />
          </figure>

          <article className="about-copy">
            <p className="about-lead">
              I am Volha Kaskevich, an environmental scientist and PhD researcher at the Estonian University of Life Sciences. My research focuses on coastal wetlands and green and blue infrastructure, combining field ecology with GIS, UAV and satellite remote sensing, spatial analysis, data modelling and machine learning.
            </p>

            <p>
              I did not start my career in GIS or data science. My background is in nature conservation and environmental projects, and in 2021 I began building the technical side of my career almost from scratch.
            </p>

            <p>
              I started with formal education and took every opportunity to learn. In about one year, I completed 64 ECTS of additional university courses in GIS, remote sensing, data modelling, R programming and related subjects alongside my doctoral studies. It gave me a strong foundation, but it also helped me understand something important about the way I learn.
            </p>

            <p>
              For me, the most effective education happens independently and around a subject I am genuinely interested in. I like being able to set my own pace, decide when a basic understanding is enough and when I want to go much deeper, and spend as much time as necessary on something until I really understand it. Most importantly, I learn much better when a method is connected to a real problem I am trying to solve rather than to an exercise I need to complete with a group or by the end of a class.
            </p>

            <p>
              My PhD became exactly that environment. GIS, remote sensing, statistics, R, UAV data and machine learning stopped being separate subjects and became tools I needed for my own research. Now I am adding Python to that toolkit to become more independent in data analysis, geospatial workflows, automation and reproducible research.
            </p>

            <p className="about-purpose">
              This is why I created the Remote Sensing Scientist Academy.
            </p>

            <p>
              It began as a learning platform for myself: a place where I could organise what I need to learn, start with the fundamentals, understand why a method is used before learning how to implement it, practise on realistic data and gradually build complete professional workflows. Then I realised that the same structure could be useful to other people learning their way into this field.
            </p>

            <p>
              The Academy is therefore both a personal learning project and an open educational resource. It follows a path through scientific programming, data analysis, geospatial data science, remote sensing and machine learning, with an emphasis on practical work, scientific reasoning and reproducibility.
            </p>

            <p>
              It is particularly intended for researchers, students, ecologists, conservation professionals and GIS users who want to become more technically independent without having to come from computer science.
            </p>

            <p>
              I currently work as a Junior Research Fellow at the Estonian University of Life Sciences, Institute of Agricultural and Environmental Sciences, Chair of Environmental Protection and Landscape Management.
            </p>

            <p>
              You can find my research, publications and academic background on{" "}
              <a href="https://www.etis.ee/CV/Volha_Kaskevich/eng/" target="_blank" rel="noopener noreferrer">
                ETIS
              </a>
              , learn more about my work through the{" "}
              <a href="https://www.emu.ee/en/contacts/volha-kaskevich" target="_blank" rel="noopener noreferrer">
                Estonian University of Life Sciences
              </a>
              , or connect with me professionally on{" "}
              <a href="https://ee.linkedin.com/in/volha-kaskevich-b13439b3" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              .
            </p>

            <div className="about-closing">
              <strong>Remote Sensing Scientist Academy</strong>
              <span>From beginner to Earth Observation professional.</span>
            </div>
          </article>
        </div>
      </main>

      <footer>
        <a className="brand footer-brand" href="../">
          <span className="brand-mark" aria-hidden="true">
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
            <a
              href={aboutNavigationHref(item.href)}
              aria-current={item.label === "About" ? "page" : undefined}
              key={`${item.label}-${item.href}`}
            >
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
    </>
  );
}
