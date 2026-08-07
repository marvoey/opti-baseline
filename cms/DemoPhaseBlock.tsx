import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

type AccentVariant = 'neutral' | 'insight' | 'highlight';

const ACCENT_BAR: Record<AccentVariant, string> = {
  neutral:   'bg-opti-n3',
  insight:   'bg-opti-good',
  highlight: 'bg-opti-green',
};

const GOAL_BADGE: Record<AccentVariant, string> = {
  neutral:   'bg-opti-n3 text-opti-dark',
  insight:   'bg-opti-n3 text-opti-good',
  highlight: 'bg-opti-green text-opti-dark',
};

const ICON_COLOR: Record<AccentVariant, string> = {
  neutral:   'text-opti-dark',
  insight:   'text-opti-good',
  highlight: 'text-opti-grass',
};

function PhaseIcon({ variant }: { variant: AccentVariant }) {
  const cls = `w-5 h-5 ${ICON_COLOR[variant]}`;
  if (variant === 'insight') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
  if (variant === 'highlight') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  );
}

export const DemoPhaseBlockContentType = contentType({
  key: 'DemoPhaseBlock',
  baseType: '_component',
  displayName: 'Demo Phase Block',
  description: 'A structured phase card for demo scripts: goal, action, and talk track.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    PhaseTitle: {
      type: 'string',
      displayName: 'Phase Title',
      description: 'e.g. "Phase 1: Establishing the Baseline"',
      isLocalized: true,
      sortOrder: 5,
    },
    AccentVariant: {
      type: 'string',
      displayName: 'Accent Variant',
      description: 'Controls the accent bar and goal badge color.',
      isLocalized: false,
      sortOrder: 10,
      enum: [
        { value: 'neutral',   displayName: 'Neutral — opti-n3 bar (Phase 1)' },
        { value: 'insight',   displayName: 'Insight — opti-good bar (Phase 2)' },
        { value: 'highlight', displayName: 'Highlight — opti-green bar (Phase 3)' },
      ],
    },
    GoalText: {
      type: 'string',
      displayName: 'Goal',
      description: 'One-sentence goal for this demo phase.',
      isLocalized: true,
      sortOrder: 15,
    },
    ActionDescription: {
      type: 'richText',
      displayName: 'Action Description',
      description: 'What the presenter does on screen. Inline <code> is supported.',
      isLocalized: true,
      sortOrder: 20,
    },
    TalkTrack: {
      type: 'richText',
      displayName: 'Talk Track',
      description: 'Presenter script. Bold the key takeaway line for emphasis.',
      isLocalized: true,
      sortOrder: 25,
    },
  },
});

type Props = { content: ContentProps<typeof DemoPhaseBlockContentType> };

export default function DemoPhaseBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const variant = (content.AccentVariant ?? 'neutral') as AccentVariant;
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="bg-white p-8 rounded-opti shadow-sm border-2 border-opti-n3 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-2 h-full ${ACCENT_BAR[variant]}`} />

      <h2 {...pa('PhaseTitle')} className="font-display font-bold text-2xl mb-4 text-opti-dark">
        {content.PhaseTitle}
      </h2>

      <div className="mb-6 flex items-start gap-3">
        <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide ${GOAL_BADGE[variant]}`}>
          Goal
        </span>
        <p {...pa('GoalText')} className="text-opti-dark">{content.GoalText}</p>
      </div>

      <div className="bg-opti-n3 border border-opti-n3 rounded-opti p-5 mb-6">
        <h4 className="font-display font-bold text-opti-dark mb-2 flex items-center gap-2">
          <PhaseIcon variant={variant} />
          Action
        </h4>
        <div
          {...pa('ActionDescription')}
          className="text-opti-dark text-sm leading-relaxed [&_code]:bg-white [&_code]:px-1 [&_code]:rounded [&_code]:text-opti-good"
        >
          <RichTextRenderer content={content.ActionDescription?.json} />
        </div>
      </div>

      <div
        {...pa('TalkTrack')}
        className="talk-track p-6 rounded-r-opti shadow-inner text-lg leading-relaxed italic [&_strong]:font-semibold [&_strong]:text-opti-good [&_strong]:not-italic"
      >
        <RichTextRenderer content={content.TalkTrack?.json} />
      </div>
    </section>
  );
}
