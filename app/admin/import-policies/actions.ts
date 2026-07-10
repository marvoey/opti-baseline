'use server';

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';

const TYPE_MAP: Record<string, string> = {
  'Core Principle': 'PrgvCorePrinciple',
  'Jurisdictional Override': 'PrgvJurisdictionalOverride',
  'Statutory Disclosure': 'PrgvStatutoryDisclosure',
  'Procedural Safeguard': 'PrgvProceduralSafeguard',
};

// Each CopyType routes to its dedicated subfolder under /SysSiteAssets/policies/
const CONTAINER_MAP: Record<string, string> = {
  'Core Principle': '0d0b8481337c4a65acbd860ef00f3fee',
  'Jurisdictional Override': 'a6fb9dbbe05144d4b6c7d8609f20d810',
  'Statutory Disclosure': '03692842eee843ecbe36611ab46f2174',
  'Procedural Safeguard': 'a09729113d824a949acb9fe7c564d597',
};

export type PolicyBlock = {
  BlockType: string;
  InternalName: string;
  Taxonomy: { LOB: string; Topic: string; Jurisdiction: string };
  CopyType: string;
  RichTextValue: string;
};

export type ImportResult =
  | { status: 'ok' }
  | { status: 'exists' }
  | { status: 'error'; detail: string }
  | { status: 'no-credentials' };

// Record<CopyType, InternalName[]> — names already in CMS
export type CheckResult =
  | { ok: true; existing: Record<string, string[]> }
  | { ok: false; message: string };

const DEFAULT_GRAPH_GATEWAY = 'https://cg.optimizely.com/content/v2';

// Optimizely Graph caps limit at 100; paginate until total is exhausted
async function fetchAllNamesForType(
  gateway: string,
  singleKey: string,
  typeName: string,
): Promise<string[]> {
  const names: string[] = [];
  let skip = 0;
  const limit = 100;

  while (true) {
    const query = `{ ${typeName}(limit: ${limit}, skip: ${skip}) { items { InternalName } total } }`;
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
      data?: Record<string, { items?: Array<{ InternalName?: string | null }> | null; total?: number } | null> | null;
      errors?: Array<{ message: string }>;
    };
    if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '));

    const page = json.data?.[typeName];
    const items = page?.items ?? [];
    const total = page?.total ?? 0;

    names.push(...items.flatMap(i => (i.InternalName ? [i.InternalName] : [])));
    skip += limit;
    if (skip >= total) break;
  }

  return names;
}

export async function checkImportStatuses(): Promise<CheckResult> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) return { ok: false, message: 'OPTIMIZELY_GRAPH_SINGLE_KEY is not set' };

  const gateway = (
    process.env.OPTIMIZELY_GRAPH_GATEWAY?.trim() || DEFAULT_GRAPH_GATEWAY
  ).replace(/\/$/, '');

  try {
    const [corePrinciple, jurisdictionalOverride, statutoryDisclosure, proceduralSafeguard] =
      await Promise.all([
        fetchAllNamesForType(gateway, singleKey, 'PrgvCorePrinciple'),
        fetchAllNamesForType(gateway, singleKey, 'PrgvJurisdictionalOverride'),
        fetchAllNamesForType(gateway, singleKey, 'PrgvStatutoryDisclosure'),
        fetchAllNamesForType(gateway, singleKey, 'PrgvProceduralSafeguard'),
      ]);

    return {
      ok: true,
      existing: {
        'Core Principle': corePrinciple,
        'Jurisdictional Override': jurisdictionalOverride,
        'Statutory Disclosure': statutoryDisclosure,
        'Procedural Safeguard': proceduralSafeguard,
      },
    };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}

function apiBase() {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

let _cachedToken: string | null = null;
let _tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken;

  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error('Missing CMS credentials');

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
  // Refresh 30s before actual expiry; default to 1 hour if expires_in is absent
  _tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 30) * 1000;
  return _cachedToken;
}

type DraftVersion = { key: string; version: string; contentType: string; displayName: string };

// Searches all draft versions for a matching contentType + displayName and publishes it.
// Returns true if a draft was found and published successfully, false otherwise.
async function publishExistingDraft(
  token: string,
  base: string,
  contentTypeName: string,
  displayName: string,
): Promise<boolean> {
  let pageIndex = 0;
  while (true) {
    const res = await fetch(
      `${base}/v1/content/versions?statuses=draft&pageSize=100&pageIndex=${pageIndex}`,
      { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' },
    );
    if (!res.ok) return false;

    const data = (await res.json()) as { items?: DraftVersion[] };
    const page = data.items ?? [];

    const match = page.find(v => v.contentType === contentTypeName && v.displayName === displayName);
    if (match) {
      const pubRes = await fetch(
        `${base}/v1/content/${match.key}/versions/${match.version}:publish`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
          cache: 'no-store',
        },
      );
      return pubRes.ok;
    }

    if (page.length < 100) return false;
    pageIndex++;
  }
}

export async function checkCredentials(): Promise<boolean> {
  return !!(
    process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim() &&
    process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim()
  );
}

export async function importPolicyBlock(block: PolicyBlock): Promise<ImportResult> {
  if (!(await checkCredentials())) return { status: 'no-credentials' };

  const contentTypeKey = TYPE_MAP[block.CopyType];
  if (!contentTypeKey) {
    return { status: 'error', detail: `Unknown CopyType: ${block.CopyType}` };
  }

  const containerKey = CONTAINER_MAP[block.CopyType];
  if (!containerKey) {
    return { status: 'error', detail: `No folder mapped for CopyType: ${block.CopyType}` };
  }

  try {
    const token = await getToken();
    const base = apiBase();

    const body = {
      contentType: contentTypeKey,
      container: containerKey,
      initialVersion: {
        displayName: block.InternalName,
        locale: 'en',
        properties: {
          InternalName: { value: block.InternalName },
          LOB: { value: block.Taxonomy.LOB },
          Topic: { value: block.Taxonomy.Topic },
          // CorePrinciple is always National — Jurisdiction field was removed from that type
          ...(contentTypeKey !== 'PrgvCorePrinciple' && {
            Jurisdiction: { value: block.Taxonomy.Jurisdiction },
          }),
          RichTextValue: { value: { html: block.RichTextValue } },
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
      // Item already exists in CMS — find its draft version and publish it if present
      const published = await publishExistingDraft(token, base, contentTypeKey, block.InternalName);
      return published ? { status: 'ok' } : { status: 'exists' };
    }

    if (!createRes.ok) {
      const err = await createRes.text();
      return { status: 'error', detail: `Create failed (${createRes.status}): ${err}` };
    }

    const created = (await createRes.json()) as {
      key?: string;
      initialVersion?: { version?: string };
    };
    const contentKey = created.key;
    const version = created.initialVersion?.version;

    if (!contentKey || !version) {
      return { status: 'error', detail: 'Missing key or version in create response' };
    }

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
      return { status: 'error', detail: `Publish failed (${pubRes.status}): ${err}` };
    }

    return { status: 'ok' };
  } catch (err) {
    return {
      status: 'error',
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
