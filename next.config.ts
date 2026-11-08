import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

// Serwist builds the service worker with webpack, so use `next build --webpack` (see package.json).
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  // Large static study bundles are cached at runtime (see app/sw.ts), not precached.
  globPublicPatterns: ["**/*.{png,svg,ico,webmanifest}"],
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withSerwist(nextConfig);
