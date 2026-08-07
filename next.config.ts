import type { NextConfig } from "next";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Scan app/(pages)/ and return the first-level directory names.
 * These map directly to URL path segments (e.g. app/(pages)/about → /about).
 * Returns an empty array if the directory doesn't exist yet.
 */
function detectPagesRoutes(): string[] {
  const dir = join(process.cwd(), "app", "(pages)");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

// Merge PROXY_EXCLUDED_PATHS from .env with auto-detected app/(pages)/ routes.
// next.config.ts runs after Next.js loads .env, so process.env values are already
// populated. The merged list is inlined into the proxy/middleware bundle via `env`,
// so proxy.ts needs no changes — it reads process.env.PROXY_EXCLUDED_PATHS as usual.
const manualExclusions = (process.env.PROXY_EXCLUDED_PATHS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const detectedRoutes = detectPagesRoutes();
const allExclusions = [...new Set([...manualExclusions, ...detectedRoutes])];

if (detectedRoutes.length) {
  console.log(
    `[next.config] Auto-excluded from proxy: ${detectedRoutes.join(", ")}`,
  );
}

const nextConfig: NextConfig = {
  env: {
    // Overrides the raw .env value with the merged set so the proxy bundle
    // always has the full exclusion list baked in at compile time.
    PROXY_EXCLUDED_PATHS: allExclusions.join(","),
  },
};

export default nextConfig;
