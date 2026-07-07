import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
/**
 * Rich Text — a block of formatted prose (headings, lists, links, tables)
 * authored in the CMS TinyMCE editor. The simplest way to put copy on a page
 * without modelling it in the Visual Builder. Rendered with the SDK's
 * <RichText> component (safer than dangerouslySetInnerHTML).
 */
export const RichTextContentType = contentType({
  key: 'RichTextBlock',
  baseType: '_component',
  displayName: 'Rich Text',
  description: 'A block of formatted text content.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
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

export default function RichText({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      <div {...pa('Body')} className="prose mx-auto max-w-3xl">
        <RichTextRenderer content={content.Body?.json} />
      </div>
    </section>
  );
}
