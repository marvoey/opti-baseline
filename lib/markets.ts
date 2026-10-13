import marketsData from './markets.data.json';

/**
 * UPS market capability registry. The data lives in markets.data.json so the
 * audit script (scripts/cms-market-audit.mjs) can read the same source of truth.
 */
export type UpsService =
  | 'ups_store'
  | 'happy_returns'
  | 'roadie'
  | 'virtual_consultation'
  | 'ground_saver'
  | 'tariff_refunds'
  | 'sunny_promo'
  | 'my_choice'
  | 'pickup_options'
  | 'order_supplies';

export type MarketConfig = {
  countryCode: string;
  countryName: string;
  /** Primary CMS locale (BCP-47) for the market. */
  defaultLocale: string;
  /** All CMS locales (BCP-47) the market is published in. */
  cmsLocales: string[];
  /** UPS services offered in the market. */
  services: UpsService[];
};

export const MARKETS_38 = marketsData as Record<string, MarketConfig>;

/** Services selectable on a block, as {value, displayName} for CMS enums. */
export const UPS_SERVICE_OPTIONS: { value: UpsService; displayName: string }[] = [
  { value: 'ups_store', displayName: 'The UPS Store' },
  { value: 'happy_returns', displayName: 'Happy Returns' },
  { value: 'roadie', displayName: 'Roadie' },
  { value: 'virtual_consultation', displayName: 'Virtual Consultation' },
  { value: 'ground_saver', displayName: 'Ground Saver' },
  { value: 'tariff_refunds', displayName: 'Tariff Refunds' },
  { value: 'sunny_promo', displayName: 'Sunny Days promo' },
  { value: 'my_choice', displayName: 'UPS My Choice' },
  { value: 'pickup_options', displayName: 'Pickup Options' },
  { value: 'order_supplies', displayName: 'Order Supplies' },
];

/** Derive the country code from a BCP-47 tag ("fr-CA" -> "CA"); defaults to US. */
export function getCountryFromLocale(locale: string): string {
  const region = locale.split('-')[1];
  return region ? region.toUpperCase() : 'US';
}

/** Whether a service is offered in the market that owns `locale`. */
export function isServiceAvailable(
  service: string | null | undefined,
  locale: string,
): boolean {
  if (!service) return true;
  const market = MARKETS_38[getCountryFromLocale(locale)] ?? MARKETS_38.US;
  return market.services.includes(service as UpsService);
}
