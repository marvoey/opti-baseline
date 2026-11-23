import s from '../setup-guide.module.css';
import { Check, ShellSwitch } from '../_components/controls';
import { Callout, Cmd, Cmds, Example, Only, Step } from '../_components/ui';

/** Steps 1–6: installs the reader does on their own before the session. */

const NVM_URL = 'https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh';

/** Where nvm must save its settings for each computer + shell (the file that shell reads on start). */
export const SHELL_FILES = [
  { os: 'mac', shell: 'zsh', file: '.zshrc', label: 'macOS' },
  { os: 'mac', shell: 'bash', file: '.bash_profile', label: 'macOS' },
  { os: 'win', shell: 'bash', file: '.bashrc', label: 'Windows (Ubuntu)' },
  { os: 'win', shell: 'zsh', file: '.zshrc', label: 'Windows (Ubuntu)' },
] as const;

export function NvmCommands() {
  return (
    <>
      {SHELL_FILES.map(({ os, shell, file }) => (
        <Only key={`${os}-${shell}`} os={os} shell={shell}>
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

function Step1() {
  return (
    <Step
      n={1}
      title={
        <>
          <Only os="mac" as="span">Open Terminal and check your shell</Only>
          <Only os="win" as="span">Install Ubuntu (WSL)</Only>
        </>
      }
      meta={
        <>
          <Only os="mac" as="span">Nothing to install · 2 min</Only>
          <Only os="win" as="span">About 15 min, plus a restart</Only>
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

      <Only os="win">
        <p>
          The project’s tools are made for Mac and Linux. Windows can run Linux using a free Microsoft feature called{' '}
          <b>WSL</b>. This step installs it, together with <b>Ubuntu</b>, the version of Linux we use.
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
          You should see <b>Ubuntu</b> with a <b>2</b> under VERSION. Your STATE might say <i>Stopped</i>, which is
          also fine.
        </p>
        <Callout kind="tip" title="Error mentioning “virtualization” or 0x80370102?">
          Your laptop has a setting turned off that WSL needs. Ask IT to turn on <b>virtualization</b> for WSL, then try
          again.
        </Callout>
        <Check id="win-s1a" />
        <Check id="win-s1b" />
      </Only>
    </Step>
  );
}

function Step2() {
  return (
    <Step n={2} title="Install VS Code" meta="About 10 min">
      <p>VS Code is the app where you’ll see the project’s files and type commands. It’s free and made by Microsoft.</p>

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
            Open VS Code’s terminal: in the menu bar at the top of the screen, click <b>Terminal → New Terminal</b>. A
            panel opens at the bottom of the window. That’s your terminal from now on.
          </li>
        </ol>
        <Check id="mac-s2a" />
        <Check id="mac-s2b" />
      </Only>

      <Only os="win">
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
          top, click <b>Terminal → New Terminal</b>. A panel opens at the bottom of the window. That’s your terminal
          from now on. You can close the Ubuntu window.
        </Callout>
        <Callout kind="warn" title="Always check the bottom-left corner">
          Run commands only when it shows <b>WSL: Ubuntu</b>. If it doesn’t, click the coloured <b>&gt;&lt;</b> button
          in the bottom-left corner and choose <b>Connect to WSL</b>.
        </Callout>
        <Check id="win-s2a" />
        <Check id="win-s2b" />
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

      <Only os="win">
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
        <Check id="win-s2-shell" />
      </Only>
    </Step>
  );
}

function Step3() {
  return (
    <Step
      n={3}
      title="Install Git"
      meta={
        <>
          <Only os="mac" as="span">5–30 min, mostly waiting</Only>
          <Only os="win" as="span">About 5 min</Only>
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
      <Only os="win">
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
        <Check id="win-s3" />
      </Only>
    </Step>
  );
}

function Step4() {
  return (
    <Step n={4} title="Install Node.js 22" meta="About 5 min">
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
          <Only os="win" as="span">Windows (Ubuntu)</Only> with <Only shell="zsh" as="span">zsh</Only>
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
              <Only key={`${os}-${shell}`} os={os} shell={shell} as="span">
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

      <h3>c. Make sure it sticks</h3>
      <p>
        Open a fresh terminal: click the <b>+</b> at the top right of the terminal panel. In the new terminal, run{' '}
        <code>node -v</code> again. If it still shows <code>v22…</code>, you’re all set. If it says{' '}
        <i>command not found</i>, see the first item in <a href="#help">Troubleshooting</a>.
      </p>
      <Check id="s4" />
      <Check id="s4b" />
    </Step>
  );
}

function Step5() {
  return (
    <Step n={5} title="Install Yarn 4" meta="About 2 min">
      <p>
        <b>Yarn</b> downloads the building blocks (called <i>packages</i>) that the website needs. It comes with Node, so
        these commands just switch it on and set it up the way this project expects. Run all four, in order.
      </p>
      <Cmds
        items={[
          { c: 'corepack enable', what: 'Switches Yarn on. It prints nothing.' },
          { c: 'corepack install --global yarn@4.14.1', what: 'Downloads the exact Yarn version this project uses.' },
          {
            c: 'yarn config set --home nodeLinker node-modules',
            what: (
              <>
                Sets Yarn up the way this project needs. <b>Don’t skip this one.</b> It prints a short confirmation that
                mentions <code>nodeLinker</code>.
              </>
            ),
          },
          { c: 'yarn --version', what: 'Shows your Yarn version.' },
        ]}
      />
      <Example lines={['4.14.1']} />
      <Callout kind="tip" title="Asked “Corepack is about to download… Do you want to continue? [Y/n]”?">
        Type <kbd>Y</kbd> and press <kbd>Enter</kbd>.
      </Callout>
      <Check id="s5" />
    </Step>
  );
}

function Step6() {
  return (
    <Step n={6} title="Final check" meta="1 min · the last step before the session">
      <p>
        Open a fresh terminal (the <b>+</b> at the top right of the terminal panel), then run this one command. It
        checks everything at once.
      </p>
      <Cmd
        c="echo $0; git --version; node -v; yarn --version; yarn config get nodeLinker"
        what="Prints five lines, one for each thing you set up."
      />
      <Only os="mac">
        <Example lines={['/bin/zsh', 'git version 2.39.5 (Apple Git-154)', 'v22.21.1', '4.14.1', 'node-modules']} />
      </Only>
      <Only os="win">
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
      <Callout kind="ok" title="That’s the homework done">
        Your laptop is ready for the session. Bring your <code>.env</code> file, or know where to find it. We’ll do the
        rest together.
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
    </>
  );
}
