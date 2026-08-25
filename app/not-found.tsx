import { PlatformFooter, PlatformHeader } from "@/app/components/platform-navigation";
import { academyHref } from "@/lib/site-paths";

export default function NotFound() {
  return (
    <>
      <PlatformHeader />
      <main className="platform-page not-found-page" id="main-content">
        <header className="platform-page-heading">
          <p className="section-kicker">404</p>
          <h1>This Academy page could not be found</h1>
          <p>The address may be outdated. Continue through the structured curriculum or return to the Academy homepage.</p>
        </header>
        <nav aria-label="Useful Academy links">
          <a className="button button-primary" href={academyHref("/curriculum/")}>Open curriculum</a>
          <a href={academyHref("/module-1/")}>Module 1</a>
          <a href={academyHref("/module-2/")}>Module 2</a>
          <a href={academyHref("/module-3/")}>Module 3</a>
          <a href={academyHref("/")}>Academy homepage</a>
        </nav>
      </main>
      <PlatformFooter />
    </>
  );
}
