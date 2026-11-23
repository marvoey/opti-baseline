import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_SEGMENTS } from '@/lib/locales';
import { isAdminAuthorized, isAdminConfigured } from '@/lib/adminAuth';

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

/** Password gate for /admin (HTTP Basic). Also covers its server actions. */
function guardAdmin(request: NextRequest) {
  if (!isAdminConfigured()) {
    return new NextResponse('Admin is disabled: set ADMIN_PASSWORD to enable it.', { status: 503 });
  }
  if (isAdminAuthorized(request.headers.get('authorization'))) return NextResponse.next();
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"' },
  });
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return guardAdmin(request);
  const seg = firstSegment(pathname);

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
  // Run on everything EXCEPT API, Next internals, the preview/admin/styleguide
  // routes, and any path containing a dot (static assets like /logo.svg). The
  // preview, admin and styleguide routes live outside [locale] and must not be
  // rewritten into a locale. /admin is matched separately, for the password gate only.
  // `setup-guide$` is the colleague setup guide (app/setup-guide), which also lives outside
  // [locale]. The `$` stops it from also excluding CMS pages whose path merely starts
  // with "setup-guide" (e.g. /setup-guide-2).
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|preview|admin|styleguide|applications|demo|setup-guide$|favicon.ico|.*\\..*).*)',
  ],
};
