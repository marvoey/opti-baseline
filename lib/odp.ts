/* Server-side Optimizely Data Platform client for the demo API routes (app/api/demo/odp/*).
   Uses the PRIVATE key from .env (ODP_PRIVATE_API_KEY, ODP_REGION, optional ODP_BASE_URL). Never import this
   from a client component. Every function throws on failure; the routes catch that and fall back to the
   mock data in lib/odpDemo.ts. Mirrors the host mapping in scripts/odp-client.mjs. */

import { type DemoEvent, type DemoEventKey, type DemoProfile, type Preference, isDemoEmail } from './odpDemo';

const HOSTS: Record<string, string> = {
  us1: 'https://api.us1.odp.optimizely.com',
  eu1: 'https://api.eu1.odp.optimizely.com',
  au1: 'https://api.au1.odp.optimizely.com',
};

function config() {
  const key = process.env.ODP_PRIVATE_API_KEY;
  const region = (process.env.ODP_REGION || 'us1').trim().toLowerCase();
  const base = (process.env.ODP_BASE_URL || HOSTS[region] || '').replace(/\/$/, '');
  return { key, base };
}

export const odpConfigured = () => {
  const { key, base } = config();
  return Boolean(key && base);
};

async function odpFetch(path: string, body: unknown): Promise<unknown> {
  const { key, base } = config();
  if (!key || !base) throw new Error('ODP is not configured');
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-key': key },
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`ODP ${path} -> HTTP ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

async function gql<T>(query: string): Promise<T> {
  const json = (await odpFetch('/v3/graphql', { query })) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`ODP GraphQL: ${json.errors[0].message}`);
  if (!json.data) throw new Error('ODP GraphQL: empty response');
  return json.data;
}

/* ----------------------------- event upload ----------------------------- */
/** One event as accepted by POST /v3/events (same shape the import script sends). */
export type OdpEvent = {
  type: string;
  action: string;
  identifiers: Record<string, string>;
  data: Record<string, unknown>;
};

/** Sending site events to ODP (page views, clicks, A/B test and personalization exposures) is on whenever the ODP
 *  key is set. ODP_EVENTS_ENABLED=false is the kill switch, for example for local development. */
export const odpEventsEnabled = () => process.env.ODP_EVENTS_ENABLED !== 'false';
/** With ODP_EVENTS_DRY_RUN=true the events are logged instead of sent, to check the payloads first. */
export const odpEventsDryRun = () => process.env.ODP_EVENTS_DRY_RUN === 'true';

/** Sends a batch of events in one request. Throws on failure; callers decide whether that matters. */
export async function postOdpEvents(events: OdpEvent[]): Promise<void> {
  if (!events.length) return;
  if (odpEventsDryRun()) {
    console.log('[odp] dry run, not sent:', JSON.stringify(events));
    return;
  }
  await odpFetch('/v3/events', events);
}

/* ----------------------------- mapping ----------------------------- */
type Node = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);

const PROFILE_FIELDS = 'email first_name last_name city state hrb_filing_preference hrb_appointment_cta_clicks hrb_diy_start_clicks hrb_pages_viewed hrb_last_site_event';

function toProfile(n: Node): DemoProfile {
  return {
    email: str(n.email),
    firstName: str(n.first_name),
    lastName: str(n.last_name),
    city: str(n.city),
    state: str(n.state),
    preference: (str(n.hrb_filing_preference) || 'researching') as Preference,
    apptClicks: num(n.hrb_appointment_cta_clicks),
    diyClicks: num(n.hrb_diy_start_clicks),
    pagesViewed: num(n.hrb_pages_viewed),
    lastEvent: str(n.hrb_last_site_event),
  };
}

/** ODP returns ts as epoch seconds, epoch milliseconds or an ISO string depending on the field; normalise to seconds. */
function toEpochSeconds(v: unknown): number {
  if (typeof v === 'number') return v > 1e12 ? Math.floor(v / 1000) : Math.floor(v);
  if (typeof v === 'string') {
    if (/^\d+(\.\d+)?$/.test(v)) return toEpochSeconds(Number(v));
    const t = Date.parse(v);
    if (!Number.isNaN(t)) return Math.floor(t / 1000);
  }
  return 0;
}

function toEvent(n: Node): DemoEvent {
  return { type: str(n.event_type), action: str(n.action), ts: toEpochSeconds(n.ts), page: str(n.page), title: str(n.title) };
}

/* ----------------------------- queries ----------------------------- */
const PAGE_SIZE = 100;
const MAX_PAGES = 5; // demo dataset is ~200 profiles; stop runaway paging on a big tenant

type CustomersData = { customers: { edges: { node: Node }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } };

/** Profiles whose hrb_filing_preference equals `pref` (a fixed enum value, so safe to inline in the filter). */
async function profilesWithPreference(pref: Preference): Promise<DemoProfile[]> {
  const out: DemoProfile[] = [];
  let after: string | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const afterArg: string = after ? `, after: ${JSON.stringify(after)}` : '';
    const data: CustomersData = await gql<CustomersData>(
      `{ customers(first: ${PAGE_SIZE}${afterArg}, filter: "hrb_filing_preference = '${pref}'") { pageInfo { hasNextPage endCursor } edges { node { ${PROFILE_FIELDS} } } } }`,
    );
    out.push(...data.customers.edges.map((e) => toProfile(e.node)));
    if (!data.customers.pageInfo.hasNextPage || !data.customers.pageInfo.endCursor) break;
    after = data.customers.pageInfo.endCursor;
  }
  return out;
}

/** Imported demo profiles for a preference (or all four). Throws if none exist yet, so the caller falls back to mock. */
export async function liveMembers(pref: Preference | 'all', all: Preference[]): Promise<DemoProfile[]> {
  const prefs = pref === 'all' ? all : [pref];
  const lists = await Promise.all(prefs.map(profilesWithPreference));
  const members = lists.flat().filter((p) => isDemoEmail(p.email));
  if (members.length === 0) {
    // An empty group is only legitimate if the demo data has been imported at all; otherwise fall back to mock.
    const anyImported = pref === 'all' ? [] : (await Promise.all(all.map(profilesWithPreference))).flat().filter((p) => isDemoEmail(p.email));
    if (anyImported.length === 0) throw new Error('No imported demo profiles found in ODP (run scripts/odp-import-hrblock-profiles.mjs)');
  }
  return members;
}

export async function liveProfile(email: string): Promise<{ profile: DemoProfile; events: DemoEvent[] } | null> {
  if (!isDemoEmail(email)) throw new Error('Not a demo email');
  type Data = { customers: { edges: { node: Node & { events?: { edges: { node: Node }[] } } }[] } };
  const data = await gql<Data>(
    `{ customers(first: 1, filter: "email = '${email}'") { edges { node { ${PROFILE_FIELDS} events(first: 100) { edges { node { event_type action ts page title } } } } } } }`,
  );
  const node = data.customers.edges[0]?.node;
  if (!node) return null;
  const events = (node.events?.edges ?? []).map((e) => toEvent(e.node)).sort((a, b) => a.ts - b.ts);
  return { profile: toProfile(node), events };
}

const EVENT_META: Record<DemoEventKey, string> = {
  appointment_cta_click: 'Work with a pro',
  diy_start_click: 'Keep filing on my own',
};

/** Sends one click event for a demo profile, shaped like the ones the import script and the site produce. */
export async function sendDemoEvent(email: string, eventKey: DemoEventKey): Promise<void> {
  if (!isDemoEmail(email)) throw new Error('Not a demo email');
  await odpFetch('/v3/events', [
    {
      type: 'hrblock',
      action: eventKey,
      identifiers: { email },
      data: {
        ts: Math.floor(Date.now() / 1000),
        hostname: 'hrblock.optimoey.com',
        page: '/',
        title: 'H&R Block | Optimizely',
        value: EVENT_META[eventKey],
      },
    },
  ]);
}
