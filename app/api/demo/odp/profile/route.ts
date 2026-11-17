import { NextResponse } from 'next/server';
import { liveProfile, odpConfigured } from '@/lib/odp';
import { isDemoEmail, mockEvents, mockProfile } from '@/lib/odpDemo';

/* GET /api/demo/odp/profile?email=<demo email>
   One unified profile plus its event timeline. Only synthetic @example.com profiles can be read.
   Falls back to the mock profile (source: 'mock') when ODP is unavailable or doesn't have it. */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email')?.toLowerCase();
  if (!isDemoEmail(email)) return NextResponse.json({ ok: false, error: 'demo profiles only' }, { status: 400 });

  if (odpConfigured()) {
    try {
      const live = await liveProfile(email);
      if (live) return NextResponse.json({ ok: true, source: 'live', ...live });
    } catch (e) {
      console.warn('[demo/odp/profile] falling back to mock:', e instanceof Error ? e.message : e);
    }
  }
  const profile = mockProfile(email);
  if (!profile) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true, source: 'mock', profile, events: mockEvents(profile) });
}
