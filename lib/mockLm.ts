/**
 * The rehearsal switch of the MOCK Liberty Mutual API (the renewals card demo).
 * Kept free of Node-only imports so proxy.ts, the card and the mock routes can
 * all share it.
 *
 * `?mode=empty|error|slow` on a page is turned into the `x-lm-mode` request
 * header by proxy.ts (this request only, never stored). The renewals card
 * passes it on to the mock API, which checks it again. It is never honoured on
 * Vercel Production.
 */

export const LM_MODE_HEADER = 'x-lm-mode';

export const MODES = ['empty', 'error', 'slow'] as const;
export type Mode = (typeof MODES)[number];

/** Allow-list check for a value that arrives from a URL or header. */
export function parseMode(value: unknown): Mode | undefined {
  return typeof value === 'string' && (MODES as readonly string[]).includes(value) ? (value as Mode) : undefined;
}

export const modeAllowed = (): boolean => process.env.VERCEL_ENV !== 'production';
