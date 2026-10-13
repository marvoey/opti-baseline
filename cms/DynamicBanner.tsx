import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import SmartCta, { contentLocale, isEditorContent } from '../app/_components/SmartCta';
import { DEFAULT_LOCALE } from '../lib/locales';
import { ctaHref, ctaLabel } from './shared';

export const DynamicBannerContentType = contentType({
  key: 'UpsDynamicBanner',
  baseType: '_component',
  displayName: 'UPS Dynamic Banner',
  description: 'Member banner: headline, supporting text and a gold call to action.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Headline: { type: 'string', displayName: 'Headline', isLocalized: true, sortOrder: 10 },
    Body: { type: 'string', displayName: 'Body', isLocalized: true, sortOrder: 20 },
    Cta: { type: 'link', displayName: 'Call to Action', isLocalized: true, sortOrder: 30 },
  },
});

type Props = { content: ContentProps<typeof DynamicBannerContentType> };

export default function DynamicBanner({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const locale = contentLocale(content, DEFAULT_LOCALE);

  return (
    <section className="w-full bg-gradient-to-r from-blue-950 to-blue-900 px-4 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 {...pa('Headline')} className="text-2xl font-bold">
            {content.Headline || 'Log In for Less Guessing and More Control'}
          </h2>
          <p {...pa('Body')} className="mt-2 max-w-2xl text-white/80">
            {content.Body || 'Personalized tools are ready to help you manage shipments, bills, claims and more.'}
          </p>
        </div>
        <SmartCta
          label={ctaLabel(content.Cta, 'Log In')}
          href={ctaHref(content.Cta)}
          currentLocale={locale}
          isEditor={isEditorContent(content)}
          className="inline-block rounded-full bg-blue-200 px-6 py-3 text-sm font-bold text-blue-950 transition-colors hover:bg-blue-400"
        />
      </div>
    </section>
  );
}
