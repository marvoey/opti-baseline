import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import type { Node, Element, Text } from '@optimizely/cms-sdk/react/richText';
import type React from 'react';
import { MainBodyTocNav } from './MainBodyTocNav';

type RichTextJson = { children: Node[] };

function isElement(node: Node): node is Element {
  return !('text' in node);
}

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&apos;': "'", '&#39;': "'", '&nbsp;': ' ',
  '&ldquo;': '“', '&rdquo;': '”',
  '&lsquo;': '‘', '&rsquo;': '’',
  '&ndash;': '–', '&mdash;': '—',
  '&hellip;': '…', '&laquo;': '«', '&raquo;': '»',
};

function decodeEntities(s: string) {
  return s.replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, m =>
    HTML_ENTITIES[m] ?? (m.startsWith('&#x')
      ? String.fromCodePoint(parseInt(m.slice(3, -1), 16))
      : m.startsWith('&#')
        ? String.fromCodePoint(parseInt(m.slice(2, -1), 10))
        : m)
  );
}

function extractText(children: Node[]): string {
  return children.map(n =>
    'text' in n ? decodeEntities((n as Text).text) : extractText((n as Element).children)
  ).join('');
}

const HEADING_TYPES = new Set(['heading-one', 'heading-two']);

function toId(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('-');
  return `${slug}-toc-${index}`;
}

function extractHeadings(json: RichTextJson | null | undefined) {
  if (!json?.children) return [];
  const results: { level: 1 | 2; text: string; id: string }[] = [];
  function walk(nodes: Node[]) {
    for (const node of nodes) {
      if (isElement(node) && HEADING_TYPES.has(node.type)) {
        const text = extractText(node.children);
        results.push({ level: node.type === 'heading-one' ? 1 : 2, text, id: toId(text, results.length + 1) });
      }
      if (isElement(node)) walk(node.children);
    }
  }
  walk(json.children);
  return results;
}

export const MainBodyContentType = contentType({
  key: 'MainBodyBlock',
  baseType: '_component',
  displayName: 'Main Body Block',
  description: 'Holds the core editorial rich text content.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    ArticleContent: {
      type: 'richText',
      displayName: 'Article Content',
      isLocalized: true,
      sortOrder: 10,
    },
  },
});

export const MainBodyDisplayTemplate = displayTemplate({
  key: 'DefaultMainBody',
  isDefault: true,
  displayName: 'Main Body',
  contentType: 'MainBodyBlock',
  settings: {
    hideToc: {
      displayName: 'Hide TOC',
      editor: 'checkbox',
      sortOrder: 20,
      choices: {
        true:  { displayName: 'Yes', sortOrder: 10 },
        false: { displayName: 'No',  sortOrder: 20 },
      },
    },
  },
});

export const MainBodySimpleDisplayTemplate = displayTemplate({
  key: 'MainBodySimple',
  isDefault: false,
  displayName: 'Main Body — Simple',
  contentType: 'MainBodyBlock',
  settings: {},
});

type Props = {
  content: ContentProps<typeof MainBodyContentType>;
  displaySettings?: ContentProps<typeof MainBodyDisplayTemplate>;
};

export default function MainBody({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const isSimple = (content.__composition as { displayTemplateKey?: string } | undefined)?.displayTemplateKey === 'MainBodySimple';
  const showToc = !isSimple && displaySettings?.hideToc !== true;
  const headings = showToc ? extractHeadings(content.ArticleContent?.json as RichTextJson) : [];

  if (showToc && headings.length > 0) {
    let headingCount = 0;
    const ids = headings.map(h => h.id);
    const elements = {
      'heading-one': ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) =>
        <h1 id={ids[headingCount++]} {...props} className="scroll-mt-24">{children}</h1>,
      'heading-two': ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) =>
        <h2 id={ids[headingCount++]} {...props} className="scroll-mt-24">{children}</h2>,
    };

    return (
      <section {...pa(content.__composition)} className="w-full px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full shrink-0 md:w-1/4">
            <MainBodyTocNav headings={headings} />
          </div>
          <div {...pa('ArticleContent')} className="flex-1 prose max-w-3xl">
            <RichTextRenderer content={content.ArticleContent?.json} elements={elements} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section {...pa(content.__composition)} className="w-full px-6 py-12">
      <div {...pa('ArticleContent')} className="prose mx-auto max-w-3xl">
        <RichTextRenderer content={content.ArticleContent?.json} />
      </div>
    </section>
  );
}
