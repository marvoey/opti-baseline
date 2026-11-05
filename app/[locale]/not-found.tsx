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
      <p className="font-display text-display font-semibold text-accent">404</p>
      <h1 className="mt-4 text-subheading text-ink">Page not found</h1>
      <p className="mt-3 text-ink-soft">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </main>
  );
}
