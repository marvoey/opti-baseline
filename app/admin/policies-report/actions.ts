'use server';

import { revalidatePath } from 'next/cache';
import { COPY_TYPES, TYPE_MAP, type CopyType, type ReportItem, type LocalBlock, type PublishAllResult, type PublishItemResult } from './_lib/constants';

const DEFAULT_CMS_GATEWAY = 'https://api.cms.optimizely.com';

function cmsBase() {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_CMS_GATEWAY).replace(/\/$/, '');
}

let _token: string | null = null;
let _tokenExpiry = 0;

async function getCmsToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');

  const res = await fetch(`${cmsBase()}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    cache: 'no-store',
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error('Auth failed: no access_token in response');
  _token = data.access_token;
  _tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 30) * 1000;
  return _token;
}

type DraftVersion = { key: string; version: string; contentType: string; displayName: string };

async function fetchAllPrgvDrafts(token: string): Promise<DraftVersion[]> {
  const prgvTypes = new Set(Object.values(TYPE_MAP));
  const drafts: DraftVersion[] = [];
  let pageIndex = 0;

  while (true) {
    const res = await fetch(
      `${cmsBase()}/v1/content/versions?statuses=draft&pageSize=100&pageIndex=${pageIndex}`,
      { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    if (!res.ok) throw new Error(`Failed to list draft versions (${res.status})`);

    const data = (await res.json()) as { items?: DraftVersion[] };
    const page = data.items ?? [];
    drafts.push(...page.filter(v => prgvTypes.has(v.contentType)));

    if (page.length < 100) break;
    pageIndex++;
  }

  return drafts;
}

// Returns Map<contentTypeName, Set<displayName>> for all Prgv drafts
async function fetchDraftNamesByType(token: string): Promise<Map<string, Set<string>>> {
  const drafts = await fetchAllPrgvDrafts(token);
  const result = new Map<string, Set<string>>();
  for (const v of drafts) {
    if (!result.has(v.contentType)) result.set(v.contentType, new Set());
    result.get(v.contentType)!.add(v.displayName);
  }
  return result;
}

export async function publishAllDrafts(): Promise<PublishAllResult> {
  try {
    const token = await getCmsToken();
    const base = cmsBase();
    const drafts = await fetchAllPrgvDrafts(token);

    let published = 0;
    let errors = 0;

    await Promise.all(
      drafts.map(async ({ key, version }) => {
        const res = await fetch(`${base}/v1/content/${key}/versions/${version}:publish`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (res.ok) published++;
        else errors++;
      }),
    );

    revalidatePath('/admin/policies-report');
    return { ok: true, published, errors };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}

export async function publishItem(internalName: string, copyType: CopyType): Promise<PublishItemResult> {
  try {
    const token = await getCmsToken();
    const base = cmsBase();
    const contentTypeName = TYPE_MAP[copyType];

    let pageIndex = 0;
    while (true) {
      const res = await fetch(
        `${base}/v1/content/versions?statuses=draft&pageSize=100&pageIndex=${pageIndex}`,
        { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' },
      );
      if (!res.ok) throw new Error(`Failed to list draft versions (${res.status})`);

      const data = (await res.json()) as { items?: DraftVersion[] };
      const page = data.items ?? [];

      const match = page.find(v => v.contentType === contentTypeName && v.displayName === internalName);
      if (match) {
        const pubRes = await fetch(`${base}/v1/content/${match.key}/versions/${match.version}:publish`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!pubRes.ok) {
          const err = await pubRes.text();
          return { ok: false, message: `Publish failed (${pubRes.status}): ${err}` };
        }
        revalidatePath('/admin/policies-report');
        return { ok: true };
      }

      if (page.length < 100) break;
      pageIndex++;
    }

    return { ok: false, message: `No draft version found for "${internalName}"`, notFound: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}

const DEFAULT_GRAPH_GATEWAY = 'https://cg.optimizely.com/content/v2';

export type ReportResult =
  | { ok: true; items: ReportItem[] }
  | { ok: false; message: string };

async function fetchPublishedNames(typeName: string): Promise<Set<string>> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) return new Set();

  const gateway = (process.env.OPTIMIZELY_GRAPH_GATEWAY?.trim() || DEFAULT_GRAPH_GATEWAY).replace(/\/$/, '');
  const names = new Set<string>();
  let skip = 0;

  while (true) {
    const query = `{ ${typeName}(limit: 100, skip: ${skip}) { items { InternalName } total } }`;
    const res = await fetch(gateway, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `epi-single ${singleKey}`,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Graph request failed (${res.status}) for ${typeName}`);

    const json = (await res.json()) as {
      data?: Record<string, { items?: Array<{ InternalName?: string | null }>; total?: number } | null>;
      errors?: Array<{ message: string }>;
    };
    if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '));

    const page = json.data?.[typeName];
    const items = page?.items ?? [];
    const total = page?.total ?? 0;

    for (const item of items) {
      if (item.InternalName) names.add(item.InternalName);
    }

    skip += 100;
    if (skip >= total) break;
  }

  return names;
}

export async function fetchPoliciesReport(localBlocks: LocalBlock[]): Promise<ReportResult> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) {
    return { ok: false, message: 'OPTIMIZELY_GRAPH_SINGLE_KEY is not set' };
  }

  try {
    // Fetch published names from Graph and draft names from CMS REST in parallel
    const [graphResults, draftNamesByType] = await Promise.all([
      Promise.all(COPY_TYPES.map(async ct => ({ ct, names: await fetchPublishedNames(TYPE_MAP[ct]) }))),
      getCmsToken()
        .then(token => fetchDraftNamesByType(token))
        .catch(() => new Map<string, Set<string>>()), // graceful fallback if CMS creds absent
    ]);

    const publishedNames: Record<CopyType, Set<string>> = {} as never;
    for (const { ct, names } of graphResults) publishedNames[ct] = names;

    const items: ReportItem[] = localBlocks.map(block => {
      const copyType = block.CopyType as CopyType;
      const contentTypeName = TYPE_MAP[copyType];
      const isPublished = publishedNames[copyType]?.has(block.InternalName) ?? false;
      const isDraft = draftNamesByType.get(contentTypeName)?.has(block.InternalName) ?? false;

      return {
        internalName: block.InternalName,
        copyType,
        lob: block.Taxonomy.LOB,
        topic: block.Taxonomy.Topic,
        jurisdiction: block.Taxonomy.Jurisdiction,
        status: isPublished ? 'published' : isDraft ? 'draft' : 'not-imported',
      };
    });

    return { ok: true, items };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
