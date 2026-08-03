// Shared utilities for all seed import scripts.

import { join } from 'node:path';

// --- Env loader ---
export function loadEnv(root) {
  if (typeof process.loadEnvFile === 'function') {
    try { process.loadEnvFile(join(root, '.env')); } catch { /* no .env — rely on process.env */ }
  }
}

// --- Arg parser ---
export function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
  const concurrency = concurrencyArg ? parseInt(concurrencyArg.split('=')[1], 10) : 5;
  const containerArg = args.find(a => a.startsWith('--container='));
  const container = containerArg?.split('=')[1] ?? null;
  return { dryRun, concurrency, container };
}

// --- API client factory ---
// Returns an apiFetch(path, options) function bound to the given gateway + credentials.
// 429 handling:
//   - A shared _rateLimitUntil timestamp gates ALL requests from this client, so every
//     concurrent worker pauses — not just the one that received the 429.
//   - Retries up to MAX_RETRIES times with exponential backoff + jitter on top of any
//     Retry-After header value.
export function createApiClient(gateway, clientId, clientSecret) {
  const MAX_RETRIES = 6;
  const BASE_BACKOFF_MS = 1000; // minimum added delay on retry 1

  let _token = null;
  let _tokenExpiry = 0;
  let _rateLimitUntil = 0; // shared across all concurrent callers

  async function getToken() {
    if (_token && Date.now() < _tokenExpiry) return _token;
    const res = await fetch(`${gateway}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const data = await res.json();
    if (!data?.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
    _token = data.access_token;
    _tokenExpiry = Date.now() + (data.expires_in - 30) * 1000;
    return _token;
  }

  async function apiFetch(path, options = {}, attempt = 0) {
    // Gate: wait out any active rate-limit window before sending.
    const gateWait = _rateLimitUntil - Date.now();
    if (gateWait > 0) await sleep(gateWait);

    const token = await getToken();
    const res = await fetch(`${gateway}/v1${path}`, {
      ...options,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    });

    if (res.status === 429 && attempt < MAX_RETRIES) {
      const retryAfterSec = parseInt(res.headers.get('retry-after') ?? '10', 10);
      // Exponential backoff: BASE * 2^attempt, capped at 60 s, plus ±20 % jitter.
      const backoff = Math.min(BASE_BACKOFF_MS * 2 ** attempt, 60_000);
      const jitter = backoff * (0.8 + Math.random() * 0.4);
      const totalMs = retryAfterSec * 1000 + jitter;
      // Push the global gate forward so sibling workers also pause.
      _rateLimitUntil = Math.max(_rateLimitUntil, Date.now() + totalMs);
      console.warn(
        `  [429] Rate-limited — all workers pausing ~${Math.ceil(totalMs / 1000)}s ` +
        `(attempt ${attempt + 1}/${MAX_RETRIES})`
      );
      await sleep(totalMs);
      return apiFetch(path, options, attempt + 1);
    }

    return res;
  }

  return { apiFetch };
}

// --- Concurrency pool ---
export async function runPool(items, fn, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx, items.length);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// --- Helpers ---
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export function summarise(results) {
  return results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
}
