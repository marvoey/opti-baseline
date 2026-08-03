import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const PrgvCategoryContentType = contentType({
  key: 'PrgvCategory',
  baseType: '_page',
  displayName: '[PRGV] Category',
  description: 'Used to build the hierarchical taxonomy tree (e.g., Products, LOBs, Regions).',
  properties: {
    Title: {
      type: 'string',
      displayName: 'Category Name',
      isRequired: true,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
    },
  },
});

type Props = { content: ContentProps<typeof PrgvCategoryContentType> };

export default function PrgvCategory({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 {...pa('Title')} className="text-2xl font-bold text-gray-900">{content.Title}</h1>
      {content.Description && (
        <p {...pa('Description')} className="text-gray-600">{content.Description}</p>
      )}
    </main>
  );
}
