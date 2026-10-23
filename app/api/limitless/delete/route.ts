import { NextResponse } from 'next/server';
import { cmsDelete, cmsGet } from '@/lib/cms/managementApi';

export const dynamic = 'force-dynamic';

type Page<T> = { items?: T[] };
type Node = { key: string };

const norm = (k: string) => k.replace(/-/g, '').toLowerCase();

/**
 * Delete an AbmLandingPage from the CMS. With `version` only that version (a draft) is removed and the
 * published page stays live; without it the whole page is deleted. Only pages under the ABM container
 * can be deleted through this route.
 */
export async function POST(req: Request) {
  const container = process.env.ABM_CONTAINER_KEY;
  if (!container) {
    return NextResponse.json({ ok: false, error: 'ABM_CONTAINER_KEY is not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const key = typeof body?.key === 'string' ? body.key : '';
  const version = body?.version == null ? null : String(body.version);
  if (!/^[0-9a-fA-F-]{32,36}$/.test(key) || (version !== null && !/^\d+$/.test(version))) {
    return NextResponse.json({ ok: false, error: 'key (content key GUID) and optional numeric version are required' }, { status: 400 });
  }

  try {
    const nodes = await cmsGet<Page<Node>>(`/v1/content/${container}/items?contentTypes=AbmLandingPage&pageSize=100`);
    if (!(nodes.items ?? []).some((n) => norm(n.key) === norm(key))) {
      return NextResponse.json({ ok: false, error: 'Page is not an ABM landing page' }, { status: 404 });
    }
    await cmsDelete(version ? `/v1/content/${key}/versions/${version}` : `/v1/content/${key}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'CMS request failed' }, { status: 502 });
  }
}
