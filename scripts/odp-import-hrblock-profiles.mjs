#!/usr/bin/env node
/**
 * import-hrblock-profiles.mjs
 *
 * Imports synthetic customer profiles into Optimizely Data Platform (ODP),
 * where every profile is DERIVED FROM site events for https://hrblock.optimoey.com/
 *
 * Events modelled on the site (found in the page markup via `data-event-key`):
 *   - appointment_cta_click  "Work with a pro"          (home page, /)
 *   - diy_start_click        "Keep filing on my own"    (home page, /)
 *   - pageviews of: /, /still-time-to-file, /file-online, /tax-pro, /offices, /tax-center
 *
 * What the script does
 *   1. builds N profiles + their events in memory, then DERIVES each profile's attributes
 *      from its events (click counts, pages viewed, last event, filing preference)
 *   2. POSTs profiles to  /v3/profiles  (batches, array body, identifier = email)
 *   3. POSTs the events to /v3/events   (unless --profiles-only)
 *
 * Requirements: Node.js 22+ (built-in fetch and process.loadEnvFile). No npm packages.
 *
 * Config (ODP_PRIVATE_API_KEY, ODP_REGION, ODP_BASE_URL) comes from .env, see odp-client.mjs.
 * The hrb_* custom fields must exist first: run scripts/setup-hrblock-schema.mjs once.
 *
 * Usage:
 *   node scripts/import-hrblock-profiles.mjs --dry-run
 *   node scripts/import-hrblock-profiles.mjs --count 200
 *
 * Flags:
 *   --count <n>        number of profiles to create            (default 200)
 *   --days <n>         spread events over the last n days      (default 14)
 *   --seed <n>         seed for repeatable data                (default 42)
 *   --batch <n>        records per API request, max 500        (default 100)
 *   --profiles-only    skip sending events
 *   --dry-run          build data and print a sample; send nothing
 *   -h, --help         show this help
 *
 * Re-running with the same --seed/--count produces the SAME emails, so profiles are
 * updated (upserted), not duplicated. Events are not de-duplicated, so use
 * --profiles-only when you re-run.
 */

import { parseArgs } from 'node:util';
import { BASE_URL, odp, requireConfig, sleep, fail } from './odp-client.mjs';

// ---------------------------------------------------------------------------
// 1. CONFIG
// ---------------------------------------------------------------------------
const { values: args } = parseArgs({
  options: {
    count: { type: 'string', default: '200' },
    days: { type: 'string', default: '14' },
    seed: { type: 'string', default: '42' },
    batch: { type: 'string', default: '100' },
    'profiles-only': { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (args.help) {
  console.log('See the header comment of this file for usage.');
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(args.count, 10));
const DAYS = Math.max(1, parseInt(args.days, 10));
const SEED = parseInt(args.seed, 10);
const BATCH = Math.min(500, Math.max(1, parseInt(args.batch, 10))); // ODP: max 500 per request
const DRY_RUN = args['dry-run'];

if (!DRY_RUN) requireConfig();

// ---------------------------------------------------------------------------
// 2. SITE MODEL  (what happens on https://hrblock.optimoey.com/)
//    Edit this section if the site gets new events or pages.
// ---------------------------------------------------------------------------
const SITE_HOST = 'hrblock.optimoey.com';

const PAGES = {
  '/': 'H&R Block | Optimizely',
  '/still-time-to-file': 'Still time to file | Optimizely',
  '/file-online': 'File online | Optimizely',
  '/tax-pro': 'File with a tax pro | Optimizely',
  '/offices': 'Find an office | Optimizely',
  '/tax-center': 'Tax Center | Optimizely',
};

// Custom click events (data-event-key on the home page hero CTAs)
const EVENT_TYPE = 'hrblock';
const CLICK_EVENTS = {
  appointment_cta_click: { page: '/', label: 'Work with a pro' },
  diy_start_click: { page: '/', label: 'Keep filing on my own' },
};

// Visitor behaviour patterns used to generate realistic event streams.
// (The persona itself is NOT stored on the profile; attributes are derived from events.)
const PERSONAS = [
  { weight: 35, pages: ['/tax-pro', '/offices', '/still-time-to-file'], clicks: { appointment_cta_click: [1, 3], diy_start_click: [0, 0] } }, // wants a pro
  { weight: 35, pages: ['/file-online', '/still-time-to-file'], clicks: { appointment_cta_click: [0, 0], diy_start_click: [1, 3] } },           // wants DIY
  { weight: 20, pages: ['/file-online', '/tax-pro', '/tax-center'], clicks: { appointment_cta_click: [1, 2], diy_start_click: [1, 2] } },      // comparing
  { weight: 10, pages: ['/tax-center'], clicks: { appointment_cta_click: [0, 0], diy_start_click: [0, 0] } },                                  // researching
];

// Cities match the demo offices shown on the site
const LOCATIONS = [
  { city: 'Kansas City', state: 'MO', timezone: 'America/Chicago' },
  { city: 'Overland Park', state: 'KS', timezone: 'America/Chicago' },
  { city: 'Austin', state: 'TX', timezone: 'America/Chicago' },
];
const FIRST_NAMES = ['Ava', 'Liam', 'Maria', 'Noah', 'Sofia', 'Ethan', 'Isabella', 'Mason', 'Mia', 'Lucas', 'Amelia', 'Carlos', 'Priya', 'Jamal', 'Chen', 'Olivia', 'Diego', 'Hannah', 'Omar', 'Grace'];
const LAST_NAMES = ['Garcia', 'Johnson', 'Nguyen', 'Williams', 'Patel', 'Brown', 'Martinez', 'Davis', 'Kim', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Hernandez', 'Moore', 'Clark', 'Lewis', 'Walker', 'Young', 'Allen'];

// ---------------------------------------------------------------------------
// 3. DATA GENERATION
// ---------------------------------------------------------------------------
function mulberry32(a) {
  // small seeded PRNG so runs are repeatable
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = rand() * total;
  for (const i of items) { if ((r -= i.weight) < 0) return i; }
  return items[items.length - 1];
}

const NOW = Math.floor(Date.now() / 1000);
const RUN_ID = `hrb-import-${new Date().toISOString().slice(0, 10)}`;

/** Build the event stream for one visitor (1-2 sessions). Times are epoch seconds. */
function buildEvents(email, persona) {
  const events = [];
  const sessions = randInt(1, 2);
  const clickPlan = [];
  for (const [action, [min, max]] of Object.entries(persona.clicks)) {
    for (let i = 0, n = randInt(min, max); i < n; i++) clickPlan.push(action);
  }

  const sessionStarts = [];
  for (let s = 0; s < sessions; s++) sessionStarts.push(NOW - randInt(60, DAYS * 86400));
  sessionStarts.sort((a, b) => a - b);

  const homeTimes = []; // when each session hits "/"
  sessionStarts.forEach((start) => {
    let ts = start;
    const pages = ['/', ...persona.pages.filter(() => rand() < 0.7)];
    pages.forEach((page) => {
      events.push(pageviewEvent(email, page, ts));
      if (page === '/') homeTimes.push(ts);
      ts += randInt(15, 90);
    });
  });

  // Click events happen on the home page, shortly after landing on it
  clickPlan.forEach((action) => {
    const ts = Math.min(NOW, pick(homeTimes) + randInt(5, 40));
    events.push({
      type: EVENT_TYPE,
      action,
      identifiers: { email },
      data: { ts, hostname: SITE_HOST, page: CLICK_EVENTS[action].page, title: PAGES[CLICK_EVENTS[action].page], value: CLICK_EVENTS[action].label },
    });
  });

  return events.sort((a, b) => a.data.ts - b.data.ts);
}

function pageviewEvent(email, page, ts) {
  // `action` is set to "view" because the Upload events API lists action as required.
  return { type: 'pageview', action: 'view', identifiers: { email }, data: { ts, hostname: SITE_HOST, page, title: PAGES[page] } };
}

/** Derive profile attributes FROM the events (swap in your own events here if you have real ones). */
function deriveAttributes(events) {
  const count = (fn) => events.filter(fn).length;
  const appt = count((e) => e.type === EVENT_TYPE && e.action === 'appointment_cta_click');
  const diy = count((e) => e.type === EVENT_TYPE && e.action === 'diy_start_click');
  const views = count((e) => e.type === 'pageview');
  const lastClick = [...events].filter((e) => e.type === EVENT_TYPE).sort((a, b) => b.data.ts - a.data.ts)[0];

  let preference = 'researching';
  if (appt > diy) preference = 'tax_pro';
  else if (diy > appt) preference = 'diy';
  else if (appt > 0) preference = 'undecided';

  return {
    hrb_filing_preference: preference,
    hrb_appointment_cta_clicks: appt,
    hrb_diy_start_clicks: diy,
    hrb_pages_viewed: views,
    hrb_last_site_event: lastClick ? lastClick.action : 'pageview',
    hrb_import_batch: RUN_ID,
  };
}

function buildDataset() {
  const profiles = [];
  const allEvents = [];
  for (let i = 1; i <= COUNT; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const loc = pick(LOCATIONS);
    // example.com is a reserved domain: nothing here can reach a real person
    const email = `${first}.${last}.${String(i).padStart(4, '0')}@example.com`.toLowerCase();
    const events = buildEvents(email, pickWeighted(PERSONAS));
    profiles.push({
      attributes: {
        email, // identifier
        first_name: first,
        last_name: last,
        city: loc.city,
        state: loc.state,
        country: 'US',
        timezone: loc.timezone,
        ...deriveAttributes(events),
      },
    });
    allEvents.push(...events);
  }
  return { profiles, allEvents };
}

// ---------------------------------------------------------------------------
// 4. ODP API CLIENT
// ---------------------------------------------------------------------------
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

async function sendBatches(label, path, records) {
  const batches = chunk(records, BATCH);
  let sent = 0;
  for (const [i, batch] of batches.entries()) {
    try {
      await odp('POST', path, batch);
    } catch (e) {
      if (e.status === 400 && path === '/v3/profiles') {
        console.error('\nODP rejected the profiles. If the message mentions unknown fields, create the hrb_* fields first:');
        console.error('  run scripts/setup-hrblock-schema.mjs, or add them in ODP > Data Setup > Objects & Fields.\n');
      }
      throw e;
    }
    sent += batch.length;
    console.log(`  ${label}: batch ${i + 1}/${batches.length} accepted (${sent}/${records.length})`);
    await sleep(150); // be gentle with rate limits
  }
}

// ---------------------------------------------------------------------------
// 5. RUN
// ---------------------------------------------------------------------------
const { profiles, allEvents } = buildDataset();

const byPref = profiles.reduce((m, p) => ((m[p.attributes.hrb_filing_preference] = (m[p.attributes.hrb_filing_preference] ?? 0) + 1), m), {});
console.log(`Built ${profiles.length} profiles and ${allEvents.length} events for ${SITE_HOST}`);
console.log('Filing preference mix:', byPref);

if (DRY_RUN) {
  const sampleEmail = profiles[0].attributes.email;
  console.log('\n--- DRY RUN: nothing was sent ---');
  console.log('Sample profile:\n' + JSON.stringify(profiles[0], null, 2));
  console.log('\nSample events for that profile:\n' + JSON.stringify(allEvents.filter((e) => e.identifiers.email === sampleEmail), null, 2));
  process.exit(0);
}

console.log(`Target: ${BASE_URL}  (batch size ${BATCH})`);
try {
  console.log(`\n[1/2] Importing ${profiles.length} profiles -> POST /v3/profiles`);
  await sendBatches('profiles', '/v3/profiles', profiles);

  if (args['profiles-only']) {
    console.log('\n[2/2] Skipping events (--profiles-only)');
  } else {
    console.log(`\n[2/2] Sending ${allEvents.length} events -> POST /v3/events`);
    await sendBatches('events', '/v3/events', allEvents);
  }

  console.log('\nDone. ODP processes data asynchronously (HTTP 202), so allow a few minutes.');
  console.log('Find them in ODP: Customers > search for e.g.', profiles[0].attributes.email);
  console.log(`Or segment on: customer.hrb_import_batch = ${RUN_ID}`);
} catch (e) {
  fail(e.message);
}
