import type { ToolDefinition, ToolParameter } from './types';

export function createRegistry() {
  const tools = new Map<string, ToolDefinition>();

  function defineTool(def: ToolDefinition): void {
    tools.set(def.name, def);
  }

  function getTool(name: string): ToolDefinition | undefined {
    return tools.get(name);
  }

  function getDiscoveryManifest() {
    return {
      functions: Array.from(tools.values()).map((t) => ({
        description: t.description,
        endpoint: `/tools/${t.name}`,
        http_method: 'POST',
        name: t.name,
        parameters: t.parameters.map((p: ToolParameter) => ({
          description: p.description,
          name: p.name,
          required: p.required,
          type: p.type,
        })),
      })),
    };
  }

  return { defineTool, getTool, getDiscoveryManifest };
}
