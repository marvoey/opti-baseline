import Image from 'next/image';
import type { ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { Callout, Card, ModKey, Only } from '../_components/ui';

/**
 * "Getting to the terminal in VS Code": a one-time orientation for people who have never used VS Code.
 *
 * Screenshots in public/setup-guide/vscode/:
 *   windows-terminal-open.png, vscode-parts.png, mac-terminal-panel.png
 *     From the Visual Studio Code documentation (code.visualstudio.com/assets/docs/…), © Microsoft,
 *     licensed CC BY 3.0 US (github.com/microsoft/vscode-docs). The credit line under each one is required.
 *   mac-menu-terminal.svg
 *     Our own simplified drawing of the macOS menu bar. Microsoft's docs have no Mac screenshot that shows it.
 */

const DOCS = 'https://code.visualstudio.com/docs/terminal/getting-started';
const LICENSE = 'https://creativecommons.org/licenses/by/3.0/us/';

function Credit() {
  return (
    <span className={s.credit}>
      Screenshot from the{' '}
      <a href={DOCS} target="_blank" rel="noopener noreferrer">
        VS Code documentation
      </a>
      , © Microsoft,{' '}
      <a href={LICENSE} target="_blank" rel="noopener noreferrer">
        CC BY 3.0 US
      </a>
      .
    </span>
  );
}

function Figure({
  src,
  width,
  height,
  alt,
  small,
  credit = true,
  children,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  small?: boolean;
  credit?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className={small ? `${s.figure} ${s.figureSmall}` : s.figure}>
      <Image src={src} width={width} height={height} alt={alt} sizes="(max-width: 900px) 100vw, 860px" />
      <figcaption>
        {children}
        {credit && <Credit />}
      </figcaption>
    </figure>
  );
}

export default function VsCodeTerminal() {
  return (
    <Card id="vscode">
      <h2>Getting to the terminal in VS Code</h2>
      <p>
        You’ll install VS Code in Step 2. From then on, almost every command goes into the <b>terminal inside VS Code</b>
        . Skim this now, and come back to it whenever a step says <i>“VS Code terminal”</i>.
      </p>

      <Callout kind="tip" title="Two kinds of terminal window">
        <Only os="mac" as="span">
          In Step 1 you use the Mac’s own <b>Terminal</b> app, just once. Everything after that happens in VS Code.
        </Only>
        <Only os="win" mode="native" as="span">
          In Steps 1 and 2, and once in Step 5, you use the separate <b>PowerShell</b> window from the Start menu.
          Everything else happens in VS Code.
        </Only>
        <Only os="win" mode="wsl" as="span">
          In Steps 1 and 2 you use PowerShell and the Ubuntu app from the Start menu. Everything after that happens in VS
          Code.
        </Only>{' '}
        The label at the top of each grey command box tells you where to type it, for example{' '}
        <i>“Type in: VS Code terminal”</i>.
      </Callout>

      <h3>The parts of the VS Code window</h3>
      <Figure
        src="/setup-guide/vscode/vscode-parts.png"
        width={1200}
        height={796}
        alt="The VS Code window with five areas labelled A to E: the icon column on the far left, the file list next to it, the editor in the middle, the terminal panel at the bottom and the thin status bar along the very bottom."
      >
        Inside the window, VS Code looks the same on Mac and Windows. This picture was taken on Windows, so its window
        buttons are at the top right.{' '}
        <Only os="mac" as="span">On your Mac they’re three coloured dots at the top left.</Only>
      </Figure>
      <div className={s.grid}>
        <div>
          <b>A · Activity Bar</b>The column of icons on the far left. The top one (two sheets of paper) shows your files.
        </div>
        <div>
          <b>B · Explorer</b>The list of the project’s files and folders. It appears once you open the project in Step 7.
        </div>
        <div>
          <b>C · Editor</b>Where a file opens when you click it. You won’t need to change any code.
        </div>
        <div>
          <b>D · Panel: your terminal</b>The area at the bottom. This is where you paste commands.
        </div>
        <div>
          <b>E · Status Bar</b>The thin coloured line along the very bottom.{' '}
          <Only os="win" mode="wsl" as="span">
            On the left it must say <b>WSL: Ubuntu</b>.
          </Only>
          <Only os="mac" as="span">
            You can ignore it.
          </Only>
          <Only os="win" mode="native" as="span">
            You can ignore it.
          </Only>
        </div>
      </div>

      <h3>Open the terminal from the menu</h3>
      <Only os="mac">
        <ol>
          <li>Click anywhere in the VS Code window, so VS Code is the app in front.</li>
          <li>
            Look at the <b>very top of your screen</b>. On a Mac the menus aren’t inside the window. They’re in the menu
            bar next to the Apple logo: <b>Code</b>, File, Edit, Selection, View, Go, Run, <b>Terminal</b>…
          </li>
          <li>
            Click <b>Terminal</b>, then <b>New Terminal</b>.
          </li>
        </ol>
        <Figure
          src="/setup-guide/vscode/mac-menu-terminal.svg"
          width={760}
          height={360}
          small
          credit={false}
          alt="Drawing of the Mac menu bar at the top of the screen with the Terminal menu open and New Terminal highlighted."
        >
          <span className={s.osTag}>macOS</span>A simplified drawing of the Mac menu bar with the Terminal menu open.
        </Figure>
        <p>A panel opens at the bottom of the VS Code window. It looks something like this:</p>
        <Figure
          src="/setup-guide/vscode/mac-terminal-panel.png"
          width={1096}
          height={586}
          alt="VS Code's terminal panel on a Mac, with TERMINAL at the top left, the shell's name at the top right, and a few commands that have been run."
        >
          <span className={s.osTag}>macOS</span>VS Code’s terminal on a Mac. Yours will be plainer: an empty panel with
          one line that ends in <code>%</code> (or <code>$</code>), for example{' '}
          <code>jsmith@MacBook-Pro ~ %</code>, and a blinking cursor. The name at the top right is your shell,{' '}
          <b>zsh</b> or <b>bash</b>.
        </Figure>
      </Only>

      <Only os="win">
        <ol>
          <li>
            Look at the <b>top-left corner of the VS Code window</b>. On Windows the menus are inside the window: File,
            Edit, Selection, View…
          </li>
          <li>
            Click <b>Terminal</b>, then <b>New Terminal</b>.
          </li>
          <li>
            <b>Can’t see Terminal?</b> When the window is narrow, VS Code tucks the last menus behind <b>…</b> (three
            dots). Click <b>…</b>, then <b>Terminal → New Terminal</b>. If you see <b>☰</b> (three lines) instead of the
            menu words, click that.
          </li>
        </ol>
        <Figure
          src="/setup-guide/vscode/windows-terminal-open.png"
          width={1736}
          height={1154}
          alt="VS Code on Windows with the terminal open at the bottom. Red boxes mark the TERMINAL tab and the shell name, powershell, on the right."
        >
          <span className={s.osTag}>Windows</span>VS Code on Windows with the terminal open. Microsoft’s red boxes mark
          the <b>TERMINAL</b> tab and the shell’s name.{' '}
          <Only mode="native" as="span">
            Yours says <b>powershell</b> too, and the line with the cursor looks like <code>PS C:\Users\jsmith&gt;</code>.
          </Only>
          <Only mode="wsl" as="span">
            Yours says <b>bash</b>, and the bottom-left corner says <b>WSL: Ubuntu</b>.
          </Only>
        </Figure>
      </Only>

      <h3>Or use the keyboard</h3>
      <p>
        Press{' '}
        <Only os="mac" as="span">
          <kbd>Control ⌃</kbd> (not Command)
        </Only>
        <Only os="win" as="span">
          <kbd>Ctrl</kbd>
        </Only>{' '}
        and <kbd>`</kbd> together. <kbd>`</kbd> is the backtick key, usually at the top left of the keyboard, just below{' '}
        <kbd>Esc</kbd>. It opens and closes the terminal panel. On some keyboards outside the US the key is somewhere
        else. If the shortcut doesn’t work, use the menu.
      </p>

      <h3>How to tell you’re in the right place</h3>
      <ul>
        <li>
          There’s a panel at the bottom with a row of tabs: PROBLEMS, OUTPUT, DEBUG CONSOLE, <b>TERMINAL</b>, PORTS.{' '}
          <b>TERMINAL</b> is underlined.
        </li>
        <li>
          There’s a line with a blinking cursor at the end. It ends in{' '}
          <Only os="mac" as="span">
            <code>%</code> (zsh) or <code>$</code> (bash)
          </Only>
          <Only os="win" mode="native" as="span">
            <code>&gt;</code>, for example <code>PS C:\Users\jsmith&gt;</code>
          </Only>
          <Only os="win" mode="wsl" as="span">
            <code>$</code>
          </Only>
          .
        </li>
        <li>
          On the right of the panel you can see the shell’s name:{' '}
          <Only os="mac" as="span">
            <b>zsh</b> or <b>bash</b>
          </Only>
          <Only os="win" mode="native" as="span">
            <b>powershell</b>
          </Only>
          <Only os="win" mode="wsl" as="span">
            <b>bash</b> (or <b>zsh</b>)
          </Only>
          .
        </li>
      </ul>

      <h3>Common hiccups</h3>
      <div className={s.grid}>
        <div>
          <b>You can see text but can’t type</b>You’re on OUTPUT, PROBLEMS or DEBUG CONSOLE. Click the <b>TERMINAL</b>{' '}
          tab.
        </div>
        <div>
          <b>Your typing went into a file</b>Click inside the terminal panel first, then paste. To undo typing in a file,
          press <ModKey /> <kbd>Z</kbd>.
        </div>
        <div>
          <b>The panel disappeared</b>The <b>×</b> at its top right only hides it. Nothing is lost. Open it again from the
          menu or with the shortcut.
        </div>
        <div>
          <b>The terminal is tiny</b>Drag the top edge of the panel upwards.
        </div>
        <div>
          <b>You need a second terminal</b>Click the <b>+</b> at the top right of the panel. Each terminal gets its own
          tab.
        </div>
        <div>
          <b>Leave the bin icon alone</b>The bin icon closes that terminal and stops anything running in it.
        </div>
      </div>
    </Card>
  );
}
