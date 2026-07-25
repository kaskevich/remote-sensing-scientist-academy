import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL(
  `${(
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://kaskevich.github.io/remote-sensing-scientist-academy"
  ).replace(/\/$/, "")}/`,
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Remote Sensing Scientist Academy",
  description:
    "Practical, rigorous online training for the next generation of remote sensing scientists.",
  openGraph: {
    title: "Remote Sensing Scientist Academy",
    description:
      "Practical, rigorous online training for the next generation of remote sensing scientists.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "og.png",
        width: 1536,
        height: 1024,
        alt: "Remote Sensing Scientist Academy — Read the planet. Shape what comes next.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Sensing Scientist Academy",
    description:
      "Practical, rigorous online training for the next generation of remote sensing scientists.",
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
