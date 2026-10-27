import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // README → Security: /download and /api/* are dynamic and never indexed.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
    return [
      { source: "/download", headers: noindex },
      { source: "/api/:path*", headers: noindex },
    ]
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
