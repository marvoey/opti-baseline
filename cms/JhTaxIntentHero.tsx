import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import IntentHeroClient, { type HeroVariant } from '@/app/_components/jh/IntentHeroClient';

export const JhTaxIntentHeroContentType = contentType({
  key: 'JhTaxIntentHero',
  baseType: '_component',
  displayName: 'JH Tax Intent Hero Banner',
  description:
    'Homepage banner with a baseline plus three test variations: Walmart Walk-In (A), Flat $25 Online (B), Refund Advance (C).',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    // Baseline / control
    BadgeText: { type: 'string', displayName: 'Top Badge Text', isLocalized: true, sortOrder: 1 },
    Headline: { type: 'string', displayName: 'Baseline Headline', isLocalized: true, sortOrder: 2 },
    Subheadline: { type: 'string', displayName: 'Baseline Subheadline', isLocalized: true, sortOrder: 3 },
    CtaLabel: { type: 'string', displayName: 'Baseline CTA Button Text', isLocalized: true, sortOrder: 4 },
    // Variation A: Walmart Walk-In / Convenience
    WalmartHypothesis: { type: 'string', displayName: 'Variation A – Hypothesis', isLocalized: true, sortOrder: 9 },
    WalmartHeadline: { type: 'string', displayName: 'Variation A – Headline (Walmart)', isLocalized: true, sortOrder: 10 },
    WalmartSubheadline: { type: 'string', displayName: 'Variation A – Subheadline', isLocalized: true, sortOrder: 11 },
    WalmartCta: { type: 'string', displayName: 'Variation A – CTA', isLocalized: true, sortOrder: 12 },
    // Variation B: Flat $25 Online DIY
    OnlineHypothesis: { type: 'string', displayName: 'Variation B – Hypothesis', isLocalized: true, sortOrder: 19 },
    OnlineHeadline: { type: 'string', displayName: 'Variation B – Headline ($25 Online)', isLocalized: true, sortOrder: 20 },
    OnlineSubheadline: { type: 'string', displayName: 'Variation B – Subheadline', isLocalized: true, sortOrder: 21 },
    OnlineCta: { type: 'string', displayName: 'Variation B – CTA', isLocalized: true, sortOrder: 22 },
    // Variation C: Refund Advance seekers
    AdvanceHypothesis: { type: 'string', displayName: 'Variation C – Hypothesis', isLocalized: true, sortOrder: 29 },
    AdvanceHeadline: { type: 'string', displayName: 'Variation C – Headline (Refund Advance)', isLocalized: true, sortOrder: 30 },
    AdvanceSubheadline: { type: 'string', displayName: 'Variation C – Subheadline', isLocalized: true, sortOrder: 31 },
    AdvanceCta: { type: 'string', displayName: 'Variation C – CTA', isLocalized: true, sortOrder: 32 },
  },
});

type Props = { content: ContentProps<typeof JhTaxIntentHeroContentType> };

export default function JhTaxIntentHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const variants: HeroVariant[] = [
    {
      id: 'control',
      label: 'Control',
      audience: 'Baseline: all visitors',
      hypothesis: 'Baseline homepage banner used as the control for the A/B/n test.',
      badge: content.BadgeText || '2026 Tax Season Ready',
      headline: content.Headline || 'File Your Taxes with Jackson Hewitt. Max Refund Guaranteed.',
      subheadline:
        content.Subheadline ||
        'File with a local Tax Pro, inside Walmart, or online. Maximum Refund and 100% Accuracy Guarantees.',
      cta: content.CtaLabel || 'Find a Location Near You',
      edit: {
        headline: pa('Headline'),
        subheadline: pa('Subheadline'),
        cta: pa('CtaLabel'),
        hypothesis: {},
      },
    },
    {
      id: 'A',
      label: 'Variation A',
      audience: 'Walmart Walk-In / Convenience',
      hypothesis:
        content.WalmartHypothesis ||
        'Promoting retail convenience and zero-wait walk-ins will increase local office bookings among in-person filers.',
      badge: 'Walmart Walk-In',
      headline: content.WalmartHeadline || 'File While You Shop: Expert Tax Help Inside Your Local Walmart.',
      subheadline:
        content.WalmartSubheadline ||
        'No appointments needed. Walk in today, meet with a certified Tax Pro, and leave with your max refund guaranteed.',
      cta: content.WalmartCta || 'Find a Walmart Tax Pro Near You',
      edit: {
        headline: pa('WalmartHeadline'),
        subheadline: pa('WalmartSubheadline'),
        cta: pa('WalmartCta'),
        hypothesis: pa('WalmartHypothesis'),
      },
    },
    {
      id: 'B',
      label: 'Variation B',
      audience: 'Flat $25 Online DIY',
      hypothesis:
        content.OnlineHypothesis ||
        "Highlighting fixed, no-surprise pricing directly challenges TurboTax's hidden tier upgrades and reduces landing page bounce.",
      badge: '$25 Flat Fee Online',
      headline: content.OnlineHeadline || 'Simple, Flat $25 Tax Filing. Federal & State Included.',
      subheadline:
        content.OnlineSubheadline ||
        'No surprise fees or hidden upgrades based on schedules. Fast, secure online filing from your phone or laptop.',
      cta: content.OnlineCta || 'Start Your $25 Return Today',
      edit: {
        headline: pa('OnlineHeadline'),
        subheadline: pa('OnlineSubheadline'),
        cta: pa('OnlineCta'),
        hypothesis: pa('OnlineHypothesis'),
      },
    },
    {
      id: 'C',
      label: 'Variation C',
      audience: 'Refund Advance Seekers',
      hypothesis:
        content.AdvanceHypothesis ||
        'Leading with $0 fee early liquidity captures early January filers who prioritize immediate access to refund dollars.',
      badge: '0% APR Refund Advance',
      headline: content.AdvanceHeadline || 'Need Cash Fast? Get Up to $3,500 in Minutes with 0% APR.',
      subheadline:
        content.AdvanceSubheadline ||
        "Don't wait weeks for the IRS. Qualified filers can get an Early Refund Advance loan within 24 hours of filing.",
      cta: content.AdvanceCta || 'Apply for Refund Advance',
      edit: {
        headline: pa('AdvanceHeadline'),
        subheadline: pa('AdvanceSubheadline'),
        cta: pa('AdvanceCta'),
        hypothesis: pa('AdvanceHypothesis'),
      },
    },
  ];

  return (
    <section
      {...pa(block)}
      className="bg-gradient-to-b from-jh-navy via-[#0c2e50] to-jh-navy text-white py-14 px-4 sm:px-6 relative overflow-hidden"
    >
      <IntentHeroClient variants={variants} />
    </section>
  );
}
