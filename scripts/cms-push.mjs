/**
 * Smart wrapper around the Optimizely CMS content-type push.
 *
 * Default behaviour: only push content types that do NOT yet exist in the CMS.
 * Already-existing types are listed and skipped to avoid accidental overwrites.
 *
 * Flags:
 *   --all          Push every content type regardless of CMS state (original behaviour)
 *   --dry          Show what would be pushed without sending anything
 *   --type <key>   Push only the content type with this key (combine with --all to force-push it)
 *   --force        Ignore breaking-change / data-loss warnings from the CMS API
 *
 * Examples:
 *   node --env-file=.env scripts/cms-push.mjs                        # push missing only
 *   node --env-file=.env scripts/cms-push.mjs --all                  # push everything
 *   node --env-file=.env scripts/cms-push.mjs --dry                  # preview missing push
 *   node --env-file=.env scripts/cms-push.mjs --all --dry
 *   node --env-file=.env scripts/cms-push.mjs --type RichTextBlock   # push one missing type
 *   node --env-file=.env scripts/cms-push.mjs --type RichTextBlock --all  # force-push one type
 *   node --env-file=.env scripts/cms-push.mjs --all --force          # push + ignore data-loss warnings
 */

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ── CLI internals (same utilities the `cms:push` command uses internally) ─────
import {
  findMetaData,
  readFromPath,
} from '@optimizely/cms-cli/dist/service/utils.js';
import { mapContentToManifest } from '@optimizely/cms-cli/dist/mapper/contentToPackage.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARGS = process.argv.slice(2);
const ALL_MODE   = ARGS.includes('--all');
const DRY_MODE   = ARGS.includes('--dry');
const FORCE_MODE = ARGS.includes('--force');
const TYPE_FILTER = (() => { const i = ARGS.indexOf('--type'); return i !== -1 ? ARGS[i + 1] : null; })();

// ── Env ───────────────────────────────────────────────────────────────────────
if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* no .env, continue */ }
}

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(
  /\/$/,
  '',
);

// ── Colours ───────────────────────────────────────────────────────────────────
const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
};

// ── Auth ──────────────────────────────────────────────────────────────────────
async function getToken() {
  const res = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data?.access_token) throw new Error('Token endpoint returned no access_token');
  return data.access_token;
}

// ── Fetch all content type keys currently in the CMS ─────────────────────────
async function fetchCmsKeys(token) {
  const all = [];
  const pageSize = 100;
  for (let page = 0; page <= 50; page++) {
    const url = new URL(`${GATEWAY}/v1/contenttypes`);
    url.searchParams.set('pageIndex', String(page));
    url.searchParams.set('pageSize', String(pageSize));
    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`contenttypes request failed: ${res.status}`);
    const { items = [], totalCount } = await res.json();
    all.push(...items.map(t => t.key));
    if (items.length < pageSize || (typeof totalCount === 'number' && all.length >= totalCount)) break;
  }
  return new Set(all);
}

// ── POST manifest ─────────────────────────────────────────────────────────────
async function postManifest(token, manifest, { ignoreDataLossWarnings = false } = {}) {
  const res = await fetch(`${GATEWAY}/v1/manifest`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json',
      'content-type': 'application/vnd.optimizely.cms.v1.manifest+json',
      'cms-ignore-data-loss-warnings': ignoreDataLossWarnings,
    },
    body: JSON.stringify(manifest),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const title = body?.title || res.statusText;
    const detail = body?.detail || '';
    const errors = (body?.errors ?? [])
      .map((e, i) => `  ${i + 1}. ${e.detail} [field: ${e.field}]`)
      .join('\n');
    throw new Error(
      `Manifest POST failed (${res.status}): ${title}${detail ? '\n' + detail : ''}${errors ? '\n' + errors : ''}`,
    );
  }

  return body;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    console.error(
      c.red('Error: missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET.\n') +
        'Set them in .env or export them before running this script.',
    );
    process.exitCode = 1;
    return;
  }

  // 1. Read optimizely.config.mjs and extract content types (same as CLI does)
  const configFilePath = resolve(ROOT, 'optimizely.config.mjs');
  const configUrl = pathToFileURL(configFilePath).href;
  const configDir = pathToFileURL(dirname(configFilePath)).href;

  const { componentPaths, propertyGroups } = await readFromPath(configUrl);
  const { contentTypes, displayTemplates } = await findMetaData(componentPaths, configDir);
  const allMapped = mapContentToManifest(contentTypes);

  if (allMapped.length === 0) {
    console.log(c.yellow('No content types found in optimizely.config.mjs.'));
    return;
  }

  // 2. Apply --type filter
  let scopedTypes = allMapped;
  if (TYPE_FILTER) {
    scopedTypes = allMapped.filter(ct => ct.key === TYPE_FILTER);
    if (scopedTypes.length === 0) {
      console.error(c.red(`Error: content type "${TYPE_FILTER}" not found locally.`));
      console.log(c.dim('  Known keys: ' + allMapped.map(ct => ct.key).join(', ')));
      process.exitCode = 1;
      return;
    }
  }

  // 3. Fetch CMS state + auth (can run in parallel)
  const token = await getToken();
  const cmsKeys = await fetchCmsKeys(token);

  // 4. Partition
  const existing = scopedTypes.filter(ct => cmsKeys.has(ct.key));
  const missing  = scopedTypes.filter(ct => !cmsKeys.has(ct.key));

  // 5. Report existing
  if (existing.length > 0) {
    console.log(c.bold('\nContent types already in the CMS (skipped):'));
    for (const ct of existing) {
      console.log(`  ${c.green('✓')} ${ct.key}`);
    }
    if (!ALL_MODE) {
      console.log(
        c.dim(
          '\n  To push these too, run:\n' +
          '    npm run cms:push:all\n' +
          '  or:\n' +
          '    node --env-file=.env scripts/cms-push.mjs --all\n',
        ),
      );
    }
  }

  // 6. Decide what to push
  const toPush = ALL_MODE ? scopedTypes : missing;

  if (toPush.length === 0) {
    console.log(c.green('\nAll content types are already in the CMS. Nothing to push.'));
    return;
  }

  // 7. Preview
  console.log(
    c.bold(
      `\nContent types to push (${toPush.length}):`,
    ) + (DRY_MODE ? c.yellow(' [DRY RUN — nothing sent]') : ''),
  );
  for (const ct of toPush) {
    console.log(`  ${c.cyan('→')} ${ct.key}`);
  }

  if (DRY_MODE) {
    console.log(c.dim('\nRe-run without --dry to apply.'));
    return;
  }

  // 8. Push
  console.log(c.dim('\nUploading…'));

  const normalizedGroups = propertyGroups
    ? propertyGroups.map(g => ({ ...g }))
    : [];

  const manifest = {
    contentTypes: toPush,
    displayTemplates,
    propertyGroups: normalizedGroups,
  };

  const result = await postManifest(token, manifest, { ignoreDataLossWarnings: FORCE_MODE });

  console.log(c.green('\n✓ Upload complete'));

  if (result?.outcomes?.length) {
    console.log(c.cyan('\nOutcomes:'));
    for (const o of result.outcomes) console.log(`  - ${o.message}`);
  }

  if (result?.errors?.length) {
    console.log(c.red('\nErrors:'));
    for (const e of result.errors) console.log(`  - ${e.message ?? JSON.stringify(e)}`);
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(c.red(`\n[cms-push] ${err instanceof Error ? err.message : err}`));
  process.exitCode = 1;
});
