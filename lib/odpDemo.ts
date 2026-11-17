/* Types, constants and MOCK data for the ODP demo (app/demo/odp-prototype).
   Pure data: no server dependencies, so both the API routes (lib/odp.ts) and the client can import it.
   The mock mirrors what scripts/odp-import-hrblock-profiles.mjs writes, so the demo looks the same
   whether it is reading the real ODP tenant or falling back to this. All people are synthetic. */

export type Preference = 'tax_pro' | 'diy' | 'undecided' | 'researching';
export const PREFERENCES: Preference[] = ['tax_pro', 'diy', 'undecided', 'researching'];

/* Only these may be written through /api/demo/odp/event (same keys as the site's data-event-key buttons). */
export const DEMO_EVENT_KEYS = ['appointment_cta_click', 'diy_start_click'] as const;
export type DemoEventKey = (typeof DEMO_EVENT_KEYS)[number];

/* The import script only creates profiles on this reserved domain. */
export const DEMO_EMAIL_DOMAIN = '@example.com';
export const isDemoEmail = (v: unknown): v is string =>
  typeof v === 'string' && v.length <= 120 && /^[a-z0-9._-]+@example\.com$/.test(v);

export type DemoProfile = {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  preference: Preference;
  apptClicks: number;
  diyClicks: number;
  pagesViewed: number;
  lastEvent: string;
};

export type DemoEvent = {
  type: string;   // 'pageview' | 'hrblock'
  action: string; // 'view' | 'appointment_cta_click' | 'diy_start_click'
  ts: number;     // epoch seconds
  page: string;
  title: string;
};

export type Source = 'live' | 'mock';

/* ----------------------------- mock data ----------------------------- */
const P = (email: string, firstName: string, lastName: string, city: string, state: string, preference: Preference, apptClicks: number, diyClicks: number, pagesViewed: number): DemoProfile => ({
  email, firstName, lastName, city, state, preference, apptClicks, diyClicks, pagesViewed,
  lastEvent: apptClicks + diyClicks > 0 ? (preference === 'diy' ? 'diy_start_click' : 'appointment_cta_click') : 'pageview',
});

export const MOCK_PROFILES: DemoProfile[] = [
  P('maria.garcia.0001@example.com', 'Maria', 'Garcia', 'Kansas City', 'MO', 'tax_pro', 2, 0, 5),
  P('liam.nguyen.0002@example.com', 'Liam', 'Nguyen', 'Austin', 'TX', 'diy', 0, 2, 4),
  P('priya.patel.0003@example.com', 'Priya', 'Patel', 'Overland Park', 'KS', 'diy', 0, 1, 3),
  P('noah.williams.0004@example.com', 'Noah', 'Williams', 'Kansas City', 'MO', 'undecided', 1, 1, 6),
  P('sofia.lopez.0005@example.com', 'Sofia', 'Lopez', 'Austin', 'TX', 'researching', 0, 0, 2),
  P('ethan.kim.0006@example.com', 'Ethan', 'Kim', 'Overland Park', 'KS', 'diy', 0, 3, 5),
  P('grace.moore.0007@example.com', 'Grace', 'Moore', 'Kansas City', 'MO', 'tax_pro', 3, 0, 7),
  P('omar.davis.0008@example.com', 'Omar', 'Davis', 'Austin', 'TX', 'diy', 0, 1, 3),
  P('hannah.clark.0009@example.com', 'Hannah', 'Clark', 'Kansas City', 'MO', 'tax_pro', 1, 0, 4),
  P('diego.martinez.0010@example.com', 'Diego', 'Martinez', 'Overland Park', 'KS', 'undecided', 2, 2, 6),
  P('amelia.young.0011@example.com', 'Amelia', 'Young', 'Austin', 'TX', 'researching', 0, 0, 1),
  P('jamal.brown.0012@example.com', 'Jamal', 'Brown', 'Kansas City', 'MO', 'diy', 0, 2, 4),
];

const PAGE_TITLES: Record<string, string> = {
  '/': 'H&R Block | Optimizely',
  '/still-time-to-file': 'Still time to file | Optimizely',
  '/file-online': 'File online | Optimizely',
  '/tax-pro': 'File with a tax pro | Optimizely',
  '/offices': 'Find an office | Optimizely',
  '/tax-center': 'Tax Center | Optimizely',
};
const PAGE_ORDER = ['/', '/tax-pro', '/file-online', '/still-time-to-file', '/offices', '/tax-center', '/'];

/* Deterministic event stream for a mock profile: counts match the profile's attributes. */
export function mockEvents(p: DemoProfile, now = Math.floor(Date.now() / 1000)): DemoEvent[] {
  const events: DemoEvent[] = [];
  let ts = now - 3 * 86400 - p.pagesViewed * 70;
  for (let i = 0; i < p.pagesViewed; i++) {
    const page = PAGE_ORDER[i % PAGE_ORDER.length];
    events.push({ type: 'pageview', action: 'view', ts, page, title: PAGE_TITLES[page] });
    ts += 45;
    if (i === 0) {
      for (let a = 0; a < p.apptClicks; a++) { events.push({ type: 'hrblock', action: 'appointment_cta_click', ts: ts + a * 7, page: '/', title: PAGE_TITLES['/'] }); }
      for (let d = 0; d < p.diyClicks; d++) { events.push({ type: 'hrblock', action: 'diy_start_click', ts: ts + 20 + d * 7, page: '/', title: PAGE_TITLES['/'] }); }
    }
  }
  return events.sort((a, b) => a.ts - b.ts);
}

export const mockMembers = (pref: Preference | 'all'): DemoProfile[] =>
  pref === 'all' ? MOCK_PROFILES : MOCK_PROFILES.filter((p) => p.preference === pref);

export const mockProfile = (email: string): DemoProfile | null => MOCK_PROFILES.find((p) => p.email === email) ?? null;

/* Human labels used by the audience screens. */
export const PREF_LABEL: Record<Preference, string> = {
  tax_pro: 'Wants a tax pro',
  diy: 'Wants to file on their own',
  undecided: 'Undecided',
  researching: 'Researching',
};
export const EVENT_LABEL: Record<string, string> = {
  view: 'Viewed page',
  appointment_cta_click: 'Clicked “Work with a pro”',
  diy_start_click: 'Clicked “Keep filing on my own”',
};
