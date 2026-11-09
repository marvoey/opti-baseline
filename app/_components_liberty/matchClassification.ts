import type { MarkResult } from '@/lib/askMark/parsePayload';
import type { ProgressChip } from './AiProgressPanel';
import { routeQuestion, type AskQuestion } from './askRouting';

/** Below this, Mark's answer is treated as "not sure" and the fallback page is used. */
export const MIN_CONFIDENCE = 0.6;

const norm = (s: string | undefined | null): string => s?.trim().toLowerCase() ?? '';

/** The value of a question's chip with this label (lower-case), or ''. */
function chip(q: AskQuestion, label: string): string {
  return norm(q.chips?.find((c) => norm(c.label) === norm(label))?.value);
}

/** A question whose State chip names a real state (not "Needed" / "Not needed"). */
function isStateSpecific(q: AskQuestion): boolean {
  return !['', 'needed', 'not needed'].includes(chip(q, 'State'));
}

/** Out of scope, or too unsure: send the visitor to the fallback page. */
export function shouldUseFallback(p: MarkResult): boolean {
  return norm(p.intent) === 'out of scope' || (p.confidence ?? 0) < MIN_CONFIDENCE;
}

/**
 * Match Mark's classification to one of the CMS questions, deterministically.
 * Order: same topic and state; same topic and product; same topic; same intent
 * among questions with no topic (claims, legal). Comparison is exact and
 * case-insensitive. The fallback question never matches by rule. Returns
 * undefined when nothing matches.
 */
export function matchClassification(p: MarkResult, questions: AskQuestion[]): AskQuestion | undefined {
  const topic = norm(p.topic);
  const product = norm(p.product);
  const intent = norm(p.intent);
  const state = norm(p.state);

  const eligible = questions.filter((q) => !q.isFallback);

  if (state && topic) {
    const byState = eligible.find((q) => chip(q, 'Topic') === topic && chip(q, 'State') === state);
    if (byState) return byState;
  }

  // State-specific questions match only when Mark named that state (handled above).
  const generic = eligible.filter((q) => !isStateSpecific(q));
  if (topic && product) {
    const m = generic.find((q) => chip(q, 'Topic') === topic && chip(q, 'Product') === product);
    if (m) return m;
  }
  if (topic) {
    const m = generic.find((q) => chip(q, 'Topic') === topic);
    if (m) return m;
  }
  if (intent) {
    return generic.find((q) => chip(q, 'Intent') === intent && !chip(q, 'Topic'));
  }
  return undefined;
}

export type Resolution = { question: AskQuestion | undefined; via: 'mark' | 'fallback' | 'keywords' };

/**
 * Where a question goes once Mark has answered: the matched question, or the
 * fallback chain (keyword match, the fallback question, the first question).
 */
export function resolveMarkQuestion(p: MarkResult, typed: string, questions: AskQuestion[]): Resolution {
  if (shouldUseFallback(p)) {
    const fallback = questions.find((q) => q.isFallback);
    return fallback
      ? { question: fallback, via: 'fallback' }
      : { question: routeQuestion(typed, questions), via: 'keywords' };
  }
  const matched = matchClassification(p, questions);
  return matched
    ? { question: matched, via: 'mark' }
    : { question: routeQuestion(typed, questions), via: 'keywords' };
}

/**
 * The chips for the progress card from Mark's reply, plus any warning chip the
 * matched question carries that Mark did not supply (for example `State | Needed`).
 */
export function chipsFromResult(p: MarkResult, matched?: AskQuestion): ProgressChip[] {
  const chips: ProgressChip[] = [];
  const add = (label: string, value: string | undefined) => {
    if (value) chips.push({ label, value });
  };
  add('Intent', p.intent);
  add('Product', p.product);
  add('Topic', p.topic);
  add('Coverage', p.coverage);
  add('State', p.state);
  for (const c of matched?.chips ?? []) {
    if (c.warn && !chips.some((x) => norm(x.label) === norm(c.label))) chips.push(c);
  }
  return chips;
}
