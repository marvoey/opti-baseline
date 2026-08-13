import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const SharedContentContentType = contentType({
  key: 'SharedContent',
  baseType: '_component',
  displayName: 'Shared Content',
  description: 'To be Used in a Column',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    SharedContent_ContentArea: {
      type: 'array',
      displayName: 'Shared Content (Content Area)',
      description: 'This is of type Content Area',
      isRequired: false,
      items: {
        type: 'content',
        allowedTypes: ['_component'],
      },
    },
    SharedContent_ContentAreaItem: {
      type: 'content',
      displayName: 'Shared Content (Content Area Item)',
      isRequired: false,
      allowedTypes: ['_component'],
    },
    SharedContent_ContentReference: {
      type: 'contentReference',
      displayName: 'Shared Content (Content Reference)',
      isRequired: false,
      allowedTypes: ['_component'],
    },
  },
});

type Props = { content: ContentProps<typeof SharedContentContentType> };

export default function SharedContent({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const block = (content as { __composition?: { key: string } }).__composition;

  const areaItems = (content.SharedContent_ContentArea ?? []) as unknown[];
  const singleItem = content.SharedContent_ContentAreaItem as unknown;

  const items = areaItems.length > 0 ? areaItems : singleItem ? [singleItem] : [];

  if (items.length === 0) {
    return (
      <div
        {...pa(block)}
        className="rounded border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400"
      >
        No shared content selected
      </div>
    );
  }

  return (
    <div {...pa(block)} className="w-full">
      {items.map((item, i) => {
        const key =
          (item as { _metadata?: { key?: string } })?._metadata?.key ?? String(i);
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <OptimizelyComponent key={key} content={item as any} />
        );
      })}
    </div>
  );
}
