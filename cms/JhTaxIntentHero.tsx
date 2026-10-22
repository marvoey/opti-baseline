import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import IntentHeroClient, { type IntentCopy, type IntentKey } from '@/app/_components/jh/IntentHeroClient';

export const JhTaxIntentHeroContentType = contentType({
  key: 'JhTaxIntentHero',
  baseType: '_component',
  displayName: 'JH Tax Intent Hero Banner',
  description:
    'Hero with dynamic intent switching for Walmart walk-in, $25 DIY online, and Refund Advance audiences.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    BadgeText: { type: 'string', displayName: 'Top Badge Text', isLocalized: true, sortOrder: 1 },
    Headline: { type: 'string', displayName: 'Default Headline', isLocalized: true, sortOrder: 2 },
    Subheadline: { type: 'string', displayName: 'Default Subheadline', isLocalized: true, sortOrder: 3 },
    CtaLabel: { type: 'string', displayName: 'Default CTA Button Text', isLocalized: true, sortOrder: 4 },
    WalmartHeadline: { type: 'string', displayName: 'Walmart Audience Headline', isLocalized: true, sortOrder: 10 },
    WalmartSubheadline: { type: 'string', displayName: 'Walmart Audience Subheadline', isLocalized: true, sortOrder: 11 },
    OnlineHeadline: { type: 'string', displayName: 'DIY Online Headline', isLocalized: true, sortOrder: 20 },
    OnlineSubheadline: { type: 'string', displayName: 'DIY Online Subheadline', isLocalized: true, sortOrder: 21 },
    AdvanceHeadline: { type: 'string', displayName: 'Refund Advance Headline', isLocalized: true, sortOrder: 30 },
    AdvanceSubheadline: { type: 'string', displayName: 'Refund Advance Subheadline', isLocalized: true, sortOrder: 31 },
  },
});

type Props = { content: ContentProps<typeof JhTaxIntentHeroContentType> };

export default function JhTaxIntentHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const defaults = {
    badge: content.BadgeText || '2026 Tax Season Ready',
    headline: content.Headline || 'Maximum Refund Guaranteed. In-Store or Online.',
    subheadline:
      content.Subheadline ||
      'File with over 5,200 local Tax Pros, inside Walmart, or file yourself online for just $25.',
    cta: content.CtaLabel || 'Find a Location Near You',
  };

  const copy: Record<IntentKey, IntentCopy> = {
    default: defaults,
    walmart: {
      badge: '5,200+ Locations • 2,600+ Walmart Kiosks',
      headline: content.WalmartHeadline || 'Expert Tax Prep Right Where You Shop. Walk In or Drop Off Today.',
      subheadline:
        content.WalmartSubheadline ||
        'Meet face-to-face with a certified neighborhood Tax Pro at over 5,200 offices or inside your local Walmart, even on evenings and weekends.',
      cta: 'Book a Walmart or Local Appointment',
    },
    online: {
      badge: '$25 Flat Fee • Federal and State Included',
      headline: content.OnlineHeadline || 'File Your Taxes Online for One Flat $25 Fee. No Surprise Upsells.',
      subheadline:
        content.OnlineSubheadline ||
        'Whether you have a simple W-2, itemized deductions, or side-hustle 1099s, pay just $25 total for Federal and State filing.',
      cta: 'Start Your $25 Online Return',
    },
    advance: {
      badge: '0% APR • $0 Loan Fees • Same-Day Access',
      headline: content.AdvanceHeadline || 'Need Your Tax Refund Money Fast? Get Up to $4,000 Today.',
      subheadline:
        content.AdvanceSubheadline ||
        'Do not wait weeks for the IRS. File with a Jackson Hewitt Tax Pro and apply for a 0% APR Refund Advance loan.',
      cta: 'Check Your Advance Eligibility',
    },
  };

  return (
    <section
      {...pa(block)}
      className="relative bg-gradient-to-br from-blue-800 via-jh-navy to-blue-950 text-white py-12 md:py-16 px-4 sm:px-6 border-b-4 border-jh-red"
    >
      <IntentHeroClient
        copy={copy}
        edit={{
          headline: pa('Headline'),
          subheadline: pa('Subheadline'),
          badge: pa('BadgeText'),
          cta: pa('CtaLabel'),
        }}
      />
    </section>
  );
}
