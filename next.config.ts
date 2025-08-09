import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repo = 'trading-guide-v2';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isProd ? `/${repo}/` : '',
  basePath: isProd ? `/${repo}` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
