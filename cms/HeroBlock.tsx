import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const HeroBlockContentType = contentType({
  key: 'HeroBlock',
  baseType: '_component',
  displayName: 'Hero Block',
  description: 'Full-width hero banner with background image, eyebrow, headline, subheadline, and up to two CTAs.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Eyebrow: {
      type: 'string',
      format: 'shortString',
      displayName: 'Eyebrow',
      description: 'Small label above the headline (e.g. "Summer 2026").',
      isRequired: false,
      isLocalized: true,
      sortOrder: 10,
    },
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'Main hero heading.',
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
    Subheadline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Subheadline',
      description: 'Supporting text below the headline.',
      isRequired: false,
      isLocalized: true,
      sortOrder: 30,
    },
    BackgroundImage: {
      type: 'contentReference',
      allowedTypes: ['_Image'],
      displayName: 'Background Image',
      isRequired: false,
      sortOrder: 40,
    },
    PrimaryCtaLabel: {
      type: 'string',
      format: 'shortString',
      displayName: 'Primary CTA Label',
      isRequired: false,
      isLocalized: true,
      sortOrder: 50,
    },
    PrimaryCtaUrl: {
      type: 'string',
      format: 'shortString',
      displayName: 'Primary CTA URL',
      isRequired: false,
      sortOrder: 60,
    },
    SecondaryCtaLabel: {
      type: 'string',
      format: 'shortString',
      displayName: 'Secondary CTA Label',
      isRequired: false,
      isLocalized: true,
      sortOrder: 70,
    },
    SecondaryCtaUrl: {
      type: 'string',
      format: 'shortString',
      displayName: 'Secondary CTA URL',
      isRequired: false,
      sortOrder: 80,
    },
    Audiences: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Target Audience',
      description: 'ODP audience segment this hero variant is targeted at. Used for personalization rules.',
      isRequired: false,
      sortOrder: 90,
      enum: [
        { value: '1',  displayName: 'First-Time Homebuyers'    },
        { value: '2',  displayName: 'Homeowners (Refinancing)'  },
        { value: '3',  displayName: 'Auto Buyers'               },
        { value: '4',  displayName: 'Young Professionals'       },
        { value: '5',  displayName: 'Families'                  },
        { value: '6',  displayName: 'Near Retirement (50+)'     },
        { value: '7',  displayName: 'Retirees'                  },
        { value: '8',  displayName: 'Small Business Owners'     },
        { value: '9',  displayName: 'Students'                  },
        { value: '10', displayName: 'Military & Veterans'       },
        { value: '11', displayName: 'Wealth Seekers'            },
        { value: '12', displayName: 'New Members'               },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof HeroBlockContentType> };

export default function HeroBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const bgImage = (content.BackgroundImage as { url?: { default?: string | null } } | undefined)?.url?.default;

  return (
    <section
      {...pa(block)}
      className="relative h-[520px] overflow-hidden flex items-center"
    >
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-blue-950/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        {content.Eyebrow && (
          <p {...pa('Eyebrow')} className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">
            {content.Eyebrow}
          </p>
        )}

        <h1 {...pa('Headline')} className="font-display font-bold text-5xl text-white leading-tight mb-4 max-w-xl">
          {content.Headline ?? 'Headline'}
        </h1>

        {content.Subheadline && (
          <p {...pa('Subheadline')} className="text-white/80 text-lg mb-8 max-w-md">
            {content.Subheadline}
          </p>
        )}

        {(content.PrimaryCtaLabel || content.SecondaryCtaLabel) && (
          <div className="flex gap-4 flex-wrap">
            {content.PrimaryCtaLabel && (
              <a
                {...pa('PrimaryCtaLabel')}
                href={content.PrimaryCtaUrl ?? '#'}
                className="bg-blue-200 text-blue-950 font-bold px-8 py-3 rounded-full hover:bg-blue-300 transition-colors"
              >
                {content.PrimaryCtaLabel}
              </a>
            )}
            {content.SecondaryCtaLabel && (
              <a
                {...pa('SecondaryCtaLabel')}
                href={content.SecondaryCtaUrl ?? '#'}
                className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                {content.SecondaryCtaLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
