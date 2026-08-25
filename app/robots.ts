import type { MetadataRoute } from "next";
import { academyProductionBasePath, academyUrl } from "@/lib/site-paths";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: `${academyProductionBasePath}/`,
      disallow: [`${academyProductionBasePath}/admin/`],
    },
    sitemap: academyUrl("/sitemap.xml"),
  };
}
