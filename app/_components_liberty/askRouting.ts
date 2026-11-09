import type { ProgressChip } from './AiProgressPanel';

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
  /** Route to this question but do not show it as a suggested-question chip. */
  hideChip?: boolean;
  /** Where unmatched or unsafe questions land. */
  isFallback?: boolean;
};

/**
 * Pick the question a typed sentence belongs to, in this order: an exact match
 * on a question, the first entry (in editor order) whose keyword appears in the
 * text, the entry marked as the fallback, and finally the first entry. Keywords
 * are compared as plain lower-case text, never as a pattern, so editor input
 * cannot become a regular expression. An empty box uses the first entry.
 */
export function routeQuestion(text: string, questions: AskQuestion[]): AskQuestion | undefined {
  const t = text.trim().toLowerCase();
  if (!t) return questions[0];
  const exact = questions.find((q) => q.question.trim().toLowerCase() === t);
  if (exact) return exact;
  return (
    questions.find((q) => (q.keywords ?? []).some((k) => k.trim() && t.includes(k.trim().toLowerCase()))) ??
    questions.find((q) => q.isFallback) ??
    questions[0]
  );
}
