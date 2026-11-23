import Link from 'next/link';

/**
 * Shown on the homepage when the CMS start page has no published content (or Graph is
 * unreachable), so the site still explains itself and links to the guide.
 */
export default function HomePageFallback() {
  return (
    <main className="w-full bg-neutral-3 px-6 py-12 text-dark-fir md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[32px] bg-lfgreen px-8 py-12 md:grid-cols-[1fr_280px] md:px-14">
        <div>
          <p className="mb-4 text-sm font-bold">opti-baseline · Setup guide</p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">Your laptop, demo-ready.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed">
            A step-by-step guide that gets you from a brand-new laptop to a working Optimizely CMS demo site. No coding
            experience needed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/setup-guide/signup"
              className="rounded-full border-2 border-dark-fir bg-white px-6 py-3 font-semibold hover:bg-neutral-2"
            >
              Create your account
            </Link>
            <Link href="/setup-guide/login" className="rounded-full border-2 border-dark-fir px-6 py-3 font-semibold hover:bg-white">
              Sign in
            </Link>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/setup-guide/guide.svg" alt="" width={280} height={280} className="mx-auto w-48 md:w-full" />
      </div>
    </main>
  );
}
