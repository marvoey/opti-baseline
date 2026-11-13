import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import ChromeLink from '@/app/_components/ChromeLink';
import CorelImg from '@/app/_components/corel/CorelImg';
import { PurchasePanel, SearchForm, TrialForm, type Plan } from '@/app/_components/corel/client';
import { Badge, Button, DARK_HERO, Icon } from '@/app/_components/corel/ui';
import { CorelPurchasePlanContentType } from './items';
import { anchorProp, choice, imageAlt, imageProps, imageSrc, resolveLink, THEME_OPTIONS } from './shared';

/* ===================================================================
   Corel: Hero split — home hero (light) and special-offers hero (dark)
   =================================================================== */
export const CorelHeroSplitContentType = contentType({
  key: 'CorelHeroSplit',
  baseType: '_component',
  displayName: 'Corel: Hero split',
  description: 'Headline, copy and up to two buttons beside a large image. Light (home) or dark (special offers).',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Theme: choice('Theme', THEME_OPTIONS, 5, 'Default: Light.'),
    Eyebrow: { type: 'string', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Title: { type: 'string', displayName: 'Headline', isLocalized: true, sortOrder: 20 },
    Body: { type: 'string', displayName: 'Body', isLocalized: true, sortOrder: 30 },
    PromoLabel: { type: 'string', displayName: 'Promo label', description: 'e.g. BLACK FRIDAY STARTS EARLY.', isLocalized: true, sortOrder: 40 },
    PromoText: { type: 'string', displayName: 'Promo text', isLocalized: true, sortOrder: 45 },
    PrimaryCta: { type: 'link', displayName: 'Primary button', isLocalized: true, sortOrder: 50 },
    SecondaryCta: { type: 'link', displayName: 'Secondary button', isLocalized: true, sortOrder: 55 },
    Note: { type: 'string', displayName: 'Note under buttons', isLocalized: true, sortOrder: 60 },
    ArtworkCredit: { type: 'string', displayName: 'Artwork credit', isLocalized: true, sortOrder: 65 },
    ...imageProps(70),
  },
});

export function CorelHeroSplit({ content }: { content: ContentProps<typeof CorelHeroSplitContentType> }) {
  const { pa } = getPreviewUtils(content);
  const dark = content.Theme === 'dark';
  const primary = resolveLink(content.PrimaryCta ?? undefined);
  const secondary = resolveLink(content.SecondaryCta ?? undefined);
  const hasPromo = content.PromoLabel || content.PromoText;

  return (
    <section
      id={content.AnchorId ?? undefined}
      className={dark ? DARK_HERO : 'relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white'}
    >
      <div className={`site-container grid items-center gap-12 py-16 lg:grid-cols-2 ${dark ? '' : 'lg:py-24'}`}>
        <div>
          {content.Eyebrow &&
            (dark ? (
              <p {...pa('Eyebrow')} className="text-sm font-bold tracking-widest text-brand-accent uppercase">{content.Eyebrow}</p>
            ) : (
              <Badge className="mb-5"><span {...pa('Eyebrow')}>{content.Eyebrow}</span></Badge>
            ))}
          <h1
            {...pa('Title')}
            className={`mt-2 font-extrabold tracking-tight ${dark ? 'text-4xl md:text-5xl' : 'text-4xl leading-[1.05] text-gray-900 md:text-6xl'}`}
          >
            {content.Title}
          </h1>
          {content.Body && (
            <p {...pa('Body')} className={`mt-5 max-w-xl ${dark ? 'text-lg text-gray-300' : 'text-xl text-gray-600'}`}>{content.Body}</p>
          )}
          {hasPromo && (
            <div className={`mt-6 inline-flex flex-col rounded-xl px-5 py-3 ${dark ? 'bg-white/10' : 'bg-black text-white'}`}>
              <span className="text-xs font-bold tracking-widest text-brand-accent">{content.PromoLabel}</span>
              <span className="font-semibold">{content.PromoText}</span>
            </div>
          )}
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primary && <Button href={primary.href} size="lg">{primary.label}</Button>}
              {secondary && (
                <Button href={secondary.href} variant={dark ? 'ghostLight' : 'outline'} size="lg">{secondary.label}</Button>
              )}
            </div>
          )}
          {content.Note && <p {...pa('Note')} className={`mt-4 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{content.Note}</p>}
        </div>
        <figure className="relative" {...pa('Image')}>
          <CorelImg
            src={imageSrc(content.Image, content.ImageUrl)}
            alt={imageAlt(content.Image, content.Title ?? '')}
            seed={1}
            className="h-auto min-h-[300px] w-full rounded-2xl"
          />
          {content.ArtworkCredit && (
            <figcaption className="absolute right-3 bottom-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              Artwork: {content.ArtworkCredit}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Page banner — centred banner (Learn) with optional search (Support)
   =================================================================== */
export const CorelPageBannerContentType = contentType({
  key: 'CorelPageBanner',
  baseType: '_component',
  displayName: 'Corel: Page banner',
  description: 'Centred title and intro, optionally with a search box (support). Dark or light.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Theme: choice('Theme', THEME_OPTIONS, 5, 'Default: Dark.'),
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 10 },
    Body: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 20 },
    ShowSearch: { type: 'boolean', displayName: 'Show search box', sortOrder: 30 },
    SearchPlaceholder: { type: 'string', displayName: 'Search placeholder', isLocalized: true, sortOrder: 40 },
    SearchUrl: {
      type: 'string',
      displayName: 'Search URL prefix',
      description: 'https:// address the search term is appended to, e.g. https://support.corel.com/hc/en-us/search?query=',
      sortOrder: 50,
    },
  },
});

export function CorelPageBanner({ content }: { content: ContentProps<typeof CorelPageBannerContentType> }) {
  const { pa } = getPreviewUtils(content);
  const light = content.Theme === 'light';
  const search = Boolean(content.ShowSearch);
  return (
    <section
      id={content.AnchorId ?? undefined}
      className={`${light ? 'bg-emerald-50' : DARK_HERO} ${search ? 'pt-20 pb-24' : 'py-20'}`}
    >
      <div className="site-container max-w-3xl text-center">
        <h1 {...pa('Title')} className="text-4xl font-extrabold md:text-5xl">{content.Title}</h1>
        {content.Body && (
          <p {...pa('Body')} className={`mt-5 text-lg ${light ? 'text-gray-600' : 'text-gray-300'}`}>{content.Body}</p>
        )}
        {search && (
          <SearchForm placeholder={content.SearchPlaceholder || 'Search…'} searchUrl={content.SearchUrl ?? ''} />
        )}
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Product hero — product intro + tabbed purchase options
   =================================================================== */
export const CorelProductHeroContentType = contentType({
  key: 'CorelProductHero',
  baseType: '_component',
  displayName: 'Corel: Product hero',
  description: 'Dark product hero with a trial button and a tabbed purchase-options card.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Badge: { type: 'string', displayName: 'Badge', description: 'e.g. New.', isLocalized: true, sortOrder: 10 },
    Title: { type: 'string', displayName: 'Product name', isLocalized: true, sortOrder: 20 },
    Subtitle: { type: 'string', displayName: 'Subtitle', isLocalized: true, sortOrder: 30 },
    Body: { type: 'string', displayName: 'Body', isLocalized: true, sortOrder: 40 },
    TrialCta: { type: 'link', displayName: 'Trial button', isLocalized: true, sortOrder: 50 },
    RatingCount: { type: 'string', displayName: 'Rating count', description: 'Shown beside the stars, e.g. 1020. Leave empty to hide the stars.', sortOrder: 60 },
    AiNoteLabel: { type: 'string', displayName: 'Highlight label', description: 'e.g. NEW THIS YEAR.', isLocalized: true, sortOrder: 70 },
    AiNoteTitle: { type: 'string', displayName: 'Highlight title', isLocalized: true, sortOrder: 80 },
    AiNoteSub: { type: 'string', displayName: 'Highlight sub-text', isLocalized: true, sortOrder: 90 },
    PurchaseHeading: { type: 'string', displayName: 'Purchase card heading', description: 'Default: Purchase options.', isLocalized: true, sortOrder: 100 },
    VatNote: { type: 'string', displayName: 'Price note', description: 'e.g. (incl. VAT).', isLocalized: true, sortOrder: 105 },
    UpgradeLink: { type: 'link', displayName: 'Upgrade link', isLocalized: true, sortOrder: 110 },
    FeaturesLink: { type: 'link', displayName: 'Subscription features link', description: 'Shown on plans that have "Show subscription links" on.', isLocalized: true, sortOrder: 120 },
    RenewLink: { type: 'link', displayName: 'Renew link', description: 'Shown on plans that have "Show subscription links" on.', isLocalized: true, sortOrder: 130 },
    BusinessLink: { type: 'link', displayName: 'Business link', isLocalized: true, sortOrder: 140 },
    Plans: {
      type: 'array',
      displayName: 'Purchase plans',
      isLocalized: true,
      sortOrder: 150,
      maxItems: 3,
      items: { type: 'component', contentType: CorelPurchasePlanContentType },
    },
  },
});

export function CorelProductHero({ content }: { content: ContentProps<typeof CorelProductHeroContentType> }) {
  const { pa } = getPreviewUtils(content);
  const trial = resolveLink(content.TrialCta ?? undefined);
  const plans: Plan[] = (content.Plans ?? []).map((p) => ({
    label: p.Label ?? '',
    tag: p.Tag ?? '',
    headline: p.Headline ?? '',
    blurb: p.Blurb ?? '',
    save: p.SaveLabel ?? '',
    price: p.Price ?? '',
    unit: p.Unit ?? '',
    was: p.WasPrice ?? '',
    cta: resolveLink(p.Cta ?? undefined),
    promoTitle: p.PromoTitle ?? '',
    promoText: p.PromoText ?? '',
    showSubscriptionLinks: Boolean(p.ShowSubscriptionLinks),
  }));

  return (
    <section id={content.AnchorId ?? 'prod-hero'} className={DARK_HERO}>
      <div className="site-container grid items-start gap-12 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <h1>
            {content.Badge && <Badge>{content.Badge}</Badge>}
            <span {...pa('Title')} className="mt-4 block text-4xl font-extrabold md:text-5xl">{content.Title}</span>
            {content.Subtitle && (
              <span {...pa('Subtitle')} className="mt-3 block text-xl font-medium text-gray-300 md:text-2xl">{content.Subtitle}</span>
            )}
          </h1>
          {content.Body && <p {...pa('Body')} className="mt-6 text-lg text-gray-300">{content.Body}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {trial && <Button href={trial.href} size="lg">{trial.label}</Button>}
            {content.RatingCount && (
              <a href="#faq" className="flex items-center gap-1 text-sm text-gray-300">
                {[0, 1, 2, 3].map((k) => (
                  <Icon key={k} name="star" fill className="h-4 w-4 text-yellow-400" />
                ))}
                <Icon name="star" className="h-4 w-4 text-yellow-400" />
                <span className="ml-1">({content.RatingCount})</span>
              </a>
            )}
          </div>
          {(content.AiNoteLabel || content.AiNoteTitle) && (
            <div className="mt-10 max-w-md rounded-2xl border border-white/15 bg-white/5 p-5">
              <div className="text-xs font-bold tracking-widest text-brand-accent">{content.AiNoteLabel}</div>
              <p className="mt-1 font-semibold">{content.AiNoteTitle}</p>
              <p className="text-sm text-gray-400">{content.AiNoteSub}</p>
            </div>
          )}
        </div>
        <div id="buy" {...pa('Plans')}>
          <PurchasePanel
            plans={plans}
            links={{
              heading: content.PurchaseHeading || 'Purchase options',
              vatNote: content.VatNote ?? '',
              upgrade: resolveLink(content.UpgradeLink ?? undefined),
              features: resolveLink(content.FeaturesLink ?? undefined),
              renew: resolveLink(content.RenewLink ?? undefined),
              business: resolveLink(content.BusinessLink ?? undefined),
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Trial hero — free-trial pitch + email sign-up form
   =================================================================== */
export const CorelTrialHeroContentType = contentType({
  key: 'CorelTrialHero',
  baseType: '_component',
  displayName: 'Corel: Trial hero',
  description: 'Free-trial headline with a try button and an email sign-up form (UI only — nothing is submitted).',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Headline', isLocalized: true, sortOrder: 10 },
    Body: { type: 'string', displayName: 'Body', isLocalized: true, sortOrder: 20 },
    Cta: { type: 'link', displayName: 'Try button', isLocalized: true, sortOrder: 30 },
    CtaNote: { type: 'string', displayName: 'Note beside button', description: 'e.g. No credit card required!', isLocalized: true, sortOrder: 40 },
    LearnMoreLink: { type: 'link', displayName: 'Learn more link', isLocalized: true, sortOrder: 45 },
    FormIntro: { type: 'string', displayName: 'Form intro', isLocalized: true, sortOrder: 50 },
    ConsentText: { type: 'string', displayName: 'Consent text', isLocalized: true, sortOrder: 60 },
    SubmitLabel: { type: 'string', displayName: 'Submit button label', description: 'Default: Download.', isLocalized: true, sortOrder: 70 },
    SuccessTitle: { type: 'string', displayName: 'Success title', isLocalized: true, sortOrder: 80 },
    SuccessBody: { type: 'string', displayName: 'Success message', isLocalized: true, sortOrder: 90 },
  },
});

export function CorelTrialHero({ content }: { content: ContentProps<typeof CorelTrialHeroContentType> }) {
  const { pa } = getPreviewUtils(content);
  const cta = resolveLink(content.Cta ?? undefined);
  const more = resolveLink(content.LearnMoreLink ?? undefined);
  return (
    <section id={content.AnchorId ?? undefined} className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="site-container grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 {...pa('Title')} className="text-4xl font-extrabold tracking-tight md:text-5xl">{content.Title}</h1>
          {content.Body && <p {...pa('Body')} className="mt-5 text-lg text-gray-600">{content.Body}</p>}
          <div className="mt-8 flex items-center gap-5">
            {cta && <Button href={cta.href} size="lg">{cta.label}</Button>}
            {(content.CtaNote || more) && (
              <span className="text-sm text-gray-500">
                {content.CtaNote}{' '}
                {more && <ChromeLink href={more.href} className="font-semibold text-brand">{more.label}</ChromeLink>}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <TrialForm
            intro={content.FormIntro ?? ''}
            consent={content.ConsentText ?? ''}
            submitLabel={content.SubmitLabel || 'Download'}
            successTitle={content.SuccessTitle ?? ''}
            successBody={content.SuccessBody ?? ''}
          />
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Split CTA — browser-trial prompt with a secondary link
   =================================================================== */
export const CorelSplitCtaContentType = contentType({
  key: 'CorelSplitCta',
  baseType: '_component',
  displayName: 'Corel: Split call to action',
  description: 'Image beside a headline, button, note and a secondary "try the full suite" link.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Headline', isLocalized: true, sortOrder: 10 },
    Cta: { type: 'link', displayName: 'Button', isLocalized: true, sortOrder: 20 },
    Note: { type: 'string', displayName: 'Note', isLocalized: true, sortOrder: 30 },
    SecondaryLead: { type: 'string', displayName: 'Secondary lead-in', isLocalized: true, sortOrder: 40 },
    SecondaryLink: { type: 'link', displayName: 'Secondary link', isLocalized: true, sortOrder: 50 },
    SecondarySuffix: { type: 'string', displayName: 'Text after secondary link', description: 'e.g. "on Windows or Mac."', isLocalized: true, sortOrder: 60 },
    ...imageProps(70),
  },
});

export function CorelSplitCta({ content }: { content: ContentProps<typeof CorelSplitCtaContentType> }) {
  const { pa } = getPreviewUtils(content);
  const cta = resolveLink(content.Cta ?? undefined);
  const second = resolveLink(content.SecondaryLink ?? undefined);
  return (
    <section id={content.AnchorId ?? undefined} className="py-20">
      <div className="site-container grid items-center gap-12 lg:grid-cols-2">
        <CorelImg
          src={imageSrc(content.Image, content.ImageUrl)}
          alt={imageAlt(content.Image, content.Title ?? '')}
          seed={4}
          className="h-72 w-full rounded-3xl"
        />
        <div>
          <h2 {...pa('Title')} className="text-3xl font-bold">{content.Title}</h2>
          {cta && <div className="mt-6"><Button href={cta.href} size="lg">{cta.label}</Button></div>}
          {content.Note && <p className="mt-4 text-sm text-gray-500">{content.Note}</p>}
          {(content.SecondaryLead || second) && (
            <>
              <hr className="my-6" />
              <p>
                <b>{content.SecondaryLead}</b>{' '}
                {second && <ChromeLink href={second.href} className="font-semibold text-brand hover:underline">{second.label}</ChromeLink>}{' '}
                {content.SecondarySuffix}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: CTA banner — full-width call to action
   =================================================================== */
export const CorelCtaBannerContentType = contentType({
  key: 'CorelCtaBanner',
  baseType: '_component',
  displayName: 'Corel: CTA banner',
  description: 'Full-width headline with one button. Dark or light.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Theme: choice('Theme', THEME_OPTIONS, 5, 'Default: Dark.'),
    Title: { type: 'string', displayName: 'Headline', isLocalized: true, sortOrder: 10 },
    Cta: { type: 'link', displayName: 'Button', isLocalized: true, sortOrder: 20 },
  },
});

export function CorelCtaBanner({ content }: { content: ContentProps<typeof CorelCtaBannerContentType> }) {
  const { pa } = getPreviewUtils(content);
  const light = content.Theme === 'light';
  const cta = resolveLink(content.Cta ?? undefined);
  return (
    <section
      id={content.AnchorId ?? undefined}
      className={`${light ? 'bg-emerald-50' : 'bg-gradient-to-r from-black via-gray-900 to-emerald-900'} py-16`}
    >
      <div className="site-container flex flex-col items-center justify-between gap-6 md:flex-row">
        <h2 {...pa('Title')} className={`max-w-3xl text-2xl font-bold md:text-3xl ${light ? 'text-gray-900' : 'text-white'}`}>
          {content.Title}
        </h2>
        {cta && <Button href={cta.href} variant={light ? 'outline' : 'primary'} size="lg">{cta.label}</Button>}
      </div>
    </section>
  );
}
