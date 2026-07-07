import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const ActionBlockContentType = contentType({
  key: 'ActionBlock',
  baseType: '_component',
  displayName: 'v2: Action Block',
  description: 'Interactive trigger: button, text link, or email capture form.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    InteractionType: {
      type: 'string',
      displayName: 'Interaction Type',
      isRequired: true,
      sortOrder: 10,
      enum: [
        { value: 'button', displayName: 'Button' },
        { value: 'text_link', displayName: 'Text Link' },
        { value: 'email_form', displayName: 'Email Form' },
      ],
    },
    ActionLabel: {
      type: 'string',
      displayName: 'Action Label',
      description: 'CTA copy. Max 30 characters.',
      maxLength: 30,
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
    DestinationUrl: {
      type: 'url',
      displayName: 'Destination URL',
      isLocalized: true,
      sortOrder: 30,
    },
    VisualHierarchy: {
      type: 'string',
      displayName: 'Visual Hierarchy',
      isRequired: true,
      sortOrder: 40,
      enum: [
        { value: 'primary', displayName: 'Primary' },
        { value: 'secondary', displayName: 'Secondary' },
        { value: 'ghost', displayName: 'Ghost' },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof ActionBlockContentType> };

const HIERARCHY_CLASS: Record<string, string> = {
  primary: 'rounded-full bg-blue-600 px-7 py-3.5 font-bold text-white hover:bg-blue-500',
  secondary:
    'rounded-full border-2 border-blue-600 px-7 py-3.5 font-bold text-blue-600 hover:bg-blue-600 hover:text-white',
  ghost: 'font-bold text-blue-600 underline-offset-2 hover:underline',
};

export default function ActionBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const edit = (content as { __context?: { edit?: boolean } }).__context?.edit;
  const href = edit ? undefined : content.DestinationUrl?.default ?? undefined;
  const label = content.ActionLabel ?? 'Learn more';
  const btnClass = HIERARCHY_CLASS[content.VisualHierarchy ?? 'primary'] ?? HIERARCHY_CLASS.primary;

  return (
    <div {...pa(block)} className="w-full px-6 py-8">
      {content.InteractionType === 'email_form' ? (
        <form
          {...pa('ActionLabel')}
          className="flex max-w-md gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
          />
          <button type="submit" className={btnClass}>
            {label}
          </button>
        </form>
      ) : content.InteractionType === 'text_link' ? (
        <a {...pa('ActionLabel')} href={href} className={btnClass}>
          {label}
        </a>
      ) : (
        <a {...pa('ActionLabel')} href={href} className={`inline-block ${btnClass}`}>
          {label}
        </a>
      )}
    </div>
  );
}
