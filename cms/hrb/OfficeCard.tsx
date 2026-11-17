import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const HrbOfficeCardContentType = contentType({
  key: 'HRB_OfficeCard',
  baseType: '_component',
  displayName: '[HRB] Office Card',
  description:
    'H&R Block demo: one synthetic office, bound to the hrbx connected source so editors can place a single office on a page. Never real addresses or phone numbers.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    OfficeName: { type: 'string', displayName: 'Office name', isRequired: true },
    City: { type: 'string', displayName: 'City', isRequired: false },
    State: { type: 'string', displayName: 'State', isRequired: false },
    Zip: { type: 'string', displayName: 'ZIP', isRequired: false },
    Availability: { type: 'string', displayName: 'Availability', isRequired: false },
    Bilingual: { type: 'boolean', displayName: 'Bilingual pros', isRequired: false },
  },
});

type Props = { content: ContentProps<typeof HrbOfficeCardContentType> };

export default function OfficeCard({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const place = [[content.City, content.State].filter(Boolean).join(', '), content.Zip]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      {...pa(block)}
      className="h-full rounded-2xl border border-hrb-border bg-white p-5 text-hrb-ink"
    >
      <div {...pa('OfficeName')} className="font-semibold">{content.OfficeName}</div>
      {place && <div className="mt-1 text-sm opacity-75">{place}</div>}
      {content.Availability && (
        <div className="mt-3 text-sm font-semibold text-blue-800">{content.Availability}</div>
      )}
      {content.Bilingual && (
        <span className="mt-3 inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          Bilingual pros
        </span>
      )}
    </article>
  );
}
