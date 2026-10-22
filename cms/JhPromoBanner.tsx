import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const JhPromoBannerContentType = contentType({
  key: 'JhPromoBanner',
  baseType: '_component',
  displayName: 'JH Promo Banner',
  description: 'Full-width callout strip (e.g. "Need tax help?", satisfaction promise) with an optional CTA.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 1 },
    Text: { type: 'string', displayName: 'Text', isLocalized: true, sortOrder: 2 },
    CtaLabel: { type: 'string', displayName: 'CTA Label', isLocalized: true, sortOrder: 3 },
    CtaHref: { type: 'string', displayName: 'CTA Link', sortOrder: 4 },
    Tone: {
      type: 'string',
      displayName: 'Tone (navy or gold)',
      description: 'Use "gold" for a highlight callout; anything else renders navy.',
      sortOrder: 5,
    },
  },
});

type Props = { content: ContentProps<typeof JhPromoBannerContentType> };

export default function JhPromoBanner({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const gold = content.Tone?.trim().toLowerCase() === 'gold';

  return (
    <section
      {...pa(block)}
      className={`px-4 sm:px-6 py-6 ${gold ? 'bg-jh-gold-light border-y border-jh-gold text-jh-navy' : 'bg-jh-navy text-white'}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 {...pa('Heading')} className="text-lg font-extrabold">
            {content.Heading}
          </h2>
          {content.Text && (
            <p {...pa('Text')} className={`text-sm mt-1 ${gold ? 'text-slate-700' : 'text-blue-100'}`}>
              {content.Text}
            </p>
          )}
        </div>
        {content.CtaLabel && (
          <a
            {...pa('CtaLabel')}
            href={content.CtaHref || '#'}
            className="shrink-0 px-6 py-3 bg-jh-red hover:bg-jh-red-hover text-white font-bold rounded-lg shadow"
          >
            {content.CtaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
