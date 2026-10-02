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
  /** One image URL per line; first is the primary image. */
  Images?: string | null;
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
