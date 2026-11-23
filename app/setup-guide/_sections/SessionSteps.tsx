import { Check } from '../_components/controls';
import { Callout, Cmd, Cmds, Example, ModKey, Only, Step, StopKey } from '../_components/ui';

/** Steps 7–11: done together in the session. */

function Step7() {
  return (
    <Step n={7} title="Download the project" meta="About 2 min · together in the session">
      <p>
        Now download the project from GitHub. Developers call this <i>cloning</i>. The folder names matter, because the
        tools later create each demo site in a folder next to this one, so copy them exactly. Run these four commands in
        VS Code’s terminal, in order:
      </p>
      <Cmds
        items={[
          {
            c: 'mkdir -p ~/Opps/000-0-opti-baseline',
            what: (
              <>
                Creates the folders (<code>~</code> means your home folder). It prints nothing.
              </>
            ),
          },
          {
            c: 'cd ~/Opps/000-0-opti-baseline',
            what: 'Moves the terminal into that folder, like double-clicking it. It prints nothing, but the prompt now shows the folder name.',
          },
          {
            c: 'git clone https://github.com/marvoey/opti-baseline.git opti-baseline-main',
            what: (
              <>
                Downloads the project into a new folder called <code>opti-baseline-main</code>. It takes under a minute
                and ends with a line like <code>Resolving deltas: 100%… done</code>. No GitHub login is needed.
              </>
            ),
          },
          { c: 'code opti-baseline-main', what: 'Opens the project in a new VS Code window.' },
        ]}
      />
      <ol>
        <li>
          A new VS Code window opens with the project’s files listed on the left. If it asks{' '}
          <i>“Do you trust the authors of the files in this folder?”</i>, click <b>Yes, I trust the authors</b>.
        </li>
        <li>You can close the old VS Code window. Use the new one from now on.</li>
        <li>
          In the new window, open the terminal: <b>Terminal → New Terminal</b>. The prompt should include{' '}
          <code>opti-baseline-main</code>.
        </li>
      </ol>
      <Only os="mac">
        <Callout kind="tip" title="Seeing “code: command not found”?">
          Redo the “Shell Command” part of Step 2, then try the last command again.
        </Callout>
      </Only>
      <Only os="win">
        <Callout kind="warn" title="Check the bottom-left corner">
          It should still say <b>WSL: Ubuntu</b>. This keeps the project inside Ubuntu, where it runs fast.
        </Callout>
      </Only>
      <Check id="s7" />
    </Step>
  );
}

function Step8() {
  return (
    <Step n={8} title="Add your .env file" meta="About 3 min">
      <p>
        The <code>.env</code> file holds the passwords that connect your site to Optimizely CMS. Your facilitator sends
        you its contents.
      </p>
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
          Open what your facilitator sent you. Select all the text (<ModKey /> <kbd>A</kbd>) and copy it.
        </li>
        <li>
          Click inside the empty <code>.env</code> file, paste, and save with <ModKey /> <kbd>S</kbd>. A white dot on the
          file’s tab means it isn’t saved yet. The dot disappears once it’s saved.
        </li>
      </ol>
      <p>
        The <code>.env</code> file should sit next to <code>package.json</code> in the list, not inside another folder.
        Its name shows in grey, which is expected: it means the file stays private on your laptop.
      </p>
      <p>To double-check, run:</p>
      <Cmd
        c="ls -a"
        what={
          <>
            Lists every file in the project folder, including hidden ones whose names start with a dot. Look for{' '}
            <code>.env</code> in the list.
          </>
        }
      />
      <Only os="mac">
        <Callout kind="tip" title="Can’t see it in Finder?">
          That’s normal. Finder hides files whose names start with a dot. VS Code shows them.
        </Callout>
      </Only>
      <Callout kind="warn" title="Treat it like a password">
        Don’t paste its contents into chat, email or screenshots. Also leave the file called <code>.env.example</code>{' '}
        alone. It’s the blank template.
      </Callout>
      <Check id="s8" />
    </Step>
  );
}

function Step9() {
  return (
    <Step n={9} title="Install the project’s packages" meta="2–5 min">
      <Cmd
        c="yarn install"
        what="Downloads all the building blocks the website needs. It takes 2–5 minutes and prints a lot of text. Leave it alone until it finishes."
      />
      <Example lines={['➤ YN0000: · Yarn 4.14.1', '…', '➤ YN0000: · Done with warnings in 1m 12s']} />
      <ul>
        <li>
          <b>You’re done</b> when the last line says <i>Done</i> (with or without “with warnings”) and the prompt comes
          back.
        </li>
        <li>
          <b>Yellow lines and warnings are normal.</b> Red lines that say <i>error</i> are not, so check{' '}
          <a href="#help">Troubleshooting</a>.
        </li>
        <li>
          A new folder called <code>node_modules</code> appears in the Explorer. Don’t open or change it.
        </li>
      </ul>
      <Check id="s9" />
    </Step>
  );
}

function Step10() {
  return (
    <Step n={10} title="Check it works" meta="About 5 min">
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
      <Callout kind="warn" title="This terminal is now busy">
        While the website runs, this terminal won’t show a prompt or accept new commands. That’s normal. Leave it
        running. To run other commands, open a second terminal with the <b>+</b> at the top right of the terminal panel.
      </Callout>
      <p>
        <b>To stop the website</b>, click inside that terminal and press <StopKey /> <kbd>C</kbd>
        <Only os="mac" as="span"> (Control, not Command)</Only>. The prompt comes back.
      </p>
      <Check id="s10a" />
      <Check id="s10b" />
    </Step>
  );
}

function Step11() {
  return (
    <Step n={11} title="Connect the folder to Mark Desktop" meta="Optional · 2 min">
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
        <Example lines={['/Users/jsmith/Opps/000-0-opti-baseline/opti-baseline-main']} />
        <p>
          Select the line it prints, copy it (<kbd>Cmd ⌘</kbd> <kbd>C</kbd>), then attach that folder in Mark Desktop by
          pasting the path when asked.
        </p>
      </Only>
      <Only os="win">
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
        <Example lines={['\\\\wsl.localhost\\Ubuntu\\home\\jsmith\\Opps\\000-0-opti-baseline\\opti-baseline-main']} />
        <p>Then attach that folder in Mark Desktop by pasting the path when asked.</p>
      </Only>
      <Check id="s11" />
    </Step>
  );
}

export default function SessionSteps() {
  return (
    <>
      <Step7 />
      <Step8 />
      <Step9 />
      <Step10 />
      <Step11 />
    </>
  );
}
