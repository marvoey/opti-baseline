import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties } from './shared';

export const MediaBlockContentType = contentType({
  key: 'MediaPrimitiveBlock',
  baseType: '_component',
  displayName: 'Media Primitive',
  description: 'Visual asset container for diagrams, product visuals, and media assets.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    MediaUrl: {
      type: 'string',
      displayName: 'Media Asset URL',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    AltText: {
      type: 'string',
      displayName: 'Alt Text / Description',
      isLocalized: true,
      sortOrder: 20,
    },
    Caption: {
      type: 'string',
      displayName: 'Caption',
      isLocalized: true,
      sortOrder: 30,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof MediaBlockContentType> };

export default function MediaBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <figure {...pa(block)} className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-2">
      <img
        {...pa('MediaUrl')}
        src={content.MediaUrl ?? ''}
        alt={content.AltText ?? ''}
        className="h-auto w-full rounded-lg object-cover"
      />
      {content.Caption && (
        <figcaption {...pa('Caption')} className="mt-2 text-center text-xs text-neutral-500">
          {content.Caption}
        </figcaption>
      )}
    </figure>
  );
}
