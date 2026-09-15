export type VisitorProfile = "anonymous" | "cpg" | "retail";

export type LocaleKey = "en" | "de" | "fr" | "ja";

export type PluginFilter = "all" | "forms" | "content";

export type TeaserStep = 1 | 2 | 3;

export interface PersonaInfo {
  accountName: string;
  crmStatus: string;
  intentScore: string;
  industry: string;
  heroTag: string;
  headline: string;
  subhead: string;
  cta: string;
  featuredReport: string;
  price: string;
}

export interface LocaleInfo {
  flag: string;
  name: string;
  stat1: string;
  stat1Lbl: string;
  stat2: string;
  stat2Lbl: string;
  articleTitle: string;
  badge: string;
}

export interface RetiredPlugin {
  name: string;
  role: string;
  replacement: string;
  saving: string;
  category: Exclude<PluginFilter, "all">;
}

export interface TelemetryLog {
  ts: string;
  type: string;
  msg: string;
}

export interface FormData {
  name: string;
  email: string;
  company: string;
  category: string;
}
