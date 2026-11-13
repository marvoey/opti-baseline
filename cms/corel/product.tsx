import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

import ChromeLink from '@/app/_components/ChromeLink';
import CorelImg from '@/app/_components/corel/CorelImg';
import { Accordion, Disclosure, Scroller } from '@/app/_components/corel/client';
import { Button, GRADS, Icon, SectionHeading } from '@/app/_components/corel/ui';
import {
  CorelAppItemContentType,
  CorelFaqItemContentType,
  CorelSpecItemContentType,
  CorelTextCardContentType,
} from './items';
import {
  anchorProp,
  choice,
  groupConsecutive,
  imageAlt,
  imageProps,
  imageSrc,
  resolveLink,
  resolveLinks,
  strings,
} from './shared';

/* ===================================================================
   Corel: Sub-navigation — sticky in-page nav / dark section nav
   =================================================================== */
export const CorelSubNavContentType = contentType({
  key: 'CorelSubNav',
  baseType: '_component',
  displayName: 'Corel: Sub-navigation',
  description: 'Secondary navigation bar: sticky in-page anchors with a button (product), or a dark section menu (learning center).',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Variant: choice(
      'Style',
      [
        ['sticky', 'Sticky (white, with button)'],
        ['dark', 'Dark section menu'],
      ],
      5,
      'Default: Sticky.',
    ),
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 10 },
    TitleLink: { type: 'link', displayName: 'Title link', description: 'Optional; makes the title a link (dark style).', isLocalized: true, sortOrder: 20 },
    Links: {
      type: 'array',
      displayName: 'Links',
      description: 'For in-page anchors use #id (the target block\'s Anchor ID).',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 10,
      items: { type: 'link' },
    },
    Cta: { type: 'link', displayName: 'Button', description: 'Sticky style only.', isLocalized: true, sortOrder: 40 },
  },
});

export function CorelSubNav({ content }: { content: ContentProps<typeof CorelSubNavContentType> }) {
  const { pa } = getPreviewUtils(content);
  const dark = content.Variant === 'dark';
  const links = resolveLinks(content.Links);
  const cta = resolveLink(content.Cta ?? undefined);
  const titleLink = resolveLink(content.TitleLink ?? undefined);
  const title = content.Title ?? '';

  if (dark) {
    return (
      <nav id={content.AnchorId ?? undefined} className="bg-gray-900 text-white">
        <div className="site-container flex h-12 items-center gap-8 overflow-x-auto text-sm">
          {titleLink ? (
            <ChromeLink href={titleLink.href} className="font-bold whitespace-nowrap">{title}</ChromeLink>
          ) : (
            <span className="font-bold whitespace-nowrap">{title}</span>
          )}
          <ul {...pa('Links')} className="flex gap-6">
            {links.map((l) => (
              <li key={l.href + l.label}>
                <ChromeLink href={l.href} className="whitespace-nowrap text-gray-300 hover:text-white">{l.label}</ChromeLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
  return (
    <nav id={content.AnchorId ?? undefined} className="sticky top-16 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="site-container flex h-14 items-center gap-6 overflow-x-auto">
        <span className="font-bold whitespace-nowrap">{title}</span>
        <ul {...pa('Links')} className="flex flex-1 gap-5 text-sm">
          {links.map((l) => (
            <li key={l.href + l.label}>
              <ChromeLink href={l.href} className="whitespace-nowrap text-gray-600 hover:text-brand">{l.label}</ChromeLink>
            </li>
          ))}
        </ul>
        {cta && <Button href={cta.href} size="sm">{cta.label}</Button>}
      </div>
    </nav>
  );
}

/* ===================================================================
   Corel: Intro split — rich text beside an image
   =================================================================== */
export const CorelIntroSplitContentType = contentType({
  key: 'CorelIntroSplit',
  baseType: '_component',
  displayName: 'Corel: Intro split',
  description: 'Heading and rich text beside an image; can be flipped.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Body: { type: 'richText', displayName: 'Body', isLocalized: true, sortOrder: 20 },
    Reverse: { type: 'boolean', displayName: 'Image on the left', sortOrder: 30 },
    ...imageProps(40),
  },
});

export function CorelIntroSplit({ content }: { content: ContentProps<typeof CorelIntroSplitContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? undefined} className="py-20">
      <div className={`site-container grid items-center gap-12 lg:grid-cols-2 ${content.Reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <h2 {...pa('Title')} className="mb-6 text-3xl font-bold md:text-4xl">{content.Title}</h2>
          <div {...pa('Body')} className="prose max-w-none text-lg text-gray-600">
            <RichTextRenderer content={content.Body?.json} />
          </div>
        </div>
        <CorelImg
          src={imageSrc(content.Image, content.ImageUrl)}
          alt={imageAlt(content.Image, content.Title ?? '')}
          seed={2}
          className="min-h-[300px] w-full rounded-2xl object-cover shadow-xl"
        />
      </div>
    </section>
  );
}

/* ===================================================================
   "What else is included" panel — shared by the app blocks
   =================================================================== */
const includedProps = {
  ToggleLabel: { type: 'string' as const, displayName: 'Toggle label', description: 'Default: What else is included.', isLocalized: true, sortOrder: 60 },
  IncludedContentTitle: { type: 'string' as const, displayName: 'Content list title', description: 'Default: Content.', isLocalized: true, sortOrder: 61 },
  IncludedContent: {
    type: 'array' as const,
    displayName: 'Included content',
    isLocalized: true,
    sortOrder: 62,
    items: { type: 'string' as const },
  },
  IncludedCreditsTitle: { type: 'string' as const, displayName: 'Credits list title', description: 'Default: AI credits.', isLocalized: true, sortOrder: 63 },
  IncludedCredits: {
    type: 'array' as const,
    displayName: 'Included AI credits',
    isLocalized: true,
    sortOrder: 64,
    items: { type: 'string' as const },
  },
};

type IncludedFields = {
  ToggleLabel?: string | null;
  IncludedContentTitle?: string | null;
  IncludedContent?: (string | null)[] | null;
  IncludedCreditsTitle?: string | null;
  IncludedCredits?: (string | null)[] | null;
};

function IncludedPanel({ content, panelClass }: { content: IncludedFields; panelClass: string }) {
  const items = strings(content.IncludedContent);
  const credits = strings(content.IncludedCredits);
  if (items.length === 0 && credits.length === 0) return null;
  return (
    <Disclosure label={content.ToggleLabel || 'What else is included'}>
      <div className={`mt-6 grid gap-8 rounded-2xl p-8 text-left md:grid-cols-3 ${panelClass}`}>
        <div className="md:col-span-2">
          <h4 className="mb-3 font-bold">{content.IncludedContentTitle || 'Content'}</h4>
          <ul className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            {items.map((c) => (
              <li key={c} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold">{content.IncludedCreditsTitle || 'AI credits'}</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {credits.map((c) => (
              <li key={c} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </Disclosure>
  );
}

/* ===================================================================
   Corel: App grid — "All the tools you need"
   =================================================================== */
export const CorelAppGridContentType = contentType({
  key: 'CorelAppGrid',
  baseType: '_component',
  displayName: 'Corel: App grid',
  description: 'Grid of the applications in the suite, with an expandable "what else is included" list.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Apps: {
      type: 'array',
      displayName: 'Apps',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 8,
      items: { type: 'component', contentType: CorelAppItemContentType },
    },
    ...includedProps,
  },
});

export function CorelAppGrid({ content }: { content: ContentProps<typeof CorelAppGridContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? 'tools'} className="py-20">
      <div className="site-container">
        <SectionHeading title={content.Title} />
        <div {...pa('Apps')} className="grid gap-6 md:grid-cols-2">
          {(content.Apps ?? []).map((a, k) => (
            <div key={k} className="flex gap-5 rounded-2xl border border-gray-200 p-6 transition hover:shadow-lg">
              <CorelImg
                src={imageSrc(a.Image, a.ImageUrl)}
                alt={imageAlt(a.Image, a.Name ?? '')}
                seed={k}
                className="h-16 w-16 shrink-0 rounded-xl object-contain"
              />
              <div>
                <h4 className="text-xl font-bold">{a.Name}</h4>
                <p className="mb-2 text-sm font-semibold text-brand">{a.Subtitle}</p>
                <p className="text-gray-600">
                  {a.Description} {a.SubscriberExclusive && <span className="font-semibold text-gray-900">Subscriber exclusive!</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
        <IncludedPanel content={content} panelClass="bg-gray-50" />
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Included apps — trial page "What's included"
   =================================================================== */
export const CorelIncludedAppsContentType = contentType({
  key: 'CorelIncludedApps',
  baseType: '_component',
  displayName: 'Corel: Included apps',
  description: 'One featured app with highlights beside a list of "also included" apps.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    // No isLocalized here: the CMS rejects it on a single `component` property
    // (localise the fields of CorelAppItem instead, which they already are).
    PrimaryApp: { type: 'component', displayName: 'Featured app', contentType: CorelAppItemContentType, sortOrder: 20 },
    AlsoLabel: { type: 'string', displayName: 'Also-included label', description: 'Default: Also included.', isLocalized: true, sortOrder: 30 },
    AlsoIncluded: {
      type: 'array',
      displayName: 'Also included',
      isLocalized: true,
      sortOrder: 40,
      maxItems: 6,
      items: { type: 'component', contentType: CorelAppItemContentType },
    },
    ...includedProps,
  },
});

export function CorelIncludedApps({ content }: { content: ContentProps<typeof CorelIncludedAppsContentType> }) {
  const { pa } = getPreviewUtils(content);
  const primary = content.PrimaryApp;
  return (
    <section id={content.AnchorId ?? undefined} className="bg-gray-50 py-20">
      <div className="site-container">
        <SectionHeading title={content.Title} />
        <div className="grid gap-8 lg:grid-cols-5">
          {primary && (
            <div {...pa('PrimaryApp')} className="flex gap-6 rounded-3xl bg-white p-8 lg:col-span-3">
              <CorelImg
                src={imageSrc(primary.Image, primary.ImageUrl)}
                alt={imageAlt(primary.Image, primary.Name ?? '')}
                className="h-20 w-20 shrink-0 rounded-xl object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold">{primary.Name}</h3>
                <p className="font-semibold text-brand">{primary.Subtitle}</p>
                <p className="mt-3 text-gray-600">{primary.Description}</p>
                <ul className="mt-4 space-y-2">
                  {strings(primary.Bullets).map((b) => (
                    <li key={b} className="flex gap-2 text-gray-700"><Icon name="check" className="h-5 w-5 shrink-0 text-brand" />{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div {...pa('AlsoIncluded')} className="rounded-3xl bg-white p-8 lg:col-span-2">
            <p className="mb-4 text-xs font-bold tracking-wider text-gray-500 uppercase">{content.AlsoLabel || 'Also included'}</p>
            <ul className="space-y-5">
              {(content.AlsoIncluded ?? []).map((a, k) => (
                <li key={k} className="flex items-center gap-4">
                  <CorelImg
                    src={imageSrc(a.Image, a.ImageUrl)}
                    alt={imageAlt(a.Image, a.Name ?? '')}
                    seed={k}
                    className="h-12 w-12 rounded-lg object-contain"
                  />
                  <div>
                    <p className="font-bold">
                      {a.Name}{' '}
                      {a.SubscriberExclusive && (
                        <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-800 uppercase">Subscriber exclusive</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{a.Description || a.Subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <IncludedPanel content={content} panelClass="bg-white" />
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Card grid — industries (image cards) / capabilities (icon tiles)
   =================================================================== */
export const CorelCardGridContentType = contentType({
  key: 'CorelCardGrid',
  baseType: '_component',
  displayName: 'Corel: Card grid',
  description: 'Heading and a grid of cards: image cards on grey (industries) or icon tiles (capabilities), with an optional scrolling row below.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Variant: choice(
      'Style',
      [
        ['image', 'Image cards on grey'],
        ['icon', 'Icon tiles'],
      ],
      5,
      'Default: Image cards.',
    ),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Subtitle: { type: 'string', displayName: 'Sub-heading', description: 'Smaller heading above the cards (icon tiles).', isLocalized: true, sortOrder: 20 },
    Items: {
      type: 'array',
      displayName: 'Cards',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 12,
      items: { type: 'component', contentType: CorelTextCardContentType },
    },
    SliderTitle: { type: 'string', displayName: 'Scrolling row heading', isLocalized: true, sortOrder: 40 },
    SliderItems: {
      type: 'array',
      displayName: 'Scrolling row cards',
      isLocalized: true,
      sortOrder: 50,
      maxItems: 16,
      items: { type: 'component', contentType: CorelTextCardContentType },
    },
  },
});

export function CorelCardGrid({ content }: { content: ContentProps<typeof CorelCardGridContentType> }) {
  const { pa } = getPreviewUtils(content);
  const icon = content.Variant === 'icon';
  const items = content.Items ?? [];
  const slider = content.SliderItems ?? [];
  return (
    <section id={content.AnchorId ?? (icon ? 'features' : undefined)} className={`py-20 ${icon ? '' : 'bg-gray-50'}`}>
      <div className="site-container">
        <SectionHeading title={content.Title} />
        {icon && content.Subtitle && <h3 className="mb-6 text-xl font-bold">{content.Subtitle}</h3>}
        <div {...pa('Items')} className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
          {items.map((c, k) =>
            icon ? (
              <div key={k} className="rounded-2xl border border-gray-200 p-6">
                <div className={`mb-4 h-12 w-12 rounded-xl bg-gradient-to-br ${GRADS[k % GRADS.length]}`} />
                <h4 className="mb-2 text-lg font-bold">{c.Title}</h4>
                <p className="text-sm text-gray-600">{c.Description}</p>
              </div>
            ) : (
              <div key={k} className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg">
                <CorelImg
                  src={imageSrc(c.Image, c.ImageUrl)}
                  alt={imageAlt(c.Image, c.Title ?? '')}
                  seed={k}
                  className="h-40 w-full object-cover"
                />
                <div className="p-6">
                  <h4 className="mb-2 text-lg font-bold">{c.Title}</h4>
                  <p className="text-sm text-gray-600">{c.Description}</p>
                </div>
              </div>
            ),
          )}
        </div>
        {slider.length > 0 && (
          <>
            {content.SliderTitle && <h3 className="mt-16 mb-6 text-xl font-bold">{content.SliderTitle}</h3>}
            <div {...pa('SliderItems')}>
              <Scroller>
                {slider.map((c, k) => (
                  <div key={k} className="w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl bg-gray-50">
                    <CorelImg
                      src={imageSrc(c.Image, c.ImageUrl)}
                      alt={imageAlt(c.Image, c.Title ?? '')}
                      seed={k + 3}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="mb-2 font-bold">{c.Title}</div>
                      <div className="text-sm text-gray-600">{c.Description}</div>
                    </div>
                  </div>
                ))}
              </Scroller>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Card carousel — release notes / "try it" tiles
   =================================================================== */
export const CorelCardCarouselContentType = contentType({
  key: 'CorelCardCarousel',
  baseType: '_component',
  displayName: 'Corel: Card carousel',
  description: 'Horizontally scrolling cards: release notes grouped by month, or small "try it" link tiles.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Variant: choice(
      'Style',
      [
        ['release', 'Release cards (grouped by heading)'],
        ['tile', 'Link tiles'],
      ],
      5,
      'Default: Release cards.',
    ),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Subtitle: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 20 },
    Cards: {
      type: 'array',
      displayName: 'Cards',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 40,
      items: { type: 'component', contentType: CorelTextCardContentType },
    },
    Cta: { type: 'link', displayName: 'Button under the carousel', isLocalized: true, sortOrder: 40 },
  },
});

export function CorelCardCarousel({ content }: { content: ContentProps<typeof CorelCardCarouselContentType> }) {
  const { pa } = getPreviewUtils(content);
  const tile = content.Variant === 'tile';
  const cards = content.Cards ?? [];
  const cta = resolveLink(content.Cta ?? undefined);
  const groups = groupConsecutive(cards, (c) => c.Group);

  return (
    <section id={content.AnchorId ?? (tile ? undefined : 'whats-new')} className={`py-20 ${tile ? 'bg-gray-50' : ''}`}>
      <div className="site-container">
        <SectionHeading title={content.Title} sub={content.Subtitle} />
        <div {...pa('Cards')}>
          {tile ? (
            <Scroller>
              {cards.map((c, k) => {
                const link = resolveLink(c.Link ?? undefined);
                const cls = 'group w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg';
                const inner = (
                  <>
                    <CorelImg src={imageSrc(c.Image, c.ImageUrl)} alt={imageAlt(c.Image, c.Title ?? '')} seed={k} className="h-36 w-full object-cover" />
                    <div className="flex items-center justify-between p-4">
                      <h3 className="font-semibold group-hover:text-brand">{c.Title}</h3>
                      <Icon name="right" className="h-4 w-4 text-brand" />
                    </div>
                  </>
                );
                return link ? <ChromeLink key={k} href={link.href} className={cls}>{inner}</ChromeLink> : <div key={k} className={cls}>{inner}</div>;
              })}
            </Scroller>
          ) : (
            groups.map((g, gi) => (
              <div key={gi} className={gi ? 'mt-12 border-t border-gray-200 pt-12' : ''}>
                {g.group && <h3 className="mb-6 text-xl font-bold">{g.group}</h3>}
                <Scroller>
                  {g.items.map((c, k) => {
                    const link = resolveLink(c.Link ?? undefined);
                    return (
                      <div key={k} className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-gray-200">
                        <CorelImg src={imageSrc(c.Image, c.ImageUrl)} alt={imageAlt(c.Image, c.Title ?? '')} seed={k + gi} className="h-40 w-full object-cover" />
                        <div className="flex flex-1 flex-col p-5">
                          <div className="mb-2 font-bold">{c.Title}</div>
                          <div className="flex-1 text-sm text-gray-600">{c.Description}</div>
                          {link && (
                            <ChromeLink href={link.href} className="mt-4 text-sm font-semibold text-brand">{link.label} →</ChromeLink>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </Scroller>
              </div>
            ))
          )}
        </div>
        {cta && <div className="mt-10 text-center"><Button href={cta.href} variant="outline">{cta.label}</Button></div>}
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Feature spotlight — dark showcase with a lead feature
   =================================================================== */
export const CorelFeatureSpotlightContentType = contentType({
  key: 'CorelFeatureSpotlight',
  baseType: '_component',
  displayName: 'Corel: Feature spotlight',
  description: 'Dark showcase: a lead feature with image, then a row of supporting features.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    LeadTitle: { type: 'string', displayName: 'Lead feature title', isLocalized: true, sortOrder: 20 },
    LeadBody: { type: 'string', displayName: 'Lead feature text', isLocalized: true, sortOrder: 30 },
    ...imageProps(40),
    Items: {
      type: 'array',
      displayName: 'Supporting features',
      isLocalized: true,
      sortOrder: 50,
      maxItems: 8,
      items: { type: 'component', contentType: CorelTextCardContentType },
    },
  },
});

export function CorelFeatureSpotlight({ content }: { content: ContentProps<typeof CorelFeatureSpotlightContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? undefined} className="bg-ink py-20 text-white">
      <div className="site-container">
        <SectionHeading title={content.Title} light />
        <div className="mb-14 grid items-center gap-10 lg:grid-cols-2">
          <CorelImg
            src={imageSrc(content.Image, content.ImageUrl)}
            alt={imageAlt(content.Image, content.LeadTitle ?? '')}
            seed={1}
            className="h-72 w-full rounded-2xl object-cover"
          />
          <div>
            <h3 {...pa('LeadTitle')} className="mb-4 text-3xl font-bold">{content.LeadTitle}</h3>
            <p {...pa('LeadBody')} className="text-lg text-gray-300">{content.LeadBody}</p>
          </div>
        </div>
        <div {...pa('Items')} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(content.Items ?? []).map((c, k) => (
            <div key={k} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <CorelImg src={imageSrc(c.Image, c.ImageUrl)} alt={imageAlt(c.Image, c.Title ?? '')} seed={k + 2} className="h-36 w-full object-cover" />
              <div className="p-5">
                <div className="mb-2 font-bold">{c.Title}</div>
                <div className="text-sm text-gray-400">{c.Description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: FAQ accordion
   =================================================================== */
export const CorelFaqAccordionContentType = contentType({
  key: 'CorelFaqAccordion',
  baseType: '_component',
  displayName: 'Corel: FAQ accordion',
  description: 'Expandable list of questions with rich-text answers.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', description: 'Default: Frequently asked questions.', isLocalized: true, sortOrder: 10 },
    Items: {
      type: 'array',
      displayName: 'Questions',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 30,
      items: { type: 'component', contentType: CorelFaqItemContentType },
    },
  },
});

export function CorelFaqAccordion({ content }: { content: ContentProps<typeof CorelFaqAccordionContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? 'faq'} className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={content.Title || 'Frequently asked questions'} />
        <div {...pa('Items')}>
          <Accordion
            items={(content.Items ?? []).map((f) => ({
              question: f.Question ?? '',
              answer: <RichTextRenderer content={f.Answer?.json} />,
            }))}
          />
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Tech specs — per-platform requirements
   =================================================================== */
export const CorelTechSpecsContentType = contentType({
  key: 'CorelTechSpecs',
  baseType: '_component',
  displayName: 'Corel: Tech specs',
  description: 'System requirements, one card per platform (Windows, Mac, Web).',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', description: 'Default: Tech specs.', isLocalized: true, sortOrder: 10 },
    Specs: {
      type: 'array',
      displayName: 'Specs',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 60,
      items: { type: 'component', contentType: CorelSpecItemContentType },
    },
  },
});

export function CorelTechSpecs({ content }: { content: ContentProps<typeof CorelTechSpecsContentType> }) {
  const { pa } = getPreviewUtils(content);
  const platforms = groupConsecutive(content.Specs ?? [], (s) => s.Group);
  return (
    <section id={content.AnchorId ?? 'tech-specs'} className="bg-gray-50 py-20">
      <div className="site-container">
        <SectionHeading title={content.Title || 'Tech specs'} />
        <div {...pa('Specs')} className="grid gap-6 lg:grid-cols-3">
          {platforms.map((p, i) => (
            <div key={i} className="rounded-2xl bg-white p-6">
              {p.group && <h3 className="mb-1 text-xl font-bold">{p.group}</h3>}
              {p.items[0]?.GroupNote && <p className="mb-4 text-sm text-gray-500">{p.items[0].GroupNote}</p>}
              <ul className="mt-4 space-y-4">
                {p.items.map((s, k) => (
                  <li key={k}>
                    <h4 className="text-sm font-bold text-gray-900">{s.Heading}</h4>
                    <p className="text-sm text-gray-600">{s.Detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
