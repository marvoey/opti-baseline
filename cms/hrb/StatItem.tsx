import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { CalendarDays, FileCheck2, Users } from 'lucide-react';

export const HrbStatItemContentType = contentType({
  key: 'HRB_StatItem',
  baseType: '_component',
  displayName: '[HRB] Stat Item',
  description:
    'H&R Block demo: one trust figure with an icon, a bold figure and a short line, e.g. "22 million+" / "clients worldwide trusted H&R Block last year". Used inline inside Trust Bar.',
  properties: {
    Icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      description: 'Line icon shown beside the figure. Choice property, not localized.',
      isRequired: false,
      enum: [
        { value: 'clients', displayName: 'Clients' },
        { value: 'years', displayName: 'Years' },
        { value: 'returns', displayName: 'Returns' },
        { value: 'none', displayName: 'None' },
      ],
    },
    Figure: {
      type: 'string',
      displayName: 'Figure',
      description: 'The bold figure, copied from hrblock.com, e.g. "22 million+".',
      isLocalized: true,
      isRequired: true,
    },
    Line: {
      type: 'string',
      displayName: 'Line',
      description: 'The short line under the figure.',
      isLocalized: true,
      isRequired: true,
    },
  },
});

const ICONS = { clients: Users, years: CalendarDays, returns: FileCheck2 } as const;

type Props = { content: ContentProps<typeof HrbStatItemContentType> };

export default function StatItem({ content }: Props) {
  const Icon = ICONS[content.Icon as keyof typeof ICONS];
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {Icon && <Icon size={28} aria-hidden className="text-blue-600 group-data-[dark=true]:text-blue-400" />}
      <div className="text-xl font-bold underline decoration-blue-400 decoration-2 underline-offset-4">
        {content.Figure}
      </div>
      <div className="max-w-[16rem] text-sm opacity-80">{content.Line}</div>
    </div>
  );
}
