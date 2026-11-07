import { cx } from './utils';

export type LookupFormFieldsProps = {
  claimNumberLabel?: string;
  lastNameLabel?: string;
  zipLabel?: string;
  /** Spacing classes. Replaces the default `mt-5`. */
  className?: string;
};

const FIELD =
  'w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-white placeholder:text-gray-400 outline-none focus:border-lmt';

/**
 * C25 — claim look-up fields: claim number, last name, ZIP. The label text is
 * shown as the placeholder (like the mockup) and also used as the accessible
 * name. The fields are inputs only; put them inside your own <form>.
 */
export default function LookupFormFields({
  claimNumberLabel = 'Claim number',
  lastNameLabel = 'Last name',
  zipLabel = 'ZIP code',
  className = 'mt-5',
}: LookupFormFieldsProps) {
  return (
    <div className={cx('space-y-3 text-sm', className)}>
      <input
        type="text"
        name="claimNumber"
        autoComplete="off"
        aria-label={claimNumberLabel}
        placeholder={claimNumberLabel}
        className={FIELD}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="lastName"
          autoComplete="family-name"
          aria-label={lastNameLabel}
          placeholder={lastNameLabel}
          className={FIELD}
        />
        <input
          type="text"
          name="zip"
          inputMode="numeric"
          autoComplete="postal-code"
          aria-label={zipLabel}
          placeholder={zipLabel}
          className={FIELD}
        />
      </div>
    </div>
  );
}
