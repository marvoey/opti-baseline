import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { eventKeyProperty } from './shared';
import { hrefOf } from './ui';

export const HrbLinkItemContentType = contentType({
  key: 'HRB_LinkItem',
  baseType: '_component',
  displayName: '[HRB] Link Item',
  description:
    'H&R Block demo: a translatable label with a URL and optional event key. Used inline inside Quick Links and Category Nav.',
  properties: {
    Label: { type: 'string', displayName: 'Label', isLocalized: true, isRequired: true },
    Url: { type: 'url', displayName: 'URL', isRequired: true },
    EventKey: eventKeyProperty('Event key'),
    OpensInNewTab: { type: 'boolean', displayName: 'Opens in new tab', isRequired: false },
  },
});

type Props = { content: ContentProps<typeof HrbLinkItemContentType> };

/** Inline pill link; shared by Quick Links (cards) and Category Nav (chips). */
export default function LinkItem({ content }: Props) {
  const newTab = !!content.OpensInNewTab;
  const event = content.EventKey && content.EventKey !== 'none' ? content.EventKey : undefined;
  return (
    <a
      href={hrefOf(content.Url)}
      data-event-key={event}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex items-center justify-between gap-3 rounded-xl border border-hrb-border bg-white px-4 py-4 font-semibold text-blue-800 hover:border-blue-800 group-data-[dark=true]:border-white/30 group-data-[dark=true]:bg-transparent group-data-[dark=true]:text-white"
    >
      <span>{content.Label}</span>
      <span aria-hidden="true">{newTab ? '↗' : '→'}</span>
    </a>
  );
}
