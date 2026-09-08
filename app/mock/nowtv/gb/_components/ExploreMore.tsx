import { contentType } from '@optimizely/cms-sdk';

/**
 * Multi-column footer-style link directory (Browse, New & Trending, Must
 * Watch from HBO Max, Must Watch: Sky Originals & Exclusives, Sky Sports on
 * NOW, Movies).
 *
 * Registered as a CMS content type (schema only, no properties yet) so it
 * can be discovered and pushed by `cms:push`. `EXPLORE_COLUMNS` below is
 * hardcoded, not read from CMS content. `sectionEnabled` lets editors drop
 * it directly into a Visual Builder experience as its own section.
 */
export const NowTvExploreMoreBlockContentType = contentType({
  key: 'NowTvExploreMoreBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'NOW TV Mock: Explore More',
  description: 'Multi-column link directory on the NOW TV mock homepage (nowtv.com recreation).',
  properties: {},
});

const EXPLORE_COLUMNS = [
  {
    heading: 'Browse',
    links: ['TV Shows', 'Movies', 'Sports', 'HBO Max', 'Broadband', 'Offers', 'How to Watch'],
  },
  {
    heading: 'New & Trending',
    links: [
      'House of the Dragon',
      'The Rookie',
      'Heated Rivalry',
      'Katie Price: Nothing to Hide',
      'Possession',
      'A Knight of the Seven Kingdoms',
      'Lanterns',
      'The Paper',
    ],
  },
  {
    heading: 'Must Watch from HBO Max',
    links: ['The Pitt', 'Game of Thrones', 'Friends', 'Euphoria', 'The Big Bang Theory', 'The Sopranos', 'Sex and the City', 'Succession'],
  },
  {
    heading: 'Must Watch: Sky Originals & Exclusives',
    links: ['The Day of the Jackal', 'Gangs of London', 'Lockerbie', 'Hacks', 'Sweetpea', 'Brassic', 'Fightland', 'All Her Fault'],
  },
  {
    heading: 'Sky Sports on NOW',
    links: ['Premier League', 'EFL', 'The Masters', 'Formula 1™', 'Ryder Cup', 'World Darts Championship', 'Cricket', 'US Open'],
  },
  {
    heading: 'Movies',
    links: ['Superman', 'One Battle After Another', 'Wicked', 'Sinners', 'A Minecraft Movie', 'Jurassic World: Rebirth', 'Nuremberg', '28 Years Later'],
  },
];

export default function ExploreMore() {
  return (
    <section className="bg-blue-950 px-6 py-14 text-sm text-white/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        {EXPLORE_COLUMNS.map((column) => (
          <div key={column.heading}>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">{column.heading}</h4>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
