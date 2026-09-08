import { contentType } from '@optimizely/cms-sdk';

/**
 * Multi-column footer-style link directory (Browse, Sports, Collections,
 * Peacock Originals, Trending, About).
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. `EXPLORE_COLUMNS` below is
 * hardcoded, not read from CMS content. `sectionEnabled` lets editors drop it
 * directly into a Visual Builder experience as its own section.
 */
export const PeacockExploreMoreBlockContentType = contentType({
  key: 'PeacockExploreMoreBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: Explore More',
  description: 'Multi-column link directory on the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

const EXPLORE_COLUMNS = [
  {
    heading: 'Browse',
    links: ['TV Shows', 'Movies', 'News', 'Kids', 'Sports', 'Channels', 'Sitemap', 'Peacock Blog'],
  },
  {
    heading: 'Sports',
    links: ['Premier League', 'NBA', 'WNBA', 'NFL', 'Big Ten Football', 'Bundesliga', 'MLB', 'All Sports'],
  },
  {
    heading: 'Collections',
    links: [
      'What to Watch',
      'New on Peacock',
      'Reality TV',
      'Must-See Movies',
      'Bravo Hub',
      'NBC Hub',
      'Romantic Movies & TV Shows',
      'Telemundo Hub',
    ],
  },
  {
    heading: 'Peacock Originals',
    links: ['Married at First Sight', 'M.I.A.', 'The Miniature Wife', 'The Traitors', 'All Her Fault', "The 'Burbs", 'Ted', 'All Peacock Originals'],
  },
  {
    heading: 'Trending',
    links: [
      'The Super Mario Galaxy Movie',
      'Reminders of Him',
      'Next Gen NYC',
      'Obsession',
      "America's Got Talent (AGT)",
      'Below Deck Mediterranean',
      'The Real Housewives of Orange County',
      'Law & Order: SVU',
    ],
  },
  {
    heading: 'About',
    links: [
      'Compare Plans',
      'Closed Captioning',
      'Account',
      'Apple App Store',
      'Google Play Store',
      'Apple TV and Peacock Bundle',
      'Student Discount',
      'Gift Cards',
    ],
  },
];

export default function ExploreMore() {
  return (
    <section className="bg-blue-900 px-6 py-14 text-sm text-white/60">
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
