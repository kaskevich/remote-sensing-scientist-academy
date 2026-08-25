import type { Metadata } from "next";
import content from "@/content/site.json";
import AcademyAuthProvider from "@/app/components/academy-auth-provider";
import { JsonLd } from "@/app/components/seo-navigation";
import { academyAssetUrl, academyUrl } from "@/lib/site-paths";
import "./globals.css";

const siteUrl = new URL(
  `${(
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://kaskevich.github.io/remote-sensing-scientist-academy"
  ).replace(/\/$/, "")}/`,
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Remote Sensing Scientist Academy | GIS, Earth Observation & UAV",
  description:
    "Hands-on training in remote sensing, GIS, Earth observation, UAV imagery, spatial analysis, scientific Python and machine learning with portfolio projects.",
  alternates: { canonical: academyUrl("/") },
  applicationName: content.metadata.title,
  category: "education",
  keywords: [
    "remote sensing",
    "GIS",
    "Earth observation",
    "UAV remote sensing",
    "satellite imagery",
    "geospatial data analysis",
    "scientific Python",
    "machine learning for remote sensing",
  ],
  robots: { index: true, follow: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: "Remote Sensing Scientist Academy | GIS, Earth Observation & UAV",
    description:
      "Hands-on training in remote sensing, GIS, Earth observation, UAV imagery, spatial analysis, scientific Python and machine learning with portfolio projects.",
    type: "website",
    url: academyUrl("/"),
    siteName: content.metadata.title,
    images: [
      {
        url: academyAssetUrl("/og.png"),
        width: 1536,
        height: 1024,
        alt: `${content.metadata.title} — ${content.hero.title} ${content.hero.accentTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Sensing Scientist Academy | GIS, Earth Observation & UAV",
    description:
      "Hands-on training in remote sensing, GIS, Earth observation, UAV imagery, spatial analysis, scientific Python and machine learning with portfolio projects.",
    images: [academyAssetUrl("/og.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd value={[
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: content.metadata.title,
            url: academyUrl("/"),
            description:
              "A professional learning platform for scientific programming, geospatial data science and remote sensing modelling.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: content.metadata.title,
            url: academyUrl("/"),
            description:
              "Hands-on education in remote sensing, GIS, Earth observation, UAV imagery, spatial analysis and reproducible scientific workflows.",
            inLanguage: "en",
          },
        ]} />
        <AcademyAuthProvider>{children}</AcademyAuthProvider>
      </body>
    </html>
  );
}
