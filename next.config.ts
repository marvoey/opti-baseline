import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @optimizely/cms-cli is an oclif CLI tool — its deps (like @oclif/core) are
  // not bundleable. Tell Next.js to leave the package as a native Node require.
  serverExternalPackages: ['@optimizely/cms-cli'],
  // Next.js blocks cross-origin requests to dev-only assets/endpoints by
  // default, trusting only localhost. Allow ngrok tunnels so the dev server's
  // client bundle can hydrate when the app is accessed through one.
  allowedDevOrigins: ['*.ngrok-free.dev'],
};

export default nextConfig;
