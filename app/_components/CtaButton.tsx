import type { LinkLike } from '../../cms/shared';

export type CtaVariant = 'yellow' | 'white' | 'outline' | 'black';

const VARIANT: Record<CtaVariant, string> = {
  yellow: 'bg-rs-yellow text-black hover:bg-rs-yellow-soft',
  white: 'bg-white text-black hover:bg-rs-yellow',
  outline: 'border border-white/40 text-white hover:border-white hover:bg-white/10',
  black: 'bg-black text-white hover:bg-white hover:text-black',
};

type Props = {
  /** A CMS `link` property value. Renders nothing when it has no text. */
  link?: LinkLike;
  variant?: CtaVariant;
  className?: string;
};

/**
 * Brand pill button driven by a CMS `link` property. Absolute http(s) URLs open
 * in a new tab; the CMS "target" setting wins when present.
 *
 * Plain <a> (no next/link) so this stays safe to import from cms/*.tsx, which
 * the CMS push CLI bundles with esbuild.
 */
export default function CtaButton({ link, variant = 'yellow', className = '' }: Props) {
  if (!link?.text) return null;
  const href = link.url?.default || '#';
  const external = /^https?:\/\//i.test(href);
  const target = link.target || (external ? '_blank' : undefined);

  return (
    <a
      href={href}
      title={link.title ?? undefined}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-extrabold transition-colors ${VARIANT[variant]} ${className}`}
    >
      {link.text}
    </a>
  );
}
