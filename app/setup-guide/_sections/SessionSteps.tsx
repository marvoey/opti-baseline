import s from '../setup-guide.module.css';
import { Check } from '../_components/controls';
import { Figure, Pin } from '../_components/Figure';
import { ProjectPath } from '../_components/FolderSetup';
import { Callout, Card, Cmd, Example, ModKey, Only, Step, StopKey } from '../_components/ui';
import ApiKeys from './ApiKeys';
import MainEnv from './MainEnv';
import { FACILITATOR } from '../_lib/contact';

/** Steps 9–12: connect the project to the CMS and run it (Step 10, the API keys, is in ApiKeys.tsx). The live session on Nov 24, 2026 has passed, so everyone now does these on their own. */

const N = { os: 'win', mode: 'native' } as const; // PowerShell (default)

function ConnectToCms() {
  return (
    <Card id="connect" className={s.connect}>
      <div className={s.eyebrow}>Steps 9–12</div>
      <h2>Next: connect the project to the CMS</h2>
      <p>
        If you’ve ticked everything up to Step 8, your laptop is ready and you can carry on with Step 9. These steps need
        private keys from the CMS, so take your time and don’t share the keys with anyone.
      </p>
      <h3>In these steps you’ll</h3>
      <ol start={9}>
        <li>create the settings file that connects your site to the CMS</li>
        <li>get your API keys from the CMS and add them to that file</li>
        <li>check the connection, add the project’s two content types to your CMS, and start the website</li>
        <li>install Mark Desktop, choose your CMS instance in it, and give it your project folder</li>
      </ol>
      <Callout kind="tip" title="Before you start">
        Check you can sign in to your CMS with your Optimizely account. Step 10 needs <b>administrator access</b> there,
        so if you can’t find the API Keys page, ask your CMS administrator to give you that access first. Nothing else is
        needed from anyone: every value is on this page or in your own CMS.
      </Callout>
    </Card>
  );
}
const W = { os: 'win', mode: 'wsl' } as const; // WSL (advanced)

function Step9() {
  return (
    <Step n={9} title="Add your .env file" meta="About 3 min">
      <p>
        The <code>.env</code> file holds the passwords that connect your site to Optimizely CMS. The project comes with
        a template called <code>.env.example</code>. It already has the port number and the two content IDs filled in.
        You’ll copy it into your own <code>.env</code> file, then add your private keys in Step 10.
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
          Leave the rest of the template as it is. The port number and the two content IDs are already filled in. You’ll
          fill in the empty lines for your private keys in <a href="#s10">Step 10</a>.
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
    <Step n={11} title="Check it works" meta="About 10 min">
      <p>
        Three things happen here. You check that your laptop can talk to your CMS. You add the two building blocks the
        project needs to the CMS. Then you start the website.
      </p>

      <h3>a. Check the connection to the CMS</h3>
      <Cmd c="yarn cms:align" what="Compares the project with your CMS. It only reads, and changes nothing." />
      <p>
        On a new CMS, this check <b>ends with a red ✗ and the word “failure”. That’s expected</b>, so don’t worry. It
        means your laptop reached your CMS and signed in. The CMS just doesn’t have the project’s two building blocks
        yet:
      </p>
      <Example
        label="Simplified example of what you’ll see the first time. Don’t type this."
        lines={[
          'cms:align — 2 local type(s) vs https://api.cms.optimizely.com',
          '',
          '  ✗ Page                           MISSING in CMS  → npm run cms:push',
          '  ✗ RichTextBlock                  MISSING in CMS  → npm run cms:push',
          '',
          '  0 in sync · 2 missing · 0 drift · 0 lint error(s) · 0 lint warning(s)',
          '  Fix missing:  npm run cms:push -- --dry   (then without --dry)',
          '',
          '✗ cms:align: 2 failure(s)',
        ]}
      />
      <div className={s.grid}>
        <div>
          <b>What’s missing?</b>Two <i>content types</i>. A content type is a template for one kind of content.{' '}
          <code>Page</code> is a basic web page. <code>RichTextBlock</code> is a block of formatted text.
        </div>
        <div>
          <b>Why are they missing?</b>Your CMS is brand new and empty. The project describes both types in its own
          code (the <code>cms</code> folder). In part b you copy them into your CMS.
        </div>
      </div>
      <ul>
        <li>
          <b>As expected:</b> the only <b>✗</b> lines are <code>Page</code> and <code>RichTextBlock</code>, marked{' '}
          <b>MISSING in CMS</b>. Go on to part b. (The hint says <code>npm run</code>. In this guide we use{' '}
          <code>yarn</code> for the same thing.)
        </li>
        <li>
          <b>Already fine:</b> both lines show <b>✓ in sync</b> and the last line says <b>passed</b>. Your CMS already
          has them. Skip part b.
        </li>
        <li>
          <b>Not working:</b> the output mentions <code>401</code>, <code>403</code>, <i>unauthorized</i> or{' '}
          <i>Missing environment variable</i>. Your keys aren’t right yet. Check them against{' '}
          <a href="#s10">Step 10</a>, or see <a href="#help">Troubleshooting</a>.
        </li>
        <li>
          <b>Something else:</b> a red <b>DRIFT</b>, or errors under <b>Lint</b>. Don’t push anything. Check{' '}
          <a href="#help">Troubleshooting</a>, or ask {FACILITATOR}.
        </li>
      </ul>
      <Check id="s11a" />

      <h3>b. Add Page and RichTextBlock to your CMS</h3>
      <p>First, a preview. It shows what would be added and sends nothing:</p>
      <Cmd c="yarn cms:push --dry" what="Lists the content types your CMS is missing. Changes nothing." />
      <Example
        label="Simplified example. Don’t type this."
        lines={[
          'Content types to push (2): [DRY RUN — nothing sent]',
          '  → Page',
          '  → RichTextBlock',
          '',
          'Re-run without --dry to apply.',
        ]}
      />
      <p>
        You might also see a few lines like <i>Content Type Page found in …</i> above the list. That’s normal. Check that
        the list shows <b>exactly</b> <code>Page</code> and <code>RichTextBlock</code>. If it shows anything else, stop and
        tell {FACILITATOR}.
      </p>
      <p>Now add them for real:</p>
      <Cmd
        c="yarn cms:push --allow-main"
        what={
          <>
            Copies the two content types into your CMS. It takes a few seconds. <code>--allow-main</code> unlocks a
            safety lock: the project won’t change a CMS from the main folder unless you add it. You need it only this
            once, to set up your new CMS.
          </>
        }
      />
      <Example
        label="Simplified example. Don’t type this."
        lines={['Content types to push (2):', '  → Page', '  → RichTextBlock', '', 'Uploading…', '', '✓ Upload complete']}
      />
      <Callout kind="warn" title={'Seeing “Refusing to write to the CMS from the baseline branch "main"”?'}>
        You ran it without <code>--allow-main</code>. Nothing was changed. Copy the command above and run it exactly as
        shown.
      </Callout>
      <Callout kind="tip" title="Safe to run twice">
        <code>cms:push</code> only <b>adds</b> content types that are missing. It never changes or deletes anything that’s
        already in your CMS. If you’re not sure it worked, run it again: it says <i>Nothing to push</i>.
      </Callout>

      <h3>c. Check again</h3>
      <Cmd c="yarn cms:align" what="The same check as in part a. This time it should pass." />
      <Example
        label="Simplified example. Don’t type this."
        lines={[
          '  ✓ Page                           in sync',
          '  ✓ RichTextBlock                  in sync',
          '',
          '  2 in sync · 0 missing · 0 drift · 0 lint error(s) · 0 lint warning(s)',
          '✓ cms:align: passed',
        ]}
      />
      <p>
        <b>Working:</b> both lines show <b>✓ in sync</b> and the last line says <b>passed</b>. In the CMS, you can now
        also find them under <b>Settings → Content Types</b>, as <b>Page (v1)</b> and <b>Rich Text (Prose)</b>.
      </p>
      <Check id="s11-push" />

      <h3>d. Start the website on your laptop</h3>
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
      <Check id="s11b" />
    </Step>
  );
}

const MARK_DOWNLOAD = 'https://www.optimizely.com/downloads/ai';
const MARK_DOCS = 'https://docs.optimizely.com/agent-platform/docs/mark-desktop-app';

/**
 * Step 12: Mark Desktop. Order matters: install (a), log in and select the CMS product instance (b), then
 * add the project folder as a Workspace (c). Source: the Mark Desktop app docs (MARK_DOCS) and the download
 * page (MARK_DOWNLOAD), which offers Windows, Mac and Linux downloads.
 */
function Step12() {
  return (
    <Step n={12} title="Set up Mark Desktop" meta="About 10 min">
      <p>
        <b>Mark Desktop</b> is the Mark app for your computer. Unlike Mark in a web browser, it can work with files on your
        laptop, so Mark can read your project and help build your demo site. In this step you install it, tell it which
        CMS to use, and give it your project folder.
      </p>

      <h3>a. Download and install Mark Desktop</h3>
      <ol>
        <li>
          Open the download page:{' '}
          <a href={MARK_DOWNLOAD} target="_blank" rel="noopener noreferrer">
            optimizely.com/downloads/ai
          </a>
          .
        </li>
        <li>
          The page offers <b>Windows</b>, <b>Mac</b> and <b>Linux</b>. Choose{' '}
          <Only os="win" as="b">Windows</Only>
          <Only os="mac" as="b">Mac</Only> in the drop-down, then click <b>Download app</b>.
        </li>
        <li>
          Open the downloaded file and follow the steps on screen to install it.
          <Only os="mac" as="span"> Mark Desktop needs <b>macOS 13 or later</b>.</Only>
        </li>
        <li>
          When it’s finished, open <b>Mark</b>
          <Only os="win" as="span"> from the Start menu</Only>
          <Only os="mac" as="span"> from your Applications folder</Only>, if it hasn’t opened by itself.
        </li>
      </ol>
      <Only os="win">
        <Only mode="wsl">
          <Callout kind="tip" title="Using WSL?">
            Install Mark Desktop on Windows, not inside Ubuntu. It can still open your project folder in Ubuntu.
          </Callout>
        </Only>
      </Only>
      <p className={s.what}>
        By downloading Mark Desktop you agree to Optimizely’s Agent Platform Desktop App Terms, linked on the download page.
        More help:{' '}
        <a href={MARK_DOCS} target="_blank" rel="noopener noreferrer">
          Mark Desktop documentation
        </a>
        .
      </p>
      <Check id="s12-install" />

      <h3>b. Log in and choose your CMS instance</h3>
      <ol>
        <li>
          In Mark Desktop, click <b>Log in</b> and sign in with your Optimizely account (Opti ID). That’s the same account
          you use for the CMS.
        </li>
        <li>
          Choose your <b>Organization</b> and <b>Instance</b> from the two drop-down lists, then click <b>Go</b>. Pick the
          same Organization that’s shown at the top left of your CMS, next to the Optimizely logo. If a list has only one
          choice, pick that one. You can switch later, so you can’t get this wrong.
        </li>
        <li>
          The Mark chat page opens. Look at its <b>top-right corner</b> for <b>Select Product Instance</b> (marker{' '}
          <Pin n={1} />
          ). Click it and choose <b>your CMS instance</b>.
        </li>
      </ol>
      <Figure
        src="/setup-guide/mark/mark-select-instance.png"
        width={1310}
        height={376}
        alt="The Mark chat page. Marker 1 is on the Select Product Instance button in the top-right corner. Marker 2 is on the Workspaces button above the chat box."
      >
        <Pin n={1} /> <b>Select Product Instance</b>, top right: choose your CMS here. <Pin n={2} /> <b>Workspaces</b>,
        above the chat box: you’ll use it in part c.
      </Figure>
      <Callout kind="warn" title="Pick the CMS from Step 10">
        Your organization may have several product instances, for example other CMSs or Web Experimentation. Choose the
        CMS you got your API keys from in Step 10. Its name is shown in the bar at the top of the CMS, after{' '}
        <i>Content Management System</i>, for example <i>Content Management System (jsmith001: Production)</i>. While the
        button still says <b>Select Product Instance</b>, no instance is chosen yet.
      </Callout>
      <p>
        <b>Why it matters:</b> Mark works with the product instance chosen here. If none is chosen, or the wrong one, Mark
        can’t see your CMS, or it looks at a different one. This is a separate choice from the one at login: the login
        picks your Mark account, and this button picks the Optimizely product Mark works with.
      </p>
      <Check id="s12-instance" />

      <h3>c. Give Mark your project folder</h3>
      <p>
        Mark can only open folders you add to its <b>Workspaces</b>. First, get your project folder’s full location (its{' '}
        <i>path</i>):
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
          Select the line it prints and copy it (<kbd>Cmd ⌘</kbd> <kbd>C</kbd>).
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
          Select the line it prints and copy it (<kbd>Ctrl</kbd> <kbd>C</kbd>).
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
      </Only>
      <p>Then, in Mark Desktop:</p>
      <ol>
        <li>
          Click <b>Workspaces</b>, just above the chat box (marker <Pin n={2} />
          ), then <b>Add Workspace</b>.
        </li>
        <li>
          A folder window opens. Go to your project folder by pasting the path:
          <Only os="mac" as="span">
            {' '}
            press <kbd>Cmd ⌘</kbd> <kbd>Shift</kbd> <kbd>G</kbd>, paste with <kbd>Cmd ⌘</kbd> <kbd>V</kbd>, press{' '}
            <kbd>Enter</kbd>, then click <b>Open</b>.
          </Only>
          <Only os="win" as="span">
            {' '}
            click the address bar at the top of the window, paste with <kbd>Ctrl</kbd> <kbd>V</kbd>, press <kbd>Enter</kbd>,
            then click <b>Select Folder</b>.
          </Only>
        </li>
        <li>
          Click <b>Done</b>. Your folder, <code>opti-baseline-main</code>, appears in the list.
        </li>
      </ol>
      <Callout kind="tip" title="Add only this project folder">
        Mark can read and change everything inside a workspace, so don’t add your whole home folder. Mark Desktop asks you to
        pick a smaller folder if you try. To take access away later, click <b>Workspaces</b> and then <b>Remove</b> next to
        the folder.
      </Callout>
      <Check id="s12" />
    </Step>
  );
}

export default function SessionSteps() {
  return (
    <>
      <ConnectToCms />
      <MainEnv />
      <Step9 />
      <ApiKeys />
      <Step11 />
      <Step12 />
    </>
  );
}
