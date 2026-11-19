import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { urlHrefOr } from './shared';
import CmsImage from '@/app/_components/CmsImage';

/**
 * eHealth carrier strip: a row of carrier logos with an optional
 * "View all carriers" link underneath (the white band under the hero).
 *
 * Editors can add logo images; until they do, the carrier names render as
 * text wordmarks so the strip is never empty.
 */
export const EhCarrierLogosContentType = contentType({
  key: 'EhCarrierLogos',
  baseType: '_component',
  displayName: '[eHealth] Carrier Logos',
  description: '[EH] Row of insurance carrier logos (or text names) with an optional "View all carriers" link.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'Optional small line above the logos. Leave blank to hide.',
      isLocalized: true,
      sortOrder: 10,
    },
    Logos: {
      type: 'array',
      displayName: 'Logos',
      description: 'Carrier logo images, shown in this order. When empty, the carrier names below are shown instead.',
      sortOrder: 20,
      items: { type: 'contentReference', allowedTypes: ['_image'] },
    },
    CarrierNames: {
      type: 'array',
      displayName: 'Carrier names (text fallback)',
      description: 'One carrier per line. Used for the alt text of logos, in order, and as text wordmarks when no logos are set.',
      isLocalized: true,
      sortOrder: 21,
      items: { type: 'string' },
    },
    LinkLabel: {
      type: 'string',
      displayName: 'Link label',
      description: 'e.g. "View all (50+) carriers". Leave blank to hide the link.',
      isLocalized: true,
      sortOrder: 30,
    },
    LinkUrl: {
      type: 'url',
      displayName: 'Link URL',
      description: 'Where the link goes.',
      sortOrder: 31,
    },
  },
});

type Props = { content: ContentProps<typeof EhCarrierLogosContentType> };

type ImageRef = { url?: { default?: string | null } | null } | null | undefined;

export default function EhCarrierLogos({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const names = ((content.CarrierNames ?? []) as Array<string | null>).map((n) => n?.trim() ?? '').filter(Boolean);
  const logos = ((content.Logos ?? []) as ImageRef[])
    .map((l, i) => ({ src: l?.url?.default ?? null, alt: names[i] ?? '' }))
    .filter((l): l is { src: string; alt: string } => !!l.src);
  const href = urlHrefOr(content.LinkUrl);

  return (
    <div {...pa(block)} className="w-full px-6 py-8 md:py-10">
      <div className="mx-auto max-w-5xl text-center">
        {content.Heading && (
          <p {...pa('Heading')} className="mb-4 text-sm font-medium text-foreground">
            {content.Heading}
          </p>
        )}

        <ul
          {...pa(logos.length > 0 ? 'Logos' : 'CarrierNames')}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
        >
          {logos.length > 0
            ? logos.map((l, i) => (
                <li key={i}>
                  <CmsImage
                    src={l.src}
                    alt={l.alt}
                    width={144}
                    height={36}
                    sizes="144px"
                    className="h-9 w-auto max-w-[9rem] object-contain"
                  />
                </li>
              ))
            : names.map((n) => (
                <li key={n} className="font-display text-lg font-bold tracking-tight text-blue-800 sm:text-xl">
                  {n}
                </li>
              ))}
        </ul>

        {content.LinkLabel && (
          <p className="mt-5">
            <a
              {...pa('LinkLabel')}
              href={href}
              className="text-sm font-semibold text-blue-800 underline underline-offset-2 hover:text-blue-950"
            >
              {content.LinkLabel}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
