import { ParameterType } from '@optimizely-opal/opal-tools-sdk/dist/models';
import { broadcast } from '../opal/_store';
import type { ToolParameter } from './types';

export const OPAL_PARAMETERS: ToolParameter[] = [
  {
    name: 'payload',
    type: ParameterType.Dictionary,
    description: 'The JSON payload to deliver to the CRM UI.',
    required: true,
  },
];

export function createOpalHandler(name: string) {
  return async function handler({ payload }: Record<string, unknown>) {
    console.log(`[${name}] payload:`, JSON.stringify(payload));
    broadcast(payload);
    return { success: true };
  };
}
