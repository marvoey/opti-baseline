import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const HeroBannerBlockContentType = contentType({
  key: 'SFA_HeroBannerBlock',
  baseType: '_component',
  displayName: '(_SFA) Hero Banner Block',
  description: 'Full width hero with optional video background, text, and CTAs.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading (H1)',
      isLocalized: true,
      sortOrder: 5,
    },
    Subtext: {
      type: 'richText',
      displayName: 'Subtext',
      isLocalized: true,
      sortOrder: 10,
    },
    BackgroundImage: {
      type: 'contentReference',
      displayName: 'Background Image',
      restrictedTypes: [],
      sortOrder: 15,
    },
    BackgroundVideoUrl: {
      type: 'url',
      displayName: 'Background Video URL',
      sortOrder: 20,
    },
    PrimaryCtaLink: {
      type: 'url',
      displayName: 'Primary CTA',
      sortOrder: 25,
    },
    PrimaryCtaText: {
      type: 'string',
      displayName: 'Primary CTA Text',
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof HeroBannerBlockContentType> };

export default function HeroBannerBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const videoSrc = content.BackgroundVideoUrl?.default;
  const imageSrc = content.BackgroundImage?.url?.default;

  return (
    <section
      {...pa(block)}
      className="relative w-full min-h-[480px] flex items-end overflow-hidden bg-slate-800"
      style={!videoSrc && imageSrc ? { backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {videoSrc && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 px-8 py-12 max-w-4xl">
        {content.Heading && (
          <h1 {...pa('Heading')} className="text-4xl md:text-6xl font-bold text-white mb-4">
            {content.Heading}
          </h1>
        )}
        {content.Subtext && (
          <div {...pa('Subtext')} className="text-lg text-white/90 mb-8 prose prose-invert">
            <RichTextRenderer content={content.Subtext.json} />
          </div>
        )}
        {content.PrimaryCtaLink?.default && content.PrimaryCtaText && (
          <a
            {...pa('PrimaryCtaLink')}
            href={content.PrimaryCtaLink.default}
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-md transition-colors"
          >
            <span {...pa('PrimaryCtaText')}>{content.PrimaryCtaText}</span>
          </a>
        )}
      </div>
    </section>
  );
}
