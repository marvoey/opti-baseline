import Image from 'next/image';
import s from '../setup-guide.module.css';
import { FACILITATOR } from '../_lib/contact';
import { Check } from '../_components/controls';
import { Callout, Card, Only, StopKey } from '../_components/ui';

const CHIPS = ['Optimizely CMS (SaaS) only', 'VS Code', 'Git', 'Node.js 22', 'Yarn 4', 'About 1 hour'];

export function Hero() {
  return (
    <Card className={s.hero}>
      <div>
        <div className={s.eyebrow}>Mark AI · Custom Demo · Setup guide</div>
        <h1>Your setup, sorted.</h1>
        <p className={s.lede}>
          Everything your laptop needs to build a custom <b>Optimizely CMS (SaaS)</b> demo site. <b>No coding experience needed.</b>{' '}
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

      <Callout kind="warn" title="This guide is for Optimizely CMS (SaaS) only">
        The project and every step here are built for <b>Optimizely CMS (SaaS)</b>, the cloud-hosted CMS. It does{' '}
        <b>not</b> work with <b>Optimizely CMS (PaaS)</b>, the older .NET version that is installed and hosted
        separately. If your CMS is a PaaS one, or you’re not sure which you have, stop here and ask your CMS
        administrator or {FACILITATOR} before you continue.
      </Callout>

      <h3>What you’ll do</h3>
      <ol>
        <li>
          <b>Install four free tools, download the project and install its packages</b> (Steps 1–8).
        </li>
        <li>
          <b>Connect the project to the CMS and run it</b> (Steps 9–12).
        </li>
      </ol>

      <h3>You’ll need</h3>
      <ul>
        <li>
          <b>A laptop where you can install apps yourself.</b> If your laptop asks IT to approve installs, request
          access early.
        </li>
        <Only os="win" mode="native" as="li">
          <b>Permission to say “Yes” to Windows pop-ups.</b> While you install, Windows asks{' '}
          <i>“Do you want to allow this app to make changes to your device?”</i> a few times. That needs an
          administrator account on your laptop.
        </Only>
        <li>
          <b>A normal internet connection.</b> Some company VPNs block downloads. If something fails to download, try
          turning the VPN off.
        </li>
        <li>
          <b>About an hour.</b>{' '}
          <Only os="win" mode="native" as="span">No restart needed.</Only>
          <Only os="win" mode="wsl" as="span">WSL also needs a Windows restart.</Only>
          <Only os="mac" as="span">One Apple download in Step 3 can take a while.</Only>
        </li>
        <li>
          <b>Nothing for the CMS yet.</b> In Steps 9–12 you’ll copy a settings template into your own{' '}
          <code>.env</code> file and get your private keys from the CMS. That needs administrator access to the CMS.
        </li>
        <li>
          <b>Your Optimizely account.</b> In Step 12 you’ll install the <b>Mark Desktop</b> app and sign in to it.
          Nothing to install for it before then.
        </li>
      </ul>

      <h3>How to use this guide</h3>
      <ul>
        <li>
          <b>Set the switches at the top.</b> Pick your computer (<b>macOS</b> or <b>Windows</b>) and the page shows only
          your steps.{' '}
          <Only os="win" mode="native" as="span">
            Leave <b>Windows terminal</b> on <b>PowerShell</b>: it’s the simplest way, and it’s already on your laptop.
          </Only>
          <Only os="win" mode="wsl" as="span">
            You chose <b>WSL</b>, the advanced way. You also pick a shell (<b>zsh</b> or <b>bash</b>). Step 2 shows you
            how to check.
          </Only>
          <Only os="mac" as="span">
            Also pick your shell (<b>zsh</b> or <b>bash</b>). Step 1 shows you how to check.
          </Only>
        </li>
        <li>
          <b>Grey boxes are commands to copy.</b> Click <b>Copy</b>, paste the command into the terminal and press{' '}
          <kbd>Enter</kbd>. Run one box at a time.
        </li>
        <li>
          <b>Dashed boxes are examples</b> of what you should see. Don’t type them.
        </li>
        <li>
          <b>Tick each box as you go.</b> Your ticks are saved to your account, so you can stop and come back later.
        </li>
        <li>
          <b>You can’t break anything in Steps 1–8.</b> If a step goes wrong, run it again or check{' '}
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
        <Only os="win" mode="native">
          <b>PowerShell</b>The terminal that comes with Windows. VS Code’s built-in terminal is PowerShell too.
        </Only>
        <Only os="win" mode="native">
          <b>winget</b>Windows’s built-in app installer. It installs a tool from one command, so there’s nothing to
          download by hand.
        </Only>
        <Only unix>
          <b>Shell (zsh or bash)</b>The program inside the terminal that runs your commands. There are two common kinds.
          You only need to know which one you have.
        </Only>
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
          <b>API key</b>A long code that works like a password, so one program can talk to another. Your site uses them
          to talk to the CMS.
        </div>
        <div>
          <b>localhost</b>Your own laptop acting as a website. Only you can see it.
        </div>
        <Only os="win" mode="wsl">
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
          <b>3. Wait for the prompt</b>A command has finished when a new line appears with the cursor after it. That
          line is the <i>prompt</i>. Don’t copy or type it. It ends in{' '}
          <Only unix as="span">
            <code>%</code> or <code>$</code>
          </Only>
          <Only os="win" mode="native" as="span">
            <code>&gt;</code>, for example <code>PS C:\Users\you&gt;</code>
          </Only>
          .
        </div>
        <div>
          <b>4. Lots of text is normal</b>Most commands print lines as they work. Words like <i>warning</i> or{' '}
          <i>WARN</i> are usually fine. <i>error</i>, <i>ERR!</i>
          <Only unix as="span">
            {' '}
            or <i>command not found</i>
          </Only>
          <Only os="win" mode="native" as="span">
            {' '}
            or <i>is not recognized</i>
          </Only>{' '}
          mean stop and check <a href="#help">Troubleshooting</a>.
        </div>
        <Only unix>
          <b>5. Passwords are invisible</b>When asked for a password, nothing appears as you type, not even dots. Type
          it and press <kbd>Enter</kbd>.
        </Only>
        <Only os="win" mode="native">
          <b>5. Windows will ask permission</b>When you install something, a window asks{' '}
          <i>“Do you want to allow this app to make changes to your device?”</i> That’s normal. Click <b>Yes</b>.
        </Only>
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
