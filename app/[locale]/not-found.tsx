import Link from 'next/link';

/**
 * Branded 404 for the CMS catch-all (triggered by notFound() when no content
 * resolves). The site chrome (header + footer) comes from app/[locale]/layout,
 * which already wraps this component — do NOT add SiteChrome here or it renders
 * twice.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-6xl font-bold text-blue-700">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 text-foreground/60">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-blue-700 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-800"
      >
        Back to home
      </Link>
    </main>
  );
}
