// Seeds an ExperiencePage that recreates cms/CibcHero.tsx entirely from the V1
// atomic design system (V1Section → row → column → V1Text / V1Button), then
// publishes it. Proves the bespoke CibcHero content type can be composed from
// generic atoms + display templates instead of a monolithic block:
//
//   CibcHero field/style        →  atomic equivalent
//   ─────────────────────────      ─────────────────────────────────────────
//   navy gradient + chart motif →  V1Section { theme: dark, decoration: chart }
//   Eyebrow (gold pill)         →  V1Text    { variant: eyebrow }
//   Headline (serif H1)         →  V1Text    { variant: display, tone: default }
//   Subtext                     →  V1Text    { variant: body,    tone: onDark }
//   Primary / Secondary CTA     →  V1Button  { variant: primary | secondary }
//
// Auth + endpoints mirror the cms-cli REST client: OAuth client-credentials →
// `POST {gateway}/oauth/token`, then the CMS content API. Node shapes were
// derived from a real composition in this instance (component nodes carry
// `displaySettings: { displayTemplate, settings }` and
// `component: { contentType, properties: { Field: { value } } }`; link values
// serialize as `{ url, text, title }`). Structure follows the Visual Builder
// model: experience → section → row → column → component.
//
// The `settings` keys must match the display-template definitions in cms/:
//   V1SectionDefault → theme | decoration | padding | contentWidth | rounded
//   V1RowDefault     → columnLayout | verticalAlignment | columnGap | …
//   V1ColumnDefault  → columnSpan | selfAlignment | contentGap | contentAlignment
//   V1TextDefault    → variant | tone | align
//   V1ButtonDefault  → variant | size
//
// Usage:
//   node scripts/seed-atomic-hero.mjs [--container <key>] [--key <key>] [--route <seg>]
//   npm run seed:hero
//
// Container defaults to the same parent as the existing demo experience; override
// with --container or OPTIMIZELY_SEED_CONTAINER. Re-running updates the same
// content item (fixed key) with a fresh version, then republishes.

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try {
    process.loadEnvFile(join(ROOT, '.env'));
  } catch {
    /* no .env — rely on process.env */
  }
}

const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(
  /\/$/,
  '',
);
const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;

// --- args -------------------------------------------------------------------
function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const CONTAINER = arg('container', process.env.OPTIMIZELY_SEED_CONTAINER || '43f936c99b234ea397b261c538ad07c9');
const KEY = arg('key', 'a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1');
const ROUTE = arg('route', 'cibc-hero-atomic');

// --- REST helpers -----------------------------------------------------------
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

async function api(token, method, path, body) {
  const res = await fetch(`${GATEWAY}/v1${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    json = text;
  }
  return { ok: res.ok, status: res.status, json };
}

// --- composition builders ---------------------------------------------------
// A V1Text element (component node), styled by the V1TextDefault template.
const text = (displayName, settings, value) => ({
  id: randomUUID(),
  displayName,
  nodeType: 'component',
  displaySettings: { displayTemplate: 'V1TextDefault', settings },
  component: { contentType: 'V1Text', properties: { Text: { value } } },
});

// A V1Button element, styled by the V1ButtonDefault template.
const button = (displayName, settings, link) => ({
  id: randomUUID(),
  displayName,
  nodeType: 'component',
  displaySettings: { displayTemplate: 'V1ButtonDefault', settings },
  component: { contentType: 'V1Button', properties: { Link: { value: link } } },
});

// A structural column (holds components), styled by V1ColumnDefault.
const column = (displayName, settings, nodes) => ({
  id: randomUUID(),
  displayName,
  nodeType: 'column',
  layoutType: 'grid',
  displaySettings: { displayTemplate: 'V1ColumnDefault', settings },
  nodes,
});

// A structural row (holds columns), styled by V1RowDefault.
const row = (displayName, settings, nodes) => ({
  id: randomUUID(),
  displayName,
  nodeType: 'row',
  layoutType: 'grid',
  displaySettings: { displayTemplate: 'V1RowDefault', settings },
  nodes,
});

function buildComposition() {
  // Copy block: eyebrow + serif headline + subtext, stacked in one full-width
  // column. Headline stays `default` tone (inherits the section's white text);
  // subtext uses `onDark` (white/70) to match CibcHero's muted subtext.
  const copyColumn = column('Copy', { columnSpan: 'full', contentGap: 'normal', contentAlignment: 'start' }, [
    text('Eyebrow', { variant: 'eyebrow', align: 'left' }, 'Digital Banking'),
    text('Headline', { variant: 'display', tone: 'default', align: 'left' }, 'Banking that puts you first'),
    text(
      'Subtext',
      { variant: 'body', tone: 'onDark', align: 'left' },
      'Manage your accounts, track spending and grow your savings — with AI-powered insights built for real life.',
    ),
  ]);

  const contentRow = row('Content Row', { columnGap: 'normal', verticalAlignment: 'top' }, [copyColumn]);

  // CTA block: two buttons side by side (a column each, in one row).
  const ctaRow = row('CTA Row', { columnGap: 'normal', verticalAlignment: 'center' }, [
    column('Primary CTA', { columnSpan: 'auto', contentAlignment: 'start' }, [
      button('Primary CTA', { variant: 'primary', size: 'lg' }, {
        url: 'https://www.capitalone.com/',
        text: 'Open an Account',
        title: 'Open an Account',
      }),
    ]),
    column('Secondary CTA', { columnSpan: 'auto', contentAlignment: 'start' }, [
      button('Secondary CTA', { variant: 'secondary', size: 'lg' }, {
        url: 'https://www.capitalone.com/',
        text: 'See All Products',
        title: 'See All Products',
      }),
    ]),
  ]);

  // The section shell reproduces CibcHero's navy gradient + corner chart motif.
  // Composition settings serialize as strings (checkbox → "true"/"false").
  const section = {
    id: randomUUID(),
    displayName: 'Hero Section',
    nodeType: 'section',
    layoutType: 'grid',
    displaySettings: {
      displayTemplate: 'V1SectionDefault',
      settings: { theme: 'dark', decoration: 'chart', padding: 'lg', contentWidth: 'lg', rounded: 'true' },
    },
    component: { contentType: 'V1Section' },
    nodes: [contentRow, ctaRow],
  };

  return {
    id: randomUUID(),
    displayName: 'CibcHero (Atomic Recreation)',
    nodeType: 'experience',
    layoutType: 'outline',
    nodes: [section],
  };
}

// --- main -------------------------------------------------------------------
async function main() {
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET (set in .env).');
  }

  const token = await getToken();
  const composition = buildComposition();
  const version = {
    locale: LOCALE,
    displayName: 'CibcHero (Atomic Recreation)',
    routeSegment: ROUTE,
    composition,
  };

  // Create the content item (fixed key for idempotency). If it already exists,
  // add a new version instead.
  let created = await api(token, 'POST', '/content', {
    key: KEY,
    contentType: 'ExperiencePage',
    container: CONTAINER,
    initialVersion: version,
  });

  if (!created.ok && created.status === 409) {
    console.log(`[seed:hero] ${KEY} exists — creating a new version`);
    created = await api(token, 'POST', `/content/${KEY}/versions`, version);
  }
  if (!created.ok) {
    throw new Error(`Create failed: ${created.status} ${JSON.stringify(created.json)}`);
  }

  const key = created.json?.key ?? KEY;
  // POST /content returns the content item (no version); the new-version endpoint
  // returns the version. Resolve the latest version either way.
  let ver = created.json?.version;
  if (!ver) {
    const versions = await api(token, 'GET', `/content/${key}/versions`);
    const items = versions.json?.items ?? [];
    ver = items.sort((a, b) => Number(b.version) - Number(a.version))[0]?.version;
  }
  if (!ver) throw new Error('Could not resolve created version');
  console.log(`[seed:hero] created content ${key} version ${ver}`);

  // Publish.
  const pub = await api(token, 'POST', `/content/${key}/versions/${ver}:publish`, {});
  if (!pub.ok) {
    throw new Error(`Publish failed: ${pub.status} ${JSON.stringify(pub.json)}`);
  }
  console.log(`[seed:hero] published ${key} → status ${pub.json?.status ?? 'published'}`);
  console.log(`[seed:hero] view at:  /${ROUTE}/   (locale ${LOCALE})`);
}

main().catch((err) => {
  console.error(`[seed:hero] ${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
});
