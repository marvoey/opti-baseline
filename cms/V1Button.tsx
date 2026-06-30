import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ChevronRight } from 'lucide-react';
import { ctaHref, type OptiLink } from './shared';

/**
 * V1: Button — the atomic call-to-action primitive. A single `Link` whose look
 * (primary / secondary / ghost, and size) is chosen per instance via the
 * display template. Replaces the hero-specific PrimaryCta / SecondaryCta: drop
 * two V1Buttons and set one `variant: primary`, the other `variant: secondary`.
 */
export const V1ButtonContentType = contentType({
  key: 'V1Button',
  baseType: '_component',
  displayName: 'V1: Button',
  description: 'Atomic call-to-action — variant chooses primary / secondary / ghost styling.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Link: {
      type: 'link',
      displayName: 'Link',
      description: 'Button label + destination.',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
  },
});

export const V1ButtonDefault = displayTemplate({
  key: 'V1ButtonDefault',
  isDefault: true,
  displayName: 'V1: Button',
  contentType: 'V1Button',
  settings: {
    variant: {
      editor: 'select',
      displayName: 'Variant',
      sortOrder: 0,
      choices: {
        primary: { displayName: 'Primary (gold)', sortOrder: 1 },
        secondary: { displayName: 'Secondary (outline)', sortOrder: 2 },
        ghost: { displayName: 'Ghost (text)', sortOrder: 3 },
      },
    },
    size: {
      editor: 'select',
      displayName: 'Size',
      sortOrder: 1,
      choices: {
        sm: { displayName: 'Small', sortOrder: 1 },
        md: { displayName: 'Medium', sortOrder: 2 },
        lg: { displayName: 'Large', sortOrder: 3 },
      },
    },
  },
});

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANT: Record<Variant, string> = {
  primary: 'bg-cibc-gold text-cibc-teal-dark font-bold shadow-lg hover:bg-cibc-gold-bright transition-all',
  secondary:
    'border border-cibc-teal/30 text-cibc-teal font-bold hover:bg-cibc-teal/5 transition-all',
  ghost: 'text-cibc-teal font-bold hover:text-cibc-teal-dark transition-all',
};

const SIZE: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 rounded-lg',
  lg: 'px-7 py-3.5 text-lg rounded-lg',
};

type Props = {
  content: ContentProps<typeof V1ButtonContentType>;
  displaySettings?: ContentProps<typeof V1ButtonDefault>;
};

export default function V1Button({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const edit = (content as { __context?: { edit?: boolean } }).__context?.edit;

  const variant = (displaySettings?.variant ?? 'primary') as Variant;
  const size = (displaySettings?.size ?? 'md') as Size;

  const link = content.Link as OptiLink;
  const label = link?.text || link?.title || 'Learn more';
  // Suppress the href in the editor so clicks select the block instead of navigating.
  const href = edit ? undefined : ctaHref(link);
  const className = ['inline-flex items-center gap-2', VARIANT[variant], SIZE[size]].join(' ');

  return (
    <a {...pa(block)} href={href} target={edit ? undefined : link?.target ?? undefined} className={className}>
      <span {...pa('Link')}>{label}</span>
      {variant === 'primary' ? <ChevronRight size={18} /> : null}
    </a>
  );
}
