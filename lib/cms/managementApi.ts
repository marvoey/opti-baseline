/**
 * Minimal CMS Management API client (server-only). Same client_credentials flow as
 * scripts/cms-push.mjs; the token is cached in-process until shortly before it expires.
 */
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');

let cached: { token: string; expiresAt: number } | null = null;

async function getCmsToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    throw new Error('OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET are not set');
  }

  const res = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`CMS token request failed: ${res.status}`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error('CMS token endpoint returned no access_token');

  cached = { token: data.access_token, expiresAt: Date.now() + Math.max(((data.expires_in ?? 300) - 30) * 1000, 0) };
  return data.access_token;
}

/** GET a Management API path (e.g. `/v1/content/<key>/items`) and return the parsed JSON. */
export async function cmsGet<T>(path: string): Promise<T> {
  const token = await getCmsToken();
  const res = await fetch(`${GATEWAY}${path}`, {
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`CMS GET ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

/** POST JSON to a Management API path (e.g. `/v1/content/<key>/versions`) and return the parsed JSON. */
export async function cmsPost<T>(path: string, body: unknown): Promise<T> {
  const token = await getCmsToken();
  const res = await fetch(`${GATEWAY}${path}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', prefer: 'return=representation' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 300);
    throw new Error(`CMS POST ${path} failed: ${res.status}${detail ? ` ${detail}` : ''}`);
  }
  // A 201/204 may come back without a body; treat that as an empty object.
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/** DELETE a Management API path (e.g. `/v1/content/<key>`). Resolves once the CMS accepts it. */
export async function cmsDelete(path: string): Promise<void> {
  const token = await getCmsToken();
  const res = await fetch(`${GATEWAY}${path}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 300);
    throw new Error(`CMS DELETE ${path} failed: ${res.status}${detail ? ` ${detail}` : ''}`);
  }
}
