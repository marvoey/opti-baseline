import { type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { LibAskQuestionContentType } from './AskLibertyExperience';
import { resolveHref } from './shared';

type Props = { content: ContentProps<typeof LibAskQuestionContentType> };

/**
 * What a Liberty Ask Question renders when it is placed on a canvas.
 *
 * A question is configuration for the Ask Liberty search (routing and the
 * progress card), not content for visitors, so on the live site this renders
 * nothing. Editors in the CMS preview or on-page editor get a small summary
 * card so the block is visible and clickable on the canvas.
 */
export default function LibAskQuestionBlock({ content }: Props) {
  // `__context` only exists on content fetched for preview.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (content as any).__context as { edit?: boolean; preview_token?: string } | undefined;
  if (!ctx?.edit && !ctx?.preview_token) return null;

  const { pa } = getPreviewUtils(content);
  const href = resolveHref(content.LinkUrl, content.Link);
  const flags = [content.HideChip ? 'hidden chip' : null, content.IsFallback ? 'fallback' : null].filter(Boolean);

  return (
    <aside
      {...pa(content.__composition)}
      className="mx-auto my-4 max-w-3xl rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-4 text-sm text-gray-600"
    >
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-gray-500">
        Ask Liberty question (not shown to visitors){flags.length ? ` · ${flags.join(' · ')}` : ''}
      </p>
      <p {...pa('Question')} className="mt-1 text-base text-gray-800">
        {content.Question?.trim() || 'No question text yet'}
      </p>
      <p className="mt-1">Leads to: {href && href !== '#' ? href : 'stays on this page'}</p>
    </aside>
  );
}
