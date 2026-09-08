import { contentType } from '@optimizely/cms-sdk';

/**
 * Top hero band of the Peacock mock homepage: headline, subhead, plan CTAs,
 * and a sign-in note for existing subscribers.
 *
 * Registered as a CMS content type (schema only, no properties yet) so it can
 * be discovered and pushed by `cms:push`. Content below is still hardcoded,
 * not read from CMS content. `sectionEnabled` lets editors drop it directly
 * into a Visual Builder experience as its own section.
 */
export const PeacockHeroBlockContentType = contentType({
  key: 'PeacockHeroBlock',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  displayName: 'Peacock Mock: Hero',
  description: 'Top hero band of the Peacock mock homepage (peacocktv.com recreation).',
  properties: {},
});

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-blue-950 px-6 py-20 text-center sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(60% 60% at 50% 20%, var(--color-blue-800), transparent)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Hit Movies, Must-See TV, and Live Sports
        </h1>
        <p className="mt-4 text-lg text-white/70">Choose a Peacock plan or bundle to start streaming.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#plans" className="btn-cta rounded-full px-8 py-3 text-sm font-bold text-black">
            Get Peacock
          </a>
          <a href="#plans" className="rounded-full border border-white/25 px-8 py-3 text-sm font-bold text-white hover:bg-white/10">
            Get Bundle
          </a>
        </div>
        <p className="mt-6 text-xs text-white/50">
          Already have a Peacock subscription billed directly by Peacock?{' '}
          <a href="#" className="link-themed hover:underline">Sign In</a> and upgrade to the bundle in your account.
        </p>
      </div>
    </section>
  );
}
