import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import ChromeLink from '@/app/_components/ChromeLink';
import CorelImg from '@/app/_components/corel/CorelImg';
import { Button, Icon, SectionHeading } from '@/app/_components/corel/ui';
import {
  CorelComparisonRowContentType,
  CorelOfferContentType,
  CorelTierContentType,
} from './items';
import { anchorProp, imageAlt, imageSrc, resolveLink, strings } from './shared';

/* ===================================================================
   Corel: Tier cards — "Graphic design options for all skill levels"
   =================================================================== */
export const CorelTierCardsContentType = contentType({
  key: 'CorelTierCards',
  baseType: '_component',
  displayName: 'Corel: Product tier cards',
  description: 'Heading and a row of product cards (level, name, features, included apps), with an optional button.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Tiers: {
      type: 'array',
      displayName: 'Product tiers',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 6,
      items: { type: 'component', contentType: CorelTierContentType },
    },
    Cta: { type: 'link', displayName: 'Button under the cards', isLocalized: true, sortOrder: 30 },
  },
});

export function CorelTierCards({ content }: { content: ContentProps<typeof CorelTierCardsContentType> }) {
  const { pa } = getPreviewUtils(content);
  const tiers = content.Tiers ?? [];
  const cta = resolveLink(content.Cta ?? undefined);
  return (
    <section id={content.AnchorId ?? undefined} className="bg-white py-20">
      <div className="site-container">
        <SectionHeading title={content.Title} />
        <div {...pa('Tiers')} className="grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => {
            const link = resolveLink(t.Link ?? undefined);
            const cls = `group relative flex flex-col rounded-3xl border-2 p-8 transition hover:shadow-xl ${
              t.Popular ? 'border-brand shadow-lg' : 'border-gray-200'
            }`;
            const inner = (
              <>
                {t.Popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold text-white uppercase">
                    Most popular
                  </span>
                )}
                {t.SaveLabel && (
                  <span className="mb-5 self-start rounded-md bg-rose-600 px-3 py-1 text-xs font-bold text-white">{t.SaveLabel}</span>
                )}
                <span className="text-xs font-bold tracking-widest text-gray-500">{t.Level}</span>
                <h3 className="mt-1 mb-6 text-2xl font-bold group-hover:text-brand">{t.Name}</h3>
                <ul className="mb-6 space-y-3">
                  {strings(t.Features).map((f) => (
                    <li key={f} className="flex items-start gap-3 text-gray-700">
                      <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> {f}
                    </li>
                  ))}
                </ul>
                {strings(t.Apps).length > 0 && (
                  <>
                    <p className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Apps included</p>
                    <ul className="mb-8 flex-1 space-y-1 text-sm text-gray-700">
                      {strings(t.Apps).map((a) => (
                        <li key={a}>• {a}</li>
                      ))}
                    </ul>
                  </>
                )}
                {link && (
                  <span className="flex items-center gap-1 font-semibold text-brand">
                    {link.label} <Icon name="right" className="h-4 w-4" />
                  </span>
                )}
              </>
            );
            return link ? (
              <ChromeLink key={i} href={link.href} className={cls}>{inner}</ChromeLink>
            ) : (
              <div key={i} className={cls}>{inner}</div>
            );
          })}
        </div>
        {cta && <div className="mt-10 text-center"><Button href={cta.href} variant="outline">{cta.label}</Button></div>}
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Offer cards — special offers
   =================================================================== */
export const CorelOfferCardsContentType = contentType({
  key: 'CorelOfferCards',
  baseType: '_component',
  displayName: 'Corel: Offer cards',
  description: 'Heading and a grid of special-offer cards with product art, savings and price.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Offers: {
      type: 'array',
      displayName: 'Offers',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 8,
      items: { type: 'component', contentType: CorelOfferContentType },
    },
  },
});

export function CorelOfferCards({ content }: { content: ContentProps<typeof CorelOfferCardsContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section id={content.AnchorId ?? undefined} className="py-20">
      <div className="site-container">
        <SectionHeading title={content.Title} />
        <div {...pa('Offers')} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(content.Offers ?? []).map((o, i) => {
            const link = resolveLink(o.Link ?? undefined);
            const cls = `relative flex flex-col rounded-3xl border-2 p-6 transition hover:shadow-xl ${
              o.Popular ? 'border-brand' : 'border-gray-200'
            }`;
            const inner = (
              <>
                {o.Popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white uppercase">Most Popular</span>
                )}
                <div className="mb-4 flex items-start justify-between">
                  <CorelImg
                    src={imageSrc(o.Image, o.ImageUrl)}
                    alt={imageAlt(o.Image, o.Name ?? '')}
                    seed={i}
                    className="h-20 w-20 rounded-xl object-contain"
                  />
                  {o.SaveLabel && <span className="rounded bg-rose-600 px-2 py-1 text-xs font-bold text-white">{o.SaveLabel}</span>}
                </div>
                <h4 className="text-lg font-bold">{o.Name}</h4>
                <p className="mt-1 flex-1 text-sm text-gray-600">{o.Description}</p>
                {o.PromoText && <p className="mt-3 text-sm font-semibold text-rose-700">{o.PromoText}</p>}
                <div className="mt-5">
                  {o.WasPrice && <span className="text-sm text-gray-400 line-through">{o.WasPrice}</span>}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">{o.Price}</span>
                    {o.Unit && <span className="text-gray-500">{o.Unit}</span>}
                  </div>
                </div>
                {link && (
                  <span className="mt-5 inline-flex justify-center rounded-full bg-brand py-2.5 font-semibold text-white">{link.label}</span>
                )}
              </>
            );
            return link ? (
              <ChromeLink key={i} href={link.href} className={cls}>{inner}</ChromeLink>
            ) : (
              <div key={i} className={cls}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Corel: Comparison table — subscription vs one-time purchase
   =================================================================== */
export const CorelComparisonTableContentType = contentType({
  key: 'CorelComparisonTable',
  baseType: '_component',
  displayName: 'Corel: Comparison table',
  description: 'Two-column feature comparison grouped under headings.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...anchorProp(1),
    Title: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Subtitle: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 20 },
    CornerLabel: { type: 'string', displayName: 'Table caption', description: 'Top-left cell, e.g. "Version Comparison Matrix".', isLocalized: true, sortOrder: 30 },
    Column1Label: { type: 'string', displayName: 'Column 1', isLocalized: true, sortOrder: 40 },
    Column2Label: { type: 'string', displayName: 'Column 2', isLocalized: true, sortOrder: 50 },
    Rows: {
      type: 'array',
      displayName: 'Rows',
      isLocalized: true,
      sortOrder: 60,
      items: { type: 'component', contentType: CorelComparisonRowContentType },
    },
    Cta: { type: 'link', displayName: 'Button under the table', isLocalized: true, sortOrder: 70 },
  },
});

function Cell({ type, text }: { type?: string | null; text?: string | null }) {
  if (type === 'yes') return <Icon name="check" className="mx-auto h-6 w-6 text-brand" />;
  if (type === 'text') return <span className="text-sm text-gray-700">{text}</span>;
  return <span className="text-gray-300">—</span>;
}

export function CorelComparisonTable({ content }: { content: ContentProps<typeof CorelComparisonTableContentType> }) {
  const { pa } = getPreviewUtils(content);
  const rows = content.Rows ?? [];
  const cta = resolveLink(content.Cta ?? undefined);
  return (
    <section id={content.AnchorId ?? 'compare'} className="bg-gray-50 py-20">
      <div className="site-container">
        <SectionHeading title={content.Title} sub={content.Subtitle} />
        <div {...pa('Rows')} className="overflow-x-auto rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-1/2 p-5"><span className="text-sm text-gray-500">{content.CornerLabel}</span></th>
                <th className="p-5 text-center text-lg font-bold">{content.Column1Label}</th>
                <th className="p-5 text-center text-lg font-bold">{content.Column2Label}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <React.Fragment key={i}>
                  {r.Group && r.Group !== rows[i - 1]?.Group && (
                    <tr className="bg-gray-100"><td colSpan={3} className="px-5 py-3 font-bold">{r.Group}</td></tr>
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="p-5">
                      <strong>{r.Label}</strong>
                      {r.Description && <p className="text-sm text-gray-500">{r.Description}</p>}
                    </td>
                    <td className="p-5 text-center"><Cell type={r.Col1Type} text={r.Col1Text} /></td>
                    <td className="p-5 text-center"><Cell type={r.Col2Type} text={r.Col2Text} /></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {cta && <div className="mt-8 text-center"><Button href={cta.href} variant="outline">{cta.label}</Button></div>}
      </div>
    </section>
  );
}
