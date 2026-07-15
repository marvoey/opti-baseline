import { ParameterType } from '@optimizely-opal/opal-tools-sdk/dist/models';
import { broadcast } from '../opal/_store';
import type { ToolParameter } from './types';

export const OPAL_PARAMETERS: ToolParameter[] = [
  {
    name: 'payload',
    type: ParameterType.Dictionary,
    description: 'The JSON payload from the agent — must include clientId and correlationId alongside the structured output fields.',
    required: true,
  },
];

const FILE = 'api/_tools/_opalHandler.ts';

export function createOpalHandler(name: string) {
  return async function handler({ payload }: Record<string, unknown>) {
    console.log(`[${FILE}:17 / ${name}] ► handler invoked`);
    console.log(`[${FILE}:18 / ${name}] raw payload:`, JSON.stringify(payload));

    const p = (payload && typeof payload === 'object' && !Array.isArray(payload))
      ? (payload as Record<string, unknown>)
      : {};

    const { clientId, correlationId, ...content } = p;

    console.log(`[${FILE}:27 / ${name}] clientId:`, clientId ?? '⚠️  missing');
    console.log(`[${FILE}:28 / ${name}] correlationId:`, correlationId ?? '⚠️  missing');
    console.log(`[${FILE}:34 / ${name}] content to broadcast:`, JSON.stringify(content));

    if (!clientId || !correlationId) {
      console.warn(`[${FILE}:31 / ${name}] ⚠️  clientId or correlationId missing — response cannot be routed`);
    }

    broadcast(
      typeof clientId === 'string' ? clientId : '',
      typeof correlationId === 'string' ? correlationId : '',
      content,
    );

    console.log(`[${FILE}:38 / ${name}] ✓ broadcast dispatched`);
    return { success: true };
  };
}
