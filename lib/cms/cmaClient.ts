/**
 * Shared server-only client for the Optimizely CMS SaaS Content Management
 * API (CMA) — OAuth2 client-credentials auth, the same API
 * @optimizely/cms-cli pushes content types to.
 *
 * API shape mirrors node_modules/@optimizely/cms-cli/dist/service/cmsRestClient.js:
 *   token: POST {base}/oauth/token   (grant_type=client_credentials)
 *
 * Extracted from lib/cms/contentTypes.ts so lib/cms/experiences.ts (content
 * item writes) can reuse the same credential/token handling as the existing
 * content-type reader.
 */

const DEFAULT_GATEWAY = 'https://api.cms.optimizely.com';

export const MISSING_CREDENTIALS_MESSAGE =
  'Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in .env to ' +
  'talk to the CMS Management API (create an API Client in CMS admin → ' +
  'Settings → API Clients).';

export function readCredentials():
  | { clientId: string; clientSecret: string }
  | undefined {
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return undefined;
  return { clientId, clientSecret };
}

export function apiBase(): string {
  return (process.env.OPTIMIZELY_CMS_API_URL || DEFAULT_GATEWAY).replace(/\/$/, '');
}

export async function getAccessToken(
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

/** Resolve credentials + base + bearer token in one call, or `undefined` if unconfigured. */
export async function getAuthorizedClient(): Promise<
  { base: string; token: string } | undefined
> {
  const cred = readCredentials();
  if (!cred) return undefined;
  const base = apiBase();
  const token = await getAccessToken(base, cred.clientId, cred.clientSecret);
  return { base, token };
}
