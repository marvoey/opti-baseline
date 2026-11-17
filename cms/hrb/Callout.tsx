import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Building2, ShieldCheck } from 'lucide-react';
import { eventKeyProperty, tierProperties } from './shared';
import { CtaButton } from './ui';

export const HrbCalloutContentType = contentType({
  key: 'HRB_Callout',
  baseType: '_component',
  displayName: '[HRB] Callout',
  description:
    'H&R Block demo: a small promo box with an icon, headline and one button, e.g. "Securely manage your taxes with MyBlock" or "Find your office".',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      isRequired: false,
      enum: [
        { value: 'myblock', displayName: 'MyBlock' },
        { value: 'office', displayName: 'Office' },
        { value: 'none', displayName: 'None' },
      ],
    },
    Headline: { type: 'string', displayName: 'Headline', isLocalized: true, isRequired: true },
    Body: { type: 'string', displayName: 'Body', isLocalized: true, isRequired: false },
    CtaLabel: { type: 'string', displayName: 'Button label', isLocalized: true, isRequired: false },
    CtaUrl: { type: 'url', displayName: 'Button URL', isRequired: false },
    CtaEventKey: eventKeyProperty('Button event key'),
    ...tierProperties(),
  },
});

const ICONS = { myblock: ShieldCheck, office: Building2 } as const;

type Props = { content: ContentProps<typeof HrbCalloutContentType> };

export default function Callout({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const Icon = ICONS[content.Icon as keyof typeof ICONS];

  return (
    <aside
      {...pa(block)}
      className="flex h-full items-start gap-4 rounded-2xl border border-hrb-border bg-white p-6 text-hrb-ink"
    >
      {Icon && (
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-800 text-white">
          <Icon size={18} aria-hidden />
        </div>
      )}
      <div>
        <div {...pa('Headline')} className="text-lg font-semibold">{content.Headline}</div>
        {content.Body && <p {...pa('Body')} className="mt-1 text-sm opacity-75">{content.Body}</p>}
        <div className="mt-3">
          <CtaButton
            label={content.CtaLabel}
            url={content.CtaUrl}
            eventKey={content.CtaEventKey}
            variant="secondary"
            dark={false}
            editProps={pa('CtaLabel')}
          />
        </div>
      </div>
    </aside>
  );
}
