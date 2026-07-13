// Import directly from dist/models to avoid pulling in service.js → express
import { ParameterType } from '@optimizely-opal/opal-tools-sdk/dist/models';
import { broadcast } from '../opal/_store';

export type ToolParameter = {
  name: string;
  type: ParameterType;
  description: string;
  required: boolean;
};

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: ToolParameter[];
  handler: (parameters: Record<string, unknown>) => Promise<unknown> | unknown;
};

const tools = new Map<string, ToolDefinition>();

export function defineTool(def: ToolDefinition): void {
  tools.set(def.name, def);
}

export function getTool(name: string): ToolDefinition | undefined {
  return tools.get(name);
}

export function getDiscoveryManifest() {
  return {
    functions: Array.from(tools.values()).map((t) => ({
      description: t.description,
      endpoint: `/tools/${t.name}`,
      http_method: 'POST',
      name: t.name,
      parameters: t.parameters.map((p) => ({
        description: p.description,
        name: p.name,
        required: p.required,
        type: p.type,
      })),
    })),
  };
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

defineTool({
  name: 'progressive_opal',
  description: 'Sends a structured JSON payload from Opal to the Progressive Consultant Workspace.',
  parameters: [
    {
      name: 'payload',
      type: ParameterType.Dictionary,
      description: 'The JSON payload to deliver to the CRM UI.',
      required: true,
    },
  ],
  async handler({ payload }) {
    console.log('[progressive_opal] payload:', JSON.stringify(payload));
    broadcast(payload);
    return { success: true };
  },
});
