import Link from 'next/link';

/**
 * Branded 404 for the CMS catch-all (triggered by notFound() when no content resolves). The site
 * chrome (header + footer) comes from app/[locale]/layout, which already wraps this component;
 * do NOT add SiteChrome here or it renders twice.
 */
export default function NotFound() {
  return (
    <main className="w-full bg-neutral-3 px-6 py-20 text-dark-fir">
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[32px] bg-white px-8 py-14 text-center">
        <p className="font-display text-6xl font-extrabold">404</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold">This page took a wrong turn.</h1>
        <p className="mt-3">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full border-2 border-dark-fir bg-lfgreen px-6 py-3 font-semibold hover:bg-grass">
            Back to home
          </Link>
          <Link href="/setup-guide" className="rounded-full border-2 border-dark-fir bg-white px-6 py-3 font-semibold hover:bg-neutral-2">
            Open the guide
          </Link>
        </div>
      </div>
    </main>
  );
}
