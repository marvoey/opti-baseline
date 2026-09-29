import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Calendar } from 'lucide-react';

import { tierProperty } from './taxonomy';

/**
 * ActionBlock — "connect with your account lead" scheduling card for the NIQ
 * ABM demo. ActionPrimitiveBlock already exists in the tenant but models a
 * generic CTA button (no named-lead/scheduling fields), so this is net-new.
 */
export const ActionBlockContentType = contentType({
  key: 'ActionBlock',
  baseType: '_component',
  displayName: 'Action Block',
  description: 'Fast-path scheduling card: connect the visitor with a named account lead.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'e.g. "Connect with your dedicated account lead".',
      isLocalized: true,
      isRequired: true,
      sortOrder: 1,
    },
    LeadName: {
      type: 'string',
      format: 'shortString',
      displayName: 'Lead Name',
      isLocalized: true,
      sortOrder: 2,
    },
    LeadTitle: {
      type: 'string',
      format: 'shortString',
      displayName: 'Lead Title',
      isLocalized: true,
      sortOrder: 3,
    },
    CalendarUrl: {
      type: 'url',
      displayName: 'Calendar URL',
      description: 'Scheduling link, e.g. a Calendly URL.',
      sortOrder: 4,
    },
    ButtonText: {
      type: 'string',
      format: 'shortString',
      displayName: 'Button Text',
      description: "Label for the primary CTA button (overrides the default 'Schedule a meeting').",
      isLocalized: true,
      sortOrder: 5,
    },
    ...tierProperty(20),
  },
});

type Props = { content: ContentProps<typeof ActionBlockContentType> };

export default function ActionBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const initials = content.LeadName
    ? content.LeadName
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null;

  return (
    <section {...pa(block)} className="w-full px-6 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xl shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        {initials && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2D6DF6] to-[#00D2FF] text-lg font-bold text-white">
            {initials}
          </div>
        )}
        <h2 {...pa('Headline')} className="text-2xl font-bold text-blue-950">
          {content.Headline}
        </h2>
        {(content.LeadName || content.LeadTitle) && (
          <p className="text-sm text-gray-600">
            <span {...pa('LeadName')} className="font-medium">
              {content.LeadName}
            </span>
            {content.LeadName && content.LeadTitle && ' — '}
            <span {...pa('LeadTitle')}>{content.LeadTitle}</span>
          </p>
        )}
        {content.CalendarUrl?.default && (
          <a
            {...pa('CalendarUrl')}
            href={content.CalendarUrl.default}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#2D6DF6] px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.03] hover:bg-blue-600"
          >
            <Calendar className="h-4 w-4" />
            <span {...pa('ButtonText')}>{content.ButtonText || 'Schedule a meeting'}</span>
          </a>
        )}
      </div>
    </section>
  );
}
