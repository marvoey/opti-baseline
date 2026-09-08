/**
 * High-fidelity static recreation of peacocktv.com's homepage — specifically
 * only the `<main id="main-content">` region (hero through the "Browse /
 * Sports / Collections / Originals / Trending / About" link columns), which
 * on the real site sit inside `#main-content`, ahead of the actual <footer>
 * (legal links + social + copyright — that part is BrandFooter's job).
 *
 * Each section below lives in its own file in this directory and is
 * registered as a CMS content type (see each file's `contentType()` export)
 * so it can be discovered and pushed by `cms:push`.
 *
 * For internal prototyping/reference only. Rendered by app/mock/peacock/page.tsx
 * between <BrandHeader> and <BrandFooter>.
 */

import Hero from './Hero';
import SportsCarousel from './SportsCarousel';
import Showcase from './Showcase';
import Pricing from './Pricing';
import Features from './Features';
import GiftCards from './GiftCards';
import Faq from './Faq';
import ExploreMore from './ExploreMore';

/** The `<main id="main-content">` region of peacocktv.com — everything from the hero through the "explore more" link columns, right up to (but not including) the site's real <footer>. */
export function MockHome() {
  return (
    <main id="main-content" className="bg-blue-950">
      <Hero />
      <SportsCarousel />
      <Showcase />
      <Pricing />
      <Features />
      <GiftCards />
      <Faq />
      <ExploreMore />
    </main>
  );
}

export default MockHome;
