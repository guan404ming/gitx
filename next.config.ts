import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "www.apache.org" },
      { hostname: "github.com" },
    ],
  },
};

export default nextConfig;
