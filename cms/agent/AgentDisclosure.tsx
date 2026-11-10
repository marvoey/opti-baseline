import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { lines, blockSpacing, str, strList } from '../liberty/shared';
import LibertyBlock from '../liberty/LibertyBlock';
import { isEditing } from './AgentBlockFrame';

/**
 * Agent Disclosure: the approved "Important information" text, managed ONCE as a
 * shared block and placed on the Independent Agent Portal product page and on
 * LM.com. The core text is the same everywhere; each channel has its own short
 * note under it. Which note shows is chosen where the block is placed, with the
 * "Channel" display setting below, so editing the shared text never changes which
 * page shows which note.
 *
 * Not for agents only: no audience rules, and it does not depend on the viewer.
 */
export const AgentDisclosureContentType = contentType({
  key: 'AgentDisclosure',
  baseType: '_component',
  displayName: 'Agent: Disclosure',
  description:
    'Shared legal disclosure: one core text for every site and a short note for each channel. Choose the channel where the block is placed.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10, 'e.g. "Important information".'),
    Paragraphs: strList(
      'Core text',
      20,
      'One paragraph per line. Shared by every channel; a change here is a controlled change (review, approve, publish).',
      8,
    ),
    NoteIaPortal: str('Note: Independent Agent Portal', 30, 'Shown when the placement\'s Channel is "IA Portal".'),
    NoteLmCom: str('Note: LM.com', 40, 'Shown when the placement\'s Channel is "LM.com".'),
  },
});

/**
 * The "Channel" setting, chosen per placement in Visual Builder (not stored in the
 * shared block). `ia` shows the IA Portal note, `lm` the LM.com note.
 */
export const AgentDisclosureChannelTemplate = displayTemplate({
  key: 'AgentDisclosureChannel',
  isDefault: true,
  displayName: 'Disclosure channel',
  contentType: 'AgentDisclosure',
  settings: {
    channel: {
      editor: 'select',
      displayName: 'Channel',
      sortOrder: 0,
      choices: {
        ia: { displayName: 'IA Portal', sortOrder: 1 },
        lm: { displayName: 'LM.com', sortOrder: 2 },
      },
    },
  },
});

type Props = {
  content: ContentProps<typeof AgentDisclosureContentType>;
  displaySettings?: ContentProps<typeof AgentDisclosureChannelTemplate>;
};

/** "2026-10-14T09:05:00Z" → "Oct 14, 2026". Empty for anything that is not a date. */
function shortDate(iso: string | null | undefined): string {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export default function AgentDisclosure({ content, displaySettings }: Props) {
  const channel = (displaySettings as { channel?: string } | undefined)?.channel;
  const note = channel === 'ia' ? content.NoteIaPortal : channel === 'lm' ? content.NoteLmCom : '';
  const meta = (content as { _metadata?: { published?: string | null; lastModified?: string | null } })._metadata;
  const updated = shortDate(meta?.published ?? meta?.lastModified);
  const paragraphs = lines(content.Paragraphs);

  return (
    <LibertyBlock content={content}>
      <div className="rounded-2xl bg-[#F5F5F5] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-medium text-navy">{content.Heading}</h3>
          {updated && <span className="text-xs text-gray-500">Updated {updated}</span>}
        </div>
        <div className="mt-3 space-y-3 text-xs leading-5 text-gray-600">
          {paragraphs.map((p, i) => (
            <p key={`${i}-${p.slice(0, 12)}`}>{p}</p>
          ))}
        </div>
        {note?.trim() && (
          <div className="mt-4 border-t border-gray-200 pt-4 text-xs leading-5 text-gray-600">{note.trim()}</div>
        )}
        {isEditing(content) && !channel && (
          <p className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-xs text-gray-600">
            No channel chosen, so no note shows. Pick a Channel in this block&apos;s settings: IA Portal or LM.com.
          </p>
        )}
      </div>
    </LibertyBlock>
  );
}
