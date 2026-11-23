import s from './setup-guide.module.css';
import { GuideRoot } from './_components/controls';
import TopBar from './_components/TopBar';
import Toc from './_components/Toc';
import { BeforeYouStart, Hero, TerminalBasics } from './_sections/Intro';
import PrepSteps from './_sections/PrepSteps';
import SessionSteps from './_sections/SessionSteps';
import { ComingBack, EnvReference, GroundRules, Ready, Troubleshooting } from './_sections/Reference';

/**
 * /setup-guide — gets a colleague with no development experience from a bare laptop to a
 * running opti-baseline site. Steps 1–6 are homework; Steps 7–11 are done together.
 * The page is static: the computer/shell switches and ticks run in the browser.
 */
export default function SetupGuidePage() {
  return (
    <GuideRoot>
      <a className={s.skip} href="#start">
        Skip to the guide
      </a>
      <TopBar />
      <div className={s.wrap}>
        <Toc />
        <main className={s.main}>
          <Hero />
          <BeforeYouStart />
          <TerminalBasics />
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
  );
}
