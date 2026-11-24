import s from '../setup-guide.module.css';
import { Check } from '../_components/controls';
import { ProjectPath } from '../_components/FolderSetup';
import { Callout, Card, Cmd, Example, ModKey, Only, Step, StopKey } from '../_components/ui';
import ApiKeys from './ApiKeys';
import MainEnv from './MainEnv';

/** Steps 9–12: done together in the live session (Step 10, the API keys, is in ApiKeys.tsx). People stop after Step 8 (see HOMEWORK_LAST_STEP). */

const N = { os: 'win', mode: 'native' } as const; // PowerShell (default)
const LIVE = 'Live session · ';

function StopHere() {
  return (
    <Card id="session" className={s.session}>
      <div className={s.eyebrow}>Live session</div>
      <h2>Stop here. We’ll do Steps 9–12 together.</h2>
      <p>
        If you’ve ticked everything up to Step 8, you’re finished for now. <b>Please don’t start these steps on your
        own.</b> They need private keys from the CMS and a few values from your facilitator, and they’re quicker when we
        do them together.
      </p>
      <h3>In the session we’ll</h3>
      <ol start={9}>
        <li>create the settings file that connects your site to the CMS</li>
        <li>get your API keys from the CMS and add them to that file</li>
        <li>check the connection and start the website on your laptop</li>
        <li>connect the folder to Mark Desktop (optional)</li>
      </ol>
      <Callout kind="tip" title="Before the session">
        Join from the laptop you set up. Make sure it’s charged and on a normal internet connection. Also check you can
        sign in to the CMS your facilitator shares with you. Step 10 needs administrator access there, so tell your
        facilitator beforehand if you don’t have it. The steps are below so you can follow along on the day and look
        back at them later.
      </Callout>
    </Card>
  );
}
const W = { os: 'win', mode: 'wsl' } as const; // WSL (advanced)

function Step9() {
  return (
    <Step n={9} title="Add your .env file" meta={`${LIVE}About 3 min`}>
      <p>
        The <code>.env</code> file holds the passwords that connect your site to Optimizely CMS. The project comes with
        a blank template called <code>.env.example</code>. You’ll copy it into your own <code>.env</code> file, then fill
        in its private values in Step 10.
      </p>
      <Callout kind="tip" title="This file is the parent of your future sites">
        Later, <code>yarn site:new</code> reads this file to create each of your demo sites in the CMS and to write their
        own <code>.env</code> files. <a href="#mainenv">Read why it matters</a> before you paste.
      </Callout>
      <ol>
        <li>
          In VS Code, look at the file list on the left (called the <b>Explorer</b>). Click once on an empty space{' '}
          <b>below</b> the files, so no folder is highlighted.
        </li>
        <li>
          Move your mouse over the project name at the top of the Explorer (<b>OPTI-BASELINE-MAIN</b>). Click the{' '}
          <b>New File</b> icon that appears (a page with a <b>+</b>).
        </li>
        <li>
          Type <code>.env</code> (with the dot at the start and nothing after it) and press <kbd>Enter</kbd>. An empty
          file opens on the right.
        </li>
        <li>
          Open the template: in the same file list, click <code>.env.example</code> (it sits close to the{' '}
          <code>.env</code> you just made). Click inside its text, select all of it (<ModKey /> <kbd>A</kbd>) and copy it
          (<ModKey /> <kbd>C</kbd>). Don’t type anything in this file.
        </li>
        <li>
          Click the <code>.env</code> tab at the top to go back to your empty file. Click inside it and paste with{' '}
          <ModKey /> <kbd>V</kbd>. Then save with <ModKey /> <kbd>S</kbd>. A white dot on the file’s tab means it isn’t
          saved yet. The dot disappears once it’s saved.
        </li>
        <li>
          The template has empty spots for private values. <a href="#s10">Step 10</a> shows you where to get the keys, and
          your facilitator gives you the other values (such as the web address and the content IDs).
        </li>
      </ol>
      <p>
        The <code>.env</code> file should sit next to <code>package.json</code> in the list, not inside another folder.
        Its name shows in grey, which is expected: it means the file stays private on your laptop.
      </p>
      <p>To double-check, run:</p>
      <Only unix>
        <Cmd
          c="ls -a"
          what={
            <>
              Lists every file in the project folder, including hidden ones whose names start with a dot. Look for{' '}
              <code>.env</code> in the list.
            </>
          }
        />
      </Only>
      <Only {...N}>
        <Cmd
          c="Get-ChildItem -Force"
          what={
            <>
              Lists every file in the project folder, including hidden ones. Look for <code>.env</code> in the Name
              column.
            </>
          }
        />
      </Only>
      <Only os="mac">
        <Callout kind="tip" title="Can’t see it in Finder?">
          That’s normal. Finder hides files whose names start with a dot. VS Code shows them.
        </Callout>
      </Only>
      <Callout kind="warn" title="Treat your .env like a password">
        Don’t paste its contents into chat, email or screenshots. Only ever type passwords into <code>.env</code>, never
        into <code>.env.example</code>. The template is part of the project and isn’t private, so leave it exactly as it
        is.
      </Callout>
      <Check id="s9-env" />
    </Step>
  );
}

function Step11() {
  return (
    <Step n={11} title="Check it works" meta={`${LIVE}About 5 min`}>
      <h3>a. Check the connection to the CMS</h3>
      <Cmd c="yarn cms:align" what="Compares the project with the live CMS. It only reads, and changes nothing." />
      <Example
        lines={[
          'cms:align — 2 local type(s) vs https://api.cms.optimizely.com',
          '',
          '  ✓ Page                           in sync',
          '  ✓ RichTextBlock                  in sync',
        ]}
      />
      <ul>
        <li>
          <b>Working:</b> you see a list of items, many marked <b>✓ in sync</b>. Lines marked <b>✗</b> are about the
          shared CMS, not your laptop. Just mention them to your facilitator.
        </li>
        <li>
          <b>Not working:</b> the output mentions <code>401</code>, <code>403</code>, <i>unauthorized</i> or{' '}
          <i>missing environment variable</i>. See <a href="#help">Troubleshooting</a>.
        </li>
      </ul>

      <h3>b. Start the website on your laptop</h3>
      <Cmd c="yarn dev" what="Starts the website on your laptop. After 10–30 seconds you’ll see a few lines like the example below." />
      <Example lines={['▲ Next.js 16.4.6', '- Local:   http://localhost:3034', '✓ Ready in 3.1s']} />
      <ol>
        <li>
          Open{' '}
          <a href="http://localhost:3034" target="_blank" rel="noopener noreferrer">
            http://localhost:3034
          </a>{' '}
          in your web browser. You can also hold <ModKey /> and click the link in the terminal.
        </li>
        <li>
          The first time, the page can take up to a minute to appear while the terminal shows <i>Compiling…</i>. That’s
          normal.
        </li>
        <li>
          This main copy of the project is intentionally almost empty. A plain page means it works. An error page, or{' '}
          <i>“This site can’t be reached”</i>, means it doesn’t.
        </li>
      </ol>
      <Only {...N}>
        <Callout kind="tip" title="A Windows Firewall window pops up?">
          The first time, Windows may ask whether to let <b>Node.js</b> use the network. The website only needs your own
          laptop, so you can click <b>Cancel</b> or <b>Allow access</b>. Either way it works.
        </Callout>
      </Only>
      <Callout kind="warn" title="This terminal is now busy">
        While the website runs, this terminal won’t show a prompt or accept new commands. That’s normal. Leave it
        running. To run other commands, open a second terminal with the <b>+</b> at the top right of the terminal panel.
      </Callout>
      <p>
        <b>To stop the website</b>, click inside that terminal and press <StopKey /> <kbd>C</kbd>
        <Only os="mac" as="span"> (Control, not Command)</Only>. The prompt comes back.
      </p>
      <Check id="s11a" />
      <Check id="s11b" />
    </Step>
  );
}

function Step12() {
  return (
    <Step n={12} title="Connect the folder to Mark Desktop" meta={`${LIVE}Optional · 2 min`}>
      <p>
        If you use the Mark Desktop app, attach your project folder so Mark can read and work on it. First, get the
        folder’s full location (its <i>path</i>):
      </p>
      <Only os="mac">
        <Cmd
          c="pwd"
          what={
            <>
              Prints the full path of the folder the terminal is in. Run it in a terminal whose prompt includes{' '}
              <code>opti-baseline-main</code>.
            </>
          }
        />
        <ProjectPath kind="mac" />
        <p>
          Select the line it prints, copy it (<kbd>Cmd ⌘</kbd> <kbd>C</kbd>), then attach that folder in Mark Desktop by
          pasting the path when asked.
        </p>
      </Only>
      <Only {...N}>
        <Cmd
          c="(Get-Location).Path"
          what={
            <>
              Prints the full path of the folder the terminal is in. Run it in a terminal whose prompt includes{' '}
              <code>opti-baseline-main</code>.
            </>
          }
        />
        <ProjectPath kind="native" />
        <p>
          Select the line it prints, copy it (<kbd>Ctrl</kbd> <kbd>C</kbd>), then attach that folder in Mark Desktop by
          pasting the path when asked.
        </p>
      </Only>
      <Only {...W}>
        <Cmd
          c="explorer.exe ."
          what={
            <>
              Opens the project folder in Windows File Explorer. Run it in a terminal whose prompt includes{' '}
              <code>opti-baseline-main</code>.
            </>
          }
        />
        <p>Click the address bar at the top of File Explorer and copy the path. It looks like this:</p>
        <ProjectPath kind="wsl" />
        <p>Then attach that folder in Mark Desktop by pasting the path when asked.</p>
      </Only>
      <Check id="s12" />
    </Step>
  );
}

export default function SessionSteps() {
  return (
    <>
      <StopHere />
      <MainEnv />
      <Step9 />
      <ApiKeys />
      <Step11 />
      <Step12 />
    </>
  );
}
