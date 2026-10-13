// Registers BCP-47 locales in the Optimizely CMS (companion to generate-locales.mjs).
//
// generate-locales.mjs READS the enabled locales from the CMS into
// lib/locales.generated.ts; this script WRITES them: it creates any missing
// locale and re-enables disabled ones via the Management API
// (`POST {gateway}/v1/locales`, `PATCH {gateway}/v1/locales/{key}`).
// Afterwards run `npm run gen:locales` to pick them up.
//
// Usage (via `npm run cms:locales -- [options]`):
//   --set markets     (default) the UPS market locales from the build plan
//   --set languages   every ISO 639-1 language known to the runtime's ICU data (en, fr, ...)
//   --set likely      every language plus its most likely region (fr -> fr-FR, ...)
//   --set all         markets + languages + likely
//   --tags fr-CA,de-AT   explicit comma-separated BCP-47 tags (replaces --set)
//   --route-segment tag  routeSegment style: "tag" (fr-CA, default) or "lower" (fr-ca)
//   --dry-run            print what would change, call no write endpoints
//
// Tags are canonicalised with Intl.getCanonicalLocales, so invalid tags are
// rejected up front. Auth mirrors generate-locales.mjs (client credentials).

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveTags, displayName } from './bcp47.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try {
    process.loadEnvFile(join(ROOT, '.env'));
  } catch {
    // No .env — rely on the existing environment.
  }
}

const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(
  /\/$/,
  '',
);
const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;

// ---- args ---------------------------------------------------------------

function parseArgs(argv) {
  const opts = { set: 'markets', tags: null, routeSegment: 'tag', dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--set') opts.set = argv[++i];
    else if (a === '--tags') opts.tags = (argv[++i] ?? '').split(',').map((t) => t.trim()).filter(Boolean);
    else if (a === '--route-segment') opts.routeSegment = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!['markets', 'languages', 'likely', 'all'].includes(opts.set)) {
    throw new Error(`Invalid --set "${opts.set}" (markets | languages | likely | all)`);
  }
  if (!['tag', 'lower'].includes(opts.routeSegment)) {
    throw new Error(`Invalid --route-segment "${opts.routeSegment}" (tag | lower)`);
  }
  return opts;
}

// ---- CMS API ------------------------------------------------------------

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

async function listLocales(token) {
  const items = [];
  let url = `${GATEWAY}/v1/locales?pageSize=100`;
  while (url) {
    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Locales request failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    items.push(...(Array.isArray(data?.items) ? data.items : []));
    url = data?.pageIndex !== undefined && data.items?.length === 100
      ? `${GATEWAY}/v1/locales?pageSize=100&pageIndex=${data.pageIndex + 1}`
      : null;
  }
  return items;
}

async function writeLocale(token, method, path, body, contentType) {
  const res = await fetch(`${GATEWAY}/v1/locales${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': contentType },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${detail.slice(0, 200)}`);
  }
}

// ---- main ---------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const tags = resolveTags(opts);
  console.log(`[cms:locales] ${tags.length} BCP-47 tag(s) requested${opts.dryRun ? ' (dry run)' : ''}.`);

  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');
  }
  const token = await getToken();
  const existing = new Map((await listLocales(token)).map((l) => [l.key, l]));

  let created = 0, enabled = 0, unchanged = 0, failed = 0;
  for (const tag of tags) {
    const current = existing.get(tag);
    try {
      if (!current) {
        console.log(`  + create ${tag} (${displayName(tag)})`);
        if (!opts.dryRun) {
          await writeLocale(token, 'POST', '', {
            key: tag,
            displayName: displayName(tag),
            isEnabled: true,
            routeSegment: opts.routeSegment === 'lower' ? tag.toLowerCase() : tag,
          }, 'application/json');
        }
        created++;
      } else if (current.isEnabled === false) {
        console.log(`  ~ enable ${tag}`);
        if (!opts.dryRun) {
          await writeLocale(token, 'PATCH', `/${encodeURIComponent(tag)}`, { isEnabled: true },
            'application/merge-patch+json');
        }
        enabled++;
      } else {
        unchanged++;
      }
    } catch (err) {
      failed++;
      console.warn(`  ! ${tag}: ${err.message}`);
    }
  }

  console.log(
    `[cms:locales] ${created} created, ${enabled} enabled, ${unchanged} unchanged, ${failed} failed.`,
  );
  if (!opts.dryRun && created + enabled > 0) console.log('[cms:locales] Run `npm run gen:locales` to refresh lib/locales.generated.ts.');
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error('[cms:locales]', err.message);
  process.exit(1);
});
