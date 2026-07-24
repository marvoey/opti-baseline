import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const ImageContentType = contentType({
  key: 'Image',
  baseType: '_component',
  displayName: 'Image',
  description: 'Displays images with options for captions and links.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Image: {
      type: 'contentReference',
      displayName: 'Image',
      allowedTypes: ['_image'],
    },
    AltText: {
      type: 'string',
      displayName: 'Alt Text',
    },
  },
});

export const ImageDisplayTemplate = displayTemplate({
  key: 'DefaultImage',
  isDefault: true,
  displayName: 'Image',
  contentType: 'Image',
  settings: {
    displayAs: {
      editor: 'select',
      displayName: 'Display As',
      sortOrder: 0,
      choices: {
        inline:     { displayName: 'Inline',           sortOrder: 1 },
        background: { displayName: 'Background Image', sortOrder: 2 },
      },
    },
    overlay: {
      editor: 'select',
      displayName: 'Overlay',
      sortOrder: 1,
      choices: {
        none:  { displayName: 'None',    sortOrder: 1 },
        light: { displayName: 'Lighten', sortOrder: 2 },
        dark:  { displayName: 'Darken',  sortOrder: 3 },
      },
    },
  },
});

const OVERLAY_CLASS: Record<string, string> = {
  light: 'absolute inset-0 bg-white/50',
  dark:  'absolute inset-0 bg-black/50',
};

type Props = {
  content: ContentProps<typeof ImageContentType>;
  displaySettings?: ContentProps<typeof ImageDisplayTemplate>;
};

export default function Image({ content, displaySettings }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const block = content.__composition;
  const isBackground = displaySettings?.displayAs === 'background';
  const overlayClass = OVERLAY_CLASS[(displaySettings?.overlay as string) ?? ''];

  if (isBackground) {
    return (
      <figure {...pa(block)} className="absolute inset-0 -z-10 m-0 overflow-hidden">
        <img
          src={src(content.Image)}
          alt={(content.AltText as string | undefined) ?? ''}
          {...pa('Image')}
          className="h-full w-full object-cover"
        />
        {overlayClass && <div className={overlayClass} aria-hidden="true" />}
      </figure>
    );
  }

  return (
    <figure {...pa(block)}>
      <img
        src={src(content.Image)}
        alt={(content.AltText as string | undefined) ?? ''}
        {...pa('Image')}
        className="w-full"
      />
    </figure>
  );
}
