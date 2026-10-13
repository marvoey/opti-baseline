import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import QuoteTrackTabs from '../app/_components/QuoteTrackTabs';
import SmartCta, { contentLocale, isEditorContent } from '../app/_components/SmartCta';
import { DEFAULT_LOCALE } from '../lib/locales';
import { ctaHref, ctaLabel } from './shared';

export const EnhancedAppTeaserContentType = contentType({
  key: 'UpsEnhancedAppTeaser',
  baseType: '_component',
  displayName: 'UPS Hero & Quick Shipping Widget',
  description: 'Promo banner paired with interactive Shipping Quote and Tracking tabs.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    // ── Promo ──
    PromoTitle: { type: 'string', displayName: 'Promo Title', group: 'promo', isLocalized: true, sortOrder: 10 },
    PromoIntro: { type: 'string', displayName: 'Promo Intro', description: 'e.g. "Limited time offer:"', group: 'promo', isLocalized: true, sortOrder: 20 },
    PromoSavePrefix: { type: 'string', displayName: 'Promo Save Prefix', description: 'e.g. "Save up to"', group: 'promo', isLocalized: true, sortOrder: 30 },
    PromoDiscount: { type: 'string', displayName: 'Discount', description: 'e.g. "52%"', group: 'promo', isLocalized: true, sortOrder: 40 },
    PromoCodeInfix: { type: 'string', displayName: 'Promo Code Infix', description: 'e.g. "with promo code"', group: 'promo', isLocalized: true, sortOrder: 50 },
    PromoCode: { type: 'string', displayName: 'Promo Code', group: 'promo', sortOrder: 60 },
    PromoCta: { type: 'link', displayName: 'Promo CTA', group: 'promo', isLocalized: true, sortOrder: 70 },
    TermsLink: { type: 'link', displayName: 'Terms Link', group: 'promo', isLocalized: true, sortOrder: 80 },
    // ── Quote & Tracking ──
    ShippingTabLabel: { type: 'string', displayName: 'Shipping Tab Label', group: 'quote', isLocalized: true, sortOrder: 110 },
    FromLabel: { type: 'string', displayName: 'From Field Label', description: 'e.g. "From Address or Postal Code"', group: 'quote', isLocalized: true, sortOrder: 120 },
    ToLabel: { type: 'string', displayName: 'To Field Label', description: 'e.g. "To Address or Postal Code"', group: 'quote', isLocalized: true, sortOrder: 130 },
    LengthLabel: { type: 'string', displayName: 'Length Label', group: 'quote', isLocalized: true, sortOrder: 140 },
    WidthLabel: { type: 'string', displayName: 'Width Label', group: 'quote', isLocalized: true, sortOrder: 150 },
    HeightLabel: { type: 'string', displayName: 'Height Label', group: 'quote', isLocalized: true, sortOrder: 160 },
    WeightLabel: { type: 'string', displayName: 'Weight Label', group: 'quote', isLocalized: true, sortOrder: 170 },
    ResidentialLabel: { type: 'string', displayName: 'Residential Checkbox Label', description: 'e.g. "This is a residential address."', group: 'quote', isLocalized: true, sortOrder: 180 },
    QuoteButtonLabel: { type: 'string', displayName: 'Quote Button Label', description: 'e.g. "Get a Quote"', group: 'quote', isLocalized: true, sortOrder: 190 },
    TrackingTabLabel: { type: 'string', displayName: 'Tracking Tab Label', group: 'quote', isLocalized: true, sortOrder: 200 },
    TrackingPlaceholder: { type: 'string', displayName: 'Tracking Number Placeholder', description: 'e.g. "Tracking number"', group: 'quote', isLocalized: true, sortOrder: 210 },
    TrackButtonLabel: { type: 'string', displayName: 'Track Button Label', description: 'e.g. "Track"', group: 'quote', isLocalized: true, sortOrder: 220 },
    LoginPrompt: { type: 'string', displayName: 'Login Prompt', group: 'quote', isLocalized: true, sortOrder: 230 },
    LoginLink: { type: 'link', displayName: 'Login Link', group: 'quote', isLocalized: true, sortOrder: 240 },
  },
});

type Props = { content: ContentProps<typeof EnhancedAppTeaserContentType> };

export default function EnhancedAppTeaser({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const locale = contentLocale(content, DEFAULT_LOCALE);
  const isEditor = isEditorContent(content);
  const code = content.PromoCode || 'SUNNY26';

  return (
    <section className="w-full border-b border-blue-100 bg-blue-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Promo bar — hidden in markets without the Sunny Days promo */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border-2 border-dashed border-blue-200 bg-white p-6 md:flex-row md:items-center">
          <div>
            <span className="rounded bg-blue-200 px-2.5 py-1 text-xs font-extrabold uppercase text-blue-950">
              {content.PromoIntro || 'Limited time offer'}
            </span>
            <h2 {...pa('PromoTitle')} className="mt-2 text-2xl font-bold text-blue-950">
              {content.PromoTitle || 'Sunny Days Savings'}
            </h2>
            <p className="mt-1 text-sm text-blue-950/70">
              <span {...pa('PromoSavePrefix')}>{content.PromoSavePrefix || 'Save up to'}</span>{' '}
              <span {...pa('PromoDiscount')}>{content.PromoDiscount || '52%'}</span>{' '}
              <span {...pa('PromoCodeInfix')}>{content.PromoCodeInfix || 'with promo code'}</span>{' '}
              <strong {...pa('PromoCode')} className="font-bold text-blue-950">{code}</strong>.{' '}
              {content.TermsLink?.url?.default && (
                <a href={ctaHref(content.TermsLink)} className="underline">
                  {ctaLabel(content.TermsLink, '*Terms and Conditions Apply')}
                </a>
              )}
            </p>
          </div>
          <SmartCta
            label={ctaLabel(content.PromoCta, 'Start Shipping')}
            href={ctaHref(content.PromoCta)}
            requiredService="sunny_promo"
            currentLocale={locale}
            isEditor={isEditor}
            className="inline-block rounded-full bg-blue-200 px-6 py-3 text-sm font-bold text-blue-950 shadow-sm transition-colors hover:bg-blue-400"
          />
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <QuoteTrackTabs
            shippingLabel={content.ShippingTabLabel || 'Shipping'}
            trackingLabel={content.TrackingTabLabel || 'Tracking'}
            quoteButtonLabel={content.QuoteButtonLabel || 'Get a Quote'}
            trackButtonLabel={content.TrackButtonLabel || 'Track'}
            labels={{
              from: content.FromLabel || 'From Address or Postal Code',
              to: content.ToLabel || 'To Address or Postal Code',
              length: content.LengthLabel || 'Length',
              width: content.WidthLabel || 'Width',
              height: content.HeightLabel || 'Height',
              weight: content.WeightLabel || 'Weight',
              residential: content.ResidentialLabel || 'This is a residential address.',
              trackingPlaceholder: content.TrackingPlaceholder || 'Tracking number',
            }}
          />
          <p className="mt-4 text-sm text-blue-950/70">
            {content.LoginPrompt || 'Do you have a discount on your account?'}{' '}
            <a href={ctaHref(content.LoginLink) === '#' ? 'https://www.ups.com/lasso/login' : ctaHref(content.LoginLink)} className="font-bold text-blue-800 underline">
              {ctaLabel(content.LoginLink, 'Log In')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
