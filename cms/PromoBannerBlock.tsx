import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const PromoBannerBlockContentType = contentType({
  key: 'PromoBannerBlock',
  baseType: '_component',
  displayName: 'Promo Banner Block',
  description: 'Promotional banner with a background image, headline, and subheadline.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: {
      type: 'string',
      format: 'shortString',
      displayName: 'Eyebrow',
      description: 'Small label above the headline (e.g. "Limited Time").',
      isRequired: false,
      isLocalized: true,
      sortOrder: 10,
    },
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'Primary banner text.',
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
    Subheadline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Subheadline',
      description: 'Secondary banner text.',
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
  },
});

type Props = { content: ContentProps<typeof PromoBannerBlockContentType> };

export default function PromoBannerBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const bgImage = (content.BackgroundImage as { url?: { default?: string | null } } | undefined)?.url?.default;

  return (
    <section
      {...pa(block)}
      className="relative h-[350px] flex items-center overflow-hidden my-8 mx-16 rounded-xl shadow-sm"
    >
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/80 to-blue-950/40" />

      <div className="relative z-10 px-12 text-white max-w-2xl">
        {content.Eyebrow && (
          <p {...pa('Eyebrow')} className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">
            {content.Eyebrow}
          </p>
        )}
        <h2 {...pa('Headline')} className="font-display font-bold text-4xl mb-3 leading-tight">
          {content.Headline ?? 'Special Promotion'}
        </h2>
        {content.Subheadline && (
          <p {...pa('Subheadline')} className="text-white/75 text-lg leading-relaxed">
            {content.Subheadline}
          </p>
        )}
      </div>
    </section>
  );
}
