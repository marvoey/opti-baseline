/**
 * Push a single content type to the CMS by key.
 *
 * Usage:
 *   node --env-file=.env scripts/cms-push-one.mjs <ContentTypeKey>
 *   node --env-file=.env scripts/cms-push-one.mjs <ContentTypeKey> --dry
 *
 * Examples:
 *   node --env-file=.env scripts/cms-push-one.mjs PromoBannerBlock
 *   node --env-file=.env scripts/cms-push-one.mjs HeroBlock --dry
 */

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  findMetaData,
  readFromPath,
} from '@optimizely/cms-cli/dist/service/utils.js';
import { mapContentToManifest } from '@optimizely/cms-cli/dist/mapper/contentToPackage.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY_MODE = process.argv.includes('--dry');
const TARGET_KEY = process.argv.slice(2).find(a => !a.startsWith('--'));

const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
};

if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* no .env, continue */ }
}

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');

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

async function postManifest(token, manifest) {
  const res = await fetch(`${GATEWAY}/v1/manifest`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/json',
      'content-type': 'application/vnd.optimizely.cms.v1.manifest+json',
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

async function main() {
  if (!TARGET_KEY) {
    console.error(
      c.red('Error: no content type key provided.\n') +
      'Usage: node --env-file=.env scripts/cms-push-one.mjs <ContentTypeKey>',
    );
    process.exitCode = 1;
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

  // Load all content types from optimizely.config.mjs
  const configFilePath = resolve(ROOT, 'optimizely.config.mjs');
  const configUrl = pathToFileURL(configFilePath).href;
  const configDir = pathToFileURL(dirname(configFilePath)).href;

  const { componentPaths, propertyGroups } = await readFromPath(configUrl);
  const { contentTypes, displayTemplates } = await findMetaData(componentPaths, configDir);
  const allMapped = mapContentToManifest(contentTypes);

  const match = allMapped.find(ct => ct.key === TARGET_KEY);

  if (!match) {
    const available = allMapped.map(ct => `  • ${ct.key}`).join('\n');
    console.error(
      c.red(`Error: content type "${TARGET_KEY}" not found in optimizely.config.mjs.\n`) +
      c.bold('Available keys:\n') + available,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    c.bold(`\nPushing content type: ${c.cyan(match.key)}`) +
    (DRY_MODE ? c.yellow(' [DRY RUN — nothing sent]') : ''),
  );

  if (DRY_MODE) {
    console.log(c.dim('\nRe-run without --dry to apply.'));
    return;
  }

  const token = await getToken();

  const normalizedGroups = propertyGroups ? propertyGroups.map(g => ({ ...g })) : [];

  const manifest = {
    contentTypes: [match],
    displayTemplates,
    propertyGroups: normalizedGroups,
  };

  console.log(c.dim('Uploading…'));
  const result = await postManifest(token, manifest);

  console.log(c.green(`\n✓ "${match.key}" pushed successfully`));

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
  console.error(c.red(`\n[cms-push-one] ${err instanceof Error ? err.message : err}`));
  process.exitCode = 1;
});
