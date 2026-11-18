/**
 * eHealth plan finder: the coverage types shown as selectable tiles.
 *
 * Shared by the EhHero and EhPlanFinder blocks (server) and the
 * PlanFinderWidget (client). Kept as `.ts` (not `.tsx`) so the
 * `./cms/**\/*.tsx` push glob does not scan it — it defines no content type.
 */

export type PlanTypeKey = 'medicare' | 'individual' | 'employers' | 'dental' | 'shortterm';

export type PlanType = {
  /** Stable value stored in CMS (DefaultPlanType) and sent as `type=` on submit. */
  value: PlanTypeKey;
  /** Tile label. */
  label: string;
  /** Used in the CTA: "Compare {ctaNoun} plans". */
  ctaNoun: string;
  /** Results page the ZIP search goes to (`?zip=xxxxx&type=value` is appended). */
  href: string;
};

export const PLAN_TYPES: PlanType[] = [
  { value: 'medicare', label: 'Medicare Plans', ctaNoun: 'Medicare', href: '/medicare' },
  { value: 'individual', label: 'Individual & Family', ctaNoun: 'health insurance', href: '/individual-and-family' },
  { value: 'employers', label: 'Employers', ctaNoun: 'small business', href: '/small-business' },
  { value: 'dental', label: 'Dental & Vision', ctaNoun: 'dental & vision', href: '/dental-and-vision' },
  { value: 'shortterm', label: 'Short Term Medical', ctaNoun: 'short-term', href: '/short-term' },
];

/** Enum options for a CMS `selectOne` property. */
export const PLAN_TYPE_ENUM = PLAN_TYPES.map((p) => ({ value: p.value, displayName: p.label }));

/** Resolve a stored value to a plan type (defaults to Medicare). */
export function planTypeOf(value: string | null | undefined): PlanType {
  return PLAN_TYPES.find((p) => p.value === value) ?? PLAN_TYPES[0];
}
