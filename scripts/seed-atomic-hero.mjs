// Seeds a sample "atomic hero" Experience built entirely from the V1 design
// system (V1Section → row → column → V1Text/V1Button atoms), then publishes it.
//
// Proves the atoms can recreate cms/CibcHero.tsx in high fidelity via
// composition + display templates instead of a monolithic content type.
//
// Auth + endpoints mirror the cms-cli REST client: OAuth client-credentials →
// `POST {gateway}/oauth/token`, then the CMS content API. Node shapes were
// derived from a real composition in this instance (component nodes carry
// `displaySettings: { displayTemplate, settings }` and
// `component: { contentType, properties: { Field: { value } } }`; link values
// serialize as `{ url, text, title }`).
//
// Usage:
//   node scripts/seed-atomic-hero.mjs [--container <key>] [--key <key>]
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
const ROUTE = arg('route', 'v1-atomic-hero');

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
const text = (displayName, settings, value) => ({
  id: randomUUID(),
  displayName,
  nodeType: 'component',
  displaySettings: { displayTemplate: 'V1TextDefault', settings },
  component: { contentType: 'V1Text', properties: { Text: { value } } },
});

const button = (displayName, settings, link) => ({
  id: randomUUID(),
  displayName,
  nodeType: 'component',
  displaySettings: { displayTemplate: 'V1ButtonDefault', settings },
  component: { contentType: 'V1Button', properties: { Link: { value: link } } },
});

function buildComposition() {
  const column = {
    id: randomUUID(),
    displayName: 'Column',
    nodeType: 'column',
    layoutType: 'grid',
    displaySettings: { displayTemplate: 'V1ColumnDefault', settings: { gap: 'md', align: 'start' } },
    nodes: [
      text('Eyebrow', { variant: 'eyebrow', tone: 'gold', align: 'left' }, 'Institutional banking'),
      text('Headline', { variant: 'display', tone: 'default', align: 'left' }, 'Confident financial futures, engineered.'),
      text('Subtext', { variant: 'body', tone: 'onDark', align: 'left' }, 'We help institutions safeguard and grow assets with the precision and trust CIBC Mellon is known for.'),
      // CTAs live in their own row so they sit side-by-side.
    ],
  };

  const ctaRow = {
    id: randomUUID(),
    displayName: 'CTA Row',
    nodeType: 'row',
    layoutType: 'grid',
    displaySettings: { displayTemplate: 'V1RowDefault', settings: { gap: 'md', align: 'center', justify: 'start' } },
    nodes: [
      {
        id: randomUUID(),
        displayName: 'CTA Column',
        nodeType: 'column',
        layoutType: 'grid',
        displaySettings: { displayTemplate: 'V1ColumnDefault', settings: { gap: 'md', align: 'start' } },
        nodes: [
          button('Primary CTA', { variant: 'primary', size: 'lg' }, { url: 'https://www.cibcmellon.com/', text: 'Open an account', title: 'Open an account' }),
        ],
      },
      {
        id: randomUUID(),
        displayName: 'CTA Column 2',
        nodeType: 'column',
        layoutType: 'grid',
        displaySettings: { displayTemplate: 'V1ColumnDefault', settings: { gap: 'md', align: 'start' } },
        nodes: [
          button('Secondary CTA', { variant: 'secondary', size: 'lg' }, { url: 'https://www.cibcmellon.com/en/about-us.html', text: 'Learn more', title: 'Learn more' }),
        ],
      },
    ],
  };

  const contentRow = {
    id: randomUUID(),
    displayName: 'Content Row',
    nodeType: 'row',
    layoutType: 'grid',
    displaySettings: { displayTemplate: 'V1RowDefault', settings: { gap: 'md', align: 'start', justify: 'start' } },
    nodes: [column],
  };

  const section = {
    id: randomUUID(),
    displayName: 'V1 Hero Section',
    nodeType: 'section',
    layoutType: 'grid',
    displaySettings: {
      displayTemplate: 'V1SectionDefault',
      // Composition settings are serialized as strings (checkbox → "true"/"false").
      settings: { theme: 'dark', decoration: 'chart', padding: 'lg', rounded: 'true' },
    },
    component: { contentType: 'V1Section' },
    nodes: [contentRow, ctaRow],
  };

  return {
    id: randomUUID(),
    displayName: 'V1 Atomic Hero',
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
    displayName: 'V1 Atomic Hero',
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
