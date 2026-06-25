import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import {
  FooterColumnContentType,
  NavMenuItemContentType,
} from './navigation';

/**
 * CIBC: Site Settings — the site-wide chrome singleton (`_page`). Holds the
 * branding, header navigation and footer that lib/chrome.ts reads and feeds to
 * the site chrome (TopNav / MainNav / Footer). Authored in the CMS rather than
 * browsed to, but a renderer is provided so the type is fully registered and
 * still displays if navigated to directly.
 *
 * Property groups (declared in optimizely.config.mjs): Branding, Navigation,
 * Footer. `MainNav` carries the full main-nav spec via the embedded NavMenuItem
 * block tree (see cms/navigation.tsx).
 *
 * `HeaderLinks` is retained for back-compat with existing content; new sites
 * should use `MainNav`. lib/chrome.ts prefers MainNav and falls back to
 * HeaderLinks, then to lib/siteConfig defaults.
 */
export const CibcSiteSettingsContentType = contentType({
  key: 'CibcSiteSettings',
  baseType: '_page',
  displayName: 'CIBC: Site Settings',
  description: 'Site-wide chrome: branding, header navigation and footer.',
  properties: {
    // ── Branding ────────────────────────────────────────────────────────────
    SiteName: {
      type: 'string',
      displayName: 'Site Name',
      description: 'Brand name (logo alt text / footer wordmark / title fallback).',
      maxLength: 60,
      isLocalized: true,
      group: 'Branding',
      sortOrder: 10,
    },
    LogoImage: {
      type: 'contentReference',
      displayName: 'Logo',
      description: 'Header logo asset.',
      allowedTypes: ['_image'],
      isLocalized: true,
      group: 'Branding',
      sortOrder: 20,
    },
    LogoUrl: {
      type: 'url',
      displayName: 'Logo URL',
      description: 'Optional. Full logo URL — overrides the Logo asset when set.',
      isLocalized: true,
      group: 'Branding',
      sortOrder: 30,
    },
    Phone: {
      type: 'string',
      displayName: 'Phone',
      description: 'Contact number shown in the top utility bar.',
      maxLength: 40,
      isLocalized: true,
      group: 'Branding',
      sortOrder: 40,
    },
    AccountLabel: {
      type: 'string',
      displayName: 'Account Button Label',
      description: 'Label for the account / sign-in button.',
      maxLength: 24,
      isLocalized: true,
      group: 'Branding',
      sortOrder: 50,
    },
    PrimaryCta: {
      type: 'link',
      displayName: 'Primary CTA',
      description: 'Header call-to-action button (link text = button label).',
      isLocalized: true,
      group: 'Branding',
      sortOrder: 60,
    },

    // ── Navigation ───────────────────────────────────────────────────────────
    TopNavLinks: {
      type: 'array',
      displayName: 'Top Utility Links',
      description: 'Small links in the top utility bar.',
      isLocalized: true,
      group: 'Navigation',
      sortOrder: 70,
      items: { type: 'link' },
    },
    MainNav: {
      type: 'array',
      displayName: 'Main Navigation',
      description: 'Ordered top-level nav items. Add children to a item for a dropdown.',
      group: 'Navigation',
      sortOrder: 80,
      items: { type: 'component', contentType: NavMenuItemContentType },
    },
    HeaderLinks: {
      type: 'array',
      format: 'LinkCollection',
      displayName: 'Header Links (legacy)',
      description: 'Deprecated flat link list. Use Main Navigation instead; kept for back-compat.',
      isLocalized: true,
      group: 'Navigation',
      sortOrder: 90,
      items: { type: 'link' },
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    FooterTagline: {
      type: 'string',
      displayName: 'Footer Tagline',
      description: 'Short blurb under the footer wordmark.',
      maxLength: 240,
      isLocalized: true,
      group: 'Footer',
      sortOrder: 100,
    },
    FooterColumns: {
      type: 'array',
      displayName: 'Footer Columns',
      description: 'Link columns in the footer.',
      group: 'Footer',
      sortOrder: 110,
      items: { type: 'component', contentType: FooterColumnContentType },
    },
    FooterLegal: {
      type: 'string',
      displayName: 'Footer Legal',
      description: 'Copyright / legal line.',
      maxLength: 240,
      isLocalized: true,
      group: 'Footer',
      sortOrder: 120,
    },
    FooterLegalLinks: {
      type: 'array',
      displayName: 'Footer Legal Links',
      description: 'Small print links (Privacy, Terms, …).',
      isLocalized: true,
      group: 'Footer',
      sortOrder: 130,
      items: { type: 'link' },
    },
  },
});

type Props = { content: ContentProps<typeof CibcSiteSettingsContentType> };

export default function CibcSiteSettings({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const mainNav = content.MainNav ?? [];
  const footerColumns = content.FooterColumns ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 {...pa('SiteName')} className="text-2xl font-semibold tracking-tight text-slate-900">
        {content.SiteName || 'Site Settings'}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Site-wide chrome configuration. Edit branding, navigation and footer here; the live site
        reads the published version.
      </p>

      <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Main Navigation
      </h2>
      {mainNav.length > 0 ? (
        <ul
          {...pa('MainNav')}
          className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200"
        >
          {mainNav.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span className="font-medium text-slate-900">{item.Label || '(untitled)'}</span>
              <span className="text-xs text-slate-400">
                {item.Children?.length
                  ? `${item.Children.length} child link${item.Children.length === 1 ? '' : 's'} · ${item.ColumnLayout || 'single'}`
                  : item.Link?.url?.default || '—'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p {...pa('MainNav')} className="text-sm italic text-slate-400">
          No navigation configured — the site falls back to lib/siteConfig defaults.
        </p>
      )}

      <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Footer
      </h2>
      <p {...pa('FooterColumns')} className="text-sm text-slate-600">
        {footerColumns.length > 0
          ? `${footerColumns.length} column${footerColumns.length === 1 ? '' : 's'}`
          : 'No footer columns configured.'}
      </p>
    </main>
  );
}
