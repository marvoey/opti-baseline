import { contentType } from '@optimizely/cms-sdk';
import { CheckIcon } from './Icons';

/**
 * Plan comparison grid (Select / Premium / Premium Plus), anchored at `#plans`.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. `PLANS` below is hardcoded,
 * not read from CMS content. `sectionEnabled` lets editors drop it directly
 * into a Visual Builder experience as its own section.
 */
export const PeacockPricingBlockContentType = contentType({
  key: 'PeacockPricingBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: Pricing',
  description: 'Plan comparison grid on the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

const PLANS = [
  {
    name: 'Select',
    mostPopular: false,
    tagline: 'Watch TV, with ads.',
    features: ['TV Favorites from NBC, Bravo, & More', 'Excludes Sports, Movies and Peacock Originals'],
    monthly: '$8.99/month',
    annual: '$89.99/year',
  },
  {
    name: 'Premium',
    mostPopular: true,
    tagline: 'Watch TV, movies, sports & more, with ads.',
    features: ['TV Favorites from NBC, Bravo, & More', 'LIVE Sports & Events', 'Hit Movies & Peacock Originals'],
    monthly: '$12.99/month',
    annual: '$129.99/year',
  },
  {
    name: 'Premium Plus',
    mostPopular: false,
    tagline: 'Watch TV, movies, sports & more, with no ads (limited exceptions)*',
    features: [
      'TV Favorites from NBC, Bravo, & More',
      'LIVE Sports & Events',
      'Hit Movies & Peacock Originals',
      'Downloads & No Ads (limited exceptions)*',
    ],
    monthly: '$19.99/month',
    annual: '$199.99/year',
  },
];

export default function Pricing() {
  return (
    <section id="plans" className="bg-blue-900 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-white">Pick a Plan. Cancel Anytime.</h2>
        <div className="mx-auto mt-6 flex w-fit rounded-full border border-white/15 p-1 text-sm font-semibold">
          <span className="rounded-full bg-white px-5 py-2 text-black">Plans</span>
          <span className="px-5 py-2 text-white/60">Bundles</span>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 ${
                plan.mostPopular ? 'border-blue-200 bg-blue-950' : 'border-white/10 bg-blue-950'
              }`}
            >
              {plan.mostPopular && (
                <span className="absolute -top-3 left-6 rounded-full bg-blue-200 px-3 py-1 text-[11px] font-bold text-black">
                  MOST POPULAR
                </span>
              )}
              <h3 className="mt-2 text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-white/60">{plan.tagline}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-200" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-lg font-bold text-white">{plan.monthly}</p>
                <p className="mt-1 text-xs text-white/50">Get 12 months for the price of 10 — {plan.annual}</p>
              </div>
              <a href="#" className="btn-cta mt-5 block rounded-full px-5 py-2.5 text-center text-sm font-bold text-black">
                Get {plan.name}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-white/40">
          *Some features and content are sponsored; ads remain in channels, live sports/events, and a few shows and
          movies; not all content available for download.
        </p>
      </div>
    </section>
  );
}
