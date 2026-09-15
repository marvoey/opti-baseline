// Small shared helpers for the CMS block components. Kept as `.ts` (not `.tsx`)
// so the `./cms/**/*.tsx` push glob does not scan it — only files that define
// content types should be picked up by `opti-cli config push`.

/** The shape Graph returns for a `link` property. */
export type OptiLink = {
  text: string | null;
  title: string | null;
  target: string | null;
  url: { default: string | null } | null;
} | null;

/** Resolve a usable href from a `link` property (falls back to '#'). */
export function ctaHref(link: OptiLink): string {
  return link?.url?.default ?? '#';
}

/** Standardized taxonomy properties for intent-driven assembly via Optimizely Graph. */
export const intentTaxonomyProperties = {
  Intent: {
    type: 'string',
    displayName: 'Intent Tag',
    description: 'High-level user intent (e.g., explore, evaluate, transact, compliance).',
    isLocalized: false,
    sortOrder: 100,
  },
  Audience: {
    type: 'string',
    displayName: 'Target Audience',
    description: 'Target audience segment (e.g., enterprise, smb, developer, c-suite).',
    isLocalized: false,
    sortOrder: 110,
  },
  Domain: {
    type: 'string',
    displayName: 'Domain / Vertical',
    description: 'Functional domain (e.g., security, cloud, governance, finance).',
    isLocalized: false,
    sortOrder: 120,
  },
  Geo: {
    type: 'string',
    displayName: 'Geo / Region',
    description: 'Geographic region or "global".',
    isLocalized: false,
    sortOrder: 130,
  },
} as const;
