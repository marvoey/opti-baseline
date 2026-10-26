import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @optimizely/cms-cli is an oclif CLI tool — its deps (like @oclif/core) are
  // not bundleable. Tell Next.js to leave the package as a native Node require.
  serverExternalPackages: ['@optimizely/cms-cli'],
  // Dev-only Next.js badge; bottom-left lines up with the utility bar's reserved left gutter.
  devIndicators: { position: 'bottom-left' },
};

export default nextConfig;
