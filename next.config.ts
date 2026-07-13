import type { NextConfig } from "next";

const CMS_URL = (process.env.OPTIMIZELY_CMS_URL ?? '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/util/:path*',
        destination: `${CMS_URL}/util/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
