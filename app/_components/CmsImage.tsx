import { getImageProps } from 'next/image';

/**
 * <img> for CMS (SaaS) assets, served through Next.js image optimization.
 *
 * The CMS keeps images exactly as uploaded (the eHealth photos are 4.5-7.5 MB
 * PNGs) and its asset host ignores resize parameters, so a plain <img> sends every
 * visitor the full original. This routes the image through /_next/image instead:
 * resized to the slot (`sizes` + srcset), re-encoded as AVIF/WebP and cached.
 *
 * It still renders a plain <img> (via getImageProps), so the CSS classes behave
 * exactly as before; `width`/`height` only reserve the aspect ratio until the
 * image loads. Hosts must be allowed in next.config.ts (`images.remotePatterns`);
 * any other host falls back to a plain, lazy <img> with the original URL.
 */

/** Keep in step with `images.remotePatterns` in next.config.ts. */
const OPTIMIZED_HOST = /(^|\.)cms\.optimizely\.com$/i;

function canOptimize(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && OPTIMIZED_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

type Props = {
  src: string;
  alt: string;
  /** Intrinsic size hint: sets the aspect ratio reserved before the image loads. */
  width: number;
  height: number;
  /** How wide the image renders at each breakpoint; drives which size is fetched. */
  sizes: string;
  className?: string;
  /** Above-the-fold image (the hero): load right away at high priority. */
  eager?: boolean;
};

export default function CmsImage({ src, alt, width, height, sizes, className, eager = false }: Props) {
  const loading = eager ? 'eager' : 'lazy';
  if (!canOptimize(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} className={className} loading={loading} decoding="async" />
    );
  }
  const { props } = getImageProps({
    src,
    alt,
    width,
    height,
    sizes,
    className,
    loading,
    fetchPriority: eager ? 'high' : undefined,
  });
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}
