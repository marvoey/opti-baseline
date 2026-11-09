/**
 * Server-side configuration for the Ask Liberty ↔ Mark round trip.
 *
 * Nothing here is public: every value is read from a server-only environment
 * variable. "Ready" means all the pieces exist; the on/off switch itself is the
 * `UseMark` checkbox on the Ask Liberty page in the CMS.
 */

const clean = (v: string | undefined): string | undefined => v?.trim() || undefined;

export function webhookConfig(): { url: string; token?: string } | undefined {
  const url = clean(process.env.OPAL_WEBHOOK_URL);
  if (!url) return undefined;
  return { url, token: clean(process.env.OPAL_WEBHOOK_TOKEN) };
}

/** Bearer token Mark must send to /api/tools/*. Undefined means "refuse everything". */
export function toolToken(): string | undefined {
  return clean(process.env.OPAL_TOOL_TOKEN);
}

export function cmsStoreConfig():
  | { clientId: string; clientSecret: string; folderKey: string }
  | undefined {
  const clientId = clean(process.env.ASK_MARK_CMS_CLIENT_ID);
  const clientSecret = clean(process.env.ASK_MARK_CMS_CLIENT_SECRET);
  const folderKey = clean(process.env.ASK_MARK_RESULTS_FOLDER_KEY);
  if (!clientId || !clientSecret || !folderKey) return undefined;
  return { clientId, clientSecret, folderKey };
}

/** True when the server can run the whole round trip. */
export function markReady(): boolean {
  return Boolean(webhookConfig() && toolToken() && cmsStoreConfig());
}

/** The stand-in for Mark is never available in production. */
export function stubEnabled(): boolean {
  return process.env.ASK_MARK_STUB === 'on' && process.env.VERCEL_ENV !== 'production';
}

/**
 * Questions per minute per client address that one server instance will accept
 * (best effort; the Vercel Firewall rule is the real limit). Default 10. Raised
 * only for the reliability probe on a Preview deployment.
 */
export function askRateLimitPerMinute(): number {
  const n = Number(process.env.ASK_MARK_RATE_LIMIT);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 10;
}
