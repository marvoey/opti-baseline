import { contentType } from '@optimizely/cms-sdk';
import { ShowcaseTile } from './ShowcaseTile';

/**
 * Cinema showcase tile plus a "Brilliant blockbusters" title strip.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it
 * can be discovered and pushed by `cms:push`. `BLOCKBUSTERS` below is
 * hardcoded, not read from CMS content. `sectionEnabled` lets editors drop
 * it directly into a Visual Builder experience as its own section.
 */
export const NowTvCinemaBlockContentType = contentType({
  key: 'NowTvCinemaBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'NOW TV Mock: Cinema',
  description: 'Cinema showcase and "Brilliant blockbusters" strip on the NOW TV mock homepage (nowtv.com recreation).',
  properties: {},
});

const BLOCKBUSTERS = ['Wicked: For Good', 'Superman', 'One Battle After Another', '28 Years Later', 'Nuremberg', 'The Bad Guys 2'];

export default function Cinema() {
  return (
    <section className="bg-blue-950 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <ShowcaseTile
          heading="Stream hundreds of movies"
          body="We've got one for every mood and moment. Stream more of the latest blockbusters here than anywhere else."
          cta="Choose Cinema Membership"
        />
        <p className="mt-8 text-sm font-bold text-white">Brilliant blockbusters</p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {BLOCKBUSTERS.map((title) => (
            <span key={title} className="shrink-0 rounded-full border border-white/15 bg-blue-900 px-4 py-2 text-sm text-white/80">
              {title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
