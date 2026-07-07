/**
 * Fail-fast environment validation. Call requireEnv() at startup (it's invoked
 * from cms/registry.ts) so a fresh clone with a missing/blank .env throws a
 * clear, named error instead of a confusing Optimizely Graph failure later.
 *
 * Only the vars the runtime truly needs to fetch content are required here.
 * CMS-CLI-only vars (client id/secret) and optional ones (Web snippet, preview
 * secret) are intentionally NOT required so `npm run dev` works as soon as Graph
 * is configured.
 */

const REQUIRED = ['OPTIMIZELY_GRAPH_SINGLE_KEY'] as const;

type RequiredKey = (typeof REQUIRED)[number];

type Env = {
  OPTIMIZELY_GRAPH_SINGLE_KEY: string;
  /** Optional — the SDK defaults to https://cg.optimizely.com/content/v2. */
  OPTIMIZELY_GRAPH_GATEWAY: string | undefined;
};

let cached: Env | undefined;

export function requireEnv(): Env {
  if (cached) return cached;

  const missing: RequiredKey[] = REQUIRED.filter((k) => !process.env[k]?.trim());
  if (missing.length) {
    throw new Error(
      `[env] Missing required environment variable(s): ${missing.join(', ')}.\n` +
        `Copy .env.example to .env and fill in your Optimizely Graph credentials. ` +
        `See the README "Spin up a new demo" steps.`,
    );
  }

  cached = {
    OPTIMIZELY_GRAPH_SINGLE_KEY: process.env.OPTIMIZELY_GRAPH_SINGLE_KEY!,
    OPTIMIZELY_GRAPH_GATEWAY: process.env.OPTIMIZELY_GRAPH_GATEWAY,
  };
  return cached;
}
