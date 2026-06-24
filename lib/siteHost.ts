import { headers } from 'next/headers';

/**
 * Canonical site origin used to scope Optimizely Graph lookups by hostname
 * (`_metadata.url.base`). Optimizely indexes each site's content under its own
 * base, so multiple sites can share a path like "/" — passing the right host
 * disambiguates them.
 *
 * Prefer a pinned env (`OPTIMIZELY_SITE_BASE_URL`), which MUST equal the site's
 * configured CMS hostname; otherwise derive from the request. Shared by the
 * content route and the site chrome so page content and global navigation always
 * resolve to the SAME site.
 */
export async function siteOrigin(): Promise<string | undefined> {
  const pinned = process.env.OPTIMIZELY_SITE_BASE_URL?.replace(/\/$/, '');
  if (pinned) return pinned;

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
