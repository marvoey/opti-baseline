/**
 * Fetch display templates from the Optimizely CMS SaaS Management API.
 * Same auth pattern as lib/cms/contentTypes.ts (client-credentials OAuth).
 *
 * List:   GET {base}/v1/displaytemplates          -> { items, totalCount }
 * Detail: GET {base}/v1/displaytemplates/{key}    -> DisplayTemplate
 */

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';

export type CmsDisplayTemplateSettingChoice = {
  displayName: string;
  sortOrder?: number;
};

export type CmsDisplayTemplateSetting = {
  displayName: string;
  editor?: string;
  sortOrder?: number;
  choices?: Record<string, CmsDisplayTemplateSettingChoice>;
};

/** Full display template (from the detail endpoint). */
export type CmsDisplayTemplate = {
  key: string;
  displayName: string;
  /** Applies to a specific content type key. */
  contentType?: string;
  /** Applies to a content base type (e.g. _page, _experience). */
  baseType?: string;
  /** Applies to a composition node type (e.g. section, row, column). */
  nodeType?: string;
  isDefault: boolean;
  settings?: Record<string, CmsDisplayTemplateSetting>;
};

/** Summary item returned by the list endpoint (settings are choice counts). */
export type CmsDisplayTemplateSummary = Omit<CmsDisplayTemplate, 'settings'> & {
  settings?: Record<string, number>;
};

export type FetchDisplayTemplatesResult =
  | { ok: true; templates: CmsDisplayTemplateSummary[] }
  | { ok: false; reason: 'missing-credentials' | 'error'; message: string };

export type FetchDisplayTemplateResult =
  | { ok: true; template: CmsDisplayTemplate }
  | { ok: false; reason: 'missing-credentials' | 'not-found' | 'error'; message: string };

const MISSING_CREDENTIALS_MESSAGE =
  'Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env to ' +
  'read display templates from the CMS.';

function readCredentials(): { clientId: string; clientSecret: string } | undefined {
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
    throw new Error(`Token request failed (${res.status}).`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Token endpoint returned no access_token.');
  return data.access_token;
}

export async function fetchCmsDisplayTemplates(): Promise<FetchDisplayTemplatesResult> {
  const cred = readCredentials();
  if (!cred) return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };

  const base = apiBase();
  const pageSize = 100;

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const all: CmsDisplayTemplateSummary[] = [];

    for (let pageIndex = 0; pageIndex <= 50; pageIndex++) {
      const url = new URL(`${base}/v1/displaytemplates`);
      url.searchParams.set('pageIndex', String(pageIndex));
      url.searchParams.set('pageSize', String(pageSize));

      const res = await fetch(url, {
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`displaytemplates request failed (${res.status}).`);

      const page = (await res.json()) as {
        items?: CmsDisplayTemplateSummary[];
        totalCount?: number | null;
      };
      const items = page.items ?? [];
      all.push(...items);

      const reachedTotal =
        typeof page.totalCount === 'number' && all.length >= page.totalCount;
      if (items.length < pageSize || reachedTotal) break;
    }

    return { ok: true, templates: all };
  } catch (err) {
    return { ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}

export type DeleteDisplayTemplateResult =
  | { ok: true }
  | { ok: false; reason: 'missing-credentials' | 'not-found' | 'error'; message: string };

export async function deleteCmsDisplayTemplate(key: string): Promise<DeleteDisplayTemplateResult> {
  const cred = readCredentials();
  if (!cred) return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };

  const base = apiBase();

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const res = await fetch(`${base}/v1/displaytemplates/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { ok: false, reason: 'not-found', message: `No display template with key "${key}".` };
    }
    if (!res.ok) throw new Error(`DELETE displaytemplates/${key} failed (${res.status}).`);

    return { ok: true };
  } catch (err) {
    return { ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}

export async function fetchCmsDisplayTemplate(key: string): Promise<FetchDisplayTemplateResult> {
  const cred = readCredentials();
  if (!cred) return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };

  const base = apiBase();

  try {
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
    const res = await fetch(`${base}/v1/displaytemplates/${encodeURIComponent(key)}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 404) {
      return { ok: false, reason: 'not-found', message: `No display template with key "${key}".` };
    }
    if (!res.ok) throw new Error(`displaytemplates/${key} request failed (${res.status}).`);

    const template = (await res.json()) as CmsDisplayTemplate;
    return { ok: true, template };
  } catch (err) {
    return { ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}
