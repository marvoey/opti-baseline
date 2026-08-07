import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { blockWidth, widthClass } from './blockWidth';

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
    ...blockWidth(),
    Body: {
      type: 'richText',
      displayName: 'Body',
      description: 'Formatted text content.',
      isLocalized: true,
      sortOrder: 10,
    },
    BackgroundColor: {
      type: 'string',
      displayName: 'Background Theme Color',
      description: 'e.g. Default, LightGold, DarkBlue',
      sortOrder: 15,
      enum: [
        { value: 'Default',   displayName: 'Default (White)' },
        { value: 'LightGold', displayName: 'Light Gold' },
        { value: 'DarkBlue',  displayName: 'Dark Blue' },
      ],
    },
  },
});

const BG_CLASS: Record<string, string> = {
  LightGold: 'bg-amber-50',
  DarkBlue:  'bg-blue-900 text-white [&_.prose]:prose-invert',
};

type Props = { content: ContentProps<typeof RichTextContentType> };

export default function RichText({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const bgClass = BG_CLASS[content.BackgroundColor ?? ''] ?? '';

  return (
    <section {...pa(block)} className={`w-full px-6 py-12 ${bgClass}`}>
      <div {...pa('Body')} className={`prose mx-auto ${widthClass(content.BlockWidth)}`}>
        <RichTextRenderer content={content.Body?.json} />
      </div>
    </section>
  );
}
