import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_SEGMENTS } from '@/lib/locales';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

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

// First path segments that bypass locale rewriting entirely. Evaluated once at
// module load (Node.js runtime — Next.js 16 default) so no build step is needed.
// Combines manual entries from PROXY_EXCLUDED_PATHS in .env (e.g. "preview")
// with every directory found under app/(pages)/, which map 1:1 to URL segments.
// Adding a new app/(pages)/ route only requires a server restart — no code change.
function buildExcludedPaths(): Set<string> {
  const manual = (process.env.PROXY_EXCLUDED_PATHS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const pagesDir = join(process.cwd(), 'app', '(pages)');
  const detected = existsSync(pagesDir)
    ? readdirSync(pagesDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
    : [];

  return new Set([...manual, ...detected]);
}

const EXCLUDED_PATHS = buildExcludedPaths();

function firstSegment(pathname: string): string {
  return pathname.split('/')[1] ?? '';
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const seg = firstSegment(pathname);

  // Root → demo landing page.
  // if (pathname === '/') {
  //   return NextResponse.redirect(new URL('/DemoPrototype', request.url));
  // }

  // Configured bypass routes — serve as-is without locale rewriting.
  if (EXCLUDED_PATHS.has(seg)) {
    return NextResponse.next();
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
  // Excludes API routes, Next.js internals, favicon, and any path with a dot
  // (static assets). Custom route exclusions live in PROXY_EXCLUDED_PATHS (.env).
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
