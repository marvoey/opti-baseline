import Image from 'next/image';
import s from '../setup-guide.module.css';
import { Check } from '../_components/controls';
import { Card, Only, StopKey } from '../_components/ui';

const CHIPS = ['VS Code', 'Git', 'Node.js 22', 'Yarn 4', 'About 1 hour'];

export function Hero() {
  return (
    <Card className={s.hero}>
      <div>
        <div className={s.eyebrow}>Mark AI · Custom Demo · Setup guide</div>
        <h1>Your setup, sorted.</h1>
        <p className={s.lede}>
          Everything your laptop needs to build a custom Optimizely CMS demo site. <b>No coding experience needed.</b>{' '}
          Copy each command, paste it, check the result, tick the box.
        </p>
        <div className={s.chips}>
          {CHIPS.map((chip) => (
            <span key={chip} className={s.chip}>
              {chip}
            </span>
          ))}
        </div>
      </div>
      <Image className={s.heroArt} src="/setup-guide/backpack.svg" alt="" width={240} height={240} loading="eager" />
    </Card>
  );
}

export function BeforeYouStart() {
  return (
    <Card id="start">
      <h2>Before you start</h2>

      <h3>What you’ll do</h3>
      <ol>
        <li>
          <b>Install four free tools</b> (Steps 1–6). Do these on your own before the session.
        </li>
        <li>
          <b>Download the project and connect it to the CMS</b> (Steps 7–11). We’ll do these together.
        </li>
      </ol>

      <h3>You’ll need</h3>
      <ul>
        <li>
          <b>A laptop where you can install apps yourself.</b> If your laptop asks IT to approve installs, request
          access early.
        </li>
        <li>
          <b>A normal internet connection.</b> Some company VPNs block downloads. If something fails to download, try
          turning the VPN off.
        </li>
        <li>
          <b>About an hour.</b> <Only os="win" as="span">Windows also needs a restart.</Only>
          <Only os="mac" as="span">One Apple download in Step 3 can take a while.</Only>
        </li>
        <li>
          <b>
            A <code>.env</code> file from your facilitator.
          </b>{' '}
          It’s a small text file with the passwords that connect your site to the CMS. You’ll add it in Step 8.
        </li>
        <li>
          Optional: the <b>Mark Desktop</b> app.
        </li>
      </ul>

      <h3>How to use this guide</h3>
      <ul>
        <li>
          <b>Set the two switches at the top:</b> your computer (<b>macOS</b> or <b>Windows</b>) and your shell (
          <b>zsh</b> or <b>bash</b>). The page shows only the steps for you. Not sure about the shell? Leave it for now.{' '}
          <Only os="mac" as="span">Step 1</Only>
          <Only os="win" as="span">Step 2</Only> shows you how to check.
        </li>
        <li>
          <b>Grey boxes are commands to copy.</b> Click <b>Copy</b>, paste the command into the terminal and press{' '}
          <kbd>Enter</kbd>. Run one box at a time.
        </li>
        <li>
          <b>Dashed boxes are examples</b> of what you should see. Don’t type them.
        </li>
        <li>
          <b>Tick each box as you go.</b> Your ticks are saved in this browser, so you can stop and come back later.
        </li>
        <li>
          <b>You can’t break anything in Steps 1–6.</b> If a step goes wrong, run it again or check{' '}
          <a href="#help">Troubleshooting</a>.
        </li>
      </ul>

      <h3>Words you’ll see</h3>
      <div className={s.grid}>
        <div>
          <b>Terminal</b>A window where you type commands instead of clicking. VS Code has one built in.
        </div>
        <div>
          <b>Command</b>A line of text you paste into the terminal. Pressing <kbd>Enter</kbd> runs it.
        </div>
        <div>
          <b>Shell (zsh or bash)</b>The program inside the terminal that runs your commands. There are two common kinds.
          You only need to know which one you have.
        </div>
        <div>
          <b>Project</b>The folder of files that makes up the website. It’s stored on GitHub, a website for sharing
          code.
        </div>
        <div>
          <b>Node.js and Yarn</b>Node runs the website on your laptop. Yarn downloads the building blocks the website
          needs.
        </div>
        <div>
          <b>.env</b>A private settings file with passwords for the CMS. Never share it.
        </div>
        <div>
          <b>localhost</b>Your own laptop acting as a website. Only you can see it.
        </div>
        <Only os="win">
          <b>WSL and Ubuntu</b>WSL lets Windows run Linux, another operating system. Ubuntu is the version of Linux we
          use. The project’s tools run there.
        </Only>
      </div>
    </Card>
  );
}

export function TerminalBasics() {
  return (
    <Card id="basics">
      <h2>Terminal basics: read this once</h2>
      <p>Never used a terminal? These six things are all you need.</p>
      <div className={s.grid}>
        <div>
          <b>1. Click inside first</b>Click in the terminal so your typing goes there. You can’t click to move the
          cursor, so use the arrow keys.
        </div>
        <div>
          <b>2. Paste, then press Enter</b>Paste with{' '}
          <Only os="mac" as="span">
            <kbd>Cmd ⌘</kbd> <kbd>V</kbd>
          </Only>
          <Only os="win" as="span">
            <kbd>Ctrl</kbd> <kbd>V</kbd>, or right-click
          </Only>
          . Nothing happens until you press <kbd>Enter</kbd>.
        </div>
        <div>
          <b>3. Wait for the prompt</b>A command has finished when a new line appears that ends in <code>%</code> or{' '}
          <code>$</code> with the cursor after it. That line is the <i>prompt</i>. Don’t copy or type it.
        </div>
        <div>
          <b>4. Lots of text is normal</b>Most commands print lines as they work. Words like <i>warning</i> or{' '}
          <i>WARN</i> are usually fine. <i>error</i>, <i>ERR!</i> or <i>command not found</i> mean stop and check{' '}
          <a href="#help">Troubleshooting</a>.
        </div>
        <div>
          <b>5. Passwords are invisible</b>When asked for a password, nothing appears as you type, not even dots. Type
          it and press <kbd>Enter</kbd>.
        </div>
        <div>
          <b>
            6. Stuck? Press <StopKey /> <kbd>C</kbd>
          </b>
          This stops whatever is running and brings the prompt back.{' '}
          <Only os="mac" as="span">
            On a Mac, use the <b>Control</b> key, not Command.
          </Only>{' '}
          Pressing <kbd>↑</kbd> brings back your last command.
        </div>
      </div>
      <Check id="basics-read" />
    </Card>
  );
}
