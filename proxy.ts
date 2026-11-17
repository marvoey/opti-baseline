import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_SEGMENTS } from '@/lib/locales';

const DEFAULT_LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
const KNOWN_LOCALE_SEGMENTS = LOCALE_SEGMENTS;

const VISITOR_COOKIE = 'hrb_vid';
const SEGMENT_COOKIE = 'hrb_segment';
const ONE_YEAR = 60 * 60 * 24 * 365;

function firstSegment(pathname: string): string {
  return pathname.split('/')[1] ?? '';
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const seg = firstSegment(pathname);

  // Default-locale prefix is visible: redirect to the clean path (unchanged).
  if (seg === DEFAULT_LOCALE) {
    const stripped =
      pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`), '') || '/';
    return NextResponse.redirect(new URL(stripped + search, request.url));
  }

  // Visitor identity. A brand-new cookie is not in request.cookies yet,
  // so the ID is also passed to the page as a request header.
  const existingId = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId = existingId ?? crypto.randomUUID();

  // Demo switch. ?hrb_segment=diy_abandoner sets it. ?hrb_segment= clears it.
  const segmentParam = request.nextUrl.searchParams.get(SEGMENT_COOKIE); // null = absent
  const segment =
    segmentParam !== null ? segmentParam : request.cookies.get(SEGMENT_COOKIE)?.value ?? '';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hrb-visitor', visitorId); // always overwritten, never trusted from the client
  requestHeaders.set('x-hrb-segment', segment);

  const response = KNOWN_LOCALE_SEGMENTS.includes(seg)
    ? NextResponse.next({ request: { headers: requestHeaders } })
    : NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, request.url), {
        request: { headers: requestHeaders },
      });

  const cookie = { path: '/', maxAge: ONE_YEAR, sameSite: 'lax' as const, httpOnly: true };
  if (!existingId) response.cookies.set(VISITOR_COOKIE, visitorId, cookie);
  if (segmentParam !== null) {
    if (segmentParam) response.cookies.set(SEGMENT_COOKIE, segmentParam, cookie);
    else response.cookies.delete(SEGMENT_COOKIE);
  }

  return response;
}

export const config = {
  // Unchanged: keep your existing matcher exactly as it is.
  matcher: ['/((?!api|_next/static|_next/image|preview|admin|styleguide|applications|demo|favicon.ico|.*\\..*).*)'],
};