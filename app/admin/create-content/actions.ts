'use server';

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';

const CONTAINER_MAP: Record<string, string> = {
  PrgvCorePrinciple:          '0d0b8481337c4a65acbd860ef00f3fee',
  PrgvJurisdictionalOverride: 'a6fb9dbbe05144d4b6c7d8609f20d810',
  PrgvStatutoryDisclosure:    '03692842eee843ecbe36611ab46f2174',
  PrgvProceduralSafeguard:    'a09729113d824a949acb9fe7c564d597',
};

const VALID_TYPES = new Set(Object.keys(CONTAINER_MAP));

export type CreateResult =
  | { ok: true; key: string }
  | { ok: false; message: string };

export type CreateInput = {
  contentTypeKey: string;
  internalName: string;
  lob: string;
  topic: string;
  jurisdiction?: string;
  bodyHtml: string;
  publish: boolean;
};

function apiBase() {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

let _cachedToken: string | null = null;
let _tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken;

  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error('Missing CMS credentials (OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET)');
  }

  const res = await fetch(`${apiBase()}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error('No access_token returned');

  _cachedToken = data.access_token;
  _tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 30) * 1000;
  return _cachedToken;
}

export async function createCopyItem(input: CreateInput): Promise<CreateResult> {
  const { contentTypeKey, internalName, lob, topic, jurisdiction, bodyHtml, publish } = input;

  if (!VALID_TYPES.has(contentTypeKey)) {
    return { ok: false, message: `Unknown content type: ${contentTypeKey}` };
  }
  if (!internalName.trim()) return { ok: false, message: 'Internal Name is required.' };
  if (!lob) return { ok: false, message: 'Line of Business is required.' };
  if (!topic) return { ok: false, message: 'Topic is required.' };
  if (!bodyHtml.trim()) return { ok: false, message: 'Body content is required.' };

  const needsJurisdiction =
    contentTypeKey === 'PrgvJurisdictionalOverride' ||
    contentTypeKey === 'PrgvStatutoryDisclosure';
  if (needsJurisdiction && !jurisdiction) {
    return { ok: false, message: 'Jurisdiction is required for this content type.' };
  }

  const containerKey = CONTAINER_MAP[contentTypeKey];

  // Jurisdiction handling:
  // - PrgvCorePrinciple: no Jurisdiction property on this type — omit entirely
  // - PrgvProceduralSafeguard: always National (hidden in the form)
  // - others: use provided value
  let jurisdictionProp: Record<string, unknown> = {};
  if (contentTypeKey === 'PrgvProceduralSafeguard') {
    jurisdictionProp = { Jurisdiction: { value: 'National' } };
  } else if (contentTypeKey !== 'PrgvCorePrinciple') {
    jurisdictionProp = { Jurisdiction: { value: jurisdiction } };
  }

  try {
    const token = await getToken();
    const base = apiBase();

    const body = {
      contentType: contentTypeKey,
      container: containerKey,
      initialVersion: {
        displayName: internalName.trim(),
        locale: 'en',
        properties: {
          InternalName: { value: internalName.trim() },
          LOB: { value: lob },
          Topic: { value: topic },
          ...jurisdictionProp,
          RichTextValue: { value: { html: bodyHtml } },
        },
      },
    };

    const createRes = await fetch(`${base}/v1/content`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'cms-skip-validation': '*',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (createRes.status === 409) {
      return { ok: false, message: 'An item with this Internal Name already exists in the CMS.' };
    }

    if (!createRes.ok) {
      const err = await createRes.text();
      return { ok: false, message: `Create failed (${createRes.status}): ${err}` };
    }

    const created = (await createRes.json()) as {
      key?: string;
      initialVersion?: { version?: string };
    };
    const contentKey = created.key;
    const version = created.initialVersion?.version;

    if (!contentKey || !version) {
      return { ok: false, message: 'Missing key or version in create response.' };
    }

    if (publish) {
      const pubRes = await fetch(
        `${base}/v1/content/${contentKey}/versions/${version}:publish`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        },
      );
      if (!pubRes.ok) {
        const err = await pubRes.text();
        return {
          ok: false,
          message: `Item created (${contentKey}) but publish failed (${pubRes.status}): ${err}`,
        };
      }
    }

    return { ok: true, key: contentKey };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
