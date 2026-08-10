import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { sfaContainerWidthSettings, containerWidthClass } from './sfaDisplaySettings';
import { taxonomyEnums, PRODUCT_CATEGORY, MAKER_ATTRIBUTE, RECOGNITION, EVENT } from '@/lib/cms/taxonomy';

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
      allowedTypes: ['graph:cmp_PublicImageAsset'],
      sortOrder: 15,
    },
    BackgroundVideo: {
      type: 'contentReference',
      displayName: 'Background Video',
      allowedTypes: ['VideoMedia'],
      sortOrder: 18,
    },
    BackgroundVideoUrl: {
      type: 'string',
      displayName: 'Background Video URL',
      description: 'Paste a YouTube or Vimeo URL to use as the background video. Takes priority over Background Video.',
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
    ProductCategory: { type: 'string', format: 'selectOne', displayName: 'Product Category', isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 50, enum: taxonomyEnums(PRODUCT_CATEGORY) },
    MakerAttribute:  { type: 'string', format: 'selectOne', displayName: 'Maker Attribute',  isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 51, enum: taxonomyEnums(MAKER_ATTRIBUTE) },
    Recognition:     { type: 'string', format: 'selectOne', displayName: 'Recognition',       isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 52, enum: taxonomyEnums(RECOGNITION) },
    Event:           { type: 'string', format: 'selectOne', displayName: 'Event',             isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 53, enum: taxonomyEnums(EVENT) },
  },
});

export const HeroBannerBlockDisplayTemplate = displayTemplate({
  key: 'SFA_HeroBannerBlockDefault',
  contentType: 'SFA_HeroBannerBlock',
  isDefault: true,
  displayName: 'Hero Banner Block',
  settings: sfaContainerWidthSettings,
});

type Props = {
  content: ContentProps<typeof HeroBannerBlockContentType>;
  displaySettings?: ContentProps<typeof HeroBannerBlockDisplayTemplate>;
};

type EmbedVideo =
  | { kind: 'iframe'; url: string }
  | { kind: 'video'; url: string };

function resolveEmbedVideo(raw: string): EmbedVideo | undefined {
  try {
    const u = new URL(raw);
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.hostname.includes('youtu.be')
        ? u.pathname.slice(1)
        : u.searchParams.get('v');
      if (!id) return undefined;
      return {
        kind: 'iframe',
        url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1`,
      };
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (!id) return undefined;
      return {
        kind: 'iframe',
        url: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`,
      };
    }
    return { kind: 'video', url: raw };
  } catch {
    return undefined;
  }
}

export default function HeroBannerBlock({ content, displaySettings }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const widthClass = containerWidthClass(displaySettings?.containerWidth);

  // Priority: external video URL > DAM video > image
  const embedVideo = content.BackgroundVideoUrl ? resolveEmbedVideo(content.BackgroundVideoUrl) : undefined;
  const damVideoSrc = !embedVideo && content.BackgroundVideo ? src(content.BackgroundVideo) : undefined;
  const imageSrc = !embedVideo && !damVideoSrc ? src(content.BackgroundImage) : undefined;

  return (
    <div {...pa(block)} className={widthClass}>
      <section
        className="relative w-full min-h-120 flex items-end overflow-hidden bg-slate-800"
        style={imageSrc ? { backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {embedVideo?.kind === 'iframe' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-[177.78vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2"
              src={embedVideo.url}
              allow="autoplay; fullscreen"
              title=""
            />
          </div>
        )}
        {(embedVideo?.kind === 'video' || damVideoSrc) && (
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={embedVideo?.kind === 'video' ? embedVideo.url : damVideoSrc}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 pl-48 pr-8 py-12 max-w-4xl">
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
    </div>
  );
}
