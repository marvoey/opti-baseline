/**
 * Shared property fragments for the [HRB] content types. Each one mirrors the
 * definition already in the CMS, so a `cms:push --all` is a no-op for them.
 *
 * Named `.ts` (not `.tsx`) so the optimizely.config.mjs `./cms/**\/*.tsx` push
 * glob never scans it — it defines no content type.
 */

const CONTENT_TIERS = [
  { value: 'A', displayName: 'A · Mirrored' },
  { value: 'B', displayName: 'B · Authored' },
  { value: 'C', displayName: 'C · Synthetic' },
];

/** Provenance fields carried by most editorial [HRB] types. */
export function tierProperties() {
  return {
    ContentTier: {
      type: 'string' as const,
      format: 'selectOne',
      displayName: 'Content tier',
      description: 'A = mirrored from hrblock.com, B = authored from the allow-list, C = synthetic.',
      isRequired: false,
      enum: CONTENT_TIERS,
    },
    SourceUrl: {
      type: 'url' as const,
      displayName: 'Source URL',
      description: 'The hrblock.com page this text was copied from.',
      isRequired: false,
    },
    SourceRetrieved: {
      type: 'dateTime' as const,
      displayName: 'Source retrieved',
      description: 'Date the source text was captured. Re-check at T-1 week.',
      isRequired: false,
    },
  };
}

/** Feature Experimentation event sent when a button / link is clicked. */
export function eventKeyProperty(displayName: string, description?: string) {
  return {
    type: 'string' as const,
    format: 'selectOne',
    displayName,
    description:
      description ?? 'Feature Experimentation event sent on click. Choice property, not localized.',
    isRequired: false,
    enum: [
      { value: 'none', displayName: 'None' },
      { value: 'appointment_cta_click', displayName: 'appointment_cta_click' },
      { value: 'diy_start_click', displayName: 'diy_start_click' },
      { value: 'office_search', displayName: 'office_search' },
    ],
  };
}

/**
 * Resolve a display-setting value to a key of `map`, falling back to `fallback`
 * when the setting is unset or holds a choice this build doesn't know.
 */
export function choice<T extends Record<string, string>>(
  map: T,
  value: unknown,
  fallback: keyof T,
): keyof T {
  return typeof value === 'string' && Object.hasOwn(map, value) ? (value as keyof T) : fallback;
}
