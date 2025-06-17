import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // You can adjust this to 10mb, 20mb, etc.
    },
  },
  images: {
    domains: ['res.cloudinary.com'],
  }
};

export default nextConfig;
