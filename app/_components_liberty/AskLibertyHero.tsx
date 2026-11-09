'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AiProgressPanel, { type ProgressChip } from './AiProgressPanel';
import { routeQuestion, type AskQuestion } from './askRouting';
import { chipsFromResult, resolveMarkQuestion } from './matchClassification';
import SearchHero from './SearchHero';
import SuggestedChips from './SuggestedChips';
import { useAskMark } from './useAskMark';
import { safeHref } from './utils';

// Kept here so existing imports of these keep working.
export { routeQuestion };
export type { AskQuestion };

/** `data-*` attributes, e.g. the on-page-editing markers. */
type DataAttrs = Record<string, string | undefined>;

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
  /**
   * Send questions to Mark. True only when the CMS checkbox is on AND the server
   * is set up for it. When false the card is the simulated flow.
   */
  markEnabled?: boolean;
  /** How long to wait for Mark before using keyword routing instead. */
  markTimeoutMs?: number;
  /** On-page-editing markers for the heading and subtitle. */
  editAttrs?: { title?: DataAttrs; subtitle?: DataAttrs };
};

/** Pause after "Your answer is ready" before leaving the page (the mockup's collapse). */
const HANDOFF_MS = 600;
const MAX_QUESTION_CHARS = 300;
const MARK_NOTICE = 'Mark is taking longer than usual, using approved keyword routing.';

type Run = {
  id: number;
  /** What the visitor asked, echoed at the top of the card. */
  asked: string;
  /** The question whose page the visitor lands on. Unknown until Mark answers. */
  q?: AskQuestion;
  /** 'mark' = waiting on a real request; 'sim' = the simulated timeline. */
  mode: 'mark' | 'sim';
  phase?: 'sending' | 'classifying' | 'retrieving';
  liveChips?: ProgressChip[];
  reasoning?: string;
  notice?: string;
};

/**
 * The Ask Liberty home: hero + suggested questions + the progress card. Asking
 * (a chip, a typed question, or `/?q=`) plays the four-step card and then opens
 * the answer page.
 *
 * With Mark on, the card is live: step 1 waits for the request to reach Mark and
 * step 2 for Mark's classification, which is matched to an approved CMS question.
 * Mark never writes the answer. If Mark is slow or fails, the card says so and
 * the simulated flow takes over with keyword routing, so there is no dead end.
 */
export default function AskLibertyHero({
  title,
  subtitle,
  placeholder,
  buttonLabel,
  questions,
  skipAnimation = false,
  editing = false,
  markEnabled = false,
  markTimeoutMs = 20_000,
  editAttrs,
}: AskLibertyHeroProps) {
  const router = useRouter();
  const { submit } = useAskMark();
  const [run, setRun] = useState<Run | null>(null);
  const seq = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Bring the card into view when a new one appears.
  const runId = run?.id;
  useEffect(() => {
    if (runId) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [runId]);

  const go = useCallback(
    (href?: string) => {
      const safe = safeHref(href, '');
      if (!safe || safe === '#') return; // no destination set: stay here
      if (safe.startsWith('/')) router.push(safe);
      else window.location.assign(safe);
    },
    [router],
  );

  const runSimulated = useCallback((q: AskQuestion | undefined, asked: string, notice?: string) => {
    setRun({ id: ++seq.current, asked, q, mode: 'sim', notice });
  }, []);

  /** Ask Mark. `fixed` is a clicked chip: Mark still classifies (for the card) but the chip's own page is the destination. */
  const runWithMark = useCallback(
    async (text: string, fixed?: AskQuestion) => {
      const id = ++seq.current;
      setRun({ id, asked: text, q: fixed, mode: 'mark', phase: 'sending' });

      const outcome = await submit(text, {
        timeoutMs: markTimeoutMs,
        onSent: () => setRun((r) => (r?.id === id ? { ...r, phase: 'classifying' } : r)),
      });
      if (seq.current !== id) return; // a newer question took over

      if (outcome.status === 'result') {
        const q = fixed ?? resolveMarkQuestion(outcome.payload, text, questions).question;
        setRun((r) =>
          r?.id === id
            ? {
                ...r,
                q,
                phase: 'retrieving',
                liveChips: chipsFromResult(outcome.payload, q),
                reasoning: outcome.payload.reasoning,
              }
            : r,
        );
      } else if (outcome.status !== 'aborted') {
        // Timeout, or Mark / the store failed: say so, then use keyword routing.
        runSimulated(fixed ?? routeQuestion(text, questions), text, MARK_NOTICE);
      }
    },
    [submit, markTimeoutMs, questions, runSimulated],
  );

  /** A typed question, or one handed over by an answer page's ask bar (`/?q=`). */
  const askTyped = useCallback(
    (raw: string) => {
      if (editing) return;
      const text = raw.trim().slice(0, MAX_QUESTION_CHARS);
      if (skipAnimation) {
        go(routeQuestion(text, questions)?.href);
        return;
      }
      if (markEnabled && text) void runWithMark(text);
      else runSimulated(routeQuestion(text, questions), text);
    },
    [editing, skipAnimation, markEnabled, questions, go, runWithMark, runSimulated],
  );

  const askChip = useCallback(
    (q: AskQuestion) => {
      if (editing) return;
      if (skipAnimation) {
        go(q.href);
        return;
      }
      if (markEnabled) void runWithMark(q.question, q);
      else runSimulated(q, q.question);
    },
    [editing, skipAnimation, markEnabled, go, runWithMark, runSimulated],
  );

  // An answer page's ask bar sends visitors here as `/?q=<question>`: run that
  // question through the same flow as if it had been typed in the search box.
  useEffect(() => {
    if (editing) return;
    // Deferred so the state update is not made synchronously inside the effect;
    // the cleanup cancels it, so React's double-run in development stays safe.
    const t = setTimeout(() => {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q')?.trim().slice(0, MAX_QUESTION_CHARS);
      if (!q) return;
      url.searchParams.delete('q');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      askTyped(q);
    }, 0);
    return () => clearTimeout(t);
  }, [askTyped, editing]);

  const onComplete = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => go(run?.q?.href), HANDOFF_MS);
  }, [run, go]);

  // Only questions that are not hidden are offered as chips.
  const visible = questions.filter((q) => !q.hideChip);

  return (
    <>
      <SearchHero
        title={title}
        subtitle={subtitle}
        placeholder={placeholder}
        buttonLabel={buttonLabel}
        editAttrs={editAttrs}
        onSubmit={askTyped}
      >
        <SuggestedChips
          chips={visible.map((q) => ({ label: q.question }))}
          onSelect={(i) => {
            const q = visible[i];
            if (q) askChip(q);
          }}
        />
      </SearchHero>

      {run && !editing && (
        <div ref={panelRef} aria-live="polite">
          {run.mode === 'mark' ? (
            <AiProgressPanel
              key={run.id}
              question={run.asked}
              phase={run.phase}
              chips={[]}
              liveChips={run.liveChips}
              reasoning={run.reasoning}
              items={run.q?.items ?? []}
              warn={run.q?.warn}
              retrievingLabel={run.q?.retrievingLabel}
              retrievedLabel={run.q?.retrievedLabel}
              onComplete={onComplete}
            />
          ) : (
            <AiProgressPanel
              key={run.id}
              question={run.asked || run.q?.question}
              chips={run.q?.chips}
              items={run.q?.items}
              warn={run.q?.warn}
              retrievingLabel={run.q?.retrievingLabel}
              retrievedLabel={run.q?.retrievedLabel}
              notice={run.notice}
              onComplete={onComplete}
            />
          )}
        </div>
      )}
    </>
  );
}
