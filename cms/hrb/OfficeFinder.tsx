import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { eventKeyProperty } from './shared';
import { hrefOf } from './ui';

export const HrbOfficeFinderContentType = contentType({
  key: 'HRB_OfficeFinder',
  baseType: '_component',
  displayName: '[HRB] Office Finder',
  description:
    'H&R Block demo: search box and results list. Results come from the synthetic office directory in the custom Graph source (hrbx), so office data changes at the source without a CMS publish.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, isRequired: false },
    CtaLabel: {
      type: 'string',
      displayName: 'Search button label',
      isLocalized: true,
      isRequired: false,
    },
    CtaUrl: { type: 'url', displayName: 'Search button URL', isRequired: false },
    CtaEventKey: eventKeyProperty(
      'Search button event key',
      'Feature Experimentation event sent on click. The component treats an empty value as office_search. Choice property, not localized.',
    ),
    DefaultZip: { type: 'string', displayName: 'Default ZIP', isRequired: false },
    ResultsLimit: { type: 'integer', displayName: 'Results limit', isRequired: false },
  },
});

type Props = { content: ContentProps<typeof HrbOfficeFinderContentType> };

/**
 * Search form only. Wiring the results list to the hrbx Graph source is a
 * separate piece of work; the form submits to `CtaUrl` as a plain GET.
 */
export default function OfficeFinder({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const event =
    content.CtaEventKey && content.CtaEventKey !== 'none' ? content.CtaEventKey : 'office_search';

  return (
    <div {...pa(block)} className="py-2">
      {content.Heading && (
        <h2 {...pa('Heading')} className="mb-4 text-2xl font-semibold">{content.Heading}</h2>
      )}
      <form action={hrefOf(content.CtaUrl)} method="get" className="flex max-w-xl flex-wrap gap-2">
        <input
          name="zip"
          inputMode="numeric"
          placeholder="ZIP code"
          defaultValue={content.DefaultZip ?? ''}
          aria-label="ZIP code"
          className="min-w-0 flex-1 rounded-full border border-hrb-border bg-white px-4 py-2.5 text-sm text-hrb-ink"
        />
        <button
          type="submit"
          data-event-key={event}
          {...pa('CtaLabel')}
          className="inline-flex items-center rounded-full bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-950 group-data-[dark=true]:bg-blue-400 group-data-[dark=true]:text-blue-950 group-data-[dark=true]:hover:bg-blue-300"
        >
          {content.CtaLabel || 'Look for my office'}
        </button>
      </form>
    </div>
  );
}
