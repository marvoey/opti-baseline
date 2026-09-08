import { contentType } from '@optimizely/cms-sdk';

/**
 * Top promo banner of the NOW TV mock homepage: headline, subhead,
 * discounted price, and plan CTAs.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it
 * can be discovered and pushed by `cms:push`. Content below is still
 * hardcoded, not read from CMS content. `sectionEnabled` lets editors drop
 * it directly into a Visual Builder experience as its own section.
 */
export const NowTvPromoBannerBlockContentType = contentType({
  key: 'NowTvPromoBannerBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'NOW TV Mock: Promo Banner',
  description: 'Top promo banner of the NOW TV mock homepage (nowtv.com recreation).',
  properties: {},
});

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-blue-950 px-6 py-16 text-center sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(60% 60% at 50% 20%, var(--color-blue-800), transparent)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-200">Live sport for you!</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Stream Sky &amp; HBO Max. Together.
        </h1>
        <p className="mt-3 text-white/70">
          Unlock every HBO Max series alongside hit Sky Originals, exclusive US shows, and must-see reality TV.
        </p>
        <p className="mt-4 text-2xl font-extrabold text-white">
          <span className="mr-2 text-white/40 line-through">£9.99</span>£6.99<span className="text-sm font-medium text-white/60"> a month</span>
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="#plans" className="btn-cta rounded-full px-8 py-3 text-sm font-bold text-white">
            Continue with £6.99 offer
          </a>
          <a href="#plans" className="rounded-full border border-white/25 px-8 py-3 text-sm font-bold text-white hover:bg-white/10">
            See More Entertainment Plans
          </a>
        </div>
        <p className="mt-6 text-[11px] text-white/40">
          6-month minimum term. Includes ads on NOW — enjoy a month ad-free* on us in the next step. After the
          minimum term, membership auto-renews unless cancelled. *Ad-free excludes live channels and trailers.
        </p>
      </div>
    </section>
  );
}
