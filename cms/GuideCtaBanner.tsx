import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ctaHref, type OptiLink } from './shared';
import { SECTION_BACKGROUNDS, buttonOutline, buttonWhite, sectionBg, sectionClass } from './guideShared';

/** Closing call to action: an LFGreen card with a heading, short text and two buttons. */
export const GuideCtaBannerContentType = contentType({
  key: 'GuideCtaBanner',
  baseType: '_component',
  displayName: '[GUIDE] Call to action',
  description: 'Green card with a heading, short text and up to two buttons.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Body: { type: 'string', displayName: 'Text', isLocalized: true, sortOrder: 20 },
    PrimaryCta: { type: 'link', displayName: 'Primary button', isLocalized: true, sortOrder: 30 },
    SecondaryCta: { type: 'link', displayName: 'Secondary button', isLocalized: true, sortOrder: 40 },
    Background: { type: 'string', displayName: 'Background', enum: SECTION_BACKGROUNDS, sortOrder: 50 },
  },
});

type Props = { content: ContentProps<typeof GuideCtaBannerContentType> };

export default function GuideCtaBanner({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const primary = content.PrimaryCta as OptiLink;
  const secondary = content.SecondaryCta as OptiLink;

  return (
    <section {...pa(block)} className={`${sectionClass} ${sectionBg(content.Background)}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[32px] bg-lfgreen px-8 py-10 md:flex-row md:items-center md:justify-between md:px-14 md:py-12">
        <div className="max-w-2xl">
          {content.Heading && (
            <h2 {...pa('Heading')} className="font-display text-3xl font-extrabold leading-[1.08] md:text-4xl">
              {content.Heading}
            </h2>
          )}
          {content.Body && (
            <p {...pa('Body')} className="mt-3 text-lg leading-relaxed">
              {content.Body}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
