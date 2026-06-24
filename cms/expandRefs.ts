import { getClient } from '@optimizely/cms-sdk';

/** A content reference as delivered by Graph: `{ key, url }` (no item props). */
type ContentRef = { key?: string | null } | null | undefined;

/** Preview/locale context extracted from the parent content. */
export type ExpandContext = {
  edit?: boolean;
  previewToken?: string;
  locale?: string;
};

/**
 * Pull the preview context off a parent content object so referenced items can
 * be fetched in the same mode (draft-in-preview vs published) and locale.
 */
export function previewContextOf(content: unknown): ExpandContext {
  const c = content as {
    __context?: { edit?: boolean; preview_token?: string };
    _metadata?: { locale?: string };
  };
  return {
    edit: c.__context?.edit,
    previewToken: c.__context?.preview_token,
    locale: c._metadata?.locale,
  };
}

/**
 * Expand an array of content references into their full content items.
 *
 * A `contentReference` (or array-of-contentReference) property is delivered by
 * Graph as `{ key, url }` only — NOT the referenced item's properties (see
 * graph/createQuery.js: contentReference selects `{ key url }`). To render the
 * target (e.g. a Service or a Quick Care Card) each reference must be fetched by
 * key. `getClient().getContent(...)` returns the item with its properties
 * de-aliased (removeTypePrefix), so the result is renderable as `content`.
 *
 * In preview/edit mode, fetches the latest DRAFT in the current locale using the
 * preview token — so unpublished references still render in Visual Builder.
 * Otherwise fetches the latest PUBLISHED version. Unresolvable refs are dropped;
 * order is preserved.
 *
 * Named `.ts` (not `.tsx`) so the optimizely.config.mjs `./cms/**\/*.tsx` push
 * glob never scans it — it defines no content type.
 */
export async function expandReferences<T = unknown>(
  refs: ContentRef[] | null | undefined,
  ctx?: ExpandContext,
): Promise<T[]> {
  const keys = (refs ?? []).map((r) => r?.key).filter((k): k is string => !!k);
  if (keys.length === 0) return [];
  const client = getClient();
  const locale = ctx?.locale;
  // In preview/edit mode, fetch the latest DRAFT (with the preview token) in the
  // parent's locale. On the published site, `{ key, locale }` filters published
  // content to that locale branch so translated blocks render on a localized page;
  // `{ key }` alone is NOT locale-filtered (SDK priority rules).
  const usePreview = !!(ctx?.edit && ctx.previewToken);
  const options = usePreview ? { previewToken: ctx!.previewToken } : undefined;

  const fetchOne = async (key: string) => {
    const item = await client.getContent({ key, locale }, options).catch(() => null);
    // Fall back to the default-locale (or any published) branch when this block
    // hasn't been translated yet — so a partially translated page still renders
    // every block instead of dropping the untranslated ones.
    if (!item && locale) {
      return client.getContent({ key }, options).catch(() => null);
    }
    return item;
  };

  const items = await Promise.all(keys.map(fetchOne));
  return items.filter(Boolean) as T[];
}
