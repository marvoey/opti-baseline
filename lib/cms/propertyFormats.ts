/**
 * Read the property formats defined in the live CMS via the Optimizely CMS
 * SaaS Content Management API. A PropertyFormat is a semantic format (e.g.
 * `selectMany`, `LinkCollection`) that a property's `format` string can
 * reference to get specialized editor/validation behavior — the format
 * itself isn't documented in @optimizely/cms-sdk or @optimizely/cms-cli, it's
 * data the CMS exposes at runtime.
 *
 * Server-only: uses the OAuth client-credentials (OPTIMIZELY_CMS_CLIENT_ID /
 * _SECRET), same as lib/cms/contentTypes.ts. Fails soft — callers get a typed
 * result rather than a thrown 500.
 *
 * API shape (see cms-openapi.json → components.schemas.PropertyFormat):
 *   token: POST {base}/oauth/token           (grant_type=client_credentials)
 *   list:  GET  {base}/v1/propertyformats    -> { items, totalCount }
 */

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';

export type CmsPropertyFormat = {
  key: string;
  displayName?: string;
  dataType: string;
  /** Only set when dataType is 'array' — the underlying item type. */
  itemType?: string;
  isDeleted?: boolean;
  createdBy?: string;
  created?: string;
  lastModified?: string;
  lastModifiedBy?: string;
};

export type FetchPropertyFormatsResult =
  | { ok: true; formats: CmsPropertyFormat[] }
  | { ok: false; reason: 'missing-credentials' | 'error'; message: string };

const MISSING_CREDENTIALS_MESSAGE =
  'Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env to ' +
  'read property formats from the CMS (create an API Client in CMS admin → ' +
  'Settings → API Clients).';

function readCredentials(): { clientId: string; clientSecret: string } | undefined {
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return undefined;
  return { clientId, clientSecret };
}

function apiBase(): string {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

async function getAccessToken(base: string, clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch(`${base}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Token request failed (${res.status}). Check OPTIMIZELY_CMS_CLIENT_ID / _SECRET.`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Token endpoint returned no access_token.');
  return data.access_token;
}

export async function fetchCmsPropertyFormats(): Promise<FetchPropertyFormatsResult> {
  const cred = readCredentials();
  if (!cred) {
    return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };
  }

  const base = apiBase();
  const pageSize = 100;

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const all: CmsPropertyFormat[] = [];

    for (let pageIndex = 0; pageIndex <= 20; pageIndex++) {
      const url = new URL(`${base}/v1/propertyformats`);
      url.searchParams.set('pageIndex', String(pageIndex));
      url.searchParams.set('pageSize', String(pageSize));

      const res = await fetch(url, {
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`propertyformats request failed (${res.status}).`);
      }

      const page = (await res.json()) as { items?: CmsPropertyFormat[]; totalCount?: number | null };
      const items = page.items ?? [];
      all.push(...items);

      const reachedTotal = typeof page.totalCount === 'number' && all.length >= page.totalCount;
      if (items.length < pageSize || reachedTotal) break;
    }

    return { ok: true, formats: all };
  } catch (err) {
    return { ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}
