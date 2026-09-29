import { contentType, damAssets, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ArrowRight, Sparkles } from 'lucide-react';

import { industryProperty, personaProperty, solutionProperty } from './taxonomy';

/**
 * HeroBlock — full-width hero banner. This key already exists as a shared
 * content type in the CMS tenant (a banking/mortgage ODP demo uses its
 * `Audiences` property), so this definition mirrors that live schema in full
 * and only adds Industry/Persona/Solution as new optional properties for the
 * NIQ ABM demo — pushing this type must only ever add fields, never drop the
 * ones the other demo depends on.
 */
export const HeroBlockContentType = contentType({
  key: 'HeroBlock',
  baseType: '_component',
  displayName: 'Hero Block',
  description:
    'Full-width hero banner with background image, eyebrow, headline, subheadline, and up to two CTAs.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    MembersOnly: {
      type: 'boolean',
      displayName: 'MembersOnly',
      sortOrder: 1,
    },
    Eyebrow: {
      type: 'string',
      format: 'shortString',
      displayName: 'Eyebrow',
      description: 'Small label above the headline (e.g. "Summer 2026").',
      isLocalized: true,
      sortOrder: 2,
    },
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'Main hero heading.',
      isLocalized: true,
      isRequired: true,
      sortOrder: 3,
    },
    Subheadline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Subheadline',
      description: 'Supporting text below the headline.',
      isLocalized: true,
      sortOrder: 4,
    },
    BackgroundImage: {
      type: 'contentReference',
      displayName: 'Background Image',
      allowedTypes: ['_image'],
      sortOrder: 5,
    },
    PrimaryCtaLabel: {
      type: 'string',
      format: 'shortString',
      displayName: 'Primary CTA Label',
      isLocalized: true,
      sortOrder: 6,
    },
    PrimaryCtaUrl: {
      type: 'string',
      format: 'shortString',
      displayName: 'Primary CTA URL',
      sortOrder: 7,
    },
    SecondaryCtaLabel: {
      type: 'string',
      format: 'shortString',
      displayName: 'Secondary CTA Label',
      isLocalized: true,
      sortOrder: 8,
    },
    SecondaryCtaUrl: {
      type: 'string',
      format: 'shortString',
      displayName: 'Secondary CTA URL',
      sortOrder: 9,
    },
    Audiences: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Target Audience',
      description:
        'ODP audience segment this hero variant is targeted at. Used for personalization rules.',
      sortOrder: 10,
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
    ...industryProperty(20),
    ...personaProperty(21),
    ...solutionProperty(22),
  },
});

type Props = { content: ContentProps<typeof HeroBlockContentType> };

export default function HeroBlock({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const { getAlt } = damAssets(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="relative w-full overflow-hidden px-6 py-24 text-white">
      {/* Fallback gradient — always present, visible whenever there's no background image */}
      <div className="absolute inset-0 -z-30 bg-linear-to-b from-[#070B14] via-[#0A1224] to-[#040812]" />
      <div className="absolute top-0 right-0 -z-20 h-96 w-96 animate-pulse rounded-full bg-[#2D6DF6]/20 blur-3xl [animation-duration:4s]" />
      <div className="absolute bottom-0 inset-x-0 -z-20 h-[3px] bg-gradient-to-r from-[#2D6DF6] via-[#00D2FF] to-transparent" />

      {content.BackgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src(content.BackgroundImage)}
          alt={getAlt(content.BackgroundImage, '')}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}
      {content.BackgroundImage && <div className="absolute inset-0 -z-10 bg-black/50" />}
      <div className="mx-auto max-w-4xl text-center">
        {content.Eyebrow && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 opacity-0 [animation-delay:0ms] [animation-fill-mode:forwards] animate-[fade-slide-up_0.6s_ease-out]">
            <Sparkles className="h-3.5 w-3.5 text-[#00E5FF]" />
            <span {...pa('Eyebrow')} className="text-xs font-bold uppercase tracking-wide text-[#00E5FF]">
              {content.Eyebrow}
            </span>
          </div>
        )}
        <h1
          {...pa('Headline')}
          className="text-4xl font-extrabold tracking-tight opacity-0 [animation-delay:120ms] [animation-fill-mode:forwards] animate-[fade-slide-up_0.6s_ease-out] sm:text-6xl"
        >
          {content.Headline}
        </h1>
        {content.Subheadline && (
          <p
            {...pa('Subheadline')}
            className="mt-4 text-lg text-white/90 opacity-0 [animation-delay:220ms] [animation-fill-mode:forwards] animate-[fade-slide-up_0.6s_ease-out]"
          >
            {content.Subheadline}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-4 opacity-0 [animation-delay:320ms] [animation-fill-mode:forwards] animate-[fade-slide-up_0.6s_ease-out]">
          {content.PrimaryCtaLabel && (
            <a
              href={content.PrimaryCtaUrl ?? '#'}
              className="group inline-flex items-center gap-2 rounded-full bg-[#2D6DF6] px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-600"
            >
              <span {...pa('PrimaryCtaLabel')}>{content.PrimaryCtaLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
          {content.SecondaryCtaLabel && (
            <a
              {...pa('SecondaryCtaLabel')}
              href={content.SecondaryCtaUrl ?? '#'}
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white/90 transition-all hover:bg-white/10"
            >
              {content.SecondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
