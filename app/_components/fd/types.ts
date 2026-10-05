/** Product as delivered by Graph (see cms/FdProduct.tsx). */
export type ProductData = {
  Sku?: string | null;
  Name?: string | null;
  Brand?: string | null;
  Size?: string | null;
  SqftPerBox?: number | null;
  PriceSqft?: number | null;
  Rating?: number | null;
  Reviews?: number | null;
  /** DAM image references (or legacy URL strings); first is the primary image. */
  Images?: (string | { key?: string | null; url?: { default?: string | null } | string | null })[] | string | null;
  Material?: string | null;
  Finish?: string | null;
  PeiRating?: string | null;
  Dcof?: string | null;
  StockCount?: number | null;
  /** One feature per line. */
  Features?: string | null;
  DetailUrl?: string | null;
  // --- New fields for F&D Demo ---
  AestheticStyle?: 'Modern' | 'Classic' | 'Farmhouse' | 'Transitional' | 'Industrial' | null;
  MatchingGroutSku?: string | null;
  RecommendedProfile?: string | null;
  ProTipSubtext?: string | null;
  CommercialWarranty?: string | null;
};

export const lines = (s?: string | null) =>
  (s ?? '').split('\n').map((l) => l.trim()).filter(Boolean);

/** Resolve a URL from a Graph contentReference / url value. */
export function refUrl(v: unknown): string | undefined {
  const u = (v as { url?: { default?: string | null } | string | null } | null)?.url;
  return typeof u === 'string' ? u : (u?.default ?? undefined);
}

const MIN_IMAGES = 4;

/** Unsplash fallbacks (already used across the demo) so a product always has a gallery. */
const FALLBACK_IMAGES = [
  'photo-1600585154340-be6161a56a0c',
  'photo-1584622650111-993a426fbf0a',
  'photo-1595428774223-ef52624120d2',
  'photo-1552321554-5fefe8c9ef14',
  'photo-1615971677499-5467cbab01c0',
  'photo-1513694203232-719a280e022f',
].map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`);

/**
 * Image URLs from DAM references, plain URL strings, or a legacy newline-separated string.
 * Authored images come first; Unsplash fallbacks pad the list to at least MIN_IMAGES.
 */
export function getProductImages(p: ProductData, opts: { pad?: boolean } = {}): string[] {
  const authored = Array.isArray(p.Images)
    ? p.Images.map((img) => (typeof img === 'string' ? img : refUrl(img) ?? '')).filter(Boolean)
    : typeof p.Images === 'string'
      ? lines(p.Images)
      : [];
  return opts.pad === false ? authored : padImages(authored, p);
}

/** Pad an image list to MIN_IMAGES with Unsplash fallbacks (rotated by SKU/name per product). */
export function padImages(authored: string[], p: ProductData): string[] {
  if (authored.length >= MIN_IMAGES) return authored;
  const seed = [...(p.Sku ?? p.Name ?? '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const images = [...authored];
  for (let i = 0; images.length < MIN_IMAGES; i++) {
    const url = FALLBACK_IMAGES[(seed + i) % FALLBACK_IMAGES.length];
    if (!images.includes(url)) images.push(url);
  }
  return images;
}

/** Content feed item for automated blog & TV Page video distribution. */
export type ContentFeedItem = {
  id: string;
  type: 'Video Guide (TV Page)' | 'DIY Article (Blog)' | 'Installation Guide';
  title: string;
  tag: string;
  durationOrReadTime: string;
  thumbnailUrl: string;
  viewsOrAuthor?: string;
  url?: string;
};

/** Project Bundle kit item for collection selling. */
export type BundleItem = {
  role: 'Primary Tile' | 'Matching Grout' | 'Thinset Mortar' | 'Edge Trim' | 'Leveling System';
  name: string;
  sku: string;
  priceFormatted: string;
  coverageFormula: string;
  image: string;
  requiredQty: number;
};
