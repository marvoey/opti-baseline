import Link from 'next/link';

/**
 * Branded 404 for the CMS catch-all (triggered by notFound() when no content
 * resolves). The site chrome (header + footer) comes from app/[locale]/layout,
 * which already wraps this component - do NOT add SiteChrome here or it renders
 * twice.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-8xl font-black tracking-tighter text-rs-yellow">404</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">Wasted.</h1>
      <p className="mt-3 text-rs-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-rs-yellow px-7 py-3 font-extrabold text-black transition-colors hover:bg-rs-yellow-soft"
      >
        Back to home
      </Link>
    </main>
  );
}
