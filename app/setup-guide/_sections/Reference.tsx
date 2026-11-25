import s from '../setup-guide.module.css';
import { FolderName } from '../_components/FolderSetup';
import { SiteCommands, SiteInputs } from '../_components/SiteSetup';
import { Callout, Card, Cmd, Cmds, Help, ModKey, Only, StopKey } from '../_components/ui';
import { SHELL_FILES } from './PrepSteps';
import { FACILITATOR } from '../_lib/contact';

const N = { os: 'win', mode: 'native' } as const; // PowerShell (default)
const W = { os: 'win', mode: 'wsl' } as const; // WSL (advanced)

export function Ready() {
  return (
    <Card id="ready" className={s.ready}>
      <h2>You’re ready. You’re free to build.</h2>
      <p>
        When every box above is ticked, your laptop is set up. You’ll create <b>your</b> demo site with
        one command. Tell the guide about your site and your commands appear below, ready to copy.
      </p>
      <SiteInputs />
      <SiteCommands />
      <Callout kind="warn" title="Check before you create">
        The preview needs the <code>.env</code> from Steps 9 and 10 and changes nothing. The second command creates your site’s
        own folder, settings and pages in your CMS, so <b>only run it once the preview looks right</b>.
      </Callout>
      <p>
        It starts from the <code>.env</code> you build in Steps 9 and 10. That file decides where your new site is created in the CMS.
        Your site runs on your own laptop, at a <code>http://localhost:…</code> address. <a href="#mainenv">Here is how</a>.
      </p>
    </Card>
  );
}

export function ComingBack() {
  return (
    <Card id="later">
      <h2>Coming back later</h2>
      <p>Each time you sit down to work on your site:</p>
      <ol>
        <li>
          Open VS Code. Click <b>File → Open Recent</b> and choose your project folder.
        </li>
        <Only {...W} as="li">
          Check that the bottom-left corner says <b>WSL: Ubuntu</b>.
        </Only>
        <li>
          Open a terminal (<b>Terminal → New Terminal</b>) and run <code>yarn dev</code>.
        </li>
        <li>
          Open the <code>http://localhost:…</code> address it shows in your browser.
        </li>
        <li>
          When you’re done, press <StopKey /> <kbd>C</kbd> in that terminal to stop the website.
        </li>
      </ol>
      <p>You don’t need to repeat any install steps.</p>
    </Card>
  );
}

export function GroundRules() {
  return (
    <Card id="rules">
      <h2>Ground rules</h2>
      <ul>
        <li>
          <b>
            Leave the <code>opti-baseline-main</code> folder where it is.
          </b>{' '}
          Don’t rename, move or delete it. Every site you create later depends on it.
        </li>
        <li>
          <b>
            Keep <code>.env</code> private.
          </b>{' '}
          It holds the passwords to your CMS.
        </li>
        <li>
          <b>Ignore the Source Control panel.</b> The branch-shaped icon on VS Code’s left bar may show a number. That’s
          normal. Don’t click <b>Commit</b>, <b>Sync</b> or <b>Publish</b>.
        </li>
        <li>
          <b>If a command says it “refuses” to run</b>, you’re probably in the wrong folder or VS Code window. That’s a
          built-in safety check. Open the right folder with <b>File → Open Recent</b>, open a new terminal, and check the
          prompt shows that folder’s name.
        </li>
        <li>
          <b>
            Everything you see at <code>localhost</code> is private to your laptop.
          </b>{' '}
          Nothing you do here appears on a public website.
        </li>
      </ul>
    </Card>
  );
}

function ShellFileTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Computer</th>
          <th>Shell</th>
          <th>Settings file</th>
        </tr>
      </thead>
      <tbody>
        {SHELL_FILES.map(({ os, shell, file, label }) => (
          <tr key={`${os}-${shell}`}>
            <td>{label}</td>
            <td>{shell}</td>
            <td>
              <code>~/{file}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Troubleshooting() {
  return (
    <Card id="help">
      <h2>Troubleshooting</h2>
      <p>Click a problem to see how to fix it. You can’t damage anything by trying a fix twice.</p>

      <Help q="I’m stuck and don’t know what went wrong">
        <p>No problem. You can send {FACILITATOR} the error so he can help:</p>
        <ol>
          <li>In the terminal, drag your mouse over the error text to select it.</li>
          <li>
            Copy it with <ModKey /> <kbd>C</kbd>.
          </li>
          <li>Paste it into a message, along with the step number you were on.</li>
        </ol>
        <p>
          A screenshot works too. Just never include your <code>.env</code> file.
        </p>
      </Help>

      <Help q="The terminal seems frozen, with no prompt">
        <p>It’s usually one of these:</p>
        <ul>
          <li>
            <b>It’s still working.</b> Some steps take minutes. Wait a little longer.
          </li>
          <li>
            <b>It’s waiting for you.</b> Look for a question, such as a password or <code>[Y/n]</code>, and answer it.
          </li>
          <li>
            <b>The website is running</b> (after <code>yarn dev</code>). That’s normal. Open another terminal with{' '}
            <b>+</b>.
          </li>
        </ul>
        <p>
          Still stuck? Press <StopKey /> <kbd>C</kbd> to stop it, then run the command again.
        </p>
      </Help>

      {/* ───────── Windows with PowerShell ───────── */}
      <Only {...N}>
        <Help
          q={
            <>
              <code>winget</code> is not recognized
            </>
          }
        >
          <p>
            Open the <b>Microsoft Store</b>, search for <b>App Installer</b> and click <b>Update</b> (or <b>Get</b>). Then
            open a new PowerShell window and run <code>winget --version</code> again. On a work laptop, IT may have removed
            it: ask them to install <b>App Installer</b>, or download VS Code, Git and Node.js 22 from their websites
            instead.
          </p>
        </Help>

        <Help
          q={
            <>
              <code>yarn : File … cannot be loaded because running scripts is disabled on this system</code>
            </>
          }
        >
          <p>PowerShell is blocking Yarn’s helper script. Allow scripts for your account, then open a new terminal:</p>
          <Cmd c="Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force" />
          <p>
            If you get an error that mentions <i>“overridden by a policy”</i>, your company controls this setting. Ask IT
            to allow <code>RemoteSigned</code> for PowerShell.
          </p>
        </Help>

        <Help
          q={
            <>
              <code>git</code>, <code>node</code>, <code>yarn</code> or <code>code</code> “is not recognized”
            </>
          }
        >
          <p>
            Windows shows new tools only to apps that start <i>after</i> they were installed. Close VS Code completely (
            <b>File → Exit</b>), open it again from the Start menu and open a new terminal. Still not found? Restart
            Windows, then try again.
          </p>
          <p>
            For <code>yarn</code> only: it also needs the administrator step in <a href="#s5">Step 5a</a>.
          </p>
        </Help>

        <Help q="The Node.js command says a newer version is already installed, or node -v shows v20 or v24">
          <p>
            Another Node.js on your laptop is in the way. Open <b>Settings → Apps → Installed apps</b>, uninstall every{' '}
            <b>Node.js</b> entry, then run the Node.js command from <a href="#s2">Step 2</a> again. Close VS Code
            completely, open it again, and check with <code>node -v</code>.
          </p>
        </Help>

        <Help q="Windows asks for an administrator password, or I can’t click Yes">
          <p>
            Installing Git and Node.js needs administrator rights on your laptop. Ask IT to give you temporary access, or
            to run the install commands for you from <a href="#s2">Step 2</a>.
          </p>
        </Help>

        <Help q="VS Code’s terminal isn’t PowerShell (it says cmd or Git Bash)">
          <p>
            Press <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>P</kbd>, type <b>Terminal: Select Default Profile</b> and click{' '}
            <b>PowerShell</b>. Then click the bin icon on the terminal panel and open a new terminal with{' '}
            <b>Terminal → New Terminal</b>. The line should start with <code>PS</code>.
          </p>
        </Help>

        <Help
          q={
            <>
              <code>EPERM</code>, <i>operation not permitted</i> or <i>file in use</i> during <code>yarn install</code>
            </>
          }
        >
          <p>
            Something is holding a file open, often antivirus software or another window using the project. Stop the
            website if it’s running (<StopKey /> <kbd>C</kbd>), close other VS Code windows for this project, then run{' '}
            <code>yarn install</code> again. If it keeps happening, ask IT to exclude your container folder (
            <code>
              <FolderName which="container" />
            </code>
            ) from real-time scanning.
          </p>
        </Help>

        <Help q="An error about a path or file name being too long">
          <p>
            Windows limits file paths to 260 characters unless you turn that off. Open an <b>administrator</b> PowerShell
            (<b>Start</b>, type PowerShell, right-click, <b>Run as administrator</b>) and run these two commands, one at a
            time. Then run the command that failed again.
          </p>
          <Cmds
            where="PowerShell (as administrator)"
            items={[
              { c: "Set-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\FileSystem' -Name LongPathsEnabled -Value 1" },
              { c: 'git config --global core.longpaths true' },
            ]}
          />
        </Help>
      </Only>

      {/* ───────── macOS and WSL (shell-based) ───────── */}
      <Only unix>
        <Help
          q={
            <>
              <code>nvm: command not found</code>, or Node disappears in a new terminal
            </>
          }
        >
          <p>
            nvm saved its settings in a file your shell doesn’t read. This usually means the Shell switch at the top
            doesn’t match your real shell. Run <code>echo $0</code>, set the switch to match, then go back and run{' '}
            <a href="#s4">Step 4a</a> again. The commands there change to match the switch.
          </p>
          <p>
            Then run <code>nvm alias default 22</code> and open a new terminal. For reference, the settings file for each
            combination is:
          </p>
          <ShellFileTable />
        </Help>

        <Help
          q={
            <>
              <code>node -v</code> doesn’t show v22
            </>
          }
        >
          <Cmds items={[{ c: 'nvm use 22' }, { c: 'nvm alias default 22' }]} />
          <p>
            Open a new terminal and run <code>node -v</code> again. If it still isn’t v22, another copy of Node on your
            laptop is getting in the way. Ask {FACILITATOR} for help.
          </p>
        </Help>

        <Help
          q={
            <>
              <code>yarn: command not found</code>
            </>
          }
        >
          <p>Run this, then open a new terminal:</p>
          <Cmd c="corepack enable" />
        </Help>
      </Only>

      <Help
        q={
          <>
            <code>yarn --version</code> shows 1.22 instead of 4.14.1
          </>
        }
      >
        <Cmd c="corepack install --global yarn@4.14.1" />
        <p>Then open a new terminal and check again.</p>
      </Help>

      <Help
        q={
          <>
            <code>yarn install</code> fails, or you see <i>Cannot find module</i>
          </>
        }
      >
        <p>Yarn is probably missing its setting from Step 5. Run these two commands:</p>
        <Cmds items={[{ c: 'yarn config set --home nodeLinker node-modules' }, { c: 'yarn install' }]} />
        <p>
          If the Explorer shows files called <code>.pnp.cjs</code> or <code>.pnp.loader.mjs</code>, right-click each
          one, choose <b>Delete</b>, then run <code>yarn install</code> again.
        </p>
      </Help>

      <Only unix>
        <Help
          q={
            <>
              <code>EACCES</code> or <i>permission denied</i>
            </>
          }
        >
          <p>
            Don’t add <code>sudo</code> to <code>yarn</code> or <code>npm</code> commands. That makes things worse. Ask
            {FACILITATOR} for help.
          </p>
        </Help>
      </Only>

      <Help
        q={
          <>
            <i>Missing required environment variable</i> when starting the site
          </>
        }
      >
        <p>
          The site can’t find your <code>.env</code> file. Check it’s named exactly <code>.env</code>, not{' '}
          <code>env</code> or <code>.env.txt</code>. It must sit next to <code>package.json</code>, not inside another
          folder. Run{' '}
          <Only unix as="span">
            <code>ls -a</code>
          </Only>
          <Only {...N} as="span">
            <code>Get-ChildItem -Force</code>
          </Only>{' '}
          to check.
        </p>
      </Help>

      <Help
        q={
          <>
            <code>yarn cms:align</code> or <code>yarn cms:push</code> shows 401, 403 or <i>unauthorized</i>
          </>
        }
      >
        <p>
          <code>401</code> usually means the Client ID or Secret in your <code>.env</code> was copied wrongly. Check those
          two lines against <a href="#s10">Step 10</a>: nothing missing, no spaces and no quote marks. <code>403</code>{' '}
          usually means your key hasn’t been given access rights yet. Go back to “Give your new key
          full access” in <a href="#s10">Step 10</a>, part c: with <b>Root</b> selected in <b>Settings → Set Access Rights</b>,
          add your key and tick all six boxes.
        </p>
      </Help>

      <Help
        q={
          <>
            <code>yarn cms:align</code> ends with <i>failure</i> and says Page and RichTextBlock are <i>MISSING in CMS</i>
          </>
        }
      >
        <p>
          That’s expected on a new CMS: it doesn’t have the project’s two content types yet. Add them with part b of{' '}
          <a href="#s11">Step 11</a> (<code>yarn cms:push --dry</code>, then <code>yarn cms:push --allow-main</code>), then
          run <code>yarn cms:align</code> again.
        </p>
      </Help>

      <Help
        q={
          <>
            <code>yarn cms:push</code> says <i>Refusing to write to the CMS from the baseline branch “main”</i>
          </>
        }
      >
        <p>
          That’s a safety lock: the project won’t change a CMS from the main folder unless you ask for it. To add Page and
          RichTextBlock to your new CMS, run:
        </p>
        <Cmd c="yarn cms:push --allow-main" />
        <p>Nothing was changed by the attempt that was refused.</p>
      </Help>

      <Help
        q={
          <>
            <code>yarn cms:align</code> shows <i>DRIFT</i> or <i>Lint</i> errors
          </>
        }
      >
        <p>
          The CMS already has a type with the same name but different settings, or the project’s code has a problem. Don’t
          run <code>cms:push</code> to fix it (it never changes existing types). Copy the output and send it to {FACILITATOR}.
        </p>
      </Help>

      <Help q="Mark can’t find my CMS content, or answers about a different CMS">
        <p>
          Check the button in the top-right corner of Mark. It should show your CMS instance (the one from Step 10), not{' '}
          <b>Select Product Instance</b> or another product. Click it and choose your CMS. See{' '}
          <a href="#s12">Step 12</a>, part b.
        </p>
      </Help>

      <Help
        q={
          <>
            The preview says <i>HOME_PAGE_CONTENT_ID … was not found in the CMS</i> (or the same for{' '}
            <code>ASSET_BASE_FOLDER_ID</code>)
          </>
        }
      >
        <p>
          The two ID lines in your main <code>.env</code> should be exactly as they are in <code>.env.example</code>, where
          they came from in <a href="#s9">Step 9</a>. They’re the same for every CMS. Open <code>.env.example</code>, copy
          its <code>HOME_PAGE_CONTENT_ID</code> and <code>ASSET_BASE_FOLDER_ID</code> lines, and paste them over those two
          lines in <code>.env</code>. Check that each name appears only once and that you saved the file. If it still
          happens after that, ask {FACILITATOR}.
        </p>
      </Help>

      <Help q="I closed the Save your Secret window before copying the Secret">
        <p>The CMS can’t show a Secret a second time. Create a new key instead:</p>
        <ol>
          <li>
            In the CMS, go to <b>Settings → API Keys</b> and click <b>Create API Key</b> again.
          </li>
          <li>
            Give it a new name, such as <code>jsmith-setup-guide-2</code>.
          </li>
          <li>
            Paste the new Client ID and Secret into your <code>.env</code> (<a href="#s10">Step 10</a>, part c), replacing
            the old ones, and save.
          </li>
        </ol>
        <p>The old key is harmless: nobody has its secret. You can leave it in the list.</p>
      </Help>

      <Help
        q={
          <>
            <code>EADDRINUSE</code> or <i>port already in use</i>
          </>
        }
      >
        <p>
          The website is already running in another terminal or VS Code window. Find that terminal and press{' '}
          <StopKey /> <kbd>C</kbd>, then run <code>yarn dev</code> again.
        </p>
      </Help>

      <Help
        q={
          <>
            Download errors mentioning <i>certificate</i> or <i>CERT</i>
          </>
        }
      >
        <p>
          A company VPN or network filter is blocking the download. Turn off the VPN or try a different network (for
          example your phone’s hotspot), then run the command again.
        </p>
      </Help>

      <Help
        q={
          <>
            I changed my <code>.env</code> but nothing changed
          </>
        }
      >
        <p>
          Stop the website (<StopKey /> <kbd>C</kbd>) and run <code>yarn dev</code> again. The website reads{' '}
          <code>.env</code> only when it starts.
        </p>
      </Help>

      <Only unix>
        <Help q="VS Code shows a different shell from the switch, or I want to change it">
          <p>
            Press <ModKey /> <kbd>Shift</kbd> <kbd>P</kbd>, type <b>Terminal: Select Default Profile</b> and click{' '}
            <b>zsh</b> or <b>bash</b>. Open a new terminal with <b>+</b>, run <code>echo $0</code>, and set the Shell
            switch at the top to match.
          </p>
          <p>If you change shells after Step 4, redo Step 4a. You don’t need to reinstall Node.</p>
        </Help>

        <Help
          q={
            <>
              <code>echo $0</code> shows something other than zsh or bash
            </>
          }
        >
          <p>
            This guide covers zsh and bash only. Use the item above to switch VS Code to one of them. You don’t need to
            change anything else on your computer.
          </p>
        </Help>

        <Help
          q={
            <>
              <code>code: command not found</code>
            </>
          }
        >
          <Only os="mac" as="p">
            In VS Code, press <kbd>Cmd ⌘</kbd> <kbd>Shift</kbd> <kbd>P</kbd>, type <b>shell command</b> and click{' '}
            <b>Shell Command: Install ‘code’ command in PATH</b>. Then open a new terminal and try again.
          </Only>
          <Only {...W} as="p">
            Reinstall VS Code with <b>Add to PATH</b> ticked, then restart Windows. Or, in VS Code, press <kbd>F1</kbd> and
            choose <b>WSL: Connect to WSL</b>.
          </Only>
        </Help>
      </Only>

      <Only os="mac">
        <Help
          q={
            <>
              Mac: <i>The default interactive shell is now zsh</i>
            </>
          }
        >
          <p>
            This message means your shell is <b>bash</b>. It’s harmless, and this guide works with bash. To hide the
            message, run:
          </p>
          <Cmd c="echo 'export BASH_SILENCE_DEPRECATION_WARNING=1' >> ~/.bash_profile" />
        </Help>
      </Only>

      <Only unix shell="zsh">
        <Help
          q={
            <>
              <code>zsh: no matches found</code>
            </>
          }
        >
          <p>
            zsh treats <code>*</code> and <code>?</code> as special characters. Put quotes around the word that contains
            them and run the command again, or ask {FACILITATOR}.
          </p>
        </Help>
      </Only>

      {/* ───────── WSL only ───────── */}
      <Only {...W}>
        <h3>WSL (advanced) only</h3>
        <Help
          q={
            <>
              The terminal line starts with <code>{'PS C:\\>'}</code>
            </>
          }
        >
          <p>
            You’re in Windows PowerShell, not Ubuntu. Click the coloured <b>&gt;&lt;</b> button in VS Code’s bottom-left
            corner and choose <b>Connect to WSL</b>, then open a new terminal. The bottom-left corner should say{' '}
            <b>WSL: Ubuntu</b>.
          </p>
        </Help>
        <Help
          q={
            <>
              <code>wsl --install</code> only shows a page of help text
            </>
          }
        >
          <p>WSL is already on your computer, but Ubuntu isn’t. Run this instead, in PowerShell as administrator:</p>
          <Cmd c="wsl --install -d Ubuntu" where="PowerShell (as administrator)" />
        </Help>
        <Help
          q={
            <>
              Error mentioning <i>virtualization</i> or <code>0x80370102</code>
            </>
          }
        >
          <p>WSL needs a laptop setting called virtualization. Ask IT to turn it on for WSL.</p>
        </Help>
        <Help q="Everything is very slow, or the site doesn’t update when files change">
          <p>
            The project may have been downloaded into your Windows drive (the folder path starts with{' '}
            <code>/mnt/c/</code>) instead of Ubuntu. Check that the bottom-left corner says <b>WSL: Ubuntu</b>, then
            redo Step 7.
          </p>
        </Help>
      </Only>
    </Card>
  );
}

const ENV_ROWS: [setting: string, purpose: React.ReactNode, newSite: React.ReactNode][] = [
  ['PORT', 'Which address number the site uses on your laptop. The main copy uses 3034.', 'A new number: the first free one from 3035.'],
  ['OPTIMIZELY_DEFAULT_LOCALE', 'The site’s default language.', 'Copied.'],
  ['OPTIMIZELY_CMS_URL', 'The address of the CMS.', 'Copied.'],
  [
    'OPTIMIZELY_CMS_CLIENT_ID / _SECRET',
    'A username and password that let the tools read and update the CMS setup. Get them in Step 10.',
    'Copied. Also used by site:new to sign in to the CMS.',
  ],
  [
    'OPTIMIZELY_GRAPH_SINGLE_KEY',
    <>
      <b>Required.</b> The key for reading published content. The site won’t start without it. Get it in Step 10.
    </>,
    'Copied.',
  ],
  ['OPTIMIZELY_GRAPH_GATEWAY', 'The address for reading content. Optional.', 'Copied.'],
  [
    'DEPLOYED_URL',
    'The site’s public web address. Used to find the right site’s content.',
    'A new address on your laptop, such as http://localhost:3035.',
  ],
  [
    'SITE_BRANCH / SITE_PREFIX / SITE_NAME',
    'Which demo site this folder belongs to. Used by safety checks.',
    'Set from what you type into the command.',
  ],
  [
    'HOME_PAGE_CONTENT_ID / ASSET_BASE_FOLDER_ID',
    'Where the site’s pages and shared content live in the CMS.',
    'Point at the new site’s own start page and asset folder. In the main .env they point at the top of the CMS (the template already has them).',
  ],
  ['NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID', 'Optional. Turns on Optimizely Web Experimentation.', 'Copied.'],
  [
    'MARK_TOOLS_*',
    'Optional. Lets Mark agents read and edit the project’s files.',
    'The name and token are new for each site. Any other lines are copied.',
  ],
];

export function EnvReference() {
  return (
    <Card id="envref">
      <h2>.env reference (optional reading)</h2>
      <p>
        You fill in the main file yourself in Steps 9 and 10, and
        the <code>site:new</code> command writes each new site’s file from it. This table explains what’s inside, and what{' '}
        <code>site:new</code> does with each line. The full story is in <a href="#mainenv">Why the main .env matters</a>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>What it’s for</th>
            <th>In a new site’s .env</th>
          </tr>
        </thead>
        <tbody>
          {ENV_ROWS.map(([setting, purpose, newSite]) => (
            <tr key={setting}>
              <td>
                <code>{setting}</code>
              </td>
              <td>{purpose}</td>
              <td>{newSite}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={s.foot}>opti-baseline · Next.js 16 · Optimizely CMS SDK v2 · Node 22 · Yarn 4.14.1</p>
    </Card>
  );
}
