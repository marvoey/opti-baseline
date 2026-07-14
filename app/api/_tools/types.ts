// Import directly from dist/models to avoid pulling in service.js → express
import { ParameterType } from '@optimizely-opal/opal-tools-sdk/dist/models';

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
