'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { computeProgress, type CheckId, type Os, type Shell, type WinMode } from '../_lib/checks';
import {
  DEFAULT_FOLDERS,
  finishedFolderName,
  isDefaultFolders,
  resolveFolders,
  typedFolderName,
  type Folders,
} from '../_lib/folders';
import { EMPTY_SITE, finishedSite, finishedSiteField, isEmptySite, typedSiteField, type SiteInput } from '../_lib/site';

/**
 * Guide state for the signed-in colleague: chosen computer, Windows terminal (PowerShell or WSL),
 * shell, the two folder names from Step 7, the site name and opportunity from "You're ready", ticked boxes,
 * and saving.
 *
 * The server renders the page with the progress stored in the CMS (and, for a first visit, a
 * computer guessed from the browser), so the first paint already shows the person's own ticks.
 * Changes are saved to their account in batches: one request per burst of clicks (after 1.2 s of
 * quiet), and straight away when the tab is hidden or closed. A failed save retries every 5 s.
 */

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type Initial = { checks: CheckId[]; os: Os; shell?: Shell; winMode: WinMode; folders?: Folders; site?: SiteInput };

type GuideState = {
  os: Os;
  shell: Shell;
  winMode: WinMode;
  checks: ReadonlySet<CheckId>;
  /** The folder names the commands use (what was typed, or the suggested name where nothing usable was typed). */
  folders: Folders;
  /** What is in the two input boxes right now. */
  typedFolders: Folders;
  /** The site name, opportunity and optional overrides the reader typed (cleaned, nothing worked out), and what is in the boxes right now. */
  site: SiteInput;
  typedSite: SiteInput;
  /** Percent of the prep (everything up to HOMEWORK_LAST_STEP). */
  percent: number;
  /** Percent of the live-session steps (after HOMEWORK_LAST_STEP). */
  sessionPercent: number;
  saveStatus: SaveStatus;
  setOs: (os: Os) => void;
  setShell: (shell: Shell) => void;
  setWinMode: (mode: WinMode) => void;
  setChecked: (id: CheckId, on: boolean) => void;
  /** Typing in a folder box: lower case, dashes and numbers only. */
  setFolder: (which: keyof Folders, raw: string) => void;
  /** Leaving a folder box: tidy the name (no trailing dash, empty goes back to the suggested name). */
  finishFolder: (which: keyof Folders) => void;
  /** Typing in one of the four site boxes. Each keeps only what that box allows (see _lib/site.ts). */
  setSiteField: (which: keyof SiteInput, raw: string) => void;
  /** Leaving one of those boxes: drop trailing spaces and dashes. */
  finishSiteField: (which: keyof SiteInput) => void;
};

const GuideContext = createContext<GuideState | null>(null);

export function useGuide(): GuideState {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error('useGuide must be used inside <GuideProvider>');
  return ctx;
}

const SAVE_URL = '/setup-guide/api/progress';
const DEBOUNCE_MS = 1200;
const RETRY_MS = 5000;

export function GuideProvider({ initial, children }: { initial: Initial; children: ReactNode }) {
  const router = useRouter();
  const [os, setOsState] = useState<Os>(initial.os);
  const [winMode, setWinModeState] = useState<WinMode>(initial.winMode);
  // Until the person picks a shell it follows the computer: macOS uses zsh, Ubuntu (WSL) uses bash.
  const [chosenShell, setChosenShell] = useState<Shell | undefined>(initial.shell);
  const [checks, setChecks] = useState<ReadonlySet<CheckId>>(() => new Set(initial.checks));
  const [typedFolders, setTypedFolders] = useState<Folders>(initial.folders ?? DEFAULT_FOLDERS);
  const [typedSite, setTypedSite] = useState<SiteInput>(initial.site ?? EMPTY_SITE);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  // Bumped on every change / failed save; the effects below turn them into timed saves.
  const [changes, setChanges] = useState(0);
  const [failures, setFailures] = useState(0);

  const shell: Shell = chosenShell ?? (os === 'mac' ? 'zsh' : 'bash');
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const folders = useMemo(() => resolveFolders(typedFolders), [typedFolders]);
  const site = useMemo<SiteInput>(() => finishedSite(typedSite), [typedSite]);
  const latest = useRef({ os, winMode, chosenShell, checks, folders, site });
  useEffect(() => {
    latest.current = { os, winMode, chosenShell, checks, folders, site };
  }, [os, winMode, chosenShell, checks, folders, site]);

  const save = useCallback(
    async () => {
      clearTimeout(timer.current);
      if (!dirty.current) return;
      dirty.current = false;
      const { os: o, winMode: w, chosenShell: s, checks: c, folders: f, site: si } = latest.current;
      setSaveStatus('saving');
      try {
        const res = await fetch(SAVE_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          // Folder names are only sent once they differ from the suggested ones, so a later change to the suggestions still reaches people who never chose their own.
          body: JSON.stringify({ checks: [...c], os: o, shell: s, winMode: w,
            folders: isDefaultFolders(f) ? undefined : f,
            site: isEmptySite(si) ? undefined : si,
          }),
          // keepalive: a save that is still in flight when the person reloads or closes the tab is not cancelled
          // (the body is a few hundred bytes, far below the 64 KB limit).
          keepalive: true,
          credentials: 'same-origin',
        });
        if (res.status === 401) {
          // Session ended (signed out elsewhere, or the account was disabled).
          router.replace('/setup-guide/login');
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        setSaveStatus('saved');
      } catch {
        dirty.current = true;
        setSaveStatus('error');
        setFailures((n) => n + 1);
      }
    },
    [router],
  );

  // Debounced save after a change (runs after commit, so `latest` already holds the new values).
  useEffect(() => {
    if (!changes) return;
    dirty.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), DEBOUNCE_MS);
  }, [changes, save]);

  // Retry after a failed save.
  useEffect(() => {
    if (!failures) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), RETRY_MS);
  }, [failures, save]);

  // Flush pending changes when the tab is hidden or closed.
  useEffect(() => {
    const flush = () => {
      if (dirty.current) void save();
    };
    const onVisibility = () => document.visibilityState === 'hidden' && flush();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      clearTimeout(timer.current);
    };
  }, [save]);

  const value = useMemo<GuideState>(() => {
    const changed = () => setChanges((n) => n + 1);
    return {
      os,
      shell,
      winMode,
      checks,
      folders,
      typedFolders,
      site,
      typedSite,
      percent: computeProgress(checks, os, winMode, 'prep').percent,
      sessionPercent: computeProgress(checks, os, winMode, 'session').percent,
      saveStatus,
      setOs: (next) => {
        setOsState(next);
        changed();
      },
      setShell: (next) => {
        setChosenShell(next);
        changed();
      },
      setWinMode: (next) => {
        setWinModeState(next);
        changed();
      },
      setFolder: (which, raw) => {
        setTypedFolders((prev) => ({ ...prev, [which]: typedFolderName(raw) }));
        changed();
      },
      finishFolder: (which) => {
        setTypedFolders((prev) => ({ ...prev, [which]: finishedFolderName(prev[which]) || DEFAULT_FOLDERS[which] }));
      },
      setSiteField: (which, raw) => {
        setTypedSite((prev) => ({ ...prev, [which]: typedSiteField(which, raw) }));
        changed();
      },
      finishSiteField: (which) => {
        setTypedSite((prev) => ({ ...prev, [which]: finishedSiteField(which, prev[which]) }));
      },
      setChecked: (id, on) => {
        setChecks((prev) => {
          const copy = new Set(prev);
          if (on) copy.add(id);
          else copy.delete(id);
          return copy;
        });
        changed();
      },
    };
  }, [os, shell, winMode, checks, folders, typedFolders, site, typedSite, saveStatus]);

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}
