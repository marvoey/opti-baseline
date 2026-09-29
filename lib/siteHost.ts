import { headers } from 'next/headers';

/** Matches a loopback `Host` header (with or without a port). */
const LOCALHOST_RE = /^(localhost|127\.0\.0\.1)(:|$)/;

/**
 * Canonical site origin used to scope Optimizely Graph lookups by hostname
 * (`_metadata.url.base`). Optimizely indexes each site's content under its own
 * base, so multiple sites can share a path like "/" — passing the right host
 * disambiguates them.
 *
 * Derived from the incoming request so the app always scopes to the host it's
 * actually being served on (the real domain in prod). Locally the request host
 * is always a loopback address (e.g. http://localhost:3010), which never
 * matches the base the content was actually indexed under — so on a loopback
 * host this falls back to the `BASE_URL` env var (the real site origin)
 * instead. Shared by the content route and the site chrome so page content and
 * global navigation always resolve to the SAME site.
 */
export async function siteOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = h.get('host');
  if (!host) return undefined;

  if (LOCALHOST_RE.test(host)) {
    const base = process.env.BASE_URL?.trim().replace(/\/$/, '');
    if (base) return base;
  }

  // x-forwarded-proto wins behind a proxy; locally there's none, so default http
  // for loopback hosts and https everywhere else.
  const proto = h.get('x-forwarded-proto') ?? (LOCALHOST_RE.test(host) ? 'http' : 'https');
  return `${proto}://${host}`;
}
