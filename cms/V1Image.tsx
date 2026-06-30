import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

/**
 * V1: Image — the atomic image primitive. A DAM `Image` reference plus an
 * optional `ImageUrl` override (the override wins when set, mirroring the
 * media precedence in cms/Hero.tsx). Aspect ratio, rounding and object-fit are
 * presentation, so they live on the display template.
 */
export const V1ImageContentType = contentType({
  key: 'V1Image',
  baseType: '_component',
  displayName: 'V1: Image',
  description: 'Atomic image element — DAM reference or URL override, framing via display template.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Image: {
      type: 'contentReference',
      displayName: 'Image',
      description: 'Image asset from the media library.',
      allowedTypes: ['_image'],
      isLocalized: true,
      sortOrder: 10,
    },
    ImageUrl: {
      type: 'url',
      displayName: 'Image URL',
      description: 'Optional. Full image URL — overrides the Image asset when set.',
      isLocalized: true,
      sortOrder: 20,
    },
    Alt: {
      type: 'string',
      displayName: 'Alt text',
      description: 'Accessible description of the image.',
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

export const V1ImageDefault = displayTemplate({
  key: 'V1ImageDefault',
  isDefault: true,
  displayName: 'V1: Image',
  contentType: 'V1Image',
  settings: {
    ratio: {
      editor: 'select',
      displayName: 'Aspect ratio',
      sortOrder: 0,
      choices: {
        auto: { displayName: 'Auto (intrinsic)', sortOrder: 1 },
        square: { displayName: 'Square (1:1)', sortOrder: 2 },
        wide: { displayName: 'Wide (16:9)', sortOrder: 3 },
        portrait: { displayName: 'Portrait (3:4)', sortOrder: 4 },
      },
    },
    rounded: {
      editor: 'select',
      displayName: 'Corners',
      sortOrder: 1,
      choices: {
        none: { displayName: 'Square', sortOrder: 1 },
        md: { displayName: 'Rounded', sortOrder: 2 },
        lg: { displayName: 'Large radius', sortOrder: 3 },
        full: { displayName: 'Circle / pill', sortOrder: 4 },
      },
    },
    fit: {
      editor: 'select',
      displayName: 'Fit',
      sortOrder: 2,
      choices: {
        cover: { displayName: 'Cover', sortOrder: 1 },
        contain: { displayName: 'Contain', sortOrder: 2 },
      },
    },
  },
});

type Ratio = 'auto' | 'square' | 'wide' | 'portrait';
type Rounded = 'none' | 'md' | 'lg' | 'full';
type Fit = 'cover' | 'contain';

const RATIO: Record<Ratio, string> = {
  auto: '',
  square: 'aspect-square',
  wide: 'aspect-video',
  portrait: 'aspect-[3/4]',
};

const ROUNDED: Record<Rounded, string> = {
  none: '',
  md: 'rounded-md',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

const FIT: Record<Fit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
};

type Props = {
  content: ContentProps<typeof V1ImageContentType>;
  displaySettings?: ContentProps<typeof V1ImageDefault>;
};

export default function V1Image({ content, displaySettings }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const ratio = (displaySettings?.ratio ?? 'auto') as Ratio;
  const rounded = (displaySettings?.rounded ?? 'none') as Rounded;
  const fit = (displaySettings?.fit ?? 'cover') as Fit;

  // Media precedence: the URL override wins, else resolve the DAM reference.
  const urlOverride = content.ImageUrl?.default ?? undefined;
  const usingUrl = !!urlOverride;
  const imageSrc = usingUrl ? urlOverride : content.Image ? src(content.Image) : undefined;

  const frame = [RATIO[ratio], ROUNDED[rounded], 'overflow-hidden'].filter(Boolean).join(' ');

  if (!imageSrc) {
    // Editor placeholder so an empty image is still selectable.
    return (
      <div {...pa(block)} className={`bg-cibc-stone/60 ${frame || 'aspect-video'}`} />
    );
  }

  return (
    <div {...pa(block)} className={frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...pa(usingUrl ? 'ImageUrl' : 'Image')}
        src={imageSrc}
        alt={content.Alt ?? ''}
        className={`h-full w-full ${FIT[fit]}`}
      />
    </div>
  );
}
