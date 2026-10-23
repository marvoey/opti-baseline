import { NextResponse } from 'next/server';
import { cmsGet, cmsPost } from '@/lib/cms/managementApi';

export const dynamic = 'force-dynamic';

type Page<T> = { items?: T[] };
type Version = {
  version: string;
  status: string;
  locale?: string;
  variation?: string;
  displayName: string;
  routeSegment?: string;
  simpleRoute?: string;
  /** The API reads and writes every property as `{ value }`. */
  properties?: Record<string, { value?: unknown } | undefined>;
  composition?: unknown;
};

/**
 * "Update" a published AbmLandingPage: create a new draft version that copies the latest
 * version and bumps the Limitless governance fields. Nothing is published, so the live page
 * stays as is and the CRM shows "Published · newer draft" until someone publishes in the CMS.
 * If the latest version is already a draft, that draft is left alone.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const key = typeof body?.key === 'string' ? body.key : '';
  if (!/^[0-9a-fA-F-]{32,36}$/.test(key)) {
    return NextResponse.json({ ok: false, error: 'key (content key GUID) is required' }, { status: 400 });
  }

  try {
    const { items = [] } = await cmsGet<Page<Version>>(`/v1/content/${key}/versions?pageSize=20`);
    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Page has no versions' }, { status: 404 });
    }
    const latestStub = [...items].sort((a, b) => Number(b.version) - Number(a.version))[0];
    if (latestStub.status !== 'published') {
      return NextResponse.json({ ok: true, created: false, version: latestStub.version, status: latestStub.status });
    }

    // The list may omit properties, so read the full latest version before copying it.
    const latest = await cmsGet<Version>(`/v1/content/${key}/versions/${latestStub.version}`);
    const next = Number(latest.version) + 1;
    const created = await cmsPost<Version>(`/v1/content/${key}/versions`, {
      locale: latest.locale,
      variation: latest.variation,
      displayName: latest.displayName,
      routeSegment: latest.routeSegment,
      simpleRoute: latest.simpleRoute,
      composition: latest.composition,
      properties: {
        ...latest.properties,
        LimitlessMode: { value: 'update' },
        PageVersionNote: { value: `v${next} · updated: manual refresh` },
        LastRefreshed: { value: new Date().toISOString() },
      },
    });

    return NextResponse.json({ ok: true, created: true, version: created.version ?? String(next), status: created.status ?? 'draft' });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'CMS request failed' }, { status: 502 });
  }
}
