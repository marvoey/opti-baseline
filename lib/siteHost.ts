import { headers } from 'next/headers';

/**
 * Canonical site origin used to scope Optimizely Graph lookups by hostname
 * (`_metadata.url.base`). Optimizely indexes each site's content under its own
 * base, so multiple sites can share a path like "/" — passing the right host
 * disambiguates them.
 *
 * Derived from the incoming request so the app always scopes to the host it's
 * actually being served on (e.g. http://localhost:3010 in dev, the real domain
 * in prod). Shared by the content route and the site chrome so page content and
 * global navigation always resolve to the SAME site.
 */
export async function siteOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = h.get('host');
  if (!host) return undefined;
  // x-forwarded-proto wins behind a proxy; locally there's none, so default http
  // for loopback hosts and https everywhere else.
  const proto =
    h.get('x-forwarded-proto') ??
    (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? 'http' : 'https');
  return `${proto}://${host}`;
}
