import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import PriorityCard from '@/app/_components_portal/PriorityCard';
import { PRIORITY_ICONS } from '@/app/_components_portal/PriorityIcon';
import { choice, flag, lines, str, strList } from '../liberty/shared';
import { audienceRules } from './audience';

const ICON_LABELS: Record<(typeof PRIORITY_ICONS)[number], string> = {
  home: 'Home',
  condo: 'Condo',
  renters: 'Renters',
  umbrella: 'Umbrella',
  moto: 'Motorcycle',
  auto: 'Auto',
  life: 'Heart',
  pet: 'Pet',
  biz: 'Business',
};

/**
 * One priority of the Independent Agent Portal: a product or bundle to push, or
 * a service task. A shared block: it is listed, in order, on the "Agent
 * Priorities" page, and the dashboard shows the first few that are on and match
 * the agent. The audience rules (role, state, agency) decide who qualifies; the
 * order on the page decides what is emphasized.
 */
export const AgentPriorityContentType = contentType({
  key: 'AgentPriority',
  baseType: '_component',
  displayName: 'Agent Priority',
  description: 'A product, bundle or service task for agents, with the rules for who sees it.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: str('Title', 10, 'e.g. "Home + Auto bundle".'),
    Description: str('Description', 20),
    Icon: {
      ...choice(
        'Icon',
        30,
        PRIORITY_ICONS.map((v) => [v, ICON_LABELS[v]] as const),
        'Icon in the round badge. Default: Home.',
      ),
      format: 'selectOne' as const,
    },
    Benefits: strList('Benefits', 40, 'One per line, up to four.', 4),
    LinkLabel: str('Link text', 50, 'e.g. "Open bundle guide". Leave empty for no link.'),
    LinkUrl: str('Link URL', 60, 'A path such as /agent/home-auto-bundle or a full https:// address.'),
    ButtonLabel: str(
      'Button text',
      70,
      'Teal button, e.g. "Start a change" for a service task. Leave empty to use the quote button text set on the Agent Priorities page.',
    ),
    Hidden: flag(
      'Turn off',
      80,
      'Keeps the priority in the list but no agent sees it. Turn it back on any time.',
    ),
    ...audienceRules(900),
  },
});

type Props = { content: ContentProps<typeof AgentPriorityContentType> };

/**
 * What a priority renders when it is dropped on a canvas: the card agents see.
 * A priority that is turned off renders nothing for visitors; in the CMS
 * preview it is still shown, with a note, so editors can find and fix it.
 */
export default function AgentPriorityBlock({ content }: Props) {
  // `__context` only exists on content fetched for preview.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (content as any).__context as { edit?: boolean; preview_token?: string } | undefined;
  const editing = !!(ctx?.edit || ctx?.preview_token);
  if (content.Hidden && !editing) return null;

  const { pa } = getPreviewUtils(content);
  return (
    <div {...pa(content.__composition)} className="mx-auto max-w-md px-6 py-4">
      {content.Hidden && (
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
          Turned off, agents do not see this
        </p>
      )}
      <PriorityCard
        icon={content.Icon}
        title={content.Title?.trim() || 'Untitled priority'}
        description={content.Description?.trim() || undefined}
        benefits={lines(content.Benefits)}
        linkLabel={content.LinkLabel?.trim() || undefined}
        linkHref={content.LinkUrl?.trim() || undefined}
        buttonLabel={content.ButtonLabel?.trim() || undefined}
      />
    </div>
  );
}
