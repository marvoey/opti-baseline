import type { Metadata } from 'next';
import NbcHelpArticle from '@/cms/NbcHelpArticle';
import { paymentMethodArticleContent } from './content';

/**
 * High-fidelity static recreation of peacocktv.com's help article on changing
 * a payment method, for internal prototyping/reference only. Lives outside
 * app/[locale] (excluded from proxy.ts) since it's a fixed brand mock, not a
 * CMS-driven page.
 *
 * Everything from the breadcrumb down through the feedback widget renders
 * through the real CMS content types (cms/NbcHelpArticle +
 * cms/NbcStepGroupBlock + cms/NbcSharedNoticeBlock + cms/NbcFaqAccordionBlock)
 * over a hand-authored mock content object (./content.ts) — the same
 * dispatch mechanism (OptimizelyComponent against cms/registry.ts) a real
 * CMS-driven help article page would use. Only the header, search hero, and
 * footer stay hardcoded here — genuine page/site-level chrome with no
 * content-type equivalent, which SiteChrome/BrandHeader/BrandFooter already
 * supply for a real CMS-driven route.
 */

export const metadata: Metadata = {
  title: 'How do I change my payment method or billing address? | Peacock Help',
  description:
    'Learn how to update your card details, billing address, or switch to PayPal on Peacock.',
};

function PeacockMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1607 400"
      className="h-6 w-auto"
      aria-hidden="true"
    >
      <g clipPath="url(#pwob_clip)">
        <path
          d="M1606.99 31.25C1606.99 48.51 1593 62.5 1575.74 62.5C1558.48 62.5 1544.49 48.51 1544.49 31.25C1544.49 13.99 1558.48 0 1575.74 0C1593 0 1606.99 13.99 1606.99 31.25ZM1575.74 84.38C1558.48 84.38 1544.49 98.37 1544.49 115.63C1544.49 132.89 1558.48 146.88 1575.74 146.88C1593 146.88 1606.99 132.89 1606.99 115.63C1606.99 98.37 1593 84.38 1575.74 84.38ZM1575.74 168.75C1558.48 168.75 1544.49 182.74 1544.49 200C1544.49 217.26 1558.48 231.25 1575.74 231.25C1593 231.25 1606.99 217.26 1606.99 200C1606.99 182.74 1593 168.75 1575.74 168.75ZM1575.74 253.12C1558.48 253.12 1544.49 267.11 1544.49 284.37C1544.49 301.63 1558.48 315.62 1575.74 315.62C1593 315.62 1606.99 301.63 1606.99 284.37C1606.99 267.11 1593 253.12 1575.74 253.12ZM1575.74 337.5C1558.48 337.5 1544.49 351.49 1544.49 368.75C1544.49 386.01 1558.48 400 1575.74 400C1593 400 1606.99 386.01 1606.99 368.75C1606.99 351.49 1593 337.5 1575.74 337.5Z"
          fill="url(#pwob_gradient)"
        />
        <path
          d="M1213.52 89.3501C1228.9 89.3501 1243.49 92.5101 1256.9 99.2101V155.6C1245.86 145.74 1229.29 138.25 1212.33 138.25C1178.81 138.25 1153.18 165.46 1153.18 200.56C1153.18 235.66 1178.81 262.47 1213.13 261.68C1230.09 261.68 1246.25 255.76 1256.91 245.12V300.72C1242.71 307.03 1228.12 311.37 1212.34 311.37C1150.42 311.37 1100.34 261.68 1100.34 200.56C1100.34 139.44 1151.61 89.3601 1213.53 89.3601L1213.52 89.3501ZM217.7 194.64C217.7 260.32 166.83 312.55 52.85 325.65V395.36H0V200.16C0 130.36 49.3 89.3501 111.22 89.3501C173.14 89.3501 217.7 135.49 217.7 194.64ZM164.85 196.61C164.85 164.27 140.4 139.83 109.24 139.83C78.08 139.83 52.84 161.91 52.84 200.16V275.44C95.17 274.24 164.84 250.53 164.84 196.61H164.85ZM701.21 200.55C701.21 261.67 750.9 311.36 813.21 311.36C828.59 311.36 843.58 307.02 857.39 300.71V245.11C847.14 255.36 830.57 261.67 814.01 261.67C779.7 262.46 754.06 235.25 754.06 200.55C754.06 165.85 779.69 138.24 813.21 138.24C830.17 138.24 846.34 145.73 857.39 155.59V99.2001C843.98 92.5001 829.39 89.3401 814.79 89.3401C752.08 89.3401 701.21 139.03 701.21 200.54V200.55ZM1482.09 305.05L1390.27 196.69L1471.84 95.6501H1407.16L1329.86 198.19V5.36011H1276.62V305.06H1329.86V201.17L1417.81 305.06H1482.09V305.05ZM687.02 210.41V305.05H634.17V282.35C617.9 300.68 594.84 311.36 568.31 311.36C511.91 311.36 465.77 261.67 465.77 201.34C465.77 141.01 513.09 89.3501 577.38 89.3501C649.16 89.3501 687.02 142.19 687.02 210.41ZM633.78 200.55C633.78 165.45 609.33 138.24 576.2 138.24C543.07 138.24 517.43 165.45 517.43 200.55C517.43 235.65 543.07 262.46 576.2 262.46C609.33 262.46 633.78 235.64 633.78 200.55ZM1087.71 200.55C1087.71 261.67 1037.23 311.36 975.31 311.36C913.39 311.36 863.31 261.67 863.31 200.55C863.31 139.43 914.18 89.3501 975.31 89.3501C1036.44 89.3501 1087.71 139.43 1087.71 200.55ZM1034.86 200.55C1034.86 165.06 1008.83 138.24 975.31 138.24C941.79 138.24 916.16 165.45 916.16 200.55C916.16 235.65 941.79 262.46 975.31 262.46C1008.83 262.46 1034.86 235.25 1034.86 200.55ZM451.18 198.19C451.18 203.32 450.78 211.99 450 221.06H285.4C293.39 246.8 316.95 262.86 350.23 262.86C375.47 262.86 399.53 253.79 420.03 236.44V291.25C402.28 303.87 377.44 311.36 348.65 311.36C280.03 311.36 231.12 266.01 231.12 202.13C231.12 138.25 281.21 89.3501 343.12 89.3501C405.03 89.3501 451.58 137.85 451.18 198.19ZM285.8 178.87H396.36C389.54 154.39 369.48 137.86 342.73 137.86C315.98 137.86 293.77 154.42 285.81 178.87H285.8Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="pwob_gradient"
          x1="1575.74"
          y1="-0.83"
          x2="1575.74"
          y2="400.19"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFDC23" />
          <stop offset="0.16" stopColor="#FF8700" />
          <stop offset="0.21" stopColor="#FF5401" />
          <stop offset="0.37" stopColor="#D9005A" />
          <stop offset="0.42" stopColor="#C814C8" />
          <stop offset="0.58" stopColor="#8250FF" />
          <stop offset="0.63" stopColor="#6E64FF" />
          <stop offset="0.79" stopColor="#00C8FF" />
          <stop offset="0.84" stopColor="#00CC99" />
          <stop offset="0.99" stopColor="#00A637" />
        </linearGradient>
        <clipPath id="pwob_clip">
          <rect width="1606.99" height="400" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function SearchIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function SocialGlyph({ label }: { label: string }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-[11px] font-semibold text-white/80 hover:border-white/60 hover:text-white">
      {label}
    </span>
  );
}

export default function PeacockPaymentMethodMock() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2">
            <PeacockMark />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#" className="text-white">Help</a>
            <a href="#" className="hover:text-white">Plans</a>
            <a href="#" className="hover:text-white">Shows &amp; Movies</a>
          </nav>
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="text-white/80 hover:text-white">
              <SearchIcon className="h-5 w-5" />
            </button>
            <a href="#" className="hidden text-sm font-medium text-white/80 hover:text-white sm:block">
              Sign In
            </a>
            <a
              href="#"
              className="rounded-full px-5 py-2 text-sm font-bold text-black"
              style={{ background: 'linear-gradient(90deg,#FFCE00,#FF9300)' }}
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Search hero */}
      <div className="border-b border-white/10 bg-neutral-950 px-6 py-10 text-center">
        <h1 className="text-2xl font-extrabold sm:text-3xl">How can we help?</h1>
        <div className="mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-full bg-white px-4 py-3 text-black">
          <SearchIcon className="h-5 w-5 shrink-0 text-black/50" />
          <input
            type="text"
            readOnly
            placeholder="Search for a topic&hellip;"
            className="w-full bg-transparent text-sm outline-none placeholder:text-black/50"
          />
        </div>
      </div>

      {/* Article body */}
      <NbcHelpArticle content={paymentMethodArticleContent} />

      {/* Footer */}
      <footer className="bg-black px-6 py-12 text-sm text-white/70">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Peacock</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Kids Help</a></li>
              <li><a href="#" className="hover:text-white">Accessibility</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">CA Notice</a></li>
              <li><a href="#" className="hover:text-white">Ad Choices</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Follow Us</h4>
            <div className="flex gap-2">
              <SocialGlyph label="f" />
              <SocialGlyph label="ig" />
              <SocialGlyph label="yt" />
              <SocialGlyph label="x" />
              <SocialGlyph label="tt" />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
          <p>&copy; 2026 Peacock TV LLC. All Rights Reserved.</p>
          <p className="mt-1">
            Unofficial static mock built for internal prototyping only &mdash; not affiliated
            with or endorsed by Peacock TV or NBCUniversal.
          </p>
        </div>
      </footer>
    </div>
  );
}
