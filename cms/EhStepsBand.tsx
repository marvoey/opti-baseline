import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { imageSrc, urlHref } from './shared';

/**
 * Dark-green "enroll in 3 easy steps" band: white heading, numbered steps
 * (optionally beside an image) and an orange CTA. Paints its own full-width
 * dark background, so it works in any section style.
 *
 * Each step is one line in `Steps`, formatted `Title | Description`.
 */
export const EhStepsBandContentType = contentType({
  key: 'EhStepsBand',
  baseType: '_component',
  displayName: '[eHealth] Steps Band',
  description: '[EH] Dark-green band: heading, numbered steps (Title | Description), optional image and an orange CTA.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Compare health insurance plans and enroll online in 3 easy steps".',
      isLocalized: true,
      sortOrder: 10,
    },
    Steps: {
      type: 'array',
      displayName: 'Steps',
      description: 'One per line (up to 4): Title | Description.',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 4,
      items: { type: 'string' },
    },
    Image: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Image',
      description: 'Optional image shown beside the steps.',
      sortOrder: 30,
    },
    ImageAlt: {
      type: 'string',
      displayName: 'Image alt text',
      description: 'Describe the image for screen readers.',
      isLocalized: true,
      sortOrder: 31,
    },
    CtaLabel: {
      type: 'string',
      displayName: 'Button label',
      description: 'e.g. "See how it works". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 40,
    },
    CtaUrl: {
      type: 'url',
      displayName: 'Button URL',
      description: 'Where the button goes.',
      sortOrder: 41,
    },
  },
});

type Props = { content: ContentProps<typeof EhStepsBandContentType> };

type Step = { title: string; description: string };

function parseSteps(lines: Array<string | null> | null | undefined): Step[] {
  return (lines ?? [])
    .map((l) => (l ?? '').trim())
    .filter(Boolean)
    .map((line) => {
      const [title = '', ...rest] = line.split('|').map((p) => p.trim());
      return { title, description: rest.join(' | ') };
    })
    .filter((s) => s.title);
}

export default function EhStepsBand({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const steps = parseSteps(content.Steps as Array<string | null> | null);
  const image = imageSrc(content.Image);

  return (
    <div {...pa(block)} className="w-full bg-blue-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="mx-auto max-w-3xl text-center font-display text-2xl font-bold !text-white sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}

        <div className={image ? 'mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-12' : 'mt-8'}>
          {image && (
            <div {...pa('Image')} className="overflow-hidden rounded-xl shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={content.ImageAlt ?? ''} className="h-auto w-full object-cover" />
            </div>
          )}

          <ol {...pa('Steps')} className={image ? 'space-y-5' : 'mx-auto grid max-w-4xl gap-6 md:grid-cols-3'}>
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-400 font-display text-lg font-bold text-blue-950">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold !text-white">{s.title}</h3>
                  {s.description && <p className="mt-1 text-sm leading-relaxed text-white/85">{s.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {content.CtaLabel && (
          <div className="mt-8 text-center">
            <a
              {...pa('CtaLabel')}
              href={urlHref(content.CtaUrl)}
              className="inline-block rounded-full bg-cta px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-cta-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
            >
              {content.CtaLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
