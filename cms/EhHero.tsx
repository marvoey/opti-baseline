import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import PlanFinderWidget from '@/app/_components/PlanFinderWidget';
import CmsImage from '@/app/_components/CmsImage';
import { planFinderProperties, planFinderPropsFrom } from './planFinderFields';

/**
 * eHealth hero: person image on the left, a centred headline (with an optional
 * green highlight) on the right and, optionally, the plan finder (tiles, ZIP,
 * orange CTA, agent phone) underneath.
 *
 * The background comes from the surrounding section style (use Grey for the
 * eHealth.com look), so the hero itself is transparent.
 */
export const EhHeroContentType = contentType({
  key: 'EhHero',
  baseType: '_component',
  displayName: '[eHealth] Hero + Plan Finder',
  description: '[EH] Homepage hero: headline, person image and an optional built-in plan finder (plan tiles, ZIP code, CTA, agent phone).',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Optional small line above the headline.',
      isLocalized: true,
      sortOrder: 10,
    },
    Headline: {
      type: 'string',
      displayName: 'Headline',
      description: 'Main heading, e.g. "Compare the nation\'s top health insurance plans".',
      isLocalized: true,
      sortOrder: 11,
    },
    HeadlineHighlight: {
      type: 'string',
      displayName: 'Headline highlight',
      description: 'Optional words from the headline to show in green, e.g. "health insurance plans". Must match the headline text exactly.',
      isLocalized: true,
      sortOrder: 12,
    },
    Subcopy: {
      type: 'string',
      displayName: 'Subcopy',
      description: 'Optional supporting line under the headline.',
      isLocalized: true,
      sortOrder: 13,
    },
    Image: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Hero image',
      description: 'Person image shown on the left (a cut-out PNG on a transparent background works best).',
      sortOrder: 20,
    },
    ImageAlt: {
      type: 'string',
      displayName: 'Image alt text',
      description: 'Describe the image for screen readers. Leave blank if it is decorative.',
      isLocalized: true,
      sortOrder: 21,
    },
    ShowPlanFinder: {
      type: 'boolean',
      displayName: 'Show plan finder',
      description: 'Show the plan tiles, ZIP code field and agent phone under the headline.',
      sortOrder: 40,
    },
    ...planFinderProperties(50),
  },
});

type Props = { content: ContentProps<typeof EhHeroContentType> };

type ImageRef = { url?: { default?: string | null } | null } | null | undefined;

/** Split the headline so the highlight words render in green. */
function renderHeadline(headline: string, highlight?: string | null) {
  const h = highlight?.trim();
  const i = h ? headline.indexOf(h) : -1;
  if (!h || i < 0) return headline;
  return (
    <>
      {headline.slice(0, i)}
      <span className="text-blue-800">{h}</span>
      {headline.slice(i + h.length)}
    </>
  );
}

export default function EhHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const isEditing = !!(content as { __context?: { edit?: boolean } }).__context?.edit;

  const headline = content.Headline?.trim() || "Compare the nation's top health insurance plans";
  const imageUrl = (content.Image as ImageRef)?.url?.default ?? null;
  // Default ON: an unset boolean (new block) still shows the finder.
  const showFinder = content.ShowPlanFinder !== false;
  const hasImageColumn = !!imageUrl || isEditing;

  return (
    <div {...pa(block)} className="w-full">
      <div
        className={[
          'mx-auto max-w-6xl px-6',
          hasImageColumn ? 'md:grid md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-8' : '',
        ].join(' ')}
      >
        {hasImageColumn && (
          <div {...pa('Image')} className="hidden self-end md:flex md:justify-center">
            {imageUrl ? (
              <CmsImage
                src={imageUrl}
                alt={content.ImageAlt ?? ''}
                width={360}
                height={640}
                sizes="(min-width: 768px) 360px, 100vw"
                eager
                className="max-h-[480px] w-auto object-contain object-bottom"
              />
            ) : (
              <div className="mb-10 flex h-80 w-full items-center justify-center rounded-lg border border-dashed border-gray-400 p-6 text-center text-sm text-gray-500">
                Add a hero image (a person cut-out works best)
              </div>
            )}
          </div>
        )}

        <div className="py-10 md:py-12">
          {content.Eyebrow && (
            <p {...pa('Eyebrow')} className="mb-2 text-center text-sm font-semibold uppercase tracking-wide text-blue-800">
              {content.Eyebrow}
            </p>
          )}
          <h1
            {...pa('Headline')}
            className="mx-auto max-w-2xl text-center font-display text-3xl font-bold leading-tight text-blue-950 sm:text-4xl lg:text-[2.75rem]"
          >
            {renderHeadline(headline, content.HeadlineHighlight)}
          </h1>
          {content.Subcopy && (
            <p {...pa('Subcopy')} className="mx-auto mt-3 max-w-xl text-center text-base text-foreground sm:text-lg">
              {content.Subcopy}
            </p>
          )}

          {showFinder && (
            <div className="mt-6">
              <PlanFinderWidget {...planFinderPropsFrom(content, pa)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
