/* Sends what visitors do on the site to Optimizely Data Platform (ODP), server-side:
     - page views                        pageview / view
     - clicks on data-event-key elements hrblock / <event key>
     - A/B test shown (hero test)        hrblock / ab_test_shown          value = variation shown
     - personalization shown             hrblock / personalization_shown  value = variation shown
     - newsletter signup                 hrblock / newsletter_signup      identifiers = email + vuid (stitches)
   Same event model as scripts/odp-import-hrblock-profiles.mjs, so live and seeded data line up.

   On whenever ODP_PRIVATE_API_KEY is set; ODP_EVENTS_ENABLED=false turns it off. ODP_EVENTS_DRY_RUN=true logs
   the events instead of sending them. Events go out through after(), so they never delay a page or a click,
   and a failure is logged and dropped: tracking must never break the site.

   The visitor is identified by the first-party cookie proxy.ts sets (hrb_vid), sent as the ODP `vuid`.
   Visitors who send Sec-GPC / DNT, and obvious bots, are not tracked.

   One action per flag keeps this inside ODP's standard event fields (`value` carries the variation). When
   more than one A/B test runs, add custom event fields (for example an experiment key) in ODP first. */

import { after } from 'next/server';
import { odpConfigured, odpEventsDryRun, odpEventsEnabled, postOdpEvents, type OdpEvent } from './odp';

export const EVENT_TYPE = 'hrblock';
export const AB_TEST_SHOWN = 'ab_test_shown';
export const PERSONALIZATION_SHOWN = 'personalization_shown';
export const NEWSLETTER_SIGNUP = 'newsletter_signup';

/** Where something happened: who, on which host and page. */
export type Visit = { visitorId: string; hostname: string; page: string; title?: string };

/** What the visitor was actually shown for an experiment. Never set for the default (no experiment) content. */
export type Exposure = { source: 'personalization' | 'hero_test'; variation: string };

export function trackingEnabled(): boolean {
  return odpEventsEnabled() && (odpConfigured() || odpEventsDryRun());
}

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget/i;

/** The visitor sent Global Privacy Control or Do Not Track. */
export const hasPrivacySignal = (h: Pick<Headers, 'get'>) => h.get('sec-gpc') === '1' || h.get('dnt') === '1';

export const isBot = (h: Pick<Headers, 'get'>) => BOT.test(h.get('user-agent') ?? '');

/** Honors Global Privacy Control and Do Not Track, and skips obvious bots. */
export function trackingAllowed(h: Pick<Headers, 'get'>): boolean {
  return !hasPrivacySignal(h) && !isBot(h);
}

/** Host without the port, as ODP's hostname field expects (same as the import script's). */
export const hostnameOf = (h: Pick<Headers, 'get'>) => (h.get('host') ?? '').replace(/:\d+$/, '');

const event = (v: Visit, type: string, action: string, extra: Record<string, unknown> = {}): OdpEvent => ({
  type,
  action,
  identifiers: { vuid: v.visitorId },
  data: {
    ts: Math.floor(Date.now() / 1000),
    hostname: v.hostname,
    page: v.page,
    ...(v.title ? { title: v.title } : {}),
    ...extra,
  },
});

export const pageviewEvent = (v: Visit) => event(v, 'pageview', 'view');

/** `label` is the visible text of the clicked element, for example "Work with a pro". */
export const clickEvent = (v: Visit, eventKey: string, label?: string) =>
  event(v, EVENT_TYPE, eventKey, label ? { value: label } : {});

/**
 * The visitor gave their email (newsletter signup). The event carries BOTH identifiers: the email (high
 * confidence) and, when tracking is allowed, the site's visitor ID as `vuid`. That is what lets ODP stitch: the
 * anonymous profile built from this browser's earlier page views and clicks (same vuid) is merged into the
 * profile for the email, so one client counts once. Without a visitor ID (a Global Privacy Control / Do Not
 * Track signal, or a missing cookie) only the email is sent, so nothing is linked to the browsing history.
 */
export function signupEvent(v: { visitorId?: string; hostname: string; page: string; title?: string }, email: string): OdpEvent {
  return {
    type: EVENT_TYPE,
    action: NEWSLETTER_SIGNUP,
    identifiers: { email, ...(v.visitorId ? { vuid: v.visitorId } : {}) },
    data: {
      ts: Math.floor(Date.now() / 1000),
      hostname: v.hostname,
      page: v.page,
      ...(v.title ? { title: v.title } : {}),
      value: 'newsletter',
    },
  };
}

/** The A/B test and personalization exposures for what was shown on this page view (none if no experiment ran). */
export function exposureEvents(v: Visit, exposure: Exposure | undefined): OdpEvent[] {
  if (!exposure) return [];
  const action = exposure.source === 'personalization' ? PERSONALIZATION_SHOWN : AB_TEST_SHOWN;
  return [event(v, EVENT_TYPE, action, { value: exposure.variation })];
}

/** Reports one page view for a page that is not served by the CMS catch-all (which reports its own). Reads the
 *  visitor from the header proxy.ts sets; no-op without one (preview), when tracking is off, or when not allowed. */
export function trackPageView(h: Pick<Headers, 'get'>, page: string, title: string): void {
  const visitorId = h.get('x-hrb-visitor');
  if (!visitorId || !trackingAllowed(h)) return;
  queueOdpEvents([pageviewEvent({ visitorId, hostname: hostnameOf(h), page, title })]);
}

/** Sends the events after the response has gone out. No-op when tracking is off. Safe to call from a server
 *  component, generateMetadata or a route handler. Read request data (headers, cookies) before calling. */
export function queueOdpEvents(events: OdpEvent[]): void {
  if (!events.length || !trackingEnabled()) return;
  after(async () => {
    try {
      await postOdpEvents(events);
    } catch (err) {
      console.warn('[odp] could not send events:', err instanceof Error ? err.message : err);
    }
  });
}
