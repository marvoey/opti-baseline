import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const TwoColumnSplitBlockContentType = contentType({
  key: 'SFA_TwoColumnSplitBlock',
  baseType: '_component',
  displayName: '(_SFA) Two Column Layout Block',
  description: 'Split layout for text and media. Reversible alignment.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    MediaAlignment: {
      type: 'string',
      displayName: 'Media Alignment',
      description: 'Left or Right',
      sortOrder: 5,
      enum: [
        { value: 'left', displayName: 'Media Left' },
        { value: 'right', displayName: 'Media Right' },
      ],
    },
    LeftContentArea: {
      type: 'array',
      displayName: 'Left Content',
      sortOrder: 10,
      items: { type: 'content', restrictedTypes: [] },
    },
    RightContentArea: {
      type: 'array',
      displayName: 'Right Content',
      sortOrder: 15,
      items: { type: 'content', restrictedTypes: [] },
    },
  },
});

type Props = { content: ContentProps<typeof TwoColumnSplitBlockContentType> };

export default function TwoColumnSplitBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const reversed = content.MediaAlignment === 'right';

  return (
    <div
      {...pa(block)}
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${reversed ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''}`}
    >
      <div {...pa('LeftContentArea')}>
        {(content.LeftContentArea ?? []).map((item, i) => (
          <OptimizelyComponent key={i} content={item} />
        ))}
      </div>
      <div {...pa('RightContentArea')}>
        {(content.RightContentArea ?? []).map((item, i) => (
          <OptimizelyComponent key={i} content={item} />
        ))}
      </div>
    </div>
  );
}
