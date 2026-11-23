import { CHECKS, appliesTo, computeProgress, isCheckId, CHECK_IDS } from '@/app/setup-guide/_lib/checks';
import { getUserByKey } from '@/lib/guide/users';

/**
 * Readable view of one GuideUser for the CMS preview pane (opened by editors with a preview
 * token). Registered for the GuideUser type in cms/registry.ts, NOT in cms/GuideUser.tsx: the
 * cms:push bundler can't import app or server-only code.
 *
 * Every GuideUser property is indexingType "disabled", so Graph returns none of them. The card
 * takes only the content key from Graph and reads the record from the CMS Content API (the same
 * way the guide does). Never shows the password hash.
 */

type Props = { content: { _metadata?: { key?: string | null } } };

const dateFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' });
const fmt = (iso: string | null | undefined) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? `${dateFmt.format(d)} UTC` : '–';
};

function Badge({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        on ? 'bg-lfgreen text-dark-fir' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {label}: {on ? 'Yes' : 'No'}
    </span>
  );
}

export default async function GuideUserCard({ content }: Props) {
  const key = content._metadata?.key;
  if (!key) return null;

  const user = await getUserByKey(key).catch(() => null);
  if (!user) {
    return <p className="p-6 text-sm text-gray-500">Could not read this account from the CMS.</p>;
  }

  const os = user.progress.os ?? 'mac';
  const winMode = user.progress.winMode ?? 'native';
  const ticked = new Set(user.progress.checks.filter(isCheckId));
  const progress = computeProgress(ticked, os, winMode);
  const steps = CHECK_IDS.filter((id) => appliesTo(id, os, winMode));
  const computer =
    os === 'mac'
      ? `macOS${user.progress.shell ? ` · ${user.progress.shell}` : ''}`
      : winMode === 'wsl'
        ? `Windows · WSL${user.progress.shell ? ` · ${user.progress.shell}` : ''}`
        : 'Windows · PowerShell';
  const current =
    progress.currentStep === null ? 'All done' : progress.currentStep === 0 ? 'Terminal basics' : `Step ${progress.currentStep}`;

  return (
    <section className="mx-auto my-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-dark-fir shadow-sm">
      <h2 className="font-display text-2xl font-extrabold">{user.fullName || '(no name)'}</h2>
      <p className="mt-1 text-sm text-gray-600">{user.email || '(no email)'}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge on={user.facilitator} label="Facilitator" />
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            user.disabled ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Disabled: {user.disabled ? 'Yes' : 'No'}
        </span>
      </div>

      <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-gray-500">Progress</h3>
      <div className="mt-2 flex items-center gap-3">
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-good-to-go" style={{ width: `${progress.percent}%` }} />
        </div>
        <b className="w-12 text-right text-sm">{progress.percent}%</b>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {progress.done} of {progress.total} boxes ticked · {current} · {computer}
      </p>

      <ul className="mt-4 space-y-1.5 text-sm">
        {steps.map((id) => (
          <li key={id} className={`flex gap-2 ${ticked.has(id) ? 'text-dark-fir' : 'text-gray-400'}`}>
            <span aria-hidden="true">{ticked.has(id) ? '✓' : '○'}</span>
            <span className="sr-only">{ticked.has(id) ? 'Done:' : 'Not done:'}</span>
            <span>{CHECKS[id]}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-gray-100 pt-4 text-sm">
        <dt className="text-gray-500">Signed up</dt>
        <dd>{fmt(user.signedUpAt)}</dd>
        <dt className="text-gray-500">Last seen</dt>
        <dd>{fmt(user.lastSeenAt)}</dd>
        <dt className="text-gray-500">Visits / page views</dt>
        <dd>
          {user.visits} / {user.pageViews}
        </dd>
      </dl>
    </section>
  );
}
