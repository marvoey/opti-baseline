/**
 * Programmatically create and publish a BlankExperience with a pre-built
 * composition tree via the Optimizely CMS Content Management API.
 *
 * Requires the same client-credentials env vars as the admin UI:
 *   OPTIMIZELY_CMS_CLIENT_ID
 *   OPTIMIZELY_CMS_CLIENT_SECRET
 *   OPTIMIZELY_CMS_API_URL  (optional, defaults to https://api.cms.optimizely.com)
 *
 * Usage:
 *   import { seedExperience } from '@/lib/cms/seedExperience';
 *   const result = await seedExperience(jsonInput);
 */

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';
const ROOT_CONTAINER_KEY = process.env.ROOT_CONTAINER ?? '43f936c99b234ea397b261c538ad07c9';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CompositionNode = {
  nodeType: string;
  displayName?: string;
  layoutType?: string;
  displaySettings?: {
    displayTemplate: string;
    settings?: Record<string, string>;
  };
  /** Present on section and component nodes. */
  component?: {
    contentType?: string;
    reference?: string;
    properties?: Record<string, unknown>;
  };
  nodes?: CompositionNode[];
};

/** The JSON file the caller authors. */
export type ExperienceSeed = {
  /** Content type to create. Defaults to "BlankExperience". */
  contentType?: string;
  /** Container key. Defaults to the CMS root container. */
  container?: string;
  displayName: string;
  locale?: string;
  routeSegment?: string;
  /** Optional stable key (UUID without hyphens). Omit to auto-generate. */
  key?: string;
  composition: CompositionNode;
};

export type SeedResult =
  | { ok: true; key: string; version: number; url: string }
  | { ok: false; message: string };

// ---------------------------------------------------------------------------
// Auth (mirrors lib/cms/contentTypes.ts)
// ---------------------------------------------------------------------------

function apiBase(): string {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

function readCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      'Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env ' +
        '(create an API Client in CMS admin → Settings → API Clients).',
    );
  }
  return { clientId, clientSecret };
}

async function getAccessToken(base: string, clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch(`${base}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}). Check credentials.`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Token endpoint returned no access_token.');
  return data.access_token;
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

/** POST /v1/content — creates a bare experience stub, returns key + version. */
async function createExperience(
  base: string,
  token: string,
  seed: ExperienceSeed,
): Promise<{ key: string; version: number }> {
  const body: Record<string, unknown> = {
    contentType: seed.contentType ?? 'BlankExperience',
    container: seed.container ?? ROOT_CONTAINER_KEY,
    initialVersion: {
      displayName: seed.displayName,
      locale: seed.locale ?? 'en',
      ...(seed.routeSegment ? { routeSegment: seed.routeSegment } : {}),
      properties: {},
    },
  };
  if (seed.key) body.key = seed.key;

  const res = await fetch(`${base}/v1/content`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      'cms-skip-validation': '*',
      prefer: 'return=representation',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (res.status === 409) {
    // Already exists — fetch the existing key/version
    const existing = (await res.json()) as { key?: string; version?: number };
    if (existing.key && existing.version != null) return { key: existing.key, version: existing.version };
    throw new Error(`Experience already exists but response is missing key/version.`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /content failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { key?: string; initialVersion?: { version?: number }; version?: number };
  const key = data.key;
  const version = data.initialVersion?.version ?? (data.version as number | undefined);
  if (!key || version == null) throw new Error('POST /content response missing key or version.');
  return { key, version };
}

/** PATCH /v1/content/{key}/versions/{version} — sets the composition tree. */
async function patchComposition(
  base: string,
  token: string,
  key: string,
  version: number,
  composition: CompositionNode,
): Promise<void> {
  const res = await fetch(`${base}/v1/content/${encodeURIComponent(key)}/versions/${version}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/merge-patch+json',
      authorization: `Bearer ${token}`,
      'cms-skip-validation': '*',
    },
    body: JSON.stringify({ composition }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH composition failed (${res.status}): ${text}`);
  }
}

/** POST /v1/content/{key}/versions/{version}:publish */
async function publishVersion(base: string, token: string, key: string, version: number): Promise<void> {
  const res = await fetch(`${base}/v1/content/${encodeURIComponent(key)}/versions/${version}:publish`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Publish failed (${res.status}): ${text}`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function seedExperience(seed: ExperienceSeed): Promise<SeedResult> {
  try {
    const cred = readCredentials();
    const base = apiBase();
    const token = await getAccessToken(base, cred.clientId, cred.clientSecret);

    const { key, version } = await createExperience(base, token, seed);
    await patchComposition(base, token, key, version, seed.composition);
    await publishVersion(base, token, key, version);

    const slug = seed.routeSegment ?? seed.displayName.toLowerCase().replace(/\s+/g, '-');
    return { ok: true, key, version, url: `/${slug}` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
