import { contentType } from '@optimizely/cms-sdk';

/**
 * Two-tile grid promoting series and movies.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. Tile labels below are hardcoded,
 * not read from CMS content. `sectionEnabled` lets editors drop it directly
 * into a Visual Builder experience as its own section.
 */
export const PeacockShowcaseBlockContentType = contentType({
  key: 'PeacockShowcaseBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: Showcase',
  description: 'Two-tile series/movies showcase on the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

function ShowcaseTile({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-video w-full items-end rounded-xl p-5"
      style={{ background: 'linear-gradient(135deg, var(--color-blue-800), var(--color-blue-950))' }}
    >
      <span className="text-lg font-bold text-white">{label}</span>
    </div>
  );
}

export default function Showcase() {
  return (
    <section className="bg-blue-950 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
        <ShowcaseTile label="New and Buzzworthy Series" />
        <ShowcaseTile label="Your Favorite Movies in the Universe" />
      </div>
    </section>
  );
}
