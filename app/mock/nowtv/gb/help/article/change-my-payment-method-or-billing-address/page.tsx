import type { Metadata } from 'next';

/**
 * High-fidelity static recreation of nowtv.com/gb's help article on changing
 * a payment method or billing address, for internal prototyping/reference
 * only. Lives outside app/[locale] (excluded from proxy.ts) since it's a
 * fixed brand mock, not a CMS-driven page.
 */

export const metadata: Metadata = {
  title: 'Change your payment method or billing address | NOW Help Centre',
  description:
    'Learn how to update your card details, billing address, or switch to PayPal on NOW.',
};

function NowMark() {
  return (
    <svg
      className="h-6 w-auto text-white"
      data-testid="now-logo"
      aria-hidden="true"
      viewBox="0 0 114 36"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M67.2 21.79H67.31L68.93 29.54C69.54 32.42 71.2 34.23 74.16 34.23C76.76 34.23 78.32 32.92 79.72 30.58L86.94 18.51L89.93 29.64C90.83 32.92 92.6 34.23 95.22 34.23C97.6 34.23 99.39 32.86 100.66 30.58L113.17 8.24C113.73 7.2 114 6.21 114 5.29C114 2.68 111.93 0.66 108.94 0.66C106.5 0.66 104.49 2.08 103.15 4.64L97.1 16.32L94.16 4.8C93.47 2.28 92.02 0.63 89.14 0.63C87.23 0.63 85.42 1.19 83.69 4.34L77.36 16.29L75.25 4.95C74.67 1.96 72.57 0.65 70 0.65C67.07 0.65 64.82 2.72 64.82 5.73C64.82 6.06 64.82 6.28 64.94 7.04L65.22 8.79H65.11C62.29 3.44 56.89 0 49.89 0C42.95 0 37.23 3.71 34.62 8.79H34.5L34.89 6.33C34.95 5.94 35.01 5.4 35.01 5.12C35.01 2.17 33.06 0.59 30.29 0.59C27.9 0.59 25.79 1.96 25.11 5.18L22.89 16.31L14.66 3.6C13.23 1.36 11.73 0.65 9.9 0.65C7.63 0.65 5.51 1.8 4.89 4.74L0.16 27.56C0.06 28.22 0 28.88 0 29.37C0 32.53 2.01 34.23 4.73 34.23C6.95 34.23 9.46 32.81 10.07 29.76L12.34 18.8L19.95 30.97C21.06 32.78 22.49 34.24 24.95 34.24C27.77 34.24 29.5 32.66 30.12 29.93L31.85 21.8H31.97C33.42 29.55 39.91 35.23 49.25 35.23C58.3 35.22 65.47 29.21 67.2 21.79ZM49.67 25.59C45.22 25.59 41.72 21.99 41.72 17.62C41.72 13.03 45.22 9.65 49.67 9.65C54.16 9.65 57.66 13.2 57.66 17.62C57.66 22.05 54.18 25.59 49.67 25.59Z" />
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

function ChevronRight(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbIcon({ up, className }: { up?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      style={up ? undefined : { transform: 'scaleY(-1)' }}
      aria-hidden="true"
    >
      <path
        d="M7 10v11H3V10h4Zm0 0 4-7a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 1.94 2.5l-1.7 6.5A2 2 0 0 1 16.8 21H7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

const THIRD_PARTY_ROUTES = [
  { name: 'EE TV', detail: 'manage your payment details in the EE app or My EE.' },
  { name: 'Apple', detail: 'manage your subscription under Settings > Apple ID > Subscriptions.' },
  { name: 'Amazon', detail: 'manage your channel subscription from Amazon’s Your Memberships & Subscriptions page.' },
  { name: 'TalkTalk TV', detail: 'manage your payment details from your TalkTalk account.' },
];

const RELATED_ARTICLES = [
  'How do I cancel my NOW Membership?',
  'Why has my payment failed?',
  'How do I view my billing history?',
  'How do I update the email address on my account?',
];

export default function NowTvPaymentMethodMock() {
  return (
    <div className="min-h-screen bg-[#0B0B10] font-sans text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0B0B10]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <NowMark />
            <span className="hidden text-sm font-semibold text-white/70 sm:block">Help Centre</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#" className="hover:text-white">TV</a>
            <a href="#" className="hover:text-white">Sport</a>
            <a href="#" className="hover:text-white">Cinema</a>
            <a href="#" className="text-white">Help</a>
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
              className="rounded-full px-5 py-2 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(120deg,#00E0FF,#FF2E93)' }}
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Search hero */}
      <div className="border-b border-white/10 bg-[#111117] px-6 py-10 text-center">
        <h1 className="text-2xl font-extrabold sm:text-3xl">How can we help?</h1>
        <div className="mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-full bg-white px-4 py-3 text-black">
          <SearchIcon className="h-5 w-5 shrink-0 text-black/50" />
          <input
            type="text"
            readOnly
            placeholder="Search the Help Centre&hellip;"
            className="w-full bg-transparent text-sm outline-none placeholder:text-black/50"
          />
        </div>
      </div>

      {/* Article body */}
      <main className="bg-white text-black">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-black/60">
            <a href="#" className="hover:underline">Help Centre</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <a href="#" className="hover:underline">Account &amp; billing</a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-black">Change payment method or billing address</span>
          </nav>

          <h2 className="text-3xl font-extrabold leading-tight">
            Change your payment method or billing address
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-black/80">
            Whether you&rsquo;ve got a new card, moved house, or want to switch to PayPal, you
            can update your details yourself from My Account in just a couple of minutes.
          </p>

          <h3 className="mt-8 text-xl font-bold">I&rsquo;ve got a new payment card</h3>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-black/80 marker:font-bold marker:text-black">
            <li>Sign in to <strong>My Account</strong>.</li>
            <li>Go to <strong>Payment details</strong>.</li>
            <li>Select <strong>Update card</strong> or <strong>Switch to PayPal</strong>, and follow the on-screen steps.</li>
          </ol>
          <p className="mt-3 text-[15px] leading-relaxed text-black/80">
            If you pay for NOW Broadband, update those payment details separately from{' '}
            <a href="#" className="text-[#0072CE] hover:underline">Managing your NOW Broadband payment details</a>.
          </p>

          <h3 className="mt-8 text-xl font-bold">I pay through a third party</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-black/80">
            If you signed up through a partner, manage your payment details with them instead:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-black/80">
            {THIRD_PARTY_ROUTES.map((route) => (
              <li key={route.name}>
                <strong>{route.name}</strong> &mdash; {route.detail}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-xl font-bold">Automatic card updates</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-black/80">
            Some banks automatically send us your new card details when your card is renewed or
            replaced, so your membership isn&rsquo;t interrupted. If you&rsquo;d rather opt out,
            contact your bank directly.
          </p>

          <div className="mt-8 rounded-xl border border-black/10 bg-neutral-50 p-4 text-[14px] text-black/70">
            <strong className="text-black">Good to know:</strong> new payment details are used
            for your next scheduled payment, once confirmed.
          </div>

          <hr className="my-10 border-black/10" />

          <h3 className="text-lg font-bold">Frequently asked questions</h3>
          <div className="mt-4 divide-y divide-black/10 rounded-xl border border-black/10">
            <details className="group p-4 open:pb-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
                What payment methods do you accept?
                <ChevronDown className="h-4 w-4 shrink-0 text-black/50 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 space-y-1 text-[14px] leading-relaxed text-black/70">
                <p><strong>TV Membership:</strong> Mastercard, Visa, American Express, or PayPal.</p>
                <p><strong>Broadband:</strong> Mastercard and Visa only.</p>
              </div>
            </details>
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
                Can I use a prepaid card?
                <ChevronDown className="h-4 w-4 shrink-0 text-black/50 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-black/70">
                Unfortunately, there are some Visa and Mastercard prepaid cards we don&rsquo;t
                accept at the moment.
              </p>
            </details>
          </div>

          <hr className="my-10 border-black/10" />

          <h3 className="text-lg font-bold">Related articles</h3>
          <ul className="mt-4 space-y-2 text-[15px]">
            {RELATED_ARTICLES.map((title) => (
              <li key={title}>
                <a href="#" className="text-[#0072CE] hover:underline">{title}</a>
              </li>
            ))}
          </ul>

          <hr className="my-10 border-black/10" />

          <div className="rounded-xl border border-black/10 p-6 text-center">
            <p className="font-semibold">Was this article helpful?</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
              >
                <ThumbIcon up className="h-4 w-4" /> Yes
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
              >
                <ThumbIcon className="h-4 w-4" /> No
              </button>
            </div>
            <p className="mt-4 text-xs text-black/50">
              Still need help? <a href="#" className="text-[#0072CE] hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0B10] px-6 py-12 text-sm text-white/70">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">NOW</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Help Centre</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Accessibility Support</a></li>
              <li><a href="#" className="hover:text-white">Complaints Code of Practice</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Terms &amp; Conditions</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Follow Us</h4>
            <div className="flex gap-2">
              <SocialGlyph label="f" />
              <SocialGlyph label="ig" />
              <SocialGlyph label="yt" />
              <SocialGlyph label="x" />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
          <p>&copy; 2026 NOW. All Rights Reserved.</p>
          <p className="mt-1">
            Unofficial static mock built for internal prototyping only &mdash; not affiliated
            with or endorsed by NOW, Sky UK, or Comcast.
          </p>
        </div>
      </footer>
    </div>
  );
}
