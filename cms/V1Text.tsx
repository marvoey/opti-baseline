import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { faker } from '@faker-js/faker';

/**
 * V1: Text — the atomic text primitive of the design system. A single `Text`
 * value whose presentation (semantic tag, size, weight, colour) is chosen per
 * instance via the display template's `variant` / `tone` / `align` settings.
 *
 * One atom replaces the hero-specific Eyebrow / Headline / Subtext fields: an
 * editor drops a V1Text and picks `variant: eyebrow` (gold pill), `display`
 * (serif H1), `body` (paragraph), etc. Colours map to the `cibc-*` tokens in
 * app/globals.css so the whole system rebrands from there.
 */
export const V1TextContentType = contentType({
  key: 'V1Text',
  baseType: '_component',
  displayName: 'V1: Text',
  description: 'Atomic text element — variant chooses heading / eyebrow / body styling.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Text: {
      type: 'string',
      displayName: 'Text',
      description: 'The text content.',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
  },
});

export const V1TextDefault = displayTemplate({
  key: 'V1TextDefault',
  isDefault: true,
  displayName: 'V1: Text',
  contentType: 'V1Text',
  settings: {
    variant: {
      editor: 'select',
      displayName: 'Variant',
      sortOrder: 0,
      choices: {
        eyebrow: { displayName: 'Eyebrow (pill)', sortOrder: 5 },
        display: { displayName: 'Display (H1)', sortOrder: 2 },
        heading: { displayName: 'Heading (H2)', sortOrder: 3 },
        title: { displayName: 'Title (H3)', sortOrder: 4 },
        body: { displayName: 'Body', sortOrder: 1 },
        caption: { displayName: 'Caption', sortOrder: 6 },
      },
    },
    tone: {
      editor: 'select',
      displayName: 'Tone',
      sortOrder: 1,
      choices: {
        default: { displayName: 'Default (inherit)', sortOrder: 1 },
        muted: { displayName: 'Muted', sortOrder: 2 },
        gold: { displayName: 'Gold', sortOrder: 3 },
        onDark: { displayName: 'On dark', sortOrder: 4 },
      },
    },
    align: {
      editor: 'select',
      displayName: 'Align',
      sortOrder: 2,
      choices: {
        left: { displayName: 'Left', sortOrder: 1 },
        center: { displayName: 'Center', sortOrder: 2 },
        right: { displayName: 'Right', sortOrder: 3 },
      },
    },
  },
});

type Variant = 'eyebrow' | 'display' | 'heading' | 'title' | 'body' | 'caption';
type Tone = 'default' | 'muted' | 'gold' | 'onDark';
type Align = 'left' | 'center' | 'right';

// Per-variant element tag + base classes. Eyebrow is a self-contained pill so it
// carries its own colour; the others inherit colour from `tone`.
const VARIANT: Record<Variant, { tag: 'span' | 'h1' | 'h2' | 'h3' | 'p'; className: string; pill?: boolean }> = {
  eyebrow: {
    tag: 'span',
    pill: true,
    className:
      'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border border-cibc-gold/50 bg-cibc-gold/15 text-cibc-gold tracking-wide',
  },
  display: { tag: 'h1', className: 'font-serif text-4xl md:text-5xl font-semibold leading-tight' },
  heading: { tag: 'h2', className: 'font-serif text-3xl font-semibold leading-tight' },
  title: { tag: 'h3', className: 'font-serif text-xl font-semibold' },
  body: { tag: 'p', className: 'text-lg leading-relaxed' },
  caption: { tag: 'p', className: 'text-sm' },
};

const TONE: Record<Tone, string> = {
  default: '',
  muted: 'text-cibc-ink/70',
  gold: 'text-cibc-gold',
  onDark: 'text-white/70',
};

const ALIGN: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const PLACEHOLDER_FN: Record<Variant, () => string> = {
  eyebrow:  () => faker.lorem.words(2),
  display:  () => faker.lorem.words(5),
  heading:  () => faker.lorem.words(4),
  title:    () => faker.lorem.words(3),
  body:     () => faker.lorem.sentence(),
  caption:  () => faker.lorem.words(4),
};

const placeholder = (variant: Variant) => PLACEHOLDER_FN[variant]?.() ?? faker.lorem.words(4);

type Props = {
  content: ContentProps<typeof V1TextContentType>;
  displaySettings?: ContentProps<typeof V1TextDefault>;
};

export default function V1Text({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const variant = (displaySettings?.variant ?? 'body') as Variant;
  const tone = (displaySettings?.tone ?? 'default') as Tone;
  const align = (displaySettings?.align ?? 'left') as Align;

  const spec = VARIANT[variant] ?? VARIANT.body;
  const Tag = spec.tag;
  // The eyebrow pill owns its colour, so `tone` only applies to the text variants.
  const toneClass = spec.pill ? '' : TONE[tone] ?? '';
  const className = [spec.className, toneClass, ALIGN[align] ?? ''].filter(Boolean).join(' ');

  return (
    <Tag {...pa(block)} className={className}>
      <span {...pa('Text')}>{content.Text || placeholder(variant)}</span>
    </Tag>
  );
}
