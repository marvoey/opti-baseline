import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ctaHref, type OptiLink } from './shared';
import { ILLUSTRATIONS, buttonOutline, buttonWhite, illustrationSrc } from './guideShared';

/**
 * Setup guide homepage hero: an LFGreen card with headline, two calls to action, short facts
 * ("chips") and a brand illustration. `Highlight` marks one word or phrase of the headline.
 */
export const GuideHeroContentType = contentType({
  key: 'GuideHero',
  baseType: '_component',
  displayName: '[GUIDE] Hero',
  description: 'Big opening banner: headline, two buttons, short facts and an illustration.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Headline: { type: 'string', displayName: 'Headline', isLocalized: true, isRequired: true, sortOrder: 20 },
    Highlight: {
      type: 'string',
      displayName: 'Highlight',
      description: 'A word or phrase from the headline to mark. Leave empty for none.',
      isLocalized: true,
      sortOrder: 30,
    },
    Subcopy: { type: 'string', displayName: 'Subcopy', isLocalized: true, sortOrder: 40 },
    PrimaryCta: { type: 'link', displayName: 'Primary button', isLocalized: true, sortOrder: 50 },
    SecondaryCta: { type: 'link', displayName: 'Secondary button', isLocalized: true, sortOrder: 60 },
    Chips: {
      type: 'array',
      displayName: 'Facts (chips)',
      description: 'Short facts shown as pills, for example "About 1 hour". Up to 5.',
      isLocalized: true,
      maxItems: 5,
      items: { type: 'string' },
      sortOrder: 70,
    },
    Illustration: {
      type: 'string',
      displayName: 'Illustration',
      enum: ILLUSTRATIONS,
      sortOrder: 80,
    },
  },
});

type Props = { content: ContentProps<typeof GuideHeroContentType> };

function HighlightedHeadline({ text, highlight }: { text: string; highlight?: string | null }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-xl bg-white px-2 text-dark-fir [box-decoration-break:clone]">{highlight}</mark>
      {text.slice(at + highlight.length)}
    </>
  );
}

export default function GuideHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const primary = content.PrimaryCta as OptiLink;
  const secondary = content.SecondaryCta as OptiLink;
  const chips = (content.Chips ?? []).filter(Boolean);

  return (
    <section {...pa(block)} className="w-full bg-neutral-3 px-6 pb-12 pt-10 text-dark-fir md:pb-16 md:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[32px] bg-lfgreen px-8 py-10 md:grid-cols-[1fr_320px] md:px-14 md:py-16">
        <div>
          {content.Eyebrow && (
            <p {...pa('Eyebrow')} className="mb-4 text-sm font-bold">
              {content.Eyebrow}
            </p>
          )}
          <h1 {...pa('Headline')} className="font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
            <HighlightedHeadline text={content.Headline ?? ''} highlight={content.Highlight} />
          </h1>
          {content.Subcopy && (
            <p {...pa('Subcopy')} className="mt-6 max-w-xl text-lg leading-relaxed md:text-xl">
              {content.Subcopy}
            </p>
          )}
          {(primary?.text || secondary?.text) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primary?.text && (
                <a {...pa('PrimaryCta')} href={ctaHref(primary)} className={buttonWhite}>
                  {primary.text}
                </a>
              )}
              {secondary?.text && (
                <a {...pa('SecondaryCta')} href={ctaHref(secondary)} className={buttonOutline}>
                  {secondary.text}
                </a>
              )}
            </div>
          )}
          {chips.length > 0 && (
            <ul {...pa('Chips')} className="mt-8 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li key={chip} className="rounded-full border-2 border-dark-fir bg-white px-4 py-1 text-sm font-semibold">
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...pa('Illustration')}
          src={illustrationSrc(content.Illustration)}
          alt=""
          width={320}
          height={320}
          className="mx-auto w-56 md:w-full"
        />
      </div>
    </section>
  );
}
