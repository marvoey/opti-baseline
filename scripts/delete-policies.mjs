// Delete all policy content items (all 4 Resolve types) from the CMS.
//
// Usage:
//   node scripts/delete-policies.mjs [--dry-run] [--concurrency=N]
//
// Auth: reads OPTIMIZELY_CMS_CLIENT_ID + OPTIMIZELY_CMS_CLIENT_SECRET from .env

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const POLICY_TYPES = [
  'PrgvCorePrinciple',
  'PrgvJurisdictionalOverride',
  'PrgvStatutoryDisclosure',
  'PrgvProceduralSafeguard',
];

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
const CONCURRENCY = concurrencyArg ? parseInt(concurrencyArg.split('=')[1], 10) : 5;

if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* no .env */ }
}

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GRAPH_GATEWAY = (process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2').replace(/\/$/, '');
const CMS_GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const GRAPH_SINGLE_KEY = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

// --- CMS auth ---
let _token = null;
let _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const res = await fetch(`${CMS_GATEWAY}/oauth/token`, {
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

// --- Fetch all keys via Graph ---
async function fetchAllKeys(typeName) {
  if (!GRAPH_SINGLE_KEY) throw new Error('OPTIMIZELY_GRAPH_SINGLE_KEY is not set');
  const keys = [];
  let skip = 0;
  const limit = 100;
  while (true) {
    const query = `{ ${typeName}(limit: ${limit}, skip: ${skip}) { items { _metadata { key } } total } }`;
    const res = await fetch(GRAPH_GATEWAY, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `epi-single ${GRAPH_SINGLE_KEY}` },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error(`Graph ${res.status} for ${typeName}`);
    const json = await res.json();
    const page = json.data?.[typeName];
    const items = page?.items ?? [];
    const total = page?.total ?? 0;
    keys.push(...items.map(i => i._metadata?.key).filter(Boolean));
    skip += limit;
    if (skip >= total || items.length < limit) break;
  }
  return keys;
}

// --- Delete one item (with 429 retry) ---
async function deleteItem(key, index, total, retries = 5) {
  if (DRY_RUN) {
    console.log(`  [${index + 1}/${total}] DRY-RUN delete ${key}`);
    return 'dry-run';
  }
  const token = await getToken();
  const res = await fetch(`${CMS_GATEWAY}/v1/content/${key}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
  if (res.ok || res.status === 404) {
    console.log(`  [${index + 1}/${total}] DELETED ${key}`);
    return 'ok';
  }
  if (res.status === 429 && retries > 0) {
    const wait = parseInt(res.headers.get('retry-after') ?? '30', 10) * 1000;
    console.warn(`  [${index + 1}/${total}] 429 — waiting ${wait / 1000}s (${retries} retries left)`);
    await new Promise(r => setTimeout(r, wait));
    return deleteItem(key, index, total, retries - 1);
  }
  const err = await res.text();
  console.error(`  [${index + 1}/${total}] ERROR ${key}: ${res.status} ${err}`);
  return 'error';
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

async function main() {
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    console.error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');
    process.exit(1);
  }

  if (DRY_RUN) console.log('DRY-RUN mode — no changes will be made');

  const allKeys = [];
  for (const type of POLICY_TYPES) {
    process.stdout.write(`Fetching ${type}… `);
    const keys = await fetchAllKeys(type);
    console.log(`${keys.length} items`);
    allKeys.push(...keys);
  }

  // Deduplicate (Graph can return duplicates across locales)
  const unique = [...new Set(allKeys)];
  console.log(`\nTotal unique keys to delete: ${unique.length}`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log('---');

  const results = await runPool(unique, deleteItem, CONCURRENCY);
  const counts = results.reduce((acc, r) => { acc[r] = (acc[r] ?? 0) + 1; return acc; }, {});
  console.log('---');
  console.log('Done:', JSON.stringify(counts));
}

main().catch(err => { console.error(err); process.exit(1); });
