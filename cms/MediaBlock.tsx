import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const MediaBlockContentType = contentType({
  key: 'MediaBlock',
  baseType: '_component',
  displayName: 'v2: Media Block',
  description: 'Visual asset container: static image, looping video, or data chart placeholder.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    MediaType: {
      type: 'string',
      displayName: 'Media Type',
      isRequired: true,
      sortOrder: 10,
      enum: [
        { value: 'static_image', displayName: 'Static Image' },
        { value: 'looping_video', displayName: 'Looping Video' },
        { value: 'data_chart', displayName: 'Data Chart' },
      ],
    },
    AssetReference: {
      type: 'contentReference',
      displayName: 'Asset',
      description: 'Image or video asset from the DAM.',
      allowedTypes: ['_image', '_video', '_media'],
      isLocalized: true,
      sortOrder: 20,
    },
    AltText: {
      type: 'string',
      displayName: 'Alt Text',
      description: 'Required for accessibility.',
      isRequired: true,
      isLocalized: true,
      sortOrder: 30,
    },
    AspectRatio: {
      type: 'string',
      displayName: 'Aspect Ratio',
      sortOrder: 40,
      enum: [
        { value: '16_9', displayName: '16:9' },
        { value: '4_3', displayName: '4:3' },
        { value: '1_1', displayName: '1:1' },
        { value: 'auto', displayName: 'Auto' },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof MediaBlockContentType> };

const ASPECT_CLASS: Record<string, string> = {
  '16_9': 'aspect-video',
  '4_3': 'aspect-[4/3]',
  '1_1': 'aspect-square',
};

export default function MediaBlock({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const aspectClass = ASPECT_CLASS[content.AspectRatio ?? ''] ?? '';
  const assetSrc = content.AssetReference ? src(content.AssetReference) : undefined;
  const alt = content.AltText ?? '';

  return (
    <figure {...pa(block)} className="w-full px-6 py-8">
      <div className={`overflow-hidden rounded-lg bg-gray-100 ${aspectClass}`}>
        {content.MediaType === 'looping_video' && assetSrc ? (
          <video
            {...pa('AssetReference')}
            src={assetSrc}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : content.MediaType === 'static_image' && assetSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...pa('AssetReference')}
            src={assetSrc}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : content.MediaType === 'data_chart' ? (
          <div
            {...pa('AssetReference')}
            className="flex h-full min-h-[200px] items-center justify-center text-sm text-gray-400"
          >
            Chart placeholder
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-gray-300">
            No asset
          </div>
        )}
      </div>
    </figure>
  );
}
