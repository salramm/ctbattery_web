import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export — produces ./out/ with one folder per route.
  output: "export",
  // Each route becomes /<route>/index.html, served by static hosts.
  trailingSlash: true,
  // Static hosts don't have an Image Optimization API.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
