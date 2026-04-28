import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    domains: [],
    unoptimized: true,
  },
};

export default nextConfig;
