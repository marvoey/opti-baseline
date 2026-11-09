/**
 * Validation for what Mark sends back. Only the fields below survive; every
 * string is trimmed and length-capped, `confidence` must be a number from 0 to 1,
 * and anything else is dropped. The result is what gets stored and what reaches
 * the browser, so nothing unexpected can pass through.
 */

export type MarkResult = {
  intent?: string;
  product?: string;
  topic?: string;
  coverage?: string;
  state?: string;
  /** 0 to 1. */
  confidence?: number;
  /** One sentence, shown on the progress card only. */
  reasoning?: string;
};

/** The random handle for one question: a GUID without dashes, as a CMS content key. */
export const CID_RE = /^[0-9a-f]{32}$/;

const SHORT_MAX = 60;
const REASONING_MAX = 200;

function text(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  // Strip control characters, collapse whitespace.
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.slice(0, max) : undefined;
}

function confidence(value: unknown): number | undefined {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 1) return undefined;
  return n;
}

/** Whitelist the classification fields of an object (no correlation id). */
export function cleanResult(input: Record<string, unknown>): MarkResult {
  const out: MarkResult = {};
  const set = <K extends keyof MarkResult>(key: K, value: MarkResult[K]) => {
    if (value !== undefined) out[key] = value;
  };
  set('intent', text(input.intent, SHORT_MAX));
  set('product', text(input.product, SHORT_MAX));
  set('topic', text(input.topic, SHORT_MAX));
  set('coverage', text(input.coverage, SHORT_MAX));
  set('state', text(input.state, SHORT_MAX));
  set('confidence', confidence(input.confidence));
  set('reasoning', text(input.reasoning, REASONING_MAX));
  return out;
}

export type ParsedPayload =
  | { ok: true; cid: string; result: MarkResult }
  | { ok: false; reason: string };

/** Validate the `payload` Mark passes to the `liberty_ask` tool. */
export function parseMarkPayload(payload: unknown): ParsedPayload {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, reason: 'payload must be an object' };
  }
  const p = payload as Record<string, unknown>;
  const cid = typeof p.correlationId === 'string' ? p.correlationId.trim().toLowerCase() : '';
  if (!CID_RE.test(cid)) return { ok: false, reason: 'correlationId is missing or malformed' };
  return { ok: true, cid, result: cleanResult(p) };
}
