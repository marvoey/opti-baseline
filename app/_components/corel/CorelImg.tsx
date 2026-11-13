'use client';

import { useState } from 'react';
import { GRADS, resolveAssetUrl } from './ui';

/**
 * Image with the mock's gradient placeholder: shown when there is no usable
 * source or the image fails to load. Only https:// and site-relative sources are
 * accepted (see resolveAssetUrl).
 */
export default function CorelImg({
  src,
  alt = '',
  className = '',
  seed = 0,
}: {
  src?: string;
  alt?: string;
  className?: string;
  seed?: number;
}) {
  const url = resolveAssetUrl(src);
  const [failedUrl, setFailedUrl] = useState<string | undefined>();

  if (!url || failedUrl === url) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${GRADS[seed % GRADS.length]} p-3 text-center text-xs font-semibold text-white/90 ${className}`}
        role="img"
        aria-label={alt}
      >
        {alt}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- remote CMS/coreldraw.com art with an onError placeholder
  return <img src={url} alt={alt} className={className} onError={() => setFailedUrl(url)} loading="lazy" />;
}
