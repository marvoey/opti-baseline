import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const ImageGalleryBlockContentType = contentType({
  key: 'SFA_ImageGalleryBlock',
  baseType: '_component',
  displayName: '(_SFA) Image Gallery / Grid Block',
  description: 'Displays side-by-side or stacked event photos.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Images: {
      type: 'array',
      displayName: 'Gallery Images',
      sortOrder: 5,
      items: { type: 'contentReference', restrictedTypes: [] },
    },
    Layout: {
      type: 'string',
      displayName: 'Layout Style',
      sortOrder: 10,
      enum: [
        { value: 'grid',    displayName: 'Grid' },
        { value: 'masonry', displayName: 'Masonry' },
      ],
    },
    Caption: {
      type: 'string',
      displayName: 'Caption',
      isLocalized: true,
      sortOrder: 15,
    },
  },
});

type Props = { content: ContentProps<typeof ImageGalleryBlockContentType> };

export default function ImageGalleryBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const images = content.Images ?? [];
  const isMasonry = content.Layout === 'masonry';

  return (
    <figure {...pa(block)} className="w-full py-8">
      {isMasonry ? (
        <div {...pa('Images')} className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            img?.url?.default && (
              <img
                key={i}
                src={img.url.default}
                alt=""
                className="w-full rounded-md break-inside-avoid"
              />
            )
          ))}
        </div>
      ) : (
        <div {...pa('Images')} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            img?.url?.default && (
              <img
                key={i}
                src={img.url.default}
                alt=""
                className="w-full aspect-square object-cover rounded-md"
              />
            )
          ))}
        </div>
      )}
      {content.Caption && (
        <figcaption {...pa('Caption')} className="text-sm text-gray-500 text-center mt-3">
          {content.Caption}
        </figcaption>
      )}
    </figure>
  );
}
