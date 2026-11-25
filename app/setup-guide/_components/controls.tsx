'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { CHECKS, type CheckId, type Os, type Shell, type WinMode } from '../_lib/checks';
import { useGuide } from './GuideProvider';

/** Wraps the page and tells the CSS which computer, Windows terminal and shell to show. */
export function GuideRoot({ children }: { children: ReactNode }) {
  const { os, shell, winMode } = useGuide();
  return (
    <div className={s.page} data-os={os} data-shell={shell} data-win={winMode}>
      {children}
    </div>
  );
}

const OS_OPTIONS: { value: Os; label: string }[] = [
  { value: 'mac', label: 'macOS' },
  { value: 'win', label: 'Windows' },
];
const SHELL_OPTIONS: Shell[] = ['zsh', 'bash'];
const WIN_OPTIONS: { value: WinMode; label: string }[] = [
  { value: 'native', label: 'PowerShell' },
  { value: 'wsl', label: 'WSL (advanced)' },
];

export function OsSwitch() {
  const { os, setOs } = useGuide();
  return (
    <div className={s.seg} role="group" aria-label="Choose your computer">
      {OS_OPTIONS.map(({ value, label }) => (
        <button key={value} type="button" aria-pressed={os === value} onClick={() => setOs(value)}>
          {label}
        </button>
      ))}
    </div>
  );
}

/** PowerShell (default) or WSL. Only meaningful on Windows. */
export function WinModeSwitch({ inline = false }: { inline?: boolean }) {
  const { winMode, setWinMode } = useGuide();
  return (
    <div className={inline ? `${s.seg} ${s.segInline}` : s.seg} role="group" aria-label="Choose your Windows terminal">
      {WIN_OPTIONS.map(({ value, label }) => (
        <button key={value} type="button" aria-pressed={winMode === value} onClick={() => setWinMode(value)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function ShellSwitch({ inline = false }: { inline?: boolean }) {
  const { shell, setShell } = useGuide();
  return (
    <div className={inline ? `${s.seg} ${s.segInline}` : s.seg} role="group" aria-label="Choose your shell">
      {SHELL_OPTIONS.map((value) => (
        <button key={value} type="button" aria-pressed={shell === value} onClick={() => setShell(value)}>
          {value}
        </button>
      ))}
    </div>
  );
}

/** Top-bar control, shown only on Windows. */
export function TerminalControl() {
  const { os } = useGuide();
  if (os !== 'win') return null;
  return (
    <>
      <span className={s.segLabel}>Windows terminal</span>
      <WinModeSwitch />
    </>
  );
}

/** Top-bar control, shown on macOS and in WSL. PowerShell has no zsh/bash choice. */
export function ShellControl() {
  const { os, winMode } = useGuide();
  if (os === 'win' && winMode === 'native') return null;
  return (
    <>
      <span className={s.segLabel}>Shell</span>
      <ShellSwitch />
    </>
  );
}

/** Progress through all the steps. */
export function Progress() {
  const { percent } = useGuide();
  return (
    <div className={s.progress}>
      <span role="status" aria-live="polite">
        {percent === 100 ? 'All done ✓' : `${percent}% done`}
      </span>
      <div className={s.bar}>
        <div className={s.barFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

const SAVE_LABEL = {
  idle: 'Progress saved to your account',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Not saved yet. Retrying…',
} as const;

export function SaveStatus() {
  const { saveStatus } = useGuide();
  return (
    <span className={saveStatus === 'error' ? `${s.saveStatus} ${s.saveError}` : s.saveStatus} role="status" aria-live="polite">
      {SAVE_LABEL[saveStatus]}
    </span>
  );
}

/** A tick box. `label` overrides the default text for this id (for wording that differs by computer). */
export function Check({ id, label }: { id: CheckId; label?: string }) {
  const { checks, setChecked } = useGuide();
  return (
    <label className={s.checkRow}>
      <input type="checkbox" checked={checks.has(id)} onChange={(e) => setChecked(id, e.target.checked)} />
      <span>{label ?? CHECKS[id]}</span>
    </label>
  );
}

function legacyCopy(text: string) {
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(area);
  }
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      // navigator.clipboard only exists on https and localhost.
      await navigator.clipboard.writeText(text);
    } catch {
      legacyCopy(text);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className={copied ? `${s.copy} ${s.copyDone}` : s.copy} onClick={copy} aria-live="polite">
      {copied ? 'Copied' : 'Copy'}
      {!copied && <span className={s.srOnly}> this command</span>}
    </button>
  );
}
