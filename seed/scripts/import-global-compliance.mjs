// Import ../global-compliance.json into Optimizely CMS.
//
// Usage:
//   node seed/scripts/import-global-compliance.mjs [--dry-run] [--concurrency=N] --container=<key>
//
// Auth: reads OPTIMIZELY_CMS_CLIENT_ID + OPTIMIZELY_CMS_CLIENT_SECRET + OPTIMIZELY_CMS_API_URL
// from .env at the repo root.

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, parseArgs, createApiClient, runPool, summarise } from './lib.mjs';

const SEED_DIR = dirname(fileURLToPath(import.meta.url), '..');
const ROOT = join(SEED_DIR, '..', '..');
const DATA_FILE = join(SEED_DIR, '..', 'global-compliance.json');

const { dryRun, concurrency, container } = parseArgs();

if (!container && !dryRun) {
  console.error('Error: --container=<key> is required');
  process.exit(1);
}

loadEnv(ROOT);

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');

if (!dryRun && (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET)) {
  console.error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');
  process.exit(1);
}

const { apiFetch } = createApiClient(GATEWAY, OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET);

async function importItem(item, index, total) {
  const displayName = item.name;
  const label = `[${index + 1}/${total}] ${displayName}`;
  const { properties } = item;

  const body = {
    contentType: item.contentType,
    container,
    initialVersion: {
      displayName,
      locale: item.language ?? 'en',
      properties: {
        DisclosureName: { value: properties.DisclosureName },
        LegalText: { value: { html: properties.LegalText } },
        ...(properties.EffectiveDate != null && { EffectiveDate: { value: properties.EffectiveDate } }),
        ...(properties.LineOfBusiness != null && { LineOfBusiness: { value: properties.LineOfBusiness } }),
        ...(properties.ApplicableState != null && { ApplicableState: { value: properties.ApplicableState } }),
        ...(properties.Jurisdiction != null && { Jurisdiction: { value: properties.Jurisdiction } }),
        ...(properties.Category != null && { Category: { value: properties.Category } }),
      },
    },
  };

  if (dryRun) {
    console.log(`  ${label} DRY-RUN`);
    console.log(JSON.stringify(body, null, 2));
    return { status: 'dry-run' };
  }

  const createRes = await apiFetch('/content', {
    method: 'POST',
    headers: { 'cms-skip-validation': '*', Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });

  if (createRes.status === 409) {
    console.log(`  ${label} EXISTS`);
    return { status: 'exists' };
  }
  if (!createRes.ok) {
    const err = await createRes.text();
    console.error(`  ${label} ERROR ${createRes.status}: ${err}`);
    return { status: 'error', detail: err };
  }

  const created = await createRes.json();
  const contentKey = created.key;
  const version = created.initialVersion?.version;
  if (!contentKey || !version) {
    console.error(`  ${label} ERROR: missing key/version in response`);
    return { status: 'error', detail: 'missing key or version' };
  }

  const pubRes = await apiFetch(`/content/${contentKey}/versions/${version}:publish`, { method: 'POST' });
  if (!pubRes.ok) {
    const err = await pubRes.text();
    console.warn(`  ${label} WARN: created but publish failed: ${pubRes.status} ${err}`);
    return { status: 'created-unpublished' };
  }

  console.log(`  ${label} OK`);
  return { status: 'ok' };
}

const items = JSON.parse(await readFile(DATA_FILE, 'utf8'));
console.log(`Loaded ${items.length} item(s) from global-compliance.json`);
if (dryRun) console.log('DRY-RUN mode — no changes will be made');
console.log(`Concurrency: ${concurrency} | Container: ${container ?? '(dry-run)'} | Gateway: ${GATEWAY}`);
console.log('---');

const results = await runPool(items, importItem, concurrency);
console.log('---');
console.log('Done:', JSON.stringify(summarise(results)));
