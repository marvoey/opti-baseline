import { NextResponse } from 'next/server';
import { liveMembers, odpConfigured } from '@/lib/odp';
import { PREFERENCES, mockMembers, type Preference } from '@/lib/odpDemo';

/* GET /api/demo/odp/segment?pref=diy|tax_pro|undecided|researching|all
   Returns the imported demo profiles in that group. Falls back to mock data (source: 'mock') when ODP
   is not configured, unreachable, or has no imported profiles yet. */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('pref') ?? 'all';
  if (raw !== 'all' && !PREFERENCES.includes(raw as Preference)) {
    return NextResponse.json({ ok: false, error: 'unknown pref' }, { status: 400 });
  }
  const pref = raw as Preference | 'all';

  if (odpConfigured()) {
    try {
      const members = await liveMembers(pref, PREFERENCES);
      return NextResponse.json({ ok: true, source: 'live', members });
    } catch (e) {
      console.warn('[demo/odp/segment] falling back to mock:', e instanceof Error ? e.message : e);
    }
  }
  return NextResponse.json({ ok: true, source: 'mock', members: mockMembers(pref) });
}
