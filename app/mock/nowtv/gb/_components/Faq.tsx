import { contentType } from '@optimizely/cms-sdk';
import { ChevronDown } from './Icons';

/**
 * Accordion of frequently asked questions using native `<details>`/`<summary>`.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it
 * can be discovered and pushed by `cms:push`. `FAQS` below is hardcoded, not
 * read from CMS content. `sectionEnabled` lets editors drop it directly into
 * a Visual Builder experience as its own section.
 */
export const NowTvFaqBlockContentType = contentType({
  key: 'NowTvFaqBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'NOW TV Mock: FAQ',
  description: 'Frequently-asked-questions accordion on the NOW TV mock homepage (nowtv.com recreation).',
  properties: {},
});

const FAQS = [
  {
    q: 'What is a NOW Membership?',
    a: 'NOW brings you a world of brilliant entertainment, straight to your screen. As a member, you can enjoy the latest movies, unmissable TV, every HBO Max series, wonderful kids shows and the best live sports.',
  },
  {
    q: 'What devices can I watch on?',
    a: 'You can watch NOW on over 60 different devices. Watch online at NOWTV.com or download the app to watch on the go.',
  },
  {
    q: 'What HBO Max shows can I watch on NOW?',
    a: 'A NOW Entertainment Membership brings you all the biggest returning hit series from HBO — such as the latest season of Euphoria and House of The Dragon — alongside unmissable Sky Originals and exclusive US shows.',
  },
  {
    q: 'What are Boost and Ultra Boost?',
    a: 'Boost and Ultra Boost are add-ons that enhance your streaming experience on the NOW app. With Boost, you can stream ad-free*, in Full HD (1080p), with Dolby Digital 5.1 audio and on 2 devices at once. Ultra Boost adds 4K Ultra HD with Dolby Atmos and 3 devices at once.',
  },
  {
    q: 'How much does a NOW Membership cost?',
    a: 'NOW Entertainment Membership — £7.99 a month. NOW Entertainment & HBO Max Membership — £9.99 a month. NOW Cinema Membership — £9.99 a month. NOW Sports Membership — £34.99 a month. NOW Sports Day Membership — £14.99 for 24 hours.',
  },
];

export default function Faq() {
  return (
    <section className="bg-blue-900 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold text-white sm:text-3xl">Any questions?</h2>
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
