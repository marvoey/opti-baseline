/**
 * Seed IndustryHeroBlock content items from seeds/industry-heroes/items.json.
 *
 * Each item is created in the CMS and published. Items that already exist are
 * skipped unless --force is passed.
 *
 * Flags:
 *   --container <key>  (required) The CMS container key to place items under
 *   --locale <locale>  Locale for the content version (default: OPTIMIZELY_DEFAULT_LOCALE or "en")
 *   --dry              Show what would be seeded without sending anything
 *   --force            Re-seed items that already exist (creates a new draft + publishes)
 *   --key <hex>        Seed only the item with this key
 *
 * Examples:
 *   node --env-file=.env scripts/seed-industry-heroes.mjs --container <key>
 *   node --env-file=.env scripts/seed-industry-heroes.mjs --container <key> --dry
 *   node --env-file=.env scripts/seed-industry-heroes.mjs --container <key> --key 1458dd6b69fd4a9e80db31131391a2c8
 *   node --env-file=.env scripts/seed-industry-heroes.mjs --container <key> --force
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARGS = process.argv.slice(2);
const DRY   = ARGS.includes('--dry');
const FORCE = ARGS.includes('--force');
const HELP             = ARGS.includes('--help') || ARGS.includes('-h');
const KEY_FILTER       = (() => { const i = ARGS.indexOf('--key');       return i !== -1 ? ARGS[i + 1] : null; })();
const ROOT_CONTAINER   = (() => { const i = ARGS.indexOf('--container'); return i !== -1 ? ARGS[i + 1] : null; })();
const LOCALE_FLAG      = (() => { const i = ARGS.indexOf('--locale');    return i !== -1 ? ARGS[i + 1] : null; })();

// ── Env ───────────────────────────────────────────────────────────────────────
if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* no .env, continue */ }
}

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const LOCALE  = LOCALE_FLAG || process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';

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

// ── Check if a content item already exists ────────────────────────────────────
async function contentExists(token, key) {
  const res = await fetch(`${GATEWAY}/v1/content/${key}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (res.ok) return true;
  if (res.status === 404 || res.status === 403) return false;
  throw new Error(`GET /v1/content/${key} failed: ${res.status} ${res.statusText}`);
}

// ── Create a content item with properties in the initial version ───────────────
async function createContent(token, item) {
  const properties = Object.fromEntries(
    Object.entries(item.properties).map(([k, v]) => [k, { value: v }]),
  );

  const res = await fetch(`${GATEWAY}/v1/content`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'Prefer': 'return=representation',
      'cms-skip-validation': '*',
    },
    body: JSON.stringify({
      key: item.key,
      contentType: item.contentType,
      container: ROOT_CONTAINER,
      initialVersion: {
        displayName: item.displayName,
        locale: LOCALE,
        properties,
      },
    }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const title  = body?.title  || res.statusText;
    const detail = body?.detail || JSON.stringify(body);
    throw new Error(`Create "${item.key}" failed (${res.status}): ${title}${detail ? ' — ' + detail : ''}`);
  }

  return body; // NewContentNode: ContentNode & { initialVersion?: ContentVersion }
}

// ── Create a new draft version for an already-existing item ───────────────────
async function createVersion(token, key, item) {
  const properties = Object.fromEntries(
    Object.entries(item.properties).map(([k, v]) => [k, { value: v }]),
  );

  const res = await fetch(`${GATEWAY}/v1/content/${key}/versions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      displayName: item.displayName,
      locale: LOCALE,
      properties,
    }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const title  = body?.title  || res.statusText;
    const detail = body?.detail || '';
    throw new Error(`Create version for "${key}" failed (${res.status}): ${title}${detail ? ' — ' + detail : ''}`);
  }

  return body; // ContentVersion with .version field
}

// ── Resolve version string from create response, fallback to listing versions ─
async function resolveVersion(token, key, createBody) {
  const version = createBody?.version ?? createBody?.initialVersion?.version;
  if (version) return version;

  // Fallback: list versions and take the first draft
  const res = await fetch(`${GATEWAY}/content/${key}/versions?pageSize=10`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`List versions for "${key}" failed: ${res.status}`);
  const { items = [] } = await res.json();
  const draft = items.find(v => v.status === 'draft') ?? items[0];
  if (!draft?.version) throw new Error(`No version found for "${key}"`);
  return draft.version;
}

// ── Publish a specific version ─────────────────────────────────────────────────
async function publishVersion(token, key, version) {
  const res = await fetch(`${GATEWAY}/v1/content/${key}/versions/${version}:publish`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const title = body?.title || res.statusText;
    throw new Error(`Publish "${key}@${version}" failed (${res.status}): ${title}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (HELP) {
    console.log(`
${c.bold('seed-industry-heroes')} — seed IndustryHeroBlock content items into the CMS

${c.bold('USAGE')}
  node --env-file=.env scripts/seed-industry-heroes.mjs --container <key> [options]

${c.bold('REQUIRED')}
  --container <key>   CMS container key under which items are placed

${c.bold('OPTIONS')}
  --locale <locale>   Content version locale (default: OPTIMIZELY_DEFAULT_LOCALE or "en")
  --key <hex>         Seed only the item with this key
  --force             Re-seed existing items (creates a new draft and publishes it)
  --dry               Preview what would be seeded without sending any requests
  --help, -h          Show this help message

${c.bold('ENVIRONMENT')}
  OPTIMIZELY_CMS_CLIENT_ID      Required. OAuth client ID
  OPTIMIZELY_CMS_CLIENT_SECRET  Required. OAuth client secret
  OPTIMIZELY_CMS_API_URL        Optional. Defaults to https://api.cms.optimizely.com
  OPTIMIZELY_DEFAULT_LOCALE     Optional. Fallback locale when --locale is not passed

${c.bold('EXAMPLES')}
  ${c.dim('# Seed all missing items')}
  node --env-file=.env scripts/seed-industry-heroes.mjs --container 43f936c9...

  ${c.dim('# Preview without sending')}
  node --env-file=.env scripts/seed-industry-heroes.mjs --container 43f936c9... --dry

  ${c.dim('# Seed a single item')}
  node --env-file=.env scripts/seed-industry-heroes.mjs --container 43f936c9... --key 1458dd6b...

  ${c.dim('# Re-seed everything in French')}
  node --env-file=.env scripts/seed-industry-heroes.mjs --container 43f936c9... --force --locale fr
`);
    return;
  }

  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    console.error(
      c.red('Error: missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET.\n') +
      'Set them in .env or export them before running this script.',
    );
    process.exitCode = 1;
    return;
  }

  if (!ROOT_CONTAINER) {
    console.error(c.red('Error: --container <key> is required.\n') +
      'Pass the CMS container key under which items should be placed.\n' +
      c.dim('  node --env-file=.env scripts/seed-industry-heroes.mjs --container <key>'));
    process.exitCode = 1;
    return;
  }

  // 1. Load seed data
  const seedPath = join(ROOT, 'seeds', 'industry-heroes', 'items.json');
  const { items: allItems } = JSON.parse(readFileSync(seedPath, 'utf8'));

  // 2. Apply --key filter
  const items = KEY_FILTER
    ? allItems.filter(item => item.key === KEY_FILTER)
    : allItems;

  if (items.length === 0) {
    console.error(c.red(KEY_FILTER
      ? `Error: no item with key "${KEY_FILTER}" found in seed data.`
      : 'Error: seed file contains no items.',
    ));
    process.exitCode = 1;
    return;
  }

  console.log(c.bold(`\nIndustryHeroBlock seed — ${items.length} item(s)`) +
    (DRY ? c.yellow(' [DRY RUN — nothing sent]') : '') +
    (FORCE ? c.cyan(' [--force: re-seeding existing items]') : ''));

  if (DRY) {
    for (const item of items) {
      console.log(`  ${c.cyan('→')} ${item.key}  ${c.dim(item.displayName)}`);
    }
    console.log(c.dim('\nRe-run without --dry to apply.'));
    return;
  }

  // 3. Auth
  const token = await getToken();

  // 4. Seed each item
  const results = { created: 0, skipped: 0, updated: 0, failed: 0 };

  for (const item of items) {
    const label = `${item.key}  ${c.dim(item.displayName)}`;
    try {
      const exists = await contentExists(token, item.key);

      if (exists && !FORCE) {
        console.log(`  ${c.yellow('–')} ${label}  ${c.dim('already exists, skipped')}`);
        results.skipped++;
        continue;
      }

      if (exists && FORCE) {
        // Create a new draft version on the existing item and publish it
        const versionBody = await createVersion(token, item.key, item);
        const version = await resolveVersion(token, item.key, versionBody);
        await publishVersion(token, item.key, version);
        console.log(`  ${c.cyan('↺')} ${label}  ${c.dim(`updated → v${version}`)}`);
        results.updated++;
      } else {
        // Create the content item with properties in the initial version
        const createBody = await createContent(token, item);
        const contentKey = createBody?.key ?? item.key;
        const version = await resolveVersion(token, contentKey, createBody);
        await publishVersion(token, contentKey, version);
        console.log(`  ${c.green('✓')} ${label}  ${c.dim(`created → v${version}`)}`);
        results.created++;
      }
    } catch (err) {
      console.error(`  ${c.red('✗')} ${label}`);
      console.error(`    ${c.red(err instanceof Error ? err.message : String(err))}`);
      results.failed++;
    }
  }

  // 5. Summary
  const parts = [];
  if (results.created) parts.push(c.green(`${results.created} created`));
  if (results.updated) parts.push(c.cyan(`${results.updated} updated`));
  if (results.skipped) parts.push(c.dim(`${results.skipped} skipped`));
  if (results.failed)  parts.push(c.red(`${results.failed} failed`));
  console.log(`\n${parts.join(', ')}`);

  if (results.failed) process.exitCode = 1;
}

main().catch(err => {
  console.error(c.red(`\n[seed-industry-heroes] ${err instanceof Error ? err.message : err}`));
  process.exitCode = 1;
});
