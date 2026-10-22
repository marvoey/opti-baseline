// Small shared helpers for the CMS block components. Kept as `.ts` (not `.tsx`)
// so the `./cms/**/*.tsx` push glob does not scan it — only files that define
// content types should be picked up by `opti-cli config push`.

/** The shape Graph returns for a `link` property. */
export type OptiLink = {
  text: string | null;
  title: string | null;
  target: string | null;
  url: { default: string | null } | null;
} | null;

/** Resolve a usable href from a `link` property (falls back to '#'). */
export function ctaHref(link: OptiLink): string {
  return link?.url?.default ?? '#';
}

// ── Numbered repeating items ──────────────────────────────────────────────────
// `json` isn't allowed on element-enabled content types, so repeating lists are
// modelled as numbered string properties (Item1Title, Item1Text, …). Empty slots
// are skipped at render time, so editors can use fewer than the maximum.

type NumberedField = { key: string; label: string };

type StringPropertyDef = {
  type: 'string';
  displayName: string;
  isLocalized: true;
  sortOrder: number;
};

/** Build `count` groups of string properties named `${prefix}${n}${field.key}`. */
export function numberedProperties(
  prefix: string,
  noun: string,
  count: number,
  fields: NumberedField[],
  startSort = 100,
): Record<string, StringPropertyDef> {
  const props: Record<string, StringPropertyDef> = {};
  for (let n = 1; n <= count; n++) {
    fields.forEach((f, i) => {
      props[`${prefix}${n}${f.key}`] = {
        type: 'string',
        displayName: `${noun} ${n} – ${f.label}`,
        isLocalized: true,
        sortOrder: startSort + n * 10 + i,
      };
    });
  }
  return props;
}

/**
 * Read the numbered groups back as objects, dropping slots where every field is empty.
 * Each item carries its slot number `n` so `pa(`${prefix}${n}Field`)` targets the right property.
 */
export function numberedItems<K extends string>(
  content: object,
  prefix: string,
  count: number,
  keys: readonly K[],
): (Record<K, string> & { n: number })[] {
  const source = content as Record<string, unknown>;
  const items: (Record<K, string> & { n: number })[] = [];
  for (let n = 1; n <= count; n++) {
    const item = { n } as Record<string, string | number>;
    let any = false;
    for (const k of keys) {
      const v = source[`${prefix}${n}${k}`];
      const s = typeof v === 'string' ? v.trim() : '';
      item[k] = s;
      if (s) any = true;
    }
    if (any) items.push(item as Record<K, string> & { n: number });
  }
  return items;
}
