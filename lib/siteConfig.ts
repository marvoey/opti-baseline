/**
 * Site chrome DEFAULTS.
 *
 * The site chrome (TopNav / MainNav / Footer) is authored in the CMS on the
 * CibcSiteSettings singleton and read via lib/chrome.ts. This file is the
 * fallback: any field the CMS leaves empty falls back here, so the demo renders
 * fully before an editor touches anything. To rebrand without the CMS, edit this
 * file, drop a new public/logo.svg, and tweak the hex values in app/globals.css.
 *
 * `navigation` is a full NavigationConfig (see lib/navigation.ts) and exercises
 * every dropdown layout so the component is demonstrable offline.
 */
import type { NavItem } from './navigation';

export type ChromeLink = { label: string; href: string; openInNewTab?: boolean };
export type FooterColumn = { heading: string; links: ChromeLink[] };
/** @deprecated use ChromeLink */
export type NavLink = ChromeLink;

/** Default top-level nav items used when the CMS has no Main Navigation. */
const defaultNavItems: NavItem[] = [
  {
    id: 'nav-products',
    label: 'Products',
    url: null,
    columnLayout: 'mega',
    featuredItem: {
      id: 'feat-products',
      tag: 'NEW',
      heading: 'AI-powered insights',
      description: 'Automatically surface winning variants from your experiments.',
      imageUrl: null,
      url: '#',
      ctaLabel: 'Read the guide',
    },
    children: [
      {
        id: 'nav-analytics',
        label: 'Analytics',
        url: '#',
        icon: 'chart-bar',
        description: 'Real-time data insights',
        children: [],
      },
      {
        id: 'nav-experimentation',
        label: 'Experimentation',
        url: '#',
        icon: 'flask',
        description: 'A/B and multivariate tests',
        children: [],
      },
      {
        id: 'nav-content',
        label: 'Content',
        url: '#',
        icon: 'file',
        description: 'Author and manage pages',
        children: [],
      },
    ],
  },
  {
    id: 'nav-solutions',
    label: 'Solutions',
    url: null,
    columnLayout: 'cols2',
    children: [
      { id: 'nav-engineering', label: 'Engineering', url: '#', icon: 'code', children: [] },
      { id: 'nav-product', label: 'Product', url: '#', icon: 'chart-pie', children: [] },
      { id: 'nav-marketing', label: 'Marketing', url: '#', icon: 'zap', children: [] },
      { id: 'nav-teams', label: 'Teams', url: '#', icon: 'users', children: [] },
    ],
  },
  { id: 'nav-resources', label: 'Resources', url: '/services', children: [] },
  { id: 'nav-about', label: 'About', url: '/locations', children: [] },
];

export const siteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'Demo Site',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Demo Site',
  /** Default meta description. */
  description: 'A reference Optimizely CMS + Next.js demo site.',

  /** Header logo (place the asset in /public). */
  logoSrc: '/logo.svg',
  logoAlt: 'Demo Site',

  /** Top utility bar. */
  topNavLinks: [
    { label: 'For Business', href: '#' },
    { label: 'For Partners', href: '#' },
    { label: 'Support', href: '#' },
  ] satisfies ChromeLink[],
  phone: '1-800-000-0000',

  /** Primary header navigation (full data-driven config; see lib/navigation.ts). */
  navigation: {
    id: 'main-nav',
    label: 'Main navigation',
    locale: 'en-US',
    items: defaultNavItems,
  },
  /** Header call-to-action button. */
  primaryCta: { label: 'Get Started', href: '#' } satisfies ChromeLink,
  /** Account / login button label. */
  accountLabel: 'Sign In',

  /** Footer. */
  footerTagline:
    'A reference base for building Optimizely CMS demos on Next.js. Replace this copy in lib/siteConfig.ts.',
  footerColumns: [
    {
      heading: 'Product',
      links: [
        { label: 'Overview', href: '#' },
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Docs', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
  ] satisfies FooterColumn[],
  footerLegal: `© ${'2026'} Demo Site. All rights reserved.`,
  footerLegalLinks: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ] satisfies ChromeLink[],
} as const;

export type SiteConfig = typeof siteConfig;
