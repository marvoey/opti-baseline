import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Globe } from 'lucide-react';

/**
 * Capital One: Onboarding Journey — the account opening stepper (editor-managed).
 * A title + segment over a row of milestone cards (leaf `CibcMilestone`), each
 * with a status-driven progress bar.
 */
export const CibcMilestoneContentType = contentType({
  key: 'CibcMilestone',
  baseType: '_component',
  displayName: 'Capital One: Onboarding Milestone',
  description: 'A single onboarding step (number, title, status).',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Step: { type: 'string', displayName: 'Step', description: 'Step number, e.g. "01".', isLocalized: true, sortOrder: 10 },
    Title: { type: 'string', displayName: 'Title', description: 'Milestone label.', isLocalized: true, sortOrder: 20 },
    Status: {
      type: 'string',
      displayName: 'Status',
      description: 'Progress state for this step.',
      enum: [
        { value: 'COMPLETE', displayName: 'Complete' },
        { value: 'IN PROGRESS', displayName: 'In Progress' },
        { value: 'PENDING', displayName: 'Pending' },
      ],
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

export const CibcOnboardingJourneyContentType = contentType({
  key: 'CibcOnboardingJourney',
  baseType: '_component',
  displayName: 'Capital One: Onboarding Journey',
  description: 'An account opening dashboard: title, segment and an ordered set of milestones.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Title', description: 'Journey title.', isLocalized: true, sortOrder: 10 },
    Segment: { type: 'string', displayName: 'Segment', description: 'Audience segment subtitle.', isLocalized: true, sortOrder: 20 },
    Milestones: {
      type: 'array',
      displayName: 'Milestones',
      isLocalized: true,
      description: 'Ordered onboarding steps.',
      items: { type: 'component', contentType: CibcMilestoneContentType },
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof CibcOnboardingJourneyContentType> };

export default function CibcOnboardingJourney({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const milestones = content.Milestones ?? [];

  return (
    <div {...pa(block)} className="bg-white border-2 border-cibc-gold/40 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-cibc-teal/10 text-cibc-teal rounded-xl">
          <Globe size={24} />
        </div>
        <div>
          {content.Title ? (
            <h3 {...pa('Title')} className="font-serif text-xl font-semibold text-cibc-teal-dark">
              {content.Title}
            </h3>
          ) : null}
          {content.Segment ? <p className="text-sm text-cibc-ink/60">{content.Segment}</p> : null}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {milestones.map((step, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border-2 ${
              step?.Status === 'COMPLETE' ? 'bg-cibc-mint/10 border-cibc-mint/40' : 'bg-white border-black/5'
            }`}
          >
            <span className="text-xs font-bold text-cibc-ink/40">{step?.Step}</span>
            <p className="text-xs font-bold mt-1 uppercase text-cibc-teal-dark">{step?.Title}</p>
            <div
              className={`mt-2 h-1 rounded-full ${
                step?.Status === 'COMPLETE'
                  ? 'bg-cibc-teal'
                  : step?.Status === 'IN PROGRESS'
                    ? 'bg-cibc-gold w-1/2'
                    : 'bg-black/10'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
