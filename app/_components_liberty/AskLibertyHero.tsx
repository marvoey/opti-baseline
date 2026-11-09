'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AiProgressPanel, { type ProgressChip } from './AiProgressPanel';
import SearchHero from './SearchHero';
import SuggestedChips from './SuggestedChips';
import { safeHref } from './utils';

/** `data-*` attributes, e.g. the on-page-editing markers. */
type DataAttrs = Record<string, string | undefined>;

/** One question the visitor can ask, with the "simulated retrieval" it plays. */
export type AskQuestion = {
  /** Text shown on the chip and echoed in the progress card. */
  question: string;
  /** Where the visitor lands after the animation. Empty = stay on this page. */
  href?: string;
  /** Words that route a typed question to this entry (matched as plain text). */
  keywords?: string[];
  /** Chips shown under "Classify the question". */
  chips?: ProgressChip[];
  /** Lines listed under "Retrieve approved content". */
  items?: string[];
  /** Flag the last retrieved line (the question needs one more detail). */
  warn?: boolean;
  retrievingLabel?: string;
  retrievedLabel?: string;
};

export type AskLibertyHeroProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonLabel?: string;
  questions: AskQuestion[];
  /** Skip the progress card and go straight to the answer. */
  skipAnimation?: boolean;
  /**
   * Visual Builder / CMS preview: the ask flow is switched off. Chips and the
   * search box do nothing, no progress card is shown and nothing navigates.
   */
  editing?: boolean;
  /** On-page-editing markers for the heading and subtitle. */
  editAttrs?: { title?: DataAttrs; subtitle?: DataAttrs };
};

/** Pause after "Your answer is ready" before leaving the page (the mockup's collapse). */
const HANDOFF_MS = 600;

/**
 * Pick the question a typed sentence belongs to: the first entry (in editor
 * order) whose keyword appears in the text, an exact match on its question, or
 * the first entry. Keywords are compared as plain lower-case text, never as a
 * pattern, so editor input cannot become a regular expression.
 */
export function routeQuestion(text: string, questions: AskQuestion[]): AskQuestion | undefined {
  const t = text.trim().toLowerCase();
  if (!t) return questions[0];
  const exact = questions.find((q) => q.question.trim().toLowerCase() === t);
  if (exact) return exact;
  return (
    questions.find((q) => (q.keywords ?? []).some((k) => k.trim() && t.includes(k.trim().toLowerCase()))) ??
    questions[0]
  );
}

/**
 * The Ask Liberty home: hero + suggested questions + the "simulated retrieval"
 * card. Asking (chip or typed question) plays the four-step card (send →
 * classify → retrieve → build), then takes the visitor to the answer page.
 */
export default function AskLibertyHero({
  title,
  subtitle,
  placeholder,
  buttonLabel,
  questions,
  skipAnimation = false,
  editing = false,
  editAttrs,
}: AskLibertyHeroProps) {
  const router = useRouter();
  const [run, setRun] = useState<{ id: number; q: AskQuestion; asked: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Bring the card into view when it appears.
  useEffect(() => {
    if (run) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [run]);

  const go = useCallback(
    (href?: string) => {
      const safe = safeHref(href, '');
      if (!safe || safe === '#') return; // no destination set: stay here
      if (safe.startsWith('/')) router.push(safe);
      else window.location.assign(safe);
    },
    [router],
  );

  const ask = useCallback(
    (q: AskQuestion | undefined, asked: string) => {
      if (!q || editing) return;
      if (skipAnimation) {
        go(q.href);
        return;
      }
      setRun((prev) => ({ id: (prev?.id ?? 0) + 1, q, asked }));
    },
    [editing, skipAnimation, go],
  );

  // An answer page's ask bar sends visitors here as `/?q=<question>`: run that
  // question through the same flow as if it had been typed in the search box.
  useEffect(() => {
    if (editing) return;
    // Deferred so the state update is not made synchronously inside the effect;
    // the cleanup cancels it, so React's double-run in development stays safe.
    const t = setTimeout(() => {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q')?.trim().slice(0, 300);
      if (!q) return;
      url.searchParams.delete('q');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      ask(routeQuestion(q, questions), q);
    }, 0);
    return () => clearTimeout(t);
  }, [ask, editing, questions]);

  const onComplete = useCallback(() => {
    if (!run) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => go(run.q.href), HANDOFF_MS);
  }, [run, go]);

  return (
    <>
      <SearchHero
        title={title}
        subtitle={subtitle}
        placeholder={placeholder}
        buttonLabel={buttonLabel}
        editAttrs={editAttrs}
        onSubmit={(typed) => ask(routeQuestion(typed, questions), typed)}
      >
        <SuggestedChips
          chips={questions.map((q) => ({ label: q.question }))}
          onSelect={(i) => ask(questions[i], questions[i]?.question ?? '')}
        />
      </SearchHero>

      {run && !editing && (
        <div ref={panelRef} aria-live="polite">
          <AiProgressPanel
            key={run.id}
            question={run.asked || run.q.question}
            chips={run.q.chips}
            items={run.q.items}
            warn={run.q.warn}
            retrievingLabel={run.q.retrievingLabel}
            retrievedLabel={run.q.retrievedLabel}
            onComplete={onComplete}
          />
        </div>
      )}
    </>
  );
}
