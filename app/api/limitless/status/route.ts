import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const QUERY = `
query AbmStatus($id: String) {
  AbmLandingPage(where: { AccountId: { eq: $id } }, limit: 1) {
    items {
      AccountName
      PageVersionNote
      LimitlessMode
      LastRefreshed
      _metadata { url { default } }
    }
  }
}`;

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('account');
  if (!id) return NextResponse.json({ live: false, error: 'account required' }, { status: 400 });

  const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2';
  const res = await fetch(`${gateway}?auth=${process.env.OPTIMIZELY_GRAPH_SINGLE_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { id } }),
    cache: 'no-store',
  });
  const json = await res.json().catch(() => null);
  const item = json?.data?.AbmLandingPage?.items?.[0];

  return NextResponse.json(
    item
      ? { live: true, url: item._metadata?.url?.default, versionNote: item.PageVersionNote, mode: item.LimitlessMode, lastRefreshed: item.LastRefreshed }
      : { live: false },
  );
}
