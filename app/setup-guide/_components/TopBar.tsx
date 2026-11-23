import Image from 'next/image';
import Link from 'next/link';
import s from '../setup-guide.module.css';
import { logout } from '../actions';
import { OsSwitch, Progress, SaveStatus, ShellControl, TerminalControl } from './controls';

export default function TopBar({ name, facilitator }: { name: string; facilitator: boolean }) {
  return (
    <header className={s.topbar}>
      <div className={s.topbarIn}>
        {/* public/logo.svg is the Optimizely primary logo (740 × 254). */}
        <Image className={s.logo} src="/logo.svg" alt="Optimizely" width={105} height={36} loading="eager" />
        <div className={s.spacer} />
        <span className={s.segLabel}>Computer</span>
        <OsSwitch />
        <TerminalControl />
        <ShellControl />
        <Progress />
      </div>
      <div className={s.userBar}>
        <div className={s.userBarIn}>
          <span>
            Signed in as <b>{name}</b>
          </span>
          <span className={s.userBarSep} aria-hidden="true">
            ·
          </span>
          <SaveStatus />
          <div className={s.spacer} />
          {facilitator && (
            <Link className={s.linkButton} href="/setup-guide/facilitator">
              Team progress
            </Link>
          )}
          <form action={logout}>
            <button type="submit" className={s.linkButton}>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
