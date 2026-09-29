import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, withAppContext } from '@optimizely/cms-sdk/react/server';
import { ActionBlockContentType } from '@/cms/ActionBlock';
import { expandReferences, previewContextOf } from '@/cms/expandRefs';
import { HeroBlockContentType } from '@/cms/HeroBlock';
import { ProofBlockContentType } from '@/cms/ProofBlock';
import { fetchLimitlessResolution } from '@/lib/cms/fetchLimitlessResolution';
import {
  Archive,
  FileText,
  Forward,
  Inbox,
  type LucideIcon,
  MoreHorizontal,
  Reply,
  Search,
  Send,
  Trash2,
} from 'lucide-react';

/** Static filler rows so the message list reads as a populated inbox — decorative only. */
const FILLER_BEFORE = [
  { sender: 'Contoso Retail Team', subject: 'Weekly category sync notes', time: 'Yesterday' },
  { sender: 'Finance Ops', subject: 'Q3 budget review approved', time: 'Yesterday' },
];
const FILLER_AFTER = [
  { sender: 'People Team', subject: 'Benefits enrollment reminder', time: 'Mon' },
  { sender: 'IT Service Desk', subject: 'Scheduled maintenance window', time: 'Mon' },
  { sender: 'Facilities', subject: 'Office access badge renewal', time: 'Fri' },
];

function SidebarItem({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded px-2 py-1.5 text-sm ${
        active ? 'bg-[#e5f1fb] font-semibold text-[#0078d4]' : 'text-slate-600'
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" /> {label}
      </span>
      {badge != null && (
        <span className="rounded-full bg-slate-300 px-1.5 text-[10px] font-semibold text-slate-700">{badge}</span>
      )}
    </div>
  );
}

function FillerRow({ sender, subject, time }: { sender: string; subject: string; time: string }) {
  return (
    <div className="border-b border-slate-100 px-3 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{sender}</p>
        <p className="text-[11px] text-slate-400">{time}</p>
      </div>
      <p className="truncate text-xs text-slate-500">{subject}</p>
    </div>
  );
}

/**
 * Renders the exact same HeroBlock/ProofBlock/ActionBlock content as
 * app/demo/[slug]/page.tsx (the web Limitless Page), through an email-shaped
 * layout instead of the web one — the deck's "One Content Model, Every
 * Channel" claim, made clickable. Deliberately does NOT go through
 * <OptimizelyComponent>/cms/NiqLimitlessPage.tsx: those render full-bleed web
 * sections, not an email. No new CMS content type — same blocks, same
 * resolution, different JSX.
 */
const DEFAULTS = {
  persona: 'Ecommerce_VP',
  industry: 'PersonalCare',
  tier: 'StrategicCustomer',
};

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ persona?: string; industry?: string; tier?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const persona = params.persona ?? DEFAULTS.persona;
  const industry = params.industry ?? DEFAULTS.industry;
  const tier = params.tier ?? DEFAULTS.tier;

  return {
    title: `${persona} / ${industry} / ${tier} — Email Preview`,
  };
}

async function EmailPreviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const persona = params.persona ?? DEFAULTS.persona;
  const industry = params.industry ?? DEFAULTS.industry;
  const tier = params.tier ?? DEFAULTS.tier;

  const result = await fetchLimitlessResolution({ persona, industry, tier });
  if (!result.ok) notFound();

  const ctx = previewContextOf({});
  const [[hero], [proof], [action]] = await Promise.all([
    expandReferences<ContentProps<typeof HeroBlockContentType>>(
      result.keys.heroKey ? [{ key: result.keys.heroKey }] : [],
      ctx,
    ),
    expandReferences<ContentProps<typeof ProofBlockContentType>>(
      result.keys.proofKey ? [{ key: result.keys.proofKey }] : [],
      ctx,
    ),
    expandReferences<ContentProps<typeof ActionBlockContentType>>(
      result.keys.actionKey ? [{ key: result.keys.actionKey }] : [],
      ctx,
    ),
  ]);

  const heroPa = hero ? getPreviewUtils(hero).pa : () => ({});
  const proofPa = proof ? getPreviewUtils(proof).pa : () => ({});
  const actionPa = action ? getPreviewUtils(action).pa : () => ({});

  const webViewUrl = `/demo/governance-drift?${new URLSearchParams({ persona, industry, tier }).toString()}`;

  return (
    <div className="min-h-screen bg-slate-200 px-4 py-8">
      <div className="mx-auto mb-4 flex max-w-350 items-center justify-between text-xs text-slate-500">
        <span>
          Previewing as: <strong className="text-slate-700">{persona} / {industry} / {tier}</strong>
        </span>
        <a href={webViewUrl} className="font-semibold text-blue-600 hover:underline">
          ← View as Web Page
        </a>
      </div>

      <div className="mx-auto flex h-205 max-w-350 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-2xl">
        {/* Folder sidebar */}
        <div className="flex w-55 shrink-0 flex-col border-r border-slate-200 bg-[#faf9f8] px-2 py-4">
          <div className="mb-4 flex items-center gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0078d4] text-xs font-bold text-white">
              M
            </div>
            <span className="text-sm font-semibold text-slate-700">Mail</span>
          </div>
          <button className="mx-2 mb-4 rounded bg-[#0078d4] px-3 py-1.5 text-xs font-semibold text-white">
            + New message
          </button>
          <p className="px-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Favorites</p>
          <nav className="mt-1 space-y-0.5">
            <SidebarItem icon={Inbox} label="Inbox" active badge={6} />
            <SidebarItem icon={Send} label="Sent Items" />
            <SidebarItem icon={FileText} label="Drafts" />
          </nav>
          <p className="mt-4 px-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Folders</p>
          <nav className="mt-1 space-y-0.5">
            <SidebarItem icon={Archive} label="Archive" />
            <SidebarItem icon={Trash2} label="Deleted Items" />
          </nav>
        </div>

        {/* Message list */}
        <div className="flex w-85 shrink-0 flex-col border-r border-slate-200">
          <div className="border-b border-slate-200 px-3 py-2">
            <div className="flex items-center gap-2 rounded bg-slate-100 px-2 py-1.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" /> Search mail
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {FILLER_BEFORE.map((row) => (
              <FillerRow key={row.subject} {...row} />
            ))}
            <div className="border-b border-slate-100 border-l-4 border-l-[#0078d4] bg-blue-50 px-3 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">NielsenIQ Insights</p>
                <p className="text-[11px] text-slate-400">9:41 AM</p>
              </div>
              <p className="truncate text-xs font-medium text-slate-700">{hero?.Headline ?? 'Your personalized update'}</p>
              {hero?.Subheadline && <p className="truncate text-xs text-slate-500">{hero.Subheadline}</p>}
            </div>
            {FILLER_AFTER.map((row) => (
              <FillerRow key={row.subject} {...row} />
            ))}
          </div>
        </div>

        {/* Reading pane */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Outlook-style reading-pane toolbar */}
          <div className="flex items-center gap-1 border-b border-slate-200 bg-[#faf9f8] px-3 py-1.5">
            <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200/70">
              <Reply className="h-3.5 w-3.5 text-[#0078d4]" /> Reply
            </button>
            <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200/70">
              <Forward className="h-3.5 w-3.5 text-[#0078d4]" /> Forward
            </button>
            <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200/70">
              <Archive className="h-3.5 w-3.5 text-[#0078d4]" /> Archive
            </button>
            <button className="ml-auto rounded p-1 text-slate-500 hover:bg-slate-200/70">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Reading-pane header: subject + from/to/date */}
          <div className="border-b border-slate-200 px-5 py-4">
            {hero && (
              <h1 {...heroPa('Headline')} className="text-lg font-semibold text-slate-900">
                {hero.Headline}
              </h1>
            )}
            <div className="mt-3 flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0078d4] text-xs font-bold text-white">
                  NI
                </div>
                <div className="text-xs leading-tight">
                  <p className="font-semibold text-slate-800">NielsenIQ Insights <span className="font-normal text-slate-400">&lt;insights@nielseniq.com&gt;</span></p>
                  <p className="mt-0.5 text-slate-500">
                    To: <code className="text-slate-500">{'{{recipient.first_name}} <{{recipient.email}}>'}</code>
                  </p>
                </div>
              </div>
              <p className="shrink-0 pl-3 text-xs text-slate-400">Today, 9:41 AM</p>
            </div>
          </div>

          {/* Email body */}
          <div className="px-6 py-6 text-sm leading-relaxed text-slate-700">
            {hero?.Subheadline && (
              <p {...heroPa('Subheadline')} className="mb-4 text-sm text-slate-500 italic">
                {hero.Subheadline}
              </p>
            )}
            <p>Hi <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-600">{'{{recipient.first_name}}'}</code>,</p>

            {proof && (
              <div className="my-5 rounded-md border border-blue-100 bg-blue-50 px-5 py-4 text-center">
                <p {...proofPa('MetricNumber')} className="text-3xl font-bold text-blue-600">
                  {proof.MetricNumber}
                </p>
                <p {...proofPa('MetricLabel')} className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {proof.MetricLabel}
                </p>
                {proof.ClientQuote && (
                  <p {...proofPa('ClientQuote')} className="mt-3 text-sm italic text-slate-600">
                    &ldquo;{proof.ClientQuote}&rdquo;
                  </p>
                )}
                {proof.ClientIdentifier && (
                  <p {...proofPa('ClientIdentifier')} className="mt-2 text-xs font-semibold text-slate-500">
                    — {proof.ClientIdentifier}
                  </p>
                )}
              </div>
            )}

            {action?.CalendarUrl?.default && (
              <div className="my-5 text-center">
                <a
                  {...actionPa('CalendarUrl')}
                  href={action.CalendarUrl.default}
                  className="inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white"
                >
                  {action.ButtonText || 'Schedule a meeting'}
                </a>
              </div>
            )}

            {(action?.LeadName || action?.LeadTitle) && (
              <p className="mt-4 text-slate-600">
                Best,<br />
                <span {...actionPa('LeadName')} className="font-medium">{action.LeadName}</span>
                {action.LeadName && action.LeadTitle && ', '}
                <span {...actionPa('LeadTitle')}>{action.LeadTitle}</span>
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-center text-[11px] text-slate-400">
            You&apos;re receiving this email as a NielsenIQ partner. Unsubscribe:{' '}
            <code className="text-slate-400">{'{{system.unsubscribe_url}}'}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAppContext(EmailPreviewPage);
