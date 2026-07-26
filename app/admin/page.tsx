import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website editor | Remote Sensing Scientist Academy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLauncher() {
  return (
    <main className="admin-shell">
      <section className="admin-card">
        <p className="section-kicker">Website administration</p>
        <h1>Edit the website.</h1>
        <p>
          Sign in with the GitHub account connected to this project. Change the
          text, links, programs, curriculum, application details, and visibility
          settings from one place.
        </p>
        <a
          className="button button-primary button-large"
          href="https://app.pagescms.org/"
          target="_blank"
          rel="noreferrer"
        >
          Open website editor <span aria-hidden="true">↗</span>
        </a>
        <a className="admin-back" href="../">
          ← Return to the academy
        </a>
      </section>
    </main>
  );
}
