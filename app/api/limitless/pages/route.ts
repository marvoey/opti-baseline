import { NextResponse } from 'next/server';
import { cmsGet } from '@/lib/cms/managementApi';
import { siteOrigin } from '@/lib/siteHost';

export const dynamic = 'force-dynamic';

type Page<T> = { items?: T[] };
type Node = { key: string };
type Version = {
  key: string;
  version: string;
  status: string;
  displayName: string;
  routeSegment?: string;
  lastModified?: string;
  properties?: Record<string, { value?: unknown } | undefined>;
};

const str = (v: { value?: unknown } | undefined) => (typeof v?.value === 'string' ? v.value : undefined);

const CONTAINER_PATH_QUERY = `
query ContainerPath($key: String) {
  _Page(where: { _metadata: { key: { eq: $key } } }, limit: 1) {
    items { _metadata { url { default } } }
  }
}`;

/**
 * Public URL path of the container ("/" for the start page, "/abm/" for a sub-page), so page
 * links follow wherever the container lives instead of assuming a prefix. Graph only has
 * published content, which a container must be anyway for its children to be reachable.
 * Cached per process; falls back to "/" if Graph can't answer.
 */
let containerPath: { key: string; path: string } | null = null;
async function getContainerPath(key: string): Promise<string> {
  if (containerPath?.key === key) return containerPath.path;
  try {
    const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2';
    const res = await fetch(`${gateway}?auth=${process.env.OPTIMIZELY_GRAPH_SINGLE_KEY}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: CONTAINER_PATH_QUERY, variables: { key: key.replace(/-/g, '') } }),
      cache: 'no-store',
    });
    const json = await res.json();
    const path = json?.data?._Page?.items?.[0]?._metadata?.url?.default;
    if (typeof path === 'string') {
      containerPath = { key, path: path.endsWith('/') ? path : `${path}/` };
      return containerPath.path;
    }
  } catch {
    /* fall through to the default */
  }
  return '/';
}

/**
 * Lists the AbmLandingPage items under the ABM container, drafts included (the Graph
 * single key used by /status only sees published content), so the CRM console can
 * report "draft created / updated / published" while a Limitless run is in flight.
 */
export async function GET() {
  const container = process.env.ABM_CONTAINER_KEY;
  if (!container) {
    return NextResponse.json({ ok: false, error: 'ABM_CONTAINER_KEY is not configured' }, { status: 500 });
  }

  try {
    const nodes = await cmsGet<Page<Node>>(
      `/v1/content/${container}/items?contentTypes=AbmLandingPage&pageSize=100`,
    );
    const origin = ((await siteOrigin()) ?? '').replace(/\/$/, '');
    const basePath = await getContainerPath(container);
    // CMS origin for editor deep links (OPTIMIZELY_CMS_URL may or may not end in /edit).
    const cmsOrigin = (process.env.OPTIMIZELY_CMS_URL || '').replace(/\/$/, '').replace(/\/edit\/?$/, '');

    const pages = await Promise.all(
      (nodes.items ?? []).map(async ({ key }) => {
        const { items = [] } = await cmsGet<Page<Version>>(`/v1/content/${key}/versions?pageSize=20`);
        if (items.length === 0) return null;
        // Newest version (versions are numeric ids), and the newest published one, if any.
        const sorted = [...items].sort((a, b) => Number(b.version) - Number(a.version));
        const latest = sorted[0];
        const published = sorted.find((v) => v.status === 'published');
        const p = latest.properties ?? {};
        return {
          key,
          accountId: str(p.AccountId),
          accountName: str(p.AccountName) ?? latest.displayName,
          routeSegment: latest.routeSegment,
          version: latest.version,
          status: latest.status,
          versionNote: str(p.PageVersionNote),
          lastModified: latest.lastModified,
          hasPublished: !!published,
          // Public URL exists once any version is published (drafts have none yet).
          url: published && latest.routeSegment ? `${origin}${basePath}${latest.routeSegment}/` : null,
          // Deep link into the CMS editor for review/sign-off (works for drafts too).
          cmsEditUrl: cmsOrigin ? `${cmsOrigin}/ui/cms/#context=epi.cms.contentdata:///${key}` : null,
        };
      }),
    );

    return NextResponse.json({ ok: true, pages: pages.filter(Boolean) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'CMS request failed' }, { status: 502 });
  }
}
