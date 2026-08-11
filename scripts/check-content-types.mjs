/**
 * Check which content types defined in code already exist in the CMS.
 *
 * Scans:
 *   - cms/*.tsx  — any contentType({ key: '...' }) call
 *   - cms/registry.ts — SDK-native types imported from @optimizely/cms-sdk
 *     (BlankExperienceContentType, BlankSectionContentType)
 *
 * Then calls the CMS Management API to list all content types and reports:
 *   EXISTS  — defined in code AND present in the CMS
 *   MISSING — defined in code but NOT in the CMS (needs `npm run cms:push`)
 *   CMS_ONLY — in the CMS but not defined in this codebase
 *
 * Usage:
 *   node --env-file=.env scripts/check-content-types.mjs [--json]
 *
 * --json  outputs machine-readable JSON instead of the table
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CMS_DIR = join(ROOT, 'cms');
const REGISTRY_FILE = join(CMS_DIR, 'registry.ts');
const JSON_MODE = process.argv.includes('--json');

// ── Env loading (same pattern as fetch-openapi.mjs) ───────────────────────────
if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try {
    process.loadEnvFile(join(ROOT, '.env'));
  } catch {
    // no .env — continue
  }
}

const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(
  /\/$/,
  '',
);
const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;

// ── Step 1: collect code-defined content type keys ────────────────────────────

/**
 * Extract the `key` values from every `contentType({ key: '...' })` call in a
 * source file. Handles both single- and double-quoted keys.
 */
function extractContentTypeKeys(source) {
  const keys = [];
  // Match contentType({ ... key: 'Foo' ... }) — key must appear as a property
  // name inside a contentType() call.  We look for the pattern
  //   contentType({  [anything, including newlines]  key: '<value>'
  const callRe = /contentType\s*\(\s*\{([^)]*(?:\([^)]*\)[^)]*)*)\}/gs;
  let callMatch;
  while ((callMatch = callRe.exec(source)) !== null) {
    const body = callMatch[1];
    const keyRe = /\bkey\s*:\s*['"]([^'"]+)['"]/;
    const keyMatch = keyRe.exec(body);
    if (keyMatch) keys.push(keyMatch[1]);
  }
  return keys;
}

/**
 * Read the SDK-native types referenced in registry.ts as
 * BlankExperienceContentType / BlankSectionContentType.
 * Their actual keys are 'BlankExperience' and 'BlankSection' (SDK constants).
 * We derive them from the import names rather than hard-coding them so that
 * adding a new SDK import is automatically picked up.
 */
function extractSdkNativeKeys(registrySource) {
  // Import line: import { ..., BlankExperienceContentType, BlankSectionContentType, ... }
  // SDK keys follow the convention: strip 'ContentType' suffix.
  const importRe = /from\s+'@optimizely\/cms-sdk'([^;]*);/gs;
  const keys = [];
  let m;
  while ((m = importRe.exec(registrySource)) !== null) {
    // Grab the destructured import block (may span the import line only, since
    // the full brace set is on one or two lines in practice).
    const importLine = registrySource.slice(
      registrySource.lastIndexOf('import', m.index),
      m.index + m[0].length,
    );
    const nameRe = /\b(\w+ContentType)\b/g;
    let nm;
    while ((nm = nameRe.exec(importLine)) !== null) {
      // Convert e.g. BlankExperienceContentType → BlankExperience
      keys.push(nm[1].replace(/ContentType$/, ''));
    }
  }
  return keys;
}

async function collectCodeKeys() {
  const files = await readdir(CMS_DIR);
  const tsxFiles = files.filter((f) => f.endsWith('.tsx') && f !== 'wrappers.tsx');

  const keyMap = {}; // key → source file

  for (const file of tsxFiles) {
    const source = await readFile(join(CMS_DIR, file), 'utf8');
    for (const key of extractContentTypeKeys(source)) {
      keyMap[key] = file;
    }
  }

  // SDK-native types (imported in registry.ts, not defined via contentType() in .tsx files)
  try {
    const registrySource = await readFile(REGISTRY_FILE, 'utf8');
    for (const key of extractSdkNativeKeys(registrySource)) {
      if (!keyMap[key]) keyMap[key] = 'registry.ts (SDK-native)';
    }
  } catch {
    // registry.ts not readable — skip
  }

  return keyMap;
}

// ── Step 2: fetch CMS content types ──────────────────────────────────────────

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

async function fetchAllCmsContentTypes(token) {
  const all = [];
  const pageSize = 100;

  for (let pageIndex = 0; pageIndex <= 50; pageIndex++) {
    const url = new URL(`${GATEWAY}/v1/contenttypes`);
    url.searchParams.set('pageIndex', String(pageIndex));
    url.searchParams.set('pageSize', String(pageSize));

    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`contenttypes request failed: ${res.status} ${res.statusText}`);

    const page = await res.json();
    const items = page.items ?? [];
    all.push(...items);

    const reachedTotal = typeof page.totalCount === 'number' && all.length >= page.totalCount;
    if (items.length < pageSize || reachedTotal) break;
  }

  return all;
}

// ── Step 3: compare and report ────────────────────────────────────────────────

function compare(codeKeyMap, cmsTypes) {
  const cmsKeySet = new Set(cmsTypes.map((t) => t.key));
  const codeKeys = Object.keys(codeKeyMap);

  const exists = [];
  const missing = [];

  for (const key of codeKeys) {
    if (cmsKeySet.has(key)) {
      exists.push({ key, file: codeKeyMap[key] });
    } else {
      missing.push({ key, file: codeKeyMap[key] });
    }
  }

  const codeKeySet = new Set(codeKeys);
  const cmsOnly = cmsTypes
    .filter((t) => !codeKeySet.has(t.key))
    .map((t) => ({ key: t.key, source: t.source ?? null, baseType: t.baseType ?? null }));

  return { exists, missing, cmsOnly };
}

function printTable(result) {
  const { exists, missing, cmsOnly } = result;

  const green = (s) => `\x1b[32m${s}\x1b[0m`;
  const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
  const dim = (s) => `\x1b[2m${s}\x1b[0m`;

  console.log('\n── Content types defined in code ──────────────────────────────');

  if (exists.length) {
    console.log(green(`\n  EXISTS in CMS (${exists.length})`));
    for (const { key, file } of exists) {
      console.log(`    ${green('✓')} ${key.padEnd(30)} ${dim(file)}`);
    }
  }

  if (missing.length) {
    console.log(yellow(`\n  MISSING from CMS (${missing.length}) — run: npm run cms:push`));
    for (const { key, file } of missing) {
      console.log(`    ${yellow('✗')} ${key.padEnd(30)} ${dim(file)}`);
    }
  }

  console.log(dim(`\n── CMS-only types (${cmsOnly.length}) ─────────────────────────────────`));
  for (const { key, source, baseType } of cmsOnly) {
    console.log(`    ${dim('·')} ${key.padEnd(30)} ${dim(`base=${baseType ?? '?'} source=${source ?? 'custom'}`)}`);
  }

  console.log();
  console.log(`  Summary: ${exists.length} exist, ${missing.length} missing, ${cmsOnly.length} CMS-only`);
  console.log();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    console.error(
      'Error: missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET.\n' +
        'Set them in .env or export them in the environment.',
    );
    process.exitCode = 1;
    return;
  }

  const [codeKeyMap, token] = await Promise.all([
    collectCodeKeys(),
    getToken(),
  ]);

  const cmsTypes = await fetchAllCmsContentTypes(token);
  const result = compare(codeKeyMap, cmsTypes);

  if (JSON_MODE) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printTable(result);
  }

  // Exit non-zero if any code-defined types are missing from the CMS
  if (result.missing.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`[check-content-types] ${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
});
