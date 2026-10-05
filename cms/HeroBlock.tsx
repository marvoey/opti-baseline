import { blockNode } from './shared';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { refUrl } from '@/app/_components/fd/types';

/**
 * HeroBlock — shared with other demos on this CMS instance. This definition mirrors
 * the live CMS type exactly (including the targeting fields the F&D hero doesn't
 * render), so `cms:push:all` is a no-op for it and never triggers a data-loss warning.
 */
export const HeroBlockContentType = contentType({
  key: 'HeroBlock',
  baseType: '_component',
  displayName: 'Hero Block',
  description: 'Full-width hero banner with background image, eyebrow, headline, subheadline, and up to two CTAs.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    MembersOnly: { type: 'boolean', displayName: 'MembersOnly' },
    Eyebrow: {
      type: 'string',
      format: 'shortString',
      displayName: 'Eyebrow',
      description: 'Small label above the headline (e.g. "Summer 2026").',
      isLocalized: true,
    },
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'Main hero heading.',
      isLocalized: true,
      isRequired: true,
    },
    Industry: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Industry',
      description: 'Prospect industry vertical this content targets.',
      indexingType: 'queryable',
      enum: [
        { value: 'CPG_FMCG', displayName: 'CPG / FMCG' },
        { value: 'Beverage_Alcohol', displayName: 'Beverage & Alcohol' },
        { value: 'Tech_Durables', displayName: 'Tech & Durables' },
        { value: 'PersonalCare', displayName: 'Personal Care' },
        { value: 'PackagedFoods', displayName: 'Packaged Foods' },
        { value: 'BeverageAlcohol', displayName: 'Beverage Alcohol' },
      ],
    },
    Persona: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Persona',
      description: 'Buyer persona this content targets.',
      indexingType: 'queryable',
      enum: [
        { value: 'Ecommerce_Lead', displayName: 'Ecommerce Lead' },
        { value: 'Insights_Director', displayName: 'Insights Director' },
        { value: 'Category_Manager', displayName: 'Category Manager' },
        { value: 'Ecommerce_VP', displayName: 'Ecommerce VP' },
        { value: 'Category_Commercial', displayName: 'Category & Commercial' },
      ],
    },
    Solution: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Solution',
      description: 'NIQ solution area this content promotes.',
      indexingType: 'queryable',
      enum: [
        { value: 'DigitalShelf', displayName: 'Digital Shelf' },
        { value: 'ConsumerPanel', displayName: 'Consumer Panel' },
        { value: 'BASES', displayName: 'BASES' },
      ],
    },
    Subheadline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Subheadline',
      description: 'Supporting text below the headline.',
      isLocalized: true,
    },
    BackgroundImage: { type: 'contentReference', displayName: 'Background Image', allowedTypes: ['_image'] },
    PrimaryCtaLabel: { type: 'string', format: 'shortString', displayName: 'Primary CTA Label', isLocalized: true },
    PrimaryCtaUrl: { type: 'string', format: 'shortString', displayName: 'Primary CTA URL' },
    SecondaryCtaLabel: { type: 'string', format: 'shortString', displayName: 'Secondary CTA Label', isLocalized: true },
    SecondaryCtaUrl: { type: 'string', format: 'shortString', displayName: 'Secondary CTA URL' },
    Audiences: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Target Audience',
      description: 'ODP audience segment this hero variant is targeted at. Used for personalization rules.',
      enum: [
        { value: '1', displayName: 'First-Time Homebuyers' },
        { value: '2', displayName: 'Homeowners (Refinancing)' },
        { value: '3', displayName: 'Auto Buyers' },
        { value: '4', displayName: 'Young Professionals' },
        { value: '5', displayName: 'Families' },
        { value: '6', displayName: 'Near Retirement (50+)' },
        { value: '7', displayName: 'Retirees' },
        { value: '8', displayName: 'Small Business Owners' },
        { value: '9', displayName: 'Students' },
        { value: '10', displayName: 'Military & Veterans' },
        { value: '11', displayName: 'Wealth Seekers' },
        { value: '12', displayName: 'New Members' },
      ],
    },
  },
});

export default function HeroBlock({ content }: { content: ContentProps<typeof HeroBlockContentType> }) {
  const { pa } = getPreviewUtils(content);
  const bg = refUrl(content.BackgroundImage);

  return (
    <section {...pa(blockNode(content))} className="relative bg-neutral-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" className="w-full h-full object-cover opacity-35" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/70 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl flex flex-col items-start">
          {content.Eyebrow && (
            <span {...pa('Eyebrow')} className="bg-brand-orange text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded mb-4">
              {content.Eyebrow}
            </span>
          )}
          <h1 {...pa('Headline')} className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">{content.Headline}</h1>
          {content.Subheadline && (
            <p {...pa('Subheadline')} className="text-neutral-200 text-base sm:text-lg mb-8 leading-relaxed">{content.Subheadline}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {content.PrimaryCtaLabel && (
              <Link href={content.PrimaryCtaUrl ?? '#'} className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-7 py-3.5 rounded shadow-lg flex items-center gap-2 transition">
                {content.PrimaryCtaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {content.SecondaryCtaLabel && (
              <Link href={content.SecondaryCtaUrl ?? '#'} className="bg-white hover:bg-neutral-100 text-brand-navy font-bold px-7 py-3.5 rounded shadow-lg flex items-center gap-2 transition">
                {content.SecondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
