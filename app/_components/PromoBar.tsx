'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import ChromeLink from './ChromeLink';
import { siteConfig } from '@/lib/siteConfig';

/** Dismissible announcement strip above the header. Renders nothing when `siteConfig.promoBar` is unset. */
export default function PromoBar() {
  const [open, setOpen] = useState(true);
  const promo = siteConfig.promoBar;
  if (!promo || !open) return null;

  return (
    <div className="bg-black text-sm text-white" data-cms-group="Promo">
      <div className="site-container relative flex items-center justify-center gap-3 py-2">
        <ChromeLink href={promo.href} className="hover:underline">
          {promo.text}{' '}
          <span className="font-bold text-brand-accent">{promo.highlight}</span>{' '}
          <span className="ml-2 font-semibold underline">{promo.cta}</span>
        </ChromeLink>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
