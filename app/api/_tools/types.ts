/**
 * The parameter types Opal understands, defined here instead of importing
 * @optimizely-opal/opal-tools-sdk. The SDK's own list is exactly these six
 * strings (verified in its dist/models.js), and nothing else from it is used.
 */
export const ParameterType = {
  Boolean: 'boolean',
  Dictionary: 'object',
  Integer: 'integer',
  List: 'array',
  Number: 'number',
  String: 'string',
} as const;

export type ParameterType = (typeof ParameterType)[keyof typeof ParameterType];

export type ToolParameter = {
  name: string;
  type: ParameterType;
  description: string;
  required: boolean;
};

/** Thrown by a tool handler to answer with a specific HTTP status. */
export class ToolError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: ToolParameter[];
  handler: (parameters: Record<string, unknown>) => Promise<unknown> | unknown;
};
