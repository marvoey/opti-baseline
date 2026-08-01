'use server';

const DEFAULT_GATEWAY   = 'https://api.cms.optimizely.com';
const DEFAULT_GRAPH_GW  = 'https://cg.optimizely.com/content/v2';

// ── types ──────────────────────────────────────────────────────────────────

export type EditableItem = {
  cmsKey: string;
  contentTypeKey: string;
  copyType: string;
  internalName: string;
  lob: string;
  topic: string;
  jurisdiction: string | null;
  bodyHtml: string;
};

export type FetchForEditResult =
  | { ok: true; item: EditableItem }
  | { ok: false; message: string };

export type UpdateResult =
  | { ok: true }
  | { ok: false; message: string };

export type UpdateInput = {
  contentTypeKey: string;
  internalName: string;
  lob: string;
  topic: string;
  jurisdiction?: string;
  bodyHtml: string;
};

// ── shared helpers ─────────────────────────────────────────────────────────

const TYPES = [
  { key: 'PrgvCorePrinciple',          label: 'Base Policy',             hasJurisdiction: false },
  { key: 'PrgvJurisdictionalOverride', label: 'Jurisdictional Override', hasJurisdiction: true  },
  { key: 'PrgvProceduralSafeguard',    label: 'Handling Procedure',      hasJurisdiction: false },
  { key: 'PrgvStatutoryDisclosure',    label: 'Statutory Disclosure',    hasJurisdiction: true  },
] as const;

function apiBase() {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

let _token: string | null = null;
let _tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');

  const res = await fetch(`${apiBase()}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    cache: 'no-store',
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error('No access_token returned');
  _token = data.access_token;
  _tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 30) * 1000;
  return _token;
}

// ── fetch a single item by CMS key via Graph ───────────────────────────────

export async function fetchItemForEdit(cmsKey: string): Promise<FetchForEditResult> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) return { ok: false, message: 'OPTIMIZELY_GRAPH_SINGLE_KEY is not set.' };

  const gateway = (
    process.env.OPTIMIZELY_GRAPH_GATEWAY?.trim() || DEFAULT_GRAPH_GW
  ).replace(/\/$/, '');

  // Batch all four type queries into a single request, filtering by key
  const segments = TYPES.map(t => {
    const jf = t.hasJurisdiction ? ' Jurisdiction' : '';
    return `${t.key}(where: { _metadata: { key: { eq: "${cmsKey}" } } }) { items { _metadata { key } InternalName LOB Topic${jf} RichTextValue { html } } }`;
  }).join('\n');

  const query = `{ ${segments} }`;

  try {
    const res = await fetch(gateway, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `epi-single ${singleKey}` },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Graph request failed (${res.status})`);

    const json = (await res.json()) as {
      data?: Record<string, { items?: Array<{
        _metadata?: { key?: string | null } | null;
        InternalName?: string | null;
        LOB?: string | null;
        Topic?: string | null;
        Jurisdiction?: string | null;
        RichTextValue?: { html?: string | null } | null;
      }> | null } | null>;
      errors?: Array<{ message: string }>;
    };

    if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '));

    for (const t of TYPES) {
      const first = json.data?.[t.key]?.items?.[0];
      if (!first) continue;

      return {
        ok: true,
        item: {
          cmsKey,
          contentTypeKey: t.key,
          copyType: t.label,
          internalName: first.InternalName ?? '',
          lob: first.LOB ?? '',
          topic: first.Topic ?? '',
          jurisdiction: first.Jurisdiction ?? null,
          bodyHtml: first.RichTextValue?.html ?? '',
        },
      };
    }

    return { ok: false, message: `No content found for key "${cmsKey}".` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}

// ── update a content item (create new version + publish) ───────────────────

export async function updateCopyItem(cmsKey: string, input: UpdateInput): Promise<UpdateResult> {
  const { contentTypeKey, internalName, lob, topic, jurisdiction, bodyHtml } = input;

  if (!internalName.trim()) return { ok: false, message: 'Internal Name is required.' };
  if (!lob)                 return { ok: false, message: 'Line of Business is required.' };
  if (!topic)               return { ok: false, message: 'Topic is required.' };
  if (!bodyHtml.trim())     return { ok: false, message: 'Body content is required.' };

  const needsJurisdiction =
    contentTypeKey === 'PrgvJurisdictionalOverride' ||
    contentTypeKey === 'PrgvStatutoryDisclosure';
  if (needsJurisdiction && !jurisdiction) {
    return { ok: false, message: 'Jurisdiction is required for this content type.' };
  }

  let jurisdictionProp: Record<string, unknown> = {};
  if (contentTypeKey === 'PrgvProceduralSafeguard') {
    jurisdictionProp = { Jurisdiction: { value: 'National' } };
  } else if (contentTypeKey !== 'PrgvCorePrinciple') {
    jurisdictionProp = { Jurisdiction: { value: jurisdiction } };
  }

  try {
    const token = await getToken();
    const base = apiBase();

    const versionBody = {
      displayName: internalName.trim(),
      locale: 'en',
      properties: {
        InternalName: { value: internalName.trim() },
        LOB: { value: lob },
        Topic: { value: topic },
        ...jurisdictionProp,
        RichTextValue: { value: { html: bodyHtml } },
      },
    };

    const versionRes = await fetch(`${base}/v1/content/${cmsKey}/versions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'cms-skip-validation': '*',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(versionBody),
      cache: 'no-store',
    });

    if (!versionRes.ok) {
      const err = await versionRes.text();
      return { ok: false, message: `Failed to create new version (${versionRes.status}): ${err}` };
    }

    const created = (await versionRes.json()) as { version?: string };
    const version = created.version;
    if (!version) return { ok: false, message: 'No version returned from CMS.' };

    const pubRes = await fetch(`${base}/v1/content/${cmsKey}/versions/${version}:publish`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!pubRes.ok) {
      const err = await pubRes.text();
      return { ok: false, message: `Version created but publish failed (${pubRes.status}): ${err}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
