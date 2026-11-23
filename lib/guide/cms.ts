import 'server-only';

/**
 * Minimal server-side client for the CMS (SaaS) REST API, used by the /setup-guide accounts.
 * Same behaviour as scripts/lib/cms-api.mjs (which is tooling-only and must not be imported by the
 * app): OAuth client credentials, token reuse, one retry on 401, short backoff on 429/5xx.
 */

const apiBase = () => (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');

let cachedToken: { value: string; at: number } | null = null;

async function getToken(force = false): Promise<string> {
  // Tokens last about 5 minutes; refresh after 4.
  if (!force && cachedToken && Date.now() - cachedToken.at < 4 * 60 * 1000) return cachedToken.value;
  const res = await fetch(`${apiBase()}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: process.env.OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new CmsError(`CMS sign-in failed (${res.status})`, res.status, null);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new CmsError('CMS sign-in returned no token', res.status, null);
  cachedToken = { value: data.access_token, at: Date.now() };
  return data.access_token;
}

export class CmsError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = 'CmsError';
  }
}

type RequestOptions = {
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  /** Status codes returned instead of thrown (for example 404). */
  allow?: number[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function cmsRequest<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  { query, body, allow = [] }: RequestOptions = {},
): Promise<{ status: number; data: T | null }> {
  const url = new URL(`${apiBase()}${path}`);
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== '') url.searchParams.set(k, String(v));

  let refreshed = false;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method,
      headers: {
        authorization: `Bearer ${await getToken()}`,
        accept: 'application/json',
        // Every PATCH in the Content API is RFC 7396 merge-patch.
        ...(body !== undefined
          ? { 'content-type': method === 'PATCH' ? 'application/merge-patch+json' : 'application/json' }
          : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });

    if (res.status === 401 && !refreshed) {
      refreshed = true;
      await getToken(true);
      continue;
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      const retryAfter = Number(res.headers.get('retry-after'));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 5) * 1000 : 300 * 2 ** attempt);
      continue;
    }

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    if (!res.ok && !allow.includes(res.status)) {
      throw new CmsError(`${method} ${path} failed with ${res.status}`, res.status, data);
    }
    return { status: res.status, data: data as T };
  }
}
