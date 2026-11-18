/**
 * Anonymous visitor identity + campaign attribution, shared by proxy.ts (which
 * mints the cookies), the catch-all page and the FX tracking route.
 *
 * - `eh_vid`      stable anonymous visitor id. Feature Experimentation buckets on
 *                 it, so a visitor keeps the same experience across visits.
 * - `eh_campaign` last `?utm_campaign=` value. Becomes the `ehealth_campaign`
 *                 user attribute that the FX audiences target ("aca", "t65").
 *
 * proxy.ts also forwards both values as request headers, because a cookie that
 * was set on THIS response is not yet readable by the page on the first hit.
 * Identity only - no data fetching here.
 */

export const VID_COOKIE = 'eh_vid';
export const CAMPAIGN_COOKIE = 'eh_campaign';
export const VID_HEADER = 'x-eh-vid';
export const CAMPAIGN_HEADER = 'x-eh-campaign';

/** Demo helper: `/?fx_reset=1` mints a fresh visitor id and clears the campaign. */
export const RESET_PARAM = 'fx_reset';

const VID_PATTERN = /^[A-Za-z0-9-]{16,64}$/;
const CAMPAIGN_PATTERN = /^[a-z0-9_-]{1,32}$/;

/** Returns the id when it looks like one we minted, otherwise null. */
export function parseVid(value: string | null | undefined): string | null {
  return value && VID_PATTERN.test(value) ? value : null;
}

/** Normalises a campaign value (lower-case, [a-z0-9_-], max 32) or returns null. */
export function parseCampaign(value: string | null | undefined): string | null {
  const campaign = value?.trim().toLowerCase();
  return campaign && CAMPAIGN_PATTERN.test(campaign) ? campaign : null;
}

export const VID_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const CAMPAIGN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const COOKIE_BASE = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
