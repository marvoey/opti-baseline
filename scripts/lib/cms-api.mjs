/**
 * Shared helpers for the permanent CMS automation scripts
 * (cms:align, cms:e2e, cms:bulk).
 *
 * - .env loading that never overrides values already in the environment
 * - OAuth client-credentials token (cached, refreshed on 401)
 * - A small REST client for the CMS (SaaS) Content API v1 with retry/backoff
 *   for 429 and 5xx, and pagination helpers
 * - A minimal Optimizely Graph client (single key)
 * - Tiny CLI/colour/format utilities (no dependencies)
 *
 * Plain Node (>= 22), ESM, no build step. Safe to import from any script in
 * /scripts. Do NOT import this from app/, cms/ or lib/ (it is tooling only).
 */

import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// ── Env ──────────────────────────────────────────────────────────────────────
export function loadEnv() {
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(join(ROOT, '.env')); // does not overwrite existing vars
    } catch {
      /* no .env — rely on the real environment (CI/Vercel) */
    }
  }
}
loadEnv();

export function requireVars(names) {
  const missing = names.filter((n) => !process.env[n]?.trim());
  if (missing.length) {
    throw new Error(`Missing environment variable(s): ${missing.join(', ')} (set them in .env)`);
  }
}

/** Hyphenless lowercase 32-hex key, the form the CMS uses in `cms://content/<key>` refs. */
export const normKey = (k) => String(k ?? '').replace(/-/g, '').toLowerCase();

// ── Colours / output ─────────────────────────────────────────────────────────
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const wrap = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : String(s));
export const c = {
  green: wrap(32),
  yellow: wrap(33),
  red: wrap(31),
  cyan: wrap(36),
  bold: wrap(1),
  dim: wrap(2),
};
export const ok = (s) => `${c.green('✓')} ${s}`;
export const warn = (s) => `${c.yellow('!')} ${s}`;
export const bad = (s) => `${c.red('✗')} ${s}`;

// ── CLI args:  --flag  --key value  --key=value  positional ─────────────────
export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      out._.push(a);
      continue;
    }
    const eq = a.indexOf('=');
    if (eq > -1) {
      out[a.slice(2, eq)] = a.slice(eq + 1);
    } else {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run `fn` over `items` with at most `limit` in flight. Preserves result order. */
export async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

// ── Deterministic keys ───────────────────────────────────────────────────────
/**
 * Stable 32-hex key from any string(s) — re-running a bulk import always targets
 * the same content item (this is what makes cms:bulk idempotent).
 */
export function deterministicKey(...parts) {
  return createHash('sha1').update(parts.join('::')).digest('hex').slice(0, 32);
}

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

// ── Deep helpers ─────────────────────────────────────────────────────────────
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Drop null/undefined/false/empty-array/empty-object so defaults compare equal to "absent". */
export function stripDefaults(v) {
  if (Array.isArray(v)) return v.map(stripDefaults);
  if (isObj(v)) {
    const out = {};
    for (const [k, val] of Object.entries(v)) {
      const s = stripDefaults(val);
      const empty =
        s === null ||
        s === undefined ||
        s === false ||
        (Array.isArray(s) && s.length === 0) ||
        (isObj(s) && Object.keys(s).length === 0);
      if (!empty) out[k] = s;
    }
    return out;
  }
  return v;
}

/**
 * Subset diff: every key present in `want` must match in `have`.
 * Extra keys in `have` are ignored (the CMS adds timestamps/defaults).
 * Returns a list of { path, want, have } mismatches. Primitive arrays compare
 * order-insensitively; arrays of objects compare by index.
 */
export function subsetDiff(want, have, path = '') {
  const diffs = [];
  if (Array.isArray(want)) {
    if (!Array.isArray(have)) return [{ path: path || '(root)', want, have }];
    const prim = want.every((x) => x === null || typeof x !== 'object');
    if (prim) {
      const a = [...want].map(String).sort();
      const b = [...have].map(String).sort();
      if (a.length !== b.length || a.some((x, i) => x !== b[i])) diffs.push({ path, want, have });
      return diffs;
    }
    if (want.length !== have.length) {
      diffs.push({ path: `${path}.length`, want: want.length, have: have.length });
    }
    want.forEach((w, i) => diffs.push(...subsetDiff(w, have[i], `${path}[${i}]`)));
    return diffs;
  }
  if (isObj(want)) {
    if (!isObj(have)) return [{ path: path || '(root)', want, have }];
    for (const [k, w] of Object.entries(want)) {
      diffs.push(...subsetDiff(w, have[k], path ? `${path}.${k}` : k));
    }
    return diffs;
  }
  if (want !== have) diffs.push({ path: path || '(root)', want, have });
  return diffs;
}

// ── CMS REST client ──────────────────────────────────────────────────────────
export class CmsError extends Error {
  constructor(message, { status, body, method, url } = {}) {
    super(message);
    this.name = 'CmsError';
    this.status = status;
    this.body = body;
    this.method = method;
    this.url = url;
  }
}

function describeProblem(body) {
  if (!body) return '';
  if (typeof body === 'string') return body.slice(0, 500);
  const errs = (body.errors ?? [])
    .map((e) => `${e.field ? `[${e.field}] ` : ''}${e.detail ?? e.message ?? JSON.stringify(e)}`)
    .join('; ');
  return [body.title, body.detail, errs].filter(Boolean).join(' — ');
}

export function createCms({ verbose = false } = {}) {
  requireVars(['OPTIMIZELY_CMS_CLIENT_ID', 'OPTIMIZELY_CMS_CLIENT_SECRET']);
  const base = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
  let token = null;
  let tokenAt = 0;

  async function getToken(force = false) {
    // Tokens last ~5 min; refresh after 4.
    if (!force && token && Date.now() - tokenAt < 4 * 60 * 1000) return token;
    const res = await fetch(`${base}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.OPTIMIZELY_CMS_CLIENT_ID,
        client_secret: process.env.OPTIMIZELY_CMS_CLIENT_SECRET,
      }),
    });
    if (!res.ok) throw new CmsError(`OAuth token request failed: ${res.status} ${res.statusText}`, { status: res.status });
    const data = await res.json();
    if (!data?.access_token) throw new CmsError('OAuth endpoint returned no access_token');
    token = data.access_token;
    tokenAt = Date.now();
    return token;
  }

  /**
   * @param {string} method
   * @param {string} path   e.g. "/v1/content/abc"
   * @param {{query?:object, body?:any, headers?:object, allow?:number[]}} opts
   *   `allow` — status codes that should NOT throw (e.g. [404]).
   * @returns {Promise<{status:number, ok:boolean, data:any, headers:Headers}>}
   */
  async function request(method, path, { query, body, headers = {}, allow = [] } = {}) {
    const url = new URL(`${base}${path}`);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
    let attempt = 0;
    let refreshed = false;
    while (true) {
      const res = await fetch(url, {
        method,
        headers: {
          authorization: `Bearer ${await getToken()}`,
          accept: 'application/json',
          ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (res.status === 401 && !refreshed) {
        refreshed = true;
        await getToken(true);
        continue;
      }
      if ((res.status === 429 || res.status >= 500) && attempt < 5) {
        const retryAfter = Number(res.headers.get('retry-after'));
        const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt;
        if (verbose) console.error(c.dim(`  … ${res.status} on ${method} ${path}, retrying in ${wait}ms`));
        attempt++;
        await sleep(wait);
        continue;
      }

      const text = await res.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }
      const result = { status: res.status, ok: res.ok, data, headers: res.headers };
      if (!res.ok && !allow.includes(res.status)) {
        throw new CmsError(`${method} ${path} → ${res.status} ${res.statusText}${describeProblem(data) ? `: ${describeProblem(data)}` : ''}`, {
          status: res.status,
          body: data,
          method,
          url: String(url),
        });
      }
      return result;
    }
  }

  /** Follow pageIndex/pageSize until exhausted. Returns the concatenated `items`. */
  async function listAll(path, query = {}, { pageSize = 100, maxPages = 100 } = {}) {
    const all = [];
    for (let pageIndex = 0; pageIndex < maxPages; pageIndex++) {
      const { data } = await request('GET', path, { query: { ...query, pageIndex, pageSize } });
      const items = data?.items ?? [];
      all.push(...items);
      if (items.length < pageSize || (typeof data?.totalCount === 'number' && all.length >= data.totalCount)) break;
    }
    return all;
  }

  return {
    base,
    request,
    listAll,
    getToken,
    get: (p, o) => request('GET', p, o),
    post: (p, body, o) => request('POST', p, { ...o, body }),
    // Every PATCH in the CMS Content API is RFC 7396 merge-patch; plain application/json returns 415.
    patch: (p, body, o) =>
      request('PATCH', p, { ...o, body, headers: { 'content-type': 'application/merge-patch+json', ...(o?.headers ?? {}) } }),
    del: (p, o) => request('DELETE', p, o),
  };
}

// ── Optimizely Graph (single key) ────────────────────────────────────────────
export async function graphQuery(query, variables = {}) {
  requireVars(['OPTIMIZELY_GRAPH_SINGLE_KEY']);
  const gw = (process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2').replace(/\/$/, '');
  const url = `${gw}${gw.includes('?') ? '&' : '?'}auth=${encodeURIComponent(process.env.OPTIMIZELY_GRAPH_SINGLE_KEY)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.errors?.length) {
    const msg = json?.errors?.map((e) => e.message).join('; ') || `${res.status} ${res.statusText}`;
    throw new Error(`Graph query failed: ${msg}`);
  }
  return json.data;
}

/** Final summary line + exit code helper for scripts. */
export function finish(name, { failures = 0, warnings = 0 } = {}) {
  if (failures > 0) {
    console.log(bad(`${name}: ${failures} failure(s)${warnings ? `, ${warnings} warning(s)` : ''}`));
    process.exitCode = 1;
  } else {
    console.log(ok(`${name}: passed${warnings ? ` with ${warnings} warning(s)` : ''}`));
  }
}

export function fatal(name, err) {
  console.error(c.red(`\n[${name}] ${err instanceof Error ? err.message : err}`));
  process.exitCode = 1;
}
