import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Host of the ngrok tunnel that exposes the dev server (e.g. to Opal).
  allowedDevOrigins: ['gaited-sophie-tiresomely.ngrok-free.dev'],
  // @optimizely/cms-cli is an oclif CLI tool — its deps (like @oclif/core) are
  // not bundleable. Tell Next.js to leave the package as a native Node require.
  serverExternalPackages: ['@optimizely/cms-cli'],
};

export default nextConfig;
