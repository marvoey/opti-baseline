import { contentType } from '@optimizely/cms-sdk';

/**
 * eHealth site settings: the one item that holds the site-wide copy that used to
 * be hard-coded in lib/siteConfig.ts, so marketers can change it without a deploy.
 *
 *   - the magenta promo banner under the header (message, link label, link URL)
 *   - the header phone number (also shown on paid landing pages)
 *   - the footer legal line
 *
 * Not rendered through the page composition, so it has no React component and is
 * deliberately NOT in cms/registry.ts: lib/siteSettings.ts reads the published item
 * straight from Optimizely Graph and falls back to lib/siteConfig.ts when the item
 * or Graph is unavailable. (This file stays .tsx only because `cms:push` scans
 * `./cms/**\/*.tsx` for content type definitions.)
 *
 * Footer link columns and legal links are still in siteConfig for now.
 */
export const EhSiteSettingsContentType = contentType({
  key: 'EhSiteSettings',
  baseType: '_component',
  displayName: '[eHealth] Site Settings',
  description:
    '[EH] Site-wide copy: promo banner, header phone number and footer legal line. Keep exactly one published item.',
  properties: {
    PromoMessage: {
      type: 'string',
      displayName: 'Promo banner message',
      description: 'Bold text in the magenta strip under the header, e.g. "Medicare Annual Enrollment is here!". Leave blank to hide the whole strip.',
      isLocalized: true,
      sortOrder: 10,
    },
    PromoLinkLabel: {
      type: 'string',
      displayName: 'Promo banner link label',
      description: 'Underlined link text after the message. Leave blank for no link.',
      isLocalized: true,
      sortOrder: 20,
    },
    PromoLinkUrl: {
      type: 'url',
      displayName: 'Promo banner link URL',
      description: 'Where the banner link goes. Use a site path such as /medicare.',
      sortOrder: 30,
    },
    PhoneNumber: {
      type: 'string',
      displayName: 'Phone number',
      description:
        'Shown in the header and on paid landing pages, e.g. (877) 378-1318. The tap-to-call link is built from the digits. The hero and Live Advise blocks have their own phone fields.',
      sortOrder: 40,
    },
    FooterLegal: {
      type: 'string',
      displayName: 'Footer legal line',
      description: 'Copyright line at the bottom of the footer, e.g. "© 2026 eHealthInsurance Services, Inc.".',
      isLocalized: true,
      sortOrder: 50,
    },
  },
});
