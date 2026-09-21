import { headers } from 'next/headers';

// Matches "localhost" or "127.0.0.1", with or without a trailing ":<port>".
const LOCALHOST_HOST = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

/**
 * Canonical site origin used to scope Optimizely Graph lookups by hostname
 * (`_metadata.url.base`). Optimizely indexes each site's content under its own
 * base, so multiple sites can share a path like "/" — passing the right host
 * disambiguates them.
 *
 * Derived from the incoming request so the app always scopes to the host it's
 * actually being served on. Content is indexed under the real deployed domain,
 * not "localhost" — so in local dev (where the request host is always
 * localhost/127.0.0.1) we scope to DEPLOYED_URL instead, so dev can resolve the
 * same content as production. Shared by the content route and the site chrome
 * so page content and global navigation always resolve to the SAME site.
 */
export async function siteOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = h.get('host');
  if (!host) return undefined;

  const isLocalhost = LOCALHOST_HOST.test(host);
  if (isLocalhost) {
    const deployedUrl = process.env.DEPLOYED_URL;
    if (deployedUrl) return deployedUrl;
  }

  // x-forwarded-proto wins behind a proxy; locally there's none, so default http
  // for loopback hosts and https everywhere else.
  const proto = h.get('x-forwarded-proto') ?? (isLocalhost ? 'http' : 'https');
  return `${proto}://${host}`;
}
