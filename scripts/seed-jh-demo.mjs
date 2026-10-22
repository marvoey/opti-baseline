/**
 * Seed the Jackson Hewitt "Trojan Horse" demo experience into the CMS.
 *
 * Creates a BlankExperience (route /jackson-hewitt-<suffix>/) under the HOME_PAGE_CONTENT_ID
 * container (the home page's content key, set in .env), holding one section → row →
 * column per block (JhTaxIntentHero, JhTaxRuleAuditBlock), then publishes it.
 * Not idempotent: every run generates a fresh content key and creates a new experience.
 *
 * Prerequisite: content types pushed (`yarn cms:push`).
 *
 * Usage:
 *   node --env-file=.env scripts/seed-jh-demo.mjs [--dry] [--no-publish]
 */

import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const NO_PUBLISH = process.argv.includes('--no-publish');

if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* no .env, continue */ }
}

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
// The REST API only accepts content keys as 32 hex chars (no hyphens).
const HOME_PAGE_CONTENT_ID = process.env.HOME_PAGE_CONTENT_ID?.replace(/-/g, '');
// Fresh key every run (32 hex chars, no hyphens), so each run creates a new experience.
const KEY = randomUUID().replace(/-/g, '');
// Route segments must be unique under the container, so suffix with part of the key.
const ROUTE_SEGMENT = `jackson-hewitt-${KEY.slice(0, 6)}`;

// The API expects every property as { value } rather than a bare value.
const props = (obj) => Object.fromEntries(Object.entries(obj).map(([k, value]) => [k, { value }]));

// Mirrors the structure the CMS itself produces for a BlankExperience: a section
// (backed by BlankSection, grid layout) → row → column → component.
const element = (displayName, contentType, properties) => ({
  displayName: `${displayName} Section`,
  nodeType: 'section',
  layoutType: 'grid',
  displaySettings: {
    displayTemplate: 'BlankSectionDefault',
    settings: { background: 'white', padding: 'none', width: 'full' },
  },
  component: { contentType: 'BlankSection' },
  nodes: [
    {
      displayName: 'Row',
      nodeType: 'row',
      displaySettings: { displayTemplate: 'DefaultRow', settings: { columns: 'c1' } },
      nodes: [
        {
          displayName: 'Column',
          nodeType: 'column',
          displaySettings: { displayTemplate: 'DefaultColumn', settings: { weight: 'w4' } },
          nodes: [
            {
              displayName,
              nodeType: 'component',
              component: { contentType, properties: props(properties) },
            },
          ],
        },
      ],
    },
  ],
});

const payload = {
  key: KEY,
  contentType: 'BlankExperience',
  container: HOME_PAGE_CONTENT_ID,
  initialVersion: {
    locale: LOCALE,
    displayName: 'Jackson Hewitt Tax Home (2026)',
    routeSegment: ROUTE_SEGMENT,
    properties: props({
      MetaTitle: 'Jackson Hewitt | Maximum Refund Guaranteed',
      MetaDescription: 'File in-store, at Walmart, or online for $25 with Jackson Hewitt.',
    }),
    composition: {
      nodeType: 'experience',
      layoutType: 'outline',
      nodes: [
        element('Intent Hero', 'JhTaxIntentHero', {
          BadgeText: '2026 Tax Season Ready',
          Headline: 'Maximum Refund Guaranteed. In-Store or Online.',
          Subheadline: 'File with over 5,200 local Tax Pros, inside Walmart, or file yourself online for just $25.',
          CtaLabel: 'Find a Location Near You',
          WalmartHeadline: 'Expert Tax Prep Right Where You Shop. Walk In or Drop Off Today.',
          OnlineHeadline: 'File Your Taxes Online for One Flat $25 Fee. No Surprise Upsells.',
          AdvanceHeadline: 'Need Your Tax Refund Money Fast? Get Up to $4,000 Today.',
        }),
        element('Tax Rule Audit', 'JhTaxRuleAuditBlock', {
          Title: 'Key Tax Deductions, Credits and Filing Thresholds',
          Description: 'Structured CMS content blocks powering Jackson Hewitt calculators, landing pages, and FAQ hubs.',
        }),
      ],
    },
  },
};

async function api(token, method, path, body) {
  const res = await fetch(`${GATEWAY}/v1${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text ? JSON.parse(text) : null };
}

async function main() {
  if (DRY) {
    console.log('[seed-jh] DRY RUN — payload:\n' + JSON.stringify(payload, null, 2));
    return;
  }
  if (!HOME_PAGE_CONTENT_ID) {
    throw new Error('Missing HOME_PAGE_CONTENT_ID (set in .env) — the container for all seeded content.');
  }
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET (set in .env).');
  }

  const tokenRes = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Token request failed: ${tokenRes.status}`);
  const { access_token: token } = await tokenRes.json();

  const created = await api(token, 'POST', '/content', payload);
  if (!created.ok) throw new Error(`Create failed (${created.status}): ${JSON.stringify(created.body)}`);
  console.log(`[seed-jh] Created experience ${KEY}.`);

  if (NO_PUBLISH) return;

  // The create response shape varies, so look up the version to publish instead:
  // the newest version for our locale that isn't already published.
  const versions = await api(token, 'GET', `/content/${KEY}/versions?locales=${LOCALE}&pageSize=50`);
  if (!versions.ok) throw new Error(`Version lookup failed (${versions.status}): ${JSON.stringify(versions.body)}`);
  const items = versions.body?.items ?? [];
  if (items.some((v) => v.status === 'published')) {
    console.log('[seed-jh] Already published — nothing to do.');
    return;
  }
  const draft = items.find((v) => v.status === 'draft' || v.status === 'ready') ?? items[0];
  if (!draft?.version) throw new Error(`No version found to publish: ${JSON.stringify(items)}`);

  const published = await api(token, 'POST', `/content/${KEY}/versions/${draft.version}:publish`, {});
  if (!published.ok) throw new Error(`Publish failed (${published.status}): ${JSON.stringify(published.body)}`);
  console.log(`[seed-jh] Published. Visit /${ROUTE_SEGMENT}/ once Graph has indexed it.`);
}

main().catch((err) => {
  console.error(`[seed-jh] ${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
});
