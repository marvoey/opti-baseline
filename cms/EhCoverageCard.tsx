import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { imageSrc, urlHref } from './shared';

/**
 * One coverage card ("Individual and family plans"): photo, title, bullet
 * points and an orange "Compare … plans" button. Created as a SHARED block
 * and referenced from the EhCoverageGrid.
 */
export const EhCoverageCardContentType = contentType({
  key: 'EhCoverageCard',
  baseType: '_component',
  displayName: '[eHealth] Coverage Card',
  description: '[EH] One coverage type: photo, title, bullet points and a CTA. Shared block used by the coverage grid.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      description: 'e.g. "Individual and family plans".',
      isLocalized: true,
      sortOrder: 10,
    },
    Image: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Image',
      description: 'Card photo (landscape crop works best).',
      sortOrder: 11,
    },
    Bullets: {
      type: 'array',
      displayName: 'Bullet points',
      description: 'Short benefit lines, one per item (up to 4).',
      isLocalized: true,
      sortOrder: 12,
      maxItems: 4,
      items: { type: 'string' },
    },
    CtaLabel: {
      type: 'string',
      displayName: 'Button label',
      description: 'e.g. "Compare healthcare plans".',
      isLocalized: true,
      sortOrder: 13,
    },
    CtaUrl: {
      type: 'url',
      displayName: 'Button URL',
      description: 'Page the button goes to.',
      sortOrder: 14,
    },
  },
});

type Props = { content: ContentProps<typeof EhCoverageCardContentType> };

/** The card itself, reused by the grid. `edit` attaches on-page-editing attributes. */
export function CoverageCard({
  content,
  edit,
}: {
  content: Record<string, unknown>;
  edit?: (prop: string) => unknown;
}) {
  const attrs = (p: string) => (edit ? (edit(p) as Record<string, string>) : undefined);
  const title = (content.Title as string | null) ?? '';
  const image = imageSrc(content.Image);
  const bullets = ((content.Bullets as Array<string | null> | null) ?? []).filter(Boolean) as string[];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md">
      <div {...attrs('Image')} className="aspect-[16/9] w-full bg-surface">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">Add an image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 {...attrs('Title')} className="font-display text-xl font-bold text-blue-950">
          {title}
        </h3>
        {bullets.length > 0 && (
          <ul {...attrs('Bullets')} className="mt-3 flex-1 space-y-1.5 text-sm text-foreground">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-800" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {content.CtaLabel ? (
          <a
            {...attrs('CtaLabel')}
            href={urlHref(content.CtaUrl)}
            className="mt-5 inline-block self-center rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cta-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
          >
            {content.CtaLabel as string}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function EhCoverageCard({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  return (
    <div {...pa(block)} className="mx-auto max-w-md px-6 py-6">
      <CoverageCard content={content as unknown as Record<string, unknown>} edit={pa} />
    </div>
  );
}
