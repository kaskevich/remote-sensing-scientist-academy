import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = pagesBasePath
  ? {
      output: "export",
      basePath: pagesBasePath,
      assetPrefix: pagesBasePath,
      trailingSlash: true,
      env: {
        NEXT_PUBLIC_BASE_PATH: pagesBasePath,
      },
    }
  : {
      env: {
        NEXT_PUBLIC_BASE_PATH: "",
      },
    };

export default nextConfig;
