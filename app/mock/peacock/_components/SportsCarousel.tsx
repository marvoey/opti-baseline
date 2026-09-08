import { contentType } from '@optimizely/cms-sdk';

/**
 * Horizontally scrollable row of live/upcoming sports events.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. `SPORTS_EVENTS` below is hardcoded,
 * illustrative data — not read from CMS content. `sectionEnabled` lets
 * editors drop it directly into a Visual Builder experience as its own
 * section.
 */
export const PeacockSportsCarouselBlockContentType = contentType({
  key: 'PeacockSportsCarouselBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: Sports Carousel',
  description: 'Live/upcoming sports events row on the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

const SPORTS_EVENTS = [
  { sport: 'MLB', matchup: 'Home Feed: STL at SF', when: 'Live now' },
  { sport: 'NFL', matchup: 'Patriots vs. Seahawks', when: 'Tonight, 11PM' },
  { sport: 'Soccer', matchup: 'Union Berlin vs. Schalke', when: 'Tomorrow, 6PM' },
  { sport: 'MLB', matchup: 'Home Feed: CLE at MIN', when: 'This weekend' },
  { sport: 'Pro Motocross', matchup: 'Race Day Live: Columbus', when: 'This weekend' },
  { sport: 'Soccer', matchup: 'Borussia Dortmund vs. Paderborn', when: 'Next week' },
];

export default function SportsCarousel() {
  return (
    <section className="bg-blue-900 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-200">Stream NFL Kickoff</p>
        <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Nonstop Live Sports and Events</h2>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {SPORTS_EVENTS.map((event) => (
            <div
              key={`${event.sport}-${event.matchup}`}
              className="w-64 shrink-0 rounded-xl border border-white/10 bg-blue-950 p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-blue-200">{event.sport}</p>
              <p className="mt-2 text-sm font-semibold text-white">{event.matchup}</p>
              <p className="mt-1 text-xs text-white/50">{event.when}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
