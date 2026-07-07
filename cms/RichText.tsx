import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const RichTextContentType = contentType({
  key: 'ProseBlock',
  baseType: '_component',
  displayName: 'v2: Prose Block',
  description: 'Rich text with a semantic variant: body copy, lede paragraph, or pull quote.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    SemanticVariant: {
      type: 'string',
      displayName: 'Semantic Variant',
      description: 'Controls the visual treatment of the prose.',
      sortOrder: 5,
      enum: [
        { value: 'standard_body', displayName: 'Standard Body' },
        { value: 'lede_paragraph', displayName: 'Lede Paragraph' },
        { value: 'pull_quote', displayName: 'Pull Quote' },
      ],
    },
    Body: {
      type: 'richText',
      displayName: 'Body',
      description: 'Formatted text content.',
      isLocalized: true,
      sortOrder: 10,
    },
  },
});

type Props = { content: ContentProps<typeof RichTextContentType> };

const VARIANT_CLASS: Record<string, string> = {
  lede_paragraph: 'prose prose-xl mx-auto max-w-2xl text-gray-600',
  pull_quote: 'mx-auto max-w-2xl border-l-4 border-blue-600 pl-6 text-xl italic text-blue-950',
};

export default function RichText({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const variant = content.SemanticVariant ?? 'standard_body';
  const isPullQuote = variant === 'pull_quote';
  const bodyClass = VARIANT_CLASS[variant] ?? 'prose mx-auto max-w-3xl';

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      {isPullQuote ? (
        <blockquote {...pa('Body')} className={bodyClass}>
          <RichTextRenderer content={content.Body?.json} />
        </blockquote>
      ) : (
        <div {...pa('Body')} className={bodyClass}>
          <RichTextRenderer content={content.Body?.json} />
        </div>
      )}
    </section>
  );
}
