import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import SmartCta, { contentLocale, isEditorContent } from '../app/_components/SmartCta';
import { DEFAULT_LOCALE } from '../lib/locales';
import { ctaHref, ctaLabel } from './shared';

export const FeatureItemContentType = contentType({
  key: 'UpsFeatureItem',
  baseType: '_component',
  displayName: 'UPS Feature Item',
  description: 'An icon with a short benefit statement.',
  properties: {
    IconUrl: { type: 'url', displayName: 'Icon URL', sortOrder: 10 },
    IconAlt: { type: 'string', displayName: 'Icon Alt Text', isLocalized: true, sortOrder: 20 },
    Text: { type: 'string', displayName: 'Text', isLocalized: true, sortOrder: 30 },
  },
});

export const FeatureListSectionContentType = contentType({
  key: 'UpsFeatureListSection',
  baseType: '_component',
  displayName: 'UPS Feature List',
  description: '"Get Started with UPS": a row of icon + benefit items with a closing CTA.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Features: {
      type: 'array',
      displayName: 'Items',
      isLocalized: true,
      items: { type: 'component', contentType: FeatureItemContentType },
      sortOrder: 20,
    },
    Cta: { type: 'link', displayName: 'Call to Action', isLocalized: true, sortOrder: 30 },
  },
});

type Props = { content: ContentProps<typeof FeatureListSectionContentType> };

export default function FeatureListSection({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const locale = contentLocale(content, DEFAULT_LOCALE);
  const items = content.Features ?? [];

  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto max-w-6xl text-center">
        <h2 {...pa('Heading')} className="mb-8 text-3xl font-bold text-blue-950">
          {content.Heading || 'Get Started with UPS'}
        </h2>
        <ul {...pa('Features')} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={i} className="flex flex-col items-center gap-3">
              {item.IconUrl?.default && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.IconUrl.default} alt={item.IconAlt || ''} className="h-16 w-16 object-contain" />
              )}
              <p className="text-sm text-blue-950/80">{item.Text}</p>
            </li>
          ))}
        </ul>
        {content.Cta && (
          <div className="mt-8">
            <SmartCta
              label={ctaLabel(content.Cta, 'Create a Profile')}
              href={ctaHref(content.Cta)}
              currentLocale={locale}
              isEditor={isEditorContent(content)}
              className="inline-block rounded-full bg-blue-200 px-6 py-3 text-sm font-bold text-blue-950 transition-colors hover:bg-blue-400"
            />
          </div>
        )}
      </div>
    </section>
  );
}
