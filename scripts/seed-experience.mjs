/**
 * Create and publish a BlankExperience from a JSON seed file.
 *
 * Usage:
 *   node scripts/seed-experience.mjs <path-to-seed.json>
 *   npm run seed:experience -- <path-to-seed.json>
 *
 * Required env vars (add to .env):
 *   OPTIMIZELY_CMS_CLIENT_ID
 *   OPTIMIZELY_CMS_CLIENT_SECRET
 *   OPTIMIZELY_CMS_API_URL   (optional, defaults to https://api.cms.optimizely.com)
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

// Load .env via Next.js env loader (no dotenv dependency required).
try {
  const require = createRequire(import.meta.url);
  const { loadEnvConfig } = require('@next/env');
  loadEnvConfig(process.cwd());
} catch {
  // Running outside Next context — env must be set externally.
}

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';
const ROOT_CONTAINER_KEY = process.env.ROOT_CONTAINER ?? '43f936c99b234ea397b261c538ad07c9';

function apiBase() {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

function readCredentials() {
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      'Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env\n' +
        '(create an API Client in CMS admin → Settings → API Clients).',
    );
  }
  return { clientId, clientSecret };
}

async function getAccessToken(base, clientId, clientSecret) {
  const res = await fetch(`${base}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}). Check credentials.`);
  const data = await res.json();
  if (!data.access_token) throw new Error('Token endpoint returned no access_token.');
  return data.access_token;
}

async function createExperience(base, token, seed) {
  const body = {
    contentType: seed.contentType ?? 'BlankExperience',
    container: seed.container ?? ROOT_CONTAINER_KEY,
    initialVersion: {
      displayName: seed.displayName,
      locale: seed.locale ?? 'en',
      ...(seed.routeSegment ? { routeSegment: seed.routeSegment } : {}),
      properties: {},
    },
  };
  if (seed.key) body.key = seed.key;

  const res = await fetch(`${base}/v1/content`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      'cms-skip-validation': '*',
      prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (res.status === 409) {
    const existing = await res.json();
    if (existing.key && existing.version != null) return { key: existing.key, version: existing.version };
    throw new Error('Experience already exists but response is missing key/version.');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /content failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const key = data.key;
  const version = data.initialVersion?.version ?? data.version;
  if (!key || version == null) throw new Error('POST /content response missing key or version.');
  return { key, version };
}

async function patchComposition(base, token, key, version, composition) {
  const res = await fetch(`${base}/v1/content/${encodeURIComponent(key)}/versions/${version}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/merge-patch+json',
      authorization: `Bearer ${token}`,
      'cms-skip-validation': '*',
    },
    body: JSON.stringify({ composition }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH composition failed (${res.status}): ${text}`);
  }
}

async function publishVersion(base, token, key, version) {
  const res = await fetch(`${base}/v1/content/${encodeURIComponent(key)}/versions/${version}:publish`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Publish failed (${res.status}): ${text}`);
  }
}

// ---------------------------------------------------------------------------

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/seed-experience.mjs <path-to-seed.json>');
  process.exit(1);
}

let seed;
try {
  seed = JSON.parse(readFileSync(resolve(process.cwd(), filePath), 'utf8'));
} catch (err) {
  console.error(`Could not read seed file: ${err.message}`);
  process.exit(1);
}

if (!seed.displayName || !seed.composition) {
  console.error('Seed file must have "displayName" and "composition" fields.');
  process.exit(1);
}

try {
  const cred = readCredentials();
  const base = apiBase();

  console.log(`Authenticating…`);
  const token = await getAccessToken(base, cred.clientId, cred.clientSecret);

  console.log(`Creating experience "${seed.displayName}"…`);
  const { key, version } = await createExperience(base, token, seed);

  console.log(`Patching composition…`);
  await patchComposition(base, token, key, version, seed.composition);

  console.log(`Publishing…`);
  await publishVersion(base, token, key, version);

  const slug = seed.routeSegment ?? seed.displayName.toLowerCase().replace(/\s+/g, '-');
  console.log(`\nDone.`);
  console.log(`  Key:     ${key}`);
  console.log(`  Version: ${version}`);
  console.log(`  URL:     /${slug}`);
} catch (err) {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
}
