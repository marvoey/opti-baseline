/**
 * Block width helper.
 *
 * Every canvas block supports a Full / Medium / Narrow content width. This
 * declares the shared `BlockWidth` enum property — spread it into a content
 * type's `properties` — and maps the chosen value to the inner container's
 * max-width class. The default (unset) is Full, resolved in the component.
 *
 * Usage:
 *   properties: { ...blockWidth(), MainTitle: {...}, ... }   // content type
 *   <div className={`mx-auto ${widthClass(content.BlockWidth)}`}>…</div>  // component
 */

export type BlockWidthValue = 'full' | 'medium' | 'narrow';

/**
 * Spread into a content type's `properties` to add the Width selector.
 * sortOrder 5 floats it above the content fields (which start at 10).
 */
export function blockWidth(sortOrder = 5) {
  return {
    BlockWidth: {
      type: 'string' as const,
      displayName: 'Width',
      description: 'Content width on the page: Full, Medium or Narrow. Default: Full.',
      isLocalized: true,
      sortOrder,
      enum: [
        { value: 'full', displayName: 'Full' },
        { value: 'medium', displayName: 'Medium' },
        { value: 'narrow', displayName: 'Narrow' },
      ],
    },
  };
}

const WIDTH_CLASS: Record<BlockWidthValue, string> = {
  full: 'max-w-6xl',
  medium: 'max-w-3xl',
  narrow: 'max-w-xl',
};

/** Tailwind max-width class for the chosen width (defaults to Full when unset). */
export function widthClass(value: string | null | undefined): string {
  return WIDTH_CLASS[value as BlockWidthValue] ?? WIDTH_CLASS.full;
}
