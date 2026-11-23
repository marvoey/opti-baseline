/**
 * Reader choices (computer, shell) and ticks, kept in localStorage so a reader can stop and
 * come back later. Read through useSyncExternalStore: the server render always uses the
 * defaults (macOS, zsh, nothing ticked) and the browser switches to the saved values right
 * after hydration, with no hydration mismatch.
 *
 * Only import this from client components.
 */
import { useSyncExternalStore } from 'react';
import { CHECKS, type CheckId } from './checks';

export type Os = 'mac' | 'win';
export type Shell = 'zsh' | 'bash';

const OS_KEY = 'ob-os';
const SHELL_KEY = 'ob-shell';
const checkKey = (id: CheckId) => `ob-${id}`;

const listeners = new Set<() => void>();
// Fallback when localStorage is unavailable (blocked storage, some private modes).
const memory = new Map<string, string>();

function read(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Not persisted; the in-memory value still drives this visit.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep several open tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key) memory.delete(event.key);
    onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function currentOs(): Os {
  const saved = read(OS_KEY);
  if (saved === 'mac' || saved === 'win') return saved;
  return /Win/i.test(window.navigator.userAgent) ? 'win' : 'mac';
}

// Until the reader picks a shell, it follows the computer: macOS uses zsh, Ubuntu uses bash.
function currentShell(): Shell {
  const saved = read(SHELL_KEY);
  if (saved === 'zsh' || saved === 'bash') return saved;
  return currentOs() === 'mac' ? 'zsh' : 'bash';
}

function appliesTo(id: string, os: Os) {
  if (id.startsWith('mac-')) return os === 'mac';
  if (id.startsWith('win-')) return os === 'win';
  return true;
}

function currentProgress(): number {
  const os = currentOs();
  const ids = (Object.keys(CHECKS) as CheckId[]).filter((id) => appliesTo(id, os));
  const done = ids.filter((id) => read(checkKey(id)) === '1').length;
  return ids.length ? Math.round((done / ids.length) * 100) : 0;
}

const serverOs = (): Os => 'mac';
const serverShell = (): Shell => 'zsh';
const serverFalse = () => false;
const serverZero = () => 0;

export const useOs = () => useSyncExternalStore(subscribe, currentOs, serverOs);
export const useShell = () => useSyncExternalStore(subscribe, currentShell, serverShell);
export const useProgress = () => useSyncExternalStore(subscribe, currentProgress, serverZero);
export const useChecked = (id: CheckId) =>
  useSyncExternalStore(subscribe, () => read(checkKey(id)) === '1', serverFalse);

export const setOs = (os: Os) => write(OS_KEY, os);
export const setShell = (shell: Shell) => write(SHELL_KEY, shell);
export const setChecked = (id: CheckId, on: boolean) => write(checkKey(id), on ? '1' : '0');
