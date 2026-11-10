import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { cx, safeHref } from '@/app/_components_liberty/utils';
import { getAgent } from '@/lib/agent/getAgent';
import { applyTokens } from '@/lib/agent/tokens';
import { blockSpacing, itemList, lines, parts, str, strList } from '../liberty/shared';
import { audienceRules } from './audience';
import AgentBlockFrame from './AgentBlockFrame';

/**
 * Dashboard blocks of the Independent Agent Portal. Each one can carry audience
 * rules (role, state, agency): place several and give each its own rule to show
 * agents different content, e.g. one resource list per state. All text accepts
 * {first} {name} {role} {people} {state} {agency}. Repeated entries are one text
 * line each ("A | B | URL"), except table rows, which are small embedded items.
 */

const Heading = ({ children }: { children: string }) =>
  children ? <h2 className="text-[26px] font-light text-navy md:text-[28px]">{children}</h2> : null;

const AccentRule = () => <div className="mt-3 h-1 w-12 rounded bg-lmy" aria-hidden="true" />;

/* ---------------------------------------------------------------- Table */

export const AgentTableRowContentType = contentType({
  key: 'AgentTableRow',
  baseType: '_component',
  displayName: 'Agent Table Row',
  description: 'One row of an Agent table.',
  properties: {
    Cell1: str('First column', 10, 'Shown in bold.'),
    Cell2: str('Second column', 20),
    Cell3: str('Third column', 30, 'Shown as a link when a URL is set.'),
    LinkUrl: str('Third column URL', 40, 'A path or https:// address.'),
  },
});

export const AgentTableContentType = contentType({
  key: 'AgentTable',
  baseType: '_component',
  displayName: 'Agent: Table',
  description: 'Heading and a three-column table, e.g. bundle opportunities for a role.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10),
    Headers: strList('Column headings', 20, 'Exactly three lines.', 3),
    Rows: itemList('Rows', 30, AgentTableRowContentType, undefined, 12),
    ...audienceRules(900),
  },
});

export async function AgentTable({ content }: { content: ContentProps<typeof AgentTableContentType> }) {
  const agent = await getAgent();
  const t = (s: string | null | undefined) => applyTokens(s, agent);
  const [h1 = '', h2 = '', h3 = ''] = lines(content.Headers);
  const rows = (content.Rows ?? []).filter((r) => r?.Cell1?.trim());
  return (
    <AgentBlockFrame content={content}>
      <Heading>{t(content.Heading)}</Heading>
      <AccentRule />
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[560px] overflow-hidden rounded-lg border border-gray-200 text-sm">
          <div className="grid grid-cols-[190px_1fr_170px] bg-[#F5F5F5] font-medium text-navy">
            {[h1, h2, h3].map((h, i) => (
              <div key={i} className="p-4">
                {t(h)}
              </div>
            ))}
          </div>
          {rows.map((r, i) => (
            <div key={`${r!.Cell1}-${i}`} className={cx('grid grid-cols-[190px_1fr_170px] border-t', i % 2 === 1 && 'bg-[#FAFAFA]')}>
              <div className="p-4 font-medium text-navy">{t(r!.Cell1)}</div>
              <div className="p-4">{t(r!.Cell2)}</div>
              <div className="p-4">
                {r!.Cell3?.trim() &&
                  (r!.LinkUrl?.trim() ? (
                    <a href={safeHref(r!.LinkUrl)} className="text-lmt underline underline-offset-2">
                      {t(r!.Cell3)}
                    </a>
                  ) : (
                    t(r!.Cell3)
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AgentBlockFrame>
  );
}

/* -------------------------------------------------------- Updates panel */

export const AgentUpdatesPanelContentType = contentType({
  key: 'AgentUpdatesPanel',
  baseType: '_component',
  displayName: 'Agent: Updates panel',
  description: 'Cream panel of dated updates, e.g. "Updates for {state}".',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10, 'e.g. "Updates for {state}".'),
    Items: strList('Updates', 20, 'One per line: Date | Text | URL (the URL is optional).', 8),
    ...audienceRules(900),
  },
});

export async function AgentUpdatesPanel({ content }: { content: ContentProps<typeof AgentUpdatesPanelContentType> }) {
  const agent = await getAgent();
  const t = (s: string | null | undefined) => applyTokens(s, agent);
  const items = lines(content.Items).map(parts).filter(([, text]) => text);
  return (
    <AgentBlockFrame content={content}>
      <aside className="rounded-xl border border-creamb bg-cream p-6">
        <h3 className="font-medium text-navy">{t(content.Heading)}</h3>
        <ul className="mt-4 grid gap-6 text-sm md:grid-cols-3">
          {items.map(([date, text, url], i) => (
            <li key={`${text}-${i}`}>
              <div className="text-xs text-gray-500">{t(date)}</div>
              {url ? (
                <a href={safeHref(url)} className="text-lmt underline underline-offset-2">
                  {t(text)}
                </a>
              ) : (
                <span>{t(text)}</span>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </AgentBlockFrame>
  );
}

/* ------------------------------------------------------------ Link list */

export const AgentLinkListContentType = contentType({
  key: 'AgentLinkList',
  baseType: '_component',
  displayName: 'Agent: Link list',
  description: 'Titled list of links, e.g. "Your toolkit".',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10, 'e.g. "Your toolkit".'),
    Links: strList('Links', 20, 'One per line: Label | URL (the URL is optional).', 10),
    ...audienceRules(900),
  },
});

export async function AgentLinkList({ content }: { content: ContentProps<typeof AgentLinkListContentType> }) {
  const agent = await getAgent();
  const t = (s: string | null | undefined) => applyTokens(s, agent);
  const links = lines(content.Links).map(parts).filter(([label]) => label);
  return (
    <AgentBlockFrame content={content}>
      <div className="rounded-xl border border-gray-200 p-6">
        <h3 className="font-medium text-navy">{t(content.Heading)}</h3>
        <ul className="mt-3 grid gap-x-10 text-sm md:grid-cols-2">
          {links.map(([label, url], i) => (
            <li key={`${label}-${i}`} className="border-b border-gray-100">
              <a href={safeHref(url)} className="flex items-center justify-between py-3 text-navy">
                {t(label)}
                <span className="text-lmt" aria-hidden="true">
                  ›
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </AgentBlockFrame>
  );
}

/* -------------------------------------------------------- Resource grid */

export const AgentResourceGridContentType = contentType({
  key: 'AgentResourceGrid',
  baseType: '_component',
  displayName: 'Agent: Resource cards',
  description: 'Row of downloadable resources, e.g. "Resources for {state} {people}".',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10, 'e.g. "Resources for {state} {people}".'),
    BrowseLabel: str('"Browse all" link text', 20, 'Leave empty for no link.'),
    BrowseUrl: str('"Browse all" URL', 30),
    DownloadLabel: str('Card link text', 40, 'e.g. "Download".'),
    Resources: strList('Resources', 50, 'One per line: Title | Details | URL (the URL is optional).', 8),
    ...audienceRules(900),
  },
});

const DocIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M10 12h5M10 16h5" />
  </svg>
);

export async function AgentResourceGrid({ content }: { content: ContentProps<typeof AgentResourceGridContentType> }) {
  const agent = await getAgent();
  const t = (s: string | null | undefined) => applyTokens(s, agent);
  const resources = lines(content.Resources).map(parts).filter(([title]) => title);
  return (
    <AgentBlockFrame content={content}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <Heading>{t(content.Heading)}</Heading>
        {content.BrowseLabel?.trim() && (
          <a href={safeHref(content.BrowseUrl)} className="text-sm text-lmt underline underline-offset-2">
            {t(content.BrowseLabel)} ›
          </a>
        )}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map(([title, details, url], i) => (
          <div key={`${title}-${i}`} className="flex flex-col rounded-xl border border-gray-200 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F5F5] text-navy">
              <DocIcon />
            </div>
            <div className="mt-4 font-medium leading-snug text-navy">{t(title)}</div>
            {details && <div className="mt-2 text-xs text-gray-500">{t(details)}</div>}
            {content.DownloadLabel?.trim() && (
              <a href={safeHref(url)} className="mt-4 text-sm text-lmt underline underline-offset-2">
                {t(content.DownloadLabel)} ›
              </a>
            )}
          </div>
        ))}
      </div>
    </AgentBlockFrame>
  );
}

/* ----------------------------------------------------------- Quote list */

export const AgentQuoteListContentType = contentType({
  key: 'AgentQuoteList',
  baseType: '_component',
  displayName: 'Agent: Quote list',
  description: 'Heading and short quotes with a yellow rule, e.g. "Conversation starters".',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10, 'e.g. "Conversation starters".'),
    Quotes: strList('Quotes', 20, 'One per line. Quote marks are added for you.', 8),
    ...audienceRules(900),
  },
});

export async function AgentQuoteList({ content }: { content: ContentProps<typeof AgentQuoteListContentType> }) {
  const agent = await getAgent();
  const t = (s: string | null | undefined) => applyTokens(s, agent);
  const quotes = lines(content.Quotes);
  return (
    <AgentBlockFrame content={content}>
      <h2 className="text-2xl font-light text-navy">{t(content.Heading)}</h2>
      <div className="mt-5 space-y-4">
        {quotes.map((q, i) => (
          <blockquote key={`${q}-${i}`} className="border-l-4 border-lmy pl-4 italic text-gray-700">
            “{t(q)}”
          </blockquote>
        ))}
      </div>
    </AgentBlockFrame>
  );
}

export const agentBlockTypes = [
  AgentTableRowContentType,
  AgentTableContentType,
  AgentUpdatesPanelContentType,
  AgentLinkListContentType,
  AgentResourceGridContentType,
  AgentQuoteListContentType,
];

export const agentBlockRenderers = {
  AgentTable,
  AgentUpdatesPanel,
  AgentLinkList,
  AgentResourceGrid,
  AgentQuoteList,
};
