import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import {
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Bell,
  Landmark,
  TrendingUp,
  Lock,
  CircleHelp,
  type LucideIcon,
} from 'lucide-react';

/**
 * V1: Icon — the atomic icon primitive. `Name` is a curated whitelist of
 * lucide-react glyphs (so editors can't reference an arbitrary/missing icon);
 * size and tone are display-template settings. Tones map to `cibc-*` tokens.
 */

// The curated icon set. Add to BOTH this map and the `Name` enum below to expose
// a new glyph.
const ICONS: Record<string, LucideIcon> = {
  barChart: BarChart3,
  chevronRight: ChevronRight,
  shield: ShieldCheck,
  bell: Bell,
  bank: Landmark,
  trending: TrendingUp,
  lock: Lock,
};

export const V1IconContentType = contentType({
  key: 'V1Icon',
  baseType: '_component',
  displayName: 'V1: Icon',
  description: 'Atomic icon element — curated lucide glyph, size + tone via display template.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Name: {
      type: 'string',
      displayName: 'Icon',
      description: 'Which glyph to render.',
      isLocalized: false,
      sortOrder: 10,
      enum: [
        { value: 'barChart', displayName: 'Bar chart' },
        { value: 'chevronRight', displayName: 'Chevron right' },
        { value: 'shield', displayName: 'Shield (secure)' },
        { value: 'bell', displayName: 'Bell (alert)' },
        { value: 'bank', displayName: 'Bank / landmark' },
        { value: 'trending', displayName: 'Trending up' },
        { value: 'lock', displayName: 'Lock' },
      ],
    },
    Label: {
      type: 'string',
      displayName: 'Accessible label',
      description: 'Optional. Describes the icon for screen readers; leave blank if decorative.',
      isLocalized: true,
      sortOrder: 20,
    },
  },
});

export const V1IconDefault = displayTemplate({
  key: 'V1IconDefault',
  isDefault: true,
  displayName: 'V1: Icon',
  contentType: 'V1Icon',
  settings: {
    size: {
      editor: 'select',
      displayName: 'Size',
      sortOrder: 0,
      choices: {
        sm: { displayName: 'Small', sortOrder: 1 },
        md: { displayName: 'Medium', sortOrder: 2 },
        lg: { displayName: 'Large', sortOrder: 3 },
        xl: { displayName: 'Extra large', sortOrder: 4 },
      },
    },
    tone: {
      editor: 'select',
      displayName: 'Tone',
      sortOrder: 1,
      choices: {
        default: { displayName: 'Default (inherit)', sortOrder: 1 },
        gold: { displayName: 'Gold', sortOrder: 2 },
        teal: { displayName: 'Teal', sortOrder: 3 },
        muted: { displayName: 'Muted', sortOrder: 4 },
      },
    },
  },
});

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Tone = 'default' | 'gold' | 'teal' | 'muted';

const SIZE_PX: Record<Size, number> = { sm: 16, md: 24, lg: 40, xl: 64 };
const TONE: Record<Tone, string> = {
  default: '',
  gold: 'text-cibc-gold',
  teal: 'text-cibc-teal',
  muted: 'text-cibc-ink/60',
};

type Props = {
  content: ContentProps<typeof V1IconContentType>;
  displaySettings?: ContentProps<typeof V1IconDefault>;
};

export default function V1Icon({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const size = (displaySettings?.size ?? 'md') as Size;
  const tone = (displaySettings?.tone ?? 'default') as Tone;

  const Glyph = ICONS[content.Name ?? ''] ?? CircleHelp;
  const label = content.Label ?? undefined;

  return (
    <span {...pa(block)} className={`inline-flex ${TONE[tone]}`}>
      <Glyph
        size={SIZE_PX[size]}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? 'img' : undefined}
      />
    </span>
  );
}
