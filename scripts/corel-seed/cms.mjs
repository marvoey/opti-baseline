/**
 * Minimal Optimizely CMS (Content Management API v1) client for the Corel seed
 * script. Same OAuth client-credentials flow as scripts/cms-push.mjs.
 *
 * Safety:
 *  - never logs the client secret / access token
 *  - retries only idempotent-safe transient failures (429/502/503/504) with backoff
 *  - exposes create/publish/read helpers only — nothing here deletes or moves content
 */

const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const API = `${GATEWAY}/v1`;

let token;

async function getToken(force = false) {
  if (token && !force) return token;
  const { OPTIMIZELY_CMS_CLIENT_ID: id, OPTIMIZELY_CMS_CLIENT_SECRET: secret } = process.env;
  if (!id || !secret) {
    throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET (set them in .env).');
  }
  const res = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: id, client_secret: secret }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data?.access_token) throw new Error('Token endpoint returned no access_token');
  token = data.access_token;
  return token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RETRY_STATUS = new Set([429, 502, 503, 504]);

export class CmsError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/** Low-level request. `body` may be an object (JSON) or FormData. Returns parsed JSON or null. */
export async function request(method, path, { body, contentType, query } = {}) {
  const url = new URL(`${API}${path}`);
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));

  for (let attempt = 1; ; attempt++) {
    const headers = { authorization: `Bearer ${await getToken()}`, accept: 'application/json' };
    let payload;
    if (body instanceof FormData) payload = body;
    else if (body !== undefined) {
      headers['content-type'] = contentType ?? 'application/json';
      payload = JSON.stringify(body);
    }
    const res = await fetch(url, { method, headers, body: payload });

    if (res.status === 401 && attempt === 1) {
      await getToken(true);
      continue;
    }
    if (RETRY_STATUS.has(res.status) && attempt < 5) {
      const retryAfter = Number(res.headers.get('retry-after'));
      await sleep((Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt));
      continue;
    }

    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      /* non-JSON body */
    }
    if (!res.ok) {
      const detail = [json?.title, json?.detail, ...(json?.errors ?? []).map((e) => `${e.field ?? ''}: ${e.detail ?? e.message ?? ''}`)]
        .filter(Boolean)
        .join(' | ');
      throw new CmsError(`${method} ${path} → ${res.status}${detail ? ` — ${detail}` : ''}`, { status: res.status, body: json ?? text });
    }
    // Some create calls answer with an empty/non-JSON body; keep what we can learn from the response.
    if (json === null && (res.headers.get('location') || text)) {
      return { _status: res.status, _location: res.headers.get('location'), _raw: text.slice(0, 300) };
    }
    return json;
  }
}

/** Content key from a create response: body `key`, else the `Location` header (…/content/<key>). */
export function keyOf(result) {
  if (result?.key) return result.key;
  const m = /\/content\/([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})/i.exec(result?._location ?? '');
  return m ? m[1].replace(/-/g, '') : undefined;
}

export const getContent = (key) => request('GET', `/content/${key}`);

/** All children of a container (paged). */
export async function listChildren(containerKey, { contentTypes } = {}) {
  const all = [];
  for (let pageIndex = 0; pageIndex < 100; pageIndex++) {
    const page = await request('GET', `/content/${containerKey}/items`, {
      query: { pageIndex, pageSize: 100, contentTypes: contentTypes?.join(',') },
    });
    const items = page?.items ?? [];
    all.push(...items);
    if (items.length < 100) break;
  }
  return all;
}

export const listVersions = (key, locale) => request('GET', `/content/${key}/versions`, { query: { locales: locale } });

/** Create a content item. `initialVersion` needs at least { displayName, locale }. */
export const createContent = ({ contentType, container, initialVersion }) =>
  request('POST', '/content', { body: { contentType, container, initialVersion } });

/** Create a media item: multipart `content` (JSON) + `file` (binary). */
export function createMedia({ contentType, container, initialVersion, bytes, fileName, mimeType }) {
  const form = new FormData();
  form.append('content', new Blob([JSON.stringify({ contentType, container, initialVersion })], { type: 'application/json' }));
  form.append('file', new Blob([bytes], { type: mimeType || 'application/octet-stream' }), fileName);
  return request('POST', '/content', { body: form });
}

export const publishVersion = (key, version) => request('POST', `/content/${key}/versions/${version}:publish`, { body: {} });
export const patchVersion = (key, version, patch) =>
  request('PATCH', `/content/${key}/versions/${version}`, { body: patch, contentType: 'application/merge-patch+json' });

const GUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/** Read a content-key GUID from the environment (per the cms-content-placement skill). */
export function requireId(name) {
  const value = process.env[name]?.trim();
  if (!value || !GUID.test(value)) {
    throw new Error(`${name} is missing or not a content-key GUID — set it in .env`);
  }
  return value.replace(/-/g, '');
}
