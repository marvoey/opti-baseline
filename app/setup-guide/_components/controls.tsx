'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { CHECKS, type CheckId } from '../_lib/checks';
import {
  setChecked,
  setOs,
  setShell,
  useChecked,
  useOs,
  useProgress,
  useShell,
  type Os,
  type Shell,
} from '../_lib/guideStore';

/** Wraps the page and tells the CSS which computer and shell to show. */
export function GuideRoot({ children }: { children: ReactNode }) {
  const os = useOs();
  const shell = useShell();
  return (
    <div className={s.page} data-os={os} data-shell={shell}>
      {children}
    </div>
  );
}

const OS_OPTIONS: { value: Os; label: string }[] = [
  { value: 'mac', label: 'macOS' },
  { value: 'win', label: 'Windows' },
];
const SHELL_OPTIONS: Shell[] = ['zsh', 'bash'];

export function OsSwitch() {
  const os = useOs();
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

export function ShellSwitch({ inline = false }: { inline?: boolean }) {
  const shell = useShell();
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

export function Progress() {
  const pct = useProgress();
  return (
    <div className={s.progress}>
      <span role="status" aria-live="polite">
        {pct}% done
      </span>
      <div className={s.bar}>
        <div className={s.barFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Check({ id }: { id: CheckId }) {
  const checked = useChecked(id);
  return (
    <label className={s.checkRow}>
      <input type="checkbox" checked={checked} onChange={(e) => setChecked(id, e.target.checked)} />
      <span>{CHECKS[id]}</span>
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
