import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { hasUrl, imageSrc, urlHref } from './shared';

/**
 * One customer testimonial ("Linda & Michael J."). Created as a SHARED block
 * (in the eHealth asset folder) and referenced from the EhTestimonials
 * carousel, so a story can be reused on several pages.
 */
export const EhTestimonialContentType = contentType({
  key: 'EhTestimonial',
  baseType: '_component',
  displayName: '[eHealth] Testimonial',
  description: '[EH] One customer story: photo, name, quote and a "Read their story" link. Shared block used by the testimonials carousel.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Name: {
      type: 'string',
      displayName: 'Name',
      description: 'e.g. "Linda & Michael J.".',
      isLocalized: true,
      sortOrder: 10,
    },
    Quote: {
      type: 'string',
      displayName: 'Quote',
      description: 'The customer quote, without quotation marks.',
      isLocalized: true,
      sortOrder: 11,
    },
    Photo: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Photo',
      description: 'Customer photo (landscape crop works best).',
      sortOrder: 12,
    },
    StoryLabel: {
      type: 'string',
      displayName: 'Link label',
      description: 'Default: "Read Their Story".',
      isLocalized: true,
      sortOrder: 13,
    },
    StoryUrl: {
      type: 'url',
      displayName: 'Link URL',
      description: 'Where "Read Their Story" goes.',
      sortOrder: 14,
    },
  },
});

type Props = { content: ContentProps<typeof EhTestimonialContentType> };

/** The card itself, reused by the carousel. `edit` attaches on-page-editing attributes. */
export function TestimonialCard({
  content,
  edit,
}: {
  content: Record<string, unknown>;
  edit?: (prop: string) => unknown;
}) {
  const attrs = (p: string) => (edit ? (edit(p) as Record<string, string>) : undefined);
  const name = (content.Name as string | null) ?? '';
  const photo = imageSrc(content.Photo);

  return (
    <article className="flex h-full w-[min(86vw,22rem)] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-md">
      <div {...attrs('Photo')} className="aspect-[16/10] w-full bg-surface">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">Add a photo</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 {...attrs('Name')} className="font-display text-lg font-bold text-blue-950">
          {name}
        </h3>
        <blockquote {...attrs('Quote')} className="mt-2 flex-1 text-sm leading-relaxed text-foreground">
          &ldquo;{content.Quote as string}&rdquo;
        </blockquote>
        {/* Only link out when a story URL exists: a "Read Their Story" pointing at '#' is a dead end. */}
        {hasUrl(content.StoryUrl) && (
          <a
            {...attrs('StoryLabel')}
            href={urlHref(content.StoryUrl)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-800 hover:text-blue-950"
          >
            {(content.StoryLabel as string | null) || 'Read Their Story'}
            <span aria-hidden>&rsaquo;</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function EhTestimonial({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  return (
    <div {...pa(block)} className="px-6 py-6">
      <TestimonialCard content={content as unknown as Record<string, unknown>} edit={pa} />
    </div>
  );
}
