import type { NextConfig } from "next";

// Extra hostnames (no scheme or port) allowed to request the dev server, e.g. an
// ngrok tunnel. Shares the DEV_HOSTS env var with lib/siteHost.ts.
const devHosts = (process.env.DEV_HOSTS ?? '')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins: devHosts,
  // @optimizely/cms-cli is an oclif CLI tool — its deps (like @oclif/core) are
  // not bundleable. Tell Next.js to leave the package as a native Node require.
  serverExternalPackages: ['@optimizely/cms-cli'],
  // CMS (SaaS) assets are stored as uploaded (the eHealth photos are 4.5-7.5 MB
  // PNGs) and the asset host ignores resize parameters, so app/_components/CmsImage
  // sends them through Next.js image optimization: resized per slot, AVIF/WebP.
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.cms.optimizely.com' }],
    // Asset URLs change when an editor replaces an image, so a long cache is safe.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    agentUpgrade: 'security',
  },
};

export default nextConfig;
