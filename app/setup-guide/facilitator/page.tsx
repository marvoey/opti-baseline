import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import s from '../setup-guide.module.css';
import { computeProgress, isCheckId } from '../_lib/checks';
import { isFacilitator, requireUser } from '@/lib/guide/session';
import { isLocked, listUsers, type GuideUser } from '@/lib/guide/users';

export const metadata: Metadata = { title: 'Team progress · Setup guide' };

/** Facilitators only (GUIDE_FACILITATOR_EMAILS). Everyone else gets a 404. */

/** When this request was rendered (kept out of the component body: render must be pure). */
const renderedAt = () => Date.now();

function ago(iso: string | null, now: number): string {
  if (!iso) return 'Never';
  const mins = Math.round((now - Date.parse(iso)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

function row(u: GuideUser) {
  const os = u.progress.os ?? 'mac';
  const p = computeProgress(u.progress.checks.filter(isCheckId), os);
  const status = u.disabled ? 'Disabled' : isLocked(u) ? 'Locked' : p.currentStep === null ? 'Done' : p.currentStep <= 6 ? 'Homework' : 'Session';
  const current = p.currentStep === null ? 'All done' : p.currentStep === 0 ? 'Terminal basics' : `Step ${p.currentStep}`;
  return { u, p, os, status, current };
}

export default async function FacilitatorPage() {
  const me = await requireUser();
  if (!isFacilitator(me)) notFound();

  const users = await listUsers();
  const rows = users.map(row);
  const now = renderedAt();
  const homeworkDone = rows.filter((r) => r.p.currentStep === null || r.p.currentStep > 6).length;

  return (
    <div className={s.page}>
      <main className={s.facWrap}>
        <p>
          <Link href="/setup-guide">← Back to the guide</Link>
        </p>
        <h1>Team progress</h1>
        <div className={s.facStats}>
          <div>
            <b>{rows.length}</b>accounts
          </div>
          <div>
            <b>{homeworkDone}</b>finished Steps 1–6
          </div>
          <div>
            <b>{rows.filter((r) => r.p.currentStep === null).length}</b>completely done
          </div>
          <div>
            <b>{rows.reduce((n, r) => n + r.u.pageViews, 0)}</b>page views
          </div>
        </div>

        {rows.length === 0 ? (
          <p>No one has signed up yet. Share the sign-up link: /setup-guide/signup</p>
        ) : (
          <div className={s.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Progress</th>
                  <th>Up to</th>
                  <th>Computer</th>
                  <th>Last seen</th>
                  <th>Visits</th>
                  <th>Views</th>
                  <th>Signed up</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ u, p, os, status, current }) => (
                  <tr key={u.key}>
                    <td>
                      <b>{u.fullName || '(no name)'}</b>
                      <br />
                      <small>{u.email}</small>
                    </td>
                    <td>
                      <div className={s.miniBar} aria-label={`${p.percent}%`}>
                        <div style={{ width: `${p.percent}%` }} />
                      </div>
                      <small>
                        {p.percent}% · {p.done}/{p.total}
                      </small>
                    </td>
                    <td>{current}</td>
                    <td>
                      {os === 'mac' ? 'macOS' : 'Windows'}
                      {u.progress.shell ? ` · ${u.progress.shell}` : ''}
                    </td>
                    <td title={u.lastSeenAt ?? undefined}>{ago(u.lastSeenAt, now)}</td>
                    <td>{u.visits}</td>
                    <td>{u.pageViews}</td>
                    <td title={u.signedUpAt ?? undefined}>{ago(u.signedUpAt, now)}</td>
                    <td>
                      <span className={s.badge}>{status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className={s.facNote}>
          <b>Visits</b> are separate sessions (30 minutes apart). <b>Views</b> count every time the guide is opened or reloaded.
          To block someone or unlock an account, edit their item in the CMS: Assets → Setup Guide → Guide Users.
        </p>
      </main>
    </div>
  );
}
