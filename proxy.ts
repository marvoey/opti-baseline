import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkBasicAuth } from '@/lib/basicAuth';
import { LOCALE_HEADER, LOCALE_SEGMENTS, stripLocale } from '@/lib/locales';
import { CHROME_HEADER, LANDING_CHROME, isLandingPath } from '@/lib/landing';
import {
  CAMPAIGN_COOKIE,
  CAMPAIGN_HEADER,
  CAMPAIGN_MAX_AGE_SECONDS,
  COOKIE_BASE,
  RESET_PARAM,
  VID_COOKIE,
  VID_HEADER,
  VID_MAX_AGE_SECONDS,
  parseCampaign,
  parseVid,
} from '@/lib/visitor';

/**
 * Next.js 16 Proxy (the replacement for Middleware) — locale clean-URLs for the
 * Optimizely CMS routes.
 *
 * Optimizely Graph resolves content by a locale-prefixed path (e.g. /en/vb-demo/).
 * We want clean public URLs (/vb-demo) but still route internally to
 * app/[locale]/[[...slug]] so the [locale] param is populated and Graph queries
 * stay consistent.
 *
 * Routing + visitor identity only — NO data fetching here (Next docs explicitly
 * discourage it). The identity part (anonymous visitor cookie + utm_campaign) is
 * what lets the page ask Feature Experimentation which CMS variation to render;
 * the decision itself happens in the page, see lib/fx.ts.
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

type Visitor = {
  id: string;
  campaign: string | null;
  /** Cookie writes this response must carry. */
  setId: boolean;
  setCampaign: boolean;
  clearCampaign: boolean;
};

/**
 * Anonymous visitor id + campaign attribution.
 *  - `?utm_campaign=aca|t65|…` is remembered in a cookie (last touch wins).
 *  - `?fx_reset=1` (demo helper) starts over: new visitor id, campaign cleared,
 *    so the 50/50 A/B test can be re-rolled by refreshing.
 */
function identify(request: NextRequest): Visitor {
  const params = request.nextUrl.searchParams;
  const reset = params.has(RESET_PARAM);

  const existingId = reset ? null : parseVid(request.cookies.get(VID_COOKIE)?.value);
  const id = existingId ?? crypto.randomUUID();

  const fromUrl = parseCampaign(params.get('utm_campaign'));
  const fromCookie = reset ? null : parseCampaign(request.cookies.get(CAMPAIGN_COOKIE)?.value);

  return {
    id,
    campaign: fromUrl ?? fromCookie,
    setId: !existingId,
    setCampaign: fromUrl !== null,
    clearCampaign: reset && fromUrl === null && request.cookies.has(CAMPAIGN_COOKIE),
  };
}

/**
 * Request headers the page reads. Always overwritten so a client can't spoof them.
 * CHROME_HEADER marks paid landing paths (/lp/...) so the layout renders the minimal chrome.
 * LOCALE_HEADER carries the locale key so the root layout can set <html lang> correctly.
 */
function forwardedHeaders(request: NextRequest, visitor: Visitor): Headers {
  const headers = new Headers(request.headers);
  headers.set(VID_HEADER, visitor.id);
  headers.set(LOCALE_HEADER, stripLocale(request.nextUrl.pathname).localeKey);
  if (visitor.campaign) headers.set(CAMPAIGN_HEADER, visitor.campaign);
  else headers.delete(CAMPAIGN_HEADER);
  headers.delete(CHROME_HEADER);
  if (isLandingPath(request.nextUrl.pathname, KNOWN_LOCALE_SEGMENTS)) {
    headers.set(CHROME_HEADER, LANDING_CHROME);
  }
  return headers;
}

function withVisitorCookies(response: NextResponse, visitor: Visitor): NextResponse {
  if (visitor.setId) {
    response.cookies.set(VID_COOKIE, visitor.id, { ...COOKIE_BASE, maxAge: VID_MAX_AGE_SECONDS });
  }
  if (visitor.setCampaign && visitor.campaign) {
    response.cookies.set(CAMPAIGN_COOKIE, visitor.campaign, {
      ...COOKIE_BASE,
      maxAge: CAMPAIGN_MAX_AGE_SECONDS,
    });
  } else if (visitor.clearCampaign) {
    response.cookies.delete(CAMPAIGN_COOKIE);
  }
  return response;
}

/**
 * Password gates for internal pages. HTTP Basic auth: the browser asks once per
 * session; the username is ignored. Each gate fails closed: with its env var unset,
 * nobody gets in.
 *  - /demo/rfi (internal RFI prep, account-team notes): RFI_PAGE_PASSWORD.
 *    /demo/rfi-overview is the customer-facing version and stays open.
 *  - /admin (content-type inspector, can delete CMS content types): ADMIN_PASSWORD.
 *    The delete server action re-checks it (app/admin/actions.ts).
 */
const GATES = [
  { path: '/demo/rfi', passwordEnv: 'RFI_PAGE_PASSWORD', realm: 'RFI notes' },
  { path: '/admin', passwordEnv: 'ADMIN_PASSWORD', realm: 'Admin' },
] as const;

const findGate = (pathname: string) =>
  GATES.find(({ path }) => pathname === path || pathname.startsWith(`${path}/`));

function gateRequest(request: NextRequest, gate: (typeof GATES)[number]): NextResponse {
  const password = process.env[gate.passwordEnv] ?? '';
  const noStore = { 'Cache-Control': 'private, no-store' };

  if (!password) {
    return new NextResponse(`This page is locked. Set ${gate.passwordEnv} to unlock it.`, {
      status: 503,
      headers: noStore,
    });
  }
  if (!checkBasicAuth(request.headers.get('authorization'), password)) {
    return new NextResponse('Password required.', {
      status: 401,
      headers: { ...noStore, 'WWW-Authenticate': `Basic realm="${gate.realm}", charset="UTF-8"` },
    });
  }
  const response = NextResponse.next();
  response.headers.set('Cache-Control', noStore['Cache-Control']);
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const gate = findGate(pathname);
  if (gate) return gateRequest(request, gate);
  const seg = firstSegment(pathname);
  const visitor = identify(request);

  // Default-locale prefix is visible → redirect to the clean path (canonical/SEO).
  //   /en/vb-demo → /vb-demo
  if (seg === DEFAULT_LOCALE) {
    const stripped =
      pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`), '') || '/';
    return withVisitorCookies(NextResponse.redirect(new URL(stripped + search, request.url)), visitor);
  }

  const requestInit = { request: { headers: forwardedHeaders(request, visitor) } };

  // A non-default known locale is already present → leave it; [locale] is populated.
  if (KNOWN_LOCALE_SEGMENTS.includes(seg)) {
    return withVisitorCookies(NextResponse.next(requestInit), visitor);
  }

  // Clean CMS path with no locale → rewrite into the default locale so [locale] is set.
  //   /vb-demo → /en/vb-demo
  const rewritten = `/${DEFAULT_LOCALE}${pathname}`;
  return withVisitorCookies(
    NextResponse.rewrite(new URL(rewritten + search, request.url), requestInit),
    visitor,
  );
}

export const config = {
  // Locale routing runs on everything EXCEPT API, Next internals, the preview/admin/
  // styleguide routes, and any path containing a dot (static assets like /logo.svg). The
  // preview, admin and styleguide routes live outside [locale] and must not be
  // rewritten into a locale. The extra entries below are the password gates only: for
  // those paths the proxy checks the password and never rewrites.
  matcher: [
    '/((?!api|_next/static|_next/image|preview|admin|styleguide|applications|demo|favicon.ico|.*\\..*).*)',
    // Password-gated paths (see GATES above).
    '/demo/rfi/:path*',
    '/admin/:path*',
  ],
};
