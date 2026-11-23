import s from '../setup-guide.module.css';
import { Check, ShellSwitch, WinModeSwitch } from '../_components/controls';
import { FolderInputs, FolderName, FolderTree, CloneCommands } from '../_components/FolderSetup';
import { Callout, Cmd, Cmds, Example, Only, Step } from '../_components/ui';

/** Steps 1–8: installs, the project download and its packages, done on their own before the session. */

// Shorthand for the two Windows variants.
const N = { os: 'win', mode: 'native' } as const; // PowerShell (default)
const W = { os: 'win', mode: 'wsl' } as const; // WSL (advanced)

const NVM_URL = 'https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh';

/** Where nvm must save its settings for each computer + shell (the file that shell reads on start). */
export const SHELL_FILES = [
  { os: 'mac', shell: 'zsh', file: '.zshrc', label: 'macOS' },
  { os: 'mac', shell: 'bash', file: '.bash_profile', label: 'macOS' },
  { os: 'win', shell: 'bash', file: '.bashrc', label: 'Windows (WSL)' },
  { os: 'win', shell: 'zsh', file: '.zshrc', label: 'Windows (WSL)' },
] as const;

export function NvmCommands() {
  return (
    <>
      {SHELL_FILES.map(({ os, shell, file }) => (
        <Only key={`${os}-${shell}`} os={os} shell={shell} {...(os === 'win' ? { mode: 'wsl' as const } : {})}>
          <Cmds
            items={[
              {
                c: `touch ~/${file}`,
                what: (
                  <>
                    Makes sure your settings file (<code>~/{file}</code>) exists. It prints nothing, which is fine.
                  </>
                ),
              },
              {
                c: `curl -o- ${NVM_URL} | PROFILE="$HOME/${file}" bash`,
                what: 'Downloads and installs nvm. It takes about a minute and prints several lines. At the end it suggests some lines to run. You don’t need to: the next command does the same job.',
              },
              { c: `source ~/${file}`, what: 'Loads the new settings into this terminal. It prints nothing.' },
              {
                c: 'command -v nvm',
                what: (
                  <>
                    Checks nvm is ready. It should print <code>nvm</code>.
                  </>
                ),
              },
            ]}
          />
        </Only>
      ))}
    </>
  );
}

const WINGET_FLAGS = '-e --source winget --accept-package-agreements --accept-source-agreements';

function Step1() {
  return (
    <Step
      n={1}
      title={
        <>
          <Only os="mac" as="span">Open Terminal and check your shell</Only>
          <Only {...N} as="span">Set up PowerShell</Only>
          <Only {...W} as="span">Install Ubuntu (WSL)</Only>
        </>
      }
      meta={
        <>
          <Only os="mac" as="span">Nothing to install · 2 min</Only>
          <Only {...N} as="span">About 5 min · no restart</Only>
          <Only {...W} as="span">About 15 min, plus a restart</Only>
        </>
      }
    >
      <Only os="mac">
        <p>
          Your Mac comes with an app called <b>Terminal</b>. You’ll use it once now, to find out which shell your Mac
          uses. (After this, you’ll use the terminal inside VS Code.) Most Macs use <b>zsh</b>. Some older Macs, or Macs
          set up by IT, use <b>bash</b>. Both are fine, but Step 4 needs to know which you have.
        </p>
        <ol>
          <li>
            Press <kbd>Cmd ⌘</kbd> <kbd>Space</kbd>, type <b>Terminal</b> and press <kbd>Enter</kbd>. (Or open{' '}
            <b>Finder → Applications → Utilities → Terminal</b>.)
          </li>
          <li>
            A window with a blinking cursor opens. Click inside it, paste this command and press <kbd>Enter</kbd>:
          </li>
        </ol>
        <Cmd c="echo $0" what="Shows the name of your shell." where="Terminal app" />
        <Example lines={['-zsh']} />
        <table>
          <thead>
            <tr>
              <th>If you see</th>
              <th>Your shell is</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Something with <code>zsh</code> in it
              </td>
              <td>
                <b>zsh</b>
              </td>
            </tr>
            <tr>
              <td>
                Something with <code>bash</code> in it
              </td>
              <td>
                <b>bash</b>
              </td>
            </tr>
            <tr>
              <td>Anything else</td>
              <td>
                Ask your facilitator, or see <a href="#help">Troubleshooting</a>
              </td>
            </tr>
          </tbody>
        </table>
        <ol start={3}>
          <li>Click your shell below. This also sets the Shell switch at the top of the page.</li>
        </ol>
        <ShellSwitch inline />
        <Callout kind="tip" title="Seeing “The default interactive shell is now zsh”?">
          That message means your shell is <b>bash</b>. It’s safe to ignore, and you don’t need to change anything.
        </Callout>
        <p>
          You can close Terminal now (<kbd>Cmd ⌘</kbd> <kbd>Q</kbd>).
        </p>
        <Check id="mac-s1-shell" />
      </Only>

      <Only {...N}>
        <p>
          Windows has a built-in terminal called <b>PowerShell</b>. You’ll use it now to install the tools. (Later you’ll
          use the terminal inside VS Code, which is PowerShell too.) Nothing here needs a restart.
        </p>
        <ol>
          <li>
            Click <b>Start</b>, type <b>PowerShell</b> and click <b>Windows PowerShell</b>. A normal window is fine for
            this step.
          </li>
          <li>
            A blue (or black) window opens with a line like <code>PS C:\Users\jsmith&gt;</code> and a blinking cursor.
            Click inside it, paste this command and press <kbd>Enter</kbd>:
          </li>
        </ol>
        <Cmd c="winget --version" what="Checks that winget, Windows’s built-in app installer, is there. It prints a version number." where="PowerShell" />
        <Example lines={['v1.9.25200']} />
        <Callout kind="tip" title="Says “winget is not recognized”?">
          Open the <b>Microsoft Store</b>, search for <b>App Installer</b> and click <b>Update</b> (or <b>Get</b>). Then
          open a new PowerShell window and try again.
        </Callout>
        <p>
          Next, allow PowerShell to run scripts. Windows blocks them by default, and Yarn (which you’ll install soon)
          needs them. This only changes your own account and doesn’t need an administrator.
        </p>
        <Cmds
          where="PowerShell"
          items={[
            {
              c: 'Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force',
              what: 'Lets PowerShell run scripts that are already on your laptop. It prints nothing.',
            },
            { c: 'Get-ExecutionPolicy -Scope CurrentUser', what: 'Shows the setting you just made.' },
          ]}
        />
        <Example lines={['RemoteSigned']} />
        <Callout kind="warn" title="An error that mentions “overridden by a policy”?">
          Your company controls this setting. Ask IT to allow <code>RemoteSigned</code> for PowerShell, then try again.
        </Callout>
        <Check id="native-s1a" />
        <Check id="native-s1b" />
        <details>
          <summary>Advanced: want Linux (WSL) instead? (optional)</summary>
          <div className={s.detailsBody}>
            <p>
              WSL runs a Linux system inside Windows. Some developers prefer it, but it adds a restart, a second set of
              folders and more steps. Only pick it if you already use WSL, or want to learn it. Everything else in this
              guide works the same either way.
            </p>
            <WinModeSwitch inline />
          </div>
        </details>
      </Only>

      <Only {...W}>
        <Callout kind="tip" title="You chose the advanced WSL setup">
          WSL runs Linux inside Windows. It works well, but it has a restart and more steps. If you’re new to terminals,
          the simpler way is PowerShell, which is already on your laptop. Switch back any time:
          <WinModeSwitch inline />
        </Callout>
        <p>
          The project’s tools are made for Mac and Linux. WSL is a free Microsoft feature that runs Linux inside
          Windows. This step installs it, together with <b>Ubuntu</b>, the version of Linux we use.
        </p>
        <ol>
          <li>
            Click <b>Start</b> and type <b>PowerShell</b>. Right-click <b>Windows PowerShell</b> and choose{' '}
            <b>Run as administrator</b>.
          </li>
          <li>
            Windows asks <i>“Do you want to allow this app to make changes to your device?”</i> Click <b>Yes</b>. A
            blue or black window opens.
          </li>
          <li>
            Paste this command (right-click pastes) and press <kbd>Enter</kbd>:
          </li>
        </ol>
        <Cmd
          c="wsl --install"
          what="Installs WSL and Ubuntu. You’ll see download progress for 5–10 minutes."
          where="PowerShell (as administrator)"
        />
        <ol start={4}>
          <li>
            When it says{' '}
            <i>“The requested operation is successful. Changes will not be effective until the system is rebooted”</i>,
            save your work and <b>restart Windows</b>. (If Ubuntu opens straight away without asking for a restart, skip
            to the next item.)
          </li>
          <li>
            After the restart, an <b>Ubuntu</b> window opens by itself. If it doesn’t, click <b>Start</b>, type{' '}
            <b>Ubuntu</b> and open it. Wait for it to finish setting up.
          </li>
          <li>
            When it asks <i>“Enter new UNIX username”</i>, type a short name in lowercase with no spaces (for example{' '}
            <code>jsmith</code>) and press <kbd>Enter</kbd>.
          </li>
          <li>
            When it asks for a <i>“New password”</i>, type a password and press <kbd>Enter</kbd>, then type it again.{' '}
            <b>Nothing appears as you type.</b> That’s normal.
          </li>
        </ol>
        <Callout kind="warn" title="Write this password down">
          This is your Ubuntu password. It’s separate from your Windows password, and Step 3 asks for it.
        </Callout>
        <p>To check it worked, go back to the PowerShell window and run:</p>
        <Cmd c="wsl -l -v" what="Lists the Linux systems installed on your computer." where="PowerShell" />
        <Example lines={['  NAME      STATE           VERSION', '* Ubuntu    Running         2']} />
        <p>
          You should see <b>Ubuntu</b> with a <b>2</b> under VERSION. Your STATE might say <i>Stopped</i>, which is also
          fine.
        </p>
        <Callout kind="tip" title="Error mentioning “virtualization” or 0x80370102?">
          Your laptop has a setting turned off that WSL needs. Ask IT to turn on <b>virtualization</b> for WSL, then try
          again.
        </Callout>
        <Check id="wsl-s1a" />
        <Check id="wsl-s1b" />
      </Only>
    </Step>
  );
}

function Step2() {
  return (
    <Step
      n={2}
      title={
        <>
          <Only unix as="span">Install VS Code</Only>
          <Only {...N} as="span">Install VS Code, Git and Node.js</Only>
        </>
      }
      meta={
        <>
          <Only unix as="span">About 10 min</Only>
          <Only {...N} as="span">About 10 min · three commands</Only>
        </>
      }
    >
      <Only unix>
        <p>VS Code is the app where you’ll see the project’s files and type commands. It’s free and made by Microsoft.</p>
      </Only>

      <Only os="mac">
        <ol>
          <li>
            Go to{' '}
            <a href="https://code.visualstudio.com/download" target="_blank" rel="noopener noreferrer">
              code.visualstudio.com/download
            </a>{' '}
            and click the big <b>Mac</b> button.
          </li>
          <li>
            Open your <b>Downloads</b> folder. You’ll see <b>Visual Studio Code</b> (if you see a <code>.zip</code> file
            instead, double-click it first). Drag <b>Visual Studio Code</b> into your <b>Applications</b> folder.
          </li>
          <li>
            Open <b>Applications</b> and double-click <b>Visual Studio Code</b>. If your Mac asks{' '}
            <i>“Are you sure you want to open it?”</i>, click <b>Open</b>.
          </li>
          <li>
            Next, set up VS Code so you can open folders from the terminal (you’ll need this in Step 7). Press{' '}
            <kbd>Cmd ⌘</kbd> <kbd>Shift</kbd> <kbd>P</kbd>. A search box appears at the top of the window. Type{' '}
            <b>shell command</b> and click <b>Shell Command: Install ‘code’ command in PATH</b>.
          </li>
          <li>
            If a message about administrator privileges appears, click <b>OK</b> and enter your Mac login password.
            You’re done when you see <i>“Shell command ‘code’ successfully installed in PATH.”</i>
          </li>
          <li>
            Open VS Code’s terminal: in the menu bar at the very top of the screen, click{' '}
            <b>Terminal → New Terminal</b>. A panel opens at the bottom of the window. That’s your terminal from now on.
            (Pictures: <a href="#vscode">Getting to the terminal in VS Code</a>.)
          </li>
        </ol>
        <Check id="mac-s2a" />
        <Check id="mac-s2b" />
      </Only>

      <Only {...N}>
        <p>
          You’ll install three free tools, one command each, in the PowerShell window from Step 1 (open a new one if you
          closed it). Run them one at a time and wait for each to finish. Don’t open VS Code yet.
        </p>
        <Callout kind="warn" title="Windows will ask for permission">
          Git and Node.js each open a window asking{' '}
          <i>“Do you want to allow this app to make changes to your device?”</i> Click <b>Yes</b>. If you can’t, your
          laptop needs an administrator: ask IT.
        </Callout>
        <Cmds
          where="PowerShell"
          items={[
            {
              c: `winget install --id Microsoft.VisualStudioCode ${WINGET_FLAGS}`,
              what: 'Installs VS Code, the app where you’ll work. It downloads for a minute or two and ends with “Successfully installed”.',
            },
            {
              c: `winget install --id Git.Git ${WINGET_FLAGS}`,
              what: 'Installs Git, the tool that downloads the project. Click Yes when Windows asks. It takes a few minutes.',
            },
            {
              c: `winget install --id OpenJS.NodeJS.22 ${WINGET_FLAGS}`,
              what: 'Installs Node.js 22, the engine that runs the website. Click Yes when Windows asks.',
            },
          ]}
        />
        <Example lines={['Found Node.js 22 [OpenJS.NodeJS.22] Version 22.23.5', 'Downloading https://nodejs.org/dist/…', 'Successfully installed']} />
        <Callout kind="tip" title="Already have Node.js on this laptop?">
          The project needs version 22. If the Node.js command says a newer version is already installed, open{' '}
          <b>Settings → Apps → Installed apps</b>, uninstall <b>Node.js</b>, then run that command again.
        </Callout>
        <p>When all three say “Successfully installed”:</p>
        <ol>
          <li>
            <b>Close the PowerShell window.</b> This matters: apps you open afterwards can find the new tools.
          </li>
          <li>
            Click <b>Start</b>, type <b>Visual Studio Code</b> and open it. If it shows a welcome page, you can close that
            tab.
          </li>
          <li>
            Open the terminal: in the menu at the top-left of the VS Code window, click <b>Terminal → New Terminal</b>.
            A panel opens at the bottom with a line like <code>PS C:\Users\jsmith&gt;</code>. That’s your terminal from
            now on. (Pictures: <a href="#vscode">Getting to the terminal in VS Code</a>.)
          </li>
        </ol>
        <Callout kind="tip" title="Does the terminal say cmd or Git Bash instead of PowerShell?">
          That’s fine to fix: see <a href="#help">Troubleshooting</a>, “VS Code’s terminal isn’t PowerShell”.
        </Callout>
        <Check id="native-s2a" />
        <Check id="native-s2b" />
      </Only>

      <Only {...W}>
        <ol>
          <li>
            Go to{' '}
            <a href="https://code.visualstudio.com/download" target="_blank" rel="noopener noreferrer">
              code.visualstudio.com/download
            </a>{' '}
            and click the big <b>Windows</b> button.
          </li>
          <li>
            Open the downloaded file. Accept the agreement and keep clicking <b>Next</b>. On{' '}
            <b>Select Additional Tasks</b>, make sure <b>Add to PATH</b> is ticked (it is by default). Click{' '}
            <b>Install</b>, then <b>Finish</b>.
          </li>
          <li>
            VS Code opens. On the far-left bar, click the <b>Extensions</b> icon (four small squares). Search for{' '}
            <b>WSL</b> and click <b>Install</b> on the one made by <b>Microsoft</b>.
          </li>
          <li>
            Close VS Code. Open the <b>Ubuntu</b> app from the Start menu, paste this command and press{' '}
            <kbd>Enter</kbd>:
          </li>
        </ol>
        <Cmd
          c="code ."
          what="Opens VS Code connected to Ubuntu. The dot means “this folder”. The first time takes a minute while VS Code sets itself up."
          where="Ubuntu app"
        />
        <Callout kind="ok" title="How to tell it worked">
          The bottom-left corner of VS Code shows <b>WSL: Ubuntu</b>. Now open VS Code’s terminal: in the menu at the
          top, click <b>Terminal → New Terminal</b> (<a href="#vscode">pictures</a>). A panel opens at the bottom of the window. That’s your terminal from
          now on. You can close the Ubuntu window.
        </Callout>
        <Callout kind="warn" title="Always check the bottom-left corner">
          Run commands only when it shows <b>WSL: Ubuntu</b>. If it doesn’t, click the coloured <b>&gt;&lt;</b> button
          in the bottom-left corner and choose <b>Connect to WSL</b>.
        </Callout>
        <Check id="wsl-s2a" />
        <Check id="wsl-s2b" />
      </Only>

      <Only os="mac">
        <h3>Confirm VS Code uses the same shell</h3>
        <p>Click inside VS Code’s terminal and run the same command as in Step 1:</p>
        <Cmd c="echo $0" what="Shows the name of the shell VS Code uses." />
        <Example lines={['/bin/zsh']} />
        <p>
          It should show the same shell you clicked in Step 1. (A <code>/bin/</code> or a dash in front is fine.)
        </p>
        <Callout kind="warn" title="Different from Step 1?">
          No problem. VS Code is where you’ll work, so set the Shell switch at the top of the page to match what VS Code
          shows.
        </Callout>
        <Check id="mac-s2-shell" />
      </Only>

      <Only {...W}>
        <h3>Check which shell you have</h3>
        <p>
          There are two common kinds of shell, <b>bash</b> and <b>zsh</b>. Ubuntu normally uses <b>bash</b>, but check
          now, because Step 4 depends on it. Click inside VS Code’s terminal and run:
        </p>
        <Cmd c="echo $0" what="Shows the name of your shell." />
        <Example lines={['/bin/bash']} />
        <table>
          <thead>
            <tr>
              <th>If you see</th>
              <th>Set the Shell switch at the top to</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Something with <code>bash</code> in it
              </td>
              <td>
                <b>bash</b>
              </td>
            </tr>
            <tr>
              <td>
                Something with <code>zsh</code> in it
              </td>
              <td>
                <b>zsh</b>
              </td>
            </tr>
            <tr>
              <td>Anything else</td>
              <td>
                See <a href="#help">Troubleshooting</a>
              </td>
            </tr>
          </tbody>
        </table>
        <Callout
          kind="warn"
          title={
            <>
              Does the line start with <code>{'PS C:\\>'}</code>?
            </>
          }
        >
          Then you’re in Windows PowerShell, not Ubuntu, and the commands in this guide won’t work. Check the bottom-left
          corner says <b>WSL: Ubuntu</b> (see above), then open a new terminal.
        </Callout>
        <Check id="wsl-s2-shell" />
      </Only>
    </Step>
  );
}

function Step3() {
  return (
    <Step
      n={3}
      title={
        <>
          <Only unix as="span">Install Git</Only>
          <Only {...N} as="span">Check Git</Only>
        </>
      }
      meta={
        <>
          <Only os="mac" as="span">5–30 min, mostly waiting</Only>
          <Only {...W} as="span">About 5 min</Only>
          <Only {...N} as="span">About 1 min</Only>
        </>
      }
    >
      <p>Git is the tool that downloads the project from GitHub.</p>
      <Only os="mac">
        <Cmd c="xcode-select --install" what="Asks Apple to install its free developer tools, which include Git." />
        <p>
          A window pops up asking to install the <i>command line developer tools</i>. Click <b>Install</b>, then{' '}
          <b>Agree</b>. The download can take 5–30 minutes. Leave it running and wait until it says{' '}
          <i>“The software was installed”</i>.
        </p>
        <Callout kind="tip" title="No pop-up, and the terminal mentions “already installed”?">
          Great, you already have them. That’s true even if the message includes the word <i>error</i>. Go straight to
          the check below.
        </Callout>
        <p>When it’s done, check Git is installed:</p>
        <Cmd c="git --version" what="Shows which version of Git is installed." />
        <Example lines={['git version 2.39.5 (Apple Git-154)']} />
        <p>
          Any line starting with <code>git version</code> is fine.
        </p>
        <Check id="mac-s3" />
      </Only>

      <Only {...N}>
        <p>You installed it in Step 2, so now just check it’s there. Click inside VS Code’s terminal and run:</p>
        <Cmd c="git --version" what="Shows which version of Git is installed." />
        <Example lines={['git version 2.56.1.windows.1']} />
        <p>
          Any line starting with <code>git version</code> is fine.
        </p>
        <Callout kind="tip" title="Says “git is not recognized”?">
          Close VS Code completely (<b>File → Exit</b>), open it again from the Start menu, then open a new terminal.
          Windows only shows new tools to apps that start after the install. Still stuck? See{' '}
          <a href="#help">Troubleshooting</a>.
        </Callout>
        <Check id="native-s3" />
      </Only>

      <Only {...W}>
        <p>Ubuntu usually has Git already. This makes sure it, and a download tool called curl, are installed and up to date.</p>
        <Cmd
          c="sudo apt update && sudo apt install -y git curl"
          what={
            <>
              <code>sudo</code> means “run as administrator”, so it asks for your <b>Ubuntu password</b> from Step 1.
              It stays invisible as you type. Lots of text scrolls past for a minute or two. Wait for the prompt to come
              back.
            </>
          }
        />
        <p>Then check Git is installed:</p>
        <Cmd c="git --version" what="Shows which version of Git is installed." />
        <Example lines={['git version 2.43.0']} />
        <p>
          Any line starting with <code>git version</code> is fine.
        </p>
        <Check id="wsl-s3" />
      </Only>
    </Step>
  );
}

function Step4() {
  return (
    <Step
      n={4}
      title={
        <>
          <Only unix as="span">Install Node.js 22</Only>
          <Only {...N} as="span">Check Node.js 22</Only>
        </>
      }
      meta={
        <>
          <Only unix as="span">About 5 min</Only>
          <Only {...N} as="span">About 1 min</Only>
        </>
      }
    >
      <Only unix>
        <p>
          <b>Node.js</b> is the engine that runs the website on your laptop. The project needs version 22. You’ll install
          it with a free helper called <b>nvm</b>, which{' '}
          <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer">
            nodejs.org
          </a>{' '}
          recommends. You don’t need an admin password.
        </p>
        <Callout kind="warn" title="Check the switches at the top first">
          The commands below are for{' '}
          <b>
            <Only os="mac" as="span">macOS</Only>
            <Only {...W} as="span">Windows (WSL)</Only> with <Only shell="zsh" as="span">zsh</Only>
            <Only shell="bash" as="span">bash</Only>
          </b>
          . If that’s wrong, change the switches at the top of the page before you start. The commands change to match.
        </Callout>

        <h3>a. Install nvm</h3>
        <NvmCommands />
        <details>
          <summary>Curious why the commands look like this? (optional)</summary>
          <div className={s.detailsBody}>
            <p>
              nvm adds a few lines to a hidden settings file that your shell reads every time a terminal opens. That’s how
              Node keeps working in new terminals. Your file is{' '}
              {SHELL_FILES.map(({ os, shell, file }) => (
                <Only key={`${os}-${shell}`} os={os} shell={shell} {...(os === 'win' ? { mode: 'wsl' as const } : {})} as="span">
                  <code>~/{file}</code>
                </Only>
              ))}
              . The <code>PROFILE=</code> part tells nvm which file to use, so it doesn’t guess wrong.
            </p>
            <Only shell="zsh" as="p">
              The command ends with “bash” even though you use zsh because the nvm installer itself is written for bash.
              That’s expected.
            </Only>
          </div>
        </details>

        <h3>b. Install Node 22</h3>
        <Cmds
          items={[
            {
              c: 'nvm install 22',
              what: (
                <>
                  Downloads and installs Node 22. It takes about a minute and ends with a line like{' '}
                  <code>Now using node v22.21.1</code>.
                </>
              ),
            },
            {
              c: 'nvm alias default 22',
              what: (
                <>
                  Makes Node 22 the default in every new terminal. It prints a line starting with{' '}
                  <code>{'default -> 22'}</code>.
                </>
              ),
            },
            { c: 'node -v', what: 'Shows your Node version.' },
          ]}
        />
        <Example lines={['v22.21.1']} />
        <p>
          Any number starting with <code>v22.</code> is fine.
        </p>
      </Only>

      <Only {...N}>
        <p>
          <b>Node.js</b> is the engine that runs the website on your laptop. The project needs version 22, which you
          installed in Step 2. Click inside VS Code’s terminal and run:
        </p>
        <Cmd c="node -v" what="Shows your Node version." />
        <Example lines={['v22.23.5']} />
        <p>
          Any number starting with <code>v22.</code> is fine.
        </p>
        <Callout kind="tip" title="Shows v20, v24 or another number, or “node is not recognized”?">
          <b>Another number:</b> a different Node.js on your laptop is taking priority. Open{' '}
          <b>Settings → Apps → Installed apps</b>, uninstall every <b>Node.js</b>, then run the Node command from Step 2
          again and open a new VS Code window. <b>Not recognized:</b> close VS Code completely (<b>File → Exit</b>) and open
          it again. More help is in <a href="#help">Troubleshooting</a>.
        </Callout>
      </Only>

      <h3>
        <Only unix as="span">c. </Only>Make sure it sticks
      </h3>
      <p>
        Open a fresh terminal: click the <b>+</b> at the top right of the terminal panel. In the new terminal, run{' '}
        <code>node -v</code> again. If it still shows <code>v22…</code>, you’re all set.{' '}
        <Only unix as="span">
          If it says <i>command not found</i>, see the first item in <a href="#help">Troubleshooting</a>.
        </Only>
      </p>
      <Check id="s4" />
      <Check id="s4b" />
    </Step>
  );
}

function Step5() {
  return (
    <Step n={5} title="Install Yarn 4" meta={<><Only unix as="span">About 2 min</Only><Only {...N} as="span">About 3 min</Only></>}>
      <p>
        <b>Yarn</b> downloads the building blocks (called <i>packages</i>) that the website needs. It comes with Node, so
        these commands just switch it on and set it up the way this project expects.
        <Only {...N} as="span">
          {' '}
          One step needs an administrator window. Then you’re back in VS Code.
        </Only>
      </p>

      <Only unix>
        <p>Run all four commands, in order.</p>
        <Cmds
          items={[
            { c: 'corepack enable', what: 'Switches Yarn on. It prints nothing.' },
            { c: 'corepack install --global yarn@4.14.1', what: 'Downloads the exact Yarn version this project uses.' },
            {
              c: 'yarn config set --home nodeLinker node-modules',
              what: (
                <>
                  Sets Yarn up the way this project needs. <b>Don’t skip this one.</b> It prints a short confirmation
                  that mentions <code>nodeLinker</code>.
                </>
              ),
            },
            { c: 'yarn --version', what: 'Shows your Yarn version.' },
          ]}
        />
        <Example lines={['4.14.1']} />
      </Only>

      <Only {...N}>
        <h3>a. Switch Yarn on (in an administrator window)</h3>
        <ol>
          <li>
            Click <b>Start</b> and type <b>PowerShell</b>. Right-click <b>Windows PowerShell</b>, choose{' '}
            <b>Run as administrator</b> and click <b>Yes</b>.
          </li>
          <li>Paste this command and press <kbd>Enter</kbd>:</li>
        </ol>
        <Cmd
          c="corepack enable"
          what="Switches Yarn on for this laptop. It prints nothing. It needs administrator rights because Node.js is installed in Program Files."
          where="PowerShell (as administrator)"
        />
        <ol start={3}>
          <li>
            Close the administrator window. <b>From now on, use VS Code’s terminal again.</b>
          </li>
        </ol>
        <h3>b. Set Yarn up (in VS Code’s terminal)</h3>
        <Cmds
          items={[
            { c: 'corepack install --global yarn@4.14.1', what: 'Downloads the exact Yarn version this project uses.' },
            {
              c: 'yarn config set --home nodeLinker node-modules',
              what: (
                <>
                  Sets Yarn up the way this project needs. <b>Don’t skip this one.</b> It prints a short confirmation
                  that mentions <code>nodeLinker</code>.
                </>
              ),
            },
            { c: 'yarn --version', what: 'Shows your Yarn version.' },
          ]}
        />
        <Example lines={['4.14.1']} />
        <Callout kind="tip" title="Says “yarn is not recognized” or “running scripts is disabled”?">
          “Not recognized” means the administrator step (a) didn’t run: do it again. “Running scripts is disabled” means
          the script setting from Step 1 is missing: see <a href="#help">Troubleshooting</a>.
        </Callout>
      </Only>

      <Callout kind="tip" title="Asked “Corepack is about to download… Do you want to continue? [Y/n]”?">
        Type <kbd>Y</kbd> and press <kbd>Enter</kbd>.
      </Callout>
      <Check id="s5" />
    </Step>
  );
}

function Step6() {
  return (
    <Step n={6} title="Final check" meta="1 min">
      <p>
        Open a fresh terminal (the <b>+</b> at the top right of the terminal panel), then run this one command. It
        checks everything at once.
      </p>
      <Only unix>
        <Cmd
          c="echo $0; git --version; node -v; yarn --version; yarn config get nodeLinker"
          what="Prints five lines, one for each thing you set up."
        />
        <Only os="mac">
          <Example lines={['/bin/zsh', 'git version 2.39.5 (Apple Git-154)', 'v22.21.1', '4.14.1', 'node-modules']} />
        </Only>
        <Only {...W}>
          <Example lines={['/bin/bash', 'git version 2.43.0', 'v22.21.1', '4.14.1', 'node-modules']} />
        </Only>
        <table>
          <thead>
            <tr>
              <th>Line</th>
              <th>Should look like</th>
              <th>If it doesn’t</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 · Your shell</td>
              <td>
                Contains <code>zsh</code> or <code>bash</code>, matching the switch at the top
              </td>
              <td>Change the switch, then redo Step 4a</td>
            </tr>
            <tr>
              <td>2 · Git</td>
              <td>
                Starts with <code>git version</code>
              </td>
              <td>Redo Step 3</td>
            </tr>
            <tr>
              <td>3 · Node</td>
              <td>
                Starts with <code>v22.</code>
              </td>
              <td>
                Redo Step 4, or see <a href="#help">Troubleshooting</a>
              </td>
            </tr>
            <tr>
              <td>4 · Yarn</td>
              <td>
                Exactly <code>4.14.1</code>
              </td>
              <td>Redo Step 5</td>
            </tr>
            <tr>
              <td>5 · Yarn setting</td>
              <td>
                Exactly <code>node-modules</code>
              </td>
              <td>Run the third command from Step 5 again</td>
            </tr>
          </tbody>
        </table>
        <Check id="s6" />
      </Only>

      <Only {...N}>
        <Cmd
          c="git --version; node -v; yarn --version; yarn config get nodeLinker"
          what="Prints four lines, one for each thing you set up."
        />
        <Example lines={['git version 2.56.1.windows.1', 'v22.23.5', '4.14.1', 'node-modules']} />
        <table>
          <thead>
            <tr>
              <th>Line</th>
              <th>Should look like</th>
              <th>If it doesn’t</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 · Git</td>
              <td>
                Starts with <code>git version</code>
              </td>
              <td>Redo Step 2 (the Git command), then close and reopen VS Code</td>
            </tr>
            <tr>
              <td>2 · Node</td>
              <td>
                Starts with <code>v22.</code>
              </td>
              <td>
                Redo Step 2 (the Node.js command), or see <a href="#help">Troubleshooting</a>
              </td>
            </tr>
            <tr>
              <td>3 · Yarn</td>
              <td>
                Exactly <code>4.14.1</code>
              </td>
              <td>Redo Step 5</td>
            </tr>
            <tr>
              <td>4 · Yarn setting</td>
              <td>
                Exactly <code>node-modules</code>
              </td>
              <td>Run the second command from Step 5b again</td>
            </tr>
          </tbody>
        </table>
        <Check id="s6" label="All four lines look right" />
      </Only>

      <p>
        All the tools are installed. <b>One more step:</b> download the project.
      </p>
    </Step>
  );
}

function Step7() {
  return (
    <Step n={7} title="Download the project" meta="About 2 min">
      <p>
        Now download the project from GitHub. Developers call this <i>cloning</i>. First, choose two folder names. The
        tools you’ll use later rely on this layout, so it’s worth a minute.
      </p>
      <FolderInputs />
      <FolderTree />
      <ul>
        <li>
          <b>
            <code>
              <FolderName which="container" />
            </code>
          </b>{' '}
          is the one folder that holds everything. The main project goes in it now. Later, every demo site you create gets
          its own folder in it too.
        </li>
        <li>
          <b>
            <code>
              <FolderName which="main" />
            </code>
          </b>{' '}
          is the folder for the main project. Pick a name you won’t use for a customer, because demo sites are created{' '}
          <b>next to this one</b>, not inside it.
        </li>
      </ul>
      <p>
        The commands below use your names. Run these four commands in VS Code’s terminal, in order:
      </p>
      <CloneCommands />
      <ol>
        <li>
          A new VS Code window opens with the project’s files listed on the left. If it asks{' '}
          <i>“Do you trust the authors of the files in this folder?”</i>, click <b>Yes, I trust the authors</b>.
        </li>
        <li>You can close the old VS Code window. Use the new one from now on.</li>
        <li>
          In the new window, open the terminal: <b>Terminal → New Terminal</b> (
          <a href="#vscode">where is that?</a>). The prompt should include <code>opti-baseline-main</code>.
        </li>
      </ol>
      <Only os="mac">
        <Callout kind="tip" title="Seeing “code: command not found”?">
          Redo the “Shell Command” part of Step 2, then try the last command again.
        </Callout>
      </Only>
      <Only {...N}>
        <Callout kind="warn" title="Keep it out of OneDrive">
          Don’t move this folder into <b>Documents</b>, <b>Desktop</b> or anywhere OneDrive syncs. The project has
          thousands of small files and syncing them makes everything slow. <code>
            C:\Users\you\
            <FolderName which="container" />
          </code> is the right
          place.
        </Callout>
        <Callout kind="tip" title="Seeing “code is not recognized”?">
          Close VS Code completely (<b>File → Exit</b>), open it again from the Start menu and open a new terminal. Then
          run the last command again.
        </Callout>
      </Only>
      <Only {...W}>
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
    <Step n={8} title="Install the project’s packages" meta="2–5 min · the last step before the session">
      <p>
        In VS Code’s terminal (the prompt should include <code>opti-baseline-main</code>), run:
      </p>
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
        <Only {...N} as="li">
          <b>On some Windows laptops it takes longer</b>, for example when antivirus software checks each new file. Be
          patient and wait for the last line.
        </Only>
      </ul>
      <Check id="s8-install" />
      <Callout kind="ok" title="That’s the prep done. Stop here.">
        Your laptop is ready. <b>Don’t go on to Step 9.</b> We’ll do Steps 9–11 together in the live session, where your
        facilitator gives you the private settings file for the CMS. You can close VS Code until then.
      </Callout>
    </Step>
  );
}

export default function PrepSteps() {
  return (
    <>
      <Step1 />
      <Step2 />
      <Step3 />
      <Step4 />
      <Step5 />
      <Step6 />
      <Step7 />
      <Step8 />
    </>
  );
}
