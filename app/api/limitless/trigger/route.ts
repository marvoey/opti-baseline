import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const url = process.env.OPAL_LIMITLESS_WEBHOOK_URL;
  const secret = process.env.OPAL_LIMITLESS_WEBHOOK_SECRET;
  const header = process.env.OPAL_LIMITLESS_WEBHOOK_HEADER || 'X-Limitless-Secret';
  if (!url || !secret) {
    return NextResponse.json({ ok: false, error: 'Opal webhook not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.account?.id) {
    return NextResponse.json({ ok: false, error: 'account.id is required' }, { status: 400 });
  }

  const payload = {
    event: 'crm.abm_account.sync',
    source: 'northstar-crm-demo',
    campaign: 'Q4 Tier-1 ABM',
    triggeredAt: new Date().toISOString(),
    ...body,
    // Server-owned: start page the agents create under (not overridable by the client)
    homePageContentId: process.env.HOME_PAGE_CONTENT_ID || null,
    abmContainerKey: process.env.ABM_CONTAINER_KEY || null,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      [header]: secret,
      'Time-Zone': 'America/New_York', // Opal webhook triggers accept an IANA Time-Zone override
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const text = await res.text();
  return NextResponse.json({ ok: res.ok, status: res.status, opal: text.slice(0, 500) }, { status: res.ok ? 200 : 502 });
}
