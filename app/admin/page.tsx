import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site editor | Remote Sensing Scientist Academy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLauncher() {
  return (
    <main className="admin-shell">
      <section className="admin-card">
        <p className="section-kicker">Academy administration</p>
        <h1>Update the website.</h1>
        <p>
          Sign in with the GitHub account that owns this website. Pages CMS lets
          you edit text, links, programs, curriculum, application details, and
          visibility settings without touching the code.
        </p>
        <a
          className="button button-primary button-large"
          href="https://app.pagescms.org/"
          target="_blank"
          rel="noreferrer"
        >
          Open secure editor <span aria-hidden="true">↗</span>
        </a>
        <a className="admin-back" href="../">
          ← Return to the academy
        </a>
      </section>
    </main>
  );
}
