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
  experimental: {
    agentUpgrade: 'security',
  },
};

export default nextConfig;
