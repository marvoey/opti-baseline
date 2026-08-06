import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';

export const SplitContentBlockContentType = contentType({
  key: 'SplitContentBlock',
  baseType: '_component',
  displayName: '(Verticals) Split Content Block (50/50)',
  description: 'A two-column layout for side-by-side content or widgets.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    VerticalAlignment: {
      type: 'string',
      displayName: 'Vertical Alignment',
      sortOrder: 10,
      enum: [
        { value: 'top', displayName: 'Top' },
        { value: 'center', displayName: 'Center' },
        { value: 'bottom', displayName: 'Bottom' },
      ],
    },
    ReverseOnMobile: {
      type: 'boolean',
      displayName: 'Reverse Order on Mobile',
      sortOrder: 20,
    },
    LeftColumn: {
      type: 'array',
      displayName: 'Left Column Content',
      sortOrder: 30,
      items: {
        type: 'content',
        allowedTypes: ['_component'],
      },
    },
    RightColumn: {
      type: 'array',
      displayName: 'Right Column Content',
      sortOrder: 40,
      items: {
        type: 'content',
        allowedTypes: ['_component'],
      },
    },
  },
});

const ALIGN_CLASSES: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
};

type Props = { content: ContentProps<typeof SplitContentBlockContentType> };

export default function SplitContentBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const left = (content.LeftColumn ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const right = (content.RightColumn ?? []) as any[];
  const align = ALIGN_CLASSES[content.VerticalAlignment ?? ''] ?? ALIGN_CLASSES.center;
  const reverseClass = content.ReverseOnMobile ? 'flex-col-reverse md:flex-row' : 'flex-col md:flex-row';

  return (
    <div {...pa(block)} className={`w-full flex gap-8 ${reverseClass} ${align}`}>
      <div {...pa('LeftColumn')} className="flex-1 flex flex-col gap-6">
        {left.map((item, idx) => (
          <OptimizelyComponent key={idx} content={item} />
        ))}
      </div>
      <div {...pa('RightColumn')} className="flex-1 flex flex-col gap-6">
        {right.map((item, idx) => (
          <OptimizelyComponent key={idx} content={item} />
        ))}
      </div>
    </div>
  );
}
