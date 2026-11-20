/**
 * cms:bulk — idempotent batch creation / update / publishing of shared blocks
 * (any component content type) in a CMS folder, driven by a JSON spec.
 *
 * Idempotent by design: every item has an explicit or deterministic key, so re-running the same
 * spec creates nothing twice. Items already in the desired state cause NO writes.
 *
 *   create     key not found                      -> POST /v1/content (+ publish)
 *   update     properties/displayName differ      -> edit the open draft, or new version (+ publish)
 *   publish    draft already matches the spec     -> publish only
 *   unchanged  latest version matches + published -> nothing
 *
 * Usage
 *   node --env-file=.env scripts/cms-bulk.mjs --spec scripts/specs/<file>.json [--dry] [options]
 *   node --env-file=.env scripts/cms-bulk.mjs --export <folderKey> --out scripts/specs/<file>.json
 *   npm run cms:bulk -- --spec scripts/specs/product-cards.json --dry
 *
 * Options
 *   --dry               plan only; make NO writes (strongly recommended first)
 *   --no-publish        leave created/updated items as drafts
 *   --concurrency <n>   parallel requests (default 4; the CMS rate-limits with 429, which is retried)
 *   --only <text>       only items whose key or displayName contains <text>
 *   --no-verify         skip the read-back check after writing
 *   --json              machine-readable report
 *
 * Spec format (property values are PLAIN values; the script wraps them as {"value": ...})
 *   {
 *     "folder": { "name": "Product Cards",               // created when missing
 *                 "parent": "env:ASSET_BASE_FOLDER_ID",   // key, or env:VAR (default shown)
 *                 "key": "optional explicit folder key" },
 *     "contentType": "AcmeProductCard",                    // default for items (or set per item)
 *     "locale": "en",
 *     "publish": true,
 *     "items": [
 *       { "displayName": "Widget Pro", "key": "optional 32-hex key",
 *         "properties": { "Title": "…", "Destination": { "url": "…", "text": "…" } } }
 *     ]
 *   }
 *
 * Known CMS behaviours this script accounts for
 *  - Folders (SysContentFolder) are NOT localized: created WITHOUT a locale.
 *  - v1 status is read-only on create: items are created as drafts, then published via ":publish".
 *  - Version properties come back wrapped as {"value": …}; compared after unwrapping.
 *  - Shared blocks referencing other content use {"reference": "cms://content/<key>"} values.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  ROOT,
  c,
  createCms,
  deterministicKey,
  fatal,
  finish,
  normKey,
  parseArgs,
  pool,
  slugify,
  sleep,
  subsetDiff,
} from './lib/cms-api.mjs';

const args = parseArgs();
const JSON_MODE = Boolean(args.json);
const DRY = Boolean(args.dry);
const CONCURRENCY = Math.max(1, Number(args.concurrency ?? 4));
const out = (...a) => {
  if (!JSON_MODE) console.log(...a);
};

// ── Value wrapping ──────────────────────────────────────────────────────────
const wrap = (props = {}) => Object.fromEntries(Object.entries(props).map(([k, v]) => [k, { value: v }]));
const unwrap = (props = {}) => Object.fromEntries(Object.entries(props).map(([k, v]) => [k, v && typeof v === 'object' && 'value' in v ? v.value : v]));

function resolveKeyRef(ref) {
  if (!ref) return undefined;
  if (String(ref).startsWith('env:')) {
    const name = String(ref).slice(4);
    const v = process.env[name];
    if (!v) throw new Error(`Spec references ${ref} but ${name} is not set in .env`);
    return normKey(v);
  }
  return normKey(ref);
}

// ── Versions ────────────────────────────────────────────────────────────────
async function versionsOf(cms, key, locale) {
  const { data, status } = await cms.get(`/v1/content/${key}/versions`, { query: { locales: locale, pageSize: 100 }, allow: [404] });
  if (status === 404) return null;
  const items = (data?.items ?? []).filter((v) => !v.locale || v.locale === locale);
  const byNum = (a, b) => Number(b.version) - Number(a.version);
  return {
    latest: [...items].sort(byNum)[0] ?? null,
    published: items.filter((v) => v.status === 'published').sort(byNum)[0] ?? null,
  };
}

// Version ids are unique per locale, so the version endpoints take no `locale` parameter.
/**
 * The versions listing can lag a moment behind a write (eventual consistency). Poll until the
 * latest version satisfies `isReady`, backing off 0.7s, 1.4s, ... (max ~15s total).
 */
async function latestWhen(cms, key, locale, isReady) {
  let v = null;
  for (let i = 0; i < 6; i++) {
    if (i) await sleep(700 * i);
    v = await versionsOf(cms, key, locale);
    if (isReady(v)) return v;
  }
  return v;
}

async function publish(cms, key, version) {
  await cms.post(`/v1/content/${key}/versions/${version}:publish`, {});
}

// ── Folder ──────────────────────────────────────────────────────────────────
async function ensureFolder(cms, folder) {
  if (!folder) throw new Error('spec.folder is required (name, and optionally parent/key)');
  const parent = resolveKeyRef(folder.parent ?? 'env:ASSET_BASE_FOLDER_ID');
  const key = folder.key ? normKey(folder.key) : deterministicKey('folder', parent, folder.name ?? '');
  const existing = await cms.get(`/v1/content/${key}`, { allow: [404] });
  if (existing.status !== 404) return { key, parent, created: false };
  if (!folder.name) throw new Error('Folder does not exist yet and spec.folder.name is missing');
  if (DRY) return { key, parent, created: true, dry: true };
  // SysContentFolder is non-localized: do NOT send a locale (a locale makes the API reject it).
  await cms.post('/v1/content', {
    key,
    contentType: 'SysContentFolder',
    container: parent,
    initialVersion: { displayName: folder.name },
  });
  return { key, parent, created: true };
}

// ── Preflight ───────────────────────────────────────────────────────────────
async function preflight(cms, spec, items) {
  const problems = [];
  const types = [...new Set(items.map((i) => i.contentType))];
  const defs = new Map();
  for (const t of types) {
    const { data, status } = await cms.get(`/v1/contenttypes/${encodeURIComponent(t)}`, { allow: [404] });
    if (status === 404) problems.push(`content type "${t}" does not exist in the CMS (run npm run cms:push)`);
    else defs.set(t, data);
  }
  const seenKeys = new Map();
  for (const it of items) {
    const def = defs.get(it.contentType);
    if (def) {
      if (def.baseType && def.baseType !== '_component') {
        problems.push(`"${it.displayName}": ${it.contentType} has baseType ${def.baseType}; shared blocks must be _component types`);
      }
      for (const p of Object.keys(it.properties ?? {})) {
        if (!def.properties?.[p]) problems.push(`"${it.displayName}": ${it.contentType} has no property "${p}"`);
      }
      for (const [p, d] of Object.entries(def.properties ?? {})) {
        if (d.isRequired && (it.properties?.[p] === undefined || it.properties?.[p] === null || it.properties?.[p] === '')) {
          problems.push(`"${it.displayName}": required property "${p}" is empty`);
        }
      }
    }
    if (!it.displayName) problems.push(`item with key ${it.key} has no displayName`);
    if (seenKeys.has(it.key)) problems.push(`duplicate key ${it.key}: "${seenKeys.get(it.key)}" and "${it.displayName}" (give one an explicit "key")`);
    seenKeys.set(it.key, it.displayName);
  }
  return problems;
}

// ── One item ────────────────────────────────────────────────────────────────
async function processItem(cms, it, ctx) {
  const { locale, folderKey, shouldPublish } = ctx;
  const res = { key: it.key, displayName: it.displayName, action: 'unchanged', detail: '' };
  try {
    const meta = await cms.get(`/v1/content/${it.key}`, { allow: [404] });

    // ── create ──
    if (meta.status === 404) {
      res.action = DRY ? 'would-create' : 'created';
      if (DRY) {
        if (shouldPublish) res.detail = '+ publish';
        return res;
      }
      await cms.post('/v1/content', {
        key: it.key,
        contentType: it.contentType,
        container: folderKey,
        initialVersion: { displayName: it.displayName, locale, properties: wrap(it.properties) },
      });
      if (shouldPublish) {
        const v = await latestWhen(cms, it.key, locale, (x) => Boolean(x?.latest));
        if (!v?.latest) throw new Error('created but no version found to publish');
        await publish(cms, it.key, v.latest.version);
        res.detail = `published v${v.latest.version}`;
      }
      res.touched = true;
      return res;
    }

    // ── exists: compare ──
    if (meta.data.contentType && meta.data.contentType !== it.contentType) {
      throw new Error(`exists as ${meta.data.contentType}, spec says ${it.contentType} (content type cannot change)`);
    }
    if (meta.data.container && normKey(meta.data.container) !== folderKey) {
      res.detail = `note: lives in folder ${meta.data.container}, not the spec folder`;
    }
    const v = await versionsOf(cms, it.key, locale);
    const cur = v?.latest;
    if (!cur) {
      throw new Error(`exists but has no ${locale} version (add the locale manually first)`);
    }
    const diffs = [
      ...subsetDiff(it.properties ?? {}, unwrap(cur.properties ?? {}), 'properties'),
      ...(cur.displayName !== it.displayName ? [{ path: 'displayName', want: it.displayName, have: cur.displayName }] : []),
    ];

    if (!diffs.length) {
      if (cur.status === 'published') return res; // unchanged
      if (!shouldPublish) {
        res.detail = `latest v${cur.version} is ${cur.status} (matches spec)`;
        return res;
      }
      res.action = DRY ? 'would-publish' : 'published';
      if (!DRY) {
        await publish(cms, it.key, cur.version);
        res.touched = true;
      }
      res.detail = `v${cur.version}`;
      return res;
    }

    // differs -> update
    res.action = DRY ? 'would-update' : 'updated';
    res.detail = diffs.slice(0, 3).map((d) => d.path).join(', ') + (diffs.length > 3 ? ` (+${diffs.length - 3})` : '');
    if (DRY) return res;

    let target;
    if (['draft', 'ready'].includes(cur.status)) {
      // an open draft can be edited in place
      await cms.patch(`/v1/content/${it.key}/versions/${cur.version}`, { displayName: it.displayName, properties: wrap(it.properties) });
      target = cur.version;
    } else {
      // published/previous versions are immutable: create a new draft version
      await cms.post(`/v1/content/${it.key}/versions`, { locale, displayName: it.displayName, properties: wrap(it.properties) });
      const fresh = await latestWhen(cms, it.key, locale, (x) => x?.latest && Number(x.latest.version) > Number(cur.version));
      target = fresh?.latest?.version;
      if (!target || Number(target) <= Number(cur.version)) throw new Error('new version was not created');
    }
    if (shouldPublish) await publish(cms, it.key, target);
    res.detail += ` → v${target}${shouldPublish ? ' published' : ' (draft)'}`;
    res.touched = true;
    return res;
  } catch (err) {
    res.action = 'failed';
    res.detail = err instanceof Error ? err.message : String(err);
    return res;
  }
}

async function verifyItem(cms, it, ctx) {
  let problem;
  for (let i = 0; i < 6; i++) {
    if (i) await sleep(700 * i);
    problem = await verifyOnce(cms, it, ctx);
    if (!problem) return null;
  }
  return problem;
}

async function verifyOnce(cms, it, ctx) {
  const v = await versionsOf(cms, it.key, ctx.locale);
  const target = ctx.shouldPublish ? v?.published : v?.latest;
  if (!target) return `${it.displayName}: nothing ${ctx.shouldPublish ? 'published' : 'saved'} after write`;
  const diffs = subsetDiff(it.properties ?? {}, unwrap(target.properties ?? {}), 'properties');
  if (diffs.length) return `${it.displayName}: read-back differs at ${diffs[0].path}`;
  if (ctx.shouldPublish && v.latest && Number(v.latest.version) > Number(target.version)) {
    return `${it.displayName}: newer unpublished version v${v.latest.version} exists`;
  }
  return null;
}

// ── Export mode ─────────────────────────────────────────────────────────────
async function runExport(cms) {
  const folderKey = normKey(args.export);
  const outFile = resolve(ROOT, typeof args.out === 'string' ? args.out : `scripts/specs/${folderKey}.json`);
  const locale = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
  const meta = await cms.get(`/v1/content/${folderKey}`);
  const kids = await cms.listAll(`/v1/content/${folderKey}/items`);
  out(c.bold(`\ncms:bulk --export — ${kids.length} item(s) in folder ${folderKey}\n`));

  const items = await pool(kids, CONCURRENCY, async (k) => {
    const v = await versionsOf(cms, normKey(k.key), locale);
    const ver = v?.published ?? v?.latest;
    if (!ver) return null;
    return { contentType: k.contentType, key: normKey(k.key), displayName: ver.displayName, properties: unwrap(ver.properties ?? {}) };
  });
  const clean = items.filter(Boolean);
  const types = [...new Set(clean.map((i) => i.contentType))];
  const single = types.length === 1 ? types[0] : undefined;

  let folderName = 'Exported Folder';
  const fv = await cms.get(`/v1/content/${folderKey}/versions`, { allow: [404] });
  folderName = fv.data?.items?.[0]?.displayName ?? folderName;

  const spec = {
    folder: { name: folderName, parent: normKey(meta.data.container), key: folderKey },
    ...(single ? { contentType: single } : {}),
    locale,
    publish: true,
    items: clean.map((i) => ({ key: i.key, displayName: i.displayName, ...(single ? {} : { contentType: i.contentType }), properties: i.properties })),
  };
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(spec, null, 2) + '\n');
  out(`  ${c.green('✓')} wrote ${clean.length} item(s) to ${outFile}`);
  if (clean.length !== kids.length) out(c.yellow(`  ! skipped ${kids.length - clean.length} item(s) with no ${locale} version`));
  out(c.dim(`  Re-run to verify idempotency:  npm run cms:bulk -- --spec ${outFile.replace(ROOT + '/', '')} --dry\n`));
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const cms = createCms();
  if (args.export) return runExport(cms);
  if (typeof args.spec !== 'string') {
    throw new Error('Usage: cms:bulk --spec <file.json> [--dry]   |   cms:bulk --export <folderKey> --out <file.json>');
  }

  const spec = JSON.parse(readFileSync(resolve(ROOT, args.spec), 'utf8'));
  const locale = spec.locale || process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
  const shouldPublish = args['no-publish'] ? false : spec.publish !== false;
  if (!Array.isArray(spec.items) || !spec.items.length) throw new Error('spec.items must be a non-empty array');

  const folder = await ensureFolder(cms, spec.folder);
  let items = spec.items.map((raw) => {
    const contentType = raw.contentType || spec.contentType;
    if (!contentType) throw new Error(`"${raw.displayName}" has no contentType (set spec.contentType or item.contentType)`);
    const key = raw.key ? normKey(raw.key) : deterministicKey(contentType, folder.key, raw.slug ?? slugify(raw.displayName ?? ''));
    return { key, displayName: raw.displayName, contentType, properties: raw.properties ?? {} };
  });
  if (typeof args.only === 'string') {
    const needle = args.only.toLowerCase();
    items = items.filter((i) => i.key.includes(needle) || i.displayName.toLowerCase().includes(needle));
  }

  out(c.bold(`\ncms:bulk — ${items.length} item(s) → folder "${spec.folder.name ?? folder.key}"${DRY ? c.yellow('  [DRY RUN — no writes]') : ''}`));
  out(c.dim(`  folder ${folder.key} ${folder.created ? (DRY ? '(would be created)' : '(created)') : '(exists)'} · locale ${locale} · ${shouldPublish ? 'publish' : 'leave as draft'} · concurrency ${CONCURRENCY}\n`));

  const problems = await preflight(cms, spec, items);
  if (problems.length) {
    out(c.red('Preflight failed — nothing was written:'));
    problems.slice(0, 20).forEach((p) => out(`  ${c.red('✗')} ${p}`));
    if (problems.length > 20) out(c.dim(`  … and ${problems.length - 20} more`));
    process.exitCode = 1;
    if (JSON_MODE) console.log(JSON.stringify({ preflight: problems }, null, 2));
    return;
  }

  // In a dry run against a folder that doesn't exist yet, every item is simply "would create".
  const ctx = { locale, folderKey: folder.key, shouldPublish };
  const results = await pool(items, CONCURRENCY, (it) => processItem(cms, it, ctx));

  const count = (a) => results.filter((r) => r.action === a).length;
  const icon = { created: c.green('+'), 'would-create': c.cyan('+'), updated: c.yellow('~'), 'would-update': c.cyan('~'), published: c.green('↑'), 'would-publish': c.cyan('↑'), unchanged: c.dim('='), failed: c.red('✗') };
  if (!JSON_MODE) {
    for (const r of results) {
      if (r.action === 'unchanged' && !args.verbose && results.length > 12) continue; // keep long runs readable
      out(`  ${icon[r.action]} ${r.displayName.padEnd(44).slice(0, 44)} ${c.dim(`${r.action}${r.detail ? ` — ${r.detail}` : ''}`)}`);
    }
    if (results.length > 12 && count('unchanged')) out(c.dim(`  = ${count('unchanged')} unchanged (use --verbose to list)`));
  }

  // Read back everything we wrote.
  let verifyProblems = [];
  const touched = results.filter((r) => r.touched);
  if (!DRY && !args['no-verify'] && touched.length) {
    const byKey = new Map(items.map((i) => [i.key, i]));
    verifyProblems = (await pool(touched, CONCURRENCY, (r) => verifyItem(cms, byKey.get(r.key), ctx))).filter(Boolean);
  }

  const failed = count('failed');
  out('');
  out(
    `  ${count('created') + count('would-create')} create · ${count('updated') + count('would-update')} update · ` +
      `${count('published') + count('would-publish')} publish-only · ${count('unchanged')} unchanged · ${failed} failed`,
  );
  if (!DRY && touched.length && !args['no-verify']) {
    out(verifyProblems.length ? c.red(`  read-back: ${verifyProblems.length} problem(s)`) : c.green(`  read-back: ${touched.length} written item(s) verified`));
    verifyProblems.slice(0, 5).forEach((p) => out(`    ${c.red('✗')} ${p}`));
  }
  if (DRY) out(c.dim('  Dry run only. Re-run without --dry to apply.'));
  out('');

  if (JSON_MODE) {
    console.log(JSON.stringify({ folder, dry: DRY, results, verifyProblems }, null, 2));
    if (failed || verifyProblems.length) process.exitCode = 1;
  } else {
    finish('cms:bulk', { failures: failed + verifyProblems.length });
  }
}

main().catch((err) => fatal('cms:bulk', err));
