import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static export issues with dynamic features
  output: 'standalone',
  
  // Ensure service worker is served correctly
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
