import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { ShieldCheck, LifeBuoy } from 'lucide-react';

export const CCOClinicalTrustBlockContentType = contentType({
  key: 'CCOClinicalTrustBlock',
  baseType: '_component',
  displayName: 'CCO Clinical Trust',
  description: 'Therapeutic-model badge, privacy statement and crisis resources.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    TherapeuticModelBadge: {
      type: 'string',
      displayName: 'Therapeutic Model Badge',
      description: 'e.g. "Evidence-Based Motivational Interviewing".',
      isLocalized: true,
      sortOrder: 10,
    },
    PrivacyDisclaimer: {
      type: 'richText',
      displayName: 'Privacy Disclaimer',
      description: 'Privacy / confidentiality statement (legal-approved wording only).',
      isLocalized: true,
      sortOrder: 20,
    },
    CrisisNotice: {
      type: 'richText',
      displayName: 'Crisis Notice',
      description: 'Crisis resources, e.g. 988 Suicide & Crisis Lifeline.',
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof CCOClinicalTrustBlockContentType> };

export default function CCOClinicalTrustBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="w-full border-t border-slate-800 bg-slate-900 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <div>
          <span
            {...pa('TherapeuticModelBadge')}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            {content.TherapeuticModelBadge}
          </span>
          <div
            {...pa('PrivacyDisclaimer')}
            className="prose prose-sm prose-invert mt-3 max-w-none prose-p:text-slate-400"
          >
            <RichTextRenderer content={content.PrivacyDisclaimer?.json} />
          </div>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-rose-300">
            <LifeBuoy className="h-4 w-4" aria-hidden />
            <span>In crisis?</span>
          </div>
          <div
            {...pa('CrisisNotice')}
            className="prose prose-sm prose-invert max-w-none prose-p:text-slate-300"
          >
            <RichTextRenderer content={content.CrisisNotice?.json} />
          </div>
        </div>
      </div>
    </section>
  );
}
