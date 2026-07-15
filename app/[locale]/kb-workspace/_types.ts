import type { PolicyContent } from "./_lib/twoPassResolve";

export type LogLevel = 'info' | 'success' | 'error' | 'warn';

export type LogEntry = {
  id: string;
  ts: number;
  level: LogLevel;
  label: string;
  detail?: string;
};

export type OpalPayload = {
  lob?: string;
  LOB?: string;
  topic?: string;
  Topic?: string;
  jurisdiction?: string;
  Jurisdiction?: string;
  reasoning?: string;
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
