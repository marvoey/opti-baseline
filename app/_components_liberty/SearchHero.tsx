import type { FormEvent, ReactNode } from 'react';

/** `data-*` attributes, e.g. the on-page-editing markers. */
type DataAttrs = Record<string, string | undefined>;
import { LibertyIcon } from './Icons';
import { cx, safeHref } from './utils';

export type SearchHeroProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** Accessible name for the search box. */
  inputLabel?: string;
  /** Where the form submits (GET). Defaults to the current page. */
  action?: string;
  /** Query-string field name for the question. */
  name?: string;
  /**
   * Handle the submit in the browser instead of a GET form post. Receives the
   * typed question (may be empty). Only pass this from a client component.
   */
  onSubmit?: (question: string) => void;
  /** Extra attributes for the heading and subtitle, e.g. on-page-editing markers. */
  editAttrs?: { title?: DataAttrs; subtitle?: DataAttrs };
  /** Content shown under the search box, e.g. <SuggestedChips />. */
  children?: ReactNode;
  /** Vertical padding classes. Replaces the default `pt-14 pb-8`. */
  className?: string;
};

/** C06 — the home page hero: headline, subtitle and a big pill search box. */
export default function SearchHero({
  title = 'Get clear answers about your insurance',
  subtitle = "Ask in your own words. We'll answer with information from Liberty Mutual and help you take the next step.",
  placeholder = 'Ask a question about car, home or renters insurance',
  buttonLabel = 'Ask',
  inputLabel = 'Ask a question',
  action,
  name = 'q',
  onSubmit,
  editAttrs,
  children,
  className = 'pt-14 pb-8',
}: SearchHeroProps) {
  return (
    <div className={cx('max-w-5xl mx-auto px-6 text-center', className)}>
      <h1 {...editAttrs?.title} className="text-[42px] leading-tight font-light text-navy">{title}</h1>
      <p {...editAttrs?.subtitle} className="mt-3 text-[17px] text-gray-600">{subtitle}</p>
      <form
        role="search"
        method="get"
        action={action ? safeHref(action) : undefined}
        onSubmit={
          onSubmit
            ? (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                onSubmit(String(new FormData(e.currentTarget).get(name) ?? '').trim());
              }
            : undefined
        }
        className="mt-8 max-w-3xl mx-auto flex items-center bg-white border-2 border-navy/15 focus-within:border-lmt rounded-full shadow-lg pl-6 pr-2 py-2"
      >
        <LibertyIcon name="search" className="w-5 h-5 text-lmt shrink-0" strokeWidth={2} />
        <input
          name={name}
          type="text"
          aria-label={inputLabel}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-4 py-3 text-[17px] outline-none bg-transparent"
        />
        <button
          type="submit"
          className="bg-lmt hover:bg-lmtd text-white font-medium rounded-full px-8 py-3"
        >
          {buttonLabel}
        </button>
      </form>
      {children}
    </div>
  );
}
