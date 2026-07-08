import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive | Opti Demo',
  description: 'Get a free car insurance quote. Join over 37 million drivers who trust Progressive.',
  icons: { icon: [{ url: 'https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt4a6e0a9548045e84/favicon.svg', type: 'image/svg+xml' }] },
};

function BlockTag({ label }: { label: string }) {
  return (
    <span className="absolute right-3 top-3 rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-600 opacity-70 ring-1 ring-blue-200">
      {label}
    </span>
  );
}

export default function DemoPage() {
  return (
    <main className="w-full">

      {/* ── WayfindingBlock · breadcrumbs ─────────────────────────────── */}
      <div className="relative border-b border-gray-200 bg-white">
        <BlockTag label="WayfindingBlock · breadcrumbs" />
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-700 hover:underline">Home</a></li>
              <li aria-hidden>/</li>
              <li><a href="#" className="hover:text-blue-700 hover:underline">Auto Insurance</a></li>
              <li aria-hidden>/</li>
              <li className="font-medium text-gray-900">Car Insurance</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── ProseBlock · lede + ActionBlock · primary ─────────────────── */}
      <div className="relative bg-blue-950 text-white">
        <BlockTag label="ProseBlock · lede  +  ActionBlock · primary" />
        <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
              Nation&apos;s #1 auto insurer
            </p>
            <h1 className="mb-5 text-5xl font-bold leading-tight">
              Car Insurance
            </h1>
            <p className="mb-8 max-w-lg text-xl leading-relaxed text-blue-100">
              Join over 37 million drivers who trust Progressive. Get the coverage
              you need at a price that fits your budget.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="rounded bg-white px-8 py-4 text-lg font-bold text-blue-800 shadow-lg transition-colors hover:bg-blue-50"
              >
                Get a quote
              </a>
              <a
                href="#"
                className="rounded border-2 border-white px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10"
              >
                Continue previous quote
              </a>
            </div>
          </div>
          {/* ── MediaBlock · static_image ───────────────────────────────── */}
          <div className="relative">
            <BlockTag label="MediaBlock · static_image" />
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-blue-900/60 flex items-center justify-center">
              <div className="text-center text-blue-300">
                <svg className="mx-auto mb-3 h-16 w-16 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l2-3h14l2 3M3 9v9a2 2 0 002 2h14a2 2 0 002-2V9M3 9h18M8 9V6m8 3V6M7 15h.01M17 15h.01" />
                </svg>
                <p className="text-sm opacity-60">Car image asset</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white shadow-sm">
        <div className="container mx-auto grid grid-cols-1 divide-y divide-gray-100 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { stat: '$946', label: 'Average savings when drivers switch & save', icon: '💰' },
            { stat: '37M+', label: 'Drivers who trust Progressive', icon: '🚗' },
            { stat: '24/7', label: 'Claims and customer support', icon: '📞' },
          ].map(({ stat, label, icon }) => (
            <div key={stat} className="flex items-center gap-4 px-6 py-6">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="text-2xl font-bold text-blue-800">{stat}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ProseBlock · standard_body + CardBlock × 3 ────────────────── */}
      <div className="relative bg-gray-50 py-16">
        <BlockTag label="ProseBlock · standard_body  +  CardBlock × 3" />
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Discounts that make auto insurance affordable
          </h2>
          <p className="mb-10 max-w-2xl text-lg text-gray-600">
            Progressive rewards safe, loyal, and bundled customers. Stack
            discounts to see just how low your rate can go.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tag: 'Most popular',
                title: 'Snapshot®',
                summary: 'Our usage-based program monitors your driving via the app and rewards safe habits with a personalised discount of up to 30%.',
                cta: 'Try Snapshot®',
                color: 'green',
              },
              {
                tag: 'Bundle & Save',
                title: 'Multi-policy discount',
                summary: 'Combine car and home (or renters) insurance with Progressive and save an average of 5% on each policy.',
                cta: 'Bundle your policies',
                color: 'blue',
              },
              {
                tag: 'Safe driver',
                title: 'Continuous insurance discount',
                summary: "Stay insured without gaps and we'll reward you for it. The longer you've been continuously insured, the bigger your savings.",
                cta: 'See all discounts',
                color: 'blue',
              },
            ].map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className={`h-1.5 w-full ${card.color === 'green' ? 'bg-green-500' : 'bg-blue-800'}`} />
                <div className="p-6">
                  <span className={`mb-3 inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${card.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {card.tag}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{card.title}</h3>
                  <p className="mb-5 text-sm text-gray-600">{card.summary}</p>
                  <a href="#" className="text-sm font-bold text-blue-700 underline-offset-2 hover:underline">
                    {card.cta} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ── ProseBlock · standard_body + CardBlock × 3 ────────────────── */}
      <div className="relative bg-white py-16">
        <BlockTag label="ProseBlock · standard_body  +  CardBlock × 3" />
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Customize your car insurance coverage
          </h2>
          <p className="mb-10 max-w-2xl text-lg text-gray-600">
            Build a policy that fits your life. Choose only what you need — or
            get comprehensive protection for total peace of mind.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tag: 'Required in most states',
                title: 'Liability coverage',
                summary: 'Covers costs if you injure someone or damage their property in an at-fault accident. Required by law in most states.',
                cta: 'Learn about liability',
              },
              {
                tag: 'Recommended',
                title: 'Collision coverage',
                summary: "Pays to repair or replace your car after an accident, regardless of who's at fault — minus your chosen deductible.",
                cta: 'Explore collision',
              },
              {
                tag: 'Full protection',
                title: 'Comprehensive coverage',
                summary: 'Protects your vehicle from theft, weather damage, vandalism, and other non-collision events.',
                cta: 'See all coverages',
              },
            ].map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="h-1.5 w-full bg-blue-800" />
                <div className="p-6">
                  <span className="mb-3 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {card.tag}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{card.title}</h3>
                  <p className="mb-5 text-sm text-gray-600">{card.summary}</p>
                  <a href="#" className="text-sm font-bold text-blue-700 underline-offset-2 hover:underline">
                    {card.cta} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ── ProseBlock · pull_quote ────────────────────────────────────── */}
      <div className="relative bg-blue-800 py-20 text-white">
        <BlockTag label="ProseBlock · pull_quote" />
        <div className="container mx-auto px-4 text-center">
          <blockquote className="mx-auto max-w-3xl">
            <p className="mb-6 text-5xl font-bold leading-tight text-green-400">
              $946
            </p>
            <p className="mb-2 text-2xl font-semibold leading-relaxed text-white">
              is the average savings of drivers who switched to Progressive
            </p>
            <footer className="mt-4 text-sm text-blue-200">
              Based on national average savings data from 2024. Individual results may vary.
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── WayfindingBlock · wizard ───────────────────────────────────── */}
      <div className="relative border-b border-gray-100 bg-white py-12">
        <BlockTag label="WayfindingBlock · wizard" />
        <div className="container mx-auto px-4">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
            How to get started
          </p>
          <ol className="flex flex-wrap justify-center gap-6">
            {[
              { n: 1, label: 'Get a quote' },
              { n: 2, label: 'Customize coverage' },
              { n: 3, label: 'Choose your price' },
              { n: 4, label: 'Start saving' },
            ].map(({ n, label }) => (
              <li key={n} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">
                  {n}
                </span>
                <span className="font-semibold text-gray-700">{label}</span>
                {n < 4 && <span className="text-gray-300 hidden sm:inline">→</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── ActionBlock · primary + secondary ─────────────────────────── */}
      <div className="relative bg-gray-50 py-20">
        <BlockTag label="ActionBlock · primary  +  ActionBlock · secondary" />
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            Ready to start saving?
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Get your free quote in minutes. No commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="rounded bg-blue-800 px-10 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-blue-900"
            >
              Get a quote
            </a>
            <a
              href="#"
              className="rounded border-2 border-blue-800 px-10 py-4 text-lg font-bold text-blue-800 transition-colors hover:bg-blue-50"
            >
              Find an agent
            </a>
            <a
              href="tel:1-855-347-3749"
              className="flex items-center gap-2 rounded border-2 border-gray-300 px-10 py-4 text-lg font-bold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
            >
              Call 1-855-347-3749
            </a>
          </div>
        </div>
      </div>

    </main>
  );
}
