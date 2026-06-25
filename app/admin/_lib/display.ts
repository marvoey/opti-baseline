import type { CmsContentTypeProperty } from '@/lib/cms/contentTypes';

/**
 * Presentation helpers shared by the /admin overview and /admin/[key] detail
 * pages. Pure (no JSX) so this stays a .ts module.
 */

export const BASE_TYPE_ORDER = [
  '_experience',
  '_page',
  '_section',
  '_component',
  '_image',
  '_media',
  '_video',
  '_folder',
];

const BASE_TYPE_LABELS: Record<string, string> = {
  _experience: 'Experiences',
  _page: 'Pages',
  _section: 'Sections',
  _component: 'Components / Blocks',
  _image: 'Images',
  _media: 'Media',
  _video: 'Videos',
  _folder: 'Folders',
};

export function baseTypeLabel(baseType: string): string {
  return BASE_TYPE_LABELS[baseType] ?? baseType;
}

/** Human-readable summary of a property's type, including array/allowed types. */
export function describeType(prop: CmsContentTypeProperty): string {
  if (prop.type === 'array' && prop.items) {
    const allowed = prop.items.allowedTypes ?? [];
    const inner = allowed.length
      ? `${prop.items.type}<${allowed.join(', ')}>`
      : prop.items.type ?? 'item';
    return `array of ${inner}`;
  }
  if (
    (prop.type === 'content' || prop.type === 'contentReference' || prop.type === 'component') &&
    prop.allowedTypes?.length
  ) {
    return `${prop.type}<${prop.allowedTypes.join(', ')}>`;
  }
  return prop.type;
}

/** Order base-type groups by BASE_TYPE_ORDER, then any unknown ones alphabetically. */
export function orderBaseTypes(present: Iterable<string>): string[] {
  const set = new Set(present);
  const known = BASE_TYPE_ORDER.filter((b) => set.has(b));
  const rest = [...set].filter((b) => !BASE_TYPE_ORDER.includes(b)).sort();
  return [...known, ...rest];
}
