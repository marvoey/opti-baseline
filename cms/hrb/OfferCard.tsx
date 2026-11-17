import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { eventKeyProperty, tierProperties } from './shared';
import { CtaButton, hrefOf } from './ui';

export const HrbOfferCardContentType = contentType({
  key: 'HRB_OfferCard',
  baseType: '_component',
  displayName: '[HRB] Offer Card',
  description:
    'H&R Block demo: one filing tier with its published price (Do-It-Yourself, DIY + Support or Full-Service). Shared item so a price change is made once and updates every page.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    TierLabel: { type: 'string', displayName: 'Tier label', isLocalized: true, isRequired: true },
    Headline: { type: 'string', displayName: 'Headline', isLocalized: true, isRequired: true },
    Subcopy: { type: 'string', displayName: 'Sub-copy', isLocalized: true, isRequired: false },
    Bullets: {
      type: 'array',
      displayName: 'Bullets',
      isLocalized: true,
      isRequired: false,
      maxItems: 4,
      items: { type: 'string' },
    },
    PricePrefix: { type: 'string', displayName: 'Price prefix', isLocalized: true, isRequired: false },
    Price: {
      type: 'string',
      displayName: 'Price',
      description: 'A string, so the published price stays verbatim ("$0", "$65", "$99").',
      isLocalized: true,
      isRequired: true,
    },
    PriceNote: { type: 'string', displayName: 'Price note', isLocalized: true, isRequired: false },
    PrimaryCtaLabel: {
      type: 'string',
      displayName: 'Primary button label',
      isLocalized: true,
      isRequired: false,
    },
    PrimaryCtaUrl: { type: 'url', displayName: 'Primary button URL', isRequired: false },
    PrimaryCtaEventKey: eventKeyProperty('Primary button event key'),
    SecondaryCtaLabel: {
      type: 'string',
      displayName: 'Secondary link label',
      description: 'Renders as a plain text link. Shows "Learn more" when left empty.',
      isLocalized: true,
      isRequired: false,
    },
    SecondaryCtaUrl: { type: 'url', displayName: 'Secondary link URL', isRequired: false },
    ...tierProperties(),
  },
});

export const HrbOfferCardDisplayTemplate = displayTemplate({
  key: 'HRB_OfferCardStyle',
  isDefault: true,
  displayName: '[HRB] Offer card style',
  contentType: 'HRB_OfferCard',
  settings: {
    Emphasis: {
      editor: 'select',
      displayName: 'Emphasis',
      sortOrder: 0,
      choices: {
        standard: { displayName: 'Standard', sortOrder: 1 },
        featured: { displayName: 'Featured', sortOrder: 2 },
      },
    },
  },
});

type Props = {
  content: ContentProps<typeof HrbOfferCardContentType>;
  displaySettings?: ContentProps<typeof HrbOfferCardDisplayTemplate>;
};

export default function OfferCard({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const featured = displaySettings?.Emphasis === 'featured';

  return (
    <article
      {...pa(block)}
      className={`flex h-full flex-col rounded-2xl bg-white p-6 text-left text-hrb-ink ${featured ? 'border-2 border-blue-800 shadow-lg' : 'border border-hrb-border'}`}
    >
      <div {...pa('TierLabel')} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-800">
        {content.TierLabel}
      </div>
      <h3 {...pa('Headline')} className="mt-2 text-xl font-semibold">{content.Headline}</h3>
      {content.Subcopy && <p {...pa('Subcopy')} className="mt-2 text-sm opacity-80">{content.Subcopy}</p>}
      <ul {...pa('Bullets')} className="mt-4 space-y-2 text-sm">
        {(content.Bullets ?? []).map((b, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="text-blue-800">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        {content.PricePrefix && <div className="text-xs opacity-70">{content.PricePrefix}</div>}
        <div {...pa('Price')} className="text-3xl font-semibold">{content.Price}</div>
        {content.PriceNote && <div className="mt-1 text-xs opacity-70">{content.PriceNote}</div>}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <CtaButton
            label={content.PrimaryCtaLabel}
            url={content.PrimaryCtaUrl}
            eventKey={content.PrimaryCtaEventKey}
            dark={false}
            editProps={pa('PrimaryCtaLabel')}
          />
          <a
            href={hrefOf(content.SecondaryCtaUrl)}
            className="text-sm font-semibold text-blue-800 underline-offset-4 hover:underline"
          >
            {content.SecondaryCtaLabel || 'Learn more'} ›
          </a>
        </div>
      </div>
    </article>
  );
}
