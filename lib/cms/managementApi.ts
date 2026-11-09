/**
 * A small server-only client for the Optimizely CMS Content Management API,
 * used by the Ask Liberty ↔ Mark round trip to park Mark's reply in the CMS for a
 * few seconds (see docs/ask-liberty-mark-roundtrip-plan.md).
 *
 * It uses its OWN credentials (ASK_MARK_CMS_CLIENT_ID / _SECRET), separate from
 * the build and admin credentials in lib/cms/contentTypes.ts, so it can be
 * revoked on its own. Token fetching follows the same pattern as that file.
 *
 * Endpoints (from the API definition shipped with @optimizely/cms-cli):
 *   POST   /v1/content                    create (key may be chosen)
 *   GET    /v1/content/{key}              does it exist? (a missing key answers 404 in ~80 ms)
 *   GET    /v1/content/{key}/versions     versions with their properties (a missing key is SLOW to
 *                                         answer, about 1 s, so only call it once the item exists)
 *   DELETE /v1/content/{key}              delete (header cms-permanent-delete: true)
 *   GET    /v1/content/{key}/items        children of a folder
 */

import { cmsStoreConfig } from '@/lib/askMark/config';

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';
const REQUEST_TIMEOUT_MS = 8000;

export class CmsRateLimitedError extends Error {
  constructor(public retryAfterMs: number) {
    super('CMS API rate limit (429)');
  }
}

export class CmsApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function apiBase(): string {
  const gateway = (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
  return `${gateway}/v1`;
}

// ---- token cache (per server instance; one refresh at a time) ----------------

let cachedToken: { value: string; expiresAt: number } | undefined;
let tokenInFlight: Promise<string> | undefined;

async function fetchToken(): Promise<string> {
  const cfg = cmsStoreConfig();
  if (!cfg) throw new CmsApiError(500, 'CMS store is not configured');
  const gateway = (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
  const res = await fetch(`${gateway}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new CmsApiError(res.status, `CMS token request failed (${res.status})`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new CmsApiError(502, 'CMS token response had no access_token');
  const lifetimeMs = (typeof data.expires_in === 'number' ? data.expires_in : 300) * 1000;
  // Refresh a minute early.
  cachedToken = { value: data.access_token, expiresAt: Date.now() + Math.max(lifetimeMs - 60_000, 30_000) };
  return data.access_token;
}

async function getToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  tokenInFlight ??= fetchToken().finally(() => {
    tokenInFlight = undefined;
  });
  return tokenInFlight;
}

/** The first part of an error response, to explain a failure in the server log. */
async function detailOf(res: Response): Promise<string> {
  const text = await res.text().catch(() => '');
  return text ? `: ${text.replace(/\s+/g, ' ').slice(0, 300)}` : '';
}

/** CMS calls slower than this are logged, so a slow store shows up in the server log. */
const SLOW_CALL_MS = 1500;

async function cmsFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const started = Date.now();
  const send = async (token: string) =>
    fetch(`${apiBase()}${path}`, {
      ...init,
      headers: { ...(init.headers as Record<string, string>), authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

  let res = await send(await getToken());
  if (res.status === 401) res = await send(await getToken(true)); // token expired early
  const took = Date.now() - started;
  if (took >= SLOW_CALL_MS) {
    // The path holds a key (a random id), never visitor text.
    console.warn(`[ask-mark] slow CMS call ${init.method ?? 'GET'} ${path.replace(/\/content\/[0-9a-f]{32}/, '/content/<key>')} ${took}ms status=${res.status}`);
  }
  if (res.status === 429) {
    const seconds = Number(res.headers.get('retry-after'));
    throw new CmsRateLimitedError(Number.isFinite(seconds) && seconds > 0 ? Math.min(seconds, 10) * 1000 : 1000);
  }
  return res;
}

// ---- the four operations -----------------------------------------------------

export type CreateDraftInput = {
  key: string;
  contentType: string;
  container: string;
  displayName: string;
  properties: Record<string, unknown>;
};

/** Create an item (it starts as a draft and is never published) with a chosen key. Returns false if the key already exists (409). */
export async function createDraftContent(input: CreateDraftInput): Promise<boolean> {
  const locale = process.env.OPTIMIZELY_DEFAULT_LOCALE?.trim() || 'en';
  const res = await cmsFetch('/content', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      key: input.key,
      contentType: input.contentType,
      container: input.container,
      initialVersion: {
        locale,
        displayName: input.displayName,
        // No status: a new item always starts as a draft, and the API refuses one being set.
        properties: input.properties,
      },
    }),
  });
  if (res.status === 409) return false;
  if (!res.ok) throw new CmsApiError(res.status, `CMS create failed (${res.status})${await detailOf(res)}`);
  return true;
}

/**
 * Does an item with this key exist? This is the call to poll with: a missing key
 * answers 404 in about 80 ms, where the versions endpoint takes about 1 s.
 */
export async function contentExists(key: string): Promise<boolean> {
  const res = await cmsFetch(`/content/${encodeURIComponent(key)}`);
  if (res.status === 404) return false;
  if (!res.ok) throw new CmsApiError(res.status, `CMS check failed (${res.status})${await detailOf(res)}`);
  await res.body?.cancel();
  return true;
}

export type CmsVersion = { properties?: Record<string, unknown> };

/** The versions of an item, or undefined if the item does not exist. Slow (about 1 s) for a missing key: check `contentExists` first. */
export async function getContentVersions(key: string): Promise<CmsVersion[] | undefined> {
  const res = await cmsFetch(`/content/${encodeURIComponent(key)}/versions?pageSize=5`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new CmsApiError(res.status, `CMS read failed (${res.status})${await detailOf(res)}`);
  const page = (await res.json()) as { items?: CmsVersion[] };
  return page.items ?? [];
}

/** Delete an item for good (no recycle bin). A missing item counts as already deleted. */
export async function deleteContentPermanently(key: string): Promise<void> {
  const res = await cmsFetch(`/content/${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: { 'cms-permanent-delete': 'true' },
  });
  if (res.status === 404) return;
  if (!res.ok) throw new CmsApiError(res.status, `CMS delete failed (${res.status})${await detailOf(res)}`);
}

/** A folder listing entry. Listings carry no display name, only these fields. */
export type CmsNode = { key?: string; contentType?: string; created?: string; lastModified?: string };

/** Children of a folder (first page only). */
export async function listChildren(folderKey: string, pageSize = 100): Promise<CmsNode[]> {
  const res = await cmsFetch(`/content/${encodeURIComponent(folderKey)}/items?pageSize=${pageSize}`);
  if (!res.ok) throw new CmsApiError(res.status, `CMS list failed (${res.status})${await detailOf(res)}`);
  const page = (await res.json()) as { items?: CmsNode[] };
  return page.items ?? [];
}
