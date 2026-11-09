import { cleanResult, type MarkResult } from '@/lib/askMark/parsePayload';

export type AskMarkOutcome =
  | { status: 'result'; payload: MarkResult }
  | { status: 'timeout' }
  | { status: 'error'; code: string }
  | { status: 'aborted' };

/** Parse one server-sent-event block ("event: x\ndata: {...}"). Keep-alive pings return undefined. */
export function parseEvent(block: string): { event: string; data: unknown } | undefined {
  let event = 'message';
  let data = '';
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) data += line.slice(5).trim();
  }
  if (block.startsWith(':') || (!data && event === 'message')) return undefined;
  try {
    return { event, data: data ? JSON.parse(data) : {} };
  } catch {
    return undefined;
  }
}

/**
 * Read the events `/api/opal/ask` streams back until it settles: a result, a
 * timeout, an error, or the connection closing. `onSent` fires when Mark has
 * acknowledged the question. The result is re-validated here too, so only the
 * known fields ever reach the page.
 */
export async function readAskStream(res: Response, onSent?: () => void): Promise<AskMarkOutcome> {
  if (!res.ok || !res.body) return { status: 'error', code: String(res.status) };

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return { status: 'error', code: 'closed' };
    buffer += decoder.decode(value, { stream: true });
    let end: number;
    while ((end = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      const evt = parseEvent(block);
      if (!evt) continue;
      if (evt.event === 'sent') onSent?.();
      else if (evt.event === 'result') {
        const payload = (evt.data as { payload?: Record<string, unknown> }).payload ?? {};
        return { status: 'result', payload: cleanResult(payload) };
      } else if (evt.event === 'timeout') return { status: 'timeout' };
      else if (evt.event === 'error') {
        return { status: 'error', code: String((evt.data as { code?: unknown }).code ?? 'error') };
      }
    }
  }
}
