import type { ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src?: string | null };

/**
 * Brand image. A plain <img> on purpose: editors paste image URLs from any host
 * (e.g. a CDN), and next/image would require every host in next.config remotePatterns.
 * Renders nothing when there is no src, so empty optional images never leave a
 * broken-image icon behind.
 *
 * Keep this file free of next/* imports: it is pulled into cms/*.tsx, which the
 * CMS push CLI bundles with esbuild.
 */
export default function RsImage({ src, alt = '', className, ...rest }: Props) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      {...rest}
    />
  );
}
