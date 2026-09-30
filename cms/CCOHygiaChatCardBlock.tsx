import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Sparkles } from 'lucide-react';

export const CCOHygiaChatCardBlockContentType = contentType({
  key: 'CCOHygiaChatCardBlock',
  baseType: '_component',
  displayName: 'CCO Hygia Chat Card',
  description: 'Static, simulated chat snippet that previews the coaching conversation.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    AgentName: {
      type: 'string',
      displayName: 'Agent Name',
      isLocalized: true,
      sortOrder: 10,
    },
    Greeting: {
      type: 'string',
      displayName: 'Greeting',
      description: 'First message from the coach.',
      isLocalized: true,
      sortOrder: 20,
    },
    SampleReply: {
      type: 'string',
      displayName: 'Sample User Reply',
      isLocalized: true,
      sortOrder: 30,
    },
    FollowUp: {
      type: 'string',
      displayName: 'Coach Follow-up',
      description: 'Reflective follow-up message.',
      isLocalized: true,
      sortOrder: 40,
    },
    Footnote: {
      type: 'string',
      displayName: 'Footnote',
      description: 'Small print under the card, e.g. "Illustrative conversation".',
      isLocalized: true,
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof CCOHygiaChatCardBlockContentType> };

export default function CCOHygiaChatCardBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <aside {...pa(block)} className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-teal-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        <span {...pa('AgentName')}>{content.AgentName}</span>
      </div>
      <div className="space-y-3 text-sm">
        <p
          {...pa('Greeting')}
          className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-2.5 text-slate-200"
        >
          {content.Greeting}
        </p>
        <p
          {...pa('SampleReply')}
          className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-teal-500 px-4 py-2.5 text-slate-950"
        >
          {content.SampleReply}
        </p>
        <p
          {...pa('FollowUp')}
          className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-2.5 text-slate-200"
        >
          {content.FollowUp}
        </p>
      </div>
      <p {...pa('Footnote')} className="mt-4 text-[11px] text-slate-500">
        {content.Footnote}
      </p>
    </aside>
  );
}
