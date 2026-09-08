import { contentType } from '@optimizely/cms-sdk';
import { ShowcaseTile } from './ShowcaseTile';

/**
 * Entertainment showcase tile plus a "New & Trending" title strip.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it
 * can be discovered and pushed by `cms:push`. `NEW_AND_TRENDING` below is
 * hardcoded, not read from CMS content. `sectionEnabled` lets editors drop
 * it directly into a Visual Builder experience as its own section.
 */
export const NowTvEntertainmentBlockContentType = contentType({
  key: 'NowTvEntertainmentBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'NOW TV Mock: Entertainment',
  description: 'Entertainment showcase and "New & Trending" strip on the NOW TV mock homepage (nowtv.com recreation).',
  properties: {},
});

const NEW_AND_TRENDING = [
  'The Rookie',
  'Bookish',
  'Heated Rivalry',
  'House of the Dragon',
  'Euphoria',
  'The Pitt',
];

export default function Entertainment() {
  return (
    <section className="bg-blue-900 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <ShowcaseTile
          heading="Stream something brilliant"
          body="Sky Originals, exclusive US shows, hit reality, and new seasons of the biggest returning hit series from HBO. It's all yours."
          cta="Choose Entertainment Membership"
        />
        <p className="mt-8 text-sm font-bold text-white">New &amp; Trending</p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {NEW_AND_TRENDING.map((title) => (
            <span key={title} className="shrink-0 rounded-full border border-white/15 bg-blue-950 px-4 py-2 text-sm text-white/80">
              {title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
