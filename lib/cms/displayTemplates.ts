/**
 * Read the display templates defined in the live CMS via the Optimizely CMS SaaS
 * Content Management API (the same API @optimizely/cms-cli pushes to).
 *
 * Server-only: uses the OAuth client-credentials (OPTIMIZELY_CMS_CLIENT_ID /
 * _SECRET). These are NOT required for the app to run (see lib/env.ts), so this
 * fails soft — callers get a typed result they can render an explanation for
 * rather than a thrown 500.
 *
 * Mirrors lib/cms/contentTypes.ts (kept file-local rather than shared, so the
 * two admin data sources stay independent):
 *   token: POST {base}/oauth/token             (grant_type=client_credentials)
 *   list:  GET  {base}/v1/displaytemplates      -> { items, totalCount }
 */

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';

export type CmsDisplayTemplate = {
  key: string;
  displayName: string;
  isDefault?: boolean;
  /** A template targets exactly one of these three. */
  contentType?: string | null;
  baseType?: string | null;
  nodeType?: string | null;
  settings?: Record<string, unknown>;
};

export type FetchDisplayTemplatesResult =
  | { ok: true; displayTemplates: CmsDisplayTemplate[] }
  | { ok: false; reason: 'missing-credentials' | 'error'; message: string };

export type FetchDisplayTemplateResult =
  | { ok: true; displayTemplate: CmsDisplayTemplate }
  | {
      ok: false;
      reason: 'missing-credentials' | 'not-found' | 'error';
      message: string;
    };

export type DeleteDisplayTemplateResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'missing-credentials' | 'not-found' | 'error';
      message: string;
    };

const MISSING_CREDENTIALS_MESSAGE =
  'Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env to ' +
  'read display templates from the CMS (create an API Client in CMS admin → ' +
  'Settings → API Clients).';

function readCredentials():
  | { clientId: string; clientSecret: string }
  | undefined {
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return undefined;
  return { clientId, clientSecret };
}

function apiBase(): string {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

async function getAccessToken(
  base: string,
  clientId: string,
  clientSecret: string,
): Promise<string> {
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
    throw new Error(
      `Token request failed (${res.status}). Check OPTIMIZELY_CMS_CLIENT_ID / _SECRET.`,
    );
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Token endpoint returned no access_token.');
  return data.access_token;
}

export async function fetchCmsDisplayTemplates(): Promise<FetchDisplayTemplatesResult> {
  const cred = readCredentials();
  if (!cred) {
    return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };
  }

  const base = apiBase();
  const pageSize = 100;

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const all: CmsDisplayTemplate[] = [];

    for (let pageIndex = 0; pageIndex <= 50; pageIndex++) {
      const url = new URL(`${base}/v1/displaytemplates`);
      url.searchParams.set('pageIndex', String(pageIndex));
      url.searchParams.set('pageSize', String(pageSize));

      const res = await fetch(url, {
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`displaytemplates request failed (${res.status}).`);
      }

      const page = (await res.json()) as {
        items?: CmsDisplayTemplate[];
        totalCount?: number | null;
      };
      const items = page.items ?? [];
      all.push(...items);

      const reachedTotal =
        typeof page.totalCount === 'number' && all.length >= page.totalCount;
      if (items.length < pageSize || reachedTotal) break;
    }

    return { ok: true, displayTemplates: all };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Fetch a single display template by key — used to export a full, re-importable
 * definition before deleting it.
 */
export async function fetchCmsDisplayTemplate(
  key: string,
): Promise<FetchDisplayTemplateResult> {
  const cred = readCredentials();
  if (!cred) {
    return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };
  }

  const base = apiBase();

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const res = await fetch(`${base}/v1/displaytemplates/${encodeURIComponent(key)}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { ok: false, reason: 'not-found', message: `No display template with key “${key}”.` };
    }
    if (!res.ok) {
      throw new Error(`displaytemplates/${key} request failed (${res.status}).`);
    }

    const displayTemplate = (await res.json()) as CmsDisplayTemplate;
    return { ok: true, displayTemplate };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Delete a display template from the CMS by key. Permanent. */
export async function deleteCmsDisplayTemplate(
  key: string,
): Promise<DeleteDisplayTemplateResult> {
  const cred = readCredentials();
  if (!cred) {
    return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };
  }

  const base = apiBase();

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const res = await fetch(`${base}/v1/displaytemplates/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { ok: false, reason: 'not-found', message: `No display template with key “${key}”.` };
    }
    if (!res.ok) {
      throw new Error(`Delete displaytemplates/${key} failed (${res.status}).`);
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
