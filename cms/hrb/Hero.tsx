import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { choice, eventKeyProperty, tierProperties } from './shared';
import { CtaButton } from './ui';

export const HrbHeroContentType = contentType({
  key: 'HRB_Hero',
  baseType: '_component',
  displayName: '[HRB] Hero',
  description:
    'H&R Block demo: top-of-page message with eyebrow, headline, sub-copy and two buttons. The element the persona and A/B variations change.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Eyebrow: { type: 'string', displayName: 'Eyebrow', isLocalized: true, isRequired: false },
    Headline: { type: 'string', displayName: 'Headline', isLocalized: true, isRequired: true },
    Subcopy: { type: 'string', displayName: 'Sub-copy', isLocalized: true, isRequired: false },
    PrimaryCtaLabel: {
      type: 'string',
      displayName: 'Primary button label',
      isLocalized: true,
      isRequired: false,
    },
    PrimaryCtaUrl: { type: 'url', displayName: 'Primary button URL', isRequired: false },
    PrimaryCtaEventKey: eventKeyProperty('Primary button event key'),
    SecondaryCtaLabel: {
      type: 'string',
      displayName: 'Secondary button label',
      isLocalized: true,
      isRequired: false,
    },
    SecondaryCtaUrl: { type: 'url', displayName: 'Secondary button URL', isRequired: false },
    SecondaryCtaEventKey: eventKeyProperty('Secondary button event key'),
    Image: {
      type: 'contentReference',
      displayName: 'Image',
      description: 'DAM image. Graph returns a reference only; resolve it with expandReferences().',
      isRequired: false,
      allowedTypes: ['_image'],
    },
    ShowCountdown: {
      type: 'boolean',
      displayName: 'Show countdown chip',
      description: 'Shows the computed days-to-April-15 chip, labelled as demo (UrgencyB).',
      isRequired: false,
    },
    ...tierProperties(),
  },
});

export const HrbHeroDisplayTemplate = displayTemplate({
  key: 'HRB_HeroStyle',
  isDefault: true,
  displayName: '[HRB] Hero style',
  contentType: 'HRB_Hero',
  settings: {
    Theme: {
      editor: 'select',
      displayName: 'Theme',
      sortOrder: 0,
      choices: {
        darkGreen: { displayName: 'Dark green', sortOrder: 1 },
        sand: { displayName: 'Sand', sortOrder: 2 },
        warmWhite: { displayName: 'Warm white', sortOrder: 3 },
      },
    },
    MediaPosition: {
      editor: 'select',
      displayName: 'Image',
      sortOrder: 1,
      choices: {
        none: { displayName: 'No image', sortOrder: 1 },
        right: { displayName: 'Image right', sortOrder: 2 },
      },
    },
  },
});

const THEMES = {
  darkGreen: 'bg-blue-950 text-white',
  sand: 'bg-hrb-sand text-hrb-ink',
  warmWhite: 'bg-hrb-warm-white text-hrb-ink',
} as const;

/** Whole days from today to the next April 15 (demo-only chip). */
function daysToApril15(now = new Date()) {
  let target = new Date(now.getFullYear(), 3, 15);
  if (target < now) target = new Date(now.getFullYear() + 1, 3, 15);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

type Props = {
  content: ContentProps<typeof HrbHeroContentType>;
  displaySettings?: ContentProps<typeof HrbHeroDisplayTemplate>;
};

export default function Hero({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const theme = choice(THEMES, displaySettings?.Theme, 'darkGreen');
  const dark = theme === 'darkGreen';
  const image = content.Image?.item?.Url ?? content.Image?.url?.default ?? null;
  const showImage = displaySettings?.MediaPosition === 'right' && !!image;

  return (
    <section
      {...pa(block)}
      data-dark={dark}
      className={`group w-full px-6 py-10 md:py-16 ${THEMES[theme]}`}
    >
      <div className={`mx-auto grid max-w-6xl items-center gap-10 ${showImage ? 'md:grid-cols-2' : ''}`}>
        <div>
          {content.Eyebrow && (
            <div {...pa('Eyebrow')} className={`mb-3 text-xs font-semibold uppercase tracking-[0.14em] ${dark ? 'text-blue-400' : 'text-blue-800'}`}>
              {content.Eyebrow}
            </div>
          )}
          <h1 {...pa('Headline')} className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
            {content.Headline}
          </h1>
          {content.Subcopy && (
            <p {...pa('Subcopy')} className="mt-4 max-w-2xl text-base opacity-85 md:text-lg">
              {content.Subcopy}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaButton
              label={content.PrimaryCtaLabel}
              url={content.PrimaryCtaUrl}
              eventKey={content.PrimaryCtaEventKey}
              dark={dark}
              editProps={pa('PrimaryCtaLabel')}
            />
            <CtaButton
              label={content.SecondaryCtaLabel}
              url={content.SecondaryCtaUrl}
              eventKey={content.SecondaryCtaEventKey}
              variant="secondary"
              dark={dark}
              editProps={pa('SecondaryCtaLabel')}
            />
          </div>
          {content.ShowCountdown && (
            <div className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${dark ? 'bg-blue-400/15 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
              {daysToApril15()} days to April 15 · computed, demo
            </div>
          )}
        </div>
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...pa('Image')}
            src={image!}
            alt={(content.Image?.item as { AltText?: string | null } | null)?.AltText ?? ''}
            className="w-full rounded-2xl object-cover"
          />
        )}
      </div>
    </section>
  );
}
