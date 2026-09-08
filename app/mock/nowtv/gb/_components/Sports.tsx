import { contentType } from '@optimizely/cms-sdk';

/**
 * Sky Sports promo plus a horizontally scrollable "Coming up" fixtures row.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it
 * can be discovered and pushed by `cms:push`. `SPORTS_FIXTURES` below is
 * hardcoded, illustrative data — not read from CMS content. `sectionEnabled`
 * lets editors drop it directly into a Visual Builder experience as its own
 * section.
 */
export const NowTvSportsBlockContentType = contentType({
  key: 'NowTvSportsBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'NOW TV Mock: Sports',
  description: 'Sky Sports promo and upcoming fixtures row on the NOW TV mock homepage (nowtv.com recreation).',
  properties: {},
});

const SPORTS_FIXTURES = [
  { competition: 'Football', matchup: 'Millwall v Newcastle', when: 'Live now' },
  { competition: 'Football', matchup: 'Bolton v West Ham Utd', when: 'Tonight' },
  { competition: 'Tennis', matchup: 'US Open Quarter Finals', when: 'Tomorrow' },
  { competition: 'Cricket', matchup: 'England v Pakistan: D1', when: 'This weekend' },
  { competition: 'Golf', matchup: 'Solheim Cup Opening Ceremony', when: 'This weekend' },
  { competition: 'Darts', matchup: 'World Darts Championship', when: 'Next week' },
];

export default function Sports() {
  return (
    <section className="bg-blue-950 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-200">Stream live</p>
        <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Stream all of Sky Sports on NOW</h2>
        <p className="mt-2 max-w-xl text-sm text-white/60">
          Access every Sky Sports channel and Sky Sports+ stream instantly. Memberships from £14.99.
        </p>
        <a href="#plans" className="link-themed mt-3 inline-block text-sm font-semibold hover:underline">
          Learn more about Sports
        </a>

        <p className="mt-8 text-sm font-bold text-white">Coming up</p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {SPORTS_FIXTURES.map((fixture) => (
            <div
              key={`${fixture.competition}-${fixture.matchup}`}
              className="w-64 shrink-0 rounded-xl border border-white/10 bg-blue-900 p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-blue-200">{fixture.competition}</p>
              <p className="mt-2 text-sm font-semibold text-white">{fixture.matchup}</p>
              <p className="mt-1 text-xs text-white/50">Stream live · {fixture.when}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
