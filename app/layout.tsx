import type { Metadata } from "next";
import content from "@/content/site.json";
import "./globals.css";

const siteUrl = new URL(
  `${(
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://kaskevich.github.io/remote-sensing-scientist-academy"
  ).replace(/\/$/, "")}/`,
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: content.metadata.title,
  description: content.metadata.description,
  openGraph: {
    title: content.metadata.title,
    description: content.metadata.description,
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "og.png",
        width: 1536,
        height: 1024,
        alt: `${content.metadata.title} — ${content.hero.title} ${content.hero.accentTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.metadata.title,
    description: content.metadata.description,
    images: ["og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
