/**
 * High-fidelity static recreation of nowtv.com's homepage — specifically
 * only the `<main id="main-content">` region (promo banner through the
 * "Browse / New & Trending / Must Watch..." link columns), which on the real
 * site sit inside `#main-content`, ahead of the actual <footer> (legal links
 * — that part is BrandFooter's job).
 *
 * Each section below lives in its own file in this directory and is
 * registered as a CMS content type (see each file's `contentType()` export)
 * so it can be discovered and pushed by `cms:push`.
 *
 * For internal prototyping/reference only. Rendered by app/mock/nowtv/gb/page.tsx
 * between <BrandHeader> and <BrandFooter>.
 */

import PromoBanner from './PromoBanner';
import Memberships from './Memberships';
import Sports from './Sports';
import Entertainment from './Entertainment';
import Cinema from './Cinema';
import Faq from './Faq';
import ExploreMore from './ExploreMore';

/** The `<main id="main-content">` region of nowtv.com — everything from the promo banner through the "explore more" link columns, right up to (but not including) the site's real <footer>. */
export function MockHome() {
  return (
    <main id="main-content" className="bg-blue-950">
      <PromoBanner />
      <Memberships />
      <Sports />
      <Entertainment />
      <Cinema />
      <Faq />
      <ExploreMore />
    </main>
  );
}

export default MockHome;
