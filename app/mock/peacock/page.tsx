import type { Metadata } from 'next';
import { BrandHeader } from '@/app/_components/BrandHeader';
import { BrandFooter } from '@/app/_components/BrandFooter';
import { brandThemes } from '@/lib/brandThemes';
import BlankExperience from '@/cms/BlankExperience';
import { peacockMockExperienceContent } from './_components/composition';

/**
 * Entry point for the Peacock theme mock — a static recreation of
 * peacocktv.com's homepage. Lives outside app/[locale] (excluded from
 * proxy.ts) since it's a fixed brand mock, not a CMS-driven page.
 *
 * The homepage sections render through the real CMS composition pipeline
 * (cms/BlankExperience + the SDK's OptimizelyComposition) over a
 * hand-authored composition tree (./_components/composition.ts) standing in
 * for what Optimizely Graph would return — the same rendering path a real
 * Visual Builder experience uses, even though the section content itself is
 * still hardcoded (no CMS properties defined yet).
 *
 * Wrapped in `data-theme="peacock"` so BrandHeader/BrandFooter/the sections
 * (all built on the theme-able `blue-*` Tailwind tokens in app/globals.css)
 * render with Peacock's palette regardless of the globally resolved theme —
 * this page is a fixed brand mock, not driven by lib/theme.ts's
 * request-based resolution.
 */

export const metadata: Metadata = {
  title: 'Peacock TV: Stream TV, Movies, & Sports',
  description: 'Watch your favorite TV shows, movies, live sports, and originals — all in one place.',
};

export default function PeacockMockHomePage() {
  return (
    <div data-theme="peacock">
      <BrandHeader config={brandThemes.peacock} />
      <div id="main-content" className="bg-blue-950">
        <BlankExperience content={peacockMockExperienceContent} />
      </div>
      <BrandFooter config={brandThemes.peacock} />
    </div>
  );
}
