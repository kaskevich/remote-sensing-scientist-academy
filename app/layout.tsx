import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const siteUrl = new URL(`${protocol}://${host}`);
  const title = "Remote Sensing Scientist Academy";
  const description =
    "Practical, rigorous online training for the next generation of remote sensing scientists.";

  return {
    metadataBase: siteUrl,
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: siteUrl,
      images: [
        {
          url: new URL("/og.png", siteUrl).toString(),
          width: 1536,
          height: 1024,
          alt: "Remote Sensing Scientist Academy — Read the planet. Shape what comes next.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/og.png", siteUrl).toString()],
    },
  };
}

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
