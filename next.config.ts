import type { NextConfig } from "next";

const CMS_URL = (process.env.OPTIMIZELY_CMS_URL ?? '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['progressive.ngrok.app'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.optimizely.com' },
    ],
  },
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
