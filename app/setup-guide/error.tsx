'use client';

import { useEffect } from 'react';
import s from './setup-guide.module.css';
import { FACILITATOR } from './_lib/contact';

/** Friendly fallback when the guide can't load (for example, the CMS is briefly unreachable). */
export default function SetupGuideError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error('[setup-guide]', error);
  }, [error]);

  return (
    <div className={s.page}>
      <main className={s.authWrap}>
        <div className={s.authCard}>
          <h1>Something went wrong.</h1>
          <p>We couldn’t load the setup guide just now. Your progress is safe.</p>
          <p>Wait a few seconds, then try again. If it keeps happening, tell {FACILITATOR}.</p>
          <button type="button" className={s.primaryButton} onClick={() => retry()}>
            Try again
          </button>
          {error.digest && <p className={s.formFoot}>Reference: {error.digest}</p>}
        </div>
      </main>
    </div>
  );
}
