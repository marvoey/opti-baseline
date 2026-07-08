import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_SEGMENTS } from '@/lib/locales';

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

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const seg = firstSegment(pathname);

  // Root → redirect to the demo page.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/demo', request.url));
  }

  // Default-locale prefix is visible → redirect to the clean path (canonical/SEO).
  //   /en/vb-demo → /vb-demo
  if (seg === DEFAULT_LOCALE) {
    const stripped =
      pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`), '') || '/';
    return NextResponse.redirect(new URL(stripped + search, request.url));
  }

  // A non-default known locale is already present → leave it; [locale] is populated.
  if (KNOWN_LOCALE_SEGMENTS.includes(seg)) {
    return NextResponse.next();
  }

  // Clean CMS path with no locale → rewrite into the default locale so [locale] is set.
  //   /vb-demo → /en/vb-demo
  const rewritten = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(new URL(rewritten + search, request.url));
}

export const config = {
  // Run on everything EXCEPT API, Next internals, the preview/admin routes, and
  // any path containing a dot (static assets like /logo.svg). The preview and
  // admin routes live outside [locale] and must not be rewritten into a locale.
  matcher: ['/((?!api|_next/static|_next/image|preview|admin|rationale(?:/|$)|demo-v2(?:/|$)|demo-flow(?:/|$)|demo(?:/|$)|kb(?:/|$)|favicon.ico|.*\\..*).*)'],
};
