import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { imageSrc } from './shared';

/**
 * "Try eHealth Live Advise" block: a screenshot/video still on the left and a
 * heading, check-marked benefit list and the agent phone line on the right.
 */
export const EhLiveAdviseContentType = contentType({
  key: 'EhLiveAdvise',
  baseType: '_component',
  displayName: '[eHealth] Live Advise',
  description: '[EH] Product spotlight: image on the left, heading, check-marked benefits and the agent phone line on the right.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Try eHealth Live Advise™".',
      isLocalized: true,
      sortOrder: 10,
    },
    Subheading: {
      type: 'string',
      displayName: 'Subheading',
      description: 'Optional line under the heading.',
      isLocalized: true,
      sortOrder: 11,
    },
    Image: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Image',
      description: 'Product screenshot or video still, shown on the left.',
      sortOrder: 20,
    },
    ImageAlt: {
      type: 'string',
      displayName: 'Image alt text',
      description: 'Describe the image for screen readers.',
      isLocalized: true,
      sortOrder: 21,
    },
    Bullets: {
      type: 'array',
      displayName: 'Benefits',
      description: 'Short benefit lines shown with a check mark (up to 4).',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 4,
      items: { type: 'string' },
    },
    PromptLine: {
      type: 'string',
      displayName: 'Phone prompt',
      description: 'Line above the number, e.g. "Call an eHealth licensed insurance agent".',
      isLocalized: true,
      sortOrder: 40,
    },
    PhoneNumber: {
      type: 'string',
      displayName: 'Phone number',
      description: 'Default: 1-877-378-1318.',
      sortOrder: 41,
    },
    PhoneSuffix: {
      type: 'string',
      displayName: 'Phone suffix',
      description: 'Default: "TTY 711".',
      sortOrder: 42,
    },
  },
});

type Props = { content: ContentProps<typeof EhLiveAdviseContentType> };

function telHref(label: string): string {
  const digits = label.replace(/\D/g, '');
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11) return `tel:+${digits}`;
  return 'tel:+18773781318';
}

export default function EhLiveAdvise({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const isEditing = !!(content as { __context?: { edit?: boolean } }).__context?.edit;

  const image = imageSrc(content.Image);
  const bullets = ((content.Bullets as Array<string | null> | null) ?? []).filter(Boolean) as string[];
  const phone = content.PhoneNumber?.trim() || '1-877-378-1318';

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="text-center font-display text-2xl font-bold text-blue-950 sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}
        {content.Subheading && (
          <p {...pa('Subheading')} className="mx-auto mt-2 max-w-2xl text-center text-sm text-foreground sm:text-base">
            {content.Subheading}
          </p>
        )}

        <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {(image || isEditing) && (
            <div {...pa('Image')} className="overflow-hidden rounded-xl bg-surface shadow-md">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={content.ImageAlt ?? ''} className="h-auto w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center text-sm text-gray-500">
                  Add a product image
                </div>
              )}
            </div>
          )}

          <div className={image || isEditing ? '' : 'md:col-span-2 md:mx-auto'}>
            {bullets.length > 0 && (
              <ul {...pa('Bullets')} className="space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-blue-950 sm:text-base">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <circle cx="10" cy="10" r="8.5" />
                      <path d="M6 10.5l2.8 2.8L14 7.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6">
              {content.PromptLine && (
                <p {...pa('PromptLine')} className="text-sm text-foreground">
                  {content.PromptLine}
                </p>
              )}
              <a
                {...pa('PhoneNumber')}
                href={telHref(phone)}
                className="mt-1 inline-block font-display text-2xl font-bold text-blue-950 hover:text-blue-800 sm:text-3xl"
              >
                {phone} <span className="font-normal">{content.PhoneSuffix?.trim() || 'TTY 711'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
