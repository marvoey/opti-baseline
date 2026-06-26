import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Clock } from 'lucide-react';

/**
 * CIBC: Operational Alert Feed — the "T+1 velocity" panel. A heading + live-feed
 * label over a list of alert rows. Each alert is the leaf `CibcAlert` component,
 * held inline as a `component` array (rendered here directly, not via the
 * registry — mirrors nextjs-banner's ConditionGrid/QuickCareCards co-location).
 */
export const CibcAlertContentType = contentType({
  key: 'CibcAlert',
  baseType: '_component',
  displayName: 'CIBC: Operational Alert',
  description: 'A single operational alert row (severity, title, summary, timestamp).',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Severity: {
      type: 'string',
      displayName: 'Severity',
      description: 'Operational severity of the alert.',
      enum: [
        { value: 'URGENT', displayName: 'Urgent' },
        { value: 'MARKET', displayName: 'Market' },
        { value: 'HOLIDAY', displayName: 'Holiday' },
      ],
      isLocalized: true,
      sortOrder: 10,
    },
    Title: { type: 'string', displayName: 'Title', description: 'Short alert headline.', isLocalized: true, sortOrder: 20 },
    Summary: { type: 'string', displayName: 'Summary', description: 'One- or two-line description.', isLocalized: true, sortOrder: 30 },
    Timestamp: { type: 'string', displayName: 'Timestamp', description: 'Human-readable time, e.g. "2 mins ago".', isLocalized: true, sortOrder: 40 },
  },
});

export const CibcAlertFeedContentType = contentType({
  key: 'CibcAlertFeed',
  baseType: '_component',
  displayName: 'CIBC: Operational Alert Feed',
  description: 'A heading plus an ordered list of operational alerts.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', description: 'Feed heading, e.g. "Operational Alerts".', isLocalized: true, sortOrder: 10 },
    FeedLabel: { type: 'string', displayName: 'Feed Label', description: 'Right-aligned label, e.g. "Live Feed".', isLocalized: true, sortOrder: 20 },
    Alerts: {
      type: 'array',
      displayName: 'Alerts',
      isLocalized: true,
      description: 'Ordered list of operational alerts.',
      items: { type: 'component', contentType: CibcAlertContentType },
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof CibcAlertFeedContentType> };

export default function CibcAlertFeed({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const alerts = content.Alerts ?? [];

  return (
    <div {...pa(block)} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 {...pa('Heading')} className="text-lg font-bold flex items-center gap-2 text-cibc-teal">
          <Clock size={20} className="text-cibc-rust" /> {content.Heading ?? 'Operational Alerts'}
        </h2>
        {content.FeedLabel ? <span className="text-xs text-cibc-ink/60">{content.FeedLabel}</span> : null}
      </div>
      <div className="bg-white border border-black/5 rounded-xl divide-y divide-black/5 overflow-hidden shadow-sm">
        {alerts.map((alert, i) => (
          <div key={i} className="p-4 hover:bg-cibc-stone transition-colors cursor-pointer group">
            <div className="flex justify-between items-start">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  alert?.Severity === 'URGENT' ? 'bg-cibc-rust/10 text-cibc-rust' : 'bg-cibc-teal/10 text-cibc-teal'
                }`}
              >
                {alert?.Severity ?? 'MARKET'}
              </span>
              <span className="text-[10px] text-cibc-ink/50 font-medium">{alert?.Timestamp}</span>
            </div>
            <h3 className="text-sm font-bold mt-2 text-cibc-teal-dark group-hover:text-cibc-teal-mid transition-colors">
              {alert?.Title}
            </h3>
            <p className="text-xs text-cibc-ink/70 mt-1 line-clamp-2">{alert?.Summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
