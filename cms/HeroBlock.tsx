import { contentType, damAssets, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

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
      {content.BackgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src(content.BackgroundImage)}
          alt={getAlt(content.BackgroundImage, '')}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="mx-auto max-w-3xl text-center">
        {content.Eyebrow && (
          <p {...pa('Eyebrow')} className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">
            {content.Eyebrow}
          </p>
        )}
        <h1 {...pa('Headline')} className="text-4xl font-bold sm:text-5xl">
          {content.Headline}
        </h1>
        {content.Subheadline && (
          <p {...pa('Subheadline')} className="mt-4 text-lg text-white/90">
            {content.Subheadline}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-4">
          {content.PrimaryCtaLabel && (
            <a
              {...pa('PrimaryCtaLabel')}
              href={content.PrimaryCtaUrl ?? '#'}
              className="rounded-md bg-white px-6 py-3 font-semibold text-black"
            >
              {content.PrimaryCtaLabel}
            </a>
          )}
          {content.SecondaryCtaLabel && (
            <a
              {...pa('SecondaryCtaLabel')}
              href={content.SecondaryCtaUrl ?? '#'}
              className="rounded-md border border-white px-6 py-3 font-semibold text-white"
            >
              {content.SecondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
