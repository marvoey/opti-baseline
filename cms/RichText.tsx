import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

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

type Props = {
  content: ContentProps<typeof RichTextContentType>;
  displaySettings?: Record<string, string | boolean>;
};

export default function RichText({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const isDisclaimer = displaySettings?.Disclaimer === true;

  return (
    <section {...pa(block)} className={isDisclaimer ? undefined : 'w-full px-6 py-12'}>
      <div {...pa('Body')} className={isDisclaimer ? 'prose prose-sm max-w-none' : 'prose mx-auto max-w-3xl'}>
        <RichTextRenderer content={content.Body?.json} />
      </div>
    </section>
  );
}
