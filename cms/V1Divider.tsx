import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

/**
 * V1: Divider — the atomic horizontal rule. Pure presentation: it has no content
 * fields, so every knob (weight, tone, vertical spacing) lives on the display
 * template. Element content properties ARE delivered (unlike sections), but this
 * atom simply has none.
 */
export const V1DividerContentType = contentType({
  key: 'V1Divider',
  baseType: '_component',
  displayName: 'V1: Divider',
  description: 'Atomic horizontal rule — weight / tone / spacing via display template.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

export const V1DividerDefault = displayTemplate({
  key: 'V1DividerDefault',
  isDefault: true,
  displayName: 'V1: Divider',
  contentType: 'V1Divider',
  settings: {
    weight: {
      editor: 'select',
      displayName: 'Weight',
      sortOrder: 0,
      choices: {
        hairline: { displayName: 'Hairline', sortOrder: 1 },
        thin: { displayName: 'Thin', sortOrder: 2 },
        thick: { displayName: 'Thick', sortOrder: 3 },
      },
    },
    tone: {
      editor: 'select',
      displayName: 'Tone',
      sortOrder: 1,
      choices: {
        muted: { displayName: 'Muted', sortOrder: 1 },
        gold: { displayName: 'Gold', sortOrder: 2 },
      },
    },
    spacing: {
      editor: 'select',
      displayName: 'Spacing',
      sortOrder: 2,
      choices: {
        sm: { displayName: 'Small', sortOrder: 1 },
        md: { displayName: 'Medium', sortOrder: 2 },
        lg: { displayName: 'Large', sortOrder: 3 },
      },
    },
  },
});

type Weight = 'hairline' | 'thin' | 'thick';
type Tone = 'muted' | 'gold';
type Spacing = 'sm' | 'md' | 'lg';

const WEIGHT: Record<Weight, string> = {
  hairline: 'border-t',
  thin: 'border-t-2',
  thick: 'border-t-4',
};
const TONE: Record<Tone, string> = {
  muted: 'border-cibc-ink/20',
  gold: 'border-cibc-gold/60',
};
const SPACING: Record<Spacing, string> = {
  sm: 'my-3',
  md: 'my-6',
  lg: 'my-10',
};

type Props = {
  content: ContentProps<typeof V1DividerContentType>;
  displaySettings?: ContentProps<typeof V1DividerDefault>;
};

export default function V1Divider({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const weight = (displaySettings?.weight ?? 'hairline') as Weight;
  const tone = (displaySettings?.tone ?? 'muted') as Tone;
  const spacing = (displaySettings?.spacing ?? 'md') as Spacing;

  return <hr {...pa(block)} className={`${WEIGHT[weight]} ${TONE[tone]} ${SPACING[spacing]}`} />;
}
