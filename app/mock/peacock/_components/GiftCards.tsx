import { contentType } from '@optimizely/cms-sdk';

/**
 * Single promo banner for Peacock gift cards.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. Copy below is hardcoded, not read
 * from CMS content. `sectionEnabled` lets editors drop it directly into a
 * Visual Builder experience as its own section.
 */
export const PeacockGiftCardsBlockContentType = contentType({
  key: 'PeacockGiftCardsBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: Gift Cards',
  description: 'Gift card promo banner on the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

export default function GiftCards() {
  return (
    <section className="bg-blue-900 px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-blue-950 p-8 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Peacock Gift Cards</h2>
          <p className="mt-2 text-sm text-white/60">
            The perfect gift for that &lsquo;I need a new show&rsquo; person in your life.
          </p>
        </div>
        <a href="#" className="btn-cta shrink-0 rounded-full px-8 py-3 text-sm font-bold text-black">
          Buy Now
        </a>
      </div>
    </section>
  );
}
