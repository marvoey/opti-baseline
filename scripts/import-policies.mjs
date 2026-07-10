// Import policies.json into Optimizely CMS as the 4 Resolve intent copy types.
//
// Usage:
//   node scripts/import-policies.mjs [--dry-run] [--concurrency=N]
//
// Auth: reads OPTIMIZELY_CMS_CLIENT_ID + OPTIMIZELY_CMS_CLIENT_SECRET + OPTIMIZELY_CMS_API_URL
// from .env (same vars used by gen:locales and opti-cli).

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE = join(ROOT, 'app', '[locale]', 'kb-workspace', '_data', 'policies.json');
const ROOT_CONTAINER_KEY = '43f936c99b234ea397b261c538ad07c9';

// Map CopyType → CMS content type key
const TYPE_MAP = {
  'Core Principle': 'PrgvCorePrinciple',
  'Jurisdictional Override': 'PrgvJurisdictionalOverride',
  'Statutory Disclosure': 'PrgvStatutoryDisclosure',
  'Procedural Safeguard': 'PrgvProceduralSafeguard',
};

// --- CLI args ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
const CONCURRENCY = concurrencyArg ? parseInt(concurrencyArg.split('=')[1], 10) : 5;

// --- Env ---
if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try {
    process.loadEnvFile(join(ROOT, '.env'));
  } catch {
    // no .env, rely on process.env
  }
}

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');

// --- Auth ---
let _token = null;
let _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const res = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (!data?.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  _token = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in - 30) * 1000;
  return _token;
}

// --- HTTP helper with retry on 429 ---
async function apiFetch(path, options = {}, retries = 3) {
  const token = await getToken();
  const url = `${GATEWAY}/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  if (res.status === 429 && retries > 0) {
    const retryAfter = parseInt(res.headers.get('retry-after') ?? '5', 10);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return apiFetch(path, options, retries - 1);
  }
  return res;
}

// --- Create + publish one content item ---
async function importBlock(block, index, total) {
  const contentType = TYPE_MAP[block.CopyType];
  if (!contentType) {
    console.warn(`  [${index + 1}/${total}] SKIP unknown CopyType: ${block.CopyType}`);
    return { status: 'skipped' };
  }

  const displayName = block.InternalName;
  const body = {
    contentType,
    container: ROOT_CONTAINER_KEY,
    initialVersion: {
      displayName,
      locale: 'en',
      properties: {
        InternalName: { value: block.InternalName },
        LOB: { value: block.Taxonomy.LOB },
        Topic: { value: block.Taxonomy.Topic },
        // CorePrinciple is always National — Jurisdiction field was removed from that type
        ...(contentType !== 'PrgvCorePrinciple' && {
          Jurisdiction: { value: block.Taxonomy.Jurisdiction },
        }),
        RichTextValue: { value: { html: block.RichTextValue } },
      },
    },
  };

  if (DRY_RUN) {
    console.log(`  [${index + 1}/${total}] DRY-RUN ${contentType}: ${displayName}`);
    return { status: 'dry-run' };
  }

  // 1. Create
  const createRes = await apiFetch('/content', {
    method: 'POST',
    headers: {
      'cms-skip-validation': '*',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (createRes.status === 409) {
    console.log(`  [${index + 1}/${total}] EXISTS ${contentType}: ${displayName}`);
    return { status: 'exists' };
  }

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error(`  [${index + 1}/${total}] ERROR creating ${displayName}: ${createRes.status} ${err}`);
    return { status: 'error', detail: err };
  }

  const created = await createRes.json();
  const contentKey = created.key;
  const version = created.initialVersion?.version;

  if (!contentKey || !version) {
    console.error(`  [${index + 1}/${total}] ERROR: missing key/version in response for ${displayName}`);
    return { status: 'error', detail: 'missing key or version' };
  }

  // 2. Publish
  const pubRes = await apiFetch(`/content/${contentKey}/versions/${version}:publish`, {
    method: 'POST',
  });

  if (!pubRes.ok) {
    const err = await pubRes.text();
    console.warn(`  [${index + 1}/${total}] WARN: created but publish failed for ${displayName}: ${pubRes.status} ${err}`);
    return { status: 'created-unpublished' };
  }

  console.log(`  [${index + 1}/${total}] OK ${contentType}: ${displayName}`);
  return { status: 'ok' };
}

// --- Concurrency pool ---
async function runPool(items, fn, concurrency) {
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

// --- Main ---
async function main() {
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    console.error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');
    process.exit(1);
  }

  const raw = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  const blocks = raw.blocks ?? raw;
  console.log(`Loaded ${blocks.length} blocks from policies.json`);
  if (DRY_RUN) console.log('DRY-RUN mode — no changes will be made');
  console.log(`Concurrency: ${CONCURRENCY} | Gateway: ${GATEWAY}`);
  console.log('---');

  const results = await runPool(blocks, importBlock, CONCURRENCY);

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  console.log('---');
  console.log('Done:', JSON.stringify(counts));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
