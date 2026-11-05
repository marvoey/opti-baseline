import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ctaHref } from './shared';

/**
 * OpenTable Customer Story — heading, then a customer panel: logo and quick
 * facts on the left, a pull quote with attribution and a CTA on a dark panel
 * on the right (the "Alicart Restaurant Group" block).
 */
export const OpenTableCustomerStoryContentType = contentType({
  key: 'OpenTableCustomerStory',
  baseType: '_component',
  displayName: 'OpenTable Customer Story',
  description: 'OpenTable customer story: customer logo and facts beside a pull quote, attribution and "read the full story" link.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'Optional section heading, e.g. "Why restaurants love OpenTable".',
      isLocalized: true,
      maxLength: 120,
      sortOrder: 10,
    },
    CustomerName: {
      type: 'string',
      displayName: 'Customer name',
      description: 'Used as the logo\'s alt text and shown if there is no logo.',
      isLocalized: true,
      isRequired: true,
      maxLength: 80,
      sortOrder: 20,
    },
    CustomerLogo: {
      type: 'contentReference',
      displayName: 'Customer logo',
      allowedTypes: ['_image'],
      sortOrder: 30,
    },
    CustomerType: {
      type: 'string',
      displayName: 'Type of restaurant',
      description: 'e.g. "Restaurant group".',
      isLocalized: true,
      maxLength: 60,
      sortOrder: 40,
    },
    Location: {
      type: 'string',
      displayName: 'Location',
      description: 'e.g. "3 locations in NYC".',
      isLocalized: true,
      maxLength: 60,
      sortOrder: 50,
    },
    Quote: {
      type: 'string',
      displayName: 'Quote',
      description: 'The customer quote, without quotation marks.',
      isLocalized: true,
      isRequired: true,
      maxLength: 300,
      sortOrder: 60,
    },
    AttributionName: {
      type: 'string',
      displayName: 'Attribution name',
      isLocalized: true,
      maxLength: 60,
      sortOrder: 70,
    },
    AttributionRole: {
      type: 'string',
      displayName: 'Attribution role',
      description: 'Job title and company, e.g. "CEO, Alicart Restaurant Group".',
      isLocalized: true,
      maxLength: 100,
      sortOrder: 80,
    },
    StoryLink: {
      type: 'link',
      displayName: 'Story link',
      description: 'Button below the quote, e.g. "Read the full story".',
      isLocalized: true,
      sortOrder: 90,
    },
  },
});

type Props = { content: ContentProps<typeof OpenTableCustomerStoryContentType> };

export default function OpenTableCustomerStory({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const logo = content.CustomerLogo;
  const logoUrl = logo?.item?.Url ?? logo?.url?.default ?? null;
  const hasFacts = content.CustomerType || content.Location;

  return (
    <section {...pa(block)} className="w-full bg-cream text-ink">
      <div className="page-width py-14 md:py-20">
        {content.Heading && (
          <h2 {...pa('Heading')} className="text-center text-heading">
            {content.Heading}
          </h2>
        )}

        <div className={`grid gap-8 md:grid-cols-[1fr_2fr] ${content.Heading ? 'mt-12' : ''}`}>
          {/* Customer: logo + facts */}
          <div className="flex flex-col justify-center gap-6">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                {...pa('CustomerLogo')}
                src={logoUrl}
                alt={content.CustomerName ?? ''}
                className="max-h-24 w-auto max-w-full self-start object-contain"
              />
            ) : (
              <p {...pa('CustomerName')} className="font-display text-subheading font-semibold">
                {content.CustomerName}
              </p>
            )}
            {hasFacts && (
              <dl className="border-t border-ink/20 pt-4 text-fine">
                {content.CustomerType && (
                  <div className="mb-3">
                    <dt className="text-muted">Type of restaurant</dt>
                    <dd {...pa('CustomerType')} className="font-semibold text-accent">
                      {content.CustomerType}
                    </dd>
                  </div>
                )}
                {content.Location && (
                  <div>
                    <dt className="text-muted">Location</dt>
                    <dd {...pa('Location')} className="font-semibold text-accent">
                      {content.Location}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          {/* Quote panel */}
          <figure className="flex flex-col items-start gap-6 bg-wine p-8 text-white md:p-10">
            <span aria-hidden className="font-display text-display-md leading-none text-accent">
              &ldquo;
            </span>
            <blockquote {...pa('Quote')} className="font-display text-subheading">
              {content.Quote}
            </blockquote>
            {(content.AttributionName || content.AttributionRole) && (
              <figcaption className="text-fine">
                {content.AttributionName && (
                  <p {...pa('AttributionName')} className="font-semibold">
                    {content.AttributionName}
                  </p>
                )}
                {content.AttributionRole && (
                  <p {...pa('AttributionRole')} className="text-white/80">
                    {content.AttributionRole}
                  </p>
                )}
              </figcaption>
            )}
            {content.StoryLink?.text && (
              <a {...pa('StoryLink')} href={ctaHref(content.StoryLink)} className="btn btn-inverse">
                {content.StoryLink.text}
              </a>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}
