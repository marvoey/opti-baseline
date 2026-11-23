import Image from 'next/image';
import s from '../setup-guide.module.css';
import { OsSwitch, Progress, ShellSwitch } from './controls';

export default function TopBar() {
  return (
    <header className={s.topbar}>
      <div className={s.topbarIn}>
        {/* public/logo.svg is the Optimizely primary logo (740 × 254). */}
        <Image className={s.logo} src="/logo.svg" alt="Optimizely" width={105} height={36} loading="eager" />
        <div className={s.spacer} />
        <span className={s.segLabel}>Computer</span>
        <OsSwitch />
        <span className={s.segLabel}>Shell</span>
        <ShellSwitch />
        <Progress />
      </div>
    </header>
  );
}
