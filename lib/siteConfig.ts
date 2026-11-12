/**
 * Site config — the single place to rebrand the non-colour chrome. Colours live
 * in app/globals.css (the `@theme` block); everything else — site name, logos,
 * promo bar, mega-menu navigation, footer columns, legal copy — lives here.
 *
 * The header/footer structure mirrors the CorelDRAW base-site recreation in
 * app/demo/mock/page.tsx. All hrefs are static, developer-authored values:
 * absolute http(s) URLs open in a new tab (see ChromeLink), anything else is an
 * in-app route.
 */

export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };
export type MegaMenu = {
  columns: { groups: NavGroup[] }[];
  /** Optional highlighted tile + quick links shown to the right of the columns. */
  feature?: { title: string; href: string; links: NavLink[] };
};
/** A header item is either a plain link or a mega-menu trigger. */
export type NavItem = { label: string; href: string } | { label: string; menu: MegaMenu };
export type FooterColumn = { heading: string; links: NavLink[] };
export type SocialLink = { label: string; href: string; glyph: string };
export type PromoBarConfig = { text: string; highlight: string; cta: string; href: string };

export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  logoSrc: string;
  footerLogoSrc: string;
  logoAlt: string;
  /** Dismissible announcement strip above the header. Omit to hide it. */
  promoBar?: PromoBarConfig;
  mainNav: NavItem[];
  signInLabel: string;
  signInLinks: NavLink[];
  primaryCta: NavLink;
  footerColumns: FooterColumn[];
  social: SocialLink[];
  footerLegal: string;
};

const CD = 'https://www.coreldraw.com';
/** Absolute coreldraw.com URL for a site-relative path. */
const cd = (path: string) => `${CD}${path}`;
const link = (label: string, href: string): NavLink => ({ label, href });

export const siteConfig: SiteConfig = {
  /** Used for the document <title> fallback and the logo alt text. */
  name: 'CorelDRAW',
  /** Default browser-tab title (per-page titles override via CMS MetaTitle). */
  title: 'CorelDRAW Graphics Suite | Professional graphic design software',
  /** Default meta description. */
  description:
    'Powerful tools for vector illustration, layout, photo editing, and typography.',

  /** Header logo — colour wordmark for the white header (assets live in /public). */
  logoSrc: '/coreldraw-wordmark-color.png',
  /** Footer logo — white wordmark for the dark footer. */
  footerLogoSrc: '/coreldraw-wordmark-white.png',
  logoAlt: 'CorelDRAW',

  promoBar: {
    text: 'Black Friday starts early -',
    highlight: 'up to 30% off',
    cta: 'See offers',
    href: cd('/en/special-offers/'),
  },

  /** Primary header navigation. */
  mainNav: [
    {
      label: 'Products',
      menu: {
        columns: [
          {
            groups: [
              {
                title: 'For individuals',
                links: [
                  link('CorelDRAW Graphics Suite', cd('/en/product/coreldraw/')),
                  link('CorelDRAW Standard', cd('/en/product/coreldraw/standard/')),
                  link('CorelDRAW Essentials', cd('/en/product/coreldraw/essentials/')),
                  link('CorelDRAW Go', cd('/en/product/go/')),
                ],
              },
              {
                title: 'Other products',
                links: [
                  link('AI credit packs', cd('/en/product/credit-packs/')),
                  link('CorelDRAW VectorPass', 'https://vectorpass.coreldraw.com/'),
                ],
              },
            ],
          },
          {
            groups: [
              {
                title: 'For business',
                links: [
                  link('CorelDRAW Graphics Suite – Business', cd('/en/licensing/business/')),
                  link('CorelDRAW Technical Suite', cd('/en/product/technical-suite/')),
                ],
              },
              {
                title: 'For education',
                links: [
                  link('CorelDRAW Graphics Suite – Education', cd('/en/licensing/education/')),
                  link('CorelDRAW Technical Suite – Education', cd('/en/product/technical-suite-education/')),
                  link('View all products', cd('/en/all-products/')),
                ],
              },
            ],
          },
        ],
        feature: {
          title: 'Try CorelDRAW for free',
          href: cd('/en/free-trials/'),
          links: [
            link('Compare CorelDRAW', cd('/en/product/family/')),
            link('Partner Program', 'https://www.corel.com/en/partner-program/'),
            link('Get a quote', cd('/en/licensing/talk-to-a-specialist/')),
          ],
        },
      },
    },
    { label: 'Special offers', href: cd('/en/special-offers/') },
    { label: 'Free trials', href: cd('/en/free-trials/') },
    {
      label: 'Resources',
      menu: {
        columns: [
          {
            groups: [
              {
                title: 'Resources',
                links: [
                  link('Learning center', cd('/en/learn/')),
                  link('Events', cd('/en/events/')),
                  link('Webinars and e-books', cd('/en/learn/webinars/')),
                  link('Blog', cd('/en/blog/')),
                  link('CorelDRAW Community', 'https://community.coreldraw.com/'),
                  link('CorelDRAW Go Community', 'https://community.go.corel.com/'),
                  link('Submit product feedback', 'https://coreldraw.ideas.aha.io/'),
                ],
              },
            ],
          },
          {
            groups: [
              {
                title: 'Guides',
                links: [
                  link('Guide to vector design', cd('/en/learn/guide-to-vector-design/')),
                  link('Guide to AI design', cd('/en/learn/guide-to-ai-design/')),
                  link('How-to guides', cd('/en/learn/how-to/')),
                  link('Tutorials', cd('/en/learn/tutorials/')),
                ],
              },
            ],
          },
          {
            groups: [
              {
                title: 'Customer stories',
                links: [
                  link('Creating specialized sign-making tools', cd('/en/pages/customer-stories/yellotools/')),
                  link('Designing custom vinyl graphics', cd('/en/pages/customer-stories/rage-designs/')),
                  link('Illustrating for technical documentation', cd('/en/pages/customer-stories/hauni/')),
                  link('Designing metal cut signs', cd('/en/pages/customer-stories/joe-diaz-barn-quilts/')),
                  link('View all customer stories →', cd('/en/pages/customer-stories/')),
                ],
              },
            ],
          },
        ],
      },
    },
    { label: 'Support', href: cd('/en/support/') },
  ],

  /** Sign-in dropdown (desktop) and button (mobile). */
  signInLabel: 'Sign in',
  signInLinks: [
    link('My account', 'https://myaccount.corel.com'),
    link('CorelDRAW Web', 'https://web.coreldraw.com/'),
    link('CorelDRAW Go', 'https://go.coreldraw.com/'),
  ],
  /** Header call-to-action button. */
  primaryCta: link('Launch CorelDRAW Web', 'https://web.coreldraw.com/'),

  /** Footer. */
  footerColumns: [
    {
      heading: 'Products',
      links: [
        link('CorelDRAW Graphics Suite', cd('/en/product/coreldraw/')),
        link('CorelDRAW Standard', cd('/en/product/coreldraw/standard/')),
        link('CorelDRAW Essentials', cd('/en/product/coreldraw/essentials/')),
        link('CorelDRAW Go', cd('/en/product/go/')),
        link('CorelDRAW Technical Suite', cd('/en/product/technical-suite/')),
        link('AI credit packs', cd('/en/product/credit-packs/')),
        link('CorelDRAW VectorPass', 'https://vectorpass.coreldraw.com/'),
        link('Special offers', cd('/en/special-offers/')),
        link('All products', cd('/en/all-products/')),
      ],
    },
    {
      heading: 'Quick links',
      links: [
        link('Business', cd('/en/licensing/business/')),
        link('Free trials', cd('/en/free-trials/')),
        link('Blog', cd('/en/blog/')),
        link('Learning', cd('/en/learn/')),
        link('Guide to vector design', cd('/en/learn/guide-to-vector-design/')),
        link('Beta programs', 'https://www.corel.com/beta/'),
        link('News', 'https://www.corel.com/en/newsroom/'),
        link('Sitemap', cd('/en/sitemap/')),
      ],
    },
    {
      heading: 'Support',
      links: [
        link('Register your product', 'https://account.corel.com/accounts/user/registerProduct'),
        link('Patches & updates', cd('/en/support/updates/')),
        link('Returns & refunds', 'https://www.corel.com/en/support/orders/'),
        link('Knowledgebase', 'https://support.corel.com/hc/en-us/sections/360003017033-CorelDRAW'),
        link('Uninstall instructions', 'https://support.corel.com/hc/en-us/articles/215822078'),
        link('Contact', 'https://www.corel.com/contact/'),
        link('CorelDRAW Community', 'https://community.coreldraw.com/'),
        link('Leadership', 'https://www.corel.com/leadership/'),
        link('Careers', 'https://www.corel.com/careers/'),
      ],
    },
    {
      heading: 'Legal',
      links: [
        link('Terms of use', 'https://www.corel.com/terms/'),
        link('Privacy', 'https://www.corel.com/privacy/'),
        link('Cookies', 'https://www.corel.com/cookies/'),
        link('EULA', 'https://www.corel.com/eula/'),
        link('Legal', 'https://www.corel.com/legal/'),
        link('Do not sell/share my information', 'https://www.corel.com/privacy/form/'),
        link('Imprint', 'https://www.corel.com/en/imprint/'),
      ],
    },
  ],
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/coreldrawgraphicssuite', glyph: 'f' },
    { label: 'X', href: 'https://x.com/coreldraw', glyph: '𝕏' },
    { label: 'YouTube', href: 'https://www.youtube.com/user/CorelDRAWchannel', glyph: '▶' },
    { label: 'Instagram', href: 'https://www.instagram.com/coreldrawgraphicssuite/', glyph: '◎' },
    { label: 'Community', href: 'https://community.coreldraw.com/', glyph: '✦' },
  ],
  footerLegal: 'Copyright © 2026 Corel Corporation. All rights reserved.',
};
