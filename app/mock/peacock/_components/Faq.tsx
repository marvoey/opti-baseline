import { contentType } from '@optimizely/cms-sdk';
import { ChevronDown } from './Icons';

/**
 * Accordion of frequently asked questions using native `<details>`/`<summary>`.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. `FAQS` below is hardcoded, not read
 * from CMS content. `sectionEnabled` lets editors drop it directly into a
 * Visual Builder experience as its own section.
 */
export const PeacockFaqBlockContentType = contentType({
  key: 'PeacockFaqBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: FAQ',
  description: 'Frequently-asked-questions accordion on the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

const FAQS = [
  {
    q: 'Why are some MLB games unavailable to stream on Peacock?',
    a: "Due to territorial blackout restrictions, select regular season, special event, and Postseason games may be unavailable on Peacock. Television territory blackout restrictions apply regardless of whether a Club is home or away and regardless of whether a game is televised in that Club's home television territory. For more information visit Peacock's Help Center.",
  },
  {
    q: 'How can I sign up for the Apple TV and Peacock bundle?',
    a: 'Learn more about the Apple TV and Peacock bundle on the plans page above.',
  },
  {
    q: "What's Peacock?",
    a: 'Peacock is a streaming service from NBCUniversal. With tons of hit movies and TV shows, Originals, current NBC & Bravo hits, and LIVE Sports including Premier League, WWE, Golf, Cycling, and more, Peacock is here for whatever you’re in the mood for, from bingewatching to channel surfing.',
  },
  {
    q: 'What can I watch with Peacock Premium vs. Peacock Premium Plus?',
    a: "With Peacock Premium, you can stream hundreds of hit movies, full seasons of iconic TV shows and bingeworthy Peacock Original series, the latest hits from NBC & Bravo, can't-miss live sports, and Peacock Channels 24/7, plus daily live news, late night, and more. To watch Peacock without ads (limited exclusions)* or download select shows and movies to watch offline, upgrade to Peacock Premium Plus.",
  },
  {
    q: 'What devices does Peacock support?',
    a: 'Lots! For instance: Android TV, Apple TV, Fire TV, LG TV, Roku, Samsung, Vizio Smart TV, Xfinity, Chrome OS, macOS, Windows PC, Android phones & tablets, Fire Tablet, iPhone and iPad, PlayStation, Xbox, and Meta VR devices.',
  },
  {
    q: 'Does Peacock have a discount for students?',
    a: 'Yes, eligible college/university students can get 12 months of Peacock Premium at $5.99/mo, instead of the current rate of $12.99/mo. Existing Peacock subscribers may need to take additional steps to redeem.',
  },
  {
    q: 'Where can I get a Peacock Gift Card?',
    a: 'You can purchase Peacock Gift Cards online. New and existing subscribers can redeem Peacock gift cards by entering the redemption code on their account.',
  },
];

export default function Faq() {
  return (
    <section className="bg-blue-950 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold text-white sm:text-3xl">Questions? We&rsquo;ve Got You Covered</h2>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">
                {faq.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-white/50 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
