/**
 * Site config - the single place to rebrand the non-colour chrome for a new
 * demo. Colours live in app/globals.css (the `@theme` token block); everything
 * else - site name, logo, nav links, footer, legal copy - lives here.
 *
 * Current brand: GTA / Rockstar-style dark theme (black, white, signature
 * yellow), mirroring the "Rockstar GTA Pages Recreation" canvas prototype.
 *
 * NOTE: the header logos (public/rockstar-star.svg, public/gta-v-logo.svg) are
 * Rockstar Games trademarks used for this demo only. Swap in licensed brand
 * assets before any external use.
 */

export type NavLink = { label: string; href: string; hasMenu?: boolean; external?: boolean };

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'GTA Online',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'GTA Online | Rockstar Games',
  /** Default meta description. */
  description:
    'An ever-evolving online world for up to 30 players. Heists, businesses, races and weekly events, solo or with friends.',

  /** Header logos (place assets in /public): Rockstar star icon + title logo. */
  starSrc: '/rockstar-star.svg',
  starAlt: 'Rockstar Games',
  starHref: 'https://www.rockstargames.com',
  logoSrc: '/gta-v-logo.svg',
  logoAlt: 'Grand Theft Auto V',

  /** Yellow announcement strip above the header. */
  announcement: {
    label: 'Grand Theft Auto VI',
    highlight: 'Out Now',
    href: '#',
  },

  /** Primary header navigation (hasMenu renders a dropdown chevron). */
  mainNavLinks: [
    { label: 'Overview', href: '/' },
    { label: 'GTA Online', href: '#', hasMenu: true },
    { label: 'Story', href: '#', hasMenu: true },
    { label: 'GTA+', href: '#' },
    { label: 'Community', href: '#', hasMenu: true },
    { label: 'Support', href: '#', external: true },
  ] satisfies NavLink[],

  /** Secondary in-page navigation bar under the header. */
  subNavLinks: [
    { label: 'Overview', href: '/' },
    { label: 'GTA Online', href: '#' },
    { label: 'GTA+', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'Support', href: '#', external: true },
  ] satisfies NavLink[],

  /** Header call-to-action button. */
  primaryCta: { label: 'Buy Now', href: '#' } satisfies NavLink,
  /** Accessible labels for the icon buttons in the header. */
  searchLabel: 'Open Search',
  accountLabel: 'Open Player Menu',

  /** Newsletter band rendered above the footer. */
  newsletter: {
    heading: 'Subscribe to the email list',
    body: 'Get game announcements, update details, special events and offers delivered to your inbox.',
    cta: { label: 'Subscribe Now', href: '#' } satisfies NavLink,
  },

  /** Footer. */
  footerTopLinks: [
    { label: 'Contact', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Community Resources', href: '#' },
    { label: 'Subscribe', href: '#' },
  ] satisfies NavLink[],
  socialLinks: [
    { label: 'Instagram', href: '#', external: true },
    { label: 'X', href: '#', external: true },
    { label: 'YouTube', href: '#', external: true },
    { label: 'Facebook', href: '#', external: true },
    { label: 'TikTok', href: '#', external: true },
    { label: 'Discord', href: '#', external: true },
    { label: 'Twitch', href: '#', external: true },
  ] satisfies NavLink[],
  footerLegalLinks: [
    { label: 'Corporate', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Cookie Settings', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Legal', href: '#' },
    { label: 'Do Not Sell or Share My Personal Information', href: '#' },
  ] satisfies NavLink[],
  /** Studio sign-off block in the footer. */
  footerStudio: {
    wordmark: 'Rockstar Games',
    cities: ['New York', 'London', 'Paris', 'Bogot\u00e1'],
    established: 'MCMXCVIII',
  },
  footerLegal: `\u00a9 ${new Date().getFullYear()} Demo build for internal presentation purposes.`,
} as const;

export type SiteConfig = typeof siteConfig;
