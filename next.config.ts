import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // Set to false if you don't want to indicate a permanent redirect for SEO purposes
      },
    ];
  },
  output:'export',
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
