/**
 * Site config: the single place for the non-colour chrome of this site. Colours live in
 * app/globals.css (the `@theme` token block). The primary nav comes from the CMS content tree
 * (lib/navTree.ts).
 *
 * This worktree is the dedicated setup guide site (branch setup-guide, prefix Guide): a public
 * homepage that explains the guide, plus the signed-in guide itself at /setup-guide.
 */

export type NavLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { heading: string; links: NavLink[] };

export const siteConfig = {
  /** Used for the document <title> suffix ("<page> | opti-baseline"). */
  name: 'opti-baseline',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'Setup guide | opti-baseline',
  /** Default meta description. */
  description:
    'A step-by-step guide that gets you from a brand-new laptop to a working Optimizely CMS (SaaS) demo site. For Optimizely CMS (SaaS) only. No coding experience needed.',

  /** Header logo (place the asset in /public). The SVG stays sharp at every size. */
  logoSrc: '/logo.svg',
  logoAlt: 'Optimizely',
  /** Small label next to the logo, so people know which site they are on. */
  siteLabel: 'Setup guide',

  /** Top utility bar. Empty: the bar is not shown. */
  topNavLinks: [] as NavLink[],

  /**
   * Primary header navigation is built from the CMS content tree (lib/navTree.ts):
   * the start page, then its child pages, with deeper pages in a dropdown.
   */
  /** Label for the start page (the CMS names it after the site). */
  homeNavLabel: 'Home',
  /** Links that are not CMS pages, appended after the tree. */
  mainNavExtraLinks: [{ label: 'The guide', href: '/setup-guide' }] as NavLink[],
  /** Header call-to-action button. */
  primaryCta: { label: 'Create your account', href: '/setup-guide/signup' } satisfies NavLink,
  /** Account / sign-in link. */
  accountLabel: 'Sign in',
  accountHref: '/setup-guide/login',

  /** Footer. */
  footerTagline:
    'Step-by-step setup for building Optimizely CMS (SaaS) demo sites with opti-baseline. For CMS (SaaS) only, not CMS (PaaS). No coding experience needed.',
  footerColumns: [
    {
      heading: 'The guide',
      links: [
        { label: 'Create your account', href: '/setup-guide/signup' },
        { label: 'Sign in', href: '/setup-guide/login' },
        { label: 'Open the guide', href: '/setup-guide' },
      ],
    },
    {
      heading: 'Tools you’ll install',
      links: [
        { label: 'VS Code', href: 'https://code.visualstudio.com/download', external: true },
        { label: 'Node.js', href: 'https://nodejs.org/en/download', external: true },
        { label: 'Git', href: 'https://git-scm.com/downloads', external: true },
      ],
    },
    {
      heading: 'Learn more',
      links: [
        { label: 'Optimizely CMS (SaaS) docs', href: 'https://docs.optimizely.com/content-management-system/', external: true },
        { label: 'Optimizely Graph docs', href: 'https://docs.optimizely.com/graph/', external: true },
      ],
    },
  ] as FooterColumn[],
  footerLegal: `© ${2026} Optimizely. For internal use. Built with opti-baseline on Optimizely CMS (SaaS).`,
  footerLegalLinks: [] as NavLink[],
} as const;

export type SiteConfig = typeof siteConfig;
