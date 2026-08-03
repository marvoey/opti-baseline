import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

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

type Props = { content: ContentProps<typeof MainBodyContentType> };

export default function MainBody({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      <div {...pa('ArticleContent')} className="prose mx-auto max-w-3xl">
        <RichTextRenderer content={content.ArticleContent?.json} />
      </div>
    </section>
  );
}
