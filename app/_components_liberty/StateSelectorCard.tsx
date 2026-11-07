import { useId } from 'react';
import Anchor from './Anchor';
import { LibertyIcon } from './Icons';
import { cx, LINK_CLASS, safeHref } from './utils';
import './liberty.css';

export type StateSelectorCardProps = {
  label?: string;
  /** Placeholder option in the dropdown. */
  placeholder?: string;
  buttonLabel?: string;
  popularLabel?: string;
  /** Quick-pick state buttons. */
  popularStates?: string[];
  /** The state shown in teal outline (the one the demo flow continues with). */
  highlightedState?: string;
  /** Full list for the dropdown (defaults to the popular states). */
  allStates?: string[];
  locationLabel?: string;
  locationHref?: string;
  /** Where the form submits (GET, `state` field). Defaults to the current page. */
  action?: string;
  /** Pulse the card twice to draw attention (like the mockup after it loads). */
  attention?: boolean;
  /** Spacing classes. Replaces the default `mt-10`. */
  className?: string;
};

const DEFAULT_STATES = [
  'Texas',
  'Ohio',
  'California',
  'Florida',
  'New York',
  'Pennsylvania',
  'Illinois',
  'Georgia',
  'Massachusetts',
  'North Carolina',
];

/**
 * C21 — asks the visitor for the one missing detail (their state). A real GET
 * form: the dropdown and each state button submit a `state` value, so it works
 * without client JavaScript.
 */
export default function StateSelectorCard({
  label = 'Where is your car registered?',
  placeholder = 'Select a state',
  buttonLabel = 'See requirements',
  popularLabel = 'Popular states',
  popularStates = DEFAULT_STATES,
  highlightedState = 'Texas',
  allStates,
  locationLabel = 'Use my location',
  locationHref,
  action,
  attention = false,
  className = 'mt-10',
}: StateSelectorCardProps) {
  const options = allStates ?? popularStates;
  const selectId = useId();
  return (
    <form
      method="get"
      action={action ? safeHref(action) : undefined}
      data-reveal="card"
      className={cx(
        'max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,.08)] border border-gray-100 p-8',
        attention && 'lib-attn',
        className,
      )}
    >
      <label htmlFor={selectId} className="font-medium text-navy">
        {label}
      </label>
      <div className="mt-3 flex gap-3">
        <div className="relative flex-1">
          <select
            id={selectId}
            name="state"
            defaultValue=""
            className="w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-3 pr-10 text-gray-500 focus:border-lmt outline-none"
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <LibertyIcon
            name="chevron-down"
            className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            strokeWidth={2}
          />
        </div>
        <button type="submit" className="bg-lmt hover:bg-lmtd text-white font-medium rounded-md px-6">
          {buttonLabel}
        </button>
      </div>
      <div className="mt-6 text-sm text-gray-500">{popularLabel}</div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {popularStates.map((state) => (
          <button
            key={state}
            type="submit"
            name="state"
            value={state}
            className={cx(
              'rounded-full px-4 py-2 border',
              state === highlightedState
                ? 'border-lmt text-lmt hover:bg-mist'
                : 'border-gray-300 hover:border-lmt',
            )}
          >
            {state}
          </button>
        ))}
      </div>
      <Anchor href={locationHref} className={cx(LINK_CLASS, 'text-sm mt-5 inline-flex items-center gap-1')}>
        {locationLabel}
      </Anchor>
    </form>
  );
}
