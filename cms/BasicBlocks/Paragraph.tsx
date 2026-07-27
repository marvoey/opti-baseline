import { contentType, displayTemplate, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import type { Node, Element, Text } from "@optimizely/cms-sdk/react/richText";
import type React from "react";
import { ParagraphTocNav } from "./ParagraphTocNav";

type RichTextJson = { children: Node[] };

function isElement(node: Node): node is Element {
  return !('text' in node);
}

function extractText(children: Node[]): string {
  return children.map(n =>
    'text' in n ? (n as Text).text : extractText((n as Element).children)
  ).join('');
}

export const ParagraphContentType = contentType({
  key: "Paragraph",
  baseType: "_component",
  displayName: "Paragraph",
  description: "Basic text component for adding paragraph content.",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  properties: {
    Text: {
      type: "richText",
      displayName: "Text",
      isLocalized: true,
      indexingType: "searchable",
      sortOrder: 1,
    },
    Intent: {
      type: "string",
      format: "selectOne",
      displayName: "Intent",
      isLocalized: false,
      indexingType: "queryable",
      group: "Taxonomy",
      sortOrder: 10,
      enum: [
        { value: "discover_recommend", displayName: "Discover / Recommend" },
        { value: "educate_govern", displayName: "Educate / Govern" },
        { value: "simulate_transact", displayName: "Simulate / Transact" },
      ],
    },
    Persona: {
      type: "string",
      format: "selectOne",
      displayName: "Persona",
      isLocalized: false,
      indexingType: "queryable",
      group: "Taxonomy",
      sortOrder: 11,
      enum: [
        { value: "asset_manager",       displayName: "Asset Manager" },
        { value: "pension_fund",        displayName: "Pension Fund" },
        { value: "corporate_sponsor",   displayName: "Corporate Sponsor" },
        { value: "foreign_institution", displayName: "Foreign Institution" },
        { value: "insurance_provider",  displayName: "Insurance Provider" },
      ],
    },
    Service: {
      type: "array",
      format: "selectMany",
      displayName: "Service",
      group: "Taxonomy",
      sortOrder: 12,
      items: {
        type: "string",
        enum: [
          { value: "fund_administration",     displayName: "Fund Administration" },
          { value: "foreign_exchange",        displayName: "Foreign Exchange" },
          { value: "treasury_services",       displayName: "Treasury Services" },
          { value: "etf_services",            displayName: "ETF Services" },
          { value: "alternative_investments", displayName: "Alternative Investments" },
          { value: "securities_lending",      displayName: "Securities Lending" },
          { value: "global_custody",          displayName: "Global Custody" },
          { value: "recordkeeping",           displayName: "Recordkeeping" },
          { value: "esg",                     displayName: "ESG" },
          { value: "regulatory",              displayName: "Regulatory" },
          { value: "tax",                     displayName: "Tax" },
          { value: "digital_assets",          displayName: "Digital Assets" },
          { value: "onboarding",              displayName: "Onboarding" },
          { value: "compliance",              displayName: "Compliance" },
        ],
      },
    },
    Geo: {
      type: "string",
      format: "selectOne",
      displayName: "Geo",
      isLocalized: false,
      indexingType: "queryable",
      group: "Taxonomy",
      sortOrder: 13,
      enum: [
        { value: "canada",        displayName: "Canada" },
        { value: "europe",        displayName: "Europe" },
        { value: "united_states", displayName: "United States" },
        { value: "global",        displayName: "Global" },
      ],
    },
  },
});

export const ParagraphDisplayTemplate = displayTemplate({
  key: 'DefaultParagraph',
  isDefault: true,
  displayName: 'Paragraph',
  contentType: 'Paragraph',
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

export const ParagraphSimpleDisplayTemplate = displayTemplate({
  key: 'ParagraphSimple',
  isDefault: false,
  displayName: 'Paragraph — Simple',
  contentType: 'Paragraph',
  settings: {},
});

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

type Props = {
  content: ContentProps<typeof ParagraphContentType>;
  displaySettings?: ContentProps<typeof ParagraphDisplayTemplate>;
};

export default function Paragraph({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSimple = (content.__composition as any)?.displayTemplateKey === 'ParagraphSimple';
  const showToc = !isSimple && displaySettings?.hideToc !== true;
  const headings = showToc ? extractHeadings(content.Text?.json as RichTextJson) : [];

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
      <div {...pa(content.__composition)} className="px-6 py-4">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full shrink-0 md:w-1/4">
            <ParagraphTocNav headings={headings} />
          </div>
          <div {...pa("Text")} className="flex-1 prose max-w-none">
            <RichTextRenderer content={content.Text?.json} elements={elements} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div {...pa(content.__composition)} className="px-6 py-4">
      <div {...pa("Text")} className="prose mx-auto">
        <RichTextRenderer content={content.Text?.json} />
      </div>
    </div>
  );
}
