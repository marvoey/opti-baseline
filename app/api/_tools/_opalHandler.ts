import { parseMarkPayload } from '@/lib/askMark/parsePayload';
import { putResult } from '../opal/_resultStore';
import { ParameterType, ToolError, type ToolParameter } from './types';

export const OPAL_PARAMETERS: ToolParameter[] = [
  {
    name: 'payload',
    type: ParameterType.Dictionary,
    description:
      'The classification of the question. Must include the correlationId you were given, plus intent, product, topic, coverage, state, confidence and reasoning as available.',
    required: true,
  },
];

/**
 * The handler behind the `liberty_ask` tool. It validates what Mark sent, keeps
 * only the known fields, and parks the reply in the CMS for the waiting browser
 * request. It never logs the payload.
 */
export function createOpalHandler(name: string) {
  return async function handler({ payload }: Record<string, unknown>) {
    const parsed = parseMarkPayload(payload);
    if (!parsed.ok) {
      console.warn(`[ask-mark] ${name}: rejected payload (${parsed.reason})`);
      throw new ToolError(400, parsed.reason);
    }

    let stored: boolean;
    const started = Date.now();
    try {
      stored = await putResult(parsed.cid, parsed.result);
    } catch (err) {
      console.error(`[ask-mark] ${name}: could not store reply`, err instanceof Error ? err.message : String(err));
      throw new ToolError(503, 'Could not store the reply');
    }

    // Only the correlation id is logged, never the question or the reply.
    console.log(`[ask-mark] ${name}: reply ${stored ? 'stored' : 'ignored (already stored)'} cid=${parsed.cid} in ${Date.now() - started}ms`);
    return { success: true, stored };
  };
}
