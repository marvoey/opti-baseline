/**
 * Shared plumbing for the CMS seed scripts (seed-shared-blocks.mjs,
 * seed-clp-experience.mjs). Not a script itself — import it.
 *
 * Talks to the Content Management REST API (spec: cms-openapi.json), the same
 * one @optimizely/cms-cli and lib/cms/contentTypes.ts use:
 *   POST /oauth/token                                  -> bearer token
 *   POST /v1/content                                   -> create an item (as a draft)
 *   GET  /v1/content/{key}                             -> does it still exist?
 *   GET  /v1/content/{parent}/items                    -> list a parent's children
 *   GET  /v1/content/{key}/versions                    -> a child's name/route/status
 *   POST /v1/content/{key}/versions/{version}:publish  -> make the draft live
 *
 * The important piece is ensureItem(): "make sure this item exists, exactly once".
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── Env (same pattern as check-content-types.mjs) ─────────────────────────────
// `npm run` passes --env-file=.env already; this covers `node scripts/x.mjs`.
if (!process.env.OPTIMIZELY_CMS_CLIENT_ID && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(join(ROOT, '.env'));
  } catch {
    // no .env — rely on the real environment
  }
}

export const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(
  /\/$/,
  '',
);
export const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE?.trim() || 'en';

export const cliArgs = new Set(process.argv.slice(2));

// ── API helpers ───────────────────────────────────────────────────────────────

export function requireCmsCredentials() {
  const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    throw new Error('Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env.');
  }
}

/** Step 1: OAuth client-credentials -> bearer token. */
export async function getToken() {
  const res = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: process.env.OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}). Check the CMS client id/secret.`);
  const { access_token } = await res.json();
  if (!access_token) throw new Error('Token endpoint returned no access_token.');
  return access_token;
}

/** fetch against {GATEWAY}/v1 with the bearer token; returns the Response. */
export function api(token, path, init = {}) {
  return fetch(`${GATEWAY}/v1${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...(init.body ? { 'content-type': 'application/json' } : {}),
    },
  });
}

export async function failure(res, what) {
  const body = await res.text().catch(() => '');
  return new Error(`${what} failed (${res.status})${body ? `: ${body}` : ''}`);
}

/** { Heading: 'x' } -> { Heading: { value: 'x' } } (the API's PropertyData shape). */
export function toApiProperties(props) {
  return Object.fromEntries(Object.entries(props).map(([k, value]) => [k, { value }]));
}

/** A content reference property value: a key becomes a cms:// URI. */
export const ref = (key) => `cms://content/${key}`;

// ── State file (what we created, so re-runs never duplicate) ──────────────────

export async function loadState(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return {};
  }
}

// Written after EVERY item so a mid-run failure never loses what was created.
export async function saveState(file, state) {
  await writeFile(file, JSON.stringify(state, null, 2) + '\n');
}

// ── Lookups / publishing ──────────────────────────────────────────────────────

/**
 * Find an item that already exists under `parent` (created by an earlier run whose
 * state file was lost, or by hand). `matches(version)` decides if a child is "the
 * same item" — by display name for blocks, by route segment for pages. Oldest
 * match wins. Returns { key, version, status } or undefined.
 */
export async function findExisting(token, parent, contentType, matches) {
  const found = [];
  for (let pageIndex = 0; pageIndex < 20; pageIndex++) {
    const url = `/content/${parent}/items?contentTypes=${encodeURIComponent(contentType)}&pageSize=100&pageIndex=${pageIndex}`;
    const res = await api(token, url);
    if (!res.ok) throw await failure(res, 'Listing parent items');
    const { items = [] } = await res.json();
    for (const item of items) {
      const vres = await api(token, `/content/${item.key}/versions?pageSize=100`);
      if (!vres.ok) continue;
      const { items: versions = [] } = await vres.json();
      if (versions.some(matches)) {
        const latest = versions[0];
        found.push({ key: item.key, version: latest.version, status: latest.status, created: item.created });
      }
    }
    if (items.length < 100) break;
  }
  found.sort((a, b) => String(a.created).localeCompare(String(b.created)));
  return found[0];
}

/** Step 3: publish a draft version. */
export async function publish(token, key, version) {
  const res = await api(token, `/content/${key}/versions/${encodeURIComponent(version)}:publish`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  if (!res.ok) throw await failure(res, `Publish of ${key}`);
}

// ── ensureItem: create-once, track, adopt, publish ────────────────────────────

/**
 * Make sure one item exists under `container`, creating it at most once.
 *
 *   spec.stateKey       unique tracking key (we use "<container>:<our id>")
 *   spec.label          name for log lines
 *   spec.contentType    e.g. 'FdPromoSplit' / 'BlankExperience'
 *   spec.container      key of the parent folder/page
 *   spec.initialVersion the body sent to POST /v1/content (displayName, locale, ...)
 *   spec.matches        (version) => boolean — "is this existing child the same item?"
 *
 *   ctx = { token, state, stateFile, publish: boolean }
 *
 * Decision order (this is what prevents duplicates):
 *   1. Tracked in the state file?  -> still exists? skip it (retry publish if needed).
 *                                     404 in the CMS? forget it and fall through.
 *   2. Not tracked, but already a matching child of `container`?  -> adopt it.
 *   3. Otherwise create it. The key is written to the state file BEFORE publishing,
 *      so a failed publish can never lead to a second create.
 *
 * Returns the state entry: { key, version, published, ... } plus `outcome`
 * ('created' | 'skipped' | 'adopted').
 */
export async function ensureItem(ctx, spec) {
  const { token, state, stateFile } = ctx;
  const persist = () => saveState(stateFile, state);
  let entry = state[spec.stateKey];

  // 1. Tracked — make sure it still exists in the CMS.
  if (entry) {
    const res = await api(token, `/content/${entry.key}`);
    if (res.status === 404) {
      console.log(`! ${spec.label}: tracked item ${entry.key} no longer exists — recreating`);
      delete state[spec.stateKey];
      entry = undefined;
    } else if (!res.ok) {
      throw await failure(res, `Lookup of ${entry.key}`);
    }
  }
  if (entry) {
    if (ctx.publish && !entry.published) {
      await publish(token, entry.key, entry.version);
      entry.published = true;
      await persist();
      console.log(`↑ ${spec.label}: already created (${entry.key}), published now`);
    } else {
      console.log(`= ${spec.label}: already created (${entry.key}) — skipped`);
    }
    return { ...entry, outcome: 'skipped' };
  }

  const record = (key, version, extra = {}) => ({
    key,
    version,
    contentType: spec.contentType,
    displayName: spec.initialVersion.displayName,
    container: spec.container,
    createdAt: new Date().toISOString(),
    published: false,
    ...extra,
  });

  // 2. Untracked, but it may already exist (state file lost, or made by hand).
  const existing = await findExisting(token, spec.container, spec.contentType, spec.matches);
  if (existing) {
    entry = state[spec.stateKey] = record(existing.key, existing.version, {
      published: existing.status === 'published',
      adopted: true,
    });
    await persist();
    console.log(`= ${spec.label}: found under parent (${existing.key}) — adopted, not recreated`);
    if (ctx.publish && !entry.published) {
      await publish(token, entry.key, entry.version);
      entry.published = true;
      await persist();
      console.log('  published');
    }
    return { ...entry, outcome: 'adopted' };
  }

  // 3. Create it as a draft under the container.
  const res = await api(token, '/content', {
    method: 'POST',
    body: JSON.stringify({
      contentType: spec.contentType,
      container: spec.container,
      initialVersion: spec.initialVersion,
    }),
  });
  if (!res.ok) throw await failure(res, `Create of "${spec.label}"`);

  // The reply normally carries { key, initialVersion }. Be defensive: if the body
  // is empty, recover the item with a lookup — never just retry the create.
  const text = await res.text();
  let node = text ? JSON.parse(text) : {};
  let key = node.key;
  let version = node.initialVersion?.version;
  if (!key || !version) {
    const found = await findExisting(token, spec.container, spec.contentType, spec.matches);
    if (!found) throw new Error(`Created "${spec.label}" (HTTP ${res.status}) but could not read it back.`);
    key = found.key;
    version = found.version;
  }

  entry = state[spec.stateKey] = record(key, version);
  await persist(); // record it BEFORE publishing so a publish error can't cause a duplicate
  console.log(`+ ${spec.label}: created (${key}, draft v${version})`);

  if (ctx.publish) {
    await publish(token, key, version);
    entry.published = true;
    await persist();
    console.log('  published');
  }
  return { ...entry, outcome: 'created' };
}
