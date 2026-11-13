import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import ChromeLink from '@/app/_components/ChromeLink';
import CorelImg from '@/app/_components/corel/CorelImg';
import { TestimonialSlider } from '@/app/_components/corel/client';
import { Icon, SectionHeading } from '@/app/_components/corel/ui';
import {
  CorelCustomerStoryContentType,
  CorelImageItemContentType,
  CorelRatingItemContentType,
} from './items';
import { anchorProp, imageAlt, imageSrc, resolveLink } from './shared';

/* ===================================================================
   Corel: Testimonial carousel — "Featured customers"
   =================================================================== */
export const CorelTestimonialCarouselContentType = contentType({
  key: 'CorelTestimonialCarousel',
  baseType: '_component',
  displayName: 'Corel: Testimonial carousel',
  description: 'Featured customers: a rotating quote with photo, name and role.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', description: 'Default: Featured customers.', isLocalized: true, sortOrder: 10 },
    Stories: {
      type: 'array',
      displayName: 'Customer stories',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 12,
      items: { type: 'component', contentType: CorelCustomerStoryContentType },
    },
    Cta: { type: 'link', displayName: 'Link under the carousel', isLocalized: true, sortOrder: 30 },
  },
});

export function CorelTestimonialCarousel({ content }: { content: ContentProps<typeof CorelTestimonialCarouselContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? undefined} className="bg-gray-50 py-20">
      <div {...pa('Stories')} className="site-container">
        <TestimonialSlider
          title={content.Title || 'Featured customers'}
          stories={(content.Stories ?? []).map((s) => ({
            quote: s.Quote ?? '',
            name: s.Name ?? '',
            role: s.Role ?? '',
            src: imageSrc(s.Image, s.ImageUrl),
          }))}
          cta={resolveLink(content.Cta ?? undefined)}
        />
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Logo marquee — "You're in good company"
   =================================================================== */
export const CorelLogoMarqueeContentType = contentType({
  key: 'CorelLogoMarquee',
  baseType: '_component',
  displayName: 'Corel: Logo marquee',
  description: 'Heading and a continuously scrolling strip of customer logos.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Subtitle: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 20 },
    Logos: {
      type: 'array',
      displayName: 'Logos',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 24,
      items: { type: 'component', contentType: CorelImageItemContentType },
    },
  },
});

export function CorelLogoMarquee({ content }: { content: ContentProps<typeof CorelLogoMarqueeContentType> }) {
  const { pa } = getPreviewUtils(content);
  const logos = content.Logos ?? [];
  // Doubled so the -50% translate loops seamlessly.
  const track = [...logos, ...logos];
  return (
    <section id={content.AnchorId ?? undefined} className="overflow-hidden bg-white py-20">
      <div className="site-container"><SectionHeading title={content.Title} sub={content.Subtitle} /></div>
      <style>{`@keyframes corel-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.corel-marquee{animation:none!important}}`}</style>
      <div {...pa('Logos')} className="corel-marquee flex w-max items-center gap-16" style={{ animation: 'corel-marquee 30s linear infinite' }}>
        {track.map((l, k) => (
          <div key={k} className="flex h-12 w-36 items-center justify-center opacity-70 grayscale hover:opacity-100 hover:grayscale-0">
            <CorelImg
              src={imageSrc(l.Image, l.ImageUrl)}
              alt={imageAlt(l.Image, l.Title ?? '')}
              seed={k}
              className="max-h-12 max-w-full rounded object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Awards strip
   =================================================================== */
export const CorelAwardsStripContentType = contentType({
  key: 'CorelAwardsStrip',
  baseType: '_component',
  displayName: 'Corel: Awards strip',
  description: 'Heading and a row of award / badge images with captions.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', description: 'Default: Multi award-winning solution.', isLocalized: true, sortOrder: 10 },
    Awards: {
      type: 'array',
      displayName: 'Awards',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 16,
      items: { type: 'component', contentType: CorelImageItemContentType },
    },
  },
});

export function CorelAwardsStrip({ content }: { content: ContentProps<typeof CorelAwardsStripContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? undefined} className="bg-gray-50 py-14">
      <div className="site-container">
        <h2 className="mb-8 text-center text-2xl font-bold">{content.Title || 'Multi award-winning solution'}</h2>
        <div {...pa('Awards')} className="flex flex-wrap justify-center gap-6">
          {(content.Awards ?? []).map((a, k) => (
            <div key={k} className="w-24 text-center">
              <CorelImg
                src={imageSrc(a.Image, a.ImageUrl)}
                alt={imageAlt(a.Image, a.Title ?? '')}
                seed={k}
                className="mx-auto h-28 w-24 rounded object-contain"
              />
              {a.Caption && <p className="mt-2 text-[11px] text-gray-500">{a.Caption}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Gallery grid
   =================================================================== */
export const CorelGalleryGridContentType = contentType({
  key: 'CorelGalleryGrid',
  baseType: '_component',
  displayName: 'Corel: Gallery grid',
  description: 'Masonry-style gallery of artwork; the caption (artist) appears on hover.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Subtitle: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 20 },
    Images: {
      type: 'array',
      displayName: 'Images',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 24,
      items: { type: 'component', contentType: CorelImageItemContentType },
    },
  },
});

const GALLERY_HEIGHTS = ['h-48', 'h-64', 'h-40', 'h-56'];

export function CorelGalleryGrid({ content }: { content: ContentProps<typeof CorelGalleryGridContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? undefined} className="py-20">
      <div className="site-container">
        <SectionHeading title={content.Title} sub={content.Subtitle} />
        <div {...pa('Images')} className="columns-2 gap-4 md:columns-4 [&>*]:mb-4">
          {(content.Images ?? []).map((g, k) => (
            <div key={k} className="group relative break-inside-avoid overflow-hidden rounded-xl">
              <CorelImg
                src={imageSrc(g.Image, g.ImageUrl)}
                alt={imageAlt(g.Image, g.Title ?? '')}
                seed={k}
                className={`w-full ${GALLERY_HEIGHTS[k % 4]}`}
              />
              {g.Caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white opacity-0 transition group-hover:opacity-100">
                  {g.Caption}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Ratings — competitive-advantage copy + review-site scores
   =================================================================== */
export const CorelRatingsContentType = contentType({
  key: 'CorelRatings',
  baseType: '_component',
  displayName: 'Corel: Ratings',
  description: 'Review-site scores, optionally beside a "competitive advantage" text panel.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    LeftTitle: { type: 'string', displayName: 'Left panel title', description: 'Leave the left panel fields empty to centre the ratings.', isLocalized: true, sortOrder: 10 },
    LeftLead: { type: 'string', displayName: 'Left panel lead', isLocalized: true, sortOrder: 20 },
    LeftBody: { type: 'string', displayName: 'Left panel body', isLocalized: true, sortOrder: 30 },
    Heading: { type: 'string', displayName: 'Ratings heading', description: 'Default: Top-rated by customers.', isLocalized: true, sortOrder: 40 },
    Subheading: { type: 'string', displayName: 'Ratings intro', isLocalized: true, sortOrder: 50 },
    Ratings: {
      type: 'array',
      displayName: 'Ratings',
      isLocalized: true,
      sortOrder: 60,
      maxItems: 6,
      items: { type: 'component', contentType: CorelRatingItemContentType },
    },
  },
});

export function CorelRatings({ content }: { content: ContentProps<typeof CorelRatingsContentType> }) {
  const { pa } = getPreviewUtils(content);
  const left = Boolean(content.LeftTitle || content.LeftLead || content.LeftBody);
  const ratings = content.Ratings ?? [];
  return (
    <section id={content.AnchorId ?? undefined} className="bg-white py-20">
      <div className="site-container grid gap-12 lg:grid-cols-2">
        {left && (
          <div>
            <h3 className="mb-4 text-2xl font-bold">{content.LeftTitle}</h3>
            <p className="mb-3 font-semibold">{content.LeftLead}</p>
            <p className="text-gray-600">{content.LeftBody}</p>
          </div>
        )}
        <div className={left ? '' : 'text-center lg:col-span-2'}>
          <h3 className="mb-2 text-2xl font-bold">{content.Heading || 'Top-rated by customers'}</h3>
          {content.Subheading && <p className="mb-6 text-gray-600">{content.Subheading}</p>}
          <div {...pa('Ratings')} className={`grid gap-4 ${left ? '' : 'mx-auto max-w-2xl'}`} style={{ gridTemplateColumns: `repeat(${Math.min(Math.max(ratings.length, 1), 3)}, minmax(0, 1fr))` }}>
            {ratings.map((r, k) => {
              const link = resolveLink(r.Link ?? undefined);
              const cls = 'rounded-2xl border border-gray-200 p-5 text-center hover:shadow-md';
              const inner = (
                <>
                  <div className="text-sm font-bold text-gray-500">{r.Source}</div>
                  <div className="my-1 text-3xl font-extrabold">{(r.Score ?? '').split('/')[0]}</div>
                  <div className="flex justify-center">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Icon key={s} name="star" fill className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                </>
              );
              return link ? (
                <ChromeLink key={k} href={link.href} className={cls}>{inner}</ChromeLink>
              ) : (
                <div key={k} className={cls}>{inner}</div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
