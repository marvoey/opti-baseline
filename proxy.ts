import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_SEGMENTS } from '@/lib/locales';
import { AGENT_HEADER, agentKeyFromPath, isAgentKey } from '@/lib/agent/personas';
import { LM_MODE_HEADER, modeAllowed, parseMode } from '@/lib/mockLm';

/**
 * Next.js 16 Proxy (the replacement for Middleware) — locale clean-URLs for the
 * Optimizely CMS routes.
 *
 * Optimizely Graph resolves content by a locale-prefixed path (e.g. /en/vb-demo/).
 * We want clean public URLs (/vb-demo) but still route internally to
 * app/[locale]/[[...slug]] so the [locale] param is populated and Graph queries
 * stay consistent.
 *
 * Routing only — NO data fetching here (Next docs explicitly discourage it).
 *
 * CMS-first routing: every path flows to the CMS catch-all. Adding a new CMS
 * page therefore needs no change here.
 */

const DEFAULT_LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
// Route segments of the non-default locales enabled in the CMS, sourced from
// lib/locales.generated.ts (refreshed by `npm run gen:locales`). The default
// locale serves clean URLs, so it has no segment here.
const KNOWN_LOCALE_SEGMENTS = LOCALE_SEGMENTS;

function firstSegment(pathname: string): string {
  return pathname.split('/')[1] ?? '';
}

/**
 * Request headers forwarded to the page. Used for the portal's `?agent=dana`
 * override and for the per-agent dashboards (/agent/dana): this request only,
 * never stored; lib/agent/getAgent.ts reads it. `?agent=` wins over the path.
 * Any `x-agent` header the client sent itself is dropped first, and only one of
 * the four known agent keys is ever passed on.
 */
function forwardedHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);
  headers.delete(AGENT_HEADER);
  const fromQuery = request.nextUrl.searchParams.get('agent');
  const agent = isAgentKey(fromQuery) ? fromQuery : agentKeyFromPath(request.nextUrl.pathname);
  if (agent) headers.set(AGENT_HEADER, agent);

  // Rehearsal switch for the mock LM API (?mode=empty|error|slow), same rules:
  // a client-sent header is dropped, only a known mode is passed on, and never on Production.
  headers.delete(LM_MODE_HEADER);
  const mode = parseMode(request.nextUrl.searchParams.get('mode'));
  if (mode && modeAllowed()) headers.set(LM_MODE_HEADER, mode);
  return headers;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const seg = firstSegment(pathname);
  const forwarded = { request: { headers: forwardedHeaders(request) } };

  // Default-locale prefix is visible → redirect to the clean path (canonical/SEO).
  //   /en/vb-demo → /vb-demo
  if (seg === DEFAULT_LOCALE) {
    const stripped =
      pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`), '') || '/';
    return NextResponse.redirect(new URL(stripped + search, request.url));
  }

  // A non-default known locale is already present → leave it; [locale] is populated.
  if (KNOWN_LOCALE_SEGMENTS.includes(seg)) {
    return NextResponse.next(forwarded);
  }

  // Clean CMS path with no locale → rewrite into the default locale so [locale] is set.
  //   /vb-demo → /en/vb-demo
  const rewritten = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(new URL(rewritten + search, request.url), forwarded);
}

export const config = {
  // Run on everything EXCEPT API, Next internals, the preview/admin/styleguide
  // routes, and any path containing a dot (static assets like /logo.svg). The
  // preview, admin and styleguide routes live outside [locale] and must not be
  // rewritten into a locale.
  matcher: ['/((?!api|_next/static|_next/image|preview|admin|styleguide|applications|demo|favicon.ico|.*\\..*).*)'],
};
