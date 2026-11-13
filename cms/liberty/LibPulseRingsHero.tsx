import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import PulseRingsHero from '@/app/_components_liberty/PulseRingsHero';
import LibertyBlock from './LibertyBlock';
import { blockSpacing, choice, flag, linkPicker, linkUrl, resolveHref, str } from './shared';

/**
 * Liberty: Pulse rings hero. Mirrors the type already created in the CMS, so
 * `npm run config:push` leaves its fields as they are (it only adds sortOrder).
 * The CMS cannot store default values, so the defaults live in
 * app/_components_liberty/PulseRingsHero.tsx.
 *
 * A `select` field's `format: 'selectOne'` is what makes the CMS show a dropdown.
 */
const dropdown = <T extends ReturnType<typeof choice>>(field: T) => ({
  ...field,
  format: 'selectOne' as const,
  indexingType: 'queryable' as const,
});

/** Text field with the CMS length limit and search indexing. */
const text = (displayName: string, sortOrder: number, maxLength: number, description?: string) => ({
  ...str(displayName, sortOrder, description),
  maxLength,
  indexingType: 'searchable' as const,
});

export const LibPulseRingsHeroContentType = contentType({
  key: 'LibPulseRingsHero',
  baseType: '_component',
  displayName: 'Liberty: Pulse rings hero',
  description:
    'Animated hero with teal rings pulsing outward. Headline with optional highlight, subhead, two buttons and an optional round badge. Theme, layout, height and animation speed are editor settings.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Eyebrow: text('Eyebrow', 10, 60, 'Short line above the headline, e.g. "Auto insurance". Leave empty for none.'),
    Headline: {
      ...text(
        'Headline',
        20,
        100,
        'Main headline in sentence case, with closing punctuation. e.g. "Protection for the people you love."',
      ),
      isRequired: true,
    },
    HighlightText: text(
      'Highlighted phrase',
      30,
      60,
      'Part of the headline to highlight, e.g. "people you love". It must match the headline text exactly. Leave empty for no highlight.',
    ),
    Subhead: text('Subhead', 40, 200, 'Supporting sentence under the headline.'),
    PrimaryLabel: text('Primary button label', 50, 40, 'Sentence case, e.g. "Get a quote". Leave empty for no buttons.'),
    PrimaryLinkUrl: { ...linkUrl(60, 'Primary button URL (text)'), indexingType: 'queryable' as const },
    PrimaryLink: linkPicker(70, 'Primary button link (picker)'),
    SecondaryLabel: text(
      'Secondary button label',
      80,
      40,
      'Shown as a bold text link on Liberty Blue. Leave empty for none.',
    ),
    SecondaryLinkUrl: { ...linkUrl(90, 'Secondary button URL (text)'), indexingType: 'queryable' as const },
    SecondaryLink: linkPicker(100, 'Secondary button link (picker)'),
    ShowViolator: {
      ...flag(
        'Show round badge',
        110,
        "Teal circle beside the buttons for one short message. Hidden automatically on Liberty Yellow, because teal can't sit on yellow online.",
      ),
      indexingType: 'queryable' as const,
    },
    ViolatorText: text('Round badge text', 120, 30, 'Keep it to a few words, e.g. "Customize today".'),
    Theme: dropdown(
      choice(
        'Background colour',
        130,
        [
          ['blue', 'Liberty Blue'],
          ['white', 'White'],
          ['atmospheric', 'Atmospheric White'],
          ['yellow', 'Liberty Yellow'],
        ],
        'Default: Liberty Blue. Text colours and button styles adjust automatically to follow the brand rules.',
      ),
    ),
    ResponsiveLayout: dropdown(
      choice(
        'Layout',
        140,
        [
          ['center', 'Centre'],
          ['left', 'Left'],
          ['split', 'Split (text and image)'],
        ],
        'Default: Centre. Split puts the text beside the image below, and stacks on mobile.',
      ),
    ),
    ResponsiveHeight: dropdown(
      choice(
        'Height',
        150,
        [
          ['compact', 'Compact'],
          ['medium', 'Medium'],
          ['full', 'Full'],
        ],
        'Default: Medium.',
      ),
    ),
    AnimationSpeed: dropdown(
      choice(
        'Animation speed',
        160,
        [
          ['slow', 'Slow'],
          ['normal', 'Normal'],
          ['fast', 'Fast'],
        ],
        'Default: Normal. Motion is switched off for visitors who prefer reduced motion.',
      ),
    ),
    LoopAmbientMotion: {
      ...flag('Keep the rings pulsing', 170, 'On: the rings keep pulsing. Off: they play once and stop.'),
      indexingType: 'queryable' as const,
    },
    Image: {
      type: 'contentReference' as const,
      displayName: 'Image (split layout)',
      description:
        'Approved photo or illustration, used only in the Split layout. Without one, the animated rings show instead.',
      sortOrder: 180,
      allowedTypes: ['_image'],
    },
    ImageAlt: text(
      'Image alt text',
      190,
      150,
      'Describe the image for screen readers. Leave empty only if the image is purely decorative.',
    ),
  },
});

type Props = { content: ContentProps<typeof LibPulseRingsHeroContentType> };

/** The image's address from the Graph asset metadata, or '' when none is chosen. */
function imageUrl(image: unknown): string {
  const img = image as { assetMetadata?: { url?: string | null } | null; _metadata?: { url?: { default?: string | null } | null } } | null;
  return img?.assetMetadata?.url ?? img?._metadata?.url?.default ?? '';
}

export default function LibPulseRingsHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <LibertyBlock content={content} fullBleed>
      <PulseRingsHero
        theme={content.Theme}
        layout={content.ResponsiveLayout}
        height={content.ResponsiveHeight}
        speed={content.AnimationSpeed}
        loop={content.LoopAmbientMotion}
        showBadge={content.ShowViolator}
        badgeText={content.ViolatorText}
        eyebrow={content.Eyebrow}
        headline={content.Headline}
        highlightText={content.HighlightText}
        subhead={content.Subhead}
        primaryLabel={content.PrimaryLabel}
        primaryHref={resolveHref(content.PrimaryLinkUrl, content.PrimaryLink)}
        secondaryLabel={content.SecondaryLabel}
        secondaryHref={resolveHref(content.SecondaryLinkUrl, content.SecondaryLink)}
        imageSrc={imageUrl(content.Image)}
        imageAlt={content.ImageAlt}
        editAttrs={{
          eyebrow: pa('Eyebrow'),
          headline: pa('Headline'),
          subhead: pa('Subhead'),
          primary: pa('PrimaryLabel'),
          secondary: pa('SecondaryLabel'),
          badge: pa('ViolatorText'),
        }}
      />
    </LibertyBlock>
  );
}
