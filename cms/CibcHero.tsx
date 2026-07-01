import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ChevronRight, BarChart3 } from 'lucide-react';
import { ctaHref, type OptiLink } from './shared';

/**
 * CIBC: Hero — the page's high-impact opener. Eyebrow label, serif headline,
 * supporting subtext and up to two CTAs over the brand teal gradient.
 *
 * Co-locates the content type, its default display template, and the React
 * component (mirrors the nextjs-banner cms/* convention).
 */
export const CibcHeroContentType = contentType({
  key: 'CibcHero',
  baseType: '_component',
  displayName: 'CIBC: Hero',
  description: 'High-impact hero with eyebrow, headline, subtext and up to two CTAs.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', displayName: 'Eyebrow', description: 'Small label above the headline.', isLocalized: true, sortOrder: 10 },
    Headline: { type: 'string', displayName: 'Headline', description: 'Main hero headline.', isLocalized: true, sortOrder: 20 },
    Subtext: { type: 'string', displayName: 'Subtext', description: 'Supporting paragraph.', isLocalized: true, sortOrder: 30 },
    PrimaryCta: { type: 'link', displayName: 'Primary CTA', description: 'Primary call-to-action button.', isLocalized: true, sortOrder: 40 },
    SecondaryCta: { type: 'link', displayName: 'Secondary CTA', description: 'Secondary call-to-action button.', isLocalized: true, sortOrder: 50 },
  },
});

export const CibcHeroDisplayTemplate = displayTemplate({
  key: 'CibcHeroDefault',
  isDefault: true,
  displayName: 'CIBC: Hero',
  contentType: 'CibcHero',
  settings: {
    theme: {
      editor: 'select',
      displayName: 'Theme',
      sortOrder: 0,
      choices: {
        dark: { displayName: 'Teal (dark)', sortOrder: 1 },
        light: { displayName: 'Stone (light)', sortOrder: 2 },
      },
    },
  },
});

type Props = {
  content: ContentProps<typeof CibcHeroContentType>;
  displaySettings?: ContentProps<typeof CibcHeroDisplayTemplate>;
};

export default function CibcHero({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const light = displaySettings?.theme === 'light';
  const primary = content.PrimaryCta as OptiLink;
  const secondary = content.SecondaryCta as OptiLink;

  return (
    <section
      {...pa(block)}
      className={`p-12 rounded-2xl overflow-hidden relative shadow-xl ${
        light ? 'bg-cibc-stone text-cibc-teal-dark' : 'bg-linear-to-br from-cibc-teal to-cibc-teal-dark text-white'
      }`}
    >
      <div className="relative z-10 max-w-2xl">
        {content.Eyebrow ? (
          <span
            {...pa('Eyebrow')}
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-cibc-gold/50 bg-cibc-gold/15 text-cibc-gold tracking-wide"
          >
            {content.Eyebrow}
          </span>
        ) : null}
        {content.Headline ? (
          <h1 {...pa('Headline')} className="font-serif text-4xl md:text-5xl font-semibold mt-5 leading-tight">
            {content.Headline}
          </h1>
        ) : null}
        {content.Subtext ? (
          <p {...pa('Subtext')} className={`mt-5 text-lg ${light ? 'text-cibc-ink/70' : 'text-white/70'}`}>
            {content.Subtext}
          </p>
        ) : null}
        {primary || secondary ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {primary ? (
              <a
                {...pa('PrimaryCta')}
                href={ctaHref(primary)}
                className="bg-cibc-gold text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-cibc-gold-bright transition-all shadow-lg"
              >
                {primary.text ?? 'Learn more'} <ChevronRight size={18} />
              </a>
            ) : null}
            {secondary ? (
              <a
                {...pa('SecondaryCta')}
                href={ctaHref(secondary)}
                className={`px-6 py-3 rounded-lg font-bold border transition-all ${
                  light
                    ? 'border-cibc-teal/30 text-cibc-teal hover:bg-cibc-teal/5'
                    : 'bg-white/5 text-white border-white/30 hover:bg-white/10 hover:border-cibc-gold'
                }`}
              >
                {secondary.text ?? 'Learn more'}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none p-12 overflow-hidden">
        <BarChart3 size={400} className="text-cibc-gold transform translate-x-20 translate-y-20" />
      </div>
    </section>
  );
}
