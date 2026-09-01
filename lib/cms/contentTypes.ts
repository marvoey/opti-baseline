/**
 * Read the content types defined in the live CMS via the Optimizely CMS SaaS
 * Content Management API (the same API @optimizely/cms-cli pushes to).
 *
 * Server-only: uses the OAuth client-credentials (OPTIMIZELY_CMS_CLIENT_ID /
 * _SECRET). These are NOT required for the app to run (see lib/env.ts), so this
 * fails soft — callers get a typed result they can render an explanation for
 * rather than a thrown 500.
 *
 * API shape mirrors node_modules/@optimizely/cms-cli/dist/service/cmsRestClient.js:
 *   token: POST {base}/oauth/token          (grant_type=client_credentials)
 *   list:  GET  {base}/v1/contenttypes      -> { items, totalCount }
 *   one:   GET  {base}/v1/contenttypes/{key} -> ContentType
 */

import {
  MISSING_CREDENTIALS_MESSAGE,
  apiBase,
  getAccessToken,
  readCredentials,
} from './cmaClient';

export type CmsContentTypeProperty = {
  type: string;
  format?: string;
  displayName?: string;
  description?: string;
  isRequired?: boolean;
  isLocalized?: boolean;
  sortOrder?: number;
  allowedTypes?: string[];
  items?: { type?: string; allowedTypes?: string[] };
};

export type CmsContentType = {
  key: string;
  displayName: string;
  baseType?: string | null;
  description?: string;
  /** Origin of the type, e.g. 'system' / 'serverModel' for built-ins. */
  source?: string;
  sortOrder?: number;
  mayContainTypes?: string[];
  compositionBehaviors?: string[];
  properties?: Record<string, CmsContentTypeProperty>;
};

export type FetchContentTypesResult =
  | { ok: true; contentTypes: CmsContentType[] }
  | { ok: false; reason: 'missing-credentials' | 'error'; message: string };

export type FetchContentTypeResult =
  | { ok: true; contentType: CmsContentType }
  | {
      ok: false;
      reason: 'missing-credentials' | 'not-found' | 'error';
      message: string;
    };

export async function fetchCmsContentTypes(): Promise<FetchContentTypesResult> {
  const cred = readCredentials();
  if (!cred) {
    return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };
  }

  const base = apiBase();
  const pageSize = 100;

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const all: CmsContentType[] = [];

    for (let pageIndex = 0; pageIndex <= 50; pageIndex++) {
      const url = new URL(`${base}/v1/contenttypes`);
      url.searchParams.set('pageIndex', String(pageIndex));
      url.searchParams.set('pageSize', String(pageSize));

      const res = await fetch(url, {
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`contenttypes request failed (${res.status}).`);
      }

      const page = (await res.json()) as {
        items?: CmsContentType[];
        totalCount?: number | null;
      };
      const items = page.items ?? [];
      all.push(...items);

      const reachedTotal =
        typeof page.totalCount === 'number' && all.length >= page.totalCount;
      if (items.length < pageSize || reachedTotal) break;
    }

    return { ok: true, contentTypes: all };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Delete a content type by key via the CMS Management API. */
export async function deleteCmsContentType(
  key: string,
): Promise<{ ok: boolean; message?: string }> {
  const cred = readCredentials();
  if (!cred) return { ok: false, message: MISSING_CREDENTIALS_MESSAGE };

  const base = apiBase();
  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const res = await fetch(`${base}/v1/contenttypes/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return {
        ok: false,
        message: `Delete failed (${res.status})${body ? ': ' + body : ''}`,
      };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}

/** Fetch a single content type by key. Used by the /admin/[key] detail page. */
export async function fetchCmsContentType(key: string): Promise<FetchContentTypeResult> {
  const cred = readCredentials();
  if (!cred) {
    return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };
  }

  const base = apiBase();

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const res = await fetch(`${base}/v1/contenttypes/${encodeURIComponent(key)}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { ok: false, reason: 'not-found', message: `No content type with key “${key}”.` };
    }
    if (!res.ok) {
      throw new Error(`contenttypes/${key} request failed (${res.status}).`);
    }

    const contentType = (await res.json()) as CmsContentType;
    return { ok: true, contentType };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
