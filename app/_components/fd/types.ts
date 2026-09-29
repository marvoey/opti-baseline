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
};

export const lines = (s?: string | null) =>
  (s ?? '').split('\n').map((l) => l.trim()).filter(Boolean);

/** Resolve a URL from a Graph contentReference / url value. */
export function refUrl(v: unknown): string | undefined {
  const u = (v as { url?: { default?: string | null } | string | null } | null)?.url;
  return typeof u === 'string' ? u : (u?.default ?? undefined);
}
