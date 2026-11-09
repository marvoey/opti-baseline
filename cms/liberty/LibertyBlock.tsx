import type { ReactNode } from 'react';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { cx } from '@/app/_components_liberty/utils';
import { spacingClass, type BlockSpacingValue } from './shared';

type Props = {
  /** The block's content, as delivered by the SDK (carries the preview context). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  children: ReactNode;
  /** Skip the centred max-w-5xl container (for full-width gray bands). */
  fullBleed?: boolean;
  /** Spacing used when the editor has not chosen one. Default: medium. */
  defaultSpacing?: BlockSpacingValue;
  /** Extra classes on the outer element. */
  className?: string;
};

/**
 * Shared render wrapper for every Liberty block.
 *
 * The Liberty components expect to sit inside `<div class="max-w-5xl mx-auto px-6">`
 * (see app/demo/ask-liberty/*). A section-enabled block dropped on the canvas has
 * no such parent, so this supplies the container and the vertical spacing chosen
 * in the "Spacing above" property.
 *
 * It also marks the block boundary for on-page editing when the block is rendered
 * inside a grid column (`__composition` is set). At experience level the
 * ComponentWrapper already does this and `__composition` is absent, so it is a
 * no-op there.
 */
export default function LibertyBlock({
  content,
  children,
  fullBleed = false,
  defaultSpacing,
  className,
}: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const spacing = spacingClass(content.BlockSpacing || defaultSpacing);

  if (fullBleed) {
    return (
      <section {...pa(block)} className={cx(spacing, className)}>
        {children}
      </section>
    );
  }

  return (
    <section {...pa(block)} className={cx('w-full', spacing, className)}>
      <div className="max-w-5xl mx-auto px-6">{children}</div>
    </section>
  );
}
