import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const SharedContentContentType = contentType({
  key: 'SharedContent',
  baseType: '_component',
  displayName: 'Shared Content',
  description: 'To be Used in a Column',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    SharedContent_ContentReference: {
      type: 'contentReference',
      allowedTypes: ['_component'],
      displayName: 'Shared Content (Content Reference)',
      isRequired: false,
      sortOrder: 10,
    },
  },
});

export const SharedContentDisplayTemplate = displayTemplate({
  key: 'SharedContentDefault',
  isDefault: true,
  displayName: 'Shared Content',
  contentType: 'SharedContent',
  settings: {},
});

type Props = { content: ContentProps<typeof SharedContentContentType> };

export default function SharedContent({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const ref = content.SharedContent_ContentReference as { name?: string } | undefined;

  return (
    <div {...pa(block)} {...pa('SharedContent_ContentReference')}>
      {ref?.name ? (
        <span className="text-sm text-slate-500 italic">{ref.name}</span>
      ) : (
        <p className="border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
          No content reference selected
        </p>
      )}
    </div>
  );
}
