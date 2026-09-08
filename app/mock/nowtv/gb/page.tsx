import type { Metadata } from 'next';
import { BrandHeader } from '@/app/_components/BrandHeader';
import { BrandFooter } from '@/app/_components/BrandFooter';
import { brandThemes } from '@/lib/brandThemes';
import { MockHome } from './_components/MockHome';

/**
 * Entry point for the NOW TV theme mock — a static recreation of
 * nowtv.com's homepage. Lives outside app/[locale] (excluded from
 * proxy.ts) since it's a fixed brand mock, not a CMS-driven page.
 *
 * Wrapped in `data-theme="nowtv"` so BrandHeader/BrandFooter/MockHome (all
 * built on the theme-able `blue-*` Tailwind tokens in app/globals.css) render
 * with NOW's palette regardless of the globally resolved theme — this page
 * is a fixed brand mock, not driven by lib/theme.ts's request-based
 * resolution.
 */

export const metadata: Metadata = {
  title: 'NOW - Watch TV, Movies & Live Sports online',
  description: 'Stream Sky Originals, every HBO Max series, live sport, and hundreds of movies with a NOW Membership.',
};

export default function NowTvMockHomePage() {
  return (
    <div data-theme="nowtv">
      <BrandHeader config={brandThemes.nowtv} />
      <MockHome />
      <BrandFooter config={brandThemes.nowtv} />
    </div>
  );
}
