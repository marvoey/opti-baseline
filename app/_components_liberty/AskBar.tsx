import { LibertyIcon } from './Icons';
import { cx, safeHref } from './utils';

export type AskBarProps = {
  /** The question shown in the box. */
  question?: string;
  /** Label on the submit button. */
  buttonLabel?: string;
  /** Accessible name for the text box (screen readers). */
  inputLabel?: string;
  /** Placeholder shown when the box is emptied. */
  placeholder?: string;
  /** Where the form submits (GET). Defaults to the current page. */
  action?: string;
  /** Query-string field name for the question. */
  name?: string;
  className?: string;
};

/**
 * C01 — the grey strip at the top of every answer page. Pre-filled with the
 * question being answered; a plain GET form, so Enter and the button both work
 * without client JavaScript.
 */
export default function AskBar({
  question = 'Does my car insurance cover a rental car?',
  buttonLabel = 'Ask',
  inputLabel = 'Ask a question',
  placeholder,
  action,
  name = 'q',
  className,
}: AskBarProps) {
  return (
    <div className={cx('bg-[#F5F7F8] border-b border-gray-200', className)}>
      <form
        role="search"
        method="get"
        action={action ? safeHref(action) : undefined}
        className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3"
      >
        <div className="flex-1 flex items-center bg-white border border-gray-300 focus-within:border-lmt rounded-full pl-5 pr-1.5 py-1.5">
          <LibertyIcon name="search" className="w-4 h-4 text-lmt shrink-0" strokeWidth={2} />
          <input
            name={name}
            type="text"
            defaultValue={question}
            placeholder={placeholder}
            aria-label={inputLabel}
            className="flex-1 min-w-0 px-3 py-1.5 text-[15px] outline-none bg-transparent text-navy"
          />
          <button
            type="submit"
            className="bg-lmt hover:bg-lmtd text-white text-sm font-medium rounded-full px-6 py-2"
          >
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
