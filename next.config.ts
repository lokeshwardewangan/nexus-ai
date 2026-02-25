import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imgbb.com" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
  // Document parsers are server-only CJS with dynamic requires — keep them
  // external so they run from node_modules instead of being bundled.
  serverExternalPackages: ["mammoth", "xlsx", "unpdf"],
};

export default nextConfig;
