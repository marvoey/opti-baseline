import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import SegmentTabs from '../app/_components/SegmentTabs';
import SmartCta, { contentLocale, isEditorContent } from '../app/_components/SmartCta';
import { DEFAULT_LOCALE } from '../lib/locales';
import { UPS_SERVICE_OPTIONS } from '../lib/markets';
import { ctaHref, ctaLabel } from './shared';

/** One service card. Used as an item of SolutionsSection.Cards. */
export const SolutionCardContentType = contentType({
  key: 'UpsSolutionCard',
  baseType: '_component',
  displayName: 'UPS Solution Card',
  description: 'A service card with a title, description and call to action.',
  properties: {
    Segment: {
      type: 'string',
      displayName: 'Segment',
      enum: [
        { value: 'business', displayName: 'Business' },
        { value: 'personal', displayName: 'Personal' },
      ],
      sortOrder: 10,
    },
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 20 },
    Description: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 30 },
    Cta: { type: 'link', displayName: 'Call to Action', isLocalized: true, sortOrder: 40 },
    RequiredService: {
      type: 'string',
      displayName: 'Required Service',
      description: 'The CTA is hidden in markets that do not offer this service.',
      enum: UPS_SERVICE_OPTIONS,
      sortOrder: 50,
    },
  },
});

export const SolutionsSectionContentType = contentType({
  key: 'UpsSolutionsSection',
  baseType: '_component',
  displayName: 'UPS Solutions Section',
  description: 'Business / Personal toggle over a grid of service cards.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    BusinessLabel: { type: 'string', displayName: 'Business Tab Label', isLocalized: true, sortOrder: 20 },
    PersonalLabel: { type: 'string', displayName: 'Personal Tab Label', isLocalized: true, sortOrder: 30 },
    Cards: {
      type: 'array',
      displayName: 'Cards',
      isLocalized: true,
      items: { type: 'component', contentType: SolutionCardContentType },
      sortOrder: 40,
    },
  },
});

type Props = { content: ContentProps<typeof SolutionsSectionContentType> };

export default function SolutionsSection({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const locale = contentLocale(content, DEFAULT_LOCALE);
  const isEditor = isEditorContent(content);
  const cards = content.Cards ?? [];

  const grid = (segment: string) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards
        .filter((c) => (c.Segment || 'business') === segment)
        .map((c, i) => (
          <article key={i} className="flex flex-col rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-blue-950">{c.Title}</h3>
            <p className="mt-2 flex-1 text-sm text-blue-950/70">{c.Description}</p>
            <div className="mt-4">
              <SmartCta
                label={ctaLabel(c.Cta, 'Learn more')}
                href={ctaHref(c.Cta)}
                requiredService={c.RequiredService}
                currentLocale={locale}
                isEditor={isEditor}
                className="text-sm font-bold text-blue-800 underline underline-offset-4 hover:text-blue-950"
              />
            </div>
          </article>
        ))}
    </div>
  );

  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h2 {...pa('Heading')} className="mb-6 text-center text-3xl font-bold text-blue-950">
          {content.Heading || 'Solutions for Everyone'}
        </h2>
        <div {...pa('Cards')}>
          <SegmentTabs
            businessLabel={content.BusinessLabel || 'Business'}
            personalLabel={content.PersonalLabel || 'Personal'}
            business={grid('business')}
            personal={grid('personal')}
          />
        </div>
      </div>
    </section>
  );
}
