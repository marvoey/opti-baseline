import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { urlHref } from './shared';

/**
 * "Switch and you could save" band: a white stat card on the left (big number
 * + unit + subtext) and a heading, body copy and orange CTA on the right.
 * Place it in a Mint section to match eHealth.com.
 */
export const EhSavingsBandContentType = contentType({
  key: 'EhSavingsBand',
  baseType: '_component',
  displayName: '[eHealth] Savings Band',
  description: '[EH] Stat card (e.g. "$2,000 per year") beside a heading, body copy and CTA, with an optional disclaimer line.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Eyebrow: {
      type: 'string',
      displayName: 'Stat lead-in',
      description: 'Small text above the number, e.g. "You may save over".',
      isLocalized: true,
      sortOrder: 10,
    },
    BigNumber: {
      type: 'string',
      displayName: 'Stat number',
      description: 'The headline figure, e.g. "$2,000".',
      isLocalized: true,
      sortOrder: 11,
    },
    Unit: {
      type: 'string',
      displayName: 'Stat unit',
      description: 'Shown beside the number, e.g. "per year".',
      isLocalized: true,
      sortOrder: 12,
    },
    Subtext: {
      type: 'string',
      displayName: 'Stat subtext',
      description: 'Line under the number, e.g. "on Medical Bills + Rx drugs".',
      isLocalized: true,
      sortOrder: 13,
    },
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Switch and you could save".',
      isLocalized: true,
      sortOrder: 20,
    },
    Body: {
      type: 'string',
      displayName: 'Body',
      description: 'Supporting copy under the heading.',
      isLocalized: true,
      sortOrder: 21,
    },
    CtaLabel: {
      type: 'string',
      displayName: 'Button label',
      description: 'e.g. "See how much you may save". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 22,
    },
    CtaUrl: {
      type: 'url',
      displayName: 'Button URL',
      description: 'Where the button goes.',
      sortOrder: 23,
    },
    Disclaimer: {
      type: 'string',
      displayName: 'Disclaimer',
      description: 'Small print under the band, e.g. the source of the savings figure. Add one whenever you show a savings claim.',
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof EhSavingsBandContentType> };

export default function EhSavingsBand({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12">
          <div className="rounded-2xl bg-white px-6 py-8 text-center shadow-md">
            {content.Eyebrow && (
              <p {...pa('Eyebrow')} className="text-sm font-semibold text-blue-950">
                {content.Eyebrow}
              </p>
            )}
            <p className="mt-1 flex items-baseline justify-center gap-2">
              <span {...pa('BigNumber')} className="font-display text-5xl font-extrabold text-blue-800 sm:text-6xl">
                {content.BigNumber}
              </span>
              {content.Unit && (
                <span {...pa('Unit')} className="text-sm font-semibold text-blue-950">
                  {content.Unit}
                </span>
              )}
            </p>
            {content.Subtext && (
              <p {...pa('Subtext')} className="mt-2 text-sm font-bold text-blue-800">
                {content.Subtext}
              </p>
            )}
          </div>

          <div className="text-center md:text-left">
            {content.Heading && (
              <h2 {...pa('Heading')} className="font-display text-2xl font-bold text-blue-950 sm:text-3xl">
                {content.Heading}
              </h2>
            )}
            {content.Body && (
              <p {...pa('Body')} className="mt-3 text-sm leading-relaxed text-foreground sm:text-base">
                {content.Body}
              </p>
            )}
            {content.CtaLabel && (
              <a
                {...pa('CtaLabel')}
                href={urlHref(content.CtaUrl)}
                className="mt-5 inline-block rounded-full bg-cta px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-cta-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
              >
                {content.CtaLabel}
              </a>
            )}
          </div>
        </div>

        {content.Disclaimer && (
          <p {...pa('Disclaimer')} className="mx-auto mt-6 max-w-3xl text-center text-xs text-gray-600">
            {content.Disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}
