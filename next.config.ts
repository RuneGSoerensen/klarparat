import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Exclude the functions directory from the build
    config.externals = [...(config.externals || []), { 'firebase-functions': 'firebase-functions' }];
    return config;
  },
};

export default nextConfig;
