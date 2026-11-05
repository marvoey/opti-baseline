import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ctaHref } from './shared';

/**
 * OpenTable Hero — full-width banner: photo background, eyebrow, serif headline
 * with an italic second line, short body and up to two calls to action.
 * (Own type rather than the shared `HeroBlock`, which carries unrelated
 * personalisation fields and has no emphasis line.)
 */
export const OpenTableHeroContentType = contentType({
  key: 'OpenTableHeroBlock',
  baseType: '_component',
  displayName: 'OpenTable Hero',
  description: 'OpenTable hero: full-width banner with background image, eyebrow, headline with italic emphasis line, body and two CTAs.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Small label above the headline, e.g. "OpenTable Restaurant Solutions".',
      isLocalized: true,
      maxLength: 80,
      sortOrder: 10,
    },
    Headline: {
      type: 'string',
      displayName: 'Headline',
      description: 'First line of the headline.',
      isLocalized: true,
      isRequired: true,
      maxLength: 120,
      sortOrder: 20,
    },
    HeadlineEmphasis: {
      type: 'string',
      displayName: 'Headline emphasis line',
      description: 'Optional second line, shown in italics.',
      isLocalized: true,
      maxLength: 120,
      sortOrder: 30,
    },
    Body: {
      type: 'string',
      displayName: 'Body',
      description: 'One or two supporting sentences.',
      isLocalized: true,
      maxLength: 300,
      sortOrder: 40,
    },
    BackgroundImage: {
      type: 'contentReference',
      displayName: 'Background image',
      description: 'Photo behind the text. A dark overlay is added so the text stays readable.',
      allowedTypes: ['_image'],
      sortOrder: 50,
    },
    PrimaryCta: {
      type: 'link',
      displayName: 'Primary CTA',
      isLocalized: true,
      sortOrder: 60,
    },
    SecondaryCta: {
      type: 'link',
      displayName: 'Secondary CTA',
      isLocalized: true,
      sortOrder: 70,
    },
  },
});

type Props = { content: ContentProps<typeof OpenTableHeroContentType> };

export default function OpenTableHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const image = content.BackgroundImage;
  const imageUrl = image?.item?.Url ?? image?.url?.default ?? null;
  const imageAlt = image?.item && 'AltText' in image.item ? (image.item.AltText ?? '') : '';

  return (
    <section {...pa(block)} className="relative isolate w-full overflow-hidden bg-ink text-white">
      {imageUrl && (
        // Plain <img>: DAM/CMS image hosts vary, so next/image remote patterns can't be fixed up front.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      {/* Left-to-right scrim keeps the text readable over any photo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />

      <div className="page-width py-20 md:py-32">
        {content.Eyebrow && (
          <p {...pa('Eyebrow')} className="eyebrow uppercase tracking-wide">
            {content.Eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-2xl text-display">
          <span {...pa('Headline')} className="block">
            {content.Headline}
          </span>
          {content.HeadlineEmphasis && (
            <em {...pa('HeadlineEmphasis')} className="block font-semibold italic">
              {content.HeadlineEmphasis}
            </em>
          )}
        </h1>
        {content.Body && (
          <p {...pa('Body')} className="mt-6 max-w-xl text-lead text-white/90">
            {content.Body}
          </p>
        )}
        {(content.PrimaryCta?.text || content.SecondaryCta?.text) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {content.PrimaryCta?.text && (
              <a {...pa('PrimaryCta')} href={ctaHref(content.PrimaryCta)} className="btn btn-inverse">
                {content.PrimaryCta.text}
              </a>
            )}
            {content.SecondaryCta?.text && (
              <a {...pa('SecondaryCta')} href={ctaHref(content.SecondaryCta)} className="btn btn-outline text-white">
                {content.SecondaryCta.text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
