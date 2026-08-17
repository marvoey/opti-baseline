import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @optimizely/cms-cli is an oclif CLI tool — its deps (like @oclif/core) are
  // not bundleable. Tell Next.js to leave the package as a native Node require.
  serverExternalPackages: ['@optimizely/cms-cli'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.livingspaces.com', pathname: '/globalassets/**' },
    ],
  },
};

export default nextConfig;
