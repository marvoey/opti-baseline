import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

/**
 * eHealth site settings: the one item that holds the site-wide copy that used to
 * be hard-coded in lib/siteConfig.ts, so marketers can change it without a deploy.
 *
 *   - the magenta promo banner under the header (message, link label, link URL)
 *   - the header phone number (also shown on paid landing pages)
 *   - the footer legal line
 *
 * The site header, banner and footer do NOT use the component below: they read the
 * published item through lib/siteSettings.ts (straight from Optimizely Graph, with
 * a fallback to lib/siteConfig.ts). The component only gives the item a plain
 * read-out of its values, so it renders when an editor previews it in the CMS. It is
 * not composition-enabled, so it cannot be dropped onto a page. (This file stays
 * .tsx because `cms:push` scans `./cms/**\/*.tsx` for content type definitions.)
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

type Props = { content: ContentProps<typeof EhSiteSettingsContentType> };

type Field = 'PromoMessage' | 'PromoLinkLabel' | 'PromoLinkUrl' | 'PhoneNumber' | 'FooterLegal';

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() || null : null);

/** A `url` property arrives as a string or as `{ default }`; null when empty. */
function urlText(value: unknown): string | null {
  if (typeof value === 'string') return clean(value);
  return clean((value as { default?: string | null } | null | undefined)?.default);
}

/** Plain read-out of the site settings: one labelled row per property. */
export default function EhSiteSettings({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const rows: { prop: Field; label: string; value: string | null }[] = [
    { prop: 'PromoMessage', label: 'Promo banner message', value: clean(content.PromoMessage) },
    { prop: 'PromoLinkLabel', label: 'Promo banner link label', value: clean(content.PromoLinkLabel) },
    { prop: 'PromoLinkUrl', label: 'Promo banner link URL', value: urlText(content.PromoLinkUrl) },
    { prop: 'PhoneNumber', label: 'Phone number', value: clean(content.PhoneNumber) },
    { prop: 'FooterLegal', label: 'Footer legal line', value: clean(content.FooterLegal) },
  ];

  return (
    <section {...pa(block)} className="mx-auto w-full max-w-3xl px-6 py-8">
      <h2 className="font-display text-xl font-bold text-blue-950">Site settings</h2>
      <dl className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {rows.map((row) => (
          <div key={row.prop} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-gray-600">{row.label}</dt>
            <dd {...pa(row.prop)} className="text-sm text-foreground">
              {row.value ?? <span className="text-gray-400">Not set</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
