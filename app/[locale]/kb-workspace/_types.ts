import type { PolicyContent } from "./_lib/twoPassResolve";

export type OpalPayload = {
  lob?: string;
  topic?: string;
  jurisdiction?: string;
  [key: string]: unknown;
};

export type PolicyContentWithDebug = PolicyContent & {
  _debug?: Record<string, unknown>;
};

export type Message = {
  id: string;
  question: string;
  loading: boolean;
  opalPayload: OpalPayload | null;
  policyContent: PolicyContentWithDebug | null;
  contentLoading: boolean;
  error?: string;
};
