import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { SHOWCASE } from './_blocks';
import { Preview } from './_components';

/**
 * /styleguide — a living styleguide that renders every block component with
 * representative sample content, so editors and developers can see how each one
 * looks without authoring a page in the CMS. Each block links to a detail page
 * (/styleguide/[slug]) documenting its properties, source code and example JSON.
 *
 * This route lives OUTSIDE app/[locale] and is excluded from proxy.ts's matcher,
 * so it is never rewritten into a locale and makes no Optimizely Graph calls.
 * The block components are imported and rendered directly with mock `content` —
 * `getPreviewUtils` returns no-op edit attributes when there's no preview
 * context, so they render exactly as they would on a published page.
 *
 * To showcase a new block, add an entry to SHOWCASE in ./_blocks.tsx.
 */

export const metadata: Metadata = {
  title: 'Styleguide',
  description: 'Live previews of every CMS block component.',
  robots: { index: false, follow: false },
};

// Sample content is fixed and has no per-request data — render statically.
export const dynamic = 'force-static';

export default function StyleguidePage() {
  return (
    <main className="min-h-screen bg-cibc-stone/40 text-cibc-ink">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-cibc-gold-dark">
            Styleguide
          </span>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cibc-teal-dark">
            Block Styleguide
          </h1>
          <p className="mt-3 max-w-2xl text-cibc-ink/70">
            Every block component rendered with sample content. This page is excluded from the CMS
            proxy and makes no Graph calls — it imports the components directly. Open a block for its
            properties, source code and example JSON.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-12">
        {SHOWCASE.map((block) => (
          <section key={block.slug} className="scroll-mt-6">
            <div className="mb-4 flex flex-wrap items-baseline gap-3 border-b border-black/10 pb-3">
              <h2 className="text-2xl font-semibold text-cibc-teal-dark">
                <Link href={`/styleguide/${block.slug}`} className="hover:text-cibc-teal">
                  {block.name}
                </Link>
              </h2>
              <code className="rounded bg-cibc-teal/10 px-2 py-0.5 font-mono text-xs text-cibc-teal">
                {block.contentType.key}
              </code>
              <Link
                href={`/styleguide/${block.slug}`}
                className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-cibc-gold-dark hover:text-cibc-gold"
              >
                Details <ArrowRight size={15} />
              </Link>
            </div>
            <p className="mb-6 max-w-2xl text-sm text-cibc-ink/60">{block.summary}</p>
            <div className="space-y-8">
              {block.variants.map((variant, i) => (
                <Preview key={i} label={variant.label}>
                  {block.render(variant)}
                </Preview>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
