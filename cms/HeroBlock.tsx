import { blockNode } from './shared';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { refUrl } from '@/app/_components/fd/types';

/**
 * HeroBlock — already exists in the CMS (shared with other demos); this is a
 * compatible subset (only fields the F&D hero uses), so `cms:push` skips it.
 */
export const HeroBlockContentType = contentType({
  key: 'HeroBlock',
  baseType: '_component',
  displayName: 'Hero Block',
  description: 'Full-width hero banner with background image, eyebrow, headline, subheadline, and up to two CTAs.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', format: 'shortString', displayName: 'Eyebrow', isLocalized: true },
    Headline: { type: 'string', format: 'shortString', displayName: 'Headline', isLocalized: true, isRequired: true },
    Subheadline: { type: 'string', format: 'shortString', displayName: 'Subheadline', isLocalized: true },
    BackgroundImage: { type: 'contentReference', displayName: 'Background Image', allowedTypes: ['_image'] },
    PrimaryCtaLabel: { type: 'string', format: 'shortString', displayName: 'Primary CTA Label', isLocalized: true },
    PrimaryCtaUrl: { type: 'string', format: 'shortString', displayName: 'Primary CTA URL' },
    SecondaryCtaLabel: { type: 'string', format: 'shortString', displayName: 'Secondary CTA Label', isLocalized: true },
    SecondaryCtaUrl: { type: 'string', format: 'shortString', displayName: 'Secondary CTA URL' },
  },
});

export default function HeroBlock({ content }: { content: ContentProps<typeof HeroBlockContentType> }) {
  const { pa } = getPreviewUtils(content);
  const bg = refUrl(content.BackgroundImage);

  return (
    <section {...pa(blockNode(content))} className="relative bg-neutral-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" className="w-full h-full object-cover opacity-35" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/70 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl flex flex-col items-start">
          {content.Eyebrow && (
            <span {...pa('Eyebrow')} className="bg-brand-orange text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded mb-4">
              {content.Eyebrow}
            </span>
          )}
          <h1 {...pa('Headline')} className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">{content.Headline}</h1>
          {content.Subheadline && (
            <p {...pa('Subheadline')} className="text-neutral-200 text-base sm:text-lg mb-8 leading-relaxed">{content.Subheadline}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {content.PrimaryCtaLabel && (
              <Link href={content.PrimaryCtaUrl ?? '#'} className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-7 py-3.5 rounded shadow-lg flex items-center gap-2 transition">
                {content.PrimaryCtaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {content.SecondaryCtaLabel && (
              <Link href={content.SecondaryCtaUrl ?? '#'} className="bg-white hover:bg-neutral-100 text-brand-navy font-bold px-7 py-3.5 rounded shadow-lg flex items-center gap-2 transition">
                {content.SecondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
