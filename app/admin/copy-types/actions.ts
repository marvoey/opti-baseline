'use server';

const DEFAULT_GRAPH_GATEWAY = 'https://cg.optimizely.com/content/v2';

export type CmsItem = {
  cmsKey: string;
  internalName: string;
  lob: string;
  topic: string;
  jurisdiction: string | null;
  copyType: string;
  contentTypeKey: string;
  bodyHtml: string;
};

export type FetchCmsItemsResult =
  | { ok: true; items: CmsItem[] }
  | { ok: false; message: string };

const TYPES = [
  { key: 'PrgvCorePrinciple',          label: 'Base Policy',             hasJurisdiction: false },
  { key: 'PrgvJurisdictionalOverride', label: 'Jurisdictional Override', hasJurisdiction: true  },
  { key: 'PrgvProceduralSafeguard',    label: 'Handling Procedure',      hasJurisdiction: false },
  { key: 'PrgvStatutoryDisclosure',    label: 'Statutory Disclosure',    hasJurisdiction: true  },
] as const;

type RawItem = {
  _metadata?: { key?: string | null } | null;
  InternalName?: string | null;
  LOB?: string | null;
  Topic?: string | null;
  Jurisdiction?: string | null;
  RichTextValue?: { html?: string | null } | null;
};

async function fetchAllForType(
  gateway: string,
  singleKey: string,
  typeName: string,
  includeJurisdiction: boolean,
): Promise<RawItem[]> {
  const fields = `_metadata { key } InternalName LOB Topic RichTextValue { html }${includeJurisdiction ? ' Jurisdiction' : ''}`;
  const items: RawItem[] = [];
  let skip = 0;

  while (true) {
    const query = `{ ${typeName}(limit: 100, skip: ${skip}) { items { ${fields} } total } }`;
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
      data?: Record<string, { items?: RawItem[] | null; total?: number } | null>;
      errors?: Array<{ message: string }>;
    };

    if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '));

    const page = json.data?.[typeName];
    const batch = page?.items ?? [];
    const total = page?.total ?? 0;

    items.push(...batch);
    skip += 100;
    if (skip >= total) break;
  }

  return items;
}

export async function fetchCmsItems(): Promise<FetchCmsItemsResult> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) {
    return { ok: false, message: 'OPTIMIZELY_GRAPH_SINGLE_KEY is not set.' };
  }

  const gateway = (
    process.env.OPTIMIZELY_GRAPH_GATEWAY?.trim() || DEFAULT_GRAPH_GATEWAY
  ).replace(/\/$/, '');

  try {
    const batches = await Promise.all(
      TYPES.map(async t => {
        const raw = await fetchAllForType(gateway, singleKey, t.key, t.hasJurisdiction);
        return raw.map<CmsItem>(item => ({
          cmsKey: item._metadata?.key ?? '',
          internalName: item.InternalName ?? '',
          lob: item.LOB ?? '',
          topic: item.Topic ?? '',
          jurisdiction: item.Jurisdiction ?? null,
          copyType: t.label,
          contentTypeKey: t.key,
          bodyHtml: item.RichTextValue?.html ?? '',
        }));
      }),
    );

    return { ok: true, items: batches.flat() };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
