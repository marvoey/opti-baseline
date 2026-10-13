/**
 * Multi-market audit. Reads the market registry (lib/markets.data.json — the
 * same data lib/markets.ts uses) and checks it against the CMS:
 *
 *   1. every market's `cmsLocales` is an enabled locale in the CMS (/v1/locales)
 *   2. every `defaultLocale` is one of that market's `cmsLocales`
 *   3. lists which domestic-only programs each market excludes (these CTAs are
 *      hidden by <SmartCta />)
 *
 * Exits non-zero if any CMS locale is missing, so it can gate a demo/CI run.
 *
 *   npm run cms:audit
 */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const DOMESTIC_ONLY = ['ups_store', 'roadie', 'happy_returns', 'virtual_consultation'];

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

async function fetchEnabledLocales(token) {
  const res = await fetch(`${GATEWAY}/v1/locales?pageSize=100`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Locales request failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : [];
  return new Set(items.filter((l) => l.isEnabled !== false).map((l) => l.key));
}

async function main() {
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    console.error('Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env.');
    process.exit(2);
  }

  const markets = JSON.parse(await readFile(join(ROOT, 'lib', 'markets.data.json'), 'utf8'));
  const enabled = await fetchEnabledLocales(await getToken());

  console.log(`UPS market audit: ${Object.keys(markets).length} markets, ${enabled.size} CMS locales enabled\n`);

  let issues = 0;
  for (const [code, m] of Object.entries(markets)) {
    console.log(`${m.countryName} (${code})  locales: ${m.cmsLocales.join(', ')}`);

    if (!m.cmsLocales.includes(m.defaultLocale)) {
      console.error(`  ERROR defaultLocale ${m.defaultLocale} is not in cmsLocales`);
      issues++;
    }
    for (const locale of m.cmsLocales) {
      if (!enabled.has(locale)) {
        console.error(`  MISSING locale ${locale} is not enabled in the CMS`);
        issues++;
      }
    }
    const excluded = DOMESTIC_ONLY.filter((s) => !m.services.includes(s));
    if (code !== 'US' && excluded.length) {
      console.log(`  info  CTAs hidden by SmartCta: ${excluded.join(', ')}`);
    }
  }

  if (issues) {
    console.error(`\nAudit finished with ${issues} issue(s).`);
    process.exit(1);
  }
  console.log('\nAudit passed: all market locales are enabled in the CMS.');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(2);
});
