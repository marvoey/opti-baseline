import { headers } from 'next/headers';

// Matches "localhost" or "127.0.0.1", with or without a trailing ":<port>".
const LOCALHOST_HOST = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

/**
 * True when the request host is a local-dev host: localhost / 127.0.0.1, or any
 * hostname listed in the comma-separated DEV_HOSTS env var (e.g. an ngrok tunnel
 * such as "opticoder.ngrok.app"). Dev hosts aren't known to the CMS, so Graph
 * lookups for them are scoped to DEPLOYED_URL instead. Ports are ignored.
 */
function isDevHost(host: string): boolean {
  if (LOCALHOST_HOST.test(host)) return true;
  const hostname = host.replace(/:\d+$/, '').toLowerCase();
  return (process.env.DEV_HOSTS ?? '')
    .split(',')
    .some((h) => h.trim().toLowerCase() === hostname);
}

/**
 * Canonical site origin used to scope Optimizely Graph lookups by hostname
 * (`_metadata.url.base`). Optimizely indexes each site's content under its own
 * base, so multiple sites can share a path like "/" — passing the right host
 * disambiguates them.
 *
 * Derived from the incoming request so the app always scopes to the host it's
 * actually being served on. Content is indexed under the real deployed domain,
 * not "localhost" — so in local dev (where the request host is localhost,
 * 127.0.0.1 or a tunnel listed in DEV_HOSTS) we scope to DEPLOYED_URL instead, so
 * dev can resolve the same content as production. Shared by the content route and the site chrome
 * so page content and global navigation always resolve to the SAME site.
 */
export async function siteOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = h.get('host');
  if (!host) return undefined;

  const isLocalhost = isDevHost(host);
  if (isLocalhost) {
    const deployedUrl = process.env.DEPLOYED_URL;
    if (deployedUrl) return deployedUrl;
  }

  // x-forwarded-proto wins behind a proxy; locally there's none, so default http
  // for loopback hosts and https everywhere else.
  const proto = h.get('x-forwarded-proto') ?? (isLocalhost ? 'http' : 'https');
  return `${proto}://${host}`;
}

/**
 * Origin of the current request, as the browser or crawler addressed it.
 *
 * Unlike siteOrigin() this never swaps localhost for DEPLOYED_URL (that swap only
 * exists to scope Graph lookups). Use it for URLs that must point back at the host
 * actually serving the page: `metadataBase`, and with it the default og:image.
 */
export async function requestOrigin(): Promise<URL | undefined> {
  const h = await headers();
  const host = h.get('host');
  if (!host) return undefined;

  const proto = h.get('x-forwarded-proto') ?? (LOCALHOST_HOST.test(host) ? 'http' : 'https');
  try {
    return new URL(`${proto}://${host}`);
  } catch {
    return undefined;
  }
}
