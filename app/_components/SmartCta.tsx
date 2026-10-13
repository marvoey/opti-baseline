import Link from 'next/link';
import { MARKETS_38, getCountryFromLocale, isServiceAvailable } from '../../lib/markets';
import { localizePath } from '../../lib/locales';

export type SmartCtaProps = {
  label: string;
  href?: string | null;
  /** UPS service the destination depends on (see UpsService). Omit for none. */
  requiredService?: string | null;
  /** BCP-47 locale of the page the CTA is rendered on. */
  currentLocale: string;
  className?: string;
  /** True in Visual Builder / preview, so blocked CTAs are shown, not hidden. */
  isEditor?: boolean;
};

/**
 * Locale/market-aware call to action. If the destination needs a service the
 * current market doesn't offer, it is hidden in production and shown as a red
 * dashed marker to editors. Internal paths are localized with localizePath();
 * absolute URLs pass through untouched.
 */
export default function SmartCta({
  label,
  href,
  requiredService,
  currentLocale,
  className = '',
  isEditor = false,
}: SmartCtaProps) {
  if (!isServiceAvailable(requiredService, currentLocale)) {
    if (!isEditor) return null;
    const country = getCountryFromLocale(currentLocale);
    const market = MARKETS_38[country] ?? MARKETS_38.US;
    return (
      <span
        className="inline-flex items-center gap-1 rounded-md border-2 border-dashed border-red-500 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
        title={`CTA "${label}" hidden: "${requiredService}" is not offered in ${market.countryName}`}
      >
        {label} (unavailable in {country})
      </span>
    );
  }

  const target = href || '#';
  const url = target.startsWith('/') ? localizePath(target, currentLocale) : target;
  const external = /^https?:\/\//i.test(url);

  return external ? (
    <a href={url} className={className}>
      {label}
    </a>
  ) : (
    <Link href={url} className={className}>
      {label}
    </Link>
  );
}

/** Locale of a CMS content item, falling back to the given default. */
export function contentLocale(content: unknown, fallback: string): string {
  const meta = (content as { _metadata?: { locale?: string } })?._metadata;
  return meta?.locale || fallback;
}

/** True when the content is rendered in the CMS editor / preview context. */
export function isEditorContent(content: unknown): boolean {
  const ctx = (content as { __context?: { edit?: boolean; preview?: boolean } })?.__context;
  return Boolean(ctx?.edit || ctx?.preview);
}
