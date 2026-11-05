import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Restaurant solutions look | Demo',
  description: 'A static page showing the OpenTable-style theme: type, colour bands, buttons and cards.',
};

/*
 * Static demo of the theme tokens in app/globals.css — no CMS content. All copy
 * and figures here are SAMPLE content for showing the look, not real claims.
 * Tailwind only sees complete class names, so the swatch classes are spelled out.
 */

const STATS = [
  { value: '70,000+', label: 'Restaurants on the platform' },
  { value: '23,000+', label: 'Extra covers from smart campaigns' },
  { value: '15%', label: 'More covers seated per night' },
];

const FEATURES = [
  {
    title: 'Maximize revenue',
    body: 'Fill more tables at every shift with demand-aware availability and guest-friendly booking.',
  },
  {
    title: 'Run service like clockwork',
    body: 'Keep the floor, the kitchen and the host stand in sync with one live view of the evening.',
  },
  {
    title: 'Make smarter decisions',
    body: 'See which guests, shifts and channels drive repeat business and act on it.',
  },
];

const SWATCHES = [
  { name: 'ink', hex: '#0C0C0B', cls: 'bg-ink text-white' },
  { name: 'ink-soft', hex: '#262623', cls: 'bg-ink-soft text-white' },
  { name: 'muted', hex: '#91949A', cls: 'bg-muted text-ink' },
  { name: 'cream', hex: '#F3F0E8', cls: 'bg-cream text-ink' },
  { name: 'cream-hover', hex: '#D9D6CF', cls: 'bg-cream-hover text-ink' },
  { name: 'fog', hex: '#F1F2F4', cls: 'bg-fog text-ink' },
  { name: 'slate', hex: '#6F737B', cls: 'bg-slate text-white' },
  { name: 'accent', hex: '#EC043D', cls: 'bg-accent text-white' },
  { name: 'teal', hex: '#082B32', cls: 'bg-teal text-white' },
  { name: 'lime', hex: '#AAC627', cls: 'bg-lime text-ink' },
  { name: 'positive', hex: '#2F864D', cls: 'bg-positive text-white' },
  { name: 'negative', hex: '#931B23', cls: 'bg-negative text-white' },
  { name: 'callout', hex: '#FDAF08', cls: 'bg-callout text-ink' },
];

export default function RestaurantSolutionsDemo() {
  return (
    <main>
      {/* Hero — teal band, serif display headline, inverse + outline buttons */}
      <section className="bg-teal text-white">
        <div className="page-width py-16 md:py-24">
          <p className="eyebrow">Restaurant solutions</p>
          <h1 className="mt-4 max-w-3xl text-display">
            More guests. More time. One connected platform.
          </h1>
          <p className="mt-6 max-w-xl text-lead text-white/90">
            Sample copy: tools that help your team fill tables, know every guest and spend less time
            on admin.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#" className="btn btn-inverse">
              Book a demo
            </Link>
            <Link href="#" className="btn btn-outline text-white">
              Explore what&rsquo;s new
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — cream band */}
      <section className="bg-cream">
        <div className="page-width grid gap-10 py-14 md:grid-cols-3 md:py-20">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-display-md font-semibold">{s.value}</p>
              <p className="mt-2 text-lead">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards — flat, ruled, no radius or shadow */}
      <section>
        <div className="page-width py-14 md:py-20">
          <h2 className="max-w-2xl text-heading">Helping with what matters: your guests, your team, your time</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="border-t border-ink pt-6">
                <h3 className="text-subheading">{f.title}</h3>
                <p className="mt-3">{f.body}</p>
                <Link href="#" className="btn btn-quiet mt-6">
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight band — lime, ink text */}
      <section className="bg-lime text-ink">
        <div className="page-width py-14 md:py-20">
          <blockquote className="max-w-3xl">
            <p className="font-display text-display-md font-semibold">
              &ldquo;Sample quote: we spend less time on the phone and more time with guests.&rdquo;
            </p>
            <footer className="mt-6 font-semibold">Sample Name, General Manager</footer>
          </blockquote>
        </div>
      </section>

      {/* CTA — the one place red is used as a full band */}
      <section className="bg-accent text-white">
        <div className="page-width flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl text-heading">Ready to see it in action?</h2>
          <Link href="#" className="btn btn-inverse">
            Book a demo
          </Link>
        </div>
      </section>

      {/* Specimen — tokens in one place */}
      <section className="border-t border-ink/10">
        <div className="page-width py-14 md:py-20">
          <p className="eyebrow">Design tokens</p>
          <h2 className="mt-2 text-heading">Palette, type and buttons</h2>

          <h3 className="mt-12 text-subheading">Colour</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SWATCHES.map((s) => (
              <li key={s.name} className={`${s.cls} border border-ink/10 p-4`}>
                <p className="font-semibold">{s.name}</p>
                <p className="text-fine">{s.hex}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 text-subheading">Type</h3>
          <div className="mt-4 space-y-4">
            <p className="font-display text-display font-semibold">Display 66/72</p>
            <p className="font-display text-display-md font-semibold">Display medium 52/60</p>
            <p className="font-display text-heading font-semibold">Heading 48/56</p>
            <p className="font-display text-subheading font-semibold">Subheading 24/28</p>
            <p className="eyebrow">Eyebrow and large body 18/24 (sans, 600)</p>
            <p>Body 16/24 — the quick brown fox jumps over the lazy dog.</p>
            <p className="text-fine">Fine print 14/23.8 — footers and captions.</p>
          </div>

          <h3 className="mt-12 text-subheading">Buttons</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-outline">Outline</button>
            <button className="btn btn-quiet">Quiet</button>
            <button className="btn btn-primary" disabled>
              Disabled
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 bg-ink p-4 text-white">
            <button className="btn btn-inverse">Inverse</button>
            <button className="btn btn-outline">Outline on dark</button>
          </div>
        </div>
      </section>
    </main>
  );
}
