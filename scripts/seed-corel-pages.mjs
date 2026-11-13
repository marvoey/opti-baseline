/**
 * Seed the Corel pages into the CMS from the mock's content.
 *
 *   node --env-file=.env scripts/seed-corel-pages.mjs [options]
 *
 * Pipeline (each step is idempotent — existing items are found by display name and skipped):
 *   media  → upload images into ASSET_BASE_FOLDER_ID, publish them
 *   blocks → create the shared, section-enabled blocks in ASSET_BASE_FOLDER_ID
 *   publish-blocks → publish every block
 *   pages  → create one CorelExperience per page under HOME_PAGE_CONTENT_ID, whose
 *            composition references the shared blocks
 *   publish-pages → publish the pages
 *   home   → publish the Corel home page (the parent)
 *
 * Options
 *   --dry               preflight + print the plan; write nothing
 *   --pages=a,b         only these pages (product, special-offers, free-trials, learn, support, home)
 *                     `home` updates the existing Corel home page's composition (opt-in)
 *   --until=<step>      stop after a step (media|blocks|publish-blocks|pages|publish-pages|home)
 *
 * Placement follows .claude/skills/cms-content-placement: pages under
 * HOME_PAGE_CONTENT_ID, shared blocks + media in ASSET_BASE_FOLDER_ID. This script
 * only creates and publishes — it never deletes or moves anything.
 */

import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';
import {
  CmsError,
  createContent,
  createMedia,
  getContent,
  keyOf,
  listChildren,
  listVersions,
  patchVersion,
  publishVersion,
  request,
  requireId,
} from './corel-seed/cms.mjs';
import { ASSET_ORIGIN, BLOCKS, HOME_PAGE, MEDIA, PAGES, blockDisplayName } from './corel-seed/data.mjs';

const STEPS = ['media', 'blocks', 'publish-blocks', 'pages', 'publish-pages', 'home'];
const LOCALE = 'en';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_HOSTS = new Set([new URL(ASSET_ORIGIN).host]);

/* --------------------------------------------------------------------- cli */

const args = new Map(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const DRY = args.has('dry');
const UNTIL = args.get('until') ?? 'home';
if (!STEPS.includes(UNTIL)) fail(`--until must be one of: ${STEPS.join(', ')}`);
// `home` is the EXISTING Corel home page: it is updated (new version), never created.
// It is opt-in (--pages=home) so a default run only touches the five created pages.
const ALL_PAGES = { ...PAGES, home: HOME_PAGE };
const pageIds = (args.get('pages') ? String(args.get('pages')).split(',') : Object.keys(PAGES)).map((s) => s.trim());
for (const p of pageIds) if (!ALL_PAGES[p]) fail(`Unknown page "${p}". Known: ${Object.keys(ALL_PAGES).join(', ')}`);
const runs = (step) => STEPS.indexOf(step) <= STEPS.indexOf(UNTIL);

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}
const log = (...a) => console.log(...a);
const short = (o, n = 500) => JSON.stringify(o).slice(0, n);

/** Run `fn` over `items` with limited concurrency, preserving order. */
async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

/* --------------------------------------------------------------- selection */

const neededBlockIds = [...new Set(pageIds.flatMap((p) => ALL_PAGES[p].blocks))];

function collectMedia(value, into) {
  if (Array.isArray(value)) value.forEach((v) => collectMedia(v, into));
  else if (value && typeof value === 'object') {
    if (value.__media) into.add(value.__media);
    else Object.values(value).forEach((v) => collectMedia(v, into));
  }
  return into;
}
const neededMediaIds = [...neededBlockIds.reduce((s, id) => collectMedia(BLOCKS[id].props, s), new Set())];

/* ---------------------------------------------------------------- preflight */

async function assertContainers(homeKey, folderKey) {
  const [home, folder] = await Promise.all([getContent(homeKey), getContent(folderKey)]);
  const [homeType, folderType] = await Promise.all([
    request('GET', `/contenttypes/${home.contentType}`),
    request('GET', `/contenttypes/${folder.contentType}`),
  ]);
  if (!['_page', '_experience'].includes(homeType.baseType)) {
    fail(`HOME_PAGE_CONTENT_ID is a ${home.contentType} (${homeType.baseType}); pages can only be created under a page or experience.`);
  }
  if (folderType.baseType !== '_folder') {
    fail(`ASSET_BASE_FOLDER_ID is a ${folder.contentType} (${folderType.baseType}); shared blocks and media need a folder.`);
  }
  log(`✓ home   ${homeKey}  ${home.contentType} (${homeType.baseType})`);
  log(`✓ folder ${folderKey}  ${folder.contentType} (${folderType.baseType})`);
}

/** displayName → { key, version, status, contentType } for the children of a container. */
async function existingChildren(containerKey) {
  const kids = await listChildren(containerKey);
  const rows = await pool(kids, 4, async (k) => {
    // No locale filter: media items are locale-neutral and would come back empty.
    const v = (await listVersions(k.key))?.items ?? [];
    const latest = v.find((x) => x.status === 'published') ?? v.find((x) => x.status === 'draft') ?? v[0];
    return latest ? { name: latest.displayName, key: k.key, version: latest.version, status: latest.status, contentType: k.contentType } : null;
  });
  // If a name appears twice (e.g. an accidental duplicate), keep the first one listed so
  // the choice is deterministic; never touch the other.
  const map = new Map();
  for (const r of rows.filter(Boolean)) if (!map.has(r.name)) map.set(r.name, r);
  return map;
}

/** GET an image from the allowlisted host (https only, redirects re-checked, size/type capped). */
async function downloadImage(path) {
  let url = new URL(path, ASSET_ORIGIN);
  for (let hop = 0; hop < 4; hop++) {
    if (url.protocol !== 'https:' || !ALLOWED_IMAGE_HOSTS.has(url.host)) throw new Error(`blocked host: ${url.host}`);
    const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'corel-seed/1.0' } });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = new URL(res.headers.get('location'), url);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!type.startsWith('image/')) throw new Error(`not an image (${type || 'no content-type'})`);
    const declared = Number(res.headers.get('content-length'));
    if (declared > MAX_IMAGE_BYTES) throw new Error(`too large (${declared} bytes)`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error(`too large (${bytes.byteLength} bytes)`);
    return { bytes, mimeType: type, fileName: basename(url.pathname) };
  }
  throw new Error('too many redirects');
}

/**
 * Resolve { key, version, status } for an item we just created. Prefers the create
 * response; falls back to looking the item up by display name so an empty response
 * body never makes us create the same item twice.
 */
async function created(result, name, container) {
  const key = keyOf(result);
  const v = result?.initialVersion;
  if (key && v?.version) return { key, version: v.version, status: v.status ?? 'draft' };
  if (key) {
    // Read the new item directly by key — container listings can lag a moment behind a create.
    const versions = (await listVersions(key))?.items ?? [];
    const latest = versions.find((x) => x.status === 'draft') ?? versions[0];
    if (latest) return { key, version: latest.version, status: latest.status };
  }
  const found = (await existingChildren(container)).get(name);
  if (!found) throw new Error(`Created "${name}" but could not read it back (response: ${short(result, 300)})`);
  return found;
}

/* ------------------------------------------------------------------- steps */

async function stepMedia({ folder, folderItems, mediaKeys, images }) {
  log(`\n▸ media (${neededMediaIds.length} images)`);
  let nCreated = 0;
  await pool(neededMediaIds, 1, async (id) => {
    const m = MEDIA[id];
    const have = folderItems.get(m.name);
    if (have) {
      if (have.status !== 'published' && !DRY) {
        await publishVersion(have.key, have.version);
        have.status = 'published';
        log(`  ✓ published existing draft ${id}`);
      }
      mediaKeys.set(id, have);
      return;
    }
    const img = images.get(id);
    if (!img) {
      log(`  ⚠ ${id}: no usable image — block will fall back to the gradient placeholder`);
      return;
    }
    if (DRY) return log(`  · would upload ${id} → "${m.name}" (${img.fileName}, ${img.bytes.byteLength} B)`);
    const result = await createMedia({
      contentType: 'ImageMedia', container: folder,
      initialVersion: { displayName: m.name, locale: LOCALE },
      bytes: img.bytes, fileName: img.fileName, mimeType: img.mimeType,
    });
    if (nCreated === 0) log(`  (first upload response) ${short(result, 300)}`);
    const item = await created(result, m.name, folder);
    if (item.status !== 'published') await publishVersion(item.key, item.version);
    mediaKeys.set(id, { ...item, status: 'published' });
    nCreated++;
  });
  log(`  media: ${nCreated} created, ${mediaKeys.size}/${neededMediaIds.length} available`);
}

/**
 * Encode a block's props into the REST shape: every property is `{ value }`; array
 * items / embedded components are `{ properties: { … } }`; rich text is `{ html }`;
 * images become `cms://content/<key>` references (dropped if the image is unavailable).
 */
const isLink = (v) => v && typeof v === 'object' && !Array.isArray(v) && 'url' in v && 'text' in v;

function encodeValue(v, mediaKeys) {
  if (v === null || v === undefined) return undefined;
  if (typeof v !== 'object') return v;
  if (v.__media) return mediaKeys.has(v.__media) ? `cms://content/${mediaKeys.get(v.__media).key}` : undefined;
  if (v.__html !== undefined) return { html: v.__html };
  if (isLink(v)) return v;
  if (Array.isArray(v)) return v.map((item) => (item && typeof item === 'object' && !isLink(item) ? { properties: wrapProps(item, mediaKeys) } : encodeValue(item, mediaKeys)));
  return { properties: wrapProps(v, mediaKeys) }; // single embedded component
}

function wrapProps(props, mediaKeys) {
  const out = {};
  for (const [k, v] of Object.entries(props)) {
    const enc = encodeValue(v, mediaKeys);
    if (enc !== undefined) out[k] = { value: enc };
  }
  return out;
}
const resolveProps = wrapProps;

async function stepBlocks({ folder, folderItems, mediaKeys, blockKeys }) {
  log(`\n▸ shared blocks (${neededBlockIds.length})`);
  let nCreated = 0;
  for (const id of neededBlockIds) {
    const b = BLOCKS[id];
    const name = blockDisplayName(b);
    const have = folderItems.get(name);
    if (have) {
      blockKeys.set(id, have);
      continue;
    }
    if (DRY) {
      log(`  · would create ${b.type.padEnd(26)} "${name}"`);
      continue;
    }
    const result = await createContent({
      contentType: b.type, container: folder,
      initialVersion: { displayName: name, locale: LOCALE, properties: resolveProps(b.props, mediaKeys) },
    });
    if (nCreated === 0) log(`  (first block response) ${short(result, 300)}`);
    blockKeys.set(id, await created(result, name, folder));
    nCreated++;
    log(`  ✓ ${b.type.padEnd(26)} "${name}"`);
  }
  log(`  blocks: ${nCreated} created, ${blockKeys.size}/${neededBlockIds.length} present`);
}

async function stepPublishBlocks({ blockKeys }) {
  const todo = [...blockKeys.entries()].filter(([, v]) => v.status !== 'published');
  log(`\n▸ publish blocks (${todo.length} to publish)`);
  if (DRY) return;
  await pool(todo, 3, async ([id, v]) => {
    await publishVersion(v.key, v.version);
    v.status = 'published';
    log(`  ✓ published ${blockDisplayName(BLOCKS[id])}`);
  });
}

/** Component nodes (one per block) in page order. */
const compositionNodes = (blockIds, blockKeys) =>
  blockIds.map((bid) => {
    const blk = blockKeys.get(bid);
    if (!blk) fail(`Block "${bid}" has not been created yet (run without --dry / earlier steps).`);
    return { id: randomUUID(), displayName: blockDisplayName(BLOCKS[bid]), nodeType: 'component', component: { reference: `cms://content/${blk.key}` } };
  });

const refKeys = (composition) =>
  (composition?.nodes ?? []).map((n) => (n.component?.reference ?? '').replace('cms://content/', '').replace(/-/g, ''));

/**
 * Update the EXISTING home page: give it a draft version whose composition references the
 * shared blocks (keeps its type, route and URL). A published version is never edited in
 * place — a new draft is created (or the existing draft reused), then published later.
 */
async function updateHome({ home, blockKeys, pageKeys }) {
  const p = ALL_PAGES.home;
  const wanted = p.blocks.map((bid) => blockKeys.get(bid)?.key);
  const versions = ((await listVersions(home))?.items ?? []).filter((v) => v.locale === LOCALE);
  const draft = versions.find((v) => v.status === 'draft');
  const latest = draft ?? versions.find((v) => v.status === 'published') ?? versions[0];
  if (!latest) fail('Could not find an English version of the home page.');
  const current = await request('GET', `/content/${home}/versions/${latest.version}`);

  if (JSON.stringify(refKeys(current.composition)) === JSON.stringify(wanted)) {
    log(`  = home already has these ${wanted.length} blocks (${latest.status}, v${latest.version})`);
    pageKeys.set('home', { key: home, version: latest.version, status: latest.status });
    return;
  }
  if (DRY) return log(`  · would update home (currently ${refKeys(current.composition).length} blocks) → ${wanted.length} blocks: ${p.blocks.join(', ')}`);

  const properties = { ...(current.properties ?? {}), ...wrapProps(p.props, new Map()) };
  const composition = { ...(current.composition?.id ? { id: current.composition.id } : {}), nodeType: 'experience', layoutType: 'outline', nodes: compositionNodes(p.blocks, blockKeys) };

  let target = draft;
  if (draft) {
    await patchVersion(home, draft.version, { properties, composition });
  } else {
    await request('POST', `/content/${home}/versions`, {
      body: { locale: LOCALE, displayName: current.displayName, routeSegment: current.routeSegment, properties, composition },
    });
    target = ((await listVersions(home))?.items ?? []).find((v) => v.locale === LOCALE && v.status === 'draft');
    if (!target) fail('Created a new home version but could not read it back.');
  }
  pageKeys.set('home', { key: home, version: target.version, status: 'draft' });
  log(`  ✓ home updated: new draft v${target.version} with ${wanted.length} blocks`);
}

async function stepPages({ home, homeItems, blockKeys, pageKeys }) {
  log(`\n▸ pages (${pageIds.length})`);
  for (const pid of pageIds) {
    const p = ALL_PAGES[pid];
    if (p.existing) {
      await updateHome({ home, blockKeys, pageKeys });
      continue;
    }
    const have = homeItems.get(p.displayName);
    if (have) {
      pageKeys.set(pid, have);
      log(`  = exists "${p.displayName}"`);
      continue;
    }
    const nodes = DRY && blockKeys.size === 0 ? p.blocks.map(() => null) : compositionNodes(p.blocks, blockKeys);
    if (DRY) {
      log(`  · would create "${p.displayName}" /${p.routeSegment}/ with ${nodes.length} blocks`);
      continue;
    }
    const result = await createContent({
      contentType: 'CorelExperience', container: home,
      initialVersion: {
        displayName: p.displayName, locale: LOCALE, routeSegment: p.routeSegment, properties: wrapProps(p.props, new Map()),
        composition: { nodeType: 'experience', layoutType: 'outline', nodes },
      },
    });
    const item = await created(result, p.displayName, home);
    pageKeys.set(pid, item);
    log(`  ✓ "${p.displayName}" /${p.routeSegment}/  ${nodes.length} blocks  key=${item.key}`);
  }
}

async function stepPublishPages({ pageKeys }) {
  const todo = [...pageKeys.entries()].filter(([, v]) => v.status !== 'published');
  log(`\n▸ publish pages (${todo.length} to publish)`);
  if (DRY) return;
  for (const [pid, v] of todo) {
    await publishVersion(v.key, v.version);
    v.status = 'published';
    log(`  ✓ published "${ALL_PAGES[pid].displayName}"`);
  }
}

async function stepHome({ home }) {
  log('\n▸ home page');
  if (pageIds.includes('home')) return log('  = handled with the pages above');
  const versions = (await listVersions(home, LOCALE))?.items ?? [];
  if (versions.some((v) => v.status === 'published')) return log('  = already published');
  const draft = versions.find((v) => v.status === 'draft') ?? versions[0];
  if (!draft) fail('Could not find a version of the home page to publish.');
  if (DRY) return log(`  · would publish home "${draft.displayName}" (version ${draft.version})`);
  await publishVersion(home, draft.version);
  log(`  ✓ published home "${draft.displayName}"`);
}

/* -------------------------------------------------------------------- main */

async function main() {
  const home = requireId('HOME_PAGE_CONTENT_ID');
  const folder = requireId('ASSET_BASE_FOLDER_ID');
  log(`Corel seed${DRY ? ' (DRY RUN — nothing is written)' : ''}: pages=[${pageIds.join(', ')}] until=${UNTIL}`);
  log(`  ${neededBlockIds.length} shared blocks, ${neededMediaIds.length} images`);

  await assertContainers(home, folder);

  const [folderItems, homeItems] = await Promise.all([existingChildren(folder), existingChildren(home)]);
  log(`  existing: ${folderItems.size} items in the asset folder, ${homeItems.size} under home`);

  // Download + validate every needed image up front so a bad URL fails loudly, not mid-run.
  const images = new Map();
  const unavailable = [];
  await pool(neededMediaIds, 4, async (id) => {
    if (folderItems.has(MEDIA[id].name)) return; // already uploaded
    for (const path of [MEDIA[id].path, ...(MEDIA[id].alt ?? [])]) {
      try {
        images.set(id, await downloadImage(path));
        return;
      } catch (e) {
        log(`  ⚠ image ${id} (${path}): ${e.message}`);
      }
    }
    unavailable.push(id);
  });
  log(`  images: ${images.size} fetched, ${unavailable.length} unavailable${unavailable.length ? ` (${unavailable.join(', ')})` : ''}`);

  const ctx = { home, folder, homeItems, folderItems, images, mediaKeys: new Map(), blockKeys: new Map(), pageKeys: new Map() };
  if (runs('media')) await stepMedia(ctx);
  if (runs('blocks')) await stepBlocks(ctx);
  if (runs('publish-blocks')) await stepPublishBlocks(ctx);
  if (runs('pages')) await stepPages(ctx);
  if (runs('publish-pages')) await stepPublishPages(ctx);
  if (runs('home')) await stepHome(ctx);

  log(`\n${DRY ? 'Dry run complete.' : 'Done.'}`);
}

main().catch((e) => {
  if (e instanceof CmsError) console.error(`\n✗ ${e.message}\n  ${short(e.body, 800)}`);
  else console.error(`\n✗ ${e.message}`);
  process.exit(1);
});
