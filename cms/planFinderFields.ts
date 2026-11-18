/**
 * Shared CMS properties + prop mapping for the eHealth plan finder.
 *
 * Spread `planFinderProperties()` into a content type's `properties` (EhHero,
 * EhPlanFinder) so both blocks expose the same editor fields, then call
 * `planFinderPropsFrom(content, pa)` in the server component to build the
 * serialisable props for the client <PlanFinderWidget />.
 *
 * Kept as `.ts` (not `.tsx`) so the `./cms/**\/*.tsx` push glob does not scan
 * it — it defines no content type.
 */
import { siteConfig } from '@/lib/siteConfig';
import { PLAN_TYPE_ENUM, PLAN_TYPES, planTypeOf, type PlanType } from './planTypes';

/**
 * Plan finder properties. sortOrder starts at `start` (default 50) so the
 * finder fields sit below a block's own fields.
 */
export function planFinderProperties(start = 50) {
  return {
    FinderHeading: {
      type: 'string' as const,
      displayName: 'Finder heading',
      description: 'Shown above the plan tiles, e.g. "Select the health insurance plan you need".',
      isLocalized: true,
      sortOrder: start,
    },
    DefaultPlanType: {
      type: 'string' as const,
      format: 'selectOne' as const,
      displayName: 'Default plan type',
      description: 'Tile selected when the page loads. Default: Medicare Plans.',
      sortOrder: start + 1,
      enum: PLAN_TYPE_ENUM,
    },
    ZipPlaceholder: {
      type: 'string' as const,
      displayName: 'ZIP code placeholder',
      description: 'Placeholder text in the ZIP code field. Default: "ZIP Code".',
      isLocalized: true,
      sortOrder: start + 2,
    },
    CtaLabel: {
      type: 'string' as const,
      displayName: 'Button label (override)',
      description: 'Leave blank to use "Compare {plan type} plans", which follows the selected tile.',
      isLocalized: true,
      sortOrder: start + 3,
    },
    AgentPrompt: {
      type: 'string' as const,
      displayName: 'Agent prompt',
      description: 'Line above the phone number. Default: "Or speak with an eHealth licensed insurance agent".',
      isLocalized: true,
      sortOrder: start + 4,
    },
    PhoneNumber: {
      type: 'string' as const,
      displayName: 'Phone number',
      description: 'Agent phone number. Default: 1-877-378-1318. Leave blank to use the default.',
      sortOrder: start + 5,
    },
    PhoneSuffix: {
      type: 'string' as const,
      displayName: 'Phone suffix',
      description: 'Shown after the number. Default: "TTY 711".',
      sortOrder: start + 6,
    },
  };
}

/** Props the client widget needs (all serialisable). */
export type PlanFinderWidgetProps = {
  heading: string;
  plans: PlanType[];
  defaultPlan: PlanType['value'];
  zipPlaceholder: string;
  ctaLabel: string | null;
  agentPrompt: string;
  phoneLabel: string;
  phoneHref: string;
  phoneSuffix: string;
  /** On-page-editing attributes from `pa('<Prop>')`, keyed by property name. */
  editAttrs?: Record<string, Record<string, string>>;
};

type FinderContent = {
  FinderHeading?: string | null;
  DefaultPlanType?: string | null;
  ZipPlaceholder?: string | null;
  CtaLabel?: string | null;
  AgentPrompt?: string | null;
  PhoneNumber?: string | null;
  PhoneSuffix?: string | null;
};

const DEFAULT_PHONE = '1-877-378-1318';

/** `tel:` href from any formatted US number (falls back to the site phone). */
function telHref(label: string): string {
  const digits = label.replace(/\D/g, '');
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11) return `tel:+${digits}`;
  return siteConfig.phone.href;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PaFn = (prop: any) => unknown;

export function planFinderPropsFrom(content: unknown, pa?: PaFn): PlanFinderWidgetProps {
  const c = (content ?? {}) as FinderContent;
  const phoneLabel = c.PhoneNumber?.trim() || DEFAULT_PHONE;
  const editAttrs: Record<string, Record<string, string>> = {};
  if (pa) {
    for (const key of ['FinderHeading', 'CtaLabel', 'AgentPrompt', 'PhoneNumber'] as const) {
      editAttrs[key] = (pa(key) ?? {}) as Record<string, string>;
    }
  }
  return {
    heading: c.FinderHeading?.trim() || 'Select the health insurance plan you need',
    plans: PLAN_TYPES,
    defaultPlan: planTypeOf(c.DefaultPlanType).value,
    zipPlaceholder: c.ZipPlaceholder?.trim() || 'ZIP Code',
    ctaLabel: c.CtaLabel?.trim() || null,
    agentPrompt: c.AgentPrompt?.trim() || 'Or speak with an eHealth licensed insurance agent',
    phoneLabel,
    phoneHref: telHref(phoneLabel),
    phoneSuffix: c.PhoneSuffix?.trim() || 'TTY 711',
    editAttrs,
  };
}
