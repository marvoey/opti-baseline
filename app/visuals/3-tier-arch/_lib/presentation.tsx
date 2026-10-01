'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PILOT_EMPLOYER, PRESENTER_PATH, STEPS, type Persona } from '../_data/layers';

type Msg =
  | { type: 'nav'; path: string }
  | { type: 'goto'; path: string }
  | { type: 'pilot'; persona: Persona }
  | { type: 'hello' };

type Ctx = {
  persona: Persona;
  employer: string;
  setPersona: (p: Persona) => void;
  /** Current step index (audience: from the URL; presenter: mirrored from the audience window). */
  step: number;
  isPresenter: boolean;
  goTo: (index: number) => void;
  openPresenter: () => void;
};

const PresentationContext = createContext<Ctx | null>(null);

const CHANNEL = 'cco-3tier';
const STORAGE_KEY = 'cco-3tier-persona';

export function usePresentation() {
  const ctx = useContext(PresentationContext);
  if (!ctx) throw new Error('usePresentation must be used inside <PresentationProvider>');
  return ctx;
}

export function PresentationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPresenter = pathname.startsWith(PRESENTER_PATH);

  const [persona, setPersonaState] = useState<Persona>('female');
  const [audiencePath, setAudiencePath] = useState<string>(STEPS[0]);
  const channel = useRef<BroadcastChannel | null>(null);
  const presenterWin = useRef<Window | null>(null);

  const post = useCallback((msg: Msg) => channel.current?.postMessage(msg), []);

  const step = Math.max(0, STEPS.indexOf((isPresenter ? audiencePath : pathname.replace(/\/$/, '')) as (typeof STEPS)[number]));

  // Restore persisted persona after mount (avoids hydration mismatch).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore post-hydration
      if (saved === 'female' || saved === 'male') setPersonaState(saved);
    } catch {}
  }, []);

  // Channel wiring.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent<Msg>) => {
      const m = e.data;
      if (m.type === 'pilot') setPersonaState(m.persona);
      else if (m.type === 'nav' && isPresenter) setAudiencePath(m.path);
      else if (m.type === 'goto' && !isPresenter) router.push(m.path);
      else if (m.type === 'hello' && !isPresenter) {
        ch.postMessage({ type: 'nav', path: pathname } satisfies Msg);
        ch.postMessage({ type: 'pilot', persona } satisfies Msg);
      }
    };
    if (isPresenter) ch.postMessage({ type: 'hello' } satisfies Msg);
    return () => {
      ch.close();
      channel.current = null;
    };
  }, [isPresenter, router, pathname, persona]);

  // Audience announces every navigation.
  useEffect(() => {
    if (!isPresenter) post({ type: 'nav', path: pathname.replace(/\/$/, '') });
  }, [isPresenter, pathname, post]);

  const setPersona = useCallback(
    (p: Persona) => {
      setPersonaState(p);
      try {
        localStorage.setItem(STORAGE_KEY, p);
      } catch {}
      post({ type: 'pilot', persona: p });
    },
    [post],
  );

  const goTo = useCallback(
    (index: number) => {
      const path = STEPS[Math.min(Math.max(index, 0), STEPS.length - 1)];
      if (isPresenter) post({ type: 'goto', path });
      else router.push(path);
    },
    [isPresenter, post, router],
  );

  const openPresenter = useCallback(() => {
    if (presenterWin.current && !presenterWin.current.closed) {
      presenterWin.current.focus();
      return;
    }
    presenterWin.current = window.open(PRESENTER_PATH, 'cco-presenter', 'popup,width=560,height=860');
  }, []);

  // Keyboard: ← / → step, P opens presenter, F toggles full screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') goTo(step + 1);
      else if (e.key === 'ArrowLeft') goTo(step - 1);
      else if ((e.key === 'p' || e.key === 'P') && !isPresenter) openPresenter();
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, openPresenter, step, isPresenter]);

  const value = useMemo<Ctx>(
    () => ({ persona, employer: PILOT_EMPLOYER, setPersona, step, isPresenter, goTo, openPresenter }),
    [persona, setPersona, step, isPresenter, goTo, openPresenter],
  );

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}
