import { blockNode } from './shared';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { lines } from '@/app/_components/fd/types';

/**
 * Navy promo panel with copy + checklist + CTA on one side and an image on the
 * other. (The existing shared PromoBannerBlock has no CTA/bullet/image-URL fields
 * and extending it in place would change other demos, so F&D gets its own.)
 */
export const FdPromoSplitContentType = contentType({
  key: 'FdPromoSplit',
  baseType: '_component',
  displayName: 'F&D Promo Split',
  description: 'Promo panel: eyebrow, heading, text, checklist, CTA and side image.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', format: 'shortString', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, isRequired: true, sortOrder: 20 },
    Body: { type: 'string', displayName: 'Body', isLocalized: true, sortOrder: 30 },
    Bullets: { type: 'string', displayName: 'Checklist', description: 'One item per line.', isLocalized: true, sortOrder: 40 },
    CtaLabel: { type: 'string', format: 'shortString', displayName: 'CTA label', isLocalized: true, sortOrder: 50 },
    CtaUrl: { type: 'string', format: 'shortString', displayName: 'CTA URL', sortOrder: 60 },
    ImageUrl: { type: 'string', displayName: 'Image URL', sortOrder: 70 },
  },
});

export default function FdPromoSplit({ content }: { content: ContentProps<typeof FdPromoSplitContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4">
      <div className="bg-brand-navy text-white rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-xl">
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          {content.Eyebrow && (
            <span className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> {content.Eyebrow}
            </span>
          )}
          <h3 {...pa('Heading')} className="text-3xl font-black mb-4">{content.Heading}</h3>
          <p className="text-neutral-300 text-sm mb-6 leading-relaxed">{content.Body}</p>
          <div className="space-y-3 mb-8 text-xs text-neutral-200">
            {lines(content.Bullets).map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-orange" /> {b}
              </div>
            ))}
          </div>
          {content.CtaLabel && (
            <Link href={content.CtaUrl ?? '#'} className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-6 rounded text-sm w-fit transition shadow-md">
              {content.CtaLabel}
            </Link>
          )}
        </div>
        <div className="h-72 lg:h-auto relative">
          {content.ImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.ImageUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      </div>
    </section>
  );
}
