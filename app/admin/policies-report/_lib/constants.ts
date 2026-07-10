export const COPY_TYPES = [
  'Core Principle',
  'Jurisdictional Override',
  'Statutory Disclosure',
  'Procedural Safeguard',
] as const;

export type CopyType = (typeof COPY_TYPES)[number];

export const TYPE_MAP: Record<CopyType, string> = {
  'Core Principle': 'PrgvCorePrinciple',
  'Jurisdictional Override': 'PrgvJurisdictionalOverride',
  'Statutory Disclosure': 'PrgvStatutoryDisclosure',
  'Procedural Safeguard': 'PrgvProceduralSafeguard',
};

export type ItemStatus = 'published' | 'draft' | 'not-imported';

export type ReportItem = {
  internalName: string;
  copyType: CopyType;
  lob: string;
  topic: string;
  jurisdiction: string;
  status: ItemStatus;
};

export type LocalBlock = {
  InternalName: string;
  CopyType: string;
  Taxonomy: { LOB: string; Topic: string; Jurisdiction: string };
};

export type PublishAllResult =
  | { ok: true; published: number; errors: number }
  | { ok: false; message: string };

export type PublishItemResult =
  | { ok: true }
  | { ok: false; message: string; notFound?: boolean };
