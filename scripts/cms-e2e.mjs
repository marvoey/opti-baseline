/**
 * cms:e2e — end-to-end verification of published pages: CMS -> Graph -> rendered HTML.
 * Read-only: it never writes to the CMS.
 *
 * For every page (auto-discovered for this site's host, or --paths) it checks:
 *   1. GRAPH     the page is indexed and resolves through the SDK exactly like the app does
 *                (getContentByPath scoped to DEPLOYED_URL). Polls with --wait until Graph's
 *                version equals the CMS published version (indexing is asynchronous).
 *   2. CMS       the page has a published version, and warns if a newer draft exists.
 *   3. TREE      composition integrity: every component node resolves with data, its type is
 *                defined in code, no null entries, shared blocks resolve with content.
 *   4. REFS      every shared block referenced by the page exists + has a published version.
 *   5. RENDER    GET the page HTML (local dev server if running, else DEPLOYED_URL, or --base)
 *                and verify that the headings/labels coming from Graph appear in the markup,
 *                with no error-page markers. (A deployed site will not show new blocks until
 *                the code is deployed — use --local against `npm run dev` before deploying.)
 *
 * Usage
 *   node --env-file=.env scripts/cms-e2e.mjs [options]
 *   npm run cms:e2e -- --wait 120
 *
 * Options
 *   --paths /,/gta-online/        pages to check (default: every _Page/_Experience on DEPLOYED_URL)
 *   --wait <seconds>              poll Graph this long for indexing to catch up (default 0)
 *   --base <url> | --local        where to render-check (default: auto = local if up, else DEPLOYED_URL)
 *   --min-coverage <0..1>         share of expected strings that must appear in HTML (default 0.8)
 *   --no-render | --no-refs       skip the render check / the shared-block REST check
 *   --verbose                     list every CMS string missing from the rendered HTML
 *   --json                        machine-readable output
 *
 * Exit code 1 if any check fails (warnings do not fail the run).
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  BlankExperienceContentType,
  BlankSectionContentType,
  config,
  getClient,
  initContentTypeRegistry,
} from '@optimizely/cms-sdk';
import { findMetaData, readFromPath } from '@optimizely/cms-cli/dist/service/utils.js';

import { ROOT, c, createCms, fatal, finish, graphQuery, normKey, parseArgs, pool, requireVars, sleep } from './lib/cms-api.mjs';

// Optional project config: scripts/cms-e2e.config.json
//   { "clientRenderedTypes": ["GtaCarouselBlock"], "minCoverage": 0.8 }
// clientRenderedTypes = components that only put their FIRST array item in the server HTML
// (carousels/tabs that show one item at a time) — later items are not expected in the markup.
function loadProjectConfig() {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, 'scripts', 'cms-e2e.config.json'), 'utf8'));
  } catch {
    return {};
  }
}
const projectConfig = loadProjectConfig();
const CLIENT_RENDERED = new Set(projectConfig.clientRenderedTypes ?? []);

const args = parseArgs();
const JSON_MODE = Boolean(args.json);
const WAIT = Number(args.wait ?? 0);
const MIN_COVERAGE = Number(args['min-coverage'] ?? projectConfig.minCoverage ?? 0.8);
const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
const HOST = (process.env.DEPLOYED_URL || '').replace(/\/$/, '');
const TEXT_KEYS = /^(heading|title|headline|eyebrow|label|caption|text|name|subheading|subtitle|cta\w*|button\w*)$/i;

const out = (...a) => {
  if (!JSON_MODE) console.log(...a);
};

// ── SDK bootstrap (same registry the app builds in cms/registry.ts) ─────────
async function bootSdk() {
  const configFilePath = resolve(ROOT, 'optimizely.config.mjs');
  const { componentPaths } = await readFromPath(pathToFileURL(configFilePath).href);
  const realLog = console.log;
  console.log = () => {}; // the CLI logs every type it finds
  let contentTypes;
  try {
    ({ contentTypes } = await findMetaData(componentPaths, pathToFileURL(dirname(configFilePath)).href));
  } finally {
    console.log = realLog;
  }
  config({ apiKey: process.env.OPTIMIZELY_GRAPH_SINGLE_KEY, graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY });
  // IMPORTANT: the SDK-native Blank* types are registered in registry.ts, not defined in cms/*.tsx,
  // so findMetaData never returns them. Without them getContentByPath silently returns [].
  const all = [BlankExperienceContentType, BlankSectionContentType, ...contentTypes];
  initContentTypeRegistry(all);
  return new Set(all.map((t) => t.key));
}

// ── Page discovery ──────────────────────────────────────────────────────────
const normPath = (p) => {
  let s = p.trim();
  if (!s.startsWith('/')) s = `/${s}`;
  if (!s.endsWith('/')) s = `${s}/`;
  return s;
};

async function discoverPaths() {
  // Graph caps limit at 100, so page with skip until exhausted.
  const seen = new Map();
  for (let skip = 0; skip < 5000; skip += 100) {
    const data = await graphQuery(
      `query($base: String!, $skip: Int!) {
        _Content(limit: 100, skip: $skip, where: { _metadata: { url: { base: { eq: $base } }, types: { in: ["_Page", "_Experience"] } } }) {
          total
          items { _metadata { key locale url { default } } }
        }
      }`,
      { base: HOST, skip },
    );
    const items = data._Content.items;
    for (const i of items) {
      const p = i._metadata.url?.default;
      if (p && !seen.has(p)) seen.set(p, i._metadata.key);
    }
    if (items.length < 100) break;
  }
  return [...seen.keys()].sort();
}

// ── Fetch through the SDK, like app/[locale]/[[...slug]]/page.tsx ───────────
async function fetchContent(path) {
  const client = getClient();
  let res = await client.getContentByPath(path, { host: HOST });
  if (!res?.[0]) res = await client.getContentByPath(`/${LOCALE}${path}`, { host: HOST });
  return res?.[0] ?? null;
}

async function cmsVersions(cms, key) {
  const { data } = await cms.get(`/v1/content/${key}/versions`, { query: { locales: LOCALE, pageSize: 100 }, allow: [404] });
  const items = data?.items ?? [];
  const nums = (s) => items.filter((v) => v.status === s).map((v) => Number(v.version)).filter(Number.isFinite);
  return {
    published: nums('published').sort((a, b) => b - a)[0] ?? null,
    draft: nums('draft').sort((a, b) => b - a)[0] ?? null,
    exists: items.length > 0,
  };
}

// ── Tree analysis ───────────────────────────────────────────────────────────
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function analyze(content, knownTypes) {
  const issues = []; // { level: 'fail'|'warn', message }
  const stats = { nodes: {}, components: {}, shared: new Map() };
  const texts = new Set();
  const bump = (m, k) => (m[k] = (m[k] ?? 0) + 1);

  // textOn=false still scans for nulls and shared refs, it just stops adding expected strings.
  function collect(value, where, textOn = true, firstOnly = false) {
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v === null) issues.push({ level: 'fail', message: `${where}[${i}] is null (broken reference or unindexed item)` });
        else collect(v, `${where}[${i}]`, textOn && !(firstOnly && i > 0), firstOnly);
      });
      return;
    }
    if (!isObj(value)) return;

    const meta = value._metadata;
    if (value.__typename && meta?.key && !meta.types?.includes('_Page')) {
      // A nested content item resolved through a content reference (shared block).
      const fields = Object.entries(value).filter(([k, v]) => !k.startsWith('_') && k !== '__typename' && v !== null && v !== '');
      if (!stats.shared.has(meta.key)) stats.shared.set(meta.key, value.__typename);
      if (!fields.length) issues.push({ level: 'warn', message: `${where} (${value.__typename}) resolved but every field is empty — is it published?` });
    }

    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_') || k === '__typename') continue;
      if (typeof v === 'string' && TEXT_KEYS.test(k)) {
        const t = v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (textOn && t.length >= 3 && t.length <= 120 && !/^https?:\/\//i.test(t) && !t.includes('\n')) texts.add(t);
      } else if (v && typeof v === 'object') {
        collect(v, `${where}.${k}`, textOn, firstOnly);
      }
    }
  }

  function walk(node, trail) {
    if (!node) return;
    bump(stats.nodes, node.nodeType ?? 'node');
    if (node.nodeType === 'component') {
      const label = `${trail}/${node.type}`;
      bump(stats.components, node.type);
      if (!node.component) {
        issues.push({ level: 'fail', message: `${label}: component data is null (type missing in registry, or block not indexed)` });
      } else {
        if (!knownTypes.has(node.type)) {
          issues.push({ level: 'fail', message: `${label}: "${node.type}" is not defined in code (cms/*.tsx)` });
        }
        if (node.component.__typename && node.component.__typename !== node.type) {
          issues.push({ level: 'warn', message: `${label}: node type "${node.type}" ≠ component __typename "${node.component.__typename}"` });
        }
        collect(node.component, label, true, CLIENT_RENDERED.has(node.type));
      }
    }
    (node.nodes ?? []).forEach((n, i) => walk(n, `${trail}/${node.nodeType ?? 'node'}${i}`));
  }

  if (content.composition) walk(content.composition, '');
  else collect(content, content.__typename ?? 'page'); // fixed-layout _page types

  if (content.composition && !Object.keys(stats.components).length) {
    issues.push({ level: 'warn', message: 'composition has no component nodes — the page renders empty' });
  }
  return { issues, stats, texts: [...texts] };
}

// ── Render check ────────────────────────────────────────────────────────────
function htmlToText(html) {
  // alt / aria-label / title attributes are rendered text for our purposes (logo cards put their title there).
  const attrText = [...html.matchAll(/\s(?:alt|aria-label|title)="([^"]*)"/gi)].map((m) => m[1]).join(' ');
  const decoded = `${html} ${attrText}`
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  return decoded.replace(/\s+/g, ' ').toLowerCase();
}

async function pickBase() {
  if (typeof args.base === 'string') return { url: args.base.replace(/\/$/, ''), why: '--base' };
  const local = `http://localhost:${process.env.PORT || 3000}`;
  if (args.local) return { url: local, why: '--local' };
  try {
    await fetch(local, { method: 'HEAD', signal: AbortSignal.timeout(1500), redirect: 'manual' });
    return { url: local, why: 'local dev server detected' };
  } catch {
    return { url: HOST, why: 'no local server; using DEPLOYED_URL' };
  }
}

async function renderCheck(base, path, expected) {
  let res;
  try {
    res = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(30000), headers: { accept: 'text/html' } });
  } catch (e) {
    return { status: 'warn', detail: `could not reach ${base}${path} (${e.cause?.code ?? e.message}) — render check skipped` };
  }
  const html = await res.text();
  if (res.status !== 200) return { status: 'fail', detail: `HTTP ${res.status} from ${base}${path}` };
  // Only VISIBLE text counts: Next.js ships "This page could not be found" inside script/template
  // payloads of perfectly healthy pages, so htmlToText strips script/style/template first.
  const text = htmlToText(html);
  if (/this page could not be found|application error: a (server|client)-side exception/i.test(text)) {
    return { status: 'fail', detail: `error page content in response from ${base}${path}` };
  }
  if (!expected.length) return { status: 'pass', detail: `HTTP 200 (${html.length} bytes), no text fields to compare` };

  const norm = (s) => s.replace(/\s+/g, ' ').toLowerCase();
  const missing = expected.filter((s) => !text.includes(norm(s)));
  const coverage = (expected.length - missing.length) / expected.length;
  const pct = `${Math.round(coverage * 100)}% (${expected.length - missing.length}/${expected.length})`;
  const full = args.verbose && missing.length ? `\n        missing:\n${missing.map((m) => `          - ${m}`).join('\n')}` : '';
  if (coverage >= MIN_COVERAGE) {
    return { status: 'pass', detail: `HTTP 200, ${pct} of CMS strings found in HTML${missing.length ? `; missing e.g. "${missing[0]}"` : ''}${full}` };
  }
  const hint = base === HOST ? ' — the deployed site may not have the new blocks yet (deploy, or re-run with --local)' : '';
  return { status: 'fail', detail: `only ${pct} of CMS strings in HTML; missing e.g. ${missing.slice(0, 3).map((m) => `"${m}"`).join(', ')}${hint}${full}` };
}

// ── Per-page run ────────────────────────────────────────────────────────────
async function checkPage(path, ctx) {
  const checks = [];
  const add = (name, status, detail = '') => checks.push({ name, status, detail });

  // 1 + 2: Graph (poll) and CMS publish state
  let content = null;
  let cmsInfo = null;
  const deadline = Date.now() + WAIT * 1000;
  while (true) {
    content = await fetchContent(path);
    if (content) {
      cmsInfo = await cmsVersions(ctx.cms, content._metadata.key);
      const graphVer = Number(content._metadata.version);
      if (!cmsInfo.published || graphVer >= cmsInfo.published) break;
    }
    if (Date.now() >= deadline) break;
    await sleep(5000);
  }

  if (!content) {
    add('graph', 'fail', `not found in Graph for host ${HOST} (unpublished? wrong host? still indexing — try --wait 120)`);
    return { path, checks };
  }
  const meta = content._metadata;
  const graphVer = Number(meta.version);
  if (cmsInfo.published && graphVer < cmsInfo.published) {
    add('graph', 'fail', `Graph is stale: indexed v${graphVer}, CMS published v${cmsInfo.published} (re-run with --wait 120)`);
  } else {
    add('graph', 'pass', `${content.__typename} "${meta.displayName}" v${graphVer} (${meta.status})`);
  }
  if (!cmsInfo.published) add('cms', 'fail', 'no published version found in the CMS');
  else if (cmsInfo.draft && cmsInfo.draft > cmsInfo.published) {
    add('cms', 'warn', `published v${cmsInfo.published}, but newer draft v${cmsInfo.draft} has unpublished changes`);
  } else add('cms', 'pass', `published v${cmsInfo.published}`);

  // 3: tree
  const { issues, stats, texts } = analyze(content, ctx.knownTypes);
  const compSummary = Object.entries(stats.components).map(([k, n]) => `${k}×${n}`).join(', ') || 'none';
  const fails = issues.filter((i) => i.level === 'fail');
  const warns = issues.filter((i) => i.level === 'warn');
  if (fails.length) add('tree', 'fail', fails.map((i) => i.message).slice(0, 5).join(' | ') + (fails.length > 5 ? ` (+${fails.length - 5} more)` : ''));
  else if (warns.length) add('tree', 'warn', warns.map((i) => i.message).slice(0, 3).join(' | '));
  else add('tree', 'pass', `${stats.nodes.component ?? 0} component(s): ${compSummary}`);

  // 4: shared refs
  if (!args['no-refs']) {
    if (!stats.shared.size) add('refs', 'pass', 'no shared blocks referenced');
    else {
      const keys = [...stats.shared.keys()];
      const problems = [];
      await pool(keys, 6, async (k) => {
        const v = await cmsVersions(ctx.cms, normKey(k));
        if (!v.exists) problems.push(`${k} not found in CMS`);
        else if (!v.published) problems.push(`${k} (${stats.shared.get(k)}) has no published version`);
      });
      if (problems.length) add('refs', 'fail', `${problems.length}/${keys.length} shared block(s): ${problems.slice(0, 3).join('; ')}`);
      else add('refs', 'pass', `${keys.length} shared block(s) exist and are published`);
    }
  }

  // 5: render
  if (!args['no-render']) {
    const r = await renderCheck(ctx.base.url, path, texts);
    add('render', r.status, r.detail);
  }
  return { path, key: meta.key, checks };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  requireVars(['OPTIMIZELY_GRAPH_SINGLE_KEY', 'DEPLOYED_URL']);
  const knownTypes = await bootSdk();
  const cms = createCms();

  const paths = typeof args.paths === 'string' ? args.paths.split(',').filter(Boolean).map(normPath) : await discoverPaths();
  if (!paths.length) throw new Error(`No pages found in Graph for ${HOST}. Publish a page first or pass --paths.`);
  const base = args['no-render'] ? { url: '', why: 'skipped' } : await pickBase();

  out(c.bold(`\ncms:e2e — ${paths.length} page(s) · host ${HOST}`));
  out(c.dim(`  render base: ${base.url || '(skipped)'} — ${base.why} · wait ${WAIT}s · min coverage ${Math.round(MIN_COVERAGE * 100)}%\n`));

  const results = [];
  for (const p of paths) {
    const r = await checkPage(p, { cms, knownTypes, base });
    results.push(r);
    out(c.bold(`  ${p}`));
    for (const ch of r.checks) {
      const mark = ch.status === 'pass' ? c.green('✓') : ch.status === 'warn' ? c.yellow('!') : c.red('✗');
      out(`    ${mark} ${ch.name.padEnd(7)} ${c.dim(ch.detail)}`);
    }
  }

  const all = results.flatMap((r) => r.checks);
  const failures = all.filter((x) => x.status === 'fail').length;
  const warnings = all.filter((x) => x.status === 'warn').length;
  out('');
  if (JSON_MODE) {
    console.log(JSON.stringify({ host: HOST, base: base.url, results, failures, warnings }, null, 2));
    if (failures) process.exitCode = 1;
  } else {
    finish('cms:e2e', { failures, warnings });
  }
}

main().catch((err) => fatal('cms:e2e', err));
