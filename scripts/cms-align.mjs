/**
 * cms:align — verify that the content types defined in code (cms/*.tsx) match
 * what is live in the CMS, and lint them against the known CMS SaaS quirks
 * BEFORE you push or build pages. Read-only: it never writes to the CMS.
 *
 * What it checks
 *   MISSING  a type defined in code that is not in the CMS      -> npm run cms:push
 *   DRIFT    a type exists but a property/behavior differs       -> targeted type update
 *            (marked BREAKING when type/format/behaviors changed; those need the
 *             breaking-change flag on the update)
 *   REMOTE+  properties that exist in the CMS but not in code (informational:
 *            `cms:push` never removes properties)
 *   CMS+     allowedTypes / mayContainTypes in the CMS that are a superset of the code
 *            (informational: all demo branches share one CMS, so baseline types such as
 *             Page also allow other sites' blocks; never narrow them)
 *   LINT     preflight rules learned the hard way:
 *     L1  array-of-component property + elementEnabled behavior  (CMS rejects it)
 *     L2  `content` property/items without allowedTypes          (shared-block refs)
 *     L3  cms/*.tsx imports next/* or lucide-react               (breaks the CLI esbuild bundle)
 *     L4  contentType() export not registered in cms/registry.ts (renders nothing / Graph query gaps)
 *     L5  allowedTypes / contentType pointing at an unknown type (dangling reference)
 *     L6  with SITE_PREFIX set: a type defined outside the baseline files does not start with it
 *
 * Usage
 *   node --env-file=.env scripts/cms-align.mjs [--only Key1,Key2] [--json] [--no-lint] [--allow-missing]
 *   node --env-file=.env scripts/cms-align.mjs --fix-allowed [--dry]
 *
 * --fix-allowed  For drift that is ONLY "code allows types the CMS does not" (allowedTypes /
 *                mayContainTypes), PATCH the CMS list to the UNION of both. It never removes a type
 *                (other sites sharing this CMS rely on them). Typical use: a new site adds its blocks
 *                to Page > Content. With --dry it only prints the planned union.
 *   npm run cms:align
 *
 * Exit code: 1 when anything is MISSING (unless --allow-missing), has DRIFT, or has an
 * error-level LINT finding; 0 otherwise.
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { findMetaData, readFromPath } from '@optimizely/cms-cli/dist/service/utils.js';
import { mapContentToManifest } from '@optimizely/cms-cli/dist/mapper/contentToPackage.js';

import {
  BASE_BRANCH,
  ROOT,
  assertSiteContext,
  c,
  createCms,
  fatal,
  finish,
  git,
  ok,
  parseArgs,
  pool,
  siteBanner,
  subsetDiff,
} from './lib/cms-api.mjs';

const args = parseArgs();
const JSON_MODE = Boolean(args.json);
const only = typeof args.only === 'string' ? new Set(args.only.split(',').map((s) => s.trim()).filter(Boolean)) : null;

const log = (...a) => {
  if (!JSON_MODE) console.log(...a);
};

// ── Local definitions (same pipeline cms:push uses) ─────────────────────────
async function loadLocalTypes() {
  const configFilePath = resolve(ROOT, 'optimizely.config.mjs');
  const { componentPaths } = await readFromPath(pathToFileURL(configFilePath).href);
  // The CLI prints "Content Type X found in ./cms/File.tsx" for each type: keep stdout clean, but
  // remember which file defines which type (the prefix lint needs it).
  const realLog = console.log;
  console.log = (...parts) => {
    const m = /Content Type (\S+) found in (\S+)/.exec(parts.join(' '));
    if (m) FILE_OF_TYPE.set(m[1], m[2].replace(/^\.\//, ''));
  };
  try {
    const { contentTypes } = await findMetaData(componentPaths, pathToFileURL(dirname(configFilePath)).href);
    return mapContentToManifest(contentTypes);
  } finally {
    console.log = realLog;
  }
}

/** type key -> file that defines it, e.g. AcmeHeroBlock -> cms/AcmeHero.tsx (filled by loadLocalTypes). */
const FILE_OF_TYPE = new Map();

/** Files under cms/ on the baseline branch: types defined there are shared baseline types. */
function baselineFiles() {
  const out = git(['ls-tree', '--name-only', BASE_BRANCH, 'cms/']);
  return out ? new Set(out.split('\n').filter(Boolean)) : null;
}

// ── Compare one type ────────────────────────────────────────────────────────
const BREAKING_PATH = /(^|\.)(type|format|contentType|baseType|compositionBehaviors)(\.|$|\[)/;

function compareType(local, remote) {
  const diffs = [];
  const push = (list) => list.forEach((d) => diffs.push({ ...d, breaking: BREAKING_PATH.test(d.path) }));

  for (const k of ['baseType', 'displayName', 'description']) {
    if (local[k] !== undefined && local[k] !== remote[k]) push([{ path: k, want: local[k], have: remote[k] }]);
  }
  if (local.compositionBehaviors) {
    push(subsetDiff([...local.compositionBehaviors], remote.compositionBehaviors ?? [], 'compositionBehaviors'));
  }
  if (local.mayContainTypes) {
    push(subsetDiff([...local.mayContainTypes], remote.mayContainTypes ?? [], 'mayContainTypes'));
  }

  const localProps = local.properties ?? {};
  const remoteProps = remote.properties ?? {};
  for (const [name, lp] of Object.entries(localProps)) {
    const rp = remoteProps[name];
    if (!rp) {
      push([{ path: `properties.${name}`, want: 'defined in code', have: '(absent in CMS)' }]);
      continue;
    }
    push(subsetDiff(lp, rp, `properties.${name}`));
    // CMS default for isRequired is false; code omitting it while CMS says true IS drift.
    if (lp.isRequired === undefined && rp.isRequired === true) {
      push([{ path: `properties.${name}.isRequired`, want: false, have: true }]);
    }
  }
  const remoteOnly = Object.keys(remoteProps).filter((n) => !(n in localProps));

  // Every demo branch shares ONE CMS. Baseline types such as Page collect allowed types from
  // every branch that pushed to it, so a CMS list that is a SUPERSET of the code list is
  // expected, not drift (and must never be "fixed" by narrowing it: other sites depend on it).
  const extraAllowed = [];
  const kept = diffs.filter((d) => {
    if (!/(^|\.)(allowedTypes|mayContainTypes)$/.test(d.path) || !Array.isArray(d.want) || !Array.isArray(d.have)) return true;
    const want = new Set(d.want.map(String));
    const have = new Set(d.have.map(String));
    if (![...want].every((w) => have.has(w))) return true;
    extraAllowed.push({ path: d.path, extra: [...have].filter((h) => !want.has(h)) });
    return false;
  });
  return { diffs: kept, remoteOnly, extraAllowed };
}

// ── Lint ────────────────────────────────────────────────────────────────────
function propertyRefs(p, out = new Set()) {
  if (!p || typeof p !== 'object') return out;
  for (const t of p.allowedTypes ?? []) out.add(t);
  for (const t of p.restrictedTypes ?? []) out.add(t);
  if (p.contentType) out.add(p.contentType);
  if (p.items) propertyRefs(p.items, out);
  return out;
}

async function lintSources() {
  const findings = [];
  const cmsDir = join(ROOT, 'cms');
  const files = (await readdir(cmsDir)).filter((f) => /\.(tsx?|mjs)$/.test(f));
  const registry = await readFile(join(cmsDir, 'registry.ts'), 'utf8').catch(() => '');

  for (const f of files) {
    const src = await readFile(join(cmsDir, f), 'utf8');

    // L3 — imports that break the CLI's esbuild bundle.
    if (f !== 'registry.ts') {
      for (const m of src.matchAll(/from\s+['"](next(?:\/[^'"]*)?|lucide-react)['"]/g)) {
        findings.push({
          level: 'error',
          rule: 'L3',
          key: f,
          message: `imports "${m[1]}" — keep cms/*.tsx free of next/* and icon packages or cms:push's bundler fails`,
        });
      }
    }

    // L4 — exported contentType() must be referenced from registry.ts.
    for (const m of src.matchAll(/export\s+const\s+(\w+)\s*=\s*contentType\s*\(/g)) {
      if (registry && !new RegExp(`\\b${m[1]}\\b`).test(registry)) {
        findings.push({
          level: 'error',
          rule: 'L4',
          key: f,
          message: `${m[1]} is not referenced in cms/registry.ts (add it to registeredContentTypes + the registry calls)`,
        });
      }
    }
  }
  return findings;
}

function lintTypes(localTypes, knownKeys, sitePrefix) {
  const findings = [];
  // L6 — every site-owned type carries the site prefix (all sites share one CMS, so an unprefixed
  // key collides sooner or later). Baseline types (defined in files that exist on main) are exempt.
  if (sitePrefix) {
    const base = baselineFiles();
    const fallback = new Set(['Page', 'RichTextBlock']);
    for (const t of localTypes) {
      const file = FILE_OF_TYPE.get(t.key);
      const isBaseline = base ? Boolean(file && base.has(file)) : fallback.has(t.key);
      if (!isBaseline && !t.key.startsWith(sitePrefix)) {
        findings.push({
          level: 'error',
          rule: 'L6',
          key: t.key,
          message: `key does not start with the site prefix "${sitePrefix}" (SITE_PREFIX)${file ? ` — defined in ${file}` : ''}`,
        });
      }
    }
  }
  for (const t of localTypes) {
    const behaviors = t.compositionBehaviors ?? [];
    for (const [name, p] of Object.entries(t.properties ?? {})) {
      const isComponentArray = p.type === 'array' && p.items?.type === 'component';
      // L1
      if (isComponentArray && behaviors.includes('elementEnabled')) {
        findings.push({
          level: 'error',
          rule: 'L1',
          key: t.key,
          message: `property "${name}" is an array of components, so the type must be sectionEnabled only (elementEnabled is rejected)`,
        });
      }
      // L2
      const holdsContent = p.type === 'content' || (p.type === 'array' && p.items?.type === 'content');
      const allowed = p.type === 'content' ? p.allowedTypes : p.items?.allowedTypes;
      if (holdsContent && !(allowed && allowed.length)) {
        findings.push({
          level: 'warn',
          rule: 'L2',
          key: t.key,
          message: `property "${name}" references content but has no allowedTypes — restrict it to the shared block type(s)`,
        });
      }
      // L5
      for (const ref of propertyRefs(p)) {
        if (ref === '*' || ref.startsWith('_')) continue;
        if (!knownKeys.has(ref)) {
          findings.push({
            level: 'error',
            rule: 'L5',
            key: t.key,
            message: `property "${name}" references unknown type "${ref}"`,
          });
        }
      }
    }
    for (const ref of t.mayContainTypes ?? []) {
      if (ref === '*' || ref.startsWith('_')) continue;
      if (!knownKeys.has(ref)) {
        findings.push({ level: 'error', rule: 'L5', key: t.key, message: `mayContainTypes references unknown type "${ref}"` });
      }
    }
  }
  return findings;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const FIX = Boolean(args['fix-allowed']);
  const ctx = assertSiteContext({ write: FIX && !args.dry, allowMain: Boolean(args['allow-main']), quiet: JSON_MODE });
  const cms = createCms();
  const all = await loadLocalTypes();
  const localTypes = only ? all.filter((t) => only.has(t.key)) : all;
  if (only) {
    const unknown = [...only].filter((k) => !all.some((t) => t.key === k));
    if (unknown.length) throw new Error(`--only references types not defined in code: ${unknown.join(', ')}`);
  }

  const remoteList = await cms.listAll('/v1/contenttypes');
  const remoteByKey = new Map(remoteList.map((t) => [t.key, t]));

  // The list endpoint may omit properties; fetch full definitions only where needed.
  await pool(
    localTypes.filter((t) => remoteByKey.has(t.key) && remoteByKey.get(t.key).properties === undefined),
    5,
    async (t) => {
      const { data } = await cms.get(`/v1/contenttypes/${encodeURIComponent(t.key)}`);
      remoteByKey.set(t.key, data);
    },
  );

  const knownKeys = new Set([...all.map((t) => t.key), ...remoteList.map((t) => t.key)]);

  const results = localTypes.map((local) => {
    const remote = remoteByKey.get(local.key);
    if (!remote) return { key: local.key, status: 'missing', diffs: [], remoteOnly: [], extraAllowed: [] };
    const { diffs, remoteOnly, extraAllowed } = compareType(local, remote);
    return { key: local.key, status: diffs.length ? 'drift' : 'in-sync', diffs, remoteOnly, extraAllowed };
  });

  const lint = args['no-lint'] ? [] : [...(await lintSources()), ...lintTypes(localTypes, knownKeys, ctx.sitePrefix)];

  if (FIX) await fixAllowed(cms, results, remoteByKey);

  const missing = results.filter((r) => r.status === 'missing');
  const drift = results.filter((r) => r.status === 'drift');
  const inSync = results.filter((r) => r.status === 'in-sync');
  const lintErrors = lint.filter((f) => f.level === 'error');
  const lintWarns = lint.filter((f) => f.level === 'warn');
  const remotePlus = results.filter((r) => r.remoteOnly.length);

  if (JSON_MODE) {
    console.log(JSON.stringify({ missing, drift, inSync: inSync.map((r) => r.key), lint, remoteOnly: remotePlus }, null, 2));
  } else {
    log(c.bold(`\ncms:align — ${localTypes.length} local type(s) vs ${cms.base}`));
    log(siteBanner(ctx) + '\n');
    for (const r of results) {
      if (r.status === 'in-sync') {
        log(`  ${ok(r.key.padEnd(30))} ${c.dim('in sync')}`);
      } else if (r.status === 'missing') {
        log(`  ${c.yellow('✗')} ${r.key.padEnd(30)} ${c.yellow('MISSING in CMS')}  ${c.dim('→ npm run cms:push')}`);
      } else {
        const breaking = r.diffs.some((d) => d.breaking);
        log(`  ${c.red('✗')} ${r.key.padEnd(30)} ${c.red(`DRIFT (${r.diffs.length})`)}${breaking ? c.red('  BREAKING') : ''}`);
        for (const d of r.diffs) {
          log(c.dim(`        ${d.path}: code ${JSON.stringify(d.want)} ≠ CMS ${JSON.stringify(d.have)}${d.breaking ? ' [breaking]' : ''}`));
        }
      }
      if (r.remoteOnly.length) {
        log(c.dim(`        REMOTE+ ${r.remoteOnly.join(', ')} exist only in the CMS (cms:push will not remove them)`));
      }
      for (const e of r.extraAllowed ?? []) {
        log(c.dim(`        CMS+    ${e.path} also allows ${e.extra.join(', ')} (added by other branches sharing this CMS; never narrow it)`));
      }
    }

    if (lint.length) {
      log(c.bold('\nLint'));
      for (const f of lint) {
        const mark = f.level === 'error' ? c.red('✗') : c.yellow('!');
        log(`  ${mark} ${c.dim(f.rule)} ${f.key}: ${f.message}`);
      }
    }

    log('');
    log(
      `  ${inSync.length} in sync · ${missing.length} missing · ${drift.length} drift · ` +
        `${lintErrors.length} lint error(s) · ${lintWarns.length} lint warning(s)`,
    );
    if (missing.length) log(c.dim('  Fix missing:  npm run cms:push -- --dry   (then without --dry)'));
    if (drift.length) {
      log(c.dim('  Fix drift:    targeted PATCH /v1/contenttypes/<key>; pass the breaking-change flag if marked BREAKING.'));
      log(c.dim('                (cms:push only ADDS missing types — it never updates existing ones.)'));
    }
    log('');
  }

  const failures = (args['allow-missing'] ? 0 : missing.length) + drift.length + lintErrors.length;
  if (!JSON_MODE) finish('cms:align', { failures, warnings: lintWarns.length });
  else if (failures) process.exitCode = 1;
}

// ── --fix-allowed: additive union PATCH ─────────────────────────────────────
const LIST_PATH = /(^|\.)(allowedTypes|mayContainTypes)$/;

/** Set a value at a dotted path like "properties.Content.items.allowedTypes" inside obj. */
function setPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts.slice(0, -1)) cur = cur[p] ??= {};
  cur[parts.at(-1)] = value;
}

async function fixAllowed(cms, results, remoteByKey) {
  const DRY = Boolean(args.dry);
  for (const r of results.filter((x) => x.status === 'drift')) {
    const listDiffs = r.diffs.filter((d) => LIST_PATH.test(d.path) && Array.isArray(d.want) && Array.isArray(d.have));
    if (!listDiffs.length) continue;
    if (listDiffs.length !== r.diffs.length) {
      log(c.yellow(`  ! ${r.key}: not auto-fixed — it also has other drift (${r.diffs.filter((d) => !listDiffs.includes(d)).map((d) => d.path).join(', ')})`));
      continue;
    }
    const remote = remoteByKey.get(r.key);
    // Send every property in full (with only the list changed), so the PATCH is safe whether the API
    // deep-merges or replaces the properties map.
    const body = {};
    const touchesProps = listDiffs.some((d) => d.path.startsWith('properties.'));
    if (touchesProps) body.properties = JSON.parse(JSON.stringify(remote.properties ?? {}));
    const plan = [];
    for (const d of listDiffs) {
      const union = [...new Set([...d.have.map(String), ...d.want.map(String)])];
      const added = union.filter((x) => !d.have.map(String).includes(x));
      plan.push(`${d.path} += ${added.join(', ')}`);
      setPath(body, d.path, union);
    }
    if (DRY) {
      log(c.cyan(`  ~ ${r.key}: would PATCH (union, nothing removed): ${plan.join('; ')}`));
      continue;
    }
    await cms.patch(`/v1/contenttypes/${encodeURIComponent(r.key)}`, body);
    const { data: after } = await cms.get(`/v1/contenttypes/${encodeURIComponent(r.key)}`);
    const still = listDiffs.filter((d) => {
      const have = d.path.split('.').reduce((o, p) => o?.[p], after) ?? [];
      return !d.want.every((w) => have.includes(w)) || !d.have.every((h) => have.includes(h));
    });
    if (still.length) throw new Error(`${r.key}: PATCH accepted but the read-back does not contain the union at ${still.map((d) => d.path).join(', ')}`);
    log(c.green(`  ✓ ${r.key}: PATCHed (union, nothing removed): ${plan.join('; ')}`));
    r.status = 'in-sync';
    r.diffs = [];
  }
}

main().catch((err) => fatal('cms:align', err));
