import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const RichTextContentType = contentType({
  key: 'RichTextBlock',
  baseType: '_component',
  displayName: 'Rich Text',
  description: 'A block of formatted text content.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Body: {
      type: 'richText',
      displayName: 'Body',
      description: 'Formatted text content.',
      isLocalized: true,
      sortOrder: 10,
      editorSettings: {
        preset: 'expanded',
      },
    },
  },
});

/**
 * Approved text/background pairings from the brand-visual-identity styleguide
 * (app/styleguide/page.tsx, "Approved text/background pairings" section) —
 * the only combinations editors may choose here.
 *
 * `section` matches the styleguide swatches' classNames exactly (background
 * + text color). `prose` is one of the prose-on-* color themes defined in
 * app/globals.css, which override every --tw-prose-* variable Tailwind
 * Typography uses — without it, `.prose` paints headings/links/etc in its
 * own default gray regardless of the section's text color. `border` marks
 * the one pairing (Dark Fir on Neutral 1) that has a border in the
 * styleguide, since Neutral 1 on white needs it for definition — its color
 * is editor-configurable via the BorderColor setting below.
 */
const THEME_CLASSES = {
  darkFirOnLfgreen: { section: 'bg-lfgreen text-dark-fir', prose: 'prose-on-dark-fir', border: false },
  darkFirOnLightBlue: { section: 'bg-light-blue text-dark-fir', prose: 'prose-on-dark-fir', border: false },
  darkFirOnNeutral3: { section: 'bg-neutral-3 text-dark-fir', prose: 'prose-on-dark-fir', border: false },
  darkFirOnNeutral1: { section: 'bg-neutral-1 text-dark-fir', prose: 'prose-on-dark-fir', border: true },
  darkFirOnNeutral2: { section: 'bg-neutral-2 text-dark-fir', prose: 'prose-on-dark-fir', border: false },
  neutral1OnDarkFir: { section: 'bg-dark-fir text-neutral-1', prose: 'prose-on-neutral-1', border: false },
  lfgreenOnDarkFir: { section: 'bg-dark-fir text-lfgreen', prose: 'prose-on-lfgreen', border: false },
} as const;

type ThemeKey = keyof typeof THEME_CLASSES;

/** Border color choices for the Dark Fir on Neutral 1 pairing — neutral tones only. */
const BORDER_COLOR_CLASSES = {
  neutral4: 'border-neutral-4',
  neutral5: 'border-neutral-5',
  neutral6: 'border-neutral-6',
} as const;

type BorderColorKey = keyof typeof BORDER_COLOR_CLASSES;

/**
 * Corner radius choices, matching the brand-visual-identity "Opal" scale
 * (app/styleguide/page.tsx, "Corner radii" section): buttons/small elements
 * at 8px, modules/cards at the 32px squircle, or a full pill.
 */
const RADIUS_CLASSES = {
  none: '',
  small: 'rounded-lg',
  large: 'rounded-4xl',
  full: 'rounded-full',
} as const;

type RadiusKey = keyof typeof RADIUS_CLASSES;

export const RichTextThemeDisplayTemplate = displayTemplate({
  key: 'RichTextTheme',
  isDefault: true,
  displayName: 'Rich Text Theme',
  contentType: 'RichTextBlock',
  settings: {
    Theme: {
      editor: 'select',
      displayName: 'Text/Background Pairing',
      sortOrder: 0,
      choices: {
        darkFirOnNeutral1: { displayName: 'Dark Fir on Neutral 1', sortOrder: 1 },
        darkFirOnNeutral2: { displayName: 'Dark Fir on Neutral 2', sortOrder: 2 },
        darkFirOnNeutral3: { displayName: 'Dark Fir on Neutral 3', sortOrder: 3 },
        darkFirOnLfgreen: { displayName: 'Dark Fir on LFGreen', sortOrder: 4 },
        darkFirOnLightBlue: { displayName: 'Dark Fir on Light Blue', sortOrder: 5 },
        neutral1OnDarkFir: { displayName: 'Neutral 1 on Dark Fir', sortOrder: 6 },
        lfgreenOnDarkFir: { displayName: 'LFGreen on Dark Fir', sortOrder: 7 },
      },
    },
    BorderColor: {
      editor: 'select',
      displayName: 'Border Color (Dark Fir on Neutral 1 only)',
      sortOrder: 1,
      choices: {
        neutral4: { displayName: 'Neutral 4', sortOrder: 1 },
        neutral5: { displayName: 'Neutral 5', sortOrder: 2 },
        neutral6: { displayName: 'Neutral 6', sortOrder: 3 },
      },
    },
    CornerRadius: {
      editor: 'select',
      displayName: 'Corner Radius',
      sortOrder: 2,
      choices: {
        none: { displayName: 'None', sortOrder: 1 },
        small: { displayName: 'Small (8px)', sortOrder: 2 },
        large: { displayName: 'Large (32px "Opal")', sortOrder: 3 },
        full: { displayName: 'Full (pill)', sortOrder: 4 },
      },
    },
  },
});

function themeClasses(value: string | null | undefined) {
  return THEME_CLASSES[value as ThemeKey] ?? THEME_CLASSES.darkFirOnNeutral1;
}

function borderColorClass(value: string | null | undefined): string {
  return BORDER_COLOR_CLASSES[value as BorderColorKey] ?? BORDER_COLOR_CLASSES.neutral5;
}

function radiusClass(value: string | null | undefined): string {
  return RADIUS_CLASSES[value as RadiusKey] ?? RADIUS_CLASSES.none;
}

/**
 * The CMS has been observed persisting a display setting's key with the wrong
 * casing (e.g. `Theme` saved as `theme`) when it's edited alongside other
 * settings on the same node, even though the display template schema defines
 * it as `Theme` — see the RichTextTheme display template on content
 * b26d09ef4cff432cb23e723bd294cf48, where v18 lowercased `Theme` while
 * `BorderColor`/`CornerRadius` on the same node kept correct casing. Look up
 * setting values case-insensitively so a re-occurrence doesn't silently fall
 * back to the default theme.
 */
function readSetting(
  displaySettings: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  if (!displaySettings) return undefined;
  const match = Object.keys(displaySettings).find((k) => k.toLowerCase() === key.toLowerCase());
  return match ? (displaySettings[match] as string) : undefined;
}

type Props = {
  content: ContentProps<typeof RichTextContentType>;
  displaySettings?: ContentProps<typeof RichTextThemeDisplayTemplate>;
};

export default function RichText({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const settings = displaySettings as Record<string, unknown> | undefined;
  const theme = themeClasses(readSetting(settings, 'Theme'));
  const border = theme.border ? `border ${borderColorClass(readSetting(settings, 'BorderColor'))}` : '';
  const radius = radiusClass(readSetting(settings, 'CornerRadius'));
  const sectionClassName = ['w-full px-6 py-12', theme.section, border, radius]
    .filter(Boolean)
    .join(' ');

  return (
    <section {...pa(block)} className={sectionClassName}>
      <div {...pa('Body')} className={`prose ${theme.prose} mx-auto max-w-3xl`}>
        <RichTextRenderer content={content.Body?.json} />
      </div>
    </section>
  );
}
