/**
 * odp-client.mjs: shared ODP config + REST client for the hrblock ODP scripts.
 *
 * Reads from .env in the project root (real environment variables win):
 *   ODP_PRIVATE_API_KEY   your PRIVATE ODP API key
 *   ODP_REGION            us1 (default) | eu1 | au1
 *   ODP_BASE_URL          optional, overrides the API host derived from ODP_REGION
 * Note: the .env's own BASE_URL is the site URL, hence the ODP_BASE_URL name.
 */

try {
  process.loadEnvFile(new URL('../.env', import.meta.url));
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}

const REGION_HOSTS = {
  us1: 'https://api.us1.odp.optimizely.com',
  eu1: 'https://api.eu1.odp.optimizely.com',
  au1: 'https://api.au1.odp.optimizely.com',
};
export const REGION = (process.env.ODP_REGION || 'us1').trim().toLowerCase();
export const BASE_URL = (process.env.ODP_BASE_URL || REGION_HOSTS[REGION] || '').replace(/\/$/, '');
const API_KEY = process.env.ODP_PRIVATE_API_KEY;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export function fail(msg) { console.error(`\nERROR: ${msg}\n`); process.exit(1); }

/** Exit with a helpful message if the ODP settings are missing/invalid. */
export function requireConfig() {
  if (!API_KEY) fail('ODP_PRIVATE_API_KEY is not set in .env. Copy your PRIVATE key from ODP > Account Settings > APIs.');
  if (!BASE_URL) fail(`Unknown ODP_REGION "${REGION}". Use us1, eu1 or au1 (or set ODP_BASE_URL).`);
}

export async function odp(method, path, body, maxRetries = 4) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (res.ok) return { status: res.status, text };

    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && attempt < maxRetries) {
      const wait = Number(res.headers.get('retry-after')) * 1000 || 500 * 2 ** attempt;
      console.warn(`  ! ${res.status} on ${path}, retrying in ${wait} ms (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(wait);
      continue;
    }
    const err = new Error(`${method} ${path} -> HTTP ${res.status}: ${text.slice(0, 600)}`);
    err.status = res.status;
    throw err;
  }
}
