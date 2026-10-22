import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ctaHref } from './shared';

export const JhPageHeroContentType = contentType({
  key: 'JhPageHero',
  baseType: '_component',
  displayName: 'JH Page Hero',
  description: 'Page intro: breadcrumb, headline, intro copy and up to two calls to action.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Breadcrumb: { type: 'string', displayName: 'Breadcrumb (e.g. Home > Ways to File)', isLocalized: true, sortOrder: 1 },
    Headline: { type: 'string', displayName: 'Headline', isLocalized: true, sortOrder: 2 },
    Intro: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 3 },
    PrimaryCtaLabel: { type: 'string', displayName: 'Primary CTA Label', isLocalized: true, sortOrder: 4 },
    PrimaryCtaHref: { type: 'string', displayName: 'Primary CTA Link', sortOrder: 5 },
    SecondaryCtaLabel: { type: 'string', displayName: 'Secondary CTA Label', isLocalized: true, sortOrder: 6 },
    SecondaryCtaHref: { type: 'string', displayName: 'Secondary CTA Link', sortOrder: 7 },
  },
});

type Props = { content: ContentProps<typeof JhPageHeroContentType> };

export default function JhPageHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const link = (href?: string | null) => ctaHref({ text: null, title: null, target: null, url: { default: href ?? null } });

  return (
    <section {...pa(block)} className="bg-gradient-to-br from-jh-navy to-blue-950 text-white px-4 sm:px-6 py-14">
      <div className="max-w-6xl mx-auto">
        {content.Breadcrumb && (
          <p {...pa('Breadcrumb')} className="text-xs text-blue-200 mb-4">
            {content.Breadcrumb}
          </p>
        )}
        <h1 {...pa('Headline')} className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl">
          {content.Headline}
        </h1>
        {content.Intro && (
          <p {...pa('Intro')} className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
            {content.Intro}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {content.PrimaryCtaLabel && (
            <a
              {...pa('PrimaryCtaLabel')}
              href={link(content.PrimaryCtaHref)}
              className="px-7 py-3.5 bg-jh-red hover:bg-jh-red-hover text-white font-bold rounded-lg shadow-lg"
            >
              {content.PrimaryCtaLabel}
            </a>
          )}
          {content.SecondaryCtaLabel && (
            <a
              {...pa('SecondaryCtaLabel')}
              href={link(content.SecondaryCtaHref)}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-lg"
            >
              {content.SecondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
