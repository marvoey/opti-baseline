import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import CardScroller from '@/app/_components/CardScroller';
import { urlHref } from './shared';

/**
 * "Hear from our Medicare customers": a rating summary (badge + score) above a
 * scrolling row of short review cards.
 *
 * Each review is one line in `Reviews`, formatted `Stars | Title | Body | Author`
 * (Stars is a number 1-5). Ratings and review text are editorial content: only
 * publish real, attributable reviews, and use the Disclaimer / Source fields to
 * say where the score comes from.
 */
export const EhReviewsContentType = contentType({
  key: 'EhReviews',
  baseType: '_component',
  displayName: '[eHealth] Reviews',
  description: '[EH] Rating summary plus a scrolling row of customer review cards (Stars | Title | Body | Author).',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Hear from our Medicare customers".',
      isLocalized: true,
      sortOrder: 10,
    },
    RatingLabel: {
      type: 'string',
      displayName: 'Rating label',
      description: 'Short label beside the stars, e.g. "Excellent". Leave blank to hide the summary.',
      isLocalized: true,
      sortOrder: 11,
    },
    RatingScore: {
      type: 'string',
      displayName: 'Rating score',
      description: 'Score out of 5, e.g. "4.7". Stars in the summary are rounded from this.',
      sortOrder: 12,
    },
    RatingDetail: {
      type: 'string',
      displayName: 'Rating detail',
      description: 'Line under the stars, e.g. "Based on 1,234 reviews".',
      isLocalized: true,
      sortOrder: 13,
    },
    Reviews: {
      type: 'array',
      displayName: 'Reviews',
      description: 'One per line (up to 8): Stars | Title | Body | Author.',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 8,
      items: { type: 'string' },
    },
    SourceLabel: {
      type: 'string',
      displayName: 'Source link label',
      description: 'e.g. "See all reviews". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 30,
    },
    SourceUrl: {
      type: 'url',
      displayName: 'Source link URL',
      description: 'Where the reviews are published.',
      sortOrder: 31,
    },
    Disclaimer: {
      type: 'string',
      displayName: 'Disclaimer',
      description: 'Small print: where the score and reviews come from and when they were collected.',
      isLocalized: true,
      sortOrder: 32,
    },
  },
});

type Props = { content: ContentProps<typeof EhReviewsContentType> };

type Review = { stars: number; title: string; body: string; author: string };

function parseReviews(lines: Array<string | null> | null | undefined): Review[] {
  return (lines ?? [])
    .map((l) => (l ?? '').trim())
    .filter(Boolean)
    .map((line) => {
      const [stars = '5', title = '', body = '', ...rest] = line.split('|').map((p) => p.trim());
      const n = Math.round(Number(stars));
      return {
        stars: Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : 5,
        title,
        body,
        author: rest.join(' | '),
      };
    })
    .filter((r) => r.title || r.body);
}

/**
 * Seed content ("Placeholder review text. Replace with a real, attributable customer
 * review.") must never reach a visitor: a made-up review or rating is a compliance risk
 * for an insurance brand. While any review (or the disclaimer) still says "placeholder",
 * the block renders nothing. Replace the copy with real, sourced reviews and it appears.
 */
function isPlaceholder(content: Props['content']): boolean {
  const texts = [content.Disclaimer, ...((content.Reviews ?? []) as Array<string | null>)];
  return texts.some((t) => typeof t === 'string' && /placeholder/i.test(t));
}

function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className ?? ''}`} role="img" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i <= count ? 'text-blue-800' : 'text-gray-300'}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function EhReviews({ content }: Props) {
  if (isPlaceholder(content)) return null;

  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const reviews = parseReviews(content.Reviews as Array<string | null> | null);
  const score = Number(content.RatingScore);
  const summaryStars = Number.isFinite(score) ? Math.min(5, Math.max(0, Math.round(score))) : 5;

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="text-center font-display text-2xl font-bold text-blue-950 sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}

        {content.RatingLabel && (
          <div className="mx-auto mt-5 flex max-w-xs flex-col items-center rounded-xl bg-white px-6 py-4 text-center shadow-sm">
            <span {...pa('RatingLabel')} className="font-display text-lg font-bold text-blue-950">
              {content.RatingLabel}
            </span>
            <Stars count={summaryStars} className="mt-1" />
            {(content.RatingScore || content.RatingDetail) && (
              <span className="mt-1 text-xs text-gray-600">
                {content.RatingScore && <strong {...pa('RatingScore')}>{content.RatingScore}</strong>}
                {content.RatingScore && content.RatingDetail ? ' · ' : ''}
                {content.RatingDetail && <span {...pa('RatingDetail')}>{content.RatingDetail}</span>}
              </span>
            )}
          </div>
        )}

        <div {...pa('Reviews')} className="mt-8">
          {reviews.length > 0 ? (
            <CardScroller label={content.Heading ?? 'Customer reviews'}>
              {reviews.map((r, i) => (
                <article
                  key={i}
                  className="flex w-[min(80vw,18rem)] shrink-0 snap-start flex-col rounded-xl bg-white p-5 shadow-md"
                >
                  <Stars count={r.stars} />
                  {r.title && <h3 className="mt-3 font-display text-base font-bold text-blue-950">{r.title}</h3>}
                  {r.body && <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground">{r.body}</p>}
                  {r.author && <p className="mt-3 text-xs font-semibold text-gray-600">{r.author}</p>}
                </article>
              ))}
            </CardScroller>
          ) : (
            <p className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              Add reviews to this block.
            </p>
          )}
        </div>

        {content.SourceLabel && (
          <p className="mt-3 text-center">
            <a
              {...pa('SourceLabel')}
              href={urlHref(content.SourceUrl)}
              className="text-sm font-semibold text-blue-800 underline underline-offset-2 hover:text-blue-950"
            >
              {content.SourceLabel}
            </a>
          </p>
        )}
        {content.Disclaimer && (
          <p {...pa('Disclaimer')} className="mx-auto mt-4 max-w-3xl text-center text-xs text-gray-600">
            {content.Disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}
