import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { SHOWCASE, getBlock } from '../_blocks';
import { CodeBlock, DisplayTemplateTable, Preview, Section } from '../_components';
import { PropertyMap } from '../_PropertyMap';
import { PropertyTable } from '../_PropertyTable';

/**
 * /styleguide/[slug] — a detail page for one block component: live preview(s),
 * a properties table (incl. any nested item types), display-template options,
 * the component source code, and example JSON in the shape Optimizely Graph
 * returns. Static — one page per SHOWCASE entry.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SHOWCASE.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlock(slug);
  return {
    title: block ? `${block.name} · Styleguide` : 'Styleguide',
    description: block?.summary,
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-static';

/** Read a project-relative source file for display (best-effort). */
async function readSource(relativePath: string): Promise<string> {
  try {
    return await readFile(path.join(process.cwd(), relativePath), 'utf8');
  } catch {
    return `// Could not read ${relativePath}`;
  }
}

/** Build the example JSON in the shape Graph returns: __typename + properties. */
function exampleJson(typeKey: string, content: Record<string, unknown>): string {
  return JSON.stringify({ __typename: typeKey, ...content }, null, 2);
}

export default async function BlockDetailPage({ params }: Props) {
  const { slug } = await params;
  const block = getBlock(slug);
  if (!block) notFound();

  const source = await readSource(block.sourceFile);
  const { contentType, variants } = block;
  const firstVariant = variants[0];

  return (
    <main className="min-h-screen bg-cibc-stone/40 text-cibc-ink">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-10">
          <Link
            href="/styleguide"
            className="inline-flex items-center gap-1 text-sm font-semibold text-cibc-gold-dark hover:text-cibc-gold"
          >
            <ArrowLeft size={15} /> All blocks
          </Link>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif text-4xl font-semibold text-cibc-teal-dark">{block.name}</h1>
            <code className="rounded bg-cibc-teal/10 px-2 py-0.5 font-mono text-sm text-cibc-teal">
              {contentType.key}
            </code>
          </div>
          <p className="mt-3 max-w-2xl text-cibc-ink/70">{block.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {contentType.baseType ? (
              <span className="rounded-full border border-black/10 bg-cibc-stone px-3 py-1 font-mono text-cibc-ink/70">
                baseType: {contentType.baseType}
              </span>
            ) : null}
            {contentType.compositionBehaviors?.map((b) => (
              <span
                key={b}
                className="rounded-full border border-black/10 bg-cibc-stone px-3 py-1 font-mono text-cibc-ink/70"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl space-y-14 px-6 py-12">
        <PropertyMap
          contentType={contentType}
          previews={
            <div className="space-y-8">
              {variants.map((variant, i) => (
                <Preview key={i} label={variant.label}>
                  {/* Render with an edit context so the components emit
                      `data-epi-property-name` attributes for PropertyMap to
                      anchor its markers to. */}
                  {block.render({
                    ...variant,
                    content: { ...variant.content, __context: { edit: true } },
                  })}
                </Preview>
              ))}
            </div>
          }
        />

        {/* Long-form reference sections read better at a constrained width. */}
        <div className="max-w-5xl space-y-14">
        {block.itemTypes?.map((itemType) => (
          <Section
            key={itemType.key}
            title={`Item properties · ${itemType.key}`}
            subtitle="Held inline as array items and rendered by this block."
          >
            <PropertyTable contentType={itemType} />
          </Section>
        ))}

        {block.displayTemplates?.length ? (
          <Section
            title="Display-template options"
            subtitle="Layout/theme choices an editor can set per instance."
          >
            <div className="space-y-4">
              {block.displayTemplates.map((tpl) => (
                <DisplayTemplateTable key={tpl.key} template={tpl} />
              ))}
            </div>
          </Section>
        ) : null}

        <Section title="Component code" subtitle={block.sourceFile}>
          <CodeBlock code={source} lang="tsx" caption={block.sourceFile} collapsible defaultOpen={false} />
        </Section>

        {firstVariant ? (
          <Section
            title="Example JSON"
            subtitle="The shape Optimizely Graph returns for this block — use it as a fixture or to seed content."
          >
            <CodeBlock
              code={exampleJson(contentType.key, firstVariant.content)}
              lang="json"
              caption={`${contentType.key} · GraphQL response shape`}
            />
            {firstVariant.displaySettings ? (
              <CodeBlock
                code={JSON.stringify(firstVariant.displaySettings, null, 2)}
                lang="json"
                caption="displaySettings (display template)"
              />
            ) : null}
          </Section>
        ) : null}
        </div>
      </div>
    </main>
  );
}
