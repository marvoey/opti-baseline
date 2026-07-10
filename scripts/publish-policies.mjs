// Publish all Prgv content items that are currently in draft state.
//
// Uses GET /content/versions?statuses=draft (via @optimizely/cms-cli REST client)
// to list all draft versions, filters to the 4 Prgv types, then publishes each.
//
// Usage:
//   node scripts/publish-policies.mjs [--dry-run] [--concurrency=N]
//
// Auth: reads OPTIMIZELY_CMS_CLIENT_ID + OPTIMIZELY_CMS_CLIENT_SECRET + OPTIMIZELY_CMS_API_URL

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRestApiClient } from '@optimizely/cms-cli/dist/service/cmsRestClient.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const PRGV_TYPES = new Set([
  'PrgvCorePrinciple',
  'PrgvJurisdictionalOverride',
  'PrgvStatutoryDisclosure',
  'PrgvProceduralSafeguard',
]);

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
  try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* no .env */ }
}

// --- List all draft versions for our Prgv types ---
async function fetchDraftVersions(client) {
  const items = [];
  let pageIndex = 0;

  while (true) {
    const { data, error, response } = await client.GET('/content/versions', {
      params: {
        query: { statuses: ['draft'], pageSize: 100, pageIndex },
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list draft versions (${response.status}): ${JSON.stringify(error)}`);
    }

    const page = data.items ?? [];
    items.push(...page.filter(v => PRGV_TYPES.has(v.contentType)));

    pageIndex++;
    if (page.length < 100) break;
  }

  return items;
}

// --- Publish one draft version ---
async function publishVersion(client, item, index, total) {
  const { key, version, contentType, displayName } = item;
  const label = `[${index + 1}/${total}] ${contentType}: "${displayName}"`;

  if (DRY_RUN) {
    console.log(`  DRY-RUN ${label}`);
    return { status: 'dry-run' };
  }

  const { response, error } = await client.POST('/content/{key}/versions/{version}:publish', {
    params: { path: { key, version } },
  });

  if (!response.ok) {
    console.error(`  ERROR ${label}: ${response.status} ${JSON.stringify(error)}`);
    return { status: 'error', detail: JSON.stringify(error) };
  }

  console.log(`  PUBLISHED ${label}`);
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
  const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    console.error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');
    process.exit(1);
  }

  const host = process.env.OPTIMIZELY_CMS_API_URL;
  const client = await createRestApiClient({
    clientId: OPTIMIZELY_CMS_CLIENT_ID,
    clientSecret: OPTIMIZELY_CMS_CLIENT_SECRET,
    ...(host && { host }),
  });

  console.log(`Concurrency: ${CONCURRENCY}${DRY_RUN ? ' | DRY-RUN' : ''}`);
  console.log('Fetching draft versions...');

  const drafts = await fetchDraftVersions(client);
  console.log(`Found ${drafts.length} draft Prgv version(s)`);

  if (drafts.length === 0) {
    console.log('Nothing to publish.');
    return;
  }

  console.log('---');
  const results = await runPool(
    drafts,
    (item, idx, total) => publishVersion(client, item, idx, total),
    CONCURRENCY,
  );

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
