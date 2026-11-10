import type { ReactNode } from 'react';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { cx } from '@/app/_components_liberty/utils';
import { describeRules, isEligible, type AudienceRules } from '@/lib/agent/eligibility';
import { getAgent } from '@/lib/agent/getAgent';
import { spacingClass } from '../liberty/shared';

/** True for content fetched by the CMS preview or the on-page editor. */
export function isEditing(content: unknown): boolean {
  const ctx = (content as { __context?: { edit?: boolean; preview_token?: string } } | null)?.__context;
  return !!(ctx?.edit || ctx?.preview_token);
}

const hasRules = (r: AudienceRules): boolean =>
  !!(r.ForProducers || r.ForPrincipals || r.ForServiceReps || (r.States ?? []).some(Boolean) || (r.Agencies ?? []).some(Boolean));

/**
 * Shared frame for every Independent Agent Portal block: page width, the
 * "Spacing above" choice, the editing overlay boundary, and the audience rule.
 *
 * A block whose rules do not match the current agent renders nothing for
 * visitors. In the CMS preview it collapses to a one-line note (its heading and
 * who it is for) so an editor can always find, select and fix it without its
 * text being filled in for the wrong agent. A block with rules that does match
 * carries a small "Shown to" note so the rules are visible while editing.
 */
export default async function AgentBlockFrame({
  content,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  children: ReactNode;
}) {
  const agent = await getAgent();
  const editing = isEditing(content);
  const matches = isEligible(content, agent);
  if (!matches && !editing) return null;

  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const rules = describeRules(content);

  if (!matches) {
    const heading = typeof content.Heading === 'string' ? content.Heading.trim() : '';
    return (
      <section {...pa(block)} className="w-full pt-3">
        <div className="mx-auto max-w-6xl px-6">
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-600">
            <span className="font-bold uppercase tracking-wider">Hidden for {agent.first}</span> · shown only to{' '}
            {rules.roles} · {rules.states} · {rules.agencies}
            {heading && <> · “{heading}”</>}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section {...pa(block)} className={cx('w-full', spacingClass(content.BlockSpacing))}>
      <div className="mx-auto max-w-6xl px-6">
        {editing && hasRules(content) && (
          <p className="mb-2 inline-block rounded-full bg-mist px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-lmtd">
            Shown to: {rules.roles} · {rules.states} · {rules.agencies}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
