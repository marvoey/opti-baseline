import { siteConfig } from '@/lib/siteConfig';

/**
 * Site logo. Renders the image at siteConfig.logoSrc when set, otherwise a text
 * wordmark in the brand colours (lime "e" + kelly-green "Health").
 */
export default function SiteLogo({ className = '' }: { className?: string }) {
  if (siteConfig.logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className={`h-10 w-auto ${className}`} />
    );
  }

  return (
    <span
      role="img"
      aria-label={siteConfig.logoAlt}
      className={`font-display text-[28px] font-bold leading-none tracking-tight ${className}`}
    >
      <span className="text-blue-400">e</span>
      <span className="text-blue-800">Health</span>
    </span>
  );
}
