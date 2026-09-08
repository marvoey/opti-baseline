import { contentType } from '@optimizely/cms-sdk';

/**
 * Three-column "More Reasons to Love Peacock" grid.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. `FEATURES` below is hardcoded,
 * not read from CMS content. `sectionEnabled` lets editors drop it directly
 * into a Visual Builder experience as its own section.
 */
export const PeacockFeaturesBlockContentType = contentType({
  key: 'PeacockFeaturesBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: Features',
  description: 'Three-column feature highlights grid on the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

const FEATURES = [
  {
    label: 'Peacock Mini-Games',
    heading: 'Stay Connected and Entertained',
    body: 'With multiple ways to watch and limitless entertainment, Peacock is always on hand with new features to explore.',
  },
  {
    label: "Can't Miss Clips",
    heading: 'Never Miss a Moment',
    body: 'Catch up on the highlights and standout moments from your favorite shows, movies, and live events.',
  },
  {
    label: 'Peacock Channels',
    heading: 'Scroll Less, Watch More',
    body: 'Effortlessly find your favorites in the all-new Channels layout with always-on news, sports, shows, movies, and live TV.',
  },
];

export default function Features() {
  return (
    <section className="bg-blue-950 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-extrabold text-white sm:text-3xl">More Reasons to Love Peacock</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="rounded-xl border border-white/10 bg-blue-900 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-200">{feature.label}</p>
              <h3 className="mt-3 text-lg font-bold text-white">{feature.heading}</h3>
              <p className="mt-2 text-sm text-white/60">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
