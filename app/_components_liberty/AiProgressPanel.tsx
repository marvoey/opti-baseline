'use client';

import { useEffect, useRef, useState } from 'react';
import { cx } from './utils';
import './liberty.css';

export type ProgressChip = { label: string; value: string; warn?: boolean };

export type ProgressTexts = {
  sending: string;
  sent: string;
  classifying: string;
  classified: string;
  building: string;
  ready: string;
  /** Short flow (a detail the visitor just supplied): step 1. */
  shortSelection: string;
  /** Short flow: step 2 while running / when done. */
  shortUpdating: string;
  shortUpdated: string;
};

export type AiProgressPanelProps = {
  /** The visitor's question, echoed at the top of the card. */
  question?: string;
  /** Small uppercase label above the question. */
  eyebrow?: string;
  /** The four step names. */
  stepLabels?: [string, string, string, string];
  /** Classification chips shown under step 2. Set `warn` to colour one yellow. */
  chips?: ProgressChip[];
  /** Step 3 text while retrieving / when finished. */
  retrievingLabel?: string;
  retrievedLabel?: string;
  /** Lines listed under step 3 once content is retrieved. */
  items?: string[];
  /** Finish step 3 with a yellow "!" and flag the last item (the question needs more detail). */
  warn?: boolean;
  /** Short flow: skips full classification (used after the visitor picks a state). */
  short?: boolean;
  /** Override any of the status sentences. */
  texts?: Partial<ProgressTexts>;
  /** Play the animation on mount. When false the finished state is shown. */
  autoPlay?: boolean;
  /** Change this number to replay. */
  playKey?: number;
  /** 1 = the mockup's pace; 2 = twice as fast. */
  speed?: number;
  /**
   * Called once when an auto-played run reaches "Your answer is ready" (also
   * when reduced motion skips the animation). Not called when `autoPlay` is
   * false, or when the run is cancelled by a replay or unmount.
   */
  onComplete?: () => void;
  className?: string;
};

const DEFAULT_TEXTS: ProgressTexts = {
  sending: 'Sending your question to Mark',
  sent: 'Question sent to Mark',
  classifying: 'Mark is classifying your question',
  classified: 'Done classifying your question',
  building: 'Building your answer',
  ready: 'Your answer is ready',
  shortSelection: 'Using your selection: Texas',
  shortUpdating: 'Adding your state to Mark’s classification',
  shortUpdated: 'Classification updated',
};

const DEFAULT_LABELS: [string, string, string, string] = [
  'Send question to Mark',
  'Classify the question',
  'Retrieve approved content',
  'Build your answer',
];

const DEFAULT_CHIPS: ProgressChip[] = [
  { label: 'Intent', value: 'Learn about coverage' },
  { label: 'Product', value: 'Auto' },
  { label: 'Topic', value: 'Rental cars' },
  { label: 'Coverage', value: 'Collision & comprehensive' },
  { label: 'State', value: 'Not needed' },
];

const DEFAULT_ITEMS = [
  'Answer · Rental car coverage',
  'How your coverages apply · 5 coverages',
  '2 approved sources',
  'Next step · Talk to a local agent',
  'Disclosure',
];

type StepState = 'pending' | 'active' | 'done' | 'warn';
type Step = { state: StepState; text: string };

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- tiny icons ---- */
const SPARK = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z" />
    <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z" opacity=".75" />
  </svg>
);

function StepIcon({ state }: { state: StepState }) {
  if (state === 'active') {
    return (
      <svg className="w-7 h-7 lib-spin" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#E6F4F6" strokeWidth="3" fill="none" />
        <path d="M22 12a10 10 0 00-10-10" stroke="#06748C" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (state === 'done') {
    return (
      <span className="lib-pop w-7 h-7 rounded-full bg-lmt flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (state === 'warn') {
    return (
      <span className="lib-pop w-7 h-7 rounded-full bg-lmy flex items-center justify-center text-navy font-bold text-sm">
        !
      </span>
    );
  }
  return <span className="block w-7 h-7 rounded-full border-2 border-gray-200" />;
}

function ItemIcon({ warn }: { warn?: boolean }) {
  if (warn) {
    return (
      <span className="w-4 h-4 rounded-full bg-lmy text-navy text-[10px] font-bold flex items-center justify-center shrink-0">
        !
      </span>
    );
  }
  return (
    <svg className="w-4 h-4 text-lmt shrink-0" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * C32 — the "assistant at work" card shown while an answer is generated:
 * Send question → Classify → Retrieve approved content → Build answer.
 *
 * Plays automatically on mount (ported from the mockup's `runPanel`). With
 * `autoPlay={false}` it shows the finished state instead — handy for static
 * screenshots. `warn` and `short` reproduce the mockup's warning and short
 * flows. Every sentence is a prop.
 */
export default function AiProgressPanel({
  question = 'Does my car insurance cover a rental car?',
  eyebrow = 'Ask Liberty',
  stepLabels = DEFAULT_LABELS,
  chips = DEFAULT_CHIPS,
  retrievingLabel = 'Retrieving approved Liberty Mutual content',
  retrievedLabel = 'Approved content retrieved',
  items = DEFAULT_ITEMS,
  warn = false,
  short = false,
  texts,
  autoPlay = true,
  playKey = 0,
  speed = 1,
  onComplete,
  className,
}: AiProgressPanelProps) {
  const t: ProgressTexts = { ...DEFAULT_TEXTS, ...texts };

  const pending = (): Step[] => stepLabels.map((text) => ({ state: 'pending', text }));
  const finished = (): Step[] => [
    { state: 'done', text: short ? t.shortSelection : t.sent },
    { state: 'done', text: short ? t.shortUpdated : t.classified },
    { state: warn ? 'warn' : 'done', text: retrievedLabel },
    { state: 'done', text: t.ready },
  ];

  const [steps, setSteps] = useState<Step[]>(autoPlay ? pending : finished);
  const [chipCount, setChipCount] = useState(autoPlay ? 0 : chips.length);
  const [itemCount, setItemCount] = useState(autoPlay ? 0 : items.length);
  const [shimmer, setShimmer] = useState(false);
  const [progress, setProgress] = useState(autoPlay ? 0 : 100);

  // The run reads the latest props through a ref, so a parent re-render (new
  // array identities) never restarts the animation — only these deps do.
  const latest = useRef({ t, stepLabels, chips, items, retrievingLabel, retrievedLabel, warn, short, onComplete });
  useEffect(() => {
    latest.current = { t, stepLabels, chips, items, retrievingLabel, retrievedLabel, warn, short, onComplete };
  });

  useEffect(() => {
    const c = latest.current;
    let cancelled = false;
    const ok = () => !cancelled;
    const wait = async (ms: number) => {
      await sleep(ms / Math.max(speed, 0.1));
      return ok();
    };
    const setStep = (i: number, state: StepState, text: string) =>
      setSteps((prev) => prev.map((s, idx) => (idx === i ? { state, text } : s)));

    if (!autoPlay || prefersReducedMotion()) {
      setSteps([
        { state: 'done', text: c.short ? c.t.shortSelection : c.t.sent },
        { state: 'done', text: c.short ? c.t.shortUpdated : c.t.classified },
        { state: c.warn ? 'warn' : 'done', text: c.retrievedLabel },
        { state: 'done', text: c.t.ready },
      ]);
      setChipCount(c.chips.length);
      setItemCount(c.items.length);
      setShimmer(false);
      setProgress(100);
      if (autoPlay) c.onComplete?.(); // reduced motion: finished immediately
      return;
    }

    (async () => {
      setSteps(c.stepLabels.map((text) => ({ state: 'pending' as const, text })));
      setChipCount(0);
      setItemCount(0);
      setShimmer(false);
      setProgress(0);

      if (c.short) {
        setStep(0, 'done', c.t.shortSelection);
        setProgress(25);
        if (!(await wait(550))) return;
        setStep(1, 'active', c.t.shortUpdating);
        if (!(await wait(650))) return;
        for (let k = 1; k <= c.chips.length; k++) {
          setChipCount(k);
          if (!(await wait(110))) return;
        }
        setStep(1, 'done', c.t.shortUpdated);
        setProgress(50);
        if (!(await wait(400))) return;
      } else {
        setStep(0, 'active', c.t.sending);
        setProgress(10);
        if (!(await wait(1150))) return;
        setStep(0, 'done', c.t.sent);
        setProgress(25);
        if (!(await wait(300))) return;
        setStep(1, 'active', c.t.classifying);
        if (!(await wait(1300))) return;
        for (let k = 1; k <= c.chips.length; k++) {
          setChipCount(k);
          if (!(await wait(300))) return;
        }
        if (!(await wait(250))) return;
        setStep(1, 'done', c.t.classified);
        setProgress(55);
        if (!(await wait(450))) return;
      }

      setStep(2, 'active', c.retrievingLabel);
      setShimmer(true);
      if (!(await wait(1300))) return;
      setShimmer(false);
      for (let k = 1; k <= c.items.length; k++) {
        setItemCount(k);
        if (!(await wait(240))) return;
      }
      if (!(await wait(200))) return;
      setStep(2, c.warn ? 'warn' : 'done', c.retrievedLabel);
      setProgress(85);
      if (!(await wait(500))) return;
      setStep(3, 'active', c.t.building);
      setProgress(100);
      if (!(await wait(750))) return;
      setStep(3, 'done', c.t.ready);
      c.onComplete?.();
    })();

    return () => {
      cancelled = true;
    };
  }, [autoPlay, playKey, short, speed]);

  return (
    <div className={cx('max-w-3xl mx-auto px-6 pt-12 pb-16', className)}>
      <div className="lib-card bg-white rounded-2xl border border-gray-100 shadow-[0_10px_44px_rgba(26,20,70,.13)] overflow-hidden">
        <div className="px-8 pt-7 pb-6 border-b border-gray-100 flex items-center gap-4">
          <div className="lib-av w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white">
            {SPARK}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold tracking-[.14em] uppercase text-lmt">{eyebrow}</div>
            <div className="text-navy text-lg leading-snug">&ldquo;{question}&rdquo;</div>
          </div>
        </div>

        <ol className="px-8 py-7 space-y-6" aria-live="polite">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <div className="shrink-0">
                <StepIcon state={step.state} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div
                  className={cx(
                    'lib-t text-[15px]',
                    step.state === 'pending' && 'text-gray-400',
                    step.state === 'active' && 'text-navy font-medium',
                    (step.state === 'done' || step.state === 'warn') && 'text-navy',
                  )}
                >
                  <span key={step.text} className="lib-txt">
                    {step.text}
                  </span>
                  {step.state === 'active' && (
                    <span className="lib-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                </div>

                {i === 1 && chipCount > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {chips.slice(0, chipCount).map((chip) => (
                      <span
                        key={`${chip.label}-${chip.value}`}
                        className={cx(
                          'lib-pop inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5',
                          chip.warn ? 'bg-cream text-navy border border-creamb' : 'bg-mist text-lmtd',
                        )}
                      >
                        <span className="opacity-70">{chip.label}</span>
                        <span className="font-medium">{chip.value}</span>
                      </span>
                    ))}
                  </div>
                )}

                {i === 2 && (shimmer || itemCount > 0) && (
                  <div className="mt-3 space-y-2">
                    {shimmer && (
                      <div className="space-y-2" aria-hidden="true">
                        <div className="lib-shim h-3 rounded w-3/4" />
                        <div className="lib-shim h-3 rounded w-1/2" />
                        <div className="lib-shim h-3 rounded w-2/3" />
                      </div>
                    )}
                    {items.slice(0, itemCount).map((item, k) => (
                      <div key={`${item}-${k}`} className="lib-in flex items-center gap-2 text-sm text-gray-700">
                        <ItemIcon warn={warn && k === items.length - 1} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="h-1.5 bg-gray-100">
          <div className="lib-bar h-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
