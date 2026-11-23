import { after } from 'next/server';
import { headers } from 'next/headers';
import s from './setup-guide.module.css';
import { GuideRoot } from './_components/controls';
import { GuideProvider } from './_components/GuideProvider';
import TopBar from './_components/TopBar';
import Toc from './_components/Toc';
import { BeforeYouStart, Hero, TerminalBasics } from './_sections/Intro';
import PrepSteps from './_sections/PrepSteps';
import VsCodeTerminal from './_sections/VsCodeTerminal';
import SessionSteps from './_sections/SessionSteps';
import { ComingBack, EnvReference, GroundRules, Ready, Troubleshooting } from './_sections/Reference';
import { isCheckId, type Os } from './_lib/checks';
import { isFacilitator, requireUser } from '@/lib/guide/session';
import { updateUser, viewChanges } from '@/lib/guide/users';

/**
 * /setup-guide — gets a colleague with no development experience from a bare laptop to a
 * running opti-baseline site. Steps 1–8 are done on their own (HOMEWORK_LAST_STEP); Steps 9–11 are done
 * together in a live session.
 *
 * Sign-in required. The person's progress comes from their GuideUser record in the CMS, and every
 * page view is recorded on that record after the response has been sent.
 */
export default async function SetupGuidePage() {
  const user = await requireUser();

  after(async () => {
    try {
      await updateUser(user, viewChanges(user));
    } catch (err) {
      console.error('[setup-guide] could not record a page view:', err instanceof Error ? err.message : err);
    }
  });

  // First visit: guess the computer from the browser so the right steps show straight away.
  const guessedOs: Os = /Windows/i.test((await headers()).get('user-agent') ?? '') ? 'win' : 'mac';
  const initial = {
    checks: user.progress.checks.filter(isCheckId),
    os: user.progress.os ?? guessedOs,
    shell: user.progress.shell,
    winMode: user.progress.winMode ?? ('native' as const),
  };

  return (
    <GuideProvider initial={initial}>
      <GuideRoot>
        <a className={s.skip} href="#start">
          Skip to the guide
        </a>
        <TopBar name={user.fullName || user.email} facilitator={isFacilitator(user)} />
        <div className={s.wrap}>
          <Toc />
          <main className={s.main}>
            <Hero />
            <BeforeYouStart />
            <TerminalBasics />
            <VsCodeTerminal />
            <PrepSteps />
            <SessionSteps />
            <Ready />
            <ComingBack />
            <GroundRules />
            <Troubleshooting />
            <EnvReference />
          </main>
        </div>
      </GuideRoot>
    </GuideProvider>
  );
}
