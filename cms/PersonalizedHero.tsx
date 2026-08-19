import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import PersonalizedHeroDemoWidget from '@/app/_components/custom/PersonalizedHeroDemoWidget';

export const PersonalizedHeroContentType = contentType({
  key: 'PersonalizedHero',
  baseType: '_component',
  displayName: 'Personalized Hero (ODP Demo)',
  description: 'Interactive demo showing ODP intent-driven hero personalization with CMS intent blocks.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    // ── Default / No intent ──────────────────────────────────────────
    DefaultHeadline: {
      type: 'string', format: 'shortString',
      displayName: 'Default Headline',
      description: 'Hero headline shown to visitors with no detected ODP intent.',
      isRequired: true, isLocalized: true, sortOrder: 10,
    },
    DefaultSubheadline: {
      type: 'string', format: 'shortString',
      displayName: 'Default Subheadline',
      isRequired: false, isLocalized: true, sortOrder: 20,
    },
    DefaultCtaLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Default CTA Label',
      isRequired: false, isLocalized: true, sortOrder: 30,
    },
    DefaultHeroImage: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Default Hero Image',
      isRequired: false, sortOrder: 40,
    },
    // ── Mortgage intent ──────────────────────────────────────────────
    MortgageHeadline: {
      type: 'string', format: 'shortString',
      displayName: 'Mortgage Headline',
      description: "Shown when ODP detects 'Mortgage' intent.",
      isRequired: false, isLocalized: true, sortOrder: 50,
    },
    MortgageSubheadline: {
      type: 'string', format: 'shortString',
      displayName: 'Mortgage Subheadline',
      isRequired: false, isLocalized: true, sortOrder: 60,
    },
    MortgageCtaLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Mortgage CTA Label',
      isRequired: false, isLocalized: true, sortOrder: 70,
    },
    MortgageHeroImage: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Mortgage Hero Image',
      isRequired: false, sortOrder: 80,
    },
    // ── Wealth intent ────────────────────────────────────────────────
    WealthHeadline: {
      type: 'string', format: 'shortString',
      displayName: 'Wealth Headline',
      description: "Shown when ODP detects 'Wealth & Investments' intent.",
      isRequired: false, isLocalized: true, sortOrder: 90,
    },
    WealthSubheadline: {
      type: 'string', format: 'shortString',
      displayName: 'Wealth Subheadline',
      isRequired: false, isLocalized: true, sortOrder: 100,
    },
    WealthCtaLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Wealth CTA Label',
      isRequired: false, isLocalized: true, sortOrder: 110,
    },
    WealthHeroImage: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Wealth Hero Image',
      isRequired: false, sortOrder: 120,
    },
  },
});

export const PersonalizedHeroDisplayTemplate = displayTemplate({
  key: 'PersonalizedHeroDefault',
  isDefault: true,
  displayName: 'Personalized Hero (ODP Demo)',
  contentType: 'PersonalizedHero',
  settings: {},
});

type Props = { content: ContentProps<typeof PersonalizedHeroContentType> };

function getImageUrl(ref: unknown): string | null {
  if (!ref || typeof ref !== 'object') return null;
  return (ref as { url?: { default?: string | null } }).url?.default ?? null;
}

export default function PersonalizedHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)} className="w-full px-4 sm:px-6 py-10">
      <PersonalizedHeroDemoWidget
        blocks={{
          unknown: {
            headline:    content.DefaultHeadline   ?? 'Turn your home equity into opportunity.',
            subheadline: content.DefaultSubheadline ?? '3.95% Intro APR for 12 months. No closing costs.',
            ctaLabel:    content.DefaultCtaLabel    ?? 'Apply Today',
            heroImageUrl: getImageUrl(content.DefaultHeroImage),
          },
          mortgage: {
            headline:    content.MortgageHeadline   ?? 'Ready to buy your dream home?',
            subheadline: content.MortgageSubheadline ?? "You've been exploring mortgages. Lock in today's low rates.",
            ctaLabel:    content.MortgageCtaLabel    ?? 'Start Pre-Approval',
            heroImageUrl: getImageUrl(content.MortgageHeroImage),
          },
          wealth: {
            headline:    content.WealthHeadline   ?? 'Secure your financial legacy.',
            subheadline: content.WealthSubheadline ?? 'Speak with our Wealth Management team about your goals.',
            ctaLabel:    content.WealthCtaLabel    ?? 'Schedule a Consultation',
            heroImageUrl: getImageUrl(content.WealthHeroImage),
          },
        }}
      />
    </div>
  );
}
