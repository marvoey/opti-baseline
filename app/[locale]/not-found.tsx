import Link from 'next/link';
import LocaleLayout from './[[...slug]]/layout';

/**
 * Branded 404 for the CMS catch-all (triggered by notFound() when no content
 * resolves). The site chrome (header + footer) comes from app/[locale]/layout,
 * which already wraps this component — do NOT add SiteChrome here or it renders
 * twice.
 */
export default function NotFound() {
  return (
    <LocaleLayout>  
      <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-6xl font-bold text-blue-800">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-blue-800 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-900"
        >
          Back to home
        </Link>
      </main>
    </LocaleLayout>
  );
}
