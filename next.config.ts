import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared cPanel host (CloudLinux/CageFS) has a low process/thread limit.
  // Limit the build to a single worker so static generation doesn't crash
  // with "spawn ... EAGAIN" / uv_thread_create SIGABRT.
  experimental: { cpus: 1 },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.leonardo.ai" },
      { protocol: "https", hostname: "**.leonardo.ai" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "**.cloudfront.net" },
    ],
  },
};

export default nextConfig;
