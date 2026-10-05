import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const RichTextContentType = contentType({
  key: 'RichTextBlock',
  baseType: '_component',
  displayName: 'Rich Text (Prose)',
  description: 'Editorial narrative and formatted prose block.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Intent: {
      type: 'string',
      displayName: 'Intent Tag',
      description: 'High-level user intent (e.g., explore, evaluate, transact, compliance).',
      isLocalized: false,
      group: 'Content',
    },
    Audience: {
      type: 'string',
      displayName: 'Target Audience',
      description: 'Target audience segment (e.g., enterprise, smb, developer, c-suite).',
      isLocalized: false,
      group: 'Content',
    },
    Domain: {
      type: 'string',
      displayName: 'Domain / Vertical',
      description: 'Functional domain (e.g., security, cloud, governance, finance).',
      isLocalized: false,
      group: 'Content',
    },
    Geo: {
      type: 'string',
      displayName: 'Geo / Region',
      description: 'Geographic region or "global".',
      isLocalized: false,
      group: 'Content',
    },
    Body: {
      type: 'richText',
      displayName: 'Body',
      description: 'Formatted text content.',
      isLocalized: true,
      group: 'Content',
      sortOrder: 10,
      editorSettings: { preset: 'expanded' },
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
