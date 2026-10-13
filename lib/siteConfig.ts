/**
 * Site config — the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else — site name, logo, nav links, footer columns, legal copy — lives here.
 *
 * To stand up a new demo: edit this file, drop a new public/logo.svg, and tweak
 * the hex values in app/globals.css. No component edits required.
 */

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'UPS',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'UPS - United States | Moving our world forward by delivering what matters',
  /** Default meta description. */
  description:
    'Ship, track and manage deliveries with UPS. Explore shipping, tracking and logistics solutions for individuals and businesses.',

  /** Header logo (place the asset in /public). */
  logoSrc: 'https://www.ups.com/webassets/icons/logo.svg',
  logoAlt: 'UPS',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'Support', href: 'https://www.ups.com/us/en/support/contact-us' },
  ] satisfies NavLink[],

  /** Primary header navigation. */
  mainNavLinks: [
    { label: 'Shipping', href: 'https://www.ups.com/ship?loc=en_US' },
    { label: 'Tracking', href: 'https://www.ups.com/track?loc=en_US' },
    { label: 'Products & Services', href: 'https://www.ups.com/us/en/customized-shipping-logistic-services' },
    { label: 'The UPS Store', href: 'https://www.ups.com/us/en/the-ups-store' },
  ] satisfies NavLink[],
  /** Header call-to-action button. */
  primaryCta: {
    label: 'Sign Up',
    href: 'https://wwwapps.ups.com/doapp/SignUp?loc=en_US',
  } satisfies NavLink,
  /** Account / login button. */
  accountLabel: 'Log In',
  accountHref: 'https://www.ups.com/lasso/login?loc=en_US',

  /** Footer. */
  footerTagline: 'Moving our world forward by delivering what matters.',
  footerColumns: [
    {
      heading: 'Support',
      links: [
        { label: 'Help and Support Center', href: 'https://www.ups.com/us/en/support/contact-us' },
        { label: 'Tracking Support', href: 'https://www.ups.com/us/en/support/tracking-support' },
        { label: 'Where’s My Package', href: 'https://www.ups.com/us/en/support/tracking-support/where-is-my-package' },
        { label: 'Shipping Guides and Resources', href: 'https://www.ups.com/us/en/support/shipping-support' },
        { label: 'International Shipping Guides', href: 'https://www.ups.com/us/en/shipping/international-shipping' },
        { label: 'Communication Preferences', href: 'https://www.ups.com/marketingpreferences?loc=en_US' },
      ],
    },
    {
      heading: 'UPS Sites',
      links: [
        { label: 'About UPS', href: 'https://about.ups.com/us/en/home.html' },
        { label: 'UPS Jobs', href: 'https://www.jobs-ups.com/' },
        { label: 'UPS Healthcare', href: 'https://www.ups.com/us/en/ups-healthcare' },
        { label: 'UPS Supply Chain Solutions', href: 'https://www.ups.com/us/en/ups-supplychain' },
        { label: 'The UPS Store', href: 'https://www.theupsstore.com/' },
        { label: 'UPS Developer Portal', href: 'https://developer.ups.com/' },
      ],
    },
    {
      heading: 'UPS Companies',
      links: [
        { label: 'Happy Returns', href: 'https://www.ups.com/us/en/ups-happyreturns' },
        { label: 'Roadie', href: 'https://www.ups.com/us/en/ups-roadie' },
        { label: 'UPS Secure Commerce', href: 'https://www.ups.com/us/en/ups-securecommerce' },
        { label: 'Delivery Solutions', href: 'https://deliverysolutions.co/' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `Copyright ©1994-${new Date().getFullYear()} United Parcel Service of America, Inc. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Terms and Conditions', href: 'https://www.ups.com/us/en/support/shipping-support/legal-terms-conditions' },
    { label: 'Privacy Notice', href: 'https://www.ups.com/us/en/support/shipping-support/legal-terms-conditions/privacy-notice' },
    { label: 'Cookie Settings', href: '#cookie-settings' },
  ] satisfies NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
