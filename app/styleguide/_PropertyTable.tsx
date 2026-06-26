'use client';

import type { ContentTypeDef, PropertyDef } from './_blocks';

/**
 * A table of a content type's properties, ordered by sortOrder.
 *
 * On its own it's a plain reference table (used for nested item types). When
 * given `numbers`/`activeKey`/`onHover` it becomes the interactive half of the
 * property↔preview map on a detail page: numbered rows line up with numbered
 * markers in the preview, and hovering either side highlights the other.
 */

/** Render a one-line summary of a property's type (handles arrays / refs). */
export function typeLabel(prop: PropertyDef): string {
  if (prop.type === 'array') {
    const item = prop.items;
    if (item?.type === 'component' && item.contentType?.key) {
      return `array<${item.contentType.key}>`;
    }
    return `array<${item?.type ?? 'unknown'}>`;
  }
  if (prop.type === 'contentReference' && prop.allowedTypes?.length) {
    return `contentReference(${prop.allowedTypes.join(', ')})`;
  }
  return prop.type;
}

export function PropertyTable({
  contentType,
  numbers,
  activeKey,
  onHover,
}: {
  contentType: ContentTypeDef;
  /** key → marker number, for properties that render in the preview. */
  numbers?: Record<string, number>;
  /** Currently highlighted property key (shared with the preview). */
  activeKey?: string | null;
  /** Called with a key on hover, or null on leave. */
  onHover?: (key: string | null) => void;
}) {
  const entries = Object.entries(contentType.properties).sort(
    ([, a], [, b]) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const interactive = !!onHover;

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-cibc-stone/60 text-xs uppercase tracking-wider text-cibc-ink/50">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Property</th>
            <th className="px-4 py-2.5 font-semibold">Type</th>
            <th className="px-4 py-2.5 font-semibold">Flags</th>
            <th className="px-4 py-2.5 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {entries.map(([key, prop]) => {
            const n = numbers?.[key];
            const isActive = activeKey === key;
            return (
              <tr
                key={key}
                data-sg-prop={key}
                onMouseEnter={interactive ? () => onHover?.(key) : undefined}
                onMouseLeave={interactive ? () => onHover?.(null) : undefined}
                className={`align-top transition-colors ${
                  interactive && n ? 'cursor-pointer' : ''
                } ${isActive ? 'bg-cibc-gold/10' : ''}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {n ? (
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                          isActive ? 'bg-cibc-gold text-cibc-teal-dark' : 'bg-cibc-teal text-white'
                        }`}
                        title="Mapped to the preview above"
                      >
                        {n}
                      </span>
                    ) : null}
                    <code className="font-mono text-xs font-semibold text-cibc-teal-dark">{key}</code>
                  </div>
                  {prop.displayName ? (
                    <div className="mt-0.5 text-xs text-cibc-ink/50">{prop.displayName}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-cibc-teal">{typeLabel(prop)}</code>
                  {prop.enum?.length ? (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {prop.enum.map((c) => (
                        <span
                          key={c.value}
                          className="rounded bg-cibc-stone px-1.5 py-0.5 font-mono text-[10px] text-cibc-ink/70"
                        >
                          {c.value}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {prop.isRequired ? (
                      <span className="rounded bg-cibc-rust/10 px-1.5 py-0.5 font-semibold text-cibc-rust">
                        required
                      </span>
                    ) : null}
                    {prop.isLocalized ? (
                      <span className="rounded bg-cibc-teal/10 px-1.5 py-0.5 font-semibold text-cibc-teal">
                        localized
                      </span>
                    ) : null}
                    {typeof prop.maxLength === 'number' ? (
                      <span className="rounded bg-cibc-gold/15 px-1.5 py-0.5 font-semibold text-cibc-gold-dark">
                        ≤{prop.maxLength}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-cibc-ink/70">{prop.description ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
