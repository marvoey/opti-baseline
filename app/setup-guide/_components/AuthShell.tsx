import Image from 'next/image';
import type { ReactNode } from 'react';
import s from '../setup-guide.module.css';

/** Frame for the sign-in and sign-up pages. */
export default function AuthShell({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className={s.page}>
      <main className={s.authWrap}>
        <div className={s.authCard}>
          <Image className={s.logo} src="/logo.svg" alt="Optimizely" width={105} height={36} loading="eager" />
          <p className={s.eyebrow}>Mark AI · Custom Demo · Setup guide</p>
          <h1>{title}</h1>
          <div className={s.authIntro}>{intro}</div>
          {children}
        </div>
        <Image className={s.authArt} src="/setup-guide/backpack.svg" alt="" width={220} height={220} loading="eager" />
      </main>
    </div>
  );
}
