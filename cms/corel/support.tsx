import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import ChromeLink from '@/app/_components/ChromeLink';
import CorelImg from '@/app/_components/corel/CorelImg';
import { ContactPanel } from '@/app/_components/corel/client';
import { Icon, SectionHeading, toIconName } from '@/app/_components/corel/ui';
import { CorelContactCardContentType, CorelIconCardContentType, CorelPhoneEntryContentType } from './items';
import { anchorProp, choice, groupConsecutive, imageAlt, imageSrc, resolveLink, resolveLinks } from './shared';

/* ===================================================================
   Corel: Icon link cards — learning / support tiles, or "Get inspired"
   =================================================================== */
export const CorelIconLinkCardsContentType = contentType({
  key: 'CorelIconLinkCards',
  baseType: '_component',
  displayName: 'Corel: Icon link cards',
  description: 'Row of linked tiles (learning center, support), optionally overlapping the banner above; or a "Get inspired" grid.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Variant: choice(
      'Style',
      [
        ['cards', 'Tiles'],
        ['inspire', 'Get inspired (heading + grey band)'],
      ],
      5,
      'Default: Tiles.',
    ),
    Title: { type: 'string', displayName: 'Heading', description: 'Shown in the "Get inspired" style.', isLocalized: true, sortOrder: 10 },
    Columns: choice(
      'Columns (tiles)',
      [
        ['4', 'Four'],
        ['5', 'Five'],
      ],
      15,
      'Default: Four.',
    ),
    Overlap: { type: 'boolean', displayName: 'Overlap the banner above', description: 'Pulls the tiles up over the banner (tiles style).', sortOrder: 20 },
    Items: {
      type: 'array',
      displayName: 'Cards',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 12,
      items: { type: 'component', contentType: CorelIconCardContentType },
    },
  },
});

export function CorelIconLinkCards({ content }: { content: ContentProps<typeof CorelIconLinkCardsContentType> }) {
  const { pa } = getPreviewUtils(content);
  const items = content.Items ?? [];

  if (content.Variant === 'inspire') {
    return (
      <section id={content.AnchorId ?? undefined} className="bg-gray-50 py-20">
        <div className="site-container">
          <SectionHeading title={content.Title} />
          <div {...pa('Items')} className="grid gap-6 md:grid-cols-3">
            {items.map((it, k) => {
              const link = resolveLink(it.Link ?? undefined);
              return (
                <div key={k} className="flex gap-4 rounded-2xl bg-white p-6">
                  <CorelImg src={imageSrc(it.Image, it.ImageUrl)} alt={imageAlt(it.Image, it.Title ?? '')} seed={k} className="h-12 w-12 shrink-0 rounded" />
                  <div>
                    <h4 className="text-lg font-bold">{it.Title}</h4>
                    <p className="my-2 text-sm text-gray-600">{it.Description}</p>
                    {link && <ChromeLink href={link.href} className="text-sm font-semibold text-brand hover:underline">{link.label} →</ChromeLink>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  const overlap = Boolean(content.Overlap);
  return (
    <section id={content.AnchorId ?? undefined} className={overlap ? 'relative z-10 -mt-12' : 'py-16'}>
      <div className="site-container">
        <div {...pa('Items')} className={`grid gap-5 sm:grid-cols-2 ${content.Columns === '5' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          {items.map((it, k) => {
            const link = resolveLink(it.Link ?? undefined);
            const cls = 'group rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition hover:-translate-y-1';
            const src = imageSrc(it.Image, it.ImageUrl);
            const inner = (
              <>
                {src ? (
                  <CorelImg src={src} alt={imageAlt(it.Image, it.Title ?? '')} seed={k} className="mb-4 h-12 w-12 rounded" />
                ) : (
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-brand">
                    <Icon name={toIconName(it.Icon)} className="h-6 w-6" />
                  </span>
                )}
                <h3 className="text-lg font-bold group-hover:text-brand">{it.Title}</h3>
                <p className="mt-1 text-sm text-gray-600">{it.Description}</p>
              </>
            );
            return link ? <ChromeLink key={k} href={link.href} className={cls}>{inner}</ChromeLink> : <div key={k} className={cls}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Announcements
   =================================================================== */
export const CorelAnnouncementsContentType = contentType({
  key: 'CorelAnnouncements',
  baseType: '_component',
  displayName: 'Corel: Announcements',
  description: 'Highlighted panel with a short list of announcement links.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', description: 'Default: Announcements.', isLocalized: true, sortOrder: 10 },
    Links: {
      type: 'array',
      displayName: 'Links',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 10,
      items: { type: 'link' },
    },
  },
});

export function CorelAnnouncements({ content }: { content: ContentProps<typeof CorelAnnouncementsContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? undefined} className="py-12">
      <div className="site-container">
        <div className="rounded-2xl border-l-4 border-brand bg-emerald-50 p-6">
          <h3 className="mb-3 text-lg font-bold">{content.Title || 'Announcements'}</h3>
          <ul {...pa('Links')} className="space-y-2">
            {resolveLinks(content.Links).map((l) => (
              <li key={l.href + l.label}>
                <ChromeLink href={l.href} className="text-gray-800 hover:text-brand hover:underline">{l.label}</ChromeLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Contact options — support channels + international phone numbers
   =================================================================== */
export const CorelContactOptionsContentType = contentType({
  key: 'CorelContactOptions',
  baseType: '_component',
  displayName: 'Corel: Contact options',
  description: 'Support channels (communities, ticket, chat, phone) with an expandable international phone directory.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Cards: {
      type: 'array',
      displayName: 'Contact cards',
      isLocalized: true,
      sortOrder: 10,
      maxItems: 8,
      items: { type: 'component', contentType: CorelContactCardContentType },
    },
    DirectoryLabel: { type: 'string', displayName: 'Directory toggle label', description: 'Default: International numbers.', isLocalized: true, sortOrder: 20 },
    Directory: {
      type: 'array',
      displayName: 'Phone directory',
      isLocalized: true,
      sortOrder: 30,
      maxItems: 60,
      items: { type: 'component', contentType: CorelPhoneEntryContentType },
    },
  },
});

export function CorelContactOptions({ content }: { content: ContentProps<typeof CorelContactOptionsContentType> }) {
  const { pa } = getPreviewUtils(content);
  const regions = groupConsecutive(content.Directory ?? [], (e) => e.Region).map((g) => ({
    region: g.group,
    entries: g.items.map((e) => ({ country: e.Country ?? '', number: e.PhoneNumber ?? '' })),
  }));
  return (
    <section id={content.AnchorId ?? undefined} className="bg-gray-50 py-16">
      <div {...pa('Cards')} className="site-container">
        <ContactPanel
          directoryLabel={content.DirectoryLabel || 'International numbers'}
          regions={regions}
          cards={(content.Cards ?? []).map((c) => ({
            icon: c.Icon ?? '',
            title: c.Title ?? '',
            description: c.Description ?? '',
            links: resolveLinks([c.PrimaryLink ?? undefined, c.SecondaryLink ?? undefined]),
            phone: c.PhoneNumber ?? '',
            showDirectory: Boolean(c.ShowDirectory),
          }))}
        />
      </div>
    </section>
  );
}
