import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

// Paragraph is a CMS system type — no contentType() definition needed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Paragraph({ content }: { content: any }) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  return (
    <div {...pa(block)} className="px-6 py-4">
      <div {...pa('Text')} className="prose mx-auto">
        <RichTextRenderer content={content.Text?.json} />
      </div>
    </div>
  );
}
