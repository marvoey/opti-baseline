import { contentType } from '@optimizely/cms-sdk';

/**
 * "NOW Memberships" plan comparison grid, anchored at `#plans`.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it
 * can be discovered and pushed by `cms:push`. `PLANS` below is hardcoded,
 * not read from CMS content. `sectionEnabled` lets editors drop it directly
 * into a Visual Builder experience as its own section.
 */
export const NowTvMembershipsBlockContentType = contentType({
  key: 'NowTvMembershipsBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'NOW TV Mock: Memberships',
  description: 'Plan comparison grid on the NOW TV mock homepage (nowtv.com recreation).',
  properties: {},
});

const PLANS = [
  {
    name: 'Entertainment & HBO Max',
    features: [
      'Sky Originals and exclusive shows, like Brassic and Heated Rivalry',
      'Stream every series from HBO Max Basic with Ads, like The Pitt and Friends',
    ],
    from: 'From £6.99 a month',
  },
  {
    name: 'Entertainment',
    features: [
      'Sky Originals and exclusive shows, like Brassic and Heated Rivalry',
      'The biggest returning hit series from HBO',
    ],
    from: 'From £4.99 a month',
  },
  {
    name: 'Sports',
    features: ['Stream all 12 Sky Sports channels live', 'Watch more with Sky Sports+'],
    from: 'From £27.99 a month',
  },
  {
    name: 'Cinema',
    features: ['More of the latest blockbusters than anywhere else', 'Hundreds of movies for every mood and moment'],
    from: 'From £9.99 a month',
  },
];

export default function Memberships() {
  return (
    <section id="plans" className="bg-blue-900 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-white">NOW Memberships</h2>
        <p className="mt-2 text-center text-sm text-white/60">Save when you join for longer with our monthly plans</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div key={plan.name} className="rounded-2xl border border-white/10 bg-blue-950 p-6">
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-4 text-sm font-bold text-blue-200">{plan.from}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-white/40">
          Entertainment and Entertainment &amp; HBO Max plan pricing based on Monthly Saver with 6-month minimum
          term. Sports plan pricing based on Monthly Saver with 12-month minimum term. Ads included on live sports
          and channels.
        </p>
      </div>
    </section>
  );
}
