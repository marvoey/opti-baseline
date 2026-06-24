import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { ComponentContainerProps } from '@optimizely/cms-sdk/react/server';

/**
 * Wraps every component node rendered inside an experience composition.
 * Applies `pa(node)` so on-page editing overlays attach to each block in
 * preview/edit mode (a no-op outside the editor).
 */
export function ComponentWrapper({ children, node }: ComponentContainerProps) {
  const { pa } = getPreviewUtils(node);
  return <div {...pa(node)}>{children}</div>;
}
