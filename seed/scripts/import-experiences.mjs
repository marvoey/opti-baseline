// Import ../experiences.json into Optimizely CMS as BlankExperience pages.
//
// Each item in the JSON defines a page with a Hero → Section → Row → Column → MainBodyBlock
// composition, plus an optional CardContainerBlock, matching the structure of
// content fd1ba78d-28cc-4c0a-a212-1178584dcc2b.
//
// Usage:
//   node seed/scripts/import-experiences.mjs [--dry-run] [--concurrency=N] [--limit=N] --container=<key>
//
// Auth: reads OPTIMIZELY_CMS_CLIENT_ID + OPTIMIZELY_CMS_CLIENT_SECRET + OPTIMIZELY_CMS_API_URL
// from .env at the repo root.

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, parseArgs, createApiClient, runPool, summarise, uuidv4 } from './lib.mjs';

const SEED_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SEED_DIR, '..', '..');
const DATA_FILE = join(SEED_DIR, '..', 'experiences.json');

const { dryRun, concurrency, container, limit } = parseArgs();

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

// Builds the full composition tree for a page item.
// All node ids are fresh UUIDs so re-runs don't conflict.
function buildComposition(item) {
  const nodes = [];

  // --- Hero ---
  nodes.push({
    id: uuidv4(),
    displayName: 'Hero',
    nodeType: 'component',
    component: {
      contentType: 'HeroBlock',
      properties: {
        SuperHeader: { value: item.hero.superHeader },
        MainTitle:   { value: item.hero.mainTitle },
        ...(item.hero.imageRef && { HeroImage: { value: item.hero.imageRef } }),
      },
    },
  });

  // --- Section → Row → Column → MainBodyBlock ---
  nodes.push({
    id: uuidv4(),
    displayName: 'Main Body',
    nodeType: 'section',
    layoutType: 'grid',
    displaySettings: {
      displayTemplate: 'BlankSectionCustom',
      settings: {
        paddingTop: 'none', paddingRight: 'none', paddingBottom: 'none', paddingLeft: 'none',
        marginTop:  'none', marginRight:  'none', marginBottom:  'none', marginLeft:  'none',
      },
    },
    component: { contentType: 'BlankSection' },
    nodes: [{
      id: uuidv4(),
      displayName: 'Row',
      nodeType: 'row',
      displaySettings: {
        displayTemplate: 'OT_LandingRow',
        settings: {
          showAsRowFrom: 'sm',
          contentSpacing: 'none',
          verticalPadding: 'none',
          justifyContent: 'start',
          alignItems: 'start',
          backgroundColor: 'none',
          wrapColumns: 'false',
          reverseColumns: 'false',
          entranceAnimation: 'none',
        },
      },
      nodes: [{
        id: uuidv4(),
        displayName: 'Column',
        nodeType: 'column',
        displaySettings: {
          displayTemplate: 'ColumnDefault',
          settings: { position: 'default' },
        },
        nodes: [{
          id: uuidv4(),
          displayName: 'Main Body Block',
          nodeType: 'component',
          displaySettings: {
            displayTemplate: 'DefaultMainBody',
            settings: { hideToc: String(item.hideToc ?? false) },
          },
          component: {
            contentType: 'MainBodyBlock',
            properties: {
              ArticleContent: { value: { html: item.articleContent } },
            },
          },
        }],
      }],
    }],
  });

  // --- CardContainerBlock (optional) ---
  if (item.cards) {
    nodes.push({
      id: uuidv4(),
      displayName: item.cards.displayName ?? 'Card Container Block',
      nodeType: 'component',
      component: {
        contentType: 'CardContainerBlock',
        properties: {
          SectionHeading: { value: item.cards.sectionHeading },
          Cards: {
            value: item.cards.items.map(card => ({
              properties: {
                CardTitle: { value: card.title },
                ...(card.imageRef  && { ThumbnailImage: { value: card.imageRef } }),
                ...(card.postLink  && { PostLink: { value: card.postLink } }),
              },
            })),
          },
        },
      },
    });
  }

  return {
    id: uuidv4(),
    displayName: item.name,
    nodeType: 'experience',
    layoutType: 'outline',
    nodes,
  };
}

async function importItem(item, index, total) {
  const label = `[${index + 1}/${total}] ${item.name}`;

  const body = {
    contentType: 'BlankExperience',
    container,
    initialVersion: {
      displayName: item.name,
      locale: item.language ?? 'en',
      routeSegment: item.routeSegment,
      composition: buildComposition(item),
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

const all = JSON.parse(await readFile(DATA_FILE, 'utf8'));
const items = limit ? all.slice(0, limit) : all;
console.log(`Loaded ${items.length}/${all.length} item(s) from experiences.json${limit ? ` (--limit=${limit})` : ''}`);
if (dryRun) console.log('DRY-RUN mode — no changes will be made');
console.log(`Concurrency: ${concurrency} | Container: ${container ?? '(dry-run)'} | Gateway: ${GATEWAY}`);
console.log('---');

const results = await runPool(items, importItem, concurrency);
console.log('---');
console.log('Done:', JSON.stringify(summarise(results)));
