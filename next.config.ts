import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev tools button (dev only; never shown in production).
  devIndicators: false,
  cacheComponents: true,
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
